/**
 * Shape Validation & Geometric Enforcement
 * Implements strict geometric rules to prevent AI hallucinations
 * 
 * PHILOSOPHY: "Code is more reliable than LLM probability for geometric constants."
 * 
 * This module enforces hard constraints based on ISA-5.1 shape conventions:
 * - Circles = Instruments/Sensors (NEVER valves, except ball/butterfly)
 * - Bowties/Diamonds = Valves (with actuators) OR Logic/PLC
 * - Triangles = Control valves or check valves
 */

import { DetectedComponent } from '@/features/document-analysis/types';

/**
 * Valid shapes enum (from ISA-5.1)
 */
const VALID_SHAPES = [
  'circle',
  'square',
  'diamond',
  'bowtie',
  'triangle',
  'rectangle',
  'hexagon',
  'cloud',
  'line',
  'complex_assembly'
] as const;

type ValidShape = typeof VALID_SHAPES[number];

/**
 * Shape-to-type mapping rules
 */
const SHAPE_TYPE_RULES: Record<ValidShape, {
  allowed: string[];
  forbidden: string[];
  reasoning: string;
}> = {
  circle: {
    allowed: [
      'instrument',
      'sensor',
      'sensor_temperature',
      'sensor_pressure',
      'sensor_flow',
      'sensor_level',
      'instrument_indicator',
      'instrument_transmitter',
      'instrument_controller',
      'valve_ball',        // Ball valves have circle body with diagonal line
      'valve_butterfly',   // Butterfly valves have circle body with bar
      'analyzer',
      'gauge'
    ],
    forbidden: [
      'valve_gate',
      'valve_globe',
      'valve_control',
      'valve_check',
      'valve_plug',
      'valve_needle'
    ],
    reasoning: 'Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1'
  },
  bowtie: {
    allowed: [
      'valve_control',
      'valve_gate',
      'valve_globe',
      'valve_ball',
      'valve_butterfly',
      'valve_plug',
      'valve',
      'actuator'
    ],
    forbidden: [
      'instrument',
      'sensor',
      'sensor_temperature',
      'sensor_pressure',
      'sensor_flow'
    ],
    reasoning: 'Bowtie shapes represent valve bodies per ISA-5.1'
  },
  diamond: {
    allowed: [
      'logic',
      'plc',
      'instrument_logic',
      'interlock',
      'valve_control',  // Some control valves use diamond if they have logic
      'sequencer'
    ],
    forbidden: [
      'sensor',
      'instrument_indicator',
      'instrument_transmitter'
    ],
    reasoning: 'Diamond shapes represent logic/PLC functions or control valves with logic per ISA-5.1'
  },
  triangle: {
    allowed: [
      'valve_control',
      'valve_check',
      'actuator',
      'valve'
    ],
    forbidden: [
      'instrument',
      'sensor',
      'logic',
      'plc'
    ],
    reasoning: 'Triangle shapes represent control valve bodies or check valves per ISA-5.1'
  },
  square: {
    allowed: [
      'panel_instrument',
      'shared_display',
      'hmi',
      'dcs',
      'scada',
      'equipment',
      'damper',
      'actuator'
    ],
    forbidden: [],
    reasoning: 'Square shapes represent panel instruments or equipment per ISA-5.1'
  },
  rectangle: {
    allowed: [
      'valve_gate',
      'equipment',
      'ahu',
      'pump',
      'heat_exchanger',
      'tank',
      'vessel',
      'orifice_plate',
      'strainer',
      'filter'
    ],
    forbidden: [],
    reasoning: 'Rectangle shapes represent gate valves or equipment outlines per ISA-5.1'
  },
  hexagon: {
    allowed: [
      'computer',
      'data_logger',
      'historian',
      'server',
      'processor'
    ],
    forbidden: [
      'valve',
      'instrument',
      'sensor'
    ],
    reasoning: 'Hexagon shapes represent computer functions per ISA-5.1'
  },
  cloud: {
    allowed: [
      'annotation',
      'note',
      'label',
      'text'
    ],
    forbidden: [
      'valve',
      'instrument',
      'sensor',
      'equipment'
    ],
    reasoning: 'Cloud shapes represent annotations or notes'
  },
  line: {
    allowed: [
      'pipe',
      'duct',
      'connection',
      'signal_line',
      'process_line'
    ],
    forbidden: [
      'valve',
      'instrument',
      'sensor',
      'equipment'
    ],
    reasoning: 'Line shapes represent connections, not components'
  },
  complex_assembly: {
    allowed: [
      'equipment',
      'ahu',
      'chiller',
      'cooling_tower',
      'pump_assembly',
      'valve_assembly'
    ],
    forbidden: [],
    reasoning: 'Complex assemblies represent multi-part equipment'
  }
};

