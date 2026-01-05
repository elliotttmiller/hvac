/**
 * Enhanced ISA-5.1 Function Detection Utility
 * Addresses the null ISA function issues observed in production logs
 * Provides intelligent fallback and pattern matching for instrument tags
 */

import { parseISATag, ISA_TAG_PATTERNS as EXPANDED_ISA_PATTERNS } from '../knowledge-base/isa-5-1';

export interface ISAFunctionResult {
  isa_function: string | null;
  measured_variable: string | null;
  modifier: string | null;
  confidence: number;
  reasoning: string;
}

/**
 * ISA-5.1 Common Function Prefixes
 */
const ISA_PATTERNS = {
  // Measured/Initiating Variables (First Letter)
  measured: {
    'A': 'Analysis',
    'B': 'Burner/Combustion',
    'C': 'Conductivity',
    'D': 'Density/Specific Gravity',
    'E': 'Voltage',
    'F': 'Flow',
    'G': 'Gauging',
    'H': 'Hand',
    'I': 'Current',
    'J': 'Power',
    'K': 'Time/Time Schedule',
    'L': 'Level',
    'M': 'Moisture/Humidity',
    'N': 'User Defined',
    'O': 'User Defined',
    'P': 'Pressure',
    'Q': 'Quantity',
    'R': 'Radiation',
    'S': 'Speed/Frequency',
    'T': 'Temperature',
    'U': 'Multivariable',
    'V': 'Vibration/Position',
    'W': 'Weight/Force',
    'X': 'Unclassified',
    'Y': 'Event/State',
    'Z': 'Position/Dimension'
  },
  
  // Function Modifiers (Subsequent Letters)
  modifiers: {
    'A': 'Alarm',
    'C': 'Control',
    'D': 'Differential',
    'E': 'Element/Sensor',
    'F': 'Ratio',
    'G': 'Glass/Gauge',
    'H': 'High',
    'I': 'Indicate',
    'J': 'Scan',
    'K': 'Time Rate of Change',
    'L': 'Low',
    'M': 'Middle/Intermediate',
    'N': 'User Defined',
    'O': 'Orifice',
    'P': 'Point (Test Connection)',
    'Q': 'Integrate/Totalize',
    'R': 'Record',
    'S': 'Switch',
    'T': 'Transmit',
    'U': 'Multifunction',
    'V': 'Valve',
    'W': 'Well',
    'X': 'Unclassified',
    'Y': 'Relay/Compute',
    'Z': 'Drive/Actuate'
  }
};

/**
 * Common HVAC Instrument Tag Patterns
 */
const HVAC_TAG_PATTERNS = [
  { pattern: /^([TPFL])T-?\d+/, type: 'Transmitter', example: 'TT-101, PT-202' },
  { pattern: /^([TPFL])IC-?\d+/, type: 'Indicating Controller', example: 'TIC-101' },
  { pattern: /^([TPFL])I-?\d+/, type: 'Indicator', example: 'TI-101, PI-202' },
  { pattern: /^([TPFL])CV-?\d+/, type: 'Control Valve', example: 'TCV-101, FCV-202' },
  { pattern: /^([TPFL])V-?\d+/, type: 'Valve', example: 'TV-101, PV-202' },
  { pattern: /^([TPFL])S-?\d+/, type: 'Switch', example: 'TS-101, PS-202' },
  { pattern: /^([TPFL])ALL?-?\d+/, type: 'Alarm Low/Low', example: 'PALL-292204' },
  { pattern: /^([TPFL])AH-?\d+/, type: 'Alarm High', example: 'TAH-101' },
  { pattern: /^([TPFL])E-?\d+/, type: 'Element/Sensor', example: 'TE-101' },
  { pattern: /^BV-?\d+/, type: 'Ball Valve', example: 'BV-301221' },
  { pattern: /^SDV-?\d+/, type: 'Solenoid Valve', example: 'SDV-1' },
  { pattern: /^SVC-?\d*/, type: 'Signal Converter', example: 'SVC' },
  { pattern: /^([TPFL])Y-?\d+/, type: 'Relay/Compute', example: 'TY-101' },
  { pattern: /^HT-?\d+/, type: 'Humidity Transmitter', example: 'HT-101' },
  { pattern: /^ST-?\d+/, type: 'Speed Transmitter', example: 'ST-101' }
];

