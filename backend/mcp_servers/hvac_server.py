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


@mcp.tool()
def calculate_ventilation_cfm(floor_area_sqft: float, num_bedrooms: int) -> dict:
    """
    Calculates required mechanical ventilation per ASHRAE 62.2 for Minnesota residential.
    Formula: CFM = 0.03 × Floor Area + 7.5 × (Bedrooms + 1)
    
    Args:
        floor_area_sqft: Total conditioned floor area in square feet
        num_bedrooms: Number of bedrooms in dwelling
        
    Returns:
        Dictionary with ventilation requirements and recommendations
        
    Raises:
        ValueError: If inputs are invalid
    """
    if floor_area_sqft <= 0:
        logger.error(f"Invalid floor area: {floor_area_sqft}")
        raise ValueError(f"floor_area_sqft must be positive, got {floor_area_sqft}")
    
    if num_bedrooms < 0:
        logger.error(f"Invalid bedroom count: {num_bedrooms}")
        raise ValueError(f"num_bedrooms must be non-negative, got {num_bedrooms}")
    
    # ASHRAE 62.2 formula for continuous ventilation
    required_cfm = 0.03 * floor_area_sqft + 7.5 * (num_bedrooms + 1)
    required_cfm = round(required_cfm, 1)
    
    result = {
        "required_cfm_continuous": required_cfm,
        "standard": "ASHRAE 62.2",
        "application": "Residential continuous ventilation",
        "recommendations": [
            "Use ERV (Energy Recovery Ventilator) for best efficiency in Climate Zone 7",
            "HRV (Heat Recovery Ventilator) acceptable alternative",
            f"Intermittent ventilation requires higher CFM (multiply by runtime factor)",
            "Natural infiltration may provide credit (requires blower door test)"
        ]
    }
    
    logger.info(f"Ventilation calculated: {required_cfm} CFM (area={floor_area_sqft}, bedrooms={num_bedrooms})")
    return result


@mcp.tool()
def calculate_combustion_air(btu_input: int, appliance_type: str = "category_i") -> dict:
    """
    Calculates combustion air requirements per MN Chapter 1346.5304 (IFGC).
    
    Args:
        btu_input: Total BTU/h input of all fuel-burning appliances
        appliance_type: Type of appliance - "category_i" (80% AFUE) or "sealed_combustion" (90%+ AFUE)
        
    Returns:
        Dictionary with combustion air opening sizes and requirements
        
    Raises:
        ValueError: If inputs are invalid
    """
    if btu_input <= 0:
        logger.error(f"Invalid BTU input: {btu_input}")
        raise ValueError(f"btu_input must be positive, got {btu_input}")
    
    if appliance_type not in ["category_i", "sealed_combustion"]:
        logger.error(f"Invalid appliance type: {appliance_type}")
        raise ValueError(f"appliance_type must be 'category_i' or 'sealed_combustion', got {appliance_type}")
    
    if appliance_type == "sealed_combustion":
        # Sealed combustion (90%+ AFUE condensing) doesn't require combustion air openings
        result = {
            "combustion_air_required": False,
            "appliance_type": "Sealed Combustion (90%+ AFUE)",
            "notes": [
                "Direct vent furnace uses outdoor air piped directly to burner",
                "No combustion air openings required in mechanical room",
                "Complies with tight construction requirements",
                "Best practice for energy efficiency"
            ]
        }
    else:
        # Category I (atmospheric venting) requires two openings
        opening_size_sq_in = btu_input / 1000  # 1 sq in per 1000 BTU/h per opening
        opening_size_sq_in = max(100, opening_size_sq_in)  # Minimum 100 sq in
        
        # Calculate equivalent round duct diameter
        import math
        diameter_inches = 2 * math.sqrt(opening_size_sq_in / math.pi)
        
        # For ducted outdoor air (stricter requirement)
        ducted_outdoor_size = btu_input / 4000  # 1 sq in per 4000 BTU/h
        ducted_diameter = 2 * math.sqrt(ducted_outdoor_size / math.pi)
        
        result = {
            "combustion_air_required": True,
            "appliance_type": "Category I Atmospheric Venting (80% AFUE)",
            "btu_input_total": btu_input,
            "two_opening_method": {
                "opening_size_each_sq_in": round(opening_size_sq_in, 1),
                "equivalent_round_duct_inches": round(diameter_inches, 1),
                "location": "One within 12 inches of ceiling, one within 12 inches of floor"
            },
            "ducted_outdoor_air_method": {
                "duct_size_sq_in": round(ducted_outdoor_size, 1),
                "equivalent_round_duct_inches": round(ducted_diameter, 1),
                "note": "Ducted combustion air preferred per MN code"
            },
            "requirements": [
                "Two permanent openings required (high and low)",
                "Each opening must communicate with outdoor air (directly or by duct)",
                "Openings cannot be blocked or restricted",
                "Louvers/grilles reduce net free area (apply correction factor)",
                "CO detector required near sleeping areas and mechanical room"
            ]
        }
    
    logger.info(f"Combustion air calculated: {btu_input} BTU/h, type={appliance_type}")
    return result


