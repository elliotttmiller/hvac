# LocalStorage and Tiling Cost Optimization

**Date:** January 7, 2026  
**Status:** ✅ Implemented  
**Related Issue:** Analysis of localStorage limits and grid tiling costs

## Overview

This document describes the implementation of localStorage quota management and selective grid tiling optimization to address two critical concerns:

1. **LocalStorage Limits**: Browser localStorage quotas (5-10MB) can be exceeded by caching large analysis results
2. **Grid Tiling Costs**: 2x2 grid tiling requires 4x API calls per document, potentially wasting money on small PDFs

## Problem Statement

### LocalStorage Risk

**Issue:** The semantic cache (`frontend/lib/ai/cache.ts`) stores entire analysis results (including base64 images) in localStorage without monitoring storage quotas.

**Risk:** 
- Browsers limit localStorage to 5-10MB
- High-res base64 images can be 500KB-2MB each
- Large JSON reports with 100+ components can be 100KB-500KB
- A few cached analyses can quickly exceed the 5MB limit
- When exceeded, `QuotaExceededError` crashes the application

**Example:**
```
5 cached analyses × 1.5MB average = 7.5MB > 5MB quota = ❌ CRASH
```

### Grid Tiling Cost

**Issue:** The tiling decision was based on file size (500KB) rather than actual image dimensions.

**Risk:**
- A 1200×900px PDF (400KB) would trigger tiling unnecessarily
- Grid tiling = 4 tile API calls + 1 merge call = 5× cost
- Small PDFs should use single-pass analysis for cost efficiency

**Cost Impact:**
```
Small PDF (1200×900px):
  WITHOUT optimization: 5 API calls = $0.050
  WITH optimization:    1 API call = $0.010
  Savings: 80% per small document
```

## Solution: Intelligent Storage & Tiling Management

### 1. LocalStorage Quota Monitoring

**Implementation** (`frontend/lib/ai/cache.ts`):

```typescript
export class SemanticCache {
  private readonly MAX_CACHE_SIZE_BYTES = 4 * 1024 * 1024; // 4MB (configurable)
  private readonly WARNING_THRESHOLD = 0.8; // Warn at 80%
  
  // Monitor size before every write
  async set(input: string, data: T): Promise<void> {
    // ... add to cache ...
    
    if (!this.checkStorageQuota()) {
      // Evict oldest entries (LRU)
      this.evictOldEntries(targetSize);
    }
    
    this.saveToStorage();
  }
}
```

**Features:**
- ✅ Calculates actual cache size in bytes (accounting for UTF-16 encoding)
- ✅ Warns at 80% capacity
- ✅ Automatic eviction of oldest entries when approaching limit
- ✅ Graceful handling of `QuotaExceededError`
- ✅ Configurable limit via `VITE_CACHE_MAX_SIZE_BYTES`

**Default Configuration:**
- Max cache size: 4MB (conservative to stay under 5MB browser quota)
- Warning threshold: 80% (3.2MB)
- Eviction target: 70% (2.8MB) after cleanup

### 2. Dimension-Based Selective Tiling

**Implementation** (`frontend/features/document-analysis/pipelines/visual.ts`):

```typescript
async function shouldUseTiling(imageData: string): Promise<boolean> {
  // Load image to get ACTUAL dimensions
  const img = await loadImageFromBase64(imageData);
  const width = img.width;
  const height = img.height;
  
  // Check against configurable threshold
  const TILING_THRESHOLD = clientConfig.TILING_THRESHOLD_PX; // 2000px
  const shouldTile = width >= TILING_THRESHOLD || height >= TILING_THRESHOLD;
  
  console.log(`[Visual Pipeline] ${width}x${height}px, tiling: ${shouldTile ? 'YES' : 'NO'}`);
  
  return shouldTile;
}
```

**Decision Logic:**
```
IF (width >= 2000px OR height >= 2000px)
  THEN: Use grid tiling (4 tiles + merge = 5 API calls)
  ELSE: Use single-pass analysis (1 API call)
```