/**
 * Normalize shape string to standard enum
 */
function normalizeShape(shape: string | undefined): ValidShape | null {
  if (!shape) return null;
  
  const normalized = shape.toLowerCase().trim();
  
  // Direct match
  if (VALID_SHAPES.includes(normalized as ValidShape)) {
    return normalized as ValidShape;
  }
  
  // Fuzzy matching for common variations
  const fuzzyMap: Record<string, ValidShape> = {
    'circular': 'circle',
    'round': 'circle',
    'bow-tie': 'bowtie',
    'bow tie': 'bowtie',
    'diamand': 'diamond', // Common typo
    'rhombus': 'diamond',
    'triangular': 'triangle',
    'rect': 'rectangle',
    'rectangular': 'rectangle',
    'hex': 'hexagon',
    'hexagonal': 'hexagon',
    'sq': 'square',
    'box': 'square'
  };
  
  if (fuzzyMap[normalized]) {
    return fuzzyMap[normalized];
  }
  
  return null;
}

/**
 * Check if a component type is a valve type
 */
function isValveType(type: string): boolean {
  const valveTypes = [
    'valve',
    'valve_control',
    'valve_gate',
    'valve_globe',
    'valve_check',
    'valve_ball',
    'valve_butterfly',
    'valve_plug',
    'valve_needle',
    'valve_diaphragm',
    'valve_relief',
    'valve_solenoid'
  ];
  
  const normalized = type.toLowerCase();
  return valveTypes.some(v => normalized.includes(v));
}

/**
 * Check if a component type is an instrument/sensor type
 */
function isInstrumentType(type: string): boolean {
  const instrumentTypes = [
    'instrument',
    'sensor',
    'transmitter',
    'indicator',
    'controller',
    'analyzer',
    'gauge'
  ];
  
  const normalized = type.toLowerCase();
  return instrumentTypes.some(i => normalized.includes(i));
}

/**
 * Apply HVAC domain-specific tag-shape conflict resolution
 * Handles edge cases where text tags might conflict with visual geometry.
 * 
 * Examples:
 * - PV on Circle → Pressure Indicator (NOT Pressure Valve)
 * - RV on Circle → Could be Radiation instrument (NOT Relief Valve)
 * - TV on Bowtie with actuator → Temperature Control Valve
 * 
 * @param component - Component to check
 * @param shape - Normalized shape
 * @returns Corrected type if conflict detected, null otherwise
 */
