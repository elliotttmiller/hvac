"""
Utilities for error handling, retry logic, structured logging, and JSON repair.
"""
import json
import logging
import time
import re
import random
from typing import Optional, Any, Callable, TypeVar, Dict, List
from functools import wraps
import sys

# Import code limits for validation
try:
    from backend.constants import MN_HEATING_OVERSIZE_LIMIT, MN_COOLING_OVERSIZE_LIMIT
except ImportError:
    # Fallback if constants not available
    MN_HEATING_OVERSIZE_LIMIT = 0.40
    MN_COOLING_OVERSIZE_LIMIT = 0.15

# Validation constants
COOLING_LOAD_TOLERANCE = 0.05  # 5% tolerance for sensible + latent = total
OVERSIZE_CALCULATION_TOLERANCE = 1.0  # 1% tolerance for oversize percentage calculations
MIN_CFM_PER_TON = 350  # Minimum CFM per ton for cooling
MAX_CFM_PER_TON = 450  # Maximum CFM per ton for cooling

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


def is_equipment_modulating(equipment_stages: str) -> bool:
    """
    Determines if equipment is modulating/variable-speed type.
    
    Modulating equipment is exempt from MN Rule 1322.0403 40% heating oversize limit.
    
    Args:
        equipment_stages: Equipment stage control description
        
    Returns:
        True if equipment is modulating or variable-speed
    """
    if not equipment_stages or not isinstance(equipment_stages, str):
        return False
    
    stages_lower = equipment_stages.lower()
    return "modulating" in stages_lower or "variable" in stages_lower


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