// Pattern for cleaning/normalizing tag labels
// Removes underscores and extra spaces, converts to hyphen-separated format
const TAG_NORMALIZATION_PATTERN = /[_\s]+/g;

/**
 * Extract ISA function from component label/tag
 * Now uses the enhanced parseISATag function from knowledge base
 */
export function detectISAFunction(
  label: string,
  type: string,
  description?: string
): ISAFunctionResult {
  // Clean the label: remove underscores/spaces and convert to uppercase
  const cleanLabel = label.trim().toUpperCase().replace(TAG_NORMALIZATION_PATTERN, '-');
  
  // First, try the comprehensive parseISATag function
  const parsed = parseISATag(cleanLabel);
  if (parsed.confidence > 0.6) {
    return {
      isa_function: parsed.functions.length > 0 ? parsed.measuredVariable + parsed.functions.join('') : parsed.measuredVariable,
      measured_variable: parsed.measuredVariable,
      modifier: parsed.modifier,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning
    };
  }
  
  // Fallback: Try direct tag pattern matching
  for (const { pattern, type: tagType } of HVAC_TAG_PATTERNS) {
    const match = cleanLabel.match(pattern);
    if (match) {
      const prefix = match[1] || cleanLabel.substring(0, 2);
      const measured = prefix[0];
      const modifier = prefix.length > 1 ? prefix.substring(1) : null;
      
      return {
        isa_function: prefix,
        measured_variable: ISA_PATTERNS.measured[measured] || null,
        modifier: modifier,
        confidence: 0.95,
        reasoning: `Matched standard ISA tag pattern: ${tagType} (${cleanLabel})`
      };
    }
  }
  
  // Fallback: Try to extract from component type
  const isaFromType = inferISAFromComponentType(type, label);
  if (isaFromType) {
    return isaFromType;
  }
  
  // Try to extract from description
  if (description) {
    const isaFromDesc = inferISAFromDescription(description, label);
    if (isaFromDesc) {
      return isaFromDesc;
    }
  }
  
  // Last resort: partial matching
  if (cleanLabel.length >= 2) {
    const firstLetter = cleanLabel[0];
    if (ISA_PATTERNS.measured[firstLetter]) {
      const secondLetter = cleanLabel[1];
      const modifier = ISA_PATTERNS.modifiers[secondLetter];
      
      if (modifier) {
        return {
          isa_function: firstLetter + secondLetter,
          measured_variable: ISA_PATTERNS.measured[firstLetter],
          modifier: modifier,
          confidence: 0.7,
          reasoning: `Partial ISA pattern match from label: ${cleanLabel}`
        };
      }
    }
  }
  
  // No match found
  return {
    isa_function: null,
    measured_variable: null,
    modifier: null,
    confidence: 0.0,
    reasoning: `No ISA pattern detected for: ${cleanLabel} (type: ${type})`
  };
}

/**
 * Infer ISA function from component type
 */
function inferISAFromComponentType(type: string, label: string): ISAFunctionResult | null {
  const typeMap: Record<string, { isa: string, var: string, mod: string, conf: number }> = {
    'sensor_temperature': { isa: 'TT', var: 'Temperature', mod: 'Transmit', conf: 0.85 },
    'sensor_pressure': { isa: 'PT', var: 'Pressure', mod: 'Transmit', conf: 0.85 },
    'sensor_flow': { isa: 'FT', var: 'Flow', mod: 'Transmit', conf: 0.85 },
    'sensor_level': { isa: 'LT', var: 'Level', mod: 'Transmit', conf: 0.85 },
    'valve_control': { isa: 'CV', var: 'Control', mod: 'Valve', conf: 0.80 },
    'valve_ball': { isa: 'BV', var: 'Ball', mod: 'Valve', conf: 0.90 },
    'valve_solenoid': { isa: 'SDV', var: 'Solenoid', mod: 'Valve', conf: 0.90 },
    'instrument_controller': { isa: 'IC', var: 'Indicating', mod: 'Control', conf: 0.75 },
    'instrument_indicator': { isa: 'I', var: 'Indicate', mod: 'Display', conf: 0.75 },
    'instrument_relay': { isa: 'Y', var: 'Relay', mod: 'Compute', conf: 0.70 }
  };
  
  const mapping = typeMap[type];
  if (mapping) {
    return {
      isa_function: mapping.isa,
      measured_variable: mapping.var,
      modifier: mapping.mod,
      confidence: mapping.conf,
      reasoning: `Inferred from component type: ${type}`
    };
  }
  
  return null;
}

