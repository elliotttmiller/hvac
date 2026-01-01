#!/usr/bin/env python3
"""
start.py - Platform startup & diagnostic script

Usage:
  python start.py [--dev] [--skip-build]

This script performs a set of sanity checks and diagnostic commands for the
HVAC platform repository. It collects detailed debug logs (stdout/stderr) for
each step and writes a timestamped log file to ./logs/start.log. The script is
intended to help pinpoint issues during development, CI, or local startup.

Features:
- Environment validation (Python, Node, npm)
- Reads .env and .env.example and validates required VITE_* keys
- Runs TypeScript typecheck (npx tsc --noEmit)
- Runs the production build (npm run build) unless skipped
- Optionally starts the dev server (npm run dev) and streams logs (use --dev)
- Captures command outputs and writes structured logs and a final summary

This file aims to be zero-dependency and run on Windows/macOS/Linux with Python 3.8+.
"""
from __future__ import annotations

import argparse
import json
import logging
import os
import shlex
import shutil
import subprocess
import sys
from datetime import datetime
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Dict, List, Optional, Tuple


ROOT = Path(__file__).resolve().parent
LOG_DIR = ROOT / "logs"
LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "start.log"


def setup_logger() -> logging.Logger:
    logger = logging.getLogger("hvac.start")
    logger.setLevel(logging.DEBUG)
    # Console handler (INFO level)
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.INFO)
    ch.setFormatter(logging.Formatter("[%(levelname)s] %(message)s"))
    # Rotating file handler (DEBUG level)
    fh = RotatingFileHandler(LOG_FILE, maxBytes=5_000_000, backupCount=3, encoding="utf-8")
    fh.setLevel(logging.DEBUG)
    fh.setFormatter(logging.Formatter("%(asctime)s %(levelname)-8s %(name)s %(message)s"))
    # Avoid duplicate handlers
    if not logger.handlers:
        logger.addHandler(ch)
        logger.addHandler(fh)
    return logger


logger = setup_logger()


def read_env_file(path: Path) -> Dict[str, str]:
    env: Dict[str, str] = {}
    if not path.exists():
        return env
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" not in line:
                continue
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def run_cmd(cmd: List[str], cwd: Optional[Path] = None, timeout: Optional[int] = 600) -> Tuple[int, str, str]:
    """Run a command and capture output. Returns (returncode, stdout, stderr)."""
    logger.debug("Running command: %s (cwd=%s)", shlex.join(cmd), cwd or ROOT)
    try:
        proc = subprocess.run(cmd, cwd=str(cwd or ROOT), capture_output=True, text=True, timeout=timeout, shell=False)
        stdout = proc.stdout or ""
        stderr = proc.stderr or ""
        logger.debug("Command stdout:\n%s", stdout.strip()[:10000])
        if stderr:
            logger.debug("Command stderr:\n%s", stderr.strip()[:10000])
        return proc.returncode, stdout, stderr
    except subprocess.TimeoutExpired as e:
        logger.exception("Command timed out: %s", shlex.join(cmd))
        return 124, e.stdout or "", e.stderr or "(timeout)"
    except Exception as e:
        logger.exception("Failed to run command: %s", shlex.join(cmd))
        return 1, "", str(e)


def which_or_none(name: str) -> Optional[str]:
    p = shutil.which(name)
    logger.debug("which %s -> %s", name, p)
    return p


def check_environment() -> Dict[str, str]:
    logger.info("Collecting environment information...")
    info: Dict[str, str] = {}
    info["python_executable"] = sys.executable
    info["python_version"] = sys.version.replace('\n', ' ')
    info["node_path"] = which_or_none("node") or "(not found)"
    info["node_version"] = ""
    if info["node_path"] != "(not found)":
        rc, out, _ = run_cmd([info["node_path"], "--version"])  # node --version
        info["node_version"] = out.strip() if rc == 0 else "(error)"
    info["npm_path"] = which_or_none("npm") or "(not found)"
    info["npx_path"] = which_or_none("npx") or "(not found)"
    if info["npm_path"] != "(not found)":
        rc, out, _ = run_cmd([info["npm_path"], "--version"])  # npm --version
        info["npm_version"] = out.strip() if rc == 0 else "(error)"
    else:
        info["npm_version"] = "(not found)"

    # Log to file
    logger.debug("Environment info: %s", json.dumps(info, indent=2))
    return info


def check_repo_files() -> List[str]:
    logger.info("Checking critical repository files...")
    missing: List[str] = []
    required = ["package.json", "vite.config.ts", "tsconfig.json", "index.html", "index.tsx"]
    for name in required:
        p = ROOT / name
        if not p.exists():
            missing.append(name)
            logger.warning("Missing file: %s", name)
        else:
            logger.debug("Found file: %s", name)
    return missing


