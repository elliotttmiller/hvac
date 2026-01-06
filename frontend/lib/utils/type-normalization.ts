/**
 * Type Normalization Utilities
 * Normalizes loose string outputs from AI models to strict schema enums
 * Prevents false-positive validation warnings
 * 
 * TIER 3: Implements deterministic safeguards to catch shape/type mismatches
 * and prevent "Prompt Biasing" hallucinations where circular symbols are
 * misclassified as valves.
 */

/**
 * Shape-to-Type Compatibility Rules
 * Defines which shapes are compatible with which component types
 * Used for sanity checking to catch AI hallucinations
 */
const SHAPE_TYPE_COMPATIBILITY: Record<string, {
  allowed_types: string[];
  forbidden_types: string[];
  reasoning: string;
}> = {
  'circle': {
    allowed_types: [
      'sensor_temperature', 'sensor_pressure', 'sensor_flow', 'sensor_level',
      'instrument_indicator', 'instrument_transmitter', 'instrument_gauge',
      'Level Indicator', 'Level Transmitter', 'Level Indicating Transmitter',
      'Level Gauge', 'Pressure Indicator', 'Pressure Transmitter',
      'Temperature Indicator', 'Temperature Transmitter',
      'Flow Indicator', 'Flow Transmitter',
      'pump', 'fan' // Rotary equipment can be circular
    ],
    forbidden_types: [
      'valve_gate', 'valve_globe', 'valve_control', 'Manual Valve', 'Control Valve',
      'Gate Valve', 'Globe Valve'
    ],
    reasoning: 'Circular shapes represent instruments/sensors or rotary equipment, NEVER linear valves'
  },
  'circle_in_square': {
    allowed_types: [
      'sensor_temperature', 'sensor_pressure', 'sensor_flow', 'sensor_level',
      'instrument_indicator', 'instrument_transmitter', 'instrument_gauge',
      'Level Indicator', 'Level Gauge', 'controller'
    ],
    forbidden_types: [
      'valve_gate', 'valve_globe', 'valve_control', 'Manual Valve', 'Control Valve'
    ],
    reasoning: 'Circle-in-square represents DCS/shared display instruments, NEVER valves'
  },
  'bowtie': {
    allowed_types: [
      'valve_gate', 'valve_globe', 'valve_control', 'valve_ball', 'valve_butterfly',
      'Manual Valve', 'Control Valve', 'Gate Valve', 'Globe Valve'
    ],
    forbidden_types: [
      'sensor_temperature', 'sensor_pressure', 'sensor_flow', 'sensor_level',
      'instrument_indicator', 'instrument_transmitter',
      'Level Indicator', 'Level Transmitter', 'Temperature Indicator', 'Pressure Indicator'
    ],
    reasoning: 'Bowtie shapes represent valves, NEVER instruments/sensors'
  },
  'diamond': {
    allowed_types: [
      'Logic Function', 'instrument_logic', 'controller', 'interlock'
    ],
    forbidden_types: [
      'valve_gate', 'valve_globe', 'Manual Valve' // Valves use bowtie, not diamond
    ],
    reasoning: 'Diamond shapes represent logic functions or interlocks'
  }
};

/**
 * ISA Tag Patterns for Type Inference
 * Used as a fallback when shape/type mismatch is detected
 */
const ISA_TAG_PATTERNS: Record<string, string> = {
  // Instruments (should have circular shapes)
  '^[0-9]*TI': 'Temperature Indicator',
  '^[0-9]*TT': 'Temperature Transmitter',
  '^[0-9]*TIC': 'Temperature Indicator Controller',
  '^[0-9]*PI': 'Pressure Indicator',
  '^[0-9]*PT': 'Pressure Transmitter',
  '^[0-9]*PIC': 'Pressure Indicator Controller',
  '^[0-9]*FI': 'Flow Indicator',
  '^[0-9]*FT': 'Flow Transmitter',
  '^[0-9]*FIC': 'Flow Indicator Controller',
  '^[0-9]*LI': 'Level Indicator',
  '^[0-9]*LT': 'Level Transmitter',
  '^[0-9]*LIT': 'Level Indicating Transmitter',
  '^[0-9]*LG': 'Level Gauge',
  '^[0-9]*LIC': 'Level Indicator Controller',
  
  // Valves (should have bowtie shapes)
  // Note: Pattern is restrictive to avoid false positives
  // Format: [optional digits][optional prefix letters]V- (e.g., "1VA-121271", "CV-101", "V-201")
  '^[0-9]*[A-Z]{0,2}V-': 'Manual Valve',  // Max 2 prefix letters before V- to avoid overly broad matching
  '^[0-9]*CV': 'Control Valve',
  '^[0-9]*FV': 'Flow Control Valve',
  '^[0-9]*PV': 'Pressure Control Valve',
  '^[0-9]*TV': 'Temperature Control Valve'
};

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
  
  // Instrument variants
  'temperature sensor': 'sensor_temperature',
  'pressure sensor': 'sensor_pressure',
  'flow sensor': 'sensor_flow',
  'level sensor': 'sensor_level',
  'temperature indicator': 'instrument_indicator',
  'pressure indicator': 'instrument_indicator',
  'temperature transmitter': 'instrument_transmitter',
  'pressure transmitter': 'instrument_transmitter',
  'flow transmitter': 'instrument_transmitter',
  'controller': 'instrument_controller',
  'pid controller': 'instrument_controller',
  'logic controller': 'instrument_logic',
  
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

