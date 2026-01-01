/**
 * ISA-5.1 - Instrumentation Symbols and Identification
 * Pure TypeScript implementation for tag parsing and validation
 * 
 * Reference: ISA-5.1-2009 (R2019) - Instrumentation Symbols and Identification
 */

export interface ParsedTag {
  original: string;
  area?: string; // Area/Unit designation
  function: string; // Function (T=Temperature, P=Pressure, F=Flow, etc.)
  loop: string; // Loop/Sequence number
  suffix?: string; // Modifier (A, B, C, etc.)
  isValid: boolean;
  errors: string[];
}

export interface TagValidationResult {
  tag: string;
  isValid: boolean;
  parsed?: ParsedTag;
  issues: string[];
  recommendations: string[];
}

/**
 * ISA-5.1 Function Letters
 * First letter indicates measured or initiating variable
 * Subsequent letters indicate readout/passive function or output/active function
 */
const FUNCTION_LETTERS: Record<string, string> = {
  // Measured/Initiating Variables
  'A': 'Analysis (Composition)',
  'B': 'Burner Flame',
  'C': 'User Choice',
  'D': 'User Choice',
  'E': 'Voltage',
  'F': 'Flow Rate',
  'G': 'User Choice (Manual Gage)',
  'H': 'Hand (Manual)',
  'I': 'Current (Electric)',
  'J': 'Power',
  'K': 'Time/Schedule',
  'L': 'Level',
  'M': 'User Choice (Moisture)',
  'O': 'User Choice (Orifice)',
  'P': 'Pressure',
  'Q': 'Quantity',
  'R': 'Radiation',
  'S': 'Speed/Frequency',
  'T': 'Temperature',
  'U': 'Multivariable',
  'V': 'Vibration',
  'W': 'Weight/Force',
  'X': 'Unclassified',
  'Y': 'Event/State',
  'Z': 'Position',
};

/**
 * Readout/Passive Function Letters (subsequent letters)
 */
const MODIFIER_LETTERS: Record<string, string> = {
  'A': 'Alarm',
  'C': 'Control',
  'D': 'Differential',
  'E': 'Element (Primary/Sensor)',
  'G': 'Glass/Gage/Viewing Device',
  'H': 'High',
  'I': 'Indicate',
  'K': 'Control Station',
  'L': 'Low',
  'M': 'Momentary/Middle/Intermediate',
  'N': 'User Choice',
  'O': 'Orifice/Restriction',
  'P': 'Point (Test Connection)',
  'Q': 'Integrate/Totalize',
  'R': 'Record',
  'S': 'Switch',
  'T': 'Transmit',
  'U': 'Multifunction',
  'V': 'Valve/Damper',
  'W': 'Well',
  'X': 'Unclassified',
  'Y': 'Relay/Compute',
  'Z': 'Driver/Actuator',
};

/**
 * Parse ISA-5.1 tag
 * 
 * Standard format: [AREA]-[FUNCTION][MODIFIER(S)]-[LOOP][SUFFIX]
 * Examples:
 *   - T-101A (Temperature transmitter, loop 101, suffix A)
 *   - 1-TIC-201 (Area 1, Temperature Indicating Controller, loop 201)
 *   - PIT-501B (Pressure Indicating Transmitter, loop 501, suffix B)
 * 
 * @param tag - Tag string to parse
 * @returns Parsed tag structure
 */
