--- Inference Test Run Results/Logs ---

[INFO] ======================================================================
[INFO] HVAC AI Platform - Startup Script v2.0
[INFO] ======================================================================
[INFO] Started: 2026-01-08 03:53:25 UTC
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

> hvac-ai-platform@0.0.0 dev:api
> node server/index.cjs


> hvac-ai-platform@0.0.0 dev
> vite

[dotenv@17.2.3] injecting env (33) from .env -- tip: ⚙️  specify custom .env file path with { path: '/custom/path/.env' }

  VITE v6.4.1  ready in 451 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.0.163:3000/
  ➜  Network: http://172.20.32.1:3000/
  ➜  press h + enter to show help
✅ AI Proxy Initialized. Model: gemini-2.5-flash

Server running at http://localhost:4000
Data Root: D:\AMD\secrets\hvac\extra\hvac\server\data
AI Provider: gemini (Active)
Mock Mode: DISABLED (live AI inference)
AI Vision Request -> model=gemini-2.5-flash imageSize=100756 mimeType=image/png responseMimeType=unset
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: PID
AI Vision Request -> model=gemini-2.5-flash imageSize=100756 mimeType=image/png responseMimeType=application/json
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision attempt 1 failed: [GoogleGenerativeAI Error]: Request aborted when fetching https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent: This operation was aborted
AI Vision: Retrying in 800ms (attempt 2/2)...
AI Vision Response: {
  "components": [
    {
      "id": "FFVMS",
      "label": "FFVMS",
      "type": "computer_function",
      "bbox": [0.499, 0.165, 0.556, 0.208],
      "confidence": 0.95,
      "meta": {
        ...
[Stage 2] Job analysis-job-1-1767844643060 queued for document 1767844437935-0jlpx4hy5
[Stage 2] Job analysis-job-1-1767844643060 - Status: RUNNING
[Stage 2] Job analysis-job-1-1767844643060 - Minifying payload...
   [Minification] Token reduction: 83.6% (49280 → 8094 bytes)
   [Minification] Components: 34, Connections: 35, Ghosts filtered: 0
[Stage 2] Job analysis-job-1-1767844643060 - Minification complete in 2ms
[Stage 2] Job analysis-job-1-1767844643060 - Sending to AI (model: gemini-2.5-flash)...
[Stage 2] Job analysis-job-1-1767844643060 - Token budget: 7100 tokens (34 components × 150 + 2000 base, cap: 16384)
[Stage 2] Job analysis-job-1-1767844643060 - Thinking budget: 5448 tokens
[Stage 2] Job analysis-job-1-1767844643060 - AI timeout configured: 180000ms
[Stage 2] Job analysis-job-1-1767844643060 - AI Response received in 19742ms
[Stage 2] Job analysis-job-1-1767844643060 - Response length: 7247 characters
[Stage 2] Job analysis-job-1-1767844643060 - Response preview (first 200 chars): {
  "report_title": "Process Fan System with Integrated Motor Control and Safety Interlocks Analysis",
  "executive_summary": "This report details a process fan system designed for controlled air or g...
[Stage 2] Job analysis-job-1-1767844643060 - Response preview (last 200 chars): ...ical for maintaining the desired process flow. The system's design emphasizes reliable and safe operation of this fan for its intended process application, rather than general building ventilation."
}
[Stage 2] Job analysis-job-1-1767844643060 - JSON parsed successfully
[Stage 2] Job analysis-job-1-1767844643060 - Response validation passed, all required fields present
[Stage 2] Job analysis-job-1-1767844643060 - Status: COMPLETED
[Stage 2] Job analysis-job-1-1767844643060 - Performance: Total=19750ms, AI=19742ms, Minify=2ms, DB=0ms
[Stage 2] Project default - Final report saved

====================================================================================================================

Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767844437935-0jlpx4hy5","type":"SCHEMATIC","processing_time_ms":204569,"components":34}]

{
  "document_id": "1767844437935-0jlpx4hy5",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767844642504,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."
  },
  "processing_time_ms": 204569,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "Flare_Connection_0080",
        "type": "process_connection",
        "label": "2\"-RL-0080-1SD0P TO HP FLARE",
        "bbox": [
          0.68,
          0,
          0.99,
          0.05
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified text indicating a connection to an HP Flare system, likely a process line.",
          "description": "2-inch Relief Line to High Pressure Flare",
          "equipment_type": "piping",
          "hvac_subsystem": "safety_system",
          "location": "external",
          "occlusion_level": "none",
          "tag": "RL-0080",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.68,
            0,
            0.99,
            0.05
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.68,
                  0,
                  0.99,
                  0.05
                ],
                "normalized_bbox": [
                  0.68,
                  0,
                  0.99,
                  0.05
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "RL",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "Flare_Connection_0081",
        "type": "process_connection",
        "label": "2\"-RL-0081-1SD0P TO HP FLARE",
        "bbox": [
          0.68,
          0.05,
          0.99,
          0.1
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified text indicating a connection to an HP Flare system, likely a process line.",
          "description": "2-inch Relief Line to High Pressure Flare",
          "equipment_type": "piping",
          "hvac_subsystem": "safety_system",
          "location": "external",
          "occlusion_level": "none",
          "tag": "RL-0081",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.68,
            0.05,
            0.99,
            0.1
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.68,
                  0.05,
                  0.99,
                  0.1
                ],
                "normalized_bbox": [
                  0.68,
                  0.05,
                  0.99,
                  0.1
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "RL",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "Process_Source",
        "type": "process_connection",
        "label": "Process Source",
        "bbox": [
          0,
          0.12,
          0.3,
          0.13
        ],
        "confidence": 0.8,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a thick solid line originating from the left, indicating a process flow source.",
          "description": "Incoming Process Line",
          "equipment_type": "piping",
          "hvac_subsystem": "process_utility",
          "location": "external",
          "occlusion_level": "none",
          "tag": "PROCESS_IN",
          "text_clarity": "not_applicable",
          "raw_backend_output": [
            0,
            0.12,
            0.3,
            0.13
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0,
                  0.12,
                  0.3,
                  0.13
                ],
                "normalized_bbox": [
                  0,
                  0.12,
                  0.3,
                  0.13
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "PR",
          "detection_quality": "good",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Record",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PROCESS-SOURCE"
        }
      },
      {
        "id": "Top_Data_Link",
        "type": "data_link",
        "label": "Top Data Link",
        "bbox": [
          0.34,
          0.12,
          0.85,
          0.13
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a long horizontal solid line with small circles, which represents a software/data link according to P&ID conventions.",
          "description": "Top Data Communication Link",
          "equipment_type": "communication_bus",
          "hvac_subsystem": "control_network",
          "location": "field",
          "occlusion_level": "none",
          "tag": "DATA_LINK",
          "text_clarity": "not_applicable",
          "raw_backend_output": [
            0.34,
            0.12,
            0.85,
            0.13
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.34,
                  0.12,
                  0.85,
                  0.13
                ],
                "normalized_bbox": [
                  0.34,
                  0.12,
                  0.85,
                  0.13
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "TO",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Temperature",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: TOP-DATA-LINK"
        }
      },
      {
        "id": "FFVMS",
        "type": "computer_function",
        "label": "FFVMS",
        "bbox": [
          0.499,
          0.165,
          0.556,
          0.208
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a hexagon shape with the label 'FFVMS'. Hexagons are used to represent computer functions in P&ID diagrams.",
          "description": "Fire and Gas Valve Management System (Computer Function)",
          "equipment_type": "computer_system",
          "hvac_subsystem": "safety_system",
          "instrument_function": "compute",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "FFVMS",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.499,
            0.165,
            0.556,
            0.208
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.491Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.499,
                  0.165,
                  0.556,
                  0.208
                ],
                "normalized_bbox": [
                  0.499,
                  0.165,
                  0.556,
                  0.208
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "FF",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Flow Rate Ratio / Fraction Valve / Damper / Actuator Middle / Intermediate Switch"
        }
      },
      {
        "id": "VAH-B",
        "type": "sensor_vibration",
        "label": "VAH B",
        "bbox": [
          0.386,
          0.245,
          0.43,
          0.288
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle inside a square with the tag 'VAH B'. This visual signature indicates a shared display/control instrument. The ISA tag 'VAH' signifies a Vibration Alarm High.",
          "description": "Vibration Alarm High (Shared Display/Control)",
          "equipment_type": "instrument",
          "hvac_subsystem": "vibration_monitoring",
          "instrument_function": "alarm_high",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "VAH-B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.386,
            0.245,
            0.43,
            0.288
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.386,
                  0.245,
                  0.43,
                  0.288
                ],
                "normalized_bbox": [
                  0.386,
                  0.245,
                  0.43,
                  0.288
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "V",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Vibration / Mech. Analysis Alarm High (Alarm/Switch Setpoint)"
        }
      },
      {
        "id": "VAH-A",
        "type": "sensor_vibration",
        "label": "VAH A",
        "bbox": [
          0.447,
          0.245,
          0.491,
          0.288
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle inside a square with the tag 'VAH A'. This visual signature indicates a shared display/control instrument. The ISA tag 'VAH' signifies a Vibration Alarm High.",
          "description": "Vibration Alarm High (Shared Display/Control)",
          "equipment_type": "instrument",
          "hvac_subsystem": "vibration_monitoring",
          "instrument_function": "alarm_high",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "VAH-A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.447,
            0.245,
            0.491,
            0.288
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.447,
                  0.245,
                  0.491,
                  0.288
                ],
                "normalized_bbox": [
                  0.447,
                  0.245,
                  0.491,
                  0.288
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "V",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Vibration / Mech. Analysis Alarm High (Alarm/Switch Setpoint)"
        }
      },
      {
        "id": "VT-B",
        "type": "sensor_vibration",
        "label": "VT B",
        "bbox": [
          0.386,
          0.32,
          0.43,
          0.363
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'VT B'. The circle shape indicates a discrete instrument. The ISA tag 'VT' signifies a Vibration Transmitter.",
          "description": "Vibration Transmitter",
          "equipment_type": "instrument",
          "hvac_subsystem": "vibration_monitoring",
          "instrument_function": "transmitter",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "VT-B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.386,
            0.32,
            0.43,
            0.363
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.386,
                  0.32,
                  0.43,
                  0.363
                ],
                "normalized_bbox": [
                  0.386,
                  0.32,
                  0.43,
                  0.363
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "V",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Vibration / Mech. Analysis Transmitter"
        }
      },
      {
        "id": "VT-A",
        "type": "sensor_vibration",
        "label": "VT A",
        "bbox": [
          0.447,
          0.32,
          0.491,
          0.363
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'VT A'. The circle shape indicates a discrete instrument. The ISA tag 'VT' signifies a Vibration Transmitter.",
          "description": "Vibration Transmitter",
          "equipment_type": "instrument",
          "hvac_subsystem": "vibration_monitoring",
          "instrument_function": "transmitter",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "VT-A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.447,
            0.32,
            0.491,
            0.363
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.447,
                  0.32,
                  0.491,
                  0.363
                ],
                "normalized_bbox": [
                  0.447,
                  0.32,
                  0.491,
                  0.363
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "V",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Vibration / Mech. Analysis Transmitter"
        }
      },
      {
        "id": "EML-C",
        "type": "indicator_light",
        "label": "EML C RUNNING",
        "bbox": [
          0.69,
          0.35,
          0.734,
          0.393
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EML C' and 'RUNNING' text. The ISA tag 'EML' signifies an Electrical Motor Light, indicating a running status.",
          "description": "Electrical Motor Running Light",
          "equipment_type": "indicator",
          "hvac_subsystem": "motor_control",
          "instrument_function": "light",
          "location": "at_platform",
          "occlusion_level": "none",
          "tag": "EML-C",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.69,
            0.35,
            0.734,
            0.393
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.35,
                  0.734,
                  0.393
                ],
                "normalized_bbox": [
                  0.69,
                  0.35,
                  0.734,
                  0.393
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EM",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "Middle/Intermediate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EML-C-RUNNING"
        }
      },
      {
        "id": "EHS-D",
        "type": "switch_emergency_stop",
        "label": "EHS D STOP",
        "bbox": [
          0.751,
          0.35,
          0.795,
          0.393
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EHS D' and 'STOP' text. The ISA tag 'EHS' signifies an Electrical High Switch, and the 'STOP' context indicates an emergency stop switch.",
          "description": "Emergency Stop Switch",
          "equipment_type": "switch",
          "hvac_subsystem": "safety_system",
          "instrument_function": "switch_high",
          "location": "at_platform",
          "occlusion_level": "none",
          "tag": "EHS-D",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.751,
            0.35,
            0.795,
            0.393
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.751,
                  0.35,
                  0.795,
                  0.393
                ],
                "normalized_bbox": [
                  0.751,
                  0.35,
                  0.795,
                  0.393
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EH",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EHS-D-STOP"
        }
      },
      {
        "id": "VE-B",
        "type": "sensor_vibration",
        "label": "VE B",
        "bbox": [
          0.386,
          0.42,
          0.43,
          0.463
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'VE B'. The circle shape indicates a discrete instrument. The ISA tag 'VE' signifies a Vibration Sensor/Primary Element.",
          "description": "Vibration Sensor/Primary Element",
          "equipment_type": "instrument",
          "hvac_subsystem": "vibration_monitoring",
          "instrument_function": "sensor",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "VE-B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.386,
            0.42,
            0.43,
            0.463
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.386,
                  0.42,
                  0.43,
                  0.463
                ],
                "normalized_bbox": [
                  0.386,
                  0.42,
                  0.43,
                  0.463
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "V",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Vibration / Mech. Analysis Sensor / Primary Element"
        }
      },
      {
        "id": "VE-A",
        "type": "sensor_vibration",
        "label": "VE A",
        "bbox": [
          0.447,
          0.42,
          0.491,
          0.463
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'VE A'. The circle shape indicates a discrete instrument. The ISA tag 'VE' signifies a Vibration Sensor/Primary Element.",
          "description": "Vibration Sensor/Primary Element",
          "equipment_type": "instrument",
          "hvac_subsystem": "vibration_monitoring",
          "instrument_function": "sensor",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "VE-A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.447,
            0.42,
            0.491,
            0.463
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.447,
                  0.42,
                  0.491,
                  0.463
                ],
                "normalized_bbox": [
                  0.447,
                  0.42,
                  0.491,
                  0.463
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "V",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Vibration / Mech. Analysis Sensor / Primary Element"
        }
      },
      {
        "id": "FAN",
        "type": "equipment_fan",
        "label": "FAN",
        "bbox": [
          0.509,
          0.42,
          0.549,
          0.463
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a standard fan symbol with the label 'FAN'.",
          "description": "Fan",
          "equipment_type": "fan",
          "hvac_subsystem": "air_distribution",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "FAN",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.509,
            0.42,
            0.549,
            0.463
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.509,
                  0.42,
                  0.549,
                  0.463
                ],
                "normalized_bbox": [
                  0.509,
                  0.42,
                  0.549,
                  0.463
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent",
          "parent_category": "equipment",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Flow Rate Alarm"
        }
      },
      {
        "id": "M",
        "type": "equipment_motor",
        "label": "equipment_motor",
        "bbox": [
          0.509,
          0.49,
          0.549,
          0.533
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a square shape with the label 'M'. In P&ID, 'M' in a square typically represents a motor.",
          "description": "Motor",
          "equipment_type": "motor",
          "hvac_subsystem": "electrical",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "M",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.509,
            0.49,
            0.549,
            0.533
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.509,
                  0.49,
                  0.549,
                  0.533
                ],
                "normalized_bbox": [
                  0.509,
                  0.49,
                  0.549,
                  0.533
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "M",
          "detection_quality": "excellent",
          "parent_category": "equipment",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice (Moisture/Humidity)",
          "label_generated": true,
          "label_generation_reason": "Type-based fallback - no ISA prefix available"
        }
      },
      {
        "id": "EHS-A",
        "type": "switch_manual",
        "label": "EHS A START",
        "bbox": [
          0.69,
          0.49,
          0.734,
          0.533
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EHS A' and 'START' text. The ISA tag 'EHS' signifies an Electrical High Switch, and the 'START' context indicates a manual start switch.",
          "description": "Manual Start Switch",
          "equipment_type": "switch",
          "hvac_subsystem": "motor_control",
          "instrument_function": "switch_high",
          "location": "at_grade",
          "occlusion_level": "none",
          "tag": "EHS-A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.69,
            0.49,
            0.734,
            0.533
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.49,
                  0.734,
                  0.533
                ],
                "normalized_bbox": [
                  0.69,
                  0.49,
                  0.734,
                  0.533
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EH",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EHS-A-START"
        }
      },
      {
        "id": "Main_Data_Link",
        "type": "data_link",
        "label": "Main Data Link",
        "bbox": [
          0.22,
          0.59,
          0.85,
          0.6
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a long horizontal solid line with small circles, which represents a software/data link according to P&ID conventions.",
          "description": "Main Data Communication Link",
          "equipment_type": "communication_bus",
          "hvac_subsystem": "control_network",
          "location": "field",
          "occlusion_level": "none",
          "tag": "DATA_LINK",
          "text_clarity": "not_applicable",
          "raw_backend_output": [
            0.22,
            0.59,
            0.85,
            0.6
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.22,
                  0.59,
                  0.85,
                  0.6
                ],
                "normalized_bbox": [
                  0.22,
                  0.59,
                  0.85,
                  0.6
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "MA",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Moisture/Humidity",
          "isa_modifier": "Alarm",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: MAIN-DATA-LINK"
        }
      },
      {
        "id": "MCC",
        "type": "electrical_panel",
        "label": "MCC",
        "bbox": [
          0.57,
          0.55,
          0.62,
          0.58
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a rectangle shape with the label 'MCC'. 'MCC' stands for Motor Control Center, which is an electrical panel.",
          "description": "Motor Control Center",
          "equipment_type": "electrical_panel",
          "hvac_subsystem": "electrical",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "MCC",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.57,
            0.55,
            0.62,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.57,
                  0.55,
                  0.62,
                  0.58
                ],
                "normalized_bbox": [
                  0.57,
                  0.55,
                  0.62,
                  0.58
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "M",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice (Moisture/Humidity) Controller Controller"
        }
      },
      {
        "id": "EM-A",
        "type": "switch_manual",
        "label": "EM A START",
        "bbox": [
          0.386,
          0.605,
          0.43,
          0.648
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EM A' and 'START' text. The circle shape indicates a discrete instrument, and the context suggests a manual start switch.",
          "description": "Manual Start Switch",
          "equipment_type": "switch",
          "hvac_subsystem": "motor_control",
          "instrument_function": "switch",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "EM-A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.386,
            0.605,
            0.43,
            0.648
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.386,
                  0.605,
                  0.43,
                  0.648
                ],
                "normalized_bbox": [
                  0.386,
                  0.605,
                  0.43,
                  0.648
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EM",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "Middle/Intermediate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EM-A-START"
        }
      },
      {
        "id": "ZC-A",
        "type": "sensor_position",
        "label": "ZC A",
        "bbox": [
          0.447,
          0.605,
          0.491,
          0.648
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as sensor_position based on ISA-5.1 symbol recognition.",
          "description": "Position Controller (Logic Function)",
          "equipment_type": "logic_unit",
          "hvac_subsystem": "control_system",
          "instrument_function": "controller",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "ZC-A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.447,
            0.605,
            0.491,
            0.648
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.447,
                  0.605,
                  0.491,
                  0.648
                ],
                "normalized_bbox": [
                  0.447,
                  0.605,
                  0.491,
                  0.648
                ]
              }
            }
          ],
          "measured_variable": "position",
          "instrument_type": "ZC",
          "parent_category": "instruments",
          "component_category": "controls",
          "isa_function": "Z",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Position / Dimension Controller"
        }
      },
      {
        "id": "ZC-B",
        "type": "sensor_position",
        "label": "ZC B",
        "bbox": [
          0.509,
          0.605,
          0.553,
          0.648
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as sensor_position based on ISA-5.1 symbol recognition.",
          "description": "Position Controller (Logic Function)",
          "equipment_type": "logic_unit",
          "hvac_subsystem": "control_system",
          "instrument_function": "controller",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "ZC-B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.509,
            0.605,
            0.553,
            0.648
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.509,
                  0.605,
                  0.553,
                  0.648
                ],
                "normalized_bbox": [
                  0.509,
                  0.605,
                  0.553,
                  0.648
                ]
              }
            }
          ],
          "measured_variable": "position",
          "instrument_type": "ZC",
          "parent_category": "instruments",
          "component_category": "controls",
          "isa_function": "Z",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Position / Dimension Controller"
        }
      },
      {
        "id": "EHS-B",
        "type": "switch_manual",
        "label": "EHS B STOP",
        "bbox": [
          0.69,
          0.565,
          0.734,
          0.608
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EHS B' and 'STOP' text. The ISA tag 'EHS' signifies an Electrical High Switch, and the 'STOP' context indicates a manual stop switch.",
          "description": "Manual Stop Switch",
          "equipment_type": "switch",
          "hvac_subsystem": "motor_control",
          "instrument_function": "switch_high",
          "location": "at_grade",
          "occlusion_level": "none",
          "tag": "EHS-B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.69,
            0.565,
            0.734,
            0.608
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.565,
                  0.734,
                  0.608
                ],
                "normalized_bbox": [
                  0.69,
                  0.565,
                  0.734,
                  0.608
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EH",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EHS-B-STOP"
        }
      },
      {
        "id": "EM-B",
        "type": "switch_manual",
        "label": "EM B STOP",
        "bbox": [
          0.386,
          0.68,
          0.43,
          0.723
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EM B' and 'STOP' text. The circle shape indicates a discrete instrument, and the context suggests a manual stop switch.",
          "description": "Manual Stop Switch",
          "equipment_type": "switch",
          "hvac_subsystem": "motor_control",
          "instrument_function": "switch",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "EM-B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.386,
            0.68,
            0.43,
            0.723
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.386,
                  0.68,
                  0.43,
                  0.723
                ],
                "normalized_bbox": [
                  0.386,
                  0.68,
                  0.43,
                  0.723
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EM",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "Middle/Intermediate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EM-B-STOP"
        }
      },
      {
        "id": "EM-C",
        "type": "indicator_status",
        "label": "EM C RUNNING STOPPED",
        "bbox": [
          0.447,
          0.68,
          0.491,
          0.723
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EM C' and 'RUNNING STOPPED' text. The circle shape indicates a discrete instrument, and the text suggests a status indicator.",
          "description": "Motor Status Indicator (Running/Stopped)",
          "equipment_type": "indicator",
          "hvac_subsystem": "motor_control",
          "instrument_function": "indicator",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "EM-C",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.447,
            0.68,
            0.491,
            0.723
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.447,
                  0.68,
                  0.491,
                  0.723
                ],
                "normalized_bbox": [
                  0.447,
                  0.68,
                  0.491,
                  0.723
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EM",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "Middle/Intermediate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EM-C-RUNNING-STOPPED"
        }
      },
      {
        "id": "EM-D",
        "type": "indicator_status",
        "label": "EM D REMOTE SELECTED",
        "bbox": [
          0.509,
          0.68,
          0.553,
          0.723
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EM D' and 'REMOTE SELECTED' text. The circle shape indicates a discrete instrument, and the text suggests a status indicator.",
          "description": "Remote Selected Status Indicator",
          "equipment_type": "indicator",
          "hvac_subsystem": "motor_control",
          "instrument_function": "indicator",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "EM-D",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.509,
            0.68,
            0.553,
            0.723
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.509,
                  0.68,
                  0.553,
                  0.723
                ],
                "normalized_bbox": [
                  0.509,
                  0.68,
                  0.553,
                  0.723
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EM",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "Middle/Intermediate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EM-D-REMOTE-SELECTED"
        }
      },
      {
        "id": "EM-E",
        "type": "indicator_status",
        "label": "EM E HAND SELECTED",
        "bbox": [
          0.57,
          0.68,
          0.614,
          0.723
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EM E' and 'HAND SELECTED' text. The circle shape indicates a discrete instrument, and the text suggests a status indicator.",
          "description": "Hand Selected Status Indicator",
          "equipment_type": "indicator",
          "hvac_subsystem": "motor_control",
          "instrument_function": "indicator",
          "location": "field_mounted_panel",
          "occlusion_level": "none",
          "tag": "EM-E",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.57,
            0.68,
            0.614,
            0.723
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.57,
                  0.68,
                  0.614,
                  0.723
                ],
                "normalized_bbox": [
                  0.57,
                  0.68,
                  0.614,
                  0.723
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EM",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "Middle/Intermediate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EM-E-HAND-SELECTED"
        }
      },
      {
        "id": "EHS-C",
        "type": "switch_selector",
        "label": "EHS C HOA",
        "bbox": [
          0.69,
          0.64,
          0.734,
          0.683
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EHS C' and 'HOA' text. The ISA tag 'EHS' signifies an Electrical High Switch, and 'HOA' indicates a Hand-Off-Auto selector switch.",
          "description": "Hand-Off-Auto Selector Switch",
          "equipment_type": "switch",
          "hvac_subsystem": "motor_control",
          "instrument_function": "switch_high",
          "location": "at_grade",
          "occlusion_level": "none",
          "tag": "EHS-C",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.69,
            0.64,
            0.734,
            0.683
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.64,
                  0.734,
                  0.683
                ],
                "normalized_bbox": [
                  0.69,
                  0.64,
                  0.734,
                  0.683
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EH",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EHS-C-HOA"
        }
      },
      {
        "id": "EML-A",
        "type": "indicator_light",
        "label": "EML A RUNNING",
        "bbox": [
          0.69,
          0.715,
          0.734,
          0.758
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EML A' and 'RUNNING' text. The ISA tag 'EML' signifies an Electrical Motor Light, indicating a running status.",
          "description": "Electrical Motor Running Light",
          "equipment_type": "indicator",
          "hvac_subsystem": "motor_control",
          "instrument_function": "light",
          "location": "at_grade",
          "occlusion_level": "none",
          "tag": "EML-A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.69,
            0.715,
            0.734,
            0.758
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.715,
                  0.734,
                  0.758
                ],
                "normalized_bbox": [
                  0.69,
                  0.715,
                  0.734,
                  0.758
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EM",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "Middle/Intermediate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EML-A-RUNNING"
        }
      },
      {
        "id": "UY-0201",
        "type": "logic_function",
        "label": "UY START 0201 STOP",
        "bbox": [
          0.12,
          0.805,
          0.164,
          0.848
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'UY-0201' and 'START/STOP' text. The ISA tag 'UY' signifies a Multivariable Relay/Compute function, indicating a logic or control function.",
          "description": "Multivariable Relay/Compute Function, Start/Stop",
          "equipment_type": "logic_unit",
          "hvac_subsystem": "control_system",
          "instrument_function": "relay_compute",
          "location": "field",
          "occlusion_level": "none",
          "tag": "UY-0201",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.12,
            0.805,
            0.164,
            0.848
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.805,
                  0.164,
                  0.848
                ],
                "normalized_bbox": [
                  0.12,
                  0.805,
                  0.164,
                  0.848
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "UY",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "EML-B",
        "type": "indicator_light",
        "label": "EML B STOPPED",
        "bbox": [
          0.69,
          0.79,
          0.734,
          0.833
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'EML B' and 'STOPPED' text. The ISA tag 'EML' signifies an Electrical Motor Light, indicating a stopped status.",
          "description": "Electrical Motor Stopped Light",
          "equipment_type": "indicator",
          "hvac_subsystem": "motor_control",
          "instrument_function": "light",
          "location": "at_grade",
          "occlusion_level": "none",
          "tag": "EML-B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.69,
            0.79,
            0.734,
            0.833
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.79,
                  0.734,
                  0.833
                ],
                "normalized_bbox": [
                  0.69,
                  0.79,
                  0.734,
                  0.833
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "EM",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Voltage",
          "isa_modifier": "Middle/Intermediate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: EML-B-STOPPED"
        }
      },
      {
        "id": "TIC-0047",
        "type": "sensor_temperature",
        "label": "TIC 0047",
        "bbox": [
          0.12,
          0.88,
          0.164,
          0.923
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'TIC-0047'. The circle shape indicates a discrete instrument. The ISA tag 'TIC' signifies a Temperature Indicating Controller.",
          "description": "Temperature Indicating Controller",
          "equipment_type": "instrument",
          "hvac_subsystem": "temperature_control",
          "instrument_function": "indicator_controller",
          "location": "field",
          "occlusion_level": "none",
          "tag": "TIC-0047",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.12,
            0.88,
            0.164,
            0.923
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.88,
                  0.164,
                  0.923
                ],
                "normalized_bbox": [
                  0.12,
                  0.88,
                  0.164,
                  0.923
                ]
              }
            }
          ],
          "measured_variable": "temperature",
          "instrument_type": "TI",
          "parent_category": "instruments",
          "component_category": "controls",
          "isa_function": "TIC",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "Signal_Connection_3198",
        "type": "signal_connection",
        "label": "TA-403901005 3198 FROM 731-K-0101 CCS",
        "bbox": [
          0.74,
          0.89,
          0.99,
          0.94
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified text indicating a signal connection from an external control system (CCS).",
          "description": "Signal from 731-K-0101 Central Control System",
          "equipment_type": "signal_line",
          "hvac_subsystem": "control_network",
          "location": "external",
          "occlusion_level": "none",
          "tag": "TA-403901005",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.74,
            0.89,
            0.99,
            0.94
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.74,
                  0.89,
                  0.99,
                  0.94
                ],
                "normalized_bbox": [
                  0.74,
                  0.89,
                  0.99,
                  0.94
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "TA",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "TIT-0047",
        "type": "sensor_temperature",
        "label": "TIT 0047",
        "bbox": [
          0.12,
          0.955,
          0.164,
          0.998
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an empty circle with the tag 'TIT-0047'. The circle shape indicates a discrete instrument. The ISA tag 'TIT' signifies a Temperature Indicating Transmitter.",
          "description": "Temperature Indicating Transmitter",
          "equipment_type": "instrument",
          "hvac_subsystem": "temperature_monitoring",
          "instrument_function": "indicator_transmitter",
          "location": "field",
          "occlusion_level": "none",
          "tag": "TIT-0047",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.12,
            0.955,
            0.164,
            0.998
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.955,
                  0.164,
                  0.998
                ],
                "normalized_bbox": [
                  0.12,
                  0.955,
                  0.164,
                  0.998
                ]
              }
            }
          ],
          "measured_variable": "temperature",
          "instrument_type": "TI",
          "parent_category": "instruments",
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
        "id": "FF",
        "type": "logic_function",
        "label": "FF",
        "bbox": [
          0.18,
          0.955,
          0.224,
          0.998
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a rectangle shape with the tag 'FF'. The ISA tag 'FF' signifies a Flow Ratio/Fraction, indicating a calculation or logic function.",
          "description": "Flow Ratio/Fraction Function",
          "equipment_type": "logic_unit",
          "hvac_subsystem": "flow_control",
          "instrument_function": "ratio_fraction",
          "location": "field",
          "occlusion_level": "none",
          "tag": "FF",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.18,
            0.955,
            0.224,
            0.998
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T03:57:22.492Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.18,
                  0.955,
                  0.224,
                  0.998
                ],
                "normalized_bbox": [
                  0.18,
                  0.955,
                  0.224,
                  0.998
                ]
              }
            }
          ],
          "component_category": "other",
          "isa_function": "FF",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Flow Rate Ratio / Fraction"
        }
      }
    ],
    "connections": [
      {
        "id": "1767844642492-rwoz215xg",
        "from_id": "Process_Source",
        "to_id": "FFVMS",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "process_connection",
          "to_component_type": "computer_function",
          "from_label": "Process Source",
          "to_label": "FFVMS"
        }
      },
      {
        "id": "1767844642492-4df8gahrt",
        "from_id": "FFVMS",
        "to_id": "Top_Data_Link",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "computer_function",
          "to_component_type": "data_link",
          "from_label": "FFVMS",
          "to_label": "Top Data Link"
        }
      },
      {
        "id": "1767844642492-bud7jjtem",
        "from_id": "Top_Data_Link",
        "to_id": "VAH-B",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "sensor_vibration",
          "from_label": "Top Data Link",
          "to_label": "VAH B"
        }
      },
      {
        "id": "1767844642492-t2cll0n9a",
        "from_id": "Top_Data_Link",
        "to_id": "VAH-A",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "sensor_vibration",
          "from_label": "Top Data Link",
          "to_label": "VAH A"
        }
      },
      {
        "id": "1767844642492-t7f9yoimc",
        "from_id": "VAH-B",
        "to_id": "VT-B",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_vibration",
          "to_component_type": "sensor_vibration",
          "from_label": "VAH B",
          "to_label": "VT B"
        }
      },
      {
        "id": "1767844642492-ket6em8l8",
        "from_id": "VAH-A",
        "to_id": "VT-A",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_vibration",
          "to_component_type": "sensor_vibration",
          "from_label": "VAH A",
          "to_label": "VT A"
        }
      },
      {
        "id": "1767844642492-gh6ybkkky",
        "from_id": "VT-B",
        "to_id": "VE-B",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_vibration",
          "to_component_type": "sensor_vibration",
          "from_label": "VT B",
          "to_label": "VE B"
        }
      },
      {
        "id": "1767844642492-ag984cemr",
        "from_id": "VT-A",
        "to_id": "VE-A",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_vibration",
          "to_component_type": "sensor_vibration",
          "from_label": "VT A",
          "to_label": "VE A"
        }
      },
      {
        "id": "1767844642492-8p7n8ekrd",
        "from_id": "VE-B",
        "to_id": "FAN",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_vibration",
          "to_component_type": "equipment_fan",
          "from_label": "VE B",
          "to_label": "FAN"
        }
      },
      {
        "id": "1767844642492-ina5me5ud",
        "from_id": "VE-A",
        "to_id": "FAN",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_vibration",
          "to_component_type": "equipment_fan",
          "from_label": "VE A",
          "to_label": "FAN"
        }
      },
      {
        "id": "1767844642492-w0566wx1q",
        "from_id": "FAN",
        "to_id": "M",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_fan",
          "to_component_type": "equipment_motor",
          "from_label": "FAN",
          "to_label": "M"
        }
      },
      {
        "id": "1767844642492-5ib0x4ci1",
        "from_id": "M",
        "to_id": "MCC",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_motor",
          "to_component_type": "electrical_panel",
          "from_label": "M",
          "to_label": "MCC"
        }
      },
      {
        "id": "1767844642492-nzfcs4e6o",
        "from_id": "MCC",
        "to_id": "Main_Data_Link",
        "type": "electric",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "data_link",
          "from_label": "MCC",
          "to_label": "Main Data Link"
        }
      },
      {
        "id": "1767844642492-o0grg0cti",
        "from_id": "MCC",
        "to_id": "EML-C",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "indicator_light",
          "from_label": "MCC",
          "to_label": "EML C RUNNING"
        }
      },
      {
        "id": "1767844642492-zd160uznz",
        "from_id": "MCC",
        "to_id": "EHS-D",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "switch_emergency_stop",
          "from_label": "MCC",
          "to_label": "EHS D STOP"
        }
      },
      {
        "id": "1767844642492-isega44ca",
        "from_id": "MCC",
        "to_id": "EHS-A",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "switch_manual",
          "from_label": "MCC",
          "to_label": "EHS A START"
        }
      },
      {
        "id": "1767844642492-b3wfzfyhn",
        "from_id": "MCC",
        "to_id": "EHS-B",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "switch_manual",
          "from_label": "MCC",
          "to_label": "EHS B STOP"
        }
      },
      {
        "id": "1767844642492-s4iaex1qr",
        "from_id": "MCC",
        "to_id": "EHS-C",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "switch_selector",
          "from_label": "MCC",
          "to_label": "EHS C HOA"
        }
      },
      {
        "id": "1767844642492-ffz7vfeeh",
        "from_id": "MCC",
        "to_id": "EML-A",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "indicator_light",
          "from_label": "MCC",
          "to_label": "EML A RUNNING"
        }
      },
      {
        "id": "1767844642492-c2c9obwr0",
        "from_id": "MCC",
        "to_id": "EML-B",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "indicator_light",
          "from_label": "MCC",
          "to_label": "EML B STOPPED"
        }
      },
      {
        "id": "1767844642492-zpqv5zonl",
        "from_id": "MCC",
        "to_id": "EM-A",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "switch_manual",
          "from_label": "MCC",
          "to_label": "EM A START"
        }
      },
      {
        "id": "1767844642492-d3u334ugo",
        "from_id": "MCC",
        "to_id": "EM-B",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "switch_manual",
          "from_label": "MCC",
          "to_label": "EM B STOP"
        }
      },
      {
        "id": "1767844642492-21p326vgw",
        "from_id": "MCC",
        "to_id": "EM-C",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "indicator_status",
          "from_label": "MCC",
          "to_label": "EM C RUNNING STOPPED"
        }
      },
      {
        "id": "1767844642492-xtrz6q9kz",
        "from_id": "MCC",
        "to_id": "EM-D",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "indicator_status",
          "from_label": "MCC",
          "to_label": "EM D REMOTE SELECTED"
        }
      },
      {
        "id": "1767844642492-uwn67n97v",
        "from_id": "MCC",
        "to_id": "EM-E",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "electrical_panel",
          "to_component_type": "indicator_status",
          "from_label": "MCC",
          "to_label": "EM E HAND SELECTED"
        }
      },
      {
        "id": "1767844642492-0mmxq57r1",
        "from_id": "Main_Data_Link",
        "to_id": "UY-0201",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "logic_function",
          "from_label": "Main Data Link",
          "to_label": "UY START 0201 STOP"
        }
      },
      {
        "id": "1767844642492-3qq6hlarm",
        "from_id": "Main_Data_Link",
        "to_id": "TIC-0047",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "sensor_temperature",
          "from_label": "Main Data Link",
          "to_label": "TIC 0047"
        }
      },
      {
        "id": "1767844642492-vk18km1mb",
        "from_id": "Main_Data_Link",
        "to_id": "TIT-0047",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "sensor_temperature",
          "from_label": "Main Data Link",
          "to_label": "TIT 0047"
        }
      },
      {
        "id": "1767844642492-dcfhsbw73",
        "from_id": "Main_Data_Link",
        "to_id": "FF",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "logic_function",
          "from_label": "Main Data Link",
          "to_label": "FF"
        }
      },
      {
        "id": "1767844642492-7jl83k6v0",
        "from_id": "UY-0201",
        "to_id": "ZC-A",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "sensor_position",
          "from_label": "UY START 0201 STOP",
          "to_label": "ZC A"
        }
      },
      {
        "id": "1767844642492-z9nsta7jm",
        "from_id": "UY-0201",
        "to_id": "ZC-B",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "sensor_position",
          "from_label": "UY START 0201 STOP",
          "to_label": "ZC B"
        }
      },
      {
        "id": "1767844642492-frvvudwa2",
        "from_id": "TIC-0047",
        "to_id": "FF",
        "type": "electric",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "logic_function",
          "from_label": "TIC 0047",
          "to_label": "FF"
        }
      },
      {
        "id": "1767844642492-ps5v64rh6",
        "from_id": "Top_Data_Link",
        "to_id": "Flare_Connection_0080",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "process_connection",
          "from_label": "Top Data Link",
          "to_label": "2\"-RL-0080-1SD0P TO HP FLARE"
        }
      },
      {
        "id": "1767844642492-yqra3tecu",
        "from_id": "Top_Data_Link",
        "to_id": "Flare_Connection_0081",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "process_connection",
          "from_label": "Top Data Link",
          "to_label": "2\"-RL-0081-1SD0P TO HP FLARE"
        }
      },
      {
        "id": "1767844642492-09b0ura61",
        "from_id": "Main_Data_Link",
        "to_id": "Signal_Connection_3198",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "data_link",
          "to_component_type": "signal_connection",
          "from_label": "Main Data Link",
          "to_label": "TA-403901005 3198 FROM 731-K-0101 CCS"
        }
      }
    ],
    "metadata": {
      "total_components": 34,
      "total_connections": 35,
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "shape_validation_enabled": true,
        "shape_violations_corrected": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 34,
        "isa_detection_rate": 1,
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
        "overall_score": 0.9741176470588233,
        "detection_quality": 0.9705882352941176,
        "isa_completeness": 1,
        "connection_coverage": 1,
        "confidence_avg": 0.9382352941176466,
        "metrics": {
          "total_components": 34,
          "total_connections": 35,
          "isa_functions_detected": 34,
          "excellent_detections": 33,
          "avg_confidence": 0.9382352941176466
        }
      },
      "label_generation": {
        "generated_count": 1,
        "conflicts_resolved": 0
      }
    }
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...

