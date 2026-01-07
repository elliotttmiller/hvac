[dotenv@17.2.3] injecting env (32) from .env -- tip: ⚙️  enable debug logging with {
 debug: true }
✅ AI Proxy Initialized. Model: gemini-2.5-flash

Server running at http://localhost:4000
Data Root: C:\Users\Elliott\hvac\server\data
AI Provider: gemini (Active)
Mock Mode: DISABLED (live AI inference)

  VITE v6.4.1  ready in 1834 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://10.0.0.32:3000/
  ➜  press h + enter to show help
[Stage 2] Job analysis-job-1-1767749519318 queued for document 1767749518130-rkdq3my9w
[Stage 2] Job analysis-job-1-1767749519318 - Status: RUNNING
[Stage 2] Job analysis-job-1-1767749519318 - Minifying payload...
   [Minification] Token reduction: 81.9% (31893 → 5785 bytes)
   [Minification] Components: 28, Connections: 16, Ghosts filtered: 0
[Stage 2] Job analysis-job-1-1767749519318 - Minification complete in 2ms
[Stage 2] Job analysis-job-1-1767749519318 - Sending to AI (model: gemini-2.5-flash)...
[Stage 2] Job analysis-job-1-1767749519318 - Token budget: 6200 tokens (28 components × 150 + 2000 base, cap: 34000)
[Stage 2] Job analysis-job-1-1767749519318 - Thinking budget: 4848 tokens
[Stage 2] Job analysis-job-1-1767749519318 - AI timeout configured: 180000ms
[Stage 2] Job analysis-job-1-1767749519318 - AI Response received in 16980ms
[Stage 2] Job analysis-job-1-1767749519318 - Response length: 4660 characters
[Stage 2] Job analysis-job-1-1767749519318 - Response preview (first 200 chars): {  
  "report_title": "Process Flow and Instrumentation Analysis",
  "executive_summary": "This report details a segment of a process control system, focusing on the measurement and regulation of flow, ...
[Stage 2] Job analysis-job-1-1767749519318 - Response preview (last 200 chars): ...eering disciplines. General engineering principles for safe and reliable operation are implicitly followed in the selection and arrangement of components to ensure system integrity and performance."
}
[Stage 2] Job analysis-job-1-1767749519318 - JSON parsed successfully
[Stage 2] Job analysis-job-1-1767749519318 - Response validation passed, all required fields present
[Stage 2] Job analysis-job-1-1767749519318 - Status: COMPLETED
[Stage 2] Job analysis-job-1-1767749519318 - Performance: Total=17021ms, AI=16980ms, Minify=2ms, DB=0ms
[Stage 2] Project default - Final report saved