function resolveTagShapeConflict(
  component: DetectedComponent,
  shape: ValidShape
): { correctedType: string; reason: string } | null {
  const label = component.label?.toUpperCase() || '';
  const type = component.type?.toLowerCase() || '';
  
  // Edge Case 1: PV on Circle = Pressure Indicator (HVAC convention)
  // In HVAC/BAS context, PV often means "Pressure View/Indicator" not "Pressure Valve"
  if (shape === 'circle' && label.match(/^PV[-\s]?\d+/)) {
    if (isValveType(type)) {
      return {
        correctedType: 'instrument_indicator',
        reason: 'HVAC Rule: PV tag on circle shape indicates Pressure Indicator/View, not Pressure Valve'
      };
    }
  }
  
  // Edge Case 2: Any "*I" tag on Circle must be Indicator
  // PI, TI, FI, LI, etc. are ALWAYS indicators, never valves
  if (shape === 'circle' && label.match(/^[A-Z]{1,2}I[-\s]?\d+/)) {
    if (isValveType(type)) {
      const varLetter = label.charAt(0);
      const varMap: Record<string, string> = {
        'P': 'Pressure',
        'T': 'Temperature',
        'F': 'Flow',
        'L': 'Level',
        'H': 'Humidity',
        'A': 'Analysis'
      };
      const varName = varMap[varLetter] || 'Unknown';
      
      return {
        correctedType: 'instrument_indicator',
        reason: `ISA Rule: ${label} = ${varName} Indicator (circles with "I" suffix are indicators, never valves)`
      };
    }
  }
  
  // Edge Case 3: RV on Circle could be Radiation instrument (not Relief Valve)
  // Relief valves typically have bowtie or triangle shapes with spring symbol
  if (shape === 'circle' && label.match(/^RV[-\s]?\d+/)) {
    if (type.includes('relief') || type.includes('pressure_relief')) {
      return {
        correctedType: 'sensor_radiation',
        reason: 'Shape Rule: RV on circle likely indicates Radiation sensor (relief valves use bowtie/triangle with spring)'
      };
    }
  }
  
  // Edge Case 4: TV/FV/PV on Bowtie WITHOUT actuator = should not be control valve
  // If it's a bowtie but no actuator, it should be gate or globe, not control
  if (shape === 'bowtie' && type.includes('control')) {
    const hasActuator = component.meta?.visual_signature?.includes('actuator') || 
                        component.meta?.description?.toLowerCase().includes('actuator');
    if (!hasActuator) {
      return {
        correctedType: 'valve_gate',
        reason: 'Shape Rule: Bowtie without actuator is Gate valve (control valves require actuator symbol)'
      };
    }
  }
  
  // Edge Case 5: Circle without internal line can NEVER be gate/globe/control valve
  // Only ball (diagonal line) or butterfly (bar) valves use circle shapes
  if (shape === 'circle' && (type.includes('gate') || type.includes('globe') || 
      (type.includes('control') && !type.includes('controller')))) {
    const visual = component.meta?.visual_signature || '';
    const hasDiagonal = visual.includes('diagonal');
    const hasBar = visual.includes('bar');
    
    if (hasDiagonal) {
      return {
        correctedType: 'valve_ball',
        reason: 'Shape Rule: Circle with diagonal line = Ball valve'
      };
    } else if (hasBar) {
      return {
        correctedType: 'valve_butterfly',
        reason: 'Shape Rule: Circle with bar = Butterfly valve'
      };
    } else {
      // No internal actuating element - must be instrument
      return {
        correctedType: 'instrument_indicator',
        reason: 'Shape Rule: Circle without internal actuating element = Instrument (never gate/globe/control valve)'
      };
    }
  }
  
  return null;
}

/**
 * Validate and correct a single component based on shape-type consistency
 * 
 * @param component - Component to validate
 * @returns Corrected component with validation metadata
 */