def validate_env_keys(example: Path, actual_files: List[Path]) -> Tuple[List[str], List[str]]:
    """Return (missing_keys, unexpected_keys) compared to example file.

    actual_files: list of candidate env files to read (e.g., .env, .env.local)
    The function merges keys from all provided actual_files and compares to example.
    """
    logger.info("Validating environment variables against example: %s -> %s", example, ", ".join(str(p) for p in actual_files))
    example_env = read_env_file(example) if example.exists() else {}
    actual_env: Dict[str, str] = {}
    for p in actual_files:
        if p.exists():
            logger.debug("Reading env file: %s", p)
            actual_env.update(read_env_file(p))

    missing = [k for k in example_env.keys() if k not in actual_env]
    unexpected = [k for k in actual_env.keys() if k not in example_env]

    if missing:
        logger.warning("Missing %d env keys: %s", len(missing), missing)
    else:
        logger.info("No missing env keys found relative to example.")

    if unexpected:
        logger.info("Found %d unexpected env keys: %s", len(unexpected), unexpected)

    return missing, unexpected


def run_typescript_check() -> bool:
    logger.info("Running TypeScript typecheck (npx tsc --noEmit)...")
    npx = which_or_none("npx") or "npx"
    rc, out, err = run_cmd([npx, "tsc", "--noEmit"], timeout=180)
    if rc == 0:
        logger.info("TypeScript check passed.")
        return True
    else:
        logger.error("TypeScript check FAILED (rc=%d). See logs for details.", rc)
        logger.debug("tsc stdout:\n%s", out)
        logger.debug("tsc stderr:\n%s", err)
        return False


def run_build(should_run_build: bool = False) -> bool:
    if not should_run_build:
        logger.info("Skipping production build (not requested).")
        return True

    logger.info("Running production build: npm run build")
    npm = which_or_none("npm") or "npm"
    rc, out, err = run_cmd([npm, "run", "build"], timeout=600)
    if rc == 0:
        logger.info("Build succeeded.")
        logger.debug("build stdout:\n%s", out)
        return True
    else:
        logger.error("Build failed (rc=%d). Check logs for details.", rc)
        logger.debug("build stdout:\n%s", out)
        logger.debug("build stderr:\n%s", err)
        return False


def start_dev_server() -> int:
    """Start the dev server and stream logs. Returns the process return code when it exits.

    Note: this call blocks until the dev server exits (Ctrl+C to stop).
    """
    logger.info("Starting development server: npm run dev")
    npm = which_or_none("npm") or "npm"
    # Start as a subprocess and stream output
    cmd = [npm, "run", "dev"]
    logger.debug("Spawning: %s", shlex.join(cmd))
    with subprocess.Popen(cmd, cwd=str(ROOT), stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1, shell=False) as proc:
        try:
            assert proc.stdout
            for line in proc.stdout:
                # Mirror to console and file
                logger.info(line.rstrip())
        except KeyboardInterrupt:
            logger.info("Dev server interrupted by user (KeyboardInterrupt). Stopping process...")
            proc.terminate()
            proc.wait(timeout=5)
        except Exception:
            logger.exception("Dev server process error")
        finally:
            rc = proc.poll()
            if rc is None:
                proc.terminate()
                try:
                    proc.wait(timeout=5)
                except Exception:
                    proc.kill()
            rc = proc.returncode or 0
            logger.info("Dev server exited with code %d", rc)
            return rc


def summarize(results: Dict[str, bool]) -> None:
    logger.info("\n=== Diagnostic Summary ===")
    for k, ok in results.items():
        logger.info("%s: %s", k, "OK" if ok else "FAIL")


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(prog="start.py", description="HVAC platform startup & diagnostics")
    # Dev server should be started by default. Provide --no-dev to opt out.
    parser.add_argument("--no-dev", dest="dev", action="store_false", help="Do NOT start the dev server after diagnostics (useful for CI).")
    parser.set_defaults(dev=True)
    parser.add_argument("--build", action="store_true", help="Run the production build step (npm run build). By default start.py will NOT run the build.")
    args = parser.parse_args(argv)

    logger.info("Starting HVAC platform diagnostics: %s", datetime.utcnow().isoformat())

    results: Dict[str, bool] = {}

    # Environment
    env_info = check_environment()
    results["env_ok"] = env_info.get("node_path") != "(not found)" and env_info.get("npm_path") != "(not found)"

    # Repo files
    missing_files = check_repo_files()
    results["repo_files_ok"] = len(missing_files) == 0

    # .env validation — check common env files (.env, .env.local, .env.development)
    example = ROOT / ".env.example"
    candidate_actuals = [ROOT / ".env", ROOT / ".env.local", ROOT / ".env.development", ROOT / ".env.development.local"]
    missing_env_keys, unexpected = validate_env_keys(example, candidate_actuals)
    results["env_keys_ok"] = len(missing_env_keys) == 0

    # Typecheck
    results["tsc_ok"] = run_typescript_check()

    # Build: only run if explicitly requested via --build
    results["build_ok"] = run_build(should_run_build=args.build)

    summarize(results)

    # If requested, start dev server (this blocks until stopped)
    if args.dev:
        rc = start_dev_server()
        logger.info("Dev server returned %d", rc)

    logger.info("Full log written to %s", LOG_FILE)
    # Return non-zero if any critical check failed
    critical_fail = not (results["env_ok"] and results["repo_files_ok"] and results["tsc_ok"] and results["build_ok"])
    return 1 if critical_fail else 0


if __name__ == "__main__":
    rc = main()
    sys.exit(rc)
