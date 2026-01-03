/**
 * Fire and Smoke Damper Rules
 * Pure TypeScript implementation - Deterministic safety checks
 * 
 * Based on NFPA 90A, IBC, and UL 555/555S standards
 */

export interface DamperSpecification {
  id: string;
  type: 'fire' | 'smoke' | 'combination';
  rating: number; // Fire rating in hours (1.5, 3, etc.)
  location: DamperLocation;
  actuatorType?: 'electric' | 'pneumatic' | 'fusible_link';
  hasAccessDoor?: boolean;
  installedInRatedWall?: boolean;
}

export type DamperLocation =
  | 'floor_penetration'
  | 'wall_penetration'
  | 'ceiling_penetration'
  | 'shaft'
  | 'corridor'
  | 'smoke_barrier'
  | 'fire_barrier'
  | 'stairwell';

export interface SafetyIssue {
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  code: string;
  description: string;
  location?: string;
  requirement: string;
  recommendation: string;
}

export interface DamperValidationResult {
  damperId: string;
  isCompliant: boolean;
  issues: SafetyIssue[];
}

/**
 * Required damper ratings based on location
 * Per IBC Table 716.3.2.1 and NFPA 90A Section 4.3
 * 
 * References:
 * - IBC 716.3: Fire Resistance-Rated Construction Opening Protectives
 * - IBC 716.3.2: Fire Dampers
 * - IBC 716.3.3: Smoke Dampers
 * - NFPA 90A 4.3.6: Damper Accessibility Requirements
 */
const LOCATION_REQUIREMENTS: Record<DamperLocation, {
  minRating: number;
  requiresFireDamper: boolean;
  requiresSmokeDamper: boolean;
  requiresAccessDoor: boolean;
}> = {
  floor_penetration: {
    minRating: 1.5,
    requiresFireDamper: true,
    requiresSmokeDamper: false,
    requiresAccessDoor: true,
  },
  wall_penetration: {
    minRating: 1.5,
    requiresFireDamper: true,
    requiresSmokeDamper: false,
    requiresAccessDoor: true,
  },
  ceiling_penetration: {
    minRating: 1.5,
    requiresFireDamper: true,
    requiresSmokeDamper: false,
    requiresAccessDoor: true,
  },
  shaft: {
    minRating: 1.5,
    requiresFireDamper: true,
    requiresSmokeDamper: false,
    requiresAccessDoor: true,
  },
  corridor: {
    minRating: 1.5,
    requiresFireDamper: false,
    requiresSmokeDamper: true,
    requiresAccessDoor: true,
  },
  smoke_barrier: {
    minRating: 1.5,
    requiresFireDamper: false,
    requiresSmokeDamper: true,
    requiresAccessDoor: true,
  },
  fire_barrier: {
    minRating: 1.5,
    requiresFireDamper: true,
    requiresSmokeDamper: true,
    requiresAccessDoor: true,
  },
  stairwell: {
    minRating: 1.5,
    requiresFireDamper: true,
    requiresSmokeDamper: true,
    requiresAccessDoor: true,
  },
};

/**
 * Validate fire/smoke damper against safety standards
 * 
 * @param spec - Damper specification
 * @returns Validation result with safety issues
 */
