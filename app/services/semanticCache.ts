/**
 * SEMANTIC CACHE LAYER
 * 
 * Purpose: Drastically reduce AI inference costs and latency.
 * Strategy: In-Memory LRU (Least Recently Used) with Time-To-Live (TTL).
 * 
 * Specs:
 * - Capacity: 50 items (FIFO/LRU eviction)
 * - TTL: 1 Hour
 * - Key Generation: Context-aware (Image + Metadata)
 */

type CacheEntry<T> = {
    data: T;
    timestamp: number;
    hits: number;
};

class SemanticCache {
    private cache: Map<string, CacheEntry<any>>;
    private readonly MAX_SIZE = 50;
    private readonly TTL_MS = 60 * 60 * 1000; // 1 Hour

    constructor() {
        this.cache = new Map();
    }

    /**
     * Generates a lightweight fingerprint for large data (images).
     * Avoids hashing the entire MB-sized string.
     */
    public generateKey(prefix: string, base64Data: string, contextObj?: any): string {
        // Create a signature from the start of the file + exact length
        const imageSignature = `${base64Data.substring(0, 32)}_${base64Data.length}`;
        
        // If context exists (e.g., detected components list), stringify it for semantic uniqueness
        const contextSignature = contextObj 
            ? JSON.stringify(contextObj).length + '_' + JSON.stringify(contextObj).substring(0, 20) 
            : 'no-ctx';

        return `${prefix}::${imageSignature}::${contextSignature}`;
    }

    public get<T>(key: string): T | null {
        if (!this.cache.has(key)) {
            return null;
        }

        const entry = this.cache.get(key)!;
        const now = Date.now();

        // 1. Check Expiration
        if (now - entry.timestamp > this.TTL_MS) {
            console.log(`[CACHE] Expired: ${key.substring(0, 20)}...`);
            this.cache.delete(key);
            return null;
        }

        // 2. Cache Hit Logic (LRU Refresh)
        // We delete and re-set to move it to the end of the Map (most recently used)
        entry.hits++;
        this.cache.delete(key);
        this.cache.set(key, entry);

        console.log(`%c[CACHE HIT] Saved API Call | Hits: ${entry.hits} | Key: ${key.substring(0, 25)}...`, 'color: #10b981; font-weight: bold;');
        return entry.data as T;
    }

    public set<T>(key: string, data: T): void {
        // 1. Eviction Policy (LRU)
        if (this.cache.size >= this.MAX_SIZE) {
            // Map.keys() returns iterator in insertion order. First item is oldest.
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
            console.log(`[CACHE] Evicted oldest entry to maintain capacity.`);
        }

        // 2. Save
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            hits: 0
        });

        console.log(`[CACHE] Stored new analysis. Size: ${this.cache.size}/${this.MAX_SIZE}`);
    }

    public clear(): void {
        this.cache.clear();
    }
}

// Singleton Instance
export const aiCache = new SemanticCache();