def validate_hvac_analysis_output(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Comprehensive validation and enhancement of HVAC analysis output.
    Checks for data consistency, calculates missing fields, and adds warnings.
    
    This function performs automatic corrections:
    - Recalculates oversize percentages if reported values are inconsistent (>1% difference)
    - Updates compliance status to NON_COMPLIANT if equipment exceeds code limits
    - Validates equipment type against staging (modulating exempt from 40% limit)
    - Sets default confidence score (0.5) if invalid or missing
    - Validates sensible + latent = total for cooling loads
    
    Validation checks:
    - Required sections present
    - Heating oversize ≤ 40% (MN Rule 1322.0403) using MN_HEATING_OVERSIZE_LIMIT constant
      EXCEPTION: Modulating/variable-speed equipment exempt from limit
    - Cooling oversize ≤ 15% (MN Rule 1322.0404) using MN_COOLING_OVERSIZE_LIMIT constant
    - Confidence score in range [0.0, 1.0]
    - Airflow validation: CFM/ton should be 350-450 for cooling
    
    Args:
        data: Parsed JSON output from analysis
        
    Returns:
        Enhanced data with validation status, warnings, and automatic corrections applied.
        Adds "_validation" metadata field with "passed" boolean and "warnings" list.
    """
    if not isinstance(data, dict):
        return {"error": "Invalid data structure", "validation_passed": False}
    
    warnings = []
    validation_passed = True
    
    # Check for required top-level keys
    required_keys = ["project_info", "load_calculations", "equipment_analysis", "compliance_status"]
    missing_keys = [key for key in required_keys if key not in data]
    if missing_keys:
        warnings.append(f"Missing required sections: {', '.join(missing_keys)}")
        validation_passed = False
    
    # Validate equipment analysis if present
    if "equipment_analysis" in data and isinstance(data["equipment_analysis"], dict):
        eq_analysis = data["equipment_analysis"]
        
        # Check if equipment is modulating (exempt from heating oversize limit)
        equipment_stages = eq_analysis.get("equipment_stages", "")
        is_modulating = is_equipment_modulating(equipment_stages)
        
        # Check for heating oversize calculation
        if "proposed_heating_capacity" in eq_analysis and "total_heating_load" in data.get("load_calculations", {}):
            proposed = eq_analysis.get("proposed_heating_capacity", 0)
            load = data["load_calculations"].get("total_heating_load", 0)
            
            if load > 0:
                actual_oversize = ((proposed / load) - 1) * 100
                reported_oversize = eq_analysis.get("heating_oversize_percent", 0)
                
                # Check if calculation is consistent (within tolerance)
                if abs(actual_oversize - reported_oversize) > OVERSIZE_CALCULATION_TOLERANCE:
                    warnings.append(
                        f"Heating oversize calculation inconsistent: "
                        f"Reported {reported_oversize:.1f}%, Calculated {actual_oversize:.1f}%"
                    )
                    # Use calculated value
                    eq_analysis["heating_oversize_percent"] = round(actual_oversize, 1)
                
                # Validate compliance status (with modulating exception)
                if actual_oversize > (MN_HEATING_OVERSIZE_LIMIT * 100):
                    if is_modulating:
                        # Modulating equipment is exempt
                        if eq_analysis.get("heating_status") == "NON_COMPLIANT":
                            eq_analysis["heating_status"] = "EXEMPT_MODULATING"
                            warnings.append("Heating equipment is modulating - exempt from 40% oversize limit")
                    else:
                        # Single-stage or two-stage must comply
                        if eq_analysis.get("heating_status") != "NON_COMPLIANT":
                            warnings.append(f"Heating equipment exceeds {int(MN_HEATING_OVERSIZE_LIMIT * 100)}% oversize limit (MN Rule 1322.0403)")
                            eq_analysis["heating_status"] = "NON_COMPLIANT"
        
        # Check for cooling oversize calculation
        if "proposed_cooling_capacity" in eq_analysis and "total_cooling_load" in data.get("load_calculations", {}):
            proposed = eq_analysis.get("proposed_cooling_capacity", 0)
            load = data["load_calculations"].get("total_cooling_load", 0)
            
            if load > 0:
                actual_oversize = ((proposed / load) - 1) * 100
                reported_oversize = eq_analysis.get("cooling_oversize_percent", 0)
                
                if abs(actual_oversize - reported_oversize) > OVERSIZE_CALCULATION_TOLERANCE:
                    warnings.append(
                        f"Cooling oversize calculation inconsistent: "
                        f"Reported {reported_oversize:.1f}%, Calculated {actual_oversize:.1f}%"
                    )
                    eq_analysis["cooling_oversize_percent"] = round(actual_oversize, 1)
                
                # Validate compliance status
                if actual_oversize > (MN_COOLING_OVERSIZE_LIMIT * 100):
                    if eq_analysis.get("cooling_status") != "NON_COMPLIANT":
                        warnings.append(f"Cooling equipment exceeds {int(MN_COOLING_OVERSIZE_LIMIT * 100)}% oversize limit (MN Rule 1322.0404)")
                        eq_analysis["cooling_status"] = "NON_COMPLIANT"
        
        # Validate airflow per ton for cooling
        if "airflow_per_ton_cooling" in eq_analysis and eq_analysis["airflow_per_ton_cooling"]:
            cfm_per_ton = eq_analysis["airflow_per_ton_cooling"]
            if cfm_per_ton < MIN_CFM_PER_TON or cfm_per_ton > MAX_CFM_PER_TON:
                warnings.append(
                    f"Airflow per ton ({cfm_per_ton:.0f} CFM/ton) outside typical range "
                    f"({MIN_CFM_PER_TON}-{MAX_CFM_PER_TON} CFM/ton). "
                    "Check for duct restrictions or oversized equipment."
                )
    
    # Validate cooling load components if present
    if "load_calculations" in data and isinstance(data["load_calculations"], dict):
        load_calc = data["load_calculations"]
        
        # Check sensible + latent = total for cooling
        if all(k in load_calc for k in ["total_cooling_load_sensible", "total_cooling_load_latent", "total_cooling_load"]):
            sensible = load_calc.get("total_cooling_load_sensible", 0)
            latent = load_calc.get("total_cooling_load_latent", 0)
            total = load_calc.get("total_cooling_load", 0)
            
            calculated_total = sensible + latent
            if total > 0 and abs(calculated_total - total) > (total * COOLING_LOAD_TOLERANCE):
                warnings.append(
                    f"Cooling load components don't sum: Sensible {sensible} + Latent {latent} = {calculated_total}, "
                    f"but Total reported as {total}"
                )
    
    # Check confidence score validity
    if "confidence_score" in data:
        score = data["confidence_score"]
        if not isinstance(score, (int, float)) or score < 0 or score > 1:
            warnings.append(f"Invalid confidence score: {score} (must be 0.0-1.0)")
            data["confidence_score"] = 0.5  # Default moderate confidence
    
    # Add validation metadata
    data["_validation"] = {
        "passed": validation_passed and len(warnings) == 0,
        "warnings": warnings,
        "timestamp": time.time()
    }
    
    if warnings:
        logger.warning(f"Analysis output validation warnings: {warnings}")
    else:
        logger.info("Analysis output validation passed")
    
    return data


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
    More accurate token count estimation for context window management.
    Uses word-based heuristic suitable for Qwen tokenizer.
    
    Algorithm: Counts words and multiplies by 1.3 tokens/word, which is
    empirically accurate for English technical text with Qwen tokenization.
    This replaces the older 4-chars-per-token heuristic which was less accurate.
    
    Args:
        text: Input text
        
    Returns:
        Estimated token count
    """
    if not text:
        return 0
    
    # Qwen tokenizer roughly:
    # - English words: ~1.3 tokens per word
    # - Numbers/symbols: ~1 token per 3-4 chars
    # - Whitespace: not counted
    
    words = len(text.split())
    # Heuristic: 1.3 tokens per word for English text
    return int(words * 1.3)


def prioritize_extracted_content(pages_data: List[str], max_tokens: int = 28000) -> str:
    """
    Intelligently prioritize and merge extracted page content.
    Ensures critical information is retained when truncation is needed.
    
    Args:
        pages_data: List of extracted text from each page
        max_tokens: Maximum token budget
        
    Returns:
        Optimized aggregated text
    """
    if not pages_data:
        return ""
    
    # Priority keywords for HVAC analysis
    priority_keywords = [
        'btu', 'ton', 'cfm', 'afue', 'seer', 'hspf',  # Equipment specs
        'furnace', 'boiler', 'heat pump', 'air conditioner', 'condenser',  # Equipment types
        'capacity', 'efficiency', 'model',  # Equipment details
        'sqft', 'square feet', 'area', 'dimension',  # Space measurements
        'window', 'wall', 'ceiling', 'basement', 'floor',  # Building components
        'r-value', 'r-', 'u-value', 'u=', 'insulation',  # Thermal properties
        'duct', 'supply', 'return', 'exhaust',  # HVAC distribution
        'thermostat', 'controller', 'sensor', 'valve',  # Controls
        'load', 'calculation', 'heating', 'cooling'  # Analysis terms
    ]
    
    # Score each page by priority content
    page_scores = []
    for i, page_text in enumerate(pages_data):
        text_lower = page_text.lower()
        score = sum(1 for keyword in priority_keywords if keyword in text_lower)
        tokens = estimate_token_count(page_text)
        page_scores.append((i, score, tokens, page_text))
    
    # Sort by score (descending), keeping original order for ties
    page_scores.sort(key=lambda x: (-x[1], x[0]))
    
    # Build aggregated content within budget
    aggregated_parts = []
    total_tokens = 0
    safety_margin = int(max_tokens * 0.9)  # 10% safety margin
    
    for page_num, score, tokens, text in page_scores:
        if total_tokens + tokens <= safety_margin:
            aggregated_parts.append((page_num, text))
            total_tokens += tokens
        else:
            # Try to fit partial content from high-priority pages
            if score > 5:  # High priority page
                remaining_tokens = safety_margin - total_tokens
                if remaining_tokens > 100:  # Worth including partial
                    char_limit = remaining_tokens * 4
                    truncated = text[:char_limit]
                    aggregated_parts.append((page_num, truncated))
                    logger.info(f"Page {page_num+1} partially included (high priority, {score} keywords)")
                    total_tokens = safety_margin
                    break
    
    # Re-sort by page number for natural flow
    aggregated_parts.sort(key=lambda x: x[0])
    
    result = "\n\n".join(text for _, text in aggregated_parts)
    
    if len(aggregated_parts) < len(pages_data):
        omitted = len(pages_data) - len(aggregated_parts)
        logger.warning(
            f"Context prioritization: Included {len(aggregated_parts)}/{len(pages_data)} pages "
            f"({total_tokens} tokens). Omitted {omitted} low-priority pages."
        )
    else:
        logger.info(f"All {len(pages_data)} pages included ({total_tokens} tokens)")
    
    return result


def truncate_to_token_limit(text: str, max_tokens: int = 32000) -> str:
    """
    Truncate text to fit within token limit with safety margin.
    Now uses improved token estimation.
    
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
    
    # Calculate word limit based on token estimation (1.3 tokens per word)
    words = text.split()
    target_words = int(safe_limit / 1.3)
    truncated_words = words[:target_words]
    truncated = ' '.join(truncated_words)
    
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
