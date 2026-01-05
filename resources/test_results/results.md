PS C:\Users\Elliott\hvac> & C:/Users/Elliott/AppData/Local/Programs/Python/Python311/python.exe c:/Users/Elliott/hvac/start.py
[INFO] ======================================================================
[INFO]  HVAC AI Platform - Startup Script v2.0
[INFO] ======================================================================
[INFO] 🕐 Started: 2026-01-05 01:02:57 UTC
[INFO] 📂 Working Directory: C:\Users\Elliott\hvac
[INFO] 📝 Log File: C:\Users\Elliott\hvac\logs\start.log
[INFO]
[INFO]
[INFO] ======================================================================
[INFO]   Platform Information
[INFO] ======================================================================
[INFO] 🖥️  Platform: Windows 10 (AMD64)
[INFO] 🐍 Python: CPython 3.11.9
[INFO]
[INFO] ======================================================================
[INFO]   Environment Validation
[INFO] ======================================================================
[INFO] ✅ Python: 3.11.9 (C:\Users\Elliott\AppData\Local\Programs\Python\Python311\pyth
on.exe)
[INFO] ✅ Node.js: v20.19.5 (C:\Program Files\nodejs\node.EXE)
[INFO] ✅ npm: 11.7.0 (C:\Users\Elliott\AppData\Roaming\npm\npm.CMD)
[INFO] ✅ npx: C:\Users\Elliott\AppData\Roaming\npm\npx.CMD
[INFO] 
[INFO] ======================================================================
[INFO]   Dependency Validation
[INFO] ======================================================================
[INFO] ✅ package.json found
[INFO] ✅ node_modules exists with 240 packages
[INFO] 
[INFO] ======================================================================
[INFO]   Configuration Loading
[INFO] ======================================================================
[INFO] 📄 Found 2 environment file(s):
[INFO]    • .env
[INFO]    • .env.local
[INFO] ✅ Loaded 19 environment variables
[INFO]
[INFO] 📋 Key Configuration:
[INFO]    VITE_AI_PROVIDER: gemini
[INFO]    VITE_AI_MODEL: gemini-2.5-flash
[INFO]    VITE_AI_TEMPERATURE: 0.2
[INFO]    VITE_FEATURE_CACHE: true
[INFO]    VITE_FEATURE_FILE_PROCESSING: true
[INFO]
[INFO] ======================================================================
[INFO]   Environment Variables Validation
[INFO] ======================================================================
[INFO] 📋 Validating against: .env.example
[INFO]    Checking files: .env, .env.local
[INFO] ✅ All required environment variables are set
[INFO] ℹ️  Found 6 additional variable(s) not in example
[INFO]
[INFO] ======================================================================
[INFO] ⏱️  Total diagnostic time: 0.74s
[INFO] ======================================================================
[INFO]
[INFO] ======================================================================
[INFO]   Diagnostic Summary
[INFO] ======================================================================
[INFO]
[INFO] Total Checks: 5
[INFO] Passed: 5 ✅
[INFO] Failed: 0 ❌
[INFO]
[INFO] ✅ Passed Checks:
[INFO]    • platform_ok
[INFO]    • env_ok
[INFO]    • dependencies_ok
[INFO]    • config_loaded
[INFO]    • env_keys_ok
[INFO]
[INFO] ======================================================================
[INFO] 🎉 All checks passed! Platform is ready.
[INFO] ======================================================================
[INFO] 
[INFO] 📝 Full log written to: C:\Users\Elliott\hvac\logs\start.log
[INFO]
[INFO] ℹ️  Found local API server entry, starting backend + frontend dev servers      
[INFO] ℹ️  Passthrough mode: ENABLED
[INFO] Starting development and API servers...
[INFO] Frontend development server started.
[INFO] Backend API server started.

> hvac-ai-platform@0.0.0 dev
> vite


> hvac-ai-platform@0.0.0 dev:api
> node server/index.cjs