export function validateDamper(spec: DamperSpecification): DamperValidationResult {
  const issues: SafetyIssue[] = [];
  const requirements = LOCATION_REQUIREMENTS[spec.location];
  
  // Check damper type requirements
  if (requirements.requiresFireDamper && spec.type === 'smoke') {
    issues.push({
      severity: 'CRITICAL',
      code: 'IBC-716.3.2',
      description: `Location "${spec.location}" requires fire damper, but only smoke damper is specified`,
      location: spec.location,
      requirement: 'Fire damper required for fire-rated barrier penetrations',
      recommendation: 'Install combination fire/smoke damper or add separate fire damper',
    });
  }
  
  if (requirements.requiresSmokeDamper && spec.type === 'fire') {
    issues.push({
      severity: 'CRITICAL',
      code: 'IBC-716.3.3',
      description: `Location "${spec.location}" requires smoke damper, but only fire damper is specified`,
      location: spec.location,
      requirement: 'Smoke damper required for smoke barrier penetrations',
      recommendation: 'Install combination fire/smoke damper or add separate smoke damper',
    });
  }
  
  // Check fire rating
  if (spec.rating < requirements.minRating) {
    issues.push({
      severity: 'CRITICAL',
      code: 'UL-555',
      description: `Damper rating (${spec.rating}hr) is less than required (${requirements.minRating}hr)`,
      location: spec.location,
      requirement: `Minimum ${requirements.minRating}-hour fire rating required`,
      recommendation: `Upgrade to ${requirements.minRating}-hour or higher rated damper`,
    });
  }
  
  // Check access door requirement
  if (requirements.requiresAccessDoor && !spec.hasAccessDoor) {
    issues.push({
      severity: 'WARNING',
      code: 'NFPA-90A-4.3.6',
      description: 'Access door required for damper inspection and maintenance',
      location: spec.location,
      requirement: 'Dampers must be accessible for inspection, testing, and maintenance',
      recommendation: 'Install access door adjacent to damper location',
    });
  }
  
  // Check actuator type for smoke dampers
  if ((spec.type === 'smoke' || spec.type === 'combination') && !spec.actuatorType) {
    issues.push({
      severity: 'WARNING',
      code: 'UL-555S',
      description: 'Smoke damper actuator type not specified',
      requirement: 'Smoke dampers require electrically or pneumatically powered actuators',
      recommendation: 'Specify electric or pneumatic actuator with fail-safe position',
    });
  }
  
  // Check fusible link for fire dampers
  if (spec.type === 'fire' && spec.actuatorType === 'electric') {
    issues.push({
      severity: 'INFO',
      code: 'UL-555',
      description: 'Electric actuator on fire damper',
      requirement: 'Fire dampers typically use fusible links for automatic closure',
      recommendation: 'Verify electric actuator has UL-listed fire damper application',
    });
  }
  
  // Check installation in rated wall
  if (spec.installedInRatedWall === false && requirements.requiresFireDamper) {
    issues.push({
      severity: 'WARNING',
      code: 'IBC-716.3',
      description: 'Damper location indicates fire-rated barrier, but installation status unclear',
      requirement: 'Dampers must maintain fire resistance rating of penetrated barrier',
      recommendation: 'Verify damper is properly installed in fire-rated construction',
    });
  }
  
  return {
    damperId: spec.id,
    isCompliant: issues.filter(i => i.severity === 'CRITICAL').length === 0,
    issues,
  };
}

/**
 * Validate multiple dampers
 */
export function validateMultipleDampers(dampers: DamperSpecification[]): DamperValidationResult[] {
  return dampers.map(damper => validateDamper(damper));
}

/**
 * Get damper requirements for a location
 */
export function getDamperRequirements(location: DamperLocation): string[] {
  const req = LOCATION_REQUIREMENTS[location];
  const requirements: string[] = [];
  
  if (req.requiresFireDamper && req.requiresSmokeDamper) {
    requirements.push('Combination fire/smoke damper required');
  } else if (req.requiresFireDamper) {
    requirements.push('Fire damper required');
  } else if (req.requiresSmokeDamper) {
    requirements.push('Smoke damper required');
  }
  
  requirements.push(`Minimum ${req.minRating}-hour fire rating`);
  
  if (req.requiresAccessDoor) {
    requirements.push('Access door required for inspection');
  }
  
  return requirements;
}

/**
 * Check for missing dampers at critical locations
 * This would be called with data from visual analysis
 */
export function findMissingDampers(
  ductPenetrations: Array<{ location: DamperLocation; hasDamper: boolean }>,
  existingDampers: DamperSpecification[]
): SafetyIssue[] {
  const issues: SafetyIssue[] = [];
  
  for (const penetration of ductPenetrations) {
    if (!penetration.hasDamper) {
      const req = LOCATION_REQUIREMENTS[penetration.location];
      
      if (req.requiresFireDamper || req.requiresSmokeDamper) {
        issues.push({
          severity: 'CRITICAL',
          code: 'IBC-716.3',
          description: `Missing damper at ${penetration.location} penetration`,
          location: penetration.location,
          requirement: getDamperRequirements(penetration.location).join('; '),
          recommendation: 'Install required damper at this penetration',
        });
      }
    }
  }
  
  return issues;
}
