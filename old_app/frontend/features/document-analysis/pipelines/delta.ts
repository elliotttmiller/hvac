/**
 * Delta Pipeline - Change Detection
 * Compares two versions of a document to identify changes
 */

import { getAIClient } from '@/lib/ai/client';
import { DetectedComponent, Connection } from '@/features/document-analysis/types';
import { calculateIoU } from '@/lib/utils/math';

export interface DeltaResult {
  added: DetectedComponent[];
  removed: DetectedComponent[];
  modified: DetectedComponent[];
  unchanged: DetectedComponent[];
  connectionChanges: {
    added: Connection[];
    removed: Connection[];
  };
  summary: string;
}

/**
 * Change detection system instruction
 */
const DELTA_SYSTEM_INSTRUCTION = `
### IDENTITY
You are a **Change Detection Specialist** for engineering documents.

### MISSION
Compare two versions of a document and identify all changes:
- Added components
- Removed components
- Modified components (moved, resized, relabeled)
- Changed connections

### COMPARISON RULES
1. **Component Matching**
   - Match by tag/label if available
   - Match by type and location if no tag
   - Consider spatial proximity (IoU > 0.5)

2. **Change Types**
   - ADDED: Present in new version only
   - REMOVED: Present in old version only
   - MODIFIED: Present in both but with differences
   - UNCHANGED: Identical in both versions

3. **Modification Detection**
   - Position changes (moved > 5% of image dimension)
   - Size changes (area difference > 10%)
   - Label changes (different tag/name)
   - Type changes (different classification)

### OUTPUT
Return structured JSON with all identified changes.
`;

/**
 * Detect changes between two document analyses
 */
export async function detectChanges(
  oldVersion: { components: DetectedComponent[]; connections: Connection[] },
  newVersion: { components: DetectedComponent[]; connections: Connection[] }
): Promise<DeltaResult> {
  // Deterministic matching first
  const { added, removed, modified, unchanged } = matchComponents(
    oldVersion.components,
    newVersion.components
  );
  
  // Match connections
  const connectionChanges = matchConnections(
    oldVersion.connections,
    newVersion.connections
  );
  
  // Generate summary
  const summary = generateChangeSummary(added, removed, modified, connectionChanges);
  
  return {
    added,
    removed,
    modified,
    unchanged,
    connectionChanges,
    summary,
  };
}

/**
 * Match components between versions using deterministic rules
 */
function matchComponents(
  oldComponents: DetectedComponent[],
  newComponents: DetectedComponent[]
): {
  added: DetectedComponent[];
  removed: DetectedComponent[];
  modified: DetectedComponent[];
  unchanged: DetectedComponent[];
} {
  const added: DetectedComponent[] = [];
  const removed: DetectedComponent[] = [];
  const modified: DetectedComponent[] = [];
  const unchanged: DetectedComponent[] = [];
  
  const matchedOld = new Set<string>();
  const matchedNew = new Set<string>();
  
  // Match by label first (most reliable)
  for (const newComp of newComponents) {
    if (!newComp.label) continue;
    
    const oldMatch = oldComponents.find(
      old => old.label === newComp.label && !matchedOld.has(old.id)
    );
    
    if (oldMatch) {
      matchedOld.add(oldMatch.id);
      matchedNew.add(newComp.id);
      
      // Check if modified
      if (isComponentModified(oldMatch, newComp)) {
        modified.push(newComp);
      } else {
        unchanged.push(newComp);
      }
    }
  }
  
  // Match remaining by location and type (spatial matching)
  for (const newComp of newComponents) {
    if (matchedNew.has(newComp.id)) continue;
    
    let bestMatch: DetectedComponent | null = null;
    let bestIoU = 0;
    
    for (const oldComp of oldComponents) {
      if (matchedOld.has(oldComp.id)) continue;
      if (oldComp.type !== newComp.type) continue;
      
      const iou = calculateIoU(oldComp.bbox, newComp.bbox);
      if (iou > bestIoU && iou > 0.3) {
        bestIoU = iou;
        bestMatch = oldComp;
      }
    }
    
    if (bestMatch) {
      matchedOld.add(bestMatch.id);
      matchedNew.add(newComp.id);
      
      // Spatial match with IoU > 0.3 is likely the same component
      if (bestIoU > 0.7) {
        unchanged.push(newComp);
      } else {
        modified.push(newComp);
      }
    } else {
      // No match found - this is a new component
      added.push(newComp);
    }
  }
  
  // Remaining old components are removed
  for (const oldComp of oldComponents) {
    if (!matchedOld.has(oldComp.id)) {
      removed.push(oldComp);
    }
  }
  
  return { added, removed, modified, unchanged };
}

/**
 * Check if a component has been modified
 */