export function parseTag(tag: string): ParsedTag {
  const errors: string[] = [];
  const original = tag.trim().toUpperCase();
  
  // ISA tag pattern: [AREA-]FUNCTION[MODIFIERS]-LOOP[SUFFIX]
  // Example: 1-TIC-201A
  const pattern = /^(?:([A-Z0-9]+)-)?([A-Z])([A-Z]*)-(\d+)([A-Z])?$/;
  const match = original.match(pattern);
  
  if (!match) {
    errors.push('Tag does not match ISA-5.1 format: [AREA-]FUNCTION[MODIFIERS]-LOOP[SUFFIX]');
    return {
      original,
      function: '',
      loop: '',
      isValid: false,
      errors,
    };
  }
  
  const [, area, firstLetter, modifiers, loop, suffix] = match;
  const functionLetters = firstLetter + modifiers;
  
  // Validate first letter (measured variable)
  if (!FUNCTION_LETTERS[firstLetter]) {
    errors.push(`Invalid first letter '${firstLetter}': not a recognized measured variable`);
  }
  
  // Validate modifier letters
  for (const letter of modifiers) {
    if (!MODIFIER_LETTERS[letter]) {
      errors.push(`Invalid modifier letter '${letter}': not a recognized function`);
    }
  }
  
  // Check for common issues
  if (functionLetters.includes('C') && !functionLetters.includes('V')) {
    errors.push(
      'Control function (C) without Valve/Damper (V): Control point may lack final control element'
    );
  }
  
  if (functionLetters.includes('S') && !functionLetters.includes('H') && !functionLetters.includes('L')) {
    errors.push(
      'Switch (S) without High (H) or Low (L): Alarm/switch point may lack setpoint designation'
    );
  }
  
  return {
    original,
    area,
    function: functionLetters,
    loop,
    suffix,
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validate ISA-5.1 tag
 * 
 * @param tag - Tag string to validate
 * @returns Validation result with issues and recommendations
 */
export function validateTag(tag: string): TagValidationResult {
  const parsed = parseTag(tag);
  const issues: string[] = [...parsed.errors];
  const recommendations: string[] = [];
  
  // Additional validation checks
  if (parsed.isValid) {
    // Check for best practices
    if (parsed.function.length === 1) {
      recommendations.push(
        'Consider adding modifier letters to clarify function (e.g., T -> TIC for Temperature Indicating Controller)'
      );
    }
    
    // Check for common abbreviations
    if (parsed.function === 'T' && !parsed.function.includes('I') && !parsed.function.includes('R')) {
      recommendations.push(
        'Temperature sensor should typically include I (Indicate) or R (Record) function'
      );
    }
    
    // Check loop number format
    const loopNum = parseInt(parsed.loop, 10);
    if (loopNum < 100 || loopNum > 999) {
      recommendations.push(
        'ISA-5.1 convention: Use 3-digit loop numbers (100-999) for better organization'
      );
    }
  }
  
  return {
    tag,
    isValid: parsed.isValid,
    parsed,
    issues,
    recommendations,
  };
}

/**
 * Validate multiple tags
 */
export function validateMultipleTags(tags: string[]): TagValidationResult[] {
  return tags.map(tag => validateTag(tag));
}

/**
 * Check for duplicate tags
 */
export function findDuplicateTags(tags: string[]): string[] {
  const normalized = tags.map(t => t.trim().toUpperCase());
  const seen = new Set<string>();
  const duplicates = new Set<string>();
  
  for (const tag of normalized) {
    if (seen.has(tag)) {
      duplicates.add(tag);
    }
    seen.add(tag);
  }
  
  return Array.from(duplicates);
}

/**
 * Get function description for a tag
 */
export function getFunctionDescription(functionLetters: string): string {
  if (functionLetters.length === 0) {
    return 'Unknown function';
  }
  
  const descriptions: string[] = [];
  
  // First letter
  const firstLetter = functionLetters[0];
  if (FUNCTION_LETTERS[firstLetter]) {
    descriptions.push(FUNCTION_LETTERS[firstLetter]);
  }
  
  // Modifier letters
  for (let i = 1; i < functionLetters.length; i++) {
    const letter = functionLetters[i];
    if (MODIFIER_LETTERS[letter]) {
      descriptions.push(MODIFIER_LETTERS[letter]);
    }
  }
  
  return descriptions.join(' + ');
}

/**
 * Group tags by area
 */
export function groupTagsByArea(tags: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  
  for (const tag of tags) {
    const parsed = parseTag(tag);
    const area = parsed.area || 'NO_AREA';
    
    if (!groups[area]) {
      groups[area] = [];
    }
    groups[area].push(tag);
  }
  
  return groups;
}

/**
 * Group tags by function type
 */
export function groupTagsByFunction(tags: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  
  for (const tag of tags) {
    const parsed = parseTag(tag);
    const functionType = parsed.function[0] || 'UNKNOWN';
    
    if (!groups[functionType]) {
      groups[functionType] = [];
    }
    groups[functionType].push(tag);
  }
  
  return groups;
}