/**
 * Confidence adjustment constants for validation corrections
 * These values control how much confidence is reduced when misclassifications are detected
 */
const CONFIDENCE_ADJUSTMENTS = {
  /** Minimum confidence after auto-correction (prevents zero confidence) */
  MIN_CONFIDENCE_AFTER_CORRECTION: 0.5,
  /** Default confidence if not provided */
  DEFAULT_CONFIDENCE: 0.8,
  /** Confidence penalty for auto-corrected components (subtracted from original) */
  AUTO_CORRECTION_PENALTY: 0.3,
  /** Minimum confidence for validation errors without correction */
  MIN_CONFIDENCE_VALIDATION_ERROR: 0.3,
  /** Confidence penalty for validation errors (subtracted from original) */
  VALIDATION_ERROR_PENALTY: 0.5
} as const;

/**
 * Infer shape from component type and ISA tag when shape field is missing
 * CRITICAL: This is a fallback for when AI doesn't return shape field
 * 
 * @param comp - Component without shape field
 * @returns Inferred shape based on type and tag patterns
 */
function inferShapeFromComponent<T extends {
  type?: string;
  label?: string;
  meta?: any;
}>(comp: T): string | null {
  const type = (comp.type || '').toLowerCase();
  const label = (comp.label || '').toUpperCase();
  const reasoning = (comp.meta?.reasoning || '').toLowerCase();
  
  // Check reasoning text for explicit shape mentions
  if (reasoning.includes('circle') || reasoning.includes('circular')) {
    return 'circle';
  }
  if (reasoning.includes('bowtie') || reasoning.includes('bow-tie')) {
    return 'bowtie';
  }
  if (reasoning.includes('diamond')) {
    return 'diamond';
  }
  if (reasoning.includes('square') && reasoning.includes('circle')) {
    return 'circle_in_square';
  }
  
  // Infer from ISA tag patterns (instruments = circles)
  const instrumentPrefixes = ['TI', 'TT', 'TIC', 'PI', 'PT', 'PIC', 'FI', 'FT', 'FIC', 'LI', 'LT', 'LIT', 'LG', 'LIC'];
  for (const prefix of instrumentPrefixes) {
    if (label.includes(prefix)) {
      console.log(`[Shape Inference] Inferred shape 'circle' for ${comp.label} based on ISA tag pattern ${prefix}`);
      return 'circle';
    }
  }
  
  // Infer from component type
  const instrumentTypes = ['sensor', 'indicator', 'transmitter', 'gauge', 'instrument'];
  const valveTypes = ['valve'];
  
  if (instrumentTypes.some(t => type.includes(t))) {
    return 'circle';
  }
  if (valveTypes.some(t => type.includes(t))) {
    return 'bowtie';
  }
  
  // Could not infer
  return null;
}

/**
 * TIER 3 SAFEGUARD: Validate shape/type compatibility
 * Detects and corrects AI hallucinations where circular symbols are misclassified as valves
 * 
 * @param components - Array of detected components with shape and type fields
 * @returns Validated and corrected components with sanity check metadata
 */