function isComponentModified(
  oldComp: DetectedComponent,
  newComp: DetectedComponent
): boolean {
  // Check label change
  if (oldComp.label !== newComp.label) return true;
  
  // Check type change
  if (oldComp.type !== newComp.type) return true;
  
  // Check significant position change
  const oldCenter = [
    (oldComp.bbox[0] + oldComp.bbox[2]) / 2,
    (oldComp.bbox[1] + oldComp.bbox[3]) / 2,
  ];
  const newCenter = [
    (newComp.bbox[0] + newComp.bbox[2]) / 2,
    (newComp.bbox[1] + newComp.bbox[3]) / 2,
  ];
  
  const distance = Math.sqrt(
    Math.pow(newCenter[0] - oldCenter[0], 2) +
    Math.pow(newCenter[1] - oldCenter[1], 2)
  );
  
  if (distance > 0.05) return true; // Moved > 5% of image dimension
  
  // Check size change
  const oldArea = (oldComp.bbox[2] - oldComp.bbox[0]) * (oldComp.bbox[3] - oldComp.bbox[1]);
  const newArea = (newComp.bbox[2] - newComp.bbox[0]) * (newComp.bbox[3] - newComp.bbox[1]);
  const areaChange = Math.abs(newArea - oldArea) / oldArea;
  
  if (areaChange > 0.1) return true; // Size changed > 10%
  
  return false;
}

/**
 * Match connections between versions
 */
function matchConnections(
  oldConnections: Connection[],
  newConnections: Connection[]
): {
  added: Connection[];
  removed: Connection[];
} {
  const added: Connection[] = [];
  const removed: Connection[] = [];
  
  const matchedOld = new Set<string>();
  
  // Find matching connections (same from/to)
  for (const newConn of newConnections) {
    const oldMatch = oldConnections.find(
      old => old.from_id === newConn.from_id && old.to_id === newConn.to_id
    );
    
    if (!oldMatch) {
      added.push(newConn);
    } else {
      matchedOld.add(oldMatch.id);
    }
  }
  
  // Remaining old connections are removed
  for (const oldConn of oldConnections) {
    if (!matchedOld.has(oldConn.id)) {
      removed.push(oldConn);
    }
  }
  
  return { added, removed };
}

/**
 * Generate human-readable change summary
 */
function generateChangeSummary(
  added: DetectedComponent[],
  removed: DetectedComponent[],
  modified: DetectedComponent[],
  connectionChanges: { added: Connection[]; removed: Connection[] }
): string {
  const parts: string[] = [];
  
  const totalChanges = added.length + removed.length + modified.length + 
                       connectionChanges.added.length + connectionChanges.removed.length;
  
  if (totalChanges === 0) {
    return 'No changes detected between versions';
  }
  
  if (added.length > 0) {
    parts.push(`${added.length} component(s) added`);
    const examples = added.slice(0, 3).map(c => c.label || c.type).join(', ');
    if (examples) parts.push(`  Added: ${examples}`);
  }
  
  if (removed.length > 0) {
    parts.push(`${removed.length} component(s) removed`);
    const examples = removed.slice(0, 3).map(c => c.label || c.type).join(', ');
    if (examples) parts.push(`  Removed: ${examples}`);
  }
  
  if (modified.length > 0) {
    parts.push(`${modified.length} component(s) modified`);
  }
  
  if (connectionChanges.added.length > 0) {
    parts.push(`${connectionChanges.added.length} connection(s) added`);
  }
  
  if (connectionChanges.removed.length > 0) {
    parts.push(`${connectionChanges.removed.length} connection(s) removed`);
  }
  
  return parts.join('\n');
}

/**
 * AI-powered change detection with visual comparison
 * Uses AI to detect subtle changes that might be missed by deterministic matching
 */
export async function detectChangesWithAI(
  oldImageData: string,
  newImageData: string
): Promise<{ changes: string[]; summary: string }> {
  const client = getAIClient();
  
  const prompt = `
**TASK**: Visual Change Detection

**INSTRUCTIONS**:
You are comparing two versions of an HVAC blueprint.
Identify ALL changes between the images:
- Added equipment
- Removed equipment
- Moved components
- Modified connections
- Changed labels or specifications

**OUTPUT**:
{
  "changes": [
    "VAV-101 moved from Grid A-3 to Grid B-3",
    "New AHU-2 added in mechanical room",
    "Duct from AHU-1 to VAV-105 rerouted"
  ],
  "summary": "3 significant changes detected"
}
`;
  
  try {
    // For now, use single image analysis
    // In production, would send both images for direct comparison
    const responseText = await client.generateVision({
      imageData: newImageData,
      prompt: prompt,
      options: {
        systemInstruction: DELTA_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });
    
    const parsed = JSON.parse(responseText);
    return {
      changes: parsed.changes || [],
      summary: parsed.summary || 'Change detection complete',
    };
  } catch (error) {
    console.error('AI change detection failed:', error);
    return {
      changes: [],
      summary: 'Change detection failed',
    };
  }
}
