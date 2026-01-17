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
                else:
                    # Equipment passes validation - set to COMPLIANT if not already set
                    if eq_analysis.get("heating_status") in ["UNKNOWN", None, ""]:
                        eq_analysis["heating_status"] = "COMPLIANT"
        
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
                else:
                    # Equipment passes validation - set to COMPLIANT if not already set
                    if eq_analysis.get("cooling_status") in ["UNKNOWN", None, ""]:
                        eq_analysis["cooling_status"] = "COMPLIANT"
        
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
    
    # Sync equipment sizing compliance status with equipment_analysis status
    if "compliance_status" in data and isinstance(data["compliance_status"], dict):
        if "equipment_sizing_compliance" in data["compliance_status"]:
            if "equipment_analysis" in data and isinstance(data["equipment_analysis"], dict):
                eq_status = data["compliance_status"]["equipment_sizing_compliance"]
                eq_analysis = data["equipment_analysis"]
                
                # Sync heating status
                if "heating_status" in eq_analysis:
                    eq_status["heating_status"] = eq_analysis["heating_status"]
                
                # Sync cooling status  
                if "cooling_status" in eq_analysis:
                    eq_status["cooling_status"] = eq_analysis["cooling_status"]
        
        # Update overall compliance status based on equipment sizing
        if "equipment_sizing_compliance" in data["compliance_status"]:
            sizing = data["compliance_status"]["equipment_sizing_compliance"]
            heating_status = sizing.get("heating_status", "UNKNOWN")
            cooling_status = sizing.get("cooling_status", "UNKNOWN")
            
            # Overall status is NON_COMPLIANT if either system is NON_COMPLIANT
            if heating_status == "NON_COMPLIANT" or cooling_status == "NON_COMPLIANT":
                data["compliance_status"]["overall_status"] = "NON_COMPLIANT"
            elif heating_status == "COMPLIANT" and cooling_status == "COMPLIANT":
                data["compliance_status"]["overall_status"] = "COMPLIANT"
            else:
                data["compliance_status"]["overall_status"] = "REVIEW_REQUIRED"
    
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


