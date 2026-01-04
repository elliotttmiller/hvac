/**
 * Connection Intelligence Engine
 * Advanced relationship inference and validation for P&ID components
 * Addresses connection type classification and relationship detection
 */

export interface Component {
  id: string;
  type: string;
  label: string;
  bbox: [number, number, number, number];
  meta?: any;
}

export interface Connection {
  id: string;
  from_id: string;
  to_id: string;
  type: string;
  confidence: number;
  meta?: any;
}

export interface InferredConnection extends Connection {
  reasoning: string;
  inferred: boolean;
}

/**
 * Connection type patterns based on component combinations
 */
const CONNECTION_RULES = [
  {
    from: 'sensor_temperature',
    to: 'instrument_controller',
    type: 'electric_signal',
    confidence: 0.95,
    reasoning: 'Temperature sensor to controller signal path'
  },
  {
    from: 'sensor_pressure',
    to: 'instrument_controller',
    type: 'electric_signal',
    confidence: 0.95,
    reasoning: 'Pressure sensor to controller signal path'
  },
  {
    from: 'instrument_controller',
    to: 'valve_control',
    type: 'control_signal',
    confidence: 0.93,
    reasoning: 'Controller to control valve actuation'
  },
  {
    from: 'sensor_temperature',
    to: 'instrument_relay',
    type: 'electric_signal',
    confidence: 0.90,
    reasoning: 'Sensor to relay/signal conditioner'
  },
  {
    from: 'instrument_relay',
    to: 'sensor_*',
    type: 'electric_signal',
    confidence: 0.88,
    reasoning: 'Relay output to downstream sensor'
  },
  {
    from: 'pipe',
    to: 'valve_*',
    type: 'chilled_water',
    confidence: 0.85,
    reasoning: 'Pipe to valve process flow'
  },
  {
    from: 'valve_*',
    to: 'pipe',
    type: 'chilled_water',
    confidence: 0.85,
    reasoning: 'Valve to pipe process flow'
  },
  {
    from: 'sensor_*',
    to: 'data',
    type: 'data',
    confidence: 0.80,
    reasoning: 'Sensor to data link connection'
  }
];

/**
 * Infer connection type based on component types
 */
export function inferConnectionType(
  fromComponent: Component,
  toComponent: Component
): { type: string; confidence: number; reasoning: string } {
  // Try exact match first
  for (const rule of CONNECTION_RULES) {
    if (matchesPattern(fromComponent.type, rule.from) && 
        matchesPattern(toComponent.type, rule.to)) {
      return {
        type: rule.type,
        confidence: rule.confidence,
        reasoning: rule.reasoning
      };
    }
  }
  
  // Fallback: analyze spatial proximity and labels
  const spatialInference = inferFromSpatialRelationship(fromComponent, toComponent);
  if (spatialInference) {
    return spatialInference;
  }
  
  // Default: unknown connection
  return {
    type: 'unknown',
    confidence: 0.5,
    reasoning: 'Could not determine connection type from component types'
  };
}

/**
 * Pattern matching for component types (supports wildcards)
 */
function matchesPattern(type: string, pattern: string): boolean {
  if (pattern.endsWith('_*')) {
    const prefix = pattern.slice(0, -2);
    return type.startsWith(prefix);
  }
  return type === pattern;
}

/**
 * Infer connection type from spatial relationship
 */
function inferFromSpatialRelationship(
  fromComponent: Component,
  toComponent: Component
): { type: string; confidence: number; reasoning: string } | null {
  // Calculate distance
  const distance = calculateDistance(fromComponent.bbox, toComponent.bbox);
  
  // Very close components (< 0.05 normalized units)
  if (distance < 0.05) {
    // Check if both are on a process line (pipes)
    if (fromComponent.type.includes('pipe') || toComponent.type.includes('pipe')) {
      return {
        type: 'chilled_water',
        confidence: 0.75,
        reasoning: 'Close proximity on process line'
      };
    }
    
    // Check if signal line components
    if (fromComponent.type.includes('sensor') || fromComponent.type.includes('instrument')) {
      return {
        type: 'electric_signal',
        confidence: 0.70,
        reasoning: 'Close proximity signal components'
      };
    }
  }
  
  return null;
}

