from mcp.server.fastmcp import FastMCP
import json
import os
from fuzzywuzzy import process
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

mcp = FastMCP("hvac-engineering")

# Load Data on Startup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

try:
    with open(os.path.join(BASE_DIR, 'data', 'pricing_catalog.json'), 'r') as f:
        PRICING_CATALOG = json.load(f)
    logger.info(f"Loaded pricing catalog: {len(PRICING_CATALOG)} items")
except FileNotFoundError as e:
    logger.error(f"Pricing catalog not found: {e}")
    PRICING_CATALOG = []

try:
    with open(os.path.join(BASE_DIR, 'data', 'knowledge_base.txt'), 'r') as f:
        KNOWLEDGE_BASE = f.read()
    logger.info(f"Loaded knowledge base: {len(KNOWLEDGE_BASE)} characters")
except FileNotFoundError as e:
    logger.error(f"Knowledge base not found: {e}")
    KNOWLEDGE_BASE = ""

@mcp.tool()
def lookup_component_price(query: str) -> str:
    """
    Searches the distributor catalog for HVAC parts using fuzzy matching.
    Returns the best match with price and SKU.
    
    Args:
        query: Search query (component description, manufacturer, or model)
        
    Returns:
        JSON string with matched component details or error message
    """
    if not PRICING_CATALOG:
        logger.error("Pricing catalog is empty")
        return json.dumps({"error": "Pricing catalog not available"})
    
    if not query or not isinstance(query, str):
        logger.error(f"Invalid query: {query}")
        return json.dumps({"error": "Query must be a non-empty string"})
    
    try:
        # Create a list of descriptions for fuzzy matching
        choices = [item['description'] + " " + item.get('manufacturer', '') for item in PRICING_CATALOG]
        
        # Find best match using fuzzy string matching
        best_match, score = process.extractOne(query, choices)
        
        if score < 60:
            logger.warning(f"No good match found for query: {query} (best score: {score})")
            return json.dumps({"error": "No matching part found in catalog", "query": query, "best_score": score})
            
        # Retrieve full item details
        item = next(i for i in PRICING_CATALOG if (i['description'] + " " + i.get('manufacturer', '')) == best_match)
        
        logger.info(f"Found match: {item.get('description')} (score: {score})")
        return json.dumps(item)
        
    except Exception as e:
        logger.error(f"Component lookup error: {e}")
        return json.dumps({"error": str(e)})

@mcp.tool()
def consult_knowledge_base(topic: str) -> str:
    """
    Retrieves specific engineering rules (ISA-5.1, ASHRAE, MN Code) for a topic.
    
    Args:
        topic: Topic or keyword to search for
        
    Returns:
        Relevant knowledge base excerpts (top 10 matches)
    """
    if not KNOWLEDGE_BASE:
        logger.error("Knowledge base is empty")
        return "Knowledge base not available."
    
    if not topic or not isinstance(topic, str):
        logger.error(f"Invalid topic: {topic}")
        return "Topic must be a non-empty string."
    
    try:
        # Simple keyword search (In production, use Vector DB)
        lines = KNOWLEDGE_BASE.split('\n')
        relevant_lines = [line for line in lines if topic.lower() in line.lower()]
        
        if not relevant_lines:
            logger.warning(f"No specific rules found for topic: {topic}")
            return f"No specific rules found in knowledge base for '{topic}'."
        
        logger.info(f"Found {len(relevant_lines)} matches for topic: {topic}")
        # Return top 10 matches for context
        return "\n".join(relevant_lines[:10])
        
    except Exception as e:
        logger.error(f"Knowledge base query error: {e}")
        return f"Error querying knowledge base: {str(e)}"

@mcp.tool()
def calculate_load_zone_7(area: float, u_value: float) -> int:
    """Calculates heating load for MN Zone 7 (-17F Design).
    
    Args:
        area: Area in square feet (must be positive)
        u_value: U-value thermal transmittance (must be positive)
        
    Returns:
        Heating load in BTU/h
        
    Raises:
        ValueError: If inputs are invalid
    """
    if area <= 0:
        logger.error(f"Invalid area: {area}")
        raise ValueError(f"Area must be positive, got {area}")
    
    if u_value <= 0:
        logger.error(f"Invalid u_value: {u_value}")
        raise ValueError(f"U-value must be positive, got {u_value}")
    
    # MN Climate Zone 7: ΔT = 87°F
    result = int(area * u_value * 87)
    logger.info(f"Calculated Zone 7 load: {result} BTU/h (area={area}, u={u_value})")
    
    return result

