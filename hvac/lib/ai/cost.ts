/**
 * Cost Tracking - Token Usage Monitoring
 * Tracks API usage and costs across providers
 */

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  estimatedCost: number; // in USD
}

export interface CostEntry {
  timestamp: number;
  provider: string;
  model: string;
  operation: string; // 'text', 'vision', 'embedding', etc.
  usage: TokenUsage;
}

export interface CostSummary {
  totalCalls: number;
  totalTokens: number;
  totalCost: number;
  byProvider: Record<string, {
    calls: number;
    tokens: number;
    cost: number;
  }>;
  byOperation: Record<string, {
    calls: number;
    tokens: number;
    cost: number;
  }>;
  recentEntries: CostEntry[];
}

/**
 * Cost per 1M tokens for various models (as of 2024)
 * These are approximate rates and should be updated regularly
 */
const MODEL_COSTS: Record<string, { input: number; output: number }> = {
  // Gemini models
  'gemini-2.5-flash': { input: 0.075, output: 0.30 },  // per 1M tokens (128K context)
  'gemini-2.0-flash': { input: 0.075, output: 0.30 },
  'gemini-1.5-flash': { input: 0.075, output: 0.30 },
  'gemini-1.5-pro': { input: 1.25, output: 5.0 },
  
  // OpenAI models (for future support)
  'gpt-4-turbo': { input: 10.0, output: 30.0 },
  'gpt-4o': { input: 2.5, output: 10.0 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-3.5-turbo': { input: 0.50, output: 1.50 },
  
  // Anthropic models (for future support)
  'claude-3-opus': { input: 15.0, output: 75.0 },
  'claude-3-sonnet': { input: 3.0, output: 15.0 },
  'claude-3-haiku': { input: 0.25, output: 1.25 },
};

/**
 * Cost Tracker class
 */
class CostTracker {
  private entries: CostEntry[] = [];
  private maxEntries: number = 1000; // Keep last 1000 entries in memory
  
  /**
   * Track a new API call
   */
  track(
    provider: string,
    model: string,
    operation: string,
    promptTokens: number,
    completionTokens: number
  ): CostEntry {
    const totalTokens = promptTokens + completionTokens;
    const estimatedCost = this.calculateCost(model, promptTokens, completionTokens);
    
    const entry: CostEntry = {
      timestamp: Date.now(),
      provider,
      model,
      operation,
      usage: {
        promptTokens,
        completionTokens,
        totalTokens,
        estimatedCost,
      },
    };
    
    this.entries.push(entry);
    
    // Limit memory usage
    if (this.entries.length > this.maxEntries) {
      this.entries = this.entries.slice(-this.maxEntries);
    }
    
    return entry;
  }
  
  /**
   * Calculate cost for a model
   */
  private calculateCost(
    model: string,
    promptTokens: number,
    completionTokens: number
  ): number {
    const costs = MODEL_COSTS[model] || MODEL_COSTS['gemini-2.5-flash'];
    
    const promptCost = (promptTokens / 1_000_000) * costs.input;
    const completionCost = (completionTokens / 1_000_000) * costs.output;
    
    return promptCost + completionCost;
  }
  
  /**
   * Get cost summary
   */
  getSummary(since?: number): CostSummary {
    const filteredEntries = since
      ? this.entries.filter(e => e.timestamp >= since)
      : this.entries;
    
    const byProvider: Record<string, { calls: number; tokens: number; cost: number }> = {};
    const byOperation: Record<string, { calls: number; tokens: number; cost: number }> = {};
    
    let totalCalls = 0;
    let totalTokens = 0;
    let totalCost = 0;
    
    for (const entry of filteredEntries) {
      totalCalls++;
      totalTokens += entry.usage.totalTokens;
      totalCost += entry.usage.estimatedCost;
      
      // By provider
      if (!byProvider[entry.provider]) {
        byProvider[entry.provider] = { calls: 0, tokens: 0, cost: 0 };
      }
      byProvider[entry.provider].calls++;
      byProvider[entry.provider].tokens += entry.usage.totalTokens;
      byProvider[entry.provider].cost += entry.usage.estimatedCost;
      
      // By operation
      if (!byOperation[entry.operation]) {
        byOperation[entry.operation] = { calls: 0, tokens: 0, cost: 0 };
      }
      byOperation[entry.operation].calls++;
      byOperation[entry.operation].tokens += entry.usage.totalTokens;
      byOperation[entry.operation].cost += entry.usage.estimatedCost;
    }
    
    return {
      totalCalls,
      totalTokens,
      totalCost,
      byProvider,
      byOperation,
      recentEntries: filteredEntries.slice(-10), // Last 10 entries
    };
  }
  
  /**
   * Get entries within a time range
   */
  getEntries(startTime?: number, endTime?: number): CostEntry[] {
    return this.entries.filter(e => {
      if (startTime && e.timestamp < startTime) return false;
      if (endTime && e.timestamp > endTime) return false;
      return true;
    });
  }
  
  /**
   * Clear all entries
   */
  clear(): void {
    this.entries = [];
  }
  
  /**
   * Export entries to JSON
   */
  export(): string {
    return JSON.stringify(this.entries, null, 2);
  }
  
  /**
   * Import entries from JSON
   */
  import(json: string): void {
    try {
      const entries = JSON.parse(json) as CostEntry[];
      this.entries = entries;
    } catch (error) {
      console.error('Failed to import cost entries:', error);
    }
  }
}

// Singleton instance
let trackerInstance: CostTracker | null = null;

/**
 * Get the cost tracker instance
 */
export function getCostTracker(): CostTracker {
  if (!trackerInstance) {
    trackerInstance = new CostTracker();
  }
  return trackerInstance;
}

/**
 * Helper: Track a text generation call
 */
export function trackTextGeneration(
  provider: string,
  model: string,
  promptTokens: number,
  completionTokens: number
): CostEntry {
  return getCostTracker().track(provider, model, 'text', promptTokens, completionTokens);
}

/**
 * Helper: Track a vision generation call
 */
export function trackVisionGeneration(
  provider: string,
  model: string,
  promptTokens: number,
  completionTokens: number
): CostEntry {
  return getCostTracker().track(provider, model, 'vision', promptTokens, completionTokens);
}

/**
 * Helper: Estimate tokens in text (rough approximation)
 * ~4 characters per token for English text
 */
export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Helper: Estimate tokens in image
 * Gemini Flash: ~258 tokens per image (typical)
 */
export function estimateImageTokens(): number {
  return 258;
}

/**
 * Format cost as USD string
 */
export function formatCost(cost: number): string {
  return `$${cost.toFixed(4)}`;
}

/**
 * Format token count with commas
 */
export function formatTokens(tokens: number): string {
  return tokens.toLocaleString();
}

/**
 * Get cost summary for display
 */
export function getCostSummaryText(summary: CostSummary): string {
  const lines = [
    `Total Calls: ${summary.totalCalls}`,
    `Total Tokens: ${formatTokens(summary.totalTokens)}`,
    `Total Cost: ${formatCost(summary.totalCost)}`,
  ];
  
  if (Object.keys(summary.byProvider).length > 0) {
    lines.push('\nBy Provider:');
    for (const [provider, stats] of Object.entries(summary.byProvider)) {
      lines.push(`  ${provider}: ${stats.calls} calls, ${formatCost(stats.cost)}`);
    }
  }
  
  if (Object.keys(summary.byOperation).length > 0) {
    lines.push('\nBy Operation:');
    for (const [operation, stats] of Object.entries(summary.byOperation)) {
      lines.push(`  ${operation}: ${stats.calls} calls, ${formatCost(stats.cost)}`);
    }
  }
  
  return lines.join('\n');
}
