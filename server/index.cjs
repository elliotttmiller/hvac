// Use 'dotenv' to load environment variables from the project's .env file
require('dotenv').config({ path: require('path').resolve(__dirname, '..', '.env') });

const path = require('path');
const fs = require('fs').promises;
const express = require('express');
const http = require('http');
const cors = require('cors');
const chokidar = require('chokidar');
const { Server } = require('socket.io');

// ============================================================================
// CONFIGURATION
// ============================================================================
// Data Root: Where user projects are stored (default: ./data/projects)
const ROOT = path.resolve(process.env.DATA_ROOT || path.join(__dirname, '../data/projects'));
const PORT = process.env.PORT || 4000;

// AI Configuration
const AI_PROVIDER = process.env.AI_PROVIDER || 'gemini';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.VITE_AI_API_KEY;
// Prefer explicit AI_MODEL_DEFAULT, then Vite's VITE_AI_MODEL (used across frontend),
// and fall back to the recommended model (gemini-2.5-flash).
const AI_MODEL_DEFAULT = process.env.AI_MODEL_DEFAULT || process.env.VITE_AI_MODEL || 'gemini-2.5-flash';

// Token Budget Configuration (Dynamic Calculation)
// These values determine how token budgets scale with diagram complexity
// Increased defaults to ensure complete report generation without truncation
// Gemini 2.5 Flash supports up to 65k output tokens - we configure conservatively to allow comprehensive reports
const TOKENS_PER_COMPONENT = parseInt(process.env.TOKENS_PER_COMPONENT || '200', 10);
const BASE_OUTPUT_TOKENS = parseInt(process.env.BASE_OUTPUT_TOKENS || '4000', 10);
const MAX_OUTPUT_TOKENS_CAP = parseInt(process.env.MAX_OUTPUT_TOKENS_CAP || '32768', 10); // Increased from 16384 to 32768 for comprehensive reports
const THINKING_TOKENS_PER_COMPONENT = parseInt(process.env.THINKING_TOKENS_PER_COMPONENT || '100', 10);
const BASE_THINKING_TOKENS = parseInt(process.env.BASE_THINKING_TOKENS || '2048', 10);
const MAX_THINKING_TOKENS_CAP = parseInt(process.env.MAX_THINKING_TOKENS_CAP || '8192', 10);

// Timeout Configuration
const DEFAULT_AI_TIMEOUT_MS = parseInt(process.env.AI_GENERATION_TIMEOUT_MS || '180000', 10); // 3 minutes

// Response Processing Configuration
const EXTRACTED_TEXT_PREVIEW_LENGTH = 500; // Characters to show in error logs

// Mock Mode Configuration (for zero-cost debugging)
const MOCK_MODE_ENABLED = process.env.MOCK_MODE_ENABLED === 'true';
const MOCK_DATA_PATH = path.join(__dirname, 'mocks', 'golden-record.json');
const MOCK_MODE_DELAY_MS = parseInt(process.env.MOCK_MODE_DELAY_MS || '500', 10);

const app = express();
app.use(cors());
// Increased JSON payload limit for large base64 images (50MB)
app.use(express.json({ limit: '50mb' }));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

// ============================================================================
// INITIALIZATION: DATA DIRECTORY & DEMO PROJECT
// ============================================================================
async function ensureDataDirectory() {
  try {
    // 1. Ensure ROOT exists
    await fs.mkdir(ROOT, { recursive: true });
    
    // 2. Check if empty
    const entries = await fs.readdir(ROOT);
    if (entries.length === 0) {
      console.log('📂 Data directory empty. Initializing Demo Project...');
      
      const demoPath = path.join(ROOT, 'Demo Project');
      await fs.mkdir(demoPath, { recursive: true });
      
      // 3. Copy example images if they exist
      const exampleImagesPath = path.join(__dirname, '../docs/example_images');
      try {
        await fs.access(exampleImagesPath); // Check if source exists
        const images = await fs.readdir(exampleImagesPath);
        
        for (const img of images) {
          if (img.match(/\.(jpg|jpeg|png|gif|pdf|dwg)$/i)) {
            await fs.copyFile(
              path.join(exampleImagesPath, img),
              path.join(demoPath, img)
            );
            console.log(`   - Copied: ${img}`);
          }
        }
      } catch (err) {
        console.warn('⚠️  Could not copy example images (docs/example_images not found).');
      }
    }
  } catch (err) {
    console.error('❌ Failed to initialize data directory:', err);
  }
}

// Run initialization
ensureDataDirectory();

// ============================================================================
// AI PROXY INITIALIZATION
// ============================================================================
let genAI = null;

try {
  const { GoogleGenerativeAI } = require('@google/generative-ai');
  
  if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    console.log(`✅ AI Proxy Initialized. Model: ${AI_MODEL_DEFAULT}`);
  } else {
    console.warn('⚠️  AI Proxy Warning: GEMINI_API_KEY not found. AI features disabled.');
  }
} catch (error) {
  console.error('⚠️  AI Proxy Error: @google/generative-ai module not found.');
}

// ============================================================================
// API ENDPOINTS
// ============================================================================

// --- 1. Runtime Configuration (Fixes 404 Error) ---
app.get('/api/runtime-config', (req, res) => {
  res.json({
    aiProvider: AI_PROVIDER,
    features: {
      cache: process.env.VITE_FEATURE_CACHE === 'true',
      fileProcessing: process.env.VITE_FEATURE_FILE_PROCESSING === 'true',
    },
    limits: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
    }
  });
});