def normalize_analysis_keys(data: Optional[Dict[str, Any]]) -> Optional[Dict[str, Any]]:
    """
    Normalize alternate top-level shapes emitted by LLMs into the canonical
    analysis schema expected by the rest of the pipeline.

    Currently handles variants like:
    {
      "HVACPlans": {
         "ComplianceReport": { ... }
      }
    }

    and will attempt to extract sensible mappings for:
    - project_info
    - load_calculations
    - equipment_analysis
    - compliance_status

    The function is defensive: if it cannot map a field cleanly it will
    preserve the original content under a reasonable canonical key.
    """
    if not data or not isinstance(data, dict):
        return data

    # If the canonical keys already exist, return as-is
    canonical = {"project_info", "load_calculations", "equipment_analysis", "compliance_status"}
    if canonical.issubset(set(data.keys())):
        return data

    normalized: Dict[str, Any] = {}

    # Heuristic 1: data contains HVACPlans -> ComplianceReport
    if "HVACPlans" in data and isinstance(data["HVACPlans"], dict):
        hp = data["HVACPlans"]
        # ComplianceReport -> compliance_status + equipment analysis
        if "ComplianceReport" in hp and isinstance(hp["ComplianceReport"], dict):
            comp = hp["ComplianceReport"]

            # Project info: map SystemLocation -> location or project_name
            proj: Dict[str, Any] = {}
            if comp.get("SystemLocation"):
                proj["location"] = comp.get("SystemLocation")
            if comp.get("ProjectName"):
                proj["project_name"] = comp.get("ProjectName")
            if comp.get("SystemInstallationDate"):
                proj.setdefault("notes", "")
                proj["installation_date"] = comp.get("SystemInstallationDate")

            normalized["project_info"] = proj

            # Equipment analysis: extract obvious fields
            eq: Dict[str, Any] = {}
            if comp.get("SystemType"):
                eq["system_type"] = comp.get("SystemType")
            if comp.get("SystemModel"):
                eq["model"] = comp.get("SystemModel")
            if comp.get("SystemSerialNumber"):
                eq["serial_number"] = comp.get("SystemSerialNumber")
            if comp.get("SystemInstallationDate"):
                eq["installation_date"] = comp.get("SystemInstallationDate")

            # If SystemCompliance present, surface under compliance_status
            if comp.get("SystemCompliance") and isinstance(comp.get("SystemCompliance"), dict):
                normalized["compliance_status"] = comp.get("SystemCompliance")
            else:
                # fallback: if there are any compliance-like fields, wrap them
                compliance_fields = {k: v for k, v in comp.items() if "compliance" in k.lower()}
                if compliance_fields:
                    normalized["compliance_status"] = compliance_fields

            # put equipment_analysis even if small
            normalized["equipment_analysis"] = eq

            # load_calculations not present in this variant, keep empty placeholder
            normalized.setdefault("load_calculations", {})

            # Merge any other useful top-level items from hp that look like loads
            # e.g., "Loads", "LoadCalculations", etc.
            for alt in ("Loads", "LoadCalculations", "load_calculations", "loads"):
                if alt in hp and isinstance(hp[alt], dict):
                    normalized["load_calculations"] = hp[alt]

            # Return merged structure
            return normalized

    # Heuristic 2: lower-case key mapping - if keys look like alternatives
    lower_map = {k.lower(): k for k in data.keys()}
    # direct lower-case matches
    if "hvacplans" in lower_map:
        # recurse into the same mapping above
        inner = data.get(lower_map["hvacplans"]) or {}
        if isinstance(inner, dict) and "compliancereport" in {k.lower(): k for k in inner.keys()}:
            comp_key = [k for k in inner.keys() if k.lower() == "compliancereport"][0]
            comp = inner.get(comp_key, {})
            # reuse same simple mapping
            return normalize_analysis_keys({"HVACPlans": {"ComplianceReport": comp}})

    # If nothing matched, return original data unchanged
    return data


