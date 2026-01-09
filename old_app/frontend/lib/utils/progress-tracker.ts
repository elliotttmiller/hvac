/**
 * Real-time Progress Tracking System
 * Provides granular progress updates during analysis pipeline execution
 */

export type ProgressStage =
  | 'uploading'
  | 'classifying'
  | 'tiling'
  | 'analyzing_tiles'
  | 'merging'
  | 'refining'
  | 'enhancing'
  | 'validating'
  | 'complete'
  | 'error';

export interface ProgressUpdate {
  stage: ProgressStage;
  progress: number; // 0-100
  message: string;
  details?: {
    current?: number;
    total?: number;
    rate?: number;
    eta?: number;
    substage?: string;
  };
  timestamp: number;
}

export interface ProgressMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
  stages: Array<{
    stage: ProgressStage;
    startTime: number;
    endTime?: number;
    duration?: number;
  }>;
}

export type ProgressCallback = (update: ProgressUpdate) => void;

/**
 * Progress tracker for pipeline execution
 */
export class PipelineProgressTracker {
  private callbacks: Set<ProgressCallback> = new Set();
  private currentStage: ProgressStage = 'uploading';
  private metrics: ProgressMetrics;
  private stageStartTime: number;
  
  constructor() {
    this.metrics = {
      startTime: Date.now(),
      stages: []
    };
    this.stageStartTime = Date.now();
  }
  
  /**
   * Subscribe to progress updates
   */
  subscribe(callback: ProgressCallback): () => void {
    this.callbacks.add(callback);
    return () => this.callbacks.delete(callback);
  }
  
  /**
   * Update current stage
   */
  setStage(stage: ProgressStage, message: string = ''): void {
    // Complete previous stage
    if (this.metrics.stages.length > 0) {
      const lastStage = this.metrics.stages[this.metrics.stages.length - 1];
      if (!lastStage.endTime) {
        lastStage.endTime = Date.now();
        lastStage.duration = lastStage.endTime - lastStage.startTime;
      }
    }
    
    // Start new stage
    this.currentStage = stage;
    this.stageStartTime = Date.now();
    this.metrics.stages.push({
      stage,
      startTime: this.stageStartTime
    });
    
    this.emit({
      stage,
      progress: this.getStageProgress(stage),
      message: message || this.getDefaultMessage(stage),
      timestamp: Date.now()
    });
  }
  
  /**
   * Update progress within current stage
   */
  updateProgress(progress: number, details?: ProgressUpdate['details']): void {
    this.emit({
      stage: this.currentStage,
      progress: Math.min(100, Math.max(0, progress)),
      message: this.getDefaultMessage(this.currentStage),
      details,
      timestamp: Date.now()
    });
  }
  
  /**
   * Update with custom message
   */
  update(message: string, progress?: number, details?: ProgressUpdate['details']): void {
    this.emit({
      stage: this.currentStage,
      progress: progress ?? this.getStageProgress(this.currentStage),
      message,
      details,
      timestamp: Date.now()
    });
  }
  
  /**
   * Mark as complete
   */
  complete(): void {
    this.metrics.endTime = Date.now();
    this.metrics.duration = this.metrics.endTime - this.metrics.startTime;
    
    // Complete last stage
    if (this.metrics.stages.length > 0) {
      const lastStage = this.metrics.stages[this.metrics.stages.length - 1];
      if (!lastStage.endTime) {
        lastStage.endTime = Date.now();
        lastStage.duration = lastStage.endTime - lastStage.startTime;
      }
    }
    
    this.setStage('complete', 'Analysis complete');
  }
  
  /**
   * Mark as error
   */
  error(message: string): void {
    this.setStage('error', message);
  }
  
  /**
   * Get metrics
   */
  getMetrics(): ProgressMetrics {
    return { ...this.metrics };
  }
  