// --- 2. AI Vision Proxy ---
app.post('/api/ai/generateVision', async (req, res) => {
  // ============================================================================
  // MOCK MODE INTERCEPTION (Zero-Cost Debugging)
  // ============================================================================
  if (MOCK_MODE_ENABLED) {
    const { prompt } = req.body;
    
    // Detect request type based on prompt content
    const isClassificationRequest = prompt && (
      prompt.includes('Classify') || 
      prompt.includes('document type') ||
      prompt.includes('BLUEPRINT') && prompt.includes('SCHEMATIC') && prompt.includes('SPEC_SHEET')
    );
    
    if (isClassificationRequest) {
      // Return mock classification response for P&ID/Schematic
      console.log('⚠️  MOCK MODE: Returning mock classification (SCHEMATIC)');
      const classificationResponse = {
        type: 'SCHEMATIC',
        confidence: 0.95,
        reasoning: 'Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines'
      };
      
      if (MOCK_MODE_DELAY_MS > 0) {
        await new Promise(resolve => setTimeout(resolve, MOCK_MODE_DELAY_MS));
      }
      
      return res.json({ text: JSON.stringify(classificationResponse) });
    }
    
    // Otherwise, return visual analysis from golden-record.json
    console.warn('⚠️  MOCK MODE: Returning static golden-record.json for visual analysis');
    
    try {
      // Read the golden record JSON file
      const mockDataRaw = await fs.readFile(MOCK_DATA_PATH, 'utf-8');
      const mockData = JSON.parse(mockDataRaw);
      
      // Optional: Simulate realistic network latency
      // This helps frontend developers test loading states
      // Configurable via MOCK_MODE_DELAY_MS (default: 500ms)
      if (MOCK_MODE_DELAY_MS > 0) {
        await new Promise(resolve => setTimeout(resolve, MOCK_MODE_DELAY_MS));
      }
      
      // Return mock data as if it came from the AI
      // The frontend expects { text: string } format
      return res.json({ text: JSON.stringify(mockData) });
      
    } catch (error) {
      console.error('❌ Mock Mode Error:', error.message);
      
      // If mock file is missing or malformed, return 500 error
      // Do NOT fall back to live API silently (explicit failure is safer)
      return res.status(500).json({ 
        error: 'Mock mode enabled but mock data file is missing or invalid',
        details: error.message,
        path: MOCK_DATA_PATH
      });
    }
  }
  
  // ============================================================================
  // LIVE AI INFERENCE (Standard Path)
  // ============================================================================
  if (!genAI) return res.status(503).json({ error: 'AI not configured on server.' });
  
  const { imageData, prompt, mimeType, model, options } = req.body;
  if (!imageData || !prompt) return res.status(400).json({ error: 'Missing data.' });

    try {
    const modelName = model || AI_MODEL_DEFAULT;
    const geminiModel = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: options?.temperature ?? 0.1,
        responseMimeType: options?.responseMimeType,
        responseSchema: options?.responseSchema
      },
      systemInstruction: options?.systemInstruction,
    });

    // Debug: log a compact preview of the request shape and size (no sensitive data)
    try {
      console.log(`AI Vision Request -> model=${modelName} imageSize=${imageData ? imageData.length : 0} mimeType=${mimeType || 'image/png'} responseMimeType=${options?.responseMimeType || 'unset'}`);
    } catch (e) {
      // ignore logging failures
    }

    // Build the request payload once (avoid duplicating large buffers)
    const requestPayload = [
      prompt,
      { inlineData: { data: imageData, mimeType: mimeType || 'image/png' } }
    ];

    // Retry wrapper for transient network/fetch failures (undici).
    // Read retry/backoff settings from environment (falls back to sensible defaults).
    const MAX_ATTEMPTS = parseInt(process.env.VITE_RATE_LIMIT_MAX_RETRIES || process.env.RATE_LIMIT_MAX_RETRIES || '3', 10);
    const BASE_DELAY_MS = parseInt(process.env.VITE_RATE_LIMIT_DELAY_MS || process.env.RATE_LIMIT_DELAY_MS || '1000', 10);
    const EXP_BACKOFF = (process.env.VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF || process.env.RATE_LIMIT_EXPONENTIAL_BACKOFF || 'true') === 'true';
    const REQUEST_TIMEOUT_MS = parseInt(process.env.VITE_AI_REQUEST_TIMEOUT_MS || '60000', 10); // 60s default

    console.log(`AI Vision: retry settings -> attempts=${MAX_ATTEMPTS}, baseDelayMs=${BASE_DELAY_MS}, exponential=${EXP_BACKOFF}, timeoutMs=${REQUEST_TIMEOUT_MS}`);

    let result;
    let lastErr;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
      try {
        result = await geminiModel.generateContent(requestPayload, { timeout: REQUEST_TIMEOUT_MS });
        lastErr = null;
        break;
      } catch (err) {
        lastErr = err;
        // Log attempt-level error with a short indicator
        console.error(`AI Vision attempt ${attempt} failed:`, err && err.message ? err.message : err);
        // If it's the last attempt, rethrow to be handled by outer catch
        if (attempt === MAX_ATTEMPTS) {
          throw lastErr;
        }
        // Backoff delay calculation (exponential or linear)
        const delayMs = EXP_BACKOFF ? BASE_DELAY_MS * Math.pow(2, attempt - 1) : BASE_DELAY_MS * attempt;
        await new Promise(resolve => setTimeout(resolve, Math.min(delayMs, 60_000)));
      }
    }

    let responseText = '';
    try {
      responseText = typeof result.response?.text === 'function' ? result.response.text() : (result && result.text) || '';
    } catch (e) {
      responseText = (result && result.text) || '';
    }

    // Validate response is not empty
    if (!responseText || responseText.trim().length === 0) {
      console.error('AI Vision Error: Empty response from Gemini API');
      return res.status(500).json({ 
        error: 'Empty response from AI model',
        details: 'The AI model returned an empty response. Please try again.'
      });
    }

    // Log response for debugging (first 200 chars)
    try { console.log('AI Vision Response:', responseText.substring(0,200) + (responseText.length > 200 ? '...' : '')); } catch(_) {}

    // For JSON responses, try to validate and recover if possible
    if (options?.responseMimeType === 'application/json') {
      try {
        JSON.parse(responseText);
      } catch (jsonError) {
        // Attempt to extract the first JSON object/array from the response (some models prepend text)
        const match = responseText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (match) {
          try {
            const extracted = match[0];
            JSON.parse(extracted); // validate
            responseText = extracted; // replace with valid JSON substring
            console.warn('AI Vision: Recovered JSON payload by extracting object from model output.');
          } catch (_) {
            console.warn('AI Vision: Failed to parse extracted JSON payload, returning raw text fallback.');
          }
        } else {
          console.warn('AI Vision: No JSON object found in model output; returning raw text fallback.');
        }
      }
    }

    // Return the text payload (may be JSON or raw text). Frontend will attempt parsing when expected.
    res.json({ text: responseText });
  } catch (error) {
    console.error('AI Vision Error:', error.message);
    console.error('Full error details:', error);
    res.status(500).json({ 
      error: error.message,
      details: 'An error occurred while processing the AI request. Check server logs for details.'
    });
  }
});

