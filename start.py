#!/usr/bin/env python3
"""
start.py - Orchestrated startup for local development

What it does:
 - Checks for required services (Ollama on :11434)
 - Kills any processes occupying required ports (backend/frontend)
 - Starts the backend FastAPI server (backend/server.py)
 - Waits for backend health (GET /api/catalog)
 - Starts the frontend dev server (npm run dev)
 - Monitors processes and ensures clean shutdown on Ctrl-C

Usage:
  python start.py

Environment variables (optional):
  OLLAMA_CMD  - command to start Ollama if you want this script to attempt launching it (e.g., "ollama serve")
  FRONTEND_PORT - Vite dev server port (default 5173)
  BACKEND_PORT  - FastAPI port (default 8000)

Note: This script is designed for developer convenience on Windows (PowerShell). It uses
netstat/taskkill when needed to find and kill processes on ports. Use with care.
"""

import os
import sys
import time
import signal
import socket
import subprocess
import urllib.request
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent
LOGDIR = ROOT / "logs"
LOGDIR.mkdir(exist_ok=True)

# Load project .env file (if present) so start.py sees the same MODEL_NAME and
# related settings developers place in `.env.local` or `.env` without requiring
# them to export variables in the shell. We only set variables that are not
# already present in the process environment (so explicit env vars override files).
def _load_dotenv_if_present():
    for fname in (".env.local", ".env"):
        p = ROOT / fname
        if not p.exists():
            continue
        try:
            with p.open("r", encoding="utf-8") as fh:
                for raw in fh:
                    line = raw.strip()
                    if not line or line.startswith("#"):
                        continue
                    if "=" not in line:
                        continue
                    key, val = line.split("=", 1)
                    key = key.strip()
                    val = val.strip()
                    # remove optional surrounding quotes
                    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
                        val = val[1:-1]
                    # ignore export prefix if present (e.g., 'export FOO=bar')
                    if key.lower().startswith("export "):
                        key = key.split(None, 1)[1]
                    if key and key not in os.environ:
                        os.environ[key] = val
        except Exception:
            # best-effort loader; do not fail startup if parsing fails
            pass

# Load .env before reading environment variables below
_load_dotenv_if_present()

# Ensure this script runs under the project's .venv Python interpreter when available.
# If the current interpreter is not the .venv one, re-exec the script using .venv's python.
if os.environ.get("STARTED_IN_VENV") != "1":
    venv_py = None
    if os.name == 'nt':
        candidate = ROOT / '.venv' / 'Scripts' / 'python.exe'
    else:
        candidate = ROOT / '.venv' / 'bin' / 'python'
    try:
        if candidate.exists():
            venv_py = str(candidate.resolve())
    except Exception:
        venv_py = None

    if venv_py:
        current = ''
        try:
            current = str(Path(sys.executable).resolve())
        except Exception:
            current = sys.executable or ''
        if os.path.normcase(current) != os.path.normcase(venv_py):
            print(f"Re-launching start.py with project .venv Python: {venv_py}")
            # Mark that we've re-launched to avoid loops
            os.environ["STARTED_IN_VENV"] = "1"
            os.execv(venv_py, [venv_py] + sys.argv)
    else:
        # No .venv found; continue with current interpreter but warn
        print("Warning: .venv not found at expected location; continuing with current Python interpreter.")

# Configurable ports
OLLAMA_HOST = os.environ.get("OLLAMA_HOST", "localhost")
OLLAMA_PORT = int(os.environ.get("OLLAMA_PORT", "11434"))
MODEL_NAME = os.environ.get("MODEL_NAME", "qwen2.5vl")
BACKEND_PORT = int(os.environ.get("BACKEND_PORT", "8000"))
# Default frontend port changed to 3000 as requested
FRONTEND_PORT = int(os.environ.get("FRONTEND_PORT", "3000"))

backend_proc = None
frontend_proc = None
ollama_proc = None
backend_log_file = None
frontend_log_file = None
ollama_log_file = None

