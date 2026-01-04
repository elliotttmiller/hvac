/**
 * Advanced Component Filtering and Search System
 * Provides multi-criteria filtering, full-text search, and smart suggestions
 */

import type { DetectedComponent, Connection } from '../../features/document-analysis/types';

export interface FilterCriteria {
  type?: string[];
  confidence?: { min: number; max: number };
  isaFunction?: string[];
  location?: string[];
  subsystem?: string[];
  detectionQuality?: string[];
  searchText?: string;
}

export interface SearchResult {
  component: DetectedComponent;
  score: number;
  matchedFields: string[];
}

/**
 * Component filter and search engine
 */
export class ComponentSearchEngine {
  /**
   * Filter components by criteria
   */
  static filter(components: DetectedComponent[], criteria: FilterCriteria): DetectedComponent[] {
    return components.filter(component => {
      // Type filter
      if (criteria.type && criteria.type.length > 0) {
        if (!criteria.type.includes(component.type)) {
          return false;
        }
      }
      
      // Confidence filter
      if (criteria.confidence) {
        if (component.confidence < criteria.confidence.min || 
            component.confidence > criteria.confidence.max) {
          return false;
        }
      }
      
      // ISA Function filter
      if (criteria.isaFunction && criteria.isaFunction.length > 0) {
        const isaFunc = component.meta?.isa_function;
        if (!isaFunc || !criteria.isaFunction.includes(isaFunc)) {
          return false;
        }
      }
      
      // Location filter
      if (criteria.location && criteria.location.length > 0) {
        const location = component.meta?.location;
        if (!location || !criteria.location.includes(location)) {
          return false;
        }
      }
      
      // Subsystem filter
      if (criteria.subsystem && criteria.subsystem.length > 0) {
        const subsystem = component.meta?.hvac_subsystem;
        if (!subsystem || !criteria.subsystem.includes(subsystem)) {
          return false;
        }
      }
      
      // Detection quality filter
      if (criteria.detectionQuality && criteria.detectionQuality.length > 0) {
        const quality = component.meta?.detection_quality;
        if (!quality || !criteria.detectionQuality.includes(quality)) {
          return false;
        }
      }
      
      // Search text filter
      if (criteria.searchText) {
        return this.matchesSearch(component, criteria.searchText);
      }
      
      return true;
    });
  }
  
  /**
   * Full-text search with scoring
   */
  static search(components: DetectedComponent[], query: string): SearchResult[] {
    if (!query || query.trim().length === 0) {
      return components.map(c => ({ component: c, score: 1.0, matchedFields: [] }));
    }
    
    const normalizedQuery = query.toLowerCase().trim();
    const results: SearchResult[] = [];
    
    for (const component of components) {
      const { score, matchedFields } = this.calculateSearchScore(component, normalizedQuery);
      
      if (score > 0) {
        results.push({ component, score, matchedFields });
      }
    }
    
    // Sort by score (descending)
    return results.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Calculate search score for a component
   */
  private static calculateSearchScore(
    component: DetectedComponent,
    query: string
  ): { score: number; matchedFields: string[] } {
    let score = 0;
    const matchedFields: string[] = [];
    
    // Exact match in label (highest priority)
    if (component.label.toLowerCase() === query) {
      score += 100;
      matchedFields.push('label (exact)');
    } else if (component.label.toLowerCase().includes(query)) {
      score += 50;
      matchedFields.push('label');
    }
    
    // Match in ID
    if (component.id.toLowerCase().includes(query)) {
      score += 30;
      matchedFields.push('id');
    }
    
    // Match in type
    if (component.type.toLowerCase().includes(query)) {
      score += 20;
      matchedFields.push('type');
    }
    
    // Match in ISA function
    const isaFunc = component.meta?.isa_function;
    if (isaFunc && isaFunc.toLowerCase().includes(query)) {
      score += 40;
      matchedFields.push('isa_function');
    }
    
    // Match in description
    const description = component.meta?.description || component.meta?.functional_desc;
    if (description && description.toLowerCase().includes(query)) {
      score += 15;
      matchedFields.push('description');
    }
    
    // Match in tag
    const tag = component.meta?.tag;
    if (tag && tag.toLowerCase().includes(query)) {
      score += 35;
      matchedFields.push('tag');
    }
    
    // Fuzzy match bonus
    if (this.fuzzyMatch(component.label, query)) {
      score += 10;
      matchedFields.push('fuzzy_match');
    }
    
    return { score, matchedFields };
  }
  
  /**
   * Check if component matches search text
   */
  private static matchesSearch(component: DetectedComponent, query: string): boolean {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Search in main fields
    const searchableText = [
      component.id,
      component.label,
      component.type,
      component.meta?.description || '',
      component.meta?.functional_desc || '',
      component.meta?.tag || '',
      component.meta?.isa_function || '',
      component.meta?.location || '',
      component.meta?.hvac_subsystem || ''
    ].join(' ').toLowerCase();
    
    return searchableText.includes(normalizedQuery);
  }
  
  /**
   * Fuzzy matching for typos
   * Allows for 30% character error rate to account for OCR errors and variations
   */
  private static readonly FUZZY_MATCH_TOLERANCE = 0.3;
  
  private static fuzzyMatch(text: string, query: string): boolean {
    const distance = this.levenshteinDistance(text.toLowerCase(), query.toLowerCase());
    const maxDistance = Math.floor(query.length * this.FUZZY_MATCH_TOLERANCE);
    return distance <= maxDistance;
  }
  
  /**
   * Calculate Levenshtein distance
   */
  private static levenshteinDistance(str1: string, str2: string): number {
    const m = str1.length;
    const n = str2.length;
    const dp: number[][] = Array(m + 1).fill(null).map(() => Array(n + 1).fill(0));
    
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (str1[i - 1] === str2[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          dp[i][j] = Math.min(
            dp[i - 1][j] + 1,     // deletion
            dp[i][j - 1] + 1,     // insertion
            dp[i - 1][j - 1] + 1  // substitution
          );
        }
      }
    }
    
    return dp[m][n];
  }
  
