/**
 * SEMANTIC CACHE LAYER - Production Grade
 * 
 * Purpose: Drastically reduce AI inference costs and latency.
 * Strategy: Browser-persistent cache using localStorage with LRU eviction and TTL expiration.
 * 
 * Enhancements from production:
 * - Storage quota monitoring and management
 * - Automatic eviction policies
 * - Cache statistics and hit rate tracking
 * - Persistent storage across browser sessions
 * 
 * Specs:
 * - Storage: localStorage (persists across sessions)
 * - Capacity: 100 items (LRU eviction)
 * - TTL: 24 Hours (configurable)
 * - Key Generation: Context-aware (Image + Metadata)
 * - Quota: 4MB with automatic management
 */

type CacheEntry<T> = {
    data: T;
    timestamp: number;
    hits: number;
    ttl: number;
};

interface CacheStats {
    size: number;
    maxSize: number;
    hits: number;
    misses: number;
    hitRate: string;
    evictions: number;
    estimatedSavings: string;
    sizeBytes: number;
    maxSizeBytes: number;
    percentFull: number;
}

class SemanticCache {
    private cache: Map<string, CacheEntry<any>>;
    private readonly MAX_SIZE = 100; // Increased from 50
    private readonly TTL_MS = 24 * 60 * 60 * 1000; // 24 Hours (increased from 1 hour)
    private readonly MAX_CACHE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB localStorage limit
    private readonly STORAGE_KEY = 'hvac-ai-cache';
    private readonly COST_PER_REQUEST = 0.03; // Approximate cost per AI request in dollars
    private stats = {
        hits: 0,
        misses: 0,
        evictions: 0,
        totalSaved: 0 // Estimated cost savings in dollars
    };

    constructor() {
        this.cache = new Map();
        this.loadFromStorage();
        this.cleanupExpired();
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
            this.stats.misses++;
            return null;
        }

        const entry = this.cache.get(key)!;
        const now = Date.now();

        // 1. Check Expiration (compare current time against timestamp + TTL)
        if (now > entry.timestamp + entry.ttl) {
            console.log(`[CACHE] Expired: ${key.substring(0, 20)}...`);
            this.cache.delete(key);
            this.saveToStorage();
            this.stats.misses++;
            return null;
        }

        // 2. Cache Hit Logic (LRU Refresh)
        entry.hits++;
        this.stats.hits++;
        this.stats.totalSaved += this.COST_PER_REQUEST;
        
        // Move to end of Map (most recently used)
        this.cache.delete(key);
        this.cache.set(key, entry);

        const hitRate = this.getHitRate();
        console.log(`%c[CACHE HIT] Saved $${this.COST_PER_REQUEST.toFixed(2)} | Total saved: $${this.stats.totalSaved.toFixed(2)} | Hit rate: ${hitRate}% | Entry hits: ${entry.hits}`, 'color: #10b981; font-weight: bold;');
        