@mcp.tool()
def check_duct_insulation_compliance(duct_location: str, insulation_r_value: float) -> dict:
    """
    Checks duct insulation compliance with MN Energy Code 1322.0700.
    
    Args:
        duct_location: Location of duct - "unconditioned" or "conditioned"
        insulation_r_value: R-value of installed insulation
        
    Returns:
        Dictionary with compliance status and recommendations
        
    Raises:
        ValueError: If inputs are invalid
    """
    if duct_location not in ["unconditioned", "conditioned"]:
        logger.error(f"Invalid duct location: {duct_location}")
        raise ValueError(f"duct_location must be 'unconditioned' or 'conditioned', got {duct_location}")
    
    if insulation_r_value < 0:
        logger.error(f"Invalid R-value: {insulation_r_value}")
        raise ValueError(f"insulation_r_value must be non-negative, got {insulation_r_value}")
    
    if duct_location == "conditioned":
        # No insulation required in conditioned space
        result = {
            "compliant": True,
            "location": "Conditioned Space",
            "required_r_value": 0,
            "actual_r_value": insulation_r_value,
            "status": "COMPLIANT - No insulation required in conditioned space",
            "note": "Best practice: Locate all ducts in conditioned space to eliminate losses"
        }
    else:
        # Unconditioned space: R-8 minimum for supply, R-6 for return
        # Assume supply duct for strictest requirement
        required_r_value = 8.0
        compliant = insulation_r_value >= required_r_value
        
        result = {
            "compliant": compliant,
            "location": "Unconditioned Space (Attic, Crawlspace, Garage)",
            "required_r_value_supply": 8.0,
            "required_r_value_return": 6.0,
            "actual_r_value": insulation_r_value,
            "status": "COMPLIANT" if compliant else "NON-COMPLIANT",
            "deficiency": 0 if compliant else round(required_r_value - insulation_r_value, 1)
        }
        
        if not compliant:
            result["violation"] = f"Insulation R-{insulation_r_value} is below R-{required_r_value} minimum"
            result["remediation"] = f"Increase insulation to R-{required_r_value} minimum"
            result["common_violation"] = "R-4.2 flex duct insulation is NOT code-compliant in Minnesota"
        else:
            result["additional_requirements"] = [
                "Vapor barrier required on exterior of insulation",
                "All joints and seams must be sealed with mastic or metal tape",
                "Duct leakage test required: ≤ 4 CFM25 per 100 sq ft floor area"
            ]
    
    logger.info(f"Duct insulation check: location={duct_location}, R-value={insulation_r_value}, compliant={result['compliant']}")
    return result


@mcp.tool()
def check_economizer_requirement(cooling_capacity_btu: int) -> dict:
    """
    Checks if economizer is required per MN Energy Code for Climate Zone 7.
    
    Args:
        cooling_capacity_btu: Total cooling capacity in BTU/h
        
    Returns:
        Dictionary with economizer requirement status
        
    Raises:
        ValueError: If input is invalid
    """
    if cooling_capacity_btu < 0:
        logger.error(f"Invalid cooling capacity: {cooling_capacity_btu}")
        raise ValueError(f"cooling_capacity_btu must be non-negative, got {cooling_capacity_btu}")
    
    threshold_btu = 54000  # 4.5 tons
    required = cooling_capacity_btu > threshold_btu
    cooling_tons = round(cooling_capacity_btu / 12000, 2)
    
    result = {
        "economizer_required": required,
        "cooling_capacity_btu": cooling_capacity_btu,
        "cooling_capacity_tons": cooling_tons,
        "threshold_btu": threshold_btu,
        "threshold_tons": 4.5,
        "climate_zone": "7 (Minnesota)",
        "code_reference": "ASHRAE 90.1 / MN Energy Code"
    }
    
    if required:
        result["status"] = "ECONOMIZER REQUIRED"
        result["requirements"] = [
            "Differential dry-bulb economizer (minimum) or differential enthalpy (recommended)",
            "Motorized outdoor air and return air dampers",
            "100% outdoor air capability when economizer active",
            "Mixed air temperature sensor for control",
            "Functional testing required at commissioning"
        ]
        result["exceptions"] = [
            "System with energy recovery ventilator (ERV) may be exempt",
            "High humidity spaces (natatoriums, commercial kitchens) may be exempt"
        ]
    else:
        result["status"] = "ECONOMIZER NOT REQUIRED"
        result["note"] = f"Cooling capacity {cooling_tons} tons is below 4.5 ton threshold"
    
    logger.info(f"Economizer check: capacity={cooling_capacity_btu} BTU/h, required={required}")
    return result


if __name__ == "__main__":
    mcp.run()
