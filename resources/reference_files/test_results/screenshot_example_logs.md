Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."}]
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
4type-normalization.ts:155  [Type Normalization] Unknown connection type: "process_connection", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:155
visual-enhancements.ts:54 [Enhancement] Type normalization complete
visual-enhancements.ts:59 [Enhancement] Applying spatial association to merge orphaned labels...
spatial-association.ts:330 [Spatial Association] Starting spatial association post-processing...
spatial-association.ts:196 [Spatial Association] Starting orphaned label detection...
spatial-association.ts:213 [Spatial Association] Found 0 orphaned labels, 0 unlabeled components, 21 already labeled
spatial-association.ts:220 [Spatial Association] No merging needed
spatial-association.ts:341 [Spatial Association] Post-processing complete in 1ms: 21 → 21 components (0 merged)
visual-enhancements.ts:68 [Enhancement] Spatial association complete: 0 orphaned labels merged, 21 total components remain
visual-enhancements.ts:77 [Enhancement] Applying strict geometric shape validation...
shape-validator.ts:411 [Shape Validator] Starting shape validation...
shape-validator.ts:445 [Shape Validator] All components passed shape validation
shape-validator.ts:462 [Shape Validator] Validation complete: 0/21 validated, 0 corrected
visual-enhancements.ts:80 [Enhancement] Shape validation complete: 0 components corrected
visual-enhancements.ts:87 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:92 [Enhancement] ISA detection complete: 7/21 components have ISA functions (33%)
visual-enhancements.ts:100 [Enhancement] Enhancing connections...
visual-enhancements.ts:106 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:115 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:132 [Enhancement] Validating connections...
visual-enhancements.ts:138  [Enhancement] Connection validation found 6 issues (6 errors, 0 warnings)
enhanceVisualAnalysis @ visual-enhancements.ts:138
visual-enhancements.ts:144 [Enhancement] Auto-correcting connection type mismatches...
visual-enhancements.ts:152 [Enhancement] Detecting control loops...
visual-enhancements.ts:154 [Enhancement] Detected 0 control loops
visual-enhancements.ts:158 [Enhancement] Post-processing complete in 4ms
visual.ts:109 [Visual Pipeline] Quality Score: 0.77
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767696860147-itz9tf8qi","type":"SCHEMATIC","processing_time_ms":72288,"components":21}]
BlueprintWorkspace.tsx:97 Stage 1 (Visual Analysis) complete: Objectcache_hit: falseclassification: confidence: 1reasoning: "The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."type: "SCHEMATIC"[[Prototype]]: Objectdocument_id: "1767696860147-itz9tf8qi"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 72288timestamp: 1767696932435visual: components: Array(21)0: {id: '1PK-1801', type: 'system_identifier', label: '1PK-1801', bbox: Array(4), confidence: 1, …}1: {id: 'GL_EXTRACTION_COLD_BOX', type: 'equipment_description', label: 'GL EXTRACTION COLD BOX', bbox: Array(4), confidence: 1, …}2: {id: '1TI-18010_shared', type: 'shared_display_indicator', label: '1TI 18010', bbox: Array(4), confidence: 1, …}3: {id: '1TE-18010', type: 'temperature_sensor', label: '1TE 18010', bbox: Array(4), confidence: 1, …}4: {id: '1TI-18007_shared', type: 'shared_display_indicator', label: '1TI 18007', bbox: Array(4), confidence: 1, …}5: {id: '1TE-18007', type: 'temperature_sensor', label: '1TE 18007', bbox: Array(4), confidence: 1, …}6: {id: 'Logic-2oo3-SDP1-18-09_top', type: 'logic_function', label: '1I 2oo3 SDP1 18-09', bbox: Array(4), confidence: 1, …}7: {id: '1FIT-18185A', type: 'flow_indicator_transmitter', label: '1FIT 18185A', bbox: Array(4), confidence: 1, …}8: {id: 'Valve-1VA-181355_top_left', type: 'valve', label: 'UNREADABLE', bbox: Array(4), confidence: 0.9, …}9: {id: 'Valve-1VA-181355_bottom_left', type: 'valve', label: 'UNREADABLE', bbox: Array(4), confidence: 0.9, …}10: {id: 'Valve-1VA-181356_top_right', type: 'valve', label: 'UNREADABLE', bbox: Array(4), confidence: 0.9, …}11: {id: 'Valve-1VA-181356_bottom_right', type: 'valve', label: 'UNREADABLE', bbox: Array(4), confidence: 0.9, …}12: {id: '1FE-18185', type: 'flow_element', label: '1FE 18185', bbox: Array(4), confidence: 1, …}13: {id: '1PI-18008', type: 'pressure_indicator', label: '1PI 18008', bbox: Array(4), confidence: 1, …}14: {id: '1SC-18002', type: 'speed_controller', label: '1SC 18002', bbox: Array(4), confidence: 1, …}15: {id: 'Logic-2oo3-SDP1-18-09_bottom', type: 'logic_function', label: '1I 2oo3 SDP1 18-09', bbox: Array(4), confidence: 1, …}16: {id: '1FIT-18185B', type: 'flow_indicator_transmitter', label: '1FIT 18185B', bbox: Array(4), confidence: 1, …}17: {id: '1FIT-18185C', type: 'flow_indicator_transmitter', label: '1FIT 18185C', bbox: Array(4), confidence: 1, …}18: {id: 'Logic-1I_bottom_right', type: 'logic_function', label: '1I', bbox: Array(4), confidence: 1, …}19: {id: '1XV-18362', type: 'unclassified_instrument', label: '1XV 18362', bbox: Array(4), confidence: 0.8, …}20: {id: 'Valve-1VA-180378', type: 'valve', label: 'UNREADABLE', bbox: Array(4), confidence: 0.9, …}length: 21[[Prototype]]: Array(0)connections: Array(17)0: {id: '1767696932426-3rddgfc38', from_id: '1TE-18010', to_id: '1TI-18010_shared', type: 'unknown', confidence: 1, …}1: {id: '1767696932426-mw4yt2a02', from_id: '1TE-18007', to_id: '1TI-18007_shared', type: 'unknown', confidence: 1, …}2: {id: '1767696932426-3mj0bmgoa', from_id: 'Logic-2oo3-SDP1-18-09_top', to_id: '1FIT-18185A', type: 'control_signal', confidence: 1, …}3: {id: '1767696932426-xgczpsg9q', from_id: 'Valve-1VA-181355_top_left', to_id: 'Valve-1VA-181355_bottom_left', type: 'process_flow', confidence: 0.9, …}4: {id: '1767696932426-774kbtp3d', from_id: 'Valve-1VA-181355_bottom_left', to_id: '1FE-18185', type: 'process_flow', confidence: 1, …}5: {id: '1767696932426-tzosmcgn8', from_id: '1FE-18185', to_id: 'Valve-1VA-181356_bottom_right', type: 'process_flow', confidence: 1, …}6: {id: '1767696932426-0imh7bhih', from_id: 'Valve-1VA-181356_bottom_right', to_id: 'Valve-1VA-181356_top_right', type: 'process_flow', confidence: 0.9, …}7: {id: '1767696932426-pith534sl', from_id: '1FE-18185', to_id: '1FIT-18185A', type: 'unknown', confidence: 1, …}8: {id: '1767696932426-sut5yds0a', from_id: '1PI-18008', to_id: 'UNREADABLE_pipe_1VA-180147', type: 'unknown', confidence: 1}9: {id: '1767696932426-l7ysp4qbx', from_id: 'Logic-2oo3-SDP1-18-09_bottom', to_id: '1FIT-18185C', type: 'control_signal', confidence: 1, …}10: {id: '1767696932426-7jygm3lqx', from_id: 'UNREADABLE_pipe_1VA-180975', to_id: '1FIT-18185B', type: 'process_flow', confidence: 1}11: {id: '1767696932426-dlrenfslz', from_id: 'UNREADABLE_pipe_1VA-180973', to_id: '1FIT-18185B', type: 'process_flow', confidence: 1}12: {id: '1767696932426-001i4l763', from_id: '1FIT-18185B', to_id: 'UNREADABLE_pipe_1VA-180974', type: 'process_flow', confidence: 1}13: {id: '1767696932426-apbo2o0ro', from_id: '1FIT-18185B', to_id: 'UNREADABLE_pipe_1VA-180983', type: 'process_flow', confidence: 1}14: {id: '1767696932426-e5uw3t5zd', from_id: 'Logic-1I_bottom_right', to_id: '1XV-18362', type: 'control_signal', confidence: 1, …}15: {id: '1767696932426-2xht92l0m', from_id: 'UNREADABLE_pipe_1VA-180378', to_id: 'Valve-1VA-180378', type: 'process_flow', confidence: 1}confidence: 1from_id: "UNREADABLE_pipe_1VA-180378"id: "1767696932426-2xht92l0m"to_id: "Valve-1VA-180378"type: "process_flow"[[Prototype]]: Object16: {id: '1767696932426-rtkg5ugj1', from_id: 'Valve-1VA-180378', to_id: '1XV-18362', type: 'process_flow', confidence: 1, …}confidence: 1from_id: "Valve-1VA-180378"id: "1767696932426-rtkg5ugj1"meta: {inferred_type: 'unknown', type_confidence: 0.5, type_reasoning: 'Could not determine connection type from component types', from_component_type: 'valve', to_component_type: 'unclassified_instrument', …}from_component_type: "valve"from_label: "UNREADABLE"inferred_type: "unknown"to_component_type: "unclassified_instrument"to_label: "1XV 18362"type_confidence: 0.5type_reasoning: "Could not determine connection type from component types"[[Prototype]]: Objectto_id: "1XV-18362"type: "process_flow"[[Prototype]]: Objectlength: 17[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 4inferred_connections: 0isa_detection_enabled: trueisa_detection_rate: 0.3333333333333333isa_functions_detected: 7loop_detection_enabled: trueorphaned_labels_merged: 0shape_validation_enabled: trueshape_violations_corrected: 0spatial_association_enabled: truevalidation_enabled: truevalidation_issues: 6[[Prototype]]: Objectprocess_log: undefinedquality_metrics: confidence_avg: 0.9666666666666667connection_coverage: 0.8095238095238095detection_quality: 0.9523809523809523isa_completeness: 0.3333333333333333metrics: avg_confidence: 0.9666666666666667excellent_detections: 20isa_functions_detected: 7total_components: 21total_connections: 17[[Prototype]]: Objectoverall_score: 0.7733333333333332[[Prototype]]: Objecttotal_components: 21total_connections: 17validation_issues: Array(6)0: connection: confidence: 1from_id: "1PI-18008"id: "1767696932426-sut5yds0a"to_id: "UNREADABLE_pipe_1VA-180147"type: "unknown"[[Prototype]]: Objectissue: "Target component not found: UNREADABLE_pipe_1VA-180147"severity: "error"[[Prototype]]: Object1: connection: confidence: 1from_id: "UNREADABLE_pipe_1VA-180975"id: "1767696932426-7jygm3lqx"to_id: "1FIT-18185B"type: "process_flow"[[Prototype]]: Objectissue: "Source component not found: UNREADABLE_pipe_1VA-180975"severity: "error"[[Prototype]]: Object2: connection: confidence: 1from_id: "UNREADABLE_pipe_1VA-180973"id: "1767696932426-dlrenfslz"to_id: "1FIT-18185B"type: "process_flow"[[Prototype]]: Objectissue: "Source component not found: UNREADABLE_pipe_1VA-180973"severity: "error"[[Prototype]]: Object3: connection: confidence: 1from_id: "1FIT-18185B"id: "1767696932426-001i4l763"to_id: "UNREADABLE_pipe_1VA-180974"type: "process_flow"[[Prototype]]: Objectissue: "Target component not found: UNREADABLE_pipe_1VA-180974"severity: "error"[[Prototype]]: Object4: connection: confidence: 1from_id: "1FIT-18185B"id: "1767696932426-apbo2o0ro"to_id: "UNREADABLE_pipe_1VA-180983"type: "process_flow"[[Prototype]]: Objectissue: "Target component not found: UNREADABLE_pipe_1VA-180983"severity: "error"[[Prototype]]: Object5: connection: confidence: 1from_id: "UNREADABLE_pipe_1VA-180378"id: "1767696932426-2xht92l0m"to_id: "Valve-1VA-180378"type: "process_flow"[[Prototype]]: Objectissue: "Source component not found: UNREADABLE_pipe_1VA-180378"severity: "error"[[Prototype]]: Objectlength: 6[[Prototype]]: Array(0)[[Prototype]]: Object[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:134 [Stage 2] Starting background analysis...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767696932527
BlueprintWorkspace.tsx:168 [Stage 2] Background job queued: analysis-job-1-1767696932527
BlueprintWorkspace.tsx:134 [Stage 2] Queuing background analysis on server...

Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767696860147-itz9tf8qi","type":"SCHEMATIC","processing_time_ms":72288,"components":21}]

{
  "document_id": "1767696860147-itz9tf8qi",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767696932435,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."
  },
  "processing_time_ms": 72288,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "1PK-1801",
        "type": "system_identifier",
        "label": "1PK-1801",
        "bbox": [
          0.29,
          0.09,
          0.45,
          0.12
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a system identifier from the main title text.",
          "description": "Process Package Identifier",
          "raw_backend_output": [
            0.29,
            0.09,
            0.45,
            0.12
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.09,
                  0.45,
                  0.12
                ],
                "normalized_bbox": [
                  0.29,
                  0.09,
                  0.45,
                  0.12
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
          "isa_reasoning": "No ISA pattern detected for: 1PK-1801 (type: system_identifier)"
        }
      },
      {
        "id": "GL_EXTRACTION_COLD_BOX",
        "type": "equipment_description",
        "label": "GL EXTRACTION COLD BOX",
        "bbox": [
          0.05,
          0.14,
          0.55,
          0.17
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as equipment description from the main title text.",
          "description": "Glycol Extraction Cold Box",
          "raw_backend_output": [
            0.05,
            0.14,
            0.55,
            0.17
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.14,
                  0.55,
                  0.17
                ],
                "normalized_bbox": [
                  0.05,
                  0.14,
                  0.55,
                  0.17
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "GL",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Gauging",
          "isa_modifier": "Low",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: GL-EXTRACTION-COLD-BOX"
        }
      },
      {
        "id": "1TI-18010_shared",
        "type": "shared_display_indicator",
        "label": "1TI 18010",
        "bbox": [
          0.12,
          0.25,
          0.2,
          0.32
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle inside a square, indicating a shared display/control instrument. Label '1TI' denotes Temperature Indicator.",
          "description": "Temperature Indicator, Shared Display",
          "instrument_function": "Temperature Indicator",
          "location": "Shared Display/Control",
          "raw_backend_output": [
            0.12,
            0.25,
            0.2,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.25,
                  0.2,
                  0.32
                ],
                "normalized_bbox": [
                  0.12,
                  0.25,
                  0.2,
                  0.32
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
          "isa_reasoning": "No ISA pattern detected for: 1TI-18010 (type: shared_display_indicator)"
        }
      },
      {
        "id": "1TE-18010",
        "type": "temperature_sensor",
        "label": "1TE 18010",
        "bbox": [
          0.12,
          0.36,
          0.2,
          0.43
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, classified as an instrument. Label '1TE' denotes Temperature Element/Sensor.",
          "description": "Temperature Sensor",
          "instrument_function": "Temperature Sensor",
          "location": "Field Mounted",
          "raw_backend_output": [
            0.12,
            0.36,
            0.2,
            0.43
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.36,
                  0.2,
                  0.43
                ],
                "normalized_bbox": [
                  0.12,
                  0.36,
                  0.2,
                  0.43
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
          "isa_reasoning": "No ISA pattern detected for: 1TE-18010 (type: temperature_sensor)"
        }
      },
      {
        "id": "1TI-18007_shared",
        "type": "shared_display_indicator",
        "label": "1TI 18007",
        "bbox": [
          0.25,
          0.25,
          0.33,
          0.32
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle inside a square, indicating a shared display/control instrument. Label '1TI' denotes Temperature Indicator.",
          "description": "Temperature Indicator, Shared Display",
          "instrument_function": "Temperature Indicator",
          "location": "Shared Display/Control",
          "raw_backend_output": [
            0.25,
            0.25,
            0.33,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.25,
                  0.33,
                  0.32
                ],
                "normalized_bbox": [
                  0.25,
                  0.25,
                  0.33,
                  0.32
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
          "isa_reasoning": "No ISA pattern detected for: 1TI-18007 (type: shared_display_indicator)"
        }
      },
      {
        "id": "1TE-18007",
        "type": "temperature_sensor",
        "label": "1TE 18007",
        "bbox": [
          0.25,
          0.36,
          0.33,
          0.43
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, classified as an instrument. Label '1TE' denotes Temperature Element/Sensor.",
          "description": "Temperature Sensor",
          "instrument_function": "Temperature Sensor",
          "location": "Field Mounted",
          "raw_backend_output": [
            0.25,
            0.36,
            0.33,
            0.43
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.36,
                  0.33,
                  0.43
                ],
                "normalized_bbox": [
                  0.25,
                  0.36,
                  0.33,
                  0.43
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
          "isa_reasoning": "No ISA pattern detected for: 1TE-18007 (type: temperature_sensor)"
        }
      },
      {
        "id": "Logic-2oo3-SDP1-18-09_top",
        "type": "logic_function",
        "label": "1I 2oo3 SDP1 18-09",
        "bbox": [
          0.48,
          0.2,
          0.55,
          0.27
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Logic Function (2-out-of-3 voting)",
          "equipment_type": "PLC/Logic",
          "raw_backend_output": [
            0.48,
            0.2,
            0.55,
            0.27
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.2,
                  0.55,
                  0.27
                ],
                "normalized_bbox": [
                  0.48,
                  0.2,
                  0.55,
                  0.27
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
          "isa_reasoning": "No ISA pattern detected for: 1I-2OO3-SDP1-18-09 (type: logic_function)"
        }
      },
      {
        "id": "1FIT-18185A",
        "type": "flow_indicator_transmitter",
        "label": "1FIT 18185A",
        "bbox": [
          0.48,
          0.36,
          0.55,
          0.43
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, classified as an instrument. Label '1FIT' denotes Flow Indicator Transmitter.",
          "description": "Flow Indicator Transmitter",
          "instrument_function": "Flow Indicator Transmitter",
          "location": "Field Mounted",
          "raw_backend_output": [
            0.48,
            0.36,
            0.55,
            0.43
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.36,
                  0.55,
                  0.43
                ],
                "normalized_bbox": [
                  0.48,
                  0.36,
                  0.55,
                  0.43
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
          "isa_reasoning": "No ISA pattern detected for: 1FIT-18185A (type: flow_indicator_transmitter)"
        }
      },
      {
        "id": "Valve-1VA-181355_top_left",
        "type": "valve",
        "label": "UNREADABLE",
        "bbox": [
          0.45,
          0.46,
          0.49,
          0.5
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected bowtie shape, classified as a valve. Part of a manifold around a flow element.",
          "description": "Isolation Valve",
          "raw_backend_output": [
            0.45,
            0.46,
            0.49,
            0.5
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.46,
                  0.49,
                  0.5
                ],
                "normalized_bbox": [
                  0.45,
                  0.46,
                  0.49,
                  0.5
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "UN",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Multivariable",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: UNREADABLE"
        }
      },
      {
        "id": "Valve-1VA-181355_bottom_left",
        "type": "valve",
        "label": "UNREADABLE",
        "bbox": [
          0.45,
          0.5,
          0.49,
          0.54
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected bowtie shape, classified as a valve. Part of a manifold around a flow element.",
          "description": "Isolation Valve",
          "raw_backend_output": [
            0.45,
            0.5,
            0.49,
            0.54
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.425Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.5,
                  0.49,
                  0.54
                ],
                "normalized_bbox": [
                  0.45,
                  0.5,
                  0.49,
                  0.54
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "UN",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Multivariable",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: UNREADABLE"
        }
      },
      {
        "id": "Valve-1VA-181356_top_right",
        "type": "valve",
        "label": "UNREADABLE",
        "bbox": [
          0.53,
          0.46,
          0.57,
          0.5
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected bowtie shape, classified as a valve. Part of a manifold around a flow element.",
          "description": "Isolation Valve",
          "raw_backend_output": [
            0.53,
            0.46,
            0.57,
            0.5
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.53,
                  0.46,
                  0.57,
                  0.5
                ],
                "normalized_bbox": [
                  0.53,
                  0.46,
                  0.57,
                  0.5
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "UN",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Multivariable",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: UNREADABLE"
        }
      },
      {
        "id": "Valve-1VA-181356_bottom_right",
        "type": "valve",
        "label": "UNREADABLE",
        "bbox": [
          0.53,
          0.5,
          0.57,
          0.54
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected bowtie shape, classified as a valve. Part of a manifold around a flow element.",
          "description": "Isolation Valve",
          "raw_backend_output": [
            0.53,
            0.5,
            0.57,
            0.54
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.53,
                  0.5,
                  0.57,
                  0.54
                ],
                "normalized_bbox": [
                  0.53,
                  0.5,
                  0.57,
                  0.54
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "UN",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Multivariable",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: UNREADABLE"
        }
      },
      {
        "id": "1FE-18185",
        "type": "flow_element",
        "label": "1FE 18185",
        "bbox": [
          0.48,
          0.6,
          0.55,
          0.67
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, classified as an instrument. Label '1FE' denotes Flow Element, likely an orifice plate.",
          "description": "Flow Element (Orifice Plate)",
          "instrument_function": "Flow Element",
          "location": "Field Mounted",
          "raw_backend_output": [
            0.48,
            0.6,
            0.55,
            0.67
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.6,
                  0.55,
                  0.67
                ],
                "normalized_bbox": [
                  0.48,
                  0.6,
                  0.55,
                  0.67
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
          "isa_reasoning": "No ISA pattern detected for: 1FE-18185 (type: flow_element)"
        }
      },
      {
        "id": "1PI-18008",
        "type": "pressure_indicator",
        "label": "1PI 18008",
        "bbox": [
          0.67,
          0.36,
          0.74,
          0.43
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, classified as an instrument. Label '1PI' denotes Pressure Indicator.",
          "description": "Pressure Indicator",
          "instrument_function": "Pressure Indicator",
          "location": "Field Mounted",
          "raw_backend_output": [
            0.67,
            0.36,
            0.74,
            0.43
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.67,
                  0.36,
                  0.74,
                  0.43
                ],
                "normalized_bbox": [
                  0.67,
                  0.36,
                  0.74,
                  0.43
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "PI",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.8,
          "isa_reasoning": "Extracted from description: \"Pressure Indicator\""
        }
      },
      {
        "id": "1SC-18002",
        "type": "speed_controller",
        "label": "1SC 18002",
        "bbox": [
          0.8,
          0.36,
          0.87,
          0.43
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, classified as an instrument. Label '1SC' denotes Speed Controller (S=Speed, C=Controller).",
          "description": "Speed Controller",
          "instrument_function": "Speed Controller",
          "location": "Field Mounted",
          "raw_backend_output": [
            0.8,
            0.36,
            0.87,
            0.43
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.8,
                  0.36,
                  0.87,
                  0.43
                ],
                "normalized_bbox": [
                  0.8,
                  0.36,
                  0.87,
                  0.43
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
          "isa_reasoning": "No ISA pattern detected for: 1SC-18002 (type: speed_controller)"
        }
      },
      {
        "id": "Logic-2oo3-SDP1-18-09_bottom",
        "type": "logic_function",
        "label": "1I 2oo3 SDP1 18-09",
        "bbox": [
          0.29,
          0.74,
          0.36,
          0.81
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Logic Function (2-out-of-3 voting)",
          "equipment_type": "PLC/Logic",
          "raw_backend_output": [
            0.29,
            0.74,
            0.36,
            0.81
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.74,
                  0.36,
                  0.81
                ],
                "normalized_bbox": [
                  0.29,
                  0.74,
                  0.36,
                  0.81
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
          "isa_reasoning": "No ISA pattern detected for: 1I-2OO3-SDP1-18-09 (type: logic_function)"
        }
      },
      {
        "id": "1FIT-18185B",
        "type": "flow_indicator_transmitter",
        "label": "1FIT 18185B",
        "bbox": [
          0.48,
          0.79,
          0.55,
          0.86
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, classified as an instrument. Label '1FIT' denotes Flow Indicator Transmitter.",
          "description": "Flow Indicator Transmitter",
          "instrument_function": "Flow Indicator Transmitter",
          "location": "Field Mounted",
          "raw_backend_output": [
            0.48,
            0.79,
            0.55,
            0.86
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.79,
                  0.55,
                  0.86
                ],
                "normalized_bbox": [
                  0.48,
                  0.79,
                  0.55,
                  0.86
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
          "isa_reasoning": "No ISA pattern detected for: 1FIT-18185B (type: flow_indicator_transmitter)"
        }
      },
      {
        "id": "1FIT-18185C",
        "type": "flow_indicator_transmitter",
        "label": "1FIT 18185C",
        "bbox": [
          0.48,
          0.9,
          0.55,
          0.97
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, classified as an instrument. Label '1FIT' denotes Flow Indicator Transmitter.",
          "description": "Flow Indicator Transmitter",
          "instrument_function": "Flow Indicator Transmitter",
          "location": "Field Mounted",
          "raw_backend_output": [
            0.48,
            0.9,
            0.55,
            0.97
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.9,
                  0.55,
                  0.97
                ],
                "normalized_bbox": [
                  0.48,
                  0.9,
                  0.55,
                  0.97
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
          "isa_reasoning": "No ISA pattern detected for: 1FIT-18185C (type: flow_indicator_transmitter)"
        }
      },
      {
        "id": "Logic-1I_bottom_right",
        "type": "logic_function",
        "label": "1I",
        "bbox": [
          0.78,
          0.74,
          0.85,
          0.81
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Logic Function",
          "equipment_type": "PLC/Logic",
          "raw_backend_output": [
            0.78,
            0.74,
            0.85,
            0.81
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.78,
                  0.74,
                  0.85,
                  0.81
                ],
                "normalized_bbox": [
                  0.78,
                  0.74,
                  0.85,
                  0.81
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
          "isa_reasoning": "No ISA pattern detected for: 1I (type: logic_function)"
        }
      },
      {
        "id": "1XV-18362",
        "type": "unclassified_instrument",
        "label": "1XV 18362",
        "bbox": [
          0.88,
          0.79,
          0.95,
          0.86
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected circle shape, which by strict rule is classified as an instrument or sensor. The label '1XV' suggests an Unclassified Valve (V=Valve), but the explicit instruction 'DO NOT classify circles as valves - circles are NEVER valves' takes precedence over the label's 'V' suffix.",
          "description": "Unclassified Instrument (labeled as a valve but visually a circle)",
          "instrument_function": "Unclassified",
          "raw_backend_output": [
            0.88,
            0.79,
            0.95,
            0.86
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.88,
                  0.79,
                  0.95,
                  0.86
                ],
                "normalized_bbox": [
                  0.88,
                  0.79,
                  0.95,
                  0.86
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "good",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1XV-18362 (type: unclassified_instrument)"
        }
      },
      {
        "id": "Valve-1VA-180378",
        "type": "valve",
        "label": "UNREADABLE",
        "bbox": [
          0.88,
          0.69,
          0.92,
          0.73
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected bowtie shape, classified as a valve. Associated with pipe 1VA-180378.",
          "description": "Isolation Valve",
          "raw_backend_output": [
            0.88,
            0.69,
            0.92,
            0.73
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T10:55:32.426Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.88,
                  0.69,
                  0.92,
                  0.73
                ],
                "normalized_bbox": [
                  0.88,
                  0.69,
                  0.92,
                  0.73
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "UN",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Multivariable",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: UNREADABLE"
        }
      }
    ],
    "connections": [
      {
        "id": "1767696932426-3rddgfc38",
        "from_id": "1TE-18010",
        "to_id": "1TI-18010_shared",
        "type": "unknown",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "temperature_sensor",
          "to_component_type": "shared_display_indicator",
          "from_label": "1TE 18010",
          "to_label": "1TI 18010"
        }
      },
      {
        "id": "1767696932426-mw4yt2a02",
        "from_id": "1TE-18007",
        "to_id": "1TI-18007_shared",
        "type": "unknown",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "temperature_sensor",
          "to_component_type": "shared_display_indicator",
          "from_label": "1TE 18007",
          "to_label": "1TI 18007"
        }
      },
      {
        "id": "1767696932426-3mj0bmgoa",
        "from_id": "Logic-2oo3-SDP1-18-09_top",
        "to_id": "1FIT-18185A",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "flow_indicator_transmitter",
          "from_label": "1I 2oo3 SDP1 18-09",
          "to_label": "1FIT 18185A"
        }
      },
      {
        "id": "1767696932426-xgczpsg9q",
        "from_id": "Valve-1VA-181355_top_left",
        "to_id": "Valve-1VA-181355_bottom_left",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "valve",
          "from_label": "UNREADABLE",
          "to_label": "UNREADABLE"
        }
      },
      {
        "id": "1767696932426-774kbtp3d",
        "from_id": "Valve-1VA-181355_bottom_left",
        "to_id": "1FE-18185",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "flow_element",
          "from_label": "UNREADABLE",
          "to_label": "1FE 18185"
        }
      },
      {
        "id": "1767696932426-tzosmcgn8",
        "from_id": "1FE-18185",
        "to_id": "Valve-1VA-181356_bottom_right",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "flow_element",
          "to_component_type": "valve",
          "from_label": "1FE 18185",
          "to_label": "UNREADABLE"
        }
      },
      {
        "id": "1767696932426-0imh7bhih",
        "from_id": "Valve-1VA-181356_bottom_right",
        "to_id": "Valve-1VA-181356_top_right",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "valve",
          "from_label": "UNREADABLE",
          "to_label": "UNREADABLE"
        }
      },
      {
        "id": "1767696932426-pith534sl",
        "from_id": "1FE-18185",
        "to_id": "1FIT-18185A",
        "type": "unknown",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "flow_element",
          "to_component_type": "flow_indicator_transmitter",
          "from_label": "1FE 18185",
          "to_label": "1FIT 18185A"
        }
      },
      {
        "id": "1767696932426-sut5yds0a",
        "from_id": "1PI-18008",
        "to_id": "UNREADABLE_pipe_1VA-180147",
        "type": "unknown",
        "confidence": 1
      },
      {
        "id": "1767696932426-l7ysp4qbx",
        "from_id": "Logic-2oo3-SDP1-18-09_bottom",
        "to_id": "1FIT-18185C",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "flow_indicator_transmitter",
          "from_label": "1I 2oo3 SDP1 18-09",
          "to_label": "1FIT 18185C"
        }
      },
      {
        "id": "1767696932426-7jygm3lqx",
        "from_id": "UNREADABLE_pipe_1VA-180975",
        "to_id": "1FIT-18185B",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767696932426-dlrenfslz",
        "from_id": "UNREADABLE_pipe_1VA-180973",
        "to_id": "1FIT-18185B",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767696932426-001i4l763",
        "from_id": "1FIT-18185B",
        "to_id": "UNREADABLE_pipe_1VA-180974",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767696932426-apbo2o0ro",
        "from_id": "1FIT-18185B",
        "to_id": "UNREADABLE_pipe_1VA-180983",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767696932426-e5uw3t5zd",
        "from_id": "Logic-1I_bottom_right",
        "to_id": "1XV-18362",
        "type": "control_signal",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "unclassified_instrument",
          "from_label": "1I",
          "to_label": "1XV 18362"
        }
      },
      {
        "id": "1767696932426-2xht92l0m",
        "from_id": "UNREADABLE_pipe_1VA-180378",
        "to_id": "Valve-1VA-180378",
        "type": "process_flow",
        "confidence": 1
      },
      {
        "id": "1767696932426-rtkg5ugj1",
        "from_id": "Valve-1VA-180378",
        "to_id": "1XV-18362",
        "type": "process_flow",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve",
          "to_component_type": "unclassified_instrument",
          "from_label": "UNREADABLE",
          "to_label": "1XV 18362"
        }
      }
    ],
    "metadata": {
      "total_components": 21,
      "total_connections": 17,
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "shape_validation_enabled": true,
        "shape_violations_corrected": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 7,
        "isa_detection_rate": 0.3333333333333333,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 6,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 4
      },
      "control_loops": [],
      "validation_issues": [
        {
          "connection": {
            "id": "1767696932426-sut5yds0a",
            "from_id": "1PI-18008",
            "to_id": "UNREADABLE_pipe_1VA-180147",
            "type": "unknown",
            "confidence": 1
          },
          "issue": "Target component not found: UNREADABLE_pipe_1VA-180147",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767696932426-7jygm3lqx",
            "from_id": "UNREADABLE_pipe_1VA-180975",
            "to_id": "1FIT-18185B",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Source component not found: UNREADABLE_pipe_1VA-180975",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767696932426-dlrenfslz",
            "from_id": "UNREADABLE_pipe_1VA-180973",
            "to_id": "1FIT-18185B",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Source component not found: UNREADABLE_pipe_1VA-180973",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767696932426-001i4l763",
            "from_id": "1FIT-18185B",
            "to_id": "UNREADABLE_pipe_1VA-180974",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Target component not found: UNREADABLE_pipe_1VA-180974",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767696932426-apbo2o0ro",
            "from_id": "1FIT-18185B",
            "to_id": "UNREADABLE_pipe_1VA-180983",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Target component not found: UNREADABLE_pipe_1VA-180983",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767696932426-2xht92l0m",
            "from_id": "UNREADABLE_pipe_1VA-180378",
            "to_id": "Valve-1VA-180378",
            "type": "process_flow",
            "confidence": 1
          },
          "issue": "Source component not found: UNREADABLE_pipe_1VA-180378",
          "severity": "error"
        }
      ],
      "quality_metrics": {
        "overall_score": 0.7733333333333332,
        "detection_quality": 0.9523809523809523,
        "isa_completeness": 0.3333333333333333,
        "connection_coverage": 0.8095238095238095,
        "confidence_avg": 0.9666666666666667,
        "metrics": {
          "total_components": 21,
          "total_connections": 17,
          "isa_functions_detected": 7,
          "excellent_detections": 20,
          "avg_confidence": 0.9666666666666667
        }
      }
    }
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...