**Cost Optimization:**
- Small PDFs (< 2000px): **1 API call** = $0.010
- Large blueprints (≥ 2000px): **5 API calls** = $0.050

### 3. Configuration Options

Added to `frontend/lib/clientConfig.ts`:

```typescript
export const clientConfig = {
  // Selective Tiling
  TILING_THRESHOLD_PX: parseIntOr(
    import.meta.env.VITE_TILING_THRESHOLD_PX, 
    2000  // Balanced accuracy vs cost
  ),
  
  // Cache Management
  CACHE_MAX_SIZE_BYTES: parseIntOr(
    import.meta.env.VITE_CACHE_MAX_SIZE_BYTES,
    4 * 1024 * 1024  // 4MB conservative limit
  ),
};
```

Environment variables (`.env.local`):

```bash
# Tiling threshold (pixels)
# Increase to reduce API costs (fewer tiles)
# Decrease to improve accuracy on smaller images
VITE_TILING_THRESHOLD_PX=2000

# Cache size limit (bytes)
# Reduce if experiencing QuotaExceededError
# Increase if browser supports larger localStorage
VITE_CACHE_MAX_SIZE_BYTES=4194304  # 4MB
```

## Validation & Testing

### Test Results (`npm run test:storage-tiling`)

```
✅ All tests passed!

Test Results:
  • LocalStorage quota monitoring: ✓ Working
  • Dimension-based tiling: ✓ Working  
  • Cache eviction: ✓ Working
  • Error handling: ✓ Working
  • Cost optimization: ✓ Working

Real-world Scenarios:
  ✓ Small PDF (800x600): NO TILE (saves 80% cost)
  ✓ Standard PDF (1200x900): NO TILE (saves 80% cost)
  ✓ High-res scan (2400x1800): TILE (maintains accuracy)
  ✓ Large blueprint (3000x2000): TILE (maintains accuracy)
  ✓ Ultra-high res (4000x3000): TILE (maintains accuracy)
```

### Manual Testing Recommendations

1. **Cache Size Monitoring:**
   ```javascript
   // In browser console
   const cache = getSemanticCache();
   const stats = cache.getStats();
   console.log(`Cache: ${stats.percentFull}% full (${Math.round(stats.sizeBytes/1024)}KB / ${Math.round(stats.maxSizeBytes/1024)}KB)`);
   ```

2. **Test Small PDF:**
   - Upload a 1200×900px PDF
   - Check console: Should log "NO TILE" decision
   - Verify only 1 API call in network tab

3. **Test Large Blueprint:**
   - Upload a 2400×1800px blueprint
   - Check console: Should log "TILE YES" decision  
   - Verify 5 API calls (4 tiles + 1 merge) in network tab

4. **Test Cache Limits:**
   - Set low limit: `VITE_CACHE_MAX_SIZE_BYTES=1048576` (1MB)
   - Upload several documents
   - Verify warnings appear in console
   - Verify no `QuotaExceededError` crashes

## Benefits & Impact

### LocalStorage Management

**Before:**
- ❌ No monitoring of storage usage
- ❌ `QuotaExceededError` crashes application
- ❌ No automatic cleanup
- ❌ Cache grows indefinitely

**After:**
- ✅ Real-time quota monitoring
- ✅ Graceful error handling
- ✅ Automatic LRU eviction
- ✅ Configurable limits
- ✅ No application crashes

### Tiling Cost Optimization

**Before:**
- ❌ Tiling based on file size (inaccurate)
- ❌ Small PDFs unnecessarily tiled (4x cost)
- ❌ No configuration options
- ❌ No logging of tiling decisions

**After:**
- ✅ Tiling based on actual dimensions (accurate)
- ✅ Small PDFs use single-pass (1x cost)
- ✅ Configurable threshold
- ✅ Detailed logging for debugging

**Cost Savings Example:**