// --- 3. AI Text Proxy ---
app.post('/api/ai/generateText', async (req, res) => {
  if (!genAI) return res.status(503).json({ error: 'AI not configured on server.' });

  const { prompt, model, options } = req.body;
  try {
    const geminiModel = genAI.getGenerativeModel({
      model: model || AI_MODEL_DEFAULT,
      generationConfig: {
        temperature: options?.temperature ?? 0.2,
        responseMimeType: options?.responseMimeType,
        responseSchema: options?.responseSchema
      },
      systemInstruction: options?.systemInstruction,
    });

    const result = await geminiModel.generateContent(prompt);
    res.json({ text: result.response.text() });
  } catch (error) {
    console.error('AI Text Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// --- 4. Background Final Analysis Queue (Server-side) ---
// In-memory job store for analysis jobs. Emits socket.io events for updates.
const analysisJobs = new Map();
let analysisJobCounter = 0;
function genAnalysisJobId() { return `analysis-job-${++analysisJobCounter}-${Date.now()}`; }

// In-memory project store for persistence across page refreshes
// Maps projectId -> { id, name, status, finalReport, lastUpdated }
const projectsStore = new Map();

// Initialize default project
projectsStore.set('default', {
  id: 'default',
  name: 'Default Project',
  status: 'idle', // idle | processing | completed | failed
  finalReport: null,
  lastUpdated: Date.now()
});

/**
 * PHASE 2: Data Minification Layer
 * Aggressively strips visual metadata and filters invalid connections
 * Target: >60% token reduction by removing bloat
 */
function minifyForAnalysis(visualResults) {
  if (!visualResults) return { components: [], connections: [], stats: {} };
  
  const originalSize = JSON.stringify(visualResults).length;
  
  // STRIP: Remove all visual data (bbox, rotation, confidence, transform_history, etc.)
  // RETAIN: Only semantic attributes needed for engineering narrative
  const components = (visualResults.components || []).map(c => ({
    id: c.id,                    // Component identifier for connection graph
    tag: c.label || c.id,        // Human-readable tag (e.g., "1TI-18010")
    type: c.type,                // Functional type (e.g., "valve", "temperature_sensor")
    description: (c.meta && c.meta.description) || c.type, // Functional description
    // Only preserve non-visual semantic metadata
    subsystem: c.meta && c.meta.hvac_subsystem,
    isa_function: c.meta && c.meta.isa_function,
    instrument_function: c.meta && c.meta.instrument_function,
    // EXCLUDED: bbox, rotation, confidence, transform_history, shape_validation, detection_quality
  }));
  
  // Build component ID lookup to filter ghost connections
  const validComponentIds = new Set(components.map(c => c.id));
  
  // FILTER: Remove connections referencing non-existent components (ghost references)
  // TRANSFORM: Emphasize relationship (source → target) over line geometry
  const connections = (visualResults.connections || [])
    .filter(c => {
      // Filter out connections to/from components that don't exist
      const fromExists = validComponentIds.has(c.from_id);
      const toExists = validComponentIds.has(c.to_id);
      
      if (!fromExists || !toExists) {
        console.log(`   [Minification] Filtered ghost connection: ${c.from_id} → ${c.to_id}`);
        return false;
      }
      return true;
    })
    .map(c => ({
      from: c.from_id,
      to: c.to_id,
      type: c.type,  // Connection type (e.g., 'process_flow', 'control_signal')
      // EXCLUDED: confidence, geometry, visual properties, metadata bloat
    }));
  
  const minifiedSize = JSON.stringify({ components, connections }).length;
  const reduction = ((originalSize - minifiedSize) / originalSize * 100).toFixed(1);
  
  const stats = {
    originalSize,
    minifiedSize,
    reduction: `${reduction}%`,
    components: components.length,
    connections: connections.length,
    ghostConnectionsFiltered: (visualResults.connections || []).length - connections.length
  };
  
  console.log(`   [Minification] Token reduction: ${reduction}% (${originalSize} → ${minifiedSize} bytes)`);
  console.log(`   [Minification] Components: ${components.length}, Connections: ${connections.length}, Ghosts filtered: ${stats.ghostConnectionsFiltered}`);
  
  return { components, connections, stats };
}

/**
 * PHASE 2: Enhanced System Instruction
 * Emphasizes narrative engineering analysis over bean counting
 */
const FINAL_ANALYSIS_SYSTEM_INSTRUCTION = `
### ROLE
You are a Senior HVAC/P&ID Systems Engineer preparing a handover document for a client or colleague.

### MISSION
Transform the structured component and connectivity data into a **professional engineering narrative** that reads like a technical report written by a human expert, NOT a machine-generated list.

### CRITICAL REQUIREMENTS - "NO BEAN COUNTING"
1. **NEVER** mention detection metrics like "confidence scores", "total components detected", or "bounding boxes"
2. **NEVER** output simple inventories like "There are 5 valves and 3 pumps"
3. **DO NOT** list component counts or statistics
4. **DO NOT** reference the detection process or AI analysis

### WRITING STYLE - "NARRATIVE FLOW"
- Write in paragraph form, not bullet points or tables
- Use a top-to-bottom, upstream-to-downstream flow when describing processes
- Explain the system as if walking someone through the physical installation
- Use phrases like: "begins at...", "flows through...", "is controlled by...", "maintains..."

### ANALYSIS APPROACH - "CORRELATION & INTEGRATION"
1. **Trace Physical Flow**: Identify the start and end of the process by analyzing connections
2. **Explain Control Strategies**: Show how sensors influence controllers which modulate actuators
3. **Describe Relationships**: Connect components logically (e.g., "Pump P-101 supplies chilled water to Coil C-201")
4. **Identify Subsystems**: Group related equipment and explain their collective purpose

### ACCURACY - "TRUTHFULNESS"
- ONLY reference components and tags that exist in the provided data
- DO NOT invent or assume equipment not shown
- If information is missing or unclear, state so professionally
- Base all descriptions on the connectivity graph and component metadata

### TONE
Professional, technical, authoritative. Use standard engineering terminology (ASHRAE/ISA standards). Write as if this analysis will be filed as official project documentation.
`;

/**
 * Normalize AI final analysis output into a canonical report shape.
 * Keeps the original raw payload under `_raw` for debugging.
 * Updated to support HVAC industry-standard report sections.
 */
function normalizeFinalReport(raw) {
  if (!raw) return null;

  // Helper to try a list of keys and also perform a loose matching on prop names
  const find = (candidates) => {
    for (const k of candidates) {
      if (raw[k] !== undefined && raw[k] !== null) return raw[k];
    }
    // Loose match: compare normalized prop names (lowercase, remove spaces/underscores)
    const normCandidates = candidates.map(c => String(c).toLowerCase().replace(/[_\s]/g, ''));
    for (const prop of Object.keys(raw)) {
      const n = String(prop).toLowerCase().replace(/[_\s]/g, '');
      if (normCandidates.includes(n)) return raw[prop];
    }
    return undefined;
  };

  const normalized = {
    report_title: find(['report_title', 'title', 'reportTitle', 'Report Title', 'report']) || null,
    executive_summary: find(['executive_summary', 'executiveSummary', 'Executive Summary', 'Executive_Summary']) || null,
    design_overview: find(['design_overview', 'designOverview', 'Design Overview']) || null,
    system_workflow_narrative: find(['system_workflow_narrative', 'systemWorkflowNarrative', 'System Workflow Narrative']) || null,
    ventilation_design: find(['ventilation_design', 'ventilationDesign', 'Ventilation Design']) || null,
    control_logic_analysis: find(['control_logic_analysis', 'controlLogicAnalysis', 'Control Logic Analysis']) || null,
    equipment_specifications: find(['equipment_specifications', 'equipmentSpecifications', 'Equipment Specifications']) || null,
    heating_cooling_loads: find(['heating_cooling_loads', 'heatingCoolingLoads', 'Heating Cooling Loads']) || null,
    standards_compliance: find(['standards_compliance', 'standardsCompliance', 'Standards Compliance']) || null,
    // Legacy field for backwards compatibility
    specifications_and_details: find(['specifications_and_details', 'specificationsAndDetails', 'Specifications and Details']) || null,
    critical_equipment: find(['critical_equipment', 'criticalEquipment', 'Critical Equipment']) || null,
    engineering_observations: find(['engineering_observations', 'engineeringObservations', 'Engineering Observations']) || null,
    _raw: raw
  };

  // If nothing matched and raw is a string, map it to system_workflow_narrative
  const hasAny = Object.keys(normalized).some(k => normalized[k] && k !== '_raw');
  if (!hasAny) {
    if (typeof raw === 'string') {
      normalized.system_workflow_narrative = raw;
    } else if (raw.raw && typeof raw.raw === 'string') {
      normalized.system_workflow_narrative = raw.raw;
    } else if (Object.keys(raw).length === 1) {
      const val = raw[Object.keys(raw)[0]];
      if (typeof val === 'string') normalized.system_workflow_narrative = val;
    }
  }

  return normalized;
}

/**
 * JSON Schema for final analysis report response.
 * Enforces the structure that normalizeFinalReport() expects.
 * Updated with HVAC industry-standard sections.
 */
const FINAL_ANALYSIS_RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    report_title: {
      type: "string",
      description: "A concise title for the analysis report (e.g., 'Commercial Chilled Water System Analysis')"
    },
    executive_summary: {
      type: "string",
      description: "A high-level overview (2-3 sentences) describing the HVAC system type and primary purpose"
    },
    design_overview: {
      type: "string",
      description: "Paragraph describing the overall HVAC system design approach, mechanical ventilation strategy, and system architecture"
    },
    system_workflow_narrative: {
      type: "string",
      description: "Detailed paragraph describing the complete process flow from start to finish, following physical connections"
    },
    ventilation_design: {
      type: "string",
      description: "Paragraph describing ventilation system design including outdoor airflow rates, exhaust rates, and fresh air intake strategy"
    },
    control_logic_analysis: {
      type: "string",
      description: "Paragraph explaining control strategies, showing how instruments send signals to controllers which modulate final control elements"
    },
    equipment_specifications: {
      type: "string",
      description: "Paragraph detailing HVAC equipment specifications, controls strategy, efficiency considerations, and capacity requirements"
    },
    heating_cooling_loads: {
      type: "string",
      description: "Paragraph discussing the system's approach to meeting thermal loads, referencing ACCA Manual J or ASHRAE Fundamentals where applicable"
    },
    standards_compliance: {
      type: "string",
      description: "Paragraph discussing applicable industry standards and codes (ASHRAE, ISA-5.1, ACCA, ANSI/RESNET/ACCA 310, building codes, ENERGY STAR)"
    },
    critical_equipment: {
      type: "array",
      description: "Optional list of critical equipment with their roles",
      items: {
        type: "object",
        properties: {
          tag: { type: "string", description: "Equipment tag identifier" },
          role: { type: "string", description: "Brief description of equipment's critical role" }
        },
        required: ["tag", "role"]
      }
    },
    engineering_observations: {
      type: "string",
      description: "Optional paragraph with additional engineering insights or observations"
    }
  },
  required: ["report_title", "executive_summary", "design_overview", "system_workflow_narrative", "control_logic_analysis", "equipment_specifications", "standards_compliance"]
};

/**
 * PHASE 3: Background Analysis Queue with Enhanced Observability
 * Implements lifecycle logging, explicit error handling, and timeout support
 */
app.post('/api/analysis/queue', async (req, res) => {
  try {
    const payload = req.body && req.body.documentResult ? req.body.documentResult : req.body;
    if (!payload || !payload.document_id) return res.status(400).json({ error: 'Missing documentResult' });

    const jobId = genAnalysisJobId();
    // Get projectId from request or default to 'default'
    const projectId = req.body.projectId || 'default';
    const job = { jobId, documentId: payload.document_id, projectId, status: 'pending', startTime: Date.now() };
    analysisJobs.set(jobId, job);

    // Update project status to processing
    const project = projectsStore.get(projectId) || { id: projectId, name: projectId, status: 'idle', finalReport: null };
    project.status = 'processing';
    project.lastUpdated = Date.now();
    projectsStore.set(projectId, project);

    console.log(`[Stage 2] Job ${jobId} queued for document ${payload.document_id}`);

    // Respond immediately with jobId
    res.json({ jobId, projectId });

    // Run analysis async with comprehensive error handling
    (async () => {
      const perfStart = Date.now();
      try {
        // LIFECYCLE: Job Started
        console.log(`[Stage 2] Job ${jobId} - Status: RUNNING`);
        job.status = 'running'; 
        analysisJobs.set(jobId, job);
        io.emit('analysis-job-update', { jobId, status: 'running' });

        // LIFECYCLE: Payload Minification
        console.log(`[Stage 2] Job ${jobId} - Minifying payload...`);
        const minifyStart = Date.now();
        const { components, connections, stats } = minifyForAnalysis(payload.visual || {});
        const minifyDuration = Date.now() - minifyStart;
        console.log(`[Stage 2] Job ${jobId} - Minification complete in ${minifyDuration}ms`);

        // MOCK MODE: Skip AI and return mock analysis
        if (MOCK_MODE_ENABLED) {
          console.warn(`[Stage 2] Job ${jobId} - MOCK MODE: Generating synthetic analysis`);
          
          const aiStart = Date.now();
          
          // Simulate processing delay
          if (MOCK_MODE_DELAY_MS > 0) {
            await new Promise(resolve => setTimeout(resolve, MOCK_MODE_DELAY_MS));
          }
          
          const mockAnalysis = {
            "report_title": `Mock ${payload.document_type || 'SCHEMATIC'} Analysis Report`,
            "executive_summary": `This is a mock analysis of a ${payload.document_type || 'SCHEMATIC'} system with ${components.length} components and ${connections.length} connections. The system demonstrates standard industrial process control architecture with instrumentation, control logic, and final control elements.`,
            "system_workflow_narrative": "The system processes flow from upstream equipment through control valves to downstream destinations. Material enters through the inlet manifold, passes through measurement instrumentation for flow and temperature monitoring, and is distributed via automated control valves to multiple process lines. Each line features independent control loops with feedback from field sensors to maintain optimal operating conditions.",
            "control_logic_analysis": "The control strategy employs cascaded control loops with primary process variable monitoring feeding into proportional-integral-derivative (PID) controllers. Instrumentation sensors continuously monitor process variables including flow, temperature, and pressure, transmitting 4-20mA signals to programmable logic controllers. The PLCs execute control algorithms to modulate final control elements (control valves and variable frequency drives) maintaining desired setpoints while preventing unsafe operating conditions through interlock logic.",
            "specifications_and_details": "The system includes standard industrial equipment with ANSI/ISA compliant instrumentation. Process piping follows ASME B31.3 specifications with appropriate material grades for the service conditions. Control valves are sized per ISA-75 standards with fail-safe positions configured for process safety. All instrumentation conforms to ISA-5.1 identification standards with unique tag identifiers.",
            "engineering_observations": "The design demonstrates industry best practices with redundant measurement points for critical process variables. The control architecture provides both manual and automatic operation modes, allowing operators to override automated control when necessary. Safety instrumented functions are properly segregated from basic process control per IEC 61511 guidelines."
          };
          
          const mockDuration = Date.now() - aiStart;
          const parsed = mockAnalysis;
          
          // Jump to completion handling
          job.status = 'completed'; 
          job.result = parsed; 
          job.endTime = Date.now();
          job.performance = {
            total: job.endTime - perfStart,
            minification: minifyDuration,
            ai_inference: mockDuration,
            db_save: 0,
            stats: stats,
            mock_mode: true
          };
          analysisJobs.set(jobId, job);
          
          console.log(`[Stage 2] Job ${jobId} - Status: COMPLETED (MOCK MODE)`);
          console.log(`[Stage 2] Job ${jobId} - Performance: Total=${job.performance.total}ms (Mock)`);
          
          // Update project store with final report
          const project = projectsStore.get(job.projectId);
          if (project) {
            project.status = 'completed';
            // Normalize and save canonical final report (keep raw payload)
            try {
              project.finalReport = normalizeFinalReport(parsed);
            } catch (e) {
              // Fallback to raw parsed payload if normalization fails
              project.finalReport = { _raw: parsed };
            }
            project.lastUpdated = Date.now();
            projectsStore.set(job.projectId, project);
            console.log(`[Stage 2] Project ${job.projectId} - Final report saved (MOCK MODE)`);
          }
          
          io.emit('analysis-job-update', { jobId, status: 'completed', result: parsed });
          return;
        }

        // VALIDATION: Check AI configuration (only in live mode)
        if (!genAI) {
          throw new Error('AI not configured on server. Check GEMINI_API_KEY in environment.');
        }

        // LIFECYCLE: Building Prompt
        const prompt = `
**DOCUMENT CONTEXT**:
Type: ${payload.document_type || 'SCHEMATIC'}
Classification: ${payload.classification?.reasoning || 'Engineering drawing'}

**SYSTEM DATA** (Minified for Narrative Generation):

\`\`\`json
{
  "components": ${JSON.stringify(components, null, 2)},
  "connections": ${JSON.stringify(connections, null, 2)}
}
\`\`\`

**YOUR TASK**:
Generate a professional engineering analysis that explains this system in narrative form.

1. **Executive Summary**: Start with a high-level overview (2-3 sentences) describing what type of system this is and its primary purpose.

2. **System Workflow Narrative**: Write a detailed paragraph describing the complete process flow from start to finish. Follow the physical path using the connection graph to determine upstream and downstream relationships.

3. **Control Logic Analysis**: Explain the control strategies in paragraph form. Show how instruments send signals to controllers, which then modulate final control elements.

4. **Specifications and Details**: Provide a paragraph summarizing any engineering details visible in the data such as pipe sizes, material specifications, equipment ratings, or special notes.

**REMEMBER**: 
- Write as a human engineer, not as a detection system
- NO mentions of detection metrics, confidence scores, or component counts
- Focus on HOW the system works, not WHAT was detected
- Only reference components that actually exist in the provided data
`;

        // LIFECYCLE: Sending to AI
        console.log(`[Stage 2] Job ${jobId} - Sending to AI (model: ${AI_MODEL_DEFAULT})...`);
        const aiStart = Date.now();
        
        // OPTIMIZED TOKEN BUDGET: Calculate based on component count
        // Uses configurable values from environment variables
        const componentCount = components.length;
        const maxOutputTokens = Math.min(
          BASE_OUTPUT_TOKENS + (componentCount * TOKENS_PER_COMPONENT),
          MAX_OUTPUT_TOKENS_CAP
        );
        
        console.log(`[Stage 2] Job ${jobId} - Token budget: ${maxOutputTokens} tokens (${componentCount} components × ${TOKENS_PER_COMPONENT} + ${BASE_OUTPUT_TOKENS} base, cap: ${MAX_OUTPUT_TOKENS_CAP})`);
        
        // OPTIMIZED THINKING BUDGET: Dynamic based on complexity
        const thinkingBudget = Math.min(
          BASE_THINKING_TOKENS + (componentCount * THINKING_TOKENS_PER_COMPONENT),
          MAX_THINKING_TOKENS_CAP
        );
        console.log(`[Stage 2] Job ${jobId} - Thinking budget: ${thinkingBudget} tokens`);
        
        // Configure AI with timeout support and response schema
        const geminiModel = genAI.getGenerativeModel({ 
          model: AI_MODEL_DEFAULT,
          generationConfig: { 
            responseMimeType: 'application/json',
            responseSchema: FINAL_ANALYSIS_RESPONSE_SCHEMA,
            temperature: 0.2,
            maxOutputTokens: maxOutputTokens
          },
          systemInstruction: FINAL_ANALYSIS_SYSTEM_INSTRUCTION
        });

        console.log(`[Stage 2] Job ${jobId} - AI timeout configured: ${DEFAULT_AI_TIMEOUT_MS}ms`);
        
        const result = await Promise.race([
          geminiModel.generateContent(prompt),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`AI generation timeout after ${DEFAULT_AI_TIMEOUT_MS}ms`)), DEFAULT_AI_TIMEOUT_MS)
          )
        ]);
        
        const aiDuration = Date.now() - aiStart;
        console.log(`[Stage 2] Job ${jobId} - AI Response received in ${aiDuration}ms`);

        // LIFECYCLE: Parsing Response
        const text = (result && result.response && typeof result.response.text === 'function') 
          ? result.response.text() 
          : (result && result.text) || '{}';

        // Log response length for debugging truncation issues
        console.log(`[Stage 2] Job ${jobId} - Response length: ${text.length} characters`);
        if (text.length > 500) {
          console.log(`[Stage 2] Job ${jobId} - Response preview (first 200 chars): ${text.substring(0, 200)}...`);
          console.log(`[Stage 2] Job ${jobId} - Response preview (last 200 chars): ...${text.substring(text.length - 200)}`);
        }

        let parsed = {};
        try { 
          parsed = JSON.parse(text); 
          console.log(`[Stage 2] Job ${jobId} - JSON parsed successfully`);
        } catch (e) { 
          console.warn(`[Stage 2] Job ${jobId} - JSON parse error: ${e.message}`);
          console.warn(`[Stage 2] Job ${jobId} - Attempting fallback extraction...`);
          
          // Try multiple extraction strategies in order of preference
          let extracted = null;
          
          // Strategy 1: Extract JSON from markdown code blocks (```json ... ```)
          // Matches content between code block markers, excluding additional backticks
          // Note: If JSON contains backticks in strings, this may not match completely,
          // but Strategy 2 (balanced braces) will handle it as fallback
          const codeBlockMatch = text.match(/```(?:json)?\s*(\{(?:[^`]|`(?!``))*\})\s*```/);
          if (codeBlockMatch) {
            extracted = codeBlockMatch[1].trim();
            console.log(`[Stage 2] Job ${jobId} - Found JSON in markdown code block`);
          }
          
          // Strategy 2: Find the first complete JSON object (non-greedy, balanced braces)
          if (!extracted) {
            // Find the first { and then match balanced braces
            const firstBrace = text.indexOf('{');
            if (firstBrace !== -1) {
              let braceCount = 0;
              let inString = false;
              let escapeNext = false;
              let endIndex = -1;
              
              for (let i = firstBrace; i < text.length; i++) {
                const char = text[i];
                
                // Handle escape sequences
                if (escapeNext) {
                  escapeNext = false;
                  continue;
                }
                
                if (char === '\\') {
                  escapeNext = true;
                  continue;
                }
                
                // Toggle string context on unescaped quotes
                if (char === '"') {
                  inString = !inString;
                  continue;
                }
                
                // Only count braces outside of strings
                if (!inString) {
                  if (char === '{') braceCount++;
                  if (char === '}') {
                    braceCount--;
                    if (braceCount === 0) {
                      endIndex = i + 1;
                      break;
                    }
                  }
                }
              }
              
              if (endIndex > firstBrace) {
                extracted = text.substring(firstBrace, endIndex);
                console.log(`[Stage 2] Job ${jobId} - Extracted balanced JSON object (${extracted.length} chars)`);
              }
            }
          }
          
          // Strategy 3: Greedy match as last resort (original behavior)
          if (!extracted) {
            const greedyMatch = text.match(/\{[\s\S]*\}/);
            if (greedyMatch) {
              extracted = greedyMatch[0];
              console.log(`[Stage 2] Job ${jobId} - Using greedy regex match (${extracted.length} chars)`);
            }
          }
          
          if (extracted) {
            try {
              parsed = JSON.parse(extracted);
              console.log(`[Stage 2] Job ${jobId} - Fallback extraction successful`);
            } catch (e2) {
              console.error(`[Stage 2] Job ${jobId} - Fallback extraction parsing failed: ${e2.message}`);
              console.error(`[Stage 2] Job ${jobId} - Extracted text preview: ${extracted.substring(0, 200)}...`);
              parsed = { 
                raw: text, 
                error: 'Could not parse JSON response',
                parseError: e2.message,
                extractedText: extracted.substring(0, EXTRACTED_TEXT_PREVIEW_LENGTH) // Include preview of what was extracted
              };
            }
          } else {
            console.error(`[Stage 2] Job ${jobId} - No JSON structure found in response`);
            parsed = { raw: text, error: 'No JSON structure found in response' };
          }
        }

        // Validate that parsed response has required fields
        // Use the schema's required fields definition directly
        const requiredFields = FINAL_ANALYSIS_RESPONSE_SCHEMA.required;
        const missingFields = requiredFields.filter(field => !parsed[field] || parsed[field].length === 0);
        
        if (missingFields.length > 0) {
          console.warn(`[Stage 2] Job ${jobId} - Response missing required fields: ${missingFields.join(', ')}`);
          console.warn(`[Stage 2] Job ${jobId} - This may indicate response truncation or incomplete generation`);
          
          // If response appears truncated (has error field or missing required fields), log for debugging
          if (parsed.error || missingFields.length > 2) {
            console.error(`[Stage 2] Job ${jobId} - Response may be truncated or malformed`);
            console.error(`[Stage 2] Job ${jobId} - Parsed keys: ${Object.keys(parsed).join(', ')}`);
          }
        } else {
          console.log(`[Stage 2] Job ${jobId} - Response validation passed, all required fields present`);
        }

        // LIFECYCLE: Saving to DB (simulated - in-memory store)
        const dbStart = Date.now();
        job.status = 'completed'; 
        job.result = parsed; 
        job.endTime = Date.now();
        job.performance = {
          total: job.endTime - perfStart,
          minification: minifyDuration,
          ai_inference: aiDuration,
          db_save: Date.now() - dbStart,
          stats: stats
        };
        analysisJobs.set(jobId, job);
        const dbDuration = Date.now() - dbStart;
        
        // LIFECYCLE: Job Complete
        console.log(`[Stage 2] Job ${jobId} - Status: COMPLETED`);
        console.log(`[Stage 2] Job ${jobId} - Performance: Total=${job.performance.total}ms, AI=${aiDuration}ms, Minify=${minifyDuration}ms, DB=${dbDuration}ms`);
        
        // Update project store with final report
        const project = projectsStore.get(job.projectId);
        if (project) {
          project.status = 'completed';
          // Normalize and save canonical final report (keep raw payload)
          try {
            project.finalReport = normalizeFinalReport(parsed);
          } catch (e) {
            project.finalReport = { _raw: parsed };
          }
          project.lastUpdated = Date.now();
          projectsStore.set(job.projectId, project);
          console.log(`[Stage 2] Project ${job.projectId} - Final report saved`);
        }
        
        io.emit('analysis-job-update', { jobId, status: 'completed', result: parsed });
        
      } catch (err) {
        // PHASE 3: Explicit Failure States - Never hang silently
        const errorMessage = err && err.message ? err.message : String(err);
        console.error(`[Stage 2] Job ${jobId} - Status: FAILED - ${errorMessage}`);
        console.error(`[Stage 2] Job ${jobId} - Error stack:`, err && err.stack);
        
        job.status = 'failed'; 
        job.error = errorMessage; 
        job.endTime = Date.now();
        job.performance = {
          total: job.endTime - perfStart,
          failedAt: 'See error message'
        };
        analysisJobs.set(jobId, job);
        
        // Update project store with failed status
        const project = projectsStore.get(job.projectId);
        if (project) {
          project.status = 'failed';
          project.error = errorMessage;
          project.lastUpdated = Date.now();
          projectsStore.set(job.projectId, project);
        }
        
        // Emit failure to frontend so UI stops polling and shows error
        io.emit('analysis-job-update', { jobId, status: 'failed', error: errorMessage });
      }
    })();
  } catch (err) {
    console.error(`[Stage 2] Queue endpoint error:`, err);
    res.status(500).json({ error: err.message || String(err) });
  }
});