def construct_report_from_extracted_text(text: str) -> Dict[str, Any]:
    """
    Build a comprehensive, well-formed analysis report from the extracted text.

    This function uses conservative heuristics and engineering defaults to populate
    a complete analysis structure matching the Pydantic models, ensuring the API
    always returns valid, predictable JSON even when vision extraction is incomplete.
    
    Returns comprehensive structure with:
    - ProjectInfo (climate zone, design temps, building details)
    - LoadCalculations (heating/cooling with infiltration, ventilation, internal gains)
    - EquipmentAnalysis (full equipment details, sizing, efficiency)
    - ComplianceStatusReport (all compliance checks)
    """
    # Defensive defaults
    default_heating = 40000
    heating = None

    if not text or not isinstance(text, str):
        text = ""

    # Find all large integer numbers (allow commas)
    nums = re.findall(r"(\d{1,3}(?:,\d{3})+|\d{4,7})", text)
    cleaned_nums: list[int] = []
    for n in nums:
        try:
            cleaned = int(n.replace(',', ''))
            cleaned_nums.append(cleaned)
        except Exception:
            continue

    if cleaned_nums:
        # Choose the largest plausible number as heating load proxy
        heating = max(cleaned_nums)
        # Cap unrealistic values
        if heating > 2_000_000:
            heating = default_heating
    else:
        heating = default_heating

    # Estimate cooling as 60% of heating by conservative default
    cooling = int(round(heating * 0.6))
    
    # Estimate building area from load (conservative: 40 BTU/sqft)
    estimated_sqft = int(heating / 40)

    # Proposed equipment capacities (10% oversize)
    proposed_heating_capacity = int(round(heating * 1.1))
    proposed_cooling_capacity = int(round(cooling * 1.1))
    
    # Calculate load components
    cooling_sensible = int(round(cooling * 0.75))  # Typical 75/25 split
    cooling_latent = int(round(cooling * 0.25))
    
    # Estimate infiltration/ventilation loads (typical ~20% of total load)
    infiltration_heating_btu = int(round(heating * 0.15))
    infiltration_cooling_sensible = int(round(cooling_sensible * 0.15))
    infiltration_cooling_latent = int(round(cooling_latent * 0.10))
    
    # Estimate ventilation requirement (ASHRAE 62.2: ~7.5 CFM per person + 1 CFM/100 sqft)
    estimated_occupants = max(2, int(estimated_sqft / 600))  # ~600 sqft per person
    ventilation_cfm = (estimated_occupants * 7.5) + (estimated_sqft * 0.01)
    
    # Estimate internal gains (~10-15% of cooling load)
    people_load = estimated_occupants * 250  # 250 BTU/hr per person
    lighting_load = int(estimated_sqft * 1.5)  # 1.5 W/sqft
    appliances_load = int(estimated_sqft * 1.0)  # 1.0 W/sqft
    total_internal_gains = people_load + lighting_load + appliances_load
    
    # Calculate equipment tonnage and airflow
    cooling_tons = cooling / 12000
    heating_tons = heating / 12000
    airflow_required_cfm = int(cooling_tons * 400)  # 400 CFM/ton typical
    airflow_per_ton = 400.0

    # Try to pick up equipment model (simple alpha-numeric tokens with letters)
    equipment_models = re.findall(r"([A-Za-z0-9\-]{4,40})", text)
    equipment_model = None
    for token in equipment_models:
        # filter out pure numeric tokens
        if any(c.isalpha() for c in token) and len(token) > 3:
            equipment_model = token
            break

    # Build comprehensive report structure matching Pydantic models
    report = {
        "project_info": {
            "project_name": "Untitled project",
            "location": "",
            "climate_zone": "7",  # Minnesota default
            "design_temp_heating_f": -17,  # MN Climate Zone 7
            "design_temp_cooling_f": 89,  # MN summer design
            "building_type": "residential",
            "total_conditioned_area_sqft": estimated_sqft,
            "design_humidity_winter_percent": 30,
            "design_humidity_summer_percent": 50,
            "design_data_source": "vision_extraction"
        },
        "load_calculations": {
            "total_heating_load": heating,
            "total_cooling_load": cooling,
            "total_cooling_load_sensible": cooling_sensible,
            "total_cooling_load_latent": cooling_latent,
            "calculation_method": "Manual J (estimated)",
            "heating_load_breakdown": [
                {"component": "envelope", "btu": int(heating * 0.50)},
                {"component": "infiltration", "btu": infiltration_heating_btu},
                {"component": "ventilation", "btu": int(heating * 0.20)},
                {"component": "other", "btu": int(heating * 0.15)}
            ],
            "cooling_load_breakdown": [
                {"component": "envelope_sensible", "btu": int(cooling_sensible * 0.50)},
                {"component": "infiltration_sensible", "btu": infiltration_cooling_sensible},
                {"component": "internal_gains", "btu": total_internal_gains},
                {"component": "latent", "btu": cooling_latent}
            ],
            "infiltration_ventilation": {
                "infiltration_cfm": int(estimated_sqft * 0.15),  # ~0.15 air changes/hr
                "infiltration_load_heating_btu": infiltration_heating_btu,
                "infiltration_load_cooling_sensible_btu": infiltration_cooling_sensible,
                "infiltration_load_cooling_latent_btu": infiltration_cooling_latent,
                "ventilation_cfm_required": int(ventilation_cfm),
                "ventilation_method": "ASHRAE 62.2 calculation"
            },
            "internal_gains": {
                "people_count": estimated_occupants,
                "people_load_btu": people_load,
                "lighting_load_btu": lighting_load,
                "appliances_load_btu": appliances_load,
                "total_internal_gains_btu": total_internal_gains
            }
        },
        "equipment_analysis": {
            "heating_status": "UNKNOWN",
            "cooling_status": "UNKNOWN",
            "proposed_heating_capacity": proposed_heating_capacity,
            "heating_oversize_percent": round(((proposed_heating_capacity / heating) - 1) * 100, 1) if heating else 0,
            "proposed_cooling_capacity": proposed_cooling_capacity,
            "cooling_oversize_percent": round(((proposed_cooling_capacity / cooling) - 1) * 100, 1) if cooling else 0,
            "equipment_type": "estimated",
            "equipment_stages": "",  # Will be determined by validation
            "fuel_type": "natural gas",  # MN common default
            "equipment_model": equipment_model or "",
            "manufacturer": "",
            "efficiency_heating": 95.0,  # Typical modern furnace AFUE
            "efficiency_cooling": 14.0,  # Typical SEER
            "airflow_rated_cfm": airflow_required_cfm,
            "airflow_required_cfm": airflow_required_cfm,
            "airflow_per_ton_cooling": airflow_per_ton
        },
        "compliance_status": {
            "violations": [],
            "overall_status": "UNKNOWN",
            "equipment_sizing_compliance": {
                "heating_status": "UNKNOWN",
                "cooling_status": "UNKNOWN",
                "heating_rule": "MN Rule 1322.0403 (40% max oversize)",
                "cooling_rule": "MN Rule 1322.0404 (15% max oversize)"
            },
            "ventilation_compliance": {
                "required_cfm": int(ventilation_cfm),
                "provided_cfm": None,
                "ventilation_method": None,
                "status": "UNKNOWN",
                "standard": "ASHRAE 62.2"
            },
            "duct_insulation_compliance": {
                "supply_duct_location": None,
                "return_duct_location": None,
                "supply_insulation_r_value": None,
                "return_insulation_r_value": None,
                "required_supply_r_value": 8.0,
                "required_return_r_value": 6.0,
                "status": "UNKNOWN",
                "leakage_test_required": True,
                "sealing_required": True
            },
            "combustion_air_compliance": {
                "appliance_type": None,
                "btu_input_total": None,
                "combustion_air_required": False,
                "combustion_air_provided": None,
                "status": "NOT_APPLICABLE",
                "code_reference": "MN Chapter 1346.5304"
            },
            "economizer_compliance": {
                "required": cooling > 54000,  # >4.5 tons
                "provided": None,
                "economizer_type": None,
                "status": "NOT_APPLICABLE" if cooling <= 54000 else "UNKNOWN",
                "threshold": "54,000 BTU/h (4.5 tons)"
            },
            "freeze_protection_compliance": {
                "hydronic_coils_present": False,
                "freeze_stat_provided": None,
                "set_point_f": None,
                "hardwired_shutdown": None,
                "status": "NOT_APPLICABLE",
                "critical_for_climate_zone_7": True
            }
        },
        "confidence_score": 0.5,  # Lower for estimated values
        "reasoning": f"Comprehensive report generated from vision extraction with engineering defaults. Extracted text excerpt: {text[:300]}"
    }

    return report


def normalize_analysis_keys(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize common alternate top-level keys from LLM output to the canonical
    schema keys expected by the application. This helps when the model emits
    slightly different names (e.g., 'project' vs 'project_info'). The function
    performs a shallow mapping of known aliases and returns a new dict.
    """
    if not isinstance(data, dict):
        return data

    aliases = {
        'project_info': ['project', 'projectInfo', 'project_details', 'projectDetails'],
        'load_calculations': ['loads', 'loadCalc', 'load_calcs', 'loadCalculations'],
        'equipment_analysis': ['equipment', 'equipmentSizing', 'equipment_sizing', 'equipmentAnalysis'],
        'compliance_status': ['compliance', 'code_compliance', 'complianceStatus'],
    }

    out = dict(data)  # shallow copy to avoid mutating original
    for canonical, keys in aliases.items():
        if canonical in out:
            continue
        for k in keys:
            if k in out:
                out[canonical] = out.pop(k)
                logger.info(f"normalize_analysis_keys: mapped '{k}' -> '{canonical}'")
                break

    return out


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
