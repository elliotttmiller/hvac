/**
 * Background Analysis Worker
 * Handles asynchronous final analysis generation after Stage 1 completes
 */

import { UniversalDocumentResult } from '@/features/document-analysis/types';
import { generateFinalAnalysis } from '../gemini-prompt-engine/final-analysis';

export interface BackgroundAnalysisJob {
  jobId: string;
  documentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  result?: any;
  error?: string;
  startTime: number;
  endTime?: number;
}

// In-memory job store (could be replaced with Redis/DB in production)
const jobStore = new Map<string, BackgroundAnalysisJob>();

let jobIdCounter = 0;
const generateJobId = () => `analysis-job-${++jobIdCounter}-${Date.now()}`;

/**
 * Queue a background analysis job
 */
export const queueFinalAnalysis = async (
  documentResult: UniversalDocumentResult,
  onProgress?: (status: string) => void,
  onComplete?: (report: any) => void,
  onError?: (error: Error) => void
): Promise<string> => {
  const jobId = generateJobId();
  
  const job: BackgroundAnalysisJob = {
    jobId,
    documentId: documentResult.document_id,
    status: 'pending',
    startTime: Date.now(),
  };
  
  jobStore.set(jobId, job);
  // Browser runtime: forward job to server API and listen for updates via socket
  if (typeof window !== 'undefined') {
    try {
      onProgress?.('Queuing background analysis on server...');

      const resp = await fetch('/api/analysis/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ documentResult })
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`Server rejected job: ${resp.status} ${text}`);
      }

      const data = await resp.json();
      const serverJobId = data.jobId || jobId;
      job.jobId = serverJobId;
      jobStore.set(serverJobId, job);

      // Subscribe for server socket updates if socket.io-client available
      try {
        const { io } = await import('socket.io-client');
        const socket = io();
        socket.on('connect', () => {
          // Optionally tell server which job we care about
          socket.emit('subscribe-analysis-job', serverJobId);
        });

        const handler = (update: any) => {
          if (!update || update.jobId !== serverJobId) return;
          jobStore.set(serverJobId, update);
          if (update.status === 'running') onProgress?.('Background analysis running');
          if (update.status === 'completed') {
            onProgress?.('Final analysis complete');
            onComplete?.(update.result);
            socket.disconnect();
          }
          if (update.status === 'failed') {
            onError?.(new Error(update.error || 'Background analysis failed'));
            socket.disconnect();
          }
        };

        socket.on('analysis-job-update', handler);
      } catch (e) {
        // Socket not available - fall back to no real-time updates
        console.warn('Socket subscription unavailable:', e);
      }

      return serverJobId;
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  }

  // Server/runtime path: run analysis locally (non-blocking)
  (async () => {
    try {
      // Update job status
      job.status = 'running';
      jobStore.set(jobId, job);
      onProgress?.('Background analysis started...');

      console.log(`[Background Worker] Starting final analysis for job ${jobId}`);
      const finalAnalysisReport = await generateFinalAnalysis(documentResult);

      // Update job with result
      job.status = 'completed';
      job.result = finalAnalysisReport;
      job.endTime = Date.now();
      jobStore.set(jobId, job);

      console.log(`[Background Worker] Completed job ${jobId} in ${job.endTime - job.startTime}ms`);
      onProgress?.('Final analysis complete');
      onComplete?.(finalAnalysisReport);
    } catch (error) {
      console.error(`[Background Worker] Failed job ${jobId}:`, error);
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : String(error);
      job.endTime = Date.now();
      jobStore.set(jobId, job);
      onError?.(error instanceof Error ? error : new Error(String(error)));
    }
  })();

  return jobId;
};

/**
 * Get job status
 */
export const getJobStatus = (jobId: string): BackgroundAnalysisJob | null => {
  return jobStore.get(jobId) || null;
};

/**
 * Cancel a job (if still pending/running)
 */
export const cancelJob = (jobId: string): boolean => {
  const job = jobStore.get(jobId);
  if (!job || job.status === 'completed' || job.status === 'failed') {
    return false;
  }
  
  job.status = 'failed';
  job.error = 'Cancelled by user';
  job.endTime = Date.now();
  jobStore.set(jobId, job);
  
  return true;
};

/**
 * Clean up old completed jobs (garbage collection)
 */
export const cleanupOldJobs = (maxAgeMs: number = 3600000): void => {
  const now = Date.now();
  const toDelete: string[] = [];
  
  jobStore.forEach((job, jobId) => {
    if (job.endTime && (now - job.endTime) > maxAgeMs) {
      toDelete.push(jobId);
    }
  });
  
  toDelete.forEach(jobId => jobStore.delete(jobId));
  
  if (toDelete.length > 0) {
    console.log(`[Background Worker] Cleaned up ${toDelete.length} old jobs`);
  }
};

// Auto-cleanup every 10 minutes
if (typeof window === 'undefined') {
  // Only run on server
  setInterval(() => cleanupOldJobs(), 600000);
}
