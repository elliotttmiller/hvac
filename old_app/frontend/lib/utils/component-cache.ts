/**
 * Advanced Component-Level Caching System
 * Caches individual components and their analysis results
 * Dramatically reduces processing time for similar diagrams
 */

export interface CachedComponent {
  id: string;
  hash: string; // Visual hash of the component region
  type: string;
  label: string;
  bbox: [number, number, number, number];
  confidence: number;
  meta: any;
  timestamp: number;
  hitCount: number;
}

export interface ComponentCacheStats {
  totalEntries: number;
  totalHits: number;
  totalMisses: number;
  hitRate: number;
  cacheSizeBytes: number;
  oldestEntry: number;
  newestEntry: number;
}

/**
 * Component-level cache with LRU eviction
 */
export class ComponentCache {
  private cache: Map<string, CachedComponent> = new Map();
  private maxEntries: number;
  private maxAge: number; // milliseconds
  private hits: number = 0;
  private misses: number = 0;
  
  constructor(maxEntries: number = 1000, maxAgeHours: number = 24) {
    this.maxEntries = maxEntries;
    this.maxAge = maxAgeHours * 60 * 60 * 1000;
  }
  
  /**
   * Generate hash for component region
   * Uses a combination of image characteristics and bbox to create unique identifier
   */
  private generateHash(imageData: string, bbox: [number, number, number, number]): string {
    // Create a more robust hash using image data characteristics + bbox
    const bboxStr = bbox.map(n => n.toFixed(4)).join(',');
    
    // Sample multiple points from image data for better distribution
    const imageLength = imageData.length;
    const samples = [
      imageData.substring(0, 50),
      imageData.substring(Math.floor(imageLength / 4), Math.floor(imageLength / 4) + 50),
      imageData.substring(Math.floor(imageLength / 2), Math.floor(imageLength / 2) + 50),
      imageData.substring(Math.floor(imageLength * 3 / 4), Math.floor(imageLength * 3 / 4) + 50),
      imageData.substring(imageLength - 50)
    ].join('');
    
    // Simple but effective hash combining samples + length + bbox
    return `${this.simpleHash(samples)}-${imageLength}-${bboxStr}`;
  }
  
  /**
   * Simple hash function for strings
   */
  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36);
  }
  
  /**
   * Get cached component
   */
  get(imageData: string, bbox: [number, number, number, number]): CachedComponent | null {
    const hash = this.generateHash(imageData, bbox);
    const cached = this.cache.get(hash);
    
    if (!cached) {
      this.misses++;
      return null;
    }
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.maxAge) {
      this.cache.delete(hash);
      this.misses++;
      return null;
    }
    
    // Update hit count and move to end (LRU)
    cached.hitCount++;
    this.cache.delete(hash);
    this.cache.set(hash, cached);
    this.hits++;
    
    return cached;
  }
  
  /**
   * Store component in cache
   */
  set(
    imageData: string,
    bbox: [number, number, number, number],
    component: Omit<CachedComponent, 'hash' | 'timestamp' | 'hitCount'>
  ): void {
    const hash = this.generateHash(imageData, bbox);
    
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxEntries) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }
    
    this.cache.set(hash, {
      ...component,
      hash,
      timestamp: Date.now(),
      hitCount: 0
    });
  }
  
  /**
   * Batch lookup for multiple regions
   */
  getMany(
    imageData: string,
    bboxes: Array<[number, number, number, number]>
  ): Array<CachedComponent | null> {
    return bboxes.map(bbox => this.get(imageData, bbox));
  }
  
  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
    this.hits = 0;
    this.misses = 0;
  }
  
  /**
   * Get cache statistics
   */
  getStats(): ComponentCacheStats {
    const entries = Array.from(this.cache.values());
    const totalHits = this.hits;
    const totalMisses = this.misses;
    const totalRequests = totalHits + totalMisses;
    
    let cacheSizeBytes = 0;
    let oldestEntry = Date.now();
    let newestEntry = 0;
    
    for (const entry of entries) {
      // Rough estimate of size
      cacheSizeBytes += JSON.stringify(entry).length;
      oldestEntry = Math.min(oldestEntry, entry.timestamp);
      newestEntry = Math.max(newestEntry, entry.timestamp);
    }
    
    return {
      totalEntries: this.cache.size,
      totalHits,
      totalMisses,
      hitRate: totalRequests > 0 ? totalHits / totalRequests : 0,
      cacheSizeBytes,
      oldestEntry,
      newestEntry
    };
  }
  
  /**
   * Evict expired entries
   */
  evictExpired(): number {
    const now = Date.now();
    let evicted = 0;
    
    for (const [hash, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(hash);
        evicted++;
      }
    }
    
    return evicted;
  }
  
  /**
   * Get most frequently accessed components
   */
  getTopComponents(limit: number = 10): CachedComponent[] {
    return Array.from(this.cache.values())
      .sort((a, b) => b.hitCount - a.hitCount)
      .slice(0, limit);
  }
}

