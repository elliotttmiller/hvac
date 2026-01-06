PS D:\AMD\secrets\hvac\extra\hvac> & C:/Users/AMD/AppData/Local/Programs/Python/Python311/python.exe d:/AMD/secrets/hvac/extra/hvac/start.py
[INFO] ======================================================================
[INFO] HVAC AI Platform - Startup Script v2.0
[INFO] ======================================================================
[INFO] Started: 2026-01-06 21:11:55 UTC
[INFO] Working Directory: D:\AMD\secrets\hvac\extra\hvac
[INFO] Log File: D:\AMD\secrets\hvac\extra\hvac\logs\start.log
[INFO] 
[INFO] Skipping pre-flight validations (startup summary mode)
[INFO] Full verbose logs are still written to the rotating log file
[INFO] 
[INFO] Found local API server entry, starting backend + frontend dev servers
[INFO] Passthrough mode: ENABLED
[INFO] Starting development and API servers...
[INFO] Frontend development server started.
[INFO] Backend API server started.

> hvac-ai-platform@0.0.0 dev
> vite


> hvac-ai-platform@0.0.0 dev:api
> node server/index.cjs

[dotenv@17.2.3] injecting env (32) from .env -- tip: ⚙️  write to custom object with { processEnv: myObject }

  VITE v6.4.1  ready in 487 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://172.30.208.1:3000/
  ➜  Network: http://192.168.0.163:3000/
  ➜  press h + enter to show help
✅ AI Proxy Initialized. Model: gemini-2.5-flash

