/**
 * Universal Uploader Component
 * Handles PDF, Image, and DWG file uploads with automatic conversion
 */

import React, { useState, useRef } from 'react';
import { convertFileForGemini, ConversionResult } from '../../../lib/file-processing/converters';
import { analyzeDocument } from '../orchestrator';
import { UniversalDocumentResult } from '../types';
import { ProcessingOverlay, ProcessingPhase } from '../../../ui/feedback/ProcessingOverlay';

export interface UniversalUploaderProps {
  onAnalysisComplete?: (result: UniversalDocumentResult) => void;
  onError?: (error: string) => void;
  acceptedFormats?: string[];
  maxFileSizeMB?: number;
}

/**
 * Universal Document Uploader
 * Accepts PDF/IMG/DWG and routes to appropriate pipeline
 */
export const UniversalUploader: React.FC<UniversalUploaderProps> = ({
  onAnalysisComplete,
  onError,
  acceptedFormats = ['pdf', 'png', 'jpg', 'jpeg', 'dwg'],
  maxFileSizeMB = 10,
}) => {
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [processingPhase, setProcessingPhase] = useState<ProcessingPhase>('uploading');
  const [processingProgress, setProcessingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (file: File) => {
    // Validate file type
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!extension || !acceptedFormats.includes(extension)) {
      onError?.(`Unsupported file type: ${extension}. Accepted: ${acceptedFormats.join(', ')}`);
      return;
    }
    
    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSizeMB) {
      onError?.(`File too large: ${fileSizeMB.toFixed(2)}MB. Max: ${maxFileSizeMB}MB`);
      return;
    }
    
    try {
      setUploading(true);
      setProcessingPhase('uploading');
      setProcessingProgress(10);
      setProgress('Converting file...');
      
      // Convert file to format suitable for analysis
      setProcessingProgress(30);
      const conversion: ConversionResult = await convertFileForGemini(file);
      
      if (!conversion.success || !conversion.data) {
        throw new Error(conversion.error || 'File conversion failed');
      }
      
      setUploading(false);
      setAnalyzing(true);
      setProcessingPhase('classifying');
      setProcessingProgress(40);
      setProgress('Analyzing document...');
      
      // Simulate phase transitions for better UX
      setTimeout(() => {
        setProcessingPhase('analyzing');
        setProcessingProgress(60);
      }, 500);
      
      setTimeout(() => {
        setProcessingPhase('refining');
        setProcessingProgress(80);
      }, 1000);
      
      // Analyze the document
      const result = await analyzeDocument(conversion.data, {
        fileName: file.name,
      });
      
      setProcessingProgress(100);
      setProcessingPhase('complete');
      
      // Brief pause to show completion
      setTimeout(() => {
        setAnalyzing(false);
        setProgress('');
        onAnalysisComplete?.(result);
      }, 500);
    } catch (error) {
      setUploading(false);
      setAnalyzing(false);
      setProgress('');
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(errorMessage);
    }
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    
    // Ensure typing for dropped files
    const files = Array.from(e.dataTransfer.files) as File[];
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };
  
  const handleClick = () => {
    fileInputRef.current?.click();
  };
  
  const isProcessing = uploading || analyzing;
  
  return (
    <>
      <ProcessingOverlay
        isOpen={isProcessing}
        phase={processingPhase}
        progress={processingProgress}
        message={progress}
      />
      
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={!isProcessing ? handleClick : undefined}
        style={{
          border: `2px dashed ${dragActive ? '#2196F3' : '#ccc'}`,
          borderRadius: '8px',
          padding: '40px',
          textAlign: 'center',
          cursor: isProcessing ? 'not-allowed' : 'pointer',
          backgroundColor: dragActive ? '#f0f7ff' : '#fafafa',
          transition: 'all 0.3s ease',
        }}
      >
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFormats.map(f => `.${f}`).join(',')}
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
        disabled={isProcessing}
      />
      
      {!isProcessing && (
        <>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📄</div>
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
            Upload Document
          </h3>
          <p style={{ margin: '0 0 16px 0', color: '#666' }}>
            Drag and drop or click to select
          </p>
          <p style={{ margin: 0, fontSize: '14px', color: '#999' }}>
            Supported: {acceptedFormats.join(', ').toUpperCase()} • Max {maxFileSizeMB}MB
          </p>
        </>
      )}
      
      {isProcessing && (
        <>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {uploading ? '⏳' : '🔍'}
          </div>
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
            {uploading ? 'Converting...' : 'Analyzing...'}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>
            {progress}
          </p>
          <div style={{ marginTop: '16px' }}>
            <LoadingSpinner />
          </div>
        </>
      )}
    </div>
    </>
  );
};

/**
 * Simple loading spinner
 */
const LoadingSpinner: React.FC = () => {
  return (
    <div
      style={{
        display: 'inline-block',
        width: '32px',
        height: '32px',
        border: '3px solid #f3f3f3',
        borderTop: '3px solid #2196F3',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
      }}
    >
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default UniversalUploader;