# Simple ANSI color codes (works in modern Windows PowerShell and terminals)
COL_RESET = "\033[0m"
COL_BACKEND = "\033[38;5;75m"   # blue-ish
COL_FRONTEND = "\033[38;5;142m" # green-ish
COL_OLLAMA = "\033[38;5;214m"   # orange-ish
COL_MAIN = "\033[1;37m"         # bright white

import threading
from datetime import datetime
import json


def _timestamp():
    return datetime.now().strftime("%H:%M:%S")


def _stream_reader(prefix: str, color: str, stream, log_file):
    """Read lines from stream, write to logfile and print to stdout with color and prefix."""
    try:
        for raw in iter(stream.readline, b""):
            if not raw:
                break
            try:
                line = raw.decode('utf-8', errors='replace').rstrip('\n')
            except Exception:
                line = str(raw)
            timestamp = _timestamp()
            out = f"[{timestamp}] {prefix} | {line}"
            # write to log file
            try:
                log_file.write(out + "\n")
                log_file.flush()
            except Exception:
                pass
            # print with color
            try:
                print(f"{color}{out}{COL_RESET}")
            except Exception:
                print(out)
    finally:
        try:
            stream.close()
        except Exception:
            pass


def start_process(name: str, cmd, cwd: str, shell: bool = False):
    """Start subprocess with stdout/stderr piped and spawn reader threads to unify logs.
    Returns the Popen instance and the log file handle."""
    log_path = LOGDIR / f"{name}.log"
    log_file = open(log_path, "a", buffering=1, encoding='utf-8')
    creationflags = getattr(subprocess, 'CREATE_NEW_PROCESS_GROUP', 0) if os.name == 'nt' else 0
    proc = subprocess.Popen(cmd, cwd=str(cwd), stdout=subprocess.PIPE, stderr=subprocess.PIPE, shell=shell, creationflags=creationflags)

    # choose color by name
    col = COL_MAIN
    if name.lower().startswith('back'):
        col = COL_BACKEND
    elif name.lower().startswith('front'):
        col = COL_FRONTEND
    elif name.lower().startswith('oll'):
        col = COL_OLLAMA

    t_out = threading.Thread(target=_stream_reader, args=(name.upper(), col, proc.stdout, log_file), daemon=True)
    t_err = threading.Thread(target=_stream_reader, args=(name.upper()+":ERR", col, proc.stderr, log_file), daemon=True)
    t_out.start()
    t_err.start()
    return proc, log_file


def is_port_open(host: str, port: int, timeout: float = 1.0) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except Exception:
        return False


def http_get_ok(url: str, timeout: float = 1.0) -> bool:
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "hvac-start-script/1.0"})
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return 200 <= r.getcode() < 300
    except Exception:
        return False


def find_pids_by_port(port: int):
    """Return list of PIDs listening on the given port (best-effort)."""
    pids = set()
    # Try cross-platform netstat parsing
    try:
        if os.name == 'nt':
            # Windows
            output = subprocess.check_output(["netstat", "-ano"], text=True, stderr=subprocess.DEVNULL)
            for line in output.splitlines():
                parts = line.split()
                if len(parts) >= 5 and parts[0].lower().startswith(('tcp', 'udp')):
                    local = parts[1]
                    if local.endswith(f":{port}"):
                        pid = parts[-1]
                        if pid.isdigit():
                            pids.add(int(pid))
        else:
            output = subprocess.check_output(["ss", "-ltnp"], text=True, stderr=subprocess.DEVNULL)
            for line in output.splitlines():
                if f":{port} " in line or f":{port}\n" in line:
                    # attempt to parse pid from info portion
                    if 'pid=' in line:
                        try:
                            pid_part = line.split('pid=')[1].split(',')[0]
                            pids.add(int(pid_part))
                        except Exception:
                            pass
    except Exception:
        pass
    # Filter out non-positive or system PIDs like 0 which can't/shouldn't be killed
    cleaned = [pid for pid in pids if isinstance(pid, int) and pid > 0]
    return list(cleaned)


