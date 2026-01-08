/**
 * Intelligent Label Generator for HVAC Components
 * 
 * Generates meaningful labels for components that lack readable text tags,
 * particularly for geometric symbols like check valves, gate valves, etc.
 * 
 * Features:
 * - Sequential numbering by component type
 * - ISA-5.1 compliant label generation
 * - Spatial-aware numbering (top-to-bottom, left-to-right)
 * - Contextual label generation based on type and metadata
 */

// Configuration constants
const SAME_ROW_THRESHOLD = 0.05; // 5% threshold for considering components on same row
const LABEL_NUMBER_PADDING = 3; // Number of digits for zero-padding (e.g., 001, 002)

/**
 * Check if a label is non-descriptive (single letter, generic text, or UNREADABLE)
 */
function isNonDescriptiveLabel(label: string): boolean {
  if (!label || label.trim() === '') return true;
  if (label === 'unknown' || label.toLowerCase() === 'unknown') return true;
  // UNREADABLE labels should be replaced
  if (label.toUpperCase().startsWith('UNREADABLE')) return true;
  // Single letter labels (A-Z) are not descriptive
  if (label.length === 1 && /^[A-Z]$/i.test(label)) return true;
  return false;
}

/**
 * Component type to ISA prefix mapping
 */
const TYPE_TO_ISA_PREFIX: Record<string, string> = {
  // Valves
  'valve_check': 'CHV',
  'valve_gate': 'GV',
  'valve_globe': 'GLV',
  'valve_ball': 'BV',
  'valve_butterfly': 'BFV',
  'valve_control': 'CV',
  'valve_solenoid': 'SV',
  'valve_relief': 'PRV',
  'valve_safety': 'PSV',
  
  // Sensors & Instruments
  'sensor_temperature': 'TE',
  'sensor_pressure': 'PE',
  'sensor_flow': 'FE',
  'sensor_level': 'LE',
  'sensor_position': 'ZE',
  
  // Controllers
  'controller_temperature': 'TIC',
  'controller_pressure': 'PIC',
  'controller_flow': 'FIC',
  'controller_level': 'LIC',
  
  // Equipment (P&ID)
  'equipment_pump': 'P',
  'equipment_vessel': 'V',
  'equipment_tank': 'TK',
  'equipment_strainer': 'Y',
  'pump': 'PMP',
  'chiller': 'CH',
  'cooling_tower': 'CT',
  'air_handler': 'AHU',
  'fan': 'FAN',
  'damper': 'DMR',
  'filter': 'FLT',
  
  // Flow Elements
  'flow_element': 'FE',
  'orifice': 'FE',
  
  // Other
  'level_gauge': 'LG',
  'sight_glass': 'SG',
  'strainer': 'STR',
  'reducer': 'RED',
  'expansion_joint': 'EJ'
};

/**
 * Generate intelligent labels for components with "unknown" or missing labels
 */
export function generateIntelligentLabels(components: any[]): any[] {
  // First pass: identify components that need labels
  const needsLabel = components.filter(c => isNonDescriptiveLabel(c.label));
  
  if (needsLabel.length === 0) {
    return components; // No changes needed
  }
  
  console.log(`[Label Generator] Generating labels for ${needsLabel.length} components`);
  
  // Sort components by position (top-to-bottom, left-to-right)
  // This ensures sequential numbering follows natural reading order
  const sorted = [...components].sort((a, b) => {
    const [, ay] = a.bbox;
    const [, by] = b.bbox;
    
    // Primary sort: Y position (top to bottom)
    if (Math.abs(ay - by) > SAME_ROW_THRESHOLD) {
      return ay - by;
    }
    
    // Secondary sort: X position (left to right)
    const [ax] = a.bbox;
    const [bx] = b.bbox;
    return ax - bx;
  });
  
  // Count existing labels by type to continue numbering sequence
  const typeCounts: Record<string, number> = {};
  
  // Pre-compile regex pattern for performance
  const existingLabelPattern = /^([A-Z]{2,5})[- ]?(\d+)/i;
  
  // Initialize counts from existing labeled components
  sorted.forEach(comp => {
    if (!isNonDescriptiveLabel(comp.label)) {
      const prefix = getISAPrefix(comp.type, comp);
      if (prefix && !typeCounts[prefix]) {
        // Find highest number for this prefix
        const match = comp.label.match(existingLabelPattern);
        if (match) {
          const num = parseInt(match[2], 10);
          typeCounts[prefix] = Math.max(typeCounts[prefix] || 0, num);
        }
      }
    }
  });
  
  // Generate labels for components that need them
  const labeled = sorted.map(comp => {
    // Skip if already has a good label
    if (!isNonDescriptiveLabel(comp.label)) {
      return comp;
    }
    
    // Generate new label
    const prefix = getISAPrefix(comp.type, comp);
    if (!prefix) {
      // Fallback for unknown types
      return {
        ...comp,
        label: comp.type || 'COMPONENT',
        meta: {
          ...comp.meta,
          label_generated: true,
          label_generation_reason: 'Type-based fallback - no ISA prefix available'
        }
      };
    }
    
    // Increment counter for this prefix
    typeCounts[prefix] = (typeCounts[prefix] || 0) + 1;
    const number = typeCounts[prefix];
    
    // Generate label in standard ISA format: PREFIX-NUMBER
    const newLabel = `${prefix}-${number.toString().padStart(LABEL_NUMBER_PADDING, '0')}`;
    
    return {
      ...comp,
      label: newLabel,
      meta: {
        ...comp.meta,
        label_generated: true,
        label_generation_reason: `Auto-generated from component type and sequential numbering`,
        original_label: comp.label
      }
    };
  });
  
  console.log(`[Label Generator] Generated ${needsLabel.length} new labels`);
  
  return labeled;
}

