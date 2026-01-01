#!/usr/bin/env python3
"""
start.py - Professional Platform Startup & Diagnostic Script

Usage:
  python start.py [--dev] [--build] [--auto-install]

This script performs comprehensive sanity checks and diagnostic commands for the
HVAC AI platform repository. It collects detailed debug logs (stdout/stderr) for
each step and writes a timestamped log file to ./logs/start.log. The script is
designed to help pinpoint issues during development, CI, or local startup.

Features:
- Comprehensive environment validation (Python, Node, npm, git)
- Dependency installation verification with auto-install option
- Repository health and disk space checks
- .env configuration loading and validation against .env.example
- Package.json scripts validation (dev, build, preview)
- Pre-build script execution and validation
- TypeScript typecheck with detailed error reporting (npx tsc --noEmit)
- Optional production build (npm run build) with progress tracking
- Optional dev server startup (npm run dev) with log streaming
- Performance metrics tracking with timing for each stage
- Comprehensive structured logging with progress indicators
- Platform-specific optimizations (Windows/macOS/Linux)
- Actionable error messages with recommendations

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

# Performance metrics tracking
TIMINGS: Dict[str, float] = {}

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


def setup_logger() -> logging.Logger:
    """Setup comprehensive logging with console and file handlers."""
    logger = logging.getLogger("hvac.start")
    logger.setLevel(logging.DEBUG)
    
    # Console handler (INFO level) with detailed formatting
    ch = logging.StreamHandler(sys.stdout)
    ch.setLevel(logging.INFO)
    console_fmt = logging.Formatter(
        "[%(levelname)s] %(message)s"
    )
    ch.setFormatter(console_fmt)
    
    # Rotating file handler (DEBUG level) with comprehensive formatting
    fh = RotatingFileHandler(
        LOG_FILE, 
        maxBytes=10_000_000,  # 10MB
        backupCount=5, 
        encoding="utf-8"
    )
    fh.setLevel(logging.DEBUG)
    file_fmt = logging.Formatter(
        "%(asctime)s [%(levelname)-8s] %(name)s - %(funcName)s:%(lineno)d - %(message)s"
    )
    fh.setFormatter(file_fmt)
    
    # Avoid duplicate handlers
    if not logger.handlers:
        logger.addHandler(ch)
        logger.addHandler(fh)
    
    return logger


logger = setup_logger()


def log_step(step_name: str) -> None:
    """Log a major step with visual separator."""
    logger.info("")
    logger.info("=" * 70)
    logger.info(f"  {step_name}")
    logger.info("=" * 70)


def track_time(func):
    """Decorator to track execution time of functions."""
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        elapsed = time.time() - start_time
        TIMINGS[func.__name__] = elapsed
        logger.debug(f"⏱️  {func.__name__} took {elapsed:.2f}s")
        return result
    return wrapper


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


@track_time
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
    
    logger.info(f"🖥️  Platform: {info['platform']} {info['platform_release']} ({info['architecture']})")
    logger.info(f"🐍 Python: {info['python_implementation']} {sys.version.split()[0]}")
    
    logger.debug(f"Platform details: {json.dumps(info, indent=2)}")
    return info


@track_time
def check_environment() -> Dict[str, str]:
    """Collect comprehensive environment information."""
    log_step("Environment Validation")
    
    info: Dict[str, str] = {}
    
    # Python info
    info["python_executable"] = sys.executable
    info["python_version"] = sys.version.replace('\n', ' ')
    logger.info(f"✅ Python: {sys.version.split()[0]} ({sys.executable})")
    
    # Node.js
    info["node_path"] = which_or_none("node") or "(not found)"
    info["node_version"] = ""
    if info["node_path"] != "(not found)":
        rc, out, _ = run_cmd([info["node_path"], "--version"])
        info["node_version"] = out.strip() if rc == 0 else "(error)"
        logger.info(f"✅ Node.js: {info['node_version']} ({info['node_path']})")
    else:
        logger.error("❌ Node.js not found in PATH")
        logger.error("   Please install Node.js from https://nodejs.org/")
    
    # npm
    info["npm_path"] = which_or_none("npm") or "(not found)"
    if info["npm_path"] != "(not found)":
        rc, out, _ = run_cmd([info["npm_path"], "--version"])
        info["npm_version"] = out.strip() if rc == 0 else "(error)"
        logger.info(f"✅ npm: {info['npm_version']} ({info['npm_path']})")
    else:
        info["npm_version"] = "(not found)"
        logger.error("❌ npm not found in PATH")
    
    # npx
    info["npx_path"] = which_or_none("npx") or "(not found)"
    if info["npx_path"] != "(not found)":
        logger.info(f"✅ npx: {info['npx_path']}")
    else:
        logger.warning("⚠️  npx not found in PATH")
    
    # git
    info["git_path"] = which_or_none("git") or "(not found)"
    if info["git_path"] != "(not found)":
        rc, out, _ = run_cmd([info["git_path"], "--version"])
        info["git_version"] = out.strip() if rc == 0 else "(error)"
        logger.info(f"✅ Git: {info['git_version']}")
    else:
        info["git_version"] = "(not found)"
        logger.warning("⚠️  Git not found in PATH")
    
    logger.debug(f"Environment summary: {json.dumps(info, indent=2)}")
    return info


@track_time
def check_disk_space() -> Dict[str, Any]:
    """Check available disk space."""
    log_step("Disk Space Check")
    
    try:
        stat = shutil.disk_usage(ROOT)
        total_gb = stat.total / (1024 ** 3)
        used_gb = stat.used / (1024 ** 3)
        free_gb = stat.free / (1024 ** 3)
        percent_used = (stat.used / stat.total) * 100
        
        info = {
            "total_gb": round(total_gb, 2),
            "used_gb": round(used_gb, 2),
            "free_gb": round(free_gb, 2),
            "percent_used": round(percent_used, 2)
        }
        
        logger.info(f"💾 Disk Space:")
        logger.info(f"   Total: {info['total_gb']:.2f} GB")
        logger.info(f"   Used:  {info['used_gb']:.2f} GB ({info['percent_used']:.1f}%)")
        logger.info(f"   Free:  {info['free_gb']:.2f} GB")
        
        # Warn if disk space is low
        if free_gb < 1.0:
            logger.error("❌ Low disk space! Less than 1 GB available")
            logger.error("   Consider freeing up disk space before building")
        elif free_gb < 5.0:
            logger.warning("⚠️  Disk space is getting low (< 5 GB available)")
        else:
            logger.info("✅ Sufficient disk space available")
        
        return info
    except Exception as e:
        logger.error(f"❌ Failed to check disk space: {e}")
        return {"error": str(e)}


@track_time
def check_git_status() -> Dict[str, Any]:
    """Check git repository status."""
    log_step("Git Repository Status")
    
    info: Dict[str, Any] = {}
    git_path = which_or_none("git")
    
    if not git_path:
        logger.warning("⚠️  Git not available, skipping repository checks")
        return {"available": False}
    
    info["available"] = True
    
    # Check if we're in a git repository
    rc, out, _ = run_cmd([git_path, "rev-parse", "--git-dir"])
    if rc != 0:
        logger.warning("⚠️  Not a git repository")
        info["is_repo"] = False
        return info
    
    info["is_repo"] = True
    
    # Get current branch
    rc, out, _ = run_cmd([git_path, "rev-parse", "--abbrev-ref", "HEAD"])
    if rc == 0:
        info["branch"] = out.strip()
        logger.info(f"📍 Current branch: {info['branch']}")
    
    # Get last commit
    rc, out, _ = run_cmd([git_path, "log", "-1", "--pretty=format:%h - %s (%ar)"])
    if rc == 0:
        info["last_commit"] = out.strip()
        logger.info(f"📝 Last commit: {info['last_commit']}")
    
    # Check for uncommitted changes
    rc, out, _ = run_cmd([git_path, "status", "--porcelain"])
    if rc == 0:
        changes = [line for line in out.strip().split('\n') if line]
        info["uncommitted_changes"] = len(changes)
        if changes:
            logger.warning(f"⚠️  {len(changes)} uncommitted change(s)")
            logger.debug(f"Changed files:\n{chr(10).join(changes[:10])}")
        else:
            logger.info("✅ Working directory clean")
    
    return info


@track_time
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


@track_time
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


@track_time
def check_repo_files() -> List[str]:
    """Check for critical repository files."""
    log_step("Repository Files Validation")
    
    missing: List[str] = []
    required = [
        "package.json",
        "vite.config.ts",
        "tsconfig.json",
        "index.html",
        "index.tsx"
    ]
    
    for name in required:
        p = ROOT / name
        if not p.exists():
            missing.append(name)
            logger.error(f"❌ Missing required file: {name}")
        else:
            logger.info(f"✅ Found: {name}")
    
    if not missing:
        logger.info("✅ All required repository files present")
    
    return missing


@track_time
def validate_package_scripts() -> Dict[str, bool]:
    """Validate that required npm scripts exist in package.json."""
    log_step("Package Scripts Validation")
    
    package_json = ROOT / "package.json"
    required_scripts = ["dev", "build", "preview"]
    results: Dict[str, bool] = {}
    
    try:
        with package_json.open("r", encoding="utf-8") as f:
            data = json.load(f)
        
        scripts = data.get("scripts", {})
        
        for script_name in required_scripts:
            if script_name in scripts:
                logger.info(f"✅ Script '{script_name}': {scripts[script_name]}")
                results[script_name] = True
            else:
                logger.error(f"❌ Missing required script: {script_name}")
                results[script_name] = False
        
        if all(results.values()):
            logger.info("✅ All required npm scripts are defined")
        
    except Exception as e:
        logger.error(f"❌ Failed to validate package.json scripts: {e}")
        for script_name in required_scripts:
            results[script_name] = False
    
    return results


@track_time
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


@track_time
def validate_env_keys(example: Path, actual_files: List[Path]) -> Tuple[List[str], List[str]]:
    """
    Validate environment variables against example file.
    
    Returns:
        Tuple of (missing_keys, unexpected_keys)
    """
    log_step("Environment Variables Validation")
    
    logger.info(f"📋 Validating against: {example.name}")
    logger.info(f"   Checking files: {', '.join(f.name for f in actual_files if f.exists())}")
    
    example_env = read_env_file(example) if example.exists() else {}
    actual_env: Dict[str, str] = {}
    
    for p in actual_files:
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


@track_time
def run_typescript_check() -> bool:
    """Run TypeScript typecheck with detailed error reporting."""
    log_step("TypeScript Type Check")
    
    npx = which_or_none("npx") or "npx"
    logger.info("🔍 Running: npx tsc --noEmit")
    logger.info("   This validates TypeScript types across the project...")
    
    rc, out, err = run_cmd([npx, "tsc", "--noEmit"], timeout=180)
    
    if rc == 0:
        logger.info("✅ TypeScript check passed - no type errors found")
        return True
    else:
        logger.error(f"❌ TypeScript check FAILED (exit code: {rc})")
        
        # Parse and display errors more clearly
        if out:
            error_lines = [line for line in out.split('\n') if line.strip()]
            error_count = len([line for line in error_lines if 'error TS' in line])
            
            logger.error(f"   Found {error_count} type error(s)")
            logger.error("")
            logger.error("   First few errors:")
            for line in error_lines[:MAX_DISPLAYED_ERRORS]:
                logger.error(f"   {line}")
            
            if len(error_lines) > MAX_DISPLAYED_ERRORS:
                logger.error(f"   ... and {len(error_lines) - MAX_DISPLAYED_ERRORS} more lines")
        
        if err:
            logger.error(f"   Error details: {err[:500]}")
        
        logger.error("")
        logger.error("💡 Recommendation:")
        logger.error("   Fix TypeScript errors before building")
        logger.error("   Run 'npx tsc --noEmit' locally for full error details")
        
        return False


@track_time
def run_build(should_run_build: bool = False) -> bool:
    """Run production build with progress tracking."""
    if not should_run_build:
        logger.info("ℹ️  Production build skipped (not requested)")
        logger.info("   Use --build flag to run production build")
        return True
    
    log_step("Production Build")
    
    npm = which_or_none("npm") or "npm"
    logger.info("🏗️  Running: npm run build")
    logger.info("   This may take a few minutes...")
    
    start_time = time.time()
    rc, out, err = run_cmd([npm, "run", "build"], timeout=600)
    elapsed = time.time() - start_time
    
    if rc == 0:
        logger.info(f"✅ Build succeeded in {elapsed:.1f}s")
        
        # Check for dist directory
        dist_dir = ROOT / "dist"
        if dist_dir.exists():
            try:
                # Count files in dist
                file_count = sum(1 for _ in dist_dir.rglob('*') if _.is_file())
                # Calculate dist size
                total_size = sum(f.stat().st_size for f in dist_dir.rglob('*') if f.is_file())
                size_mb = total_size / (1024 * 1024)
                
                logger.info(f"📦 Build output: {file_count} files ({size_mb:.2f} MB)")
                logger.info(f"   Location: {dist_dir}")
            except Exception as e:
                logger.debug(f"Failed to analyze dist directory: {e}")
        
        return True
    else:
        logger.error(f"❌ Build failed after {elapsed:.1f}s (exit code: {rc})")
        
        if err:
            logger.error("   Error output:")
            for line in err.split('\n')[:MAX_DISPLAYED_LINES]:
                if line.strip():
                    logger.error(f"   {line}")
        
        if out:
            logger.debug(f"Build stdout:\n{out}")
        
        logger.error("")
        logger.error("💡 Recommendation:")
        logger.error("   1. Check the error messages above")
        logger.error("   2. Ensure all dependencies are installed: npm install")
        logger.error("   3. Fix any TypeScript errors first")
        logger.error("   4. Check logs/start.log for full details")
        
        return False


def start_dev_server(start_api: bool = False) -> int:
    """
    Start the dev server and stream logs.
    
    Returns:
        The process return code when it exits (or when interrupted).
    
    Note: This call blocks until the dev server exits (Ctrl+C to stop).
    """
    log_step("Development Server")
    
    npm = which_or_none("npm") or "npm"
    logger.info("🚀 Starting: npm run dev")
    logger.info("   Press Ctrl+C to stop the server")
    logger.info("   Server logs will be displayed below:")
    logger.info("-" * 70)
    
    # Start frontend dev server and optionally backend API server, streaming both outputs.
    npm = which_or_none("npm") or "npm"

    front_cmd = [npm, "run", "dev"]
    back_cmd = [npm, "run", "dev:api"]

    procs = []

    def spawn(cmd, name):
        logger.info(f"🚀 Starting: {shlex.join(cmd)} ({name})")
        try:
            p = subprocess.Popen(
                cmd,
                cwd=str(ROOT),
                stdout=subprocess.PIPE,
                stderr=subprocess.STDOUT,
                text=True,
                bufsize=1,
                shell=False
            )
            return p
        except FileNotFoundError:
            logger.error(f"❌ Command not found: {cmd[0]} for {name}")
            return None

    front_proc = spawn(front_cmd, 'frontend')
    if front_proc:
        procs.append(('frontend', front_proc))

    back_proc = None
    if start_api:
        back_proc = spawn(back_cmd, 'backend')
        if back_proc:
            procs.append(('backend', back_proc))

    # Reader threads
    threads = []
    stop_flag = threading.Event()

    def reader_loop(p, name):
        try:
            assert p.stdout
            for line in p.stdout:
                if line is None:
                    break
                print(f"[{name}] {line.rstrip()}")
                logger.debug(f"[{name}] {line.rstrip()}")
        except Exception as e:
            logger.debug(f"Reader for {name} exited: {e}")

    for name, p in procs:
        t = threading.Thread(target=reader_loop, args=(p, name), daemon=True)
        t.start()
        threads.append(t)

    try:
        # Wait for processes to exit (if any). When both exit, return combined code (non-zero if any non-zero)
        codes = []
        for name, p in procs:
            rc = p.wait()
            logger.info(f"{name} process exited with code {rc}")
            codes.append(rc)

        # Join reader threads briefly
        for t in threads:
            t.join(timeout=0.1)

        # Determine overall code
        overall = 0 if all(c == 0 for c in codes) else (codes[0] if codes else 0)
        return overall

    except KeyboardInterrupt:
        logger.info("")
        logger.info("-" * 70)
        logger.info("⚠️  Dev servers interrupted by user (Ctrl+C)")
        for name, p in procs:
            try:
                p.terminate()
            except Exception:
                pass
        # Wait briefly then kill
        time.sleep(1)
        for name, p in procs:
            if p.poll() is None:
                try:
                    p.kill()
                except Exception:
                    pass
        return 130


def print_summary(results: Dict[str, bool], timings: Dict[str, float]) -> None:
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
    
    # Performance summary
    if timings:
        logger.info("")
        logger.info("⏱️  Performance Metrics:")
        total_time = sum(timings.values())
        for func_name, duration in sorted(timings.items(), key=lambda x: x[1], reverse=True):
            logger.info(f"   {func_name}: {duration:.2f}s")
        logger.info(f"   Total: {total_time:.2f}s")


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
    
    if not results.get("tsc_ok", True):
        logger.error("")
        logger.error("❌ TypeScript Errors:")
        logger.error("   Run: npx tsc --noEmit")
        logger.error("   Fix the reported type errors")
    
    if not results.get("build_ok", True):
        logger.error("")
        logger.error("❌ Build Failed:")
        logger.error("   1. Ensure all dependencies are installed")
        logger.error("   2. Fix TypeScript errors first")
        logger.error("   3. Check logs/start.log for details")


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
    
    args = parser.parse_args(argv)
    
    # Print banner
    logger.info("=" * 70)
    logger.info(" HVAC AI Platform - Startup Script v2.0")
    logger.info("=" * 70)
    logger.info(f"🕐 Started: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    logger.info(f"📂 Working Directory: {ROOT}")
    logger.info(f"📝 Log File: {LOG_FILE}")
    logger.info("")
    
    results: Dict[str, bool] = {}
    overall_start_time = time.time()
    
    try:
        # Platform information
        platform_info = check_platform()
        results["platform_ok"] = True
        
        # Environment validation
        env_info = check_environment()
        results["env_ok"] = (
            env_info.get("node_path") != "(not found)" and
            env_info.get("npm_path") != "(not found)"
        )
        
        if not results["env_ok"]:
            logger.error("")
            logger.error("❌ CRITICAL: Node.js or npm not found")
            logger.error("   Cannot proceed without Node.js environment")
            print_summary(results, TIMINGS)
            return 1
        
        # Disk space check
        disk_info = check_disk_space()
        results["disk_space_ok"] = "error" not in disk_info
        
        # Git status
        git_info = check_git_status()
        results["git_ok"] = git_info.get("is_repo", False)
        
        # Dependency check
        dep_info = check_dependencies()
        results["dependencies_ok"] = dep_info.get("dependencies_installed", False)
        
        # Auto-install dependencies if requested and needed
        if not results["dependencies_ok"] and args.auto_install:
            logger.info("")
            logger.info("🔧 Auto-install enabled, attempting to install dependencies...")
            if install_dependencies():
                results["dependencies_ok"] = True
            else:
                logger.error("❌ Auto-install failed")
        
        if not results["dependencies_ok"]:
            logger.error("")
            logger.error("❌ Dependencies not installed")
            logger.error("   Run with --auto-install flag or manually run: npm install")
            print_summary(results, TIMINGS)
            print_final_recommendations(results)
            return 1
        
        # Repository files check
        missing_files = check_repo_files()
        results["repo_files_ok"] = len(missing_files) == 0
        
        # Package scripts validation
        script_results = validate_package_scripts()
        results["scripts_ok"] = all(script_results.values())
        
        # Configuration loading and display
        config_info = load_and_display_config()
        results["config_loaded"] = config_info.get("has_env", False)
        
        # Environment variables validation
        example = ROOT / ".env.example"
        candidate_actuals = [
            ROOT / ".env",
            ROOT / ".env.local",
            ROOT / ".env.development",
            ROOT / ".env.development.local"
        ]
        missing_env_keys, unexpected = validate_env_keys(example, candidate_actuals)
        results["env_keys_ok"] = len(missing_env_keys) == 0
        
        # TypeScript typecheck
        results["tsc_ok"] = run_typescript_check()
        
        # Production build (optional)
        results["build_ok"] = run_build(should_run_build=args.build)
        
        # Print summary
        total_elapsed = time.time() - overall_start_time
        logger.info("")
        logger.info("=" * 70)
        logger.info(f"⏱️  Total diagnostic time: {total_elapsed:.2f}s")
        logger.info("=" * 70)
        
        print_summary(results, TIMINGS)
        print_final_recommendations(results)
        
        logger.info("")
        logger.info(f"📝 Full log written to: {LOG_FILE}")
        
        # Start dev server if requested
        if args.dev:
            logger.info("")
            
            # Only start dev server if critical checks passed
            critical_checks = [
                "env_ok",
                "dependencies_ok",
                "repo_files_ok",
                "tsc_ok"
            ]
            critical_failed = [k for k in critical_checks if not results.get(k, False)]
            
            if critical_failed:
                logger.error("❌ Cannot start dev server due to failed critical checks:")
                for check in critical_failed:
                    logger.error(f"   • {check}")
                logger.error("")
                logger.error("   Fix the issues above and try again")
                return 1
            # Determine whether to start backend API as well
            api_entry = ROOT / 'server' / 'index.cjs'
            start_api = api_entry.exists()
            if start_api:
                logger.info("ℹ️  Found local API server entry, starting backend + frontend dev servers")
            rc = start_dev_server(start_api=start_api)
            logger.info(f"Dev server returned exit code: {rc}")
        
        # Determine overall exit code
        critical_fail = not all([
            results.get("env_ok", False),
            results.get("dependencies_ok", False),
            results.get("repo_files_ok", False),
            results.get("tsc_ok", False),
            results.get("build_ok", True)  # Build is optional
        ])
        
        return 1 if critical_fail else 0
        
    except KeyboardInterrupt:
        logger.info("")
        logger.info("⚠️  Interrupted by user (Ctrl+C)")
        return 130
    except Exception as e:
        logger.error("")
        logger.error("=" * 70)
        logger.error("💥 Unexpected Error")
        logger.error("=" * 70)
        logger.exception(f"Fatal error: {e}")
        logger.error("")
        logger.error(f"Please check {LOG_FILE} for details")
        return 1


if __name__ == "__main__":
    rc = main()
    sys.exit(rc)