@mcp.tool()
def validate_insulation_rvalue(component_type: str, r_value: float) -> str:
    """Validates insulation R-value against Minnesota Energy Code minimums.
    
    Args:
        component_type: Type of component (wall, ceiling, basement_wall, slab_edge)
        r_value: Proposed R-value
        
    Returns:
        Compliance status with code minimum reference
    """
    # MN Energy Code minimums for Climate Zone 7
    minimums = {
        "wall": 20.0,
        "ceiling": 49.0,
        "basement_wall": 15.0,
        "slab_edge": 10.0,
        "floor": 30.0
    }
    
    component_lower = component_type.lower().replace(" ", "_")
    if component_lower not in minimums:
        logger.warning(f"Unknown component type: {component_type}")
        return json.dumps({
            "status": "UNKNOWN",
            "message": f"Component type '{component_type}' not recognized. Valid: {list(minimums.keys())}"
        })
    
    required = minimums[component_lower]
    compliant = r_value >= required
    
    result = {
        "component_type": component_type,
        "proposed_r_value": r_value,
        "required_r_value": required,
        "status": "COMPLIANT" if compliant else "NON_COMPLIANT",
        "u_value_equivalent": round(1.0 / r_value, 4) if r_value > 0 else None,
        "code_reference": "MN Energy Code 1322.0700 (Climate Zone 7)"
    }
    
    if not compliant:
        result["deficiency"] = round(required - r_value, 1)
        result["recommendation"] = f"Increase insulation to R-{required} minimum"
    
    logger.info(f"R-value validation: {component_type} R-{r_value} = {result['status']}")
    return json.dumps(result)

@mcp.tool()
def calculate_required_cfm(system_type: str, capacity_btu: int, temp_rise: float = None) -> str:
    """Calculates required airflow (CFM) for HVAC equipment.
    
    Args:
        system_type: heating or cooling
        capacity_btu: Equipment capacity in BTU/h
        temp_rise: Temperature rise/drop across equipment (optional, uses defaults)
        
    Returns:
        JSON with CFM calculation and duct sizing guidance
    """
    if capacity_btu <= 0:
        logger.error(f"Invalid capacity: {capacity_btu}")
        return json.dumps({"error": "Capacity must be positive"})
    
    system_lower = system_type.lower()
    
    if system_lower == "heating":
        # Heating: CFM = BTU / (1.08 × ΔT)
        # Standard assumption: 70°F rise for furnace
        delta_t = temp_rise if temp_rise else 70.0
        cfm = capacity_btu / (1.08 * delta_t)
        typical_range = "400-450 CFM per ton"
        
    elif system_lower == "cooling":
        # Cooling: CFM = BTU / (1.08 × ΔT)  
        # Standard assumption: 20°F drop for AC
        delta_t = temp_rise if temp_rise else 20.0
        cfm = capacity_btu / (1.08 * delta_t)
        typical_range = "350-450 CFM per ton (400 CFM standard)"
        
    else:
        logger.error(f"Unknown system type: {system_type}")
        return json.dumps({"error": f"System type must be 'heating' or 'cooling', got '{system_type}'"})
    
    # Duct sizing recommendations
    tons = capacity_btu / 12000.0
    # Assume 700 FPM for main trunk
    duct_area_sqin = (cfm / 700) * 144  # Convert from sq ft to sq in
    round_diameter = 2 * (duct_area_sqin / 3.14159) ** 0.5
    
    result = {
        "system_type": system_type,
        "capacity_btu": capacity_btu,
        "capacity_tons": round(tons, 1),
        "temperature_delta": delta_t,
        "required_cfm": int(round(cfm)),
        "typical_range": typical_range,
        "duct_sizing": {
            "recommended_velocity": "700 FPM (main trunk), 600 FPM (branches)",
            "residential_max_velocity": "900 FPM",
            "round_duct_diameter_inches": round(round_diameter, 1),
            "note": "Use Manual D for detailed duct sizing"
        }
    }
    
    logger.info(f"CFM calculation: {capacity_btu} BTU/h {system_type} = {int(cfm)} CFM")
    return json.dumps(result)