  /**
   * Emit progress update to all subscribers
   */
  private emit(update: ProgressUpdate): void {
    this.callbacks.forEach(callback => {
      try {
        callback(update);
      } catch (error) {
        console.error('Error in progress callback:', error);
      }
    });
  }
  
  /**
   * Get default message for stage
   */
  private getDefaultMessage(stage: ProgressStage): string {
    const messages: Record<ProgressStage, string> = {
      uploading: 'Uploading document...',
      classifying: 'Classifying document type...',
      tiling: 'Creating image tiles for analysis...',
      analyzing_tiles: 'Analyzing tiles in parallel...',
      merging: 'Merging tile results...',
      refining: 'Refining with full image context...',
      enhancing: 'Applying enhancements...',
      validating: 'Validating results...',
      complete: 'Analysis complete',
      error: 'Analysis failed'
    };
    return messages[stage] || 'Processing...';
  }
  
  /**
   * Get baseline progress for stage
   */
  private getStageProgress(stage: ProgressStage): number {
    const stageProgress: Record<ProgressStage, number> = {
      uploading: 5,
      classifying: 15,
      tiling: 20,
      analyzing_tiles: 50,
      merging: 70,
      refining: 80,
      enhancing: 90,
      validating: 95,
      complete: 100,
      error: 0
    };
    return stageProgress[stage] || 0;
  }
}

/**
 * Create a progress tracker instance
 */
export function createProgressTracker(): PipelineProgressTracker {
  return new PipelineProgressTracker();
}

/**
 * Format duration in human-readable format
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

/**
 * Calculate ETA based on current progress
 * Returns estimated time remaining in milliseconds, or 0 for completed/invalid states
 */
export function calculateETA(
  startTime: number,
  currentProgress: number
): number {
  if (currentProgress <= 0) return 0; // Not started yet
  if (currentProgress >= 100) return 0; // Already complete
  
  const elapsed = Date.now() - startTime;
  const rate = currentProgress / elapsed;
  const remaining = 100 - currentProgress;
  return remaining / rate;
}

/**
 * Format ETA in human-readable format
 */
export function formatETA(eta: number): string {
  if (eta <= 0) return 'Complete';
  return `~${formatDuration(eta)} remaining`;
}

/**
 * Progress aggregator for multiple parallel tasks
 */
export class ParallelProgressAggregator {
  private tasks: Map<string, number> = new Map();
  private callback: ((progress: number, completed: number, total: number) => void) | null = null;
  
  constructor(taskIds: string[], callback?: (progress: number, completed: number, total: number) => void) {
    taskIds.forEach(id => this.tasks.set(id, 0));
    this.callback = callback || null;
  }
  
  /**
   * Update progress for a specific task
   */
  updateTask(taskId: string, progress: number): void {
    if (!this.tasks.has(taskId)) {
      console.warn(`Unknown task ID: ${taskId}`);
      return;
    }
    
    this.tasks.set(taskId, Math.min(100, Math.max(0, progress)));
    this.notifyProgress();
  }
  
  /**
   * Mark task as complete
   */
  completeTask(taskId: string): void {
    this.updateTask(taskId, 100);
  }
  
  /**
   * Get overall progress
   */
  getProgress(): number {
    if (this.tasks.size === 0) return 0;
    const total = Array.from(this.tasks.values()).reduce((sum, p) => sum + p, 0);
    return total / this.tasks.size;
  }
  
  /**
   * Get number of completed tasks
   */
  getCompletedCount(): number {
    return Array.from(this.tasks.values()).filter(p => p >= 100).length;
  }
  
  /**
   * Check if all tasks are complete
   */
  isComplete(): boolean {
    return this.getCompletedCount() === this.tasks.size;
  }
  
  /**
   * Notify progress change
   */
  private notifyProgress(): void {
    if (this.callback) {
      const progress = this.getProgress();
      const completed = this.getCompletedCount();
      const total = this.tasks.size;
      this.callback(progress, completed, total);
    }
  }
}