/**
 * Global component cache instance
 */
let globalComponentCache: ComponentCache | null = null;

/**
 * Get or create global component cache
 */
export function getComponentCache(): ComponentCache {
  if (!globalComponentCache) {
    globalComponentCache = new ComponentCache();
  }
  return globalComponentCache;
}

/**
 * Pattern-based caching for common HVAC symbols
 */
export class SymbolPatternCache {
  private patterns: Map<string, {
    type: string;
    confidence: number;
    meta: any;
    count: number;
  }> = new Map();
  
  /**
   * Extract pattern signature from visual features
   */
  private extractPattern(bbox: [number, number, number, number], visualFeatures?: any): string {
    const width = bbox[2] - bbox[0];
    const height = bbox[3] - bbox[1];
    const aspectRatio = width / height;
    
    // Quantize aspect ratio for pattern matching
    const quantizedRatio = Math.round(aspectRatio * 10) / 10;
    
    return `AR:${quantizedRatio}`;
  }
  
  /**
   * Learn from detected component
   */
  learn(
    bbox: [number, number, number, number],
    type: string,
    confidence: number,
    meta?: any
  ): void {
    const pattern = this.extractPattern(bbox);
    const existing = this.patterns.get(pattern);
    
    if (existing) {
      // Update if this detection is more confident
      if (confidence > existing.confidence) {
        this.patterns.set(pattern, {
          type,
          confidence,
          meta,
          count: existing.count + 1
        });
      } else {
        existing.count++;
      }
    } else {
      this.patterns.set(pattern, {
        type,
        confidence,
        meta,
        count: 1
      });
    }
  }
  
  /**
   * Predict type based on pattern
   */
  predict(bbox: [number, number, number, number]): {
    type: string;
    confidence: number;
    meta?: any;
  } | null {
    const pattern = this.extractPattern(bbox);
    const match = this.patterns.get(pattern);
    
    if (!match || match.count < 3) {
      // Need at least 3 examples to trust pattern
      return null;
    }
    
    return {
      type: match.type,
      confidence: Math.min(match.confidence * 0.8, 0.9), // Reduce confidence for pattern match
      meta: match.meta
    };
  }
  
  /**
   * Get pattern statistics
   */
  getPatternStats(): Array<{
    pattern: string;
    type: string;
    count: number;
    confidence: number;
  }> {
    return Array.from(this.patterns.entries())
      .map(([pattern, data]) => ({
        pattern,
        type: data.type,
        count: data.count,
        confidence: data.confidence
      }))
      .sort((a, b) => b.count - a.count);
  }
  
  /**
   * Clear patterns
   */
  clear(): void {
    this.patterns.clear();
  }
}

/**
 * Tile-level result caching
 */
export class TileResultCache {
  private cache: Map<string, {
    result: any;
    timestamp: number;
    imageHash: string;
  }> = new Map();
  
  /**
   * Generate hash for tile
   */
  private generateTileHash(tileData: string, position: { row: number; col: number }): string {
    const posKey = `${position.row}-${position.col}`;
    const dataHash = tileData.length + tileData.substring(0, 100);
    return `${posKey}-${dataHash}`;
  }
  
  /**
   * Get cached tile result
   */
  get(tileData: string, position: { row: number; col: number }): any | null {
    const hash = this.generateTileHash(tileData, position);
    const cached = this.cache.get(hash);
    
    if (!cached) return null;
    
    // Check if cache is stale (1 hour)
    if (Date.now() - cached.timestamp > 3600000) {
      this.cache.delete(hash);
      return null;
    }
    
    return cached.result;
  }
  
  /**
   * Store tile result
   */
  set(tileData: string, position: { row: number; col: number }, result: any): void {
    const hash = this.generateTileHash(tileData, position);
    this.cache.set(hash, {
      result,
      timestamp: Date.now(),
      imageHash: hash
    });
  }
  
  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }
  
  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }
}

/**
 * Global tile cache instance
 */
let globalTileCache: TileResultCache | null = null;

/**
 * Get or create global tile cache
 */
export function getTileCache(): TileResultCache {
  if (!globalTileCache) {
    globalTileCache = new TileResultCache();
  }
  return globalTileCache;
}
