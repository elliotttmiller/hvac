/**
 * Type Normalization Utilities
 * Normalizes loose string outputs from AI models to strict schema enums
 * Prevents false-positive validation warnings
 */

/**
 * Valid connection types per schema enum
 */
const VALID_CONNECTION_TYPES = [
  'supply',
  'return',
  'electric',
  'pneumatic',
  'signal',
  'process',
  'control_signal',
  'electric_signal',
  'process_flow',
  'hydraulic',
  'unknown'
] as const;

type ValidConnectionType = typeof VALID_CONNECTION_TYPES[number];

/**
 * Connection type mapping from loose AI outputs to strict enums
 */
const CONNECTION_TYPE_MAP: Record<string, ValidConnectionType> = {
  // Process flow variants
  'process line': 'process',
  'process_line': 'process',
  'process flow': 'process_flow',
  'processflow': 'process_flow',
  'pipe': 'process',
  'piping': 'process',
  'water': 'process',
  'steam': 'process',
  'refrigerant': 'process',
  'chilled water': 'supply',
  'chilled_water': 'supply',
  'condenser water': 'return',
  'condenser_water': 'return',
  
  // Signal variants
  'electrical': 'electric',
  'electrical signal': 'electric_signal',
  'electric line': 'electric',
  'power': 'electric',
  'wiring': 'electric',
  'cable': 'electric',
  
  // Pneumatic variants
  'air': 'pneumatic',
  'compressed air': 'pneumatic',
  'pneumatic signal': 'pneumatic',
  'pneumatic line': 'pneumatic',
  
  // Control/Signal variants
  'control': 'control_signal',
  'control line': 'control_signal',
  'instrument signal': 'signal',
  'instrument': 'signal',
  '4-20ma': 'electric_signal',
  'analog': 'electric_signal',
  'digital': 'electric_signal',
  
  // Hydraulic variants
  'hydraulic line': 'hydraulic',
  'hydraulic signal': 'hydraulic',
  'oil': 'hydraulic',
  
  // HVAC specific
  'supply air': 'supply',
  'supply_air': 'supply',
  'return air': 'return',
  'return_air': 'return',
  'exhaust': 'return',
  'exhaust air': 'return',
};

/**
 * Valid component types (commonly used in HVAC/P&ID)
 */
const COMPONENT_TYPE_MAP: Record<string, string> = {
  // Valve variants
  'control valve': 'valve_control',
  'gate valve': 'valve_gate',
  'globe valve': 'valve_globe',
  'ball valve': 'valve_ball',
  'butterfly valve': 'valve_butterfly',
  'check valve': 'valve_check',
  'relief valve': 'valve_relief',
  'solenoid valve': 'valve_solenoid',
  'needle valve': 'valve_needle',
  'plug valve': 'valve_plug',
  
  // Instrument variants - ALL consolidated to 'instrument' type
  // Measured variable is stored in metadata, not in type
  'temperature sensor': 'instrument',
  'pressure sensor': 'instrument',
  'flow sensor': 'instrument',
  'level sensor': 'instrument',
  'temperature indicator': 'instrument',
  'pressure indicator': 'instrument',
  'temperature transmitter': 'instrument',
  'pressure transmitter': 'instrument',
  'flow transmitter': 'instrument',
  'level transmitter': 'instrument',
  'controller': 'instrument',
  'pid controller': 'instrument',
  'logic controller': 'instrument',
  'indicating controller': 'instrument',
  'sensor': 'instrument',
  'transmitter': 'instrument',
  'indicator': 'instrument',
  
  // Legacy sensor types - map to consolidated 'instrument' type
  'sensor_temperature': 'instrument',
  'sensor_pressure': 'instrument',
  'sensor_flow': 'instrument',
  'sensor_level': 'instrument',
  'instrument_indicator': 'instrument',
  'instrument_transmitter': 'instrument',
  'instrument_controller': 'instrument',
  'instrument_logic': 'instrument',
  
  // Equipment variants
  'air handler': 'ahu',
  'air handling unit': 'ahu',
  'fan coil': 'fan_coil_unit',
  'fan coil unit': 'fan_coil_unit',
  'vav box': 'vav',
  'variable air volume': 'vav',
  'heat exchanger': 'heat_exchanger',
  'cooling tower': 'cooling_tower',
  
  // Generic
  'text': 'text_label',
  'label': 'text_label',
  'annotation': 'text_label',
};

/**
 * Normalize connection type from loose AI output to schema enum
 */
export function normalizeConnectionType(rawType: string | undefined): ValidConnectionType {
  if (!rawType) return 'unknown';
  
  const normalized = rawType.toLowerCase().trim();
  
  // Direct match
  const validType = VALID_CONNECTION_TYPES.find(t => t === normalized);
  if (validType) {
    return validType;
  }
  
  // Lookup in mapping
  if (CONNECTION_TYPE_MAP[normalized]) {
    return CONNECTION_TYPE_MAP[normalized];
  }
  
  // Fallback: try to extract key term
  for (const [key, value] of Object.entries(CONNECTION_TYPE_MAP)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  // Default fallback
  console.warn(`[Type Normalization] Unknown connection type: "${rawType}", defaulting to "unknown"`);
  return 'unknown';
}

/**
 * Normalize component type from loose AI output to standard format
 */
export function normalizeComponentType(rawType: string | undefined): string {
  if (!rawType) return 'unknown';
  
  const normalized = rawType.toLowerCase().trim();
  
  // Lookup in mapping
  if (COMPONENT_TYPE_MAP[normalized]) {
    return COMPONENT_TYPE_MAP[normalized];
  }
  
  // Fallback: try to extract key term
  for (const [key, value] of Object.entries(COMPONENT_TYPE_MAP)) {
    if (normalized.includes(key)) {
      return value;
    }
  }
  
  // Return as-is if no mapping found (might already be normalized)
  return rawType;
}

/**
 * Normalize all connection types in an array
 * Optimized: only normalizes if type doesn't match expected format
 */
export function normalizeConnections<T extends { type?: string }>(connections: T[]): T[] {
  return connections.map(conn => {
    // Skip if already normalized (matches a valid type exactly)
    if (conn.type && VALID_CONNECTION_TYPES.includes(conn.type as any)) {
      return conn;
    }
    
    return {
      ...conn,
      type: normalizeConnectionType(conn.type)
    };
  });
}

/**
 * Normalize all component types in an array
 * Optimized: only normalizes if type contains spaces or uppercase (needs normalization)
 */
export function normalizeComponents<T extends { type?: string }>(components: T[]): T[] {
  return components.map(comp => {
    // Skip if type appears already normalized (lowercase, underscores, no spaces)
    if (comp.type && /^[a-z_]+$/.test(comp.type)) {
      return comp;
    }
    
    return {
      ...comp,
      type: normalizeComponentType(comp.type)
    };
  });
}

/**
 * Apply all normalizations to a visual analysis result
 */
export function normalizeAnalysisResult<T extends { 
  components?: Array<{ type?: string }>, 
  connections?: Array<{ type?: string }> 
}>(result: T): T {
  return {
    ...result,
    components: result.components ? normalizeComponents(result.components) : undefined,
    connections: result.connections ? normalizeConnections(result.connections) : undefined
  };
}