/**
 * Infer ISA function from description text
 */
function inferISAFromDescription(description: string, label: string): ISAFunctionResult | null {
  const desc = description.toLowerCase();
  
  // Temperature related
  if (desc.includes('temperature transmitter')) {
    return {
      isa_function: 'TT',
      measured_variable: 'Temperature',
      modifier: 'Transmit',
      confidence: 0.80,
      reasoning: `Extracted from description: "${description}"`
    };
  }
  
  // Pressure related
  if (desc.includes('pressure transmitter')) {
    return {
      isa_function: 'PT',
      measured_variable: 'Pressure',
      modifier: 'Transmit',
      confidence: 0.80,
      reasoning: `Extracted from description: "${description}"`
    };
  }
  
  if (desc.includes('pressure indicator')) {
    return {
      isa_function: 'PI',
      measured_variable: 'Pressure',
      modifier: 'Indicate',
      confidence: 0.80,
      reasoning: `Extracted from description: "${description}"`
    };
  }
  
  // Flow related
  if (desc.includes('flow control valve')) {
    return {
      isa_function: 'FCV',
      measured_variable: 'Flow',
      modifier: 'Control Valve',
      confidence: 0.85,
      reasoning: `Extracted from description: "${description}"`
    };
  }
  
  // Valve types
  if (desc.includes('ball valve')) {
    return {
      isa_function: 'BV',
      measured_variable: 'Ball',
      modifier: 'Valve',
      confidence: 0.85,
      reasoning: `Extracted from description: "${description}"`
    };
  }
  
  if (desc.includes('solenoid') && desc.includes('valve')) {
    return {
      isa_function: 'SDV',
      measured_variable: 'Solenoid',
      modifier: 'Valve',
      confidence: 0.85,
      reasoning: `Extracted from description: "${description}"`
    };
  }
  
  // Alarm related
  if (desc.includes('alarm') && desc.includes('low')) {
    const firstChar = label[0] || 'P';
    return {
      isa_function: `${firstChar}AL`,
      measured_variable: ISA_PATTERNS.measured[firstChar] || 'Unknown',
      modifier: 'Alarm Low',
      confidence: 0.75,
      reasoning: `Extracted from description: "${description}"`
    };
  }
  
  return null;
}

/**
 * Batch process components to add ISA functions
 */
export function enhanceComponentsWithISA(components: any[]): any[] {
  return components.map(component => {
    // Skip if ISA function already exists and is valid
    if (component.meta?.isa_function && component.meta.isa_function !== null) {
      return component;
    }
    
    // Detect ISA function
    const isaResult = detectISAFunction(
      component.label || component.id || '',
      component.type || '',
      component.meta?.description || component.meta?.functional_desc
    );
    
    // Enhance component metadata
    return {
      ...component,
      meta: {
        ...component.meta,
        isa_function: isaResult.isa_function,
        isa_measured_variable: isaResult.measured_variable,
        isa_modifier: isaResult.modifier,
        isa_confidence: isaResult.confidence,
        isa_reasoning: isaResult.reasoning
      }
    };
  });
}

/**
 * Validate ISA tag format
 */
export function validateISATag(tag: string): {
  valid: boolean;
  errors: string[];
  suggestions: string[];
} {
  const errors: string[] = [];
  const suggestions: string[] = [];
  
  // Check length
  if (tag.length < 2) {
    errors.push('Tag too short (minimum 2 characters)');
    return { valid: false, errors, suggestions };
  }
  
  // Check first letter (measured variable)
  const firstLetter = tag[0].toUpperCase();
  if (!ISA_PATTERNS.measured[firstLetter]) {
    errors.push(`Invalid measured variable: ${firstLetter}`);
    suggestions.push('Use standard ISA first letters: T, P, F, L, etc.');
  }
  
  // Check subsequent letters (modifiers)
  for (let i = 1; i < Math.min(tag.length, 4); i++) {
    const letter = tag[i].toUpperCase();
    if (letter === '-') break; // End of function letters
    if (/\d/.test(letter)) break; // Start of loop number
    
    if (!ISA_PATTERNS.modifiers[letter]) {
      errors.push(`Invalid modifier: ${letter}`);
      suggestions.push(`Valid modifiers: ${Object.keys(ISA_PATTERNS.modifiers).join(', ')}`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    suggestions
  };
}