@mcp.tool()
def check_equipment_efficiency(equipment_type: str, efficiency_rating: float) -> str:
    """Validates equipment efficiency against Minnesota minimums.
    
    Args:
        equipment_type: furnace, air_conditioner, heat_pump, boiler
        efficiency_rating: AFUE, SEER, HSPF, or thermal efficiency
        
    Returns:
        JSON with compliance status and recommendations
    """
    # MN minimums (Climate Zone 7)
    standards = {
        "furnace": {"metric": "AFUE", "minimum": 95.0, "recommended": 96.0, "unit": "%"},
        "air_conditioner": {"metric": "SEER", "minimum": 14.0, "recommended": 16.0, "unit": ""},
        "heat_pump": {"metric": "HSPF", "minimum": 8.2, "recommended": 10.0, "unit": ""},
        "boiler": {"metric": "AFUE", "minimum": 90.0, "recommended": 95.0, "unit": "%"}
    }
    
    equipment_lower = equipment_type.lower().replace(" ", "_")
    if equipment_lower not in standards:
        return json.dumps({
            "error": f"Unknown equipment type: {equipment_type}",
            "valid_types": list(standards.keys())
        })
    
    standard = standards[equipment_lower]
    minimum = standard["minimum"]
    recommended = standard["recommended"]
    
    if efficiency_rating < minimum:
        status = "NON_COMPLIANT"
    elif efficiency_rating < recommended:
        status = "COMPLIANT_BASIC"
    else:
        status = "COMPLIANT_RECOMMENDED"
    
    result = {
        "equipment_type": equipment_type,
        "efficiency_rating": efficiency_rating,
        "efficiency_metric": standard["metric"],
        "minimum_required": minimum,
        "recommended": recommended,
        "status": status,
        "code_reference": "MN Energy Code & Federal Minimums"
    }
    
    if status == "NON_COMPLIANT":
        result["violation"] = f"Below minimum {standard['metric']} of {minimum}{standard['unit']}"
    elif status == "COMPLIANT_BASIC":
        result["note"] = f"Meets minimum but below recommended {recommended}{standard['unit']}"
    else:
        result["note"] = "Exceeds recommended efficiency"
    
    logger.info(f"Efficiency check: {equipment_type} {standard['metric']}={efficiency_rating} = {status}")
    return json.dumps(result)


@mcp.tool()
def recommend_equipment(load_btu: int, equipment_type: str, building_type: str = "residential") -> str:
    """Recommends appropriately sized HVAC equipment based on calculated load.
    
    Args:
        load_btu: Calculated heating or cooling load in BTU/h
        equipment_type: heating or cooling
        building_type: residential or commercial
        
    Returns:
        JSON with equipment recommendations and sizing guidance
    """
    if load_btu <= 0:
        return json.dumps({"error": "Load must be positive"})
    
    equipment_lower = equipment_type.lower()
    
    if equipment_lower == "heating":
        # MN Rule: Max 40% oversize
        max_capacity = int(load_btu * 1.40)
        min_capacity = int(load_btu * 0.95)  # Allow slight undersize
        
        # Common furnace sizes
        standard_sizes = [40000, 60000, 80000, 100000, 120000]
        
        # Find best fit (closest to load within code limits)
        valid_sizes = [s for s in standard_sizes if min_capacity <= s <= max_capacity]
        best_fit = min(valid_sizes, key=lambda s: abs(s - load_btu), default=None)
        
        result = {
            "load_btu": load_btu,
            "equipment_type": "heating",
            "min_capacity_btu": min_capacity,
            "max_capacity_btu": max_capacity,
            "recommended_size_btu": best_fit,
            "oversize_limit": "40% (MN Rule 1322.0403)",
            "standard_sizes_available": standard_sizes,
            "notes": []
        }
        
        if best_fit:
            oversize = ((best_fit / load_btu) - 1) * 100
            result["actual_oversize_percent"] = round(oversize, 1)
            if oversize > 40:
                result["notes"].append("WARNING: Recommended size exceeds code limit")
        else:
            result["notes"].append("No standard size fits within code limits - consider custom sizing or two-stage equipment")
            result["actual_oversize_percent"] = None
        
        # Add efficiency guidance
        result["efficiency_guidance"] = {
            "minimum_afue": 95.0,
            "recommended_afue": 96.0,
            "climate_zone": 7,
            "note": "Consider modulating furnace for better comfort and no oversize limit"
        }
        
    elif equipment_lower == "cooling":
        # MN Rule: Max 15% oversize
        max_capacity = int(load_btu * 1.15)
        min_capacity = int(load_btu * 0.95)
        
        # Convert to tons (more common for AC)
        load_tons = load_btu / 12000.0
        max_tons = max_capacity / 12000.0
        min_tons = min_capacity / 12000.0
        
        # Common AC sizes (in tons)
        standard_sizes_tons = [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 5.0]
        standard_sizes_btu = [int(t * 12000) for t in standard_sizes_tons]
        
        # Find best fit (closest to load within code limits)
        valid_pairs = [(btu, ton) for btu, ton in zip(standard_sizes_btu, standard_sizes_tons) 
                       if min_capacity <= btu <= max_capacity]
        if valid_pairs:
            best_fit, best_fit_tons = min(valid_pairs, key=lambda p: abs(p[0] - load_btu))
        else:
            best_fit = None
            best_fit_tons = None
        
        result = {
            "load_btu": load_btu,
            "load_tons": round(load_tons, 2),
            "equipment_type": "cooling",
            "min_capacity_btu": min_capacity,
            "max_capacity_btu": max_capacity,
            "min_capacity_tons": round(min_tons, 2),
            "max_capacity_tons": round(max_tons, 2),
            "recommended_size_btu": best_fit,
            "recommended_size_tons": best_fit_tons,
            "oversize_limit": "15% (MN Rule 1322.0404)",
            "standard_sizes_available_tons": standard_sizes_tons,
            "notes": []
        }
        
        if best_fit:
            oversize = ((best_fit / load_btu) - 1) * 100
            result["actual_oversize_percent"] = round(oversize, 1)
            if oversize > 15:
                result["notes"].append("WARNING: Recommended size exceeds code limit")
        else:
            result["notes"].append("No standard size fits within code limits - consider variable capacity equipment")
            result["actual_oversize_percent"] = None
        
        # Add efficiency and airflow guidance
        result["efficiency_guidance"] = {
            "minimum_seer": 14.0,
            "recommended_seer": 16.0,
            "required_cfm": int(400 * (best_fit / 12000.0)) if best_fit else None,
            "cfm_per_ton": 400
        }
    else:
        return json.dumps({"error": f"Unknown equipment type: {equipment_type}. Use 'heating' or 'cooling'"})
    
    logger.info(f"Equipment recommendation: {load_btu} BTU/h {equipment_type} -> {result.get('recommended_size_btu')} BTU/h")
    return json.dumps(result)