[Stage 2 Complete] Final analysis report generated successfully.

=========================================================================================================================

Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."}]
index.ts:34 Step 2: Routing to pipeline...
index.ts:34 ["Selected pipeline:","visual"]
index.ts:34 Step 3: Executing pipeline...
visual.ts:82 Detecting blueprint type (P&ID vs HVAC)...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
visual.ts:84 Blueprint type detected: PID
visual.ts:409 [Visual Pipeline] Image dimensions: 968x698px, tiling: NO (threshold: 2000px)
visual.ts:95 Using standard single-pass analysis
visual.ts:100 [Visual Pipeline] Applying enhancements...
visual-enhancements.ts:44 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:51 [Enhancement] Normalizing component and connection types...
3type-normalization.ts:163  [Type Normalization] Unknown connection type: "data_link", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:163
type-normalization.ts:163  [Type Normalization] Unknown connection type: "mechanical_link", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:163
7type-normalization.ts:163  [Type Normalization] Unknown connection type: "data_link", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:163
visual-enhancements.ts:54 [Enhancement] Type normalization complete
visual-enhancements.ts:59 [Enhancement] Applying spatial association to merge orphaned labels...
spatial-association.ts:330 [Spatial Association] Starting spatial association post-processing...
spatial-association.ts:196 [Spatial Association] Starting orphaned label detection...
spatial-association.ts:213 [Spatial Association] Found 0 orphaned labels, 0 unlabeled components, 34 already labeled
spatial-association.ts:220 [Spatial Association] No merging needed
spatial-association.ts:341 [Spatial Association] Post-processing complete in 0ms: 34 → 34 components (0 merged)
visual-enhancements.ts:68 [Enhancement] Spatial association complete: 0 orphaned labels merged, 34 total components remain
visual-enhancements.ts:77 [Enhancement] Applying strict geometric shape validation...
shape-validator.ts:544 [Shape Validator] Starting shape validation...
shape-validator.ts:578 [Shape Validator] All components passed shape validation
shape-validator.ts:595 [Shape Validator] Validation complete: 0/34 validated, 0 corrected
visual-enhancements.ts:80 [Enhancement] Shape validation complete: 0 components corrected
visual-enhancements.ts:87 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:92 [Enhancement] ISA detection complete: 34/34 components have ISA functions (100%)
visual-enhancements.ts:100 [Enhancement] Enhancing connections...
visual-enhancements.ts:106 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:115 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:132 [Enhancement] Validating connections...
visual-enhancements.ts:152 [Enhancement] Detecting control loops...
visual-enhancements.ts:154 [Enhancement] Detected 0 control loops
visual-enhancements.ts:158 [Enhancement] Post-processing complete in 5ms
visual.ts:111 [Visual Pipeline] Generating intelligent labels for unlabeled components...
label-generator.ts:89 [Label Generator] Generating labels for 1 components
label-generator.ts:170 [Label Generator] Generated 1 new labels
visual.ts:115 [Visual Pipeline] Label generation: 0 components labeled
visual.ts:127 [Visual Pipeline] Quality Score: 0.97
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767844437935-0jlpx4hy5","type":"SCHEMATIC","processing_time_ms":204569,"components":34}]
BlueprintWorkspace.tsx:257 Stage 1 (Visual Analysis) complete: Objectcache_hit: falseclassification: confidence: 1reasoning: "The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."type: "SCHEMATIC"[[Prototype]]: Objectdocument_id: "1767844437935-0jlpx4hy5"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 204569timestamp: 1767844642504visual: components: Array(34)0: {id: 'Flare_Connection_0080', type: 'process_connection', label: '2"-RL-0080-1SD0P TO HP FLARE', bbox: Array(4), confidence: 0.9, …}1: {id: 'Flare_Connection_0081', type: 'process_connection', label: '2"-RL-0081-1SD0P TO HP FLARE', bbox: Array(4), confidence: 0.9, …}2: {id: 'Process_Source', type: 'process_connection', label: 'Process Source', bbox: Array(4), confidence: 0.8, …}3: {id: 'Top_Data_Link', type: 'data_link', label: 'Top Data Link', bbox: Array(4), confidence: 0.9, …}4: {id: 'FFVMS', type: 'computer_function', label: 'FFVMS', bbox: Array(4), confidence: 0.95, …}5: {id: 'VAH-B', type: 'sensor_vibration', label: 'VAH B', bbox: Array(4), confidence: 0.95, …}6: {id: 'VAH-A', type: 'sensor_vibration', label: 'VAH A', bbox: Array(4), confidence: 0.95, …}7: {id: 'VT-B', type: 'sensor_vibration', label: 'VT B', bbox: Array(4), confidence: 0.95, …}8: {id: 'VT-A', type: 'sensor_vibration', label: 'VT A', bbox: Array(4), confidence: 0.95, …}9: {id: 'EML-C', type: 'indicator_light', label: 'EML C RUNNING', bbox: Array(4), confidence: 0.95, …}10: {id: 'EHS-D', type: 'switch_emergency_stop', label: 'EHS D STOP', bbox: Array(4), confidence: 0.95, …}11: {id: 'VE-B', type: 'sensor_vibration', label: 'VE B', bbox: Array(4), confidence: 0.95, …}12: {id: 'VE-A', type: 'sensor_vibration', label: 'VE A', bbox: Array(4), confidence: 0.95, …}13: {id: 'FAN', type: 'equipment_fan', label: 'FAN', bbox: Array(4), confidence: 0.95, …}14: {id: 'M', type: 'equipment_motor', label: 'equipment_motor', bbox: Array(4), confidence: 0.95, …}15: {id: 'EHS-A', type: 'switch_manual', label: 'EHS A START', bbox: Array(4), confidence: 0.95, …}16: {id: 'Main_Data_Link', type: 'data_link', label: 'Main Data Link', bbox: Array(4), confidence: 0.9, …}17: {id: 'MCC', type: 'electrical_panel', label: 'MCC', bbox: Array(4), confidence: 0.95, …}18: {id: 'EM-A', type: 'switch_manual', label: 'EM A START', bbox: Array(4), confidence: 0.95, …}19: {id: 'ZC-A', type: 'sensor_position', label: 'ZC A', bbox: Array(4), confidence: 0.95, …}20: {id: 'ZC-B', type: 'sensor_position', label: 'ZC B', bbox: Array(4), confidence: 0.95, …}21: {id: 'EHS-B', type: 'switch_manual', label: 'EHS B STOP', bbox: Array(4), confidence: 0.95, …}22: {id: 'EM-B', type: 'switch_manual', label: 'EM B STOP', bbox: Array(4), confidence: 0.95, …}23: {id: 'EM-C', type: 'indicator_status', label: 'EM C RUNNING STOPPED', bbox: Array(4), confidence: 0.95, …}24: {id: 'EM-D', type: 'indicator_status', label: 'EM D REMOTE SELECTED', bbox: Array(4), confidence: 0.95, …}25: {id: 'EM-E', type: 'indicator_status', label: 'EM E HAND SELECTED', bbox: Array(4), confidence: 0.95, …}26: {id: 'EHS-C', type: 'switch_selector', label: 'EHS C HOA', bbox: Array(4), confidence: 0.95, …}27: {id: 'EML-A', type: 'indicator_light', label: 'EML A RUNNING', bbox: Array(4), confidence: 0.95, …}28: {id: 'UY-0201', type: 'logic_function', label: 'UY START 0201 STOP', bbox: Array(4), confidence: 0.95, …}29: {id: 'EML-B', type: 'indicator_light', label: 'EML B STOPPED', bbox: Array(4), confidence: 0.95, …}30: {id: 'TIC-0047', type: 'sensor_temperature', label: 'TIC 0047', bbox: Array(4), confidence: 0.95, …}31: {id: 'Signal_Connection_3198', type: 'signal_connection', label: 'TA-403901005 3198 FROM 731-K-0101 CCS', bbox: Array(4), confidence: 0.9, …}32: {id: 'TIT-0047', type: 'sensor_temperature', label: 'TIT 0047', bbox: Array(4), confidence: 0.95, …}33: {id: 'FF', type: 'logic_function', label: 'FF', bbox: Array(4), confidence: 0.95, …}length: 34[[Prototype]]: Array(0)connections: Array(35)0: {id: '1767844642492-rwoz215xg', from_id: 'Process_Source', to_id: 'FFVMS', type: 'process_flow', confidence: 0.9, …}1: {id: '1767844642492-4df8gahrt', from_id: 'FFVMS', to_id: 'Top_Data_Link', type: 'unknown', confidence: 0.9, …}2: {id: '1767844642492-bud7jjtem', from_id: 'Top_Data_Link', to_id: 'VAH-B', type: 'unknown', confidence: 0.9, …}3: {id: '1767844642492-t2cll0n9a', from_id: 'Top_Data_Link', to_id: 'VAH-A', type: 'unknown', confidence: 0.9, …}4: {id: '1767844642492-t7f9yoimc', from_id: 'VAH-B', to_id: 'VT-B', type: 'electric', confidence: 0.9, …}5: {id: '1767844642492-ket6em8l8', from_id: 'VAH-A', to_id: 'VT-A', type: 'electric', confidence: 0.9, …}6: {id: '1767844642492-gh6ybkkky', from_id: 'VT-B', to_id: 'VE-B', type: 'electric', confidence: 0.9, …}7: {id: '1767844642492-ag984cemr', from_id: 'VT-A', to_id: 'VE-A', type: 'electric', confidence: 0.9, …}8: {id: '1767844642492-8p7n8ekrd', from_id: 'VE-B', to_id: 'FAN', type: 'process_flow', confidence: 0.9, …}9: {id: '1767844642492-ina5me5ud', from_id: 'VE-A', to_id: 'FAN', type: 'process_flow', confidence: 0.9, …}10: {id: '1767844642492-w0566wx1q', from_id: 'FAN', to_id: 'M', type: 'unknown', confidence: 0.9, …}11: {id: '1767844642492-5ib0x4ci1', from_id: 'M', to_id: 'MCC', type: 'electric', confidence: 0.9, …}12: {id: '1767844642492-nzfcs4e6o', from_id: 'MCC', to_id: 'Main_Data_Link', type: 'electric', confidence: 0.8, …}13: {id: '1767844642492-o0grg0cti', from_id: 'MCC', to_id: 'EML-C', type: 'electric', confidence: 0.9, …}14: {id: '1767844642492-zd160uznz', from_id: 'MCC', to_id: 'EHS-D', type: 'electric', confidence: 0.9, …}15: {id: '1767844642492-isega44ca', from_id: 'MCC', to_id: 'EHS-A', type: 'electric', confidence: 0.9, …}16: {id: '1767844642492-b3wfzfyhn', from_id: 'MCC', to_id: 'EHS-B', type: 'electric', confidence: 0.9, …}17: {id: '1767844642492-s4iaex1qr', from_id: 'MCC', to_id: 'EHS-C', type: 'electric', confidence: 0.9, …}18: {id: '1767844642492-ffz7vfeeh', from_id: 'MCC', to_id: 'EML-A', type: 'electric', confidence: 0.9, …}19: {id: '1767844642492-c2c9obwr0', from_id: 'MCC', to_id: 'EML-B', type: 'electric', confidence: 0.9, …}20: {id: '1767844642492-zpqv5zonl', from_id: 'MCC', to_id: 'EM-A', type: 'electric', confidence: 0.9, …}21: {id: '1767844642492-d3u334ugo', from_id: 'MCC', to_id: 'EM-B', type: 'electric', confidence: 0.9, …}22: {id: '1767844642492-21p326vgw', from_id: 'MCC', to_id: 'EM-C', type: 'electric', confidence: 0.9, …}23: {id: '1767844642492-xtrz6q9kz', from_id: 'MCC', to_id: 'EM-D', type: 'electric', confidence: 0.9, …}24: {id: '1767844642492-uwn67n97v', from_id: 'MCC', to_id: 'EM-E', type: 'electric', confidence: 0.9, …}25: {id: '1767844642492-0mmxq57r1', from_id: 'Main_Data_Link', to_id: 'UY-0201', type: 'unknown', confidence: 0.9, …}26: {id: '1767844642492-3qq6hlarm', from_id: 'Main_Data_Link', to_id: 'TIC-0047', type: 'unknown', confidence: 0.9, …}27: {id: '1767844642492-vk18km1mb', from_id: 'Main_Data_Link', to_id: 'TIT-0047', type: 'unknown', confidence: 0.9, …}28: {id: '1767844642492-dcfhsbw73', from_id: 'Main_Data_Link', to_id: 'FF', type: 'unknown', confidence: 0.9, …}29: {id: '1767844642492-7jl83k6v0', from_id: 'UY-0201', to_id: 'ZC-A', type: 'electric', confidence: 0.9, …}30: {id: '1767844642492-z9nsta7jm', from_id: 'UY-0201', to_id: 'ZC-B', type: 'electric', confidence: 0.9, …}31: {id: '1767844642492-frvvudwa2', from_id: 'TIC-0047', to_id: 'FF', type: 'electric', confidence: 0.9, …}32: {id: '1767844642492-ps5v64rh6', from_id: 'Top_Data_Link', to_id: 'Flare_Connection_0080', type: 'unknown', confidence: 0.9, …}33: {id: '1767844642492-yqra3tecu', from_id: 'Top_Data_Link', to_id: 'Flare_Connection_0081', type: 'unknown', confidence: 0.9, …}34: {id: '1767844642492-09b0ura61', from_id: 'Main_Data_Link', to_id: 'Signal_Connection_3198', type: 'unknown', confidence: 0.9, …}length: 35[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 5inferred_connections: 0isa_detection_enabled: trueisa_detection_rate: 1isa_functions_detected: 34loop_detection_enabled: trueorphaned_labels_merged: 0shape_validation_enabled: trueshape_violations_corrected: 0spatial_association_enabled: truevalidation_enabled: truevalidation_issues: 0[[Prototype]]: Objectlabel_generation: conflicts_resolved: 0generated_count: 1[[Prototype]]: Objectprocess_log: undefinedquality_metrics: confidence_avg: 0.9382352941176466connection_coverage: 1detection_quality: 0.9705882352941176isa_completeness: 1metrics: avg_confidence: 0.9382352941176466excellent_detections: 33isa_functions_detected: 34total_components: 34total_connections: 35[[Prototype]]: Objectoverall_score: 0.9741176470588233[[Prototype]]: Objecttotal_components: 34total_connections: 35validation_issues: Array(0)length: 0[[Prototype]]: Array(0)[[Prototype]]: Object[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:294 [Stage 2] Starting background analysis...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767844642985
BlueprintWorkspace.tsx:315 [Stage 2] Background job queued: analysis-job-1-1767844642985
BlueprintWorkspace.tsx:294 [Stage 2] Queuing background analysis on server...
BlueprintWorkspace.tsx:126 [Polling] Starting poll for job: analysis-job-1-1767844642985
BlueprintWorkspace.tsx:195 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:126 [Polling] Starting poll for job: analysis-job-1-1767844642985
BlueprintWorkspace.tsx:195 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:126 [Polling] Starting poll for job: analysis-job-1-1767844642985
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: processing
BlueprintWorkspace.tsx:195 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:126 [Polling] Starting poll for job: analysis-job-1-1767844642985
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: processing
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: processing
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: processing
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: processing
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: processing
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: processing
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: processing
BlueprintWorkspace.tsx:133 [Polling] Checking project status: default
BlueprintWorkspace.tsx:142 [Polling] Project status: completed
BlueprintWorkspace.tsx:145 [Polling] Project completed! Setting final analysis report
BlueprintWorkspace.tsx:195 [Polling] Cleanup: stopping poll