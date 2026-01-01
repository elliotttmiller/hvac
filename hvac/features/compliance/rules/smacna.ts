/**
 * SMACNA - Sheet Metal and Air Conditioning Contractors' National Association
 * Duct Construction Standards (Pure TypeScript - Deterministic)
 * 
 * Reference: SMACNA HVAC Duct Construction Standards
 */

export type PressureClass = 'negative' | 'positive_0.5' | 'positive_1' | 'positive_2' | 'positive_3' | 'positive_4' | 'positive_6' | 'positive_10';

export interface DuctSpecification {
  width: number; // inches
  height?: number; // inches (for rectangular ducts)
  diameter?: number; // inches (for round ducts)
  pressureClass: PressureClass;
  gauge: number; // sheet metal gauge
}

export interface DuctValidationResult {
  isCompliant: boolean;
  requiredGauge: number;
  actualGauge: number;
  issues: string[];
  recommendations: string[];
}

/**
 * SMACNA Table 1-1: Rectangular Duct - Minimum Sheet Metal Thickness
 * Pressure classes and required gauge based on duct dimensions
 * 
 * Reference: SMACNA HVAC Duct Construction Standards - Metal and Flexible
 * 
 * Structure: [maxDimension, gauge]
 * - Per SMACNA Chapter 1, Table 1-1
 * - Based on duct static pressure classification
 * - Dimensions in inches, gauge is sheet metal thickness
 */
const RECTANGULAR_GAUGE_TABLE: Record<PressureClass, Array<[number, number]>> = {
  'negative': [
    [12, 30], [30, 28], [54, 26], [84, 24], [Infinity, 22]
  ],
  'positive_0.5': [
    [12, 30], [30, 28], [54, 26], [84, 24], [Infinity, 22]
  ],
  'positive_1': [
    [12, 28], [30, 26], [54, 24], [84, 22], [Infinity, 20]
  ],
  'positive_2': [
    [12, 26], [30, 24], [54, 22], [84, 20], [Infinity, 18]
  ],
  'positive_3': [
    [12, 24], [30, 22], [54, 20], [84, 18], [Infinity, 16]
  ],
  'positive_4': [
    [12, 22], [30, 20], [54, 18], [84, 16], [Infinity, 14]
  ],
  'positive_6': [
    [12, 20], [30, 18], [54, 16], [84, 14], [Infinity, 12]
  ],
  'positive_10': [
    [12, 18], [30, 16], [54, 14], [84, 12], [Infinity, 10]
  ],
};

/**
 * SMACNA Table 1-2: Round Duct - Minimum Sheet Metal Thickness
 * Pressure classes and required gauge based on duct diameter
 */
const ROUND_GAUGE_TABLE: Record<PressureClass, Array<[number, number]>> = {
  'negative': [
    [12, 30], [24, 28], [36, 26], [60, 24], [Infinity, 22]
  ],
  'positive_0.5': [
    [12, 30], [24, 28], [36, 26], [60, 24], [Infinity, 22]
  ],
  'positive_1': [
    [12, 28], [24, 26], [36, 24], [60, 22], [Infinity, 20]
  ],
  'positive_2': [
    [12, 26], [24, 24], [36, 22], [60, 20], [Infinity, 18]
  ],
  'positive_3': [
    [12, 24], [24, 22], [36, 20], [60, 18], [Infinity, 16]
  ],
  'positive_4': [
    [12, 22], [24, 20], [36, 18], [60, 16], [Infinity, 14]
  ],
  'positive_6': [
    [12, 20], [24, 18], [36, 16], [60, 14], [Infinity, 12]
  ],
  'positive_10': [
    [12, 18], [24, 16], [36, 14], [60, 12], [Infinity, 10]
  ],
};

/**
 * Validate duct construction against SMACNA standards
 * 
 * @param spec - Duct specification to validate
 * @returns Validation result with compliance status
 */