def kill_pid(pid: int):
    try:
        if os.name == 'nt':
            subprocess.check_call(["taskkill", "/PID", str(pid), "/F"])
        else:
            os.kill(pid, signal.SIGTERM)
    except Exception:
        try:
            if os.name == 'nt':
                subprocess.check_call(["taskkill", "/PID", str(pid), "/F"])
            else:
                os.kill(pid, signal.SIGKILL)
        except Exception:
            print(f"Failed to kill PID {pid}")


def ensure_port_free(port: int):
    pids = find_pids_by_port(port)
    if not pids:
        return
    print(f"Port {port} in use by PIDs: {pids}. Killing...")
    for pid in pids:
        kill_pid(pid)
    # brief pause
    time.sleep(0.5)


def start_backend():
    global backend_proc
    global backend_log_file
    print("Starting backend (FastAPI)...")
    # Prefer running uvicorn via the active Python interpreter for hot-reload
    python = sys.executable or "python"
    # Check whether uvicorn is importable in this interpreter
    try:
        check = subprocess.run([python, "-c", "import uvicorn"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        if check.returncode == 0:
            cmd = [python, "-m", "uvicorn", "backend.server:app", "--reload", "--port", str(BACKEND_PORT)]
        else:
            # Fall back to running the server module directly
            cmd = [python, str(ROOT / "backend" / "server.py")]
    except Exception:
        cmd = [python, str(ROOT / "backend" / "server.py")]
    # Start with unified logging (cmd may be list)
    backend_proc, backend_log_file = start_process("backend", cmd, ROOT, shell=isinstance(cmd, str))
    return backend_proc


def start_ollama(ollama_cmd: str):
    """Start Ollama as an optional subprocess and track it for shutdown."""
    global ollama_proc
    global ollama_log_file
    if not ollama_cmd:
        return None
    print(f"Starting Ollama subprocess: {ollama_cmd}")
    # Use start_process for unified logging; run via shell
    try:
        ollama_proc, ollama_log_file = start_process("ollama", ollama_cmd, ROOT, shell=True)
        return ollama_proc
    except Exception as e:
        print("Failed to start Ollama subprocess:", e)
        return None


def start_frontend():
    global frontend_proc
    global frontend_log_file
    print("Starting frontend (Vite)...")
    # Use npm run dev; pass desired port through to the dev server
    npm = shutil.which("npm") or "npm"
    frontend_dir = ROOT / "frontend"
    if os.name == 'nt':
        cmd = f"{npm} run dev -- --port {FRONTEND_PORT}"
        frontend_proc, frontend_log_file = start_process("frontend", cmd, frontend_dir, shell=True)
    else:
        cmd = [npm, "run", "dev", "--", "--port", str(FRONTEND_PORT)]
        frontend_proc, frontend_log_file = start_process("frontend", cmd, frontend_dir, shell=False)
    return frontend_proc


def shutdown_all():
    global backend_proc, frontend_proc, ollama_proc
    global backend_log_file, frontend_log_file, ollama_log_file
    print("Shutting down children...")

    def terminate_process(p, name, timeout=8):
        if not p:
            return
        try:
            if p.poll() is not None:
                print(f"{name} already exited (code={p.returncode})")
                return
            # On Windows, if process was created with CREATE_NEW_PROCESS_GROUP, send CTRL_BREAK_EVENT
            if os.name == 'nt':
                try:
                    # CTRL_BREAK_EVENT can be sent only to process groups; use send_signal if available
                    p.send_signal(signal.CTRL_BREAK_EVENT)
                    print(f"Sent CTRL_BREAK_EVENT to {name}")
                except Exception:
                    try:
                        p.terminate()
                        print(f"Terminated {name}")
                    except Exception:
                        pass
            else:
                try:
                    p.terminate()
                    print(f"Terminated {name}")
                except Exception:
                    pass

            # wait briefly for graceful shutdown
            try:
                p.wait(timeout=timeout)
                print(f"{name} exited (code={p.returncode})")
                return
            except Exception:
                print(f"{name} did not exit within {timeout}s, killing...")
            try:
                p.kill()
                p.wait(timeout=3)
                print(f"{name} killed")
            except Exception:
                print(f"Failed to kill {name}")
        except Exception as e:
            print(f"Error shutting down {name}: {e}")

    # Shutdown order: frontend -> backend -> ollama
    terminate_process(frontend_proc, 'frontend')
    terminate_process(backend_proc, 'backend')
    terminate_process(ollama_proc, 'ollama')

    # Close any log files we opened
    for lf in (frontend_log_file, backend_log_file, ollama_log_file):
        try:
            if lf:
                lf.close()
        except Exception:
            pass


def main():
    print("HVAC - start orchestration script")

    # 1) Check Ollama (only if configured as the AI provider or explicit command set)
    ai_provider = os.environ.get("AI_PROVIDER", "ollama").lower()
    ollama_url = f"http://{OLLAMA_HOST}:{OLLAMA_PORT}/v1/models"
    if ai_provider == "ollama" or os.environ.get("OLLAMA_CMD"):
        if is_port_open(OLLAMA_HOST, OLLAMA_PORT) and http_get_ok(ollama_url, timeout=1.0):
            print(f"Found Ollama at {OLLAMA_HOST}:{OLLAMA_PORT}")
            # Check whether the requested model is listed/loaded by Ollama
            def ollama_list_models():
                try:
                    req = urllib.request.Request(ollama_url, headers={"User-Agent": "hvac-start-script/1.0"})
                    with urllib.request.urlopen(req, timeout=2.0) as r:
                        data = r.read()
                        try:
                            parsed = json.loads(data)
                            # return a list or dict stringified
                            return parsed
                        except Exception:
                            return None
                except Exception:
                    return None

            models = ollama_list_models()
            model_ready = False
            if models is not None:
                try:
                    s = json.dumps(models)
                    if MODEL_NAME in s:
                        model_ready = True
                except Exception:
                    pass
            if model_ready:
                print(f"Ollama reports model '{MODEL_NAME}' as present.")
            else:
                print(f"Model '{MODEL_NAME}' not found in Ollama model list. It may still be loading.")
                # Wait up to 60s for the model to appear
                start = time.time()
                while time.time() - start < 60:
                    models = ollama_list_models()
                    if models is not None:
                        try:
                            if MODEL_NAME in json.dumps(models):
                                model_ready = True
                                print(f"Model '{MODEL_NAME}' is now present in Ollama.")
                                break
                        except Exception:
                            pass
                    time.sleep(1)
                if not model_ready:
                    print(f"Timed out waiting for model '{MODEL_NAME}' to appear. You can start it manually or configure Ollama to auto-load the model.")
        else:
            print(f"Warning: Ollama not reachable at {OLLAMA_HOST}:{OLLAMA_PORT}. Please ensure Ollama is running.")
            print("If you want this script to attempt starting Ollama, set OLLAMA_CMD environment variable.")
            # Try environment variable first
            ollama_cmd = os.environ.get("OLLAMA_CMD")
            # If no explicit command, try to find 'ollama' in PATH and use 'ollama serve'
            if not ollama_cmd:
                ollama_bin = shutil.which("ollama")
                if ollama_bin:
                    ollama_cmd = f"{ollama_bin} serve"
            if ollama_cmd:
                print(f"Attempting to start Ollama with: {ollama_cmd}")
                try:
                    start_ollama(ollama_cmd)
                    # wait for Ollama to be reachable (give it some time)
                    start = time.time()
                    while time.time() - start < 60:
                        if is_port_open(OLLAMA_HOST, OLLAMA_PORT) and http_get_ok(ollama_url, timeout=1.0):
                            print("Ollama is up")
                            break
                        time.sleep(1)
                    else:
                        print("Timeout waiting for Ollama to become ready.")
                except Exception as e:
                    print("Failed to start Ollama:", e)
    else:
        # Skip Ollama orchestration when using another provider (e.g., Gemini)
        print(f"[INFO] AI_PROVIDER set to '{ai_provider}'; skipping Ollama startup.")

    # 2) Free ports we control
    ensure_port_free(BACKEND_PORT)
    ensure_port_free(FRONTEND_PORT)

    # 3) Start backend and wait for health
    start_backend()
    backend_health = f"http://localhost:{BACKEND_PORT}/api/catalog"
    print("Waiting for backend to be healthy... (timeout 60s)")
    start = time.time()
    while time.time() - start < 60:
        if is_port_open('localhost', BACKEND_PORT) and http_get_ok(backend_health, timeout=1.0):
            print("Backend healthy")
            break
        if backend_proc and backend_proc.poll() is not None:
            print("Backend process exited unexpectedly. Check logs in logs/backend.log")
            shutdown_all()
            sys.exit(2)
        time.sleep(1)
    else:
        print("Backend failed to start within timeout. Check logs.")
        shutdown_all()
        sys.exit(3)

    # 4) Start frontend and wait for dev server
    start_frontend()
    frontend_url = f"http://localhost:{FRONTEND_PORT}/"
    print("Waiting for frontend dev server... (timeout 60s)")
    start = time.time()
    while time.time() - start < 60:
        if is_port_open('localhost', FRONTEND_PORT) and http_get_ok(frontend_url, timeout=1.0):
            print("Frontend dev server ready")
            try:
                # Print a colored, clickable URL for convenience
                print(f"{COL_FRONTEND}Frontend URL: {frontend_url}{COL_RESET}")
            except Exception:
                print(f"Frontend URL: {frontend_url}")
            break
        if frontend_proc and frontend_proc.poll() is not None:
            print("Frontend process exited unexpectedly. Check logs in logs/frontend.log")
            shutdown_all()
            sys.exit(4)
        time.sleep(1)
    else:
        print("Frontend failed to start within timeout. Check logs.")
        shutdown_all()
        sys.exit(5)

    print("All services started successfully.")
    try:
        print(f"{COL_MAIN}All services started successfully. Press Ctrl-C to stop everything.{COL_RESET}")
        print(f"{COL_FRONTEND}Open the frontend in your browser: http://localhost:{FRONTEND_PORT}/{COL_RESET}")
    except Exception:
        print("Press Ctrl-C to stop everything.")

    def handle_sigint(signum, frame):
        print("Received termination signal, shutting down...")
        shutdown_all()
        # exit after clean shutdown
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)

    signal.signal(signal.SIGINT, handle_sigint)
    signal.signal(signal.SIGTERM, handle_sigint)

    # Keep running and echo status
    try:
        while True:
            time.sleep(5)
            # check processes
            if backend_proc and backend_proc.poll() is not None:
                print("Backend exited. Shutting down everything.")
                shutdown_all(); sys.exit(6)
            if frontend_proc and frontend_proc.poll() is not None:
                print("Frontend exited. Shutting down everything.")
                shutdown_all(); sys.exit(7)
    except KeyboardInterrupt:
        handle_sigint(None, None)


# Validate AI provider configuration
ai_provider = os.getenv("AI_PROVIDER", "ollama").lower()
if ai_provider == "gemini":
    gemini_api_key = os.getenv("GEMINI_API_KEY")
    gemini_model = os.getenv("GEMINI_MODEL")

    if not gemini_api_key or not gemini_model:
        print("[ERROR] Missing GEMINI_API_KEY or GEMINI_MODEL in environment variables.")
        sys.exit(1)

    print(f"[INFO] Using Gemini AI provider with model: {gemini_model}")
    # Placeholder: Add any Gemini-specific startup logic here if needed

elif ai_provider == "ollama":
    print("[INFO] Using Ollama AI provider.")
else:
    print(f"[ERROR] Unsupported AI_PROVIDER: {ai_provider}")
    sys.exit(1)

if __name__ == '__main__':
    main()