[dotenv@17.2.3] injecting env (19) from .env -- tip: ✅ audit secrets and track complia
nce: https://dotenvx.com/ops
✅ AI Proxy Initialized. Model: gemini-2.5-flash

🚀 Server running at http://localhost:4000
📂 Data Root: C:\Users\Elliott\hvac\data\projects
🤖 AI Provider: gemini (Active)
🎭 Mock Mode: DISABLED (live AI inference)

  VITE v6.4.1  ready in 1886 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://10.0.0.32:3000/
  ➜  press h + enter to show help
AI Vision Response: {
  "type": "SCHEMATIC",
  "confidence": 0.98,
  "reasoning": "Classified as SCHEMATIC based on: the dominant visual elements being process flow lines (solid, dashed, colored lines) connecting various...
AI Vision Response: PID
AI Vision Response: {
  "components": [
    {
      "id": "HYDRAULIC_UNIT_741-W23-003",
      "label": "HYDRAULIC UNIT",
      "type": "equipment",
      "bbox": [0.076, 0.298, 0.178, 0.359],
      "confidence": 0.98,
  ...
AI Vision Error: Invalid JSON response: {
  "components": [
    {
      "id": "HYDRAULIC_UNIT_741-W23-003",
      "label": "HYDRAULIC UNIT",
      "type": "equipment",
      "bbox": [0.076, 0.298, 0.178, 0.359],
      "confidence": 0.98,
      "meta": {
        "reasoning": "Classified as equipment based on the rectangular shape with internal components and the clear text label 'HYDRAULIC UNIT'. The dashed box around it indicates a system boundary. Tag '741-W23-003' is a system identifier.",
        "description": "Hydraulic Unit for



Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":0.98,"reasoning":"Classified as SCHEMATIC based on: the dominant visual elements being process flow lines (solid, dashed, colored lines) connecting various components, extensive use of ISA-5.1 compliant instrumentation symbols (e.g., circles for instruments, various valve symbols, pressure indicators, flow switches), and control loop tag nomenclature (e.g., '741-V-7511', '741-W23-004'). A detailed legend on the right side explicitly defines these symbols, confirming their use in a process and instrumentation context. There are no spatial layouts, architectural elements, or dominant text paragraphs or tabular data, which rules out BLUEPRINT, SPEC_SHEET, and SCHEDULE categories respectively. High confidence due to clear adherence to P&ID conventions."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767575125744-3uhemtb8g","type":"SCHEMATIC","processing_time_ms":249162,"components":0}]

{
  "document_id": "1767575125744-3uhemtb8g",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767575374906,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 0.98,
    "reasoning": "Classified as SCHEMATIC based on: the dominant visual elements being process flow lines (solid, dashed, colored lines) connecting various components, extensive use of ISA-5.1 compliant instrumentation symbols (e.g., circles for instruments, various valve symbols, pressure indicators, flow switches), and control loop tag nomenclature (e.g., '741-V-7511', '741-W23-004'). A detailed legend on the right side explicitly defines these symbols, confirming their use in a process and instrumentation context. There are no spatial layouts, architectural elements, or dominant text paragraphs or tabular data, which rules out BLUEPRINT, SPEC_SHEET, and SCHEDULE categories respectively. High confidence due to clear adherence to P&ID conventions."
  },
  "processing_time_ms": 249162,
  "cache_hit": false,
  "visual": {
    "components": [],
    "connections": [],
    "metadata": {
      "total_components": 0,
      "total_connections": 0,
      "error": "AI Proxy Error: The AI model returned a response that is not valid JSON. This may indicate a model configuration issue."
    }
  }
}




Step 1: Classifying document...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
classifier.ts:50 [Classifier] Raw AI response: {
  "type": "SCHEMATIC",
  "confidence": 0.98,
  "reasoning": "Classified as SCHEMATIC based on: the dominant visual elements being process flow lines (solid, dashed, colored lines) connecting various components, extensive use of ISA-5.1 compliant instrumentation symbols (e.g., circles for instruments, various valve symbols, pressure indicators, flow switches), and control loop tag nomenclature (e.g., '741-V-7511', '741-W23-004'). A detailed legend on the right side explicitly defines these symbols, confirming their use in a process and instrumentation context. There are no spatial layouts, architectural elements, or dominant text paragraphs or tabular data, which rules out BLUEPRINT, SPEC_SHEET, and SCHEDULE categories respectively. High confidence due to clear adherence to P&ID conventions."
}
index.ts:33 ["Classification result:",{"type":"SCHEMATIC","confidence":0.98,"reasoning":"Classified as SCHEMATIC based on: the dominant visual elements being process flow lines (solid, dashed, colored lines) connecting various components, extensive use of ISA-5.1 compliant instrumentation symbols (e.g., circles for instruments, various valve symbols, pressure indicators, flow switches), and control loop tag nomenclature (e.g., '741-V-7511', '741-W23-004'). A detailed legend on the right side explicitly defines these symbols, confirming their use in a process and instrumentation context. There are no spatial layouts, architectural elements, or dominant text paragraphs or tabular data, which rules out BLUEPRINT, SPEC_SHEET, and SCHEDULE categories respectively. High confidence due to clear adherence to P&ID conventions."}]
index.ts:33 Step 2: Routing to pipeline...
index.ts:33 ["Selected pipeline:","visual"]
index.ts:33 Step 3: Executing pipeline...
visual.ts:79 Detecting blueprint type (P&ID vs HVAC)...
visual.ts:81 Blueprint type detected: PID
visual.ts:92 Using standard single-pass analysis
:4000/api/ai/generateVision:1 
 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
client.ts:85 
 AI Proxy Error Response: 
Object
generateVision	@	client.ts:85
visual.ts:120 
 Visual analysis error: Error: AI Proxy Error: The AI model returned a response that is not valid JSON. This may indicate a model configuration issue.
    at AIClient.generateVision (client.ts:89:13)
    at async analyzeStandard (visual.ts:168:24)
    at async Object.analyzeVisual [as handler] (visual.ts:93:16)
    at async analyzeDocument (index.ts:64:24)
    at async runAnalysisInternal (BlueprintWorkspace.tsx:85:22)
analyzeVisual	@	visual.ts:120
index.ts:33 Pipeline execution complete
index.ts:33 ["Analysis complete:",{"document_id":"1767575125744-3uhemtb8g","type":"SCHEMATIC","processing_time_ms":249162,"components":0}]
BlueprintWorkspace.tsx:86 Analysis result: 
Object
cache_hit
: 
false
classification
: 
confidence
: 
0.98
reasoning
: 
"Classified as SCHEMATIC based on: the dominant visual elements being process flow lines (solid, dashed, colored lines) connecting various components, extensive use of ISA-5.1 compliant instrumentation symbols (e.g., circles for instruments, various valve symbols, pressure indicators, flow switches), and control loop tag nomenclature (e.g., '741-V-7511', '741-W23-004'). A detailed legend on the right side explicitly defines these symbols, confirming their use in a process and instrumentation context. There are no spatial layouts, architectural elements, or dominant text paragraphs or tabular data, which rules out BLUEPRINT, SPEC_SHEET, and SCHEDULE categories respectively. High confidence due to clear adherence to P&ID conventions."
type
: 
"SCHEMATIC"
[[Prototype]]
: 
Object
document_id
: 
"1767575125744-3uhemtb8g"
document_type
: 
"SCHEMATIC"
file_name
: 
"current-image"
processing_time_ms
: 
249162
timestamp
: 
1767575374906
visual
: 
components
: 
Array(0)
length
: 
0
[[Prototype]]
: 
Array(0)
connections
: 
Array(0)
length
: 
0
[[Prototype]]
: 
Array(0)
metadata
: 
error
: 
"AI Proxy Error: The AI model returned a response that is not valid JSON. This may indicate a model configuration issue."
total_components
: 
0
total_connections
: 
0
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object