:3000/api/projects/default/tree?dir=.:1   Failed to load resource: the server responded with a status of 500 (Internal Server Error)
:3000/api/projects/default/tree?dir=.:1   Failed to load resource: the server responded with a status of 500 (Internal Server Error)
index.ts:34 Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."}]
index.ts:34 Step 2: Routing to pipeline...
index.ts:34 ["Selected pipeline:","visual"]
index.ts:34 Step 3: Executing pipeline...
visual.ts:71 Visual analysis cache hit
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767749518130-rkdq3my9w","type":"SCHEMATIC","processing_time_ms":6,"components":28}]
BlueprintWorkspace.tsx:222 Stage 1 (Visual Analysis) complete: Objectcache_hit: trueclassification: confidence: 1reasoning: "The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."type: "SCHEMATIC"[[Prototype]]: Objectdocument_id: "1767749518130-rkdq3my9w"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 6timestamp: 1767749518136visual: components: Array(28)0: {id: 'PV-0027', type: 'valve_control', label: 'PV\n0027', bbox: Array(4), confidence: 1, …}1: {id: 'ZC-0020', type: 'valve', label: 'ZC\n0020', bbox: Array(4), confidence: 0.9, …}2: {id: 'CSO-1', type: 'valve', label: 'CSO', bbox: Array(4), confidence: 1, …}3: {id: 'CSO-2', type: 'valve', label: 'CSO', bbox: Array(4), confidence: 1, …}4: {id: 'FIT-0007A', type: 'sensor_flow', label: 'FIT\n0007 A', bbox: Array(4), confidence: 1, …}5: {id: 'FE-0007', type: 'sensor_flow', label: 'FE\n0007', bbox: Array(4), confidence: 1, …}6: {id: 'FIT-0007B', type: 'sensor_flow', label: 'FIT\n0007 B', bbox: Array(4), confidence: 1, …}7: {id: 'PI-0023', type: 'sensor_pressure', label: 'PI\n0023', bbox: Array(4), confidence: 1, …}8: {id: 'PIT-0023', type: 'sensor_pressure', label: 'PIT\n0023', bbox: Array(4), confidence: 1, …}9: {id: 'TI-0025', type: 'sensor_temperature', label: 'TI\n0025', bbox: Array(4), confidence: 1, …}10: {id: 'TIT-0025', type: 'sensor_temperature', label: 'TIT\n0025', bbox: Array(4), confidence: 1, …}11: {id: 'TE-0025', type: 'sensor_temperature', label: 'TE\n0025', bbox: Array(4), confidence: 1, …}12: {id: 'CSO-3', type: 'valve', label: 'CSO', bbox: Array(4), confidence: 1, …}13: {id: 'SP-1', type: 'valve', label: 'SP', bbox: Array(4), confidence: 1, …}14: {id: 'PDIT-0022', type: 'instrument', label: 'PDIT\n0022', bbox: Array(4), confidence: 1, …}15: {id: 'PDI-0022', type: 'instrument', label: 'PDI\n0022', bbox: Array(4), confidence: 1, …}16: {id: 'TIT-0026', type: 'sensor_temperature', label: 'TIT\n0026', bbox: Array(4), confidence: 1, …}17: {id: 'TE-0026', type: 'sensor_temperature', label: 'TE\n0026', bbox: Array(4), confidence: 1, …}18: {id: 'CSO-4', type: 'valve', label: 'CSO', bbox: Array(4), confidence: 1, …}19: {id: 'PIT-0033', type: 'sensor_pressure', label: 'PIT\n0033', bbox: Array(4), confidence: 1, …}20: {id: 'PIC-0033', type: 'sensor_pressure', label: 'PIC\n0033', bbox: Array(4), confidence: 1, …}21: {id: 'SP-2', type: 'valve', label: 'SP', bbox: Array(4), confidence: 1, …}22: {id: 'CSO-5', type: 'valve', label: 'CSO', bbox: Array(4), confidence: 1, …}23: {id: 'NOTE-13-1', type: 'valve', label: 'NOTE 13', bbox: Array(4), confidence: 1, …}24: {id: 'NOTE-13-2', type: 'valve', label: 'NOTE 13', bbox: Array(4), confidence: 1, …}25: {id: 'PP-1', type: 'pipe_section', label: 'PP', bbox: Array(4), confidence: 1, …}26: {id: 'PP-2', type: 'pipe_section', label: 'PP', bbox: Array(4), confidence: 1, …}27: {id: 'PP-3', type: 'pipe_section', label: 'PP', bbox: Array(4), confidence: 1, …}length: 28[[Prototype]]: Array(0)connections: Array(16)0: {id: '1767701468536-8rqdvtp1j', from_id: 'PV-0027', to_id: 'ZC-0020', type: 'control_signal', confidence: 1, …}confidence: 1from_id: "PV-0027"id: "1767701468536-8rqdvtp1j"meta: {inferred_type: 'unknown', type_confidence: 0.5, type_reasoning: 'Could not determine connection type from component types', from_component_type: 'valve_control', to_component_type: 'valve', …}to_id: "ZC-0020"type: "control_signal"[[Prototype]]: Object1: {id: '1767701468536-hg5nq6c32', from_id: 'CSO-1', to_id: 'PV-0027', type: 'process_flow', confidence: 1, …}2: {id: '1767701468536-k5ohb29gu', from_id: 'PV-0027', to_id: 'CSO-2', type: 'process_flow', confidence: 1, …}3: {id: '1767701468536-es6rfnag6', from_id: 'FIT-0007A', to_id: 'FE-0007', type: 'process_flow', confidence: 1, …}4: {id: '1767701468536-66nhtgnzk', from_id: 'FE-0007', to_id: 'FIT-0007B', type: 'process_flow', confidence: 1, …}5: {id: '1767701468536-9ri27euw5', from_id: 'TE-0025', to_id: 'TIT-0025', type: 'control_signal', confidence: 1, …}6: {id: '1767701468536-cz9i1w9sa', from_id: 'TIT-0025', to_id: 'TI-0025', type: 'control_signal', confidence: 1, …}7: {id: '1767701468536-nc45617vm', from_id: 'CSO-3', to_id: 'SP-1', type: 'process_flow', confidence: 1, …}8: {id: '1767701468536-f5qi160io', from_id: 'PDIT-0022', to_id: 'PDI-0022', type: 'control_signal', confidence: 1, …}9: {id: '1767701468536-f3uooyyde', from_id: 'TE-0026', to_id: 'TIT-0026', type: 'control_signal', confidence: 1, …}10: {id: '1767701468536-eis08nr6y', from_id: 'PIT-0033', to_id: 'PIC-0033', type: 'control_signal', confidence: 1, …}11: {id: '1767701468536-9o91wm6w7', from_id: 'CSO-4', to_id: 'SP-2', type: 'process_flow', confidence: 1, …}12: {id: '1767701468536-wo7z2q1lf', from_id: 'SP-2', to_id: 'CSO-5', type: 'process_flow', confidence: 1, …}13: {id: '1767701468536-2rob1pg5d', from_id: 'NOTE-13-1', to_id: 'NOTE-13-2', type: 'process_flow', confidence: 1, …}14: {id: '1767701468536-gyi6ama9x', from_id: 'NOTE-13-2', to_id: 'PP-1', type: 'process_flow', confidence: 1, …}15: {id: '1767701468536-09ka28upp', from_id: 'PIT-0033', to_id: 'PIC-0033', type: 'control_signal', confidence: 1, …}length: 16[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 19inferred_connections: 0isa_detection_enabled: trueisa_detection_rate: 1isa_functions_detected: 28loop_detection_enabled: trueorphaned_labels_merged: 0shape_validation_enabled: trueshape_violations_corrected: 0spatial_association_enabled: truevalidation_enabled: truevalidation_issues: 0[[Prototype]]: Objectquality_metrics: confidence_avg: 0.9964285714285713connection_coverage: 0.5714285714285714detection_quality: 1isa_completeness: 1metrics: avg_confidence: 0.9964285714285713excellent_detections: 28isa_functions_detected: 28total_components: 28total_connections: 16[[Prototype]]: Objectoverall_score: 0.9132142857142858[[Prototype]]: Objecttotal_components: 28total_connections: 16validation_issues: Array(0)length: 0[[Prototype]]: Array(0)[[Prototype]]: Object_from_cache: true[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:259 [Stage 2] Starting background analysis...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:280 [Stage 2] Background job queued: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:259 [Stage 2] Queuing background analysis on server...
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767749518413
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: completed
BlueprintWorkspace.tsx:143 [Polling] Project completed! Setting final analysis report
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll


Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767749518130-rkdq3my9w","type":"SCHEMATIC","processing_time_ms":6,"components":28}]

{
  "document_id": "1767749518130-rkdq3my9w",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767749518136,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."
  },
  "processing_time_ms": 6,
  "cache_hit": true,
  "visual": {
    "components": [
      {
        "id": "PV-0027",
        "type": "valve_control",
        "label": "PV\n0027",
        "bbox": [
          0.108,
          0.088,
          0.158,
          0.138
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with a solid horizontal line, indicating a primary location instrument. The label 'PV' denotes a Pressure Valve/Actuator function.",
          "description": "Pressure Valve/Actuator, Primary Location",
          "instrument_function": "Pressure Valve/Actuator",
          "location": "Primary Location",
          "tag": "PV-0027",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.108,
            0.088,
            0.158,
            0.138
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.531Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.108,
                  0.088,
                  0.158,
                  0.138
                ],
                "normalized_bbox": [
                  0.108,
                  0.088,
                  0.158,
                  0.138
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
          }
        }
      },
      {
        "id": "ZC-0020",
        "type": "valve",
        "label": "ZC\n0020",
        "bbox": [
          0.252,
          0.088,
          0.302,
          0.138
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as valve based on ISA-5.1 symbol recognition.",
          "description": "Position Controller Valve, Primary Location",
          "instrument_function": "Position Controller",
          "location": "Primary Location",
          "tag": "ZC-0020",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.252,
            0.088,
            0.302,
            0.138
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.533Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.252,
                  0.088,
                  0.302,
                  0.138
                ],
                "normalized_bbox": [
                  0.252,
                  0.088,
                  0.302,
                  0.138
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "ZC",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "CSO-1",
        "type": "valve",
        "label": "CSO",
        "bbox": [
          0.198,
          0.192,
          0.228,
          0.222
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, which is classified as a valve according to RULE 2.",
          "description": "Manual Shut-off Valve",
          "equipment_type": "Shut-off Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.198,
            0.192,
            0.228,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.534Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.198,
                  0.192,
                  0.228,
                  0.222
                ],
                "normalized_bbox": [
                  0.198,
                  0.192,
                  0.228,
                  0.222
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "CSO-2",
        "type": "valve",
        "label": "CSO",
        "bbox": [
          0.352,
          0.192,
          0.382,
          0.222
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, which is classified as a valve according to RULE 2.",
          "description": "Manual Shut-off Valve",
          "equipment_type": "Shut-off Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.352,
            0.192,
            0.382,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.534Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.352,
                  0.192,
                  0.382,
                  0.222
                ],
                "normalized_bbox": [
                  0.352,
                  0.192,
                  0.382,
                  0.222
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "FIT-0007A",
        "type": "sensor_flow",
        "label": "FIT\n0007 A",
        "bbox": [
          0.068,
          0.288,
          0.118,
          0.338
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument according to RULE 1. The label 'FIT' denotes a Flow Indicating Transmitter.",
          "description": "Flow Indicating Transmitter",
          "instrument_function": "Flow Indicating Transmitter",
          "tag": "FIT-0007A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.068,
            0.288,
            0.118,
            0.338
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.534Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.068,
                  0.288,
                  0.118,
                  0.338
                ],
                "normalized_bbox": [
                  0.068,
                  0.288,
                  0.118,
                  0.338
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FIT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "FE-0007",
        "type": "sensor_flow",
        "label": "FE\n0007",
        "bbox": [
          0.188,
          0.288,
          0.238,
          0.338
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with an internal rectangle, indicating a primary element. Classified as a sensor according to RULE 1. The label 'FE' denotes a Flow Element.",
          "description": "Flow Element (Orifice Plate)",
          "instrument_function": "Flow Element",
          "tag": "FE-0007",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.188,
            0.288,
            0.238,
            0.338
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.534Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.188,
                  0.288,
                  0.238,
                  0.338
                ],
                "normalized_bbox": [
                  0.188,
                  0.288,
                  0.238,
                  0.338
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "FIT-0007B",
        "type": "sensor_flow",
        "label": "FIT\n0007 B",
        "bbox": [
          0.068,
          0.398,
          0.118,
          0.448
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument according to RULE 1. The label 'FIT' denotes a Flow Indicating Transmitter.",
          "description": "Flow Indicating Transmitter",
          "instrument_function": "Flow Indicating Transmitter",
          "tag": "FIT-0007B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.068,
            0.398,
            0.118,
            0.448
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.534Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.068,
                  0.398,
                  0.118,
                  0.448
                ],
                "normalized_bbox": [
                  0.068,
                  0.398,
                  0.118,
                  0.448
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FIT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "PI-0023",
        "type": "sensor_pressure",
        "label": "PI\n0023",
        "bbox": [
          0.108,
          0.508,
          0.158,
          0.558
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with a solid horizontal line, indicating a primary location instrument. Classified as an instrument according to RULE 1. The label 'PI' denotes a Pressure Indicator.",
          "description": "Pressure Indicator, Primary Location",
          "instrument_function": "Pressure Indicator",
          "location": "Primary Location",
          "tag": "PI-0023",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.108,
            0.508,
            0.158,
            0.558
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.534Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.108,
                  0.508,
                  0.158,
                  0.558
                ],
                "normalized_bbox": [
                  0.108,
                  0.508,
                  0.158,
                  0.558
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "PIT-0023",
        "type": "sensor_pressure",
        "label": "PIT\n0023",
        "bbox": [
          0.208,
          0.508,
          0.258,
          0.558
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with a solid horizontal line, indicating a primary location instrument. Classified as an instrument according to RULE 1. The label 'PIT' denotes a Pressure Indicating Transmitter.",
          "description": "Pressure Indicating Transmitter, Primary Location",
          "instrument_function": "Pressure Indicating Transmitter",
          "location": "Primary Location",
          "tag": "PIT-0023",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.208,
            0.508,
            0.258,
            0.558
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.534Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.208,
                  0.508,
                  0.258,
                  0.558
                ],
                "normalized_bbox": [
                  0.208,
                  0.508,
                  0.258,
                  0.558
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PIT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "TI-0025",
        "type": "sensor_temperature",
        "label": "TI\n0025",
        "bbox": [
          0.068,
          0.618,
          0.118,
          0.668
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with a solid horizontal line, indicating a primary location instrument. Classified as an instrument according to RULE 1. The label 'TI' denotes a Temperature Indicator.",
          "description": "Temperature Indicator, Primary Location",
          "instrument_function": "Temperature Indicator",
          "location": "Primary Location",
          "tag": "TI-0025",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.068,
            0.618,
            0.118,
            0.668
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.068,
                  0.618,
                  0.118,
                  0.668
                ],
                "normalized_bbox": [
                  0.068,
                  0.618,
                  0.118,
                  0.668
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "TIT-0025",
        "type": "sensor_temperature",
        "label": "TIT\n0025",
        "bbox": [
          0.168,
          0.618,
          0.218,
          0.668
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with a solid horizontal line, indicating a primary location instrument. Classified as an instrument according to RULE 1. The label 'TIT' denotes a Temperature Indicating Transmitter.",
          "description": "Temperature Indicating Transmitter, Primary Location",
          "instrument_function": "Temperature Indicating Transmitter",
          "location": "Primary Location",
          "tag": "TIT-0025",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.168,
            0.618,
            0.218,
            0.668
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.168,
                  0.618,
                  0.218,
                  0.668
                ],
                "normalized_bbox": [
                  0.168,
                  0.618,
                  0.218,
                  0.668
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TIT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "TE-0025",
        "type": "sensor_temperature",
        "label": "TE\n0025",
        "bbox": [
          0.268,
          0.618,
          0.318,
          0.668
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as a sensor according to RULE 1. The label 'TE' denotes a Temperature Element, further specified as RTD.",
          "description": "Temperature Element (RTD)",
          "instrument_function": "Temperature Element",
          "tag": "TE-0025",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.268,
            0.618,
            0.318,
            0.668
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.268,
                  0.618,
                  0.318,
                  0.668
                ],
                "normalized_bbox": [
                  0.268,
                  0.618,
                  0.318,
                  0.668
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "CSO-3",
        "type": "valve",
        "label": "CSO",
        "bbox": [
          0.298,
          0.702,
          0.328,
          0.732
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, which is classified as a valve according to RULE 2.",
          "description": "Manual Shut-off Valve",
          "equipment_type": "Shut-off Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.298,
            0.702,
            0.328,
            0.732
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.298,
                  0.702,
                  0.328,
                  0.732
                ],
                "normalized_bbox": [
                  0.298,
                  0.702,
                  0.328,
                  0.732
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "SP-1",
        "type": "valve",
        "label": "SP",
        "bbox": [
          0.198,
          0.772,
          0.228,
          0.802
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a triangle shape, which is a standard symbol for a check valve. Classified as a valve.",
          "description": "Check Valve",
          "equipment_type": "Check Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.198,
            0.772,
            0.228,
            0.802
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.198,
                  0.772,
                  0.228,
                  0.802
                ],
                "normalized_bbox": [
                  0.198,
                  0.772,
                  0.228,
                  0.802
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SP",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: SP"
        }
      },
      {
        "id": "PDIT-0022",
        "type": "instrument",
        "label": "PDIT\n0022",
        "bbox": [
          0.208,
          0.848,
          0.258,
          0.898
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with a solid horizontal line, indicating a primary location instrument. Classified as an instrument according to RULE 1. The label 'PDIT' denotes a Differential Pressure Indicating Transmitter.",
          "description": "Differential Pressure Indicating Transmitter, Primary Location",
          "instrument_function": "Differential Pressure Indicating Transmitter",
          "location": "Primary Location",
          "tag": "PDIT-0022",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.208,
            0.848,
            0.258,
            0.898
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.208,
                  0.848,
                  0.258,
                  0.898
                ],
                "normalized_bbox": [
                  0.208,
                  0.848,
                  0.258,
                  0.898
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "PIT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "P",
          "isa_modifier": "D",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Pressure / Vacuum Differential (e.g., PD = Pressure Diff) Indicator (Readout) Transmitter"
        }
      },
      {
        "id": "PDI-0022",
        "type": "instrument",
        "label": "PDI\n0022",
        "bbox": [
          0.308,
          0.848,
          0.358,
          0.898
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape with a solid horizontal line, indicating a primary location instrument. Classified as an instrument according to RULE 1. The label 'PDI' denotes a Differential Pressure Indicator.",
          "description": "Differential Pressure Indicator, Primary Location",
          "instrument_function": "Differential Pressure Indicator",
          "location": "Primary Location",
          "tag": "PDI-0022",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.308,
            0.848,
            0.358,
            0.898
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.308,
                  0.848,
                  0.358,
                  0.898
                ],
                "normalized_bbox": [
                  0.308,
                  0.848,
                  0.358,
                  0.898
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "PDI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "TIT-0026",
        "type": "sensor_temperature",
        "label": "TIT\n0026",
        "bbox": [
          0.408,
          0.508,
          0.458,
          0.558
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument according to RULE 1. The label 'TIT' denotes a Temperature Indicating Transmitter.",
          "description": "Temperature Indicating Transmitter",
          "instrument_function": "Temperature Indicating Transmitter",
          "tag": "TIT-0026",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.408,
            0.508,
            0.458,
            0.558
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.408,
                  0.508,
                  0.458,
                  0.558
                ],
                "normalized_bbox": [
                  0.408,
                  0.508,
                  0.458,
                  0.558
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TIT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "TE-0026",
        "type": "sensor_temperature",
        "label": "TE\n0026",
        "bbox": [
          0.408,
          0.618,
          0.458,
          0.668
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as a sensor according to RULE 1. The label 'TE' denotes a Temperature Element, further specified as RTD.",
          "description": "Temperature Element (RTD)",
          "instrument_function": "Temperature Element",
          "tag": "TE-0026",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.408,
            0.618,
            0.458,
            0.668
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.408,
                  0.618,
                  0.458,
                  0.668
                ],
                "normalized_bbox": [
                  0.408,
                  0.618,
                  0.458,
                  0.668
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "CSO-4",
        "type": "valve",
        "label": "CSO",
        "bbox": [
          0.438,
          0.702,
          0.468,
          0.732
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, which is classified as a valve according to RULE 2.",
          "description": "Manual Shut-off Valve",
          "equipment_type": "Shut-off Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.438,
            0.702,
            0.468,
            0.732
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.438,
                  0.702,
                  0.468,
                  0.732
                ],
                "normalized_bbox": [
                  0.438,
                  0.702,
                  0.468,
                  0.732
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "PIT-0033",
        "type": "sensor_pressure",
        "label": "PIT\n0033",
        "bbox": [
          0.478,
          0.408,
          0.528,
          0.458
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle shape, classified as an instrument according to RULE 1. The label 'PIT' denotes a Pressure Indicating Transmitter.",
          "description": "Pressure Indicating Transmitter",
          "instrument_function": "Pressure Indicating Transmitter",
          "tag": "PIT-0033",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.478,
            0.408,
            0.528,
            0.458
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.535Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.478,
                  0.408,
                  0.528,
                  0.458
                ],
                "normalized_bbox": [
                  0.478,
                  0.408,
                  0.528,
                  0.458
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PIT",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "PIC-0033",
        "type": "sensor_pressure",
        "label": "PIC\n0033",
        "bbox": [
          0.578,
          0.408,
          0.628,
          0.458
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle inside a square shape, indicating a shared display/control instrument. Classified as an instrument according to RULE 1. The label 'PIC' denotes a Pressure Indicating Controller.",
          "description": "Pressure Indicating Controller (Shared Display/Control)",
          "instrument_function": "Pressure Indicating Controller",
          "location": "Shared Display/Control",
          "tag": "PIC-0033",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.578,
            0.408,
            0.628,
            0.458
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.536Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.578,
                  0.408,
                  0.628,
                  0.458
                ],
                "normalized_bbox": [
                  0.578,
                  0.408,
                  0.628,
                  0.458
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PIC",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "SP-2",
        "type": "valve",
        "label": "SP",
        "bbox": [
          0.478,
          0.502,
          0.508,
          0.532
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a triangle shape, which is a standard symbol for a check valve. Classified as a valve.",
          "description": "Check Valve (Non-Slam Nozzle Check Type)",
          "equipment_type": "Check Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.478,
            0.502,
            0.508,
            0.532
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.536Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.478,
                  0.502,
                  0.508,
                  0.532
                ],
                "normalized_bbox": [
                  0.478,
                  0.502,
                  0.508,
                  0.532
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SP",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: SP"
        }
      },
      {
        "id": "CSO-5",
        "type": "valve",
        "label": "CSO",
        "bbox": [
          0.478,
          0.702,
          0.508,
          0.732
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, which is classified as a valve according to RULE 2.",
          "description": "Manual Shut-off Valve",
          "equipment_type": "Shut-off Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.478,
            0.702,
            0.508,
            0.732
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.536Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.478,
                  0.702,
                  0.508,
                  0.732
                ],
                "normalized_bbox": [
                  0.478,
                  0.702,
                  0.508,
                  0.732
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "NOTE-13-1",
        "type": "valve",
        "label": "NOTE 13",
        "bbox": [
          0.578,
          0.282,
          0.608,
          0.312
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, which is classified as a valve according to RULE 2. The label 'NOTE 13' refers to a note about this valve.",
          "description": "Manual Shut-off Valve (Refer to Note 13)",
          "equipment_type": "Shut-off Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.578,
            0.282,
            0.608,
            0.312
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.536Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.578,
                  0.282,
                  0.608,
                  0.312
                ],
                "normalized_bbox": [
                  0.578,
                  0.282,
                  0.608,
                  0.312
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "NOTE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "N",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: User's Choice Orifice / Restriction Transmitter Sensor / Primary Element"
        }
      },
      {
        "id": "NOTE-13-2",
        "type": "valve",
        "label": "NOTE 13",
        "bbox": [
          0.648,
          0.282,
          0.678,
          0.312
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, which is classified as a valve according to RULE 2. The label 'NOTE 13' refers to a note about this valve.",
          "description": "Manual Shut-off Valve (Refer to Note 13)",
          "equipment_type": "Shut-off Valve",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.648,
            0.282,
            0.678,
            0.312
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.536Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.648,
                  0.282,
                  0.678,
                  0.312
                ],
                "normalized_bbox": [
                  0.648,
                  0.282,
                  0.678,
                  0.312
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "NOTE",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "N",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: User's Choice Orifice / Restriction Transmitter Sensor / Primary Element"
        }
      },
      {
        "id": "PP-1",
        "type": "pipe_section",
        "label": "PP",
        "bbox": [
          0.778,
          0.338,
          0.828,
          0.368
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a rectangle shape containing the label 'PP', indicating a pipe section.",
          "description": "Pipe Section",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.778,
            0.338,
            0.828,
            0.368
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.536Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.778,
                  0.338,
                  0.828,
                  0.368
                ],
                "normalized_bbox": [
                  0.778,
                  0.338,
                  0.828,
                  0.368
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "PP",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PP"
        }
      },
      {
        "id": "PP-2",
        "type": "pipe_section",
        "label": "PP",
        "bbox": [
          0.778,
          0.448,
          0.828,
          0.478
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a rectangle shape containing the label 'PP', indicating a pipe section.",
          "description": "Pipe Section",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.778,
            0.448,
            0.828,
            0.478
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.536Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.778,
                  0.448,
                  0.828,
                  0.478
                ],
                "normalized_bbox": [
                  0.778,
                  0.448,
                  0.828,
                  0.478
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "PP",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PP"
        }
      },
      {
        "id": "PP-3",
        "type": "pipe_section",
        "label": "PP",
        "bbox": [
          0.778,
          0.558,
          0.828,
          0.588
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a rectangle shape containing the label 'PP', indicating a pipe section.",
          "description": "Pipe Section",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.778,
            0.558,
            0.828,
            0.588
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T12:11:08.536Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.778,
                  0.558,
                  0.828,
                  0.588
                ],
                "normalized_bbox": [
                  0.778,
                  0.558,
                  0.828,
                  0.588
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "PP",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PP"
        }
      }
    ],
    "connections": [
      {
        "id": "1767701468536-8rqdvtp1j",
        "from_id": "PV-0027",
        "to_id": "ZC-0020",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "valve",
          "from_label": "PV\n0027",
          "to_label": "ZC\n0020"
        }
      },
      {
        "id": "1767701468536-hg5nq6c32",
        "from_id": "CSO-1",
        "to_id": "PV-0027",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "valve_control",
          "from_label": "CSO",
          "to_label": "PV\n0027"
        }
      },
      {
        "id": "1767701468536-k5ohb29gu",
        "from_id": "PV-0027",
        "to_id": "CSO-2",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "valve",
          "from_label": "PV\n0027",
          "to_label": "CSO"
        }
      },
      {
        "id": "1767701468536-es6rfnag6",
        "from_id": "FIT-0007A",
        "to_id": "FE-0007",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "sensor_flow",
          "from_label": "FIT\n0007 A",
          "to_label": "FE\n0007"
        }
      },
      {
        "id": "1767701468536-66nhtgnzk",
        "from_id": "FE-0007",
        "to_id": "FIT-0007B",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "sensor_flow",
          "from_label": "FE\n0007",
          "to_label": "FIT\n0007 B"
        }
      },
      {
        "id": "1767701468536-9ri27euw5",
        "from_id": "TE-0025",
        "to_id": "TIT-0025",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE\n0025",
          "to_label": "TIT\n0025"
        }
      },
      {
        "id": "1767701468536-cz9i1w9sa",
        "from_id": "TIT-0025",
        "to_id": "TI-0025",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TIT\n0025",
          "to_label": "TI\n0025"
        }
      },
      {
        "id": "1767701468536-nc45617vm",
        "from_id": "CSO-3",
        "to_id": "SP-1",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "valve",
          "from_label": "CSO",
          "to_label": "SP"
        }
      },
      {
        "id": "1767701468536-f5qi160io",
        "from_id": "PDIT-0022",
        "to_id": "PDI-0022",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument",
          "to_component_type": "instrument",
          "from_label": "PDIT\n0022",
          "to_label": "PDI\n0022"
        }
      },
      {
        "id": "1767701468536-f3uooyyde",
        "from_id": "TE-0026",
        "to_id": "TIT-0026",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE\n0026",
          "to_label": "TIT\n0026"
        }
      },
      {
        "id": "1767701468536-eis08nr6y",
        "from_id": "PIT-0033",
        "to_id": "PIC-0033",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_pressure",
          "to_component_type": "sensor_pressure",
          "from_label": "PIT\n0033",
          "to_label": "PIC\n0033"
        }
      },
      {
        "id": "1767701468536-9o91wm6w7",
        "from_id": "CSO-4",
        "to_id": "SP-2",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "valve",
          "from_label": "CSO",
          "to_label": "SP"
        }
      },
      {
        "id": "1767701468536-wo7z2q1lf",
        "from_id": "SP-2",
        "to_id": "CSO-5",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "valve",
          "from_label": "SP",
          "to_label": "CSO"
        }
      },
      {
        "id": "1767701468536-2rob1pg5d",
        "from_id": "NOTE-13-1",
        "to_id": "NOTE-13-2",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "valve",
          "from_label": "NOTE 13",
          "to_label": "NOTE 13"
        }
      },
      {
        "id": "1767701468536-gyi6ama9x",
        "from_id": "NOTE-13-2",
        "to_id": "PP-1",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "pipe_section",
          "from_label": "NOTE 13",
          "to_label": "PP"
        }
      },
      {
        "id": "1767701468536-09ka28upp",
        "from_id": "PIT-0033",
        "to_id": "PIC-0033",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_pressure",
          "to_component_type": "sensor_pressure",
          "from_label": "PIT\n0033",
          "to_label": "PIC\n0033"
        }
      }
    ],
    "metadata": {
      "total_components": 28,
      "total_connections": 16,
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "shape_validation_enabled": true,
        "shape_violations_corrected": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 28,
        "isa_detection_rate": 1,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 0,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 19
      },
      "control_loops": [],
      "validation_issues": [],
      "quality_metrics": {
        "overall_score": 0.9132142857142858,
        "detection_quality": 1,
        "isa_completeness": 1,
        "connection_coverage": 0.5714285714285714,
        "confidence_avg": 0.9964285714285713,
        "metrics": {
          "total_components": 28,
          "total_connections": 16,
          "isa_functions_detected": 28,
          "excellent_detections": 28,
          "avg_confidence": 0.9964285714285713
        }
      }
    },
    "_from_cache": true
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...

[Stage 2 Complete] Final analysis report generated successfully.