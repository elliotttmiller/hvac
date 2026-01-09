/**
 * ASHRAE 62.1 - Ventilation for Acceptable Indoor Air Quality
 * Pure TypeScript implementation - No AI, deterministic rules only
 * 
 * Reference: ASHRAE Standard 62.1-2022
 */

export interface VentilationRequirements {
  peopleOutdoorAirRate: number; // cfm per person
  areaOutdoorAirRate: number; // cfm per sq ft
}

export interface ZoneData {
  name: string;
  occupancy: number; // number of people
  area: number; // square feet
  currentCFM?: number; // current ventilation rate
  occupancyCategory?: string;
}

export interface VentilationResult {
  isCompliant: boolean;
  requiredCFM: number;
  actualCFM?: number;
  deficitCFM?: number;
  details: string;
}

/**
 * ASHRAE 62.1 Table 6.2.2.1 - Minimum Ventilation Rates
 * Simplified version with common occupancy types
 */
const VENTILATION_RATES: Record<string, VentilationRequirements> = {
  // Commercial/Office
  'office': { peopleOutdoorAirRate: 5, areaOutdoorAirRate: 0.06 },
  'conference_room': { peopleOutdoorAirRate: 5, areaOutdoorAirRate: 0.06 },
  'reception': { peopleOutdoorAirRate: 5, areaOutdoorAirRate: 0.06 },
  
  // Education
  'classroom': { peopleOutdoorAirRate: 10, areaOutdoorAirRate: 0.12 },
  'lecture_hall': { peopleOutdoorAirRate: 7.5, areaOutdoorAirRate: 0.06 },
  'library': { peopleOutdoorAirRate: 5, areaOutdoorAirRate: 0.12 },
  
  // Healthcare
  'patient_room': { peopleOutdoorAirRate: 25, areaOutdoorAirRate: 0.06 },
  'exam_room': { peopleOutdoorAirRate: 25, areaOutdoorAirRate: 0.06 },
  'operating_room': { peopleOutdoorAirRate: 30, areaOutdoorAirRate: 0.0 },
  
  // Retail
  'retail_sales': { peopleOutdoorAirRate: 7.5, areaOutdoorAirRate: 0.06 },
  'storage': { peopleOutdoorAirRate: 0, areaOutdoorAirRate: 0.06 },
  
  // Food Service
  'dining_room': { peopleOutdoorAirRate: 7.5, areaOutdoorAirRate: 0.18 },
  'kitchen': { peopleOutdoorAirRate: 7.5, areaOutdoorAirRate: 0.30 },
  
  // Default
  'default': { peopleOutdoorAirRate: 5, areaOutdoorAirRate: 0.06 },
};

/**
 * Validate ventilation for a zone according to ASHRAE 62.1
 * 
 * Formula: Vbz = Rp × Pz + Ra × Az
 * Where:
 *   Vbz = Breathing zone outdoor airflow (CFM)
 *   Rp = People outdoor air rate (CFM/person)
 *   Pz = Zone population (number of people)
 *   Ra = Area outdoor air rate (CFM/ft²)
 *   Az = Zone floor area (ft²)
 * 
 * @param zoneData - Zone information
 * @returns Validation result with compliance status
 */
export function validateVentilation(zoneData: ZoneData): VentilationResult {
  // Get ventilation rates for the occupancy category
  const category = zoneData.occupancyCategory?.toLowerCase() || 'default';
  const rates = VENTILATION_RATES[category] || VENTILATION_RATES['default'];
  
  // Calculate required ventilation
  const requiredCFM = calculateRequiredVentilation(
    zoneData.occupancy,
    zoneData.area,
    rates
  );
  
  // Check compliance if actual CFM is provided
  if (zoneData.currentCFM !== undefined) {
    const isCompliant = zoneData.currentCFM >= requiredCFM;
    const deficit = Math.max(0, requiredCFM - zoneData.currentCFM);
    
    return {
      isCompliant,
      requiredCFM: Math.round(requiredCFM),
      actualCFM: zoneData.currentCFM,
      deficitCFM: Math.round(deficit),
      details: isCompliant
        ? `Zone "${zoneData.name}" meets ASHRAE 62.1 requirements`
        : `Zone "${zoneData.name}" is ${Math.round(deficit)} CFM short of requirements`,
    };
  }
  
  // No actual CFM provided - just return requirements
  return {
    isCompliant: false,
    requiredCFM: Math.round(requiredCFM),
    details: `Zone "${zoneData.name}" requires ${Math.round(requiredCFM)} CFM minimum ventilation`,
  };
}

/**
 * Calculate required ventilation rate
 */
function calculateRequiredVentilation(
  occupancy: number,
  area: number,
  rates: VentilationRequirements
): number {
  const peopleComponent = rates.peopleOutdoorAirRate * occupancy;
  const areaComponent = rates.areaOutdoorAirRate * area;
  return peopleComponent + areaComponent;
}

/**
 * Validate ventilation for multiple zones
 */
export function validateMultipleZones(zones: ZoneData[]): VentilationResult[] {
  return zones.map(zone => validateVentilation(zone));
}

/**
 * Calculate total system ventilation requirement
 */
export function calculateSystemVentilation(zones: ZoneData[]): {
  totalRequired: number;
  totalActual?: number;
  isSystemCompliant: boolean;
  zones: VentilationResult[];
} {
  const zoneResults = validateMultipleZones(zones);
  const totalRequired = zoneResults.reduce((sum, r) => sum + r.requiredCFM, 0);
  
  const allHaveActual = zoneResults.every(r => r.actualCFM !== undefined);
  const totalActual = allHaveActual
    ? zoneResults.reduce((sum, r) => sum + (r.actualCFM || 0), 0)
    : undefined;
  
  const isSystemCompliant = zoneResults.every(r => r.isCompliant);
  
  return {
    totalRequired: Math.round(totalRequired),
    totalActual: totalActual ? Math.round(totalActual) : undefined,
    isSystemCompliant,
    zones: zoneResults,
  };
}

/**
 * Get ventilation requirements for a specific occupancy type
 */
export function getVentilationRates(occupancyCategory: string): VentilationRequirements {
  const category = occupancyCategory.toLowerCase();
  return VENTILATION_RATES[category] || VENTILATION_RATES['default'];
}

/**
 * List all available occupancy categories
 */
export function getAvailableCategories(): string[] {
  return Object.keys(VENTILATION_RATES).filter(key => key !== 'default');
}