@mcp.tool()
def calculate_ventilation_requirement(floor_area_sqft: float, bedrooms: int, occupants: int = None) -> str:
    """Calculates required ventilation per ASHRAE 62.2 for residential buildings.
    
    Args:
        floor_area_sqft: Total conditioned floor area
        bedrooms: Number of bedrooms
        occupants: Number of occupants (if known, otherwise derived from bedrooms)
        
    Returns:
        JSON with ventilation requirements
    """
    if floor_area_sqft <= 0:
        return json.dumps({"error": "Floor area must be positive"})
    
    if bedrooms < 0:
        return json.dumps({"error": "Bedrooms must be non-negative"})
    
    # ASHRAE 62.2 formula: Qtotal = 0.03 × floor_area + 7.5 × (bedrooms + 1)
    # The (bedrooms + 1) approximates occupancy
    if occupants is None:
        occupants = bedrooms + 1
    
    area_component = 0.03 * floor_area_sqft
    occupant_component = 7.5 * occupants
    total_cfm = area_component + occupant_component
    
    # Infiltration credit: Can reduce ventilation by measured infiltration
    # Assume typical construction: 0.30 ACH natural infiltration
    # Infiltration CFM = (floor_area × ceiling_height × ACH) / 60
    # Assume 8 ft ceiling for residential
    volume = floor_area_sqft * 8
    infiltration_cfm = (volume * 0.30) / 60
    
    # Net ventilation needed (after infiltration credit)
    net_ventilation_cfm = max(0, total_cfm - (infiltration_cfm * 0.5))  # 50% credit per ASHRAE
    
    result = {
        "floor_area_sqft": floor_area_sqft,
        "bedrooms": bedrooms,
        "estimated_occupants": occupants,
        "area_component_cfm": round(area_component, 1),
        "occupant_component_cfm": round(occupant_component, 1),
        "total_required_cfm": round(total_cfm, 1),
        "infiltration_credit_cfm": round(infiltration_cfm * 0.5, 1),
        "net_ventilation_cfm": round(net_ventilation_cfm, 1),
        "standard": "ASHRAE 62.2",
        "recommendations": []
    }
    
    # Add equipment recommendations
    if net_ventilation_cfm > 50:
        result["recommendations"].append("Consider ERV (Energy Recovery Ventilator) for energy efficiency in Climate Zone 7")
        result["recommendations"].append("HRV (Heat Recovery Ventilator) is alternative if no humidity control needed")
    elif net_ventilation_cfm > 0:
        result["recommendations"].append("Fresh air duct to return plenum with manual damper acceptable")
    
    # Check if mechanical ventilation is required
    if total_cfm > infiltration_cfm:
        result["mechanical_ventilation_required"] = True
    else:
        result["mechanical_ventilation_required"] = False
        result["recommendations"].append("Natural infiltration may provide sufficient ventilation - verify with blower door test")
    
    logger.info(f"Ventilation calculation: {floor_area_sqft} sqft, {bedrooms} BR -> {round(total_cfm, 1)} CFM required")
    return json.dumps(result)


