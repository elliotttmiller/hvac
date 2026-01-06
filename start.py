#!/usr/bin/env python3
"""
start.py - Professional Platform Startup & Diagnostic Script

Usage:
  python start.py [--dev] [--build] [--auto-install]

This script performs comprehensive sanity checks and diagnostic commands for the
HVAC AI platform repository. It collects detailed debug logs (stdout/stderr) for
each step and writes a timestamped log file to ./logs/start.log. The script is
designed to help pinpoint issues during development, CI, or local startup.

This file is zero-dependency and runs on Windows/macOS/Linux with Python 3.8+.
"""
from __future__ import annotations

import argparse
import functools
import json
import logging
import os
import platform
import shlex
import shutil
import subprocess
import sys
import time
import threading
from datetime import datetime, timezone
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any


ROOT = Path(__file__).resolve().parent
LOG_DIR = ROOT / "logs"

# Output truncation constants
MAX_DISPLAYED_ERRORS = 15
MAX_DISPLAYED_ITEMS = 10
MAX_DISPLAYED_LINES = 20


def ensure_log_directory() -> None:
    """Ensure logs directory exists with proper error handling."""
    try:
        LOG_DIR.mkdir(exist_ok=True)
        # Verify we can write to the directory
        test_file = LOG_DIR / ".write_test"
        test_file.touch()
        test_file.unlink()
    except PermissionError:
        print(f"ERROR: Cannot write to logs directory: {LOG_DIR}")
        print("Please ensure you have write permissions.")
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Failed to create logs directory: {e}")
        sys.exit(1)


ensure_log_directory()
LOG_FILE = LOG_DIR / "start.log"

# Use the shared logging bootstrap so other Python entrypoints can reuse it
from scripts.logging_bootstrap import configure_logger

# Configure the logger (this will also load .env/.env.local into os.environ if present)
logger = configure_logger(LOG_FILE)


def log_step(step_name: str) -> None:
    """Log a major step with visual separator."""
    # Use summary-aware info to keep startup console output concise when requested
    s_info("")
    s_info("=" * 70)
    s_info(f"  {step_name}")
    s_info("=" * 70)


# Startup-summary mode: when true, reduce console INFO clutter and keep
# detailed messages at DEBUG (still recorded to file). Set via env:
# STARTUP_SUMMARY_ONLY=1
STARTUP_SUMMARY_ONLY = os.getenv("STARTUP_SUMMARY_ONLY", "0") in ("1", "true", "True")


def s_info(message: str) -> None:
    """Summary-aware info logger.

    When STARTUP_SUMMARY_ONLY is enabled we log these as DEBUG to the console
    (they still go to the file at DEBUG level). Otherwise log as INFO.
    """
    if STARTUP_SUMMARY_ONLY:
        logger.debug(message)
    else:
        logger.info(message)


def read_env_file(path: Path) -> Dict[str, str]:
    """
    Read and parse environment file with comprehensive error handling.
    
    Supports:
    - Comments (lines starting with #)
    - Empty lines
    - Key=value pairs with optional quotes
    - Inline comments
    """
    env: Dict[str, str] = {}
    if not path.exists():
        logger.debug(f"Environment file not found: {path}")
        return env
    
    try:
        with path.open("r", encoding="utf-8") as f:
            line_num = 0
            for line in f:
                line_num += 1
                line = line.strip()
                
                # Skip empty lines and comments
                if not line or line.startswith("#"):
                    continue
                
                # Skip lines without '='
                if "=" not in line:
                    logger.debug(f"Skipping malformed line {line_num} in {path.name}: {line}")
                    continue
                
                # Split on first '=' only
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip()
                
                # Remove inline comments with better quote handling
                # Check if value is properly quoted (quotes at start AND end)
                is_single_quoted = v.startswith("'") and v.endswith("'") and len(v) >= 2
                is_double_quoted = v.startswith('"') and v.endswith('"') and len(v) >= 2
                
                if "#" in v and not (is_single_quoted or is_double_quoted):
                    # Remove inline comment only if value is not quoted
                    v = v.split("#")[0].strip()
                
                # Remove surrounding quotes if present
                if is_single_quoted or is_double_quoted:
                    v = v[1:-1]
                
                env[k] = v
                logger.debug(f"Loaded env variable: {k}={v[:20]}..." if len(v) > 20 else f"Loaded env variable: {k}={v}")
        
        logger.debug(f"Successfully loaded {len(env)} variables from {path.name}")
    except Exception as e:
        logger.error(f"Error reading environment file {path}: {e}")
    
    return env


