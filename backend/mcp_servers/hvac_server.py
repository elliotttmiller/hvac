from mcp.server.fastmcp import FastMCP
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

mcp = FastMCP("hvac-logic")


@mcp.tool()
def calculate_manual_j_load(area_sqft: float, u_value: float, is_basement: bool = False) -> int:
    """
    Calculates heating load based on MN Climate Zone 7 physics.
    Formula: Area * U-Value * DeltaT (87 degrees).
    
    Args:
        area_sqft: Area in square feet (must be positive)
        u_value: U-value thermal transmittance (must be positive)
        is_basement: Whether this is a basement (applies 0.85 reduction factor)
        
    Returns:
        Heating load in BTU/h (integer)
        
    Raises:
        ValueError: If inputs are invalid
    """
    if area_sqft <= 0:
        logger.error(f"Invalid area: {area_sqft}")
        raise ValueError(f"area_sqft must be positive, got {area_sqft}")
    
    if u_value <= 0:
        logger.error(f"Invalid u_value: {u_value}")
        raise ValueError(f"u_value must be positive, got {u_value}")
    
    # MN Climate Zone 7: Design temp -17°F, indoor 70°F -> ΔT = 87°F
    delta_t = 87
    load = area_sqft * u_value * delta_t
    
    if is_basement:
        # Basements have reduced heat loss (ground temperature moderation)
        load = load * 0.85
    
    result = int(round(load))
    logger.info(f"Calculated load: {result} BTU/h (area={area_sqft}, u={u_value}, basement={is_basement})")
    
    return result


@mcp.tool()
def check_compliance(load: int, capacity: int) -> str:
    """
    Checks MN Rule 1322.0403 (Max 40% Oversizing for Heating).
    
    This is a deterministic calculation decoupled from AI probabilistic generation.
    The 40% limit prevents short-cycling and efficiency loss.
    
    Args:
        load: Design heating load in BTU/h (must be positive)
        capacity: Proposed equipment capacity in BTU/h (must be positive)
        
    Returns:
        Compliance status string with oversize percentage
        
    Raises:
        ValueError: If inputs are invalid
    """
    if load <= 0:
        logger.error(f"Invalid load: {load}")
        raise ValueError(f"Load must be positive, got {load}")
    
    if capacity <= 0:
        logger.error(f"Invalid capacity: {capacity}")
        raise ValueError(f"Capacity must be positive, got {capacity}")

    ratio = capacity / load
    limit = 1.40  # MN Rule 1322.0403: 40% max oversize
    oversize_pct = round((ratio - 1) * 100, 1)

    status = "PASS" if ratio <= limit else "FAIL"
    
    message = f"Status: {status}, Oversize: {oversize_pct}%, Limit: 40%"
    logger.info(f"Compliance check: {message} (load={load}, capacity={capacity})")

    return message


if __name__ == "__main__":
    mcp.run()
