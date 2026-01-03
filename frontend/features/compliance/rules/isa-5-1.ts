// File: hvac/features/compliance/rules/isa-5-1.ts

/**
 * ISA-5.1 - Instrumentation Symbols and Identification
 * Pure TypeScript implementation for tag parsing and validation.
 * 
 * ROLE: Deterministic Validator (The "Law")
 * INPUT: Raw text tags extracted by Gemini (e.g., "10-TIC-101A")
 * OUTPUT: Structured data & Validation Errors
 * 
 * Reference: ISA-5.1-2009 (R2019)
 */

export interface ParsedTag {
  original: string;
  area?: string;       // Area/Unit designation
  function: string;    // Function (T=Temp, P=Pressure)
  loop: string;        // Loop/Sequence number
  suffix?: string;     // Modifier (A, B, C)
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
 * First letter = Measured Variable
 */
const FUNCTION_LETTERS: Record<string, string> = {
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
 * Readout/Passive Function Letters (Subsequent letters)
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
 * Standard format: [AREA-]FUNCTION[MODIFIERS]-LOOP[SUFFIX]
 */
export function parseTag(tag: string): ParsedTag {
  const errors: string[] = [];
  // Normalize: Remove spaces, uppercase
  const original = tag.trim().toUpperCase().replace(/\s+/g, '-');
  
  // Regex: Optional Area -> Function -> Loop -> Optional Suffix
  // Supports: 10-TIC-101A, TIC-101, 101-A
  const pattern = /^(?:([A-Z0-9]+)-)?([A-Z])([A-Z]*)-(\d+)([A-Z])?$/;
  const match = original.match(pattern);
  
  if (!match) {
    errors.push('Tag format invalid. Expected: [AREA-]FUNCTION-LOOP[SUFFIX]');
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
  
  // 1. Validate First Letter
  if (!FUNCTION_LETTERS[firstLetter]) {
    errors.push(`Invalid Variable '${firstLetter}': Not a recognized ISA-5.1 variable`);
  }
  
  // 2. Validate Modifiers
  for (const letter of modifiers) {
    if (!MODIFIER_LETTERS[letter]) {
      errors.push(`Invalid Modifier '${letter}': Not a recognized ISA-5.1 function`);
    }
  }
  
  // 3. Logic Checks (The "Conscience")
  if (functionLetters.includes('C') && !functionLetters.includes('V')) {
    errors.push('Logic Error: Controller (C) detected without matching Valve/Damper (V).');
  }
  
  if (functionLetters.includes('S') && !functionLetters.includes('H') && !functionLetters.includes('L')) {
    errors.push('Logic Error: Switch (S) detected without Setpoint (H/L).');
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
 * Validate Tag with Recommendations
 */
export function validateTag(tag: string): TagValidationResult {
  const parsed = parseTag(tag);
  const issues: string[] = [...parsed.errors];
  const recommendations: string[] = [];
  
  if (parsed.isValid) {
    // Best Practice: T -> TIC
    if (parsed.function.length === 1) {
      recommendations.push(
        `Ambiguous Function: '${parsed.function}'. Consider adding modifiers (e.g., 'I' for Indicate).`
      );
    }
    
    // Best Practice: Temp Sensors
    if (parsed.function === 'T' && !parsed.function.includes('I') && !parsed.function.includes('R')) {
      recommendations.push(
        'Temperature Element usually requires Indication (I) or Transmission (T).'
      );
    }
    
    // Best Practice: Loop Numbers
    const loopNum = parseInt(parsed.loop, 10);
    if (loopNum < 100 && loopNum > 0) {
      recommendations.push('Convention: Loop numbers typically start at 100.');
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
 * Batch Validation
 */
export function validateMultipleTags(tags: string[]): TagValidationResult[] {
  return tags.map(tag => validateTag(tag));
}

/**
 * Duplicate Detection
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
 * Human Readable Description Generator
 * e.g. "TIC" -> "Temperature + Indicate + Control"
 */
export function getFunctionDescription(functionLetters: string): string {
  if (functionLetters.length === 0) return 'Unknown function';
  
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