def run_cmd(
    cmd: List[str], 
    cwd: Optional[Path] = None, 
    timeout: Optional[int] = 600,
    env: Optional[Dict[str, str]] = None
) -> Tuple[int, str, str]:
    """
    Run a command and capture output with comprehensive error handling.
    
    Returns:
        Tuple of (returncode, stdout, stderr)
    """
    cmd_str = shlex.join(cmd)
    cwd_path = cwd or ROOT
    logger.debug(f"🔧 Running command: {cmd_str}")
    logger.debug(f"   Working directory: {cwd_path}")
    
    try:
        # Merge with system environment if custom env provided
        run_env = os.environ.copy()
        if env:
            run_env.update(env)
        
        proc = subprocess.run(
            cmd, 
            cwd=str(cwd_path), 
            capture_output=True, 
            text=True, 
            timeout=timeout, 
            shell=False,
            env=run_env
        )
        
        stdout = proc.stdout or ""
        stderr = proc.stderr or ""
        
        # Log output with truncation for very long outputs
        if stdout:
            truncated_stdout = stdout.strip()[:5000]
            logger.debug(f"📤 Command stdout ({len(stdout)} chars):\n{truncated_stdout}")
            if len(stdout) > 5000:
                logger.debug("   ... (output truncated)")
        
        if stderr:
            truncated_stderr = stderr.strip()[:5000]
            logger.debug(f"📤 Command stderr ({len(stderr)} chars):\n{truncated_stderr}")
            if len(stderr) > 5000:
                logger.debug("   ... (output truncated)")
        
        logger.debug(f"✅ Command completed with return code: {proc.returncode}")
        return proc.returncode, stdout, stderr
        
    except subprocess.TimeoutExpired as e:
        logger.error(f"⏱️  Command timed out after {timeout}s: {cmd_str}")
        logger.exception("Timeout details:")
        return 124, str(e.stdout or ""), str(e.stderr or "(timeout)")
    except FileNotFoundError as e:
        logger.error(f"❌ Command not found: {cmd[0]}")
        logger.error(f"   Make sure {cmd[0]} is installed and in PATH")
        return 127, "", str(e)
    except Exception as e:
        logger.error(f"❌ Failed to run command: {cmd_str}")
        logger.exception("Command execution error:")
        return 1, "", str(e)


def which_or_none(name: str) -> Optional[str]:
    """Find executable in PATH with detailed logging."""
    p = shutil.which(name)
    if p:
        logger.debug(f"✅ Found {name}: {p}")
    else:
        logger.debug(f"❌ Not found: {name}")
    return p


def check_platform() -> Dict[str, Any]:
    """Gather comprehensive platform information."""
    log_step("Platform Information")
    
    info: Dict[str, Any] = {}
    info["platform"] = platform.system()
    info["platform_release"] = platform.release()
    info["platform_version"] = platform.version()
    info["architecture"] = platform.machine()
    info["processor"] = platform.processor() or "unknown"
    info["python_implementation"] = platform.python_implementation()
    
    s_info(f"🖥️  Platform: {info['platform']} {info['platform_release']} ({info['architecture']})")
    s_info(f"🐍 Python: {info['python_implementation']} {sys.version.split()[0]}")

    logger.debug(f"Platform details: {json.dumps(info, indent=2)}")
    return info