/**
 * Get ISA-compliant prefix for component type
 */
function getISAPrefix(type: string, comp: any): string | null {
  // Direct mapping from type
  if (TYPE_TO_ISA_PREFIX[type]) {
    return TYPE_TO_ISA_PREFIX[type];
  }
  
  // Try ISA function from metadata
  if (comp.meta?.isa_function) {
    const isaFunc = comp.meta.isa_function.toUpperCase();
    // ISA function is already a prefix (e.g., "TI", "PT", "FCV")
    if (isaFunc.length >= 2 && isaFunc.length <= 4) {
      return isaFunc;
    }
  }
  
  // Try to infer from type name
  const typeLower = (type || '').toLowerCase();
  
  if (typeLower.includes('valve')) {
    if (typeLower.includes('check')) return 'CHV';
    if (typeLower.includes('gate')) return 'GV';
    if (typeLower.includes('globe')) return 'GLV';
    if (typeLower.includes('ball')) return 'BV';
    if (typeLower.includes('butterfly')) return 'BFV';
    if (typeLower.includes('control')) return 'CV';
    if (typeLower.includes('solenoid')) return 'SV';
    if (typeLower.includes('relief')) return 'PRV';
    if (typeLower.includes('safety')) return 'PSV';
    return 'VLV'; // Generic valve
  }
  
  if (typeLower.includes('sensor') || typeLower.includes('transmitter')) {
    if (typeLower.includes('temperature')) return 'TE';
    if (typeLower.includes('pressure')) return 'PE';
    if (typeLower.includes('flow')) return 'FE';
    if (typeLower.includes('level')) return 'LE';
    if (typeLower.includes('position')) return 'ZE';
  }
  
  if (typeLower.includes('pump')) return 'PMP';
  if (typeLower.includes('chiller')) return 'CH';
  if (typeLower.includes('tower')) return 'CT';
  if (typeLower.includes('fan')) return 'FAN';
  if (typeLower.includes('damper')) return 'DMR';
  if (typeLower.includes('filter')) return 'FLT';
  
  // No prefix found
  return null;
}

/**
 * Enhanced label generation with contextual information
 * Considers position, connections, and related components
 */
export function generateContextualLabel(
  component: any,
  allComponents: any[],
  connections: any[]
): string {
  // Start with intelligent label
  const baseLabel = getISAPrefix(component.type, component);
  if (!baseLabel) {
    return component.type || 'COMPONENT';
  }
  
  // Find related components to determine context
  const connectedComponents = connections
    .filter(conn => 
      conn.from_id === component.id || conn.to_id === component.id
    )
    .map(conn => {
      const otherId = conn.from_id === component.id ? conn.to_id : conn.from_id;
      return allComponents.find(c => c.id === otherId);
    })
    .filter(Boolean);
  
  // If connected to a labeled component, try to use related numbering
  for (const related of connectedComponents) {
    if (related.label && related.label !== 'unknown') {
      const match = related.label.match(/(\d+)/);
      if (match) {
        const relatedNumber = parseInt(match[1], 10);
        // Use same or adjacent number for contextual grouping
        return `${baseLabel}-${relatedNumber.toString().padStart(3, '0')}`;
      }
    }
  }
  
  // Fallback to sequential numbering
  return `${baseLabel}-001`;
}

/**
 * Validate generated labels don't conflict with existing ones
 */
export function validateLabels(components: any[]): {
  valid: boolean;
  duplicates: string[];
  conflicts: Array<{ label: string; count: number }>;
} {
  const labelCounts = new Map<string, number>();
  
  components.forEach(comp => {
    if (!isNonDescriptiveLabel(comp.label)) {
      const count = labelCounts.get(comp.label) || 0;
      labelCounts.set(comp.label, count + 1);
    }
  });
  
  const duplicates: string[] = [];
  const conflicts: Array<{ label: string; count: number }> = [];
  
  labelCounts.forEach((count, label) => {
    if (count > 1) {
      duplicates.push(label);
      conflicts.push({ label, count });
    }
  });
  
  return {
    valid: duplicates.length === 0,
    duplicates,
    conflicts
  };
}

/**
 * Resolve label conflicts by appending suffixes
 */
export function resolveConflicts(components: any[]): any[] {
  const labelGroups = new Map<string, any[]>();
  
  // Group components by label
  components.forEach(comp => {
    if (!isNonDescriptiveLabel(comp.label)) {
      const group = labelGroups.get(comp.label) || [];
      group.push(comp);
      labelGroups.set(comp.label, group);
    }
  });
  
  // Resolve conflicts
  const resolved = components.map(comp => {
    const group = labelGroups.get(comp.label);
    if (!group || group.length <= 1) {
      return comp; // No conflict
    }
    
    // Find index in group
    const index = group.indexOf(comp);
    if (index === 0) {
      return comp; // Keep first one unchanged
    }
    
    // Append suffix for duplicates
    return {
      ...comp,
      label: `${comp.label}-${String.fromCharCode(65 + index - 1)}`, // A, B, C, etc.
      meta: {
        ...comp.meta,
        label_conflict_resolved: true,
        original_label: comp.label
      }
    };
  });
  
  return resolved;
}