@mcp.tool()
def calculate_solar_heat_gain(window_area_sqft: float, orientation: str, shgc: float = 0.40) -> str:
    """Calculates solar heat gain through windows for cooling load.
    
    Args:
        window_area_sqft: Total window area
        orientation: N, NE, E, SE, S, SW, W, NW
        shgc: Solar Heat Gain Coefficient (default 0.40 for typical double-pane)
        
    Returns:
        JSON with solar heat gain calculation
    """
    if window_area_sqft <= 0:
        return json.dumps({"error": "Window area must be positive"})
    
    if not (0 < shgc <= 1.0):
        return json.dumps({"error": "SHGC must be between 0 and 1.0"})
    
    # Peak solar intensity for Climate Zone 7 (Minnesota) in July
    # Values in BTU/h/sqft based on orientation
    solar_intensity = {
        "N": 40,
        "NE": 90,
        "E": 140,
        "SE": 120,
        "S": 80,
        "SW": 150,
        "W": 160,
        "NW": 110
    }
    
    orientation_upper = orientation.upper()
    if orientation_upper not in solar_intensity:
        return json.dumps({
            "error": f"Unknown orientation: {orientation}",
            "valid_orientations": list(solar_intensity.keys())
        })
    
    # Cooling Load Factor (accounts for thermal mass and time lag)
    # Typical residential: 0.60-0.80
    clf = 0.70
    
    intensity = solar_intensity[orientation_upper]
    solar_gain_btu = window_area_sqft * intensity * shgc * clf
    
    result = {
        "window_area_sqft": window_area_sqft,
        "orientation": orientation_upper,
        "shgc": shgc,
        "peak_solar_intensity_btu_per_sqft": intensity,
        "cooling_load_factor": clf,
        "solar_heat_gain_btu": round(solar_gain_btu, 0),
        "notes": [
            "Solar gain is peak instantaneous load",
            "Actual load varies by time of day and season",
            "Consider window shading (overhangs, blinds) to reduce cooling load"
        ]
    }
    
    # Add recommendations for high-gain orientations
    if intensity > 140:
        result["notes"].append(f"{orientation_upper}-facing windows have high solar gain - recommend low-e coating or external shading")
    
    logger.info(f"Solar gain: {window_area_sqft} sqft {orientation_upper} @ SHGC={shgc} -> {round(solar_gain_btu, 0)} BTU/h")
    return json.dumps(result)