app.get('/api/analysis/status/:jobId', (req, res) => {
  const job = analysisJobs.get(req.params.jobId);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// Get individual project with status and finalReport
app.get('/api/projects/:id', (req, res) => {
  const { id } = req.params;
  const project = projectsStore.get(id);
  
  if (!project) {
    // Create a new project if it doesn't exist
    const newProject = {
      id,
      name: id,
      status: 'idle',
      finalReport: null,
      lastUpdated: Date.now()
    };
    projectsStore.set(id, newProject);
    return res.json(newProject);
  }
  
  res.json(project);
});

// --- 4. Project & File Management ---

function inferFileType(name) {
  const ext = path.extname(name || '').toLowerCase().replace('.', '');
  if (!ext) return 'unknown';
  if (['pdf','png','jpg','jpeg','gif'].includes(ext)) return ext;
  if (['dwg','dxf'].includes(ext)) return 'dwg';
  if (['json','geojson'].includes(ext)) return 'json';
  return ext;
}

// List Projects (Top-level folders in ROOT)
app.get('/api/projects', async (req, res) => {
  try {
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    const projects = entries
      .filter(ent => ent.isDirectory() && !ent.name.startsWith('.'))
      .map(ent => ({ id: ent.name, name: ent.name, root: ent.name }));
    
    // Default fallback if empty
    if (projects.length === 0) projects.push({ id: 'default', name: 'Default Project', root: '.' });
    
    res.json({ projects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Project File Tree
app.get('/api/projects/:projectId/tree', async (req, res) => {
  try {
    const { projectId } = req.params;
    const dir = req.query.dir ? String(req.query.dir) : '.';
    
    // Security: Prevent traversal
    const projectRoot = path.join(ROOT, projectId);
    if (!projectRoot.startsWith(ROOT)) return res.status(403).json({ error: 'Access denied' });

    const targetDir = dir === '.' ? projectRoot : path.join(projectRoot, dir);
    if (!targetDir.startsWith(projectRoot)) return res.status(403).json({ error: 'Access denied' });

    const entries = await fs.readdir(targetDir, { withFileTypes: true });
    const children = [];

    for (const ent of entries) {
      if (['node_modules', '.git', 'dist'].includes(ent.name)) continue;
      
      const relPath = path.relative(projectRoot, path.join(targetDir, ent.name)).replace(/\\/g, '/');
      
      if (ent.isDirectory()) {
        children.push({ id: relPath, name: ent.name, type: 'folder' });
      } else {
        children.push({ 
          id: relPath, 
          name: ent.name, 
          type: 'file', 
          fileType: inferFileType(ent.name) 
        });
      }
    }
    
    // Sort folders first
    children.sort((a,b) => (a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'folder' ? -1 : 1));
    
    res.json({ tree: children });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve File Content
app.get('/api/files/content', (req, res) => {
  const { path: relPath, projectId } = req.query;
  if (!relPath) return res.status(400).send('Missing path');
  
  // If projectId is provided, look inside that project, otherwise look in ROOT (legacy support)
  const base = projectId ? path.join(ROOT, String(projectId)) : ROOT;
  const absPath = path.join(base, String(relPath));

  if (!absPath.startsWith(ROOT)) return res.status(403).send('Forbidden');

  res.sendFile(absPath, (err) => {
    if (err) res.status(404).send('Not found');
  });
});

// ============================================================================
// FILE WATCHER & SOCKET.IO
// ============================================================================
const watcher = chokidar.watch(ROOT, { 
  ignored: /(^|[\/\\])\../, // Ignore dotfiles
  ignoreInitial: true, 
  depth: 5 
});

watcher
  .on('add', p => io.emit('file-added', { path: path.relative(ROOT, p).replace(/\\/g, '/') }))
  .on('change', p => io.emit('file-changed', { path: path.relative(ROOT, p).replace(/\\/g, '/') }))
  .on('unlink', p => io.emit('file-removed', { path: path.relative(ROOT, p).replace(/\\/g, '/') }));

io.on('connection', socket => {
  console.log('🔌 Client connected:', socket.id);
  socket.on('disconnect', () => console.log('🔌 Client disconnected:', socket.id));
});

// ============================================================================
// START SERVER
// ============================================================================
server.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`);
  console.log(`Data Root: ${ROOT}`);
  console.log(`AI Provider: ${AI_PROVIDER} (${genAI ? 'Active' : 'Disabled'})`);

  // Mock Mode Status
  if (MOCK_MODE_ENABLED) {
    console.log(`Mock Mode: ENABLED (using ${MOCK_DATA_PATH})`);
    console.log(`Simulated latency: ${MOCK_MODE_DELAY_MS}ms`);
    console.warn('WARNING: Mock mode is active. AI inference is bypassed.');
  } else {
    console.log(`Mock Mode: DISABLED (live AI inference)`);
  }
});