export function validateDuct(spec: DuctSpecification): DuctValidationResult {
  const issues: string[] = [];
  const recommendations: string[] = [];
  
  // Determine duct type and get required gauge
  let requiredGauge: number;
  let isRound = false;
  
  if (spec.diameter !== undefined) {
    // Round duct
    isRound = true;
    requiredGauge = getRequiredGaugeRound(spec.diameter, spec.pressureClass);
  } else if (spec.width !== undefined && spec.height !== undefined) {
    // Rectangular duct - use larger dimension
    const maxDimension = Math.max(spec.width, spec.height);
    requiredGauge = getRequiredGaugeRectangular(maxDimension, spec.pressureClass);
  } else {
    return {
      isCompliant: false,
      requiredGauge: 0,
      actualGauge: spec.gauge,
      issues: ['Invalid duct specification: must provide either diameter (round) or width/height (rectangular)'],
      recommendations: ['Verify duct dimensions and resubmit'],
    };
  }
  
  // Check compliance (lower gauge number = thicker metal)
  const isCompliant = spec.gauge <= requiredGauge;
  
  if (!isCompliant) {
    issues.push(
      `Duct gauge ${spec.gauge} is too thin for ${spec.pressureClass} pressure class`
    );
    issues.push(
      `Minimum required gauge: ${requiredGauge}`
    );
    recommendations.push(
      `Increase sheet metal thickness to gauge ${requiredGauge} or lower`
    );
  }
  
  // Additional recommendations
  if (isCompliant && spec.gauge < requiredGauge - 2) {
    recommendations.push(
      'Duct is over-designed. Consider using gauge ' + requiredGauge + ' for cost optimization'
    );
  }
  
  return {
    isCompliant,
    requiredGauge,
    actualGauge: spec.gauge,
    issues,
    recommendations,
  };
}

/**
 * Get required gauge for rectangular duct based on max dimension
 */
function getRequiredGaugeRectangular(maxDimension: number, pressureClass: PressureClass): number {
  const table = RECTANGULAR_GAUGE_TABLE[pressureClass];
  
  for (const [maxDim, gauge] of table) {
    if (maxDimension <= maxDim) {
      return gauge;
    }
  }
  
  // Default to thickest gauge if dimension exceeds table
  return table[table.length - 1][1];
}

/**
 * Get required gauge for round duct based on diameter
 */
function getRequiredGaugeRound(diameter: number, pressureClass: PressureClass): number {
  const table = ROUND_GAUGE_TABLE[pressureClass];
  
  for (const [maxDiam, gauge] of table) {
    if (diameter <= maxDiam) {
      return gauge;
    }
  }
  
  // Default to thickest gauge if diameter exceeds table
  return table[table.length - 1][1];
}

/**
 * Validate multiple ducts
 */
export function validateMultipleDucts(ducts: DuctSpecification[]): DuctValidationResult[] {
  return ducts.map(duct => validateDuct(duct));
}

/**
 * Get duct area (for flow calculations)
 */
export function getDuctArea(spec: DuctSpecification): number {
  if (spec.diameter !== undefined) {
    // Round duct: A = π × r²
    const radius = spec.diameter / 2;
    return Math.PI * radius * radius;
  } else if (spec.width !== undefined && spec.height !== undefined) {
    // Rectangular duct: A = width × height
    return spec.width * spec.height;
  }
  return 0;
}

/**
 * Convert rectangular duct to equivalent round diameter
 * Uses the "equivalent diameter" formula for equal area
 */
export function getEquivalentDiameter(width: number, height: number): number {
  // De = 1.30 × [(width × height)^0.625] / [(width + height)^0.25]
  const area = width * height;
  const perimeter = width + height;
  return 1.30 * Math.pow(area, 0.625) / Math.pow(perimeter, 0.25);
}

/**
 * Parse pressure class from string
 */
export function parsePressureClass(pressureClassStr: string): PressureClass | null {
  const normalized = pressureClassStr.toLowerCase().replace(/\s+/g, '_');
  
  const validClasses: PressureClass[] = [
    'negative',
    'positive_0.5',
    'positive_1',
    'positive_2',
    'positive_3',
    'positive_4',
    'positive_6',
    'positive_10',
  ];
  
  if (validClasses.includes(normalized as PressureClass)) {
    return normalized as PressureClass;
  }
  
  return null;
}
