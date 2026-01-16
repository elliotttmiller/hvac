from mcp.server.fastmcp import FastMCP
import json
import os
from fuzzywuzzy import process

mcp = FastMCP("hvac-engineering")

# Load Data on Startup
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

with open(os.path.join(BASE_DIR, 'data', 'pricing_catalog.json'), 'r') as f:
    PRICING_CATALOG = json.load(f)

with open(os.path.join(BASE_DIR, 'data', 'knowledge_base.txt'), 'r') as f:
    KNOWLEDGE_BASE = f.read()

@mcp.tool()
def lookup_component_price(query: str) -> str:
    """
    Searches the distributor catalog for HVAC parts. 
    Returns the best match with price and SKU.
    """
    # Create a list of descriptions for fuzzy matching
    choices = [item['description'] + " " + item['manufacturer'] for item in PRICING_CATALOG]
    
    # Find best match
    best_match, score = process.extractOne(query, choices)
    
    if score < 60:
        return "No matching part found in catalog."
        
    # Retrieve full item details
    item = next(i for i in PRICING_CATALOG if (i['description'] + " " + i['manufacturer']) == best_match)
    return json.dumps(item)

@mcp.tool()
def consult_knowledge_base(topic: str) -> str:
    """
    Retrieves specific engineering rules (ISA-5.1, ASHRAE) for a topic.
    """
    # Simple keyword search (In production, use Vector DB)
    lines = KNOWLEDGE_BASE.split('\n')
    relevant_lines = [line for line in lines if topic.lower() in line.lower()]
    
    if not relevant_lines:
        return "No specific rules found in knowledge base."
        
    return "\n".join(relevant_lines[:10]) # Return top 10 matches context

@mcp.tool()
def calculate_load_zone_7(area: float, u_value: float) -> int:
    """Calculates heating load for MN Zone 7 (-17F Design)."""
    return int(area * u_value * 87)

if __name__ == "__main__":
    mcp.run()