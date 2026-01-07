[INFO] ======================================================================
[INFO] HVAC AI Platform - Startup Script v2.0
[INFO] ======================================================================
[INFO] Started: 2026-01-07 20:46:20 UTC
[INFO] Working Directory: C:\Users\Elliott\hvac
[INFO] Log File: C:\Users\Elliott\hvac\logs\start.log
[INFO]
[INFO] Skipping pre-flight validations (startup summary mode)
[INFO] Full verbose logs are still written to the rotating log file
[INFO]
[INFO] Found local API server entry, starting backend + frontend dev servers
[INFO] Passthrough mode: ENABLED
[INFO] Starting development and API servers...
[INFO] Frontend development server started.
[INFO] Backend API server started.
⠹
> hvac-ai-platform@0.0.0 dev
> vite


> hvac-ai-platform@0.0.0 dev:api
> node server/index.cjs

[dotenv@17.2.3] injecting env (32) from .env -- tip: 🔑 add access controls to secrets: https://dotenvx.com/ops
✅ AI Proxy Initialized. Model: gemini-2.5-flash

Server running at http://localhost:4000
Data Root: C:\Users\Elliott\hvac\server\data
AI Provider: gemini (Active)
Mock Mode: DISABLED (live AI inference)

  VITE v6.4.1  ready in 2377 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.0.193:3000/
  ➜  press h + enter to show help
2:48:30 PM [vite] (client) hmr update /features/blueprint-viewer/InteractiveViewer.tsx
2:49:00 PM [vite] (client) hmr update /features/blueprint-viewer/InteractiveViewer.tsx (x2)
AI Vision Request -> model=gemini-2.5-flash imageSize=112496 mimeType=image/png responseMimeType=unset
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision attempt 1 failed: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.
AI Vision attempt 2 failed: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.
AI Vision Error: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.  
Full error details: GoogleGenerativeAIFetchError: [GoogleGenerativeAI Error]: Error 
fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please 
check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.
    at handleResponseNotOk (C:\Users\Elliott\hvac\node_modules\@google\generative-ai\dist\index.js:434:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)   
    at async makeRequest (C:\Users\Elliott\hvac\node_modules\@google\generative-ai\dist\index.js:403:9)
    at async generateContent (C:\Users\Elliott\hvac\node_modules\@google\generative-ai\dist\index.js:867:22)
    at async C:\Users\Elliott\hvac\server\index.cjs:244:18 {
  status: 429,
  statusText: 'Too Many Requests',
  errorDetails: undefined
}
AI Vision Request -> model=gemini-2.5-flash imageSize=112496 mimeType=image/png responseMimeType=application/json
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision attempt 1 failed: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.
AI Vision attempt 2 failed: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.
AI Vision Error: [GoogleGenerativeAI Error]: Error fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.  
Full error details: GoogleGenerativeAIFetchError: [GoogleGenerativeAI Error]: Error 
fetching from https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: [429 Too Many Requests] You exceeded your current quota, please 
check your plan and billing details. For more information on this error, head to: https://ai.google.dev/gemini-api/docs/rate-limits. To monitor your current usage, head to: https://ai.dev/rate-limit.
    at handleResponseNotOk (C:\Users\Elliott\hvac\node_modules\@google\generative-ai\dist\index.js:434:11)
    at process.processTicksAndRejections (node:internal/process/task_queues:95:5)   
    at async makeRequest (C:\Users\Elliott\hvac\node_modules\@google\generative-ai\dist\index.js:403:9)
    at async generateContent (C:\Users\Elliott\hvac\node_modules\@google\generative-ai\dist\index.js:867:22)
    at async C:\Users\Elliott\hvac\server\index.cjs:244:18 {
  status: 429,
  statusText: 'Too Many Requests',
  errorDetails: undefined
}


Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document displays process flow lines, various valve symbols (e.g., 'V', 'CSO'), and instrumentation symbols like 'PZV' within a diamond shape, and 'RELIEF' valves. This aligns directly with the criteria for a SCHEMATIC, which includes P&IDs and process flow with instrumentation symbols."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767818963345-q1y546vvf","type":"SCHEMATIC","processing_time_ms":4593,"components":0}]