def check_environment() -> Dict[str, str]:
    """Collect comprehensive environment information."""
    log_step("Environment Validation")
    
    info: Dict[str, str] = {}
    
    # Python info
    info["python_executable"] = sys.executable
    info["python_version"] = sys.version.replace('\n', ' ')
    s_info(f"✅ Python: {sys.version.split()[0]} ({sys.executable})")
    
    # Node.js
    info["node_path"] = which_or_none("node") or "(not found)"
    info["node_version"] = ""
    if info["node_path"] != "(not found)":
        rc, out, _ = run_cmd([info["node_path"], "--version"]) 
        info["node_version"] = out.strip() if rc == 0 else "(error)"
        s_info(f"✅ Node.js: {info['node_version']} ({info['node_path']})")
    else:
        logger.error("❌ Node.js not found in PATH")
        logger.error("   Please install Node.js from https://nodejs.org/")
    
    # npm
    info["npm_path"] = which_or_none("npm") or "(not found)"
    if info["npm_path"] != "(not found)":
        rc, out, _ = run_cmd([info["npm_path"], "--version"]) 
        info["npm_version"] = out.strip() if rc == 0 else "(error)"
        s_info(f"✅ npm: {info['npm_version']} ({info['npm_path']})")
    else:
        info["npm_version"] = "(not found)"
        logger.error("❌ npm not found in PATH")
    
    # npx
    info["npx_path"] = which_or_none("npx") or "(not found)"
    if info["npx_path"] != "(not found)":
        s_info(f"✅ npx: {info['npx_path']}")
    else:
        logger.warning("⚠️  npx not found in PATH")
    
    logger.debug(f"Environment summary: {json.dumps(info, indent=2)}")
    return info


def check_dependencies() -> Dict[str, bool]:
    """Check if npm dependencies are installed."""
    log_step("Dependency Validation")
    
    node_modules = ROOT / "node_modules"
    package_json = ROOT / "package.json"
    
    info: Dict[str, bool] = {}
    
    if not package_json.exists():
        logger.error("❌ package.json not found")
        info["package_json_exists"] = False
        return info
    
    info["package_json_exists"] = True
    logger.info("✅ package.json found")
    
    # Check if node_modules exists
    if not node_modules.exists():
        logger.error("❌ node_modules directory not found")
        logger.error("   Dependencies are not installed")
        info["dependencies_installed"] = False
        return info
    
    # Count installed packages
    try:
        package_count = len([d for d in node_modules.iterdir() if d.is_dir() and not d.name.startswith('.')])
        logger.info(f"✅ node_modules exists with {package_count} packages")
        info["dependencies_installed"] = True
        info["package_count"] = package_count
    except Exception as e:
        logger.error(f"❌ Error reading node_modules: {e}")
        info["dependencies_installed"] = False
    
    return info


def install_dependencies() -> bool:
    """Install npm dependencies."""
    log_step("Installing Dependencies")
    
    npm = which_or_none("npm")
    if not npm:
        logger.error("❌ npm not found, cannot install dependencies")
        return False
    
    logger.info("📦 Running: npm install")
    logger.info("   This may take a few minutes...")
    
    rc, out, err = run_cmd([npm, "install"], timeout=300)
    
    if rc == 0:
        logger.info("✅ Dependencies installed successfully")
        return True
    else:
        logger.error(f"❌ Failed to install dependencies (exit code: {rc})")
        if err:
            logger.error(f"Error output:\n{err[:1000]}")
        return False


def load_and_display_config() -> Dict[str, Any]:
    """Load and display .env configuration."""
    log_step("Configuration Loading")
    
    example = ROOT / ".env.example"
    candidate_actuals = [
        ROOT / ".env",
        ROOT / ".env.local",
        ROOT / ".env.development",
        ROOT / ".env.development.local"
    ]
    
    config_summary: Dict[str, Any] = {}
    
    # Check which env files exist
    existing_files = [f for f in candidate_actuals if f.exists()]
    config_summary["env_files_found"] = [f.name for f in existing_files]
    
    if not existing_files:
        logger.error("❌ No .env files found")
        logger.error("   Please create a .env file from .env.example:")
        logger.error("   cp .env.example .env")
        config_summary["has_env"] = False
        return config_summary
    
    logger.info(f"📄 Found {len(existing_files)} environment file(s):")
    for f in existing_files:
        logger.info(f"   • {f.name}")
    
    config_summary["has_env"] = True
    
    # Load all env files
    merged_env: Dict[str, str] = {}
    for env_file in existing_files:
        env_vars = read_env_file(env_file)
        merged_env.update(env_vars)
        logger.debug(f"Loaded {len(env_vars)} variables from {env_file.name}")
    
    config_summary["total_vars"] = len(merged_env)
    logger.info(f"✅ Loaded {len(merged_env)} environment variables")
    
    # Display key configurations (without sensitive values)
    key_configs = [
        "VITE_AI_PROVIDER",
        "VITE_AI_MODEL",
        "VITE_AI_TEMPERATURE",
        "VITE_FEATURE_CACHE",
        "VITE_FEATURE_FILE_PROCESSING"
    ]
    
    logger.info("")
    logger.info("📋 Key Configuration:")
    for key in key_configs:
        value = merged_env.get(key, "(not set)")
        # Mask API keys
        if "API_KEY" in key and value != "(not set)":
            display_value = value[:8] + "..." if len(value) > 8 else "***"
        else:
            display_value = value
        logger.info(f"   {key}: {display_value}")
    
    return config_summary


