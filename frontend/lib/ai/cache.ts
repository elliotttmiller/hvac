/**
 * Semantic Cache for AI Responses
 * Caches responses based on MD5 hash of input to save costs and improve speed
 */

export interface CacheEntry<T = any> {
  hash: string;
  data: T;
  timestamp: number;
  ttl?: number; // Time to live in milliseconds
}

export class SemanticCache {
  private cache: Map<string, CacheEntry>;
  private readonly DEFAULT_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor() {
    this.cache = new Map();
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
   * Get cache statistics
   */
  getStats(): { size: number; entries: number } {
    return {
      size: this.cache.size,
      entries: this.cache.size,
    };
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
      localStorage.setItem('gemini-cache', JSON.stringify(entries));
    } catch (error) {
      console.warn('Failed to save cache to storage:', error);
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
