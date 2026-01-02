import logging
import os
from logging.handlers import RotatingFileHandler
from pathlib import Path
from typing import Optional


def load_env_files_into_osenv(root: Path) -> None:
    """Load .env files (if present) into os.environ without overwriting.

    This prefers real OS environment variables (they take precedence).
    """
    candidates = [root / ".env", root / ".env.local"]
    for p in candidates:
        if not p.exists():
            continue
        try:
            with p.open("r", encoding="utf-8") as f:
                for raw in f:
                    line = raw.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip()
                    if (v.startswith('"') and v.endswith('"')) or (v.startswith("'") and v.endswith("'")):
                        v = v[1:-1]
                    if k not in os.environ:
                        os.environ[k] = v
        except Exception:
            # Don't fail hard on malformed .env
            continue


def configure_logger(log_file: Path, name: str = "hvac.start") -> logging.Logger:
    """Configure a logger that reads START_LOG_LEVEL / START_VERBOSE from env.

    Returns a configured logger instance. File logging remains at DEBUG so
    the rotating file will capture the full trace regardless of console level.
    """
    # Load .env into env first (so file-provided START_* values are honored)
    load_env_files_into_osenv(log_file.parent)

    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # Console: prefer explicit START_LOG_LEVEL over START_VERBOSE
    ch = logging.StreamHandler()
    start_log_level = os.getenv("START_LOG_LEVEL")
    if start_log_level:
        console_level = getattr(logging, start_log_level.upper(), logging.INFO)
    else:
        console_level = logging.DEBUG if os.getenv("START_VERBOSE") == "1" else logging.INFO
    ch.setLevel(console_level)
    console_fmt = logging.Formatter("[%(levelname)s] %(message)s")
    ch.setFormatter(console_fmt)

    # File (rotating) - capture everything at DEBUG level
    fh = RotatingFileHandler(str(log_file), maxBytes=10_000_000, backupCount=5, encoding="utf-8")
    fh.setLevel(logging.DEBUG)
    file_fmt = logging.Formatter("%(asctime)s [%(levelname)-8s] %(name)s - %(funcName)s:%(lineno)d - %(message)s")
    fh.setFormatter(file_fmt)

    # Avoid duplicate handlers
    if not logger.handlers:
        logger.addHandler(ch)
        logger.addHandler(fh)

    return logger