  /**
   * Get unique values for filter options
   */
  static getFilterOptions(components: DetectedComponent[]): {
    types: string[];
    isaFunctions: string[];
    locations: string[];
    subsystems: string[];
    detectionQualities: string[];
  } {
    const types = new Set<string>();
    const isaFunctions = new Set<string>();
    const locations = new Set<string>();
    const subsystems = new Set<string>();
    const detectionQualities = new Set<string>();
    
    for (const component of components) {
      types.add(component.type);
      
      if (component.meta?.isa_function) {
        isaFunctions.add(component.meta.isa_function);
      }
      
      if (component.meta?.location) {
        locations.add(component.meta.location);
      }
      
      if (component.meta?.hvac_subsystem) {
        subsystems.add(component.meta.hvac_subsystem);
      }
      
      if (component.meta?.detection_quality) {
        detectionQualities.add(component.meta.detection_quality);
      }
    }
    
    return {
      types: Array.from(types).sort(),
      isaFunctions: Array.from(isaFunctions).sort(),
      locations: Array.from(locations).sort(),
      subsystems: Array.from(subsystems).sort(),
      detectionQualities: Array.from(detectionQualities).sort()
    };
  }
  
  /**
   * Get search suggestions
   */
  static getSuggestions(components: DetectedComponent[], query: string, limit: number = 5): string[] {
    if (!query || query.length < 2) return [];
    
    const normalizedQuery = query.toLowerCase();
    const suggestions = new Set<string>();
    
    for (const component of components) {
      // Suggest labels
      if (component.label.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(component.label);
      }
      
      // Suggest tags
      if (component.meta?.tag && component.meta.tag.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(component.meta.tag);
      }
      
      // Suggest ISA functions
      if (component.meta?.isa_function && 
          component.meta.isa_function.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(component.meta.isa_function);
      }
      
      if (suggestions.size >= limit) break;
    }
    
    return Array.from(suggestions).slice(0, limit);
  }
}

/**
 * Connection filter
 */
export class ConnectionFilter {
  /**
   * Filter connections by criteria
   */
  static filter(
    connections: Connection[],
    criteria: {
      type?: string[];
      fromId?: string;
      toId?: string;
      minConfidence?: number;
    }
  ): Connection[] {
    return connections.filter(connection => {
      // Type filter
      if (criteria.type && criteria.type.length > 0) {
        if (!criteria.type.includes(connection.type)) {
          return false;
        }
      }
      
      // From component filter
      if (criteria.fromId && connection.from_id !== criteria.fromId) {
        return false;
      }
      
      // To component filter
      if (criteria.toId && connection.to_id !== criteria.toId) {
        return false;
      }
      
      // Confidence filter
      if (criteria.minConfidence !== undefined) {
        if (!connection.confidence || connection.confidence < criteria.minConfidence) {
          return false;
        }
      }
      
      return true;
    });
  }
  
  /**
   * Get connections for a specific component
   */
  static getComponentConnections(
    connections: Connection[],
    componentId: string
  ): { incoming: Connection[]; outgoing: Connection[] } {
    return {
      incoming: connections.filter(c => c.to_id === componentId),
      outgoing: connections.filter(c => c.from_id === componentId)
    };
  }
  
  /**
   * Find connection path between two components
   */
  static findPath(
    connections: Connection[],
    fromId: string,
    toId: string,
    maxDepth: number = 5
  ): Connection[] | null {
    const visited = new Set<string>();
    const queue: Array<{ id: string; path: Connection[] }> = [{ id: fromId, path: [] }];
    
    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current.path.length >= maxDepth) continue;
      if (visited.has(current.id)) continue;
      visited.add(current.id);
      
      // Find outgoing connections
      const outgoing = connections.filter(c => c.from_id === current.id);
      
      for (const conn of outgoing) {
        if (conn.to_id === toId) {
          return [...current.path, conn];
        }
        
        queue.push({
          id: conn.to_id,
          path: [...current.path, conn]
        });
      }
    }
    
    return null;
  }
}
