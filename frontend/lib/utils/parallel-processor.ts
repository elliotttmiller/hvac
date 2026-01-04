/**
 * Advanced Parallel Processing Utilities
 * Optimizes batch operations with concurrency control and progress tracking
 * Addresses performance issues observed in production (143s processing time)
 */

export interface BatchProcessingOptions {
  maxConcurrency?: number;
  retryAttempts?: number;
  retryDelay?: number;
  onProgress?: (completed: number, total: number, result?: any) => void;
  onError?: (error: Error, item: any, attempt: number) => void;
  timeout?: number;
}

export interface ProcessingResult<T, R> {
  success: R[];
  failures: Array<{ item: T; error: Error; attempts: number }>;
  duration: number;
  stats: {
    total: number;
    succeeded: number;
    failed: number;
    avgTime: number;
  };
}

/**
 * Process items in parallel with concurrency control
 */
export async function processBatch<T, R>(
  items: T[],
  processor: (item: T, index: number) => Promise<R>,
  options: BatchProcessingOptions = {}
): Promise<ProcessingResult<T, R>> {
  const {
    maxConcurrency = 4,
    retryAttempts = 2,
    retryDelay = 1000,
    onProgress,
    onError,
    timeout = 60000
  } = options;
  
  const startTime = Date.now();
  const success: R[] = [];
  const failures: Array<{ item: T; error: Error; attempts: number }> = [];
  const timings: number[] = [];
  
  let completed = 0;
  
  // Process items in batches with concurrency control
  for (let i = 0; i < items.length; i += maxConcurrency) {
    const batch = items.slice(i, Math.min(i + maxConcurrency, items.length));
    const batchPromises = batch.map(async (item, batchIndex) => {
      const itemIndex = i + batchIndex;
      const itemStartTime = Date.now();
      
      for (let attempt = 0; attempt <= retryAttempts; attempt++) {
        try {
          // Add timeout wrapper
          const result = await Promise.race([
            processor(item, itemIndex),
            new Promise<never>((_, reject) =>
              setTimeout(() => reject(new Error('Processing timeout')), timeout)
            )
          ]);
          
          const itemDuration = Date.now() - itemStartTime;
          timings.push(itemDuration);
          success.push(result);
          completed++;
          
          if (onProgress) {
            onProgress(completed, items.length, result);
          }
          
          return { success: true, result };
        } catch (error) {
          const err = error instanceof Error ? error : new Error(String(error));
          
          if (attempt < retryAttempts) {
            // Retry with exponential backoff
            const delay = retryDelay * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
            
            if (onError) {
              onError(err, item, attempt + 1);
            }
          } else {
            // Final failure
            failures.push({ item, error: err, attempts: attempt + 1 });
            completed++;
            
            if (onProgress) {
              onProgress(completed, items.length);
            }
            
            if (onError) {
              onError(err, item, attempt + 1);
            }
            
            return { success: false, error: err };
          }
        }
      }
    });
    
    await Promise.all(batchPromises);
  }
  
  const duration = Date.now() - startTime;
  const avgTime = timings.length > 0 ? timings.reduce((a, b) => a + b, 0) / timings.length : 0;
  
  return {
    success,
    failures,
    duration,
    stats: {
      total: items.length,
      succeeded: success.length,
      failed: failures.length,
      avgTime
    }
  };
}

/**
 * Optimized parallel map with automatic concurrency detection
 */
export async function parallelMap<T, R>(
  items: T[],
  mapper: (item: T, index: number) => Promise<R>,
  maxConcurrency?: number
): Promise<R[]> {
  // Auto-detect optimal concurrency based on array size
  const optimalConcurrency = maxConcurrency || Math.min(
    navigator.hardwareConcurrency || 4,
    Math.max(2, Math.ceil(items.length / 10))
  );
  
  const result = await processBatch(items, mapper, {
    maxConcurrency: optimalConcurrency
  });
  
  if (result.failures.length > 0) {
    console.warn(`${result.failures.length} items failed in parallel map`);
  }
  
  return result.success;
}

/**
 * Process with priority queue (high priority items first)
 */
export async function processPriority<T, R>(
  items: Array<{ item: T; priority: number }>,
  processor: (item: T) => Promise<R>,
  options: BatchProcessingOptions = {}
): Promise<ProcessingResult<T, R>> {
  // Sort by priority (higher first)
  const sorted = [...items].sort((a, b) => b.priority - a.priority);
  const plainItems = sorted.map(({ item }) => item);
  
  return processBatch(plainItems, processor, options);
}

/**
 * Chunked processing for memory-intensive operations
 */
