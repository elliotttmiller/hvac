import { RayServeResponse } from '../types';

/**
 * Calls the Ray Serve backend defined in inference_graph.py
 * Endpoint: POST /api/hvac/analyze
 */
export const analyzeWithRayBackend = async (file: File): Promise<RayServeResponse> => {
  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('/api/hvac/analyze', {
      method: 'POST',
      body: formData,
      // Note: Do not set Content-Type header manually when using FormData, 
      // the browser will set it with the correct boundary.
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend Error (${response.status}): ${errorText}`);
    }

    const data: RayServeResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Ray Serve Connection Failed:", error);
    throw error;
  }
};
