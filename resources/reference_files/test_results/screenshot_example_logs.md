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
visual-enhancements.ts:37 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:45 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:50 [Enhancement] ISA detection complete: 65/90 components have ISA functions (72%)
visual-enhancements.ts:58 [Enhancement] Enhancing connections...
visual-enhancements.ts:64 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:73 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:90 [Enhancement] Validating connections...
visual-enhancements.ts:110 [Enhancement] Detecting control loops...
visual-enhancements.ts:112 [Enhancement] Detected 0 control loops
visual-enhancements.ts:116 [Enhancement] Post-processing complete in 5ms
visual.ts:107 [Visual Pipeline] Quality Score: 0.81
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767673167540-tf5yid7kj","type":"SCHEMATIC","processing_time_ms":91853,"components":90}]
BlueprintWorkspace.tsx:97 Stage 1 (Visual Analysis) complete: Objectcache_hit: falseclassification: confidence: 1reasoning: "The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."type: "SCHEMATIC"[[Prototype]]: Objectdocument_id: "1767673167540-tf5yid7kj"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 91853timestamp: 1767673259393visual: components: Array(90)0: {id: 'TE-1408', type: 'sensor_temperature', label: 'TE 1408', bbox: Array(4), confidence: 1, …}1: {id: 'TT-1408', type: 'sensor_temperature', label: 'TT 1408', bbox: Array(4), confidence: 1, …}2: {id: 'TI-1408', type: 'sensor_temperature', label: 'TI 1408', bbox: Array(4), confidence: 1, …}3: {id: 'FF-1408_label', type: 'Text Label', label: 'FF 1408', bbox: Array(4), confidence: 1, …}4: {id: 'NNF-1', type: 'Text Label', label: 'NNF', bbox: Array(4), confidence: 1, …}5: {id: 'Valve-Manual-Gate-1', type: 'Manual Gate Valve', label: 'X3/4"', bbox: Array(4), confidence: 1, …}6: {id: 'Valve-Control-ManualActuator-FO-1', type: 'Control Valve', label: 'FO', bbox: Array(4), confidence: 0.9, …}7: {id: 'Valve-Manual-Gate-2', type: 'Manual Gate Valve', label: 'X3/4"', bbox: Array(4), confidence: 1, …}8: {id: 'FE-1403', type: 'sensor_flow', label: 'FE 1403', bbox: Array(4), confidence: 1, …}9: {id: 'A19A-D4G', type: 'Text Label', label: 'A19A D4G', bbox: Array(4), confidence: 1, …}10: {id: 'FIC-1405', type: 'sensor_flow', label: 'FIC 1405', bbox: Array(4), confidence: 1, …}11: {id: 'FE-1405', type: 'sensor_flow', label: 'FE 1405', bbox: Array(4), confidence: 1, …}12: {id: 'FF-1405_label_1', type: 'Text Label', label: 'FF 1405', bbox: Array(4), confidence: 1, …}13: {id: 'FV-1405', type: 'valve_control', label: 'FV 1405', bbox: Array(4), confidence: 1, …}14: {id: 'A19A-A16A', type: 'Text Label', label: 'A19A A16A', bbox: Array(4), confidence: 1, …}15: {id: 'Pipe-4-WP-116-1401-A16A-IS', type: 'Process Line', label: '4"-WP-116-1401-A16A-IS', bbox: Array(4), confidence: 1, …}16: {id: 'GRAVITY-FLOW', type: 'Text Label', label: 'GRAVITY FLOW', bbox: Array(4), confidence: 1, …}17: {id: 'NNF-2', type: 'Text Label', label: 'NNF', bbox: Array(4), confidence: 1, …}18: {id: 'TT-1405', type: 'sensor_temperature', label: 'TT 1405', bbox: Array(4), confidence: 1, …}19: {id: 'TI-1405', type: 'sensor_temperature', label: 'TI 1405', bbox: Array(4), confidence: 1, …}20: {id: 'TE-1405', type: 'sensor_temperature', label: 'TE 1405', bbox: Array(4), confidence: 1, …}21: {id: 'INTERFACE-label', type: 'Text Label', label: 'INTERFACE', bbox: Array(4), confidence: 1, …}22: {id: 'LI-1452', type: 'sensor_level', label: 'LI 1452', bbox: Array(4), confidence: 1, …}23: {id: 'NOTE-8', type: 'Text Label', label: 'NOTE 8', bbox: Array(4), confidence: 1, …}24: {id: 'LT-1402', type: 'sensor_level', label: 'LT 1402', bbox: Array(4), confidence: 1, …}25: {id: 'LI-1402', type: 'sensor_level', label: 'LI 1402', bbox: Array(4), confidence: 1, …}26: {id: 'GWR-label', type: 'Text Label', label: 'GWR', bbox: Array(4), confidence: 1, …}27: {id: 'FF-1405_label_2', type: 'Text Label', label: 'FF 1405', bbox: Array(4), confidence: 1, …}28: {id: 'FE-1405_2', type: 'sensor_flow', label: 'FE 1405', bbox: Array(4), confidence: 1, …}29: {id: 'NOTE-5-7', type: 'Text Label', label: 'NOTE 5, 7', bbox: Array(4), confidence: 1, …}30: {id: 'Valve-Manual-Gate-3', type: 'Manual Gate Valve', label: 'X3/4"', bbox: Array(4), confidence: 1, …}31: {id: 'Valve-Control-DiaphragmActuator-FC-1', type: 'Control Valve', label: 'FC', bbox: Array(4), confidence: 1, …}32: {id: 'Valve-Manual-Gate-4', type: 'Manual Gate Valve', label: 'X3/4"', bbox: Array(4), confidence: 1, …}33: {id: 'TE-1410', type: 'sensor_temperature', label: 'TE 1410', bbox: Array(4), confidence: 1, …}34: {id: 'TT-1410', type: 'sensor_temperature', label: 'TT 1410', bbox: Array(4), confidence: 1, …}35: {id: 'TI-1410', type: 'sensor_temperature', label: 'TI 1410', bbox: Array(4), confidence: 1, …}36: {id: 'FF-1410_label', type: 'Text Label', label: 'FF 1410', bbox: Array(4), confidence: 1, …}37: {id: 'Pipe-24-MW-1', type: 'Process Line', label: '24" MW', bbox: Array(4), confidence: 1, …}38: {id: 'TE-1411', type: 'sensor_temperature', label: 'TE 1411', bbox: Array(4), confidence: 1, …}39: {id: 'TT-1411', type: 'sensor_temperature', label: 'TT 1411', bbox: Array(4), confidence: 1, …}40: {id: 'TI-1411', type: 'sensor_temperature', label: 'TI 1411', bbox: Array(4), confidence: 1, …}41: {id: 'FF-1411_label', type: 'Text Label', label: 'FF 1411', bbox: Array(4), confidence: 1, …}42: {id: 'Pump-1', type: 'Pump', label: 'P', bbox: Array(4), confidence: 1, …}43: {id: 'Flow-Sight-Glass-1', type: 'Flow Sight Glass', label: 'FG', bbox: Array(4), confidence: 1, …}44: {id: 'Pump-2', type: 'Pump', label: 'P', bbox: Array(4), confidence: 1, …}45: {id: 'Flow-Sight-Glass-2', type: 'Flow Sight Glass', label: 'FG', bbox: Array(4), confidence: 1, …}46: {id: 'TE-1416', type: 'sensor_temperature', label: 'TE 1416', bbox: Array(4), confidence: 1, …}47: {id: 'TT-1416', type: 'sensor_temperature', label: 'TT 1416', bbox: Array(4), confidence: 1, …}48: {id: 'TI-1416', type: 'sensor_temperature', label: 'TI 1416', bbox: Array(4), confidence: 1, …}49: {id: 'FF-1416_label', type: 'Text Label', label: 'FF 1416', bbox: Array(4), confidence: 1, …}50: {id: 'LI-1451', type: 'sensor_level', label: 'LI 1451', bbox: Array(4), confidence: 1, …}51: {id: 'LT-1401', type: 'sensor_level', label: 'LT 1401', bbox: Array(4), confidence: 1, …}52: {id: 'LIC-1401', type: 'sensor_level', label: 'LIC 1401', bbox: Array(4), confidence: 1, …}53: {id: 'H-label', type: 'Text Label', label: 'H', bbox: Array(4), confidence: 1, …}54: {id: 'L-label', type: 'Text Label', label: 'L', bbox: Array(4), confidence: 1, …}55: {id: 'FLO-1', type: 'Orifice Plate', label: 'FLO', bbox: Array(4), confidence: 1, …}56: {id: 'P-3', type: 'Pump', label: 'P', bbox: Array(4), confidence: 1, …}57: {id: 'Pipe-24-P-116-1403-A9A-IH', type: 'Process Line', label: '24"-P-116-1403-A9A-IH', bbox: Array(4), confidence: 1, …}58: {id: 'Reducer-6X4', type: 'Reducer', label: '6"X4"', bbox: Array(4), confidence: 1, …}59: {id: 'Reducer-24X18', type: 'Reducer', label: '24"X18"', bbox: Array(4), confidence: 1, …}60: {id: 'TI-1406', type: 'sensor_temperature', label: 'TI 1406', bbox: Array(4), confidence: 1, …}61: {id: 'FF-1406_label', type: 'Text Label', label: 'FF 1406', bbox: Array(4), confidence: 1, …}62: {id: 'TT-1406', type: 'sensor_temperature', label: 'TT 1406', bbox: Array(4), confidence: 1, …}63: {id: 'TE-1406', type: 'sensor_temperature', label: 'TE 1406', bbox: Array(4), confidence: 1, …}64: {id: 'DO-NOT-POCKET-1', type: 'Text Label', label: 'DO NOT POCKET', bbox: Array(4), confidence: 1, …}65: {id: 'DO-NOT-POCKET-2', type: 'Text Label', label: 'DO NOT POCKET', bbox: Array(4), confidence: 1, …}66: {id: 'TI-1407', type: 'sensor_temperature', label: 'TI 1407', bbox: Array(4), confidence: 1, …}67: {id: 'TT-1407', type: 'sensor_temperature', label: 'TT 1407', bbox: Array(4), confidence: 1, …}68: {id: 'TE-1407', type: 'sensor_temperature', label: 'TE 1407', bbox: Array(4), confidence: 1, …}69: {id: 'FF-1407_label', type: 'Text Label', label: 'FF 1407', bbox: Array(4), confidence: 1, …}70: {id: 'TE-1417', type: 'sensor_temperature', label: 'TE 1417', bbox: Array(4), confidence: 1, …}71: {id: 'TT-1417', type: 'sensor_temperature', label: 'TT 1417', bbox: Array(4), confidence: 1, …}72: {id: 'TI-1417', type: 'sensor_temperature', label: 'TI 1417', bbox: Array(4), confidence: 1, …}73: {id: 'FF-1417_label', type: 'Text Label', label: 'FF 1417', bbox: Array(4), confidence: 1, …}74: {id: 'Pipe-24-MW-2', type: 'Process Line', label: '24" MW', bbox: Array(4), confidence: 1, …}75: {id: 'Pipe-4-P-116-1422-B9A-IT', type: 'Process Line', label: '4"-P-116-1422-B9A-IT', bbox: Array(4), confidence: 1, …}76: {id: 'PIC-1404', type: 'sensor_pressure', label: 'PIC 1404', bbox: Array(4), confidence: 1, …}77: {id: 'PT-1404', type: 'sensor_pressure', label: 'PT 1404', bbox: Array(4), confidence: 1, …}78: {id: 'FF-1404_label_1', type: 'Text Label', label: 'FF 1404', bbox: Array(4), confidence: 1, …}79: {id: 'PV-1404', type: 'valve_control', label: 'PV 1404', bbox: Array(4), confidence: 1, …}80: {id: 'FF-1404_label_2', type: 'Text Label', label: 'FF 1404', bbox: Array(4), confidence: 1, …}81: {id: 'Valve-Control-ManualActuator-FO-2', type: 'Control Valve', label: 'FO', bbox: Array(4), confidence: 0.9, …}82: {id: 'Valve-Manual-Gate-5', type: 'Manual Gate Valve', label: 'X1"', bbox: Array(4), confidence: 1, …}83: {id: 'FLO-2', type: 'Orifice Plate', label: 'FLO', bbox: Array(4), confidence: 1, …}84: {id: 'P-4', type: 'Pump', label: 'P', bbox: Array(4), confidence: 1, …}85: {id: 'Valve-Manual-Gate-6', type: 'Manual Gate Valve', label: 'X1"', bbox: Array(4), confidence: 1, …}86: {id: 'L-label-2', type: 'Text Label', label: 'L', bbox: Array(4), confidence: 1, …}87: {id: 'Valve-Manual-Gate-7', type: 'Manual Gate Valve', label: 'X1"', bbox: Array(4), confidence: 1, …}88: {id: 'L-label-3', type: 'Text Label', label: 'L', bbox: Array(4), confidence: 1, …}89: {id: 'Valve-Manual-Gate-8', type: 'Manual Gate Valve', label: 'X1"', bbox: Array(4), confidence: 1, …}length: 90[[Prototype]]: Array(0)connections: Array(38)0: {id: '1767673259380-wndqx3n45', from_id: 'TE-1408', to_id: 'TT-1408', type: 'Process Connection', confidence: 1, …}1: {id: '1767673259380-7xmw4evx3', from_id: 'TT-1408', to_id: 'TI-1408', type: 'Process Connection', confidence: 1, …}2: {id: '1767673259380-5wmueqpwk', from_id: 'FE-1403', to_id: 'Valve-Manual-Gate-2', type: 'Process Connection', confidence: 1, …}3: {id: '1767673259380-o6nwmapdg', from_id: 'Valve-Manual-Gate-2', to_id: 'Valve-Control-ManualActuator-FO-1', type: 'Process Connection', confidence: 1, …}4: {id: '1767673259380-uugqo33tl', from_id: 'Valve-Control-ManualActuator-FO-1', to_id: 'Valve-Manual-Gate-1', type: 'Process Connection', confidence: 1, …}5: {id: '1767673259380-2w0o4iaqq', from_id: 'FE-1405', to_id: 'FIC-1405', type: 'Signal Connection', confidence: 1, …}6: {id: '1767673259380-konkr7d95', from_id: 'FIC-1405', to_id: 'FV-1405', type: 'Signal Connection', confidence: 1, …}7: {id: '1767673259380-d0pwif9r5', from_id: 'FV-1405', to_id: 'Pipe-4-WP-116-1401-A16A-IS', type: 'Process Connection', confidence: 1, …}8: {id: '1767673259380-e2vj0k3b8', from_id: 'TE-1405', to_id: 'TT-1405', type: 'Process Connection', confidence: 1, …}9: {id: '1767673259380-d2dplyrej', from_id: 'TT-1405', to_id: 'TI-1405', type: 'Process Connection', confidence: 1, …}10: {id: '1767673259380-272ctcw2g', from_id: 'FE-1405_2', to_id: 'Valve-Control-DiaphragmActuator-FC-1', type: 'Process Connection', confidence: 1, …}11: {id: '1767673259380-yr5x6vlia', from_id: 'Valve-Control-DiaphragmActuator-FC-1', to_id: 'Valve-Manual-Gate-3', type: 'Process Connection', confidence: 1, …}12: {id: '1767673259380-hvmc3r2k2', from_id: 'Valve-Manual-Gate-3', to_id: 'Valve-Manual-Gate-4', type: 'Process Connection', confidence: 1, …}13: {id: '1767673259380-05qsi4p5z', from_id: 'TE-1410', to_id: 'TT-1410', type: 'Process Connection', confidence: 1, …}14: {id: '1767673259380-akakxelg9', from_id: 'TT-1410', to_id: 'TI-1410', type: 'Process Connection', confidence: 1, …}15: {id: '1767673259380-bd6c4ibwp', from_id: 'TE-1411', to_id: 'TT-1411', type: 'Process Connection', confidence: 1, …}16: {id: '1767673259380-7sk34u8h4', from_id: 'TT-1411', to_id: 'TI-1411', type: 'Process Connection', confidence: 1, …}17: {id: '1767673259380-feafmnz2i', from_id: 'Pump-1', to_id: 'Flow-Sight-Glass-1', type: 'Process Connection', confidence: 1, …}18: {id: '1767673259380-6dlhp9bxj', from_id: 'Flow-Sight-Glass-1', to_id: 'Pump-2', type: 'Process Connection', confidence: 1, …}19: {id: '1767673259380-k6cq3d5ya', from_id: 'Pump-2', to_id: 'Flow-Sight-Glass-2', type: 'Process Connection', confidence: 1, …}20: {id: '1767673259380-5ei2m1rnx', from_id: 'TE-1416', to_id: 'TT-1416', type: 'Process Connection', confidence: 1, …}21: {id: '1767673259380-mlu3m533q', from_id: 'TT-1416', to_id: 'TI-1416', type: 'Process Connection', confidence: 1, …}22: {id: '1767673259380-2ckqce5e2', from_id: 'LT-1401', to_id: 'LIC-1401', type: 'Signal Connection', confidence: 1, …}23: {id: '1767673259380-ild89vjii', from_id: 'TI-1406', to_id: 'TT-1406', type: 'Process Connection', confidence: 1, …}24: {id: '1767673259380-9y4gueby1', from_id: 'TT-1406', to_id: 'TE-1406', type: 'Process Connection', confidence: 1, …}25: {id: '1767673259380-v5gcvw6ki', from_id: 'TI-1407', to_id: 'TT-1407', type: 'Process Connection', confidence: 1, …}26: {id: '1767673259380-7raszu18c', from_id: 'TT-1407', to_id: 'TE-1407', type: 'Process Connection', confidence: 1, …}27: {id: '1767673259380-hxhrgak01', from_id: 'TE-1417', to_id: 'TT-1417', type: 'Process Connection', confidence: 1, …}28: {id: '1767673259380-ie5juimrw', from_id: 'TT-1417', to_id: 'TI-1417', type: 'Process Connection', confidence: 1, …}29: {id: '1767673259380-6krj1u1ps', from_id: 'PT-1404', to_id: 'PIC-1404', type: 'Signal Connection', confidence: 1, …}30: {id: '1767673259380-adn8cic7v', from_id: 'PIC-1404', to_id: 'PV-1404', type: 'Signal Connection', confidence: 1, …}31: {id: '1767673259380-i3dubtcj0', from_id: 'PV-1404', to_id: 'Valve-Control-ManualActuator-FO-2', type: 'Process Connection', confidence: 1, …}32: {id: '1767673259380-xv1fr0fef', from_id: 'Valve-Control-ManualActuator-FO-2', to_id: 'Valve-Manual-Gate-5', type: 'Process Connection', confidence: 1, …}33: {id: '1767673259380-3abtn7hlq', from_id: 'Valve-Manual-Gate-5', to_id: 'FLO-2', type: 'Process Connection', confidence: 1, …}34: {id: '1767673259380-cuuchxw8y', from_id: 'FLO-2', to_id: 'P-4', type: 'Process Connection', confidence: 1, …}35: {id: '1767673259380-riz6uoc6j', from_id: 'P-4', to_id: 'Valve-Manual-Gate-6', type: 'Process Connection', confidence: 1, …}36: {id: '1767673259380-bevbqkyea', from_id: 'Valve-Manual-Gate-6', to_id: 'Valve-Manual-Gate-7', type: 'Process Connection', confidence: 1, …}37: {id: '1767673259380-vmn9ois98', from_id: 'Valve-Manual-Gate-7', to_id: 'Valve-Manual-Gate-8', type: 'Process Connection', confidence: 1, …}length: 38[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 5inferred_connections: 0isa_detection_enabled: trueisa_detection_rate: 0.7222222222222222isa_functions_detected: 65loop_detection_enabled: truevalidation_enabled: truevalidation_issues: 0[[Prototype]]: Objectprocess_log: undefinedquality_metrics: confidence_avg: 0.9977777777777779connection_coverage: 0.4222222222222222detection_quality: 1isa_completeness: 0.7222222222222222metrics: avg_confidence: 0.9977777777777779excellent_detections: 90isa_functions_detected: 65total_components: 90total_connections: 38[[Prototype]]: Objectoverall_score: 0.8143333333333334[[Prototype]]: Objecttotal_components: 90total_connections: 38validation_issues: Array(0)length: 0[[Prototype]]: Array(0)[[Prototype]]: Object[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:134 [Stage 2] Starting background analysis...
index.ts:172  [Stage 2] Failed to queue background analysis: ReferenceError: process is not defined
    at serverConfig.ts:16:18
generateBackgroundAnalysis @ index.ts:172
BlueprintWorkspace.tsx:157  [Stage 2] Final analysis failed: ReferenceError: process is not defined
    at serverConfig.ts:16:18
onError @ BlueprintWorkspace.tsx:157
BlueprintWorkspace.tsx:170  [Stage 2] Failed to queue background job: ReferenceError: process is not defined
    at serverConfig.ts:16:18

    Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767673167540-tf5yid7kj","type":"SCHEMATIC","processing_time_ms":91853,"components":90}]

{
  "document_id": "1767673167540-tf5yid7kj",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767673259393,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."
  },
  "processing_time_ms": 91853,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "TE-1408",
        "type": "sensor_temperature",
        "label": "TE 1408",
        "bbox": [
          0.054,
          0.009,
          0.106,
          0.049
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TE' and '1408' text, indicating a field-mounted temperature primary element.",
          "description": "Temperature Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TE-1408",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.054,
            0.009,
            0.106,
            0.049
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.378Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.054,
                  0.009,
                  0.106,
                  0.049
                ],
                "normalized_bbox": [
                  0.054,
                  0.009,
                  0.106,
                  0.049
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-1408",
        "type": "sensor_temperature",
        "label": "TT 1408",
        "bbox": [
          0.116,
          0.009,
          0.168,
          0.049
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TT' and '1408' text, indicating a field-mounted temperature transmitter.",
          "description": "Temperature Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TT-1408",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.116,
            0.009,
            0.168,
            0.049
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.116,
                  0.009,
                  0.168,
                  0.049
                ],
                "normalized_bbox": [
                  0.116,
                  0.009,
                  0.168,
                  0.049
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TI-1408",
        "type": "sensor_temperature",
        "label": "TI 1408",
        "bbox": [
          0.178,
          0.009,
          0.23,
          0.049
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI' and '1408' text, indicating a field-mounted temperature indicator.",
          "description": "Temperature Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TI-1408",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.178,
            0.009,
            0.23,
            0.049
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.178,
                  0.009,
                  0.23,
                  0.049
                ],
                "normalized_bbox": [
                  0.178,
                  0.009,
                  0.23,
                  0.049
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1408_label",
        "type": "Text Label",
        "label": "FF 1408",
        "bbox": [
          0.178,
          0.05,
          0.22,
          0.065
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1408'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.178,
            0.05,
            0.22,
            0.065
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.178,
                  0.05,
                  0.22,
                  0.065
                ],
                "normalized_bbox": [
                  0.178,
                  0.05,
                  0.22,
                  0.065
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "NNF-1",
        "type": "Text Label",
        "label": "NNF",
        "bbox": [
          0.38,
          0.08,
          0.41,
          0.095
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'NNF'.",
          "description": "Nozzle Normal Flow or similar annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.38,
            0.08,
            0.41,
            0.095
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.38,
                  0.08,
                  0.41,
                  0.095
                ],
                "normalized_bbox": [
                  0.38,
                  0.08,
                  0.41,
                  0.095
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "NN",
          "detection_quality": "excellent",
          "isa_measured_variable": "User Defined",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: NNF"
        }
      },
      {
        "id": "Valve-Manual-Gate-1",
        "type": "Manual Gate Valve",
        "label": "X3/4\"",
        "bbox": [
          0.43,
          0.08,
          0.46,
          0.11
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, indicating a gate valve. The 'X' prefix and lack of actuator symbol (other than a simple square for manual operation) classify it as a manual valve.",
          "description": "Manual Gate Valve, 3/4 inch",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.43,
            0.08,
            0.46,
            0.11
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.43,
                  0.08,
                  0.46,
                  0.11
                ],
                "normalized_bbox": [
                  0.43,
                  0.08,
                  0.46,
                  0.11
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: X3/4\" (type: Manual Gate Valve)"
        }
      },
      {
        "id": "Valve-Control-ManualActuator-FO-1",
        "type": "Control Valve",
        "label": "FO",
        "bbox": [
          0.52,
          0.08,
          0.56,
          0.11
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape with a square actuator symbol and 'FO' (Fail Open) label. While bowtie is typically manual, the 'FO' indicates a fail-safe, suggesting a control function, possibly with a manual override or specific manual operation mode.",
          "description": "Control Valve, Manual Actuator, Fail Open",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.52,
            0.08,
            0.56,
            0.11
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.52,
                  0.08,
                  0.56,
                  0.11
                ],
                "normalized_bbox": [
                  0.52,
                  0.08,
                  0.56,
                  0.11
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FO",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FO"
        }
      },
      {
        "id": "Valve-Manual-Gate-2",
        "type": "Manual Gate Valve",
        "label": "X3/4\"",
        "bbox": [
          0.61,
          0.08,
          0.64,
          0.11
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, indicating a gate valve. The 'X' prefix and lack of actuator symbol (other than a simple square for manual operation) classify it as a manual valve.",
          "description": "Manual Gate Valve, 3/4 inch",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.61,
            0.08,
            0.64,
            0.11
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.61,
                  0.08,
                  0.64,
                  0.11
                ],
                "normalized_bbox": [
                  0.61,
                  0.08,
                  0.64,
                  0.11
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: X3/4\" (type: Manual Gate Valve)"
        }
      },
      {
        "id": "FE-1403",
        "type": "sensor_flow",
        "label": "FE 1403",
        "bbox": [
          0.71,
          0.08,
          0.76,
          0.12
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'FE' and '1403' text, indicating a field-mounted flow primary element.",
          "description": "Flow Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "FE-1403",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.71,
            0.08,
            0.76,
            0.12
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.71,
                  0.08,
                  0.76,
                  0.12
                ],
                "normalized_bbox": [
                  0.71,
                  0.08,
                  0.76,
                  0.12
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "A19A-D4G",
        "type": "Text Label",
        "label": "A19A D4G",
        "bbox": [
          0.34,
          0.14,
          0.41,
          0.155
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'A19A D4G'.",
          "description": "Line or equipment identifier",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.34,
            0.14,
            0.41,
            0.155
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.34,
                  0.14,
                  0.41,
                  0.155
                ],
                "normalized_bbox": [
                  0.34,
                  0.14,
                  0.41,
                  0.155
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: A19A-D4G (type: Text Label)"
        }
      },
      {
        "id": "FIC-1405",
        "type": "sensor_flow",
        "label": "FIC 1405",
        "bbox": [
          0.34,
          0.16,
          0.41,
          0.2
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle-in-square symbol with 'FIC' and '1405' text, indicating a shared display/control flow indicating controller.",
          "description": "Flow Indicating Controller",
          "instrument_function": "Indicator, Controller",
          "location": "Shared Display/Control (DCS)",
          "occlusion_level": "none",
          "tag": "FIC-1405",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.34,
            0.16,
            0.41,
            0.2
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.34,
                  0.16,
                  0.41,
                  0.2
                ],
                "normalized_bbox": [
                  0.34,
                  0.16,
                  0.41,
                  0.2
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FIC",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FE-1405",
        "type": "sensor_flow",
        "label": "FE 1405",
        "bbox": [
          0.43,
          0.21,
          0.48,
          0.25
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'FE' and '1405' text, indicating a field-mounted flow primary element.",
          "description": "Flow Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "FE-1405",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.43,
            0.21,
            0.48,
            0.25
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.43,
                  0.21,
                  0.48,
                  0.25
                ],
                "normalized_bbox": [
                  0.43,
                  0.21,
                  0.48,
                  0.25
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1405_label_1",
        "type": "Text Label",
        "label": "FF 1405",
        "bbox": [
          0.43,
          0.25,
          0.47,
          0.265
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1405'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.43,
            0.25,
            0.47,
            0.265
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.43,
                  0.25,
                  0.47,
                  0.265
                ],
                "normalized_bbox": [
                  0.43,
                  0.25,
                  0.47,
                  0.265
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "FV-1405",
        "type": "valve_control",
        "label": "FV 1405",
        "bbox": [
          0.55,
          0.21,
          0.59,
          0.25
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a triangle body with a diaphragm actuator symbol and 'FV' and '1405' text, indicating a flow control valve.",
          "description": "Flow Control Valve",
          "equipment_type": "Valve",
          "instrument_function": "Valve / Damper / Actuator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "FV-1405",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.55,
            0.21,
            0.59,
            0.25
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.21,
                  0.59,
                  0.25
                ],
                "normalized_bbox": [
                  0.55,
                  0.21,
                  0.59,
                  0.25
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "A19A-A16A",
        "type": "Text Label",
        "label": "A19A A16A",
        "bbox": [
          0.61,
          0.21,
          0.68,
          0.225
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'A19A A16A'.",
          "description": "Line or equipment identifier",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.61,
            0.21,
            0.68,
            0.225
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.61,
                  0.21,
                  0.68,
                  0.225
                ],
                "normalized_bbox": [
                  0.61,
                  0.21,
                  0.68,
                  0.225
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: A19A-A16A (type: Text Label)"
        }
      },
      {
        "id": "Pipe-4-WP-116-1401-A16A-IS",
        "type": "Process Line",
        "label": "4\"-WP-116-1401-A16A-IS",
        "bbox": [
          0.69,
          0.23,
          0.88,
          0.245
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text label associated with a thick solid line, indicating a process pipe.",
          "description": "4 inch Water Pipe, Line 116-1401-A16A-IS",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.69,
            0.23,
            0.88,
            0.245
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.23,
                  0.88,
                  0.245
                ],
                "normalized_bbox": [
                  0.69,
                  0.23,
                  0.88,
                  0.245
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 4\"-WP-116-1401-A16A-IS (type: Process Line)"
        }
      },
      {
        "id": "GRAVITY-FLOW",
        "type": "Text Label",
        "label": "GRAVITY FLOW",
        "bbox": [
          0.55,
          0.25,
          0.63,
          0.265
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'GRAVITY FLOW'.",
          "description": "Flow direction annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.55,
            0.25,
            0.63,
            0.265
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.25,
                  0.63,
                  0.265
                ],
                "normalized_bbox": [
                  0.55,
                  0.25,
                  0.63,
                  0.265
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "GR",
          "detection_quality": "excellent",
          "isa_measured_variable": "Gauging",
          "isa_modifier": "Record",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: GRAVITY-FLOW"
        }
      },
      {
        "id": "NNF-2",
        "type": "Text Label",
        "label": "NNF",
        "bbox": [
          0.51,
          0.27,
          0.54,
          0.285
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'NNF'.",
          "description": "Nozzle Normal Flow or similar annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.51,
            0.27,
            0.54,
            0.285
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.51,
                  0.27,
                  0.54,
                  0.285
                ],
                "normalized_bbox": [
                  0.51,
                  0.27,
                  0.54,
                  0.285
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "NN",
          "detection_quality": "excellent",
          "isa_measured_variable": "User Defined",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: NNF"
        }
      },
      {
        "id": "TT-1405",
        "type": "sensor_temperature",
        "label": "TT 1405",
        "bbox": [
          0.55,
          0.29,
          0.6,
          0.33
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TT' and '1405' text, indicating a field-mounted temperature transmitter.",
          "description": "Temperature Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TT-1405",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.55,
            0.29,
            0.6,
            0.33
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.29,
                  0.6,
                  0.33
                ],
                "normalized_bbox": [
                  0.55,
                  0.29,
                  0.6,
                  0.33
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TI-1405",
        "type": "sensor_temperature",
        "label": "TI 1405",
        "bbox": [
          0.61,
          0.29,
          0.66,
          0.33
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI' and '1405' text, indicating a field-mounted temperature indicator.",
          "description": "Temperature Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TI-1405",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.61,
            0.29,
            0.66,
            0.33
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.61,
                  0.29,
                  0.66,
                  0.33
                ],
                "normalized_bbox": [
                  0.61,
                  0.29,
                  0.66,
                  0.33
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TE-1405",
        "type": "sensor_temperature",
        "label": "TE 1405",
        "bbox": [
          0.58,
          0.34,
          0.63,
          0.38
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TE' and '1405' text, indicating a field-mounted temperature primary element.",
          "description": "Temperature Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TE-1405",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.58,
            0.34,
            0.63,
            0.38
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.58,
                  0.34,
                  0.63,
                  0.38
                ],
                "normalized_bbox": [
                  0.58,
                  0.34,
                  0.63,
                  0.38
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "INTERFACE-label",
        "type": "Text Label",
        "label": "INTERFACE",
        "bbox": [
          0.03,
          0.19,
          0.09,
          0.205
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'INTERFACE'.",
          "description": "Interface annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.03,
            0.19,
            0.09,
            0.205
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.03,
                  0.19,
                  0.09,
                  0.205
                ],
                "normalized_bbox": [
                  0.03,
                  0.19,
                  0.09,
                  0.205
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "IN",
          "detection_quality": "excellent",
          "isa_measured_variable": "Current",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: INTERFACE"
        }
      },
      {
        "id": "LI-1452",
        "type": "sensor_level",
        "label": "LI 1452",
        "bbox": [
          0.05,
          0.21,
          0.1,
          0.25
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'LI' and '1452' text, indicating a field-mounted level indicator.",
          "description": "Level Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "LI-1452",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.21,
            0.1,
            0.25
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.21,
                  0.1,
                  0.25
                ],
                "normalized_bbox": [
                  0.05,
                  0.21,
                  0.1,
                  0.25
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "LI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "NOTE-8",
        "type": "Text Label",
        "label": "NOTE 8",
        "bbox": [
          0.05,
          0.25,
          0.09,
          0.265
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'NOTE 8'.",
          "description": "Reference to a general note",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.25,
            0.09,
            0.265
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.25,
                  0.09,
                  0.265
                ],
                "normalized_bbox": [
                  0.05,
                  0.25,
                  0.09,
                  0.265
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "NOTE",
          "detection_quality": "excellent",
          "isa_measured_variable": "N",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: User's Choice Orifice / Restriction Transmitter Sensor / Primary Element"
        }
      },
      {
        "id": "LT-1402",
        "type": "sensor_level",
        "label": "LT 1402",
        "bbox": [
          0.11,
          0.21,
          0.16,
          0.25
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'LT' and '1402' text, indicating a field-mounted level transmitter.",
          "description": "Level Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "LT-1402",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.11,
            0.21,
            0.16,
            0.25
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.11,
                  0.21,
                  0.16,
                  0.25
                ],
                "normalized_bbox": [
                  0.11,
                  0.21,
                  0.16,
                  0.25
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "LT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "LI-1402",
        "type": "sensor_level",
        "label": "LI 1402",
        "bbox": [
          0.17,
          0.21,
          0.22,
          0.25
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'LI' and '1402' text, indicating a field-mounted level indicator.",
          "description": "Level Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "LI-1402",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.21,
            0.22,
            0.25
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.21,
                  0.22,
                  0.25
                ],
                "normalized_bbox": [
                  0.17,
                  0.21,
                  0.22,
                  0.25
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "LI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "GWR-label",
        "type": "Text Label",
        "label": "GWR",
        "bbox": [
          0.17,
          0.25,
          0.2,
          0.265
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'GWR'.",
          "description": "Guided Wave Radar annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.25,
            0.2,
            0.265
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.25,
                  0.2,
                  0.265
                ],
                "normalized_bbox": [
                  0.17,
                  0.25,
                  0.2,
                  0.265
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "GW",
          "detection_quality": "excellent",
          "isa_measured_variable": "Gauging",
          "isa_modifier": "Well",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: GWR"
        }
      },
      {
        "id": "FF-1405_label_2",
        "type": "Text Label",
        "label": "FF 1405",
        "bbox": [
          0.23,
          0.21,
          0.27,
          0.225
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1405'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.23,
            0.21,
            0.27,
            0.225
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.21,
                  0.27,
                  0.225
                ],
                "normalized_bbox": [
                  0.23,
                  0.21,
                  0.27,
                  0.225
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "FE-1405_2",
        "type": "sensor_flow",
        "label": "FE 1405",
        "bbox": [
          0.23,
          0.23,
          0.28,
          0.27
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'FE' and '1405' text, indicating a field-mounted flow primary element.",
          "description": "Flow Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "FE-1405",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.23,
            0.23,
            0.28,
            0.27
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.23,
                  0.28,
                  0.27
                ],
                "normalized_bbox": [
                  0.23,
                  0.23,
                  0.28,
                  0.27
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "FE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "NOTE-5-7",
        "type": "Text Label",
        "label": "NOTE 5, 7",
        "bbox": [
          0.17,
          0.29,
          0.23,
          0.305
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'NOTE 5, 7'.",
          "description": "Reference to general notes",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.29,
            0.23,
            0.305
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.29,
                  0.23,
                  0.305
                ],
                "normalized_bbox": [
                  0.17,
                  0.29,
                  0.23,
                  0.305
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "NO",
          "detection_quality": "excellent",
          "isa_measured_variable": "User Defined",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-5,-7"
        }
      },
      {
        "id": "Valve-Manual-Gate-3",
        "type": "Manual Gate Valve",
        "label": "X3/4\"",
        "bbox": [
          0.3,
          0.29,
          0.33,
          0.32
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, indicating a gate valve. The 'X' prefix and lack of actuator symbol (other than a simple square for manual operation) classify it as a manual valve.",
          "description": "Manual Gate Valve, 3/4 inch",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.3,
            0.29,
            0.33,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.29,
                  0.33,
                  0.32
                ],
                "normalized_bbox": [
                  0.3,
                  0.29,
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
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: X3/4\" (type: Manual Gate Valve)"
        }
      },
      {
        "id": "Valve-Control-DiaphragmActuator-FC-1",
        "type": "Control Valve",
        "label": "FC",
        "bbox": [
          0.36,
          0.29,
          0.4,
          0.32
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape with a diaphragm actuator symbol and 'FC' (Fail Closed) label, indicating a control valve.",
          "description": "Control Valve, Diaphragm Actuator, Fail Closed",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.36,
            0.29,
            0.4,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.36,
                  0.29,
                  0.4,
                  0.32
                ],
                "normalized_bbox": [
                  0.36,
                  0.29,
                  0.4,
                  0.32
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FC",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Control",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FC"
        }
      },
      {
        "id": "Valve-Manual-Gate-4",
        "type": "Manual Gate Valve",
        "label": "X3/4\"",
        "bbox": [
          0.43,
          0.29,
          0.46,
          0.32
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, indicating a gate valve. The 'X' prefix and lack of actuator symbol (other than a simple square for manual operation) classify it as a manual valve.",
          "description": "Manual Gate Valve, 3/4 inch",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.43,
            0.29,
            0.46,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.43,
                  0.29,
                  0.46,
                  0.32
                ],
                "normalized_bbox": [
                  0.43,
                  0.29,
                  0.46,
                  0.32
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: X3/4\" (type: Manual Gate Valve)"
        }
      },
      {
        "id": "TE-1410",
        "type": "sensor_temperature",
        "label": "TE 1410",
        "bbox": [
          0.05,
          0.39,
          0.1,
          0.43
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TE' and '1410' text, indicating a field-mounted temperature primary element.",
          "description": "Temperature Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TE-1410",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.39,
            0.1,
            0.43
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.39,
                  0.1,
                  0.43
                ],
                "normalized_bbox": [
                  0.05,
                  0.39,
                  0.1,
                  0.43
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-1410",
        "type": "sensor_temperature",
        "label": "TT 1410",
        "bbox": [
          0.11,
          0.39,
          0.16,
          0.43
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TT' and '1410' text, indicating a field-mounted temperature transmitter.",
          "description": "Temperature Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TT-1410",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.11,
            0.39,
            0.16,
            0.43
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.11,
                  0.39,
                  0.16,
                  0.43
                ],
                "normalized_bbox": [
                  0.11,
                  0.39,
                  0.16,
                  0.43
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TI-1410",
        "type": "sensor_temperature",
        "label": "TI 1410",
        "bbox": [
          0.17,
          0.39,
          0.22,
          0.43
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI' and '1410' text, indicating a field-mounted temperature indicator.",
          "description": "Temperature Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TI-1410",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.39,
            0.22,
            0.43
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.39,
                  0.22,
                  0.43
                ],
                "normalized_bbox": [
                  0.17,
                  0.39,
                  0.22,
                  0.43
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1410_label",
        "type": "Text Label",
        "label": "FF 1410",
        "bbox": [
          0.17,
          0.43,
          0.21,
          0.445
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1410'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.43,
            0.21,
            0.445
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.43,
                  0.21,
                  0.445
                ],
                "normalized_bbox": [
                  0.17,
                  0.43,
                  0.21,
                  0.445
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "Pipe-24-MW-1",
        "type": "Process Line",
        "label": "24\" MW",
        "bbox": [
          0.03,
          0.45,
          0.07,
          0.47
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text label associated with a thick solid line, indicating a process pipe.",
          "description": "24 inch Main Water Pipe",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.03,
            0.45,
            0.07,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.03,
                  0.45,
                  0.07,
                  0.47
                ],
                "normalized_bbox": [
                  0.03,
                  0.45,
                  0.07,
                  0.47
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 24\"-MW (type: Process Line)"
        }
      },
      {
        "id": "TE-1411",
        "type": "sensor_temperature",
        "label": "TE 1411",
        "bbox": [
          0.05,
          0.49,
          0.1,
          0.53
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TE' and '1411' text, indicating a field-mounted temperature primary element.",
          "description": "Temperature Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TE-1411",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.49,
            0.1,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.49,
                  0.1,
                  0.53
                ],
                "normalized_bbox": [
                  0.05,
                  0.49,
                  0.1,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-1411",
        "type": "sensor_temperature",
        "label": "TT 1411",
        "bbox": [
          0.11,
          0.49,
          0.16,
          0.53
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TT' and '1411' text, indicating a field-mounted temperature transmitter.",
          "description": "Temperature Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TT-1411",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.11,
            0.49,
            0.16,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.11,
                  0.49,
                  0.16,
                  0.53
                ],
                "normalized_bbox": [
                  0.11,
                  0.49,
                  0.16,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TI-1411",
        "type": "sensor_temperature",
        "label": "TI 1411",
        "bbox": [
          0.17,
          0.49,
          0.22,
          0.53
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI' and '1411' text, indicating a field-mounted temperature indicator.",
          "description": "Temperature Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TI-1411",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.49,
            0.22,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.49,
                  0.22,
                  0.53
                ],
                "normalized_bbox": [
                  0.17,
                  0.49,
                  0.22,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1411_label",
        "type": "Text Label",
        "label": "FF 1411",
        "bbox": [
          0.17,
          0.53,
          0.21,
          0.545
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1411'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.53,
            0.21,
            0.545
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.53,
                  0.21,
                  0.545
                ],
                "normalized_bbox": [
                  0.17,
                  0.53,
                  0.21,
                  0.545
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "Pump-1",
        "type": "Pump",
        "label": "P",
        "bbox": [
          0.05,
          0.55,
          0.08,
          0.58
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'P' inside, indicating a generic pump.",
          "description": "Pump",
          "equipment_type": "Pump",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.55,
            0.08,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.55,
                  0.08,
                  0.58
                ],
                "normalized_bbox": [
                  0.05,
                  0.55,
                  0.08,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: P (type: Pump)"
        }
      },
      {
        "id": "Flow-Sight-Glass-1",
        "type": "Flow Sight Glass",
        "label": "FG",
        "bbox": [
          0.09,
          0.55,
          0.12,
          0.58
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'FG' inside, indicating a flow sight glass.",
          "description": "Flow Sight Glass",
          "instrument_function": "Glass / Viewing Device",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.09,
            0.55,
            0.12,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.09,
                  0.55,
                  0.12,
                  0.58
                ],
                "normalized_bbox": [
                  0.09,
                  0.55,
                  0.12,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FG",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Glass/Gauge",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FG"
        }
      },
      {
        "id": "Pump-2",
        "type": "Pump",
        "label": "P",
        "bbox": [
          0.13,
          0.55,
          0.16,
          0.58
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'P' inside, indicating a generic pump.",
          "description": "Pump",
          "equipment_type": "Pump",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.13,
            0.55,
            0.16,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.13,
                  0.55,
                  0.16,
                  0.58
                ],
                "normalized_bbox": [
                  0.13,
                  0.55,
                  0.16,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: P (type: Pump)"
        }
      },
      {
        "id": "Flow-Sight-Glass-2",
        "type": "Flow Sight Glass",
        "label": "FG",
        "bbox": [
          0.17,
          0.55,
          0.2,
          0.58
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'FG' inside, indicating a flow sight glass.",
          "description": "Flow Sight Glass",
          "instrument_function": "Glass / Viewing Device",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.55,
            0.2,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.55,
                  0.2,
                  0.58
                ],
                "normalized_bbox": [
                  0.17,
                  0.55,
                  0.2,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FG",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Glass/Gauge",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FG"
        }
      },
      {
        "id": "TE-1416",
        "type": "sensor_temperature",
        "label": "TE 1416",
        "bbox": [
          0.23,
          0.6,
          0.28,
          0.64
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TE' and '1416' text, indicating a field-mounted temperature primary element.",
          "description": "Temperature Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TE-1416",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.23,
            0.6,
            0.28,
            0.64
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.6,
                  0.28,
                  0.64
                ],
                "normalized_bbox": [
                  0.23,
                  0.6,
                  0.28,
                  0.64
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-1416",
        "type": "sensor_temperature",
        "label": "TT 1416",
        "bbox": [
          0.29,
          0.6,
          0.34,
          0.64
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TT' and '1416' text, indicating a field-mounted temperature transmitter.",
          "description": "Temperature Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TT-1416",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.29,
            0.6,
            0.34,
            0.64
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.6,
                  0.34,
                  0.64
                ],
                "normalized_bbox": [
                  0.29,
                  0.6,
                  0.34,
                  0.64
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TI-1416",
        "type": "sensor_temperature",
        "label": "TI 1416",
        "bbox": [
          0.35,
          0.6,
          0.4,
          0.64
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI' and '1416' text, indicating a field-mounted temperature indicator.",
          "description": "Temperature Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TI-1416",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.35,
            0.6,
            0.4,
            0.64
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.35,
                  0.6,
                  0.4,
                  0.64
                ],
                "normalized_bbox": [
                  0.35,
                  0.6,
                  0.4,
                  0.64
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1416_label",
        "type": "Text Label",
        "label": "FF 1416",
        "bbox": [
          0.35,
          0.64,
          0.39,
          0.655
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1416'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.35,
            0.64,
            0.39,
            0.655
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.35,
                  0.64,
                  0.39,
                  0.655
                ],
                "normalized_bbox": [
                  0.35,
                  0.64,
                  0.39,
                  0.655
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "LI-1451",
        "type": "sensor_level",
        "label": "LI 1451",
        "bbox": [
          0.05,
          0.68,
          0.1,
          0.72
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'LI' and '1451' text, indicating a field-mounted level indicator.",
          "description": "Level Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "LI-1451",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.68,
            0.1,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.68,
                  0.1,
                  0.72
                ],
                "normalized_bbox": [
                  0.05,
                  0.68,
                  0.1,
                  0.72
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "LI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "LT-1401",
        "type": "sensor_level",
        "label": "LT 1401",
        "bbox": [
          0.17,
          0.68,
          0.22,
          0.72
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'LT' and '1401' text, indicating a field-mounted level transmitter.",
          "description": "Level Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "LT-1401",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.68,
            0.22,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.68,
                  0.22,
                  0.72
                ],
                "normalized_bbox": [
                  0.17,
                  0.68,
                  0.22,
                  0.72
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "LT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "LIC-1401",
        "type": "sensor_level",
        "label": "LIC 1401",
        "bbox": [
          0.23,
          0.68,
          0.28,
          0.72
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle-in-square symbol with 'LIC' and '1401' text, indicating a shared display/control level indicating controller.",
          "description": "Level Indicating Controller",
          "instrument_function": "Indicator, Controller",
          "location": "Shared Display/Control (DCS)",
          "occlusion_level": "none",
          "tag": "LIC-1401",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.23,
            0.68,
            0.28,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.68,
                  0.28,
                  0.72
                ],
                "normalized_bbox": [
                  0.23,
                  0.68,
                  0.28,
                  0.72
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "LIC",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "H-label",
        "type": "Text Label",
        "label": "H",
        "bbox": [
          0.29,
          0.68,
          0.3,
          0.695
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'H'.",
          "description": "High (Modifier) or other annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.29,
            0.68,
            0.3,
            0.695
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.68,
                  0.3,
                  0.695
                ],
                "normalized_bbox": [
                  0.29,
                  0.68,
                  0.3,
                  0.695
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: H (type: Text Label)"
        }
      },
      {
        "id": "L-label",
        "type": "Text Label",
        "label": "L",
        "bbox": [
          0.29,
          0.71,
          0.3,
          0.725
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'L'.",
          "description": "Low (Modifier) or other annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.29,
            0.71,
            0.3,
            0.725
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.379Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.71,
                  0.3,
                  0.725
                ],
                "normalized_bbox": [
                  0.29,
                  0.71,
                  0.3,
                  0.725
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: L (type: Text Label)"
        }
      },
      {
        "id": "FLO-1",
        "type": "Orifice Plate",
        "label": "FLO",
        "bbox": [
          0.11,
          0.73,
          0.14,
          0.76
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a rectangle with a diagonal line, indicating an orifice plate. Labeled 'FLO'.",
          "description": "Orifice Plate",
          "equipment_type": "Primary Element",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.11,
            0.73,
            0.14,
            0.76
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.11,
                  0.73,
                  0.14,
                  0.76
                ],
                "normalized_bbox": [
                  0.11,
                  0.73,
                  0.14,
                  0.76
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FL",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Low",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FLO"
        }
      },
      {
        "id": "P-3",
        "type": "Pump",
        "label": "P",
        "bbox": [
          0.15,
          0.73,
          0.18,
          0.76
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'P' inside, indicating a generic pump.",
          "description": "Pump",
          "equipment_type": "Pump",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.15,
            0.73,
            0.18,
            0.76
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.15,
                  0.73,
                  0.18,
                  0.76
                ],
                "normalized_bbox": [
                  0.15,
                  0.73,
                  0.18,
                  0.76
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: P (type: Pump)"
        }
      },
      {
        "id": "Pipe-24-P-116-1403-A9A-IH",
        "type": "Process Line",
        "label": "24\"-P-116-1403-A9A-IH",
        "bbox": [
          0.32,
          0.73,
          0.55,
          0.745
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text label associated with a thick solid line, indicating a process pipe.",
          "description": "24 inch Process Pipe, Line 116-1403-A9A-IH",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.32,
            0.73,
            0.55,
            0.745
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.32,
                  0.73,
                  0.55,
                  0.745
                ],
                "normalized_bbox": [
                  0.32,
                  0.73,
                  0.55,
                  0.745
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 24\"-P-116-1403-A9A-IH (type: Process Line)"
        }
      },
      {
        "id": "Reducer-6X4",
        "type": "Reducer",
        "label": "6\"X4\"",
        "bbox": [
          0.05,
          0.78,
          0.08,
          0.81
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a conical shape with '6\"X4\"' label, indicating a pipe reducer.",
          "description": "Pipe Reducer, 6 inch to 4 inch",
          "equipment_type": "Fitting",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.78,
            0.08,
            0.81
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.78,
                  0.08,
                  0.81
                ],
                "normalized_bbox": [
                  0.05,
                  0.78,
                  0.08,
                  0.81
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 6\"X4\" (type: Reducer)"
        }
      },
      {
        "id": "Reducer-24X18",
        "type": "Reducer",
        "label": "24\"X18\"",
        "bbox": [
          0.55,
          0.78,
          0.58,
          0.81
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a conical shape with '24\"X18\"' label, indicating a pipe reducer.",
          "description": "Pipe Reducer, 24 inch to 18 inch",
          "equipment_type": "Fitting",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.55,
            0.78,
            0.58,
            0.81
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.78,
                  0.58,
                  0.81
                ],
                "normalized_bbox": [
                  0.55,
                  0.78,
                  0.58,
                  0.81
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 24\"X18\" (type: Reducer)"
        }
      },
      {
        "id": "TI-1406",
        "type": "sensor_temperature",
        "label": "TI 1406",
        "bbox": [
          0.83,
          0.68,
          0.88,
          0.72
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI' and '1406' text, indicating a field-mounted temperature indicator.",
          "description": "Temperature Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TI-1406",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.83,
            0.68,
            0.88,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.83,
                  0.68,
                  0.88,
                  0.72
                ],
                "normalized_bbox": [
                  0.83,
                  0.68,
                  0.88,
                  0.72
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1406_label",
        "type": "Text Label",
        "label": "FF 1406",
        "bbox": [
          0.83,
          0.72,
          0.87,
          0.735
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1406'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.83,
            0.72,
            0.87,
            0.735
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.83,
                  0.72,
                  0.87,
                  0.735
                ],
                "normalized_bbox": [
                  0.83,
                  0.72,
                  0.87,
                  0.735
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "TT-1406",
        "type": "sensor_temperature",
        "label": "TT 1406",
        "bbox": [
          0.83,
          0.74,
          0.88,
          0.78
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TT' and '1406' text, indicating a field-mounted temperature transmitter.",
          "description": "Temperature Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TT-1406",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.83,
            0.74,
            0.88,
            0.78
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.83,
                  0.74,
                  0.88,
                  0.78
                ],
                "normalized_bbox": [
                  0.83,
                  0.74,
                  0.88,
                  0.78
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TE-1406",
        "type": "sensor_temperature",
        "label": "TE 1406",
        "bbox": [
          0.83,
          0.79,
          0.88,
          0.83
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TE' and '1406' text, indicating a field-mounted temperature primary element.",
          "description": "Temperature Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TE-1406",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.83,
            0.79,
            0.88,
            0.83
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.83,
                  0.79,
                  0.88,
                  0.83
                ],
                "normalized_bbox": [
                  0.83,
                  0.79,
                  0.88,
                  0.83
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "DO-NOT-POCKET-1",
        "type": "Text Label",
        "label": "DO NOT POCKET",
        "bbox": [
          0.77,
          0.4,
          0.86,
          0.415
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'DO NOT POCKET'.",
          "description": "Design instruction/warning",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.77,
            0.4,
            0.86,
            0.415
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.77,
                  0.4,
                  0.86,
                  0.415
                ],
                "normalized_bbox": [
                  0.77,
                  0.4,
                  0.86,
                  0.415
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "DO",
          "detection_quality": "excellent",
          "isa_measured_variable": "Density/Specific Gravity",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: DO-NOT-POCKET"
        }
      },
      {
        "id": "DO-NOT-POCKET-2",
        "type": "Text Label",
        "label": "DO NOT POCKET",
        "bbox": [
          0.77,
          0.85,
          0.86,
          0.865
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'DO NOT POCKET'.",
          "description": "Design instruction/warning",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.77,
            0.85,
            0.86,
            0.865
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.77,
                  0.85,
                  0.86,
                  0.865
                ],
                "normalized_bbox": [
                  0.77,
                  0.85,
                  0.86,
                  0.865
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "DO",
          "detection_quality": "excellent",
          "isa_measured_variable": "Density/Specific Gravity",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: DO-NOT-POCKET"
        }
      },
      {
        "id": "TI-1407",
        "type": "sensor_temperature",
        "label": "TI 1407",
        "bbox": [
          0.23,
          0.85,
          0.28,
          0.89
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI' and '1407' text, indicating a field-mounted temperature indicator.",
          "description": "Temperature Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TI-1407",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.23,
            0.85,
            0.28,
            0.89
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.85,
                  0.28,
                  0.89
                ],
                "normalized_bbox": [
                  0.23,
                  0.85,
                  0.28,
                  0.89
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-1407",
        "type": "sensor_temperature",
        "label": "TT 1407",
        "bbox": [
          0.29,
          0.85,
          0.34,
          0.89
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TT' and '1407' text, indicating a field-mounted temperature transmitter.",
          "description": "Temperature Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TT-1407",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.29,
            0.85,
            0.34,
            0.89
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.85,
                  0.34,
                  0.89
                ],
                "normalized_bbox": [
                  0.29,
                  0.85,
                  0.34,
                  0.89
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TE-1407",
        "type": "sensor_temperature",
        "label": "TE 1407",
        "bbox": [
          0.35,
          0.85,
          0.4,
          0.89
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TE' and '1407' text, indicating a field-mounted temperature primary element.",
          "description": "Temperature Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TE-1407",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.35,
            0.85,
            0.4,
            0.89
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.35,
                  0.85,
                  0.4,
                  0.89
                ],
                "normalized_bbox": [
                  0.35,
                  0.85,
                  0.4,
                  0.89
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1407_label",
        "type": "Text Label",
        "label": "FF 1407",
        "bbox": [
          0.35,
          0.89,
          0.39,
          0.905
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1407'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.35,
            0.89,
            0.39,
            0.905
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.35,
                  0.89,
                  0.39,
                  0.905
                ],
                "normalized_bbox": [
                  0.35,
                  0.89,
                  0.39,
                  0.905
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "TE-1417",
        "type": "sensor_temperature",
        "label": "TE 1417",
        "bbox": [
          0.05,
          0.92,
          0.1,
          0.96
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TE' and '1417' text, indicating a field-mounted temperature primary element.",
          "description": "Temperature Element",
          "instrument_function": "Sensor / Primary Element",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TE-1417",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.92,
            0.1,
            0.96
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.92,
                  0.1,
                  0.96
                ],
                "normalized_bbox": [
                  0.05,
                  0.92,
                  0.1,
                  0.96
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-1417",
        "type": "sensor_temperature",
        "label": "TT 1417",
        "bbox": [
          0.11,
          0.92,
          0.16,
          0.96
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TT' and '1417' text, indicating a field-mounted temperature transmitter.",
          "description": "Temperature Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TT-1417",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.11,
            0.92,
            0.16,
            0.96
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.11,
                  0.92,
                  0.16,
                  0.96
                ],
                "normalized_bbox": [
                  0.11,
                  0.92,
                  0.16,
                  0.96
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TI-1417",
        "type": "sensor_temperature",
        "label": "TI 1417",
        "bbox": [
          0.17,
          0.92,
          0.22,
          0.96
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI' and '1417' text, indicating a field-mounted temperature indicator.",
          "description": "Temperature Indicator",
          "instrument_function": "Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "TI-1417",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.92,
            0.22,
            0.96
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.92,
                  0.22,
                  0.96
                ],
                "normalized_bbox": [
                  0.17,
                  0.92,
                  0.22,
                  0.96
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1417_label",
        "type": "Text Label",
        "label": "FF 1417",
        "bbox": [
          0.17,
          0.96,
          0.21,
          0.975
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1417'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.17,
            0.96,
            0.21,
            0.975
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.96,
                  0.21,
                  0.975
                ],
                "normalized_bbox": [
                  0.17,
                  0.96,
                  0.21,
                  0.975
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "Pipe-24-MW-2",
        "type": "Process Line",
        "label": "24\" MW",
        "bbox": [
          0.03,
          0.98,
          0.07,
          0.995
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text label associated with a thick solid line, indicating a process pipe.",
          "description": "24 inch Main Water Pipe",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.03,
            0.98,
            0.07,
            0.995
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.03,
                  0.98,
                  0.07,
                  0.995
                ],
                "normalized_bbox": [
                  0.03,
                  0.98,
                  0.07,
                  0.995
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 24\"-MW (type: Process Line)"
        }
      },
      {
        "id": "Pipe-4-P-116-1422-B9A-IT",
        "type": "Process Line",
        "label": "4\"-P-116-1422-B9A-IT",
        "bbox": [
          0.25,
          0.98,
          0.48,
          0.995
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text label associated with a thick solid line, indicating a process pipe.",
          "description": "4 inch Process Pipe, Line 116-1422-B9A-IT",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.25,
            0.98,
            0.48,
            0.995
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.98,
                  0.48,
                  0.995
                ],
                "normalized_bbox": [
                  0.25,
                  0.98,
                  0.48,
                  0.995
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 4\"-P-116-1422-B9A-IT (type: Process Line)"
        }
      },
      {
        "id": "PIC-1404",
        "type": "sensor_pressure",
        "label": "PIC 1404",
        "bbox": [
          0.49,
          0.92,
          0.54,
          0.96
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle-in-square symbol with 'PIC' and '1404' text, indicating a shared display/control pressure indicating controller.",
          "description": "Pressure Indicating Controller",
          "instrument_function": "Indicator, Controller",
          "location": "Shared Display/Control (DCS)",
          "occlusion_level": "none",
          "tag": "PIC-1404",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.49,
            0.92,
            0.54,
            0.96
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.92,
                  0.54,
                  0.96
                ],
                "normalized_bbox": [
                  0.49,
                  0.92,
                  0.54,
                  0.96
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PIC",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PT-1404",
        "type": "sensor_pressure",
        "label": "PT 1404",
        "bbox": [
          0.55,
          0.92,
          0.6,
          0.96
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'PT' and '1404' text, indicating a field-mounted pressure transmitter.",
          "description": "Pressure Transmitter",
          "instrument_function": "Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "PT-1404",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.55,
            0.92,
            0.6,
            0.96
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.92,
                  0.6,
                  0.96
                ],
                "normalized_bbox": [
                  0.55,
                  0.92,
                  0.6,
                  0.96
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1404_label_1",
        "type": "Text Label",
        "label": "FF 1404",
        "bbox": [
          0.55,
          0.96,
          0.59,
          0.975
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1404'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.55,
            0.96,
            0.59,
            0.975
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.96,
                  0.59,
                  0.975
                ],
                "normalized_bbox": [
                  0.55,
                  0.96,
                  0.59,
                  0.975
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "PV-1404",
        "type": "valve_control",
        "label": "PV 1404",
        "bbox": [
          0.61,
          0.92,
          0.65,
          0.96
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a triangle body with a diaphragm actuator symbol and 'PV' and '1404' text, indicating a pressure control valve.",
          "description": "Pressure Control Valve",
          "equipment_type": "Valve",
          "instrument_function": "Valve / Damper / Actuator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "PV-1404",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.61,
            0.92,
            0.65,
            0.96
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.61,
                  0.92,
                  0.65,
                  0.96
                ],
                "normalized_bbox": [
                  0.61,
                  0.92,
                  0.65,
                  0.96
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FF-1404_label_2",
        "type": "Text Label",
        "label": "FF 1404",
        "bbox": [
          0.61,
          0.96,
          0.65,
          0.975
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'FF 1404'.",
          "description": "Flow Rate Function Label",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.61,
            0.96,
            0.65,
            0.975
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.61,
                  0.96,
                  0.65,
                  0.975
                ],
                "normalized_bbox": [
                  0.61,
                  0.96,
                  0.65,
                  0.975
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "isa_measured_variable": "F",
          "isa_modifier": "F",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Flow Rate Ratio / Fraction (e.g., FF = Flow Ratio)"
        }
      },
      {
        "id": "Valve-Control-ManualActuator-FO-2",
        "type": "Control Valve",
        "label": "FO",
        "bbox": [
          0.67,
          0.92,
          0.7,
          0.95
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape with a square actuator symbol and 'FO' (Fail Open) label. While bowtie is typically manual, the 'FO' indicates a fail-safe, suggesting a control function, possibly with a manual override or specific manual operation mode.",
          "description": "Control Valve, Manual Actuator, Fail Open",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.67,
            0.92,
            0.7,
            0.95
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.67,
                  0.92,
                  0.7,
                  0.95
                ],
                "normalized_bbox": [
                  0.67,
                  0.92,
                  0.7,
                  0.95
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FO",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FO"
        }
      },
      {
        "id": "Valve-Manual-Gate-5",
        "type": "Manual Gate Valve",
        "label": "X1\"",
        "bbox": [
          0.72,
          0.92,
          0.75,
          0.95
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, indicating a gate valve. The 'X' prefix and lack of actuator symbol (other than a simple square for manual operation) classify it as a manual valve.",
          "description": "Manual Gate Valve, 1 inch",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.72,
            0.92,
            0.75,
            0.95
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.72,
                  0.92,
                  0.75,
                  0.95
                ],
                "normalized_bbox": [
                  0.72,
                  0.92,
                  0.75,
                  0.95
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: X1\" (type: Manual Gate Valve)"
        }
      },
      {
        "id": "FLO-2",
        "type": "Orifice Plate",
        "label": "FLO",
        "bbox": [
          0.76,
          0.92,
          0.79,
          0.95
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a rectangle with a diagonal line, indicating an orifice plate. Labeled 'FLO'.",
          "description": "Orifice Plate",
          "equipment_type": "Primary Element",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.76,
            0.92,
            0.79,
            0.95
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.76,
                  0.92,
                  0.79,
                  0.95
                ],
                "normalized_bbox": [
                  0.76,
                  0.92,
                  0.79,
                  0.95
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FL",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Low",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FLO"
        }
      },
      {
        "id": "P-4",
        "type": "Pump",
        "label": "P",
        "bbox": [
          0.8,
          0.92,
          0.83,
          0.95
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'P' inside, indicating a generic pump.",
          "description": "Pump",
          "equipment_type": "Pump",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.8,
            0.92,
            0.83,
            0.95
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.8,
                  0.92,
                  0.83,
                  0.95
                ],
                "normalized_bbox": [
                  0.8,
                  0.92,
                  0.83,
                  0.95
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: P (type: Pump)"
        }
      },
      {
        "id": "Valve-Manual-Gate-6",
        "type": "Manual Gate Valve",
        "label": "X1\"",
        "bbox": [
          0.87,
          0.92,
          0.9,
          0.95
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, indicating a gate valve. The 'X' prefix and lack of actuator symbol (other than a simple square for manual operation) classify it as a manual valve.",
          "description": "Manual Gate Valve, 1 inch",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.87,
            0.92,
            0.9,
            0.95
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.87,
                  0.92,
                  0.9,
                  0.95
                ],
                "normalized_bbox": [
                  0.87,
                  0.92,
                  0.9,
                  0.95
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: X1\" (type: Manual Gate Valve)"
        }
      },
      {
        "id": "L-label-2",
        "type": "Text Label",
        "label": "L",
        "bbox": [
          0.91,
          0.92,
          0.92,
          0.935
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'L'.",
          "description": "Low (Modifier) or other annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.91,
            0.92,
            0.92,
            0.935
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.91,
                  0.92,
                  0.92,
                  0.935
                ],
                "normalized_bbox": [
                  0.91,
                  0.92,
                  0.92,
                  0.935
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: L (type: Text Label)"
        }
      },
      {
        "id": "Valve-Manual-Gate-7",
        "type": "Manual Gate Valve",
        "label": "X1\"",
        "bbox": [
          0.93,
          0.92,
          0.96,
          0.95
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, indicating a gate valve. The 'X' prefix and lack of actuator symbol (other than a simple square for manual operation) classify it as a manual valve.",
          "description": "Manual Gate Valve, 1 inch",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.93,
            0.92,
            0.96,
            0.95
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.93,
                  0.92,
                  0.96,
                  0.95
                ],
                "normalized_bbox": [
                  0.93,
                  0.92,
                  0.96,
                  0.95
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: X1\" (type: Manual Gate Valve)"
        }
      },
      {
        "id": "L-label-3",
        "type": "Text Label",
        "label": "L",
        "bbox": [
          0.97,
          0.92,
          0.98,
          0.935
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected standalone text label 'L'.",
          "description": "Low (Modifier) or other annotation",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.97,
            0.92,
            0.98,
            0.935
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.97,
                  0.92,
                  0.98,
                  0.935
                ],
                "normalized_bbox": [
                  0.97,
                  0.92,
                  0.98,
                  0.935
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: L (type: Text Label)"
        }
      },
      {
        "id": "Valve-Manual-Gate-8",
        "type": "Manual Gate Valve",
        "label": "X1\"",
        "bbox": [
          0.99,
          0.92,
          1,
          0.95
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie shape, indicating a gate valve. The 'X' prefix and lack of actuator symbol (other than a simple square for manual operation) classify it as a manual valve.",
          "description": "Manual Gate Valve, 1 inch",
          "equipment_type": "Valve",
          "occlusion_level": "none",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.99,
            0.92,
            1,
            0.95
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T04:20:59.380Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.99,
                  0.92,
                  1,
                  0.95
                ],
                "normalized_bbox": [
                  0.99,
                  0.92,
                  1,
                  0.95
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: X1\" (type: Manual Gate Valve)"
        }
      }
    ],
    "connections": [
      {
        "id": "1767673259380-wndqx3n45",
        "from_id": "TE-1408",
        "to_id": "TT-1408",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE 1408",
          "to_label": "TT 1408"
        }
      },
      {
        "id": "1767673259380-7xmw4evx3",
        "from_id": "TT-1408",
        "to_id": "TI-1408",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TT 1408",
          "to_label": "TI 1408"
        }
      },
      {
        "id": "1767673259380-5wmueqpwk",
        "from_id": "FE-1403",
        "to_id": "Valve-Manual-Gate-2",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "Manual Gate Valve",
          "from_label": "FE 1403",
          "to_label": "X3/4\""
        }
      },
      {
        "id": "1767673259380-o6nwmapdg",
        "from_id": "Valve-Manual-Gate-2",
        "to_id": "Valve-Control-ManualActuator-FO-1",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Manual Gate Valve",
          "to_component_type": "Control Valve",
          "from_label": "X3/4\"",
          "to_label": "FO"
        }
      },
      {
        "id": "1767673259380-uugqo33tl",
        "from_id": "Valve-Control-ManualActuator-FO-1",
        "to_id": "Valve-Manual-Gate-1",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Control Valve",
          "to_component_type": "Manual Gate Valve",
          "from_label": "FO",
          "to_label": "X3/4\""
        }
      },
      {
        "id": "1767673259380-2w0o4iaqq",
        "from_id": "FE-1405",
        "to_id": "FIC-1405",
        "type": "Signal Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "sensor_flow",
          "from_label": "FE 1405",
          "to_label": "FIC 1405"
        }
      },
      {
        "id": "1767673259380-konkr7d95",
        "from_id": "FIC-1405",
        "to_id": "FV-1405",
        "type": "Signal Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "valve_control",
          "from_label": "FIC 1405",
          "to_label": "FV 1405"
        }
      },
      {
        "id": "1767673259380-d0pwif9r5",
        "from_id": "FV-1405",
        "to_id": "Pipe-4-WP-116-1401-A16A-IS",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "Process Line",
          "from_label": "FV 1405",
          "to_label": "4\"-WP-116-1401-A16A-IS"
        }
      },
      {
        "id": "1767673259380-e2vj0k3b8",
        "from_id": "TE-1405",
        "to_id": "TT-1405",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE 1405",
          "to_label": "TT 1405"
        }
      },
      {
        "id": "1767673259380-d2dplyrej",
        "from_id": "TT-1405",
        "to_id": "TI-1405",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TT 1405",
          "to_label": "TI 1405"
        }
      },
      {
        "id": "1767673259380-272ctcw2g",
        "from_id": "FE-1405_2",
        "to_id": "Valve-Control-DiaphragmActuator-FC-1",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "Control Valve",
          "from_label": "FE 1405",
          "to_label": "FC"
        }
      },
      {
        "id": "1767673259380-yr5x6vlia",
        "from_id": "Valve-Control-DiaphragmActuator-FC-1",
        "to_id": "Valve-Manual-Gate-3",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Control Valve",
          "to_component_type": "Manual Gate Valve",
          "from_label": "FC",
          "to_label": "X3/4\""
        }
      },
      {
        "id": "1767673259380-hvmc3r2k2",
        "from_id": "Valve-Manual-Gate-3",
        "to_id": "Valve-Manual-Gate-4",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Manual Gate Valve",
          "to_component_type": "Manual Gate Valve",
          "from_label": "X3/4\"",
          "to_label": "X3/4\""
        }
      },
      {
        "id": "1767673259380-05qsi4p5z",
        "from_id": "TE-1410",
        "to_id": "TT-1410",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE 1410",
          "to_label": "TT 1410"
        }
      },
      {
        "id": "1767673259380-akakxelg9",
        "from_id": "TT-1410",
        "to_id": "TI-1410",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TT 1410",
          "to_label": "TI 1410"
        }
      },
      {
        "id": "1767673259380-bd6c4ibwp",
        "from_id": "TE-1411",
        "to_id": "TT-1411",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE 1411",
          "to_label": "TT 1411"
        }
      },
      {
        "id": "1767673259380-7sk34u8h4",
        "from_id": "TT-1411",
        "to_id": "TI-1411",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TT 1411",
          "to_label": "TI 1411"
        }
      },
      {
        "id": "1767673259380-feafmnz2i",
        "from_id": "Pump-1",
        "to_id": "Flow-Sight-Glass-1",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Pump",
          "to_component_type": "Flow Sight Glass",
          "from_label": "P",
          "to_label": "FG"
        }
      },
      {
        "id": "1767673259380-6dlhp9bxj",
        "from_id": "Flow-Sight-Glass-1",
        "to_id": "Pump-2",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Flow Sight Glass",
          "to_component_type": "Pump",
          "from_label": "FG",
          "to_label": "P"
        }
      },
      {
        "id": "1767673259380-k6cq3d5ya",
        "from_id": "Pump-2",
        "to_id": "Flow-Sight-Glass-2",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Pump",
          "to_component_type": "Flow Sight Glass",
          "from_label": "P",
          "to_label": "FG"
        }
      },
      {
        "id": "1767673259380-5ei2m1rnx",
        "from_id": "TE-1416",
        "to_id": "TT-1416",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE 1416",
          "to_label": "TT 1416"
        }
      },
      {
        "id": "1767673259380-mlu3m533q",
        "from_id": "TT-1416",
        "to_id": "TI-1416",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TT 1416",
          "to_label": "TI 1416"
        }
      },
      {
        "id": "1767673259380-2ckqce5e2",
        "from_id": "LT-1401",
        "to_id": "LIC-1401",
        "type": "Signal Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_level",
          "to_component_type": "sensor_level",
          "from_label": "LT 1401",
          "to_label": "LIC 1401"
        }
      },
      {
        "id": "1767673259380-ild89vjii",
        "from_id": "TI-1406",
        "to_id": "TT-1406",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TI 1406",
          "to_label": "TT 1406"
        }
      },
      {
        "id": "1767673259380-9y4gueby1",
        "from_id": "TT-1406",
        "to_id": "TE-1406",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TT 1406",
          "to_label": "TE 1406"
        }
      },
      {
        "id": "1767673259380-v5gcvw6ki",
        "from_id": "TI-1407",
        "to_id": "TT-1407",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TI 1407",
          "to_label": "TT 1407"
        }
      },
      {
        "id": "1767673259380-7raszu18c",
        "from_id": "TT-1407",
        "to_id": "TE-1407",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TT 1407",
          "to_label": "TE 1407"
        }
      },
      {
        "id": "1767673259380-hxhrgak01",
        "from_id": "TE-1417",
        "to_id": "TT-1417",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE 1417",
          "to_label": "TT 1417"
        }
      },
      {
        "id": "1767673259380-ie5juimrw",
        "from_id": "TT-1417",
        "to_id": "TI-1417",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TT 1417",
          "to_label": "TI 1417"
        }
      },
      {
        "id": "1767673259380-6krj1u1ps",
        "from_id": "PT-1404",
        "to_id": "PIC-1404",
        "type": "Signal Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_pressure",
          "to_component_type": "sensor_pressure",
          "from_label": "PT 1404",
          "to_label": "PIC 1404"
        }
      },
      {
        "id": "1767673259380-adn8cic7v",
        "from_id": "PIC-1404",
        "to_id": "PV-1404",
        "type": "Signal Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_pressure",
          "to_component_type": "valve_control",
          "from_label": "PIC 1404",
          "to_label": "PV 1404"
        }
      },
      {
        "id": "1767673259380-i3dubtcj0",
        "from_id": "PV-1404",
        "to_id": "Valve-Control-ManualActuator-FO-2",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "Control Valve",
          "from_label": "PV 1404",
          "to_label": "FO"
        }
      },
      {
        "id": "1767673259380-xv1fr0fef",
        "from_id": "Valve-Control-ManualActuator-FO-2",
        "to_id": "Valve-Manual-Gate-5",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Control Valve",
          "to_component_type": "Manual Gate Valve",
          "from_label": "FO",
          "to_label": "X1\""
        }
      },
      {
        "id": "1767673259380-3abtn7hlq",
        "from_id": "Valve-Manual-Gate-5",
        "to_id": "FLO-2",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Manual Gate Valve",
          "to_component_type": "Orifice Plate",
          "from_label": "X1\"",
          "to_label": "FLO"
        }
      },
      {
        "id": "1767673259380-cuuchxw8y",
        "from_id": "FLO-2",
        "to_id": "P-4",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Orifice Plate",
          "to_component_type": "Pump",
          "from_label": "FLO",
          "to_label": "P"
        }
      },
      {
        "id": "1767673259380-riz6uoc6j",
        "from_id": "P-4",
        "to_id": "Valve-Manual-Gate-6",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Pump",
          "to_component_type": "Manual Gate Valve",
          "from_label": "P",
          "to_label": "X1\""
        }
      },
      {
        "id": "1767673259380-bevbqkyea",
        "from_id": "Valve-Manual-Gate-6",
        "to_id": "Valve-Manual-Gate-7",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Manual Gate Valve",
          "to_component_type": "Manual Gate Valve",
          "from_label": "X1\"",
          "to_label": "X1\""
        }
      },
      {
        "id": "1767673259380-vmn9ois98",
        "from_id": "Valve-Manual-Gate-7",
        "to_id": "Valve-Manual-Gate-8",
        "type": "Process Connection",
        "confidence": 1,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Manual Gate Valve",
          "to_component_type": "Manual Gate Valve",
          "from_label": "X1\"",
          "to_label": "X1\""
        }
      }
    ],
    "metadata": {
      "total_components": 90,
      "total_connections": 38,
      "enhancement": {
        "isa_detection_enabled": true,
        "isa_functions_detected": 65,
        "isa_detection_rate": 0.7222222222222222,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 0,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 5
      },
      "control_loops": [],
      "validation_issues": [],
      "quality_metrics": {
        "overall_score": 0.8143333333333334,
        "detection_quality": 1,
        "isa_completeness": 0.7222222222222222,
        "connection_coverage": 0.4222222222222222,
        "confidence_avg": 0.9977777777777779,
        "metrics": {
          "total_components": 90,
          "total_connections": 38,
          "isa_functions_detected": 65,
          "excellent_detections": 90,
          "avg_confidence": 0.9977777777777779
        }
      }
    }
  }
}
[Background] Starting background analysis...