def validate_environment() -> Tuple[List[str], List[str]]:
    """
    Validate environment variables against example file.
    
    Returns:
        Tuple of (missing_keys, unexpected_keys)
    """
    log_step("Environment Variables Validation")
    
    example = ROOT / ".env.example"
    candidate_actuals = [
        ROOT / ".env",
        ROOT / ".env.local",
        ROOT / ".env.development",
        ROOT / ".env.development.local"
    ]
    
    logger.info(f"📋 Validating against: {example.name}")
    logger.info(f"   Checking files: {', '.join(f.name for f in candidate_actuals if f.exists())}")
    
    example_env = read_env_file(example) if example.exists() else {}
    actual_env: Dict[str, str] = {}
    
    for p in candidate_actuals:
        if p.exists():
            actual_env.update(read_env_file(p))
    
    missing = [k for k in example_env.keys() if k not in actual_env]
    unexpected = [k for k in actual_env.keys() if k not in example_env]
    
    if missing:
        logger.error(f"❌ Missing {len(missing)} required environment variable(s):")
        for key in missing[:MAX_DISPLAYED_ITEMS]:
            logger.error(f"   • {key}")
        if len(missing) > MAX_DISPLAYED_ITEMS:
            logger.error(f"   ... and {len(missing) - MAX_DISPLAYED_ITEMS} more")
        logger.error("")
        logger.error("💡 Recommendation:")
        logger.error("   Copy the missing variables from .env.example to your .env file")
    else:
        logger.info("✅ All required environment variables are set")
    
    if unexpected:
        logger.info(f"ℹ️  Found {len(unexpected)} additional variable(s) not in example")
        logger.debug(f"Additional variables: {unexpected}")
    
    return missing, unexpected


def print_summary(results: Dict[str, bool]) -> None:
    """Print comprehensive summary with color-coded status."""
    log_step("Diagnostic Summary")
    
    total_checks = len(results)
    passed_checks = sum(1 for v in results.values() if v)
    failed_checks = total_checks - passed_checks
    
    logger.info("")
    logger.info(f"Total Checks: {total_checks}")
    logger.info(f"Passed: {passed_checks} ✅")
    logger.info(f"Failed: {failed_checks} ❌")
    logger.info("")
    
    # Group results by status
    passed = {k: v for k, v in results.items() if v}
    failed = {k: v for k, v in results.items() if not v}
    
    if passed:
        logger.info("✅ Passed Checks:")
        for key in passed:
            logger.info(f"   • {key}")
    
    if failed:
        logger.info("")
        logger.error("❌ Failed Checks:")
        for key in failed:
            logger.error(f"   • {key}")


def print_final_recommendations(results: Dict[str, bool]) -> None:
    """Print actionable recommendations based on results."""
    failed_checks = {k: v for k, v in results.items() if not v}
    
    if not failed_checks:
        logger.info("")
        logger.info("=" * 70)
        logger.info("🎉 All checks passed! Platform is ready.")
        logger.info("=" * 70)
        return
    
    logger.info("")
    logger.info("=" * 70)
    logger.info("⚠️  Action Required")
    logger.info("=" * 70)
    
    if not results.get("env_ok", True):
        logger.error("")
        logger.error("❌ Environment Setup Issue:")
        logger.error("   Install Node.js and npm from https://nodejs.org/")
    
    if not results.get("dependencies_ok", True):
        logger.error("")
        logger.error("❌ Dependencies Not Installed:")
        logger.error("   Run: python start.py --auto-install")
        logger.error("   Or manually: npm install")
    
    if not results.get("env_keys_ok", True):
        logger.error("")
        logger.error("❌ Missing Environment Variables:")
        logger.error("   1. Copy .env.example to .env: cp .env.example .env")
        logger.error("   2. Edit .env and add your API keys")