/**
 * Calculate normalized distance between two bounding boxes
 */
function calculateDistance(bbox1: [number, number, number, number], bbox2: [number, number, number, number]): number {
  const center1 = [(bbox1[0] + bbox1[2]) / 2, (bbox1[1] + bbox1[3]) / 2];
  const center2 = [(bbox2[0] + bbox2[2]) / 2, (bbox2[1] + bbox2[3]) / 2];
  
  return Math.sqrt(
    Math.pow(center2[0] - center1[0], 2) +
    Math.pow(center2[1] - center1[1], 2)
  );
}

/**
 * Infer missing connections based on control loops
 */
export function inferMissingConnections(
  components: Component[],
  existingConnections: Connection[]
): InferredConnection[] {
  const inferred: InferredConnection[] = [];
  const connectionMap = new Map<string, Set<string>>();
  
  // Build existing connection map
  for (const conn of existingConnections) {
    if (!connectionMap.has(conn.from_id)) {
      connectionMap.set(conn.from_id, new Set());
    }
    connectionMap.get(conn.from_id)!.add(conn.to_id);
  }
  
  // Group components by loop/zone
  const loops = groupByLoop(components);
  
  // For each control loop, infer typical connections
  for (const [loopId, loopComponents] of loops.entries()) {
    const sensors = loopComponents.filter(c => c.type.startsWith('sensor_'));
    const controllers = loopComponents.filter(c => c.type.includes('controller'));
    const valves = loopComponents.filter(c => c.type.startsWith('valve_'));
    
    // Infer sensor -> controller connections
    for (const sensor of sensors) {
      for (const controller of controllers) {
        if (!hasConnection(connectionMap, sensor.id, controller.id)) {
          inferred.push({
            id: `inferred-${sensor.id}-${controller.id}`,
            from_id: sensor.id,
            to_id: controller.id,
            type: 'electric_signal',
            confidence: 0.85,
            reasoning: `Inferred control loop connection: ${loopId}`,
            inferred: true
          });
        }
      }
    }
    
    // Infer controller -> valve connections
    for (const controller of controllers) {
      for (const valve of valves) {
        if (!hasConnection(connectionMap, controller.id, valve.id)) {
          inferred.push({
            id: `inferred-${controller.id}-${valve.id}`,
            from_id: controller.id,
            to_id: valve.id,
            type: 'control_signal',
            confidence: 0.82,
            reasoning: `Inferred control loop actuation: ${loopId}`,
            inferred: true
          });
        }
      }
    }
  }
  
  return inferred;
}

/**
 * Group components by control loop or zone
 */
function groupByLoop(components: Component[]): Map<string, Component[]> {
  const loops = new Map<string, Component[]>();
  
  for (const component of components) {
    // Extract loop number from label (e.g., "TT-101" -> "101")
    const loopMatch = component.label.match(/[-_](\d+)/);
    const loopId = loopMatch ? loopMatch[1] : 'default';
    
    if (!loops.has(loopId)) {
      loops.set(loopId, []);
    }
    loops.get(loopId)!.push(component);
  }
  
  return loops;
}

/**
 * Check if connection exists
 */
function hasConnection(connectionMap: Map<string, Set<string>>, fromId: string, toId: string): boolean {
  return connectionMap.has(fromId) && connectionMap.get(fromId)!.has(toId);
}

/**
 * Validate connection consistency
 */
