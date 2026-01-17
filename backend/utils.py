"""
Utilities for error handling, retry logic, structured logging, and JSON repair.
"""
import json
import logging
import time
import re
import random
from typing import Optional, Any, Callable, TypeVar, Dict
from functools import wraps
import sys

# Configure structured logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - [%(levelname)s] - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)

logger = logging.getLogger(__name__)

T = TypeVar('T')


class RequestTracer:
    """Context manager for request tracing across the pipeline."""
    
    def __init__(self, request_id: str, operation: str):
        self.request_id = request_id
        self.operation = operation
        self.start_time = None
    
    def __enter__(self):
        self.start_time = time.time()
        logger.info(f"[{self.request_id}] Starting: {self.operation}")
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed = time.time() - self.start_time
        if exc_type:
            logger.error(f"[{self.request_id}] Failed: {self.operation} after {elapsed:.2f}s - {exc_val}")
        else:
            logger.info(f"[{self.request_id}] Completed: {self.operation} in {elapsed:.2f}s")
        return False


def retry_with_backoff(
    max_retries: int = 3,
    initial_delay: float = 1.0,
    backoff_factor: float = 2.0,
    jitter: bool = True,
    exceptions: tuple = (Exception,)
):
    """
    Decorator for retry logic with exponential backoff and optional jitter.
    
    Args:
        max_retries: Maximum number of retry attempts
        initial_delay: Initial delay in seconds
        backoff_factor: Multiplier for delay after each retry
        jitter: Add random jitter to prevent thundering herd (default: True)
        exceptions: Tuple of exception types to catch
    """
    def decorator(func: Callable[..., T]) -> Callable[..., T]:
        @wraps(func)
        async def async_wrapper(*args, **kwargs) -> T:
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return await func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_retries:
                        # Add jitter: random value between 0 and delay
                        actual_delay = delay * (1 + random.random()) if jitter else delay
                        logger.warning(
                            f"Attempt {attempt + 1}/{max_retries} failed for {func.__name__}: {e}. "
                            f"Retrying in {actual_delay:.1f}s..."
                        )
                        time.sleep(actual_delay)
                        delay *= backoff_factor
                    else:
                        logger.error(
                            f"All {max_retries} retries exhausted for {func.__name__}: {e}"
                        )
            
            raise last_exception
        
        @wraps(func)
        def sync_wrapper(*args, **kwargs) -> T:
            delay = initial_delay
            last_exception = None
            
            for attempt in range(max_retries + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    last_exception = e
                    if attempt < max_retries:
                        # Add jitter: random value between 0 and delay
                        actual_delay = delay * (1 + random.random()) if jitter else delay
                        logger.warning(
                            f"Attempt {attempt + 1}/{max_retries} failed for {func.__name__}: {e}. "
                            f"Retrying in {actual_delay:.1f}s..."
                        )
                        time.sleep(actual_delay)
                        delay *= backoff_factor
                    else:
                        logger.error(
                            f"All {max_retries} retries exhausted for {func.__name__}: {e}"
                        )
            
            raise last_exception
        
        # Return appropriate wrapper based on function type
        import asyncio
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator


def repair_json(raw_json: str) -> Optional[Dict[str, Any]]:
    """
    Attempt to repair malformed JSON from LLM output.
    
    Common issues:
    - Markdown code fences (```json ... ```)
    - Trailing commas
    - Single quotes instead of double quotes
    - Missing closing braces
    
    Args:
        raw_json: Raw string that may contain JSON
        
    Returns:
        Parsed JSON dict or None if repair fails
    """
    if not raw_json or not isinstance(raw_json, str):
        logger.error("repair_json received empty or non-string input")
        return None
    
    # Remove markdown code fences
    cleaned = re.sub(r'^```json\s*\n?', '', raw_json, flags=re.IGNORECASE)
    cleaned = re.sub(r'\n?```\s*$', '', cleaned)
    
    # Remove leading/trailing whitespace
    cleaned = cleaned.strip()
    
    # Try parsing as-is first
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.warning(f"Initial JSON parse failed: {e}. Attempting repair...")
    
    # Attempt repairs
    repairs = [
        # Remove trailing commas before closing braces/brackets
        lambda s: re.sub(r',\s*([}\]])', r'\1', s),
        # Replace single quotes with double quotes (risky but common)
        lambda s: s.replace("'", '"'),
        # Remove comments (// or /* */)
        lambda s: re.sub(r'//.*$', '', s, flags=re.MULTILINE),
        lambda s: re.sub(r'/\*.*?\*/', '', s, flags=re.DOTALL),
    ]
    
    for repair_fn in repairs:
        try:
            repaired = repair_fn(cleaned)
            result = json.loads(repaired)
            logger.info("JSON successfully repaired")
            return result
        except json.JSONDecodeError:
            continue
    
    # Last resort: try to extract JSON object from text
    json_match = re.search(r'\{.*\}', cleaned, re.DOTALL)
    if json_match:
        try:
            result = json.loads(json_match.group(0))
            logger.info("JSON extracted from surrounding text")
            return result
        except json.JSONDecodeError:
            pass
    
    logger.error("All JSON repair attempts failed")
    return None


def validate_json_schema(data: Dict[str, Any], required_keys: list[str]) -> bool:
    """
    Validate that JSON contains required keys.
    
    Args:
        data: Parsed JSON dict
        required_keys: List of required top-level keys
        
    Returns:
        True if all required keys present, False otherwise
    """
    if not isinstance(data, dict):
        logger.error(f"Expected dict, got {type(data)}")
        return False
    
    missing = [key for key in required_keys if key not in data]
    if missing:
        logger.error(f"Missing required keys: {missing}")
        return False
    
    return True


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent path traversal attacks.
    
    Args:
        filename: User-provided filename
        
    Returns:
        Sanitized filename safe for filesystem operations
    """
    if not filename:
        return "unnamed_file"
    
    # Remove path separators and potentially dangerous characters
    sanitized = re.sub(r'[^\w\s.-]', '', filename)
    sanitized = sanitized.replace('..', '').replace('/', '').replace('\\', '')
    
    # Limit length
    if len(sanitized) > 255:
        sanitized = sanitized[:255]
    
    return sanitized or "unnamed_file"


def estimate_token_count(text: str) -> int:
    """
    Rough estimation of token count for context window management.
    Uses ~4 characters per token heuristic.
    
    Args:
        text: Input text
        
    Returns:
        Estimated token count
    """
    if not text:
        return 0
    return len(text) // 4


def truncate_to_token_limit(text: str, max_tokens: int = 32000) -> str:
    """
    Truncate text to fit within token limit with safety margin.
    
    Args:
        text: Input text
        max_tokens: Maximum allowed tokens (default: 32k for Qwen)
        
    Returns:
        Truncated text that fits within limit
    """
    estimated = estimate_token_count(text)
    if estimated <= max_tokens:
        return text
    
    # Add 10% safety margin
    safe_limit = int(max_tokens * 0.9)
    char_limit = safe_limit * 4
    
    truncated = text[:char_limit]
    logger.warning(
        f"Text truncated from ~{estimated} tokens to ~{safe_limit} tokens "
        f"to fit within {max_tokens} limit"
    )
    
    return truncated


def log_model_interaction(
    request_id: str,
    model: str,
    prompt_tokens: Optional[int],
    completion_tokens: Optional[int],
    operation: str
):
    """
    Log model interaction for observability.
    
    Args:
        request_id: Request tracking ID
        model: Model name
        prompt_tokens: Input token count
        completion_tokens: Output token count
        operation: Operation description
    """
    total = (prompt_tokens or 0) + (completion_tokens or 0)
    logger.info(
        f"[{request_id}] Model={model} Operation={operation} "
        f"Tokens(prompt={prompt_tokens}, completion={completion_tokens}, total={total})"
    )