def start_dev_server():
    """Start the development server and API server."""
    logger.info("Starting development and API servers...")

    npm = which_or_none("npm")
    if not npm:
        logger.error("npm not found. Please ensure Node.js is installed.")
        return 1

    try:
        # Start frontend dev server
        frontend_proc = subprocess.Popen([npm, "run", "dev"], cwd=str(ROOT), shell=True)
        logger.info("Frontend development server started.")

        # Start backend API server
        api_proc = subprocess.Popen([npm, "run", "dev:api"], cwd=str(ROOT), shell=True)
        logger.info("Backend API server started.")

        # Wait for both processes to complete
        frontend_proc.wait()
        api_proc.wait()

    except subprocess.CalledProcessError as e:
        logger.error(f"Failed to start servers: {e}")
        return 1

    return 0


def main(argv: Optional[List[str]] = None) -> int:
    """Main entry point for the startup script."""
    parser = argparse.ArgumentParser(
        prog="start.py",
        description="HVAC AI Platform - Professional Startup & Diagnostics",
        epilog="For more information, see the README.md"
    )
    
    parser.add_argument(
        "--no-dev",
        dest="dev",
        action="store_false",
        help="Do NOT start the dev server after diagnostics (useful for CI)"
    )
    parser.set_defaults(dev=True)
    
    parser.add_argument(
        "--build",
        action="store_true",
        help="Run the production build step (npm run build)"
    )
    
    parser.add_argument(
        "--auto-install",
        action="store_true",
        help="Automatically install npm dependencies if missing"
    )

    parser.add_argument(
        "--passthrough",
        dest="passthrough",
        action="store_true",
        help="Run dev servers with stdio inherited (no capture) for best TTY fidelity"
    )
    parser.add_argument(
        "--no-passthrough",
        dest="passthrough",
        action="store_false",
        help="Disable passthrough and capture dev server output (opposite of --passthrough)"
    )
    # Make passthrough the default behavior for interactive developer runs
    parser.set_defaults(passthrough=True)
    
    args = parser.parse_args(argv)
    
    # Print banner
    logger.info("=" * 70)
    logger.info("HVAC AI Platform - Startup Script v2.0")
    logger.info("=" * 70)
    logger.info(f"Started: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    logger.info(f"Working Directory: {ROOT}")
    logger.info(f"Log File: {LOG_FILE}")
    logger.info("")
    
    overall_start_time = time.time()

    try:
        s_info("Skipping pre-flight validations (startup summary mode)")
        s_info("Full verbose logs are still written to the rotating log file")

        logger.debug("Note: platform/environment/dependency checks intentionally skipped")

        # Start dev server if requested (no gating on pre-flight checks)
        if args.dev:
            logger.info("")
            api_entry = ROOT / 'server' / 'index.cjs'
            start_api = api_entry.exists()
            if start_api:
                s_info("Found local API server entry, starting backend + frontend dev servers")
            s_info(f"Passthrough mode: {'ENABLED' if args.passthrough else 'DISABLED'}")
            start_dev_server()
        
        # Normal exit (diagnostics skipped). Any runtime errors will be
        # captured in the detailed log file.
        return 0
        
    except KeyboardInterrupt:
        logger.info("")
        logger.info("Interrupted by user (Ctrl+C)")
        return 130
    except Exception as e:
        logger.error("")
        logger.error("=" * 70)
        logger.error("Unexpected Error")
        logger.error("=" * 70)
        logger.exception(f"Fatal error: {e}")
        logger.error("")
        logger.error(f"Please check {LOG_FILE} for details")
        return 1


if __name__ == "__main__":
    rc = main()
    sys.exit(rc)