export function validateComponentShape(component: DetectedComponent): DetectedComponent {
  // Extract shape
  const rawShape = component.shape || component.meta?.shape;
  const shape = normalizeShape(rawShape);
  
  // If no shape detected, can't validate
  if (!shape) {
    return {
      ...component,
      meta: {
        ...component.meta,
        shape_validation: {
          validated: false,
          reason: 'No shape information available'
        }
      }
    };
  }
  
  const type = component.type || 'unknown';
  const rules = SHAPE_TYPE_RULES[shape];
  
  // CRITICAL: Apply HVAC domain-specific conflict resolution FIRST
  // This handles edge cases like PV on Circle = Pressure Indicator
  const conflict = resolveTagShapeConflict(component, shape);
  if (conflict) {
    console.log(
      `[Shape Validator] ${component.id}: Conflict resolved - ${conflict.reason}`
    );
    
    return {
      ...component,
      type: conflict.correctedType,
      meta: {
        ...component.meta,
        original_type: type,
        shape_validation: {
          validated: true,
          corrected: true,
          original_shape: rawShape,
          normalized_shape: shape,
          correction_reason: conflict.reason,
          reasoning: `Tag-Shape Conflict Resolution: ${conflict.reason}`
        }
      }
    };
  }
  
  // Check if type is forbidden for this shape
  const isForbidden = rules.forbidden.some(forbidden => 
    type.toLowerCase().includes(forbidden.toLowerCase())
  );
  
  if (isForbidden) {
    console.warn(
      `[Shape Validator] VIOLATION: ${type} cannot have ${shape} shape. ` +
      `Applying correction...`
    );
    
    // Apply correction based on shape
    let correctedType = type;
    let correctionReason = '';
    
    if (shape === 'circle' && isValveType(type)) {
      // CRITICAL FIX: Circles classified as valves (except ball/butterfly)
      if (!type.includes('ball') && !type.includes('butterfly')) {
        correctedType = 'instrument';
        correctionReason = `Corrected from ${type} to instrument: Circles represent instruments per ISA-5.1, not valves`;
      }
    } else if ((shape === 'bowtie' || shape === 'triangle') && isInstrumentType(type)) {
      // Instruments shouldn't have bowtie/triangle shapes
      correctedType = 'valve_control';
      correctionReason = `Corrected from ${type} to valve_control: Bowtie/triangle shapes represent valves per ISA-5.1`;
    } else if (shape === 'diamond' && isInstrumentType(type) && !type.includes('logic')) {
      // Regular instruments shouldn't have diamond shapes
      correctedType = 'instrument_logic';
      correctionReason = `Corrected from ${type} to instrument_logic: Diamond shapes represent logic functions per ISA-5.1`;
    } else {
      // Generic correction: use first allowed type
      correctedType = rules.allowed[0] || 'unknown';
      correctionReason = `Corrected from ${type} to ${correctedType}: Shape-type mismatch`;
    }
    
    return {
      ...component,
      type: correctedType,
      meta: {
        ...component.meta,
        original_type: type,
        shape_validation: {
          validated: true,
          corrected: true,
          original_shape: rawShape,
          normalized_shape: shape,
          correction_reason: correctionReason,
          reasoning: rules.reasoning
        }
      }
    };
  }
  
  // Check if type is explicitly allowed
  const isAllowed = rules.allowed.some(allowed => 
    type.toLowerCase().includes(allowed.toLowerCase())
  );
  
  return {
    ...component,
    shape: shape,
    meta: {
      ...component.meta,
      shape_validation: {
        validated: true,
        corrected: false,
        normalized_shape: shape,
        is_allowed: isAllowed,
        reasoning: rules.reasoning
      }
    }
  };
}

/**
 * Validate all components in an array
 * 
 * @param components - Array of components to validate
 * @returns Array of validated/corrected components with statistics
 */
export function validateComponentShapes(
  components: DetectedComponent[]
): {
  components: DetectedComponent[];
  statistics: {
    total: number;
    validated: number;
    corrected: number;
    violations: Array<{
      id: string;
      original_type: string;
      corrected_type: string;
      shape: string;
      reason: string;
    }>;
  };
} {
  console.log('[Shape Validator] Starting shape validation...');
  
  const violations: any[] = [];
  
  const validatedComponents = components.map(comp => {
    const validated = validateComponentShape(comp);
    
    // Track violations for logging
    if (validated.meta?.shape_validation?.corrected) {
      violations.push({
        id: comp.id,
        original_type: validated.meta.original_type || comp.type,
        corrected_type: validated.type,
        shape: validated.meta.shape_validation.normalized_shape,
        reason: validated.meta.shape_validation.correction_reason
      });
    }
    
    return validated;
  });
  
  const statistics = {
    total: components.length,
    validated: validatedComponents.filter(c => c.meta?.shape_validation?.validated).length,
    corrected: violations.length,
    violations
  };
  
  if (violations.length > 0) {
    console.warn(
      `[Shape Validator] Fixed ${violations.length} shape-type violations:\n` +
      violations.map(v => `  - ${v.id}: ${v.original_type} → ${v.corrected_type} (${v.shape})`).join('\n')
    );
  } else {
    console.log('[Shape Validator] All components passed shape validation');
  }
  
  return {
    components: validatedComponents,
    statistics
  };
}

/**
 * Apply shape validation to a visual analysis result
 */
export function applyShapeValidation(
  components: DetectedComponent[]
): DetectedComponent[] {
  const { components: validated, statistics } = validateComponentShapes(components);
  
  console.log(
    `[Shape Validator] Validation complete: ${statistics.validated}/${statistics.total} validated, ` +
    `${statistics.corrected} corrected`
  );
  
  return validated;
}