@mcp.tool()
def validate_equipment_type(equipment_type: str, application: str, load_variability: str = "medium") -> str:
    """Validates if equipment type is appropriate for the application.
    
    Args:
        equipment_type: single-stage, two-stage, modulating, variable-speed
        application: residential, commercial, industrial
        load_variability: low, medium, high (how much load changes)
        
    Returns:
        JSON with appropriateness assessment
    """
    equipment_lower = equipment_type.lower().replace("-", "_").replace(" ", "_")
    application_lower = application.lower()
    variability_lower = load_variability.lower()
    
    # Equipment characteristics
    equipment_info = {
        "single_stage": {
            "comfort": "basic",
            "efficiency": "good",
            "cost": "low",
            "best_for": "low variability loads, budget-conscious projects",
            "limitations": "On/off cycling, limited comfort control, subject to 40% oversize limit"
        },
        "two_stage": {
            "comfort": "good",
            "efficiency": "very good",
            "cost": "moderate",
            "best_for": "medium variability loads, balanced comfort and cost",
            "limitations": "Still some cycling, subject to 40% oversize limit exception"
        },
        "modulating": {
            "comfort": "excellent",
            "efficiency": "excellent",
            "cost": "high",
            "best_for": "high variability loads, maximum comfort",
            "limitations": "Higher initial cost, exempt from oversize limits"
        },
        "variable_speed": {
            "comfort": "excellent",
            "efficiency": "excellent",
            "cost": "high",
            "best_for": "high variability loads, energy efficiency priority",
            "limitations": "Higher initial cost, more complex controls"
        }
    }
    
    if equipment_lower not in equipment_info:
        return json.dumps({
            "error": f"Unknown equipment type: {equipment_type}",
            "valid_types": list(equipment_info.keys())
        })
    
    info = equipment_info[equipment_lower]
    
    # Determine appropriateness
    appropriate = True
    warnings = []
    recommendations = []
    
    if variability_lower == "high" and equipment_lower == "single_stage":
        appropriate = False
        warnings.append("Single-stage equipment not recommended for high load variability")
        recommendations.append("Consider modulating or variable-speed equipment for better comfort")
    
    if variability_lower == "low" and equipment_lower in ["modulating", "variable_speed"]:
        warnings.append("Premium equipment may not provide sufficient benefit for low variability loads")
        recommendations.append("Two-stage equipment may be more cost-effective")
    
    if application_lower == "commercial" and equipment_lower == "single_stage":
        warnings.append("Single-stage equipment may not meet comfort requirements for commercial applications")
    
    result = {
        "equipment_type": equipment_type,
        "application": application,
        "load_variability": load_variability,
        "appropriate": appropriate,
        "comfort_rating": info["comfort"],
        "efficiency_rating": info["efficiency"],
        "relative_cost": info["cost"],
        "best_application": info["best_for"],
        "limitations": info["limitations"],
        "warnings": warnings,
        "recommendations": recommendations
    }
    
    # Add code compliance notes
    if equipment_lower in ["modulating", "variable_speed"]:
        result["code_note"] = "Exempt from MN Rule 1322.0403 40% heating oversize limit"
    else:
        result["code_note"] = "Subject to MN Rule 1322.0403 40% heating oversize limit"
    
    logger.info(f"Equipment validation: {equipment_type} for {application} -> {'appropriate' if appropriate else 'not recommended'}")
    return json.dumps(result)


@mcp.tool()
def check_economizer_requirement(cooling_capacity_btu: int, climate_zone: int = 7) -> str:
    """Determines if economizer is required per ASHRAE 90.1 and Minnesota code.
    
    Args:
        cooling_capacity_btu: Total cooling capacity
        climate_zone: IECC/ASHRAE climate zone (default 7 for Minnesota)
        
    Returns:
        JSON with economizer requirement determination
    """
    if cooling_capacity_btu <= 0:
        return json.dumps({"error": "Cooling capacity must be positive"})
    
    # ASHRAE 90.1 and Minnesota requirements
    # Climate Zone 7: Economizer required if cooling > 54,000 BTU/h (4.5 tons)
    threshold_btu = 54000
    threshold_tons = threshold_btu / 12000.0
    
    capacity_tons = cooling_capacity_btu / 12000.0
    required = cooling_capacity_btu > threshold_btu
    
    result = {
        "cooling_capacity_btu": cooling_capacity_btu,
        "cooling_capacity_tons": round(capacity_tons, 1),
        "climate_zone": climate_zone,
        "threshold_btu": threshold_btu,
        "threshold_tons": round(threshold_tons, 1),
        "economizer_required": required,
        "code_reference": "ASHRAE 90.1 / MN Energy Code"
    }
    
    if required:
        result["economizer_type_options"] = [
            "Differential dry-bulb (simplest, uses outdoor vs return temp)",
            "Differential enthalpy (more efficient, uses temp + humidity)",
            "Fixed dry-bulb (economizer enabled when OAT < 55°F)"
        ]
        result["recommendation"] = "Differential enthalpy economizer recommended for Climate Zone 7"
        result["notes"] = [
            "Economizer can provide free cooling when outdoor conditions favorable",
            "Requires motorized outdoor air damper and controls",
            "Must be able to provide 100% outdoor air for cooling"
        ]
    else:
        result["recommendation"] = "Economizer not required for this capacity"
        result["notes"] = [
            f"Cooling capacity {round(capacity_tons, 1)} tons is below {round(threshold_tons, 1)} ton threshold"
        ]
    
    logger.info(f"Economizer check: {cooling_capacity_btu} BTU/h -> {'required' if required else 'not required'}")
    return json.dumps(result)


if __name__ == "__main__":
    mcp.run()