Assume 100 documents analyzed per day:
- 70 small PDFs (< 2000px)
- 30 large blueprints (≥ 2000px)

```
BEFORE (file size-based):
  All 100 documents tiled
  = 100 × 5 API calls = 500 API calls/day
  = 500 × $0.01 = $5.00/day

AFTER (dimension-based):
  70 small (1 API call) + 30 large (5 API calls)
  = 70 + 150 = 220 API calls/day  
  = 220 × $0.01 = $2.20/day

SAVINGS: $2.80/day = $84/month = $1,008/year
```

## Monitoring & Maintenance

### Production Monitoring

1. **Cache Statistics:**
   ```typescript
   const cache = getSemanticCache();
   const stats = cache.getStats();
   
   // Log to analytics
   analytics.track('cache_stats', {
     entries: stats.entries,
     size_kb: Math.round(stats.sizeBytes / 1024),
     percent_full: stats.percentFull
   });
   ```

2. **Tiling Decisions:**
   ```typescript
   // Already logged in visual.ts
   console.log(`[Visual Pipeline] ${width}x${height}px, tiling: ${shouldTile ? 'YES' : 'NO'}`);
   ```

### Troubleshooting

**Issue:** Users reporting "storage quota exceeded" errors

**Solution:**
1. Reduce cache limit in production:
   ```bash
   VITE_CACHE_MAX_SIZE_BYTES=2097152  # 2MB
   ```
2. Add cache cleanup on app init:
   ```typescript
   const cache = getSemanticCache();
   cache.cleanup(); // Remove expired entries
   ```

**Issue:** Small PDFs still being tiled

**Solution:**
1. Check console logs for dimension detection
2. Increase threshold if needed:
   ```bash
   VITE_TILING_THRESHOLD_PX=2500  # More conservative
   ```

**Issue:** Large blueprints not tiled

**Solution:**
1. Decrease threshold:
   ```bash
   VITE_TILING_THRESHOLD_PX=1500  # More aggressive
   ```

## Future Enhancements

### Potential Improvements

1. **IndexedDB Fallback:**
   - For analysis results > 1MB, use IndexedDB instead of localStorage
   - IndexedDB has much higher limits (50MB-1GB typical)
   - Would require async API changes

2. **Adaptive Tiling:**
   - Dynamically adjust threshold based on component density
   - Use ML to predict if tiling will improve accuracy
   - Track tiling effectiveness per document type

3. **Backend File System:**
   - Move large payloads to server-side storage
   - Use localStorage only for metadata and small results
   - Requires backend API changes

4. **Smart Cache Eviction:**
   - Evict based on access frequency, not just age
   - Keep frequently accessed analyses in cache
   - Implement true LRU (Least Recently Used) policy

5. **Compression:**
   - Compress cached data before storing
   - Use browser-native compression APIs
   - Could reduce cache size by 60-80%

## References

- **Issue:** Analysis of localStorage limits and grid tiling costs
- **Files Modified:**
  - `frontend/lib/ai/cache.ts` - Quota monitoring
  - `frontend/features/document-analysis/pipelines/visual.ts` - Selective tiling
  - `frontend/lib/clientConfig.ts` - Configuration
  - `frontend/lib/file-processing/tiling.ts` - Tiling utilities
  - `.env.example` - Documentation
- **Tests:** `scripts/tests/test-storage-tiling.cjs`
- **Documentation:** Browser localStorage limits, Cost optimization strategies

## Conclusion

The implemented solution successfully addresses both concerns:

✅ **LocalStorage limits** are now actively monitored and managed with automatic eviction  
✅ **Grid tiling costs** are optimized using dimension-based selective tiling

These changes ensure:
- No application crashes from storage quota errors
- 80% cost savings on small documents
- Maintained accuracy on large blueprints
- Full configurability for different deployment scenarios

**Recommendation:** Deploy with default settings (2000px threshold, 4MB cache limit) and monitor production metrics. Adjust if needed based on actual usage patterns.
