AI Vision Request -> model=gemini-2.5-flash imageSize=154584 mimeType=image/png responseMimeType=unset
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: PID
AI Vision Request -> model=gemini-2.5-flash imageSize=154584 mimeType=image/png responseMimeType=application/json
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision attempt 1 failed: [GoogleGenerativeAI Error]: Request aborted when 
fetching https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: This operation was aborted
AI Vision Response: {
  "components": [
    {
      "id": "PV-0015",
      "label": "PV 0015",
      "type": "Pressure Indicator/Transmitter",
      "bbox": [0.390, 0.300, 0.420, 0.330],
      "confidence": 1.0,
      "m...
[Stage 2] Job analysis-job-1-1767726517295 queued for document 1767726320570-usy25kk4a
[Stage 2] Job analysis-job-1-1767726517295 - Status: RUNNING
[Stage 2] Job analysis-job-1-1767726517295 - Minifying payload...
   [Minification] Filtered ghost connection: upstream_pipe_0759 → FO-0008
   [Minification] Filtered ghost connection: FO-0008 → downstream_pipe_7101  
   [Minification] Filtered ghost connection: downstream_pipe_7101 → HP_FLARE 
   [Minification] Filtered ghost connection: downstream_pipe_7101 → branch_1_inch_D
   [Minification] Token reduction: 80.7% (35262 → 6799 bytes)
   [Minification] Components: 25, Connections: 23, Ghosts filtered: 4        
[Stage 2] Job analysis-job-1-1767726517295 - Minification complete in 14ms   
[Stage 2] Job analysis-job-1-1767726517295 - Sending to AI (model: gemini-2.5-flash)...
[Stage 2] Job analysis-job-1-1767726517295 - Token budget: 2375 tokens (25 components × 75 + 500 base, cap: 4096)
[Stage 2] Job analysis-job-1-1767726517295 - Thinking budget: 4548 tokens    
[Stage 2] Job analysis-job-1-1767726517295 - AI timeout configured: 180000ms
[Stage 2] Job analysis-job-1-1767726517295 - AI Response received in 11920ms
[Stage 2] Job analysis-job-1-1767726517295 - JSON parse error, attempting fallback extraction
[Stage 2] Job analysis-job-1-1767726517295 - Status: COMPLETED
[Stage 2] Job analysis-job-1-1767726517295 - Performance: Total=11992ms, AI=11920ms, Minify=14ms, DB=0ms




 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
:3000/api/projects/default/tree?dir=.:1 
 
 Failed to load resource: the server responded with a status of 500 (Internal Server Error)
index.ts:34 Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."}]
index.ts:34 Step 2: Routing to pipeline...
index.ts:34 ["Selected pipeline:","visual"]
index.ts:34 Step 3: Executing pipeline...
visual.ts:79 Detecting blueprint type (P&ID vs HVAC)...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
visual.ts:81 Blueprint type detected: PID
visual.ts:92 Using standard single-pass analysis
11
XHR finished loading: GET "<URL>".
visual.ts:97 [Visual Pipeline] Applying enhancements...
visual-enhancements.ts:44 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:51 [Enhancement] Normalizing component and connection types...
visual-enhancements.ts:54 [Enhancement] Type normalization complete
visual-enhancements.ts:59 [Enhancement] Applying spatial association to merge orphaned labels...
spatial-association.ts:330 [Spatial Association] Starting spatial association post-processing...
spatial-association.ts:196 [Spatial Association] Starting orphaned label detection...
spatial-association.ts:213 [Spatial Association] Found 0 orphaned labels, 0 unlabeled components, 25 already labeled
spatial-association.ts:220 [Spatial Association] No merging needed
spatial-association.ts:341 [Spatial Association] Post-processing complete in 2ms: 25 → 25 components (0 merged)
visual-enhancements.ts:68 [Enhancement] Spatial association complete: 0 orphaned labels merged, 25 total components remain
visual-enhancements.ts:77 [Enhancement] Applying strict geometric shape validation...
shape-validator.ts:411 [Shape Validator] Starting shape validation...
shape-validator.ts:445 [Shape Validator] All components passed shape validation
shape-validator.ts:462 [Shape Validator] Validation complete: 0/25 validated, 0 corrected
visual-enhancements.ts:80 [Enhancement] Shape validation complete: 0 components corrected
visual-enhancements.ts:87 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:92 [Enhancement] ISA detection complete: 23/25 components have ISA functions (92%)
visual-enhancements.ts:100 [Enhancement] Enhancing connections...
visual-enhancements.ts:106 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:115 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:132 [Enhancement] Validating connections...
visual-enhancements.ts:138 
 [Enhancement] Connection validation found 4 issues (4 errors, 0 warnings)
enhanceVisualAnalysis	@	visual-enhancements.ts:138
analyzeVisual	@	visual.ts:98
visual-enhancements.ts:144 [Enhancement] Auto-correcting connection type mismatches...
visual-enhancements.ts:152 [Enhancement] Detecting control loops...
visual-enhancements.ts:154 [Enhancement] Detected 0 control loops
visual-enhancements.ts:158 [Enhancement] Post-processing complete in 24ms
visual.ts:109 [Visual Pipeline] Quality Score: 0.98
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767726320570-usy25kk4a","type":"SCHEMATIC","processing_time_ms":194444,"components":25}]
BlueprintWorkspace.tsx:177 Stage 1 (Visual Analysis) complete: 
{document_id: '1767726320570-usy25kk4a', document_type: 'SCHEMATIC', file_name: 'current-image', timestamp: 1767726515014, classification: {…}, …}
cache_hit
: 
false
classification
: 
confidence
: 
1
reasoning
: 
"The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."
type
: 
"SCHEMATIC"
[[Prototype]]
: 
Object
document_id
: 
"1767726320570-usy25kk4a"
document_type
: 
"SCHEMATIC"
file_name
: 
"current-image"
processing_time_ms
: 
194444
timestamp
: 
1767726515014
visual
: 
components
: 
Array(25)
0
: 
{id: 'PV-0015', type: 'valve_control', label: 'PV 0015', bbox: Array(4), confidence: 1, …}
1
: 
{id: 'FO-0008', type: 'valve_control', label: 'FO 0008', bbox: Array(4), confidence: 1, …}
2
: 
{id: '2C-SharedDisplay', type: 'Shared Display/Control', label: '2C', bbox: Array(4), confidence: 1, …}
3
: 
{id: 'AE-0170A', type: 'Analysis Element (Sensor)', label: 'AE 0170 A', bbox: Array(4), confidence: 1, …}
4
: 
{id: 'AIT-0170A', type: 'Analysis Indicator Transmitter', label: 'AIT 0170 A', bbox: Array(4), confidence: 1, …}
5
: 
{id: 'AE-0170B', type: 'Analysis Element (Sensor)', label: 'AE 0170 B', bbox: Array(4), confidence: 1, …}
6
: 
{id: 'AIT-0170B', type: 'Analysis Indicator Transmitter', label: 'AIT 0170 B', bbox: Array(4), confidence: 1, …}
7
: 
{id: 'AE-0170C', type: 'Analysis Element (Sensor)', label: 'AE 0170 C', bbox: Array(4), confidence: 1, …}
8
: 
{id: 'AIT-0170C', type: 'Analysis Indicator Transmitter', label: 'AIT 0170 C', bbox: Array(4), confidence: 1, …}
9
: 
{id: 'AE-0170D', type: 'Analysis Element (Sensor)', label: 'AE 0170 D', bbox: Array(4), confidence: 1, …}
10
: 
{id: 'AIT-0170D', type: 'Analysis Indicator Transmitter', label: 'AIT 0170 D', bbox: Array(4), confidence: 1, …}
11
: 
{id: '2C-LogicPLC', type: 'Logic/PLC Function', label: '2C', bbox: Array(4), confidence: 1, …}
12
: 
{id: 'AI-0170A1', type: 'Analysis Indicator', label: 'AI 0170 A1', bbox: Array(4), confidence: 1, …}
13
: 
{id: 'AI-0170B1', type: 'Analysis Indicator', label: 'AI 0170 B1', bbox: Array(4), confidence: 1, …}
14
: 
{id: 'AI-0170C1', type: 'Analysis Indicator', label: 'AI 0170 C1', bbox: Array(4), confidence: 1, …}
15
: 
{id: 'AI-0170D1', type: 'Analysis Indicator', label: 'AI 0170 D1', bbox: Array(4), confidence: 1, …}
16
: 
{id: 'AI-0170M', type: 'Analysis Indicator', label: 'AI 0170 M', bbox: Array(4), confidence: 1, …}
17
: 
{id: 'AAHH-0170', type: 'Analysis Alarm High-High', label: 'AAHH HH 0170', bbox: Array(4), confidence: 1, …}
18
: 
{id: 'MFACP-CCR', type: 'System Boundary / Panel', label: 'MFACP (CCR) NOTE 25', bbox: Array(4), confidence: 1, …}
19
: 
{id: 'XL-0171', type: 'Unclassified Light (Fire Beacon)', label: 'XL 0171 COMMON FIRE BEACON NOTE 22', bbox: Array(4), confidence: 1, …}
20
: 
{id: 'XA-0172', type: 'Unclassified Alarm (Fire Horn)', label: 'XA 0172 FIRE HORN', bbox: Array(4), confidence: 1, …}
21
: 
{id: 'HA-0173', type: 'Hand Alarm (Test Button)', label: 'HA 0173 TEST', bbox: Array(4), confidence: 1, …}
22
: 
{id: 'HA-0174', type: 'Hand Alarm (Acknowledge/Silence Button)', label: 'HA 0174 ACKNOWLEDGE/SILENCE', bbox: Array(4), confidence: 1, …}
23
: 
{id: 'AXA-0175', type: 'Unclassified Alarm (Common Trouble)', label: 'AXA 0175 COMMON TROUBLE ALARM NOTE 23', bbox: Array(4), confidence: 1, …}
24
: 
{id: 'AXA-0176', type: 'Unclassified Alarm (Fire Alarm)', label: 'AXA 0176 FIRE ALARM NOTE 23', bbox: Array(4), confidence: 1, …}
length
: 
25
[[Prototype]]
: 
Array(0)
connections
: 
Array(27)
0
: 
{id: '1767726514979-c67xod7ei', from_id: 'upstream_pipe_0759', to_id: 'FO-0008', type: 'process_flow', confidence: 1}
1
: 
{id: '1767726514979-9upduslsu', from_id: 'FO-0008', to_id: 'downstream_pipe_7101', type: 'process_flow', confidence: 1}
2
: 
{id: '1767726514979-3e4nbqskw', from_id: 'downstream_pipe_7101', to_id: 'HP_FLARE', type: 'process_flow', confidence: 1}
3
: 
{id: '1767726514979-nssksjp3u', from_id: 'downstream_pipe_7101', to_id: 'branch_1_inch_D', type: 'process_flow', confidence: 1}
4
: 
{id: '1767726514979-cq2hctpji', from_id: 'PV-0015', to_id: '2C-SharedDisplay', type: 'control_signal', confidence: 1, …}
5
: 
{id: '1767726514979-2bbydwqia', from_id: '2C-SharedDisplay', to_id: 'FO-0008', type: 'control_signal', confidence: 1, …}
6
: 
{id: '1767726514979-276azj564', from_id: 'AE-0170A', to_id: 'AIT-0170A', type: 'control_signal', confidence: 1, …}
7
: 
{id: '1767726514979-kq5i6kyfa', from_id: 'AE-0170B', to_id: 'AIT-0170B', type: 'control_signal', confidence: 1, …}
8
: 
{id: '1767726514979-i1ych8dym', from_id: 'AE-0170C', to_id: 'AIT-0170C', type: 'control_signal', confidence: 1, …}
9
: 
{id: '1767726514979-e3d1bh4qj', from_id: 'AE-0170D', to_id: 'AIT-0170D', type: 'control_signal', confidence: 1, …}
10
: 
{id: '1767726514979-yic4z0zmf', from_id: 'AIT-0170A', to_id: '2C-LogicPLC', type: 'control_signal', confidence: 1, …}
11
: 
{id: '1767726514979-02z49h7q2', from_id: 'AIT-0170B', to_id: '2C-LogicPLC', type: 'control_signal', confidence: 1, …}
12
: 
{id: '1767726514979-lotefgbx6', from_id: 'AIT-0170C', to_id: '2C-LogicPLC', type: 'control_signal', confidence: 1, …}
13
: 
{id: '1767726514979-5xasivgfk', from_id: 'AIT-0170D', to_id: '2C-LogicPLC', type: 'control_signal', confidence: 1, …}
14
: 
{id: '1767726514979-mghmtvf8a', from_id: '2C-LogicPLC', to_id: 'AI-0170A1', type: 'control_signal', confidence: 1, …}
15
: 
{id: '1767726514979-c97swzdbg', from_id: '2C-LogicPLC', to_id: 'AI-0170B1', type: 'control_signal', confidence: 1, …}
16
: 
{id: '1767726514979-3wpiud477', from_id: '2C-LogicPLC', to_id: 'AI-0170C1', type: 'control_signal', confidence: 1, …}
17
: 
{id: '1767726514979-mnpfiz0ug', from_id: '2C-LogicPLC', to_id: 'AI-0170D1', type: 'control_signal', confidence: 1, …}
18
: 
{id: '1767726514979-3bgo5ovxx', from_id: '2C-LogicPLC', to_id: 'AI-0170M', type: 'control_signal', confidence: 1, …}
19
: 
{id: '1767726514979-ekw2m089r', from_id: '2C-LogicPLC', to_id: 'AAHH-0170', type: 'control_signal', confidence: 1, …}
20
: 
{id: '1767726514979-bylj1o6wh', from_id: '2C-LogicPLC', to_id: 'MFACP-CCR', type: 'control_signal', confidence: 1, …}
21
: 
{id: '1767726514979-nz9usgnkk', from_id: 'MFACP-CCR', to_id: 'XL-0171', type: 'control_signal', confidence: 1, …}
22
: 
{id: '1767726514979-ly96m6hk2', from_id: 'MFACP-CCR', to_id: 'XA-0172', type: 'control_signal', confidence: 1, …}
23
: 
{id: '1767726514979-z2pnpecha', from_id: 'MFACP-CCR', to_id: 'HA-0173', type: 'control_signal', confidence: 1, …}
24
: 
{id: '1767726514979-3g9ixtnkk', from_id: 'MFACP-CCR', to_id: 'HA-0174', type: 'control_signal', confidence: 1, …}
25
: 
{id: '1767726514979-rabawjypz', from_id: 'MFACP-CCR', to_id: 'AXA-0175', type: 'control_signal', confidence: 1, …}
26
: 
{id: '1767726514979-34qx5zzvi', from_id: 'MFACP-CCR', to_id: 'AXA-0176', type: 'control_signal', confidence: 1, …}
length
: 
27
[[Prototype]]
: 
Array(0)
metadata
: 
control_loops
: 
Array(0)
length
: 
0
[[Prototype]]
: 
Array(0)
enhancement
: 
connection_inference_enabled
: 
true
control_loops
: 
0
enhancement_duration_ms
: 
24
inferred_connections
: 
0
isa_detection_enabled
: 
true
isa_detection_rate
: 
0.92
isa_functions_detected
: 
23
loop_detection_enabled
: 
true
orphaned_labels_merged
: 
0
shape_validation_enabled
: 
true
shape_violations_corrected
: 
0
spatial_association_enabled
: 
true
validation_enabled
: 
true
validation_issues
: 
4
[[Prototype]]
: 
Object
process_log
: 
undefined
quality_metrics
: 
confidence_avg
: 
1
connection_coverage
: 
1
detection_quality
: 
1
isa_completeness
: 
0.92
metrics
: 
avg_confidence
: 
1
excellent_detections
: 
25
isa_functions_detected
: 
23
total_components
: 
25
total_connections
: 
27
[[Prototype]]
: 
Object
overall_score
: 
0.98
[[Prototype]]
: 
Object
total_components
: 
25
total_connections
: 
27
validation_issues
: 
Array(4)
0
: 
{connection: {…}, issue: 'Source component not found: upstream_pipe_0759', severity: 'error'}
1
: 
{connection: {…}, issue: 'Target component not found: downstream_pipe_7101', severity: 'error'}
2
: 
{connection: {…}, issue: 'Source component not found: downstream_pipe_7101', severity: 'error'}
3
: 
{connection: {…}, issue: 'Source component not found: downstream_pipe_7101', severity: 'error'}
length
: 
4
[[Prototype]]
: 
Array(0)
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object
[[Prototype]]
: 
Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:214 [Stage 2] Starting background analysis...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:234 [Stage 2] Background job queued: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:214 [Stage 2] Queuing background analysis on server...
BlueprintWorkspace.tsx:83 [Polling] Starting poll for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:148 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:83 [Polling] Starting poll for job: analysis-job-1-1767726515804
background-worker.ts:57 Fetch finished loading: POST "http://localhost:3000/api/analysis/queue".
BlueprintWorkspace.tsx:148 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:83 [Polling] Starting poll for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:87 [Polling] Checking status for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:88 
 
 GET http://localhost:3000/api/analysis/status/analysis-job-1-1767726515804 404 (Not Found)
BlueprintWorkspace.tsx:91 
 [Polling] Failed to fetch job status: 404
53
Fetch failed loading: GET "<URL>".
BlueprintWorkspace.tsx:87 [Polling] Checking status for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:88 
 
 GET http://localhost:3000/api/analysis/status/analysis-job-1-1767726515804 404 (Not Found)
BlueprintWorkspace.tsx:91 
 [Polling] Failed to fetch job status: 404
BlueprintWorkspace.tsx:87 [Polling] Checking status for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:88 
 
 GET http://localhost:3000/api/analysis/status/analysis-job-1-1767726515804 404 (Not Found)
BlueprintWorkspace.tsx:91 
 [Polling] Failed to fetch job status: 404
BlueprintWorkspace.tsx:87 [Polling] Checking status for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:88 
 
 GET http://localhost:3000/api/analysis/status/analysis-job-1-1767726515804 404 (Not Found)
BlueprintWorkspace.tsx:91 
 [Polling] Failed to fetch job status: 404
BlueprintWorkspace.tsx:87 [Polling] Checking status for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:88 
 
 GET http://localhost:3000/api/analysis/status/analysis-job-1-1767726515804 404 (Not Found)
BlueprintWorkspace.tsx:91 
 [Polling] Failed to fetch job status: 404
BlueprintWorkspace.tsx:87 [Polling] Checking status for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:88 
 
 GET http://localhost:3000/api/analysis/status/analysis-job-1-1767726515804 404 (Not Found)
BlueprintWorkspace.tsx:91 
 [Polling] Failed to fetch job status: 404
(anonymous)	@	BlueprintWorkspace.tsx:91
setInterval		
(anonymous)	@	BlueprintWorkspace.tsx:85
BlueprintWorkspace.tsx:87 [Polling] Checking status for job: analysis-job-1-1767726515804
BlueprintWorkspace.tsx:88 
 
 GET http://localhost:3000/api/analysis/status/analysis-job-1-1767726515804 404 (Not Found)
(anonymous)	@	BlueprintWorkspace.tsx:88
setInterval		
(anonymous)	@	BlueprintWorkspace.tsx:85
BlueprintWorkspace.tsx:91 
 [Polling] Failed to fetch job status: 404
(anonymous)	@	BlueprintWorkspace.tsx:91
setInterval		
(anonymous)	@	BlueprintWorkspace.tsx:85



Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767726320570-usy25kk4a","type":"SCHEMATIC","processing_time_ms":194444,"components":25}]

{
  "document_id": "1767726320570-usy25kk4a",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767726515014,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."
  },
  "processing_time_ms": 194444,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "PV-0015",
        "type": "valve_control",
        "label": "PV 0015",
        "bbox": [
          0.39,
          0.3,
          0.42,
          0.33
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with a solid horizontal line, indicating a primary location instrument. 'PV' prefix denotes Pressure Variable.",
          "description": "Pressure Indicator/Transmitter, Primary Location.",
          "instrument_function": "Pressure Variable",
          "location": "Primary Location (Control Room / Main Panel)",
          "raw_backend_output": [
            0.39,
            0.3,
            0.42,
            0.33
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.974Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.3,
                  0.42,
                  0.33
                ],
                "normalized_bbox": [
                  0.39,
                  0.3,
                  0.42,
                  0.33
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PV",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "P",
          "isa_modifier": null,
          "isa_confidence": 0.95,
          "isa_reasoning": "Known ISA pattern: Pressure Valve"
        }
      },
      {
        "id": "FO-0008",
        "type": "valve_control",
        "label": "FO 0008",
        "bbox": [
          0.45,
          0.3,
          0.48,
          0.34
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, which classifies it as a valve. The 'FO' indicates Fail Open and it has a diaphragm actuator symbol.",
          "description": "Control Valve, Fail Open.",
          "equipment_type": "Control Valve",
          "raw_backend_output": [
            0.45,
            0.3,
            0.48,
            0.34
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.976Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.3,
                  0.48,
                  0.34
                ],
                "normalized_bbox": [
                  0.45,
                  0.3,
                  0.48,
                  0.34
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FO",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "F",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Orifice / Restriction"
        }
      },
      {
        "id": "2C-SharedDisplay",
        "type": "Shared Display/Control",
        "label": "2C",
        "bbox": [
          0.5,
          0.27,
          0.53,
          0.3
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle inside a square, which signifies a shared display/control function (DCS/HMI/SCADA).",
          "description": "Shared Display/Control Function.",
          "location": "Shared Display / Control (DCS / HMI / SCADA)",
          "raw_backend_output": [
            0.5,
            0.27,
            0.53,
            0.3
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.976Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.27,
                  0.53,
                  0.3
                ],
                "normalized_bbox": [
                  0.5,
                  0.27,
                  0.53,
                  0.3
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 2C (type: Shared Display/Control)"
        }
      },
      {
        "id": "AE-0170A",
        "type": "Analysis Element (Sensor)",
        "label": "AE 0170 A",
        "bbox": [
          0.25,
          0.5,
          0.28,
          0.53
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AE' prefix denotes Analysis Element.",
          "description": "Analysis Element Sensor.",
          "instrument_function": "Analysis (Composition/Property)",
          "raw_backend_output": [
            0.25,
            0.5,
            0.28,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.976Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.5,
                  0.28,
                  0.53
                ],
                "normalized_bbox": [
                  0.25,
                  0.5,
                  0.28,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Element/Sensor",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AE-0170-A"
        }
      },
      {
        "id": "AIT-0170A",
        "type": "Analysis Indicator Transmitter",
        "label": "AIT 0170 A",
        "bbox": [
          0.3,
          0.5,
          0.33,
          0.53
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AIT' prefix denotes Analysis Indicator Transmitter.",
          "description": "Analysis Indicator Transmitter.",
          "instrument_function": "Analysis (Composition/Property) Indicator Transmitter",
          "raw_backend_output": [
            0.3,
            0.5,
            0.33,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.976Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.5,
                  0.33,
                  0.53
                ],
                "normalized_bbox": [
                  0.3,
                  0.5,
                  0.33,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AIT-0170-A"
        }
      },
      {
        "id": "AE-0170B",
        "type": "Analysis Element (Sensor)",
        "label": "AE 0170 B",
        "bbox": [
          0.25,
          0.55,
          0.28,
          0.58
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AE' prefix denotes Analysis Element.",
          "description": "Analysis Element Sensor.",
          "instrument_function": "Analysis (Composition/Property)",
          "raw_backend_output": [
            0.25,
            0.55,
            0.28,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.977Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.55,
                  0.28,
                  0.58
                ],
                "normalized_bbox": [
                  0.25,
                  0.55,
                  0.28,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Element/Sensor",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AE-0170-B"
        }
      },
      {
        "id": "AIT-0170B",
        "type": "Analysis Indicator Transmitter",
        "label": "AIT 0170 B",
        "bbox": [
          0.3,
          0.55,
          0.33,
          0.58
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AIT' prefix denotes Analysis Indicator Transmitter.",
          "description": "Analysis Indicator Transmitter.",
          "instrument_function": "Analysis (Composition/Property) Indicator Transmitter",
          "raw_backend_output": [
            0.3,
            0.55,
            0.33,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.977Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.55,
                  0.33,
                  0.58
                ],
                "normalized_bbox": [
                  0.3,
                  0.55,
                  0.33,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AIT-0170-B"
        }
      },
      {
        "id": "AE-0170C",
        "type": "Analysis Element (Sensor)",
        "label": "AE 0170 C",
        "bbox": [
          0.25,
          0.6,
          0.28,
          0.63
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AE' prefix denotes Analysis Element.",
          "description": "Analysis Element Sensor.",
          "instrument_function": "Analysis (Composition/Property)",
          "raw_backend_output": [
            0.25,
            0.6,
            0.28,
            0.63
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.977Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.6,
                  0.28,
                  0.63
                ],
                "normalized_bbox": [
                  0.25,
                  0.6,
                  0.28,
                  0.63
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Element/Sensor",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AE-0170-C"
        }
      },
      {
        "id": "AIT-0170C",
        "type": "Analysis Indicator Transmitter",
        "label": "AIT 0170 C",
        "bbox": [
          0.3,
          0.6,
          0.33,
          0.63
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AIT' prefix denotes Analysis Indicator Transmitter.",
          "description": "Analysis Indicator Transmitter.",
          "instrument_function": "Analysis (Composition/Property) Indicator Transmitter",
          "raw_backend_output": [
            0.3,
            0.6,
            0.33,
            0.63
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.977Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.6,
                  0.33,
                  0.63
                ],
                "normalized_bbox": [
                  0.3,
                  0.6,
                  0.33,
                  0.63
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AIT-0170-C"
        }
      },
      {
        "id": "AE-0170D",
        "type": "Analysis Element (Sensor)",
        "label": "AE 0170 D",
        "bbox": [
          0.25,
          0.65,
          0.28,
          0.68
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AE' prefix denotes Analysis Element.",
          "description": "Analysis Element Sensor.",
          "instrument_function": "Analysis (Composition/Property)",
          "raw_backend_output": [
            0.25,
            0.65,
            0.28,
            0.68
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.977Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.65,
                  0.28,
                  0.68
                ],
                "normalized_bbox": [
                  0.25,
                  0.65,
                  0.28,
                  0.68
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Element/Sensor",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AE-0170-D"
        }
      },
      {
        "id": "AIT-0170D",
        "type": "Analysis Indicator Transmitter",
        "label": "AIT 0170 D",
        "bbox": [
          0.3,
          0.65,
          0.33,
          0.68
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AIT' prefix denotes Analysis Indicator Transmitter.",
          "description": "Analysis Indicator Transmitter.",
          "instrument_function": "Analysis (Composition/Property) Indicator Transmitter",
          "raw_backend_output": [
            0.3,
            0.65,
            0.33,
            0.68
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.977Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.65,
                  0.33,
                  0.68
                ],
                "normalized_bbox": [
                  0.3,
                  0.65,
                  0.33,
                  0.68
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AIT-0170-D"
        }
      },
      {
        "id": "2C-LogicPLC",
        "type": "Logic/PLC Function",
        "label": "2C",
        "bbox": [
          0.4,
          0.58,
          0.43,
          0.61
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as Logic/PLC Function based on ISA-5.1 symbol recognition.",
          "description": "Logic/PLC Function.",
          "location": "Logic / PLC (Programmable Logic Controller)",
          "raw_backend_output": [
            0.4,
            0.58,
            0.43,
            0.61
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.977Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.4,
                  0.58,
                  0.43,
                  0.61
                ],
                "normalized_bbox": [
                  0.4,
                  0.58,
                  0.43,
                  0.61
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 2C (type: Logic/PLC Function)"
        }
      },
      {
        "id": "AI-0170A1",
        "type": "Analysis Indicator",
        "label": "AI 0170 A1",
        "bbox": [
          0.45,
          0.5,
          0.48,
          0.53
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle with a solid horizontal line, indicating a primary location instrument. 'AI' prefix denotes Analysis Indicator.",
          "description": "Analysis Indicator, Primary Location.",
          "instrument_function": "Analysis (Composition/Property) Indicator",
          "location": "Primary Location (Control Room / Main Panel)",
          "raw_backend_output": [
            0.45,
            0.5,
            0.48,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.5,
                  0.48,
                  0.53
                ],
                "normalized_bbox": [
                  0.45,
                  0.5,
                  0.48,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AI-0170-A1"
        }
      },
      {
        "id": "AI-0170B1",
        "type": "Analysis Indicator",
        "label": "AI 0170 B1",
        "bbox": [
          0.45,
          0.55,
          0.48,
          0.58
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle with a solid horizontal line, indicating a primary location instrument. 'AI' prefix denotes Analysis Indicator.",
          "description": "Analysis Indicator, Primary Location.",
          "instrument_function": "Analysis (Composition/Property) Indicator",
          "location": "Primary Location (Control Room / Main Panel)",
          "raw_backend_output": [
            0.45,
            0.55,
            0.48,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.55,
                  0.48,
                  0.58
                ],
                "normalized_bbox": [
                  0.45,
                  0.55,
                  0.48,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AI-0170-B1"
        }
      },
      {
        "id": "AI-0170C1",
        "type": "Analysis Indicator",
        "label": "AI 0170 C1",
        "bbox": [
          0.45,
          0.6,
          0.48,
          0.63
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle with a solid horizontal line, indicating a primary location instrument. 'AI' prefix denotes Analysis Indicator.",
          "description": "Analysis Indicator, Primary Location.",
          "instrument_function": "Analysis (Composition/Property) Indicator",
          "location": "Primary Location (Control Room / Main Panel)",
          "raw_backend_output": [
            0.45,
            0.6,
            0.48,
            0.63
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.6,
                  0.48,
                  0.63
                ],
                "normalized_bbox": [
                  0.45,
                  0.6,
                  0.48,
                  0.63
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AI-0170-C1"
        }
      },
      {
        "id": "AI-0170D1",
        "type": "Analysis Indicator",
        "label": "AI 0170 D1",
        "bbox": [
          0.45,
          0.65,
          0.48,
          0.68
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle with a solid horizontal line, indicating a primary location instrument. 'AI' prefix denotes Analysis Indicator.",
          "description": "Analysis Indicator, Primary Location.",
          "instrument_function": "Analysis (Composition/Property) Indicator",
          "location": "Primary Location (Control Room / Main Panel)",
          "raw_backend_output": [
            0.45,
            0.65,
            0.48,
            0.68
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.65,
                  0.48,
                  0.68
                ],
                "normalized_bbox": [
                  0.45,
                  0.65,
                  0.48,
                  0.68
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AI-0170-D1"
        }
      },
      {
        "id": "AI-0170M",
        "type": "Analysis Indicator",
        "label": "AI 0170 M",
        "bbox": [
          0.45,
          0.7,
          0.48,
          0.73
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle with a solid horizontal line, indicating a primary location instrument. 'AI' prefix denotes Analysis Indicator.",
          "description": "Analysis Indicator, Primary Location.",
          "instrument_function": "Analysis (Composition/Property) Indicator",
          "location": "Primary Location (Control Room / Main Panel)",
          "raw_backend_output": [
            0.45,
            0.7,
            0.48,
            0.73
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.7,
                  0.48,
                  0.73
                ],
                "normalized_bbox": [
                  0.45,
                  0.7,
                  0.48,
                  0.73
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AI-0170-M"
        }
      },
      {
        "id": "AAHH-0170",
        "type": "Analysis Alarm High-High",
        "label": "AAHH HH 0170",
        "bbox": [
          0.45,
          0.75,
          0.48,
          0.78
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle with a solid horizontal line, indicating a primary location instrument. 'AAHH' prefix denotes Analysis Alarm High-High.",
          "description": "Analysis Alarm High-High, Primary Location.",
          "instrument_function": "Analysis (Composition/Property) Alarm High-High",
          "location": "Primary Location (Control Room / Main Panel)",
          "raw_backend_output": [
            0.45,
            0.75,
            0.48,
            0.78
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.75,
                  0.48,
                  0.78
                ],
                "normalized_bbox": [
                  0.45,
                  0.75,
                  0.48,
                  0.78
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AA",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Alarm",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AAHH-HH-0170"
        }
      },
      {
        "id": "MFACP-CCR",
        "type": "System Boundary / Panel",
        "label": "MFACP (CCR) NOTE 25",
        "bbox": [
          0.55,
          0.45,
          0.85,
          0.85
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a cloud/bubble shape enclosing multiple instruments, indicating a system boundary or control panel. The text specifies Main Fire Alarm Control Panel.",
          "description": "Main Fire Alarm Control Panel (Control Room).",
          "equipment_type": "Fire Alarm Control Panel",
          "raw_backend_output": [
            0.55,
            0.45,
            0.85,
            0.85
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.45,
                  0.85,
                  0.85
                ],
                "normalized_bbox": [
                  0.55,
                  0.45,
                  0.85,
                  0.85
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "MF",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Moisture/Humidity",
          "isa_modifier": "Ratio",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: MFACP-(CCR)-NOTE-25"
        }
      },
      {
        "id": "XL-0171",
        "type": "Unclassified Light (Fire Beacon)",
        "label": "XL 0171 COMMON FIRE BEACON NOTE 22",
        "bbox": [
          0.65,
          0.5,
          0.68,
          0.53
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'XL' prefix denotes Unclassified Light. The label specifies 'FIRE BEACON'.",
          "description": "Common Fire Beacon.",
          "instrument_function": "Unclassified Light",
          "raw_backend_output": [
            0.65,
            0.5,
            0.68,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.5,
                  0.68,
                  0.53
                ],
                "normalized_bbox": [
                  0.65,
                  0.5,
                  0.68,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "XL",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Unclassified",
          "isa_modifier": "Low",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: XL-0171-COMMON-FIRE-BEACON-NOTE-22"
        }
      },
      {
        "id": "XA-0172",
        "type": "Unclassified Alarm (Fire Horn)",
        "label": "XA 0172 FIRE HORN",
        "bbox": [
          0.65,
          0.55,
          0.68,
          0.58
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'XA' prefix denotes Unclassified Alarm. The label specifies 'FIRE HORN'.",
          "description": "Fire Horn Alarm.",
          "instrument_function": "Unclassified Alarm",
          "raw_backend_output": [
            0.65,
            0.55,
            0.68,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.55,
                  0.68,
                  0.58
                ],
                "normalized_bbox": [
                  0.65,
                  0.55,
                  0.68,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "XA",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Unclassified",
          "isa_modifier": "Alarm",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: XA-0172-FIRE-HORN"
        }
      },
      {
        "id": "HA-0173",
        "type": "Hand Alarm (Test Button)",
        "label": "HA 0173 TEST",
        "bbox": [
          0.65,
          0.6,
          0.68,
          0.63
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'HA' prefix denotes Hand Alarm. The label specifies 'TEST'.",
          "description": "Hand Alarm (Test Button).",
          "instrument_function": "Hand (Manually Initiated) Alarm",
          "raw_backend_output": [
            0.65,
            0.6,
            0.68,
            0.63
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.978Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.6,
                  0.68,
                  0.63
                ],
                "normalized_bbox": [
                  0.65,
                  0.6,
                  0.68,
                  0.63
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "HA",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Hand",
          "isa_modifier": "Alarm",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: HA-0173-TEST"
        }
      },
      {
        "id": "HA-0174",
        "type": "Hand Alarm (Acknowledge/Silence Button)",
        "label": "HA 0174 ACKNOWLEDGE/SILENCE",
        "bbox": [
          0.65,
          0.65,
          0.68,
          0.68
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'HA' prefix denotes Hand Alarm. The label specifies 'ACKNOWLEDGE/SILENCE'.",
          "description": "Hand Alarm (Acknowledge/Silence Button).",
          "instrument_function": "Hand (Manually Initiated) Alarm",
          "raw_backend_output": [
            0.65,
            0.65,
            0.68,
            0.68
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.979Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.65,
                  0.68,
                  0.68
                ],
                "normalized_bbox": [
                  0.65,
                  0.65,
                  0.68,
                  0.68
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "HA",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Hand",
          "isa_modifier": "Alarm",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: HA-0174-ACKNOWLEDGE/SILENCE"
        }
      },
      {
        "id": "AXA-0175",
        "type": "Unclassified Alarm (Common Trouble)",
        "label": "AXA 0175 COMMON TROUBLE ALARM NOTE 23",
        "bbox": [
          0.65,
          0.7,
          0.68,
          0.73
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AXA' prefix denotes Unclassified Alarm. The label specifies 'COMMON TROUBLE ALARM'.",
          "description": "Common Trouble Alarm.",
          "instrument_function": "Unclassified Alarm",
          "raw_backend_output": [
            0.65,
            0.7,
            0.68,
            0.73
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.979Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.7,
                  0.68,
                  0.73
                ],
                "normalized_bbox": [
                  0.65,
                  0.7,
                  0.68,
                  0.73
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AX",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Unclassified",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AXA-0175-COMMON-TROUBLE-ALARM-NOTE-23"
        }
      },
      {
        "id": "AXA-0176",
        "type": "Unclassified Alarm (Fire Alarm)",
        "label": "AXA 0176 FIRE ALARM NOTE 23",
        "bbox": [
          0.65,
          0.75,
          0.68,
          0.78
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument. 'AXA' prefix denotes Unclassified Alarm. The label specifies 'FIRE ALARM'.",
          "description": "Fire Alarm.",
          "instrument_function": "Unclassified Alarm",
          "raw_backend_output": [
            0.65,
            0.75,
            0.68,
            0.78
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T19:08:34.979Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.75,
                  0.68,
                  0.78
                ],
                "normalized_bbox": [
                  0.65,
                  0.75,
                  0.68,
                  0.78
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AX",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Unclassified",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AXA-0176-FIRE-ALARM-NOTE-23"
        }
      }
    ],
    "connections": [
      {
        "id": "1767726514979-c67xod7ei",
        "from_id": "upstream_pipe_0759",
        "to_id": "FO-0008",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767726514979-9upduslsu",
        "from_id": "FO-0008",
        "to_id": "downstream_pipe_7101",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767726514979-3e4nbqskw",
        "from_id": "downstream_pipe_7101",
        "to_id": "HP_FLARE",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767726514979-nssksjp3u",
        "from_id": "downstream_pipe_7101",
        "to_id": "branch_1_inch_D",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767726514979-cq2hctpji",
        "from_id": "PV-0015",
        "to_id": "2C-SharedDisplay",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "Shared Display/Control",
          "from_label": "PV 0015",
          "to_label": "2C"
        }
      },
      {
        "id": "1767726514979-2bbydwqia",
        "from_id": "2C-SharedDisplay",
        "to_id": "FO-0008",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Shared Display/Control",
          "to_component_type": "valve_control",
          "from_label": "2C",
          "to_label": "FO 0008"
        }
      },
      {
        "id": "1767726514979-276azj564",
        "from_id": "AE-0170A",
        "to_id": "AIT-0170A",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Analysis Element (Sensor)",
          "to_component_type": "Analysis Indicator Transmitter",
          "from_label": "AE 0170 A",
          "to_label": "AIT 0170 A"
        }
      },
      {
        "id": "1767726514979-kq5i6kyfa",
        "from_id": "AE-0170B",
        "to_id": "AIT-0170B",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Analysis Element (Sensor)",
          "to_component_type": "Analysis Indicator Transmitter",
          "from_label": "AE 0170 B",
          "to_label": "AIT 0170 B"
        }
      },
      {
        "id": "1767726514979-i1ych8dym",
        "from_id": "AE-0170C",
        "to_id": "AIT-0170C",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Analysis Element (Sensor)",
          "to_component_type": "Analysis Indicator Transmitter",
          "from_label": "AE 0170 C",
          "to_label": "AIT 0170 C"
        }
      },
      {
        "id": "1767726514979-e3d1bh4qj",
        "from_id": "AE-0170D",
        "to_id": "AIT-0170D",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Analysis Element (Sensor)",
          "to_component_type": "Analysis Indicator Transmitter",
          "from_label": "AE 0170 D",
          "to_label": "AIT 0170 D"
        }
      },
      {
        "id": "1767726514979-yic4z0zmf",
        "from_id": "AIT-0170A",
        "to_id": "2C-LogicPLC",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Analysis Indicator Transmitter",
          "to_component_type": "Logic/PLC Function",
          "from_label": "AIT 0170 A",
          "to_label": "2C"
        }
      },
      {
        "id": "1767726514979-02z49h7q2",
        "from_id": "AIT-0170B",
        "to_id": "2C-LogicPLC",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Analysis Indicator Transmitter",
          "to_component_type": "Logic/PLC Function",
          "from_label": "AIT 0170 B",
          "to_label": "2C"
        }
      },
      {
        "id": "1767726514979-lotefgbx6",
        "from_id": "AIT-0170C",
        "to_id": "2C-LogicPLC",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Analysis Indicator Transmitter",
          "to_component_type": "Logic/PLC Function",
          "from_label": "AIT 0170 C",
          "to_label": "2C"
        }
      },
      {
        "id": "1767726514979-5xasivgfk",
        "from_id": "AIT-0170D",
        "to_id": "2C-LogicPLC",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Analysis Indicator Transmitter",
          "to_component_type": "Logic/PLC Function",
          "from_label": "AIT 0170 D",
          "to_label": "2C"
        }
      },
      {
        "id": "1767726514979-mghmtvf8a",
        "from_id": "2C-LogicPLC",
        "to_id": "AI-0170A1",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Logic/PLC Function",
          "to_component_type": "Analysis Indicator",
          "from_label": "2C",
          "to_label": "AI 0170 A1"
        }
      },
      {
        "id": "1767726514979-c97swzdbg",
        "from_id": "2C-LogicPLC",
        "to_id": "AI-0170B1",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Logic/PLC Function",
          "to_component_type": "Analysis Indicator",
          "from_label": "2C",
          "to_label": "AI 0170 B1"
        }
      },
      {
        "id": "1767726514979-3wpiud477",
        "from_id": "2C-LogicPLC",
        "to_id": "AI-0170C1",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Logic/PLC Function",
          "to_component_type": "Analysis Indicator",
          "from_label": "2C",
          "to_label": "AI 0170 C1"
        }
      },
      {
        "id": "1767726514979-mnpfiz0ug",
        "from_id": "2C-LogicPLC",
        "to_id": "AI-0170D1",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Logic/PLC Function",
          "to_component_type": "Analysis Indicator",
          "from_label": "2C",
          "to_label": "AI 0170 D1"
        }
      },
      {
        "id": "1767726514979-3bgo5ovxx",
        "from_id": "2C-LogicPLC",
        "to_id": "AI-0170M",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Logic/PLC Function",
          "to_component_type": "Analysis Indicator",
          "from_label": "2C",
          "to_label": "AI 0170 M"
        }
      },
      {
        "id": "1767726514979-ekw2m089r",
        "from_id": "2C-LogicPLC",
        "to_id": "AAHH-0170",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Logic/PLC Function",
          "to_component_type": "Analysis Alarm High-High",
          "from_label": "2C",
          "to_label": "AAHH HH 0170"
        }
      },
      {
        "id": "1767726514979-bylj1o6wh",
        "from_id": "2C-LogicPLC",
        "to_id": "MFACP-CCR",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Logic/PLC Function",
          "to_component_type": "System Boundary / Panel",
          "from_label": "2C",
          "to_label": "MFACP (CCR) NOTE 25"
        }
      },
      {
        "id": "1767726514979-nz9usgnkk",
        "from_id": "MFACP-CCR",
        "to_id": "XL-0171",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "System Boundary / Panel",
          "to_component_type": "Unclassified Light (Fire Beacon)",
          "from_label": "MFACP (CCR) NOTE 25",
          "to_label": "XL 0171 COMMON FIRE BEACON NOTE 22"
        }
      },
      {
        "id": "1767726514979-ly96m6hk2",
        "from_id": "MFACP-CCR",
        "to_id": "XA-0172",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "System Boundary / Panel",
          "to_component_type": "Unclassified Alarm (Fire Horn)",
          "from_label": "MFACP (CCR) NOTE 25",
          "to_label": "XA 0172 FIRE HORN"
        }
      },
      {
        "id": "1767726514979-z2pnpecha",
        "from_id": "MFACP-CCR",
        "to_id": "HA-0173",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "System Boundary / Panel",
          "to_component_type": "Hand Alarm (Test Button)",
          "from_label": "MFACP (CCR) NOTE 25",
          "to_label": "HA 0173 TEST"
        }
      },
      {
        "id": "1767726514979-3g9ixtnkk",
        "from_id": "MFACP-CCR",
        "to_id": "HA-0174",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "System Boundary / Panel",
          "to_component_type": "Hand Alarm (Acknowledge/Silence Button)",
          "from_label": "MFACP (CCR) NOTE 25",
          "to_label": "HA 0174 ACKNOWLEDGE/SILENCE"
        }
      },
      {
        "id": "1767726514979-rabawjypz",
        "from_id": "MFACP-CCR",
        "to_id": "AXA-0175",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "System Boundary / Panel",
          "to_component_type": "Unclassified Alarm (Common Trouble)",
          "from_label": "MFACP (CCR) NOTE 25",
          "to_label": "AXA 0175 COMMON TROUBLE ALARM NOTE 23"
        }
      },
      {
        "id": "1767726514979-34qx5zzvi",
        "from_id": "MFACP-CCR",
        "to_id": "AXA-0176",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "System Boundary / Panel",
          "to_component_type": "Unclassified Alarm (Fire Alarm)",
          "from_label": "MFACP (CCR) NOTE 25",
          "to_label": "AXA 0176 FIRE ALARM NOTE 23"
        }
      }
    ],
    "metadata": {
      "total_components": 25,
      "total_connections": 27,
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "shape_validation_enabled": true,
        "shape_violations_corrected": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 23,
        "isa_detection_rate": 0.92,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 4,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 24
      },
      "control_loops": [],
      "validation_issues": [
        {
          "connection": {
            "id": "1767726514979-c67xod7ei",
            "from_id": "upstream_pipe_0759",
            "to_id": "FO-0008",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Source component not found: upstream_pipe_0759",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767726514979-9upduslsu",
            "from_id": "FO-0008",
            "to_id": "downstream_pipe_7101",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Target component not found: downstream_pipe_7101",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767726514979-3e4nbqskw",
            "from_id": "downstream_pipe_7101",
            "to_id": "HP_FLARE",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Source component not found: downstream_pipe_7101",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767726514979-nssksjp3u",
            "from_id": "downstream_pipe_7101",
            "to_id": "branch_1_inch_D",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Source component not found: downstream_pipe_7101",
          "severity": "error"
        }
      ],
      "quality_metrics": {
        "overall_score": 0.98,
        "detection_quality": 1,
        "isa_completeness": 0.92,
        "connection_coverage": 1,
        "confidence_avg": 1,
        "metrics": {
          "total_components": 25,
          "total_connections": 27,
          "isa_functions_detected": 23,
          "excellent_detections": 25,
          "avg_confidence": 1
        }
      }
    }
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...