/**
 * ISA-5.1 Tag Parser - Deterministic Implementation
 * 
 * Philosophy: Don't ask an LLM to guess what "PDIT" means - calculate it.
 * 
 * This module implements a strict positional logic parser for ISA-5.1 tags
 * following the official standard rules:
 * 
 * 1. First Letter: Measured/Initiating Variable (P, T, F, L, etc.)
 * 2. Second Letter (optional): Modifier if it's D, F, Q, S, or K
 * 3. Remaining Letters: Functions (I, T, C, V, S, A, E, etc.)
 * 
 * Examples:
 * - PDIT: P(Pressure) D(Differential) I(Indicator) T(Transmitter)
 * - FIT: F(Flow) I(Indicator) T(Transmitter)
 * - LAL: L(Level) A(Alarm) L(Low)
 * 
 * References:
 * - https://instrunexus.com/isa-5-1-instrumentation-symbols-and-identifications-detailed-analysis/
 * - https://www.engineeringtoolbox.com/isa-intrumentation-codes-d_415.html
 */

/**
 * ISA-5.1 First Letter Definitions (Measured/Initiating Variable)
 */
const FIRST_LETTER_MAP: Record<string, string> = {
  'A': 'Analysis',
  'B': 'Burner/Combustion',
  'C': 'Conductivity',
  'D': 'Density',
  'E': 'Voltage',
  'F': 'Flow',
  'G': 'Gauging/Position',
  'H': 'Hand (Manual)',
  'I': 'Current',
  'J': 'Power',
  'K': 'Time/Schedule',
  'L': 'Level',
  'M': 'Moisture/Humidity',
  'N': 'User Choice',
  'O': 'User Choice',
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
  'Z': 'Position/Dimension'
};

/**
 * ISA-5.1 Modifier Letters (Second Position Only)
 * These ONLY apply when they appear as the second letter after the measured variable.
 */
const MODIFIER_MAP: Record<string, string> = {
  'D': 'Differential',
  'F': 'Ratio/Fraction',
  'Q': 'Integrate/Totalize',
  'S': 'Safety',
  'K': 'Time Rate of Change',
  'M': 'Momentary/Peak',
  'J': 'Scan'
};

/**
 * ISA-5.1 Function Letters (Succeeding Letters)
 * These describe what the instrument does (output/passive function).
 */
const FUNCTION_MAP: Record<string, string> = {
  'A': 'Alarm',
  'C': 'Controller',
  'E': 'Element/Sensor',
  'G': 'Glass/Gauge',
  'H': 'High',
  'I': 'Indicator',
  'K': 'Control Station',
  'L': 'Low',
  'M': 'Middle/Intermediate',
  'O': 'Orifice',
  'P': 'Point (Test)',
  'R': 'Recorder',
  'S': 'Switch',
  'T': 'Transmitter',
  'U': 'Multifunction',
  'V': 'Valve/Damper',
  'W': 'Well',
  'Y': 'Relay/Compute',
  'Z': 'Actuator/Driver'
};

/**
 * Parsed ISA Tag Result
 */
export interface ParsedTag {
  original: string;
  cleaned: string;
  measuredVariable: string | null;
  measuredVariableName: string | null;
  modifier: string | null;
  modifierName: string | null;
  functions: Array<{ letter: string; name: string }>;
  loopNumber: string | null;
  suffix: string | null;
  description: string;
  confidence: number;
  parseSteps: string[];
}

/**
 * Parse an ISA-5.1 tag using strict positional logic.
 * 
 * Algorithm:
 * 1. Clean and normalize the input
 * 2. Tokenize into [Letters]-[Number][Suffix]
 * 3. Walk through letters using positional rules:
 *    - Position 0: Measured Variable (REQUIRED)
 *    - Position 1: Modifier (ONLY if D, F, Q, S, K, M, J)
 *    - Remaining: Functions
 * 4. Construct human-readable description
 * 
 * @param rawTag The raw tag string (e.g., "PDIT-101", "FIT 202A", "LAL")
 * @returns Parsed tag structure with full semantic information
 */
