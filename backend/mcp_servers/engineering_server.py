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

if __name__ == "__main__":
    mcp.run()