        this.saveToStorage();
        return entry.data as T;
    }

    public set<T>(key: string, data: T, ttl?: number): void {
        // 1. Eviction Policy (LRU)
        if (this.cache.size >= this.MAX_SIZE) {
            // Map.keys() returns iterator in insertion order. First item is oldest.
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
            this.stats.evictions++;
            console.log(`[CACHE] Evicted oldest entry to maintain capacity (${this.stats.evictions} total evictions)`);
        }

        // 2. Save
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            hits: 0,
            ttl: ttl || this.TTL_MS
        });

        console.log(`[CACHE] Stored new entry. Size: ${this.cache.size}/${this.MAX_SIZE}`);
        
        // 3. Persist to localStorage
        this.saveToStorage();
        
        // 4. Check storage quota
        this.checkStorageQuota();
    }

    public clear(): void {
        this.cache.clear();
        this.stats = { hits: 0, misses: 0, evictions: 0, totalSaved: 0 };
        this.saveToStorage();
        console.log('[CACHE] Cleared all entries');
    }

    public getStats(): CacheStats {
        const hitRate = this.getHitRate();
        const sizeBytes = this.estimateCacheSize();
        const percentFull = (sizeBytes / this.MAX_CACHE_SIZE_BYTES) * 100;
        
        return {
            size: this.cache.size,
            maxSize: this.MAX_SIZE,
            hits: this.stats.hits,
            misses: this.stats.misses,
            hitRate: `${hitRate}%`,
            evictions: this.stats.evictions,
            estimatedSavings: `$${this.stats.totalSaved.toFixed(2)}`,
            sizeBytes,
            maxSizeBytes: this.MAX_CACHE_SIZE_BYTES,
            percentFull: Math.round(percentFull * 10) / 10
        };
    }

    private getHitRate(): number {
        const total = this.stats.hits + this.stats.misses;
        if (total === 0) return 0;
        return Math.round((this.stats.hits / total) * 100);
    }

    private estimateCacheSize(): number {
        try {
            const entries = Array.from(this.cache.entries());
            const serialized = JSON.stringify(entries);
            
            // Use Blob API for accurate byte size
            if (typeof Blob !== 'undefined') {
                return new Blob([serialized]).size;
            }
            
            // Fallback: estimate UTF-16 encoding (2 bytes per char)
            return serialized.length * 2;
        } catch (error) {
            console.warn('[CACHE] Failed to estimate size:', error);
            return 0;
        }
    }

    private checkStorageQuota(): boolean {
        const sizeBytes = this.estimateCacheSize();
        const percentFull = (sizeBytes / this.MAX_CACHE_SIZE_BYTES);
        
        if (percentFull >= 0.9) {
            console.warn(`[CACHE] Storage quota warning: ${Math.round(percentFull * 100)}% full. Evicting older entries...`);
            this.evictOldestEntries(Math.floor(this.MAX_SIZE * 0.7)); // Reduce to 70% capacity
            return false;
        }
        
        return true;
    }

    private evictOldestEntries(targetSize: number): void {
        const entries = Array.from(this.cache.entries());
        // Sort by timestamp (oldest first)
        entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
        
        let evicted = 0;
        while (this.cache.size > targetSize && evicted < entries.length) {
            const [key] = entries[evicted];
            this.cache.delete(key);
            this.stats.evictions++;
            evicted++;
        }
        
        if (evicted > 0) {
            console.log(`[CACHE] Evicted ${evicted} old entries to free space`);
            this.saveToStorage();
        }
    }

    private cleanupExpired(): void {
        const now = Date.now();
        let cleaned = 0;

        for (const [key, entry] of this.cache.entries()) {
            // Check if expired (current time > timestamp + TTL)
            if (now > entry.timestamp + entry.ttl) {
                this.cache.delete(key);
                cleaned++;
            }
        }

        if (cleaned > 0) {
            console.log(`[CACHE] Cleaned up ${cleaned} expired entries`);
            this.saveToStorage();
        }
    }

    private loadFromStorage(): void {
        try {
            if (typeof localStorage === 'undefined') return;

            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const entries = JSON.parse(stored);
                this.cache = new Map(entries);
                console.log(`[CACHE] Loaded ${this.cache.size} entries from storage`);
                
                // Cleanup expired entries after loading
                this.cleanupExpired();
            }
        } catch (error) {
            console.warn('[CACHE] Failed to load from storage:', error);
            // Clear corrupted cache
            this.cache.clear();
            try {
                localStorage.removeItem(this.STORAGE_KEY);
            } catch (e) {
                // Ignore
            }
        }
    }

    private saveToStorage(): void {
        try {
            if (typeof localStorage === 'undefined') return;

            const entries = Array.from(this.cache.entries());
            const serialized = JSON.stringify(entries);
            
            // Check size before saving
            const estimatedSize = serialized.length * 2; // UTF-16 encoding
            if (estimatedSize > this.MAX_CACHE_SIZE_BYTES) {
                console.warn(`[CACHE] Data too large to save (${Math.round(estimatedSize / 1024)}KB), evicting entries`);
                this.evictOldestEntries(Math.floor(this.MAX_SIZE * 0.5));
                return; // Try again on next save
            }
            
            localStorage.setItem(this.STORAGE_KEY, serialized);
        } catch (error) {
            console.warn('[CACHE] Failed to save to storage:', error);
            
            // Handle QuotaExceededError
            if (error instanceof Error && error.name === 'QuotaExceededError') {
                console.warn('[CACHE] QuotaExceededError - clearing cache');
                this.cache.clear();
                try {
                    localStorage.removeItem(this.STORAGE_KEY);
                } catch (e) {
                    // Ignore
                }
            }
        }
    }
}

// Singleton Instance
export const aiCache = new SemanticCache();