export function parseISATag(rawTag: string): ParsedTag {
  const parseSteps: string[] = [];
  
  // Step 1: Clean the tag
  const cleaned = rawTag.trim().toUpperCase().replace(/[_\s]/g, '-');
  parseSteps.push(`Cleaned: "${rawTag}" → "${cleaned}"`);
  
  // Step 2: Tokenize - match pattern [LETTERS]-[NUMBER][SUFFIX]
  const match = cleaned.match(/^([A-Z]{1,6})-?(\d{1,6})?([A-Z])?$/);
  
  if (!match) {
    parseSteps.push(`FAILED: No valid ISA pattern detected`);
    return {
      original: rawTag,
      cleaned,
      measuredVariable: null,
      measuredVariableName: null,
      modifier: null,
      modifierName: null,
      functions: [],
      loopNumber: null,
      suffix: null,
      description: 'Invalid ISA tag format',
      confidence: 0,
      parseSteps
    };
  }
  
  const [, letters, loopNumber, suffix] = match;
  parseSteps.push(`Tokenized: Letters="${letters}", Loop="${loopNumber || 'none'}", Suffix="${suffix || 'none'}"`);
  
  // Step 3: Position 0 - Measured Variable (REQUIRED)
  const measuredVariable = letters[0];
  const measuredVariableName = FIRST_LETTER_MAP[measuredVariable];
  
  if (!measuredVariableName) {
    parseSteps.push(`Position 0: Unknown measured variable "${measuredVariable}"`);
    return {
      original: rawTag,
      cleaned,
      measuredVariable,
      measuredVariableName: null,
      modifier: null,
      modifierName: null,
      functions: [],
      loopNumber: loopNumber || null,
      suffix: suffix || null,
      description: `Unknown variable: ${measuredVariable}`,
      confidence: 0.3,
      parseSteps
    };
  }
  
  parseSteps.push(`Position 0: "${measuredVariable}" = ${measuredVariableName} (Measured Variable)`);
  
  // Step 4: Position 1 - Check for Modifier
  let modifier: string | null = null;
  let modifierName: string | null = null;
  let functionStartIndex = 1;
  
  if (letters.length > 1) {
    const secondLetter = letters[1];
    if (MODIFIER_MAP[secondLetter]) {
      modifier = secondLetter;
      modifierName = MODIFIER_MAP[secondLetter];
      functionStartIndex = 2;
      parseSteps.push(`Position 1: "${modifier}" = ${modifierName} (Modifier)`);
    } else {
      parseSteps.push(`Position 1: "${secondLetter}" is not a modifier, treating as function`);
    }
  }
  
  // Step 5: Remaining positions - Functions
  const functions: Array<{ letter: string; name: string }> = [];
  for (let i = functionStartIndex; i < letters.length; i++) {
    const letter = letters[i];
    const functionName = FUNCTION_MAP[letter];
    
    if (functionName) {
      functions.push({ letter, name: functionName });
      parseSteps.push(`Position ${i}: "${letter}" = ${functionName} (Function)`);
    } else {
      parseSteps.push(`Position ${i}: "${letter}" = Unknown function (ignored)`);
    }
  }
  
  // Step 6: Build human-readable description
  let description = measuredVariableName;
  if (modifierName) {
    description += ` ${modifierName}`;
  }
  if (functions.length > 0) {
    description += ` ${functions.map(f => f.name).join(' ')}`;
  }
  
  parseSteps.push(`Final Description: "${description}"`);
  
  // Step 7: Calculate confidence
  let confidence = 1.0;
  if (!measuredVariableName) confidence -= 0.5;
  if (letters.length > 1 && functions.length === 0) confidence -= 0.2;
  
  return {
    original: rawTag,
    cleaned,
    measuredVariable,
    measuredVariableName,
    modifier,
    modifierName,
    functions,
    loopNumber: loopNumber || null,
    suffix: suffix || null,
    description,
    confidence: Math.max(0, Math.min(1, confidence)),
    parseSteps
  };
}

/**
 * Batch parse multiple tags
 */
export function parseISATags(tags: string[]): ParsedTag[] {
  return tags.map(tag => parseISATag(tag));
}

/**
 * Quick validation: Check if a string looks like an ISA tag
 */
export function looksLikeISATag(str: string): boolean {
  const cleaned = str.trim().toUpperCase().replace(/[_\s]/g, '-');
  return /^[A-Z]{1,6}-?\d{0,6}[A-Z]?$/.test(cleaned);
}

/**
 * Generate description from parsed tag (convenience function)
 */
export function describeISATag(tag: string): string {
  const parsed = parseISATag(tag);
  return parsed.description;
}

/**
 * Examples for testing and documentation
 */
export const EXAMPLE_TAGS = {
  'PDIT-101': 'Pressure Differential Indicator Transmitter (loop 101)',
  'FIT-202': 'Flow Indicator Transmitter (loop 202)',
  'LAL-303': 'Level Alarm Low (loop 303)',
  'TIC-404': 'Temperature Indicator Controller (loop 404)',
  'PSH-505': 'Pressure Switch High (loop 505)',
  'PDSH-606': 'Pressure Differential Switch High (loop 606)',
  'FV-707': 'Flow Valve (loop 707)',
  'TV-808': 'Temperature Valve (loop 808)',
  'PT-909': 'Pressure Transmitter (loop 909)',
  'TT-010': 'Temperature Transmitter (loop 010)',
  'HS-111': 'Hand Switch (loop 111)',
  'ZSO-212': 'Position Switch Open (loop 212)',
  'LAH-313': 'Level Alarm High (loop 313)',
  'FALL-414': 'Flow Alarm Low-Low (loop 414)'
};
