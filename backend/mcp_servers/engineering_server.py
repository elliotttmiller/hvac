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


if __name__ == "__main__":
    mcp.run()