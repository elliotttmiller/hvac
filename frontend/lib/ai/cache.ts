/**
 * Semantic Cache for AI Responses
 * Caches responses based on MD5 hash of input to save costs and improve speed
 * 
 * STORAGE LIMITS: Browsers typically limit localStorage to 5-10MB.
 * This cache implements quota monitoring and automatic eviction to stay within limits.
 */

import { clientConfig } from '../clientConfig';

export interface CacheEntry<T = any> {
  hash: string;
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

export class SemanticCache {
  private cache: Map<string, CacheEntry>;
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours
  private readonly MAX_CACHE_SIZE_BYTES: number;
  private readonly WARNING_THRESHOLD = 0.8; // Warn at 80% capacity

  constructor() {
    this.cache = new Map();
    // Use configuration value, fallback to 4MB if not set
    this.MAX_CACHE_SIZE_BYTES = clientConfig.CACHE_MAX_SIZE_BYTES || (4 * 1024 * 1024);
    this.loadFromStorage();
  }

  /**
   * Generate MD5-like hash from string input
   * Using a simple hash function for browser compatibility
   */
  private async generateHash(input: string): Promise<string> {
    // Use Web Crypto API if available
    if (typeof crypto !== 'undefined' && crypto.subtle) {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    // Fallback to simple hash
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(16);
  }

  /**
   * Get cached data by input key
   */
  async get<T = any>(input: string): Promise<T | null> {
    const hash = await this.generateHash(input);
    const entry = this.cache.get(hash);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(hash);
      this.saveToStorage();
      return null;
    }

    return entry.data as T;
  }

  /**
   * Set cached data for input key
   */
  async set<T = any>(input: string, data: T, ttl?: number): Promise<void> {
    const hash = await this.generateHash(input);
    
    const entry: CacheEntry<T> = {
      hash,
      data,
      timestamp: Date.now(),
      ttl: ttl || this.DEFAULT_TTL,
    };

    this.cache.set(hash, entry);
    
    // Check if we're exceeding storage quota
    if (!this.checkStorageQuota()) {
      // Evict old entries to make room (target 70% capacity)
      const targetSize = Math.floor(this.MAX_CACHE_SIZE_BYTES * 0.7);
      this.evictOldEntries(targetSize);
      
      // Try again after eviction
      if (!this.checkStorageQuota()) {
        console.error('[Cache] Unable to free enough space, clearing cache');
        this.cache.clear();
      }
    }
    
    this.saveToStorage();
  }

  /**
   * Check if input exists in cache
   */
  async has(input: string): Promise<boolean> {
    const hash = await this.generateHash(input);
    const entry = this.cache.get(hash);
    
    if (!entry) {
      return false;
    }

    // Check if expired
    if (entry.ttl && Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(hash);
      this.saveToStorage();
      return false;
    }

    return true;
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
    this.saveToStorage();
  }

  /**
   * Delete a specific cache entry by input key
   */
  async delete(input: string): Promise<boolean> {
    const hash = await this.generateHash(input);
    const existed = this.cache.has(hash);
    if (existed) {
      this.cache.delete(hash);
      this.saveToStorage();
    }
    return existed;
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now();
    let changed = false;

    for (const [hash, entry] of this.cache.entries()) {
      if (entry.ttl && now - entry.timestamp > entry.ttl) {
        this.cache.delete(hash);
        changed = true;
      }
    }

    if (changed) {
      this.saveToStorage();
    }
  }

  /**
   * Get cache statistics including size in bytes
   */
  getStats(): { size: number; entries: number; sizeBytes: number; maxSizeBytes: number; percentFull: number } {
    const sizeBytes = this.estimateCacheSize();
    const percentFull = (sizeBytes / this.MAX_CACHE_SIZE_BYTES) * 100;
    
    return {
      size: this.cache.size,
      entries: this.cache.size,
      sizeBytes,
      maxSizeBytes: this.MAX_CACHE_SIZE_BYTES,
      percentFull: Math.round(percentFull * 10) / 10, // Round to 1 decimal
    };
  }