export function validateShapeTypeCompatibility<T extends { 
  type?: string; 
  shape?: string;
  label?: string;
  meta?: any;
  confidence?: number;
}>(components: T[]): T[] {
  return components.map(comp => {
    let shape = comp.shape;
    let shapeInferred = false;
    
    // CRITICAL FIX: If shape is missing, try to infer it
    if (!shape && comp.type) {
      shape = inferShapeFromComponent(comp);
      if (shape) {
        shapeInferred = true;
        console.warn(
          `[Shape Inference] Component "${comp.label || comp.type}" missing shape field. ` +
          `Inferred shape: "${shape}". AI should have provided this!`
        );
      }
    }
    
    // Skip validation if still no shape information
    if (!shape || !comp.type) {
      if (!shape && comp.type) {
        console.warn(
          `[Shape Sanity Check] WARNING: Component "${comp.label || comp.type}" missing shape field ` +
          `and could not be inferred. Validation skipped. This may allow misclassifications!`
        );
      }
      return comp;
    }

    const normalizedShape = shape.toLowerCase();
    const type = comp.type;
    const compatibility = SHAPE_TYPE_COMPATIBILITY[normalizedShape];

    // Skip if shape not in compatibility rules
    if (!compatibility) {
      return comp;
    }

    // Check for forbidden type (critical error - likely hallucination)
    const isForbidden = compatibility.forbidden_types.some(forbidden => 
      type.toLowerCase().includes(forbidden.toLowerCase())
    );

    if (isForbidden) {
      console.warn(
        `[Shape Sanity Check] CRITICAL: Detected shape/type mismatch for component "${comp.label || comp.type}".\n` +
        `  Shape: ${normalizedShape}\n` +
        `  Type: ${type}\n` +
        `  Issue: ${compatibility.reasoning}\n` +
        `  Attempting auto-correction...`
      );

      // Attempt auto-correction using ISA tag pattern
      const correctedType = inferTypeFromTag(comp.label || '');
      
      if (correctedType) {
        console.log(`[Shape Sanity Check] Auto-corrected: ${type} → ${correctedType} (based on tag: ${comp.label})`);
        
        return {
          ...comp,
          shape: shape, // Add inferred or existing shape
          type: correctedType,
          confidence: Math.max(
            CONFIDENCE_ADJUSTMENTS.MIN_CONFIDENCE_AFTER_CORRECTION,
            (comp.confidence || CONFIDENCE_ADJUSTMENTS.DEFAULT_CONFIDENCE) - CONFIDENCE_ADJUSTMENTS.AUTO_CORRECTION_PENALTY
          ),
          meta: {
            ...comp.meta,
            shape_inferred: shapeInferred,
            original_type: type,
            correction_applied: true,
            correction_reason: `Shape/type mismatch: ${normalizedShape} cannot be ${type}. ${compatibility.reasoning}`,
            reasoning: `[CORRECTED] Original classification "${type}" contradicted detected shape "${normalizedShape}". ` +
                      `Re-classified as "${correctedType}" based on ISA tag pattern. ${compatibility.reasoning}`
          }
        };
      } else {
        // No ISA tag available for correction - flag as error
        console.error(
          `[Shape Sanity Check] ERROR: Cannot auto-correct ${comp.label || type}. ` +
          `No ISA tag pattern match found.`
        );
        
        return {
          ...comp,
          shape: shape, // Add inferred or existing shape
          confidence: Math.max(
            CONFIDENCE_ADJUSTMENTS.MIN_CONFIDENCE_VALIDATION_ERROR,
            (comp.confidence || CONFIDENCE_ADJUSTMENTS.DEFAULT_CONFIDENCE) - CONFIDENCE_ADJUSTMENTS.VALIDATION_ERROR_PENALTY
          ),
          meta: {
            ...comp.meta,
            shape_inferred: shapeInferred,
            validation_error: true,
            validation_issue: `Shape/type mismatch: ${normalizedShape} shape incompatible with ${type} type`,
            reasoning: `[ERROR] ${comp.meta?.reasoning || ''} | VALIDATION FAILED: Shape "${normalizedShape}" is incompatible with type "${type}". ${compatibility.reasoning}`
          }
        };
      }
    }

    // Check if type is in allowed list (validation success)
    const isAllowed = compatibility.allowed_types.some(allowed =>
      type.toLowerCase().includes(allowed.toLowerCase())
    );

    if (isAllowed) {
      // Validation passed - add shape if inferred and mark as validated
      return {
        ...comp,
        shape: shape, // Ensure shape is in output
        meta: {
          ...comp.meta,
          shape_inferred: shapeInferred,
          shape_validation: 'passed'
        }
      };
    }

    // Type not explicitly allowed or forbidden - pass through with shape
    return {
      ...comp,
      shape: shape // Ensure shape is included
    };
  });
}

/**
 * Infer component type from ISA tag pattern
 * Used as fallback correction strategy when shape/type mismatch is detected
 * 
 * @param tag - ISA tag string (e.g., "TI-101", "1LIT-12422A")
 * @returns Inferred component type or null if no pattern matches
 */
function inferTypeFromTag(tag: string): string | null {
  if (!tag) return null;

  // Normalize tag: remove all non-word characters (spaces, hyphens, underscores, dots, etc.)
  // This allows matching tags like "1LI-12422", "1LI_12422", "1LI.12422", etc.
  const normalizedTag = tag.toUpperCase().replace(/[^\w]/g, '');

  for (const [pattern, type] of Object.entries(ISA_TAG_PATTERNS)) {
    const regex = new RegExp(pattern);
    if (regex.test(normalizedTag)) {
      console.log(`[ISA Inference] Matched pattern "${pattern}" for tag "${tag}" → Type: ${type}`);
      return type;
    }
  }

  return null;
}

/**
 * Enhanced component normalization with shape/type validation
 * Combines type normalization with sanity checking
 */
export function normalizeAndValidateComponents<T extends { 
  type?: string;
  shape?: string;
  label?: string;
  meta?: any;
  confidence?: number;
}>(components: T[]): T[] {
  // First, normalize types
  const normalized = normalizeComponents(components);
  
  // Then, validate shape/type compatibility and auto-correct errors
  const validated = validateShapeTypeCompatibility(normalized);
  
  return validated;
}
