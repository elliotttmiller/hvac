/**
 * Background Analysis Worker
 * Handles asynchronous final analysis generation after Stage 1 completes
 * 
 * ARCHITECTURE NOTE: This module runs in the browser and forwards all
 * AI operations to the server via HTTP API. It does NOT perform AI
 * inference directly in the browser.
 */

import { UniversalDocumentResult } from '@/features/document-analysis/types';

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
  
  // ARCHITECTURE: All AI operations are forwarded to the server
  // This ensures proper environment isolation and prevents Node.js
  // dependencies from being bundled into the browser.
  // 
  // PERFORMANCE FIX: Wrap in setTimeout to ensure this doesn't block the UI response
  setTimeout(async () => {
    try {
      onProgress?.('Queuing background analysis on server...');

      const resp = await fetch('/api/analysis/queue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          documentResult,
          projectId: 'default' // TODO: Make this configurable per project
        })
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
  } catch (err) {
    const error = err instanceof Error ? err : new Error(String(err));
    job.status = 'failed';
    job.error = error.message;
    job.endTime = Date.now();
    jobStore.set(jobId, job);
    onError?.(error);
  }
  }, 0); // End of setTimeout - runs asynchronously to avoid blocking UI

  // Return jobId immediately to not block UI
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
setInterval(() => cleanupOldJobs(), 600000);