export function validateConnections(
  components: Component[],
  connections: Connection[]
): Array<{ connection: Connection; issue: string; severity: 'error' | 'warning' }> {
  const issues: Array<{ connection: Connection; issue: string; severity: 'error' | 'warning' }> = [];
  const componentMap = new Map(components.map(c => [c.id, c]));
  
  for (const connection of connections) {
    // Check if components exist
    const fromComp = componentMap.get(connection.from_id);
    const toComp = componentMap.get(connection.to_id);
    
    if (!fromComp) {
      issues.push({
        connection,
        issue: `Source component not found: ${connection.from_id}`,
        severity: 'error'
      });
      continue;
    }
    
    if (!toComp) {
      issues.push({
        connection,
        issue: `Target component not found: ${connection.to_id}`,
        severity: 'error'
      });
      continue;
    }
    
    // Validate connection type makes sense
    const inference = inferConnectionType(fromComp, toComp);
    if (connection.type !== inference.type && inference.confidence > 0.8) {
      issues.push({
        connection,
        issue: `Connection type mismatch: expected ${inference.type}, got ${connection.type}`,
        severity: 'warning'
      });
    }
    
    // Check for impossible connections
    if (connection.type === 'chilled_water') {
      if (!fromComp.type.includes('pipe') && !fromComp.type.includes('valve') &&
          !toComp.type.includes('pipe') && !toComp.type.includes('valve')) {
        issues.push({
          connection,
          issue: 'Chilled water connection between non-process components',
          severity: 'warning'
        });
      }
    }
    
    // Check for reverse logic
    if (connection.type === 'control_signal') {
      if (toComp.type.includes('sensor') && fromComp.type.includes('valve')) {
        issues.push({
          connection,
          issue: 'Control signal flowing from valve to sensor (likely reversed)',
          severity: 'warning'
        });
      }
    }
  }
  
  return issues;
}

/**
 * Enhance connections with inferred metadata
 */
export function enhanceConnections(
  components: Component[],
  connections: Connection[]
): Connection[] {
  const componentMap = new Map(components.map(c => [c.id, c]));
  
  return connections.map(connection => {
    const fromComp = componentMap.get(connection.from_id);
    const toComp = componentMap.get(connection.to_id);
    
    if (!fromComp || !toComp) {
      return connection;
    }
    
    const inference = inferConnectionType(fromComp, toComp);
    
    return {
      ...connection,
      meta: {
        ...connection.meta,
        inferred_type: inference.type,
        type_confidence: inference.confidence,
        type_reasoning: inference.reasoning,
        from_component_type: fromComp.type,
        to_component_type: toComp.type,
        from_label: fromComp.label,
        to_label: toComp.label
      }
    };
  });
}

/**
 * Detect control loops in the diagram
 */
export function detectControlLoops(
  components: Component[],
  connections: Connection[]
): Array<{
  id: string;
  name: string;
  components: Component[];
  connections: Connection[];
  type: string;
  confidence: number;
}> {
  const loops: Array<{
    id: string;
    name: string;
    components: Component[];
    connections: Connection[];
    type: string;
    confidence: number;
  }> = [];
  
  const componentMap = new Map(components.map(c => [c.id, c]));
  const connectionsByFrom = new Map<string, Connection[]>();
  
  // Build connection index
  for (const conn of connections) {
    if (!connectionsByFrom.has(conn.from_id)) {
      connectionsByFrom.set(conn.from_id, []);
    }
    connectionsByFrom.get(conn.from_id)!.push(conn);
  }
  
  // Find sensors (starting points)
  const sensors = components.filter(c => c.type.startsWith('sensor_'));
  
  for (const sensor of sensors) {
    const loopComponents: Component[] = [sensor];
    const loopConnections: Connection[] = [];
    const visited = new Set<string>([sensor.id]);
    
    // Traverse forward
    const queue = [sensor.id];
    while (queue.length > 0) {
      const currentId = queue.shift()!;
      const outgoing = connectionsByFrom.get(currentId) || [];
      
      for (const conn of outgoing) {
        if (!visited.has(conn.to_id)) {
          visited.add(conn.to_id);
          const component = componentMap.get(conn.to_id);
          if (component) {
            loopComponents.push(component);
            loopConnections.push(conn);
            queue.push(conn.to_id);
          }
        }
      }
    }
    
    // Only create loop if we have a complete chain (sensor -> controller -> actuator)
    const hasController = loopComponents.some(c => c.type.includes('controller'));
    const hasActuator = loopComponents.some(c => c.type.includes('valve') || c.type.includes('damper'));
    
    if (hasController && hasActuator) {
      const measuredVar = sensor.label.match(/^([A-Z]+)/)?.[1] || 'Unknown';
      loops.push({
        id: `loop-${sensor.label}`,
        name: `${measuredVar} Control Loop (${sensor.label})`,
        components: loopComponents,
        connections: loopConnections,
        type: measuredVar.toLowerCase(),
        confidence: 0.85
      });
    }
  }
  
  return loops;
}
