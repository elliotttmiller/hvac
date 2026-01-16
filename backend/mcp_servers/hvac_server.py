from mcp.server.fastmcp import FastMCP

mcp = FastMCP("hvac-logic")


@mcp.tool()
def calculate_manual_j_load(area_sqft: float, u_value: float, is_basement: bool = False) -> int:
    """
    Calculates heating load based on MN Climate Zone 7 physics.
    Formula: Area * U-Value * DeltaT (87 degrees).
    """
    delta_t = 87
    load = area_sqft * u_value * delta_t
    if is_basement:
        load = load * 0.85
    return int(round(load))


@mcp.tool()
def check_compliance(load: int, capacity: int) -> str:
    """
    Checks MN Rule 1322.0403 (Max 40% Oversizing).
    """
    if load == 0:
        return "Error: Load cannot be zero"

    ratio = capacity / load
    limit = 1.40
    oversize_pct = round((ratio - 1) * 100, 1)

    status = "PASS" if ratio <= limit else "FAIL"

    return f"Status: {status}, Oversize: {oversize_pct}%, Limit: 40%"


if __name__ == "__main__":
    mcp.run()