  /**
   * Estimate the size of cached data in bytes
   */
  private estimateCacheSize(): number {
    try {
      const entries = Array.from(this.cache.entries());
      const serialized = JSON.stringify(entries);
      // Multiply by 2 to account for UTF-16 encoding in JavaScript strings
      return serialized.length * 2;
    } catch (error) {
      console.warn('Failed to estimate cache size:', error);
      return 0;
    }
  }

  /**
   * Check if cache is approaching storage limits
   */
  private checkStorageQuota(): boolean {
    const sizeBytes = this.estimateCacheSize();
    const percentFull = (sizeBytes / this.MAX_CACHE_SIZE_BYTES);
    
    if (percentFull >= 1.0) {
      console.warn(`[Cache] Storage quota exceeded (${Math.round(sizeBytes / 1024)}KB / ${Math.round(this.MAX_CACHE_SIZE_BYTES / 1024)}KB)`);
      return false;
    }
    
    if (percentFull >= this.WARNING_THRESHOLD) {
      console.warn(`[Cache] Storage quota warning: ${Math.round(percentFull * 100)}% full (${Math.round(sizeBytes / 1024)}KB / ${Math.round(this.MAX_CACHE_SIZE_BYTES / 1024)}KB)`);
    }
    
    return true;
  }

  /**
   * Evict oldest entries to free up space
   * @param targetBytes - Target size to reduce cache to
   */
  private evictOldEntries(targetBytes: number): void {
    const entries = Array.from(this.cache.entries());
    // Sort by timestamp (oldest first)
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    let currentSize = this.estimateCacheSize();
    let evicted = 0;
    
    for (const [hash, entry] of entries) {
      if (currentSize <= targetBytes) break;
      
      this.cache.delete(hash);
      currentSize = this.estimateCacheSize();
      evicted++;
    }
    
    if (evicted > 0) {
      console.log(`[Cache] Evicted ${evicted} old entries to free space`);
    }
  }

  /**
   * Load cache from localStorage
   */
  private loadFromStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;

      const stored = localStorage.getItem('gemini-cache');
      if (stored) {
        const entries = JSON.parse(stored);
        this.cache = new Map(entries);
        // Cleanup on load
        this.cleanup();
      }
    } catch (error) {
      console.warn('Failed to load cache from storage:', error);
    }
  }

  /**
   * Save cache to localStorage
   */
  private saveToStorage(): void {
    try {
      if (typeof localStorage === 'undefined') return;

      const entries = Array.from(this.cache.entries());
      const serialized = JSON.stringify(entries);
      
      // Check if serialized data is too large before attempting to save
      const estimatedSize = serialized.length * 2; // Account for UTF-16 encoding
      if (estimatedSize > this.MAX_CACHE_SIZE_BYTES) {
        console.warn(`[Cache] Data too large to save (${Math.round(estimatedSize / 1024)}KB), evicting entries`);
        this.evictOldEntries(Math.floor(this.MAX_CACHE_SIZE_BYTES * 0.7));
        return; // Don't save, try again on next set
      }
      
      localStorage.setItem('gemini-cache', serialized);
    } catch (error) {
      console.warn('[Cache] Failed to save cache to storage:', error);
      
      // If we hit QuotaExceededError, try to recover
      if (error instanceof Error && error.name === 'QuotaExceededError') {
        console.warn('[Cache] QuotaExceededError detected, clearing cache');
        this.cache.clear();
        try {
          localStorage.removeItem('gemini-cache');
        } catch (e) {
          console.error('[Cache] Failed to clear localStorage:', e);
        }
      }
    }
  }
}

// Export singleton instance
let cacheInstance: SemanticCache | null = null;

export function getSemanticCache(): SemanticCache {
  if (!cacheInstance) {
    cacheInstance = new SemanticCache();
  }
  return cacheInstance;
}
