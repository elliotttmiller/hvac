/**
 * Component Categorization Utilities
 * Shared logic for determining parent categories and hierarchical grouping
 */

/**
 * Determine the parent category for hierarchical grouping
 * This enables organizing components into main categories with subcategories
 * 
 * @param type - The component type (e.g., 'sensor_temperature', 'valve_control')
 * @returns The parent category (e.g., 'instruments', 'valves', 'equipment')
 */
export function getParentCategory(type: string): string {
  const typeLower = type.toLowerCase();
  
  // All sensor/instrument types belong to "instruments" parent category
  if (typeLower.startsWith('sensor_') || 
      typeLower.startsWith('instrument_') ||
      typeLower.includes('transmitter') || 
      typeLower.includes('indicator') ||
      typeLower.includes('alarm') ||
      typeLower.includes('switch') ||
      typeLower.includes('interlock') ||
      typeLower === 'instrument') {
    return 'instruments';
  }
  
  // All valve types belong to "valves" parent category
  if (typeLower.includes('valve')) {
    return 'valves';
  }
  
  // Equipment categories
  if (typeLower.includes('pump') || typeLower.includes('chiller') || 
      typeLower.includes('tower') || typeLower.includes('handler') ||
      typeLower.includes('ahu') || typeLower.includes('fan') ||
      typeLower.includes('motor') || typeLower.includes('compressor')) {
    return 'equipment';
  }
  
  // Process elements (flow elements, vessels, tanks)
  if (typeLower.includes('flow_element') || typeLower.includes('vessel') || 
      typeLower.includes('tank') || typeLower.includes('heat_exchanger') ||
      typeLower.includes('filter')) {
    return 'process_equipment';
  }
  
  // Piping and ductwork
  if (typeLower.includes('pipe') || typeLower.includes('duct')) {
    return 'piping';
  }
  
  return 'other';
}

/**
 * Format category name for display in UI
 * 
 * @param category - The category key (e.g., 'instruments')
 * @returns Formatted display name (e.g., 'Instruments')
 */
export function formatCategoryName(category: string): string {
  const nameMap: Record<string, string> = {
    'instruments': 'Instruments',
    'valves': 'Valves',
    'equipment': 'Equipment',
    'process_equipment': 'Process Equipment',
    'piping': 'Piping & Ductwork',
    'other': 'Other Components'
  };
  
  return nameMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

/**
 * Get a user-friendly display name for a component type
 * Converts snake_case to Title Case and handles common abbreviations
 * 
 * @param type - The component type (e.g., 'sensor_temperature')
 * @returns Formatted display name (e.g., 'Temperature Sensor')
 */
export function formatComponentType(type: string): string {
  if (!type) return 'Unknown';
  
  // Handle common patterns
  const typeMap: Record<string, string> = {
    'sensor_temperature': 'Temperature Sensor',
    'sensor_pressure': 'Pressure Sensor',
    'sensor_flow': 'Flow Sensor',
    'sensor_level': 'Level Sensor',
    'sensor_position': 'Position Sensor',
    'valve_control': 'Control Valve',
    'valve_gate': 'Gate Valve',
    'valve_globe': 'Globe Valve',
    'valve_ball': 'Ball Valve',
    'valve_butterfly': 'Butterfly Valve',
    'valve_check': 'Check Valve',
    'valve_relief': 'Relief Valve',
    'air_handler': 'Air Handler',
    'pipe_section': 'Pipe Section',
    'pump_centrifugal': 'Centrifugal Pump',
    'flow_element': 'Flow Element',
    'vessel_tank': 'Vessel/Tank',
    'instrument_alarm': 'Alarm',
    'instrument_switch': 'Switch',
    'instrument_interlock': 'Interlock'
  };
  
  if (typeMap[type]) {
    return typeMap[type];
  }
  
  // Fallback: convert snake_case to Title Case
  return type
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