{
  "document_id": "1767818963345-q1y546vvf",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767818967938,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document displays process flow lines, various valve symbols (e.g., 'V', 'CSO'), and instrumentation symbols like 'PZV' within a diamond shape, and 'RELIEF' valves. This aligns directly with the criteria for a SCHEMATIC, which includes P&IDs and process flow with instrumentation symbols."
  },
  "processing_time_ms": 4593,
  "cache_hit": false,
  "visual": {
    "components": [],
    "connections": [],
    "metadata": {
      "total_components": 0,
      "total_connections": 0,
      "error": "AI Proxy Error: An error occurred while processing the AI request. Check server logs for details."
    }
  }
}


:3000/api/projects/default/tree?dir=.:1   Failed to load resource: the server responded with a status of 500 (Internal Server Error)
:3000/api/projects/default/tree?dir=.:1   Failed to load resource: the server responded with a status of 500 (Internal Server Error)
index.ts:34 Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document displays process flow lines, various valve symbols (e.g., 'V', 'CSO'), and instrumentation symbols like 'PZV' within a diamond shape, and 'RELIEF' valves. This aligns directly with the criteria for a SCHEMATIC, which includes P&IDs and process flow with instrumentation symbols."}]
index.ts:34 Step 2: Routing to pipeline...
index.ts:34 ["Selected pipeline:","visual"]
index.ts:34 Step 3: Executing pipeline...
visual.ts:82 Detecting blueprint type (P&ID vs HVAC)...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
:4000/api/ai/generateVision:1   Failed to load resource: the server responded with a status of 500 (Internal Server Error)
client.ts:85  AI Proxy Error Response: Object
generateVision @ client.ts:85
visual.ts:183  Blueprint type detection failed, defaulting to HVAC: Error: AI Proxy Error: An error occurred while processing the AI request. Check server logs for details.
    at AIClient.generateVision (client.ts:89:13)
    at async detectBlueprintType (visual.ts:168:22)
    at async Object.analyzeVisual [as handler] (visual.ts:83:27)
    at async analyzeDocument (index.ts:65:24)
    at async runAnalysisInternal (BlueprintWorkspace.tsx:221:22)
detectBlueprintType @ visual.ts:183
visual.ts:84 Blueprint type detected: HVAC
visual.ts:409 [Visual Pipeline] Image dimensions: 991x687px, tiling: NO (threshold: 2000px)
visual.ts:95 Using standard single-pass analysis
:4000/api/ai/generateVision:1   Failed to load resource: the server responded with a status of 500 (Internal Server Error)
client.ts:85  AI Proxy Error Response: Object
generateVision @ client.ts:85
visual.ts:144  Visual analysis error: Error: AI Proxy Error: An error occurred while processing the AI request. Check server logs for details.
    at AIClient.generateVision (client.ts:89:13)
    at async analyzeStandard (visual.ts:192:24)
    at async Object.analyzeVisual [as handler] (visual.ts:96:16)
    at async analyzeDocument (index.ts:65:24)
    at async runAnalysisInternal (BlueprintWorkspace.tsx:221:22)
analyzeVisual @ visual.ts:144
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767818963345-q1y546vvf","type":"SCHEMATIC","processing_time_ms":4593,"components":0}]
BlueprintWorkspace.tsx:222 Stage 1 (Visual Analysis) complete: Object
index.ts:149 [Stage 2] Skipping final analysis - not applicable for this document type
BlueprintWorkspace.tsx:265 [Stage 2] Socket event: Final analysis complete: null
BlueprintWorkspace.tsx:280 [Stage 2] Background job queued: skipped
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: skipped