Server running at http://localhost:4000
Data Root: D:\AMD\secrets\hvac\extra\hvac\server\data
AI Provider: gemini (Active)
Mock Mode: DISABLED (live AI inference)
AI Vision Request -> model=gemini-2.5-flash imageSize=327904 mimeType=image/png responseMimeType=unset
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: PID
AI Vision Request -> model=gemini-2.5-flash imageSize=327904 mimeType=image/png responseMimeType=application/json
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: {
  "components": [
    {
      "id": "FIT_27216A",
      "label": "1FIT 27216A",
      "type": "instrument_indicator_transmitter",
      "bbox": [0.200, 0.090, 0.270, 0.150],
      "confidence": 1.0,...
[Stage 2] Job analysis-job-1-1767734056545 queued for document 1767733939694-txa3a1z5x
[Stage 2] Job analysis-job-1-1767734056545 - Status: RUNNING
[Stage 2] Job analysis-job-1-1767734056545 - Minifying payload...
   [Minification] Token reduction: 83.1% (56494 → 9566 bytes)
   [Minification] Components: 51, Connections: 30, Ghosts filtered: 0
[Stage 2] Job analysis-job-1-1767734056545 - Minification complete in 2ms
[Stage 2] Job analysis-job-1-1767734056545 - Sending to AI (model: gemini-2.5-flash)...
[Stage 2] Job analysis-job-1-1767734056545 - Token budget: 4096 tokens (51 components × 75 + 500 base, cap: 4096)
[Stage 2] Job analysis-job-1-1767734056545 - Thinking budget: 6144 tokens
[Stage 2] Job analysis-job-1-1767734056545 - AI timeout configured: 180000ms
[Stage 2] Job analysis-job-1-1767734056545 - AI Response received in 15010ms
[Stage 2] Job analysis-job-1-1767734056545 - Status: COMPLETED
[Stage 2] Job analysis-job-1-1767734056545 - Performance: Total=15017ms, AI=15010ms, Minify=2ms, DB=0ms
[Stage 2] Project default - Final report saved




Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document displays numerous instrumentation symbols (circles, diamonds, squares) and process flow lines indicating hydraulic supply and return, along with control logic. This aligns perfectly with the definition of a SCHEMATIC, specifically resembling a P&ID or control diagram."}]
index.ts:34 Step 2: Routing to pipeline...
index.ts:34 ["Selected pipeline:","visual"]
index.ts:34 Step 3: Executing pipeline...
visual.ts:79 Detecting blueprint type (P&ID vs HVAC)...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
visual.ts:81 Blueprint type detected: PID
visual.ts:92 Using standard single-pass analysis
visual.ts:97 [Visual Pipeline] Applying enhancements...
visual-enhancements.ts:44 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:51 [Enhancement] Normalizing component and connection types...
12type-normalization.ts:155  [Type Normalization] Unknown connection type: "signal_connection", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:155
16type-normalization.ts:155  [Type Normalization] Unknown connection type: "process_connection", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:155
visual-enhancements.ts:54 [Enhancement] Type normalization complete
visual-enhancements.ts:59 [Enhancement] Applying spatial association to merge orphaned labels...
spatial-association.ts:330 [Spatial Association] Starting spatial association post-processing...
spatial-association.ts:196 [Spatial Association] Starting orphaned label detection...
spatial-association.ts:213 [Spatial Association] Found 0 orphaned labels, 1 unlabeled components, 50 already labeled
spatial-association.ts:220 [Spatial Association] No merging needed
spatial-association.ts:341 [Spatial Association] Post-processing complete in 0ms: 51 → 51 components (0 merged)
visual-enhancements.ts:68 [Enhancement] Spatial association complete: 0 orphaned labels merged, 51 total components remain
visual-enhancements.ts:77 [Enhancement] Applying strict geometric shape validation...
shape-validator.ts:544 [Shape Validator] Starting shape validation...
shape-validator.ts:578 [Shape Validator] All components passed shape validation
shape-validator.ts:595 [Shape Validator] Validation complete: 0/51 validated, 0 corrected
visual-enhancements.ts:80 [Enhancement] Shape validation complete: 0 components corrected
visual-enhancements.ts:87 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:92 [Enhancement] ISA detection complete: 19/51 components have ISA functions (37%)
visual-enhancements.ts:100 [Enhancement] Enhancing connections...
visual-enhancements.ts:106 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:115 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:132 [Enhancement] Validating connections...
visual-enhancements.ts:152 [Enhancement] Detecting control loops...
visual-enhancements.ts:154 [Enhancement] Detected 0 control loops
visual-enhancements.ts:158 [Enhancement] Post-processing complete in 7ms
visual.ts:109 [Visual Pipeline] Quality Score: 0.70
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767733939694-txa3a1z5x","type":"SCHEMATIC","processing_time_ms":116305,"components":51}]
BlueprintWorkspace.tsx:222 Stage 1 (Visual Analysis) complete: Objectcache_hit: falseclassification: confidence: 1reasoning: "The document displays numerous instrumentation symbols (circles, diamonds, squares) and process flow lines indicating hydraulic supply and return, along with control logic. This aligns perfectly with the definition of a SCHEMATIC, specifically resembling a P&ID or control diagram."type: "SCHEMATIC"[[Prototype]]: Objectdocument_id: "1767733939694-txa3a1z5x"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 116305timestamp: 1767734055999visual: components: Array(51)0: {id: 'FIT_27216A', type: 'instrument_indicator_transmitter', label: '1FIT 27216A', bbox: Array(4), confidence: 1, …}1: {id: 'FIT_27216B', type: 'instrument_indicator_transmitter', label: '1FIT 27216B', bbox: Array(4), confidence: 1, …}2: {id: 'GV_27216_TL', type: 'valve_gate', label: '3/4"', bbox: Array(4), confidence: 1, …}3: {id: 'GV_27216_BL', type: 'valve_gate', label: '3/4"', bbox: Array(4), confidence: 1, …}4: {id: 'GV_27216_TR', type: 'valve_gate', label: '3/4"', bbox: Array(4), confidence: 1, …}5: {id: 'GV_27216_BR', type: 'valve_gate', label: '3/4"', bbox: Array(4), confidence: 1, …}6: {id: 'FE_27216', type: 'sensor_flow', label: '1FE 27216', bbox: Array(4), confidence: 1, …}7: {id: 'TIT_27217A', type: 'instrument_indicator_transmitter', label: '1TIT 27217A', bbox: Array(4), confidence: 1, …}8: {id: 'TE_27217A', type: 'sensor_temperature', label: '1TE 27217A', bbox: Array(4), confidence: 1, …}9: {id: 'TE_27217B', type: 'sensor_temperature', label: '1TE 27217B', bbox: Array(4), confidence: 1, …}10: {id: 'PIT_27218A', type: 'instrument_indicator_transmitter', label: '1PIT 27218A', bbox: Array(4), confidence: 1, …}11: {id: 'PIT_27218B', type: 'instrument_indicator_transmitter', label: '1PIT 27218B', bbox: Array(4), confidence: 1, …}12: {id: 'PIT_27219A', type: 'instrument_indicator_transmitter', label: '1PIT 27219A', bbox: Array(4), confidence: 1, …}13: {id: 'PIT_27219B', type: 'instrument_indicator_transmitter', label: '1PIT 27219B', bbox: Array(4), confidence: 1, …}14: {id: 'HS_27221', type: 'instrument_switch', label: '1HS 27221', bbox: Array(4), confidence: 1, …}15: {id: 'HS_27225A', type: 'instrument_switch', label: '1HS 27225A', bbox: Array(4), confidence: 1, …}16: {id: 'VFD', type: 'equipment_drive', label: 'VFD', bbox: Array(4), confidence: 1, …}17: {id: 'LOGIC_1I_TOP', type: 'logic_function', label: '1I', bbox: Array(4), confidence: 1, …}18: {id: 'LOGIC_1I_BOTTOM', type: 'logic_function', label: '1I', bbox: Array(4), confidence: 1, …}19: {id: 'MOTOR', type: 'equipment_motor', label: 'M', bbox: Array(4), confidence: 1, …}20: {id: 'CHECK_VALVE', type: 'valve_check', label: 'unknown', bbox: Array(4), confidence: 1, …}21: {id: 'EQUIPMENT_1C_2803', type: 'equipment', label: '1C-2803', bbox: Array(4), confidence: 0.9, …}22: {id: 'TP_904', type: 'instrument_test_point', label: 'TP904', bbox: Array(4), confidence: 0.8, …}23: {id: 'OFF_PAGE_27175', type: 'off_page_connection', label: '27175', bbox: Array(4), confidence: 0.9, …}24: {id: 'OFF_PAGE_27217B_TOP', type: 'off_page_connection', label: '27217B', bbox: Array(4), confidence: 0.9, …}25: {id: 'JUNCTION_MANUAL_AUTO', type: 'signal_junction', label: 'MANUAL/AUTO', bbox: Array(4), confidence: 0.8, …}26: {id: 'JUNCTION_HAO', type: 'signal_junction', label: 'HAO', bbox: Array(4), confidence: 0.8, …}27: {id: 'OFF_PAGE_RIGHT_TYPE39', type: 'off_page_connection', label: 'TYPE 39', bbox: Array(4), confidence: 0.8, …}28: {id: 'OFF_PAGE_RIGHT_TYPE15', type: 'off_page_connection', label: 'TYPE 15', bbox: Array(4), confidence: 0.8, …}29: {id: 'OFF_PAGE_RIGHT_HH', type: 'off_page_connection', label: 'HH', bbox: Array(4), confidence: 0.8, …}30: {id: 'OFF_PAGE_RIGHT_HH_2', type: 'off_page_connection', label: 'HH', bbox: Array(4), confidence: 0.8, …}31: {id: 'PROCESS_LINE_1VA_271219', type: 'process_line', label: '1VA-271219', bbox: Array(4), confidence: 0.9, …}32: {id: 'PROCESS_LINE_1VA_271221', type: 'process_line', label: '1VA-271221', bbox: Array(4), confidence: 0.9, …}33: {id: 'PROCESS_LINE_1VA_271220', type: 'process_line', label: '1VA-271220', bbox: Array(4), confidence: 0.9, …}34: {id: 'PROCESS_LINE_1VA_271222', type: 'process_line', label: '1VA-271222', bbox: Array(4), confidence: 0.9, …}35: {id: 'PROCESS_LINE_1VA_271223', type: 'process_line', label: '1VA-271223', bbox: Array(4), confidence: 0.9, …}36: {id: 'PROCESS_LINE_1VA_271224', type: 'process_line', label: '1VA-271224', bbox: Array(4), confidence: 0.9, …}37: {id: 'PROCESS_LINE_1VA_271225', type: 'process_line', label: '1VA-271225', bbox: Array(4), confidence: 0.9, …}38: {id: 'PROCESS_LINE_1VA_271958', type: 'process_line', label: '1VA-271958', bbox: Array(4), confidence: 0.9, …}39: {id: 'PROCESS_LINE_1VA_271959', type: 'process_line', label: '1VA-271959', bbox: Array(4), confidence: 0.9, …}40: {id: 'PROCESS_LINE_1VA_270042', type: 'process_line', label: '1VA-270042', bbox: Array(4), confidence: 0.9, …}41: {id: 'PROCESS_LINE_101R1', type: 'process_line_identifier', label: '101R1', bbox: Array(4), confidence: 0.9, …}42: {id: 'PROCESS_LINE_101F1', type: 'process_line_identifier', label: '101F1', bbox: Array(4), confidence: 0.9, …}43: {id: 'PROCESS_LINE_LOW_POINT', type: 'process_line_feature', label: 'LOW POINT', bbox: Array(4), confidence: 0.9, …}44: {id: 'PROCESS_LINE_36x26', type: 'process_line_dimension', label: '36"x26"', bbox: Array(4), confidence: 0.9, …}45: {id: 'PROCESS_LINE_42x38x42', type: 'process_line_dimension', label: '42"x38"54"x42"', bbox: Array(4), confidence: 0.9, …}46: {id: 'NOTE_6_TOP', type: 'annotation_note', label: 'NOTE 6', bbox: Array(4), confidence: 0.9, …}47: {id: 'NOTE_6_BOTTOM', type: 'annotation_note', label: 'NOTE 6', bbox: Array(4), confidence: 0.9, …}48: {id: 'NOTE_2', type: 'annotation_note', label: 'NOTE 2', bbox: Array(4), confidence: 0.9, …}49: {id: 'NOTE_4', type: 'annotation_note', label: 'NOTE 4', bbox: Array(4), confidence: 0.9, …}50: {id: 'NOTE_7', type: 'annotation_note', label: 'NOTE 7', bbox: Array(4), confidence: 0.9, …}length: 51[[Prototype]]: Array(0)connections: Array(30)0: {id: '1767734055984-xfla45o5d', from_id: 'FIT_27216A', to_id: 'OFF_PAGE_27175', type: 'unknown', confidence: 0.9, …}1: {id: '1767734055984-vspuou0d4', from_id: 'FIT_27216B', to_id: 'OFF_PAGE_27175', type: 'unknown', confidence: 0.9, …}2: {id: '1767734055984-7ewslicyy', from_id: 'TIT_27217A', to_id: 'OFF_PAGE_27217B_TOP', type: 'unknown', confidence: 0.9, …}3: {id: '1767734055984-sb8ra56zp', from_id: 'TE_27217A', to_id: 'TIT_27217A', type: 'unknown', confidence: 0.8, …}4: {id: '1767734055984-9itag61wt', from_id: 'TE_27217B', to_id: 'OFF_PAGE_27217B_TOP', type: 'unknown', confidence: 0.9, …}5: {id: '1767734055984-f64pvcxio', from_id: 'HS_27221', to_id: 'JUNCTION_MANUAL_AUTO', type: 'unknown', confidence: 0.9, …}6: {id: '1767734055984-ofkz7ri7c', from_id: 'HS_27225A', to_id: 'JUNCTION_HAO', type: 'unknown', confidence: 0.9, …}7: {id: '1767734055984-tkbgk637t', from_id: 'JUNCTION_MANUAL_AUTO', to_id: 'VFD', type: 'unknown', confidence: 0.8, …}8: {id: '1767734055984-h4p2nbfk5', from_id: 'JUNCTION_HAO', to_id: 'VFD', type: 'unknown', confidence: 0.8, …}9: {id: '1767734055984-i09qtvn71', from_id: 'VFD', to_id: 'MOTOR', type: 'electric', confidence: 0.9, …}10: {id: '1767734055984-plympxiom', from_id: 'VFD', to_id: 'LOGIC_1I_TOP', type: 'unknown', confidence: 0.9, …}11: {id: '1767734055984-cjclu6e9x', from_id: 'LOGIC_1I_TOP', to_id: 'LOGIC_1I_BOTTOM', type: 'unknown', confidence: 0.9, …}12: {id: '1767734055984-k5o1058f5', from_id: 'LOGIC_1I_BOTTOM', to_id: 'OFF_PAGE_RIGHT_TYPE39', type: 'unknown', confidence: 0.8, …}13: {id: '1767734055984-9lysmfrqh', from_id: 'EQUIPMENT_1C_2803', to_id: 'MOTOR', type: 'control_signal', confidence: 0.8, …}14: {id: '1767734055984-3tfk91ogn', from_id: 'MOTOR', to_id: 'CHECK_VALVE', type: 'unknown', confidence: 0.9, …}15: {id: '1767734055984-t8tygty9j', from_id: 'TP_904', to_id: 'PROCESS_LINE_1VA_270042', type: 'unknown', confidence: 0.9, …}16: {id: '1767734055984-4dw8yk8nm', from_id: 'GV_27216_TL', to_id: 'PROCESS_LINE_1VA_271219', type: 'unknown', confidence: 0.9, …}17: {id: '1767734055984-2jh7gurlo', from_id: 'GV_27216_BL', to_id: 'PROCESS_LINE_1VA_271221', type: 'unknown', confidence: 0.9, …}18: {id: '1767734055984-41k86owwj', from_id: 'GV_27216_TR', to_id: 'PROCESS_LINE_1VA_271220', type: 'unknown', confidence: 0.9, …}19: {id: '1767734055984-jl4m0d4rl', from_id: 'GV_27216_BR', to_id: 'PROCESS_LINE_1VA_271222', type: 'unknown', confidence: 0.9, …}20: {id: '1767734055984-2nbb0zl65', from_id: 'PROCESS_LINE_1VA_271219', to_id: 'FIT_27216A', type: 'unknown', confidence: 0.9, …}21: {id: '1767734055984-qhg2ibwhu', from_id: 'PROCESS_LINE_1VA_271220', to_id: 'TIT_27217A', type: 'unknown', confidence: 0.9, …}22: {id: '1767734055984-8gi0t824r', from_id: 'PROCESS_LINE_1VA_271220', to_id: 'TE_27217A', type: 'unknown', confidence: 0.9, …}23: {id: '1767734055984-iyfjc20pi', from_id: 'PROCESS_LINE_1VA_271220', to_id: 'TE_27217B', type: 'unknown', confidence: 0.9, …}24: {id: '1767734055984-7a5w4ai7w', from_id: 'PROCESS_LINE_1VA_271221', to_id: 'FIT_27216B', type: 'unknown', confidence: 0.9, …}25: {id: '1767734055984-b2d9wj0mu', from_id: 'PROCESS_LINE_1VA_271222', to_id: 'FE_27216', type: 'unknown', confidence: 0.9, …}26: {id: '1767734055984-62r382hmv', from_id: 'PROCESS_LINE_1VA_271223', to_id: 'PIT_27218A', type: 'unknown', confidence: 0.9, …}27: {id: '1767734055984-7grzcbn35', from_id: 'PROCESS_LINE_1VA_271224', to_id: 'PIT_27218B', type: 'unknown', confidence: 0.9, …}28: {id: '1767734055984-arxyqd8vg', from_id: 'PROCESS_LINE_1VA_271225', to_id: 'PIT_27219A', type: 'unknown', confidence: 0.9, …}29: {id: '1767734055984-3vpnaqmae', from_id: 'PROCESS_LINE_1VA_271958', to_id: 'PIT_27219B', type: 'unknown', confidence: 0.9, …}length: 30[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 7inferred_connections: 0isa_detection_enabled: trueisa_detection_rate: 0.37254901960784315isa_functions_detected: 19loop_detection_enabled: trueorphaned_labels_merged: 0shape_validation_enabled: trueshape_violations_corrected: 0spatial_association_enabled: truevalidation_enabled: truevalidation_issues: 0[[Prototype]]: Objectprocess_log: undefinedquality_metrics: confidence_avg: 0.9274509803921563connection_coverage: 0.5882352941176471detection_quality: 0.8627450980392157isa_completeness: 0.37254901960784315metrics: avg_confidence: 0.9274509803921563excellent_detections: 44isa_functions_detected: 19total_components: 51total_connections: 30[[Prototype]]: Objectoverall_score: 0.7047058823529411[[Prototype]]: Objecttotal_components: 51total_connections: 30validation_issues: Array(0)length: 0[[Prototype]]: Array(0)[[Prototype]]: Object[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:259 [Stage 2] Starting background analysis...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:280 [Stage 2] Background job queued: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:259 [Stage 2] Queuing background analysis on server...
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767734056191
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: completed
BlueprintWorkspace.tsx:143 [Polling] Project completed! Setting final analysis report
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll


Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document displays numerous instrumentation symbols (circles, diamonds, squares) and process flow lines indicating hydraulic supply and return, along with control logic. This aligns perfectly with the definition of a SCHEMATIC, specifically resembling a P&ID or control diagram."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767733939694-txa3a1z5x","type":"SCHEMATIC","processing_time_ms":116305,"components":51}]

{
  "document_id": "1767733939694-txa3a1z5x",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767734055999,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document displays numerous instrumentation symbols (circles, diamonds, squares) and process flow lines indicating hydraulic supply and return, along with control logic. This aligns perfectly with the definition of a SCHEMATIC, specifically resembling a P&ID or control diagram."
  },
  "processing_time_ms": 116305,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "FIT_27216A",
        "type": "instrument_indicator_transmitter",
        "label": "1FIT 27216A",
        "bbox": [
          0.2,
          0.09,
          0.27,
          0.15
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'FIT' follows ISA-5.1 positional grammar (F=Flow, I=Indicator, T=Transmitter), confirming it's a Flow Indicating Transmitter.",
          "description": "Flow Indicating Transmitter",
          "tag": "1FIT",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.2,
            0.09,
            0.27,
            0.15
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.982Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.2,
                  0.09,
                  0.27,
                  0.15
                ],
                "normalized_bbox": [
                  0.2,
                  0.09,
                  0.27,
                  0.15
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1FIT-27216A (type: instrument_indicator_transmitter)"
        }
      },
      {
        "id": "FIT_27216B",
        "type": "instrument_indicator_transmitter",
        "label": "1FIT 27216B",
        "bbox": [
          0.2,
          0.38,
          0.27,
          0.44
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'FIT' follows ISA-5.1 positional grammar (F=Flow, I=Indicator, T=Transmitter), confirming it's a Flow Indicating Transmitter.",
          "description": "Flow Indicating Transmitter",
          "tag": "1FIT",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.2,
            0.38,
            0.27,
            0.44
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.2,
                  0.38,
                  0.27,
                  0.44
                ],
                "normalized_bbox": [
                  0.2,
                  0.38,
                  0.27,
                  0.44
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1FIT-27216B (type: instrument_indicator_transmitter)"
        }
      },
      {
        "id": "GV_27216_TL",
        "type": "valve_gate",
        "label": "3/4\"",
        "bbox": [
          0.26,
          0.2,
          0.3,
          0.24
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a bowtie shape with an empty interior, which is the visual signature for a Gate Valve. The label '3/4\"' indicates its size.",
          "description": "Gate Valve, 3/4 inch",
          "raw_backend_output": [
            0.26,
            0.2,
            0.3,
            0.24
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.26,
                  0.2,
                  0.3,
                  0.24
                ],
                "normalized_bbox": [
                  0.26,
                  0.2,
                  0.3,
                  0.24
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 3/4\" (type: valve_gate)"
        }
      },
      {
        "id": "GV_27216_BL",
        "type": "valve_gate",
        "label": "3/4\"",
        "bbox": [
          0.26,
          0.25,
          0.3,
          0.29
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a bowtie shape with an empty interior, which is the visual signature for a Gate Valve. The label '3/4\"' indicates its size.",
          "description": "Gate Valve, 3/4 inch",
          "raw_backend_output": [
            0.26,
            0.25,
            0.3,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.26,
                  0.25,
                  0.3,
                  0.29
                ],
                "normalized_bbox": [
                  0.26,
                  0.25,
                  0.3,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 3/4\" (type: valve_gate)"
        }
      },
      {
        "id": "GV_27216_TR",
        "type": "valve_gate",
        "label": "3/4\"",
        "bbox": [
          0.3,
          0.2,
          0.34,
          0.24
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a bowtie shape with an empty interior, which is the visual signature for a Gate Valve. The label '3/4\"' indicates its size.",
          "description": "Gate Valve, 3/4 inch",
          "raw_backend_output": [
            0.3,
            0.2,
            0.34,
            0.24
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.2,
                  0.34,
                  0.24
                ],
                "normalized_bbox": [
                  0.3,
                  0.2,
                  0.34,
                  0.24
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 3/4\" (type: valve_gate)"
        }
      },
      {
        "id": "GV_27216_BR",
        "type": "valve_gate",
        "label": "3/4\"",
        "bbox": [
          0.3,
          0.25,
          0.34,
          0.29
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a bowtie shape with an empty interior, which is the visual signature for a Gate Valve. The label '3/4\"' indicates its size.",
          "description": "Gate Valve, 3/4 inch",
          "raw_backend_output": [
            0.3,
            0.25,
            0.34,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.25,
                  0.34,
                  0.29
                ],
                "normalized_bbox": [
                  0.3,
                  0.25,
                  0.34,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 3/4\" (type: valve_gate)"
        }
      },
      {
        "id": "FE_27216",
        "type": "sensor_flow",
        "label": "1FE 27216",
        "bbox": [
          0.39,
          0.38,
          0.46,
          0.44
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'FE' follows ISA-5.1 positional grammar (F=Flow, E=Primary Element), confirming it's a Flow Primary Element.",
          "description": "Flow Primary Element",
          "tag": "1FE",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.39,
            0.38,
            0.46,
            0.44
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.38,
                  0.46,
                  0.44
                ],
                "normalized_bbox": [
                  0.39,
                  0.38,
                  0.46,
                  0.44
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Flow",
          "isa_modifier": "Transmit",
          "isa_confidence": 0.85,
          "isa_reasoning": "Inferred from component type: sensor_flow"
        }
      },
      {
        "id": "TIT_27217A",
        "type": "instrument_indicator_transmitter",
        "label": "1TIT 27217A",
        "bbox": [
          0.39,
          0.09,
          0.46,
          0.15
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'TIT' follows ISA-5.1 positional grammar (T=Temperature, I=Indicator, T=Transmitter), confirming it's a Temperature Indicating Transmitter.",
          "description": "Temperature Indicating Transmitter",
          "tag": "1TIT",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.39,
            0.09,
            0.46,
            0.15
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.09,
                  0.46,
                  0.15
                ],
                "normalized_bbox": [
                  0.39,
                  0.09,
                  0.46,
                  0.15
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1TIT-27217A (type: instrument_indicator_transmitter)"
        }
      },
      {
        "id": "TE_27217A",
        "type": "sensor_temperature",
        "label": "1TE 27217A",
        "bbox": [
          0.39,
          0.2,
          0.46,
          0.26
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'TE' follows ISA-5.1 positional grammar (T=Temperature, E=Primary Element), confirming it's a Temperature Primary Element.",
          "description": "Temperature Primary Element",
          "tag": "1TE",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.39,
            0.2,
            0.46,
            0.26
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.2,
                  0.46,
                  0.26
                ],
                "normalized_bbox": [
                  0.39,
                  0.2,
                  0.46,
                  0.26
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Temperature",
          "isa_modifier": "Transmit",
          "isa_confidence": 0.85,
          "isa_reasoning": "Inferred from component type: sensor_temperature"
        }
      },
      {
        "id": "TE_27217B",
        "type": "sensor_temperature",
        "label": "1TE 27217B",
        "bbox": [
          0.48,
          0.2,
          0.55,
          0.26
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'TE' follows ISA-5.1 positional grammar (T=Temperature, E=Primary Element), confirming it's a Temperature Primary Element.",
          "description": "Temperature Primary Element",
          "tag": "1TE",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.48,
            0.2,
            0.55,
            0.26
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.2,
                  0.55,
                  0.26
                ],
                "normalized_bbox": [
                  0.48,
                  0.2,
                  0.55,
                  0.26
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Temperature",
          "isa_modifier": "Transmit",
          "isa_confidence": 0.85,
          "isa_reasoning": "Inferred from component type: sensor_temperature"
        }
      },
      {
        "id": "PIT_27218A",
        "type": "instrument_indicator_transmitter",
        "label": "1PIT 27218A",
        "bbox": [
          0.57,
          0.09,
          0.64,
          0.15
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'PIT' follows ISA-5.1 positional grammar (P=Pressure, I=Indicator, T=Transmitter), confirming it's a Pressure Indicating Transmitter.",
          "description": "Pressure Indicating Transmitter",
          "tag": "1PIT",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.57,
            0.09,
            0.64,
            0.15
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.57,
                  0.09,
                  0.64,
                  0.15
                ],
                "normalized_bbox": [
                  0.57,
                  0.09,
                  0.64,
                  0.15
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1PIT-27218A (type: instrument_indicator_transmitter)"
        }
      },
      {
        "id": "PIT_27218B",
        "type": "instrument_indicator_transmitter",
        "label": "1PIT 27218B",
        "bbox": [
          0.66,
          0.09,
          0.73,
          0.15
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'PIT' follows ISA-5.1 positional grammar (P=Pressure, I=Indicator, T=Transmitter), confirming it's a Pressure Indicating Transmitter.",
          "description": "Pressure Indicating Transmitter",
          "tag": "1PIT",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.66,
            0.09,
            0.73,
            0.15
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.66,
                  0.09,
                  0.73,
                  0.15
                ],
                "normalized_bbox": [
                  0.66,
                  0.09,
                  0.73,
                  0.15
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1PIT-27218B (type: instrument_indicator_transmitter)"
        }
      },
      {
        "id": "PIT_27219A",
        "type": "instrument_indicator_transmitter",
        "label": "1PIT 27219A",
        "bbox": [
          0.75,
          0.09,
          0.82,
          0.15
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'PIT' follows ISA-5.1 positional grammar (P=Pressure, I=Indicator, T=Transmitter), confirming it's a Pressure Indicating Transmitter.",
          "description": "Pressure Indicating Transmitter",
          "tag": "1PIT",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.75,
            0.09,
            0.82,
            0.15
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.75,
                  0.09,
                  0.82,
                  0.15
                ],
                "normalized_bbox": [
                  0.75,
                  0.09,
                  0.82,
                  0.15
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1PIT-27219A (type: instrument_indicator_transmitter)"
        }
      },
      {
        "id": "PIT_27219B",
        "type": "instrument_indicator_transmitter",
        "label": "1PIT 27219B",
        "bbox": [
          0.84,
          0.09,
          0.91,
          0.15
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle with text, indicating an instrument. The tag 'PIT' follows ISA-5.1 positional grammar (P=Pressure, I=Indicator, T=Transmitter), confirming it's a Pressure Indicating Transmitter.",
          "description": "Pressure Indicating Transmitter",
          "tag": "1PIT",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.84,
            0.09,
            0.91,
            0.15
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.84,
                  0.09,
                  0.91,
                  0.15
                ],
                "normalized_bbox": [
                  0.84,
                  0.09,
                  0.91,
                  0.15
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1PIT-27219B (type: instrument_indicator_transmitter)"
        }
      },
      {
        "id": "HS_27221",
        "type": "instrument_switch",
        "label": "1HS 27221",
        "bbox": [
          0.69,
          0.54,
          0.74,
          0.59
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a circle within a square, indicating a shared display/control instrument. The tag 'HS' follows ISA-5.1 positional grammar (H=Hand, S=Switch), denoting a Hand Switch.",
          "description": "Hand Switch",
          "tag": "1HS",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.69,
            0.54,
            0.74,
            0.59
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.54,
                  0.74,
                  0.59
                ],
                "normalized_bbox": [
                  0.69,
                  0.54,
                  0.74,
                  0.59
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1HS-27221 (type: instrument_switch)"
        }
      },
      {
        "id": "HS_27225A",
        "type": "instrument_switch",
        "label": "1HS 27225A",
        "bbox": [
          0.8,
          0.65,
          0.85,
          0.7
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a circle within a square, indicating a shared display/control instrument. The tag 'HS' follows ISA-5.1 positional grammar (H=Hand, S=Switch), denoting a Hand Switch.",
          "description": "Hand Switch",
          "tag": "1HS",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.8,
            0.65,
            0.85,
            0.7
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.8,
                  0.65,
                  0.85,
                  0.7
                ],
                "normalized_bbox": [
                  0.8,
                  0.65,
                  0.85,
                  0.7
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1HS-27225A (type: instrument_switch)"
        }
      },
      {
        "id": "VFD",
        "type": "equipment_drive",
        "label": "VFD",
        "bbox": [
          0.74,
          0.76,
          0.79,
          0.8
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a rectangle with the label 'VFD', which is a common abbreviation for Variable Frequency Drive in HVAC systems.",
          "description": "Variable Frequency Drive",
          "equipment_type": "Variable Frequency Drive",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.74,
            0.76,
            0.79,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.74,
                  0.76,
                  0.79,
                  0.8
                ],
                "normalized_bbox": [
                  0.74,
                  0.76,
                  0.79,
                  0.8
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "VF",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Vibration / Mech. Analysis Ratio / Fraction"
        }
      },
      {
        "id": "LOGIC_1I_TOP",
        "type": "logic_function",
        "label": "1I",
        "bbox": [
          0.82,
          0.76,
          0.86,
          0.8
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Logic Function",
          "raw_backend_output": [
            0.82,
            0.76,
            0.86,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.82,
                  0.76,
                  0.86,
                  0.8
                ],
                "normalized_bbox": [
                  0.82,
                  0.76,
                  0.86,
                  0.8
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1I (type: logic_function)"
        }
      },
      {
        "id": "LOGIC_1I_BOTTOM",
        "type": "logic_function",
        "label": "1I",
        "bbox": [
          0.82,
          0.84,
          0.86,
          0.88
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Logic Function",
          "raw_backend_output": [
            0.82,
            0.84,
            0.86,
            0.88
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.82,
                  0.84,
                  0.86,
                  0.88
                ],
                "normalized_bbox": [
                  0.82,
                  0.84,
                  0.86,
                  0.88
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1I (type: logic_function)"
        }
      },
      {
        "id": "MOTOR",
        "type": "equipment_motor",
        "label": "M",
        "bbox": [
          0.49,
          0.84,
          0.54,
          0.88
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a rectangle with the letter 'M' inside, which is the standard symbol for an electric motor.",
          "description": "Electric Motor",
          "equipment_type": "Motor",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.49,
            0.84,
            0.54,
            0.88
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.84,
                  0.54,
                  0.88
                ],
                "normalized_bbox": [
                  0.49,
                  0.84,
                  0.54,
                  0.88
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "M",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice (Moisture/Humidity)"
        }
      },
      {
        "id": "CHECK_VALVE",
        "type": "valve_check",
        "label": "unknown",
        "bbox": [
          0.55,
          0.84,
          0.58,
          0.88
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid triangle shape, which is the standard symbol for a check valve, indicating flow in one direction.",
          "description": "Check Valve",
          "raw_backend_output": [
            0.55,
            0.84,
            0.58,
            0.88
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.84,
                  0.58,
                  0.88
                ],
                "normalized_bbox": [
                  0.55,
                  0.84,
                  0.58,
                  0.88
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe"
        }
      },
      {
        "id": "EQUIPMENT_1C_2803",
        "type": "equipment",
        "label": "1C-2803",
        "bbox": [
          0.29,
          0.77,
          0.39,
          0.8
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "This label '1C-2803' is placed above a large rectangular outline, suggesting it's a major equipment or control unit. The 'C' in the tag suggests a controller or a major component.",
          "description": "Equipment Unit 1C-2803",
          "equipment_type": "Unit/Controller",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.29,
            0.77,
            0.39,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.77,
                  0.39,
                  0.8
                ],
                "normalized_bbox": [
                  0.29,
                  0.77,
                  0.39,
                  0.8
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1C-2803 (type: equipment)"
        }
      },
      {
        "id": "TP_904",
        "type": "instrument_test_point",
        "label": "TP904",
        "bbox": [
          0.18,
          0.7,
          0.22,
          0.73
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "The label 'TP' indicates a Test Point. While no explicit circle is drawn around it, test points are often represented as small circles or just the label. Given the context, a circle is implied.",
          "description": "Test Point",
          "tag": "TP",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.18,
            0.7,
            0.22,
            0.73
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.18,
                  0.7,
                  0.22,
                  0.73
                ],
                "normalized_bbox": [
                  0.18,
                  0.7,
                  0.22,
                  0.73
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "T",
          "detection_quality": "good",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Temperature Test Point"
        }
      },
      {
        "id": "OFF_PAGE_27175",
        "type": "off_page_connection",
        "label": "27175",
        "bbox": [
          0.3,
          0,
          0.35,
          0.04
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a circle with a number, indicating an off-page connection or continuation of a control loop.",
          "description": "Off-page connection to loop 27175",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.3,
            0,
            0.35,
            0.04
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0,
                  0.35,
                  0.04
                ],
                "normalized_bbox": [
                  0.3,
                  0,
                  0.35,
                  0.04
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 27175 (type: off_page_connection)"
        }
      },
      {
        "id": "OFF_PAGE_27217B_TOP",
        "type": "off_page_connection",
        "label": "27217B",
        "bbox": [
          0.5,
          0,
          0.55,
          0.04
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a circle with a number, indicating an off-page connection or continuation of a control loop.",
          "description": "Off-page connection to loop 27217B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.5,
            0,
            0.55,
            0.04
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0,
                  0.55,
                  0.04
                ],
                "normalized_bbox": [
                  0.5,
                  0,
                  0.55,
                  0.04
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 27217B (type: off_page_connection)"
        }
      },
      {
        "id": "JUNCTION_MANUAL_AUTO",
        "type": "signal_junction",
        "label": "MANUAL/AUTO",
        "bbox": [
          0.75,
          0.55,
          0.8,
          0.58
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label 'MANUAL/AUTO' associated with signal lines, indicating a control mode selection junction.",
          "description": "Manual/Auto Control Signal Junction",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.75,
            0.55,
            0.8,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.75,
                  0.55,
                  0.8,
                  0.58
                ],
                "normalized_bbox": [
                  0.75,
                  0.55,
                  0.8,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "MA",
          "detection_quality": "good",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Moisture/Humidity",
          "isa_modifier": "Alarm",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: MANUAL/AUTO"
        }
      },
      {
        "id": "JUNCTION_HAO",
        "type": "signal_junction",
        "label": "HAO",
        "bbox": [
          0.86,
          0.69,
          0.89,
          0.72
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label 'HAO' associated with signal lines, indicating a Hand-Auto-Override junction.",
          "description": "Hand-Auto-Override Signal Junction",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.86,
            0.69,
            0.89,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.86,
                  0.69,
                  0.89,
                  0.72
                ],
                "normalized_bbox": [
                  0.86,
                  0.69,
                  0.89,
                  0.72
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "H",
          "detection_quality": "good",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Hand (Manually Initiated) Alarm Orifice / Restriction"
        }
      },
      {
        "id": "OFF_PAGE_RIGHT_TYPE39",
        "type": "off_page_connection",
        "label": "TYPE 39",
        "bbox": [
          0.88,
          0.78,
          0.92,
          0.81
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label 'TYPE 39' indicating an off-page connection or reference.",
          "description": "Off-page connection/reference Type 39",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.88,
            0.78,
            0.92,
            0.81
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.88,
                  0.78,
                  0.92,
                  0.81
                ],
                "normalized_bbox": [
                  0.88,
                  0.78,
                  0.92,
                  0.81
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "T",
          "detection_quality": "good",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Temperature Relay / Compute / Convert Test Point Sensor / Primary Element"
        }
      },
      {
        "id": "OFF_PAGE_RIGHT_TYPE15",
        "type": "off_page_connection",
        "label": "TYPE 15",
        "bbox": [
          0.78,
          0.17,
          0.82,
          0.2
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label 'TYPE 15' indicating an off-page connection or reference.",
          "description": "Off-page connection/reference Type 15",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.78,
            0.17,
            0.82,
            0.2
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.78,
                  0.17,
                  0.82,
                  0.2
                ],
                "normalized_bbox": [
                  0.78,
                  0.17,
                  0.82,
                  0.2
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "T",
          "detection_quality": "good",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Temperature Relay / Compute / Convert Test Point Sensor / Primary Element"
        }
      },
      {
        "id": "OFF_PAGE_RIGHT_HH",
        "type": "off_page_connection",
        "label": "HH",
        "bbox": [
          0.82,
          0.06,
          0.85,
          0.08
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label 'HH' indicating an off-page connection or reference.",
          "description": "Off-page connection/reference HH",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.82,
            0.06,
            0.85,
            0.08
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.82,
                  0.06,
                  0.85,
                  0.08
                ],
                "normalized_bbox": [
                  0.82,
                  0.06,
                  0.85,
                  0.08
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "H",
          "detection_quality": "good",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Hand (Manually Initiated) High (Alarm/Switch Setpoint)"
        }
      },
      {
        "id": "OFF_PAGE_RIGHT_HH_2",
        "type": "off_page_connection",
        "label": "HH",
        "bbox": [
          0.91,
          0.06,
          0.94,
          0.08
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label 'HH' indicating an off-page connection or reference.",
          "description": "Off-page connection/reference HH",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.91,
            0.06,
            0.94,
            0.08
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.983Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.91,
                  0.06,
                  0.94,
                  0.08
                ],
                "normalized_bbox": [
                  0.91,
                  0.06,
                  0.94,
                  0.08
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "H",
          "detection_quality": "good",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Hand (Manually Initiated) High (Alarm/Switch Setpoint)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271219",
        "type": "process_line",
        "label": "1VA-271219",
        "bbox": [
          0.27,
          0.18,
          0.28,
          0.29
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271219",
          "raw_backend_output": [
            0.27,
            0.18,
            0.28,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.27,
                  0.18,
                  0.28,
                  0.29
                ],
                "normalized_bbox": [
                  0.27,
                  0.18,
                  0.28,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271219 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271221",
        "type": "process_line",
        "label": "1VA-271221",
        "bbox": [
          0.27,
          0.29,
          0.28,
          0.36
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271221",
          "raw_backend_output": [
            0.27,
            0.29,
            0.28,
            0.36
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.27,
                  0.29,
                  0.28,
                  0.36
                ],
                "normalized_bbox": [
                  0.27,
                  0.29,
                  0.28,
                  0.36
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271221 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271220",
        "type": "process_line",
        "label": "1VA-271220",
        "bbox": [
          0.33,
          0.18,
          0.34,
          0.29
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271220",
          "raw_backend_output": [
            0.33,
            0.18,
            0.34,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.33,
                  0.18,
                  0.34,
                  0.29
                ],
                "normalized_bbox": [
                  0.33,
                  0.18,
                  0.34,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271220 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271222",
        "type": "process_line",
        "label": "1VA-271222",
        "bbox": [
          0.33,
          0.29,
          0.34,
          0.36
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271222",
          "raw_backend_output": [
            0.33,
            0.29,
            0.34,
            0.36
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.33,
                  0.29,
                  0.34,
                  0.36
                ],
                "normalized_bbox": [
                  0.33,
                  0.29,
                  0.34,
                  0.36
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271222 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271223",
        "type": "process_line",
        "label": "1VA-271223",
        "bbox": [
          0.59,
          0.18,
          0.6,
          0.29
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271223",
          "raw_backend_output": [
            0.59,
            0.18,
            0.6,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.59,
                  0.18,
                  0.6,
                  0.29
                ],
                "normalized_bbox": [
                  0.59,
                  0.18,
                  0.6,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271223 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271224",
        "type": "process_line",
        "label": "1VA-271224",
        "bbox": [
          0.68,
          0.18,
          0.69,
          0.29
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271224",
          "raw_backend_output": [
            0.68,
            0.18,
            0.69,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.68,
                  0.18,
                  0.69,
                  0.29
                ],
                "normalized_bbox": [
                  0.68,
                  0.18,
                  0.69,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271224 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271225",
        "type": "process_line",
        "label": "1VA-271225",
        "bbox": [
          0.77,
          0.18,
          0.78,
          0.29
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271225",
          "raw_backend_output": [
            0.77,
            0.18,
            0.78,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.77,
                  0.18,
                  0.78,
                  0.29
                ],
                "normalized_bbox": [
                  0.77,
                  0.18,
                  0.78,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271225 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271958",
        "type": "process_line",
        "label": "1VA-271958",
        "bbox": [
          0.86,
          0.18,
          0.87,
          0.29
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271958",
          "raw_backend_output": [
            0.86,
            0.18,
            0.87,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.86,
                  0.18,
                  0.87,
                  0.29
                ],
                "normalized_bbox": [
                  0.86,
                  0.18,
                  0.87,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271958 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_271959",
        "type": "process_line",
        "label": "1VA-271959",
        "bbox": [
          0.95,
          0.18,
          0.96,
          0.29
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-271959",
          "raw_backend_output": [
            0.95,
            0.18,
            0.96,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.95,
                  0.18,
                  0.96,
                  0.29
                ],
                "normalized_bbox": [
                  0.95,
                  0.18,
                  0.96,
                  0.29
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-271959 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_1VA_270042",
        "type": "process_line",
        "label": "1VA-270042",
        "bbox": [
          0.29,
          0.49,
          0.39,
          0.5
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a solid thick line with a label, indicating a process line.",
          "description": "Process Line 1VA-270042",
          "raw_backend_output": [
            0.29,
            0.49,
            0.39,
            0.5
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.49,
                  0.39,
                  0.5
                ],
                "normalized_bbox": [
                  0.29,
                  0.49,
                  0.39,
                  0.5
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1VA-270042 (type: process_line)"
        }
      },
      {
        "id": "PROCESS_LINE_101R1",
        "type": "process_line_identifier",
        "label": "101R1",
        "bbox": [
          0.1,
          0.2,
          0.15,
          0.21
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label indicating a process line identifier.",
          "description": "Process Line Identifier 101R1",
          "raw_backend_output": [
            0.1,
            0.2,
            0.15,
            0.21
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.1,
                  0.2,
                  0.15,
                  0.21
                ],
                "normalized_bbox": [
                  0.1,
                  0.2,
                  0.15,
                  0.21
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 101R1 (type: process_line_identifier)"
        }
      },
      {
        "id": "PROCESS_LINE_101F1",
        "type": "process_line_identifier",
        "label": "101F1",
        "bbox": [
          0.1,
          0.23,
          0.15,
          0.24
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label indicating a process line identifier.",
          "description": "Process Line Identifier 101F1",
          "raw_backend_output": [
            0.1,
            0.23,
            0.15,
            0.24
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.1,
                  0.23,
                  0.15,
                  0.24
                ],
                "normalized_bbox": [
                  0.1,
                  0.23,
                  0.15,
                  0.24
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 101F1 (type: process_line_identifier)"
        }
      },
      {
        "id": "PROCESS_LINE_LOW_POINT",
        "type": "process_line_feature",
        "label": "LOW POINT",
        "bbox": [
          0.1,
          0.46,
          0.18,
          0.48
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label indicating a low point in a process line.",
          "description": "Low Point in Process Line",
          "raw_backend_output": [
            0.1,
            0.46,
            0.18,
            0.48
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.1,
                  0.46,
                  0.18,
                  0.48
                ],
                "normalized_bbox": [
                  0.1,
                  0.46,
                  0.18,
                  0.48
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "LO",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Level",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: LOW-POINT"
        }
      },
      {
        "id": "PROCESS_LINE_36x26",
        "type": "process_line_dimension",
        "label": "36\"x26\"",
        "bbox": [
          0,
          0.58,
          0.05,
          0.62
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label indicating dimensions of a process line.",
          "description": "Process Line Dimension 36\"x26\"",
          "raw_backend_output": [
            0,
            0.58,
            0.05,
            0.62
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0,
                  0.58,
                  0.05,
                  0.62
                ],
                "normalized_bbox": [
                  0,
                  0.58,
                  0.05,
                  0.62
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 36\"X26\" (type: process_line_dimension)"
        }
      },
      {
        "id": "PROCESS_LINE_42x38x42",
        "type": "process_line_dimension",
        "label": "42\"x38\"54\"x42\"",
        "bbox": [
          0.05,
          0.58,
          0.15,
          0.62
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label indicating dimensions of a process line.",
          "description": "Process Line Dimension 42\"x38\"54\"x42\"",
          "raw_backend_output": [
            0.05,
            0.58,
            0.15,
            0.62
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.58,
                  0.15,
                  0.62
                ],
                "normalized_bbox": [
                  0.05,
                  0.58,
                  0.15,
                  0.62
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 42\"X38\"54\"X42\" (type: process_line_dimension)"
        }
      },
      {
        "id": "NOTE_6_TOP",
        "type": "annotation_note",
        "label": "NOTE 6",
        "bbox": [
          0.05,
          0.5,
          0.1,
          0.53
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label referring to a note.",
          "description": "Note 6",
          "raw_backend_output": [
            0.05,
            0.5,
            0.1,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.5,
                  0.1,
                  0.53
                ],
                "normalized_bbox": [
                  0.05,
                  0.5,
                  0.1,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "N",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice Orifice / Restriction Transmitter Sensor / Primary Element"
        }
      },
      {
        "id": "NOTE_6_BOTTOM",
        "type": "annotation_note",
        "label": "NOTE 6",
        "bbox": [
          0.19,
          0.58,
          0.24,
          0.61
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label referring to a note.",
          "description": "Note 6",
          "raw_backend_output": [
            0.19,
            0.58,
            0.24,
            0.61
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.19,
                  0.58,
                  0.24,
                  0.61
                ],
                "normalized_bbox": [
                  0.19,
                  0.58,
                  0.24,
                  0.61
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "N",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice Orifice / Restriction Transmitter Sensor / Primary Element"
        }
      },
      {
        "id": "NOTE_2",
        "type": "annotation_note",
        "label": "NOTE 2",
        "bbox": [
          0.32,
          0.8,
          0.37,
          0.82
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label referring to a note.",
          "description": "Note 2",
          "raw_backend_output": [
            0.32,
            0.8,
            0.37,
            0.82
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.32,
                  0.8,
                  0.37,
                  0.82
                ],
                "normalized_bbox": [
                  0.32,
                  0.8,
                  0.37,
                  0.82
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "N",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice Orifice / Restriction Transmitter Sensor / Primary Element"
        }
      },
      {
        "id": "NOTE_4",
        "type": "annotation_note",
        "label": "NOTE 4",
        "bbox": [
          0.46,
          0.82,
          0.51,
          0.84
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label referring to a note.",
          "description": "Note 4",
          "raw_backend_output": [
            0.46,
            0.82,
            0.51,
            0.84
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.46,
                  0.82,
                  0.51,
                  0.84
                ],
                "normalized_bbox": [
                  0.46,
                  0.82,
                  0.51,
                  0.84
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "N",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice Orifice / Restriction Transmitter Sensor / Primary Element"
        }
      },
      {
        "id": "NOTE_7",
        "type": "annotation_note",
        "label": "NOTE 7",
        "bbox": [
          0.6,
          0.7,
          0.65,
          0.72
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a text label referring to a note.",
          "description": "Note 7",
          "raw_backend_output": [
            0.6,
            0.7,
            0.65,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T21:14:15.984Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.6,
                  0.7,
                  0.65,
                  0.72
                ],
                "normalized_bbox": [
                  0.6,
                  0.7,
                  0.65,
                  0.72
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "N",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice Orifice / Restriction Transmitter Sensor / Primary Element"
        }
      }
    ],
    "connections": [
      {
        "id": "1767734055984-xfla45o5d",
        "from_id": "FIT_27216A",
        "to_id": "OFF_PAGE_27175",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_indicator_transmitter",
          "to_component_type": "off_page_connection",
          "from_label": "1FIT 27216A",
          "to_label": "27175"
        }
      },
      {
        "id": "1767734055984-vspuou0d4",
        "from_id": "FIT_27216B",
        "to_id": "OFF_PAGE_27175",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_indicator_transmitter",
          "to_component_type": "off_page_connection",
          "from_label": "1FIT 27216B",
          "to_label": "27175"
        }
      },
      {
        "id": "1767734055984-7ewslicyy",
        "from_id": "TIT_27217A",
        "to_id": "OFF_PAGE_27217B_TOP",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_indicator_transmitter",
          "to_component_type": "off_page_connection",
          "from_label": "1TIT 27217A",
          "to_label": "27217B"
        }
      },
      {
        "id": "1767734055984-sb8ra56zp",
        "from_id": "TE_27217A",
        "to_id": "TIT_27217A",
        "type": "unknown",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "instrument_indicator_transmitter",
          "from_label": "1TE 27217A",
          "to_label": "1TIT 27217A"
        }
      },
      {
        "id": "1767734055984-9itag61wt",
        "from_id": "TE_27217B",
        "to_id": "OFF_PAGE_27217B_TOP",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "off_page_connection",
          "from_label": "1TE 27217B",
          "to_label": "27217B"
        }
      },
      {
        "id": "1767734055984-f64pvcxio",
        "from_id": "HS_27221",
        "to_id": "JUNCTION_MANUAL_AUTO",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_switch",
          "to_component_type": "signal_junction",
          "from_label": "1HS 27221",
          "to_label": "MANUAL/AUTO"
        }
      },
      {
        "id": "1767734055984-ofkz7ri7c",
        "from_id": "HS_27225A",
        "to_id": "JUNCTION_HAO",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_switch",
          "to_component_type": "signal_junction",
          "from_label": "1HS 27225A",
          "to_label": "HAO"
        }
      },
      {
        "id": "1767734055984-tkbgk637t",
        "from_id": "JUNCTION_MANUAL_AUTO",
        "to_id": "VFD",
        "type": "unknown",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "signal_junction",
          "to_component_type": "equipment_drive",
          "from_label": "MANUAL/AUTO",
          "to_label": "VFD"
        }
      },
      {
        "id": "1767734055984-h4p2nbfk5",
        "from_id": "JUNCTION_HAO",
        "to_id": "VFD",
        "type": "unknown",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "signal_junction",
          "to_component_type": "equipment_drive",
          "from_label": "HAO",
          "to_label": "VFD"
        }
      },
      {
        "id": "1767734055984-i09qtvn71",
        "from_id": "VFD",
        "to_id": "MOTOR",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_drive",
          "to_component_type": "equipment_motor",
          "from_label": "VFD",
          "to_label": "M"
        }
      },
      {
        "id": "1767734055984-plympxiom",
        "from_id": "VFD",
        "to_id": "LOGIC_1I_TOP",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_drive",
          "to_component_type": "logic_function",
          "from_label": "VFD",
          "to_label": "1I"
        }
      },
      {
        "id": "1767734055984-cjclu6e9x",
        "from_id": "LOGIC_1I_TOP",
        "to_id": "LOGIC_1I_BOTTOM",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "logic_function",
          "from_label": "1I",
          "to_label": "1I"
        }
      },
      {
        "id": "1767734055984-k5o1058f5",
        "from_id": "LOGIC_1I_BOTTOM",
        "to_id": "OFF_PAGE_RIGHT_TYPE39",
        "type": "unknown",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "off_page_connection",
          "from_label": "1I",
          "to_label": "TYPE 39"
        }
      },
      {
        "id": "1767734055984-9lysmfrqh",
        "from_id": "EQUIPMENT_1C_2803",
        "to_id": "MOTOR",
        "type": "control_signal",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment",
          "to_component_type": "equipment_motor",
          "from_label": "1C-2803",
          "to_label": "M"
        }
      },
      {
        "id": "1767734055984-3tfk91ogn",
        "from_id": "MOTOR",
        "to_id": "CHECK_VALVE",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_motor",
          "to_component_type": "valve_check",
          "from_label": "M",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767734055984-t8tygty9j",
        "from_id": "TP_904",
        "to_id": "PROCESS_LINE_1VA_270042",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_test_point",
          "to_component_type": "process_line",
          "from_label": "TP904",
          "to_label": "1VA-270042"
        }
      },
      {
        "id": "1767734055984-4dw8yk8nm",
        "from_id": "GV_27216_TL",
        "to_id": "PROCESS_LINE_1VA_271219",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "process_line",
          "from_label": "3/4\"",
          "to_label": "1VA-271219"
        }
      },
      {
        "id": "1767734055984-2jh7gurlo",
        "from_id": "GV_27216_BL",
        "to_id": "PROCESS_LINE_1VA_271221",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "process_line",
          "from_label": "3/4\"",
          "to_label": "1VA-271221"
        }
      },
      {
        "id": "1767734055984-41k86owwj",
        "from_id": "GV_27216_TR",
        "to_id": "PROCESS_LINE_1VA_271220",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "process_line",
          "from_label": "3/4\"",
          "to_label": "1VA-271220"
        }
      },
      {
        "id": "1767734055984-jl4m0d4rl",
        "from_id": "GV_27216_BR",
        "to_id": "PROCESS_LINE_1VA_271222",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "process_line",
          "from_label": "3/4\"",
          "to_label": "1VA-271222"
        }
      },
      {
        "id": "1767734055984-2nbb0zl65",
        "from_id": "PROCESS_LINE_1VA_271219",
        "to_id": "FIT_27216A",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "instrument_indicator_transmitter",
          "from_label": "1VA-271219",
          "to_label": "1FIT 27216A"
        }
      },
      {
        "id": "1767734055984-qhg2ibwhu",
        "from_id": "PROCESS_LINE_1VA_271220",
        "to_id": "TIT_27217A",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "instrument_indicator_transmitter",
          "from_label": "1VA-271220",
          "to_label": "1TIT 27217A"
        }
      },
      {
        "id": "1767734055984-8gi0t824r",
        "from_id": "PROCESS_LINE_1VA_271220",
        "to_id": "TE_27217A",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "sensor_temperature",
          "from_label": "1VA-271220",
          "to_label": "1TE 27217A"
        }
      },
      {
        "id": "1767734055984-iyfjc20pi",
        "from_id": "PROCESS_LINE_1VA_271220",
        "to_id": "TE_27217B",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "sensor_temperature",
          "from_label": "1VA-271220",
          "to_label": "1TE 27217B"
        }
      },
      {
        "id": "1767734055984-7a5w4ai7w",
        "from_id": "PROCESS_LINE_1VA_271221",
        "to_id": "FIT_27216B",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "instrument_indicator_transmitter",
          "from_label": "1VA-271221",
          "to_label": "1FIT 27216B"
        }
      },
      {
        "id": "1767734055984-b2d9wj0mu",
        "from_id": "PROCESS_LINE_1VA_271222",
        "to_id": "FE_27216",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "sensor_flow",
          "from_label": "1VA-271222",
          "to_label": "1FE 27216"
        }
      },
      {
        "id": "1767734055984-62r382hmv",
        "from_id": "PROCESS_LINE_1VA_271223",
        "to_id": "PIT_27218A",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "instrument_indicator_transmitter",
          "from_label": "1VA-271223",
          "to_label": "1PIT 27218A"
        }
      },
      {
        "id": "1767734055984-7grzcbn35",
        "from_id": "PROCESS_LINE_1VA_271224",
        "to_id": "PIT_27218B",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "instrument_indicator_transmitter",
          "from_label": "1VA-271224",
          "to_label": "1PIT 27218B"
        }
      },
      {
        "id": "1767734055984-arxyqd8vg",
        "from_id": "PROCESS_LINE_1VA_271225",
        "to_id": "PIT_27219A",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "instrument_indicator_transmitter",
          "from_label": "1VA-271225",
          "to_label": "1PIT 27219A"
        }
      },
      {
        "id": "1767734055984-3vpnaqmae",
        "from_id": "PROCESS_LINE_1VA_271958",
        "to_id": "PIT_27219B",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_line",
          "to_component_type": "instrument_indicator_transmitter",
          "from_label": "1VA-271958",
          "to_label": "1PIT 27219B"
        }
      }
    ],
    "metadata": {
      "total_components": 51,
      "total_connections": 30,
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "shape_validation_enabled": true,
        "shape_violations_corrected": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 19,
        "isa_detection_rate": 0.37254901960784315,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 0,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 7
      },
      "control_loops": [],
      "validation_issues": [],
      "quality_metrics": {
        "overall_score": 0.7047058823529411,
        "detection_quality": 0.8627450980392157,
        "isa_completeness": 0.37254901960784315,
        "connection_coverage": 0.5882352941176471,
        "confidence_avg": 0.9274509803921563,
        "metrics": {
          "total_components": 51,
          "total_connections": 30,
          "isa_functions_detected": 19,
          "excellent_detections": 44,
          "avg_confidence": 0.9274509803921563
        }
      }
    }
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...

[Stage 2 Complete] Final analysis report generated successfully.