export async function processChunked<T, R>(
  items: T[],
  chunkSize: number,
  processor: (chunk: T[]) => Promise<R[]>,
  options: Omit<BatchProcessingOptions, 'maxConcurrency'> = {}
): Promise<ProcessingResult<T[], R>> {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }
  
  const results: R[] = [];
  const failures: Array<{ item: T[]; error: Error; attempts: number }> = [];
  const startTime = Date.now();
  let completed = 0;
  
  for (const chunk of chunks) {
    try {
      const chunkResults = await processor(chunk);
      results.push(...chunkResults);
      completed++;
      
      if (options.onProgress) {
        options.onProgress(completed, chunks.length, chunkResults);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      failures.push({ item: chunk, error: err, attempts: 1 });
      
      if (options.onError) {
        options.onError(err, chunk, 1);
      }
    }
  }
  
  const duration = Date.now() - startTime;
  
  return {
    success: results,
    failures,
    duration,
    stats: {
      total: chunks.length,
      succeeded: chunks.length - failures.length,
      failed: failures.length,
      avgTime: duration / chunks.length
    }
  };
}

/**
 * Throttled processing to avoid rate limits
 */
export async function processThrottled<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  delayMs: number,
  options: Omit<BatchProcessingOptions, 'maxConcurrency'> = {}
): Promise<ProcessingResult<T, R>> {
  const results: R[] = [];
  const failures: Array<{ item: T; error: Error; attempts: number }> = [];
  const startTime = Date.now();
  
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    
    try {
      const result = await processor(item);
      results.push(result);
      
      if (options.onProgress) {
        options.onProgress(i + 1, items.length, result);
      }
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      failures.push({ item, error: err, attempts: 1 });
      
      if (options.onError) {
        options.onError(err, item, 1);
      }
    }
    
    // Delay between items (except last)
    if (i < items.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  const duration = Date.now() - startTime;
  
  return {
    success: results,
    failures,
    duration,
    stats: {
      total: items.length,
      succeeded: results.length,
      failed: failures.length,
      avgTime: duration / items.length
    }
  };
}

/**
 * Smart batch processor that auto-selects strategy based on item count and characteristics
 */
export async function smartBatch<T, R>(
  items: T[],
  processor: (item: T) => Promise<R>,
  options: BatchProcessingOptions & {
    estimatedItemTimeMs?: number;
    rateLimitPerMinute?: number;
  } = {}
): Promise<ProcessingResult<T, R>> {
  const {
    estimatedItemTimeMs = 1000,
    rateLimitPerMinute = 60,
    ...batchOptions
  } = options;
  
  // Small batch: process sequentially
  if (items.length <= 3) {
    return processBatch(items, processor, { ...batchOptions, maxConcurrency: 1 });
  }
  
  // Check if rate limiting is needed
  const itemsPerMinute = items.length / (estimatedItemTimeMs * items.length / 60000);
  if (itemsPerMinute > rateLimitPerMinute) {
    // Use throttled processing
    const delayMs = Math.ceil(60000 / rateLimitPerMinute);
    console.log(`Rate limiting enabled: ${delayMs}ms delay between items`);
    return processThrottled(items, processor, delayMs, batchOptions);
  }
  
  // Large batch: use parallel processing
  return processBatch(items, processor, batchOptions);
}

/**
 * Progress tracker utility
 */
export class ProgressTracker {
  private completed = 0;
  private total: number;
  private startTime: number;
  private lastUpdate: number = 0;
  private updateInterval: number;
  
  constructor(total: number, updateIntervalMs: number = 100) {
    this.total = total;
    this.startTime = Date.now();
    this.updateInterval = updateIntervalMs;
  }
  
  increment(count: number = 1): void {
    this.completed += count;
    
    const now = Date.now();
    if (now - this.lastUpdate >= this.updateInterval) {
      this.report();
      this.lastUpdate = now;
    }
  }
  
  report(): void {
    const elapsed = Date.now() - this.startTime;
    const rate = this.completed / (elapsed / 1000);
    const remaining = this.total - this.completed;
    const eta = remaining / rate;
    
    console.log(
      `Progress: ${this.completed}/${this.total} (${Math.round(this.completed / this.total * 100)}%) ` +
      `Rate: ${rate.toFixed(2)}/s ETA: ${Math.round(eta)}s`
    );
  }
  
  finish(): void {
    const duration = Date.now() - this.startTime;
    console.log(
      `Completed: ${this.completed}/${this.total} in ${(duration / 1000).toFixed(2)}s ` +
      `(avg: ${(duration / this.completed).toFixed(2)}ms/item)`
    );
  }
}
