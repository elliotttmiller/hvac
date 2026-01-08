[INFO] ======================================================================
[INFO] HVAC AI Platform - Startup Script v2.0
[INFO] ======================================================================
[INFO] Started: 2026-01-08 04:22:54 UTC
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

[dotenv@17.2.3] injecting env (33) from .env -- tip: 🔄 add secrets lifecycle management: https://dotenvx.com/ops

  VITE v6.4.1  ready in 778 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.0.163:3000/
  ➜  Network: http://172.20.32.1:3000/
  ➜  press h + enter to show help
✅ AI Proxy Initialized. Model: gemini-2.5-flash

Server running at http://localhost:4000
Data Root: D:\AMD\secrets\hvac\extra\hvac\server\data
AI Provider: gemini (Active)
Mock Mode: DISABLED (live AI inference)
AI Vision Request -> model=gemini-2.5-flash imageSize=63872 mimeType=image/png responseMimeType=unset
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: PID
AI Vision Request -> model=gemini-2.5-flash imageSize=63872 mimeType=image/png responseMimeType=application/json
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: {
  "components": [
    {
      "id": "PG-1005",
      "label": "PG 1005",
      "type": "sensor_pressure",
      "bbox": [0.208, 0.288, 0.248, 0.328],
      "confidence": 0.98,
      "meta": {
      ...
[Stage 2] Job analysis-job-1-1767846347032 queued for document 1767846254327-4oc29hxnc
[Stage 2] Job analysis-job-1-1767846347032 - Status: RUNNING
[Stage 2] Job analysis-job-1-1767846347032 - Minifying payload...
   [Minification] Token reduction: 86.8% (53120 → 7012 bytes)
   [Minification] Components: 35, Connections: 46, Ghosts filtered: 0
[Stage 2] Job analysis-job-1-1767846347032 - Minification complete in 2ms
[Stage 2] Job analysis-job-1-1767846347032 - Sending to AI (model: gemini-2.5-flash)...
[Stage 2] Job analysis-job-1-1767846347032 - Token budget: 7250 tokens (35 components × 150 + 2000 base, cap: 16384)
[Stage 2] Job analysis-job-1-1767846347032 - Thinking budget: 5548 tokens
[Stage 2] Job analysis-job-1-1767846347032 - AI timeout configured: 180000ms
[Stage 2] Job analysis-job-1-1767846347032 - AI Response received in 14633ms
[Stage 2] Job analysis-job-1-1767846347032 - Response length: 5443 characters
[Stage 2] Job analysis-job-1-1767846347032 - Response preview (first 200 chars): {
  "report_title": "Process Fluid Control and Interlock System Analysis",
  "executive_summary": "This document details a process fluid control system primarily focused on pressure regulation and saf...
[Stage 2] Job analysis-job-1-1767846347032 - Response preview (last 200 chars): ...trumentation, not on air handling or ventilation. Consequently, details regarding outdoor airflow rates, exhaust rates, or fresh air intake strategies are outside the scope of this system's design."
}
[Stage 2] Job analysis-job-1-1767846347032 - JSON parsed successfully
[Stage 2] Job analysis-job-1-1767846347032 - Response validation passed, all required fields present
[Stage 2] Job analysis-job-1-1767846347032 - Status: COMPLETED
[Stage 2] Job analysis-job-1-1767846347032 - Performance: Total=14638ms, AI=14633ms, Minify=2ms, DB=0ms
[Stage 2] Project default - Final report saved



===================================================================================================



Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767846254327-4oc29hxnc","type":"SCHEMATIC","processing_time_ms":92205,"components":35}]

{
  "document_id": "1767846254327-4oc29hxnc",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767846346532,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."
  },
  "processing_time_ms": 92205,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "PG-1005",
        "type": "sensor_pressure",
        "label": "PG 1005",
        "bbox": [
          0.208,
          0.288,
          0.248,
          0.328
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a simple circle shape with the tag 'PG 1005'. According to ISA-5.1, 'P' is Pressure and 'G' is Gauge, indicating a Pressure Gauge. A simple circle with text is classified as an instrument/sensor.",
          "description": "Pressure Gauge",
          "equipment_type": "Pressure Gauge",
          "instrument_function": "Indicator",
          "tag": "PG-1005",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.208,
            0.288,
            0.248,
            0.328
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.520Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.208,
                  0.288,
                  0.248,
                  0.328
                ],
                "normalized_bbox": [
                  0.208,
                  0.288,
                  0.248,
                  0.328
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PG",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "PCV-1004",
        "type": "valve_control",
        "label": "PCV 1004",
        "bbox": [
          0.33,
          0.288,
          0.37,
          0.328
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a bowtie shape with a diaphragm actuator symbol on top, which is the visual signature for a control valve. The tag 'PCV 1004' confirms it's a Pressure Control Valve.",
          "description": "Pressure Control Valve",
          "equipment_type": "Control Valve",
          "tag": "PCV-1004",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.33,
            0.288,
            0.37,
            0.328
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.33,
                  0.288,
                  0.37,
                  0.328
                ],
                "normalized_bbox": [
                  0.33,
                  0.288,
                  0.37,
                  0.328
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "PCV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "Local-Indicator-1.0",
        "type": "instrument_indicator",
        "label": "1.0",
        "bbox": [
          0.39,
          0.29,
          0.42,
          0.32
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a simple rectangular box with a numerical label '1.0', indicating a local indicator or display.",
          "description": "Local Indicator",
          "instrument_function": "Indicator",
          "tag": "1.0",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.39,
            0.29,
            0.42,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.29,
                  0.42,
                  0.32
                ],
                "normalized_bbox": [
                  0.39,
                  0.29,
                  0.42,
                  0.32
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "I",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Indicate",
          "isa_modifier": "Display",
          "isa_confidence": 0.75,
          "isa_reasoning": "Inferred from component type: instrument_indicator"
        }
      },
      {
        "id": "GV-1",
        "type": "valve_gate",
        "label": "GV-001",
        "bbox": [
          0.2,
          0.34,
          0.215,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.2,
            0.34,
            0.215,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.2,
                  0.34,
                  0.215,
                  0.355
                ],
                "normalized_bbox": [
                  0.2,
                  0.34,
                  0.215,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-2",
        "type": "valve_gate",
        "label": "GV-002",
        "bbox": [
          0.25,
          0.34,
          0.265,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.25,
            0.34,
            0.265,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.34,
                  0.265,
                  0.355
                ],
                "normalized_bbox": [
                  0.25,
                  0.34,
                  0.265,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-3",
        "type": "valve_gate",
        "label": "GV-003",
        "bbox": [
          0.32,
          0.34,
          0.335,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.32,
            0.34,
            0.335,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.32,
                  0.34,
                  0.335,
                  0.355
                ],
                "normalized_bbox": [
                  0.32,
                  0.34,
                  0.335,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-4",
        "type": "valve_gate",
        "label": "GV-004",
        "bbox": [
          0.37,
          0.34,
          0.385,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.37,
            0.34,
            0.385,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.37,
                  0.34,
                  0.385,
                  0.355
                ],
                "normalized_bbox": [
                  0.37,
                  0.34,
                  0.385,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "Orifice-Plate-1",
        "type": "flow_restriction_orifice",
        "label": "flow_restriction_orifice",
        "bbox": [
          0.43,
          0.34,
          0.45,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a rectangular shape with a diagonal line, which is the standard symbol for an orifice plate, used for flow measurement or restriction.",
          "description": "Orifice Plate",
          "equipment_type": "Orifice Plate",
          "raw_backend_output": [
            0.43,
            0.34,
            0.45,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.43,
                  0.34,
                  0.45,
                  0.355
                ],
                "normalized_bbox": [
                  0.43,
                  0.34,
                  0.45,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Type-based fallback - no ISA prefix available"
        }
      },
      {
        "id": "CV-1",
        "type": "valve_check",
        "label": "CHV-001",
        "bbox": [
          0.46,
          0.34,
          0.475,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a triangle arrow shape, which is the visual signature for a check valve, preventing backflow.",
          "description": "Check Valve",
          "equipment_type": "Check Valve",
          "raw_backend_output": [
            0.46,
            0.34,
            0.475,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.46,
                  0.34,
                  0.475,
                  0.355
                ],
                "normalized_bbox": [
                  0.46,
                  0.34,
                  0.475,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-5",
        "type": "valve_gate",
        "label": "GV-005",
        "bbox": [
          0.48,
          0.34,
          0.495,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.48,
            0.34,
            0.495,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.34,
                  0.495,
                  0.355
                ],
                "normalized_bbox": [
                  0.48,
                  0.34,
                  0.495,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-6",
        "type": "valve_gate",
        "label": "GV-006",
        "bbox": [
          0.5,
          0.34,
          0.515,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.5,
            0.34,
            0.515,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.34,
                  0.515,
                  0.355
                ],
                "normalized_bbox": [
                  0.5,
                  0.34,
                  0.515,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-7",
        "type": "valve_gate",
        "label": "GV-007",
        "bbox": [
          0.68,
          0.34,
          0.695,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.68,
            0.34,
            0.695,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.68,
                  0.34,
                  0.695,
                  0.355
                ],
                "normalized_bbox": [
                  0.68,
                  0.34,
                  0.695,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-8",
        "type": "valve_gate",
        "label": "GV-008",
        "bbox": [
          0.7,
          0.34,
          0.715,
          0.355
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.7,
            0.34,
            0.715,
            0.355
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.7,
                  0.34,
                  0.715,
                  0.355
                ],
                "normalized_bbox": [
                  0.7,
                  0.34,
                  0.715,
                  0.355
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "Line-Number-Box-011",
        "type": "line_number_box",
        "label": "LN 011",
        "bbox": [
          0.75,
          0.33,
          0.78,
          0.37
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a rectangular box containing line number information.",
          "description": "Line Number Box",
          "tag": "LN-011",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.75,
            0.33,
            0.78,
            0.37
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.75,
                  0.33,
                  0.78,
                  0.37
                ],
                "normalized_bbox": [
                  0.75,
                  0.33,
                  0.78,
                  0.37
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "LN",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "GV-9",
        "type": "valve_gate",
        "label": "GV-009",
        "bbox": [
          0.28,
          0.5,
          0.295,
          0.515
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.28,
            0.5,
            0.295,
            0.515
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.28,
                  0.5,
                  0.295,
                  0.515
                ],
                "normalized_bbox": [
                  0.28,
                  0.5,
                  0.295,
                  0.515
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "SOV_top",
        "type": "valve_solenoid",
        "label": "SOV",
        "bbox": [
          0.29,
          0.45,
          0.33,
          0.49
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a rectangular shape with an internal coil symbol, which is the standard representation for a solenoid valve. The label 'SOV' confirms it is a Solenoid Operated Valve.",
          "description": "Solenoid Operated Valve",
          "equipment_type": "Solenoid Valve",
          "tag": "SOV",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.29,
            0.45,
            0.33,
            0.49
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.45,
                  0.33,
                  0.49
                ],
                "normalized_bbox": [
                  0.29,
                  0.45,
                  0.33,
                  0.49
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "S",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Speed / Frequency Orifice / Restriction Valve / Damper / Actuator"
        }
      },
      {
        "id": "GV-10",
        "type": "valve_gate",
        "label": "GV-010",
        "bbox": [
          0.33,
          0.5,
          0.345,
          0.515
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.33,
            0.5,
            0.345,
            0.515
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.33,
                  0.5,
                  0.345,
                  0.515
                ],
                "normalized_bbox": [
                  0.33,
                  0.5,
                  0.345,
                  0.515
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-11",
        "type": "valve_gate",
        "label": "GV-011",
        "bbox": [
          0.38,
          0.5,
          0.395,
          0.515
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.38,
            0.5,
            0.395,
            0.515
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.38,
                  0.5,
                  0.395,
                  0.515
                ],
                "normalized_bbox": [
                  0.38,
                  0.5,
                  0.395,
                  0.515
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "XHS-1008_top",
        "type": "logic_function",
        "label": "XHS 1008",
        "bbox": [
          0.39,
          0.45,
          0.43,
          0.49
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Unclassified High Switch Logic",
          "instrument_function": "Switch",
          "location": "Panel Mounted",
          "tag": "XHS-1008",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.39,
            0.45,
            0.43,
            0.49
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.45,
                  0.43,
                  0.49
                ],
                "normalized_bbox": [
                  0.39,
                  0.45,
                  0.43,
                  0.49
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "XHS",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "GV-12",
        "type": "valve_gate",
        "label": "GV-012",
        "bbox": [
          0.43,
          0.5,
          0.445,
          0.515
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.43,
            0.5,
            0.445,
            0.515
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.43,
                  0.5,
                  0.445,
                  0.515
                ],
                "normalized_bbox": [
                  0.43,
                  0.5,
                  0.445,
                  0.515
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "HS-1009_left",
        "type": "logic_function",
        "label": "HS 1009",
        "bbox": [
          0.28,
          0.6,
          0.32,
          0.64
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Hand Switch Logic",
          "instrument_function": "Switch",
          "location": "Panel Mounted",
          "tag": "HS-1009",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.28,
            0.6,
            0.32,
            0.64
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.28,
                  0.6,
                  0.32,
                  0.64
                ],
                "normalized_bbox": [
                  0.28,
                  0.6,
                  0.32,
                  0.64
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "HS",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "HS-1008_right",
        "type": "logic_function",
        "label": "HS 1008",
        "bbox": [
          0.49,
          0.6,
          0.53,
          0.64
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Hand Switch Logic",
          "instrument_function": "Switch",
          "location": "Panel Mounted",
          "tag": "HS-1008",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.49,
            0.6,
            0.53,
            0.64
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.6,
                  0.53,
                  0.64
                ],
                "normalized_bbox": [
                  0.49,
                  0.6,
                  0.53,
                  0.64
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "HS",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "GV-13",
        "type": "valve_gate",
        "label": "GV-013",
        "bbox": [
          0.27,
          0.65,
          0.285,
          0.665
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.27,
            0.65,
            0.285,
            0.665
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.27,
                  0.65,
                  0.285,
                  0.665
                ],
                "normalized_bbox": [
                  0.27,
                  0.65,
                  0.285,
                  0.665
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-14",
        "type": "valve_gate",
        "label": "GV-014",
        "bbox": [
          0.32,
          0.65,
          0.335,
          0.665
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.32,
            0.65,
            0.335,
            0.665
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.32,
                  0.65,
                  0.335,
                  0.665
                ],
                "normalized_bbox": [
                  0.32,
                  0.65,
                  0.335,
                  0.665
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-17",
        "type": "valve_gate",
        "label": "GV-015",
        "bbox": [
          0.48,
          0.65,
          0.495,
          0.665
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.48,
            0.65,
            0.495,
            0.665
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.522Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.65,
                  0.495,
                  0.665
                ],
                "normalized_bbox": [
                  0.48,
                  0.65,
                  0.495,
                  0.665
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-18",
        "type": "valve_gate",
        "label": "GV-016",
        "bbox": [
          0.53,
          0.65,
          0.545,
          0.665
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.53,
            0.65,
            0.545,
            0.665
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.522Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.53,
                  0.65,
                  0.545,
                  0.665
                ],
                "normalized_bbox": [
                  0.53,
                  0.65,
                  0.545,
                  0.665
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-15",
        "type": "valve_gate",
        "label": "GV-017",
        "bbox": [
          0.39,
          0.73,
          0.405,
          0.745
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.39,
            0.73,
            0.405,
            0.745
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.73,
                  0.405,
                  0.745
                ],
                "normalized_bbox": [
                  0.39,
                  0.73,
                  0.405,
                  0.745
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "IS-102",
        "type": "logic_function",
        "label": "IS-102",
        "bbox": [
          0.4,
          0.68,
          0.44,
          0.72
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Interlock Switch Logic",
          "instrument_function": "Switch",
          "location": "Panel Mounted",
          "tag": "IS-102",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.4,
            0.68,
            0.44,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.4,
                  0.68,
                  0.44,
                  0.72
                ],
                "normalized_bbox": [
                  0.4,
                  0.68,
                  0.44,
                  0.72
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "IS",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "SOV_bottom",
        "type": "valve_solenoid",
        "label": "SOV-A",
        "bbox": [
          0.29,
          0.76,
          0.33,
          0.8
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified a rectangular shape with an internal coil symbol, which is the standard representation for a solenoid valve. The label 'SOV' confirms it is a Solenoid Operated Valve.",
          "description": "Solenoid Operated Valve",
          "equipment_type": "Solenoid Valve",
          "tag": "SOV",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.29,
            0.76,
            0.33,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.76,
                  0.33,
                  0.8
                ],
                "normalized_bbox": [
                  0.29,
                  0.76,
                  0.33,
                  0.8
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "S",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Speed / Frequency Orifice / Restriction Valve / Damper / Actuator",
          "label_conflict_resolved": true,
          "original_label": "SOV"
        }
      },
      {
        "id": "GV-16",
        "type": "valve_gate",
        "label": "GV-018",
        "bbox": [
          0.44,
          0.73,
          0.455,
          0.745
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.44,
            0.73,
            0.455,
            0.745
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.522Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.73,
                  0.455,
                  0.745
                ],
                "normalized_bbox": [
                  0.44,
                  0.73,
                  0.455,
                  0.745
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-19",
        "type": "valve_gate",
        "label": "GV-019",
        "bbox": [
          0.28,
          0.81,
          0.295,
          0.825
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.28,
            0.81,
            0.295,
            0.825
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.522Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.28,
                  0.81,
                  0.295,
                  0.825
                ],
                "normalized_bbox": [
                  0.28,
                  0.81,
                  0.295,
                  0.825
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-20",
        "type": "valve_gate",
        "label": "GV-020",
        "bbox": [
          0.33,
          0.81,
          0.345,
          0.825
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.33,
            0.81,
            0.345,
            0.825
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.522Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.33,
                  0.81,
                  0.345,
                  0.825
                ],
                "normalized_bbox": [
                  0.33,
                  0.81,
                  0.345,
                  0.825
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "XHS-1009_bottom",
        "type": "logic_function",
        "label": "XHS 1009",
        "bbox": [
          0.39,
          0.84,
          0.43,
          0.88
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as logic_function based on ISA-5.1 symbol recognition.",
          "description": "Unclassified High Switch Logic",
          "instrument_function": "Switch",
          "location": "Panel Mounted",
          "tag": "XHS-1009",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.39,
            0.84,
            0.43,
            0.88
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.521Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.84,
                  0.43,
                  0.88
                ],
                "normalized_bbox": [
                  0.39,
                  0.84,
                  0.43,
                  0.88
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "XHS",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          }
        }
      },
      {
        "id": "GV-21",
        "type": "valve_gate",
        "label": "GV-021",
        "bbox": [
          0.38,
          0.89,
          0.395,
          0.905
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.38,
            0.89,
            0.395,
            0.905
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.522Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.38,
                  0.89,
                  0.395,
                  0.905
                ],
                "normalized_bbox": [
                  0.38,
                  0.89,
                  0.395,
                  0.905
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      },
      {
        "id": "GV-22",
        "type": "valve_gate",
        "label": "GV-022",
        "bbox": [
          0.43,
          0.89,
          0.445,
          0.905
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified an empty bowtie shape, which is the visual signature for a gate valve used for isolation.",
          "description": "Gate Valve",
          "equipment_type": "Gate Valve",
          "raw_backend_output": [
            0.43,
            0.89,
            0.445,
            0.905
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:25:46.522Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.43,
                  0.89,
                  0.445,
                  0.905
                ],
                "normalized_bbox": [
                  0.43,
                  0.89,
                  0.445,
                  0.905
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "U",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Multivariable Control Station (Manual/Auto) Orifice / Restriction Well / Probe",
          "label_generated": true,
          "label_generation_reason": "Auto-generated from component type and sequential numbering",
          "original_label": "unknown"
        }
      }
    ],
    "connections": [
      {
        "id": "1767846346522-5usn42jbx",
        "from_id": "GV-1",
        "to_id": "PG-1005",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "sensor_pressure",
          "from_label": "unknown",
          "to_label": "PG 1005"
        }
      },
      {
        "id": "1767846346522-3rm5qqv2m",
        "from_id": "PG-1005",
        "to_id": "GV-2",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "electric_signal",
          "type_confidence": 0.7,
          "type_reasoning": "Close proximity signal components",
          "from_component_type": "sensor_pressure",
          "to_component_type": "valve_gate",
          "from_label": "PG 1005",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-jfuk4tcrg",
        "from_id": "GV-2",
        "to_id": "GV-3",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.85,
          "type_reasoning": "Series gate valves on process line",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_gate",
          "from_label": "unknown",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-j7p9wdv49",
        "from_id": "GV-3",
        "to_id": "PCV-1004",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.86,
          "type_reasoning": "Isolation gate valve upstream of control valve",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_control",
          "from_label": "unknown",
          "to_label": "PCV 1004",
          "original_type": "unknown",
          "corrected": true,
          "correction_reasoning": "Isolation gate valve upstream of control valve"
        }
      },
      {
        "id": "1767846346522-2hjchsq71",
        "from_id": "PCV-1004",
        "to_id": "GV-4",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.86,
          "type_reasoning": "Control valve to isolation gate valve",
          "from_component_type": "valve_control",
          "to_component_type": "valve_gate",
          "from_label": "PCV 1004",
          "to_label": "unknown",
          "original_type": "unknown",
          "corrected": true,
          "correction_reasoning": "Control valve to isolation gate valve"
        }
      },
      {
        "id": "1767846346522-vnrawstsp",
        "from_id": "GV-4",
        "to_id": "Orifice-Plate-1",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "flow_restriction_orifice",
          "from_label": "unknown",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-m2a4iakwa",
        "from_id": "Orifice-Plate-1",
        "to_id": "CV-1",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "flow_restriction_orifice",
          "to_component_type": "valve_check",
          "from_label": "unknown",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-px7s9gwjm",
        "from_id": "CV-1",
        "to_id": "GV-5",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_check",
          "to_component_type": "valve_gate",
          "from_label": "unknown",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-5gcoeygsn",
        "from_id": "GV-5",
        "to_id": "GV-6",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.85,
          "type_reasoning": "Series gate valves on process line",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_gate",
          "from_label": "unknown",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-1tlzf3hhf",
        "from_id": "GV-6",
        "to_id": "GV-7",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.85,
          "type_reasoning": "Series gate valves on process line",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_gate",
          "from_label": "unknown",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-b6lv6k1uv",
        "from_id": "GV-7",
        "to_id": "Line-Number-Box-011",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "line_number_box",
          "from_label": "unknown",
          "to_label": "LN 011"
        }
      },
      {
        "id": "1767846346522-edkeyzavz",
        "from_id": "Line-Number-Box-011",
        "to_id": "GV-8",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "line_number_box",
          "to_component_type": "valve_gate",
          "from_label": "LN 011",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-ah0x6qbdk",
        "from_id": "PCV-1004",
        "to_id": "Local-Indicator-1.0",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "instrument_indicator",
          "from_label": "PCV 1004",
          "to_label": "1.0"
        }
      },
      {
        "id": "1767846346522-uss1xdsb4",
        "from_id": "GV-9",
        "to_id": "SOV_top",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_solenoid",
          "from_label": "unknown",
          "to_label": "SOV"
        }
      },
      {
        "id": "1767846346522-puf2g6i5d",
        "from_id": "SOV_top",
        "to_id": "GV-10",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_solenoid",
          "to_component_type": "valve_gate",
          "from_label": "SOV",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-v2352sdlp",
        "from_id": "GV-10",
        "to_id": "GV-11",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.85,
          "type_reasoning": "Series gate valves on process line",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_gate",
          "from_label": "unknown",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-so0316f9q",
        "from_id": "GV-11",
        "to_id": "XHS-1008_top",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "logic_function",
          "from_label": "unknown",
          "to_label": "XHS 1008"
        }
      },
      {
        "id": "1767846346522-3e2082h4y",
        "from_id": "XHS-1008_top",
        "to_id": "GV-12",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "valve_gate",
          "from_label": "XHS 1008",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-bg6ut932u",
        "from_id": "GV-13",
        "to_id": "HS-1009_left",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "logic_function",
          "from_label": "unknown",
          "to_label": "HS 1009"
        }
      },
      {
        "id": "1767846346522-njphpdmr1",
        "from_id": "HS-1009_left",
        "to_id": "GV-14",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "valve_gate",
          "from_label": "HS 1009",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-hkemwy38u",
        "from_id": "GV-15",
        "to_id": "IS-102",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "logic_function",
          "from_label": "unknown",
          "to_label": "IS-102"
        }
      },
      {
        "id": "1767846346522-r7xcemmn5",
        "from_id": "IS-102",
        "to_id": "GV-16",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "valve_gate",
          "from_label": "IS-102",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-0yhaqx50f",
        "from_id": "GV-17",
        "to_id": "HS-1008_right",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "logic_function",
          "from_label": "unknown",
          "to_label": "HS 1008"
        }
      },
      {
        "id": "1767846346522-cc3voevtk",
        "from_id": "HS-1008_right",
        "to_id": "GV-18",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "valve_gate",
          "from_label": "HS 1008",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-8wpg9taxr",
        "from_id": "GV-19",
        "to_id": "SOV_bottom",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_solenoid",
          "from_label": "unknown",
          "to_label": "SOV"
        }
      },
      {
        "id": "1767846346522-pjtrwrq58",
        "from_id": "SOV_bottom",
        "to_id": "GV-20",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_solenoid",
          "to_component_type": "valve_gate",
          "from_label": "SOV",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-z8epctyzo",
        "from_id": "GV-20",
        "to_id": "GV-21",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.85,
          "type_reasoning": "Series gate valves on process line",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_gate",
          "from_label": "unknown",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-0feg674bp",
        "from_id": "GV-21",
        "to_id": "XHS-1009_bottom",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "logic_function",
          "from_label": "unknown",
          "to_label": "XHS 1009"
        }
      },
      {
        "id": "1767846346522-lk4prnr1e",
        "from_id": "XHS-1009_bottom",
        "to_id": "GV-22",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "valve_gate",
          "from_label": "XHS 1009",
          "to_label": "unknown"
        }
      },
      {
        "id": "1767846346522-m5yg7ae44",
        "from_id": "XHS-1008_top",
        "to_id": "IS-102",
        "type": "signal",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "logic_function",
          "from_label": "XHS 1008",
          "to_label": "IS-102"
        }
      },
      {
        "id": "1767846346522-v5m32b1v5",
        "from_id": "HS-1009_left",
        "to_id": "IS-102",
        "type": "signal",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "logic_function",
          "from_label": "HS 1009",
          "to_label": "IS-102"
        }
      },
      {
        "id": "1767846346522-xoiy4d8g8",
        "from_id": "HS-1008_right",
        "to_id": "IS-102",
        "type": "signal",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "logic_function",
          "from_label": "HS 1008",
          "to_label": "IS-102"
        }
      },
      {
        "id": "1767846346522-idr88uzgo",
        "from_id": "IS-102",
        "to_id": "SOV_top",
        "type": "signal",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "valve_solenoid",
          "from_label": "IS-102",
          "to_label": "SOV"
        }
      },
      {
        "id": "1767846346522-j07nikiyn",
        "from_id": "IS-102",
        "to_id": "SOV_bottom",
        "type": "signal",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "valve_solenoid",
          "from_label": "IS-102",
          "to_label": "SOV"
        }
      },
      {
        "id": "1767846346522-czu0ikx6e",
        "from_id": "XHS-1009_bottom",
        "to_id": "IS-102",
        "type": "signal",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "logic_function",
          "to_component_type": "logic_function",
          "from_label": "XHS 1009",
          "to_label": "IS-102"
        }
      },
      {
        "id": "inferred-path-GV-1-GV-2",
        "from_id": "GV-1",
        "to_id": "GV-2",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.04999999999999999,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-3-GV-4",
        "from_id": "GV-3",
        "to_id": "GV-4",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.04999999999999999,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-6-CV-1",
        "from_id": "GV-6",
        "to_id": "CV-1",
        "type": "process_flow",
        "confidence": 0.748,
        "reasoning": "Path-traced: Gate valve upstream of check valve",
        "inferred": true,
        "meta": {
          "distance": 0.040000000000000036,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-7-GV-8",
        "from_id": "GV-7",
        "to_id": "GV-8",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.020000000000000018,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-9-GV-10",
        "from_id": "GV-9",
        "to_id": "GV-10",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.050000000000000044,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-11-GV-12",
        "from_id": "GV-11",
        "to_id": "GV-12",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.04999999999999999,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-13-GV-14",
        "from_id": "GV-13",
        "to_id": "GV-14",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.050000000000000044,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-15-GV-16",
        "from_id": "GV-15",
        "to_id": "GV-16",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.04999999999999999,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-17-GV-18",
        "from_id": "GV-17",
        "to_id": "GV-18",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.0500000000000001,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-19-GV-20",
        "from_id": "GV-19",
        "to_id": "GV-20",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.050000000000000044,
          "method": "path_tracing"
        }
      },
      {
        "id": "inferred-path-GV-21-GV-22",
        "from_id": "GV-21",
        "to_id": "GV-22",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Series gate valves on process line",
        "inferred": true,
        "meta": {
          "distance": 0.04999999999999999,
          "method": "path_tracing"
        }
      }
    ],
    "metadata": {
      "total_components": 35,
      "total_connections": 35,
      "process_log": "Detected 32 components including pressure gauges, control valves, solenoid valves, gate valves, check valves, orifice plates, and logic functions. Identified a safety interlock control loop centered around IS-102.",
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "shape_validation_enabled": true,
        "shape_violations_corrected": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 35,
        "isa_detection_rate": 1,
        "connection_inference_enabled": true,
        "inferred_connections": 11,
        "validation_enabled": true,
        "validation_issues": 7,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 6
      },
      "control_loops": [],
      "validation_issues": [
        {
          "connection": {
            "id": "1767846346522-jfuk4tcrg",
            "from_id": "GV-2",
            "to_id": "GV-3",
            "type": "unknown",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.85,
              "type_reasoning": "Series gate valves on process line",
              "from_component_type": "valve_gate",
              "to_component_type": "valve_gate",
              "from_label": "unknown",
              "to_label": "unknown"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got unknown",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767846346522-j7p9wdv49",
            "from_id": "GV-3",
            "to_id": "PCV-1004",
            "type": "unknown",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.86,
              "type_reasoning": "Isolation gate valve upstream of control valve",
              "from_component_type": "valve_gate",
              "to_component_type": "valve_control",
              "from_label": "unknown",
              "to_label": "PCV 1004"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got unknown",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767846346522-2hjchsq71",
            "from_id": "PCV-1004",
            "to_id": "GV-4",
            "type": "unknown",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.86,
              "type_reasoning": "Control valve to isolation gate valve",
              "from_component_type": "valve_control",
              "to_component_type": "valve_gate",
              "from_label": "PCV 1004",
              "to_label": "unknown"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got unknown",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767846346522-5gcoeygsn",
            "from_id": "GV-5",
            "to_id": "GV-6",
            "type": "unknown",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.85,
              "type_reasoning": "Series gate valves on process line",
              "from_component_type": "valve_gate",
              "to_component_type": "valve_gate",
              "from_label": "unknown",
              "to_label": "unknown"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got unknown",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767846346522-1tlzf3hhf",
            "from_id": "GV-6",
            "to_id": "GV-7",
            "type": "unknown",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.85,
              "type_reasoning": "Series gate valves on process line",
              "from_component_type": "valve_gate",
              "to_component_type": "valve_gate",
              "from_label": "unknown",
              "to_label": "unknown"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got unknown",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767846346522-v2352sdlp",
            "from_id": "GV-10",
            "to_id": "GV-11",
            "type": "unknown",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.85,
              "type_reasoning": "Series gate valves on process line",
              "from_component_type": "valve_gate",
              "to_component_type": "valve_gate",
              "from_label": "unknown",
              "to_label": "unknown"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got unknown",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767846346522-z8epctyzo",
            "from_id": "GV-20",
            "to_id": "GV-21",
            "type": "unknown",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.85,
              "type_reasoning": "Series gate valves on process line",
              "from_component_type": "valve_gate",
              "to_component_type": "valve_gate",
              "from_label": "unknown",
              "to_label": "unknown"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got unknown",
          "severity": "warning"
        }
      ],
      "quality_metrics": {
        "overall_score": 0.9871428571428571,
        "detection_quality": 1,
        "isa_completeness": 1,
        "connection_coverage": 1,
        "confidence_avg": 0.9571428571428572,
        "metrics": {
          "total_components": 35,
          "total_connections": 46,
          "isa_functions_detected": 35,
          "excellent_detections": 35,
          "avg_confidence": 0.9571428571428572
        }
      },
      "label_generation": {
        "generated_count": 24,
        "conflicts_resolved": 1
      }
    }
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...

[Stage 2 Complete] Final analysis report generated successfully.



========================================================================================


index.ts:34 Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."}]
index.ts:34 Step 2: Routing to pipeline...
index.ts:34 ["Selected pipeline:","visual"]
index.ts:34 Step 3: Executing pipeline...
visual.ts:82 Detecting blueprint type (P&ID vs HVAC)...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
visual.ts:84 Blueprint type detected: PID
visual.ts:409 [Visual Pipeline] Image dimensions: 1058x771px, tiling: NO (threshold: 2000px)
visual.ts:95 Using standard single-pass analysis
visual.ts:100 [Visual Pipeline] Applying enhancements...
visual-enhancements.ts:44 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:51 [Enhancement] Normalizing component and connection types...
12type-normalization.ts:163  [Type Normalization] Unknown connection type: "process_connection", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:163
type-normalization.ts:163  [Type Normalization] Unknown connection type: "pneumatic_signal", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:163
16type-normalization.ts:163  [Type Normalization] Unknown connection type: "process_connection", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:163
visual-enhancements.ts:54 [Enhancement] Type normalization complete
visual-enhancements.ts:59 [Enhancement] Applying spatial association to merge orphaned labels...
spatial-association.ts:330 [Spatial Association] Starting spatial association post-processing...
spatial-association.ts:196 [Spatial Association] Starting orphaned label detection...
spatial-association.ts:213 [Spatial Association] Found 0 orphaned labels, 24 unlabeled components, 11 already labeled
spatial-association.ts:220 [Spatial Association] No merging needed
spatial-association.ts:341 [Spatial Association] Post-processing complete in 1ms: 35 → 35 components (0 merged)
visual-enhancements.ts:68 [Enhancement] Spatial association complete: 0 orphaned labels merged, 35 total components remain
visual-enhancements.ts:77 [Enhancement] Applying strict geometric shape validation...
shape-validator.ts:544 [Shape Validator] Starting shape validation...
shape-validator.ts:578 [Shape Validator] All components passed shape validation
shape-validator.ts:595 [Shape Validator] Validation complete: 0/35 validated, 0 corrected
visual-enhancements.ts:80 [Enhancement] Shape validation complete: 0 components corrected
visual-enhancements.ts:87 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:92 [Enhancement] ISA detection complete: 35/35 components have ISA functions (100%)
visual-enhancements.ts:100 [Enhancement] Enhancing connections...
visual-enhancements.ts:106 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:115 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:124 [Enhancement] Discovered 11 additional connections via path tracing
visual-enhancements.ts:132 [Enhancement] Validating connections...
visual-enhancements.ts:138  [Enhancement] Connection validation found 7 issues (0 errors, 7 warnings)
enhanceVisualAnalysis @ visual-enhancements.ts:138
visual-enhancements.ts:144 [Enhancement] Auto-correcting connection type mismatches...
connection-engine.ts:969  Correcting connection type: 1767846346522-j7p9wdv49 from 'unknown' to 'process_flow'
(anonymous) @ connection-engine.ts:969
connection-engine.ts:969  Correcting connection type: 1767846346522-2hjchsq71 from 'unknown' to 'process_flow'
(anonymous) @ connection-engine.ts:969
visual-enhancements.ts:152 [Enhancement] Detecting control loops...
visual-enhancements.ts:154 [Enhancement] Detected 0 control loops
visual-enhancements.ts:158 [Enhancement] Post-processing complete in 6ms
visual.ts:111 [Visual Pipeline] Generating intelligent labels for unlabeled components...
label-generator.ts:89 [Label Generator] Generating labels for 24 components
label-generator.ts:170 [Label Generator] Generated 24 new labels
visual.ts:115 [Visual Pipeline] Label generation: 24 components labeled
visual.ts:120  [Visual Pipeline] Label conflicts detected: 1 duplicates
analyzeVisual @ visual.ts:120
visual.ts:122 [Visual Pipeline] Label conflicts resolved
visual.ts:127 [Visual Pipeline] Quality Score: 0.99
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767846254327-4oc29hxnc","type":"SCHEMATIC","processing_time_ms":92205,"components":35}]
BlueprintWorkspace.tsx:258 Stage 1 (Visual Analysis) complete: Objectcache_hit: falseclassification: {type: 'SCHEMATIC', confidence: 1, reasoning: 'The document clearly displays numerous instrumenta…, which falls under the SCHEMATIC classification.'}document_id: "1767846254327-4oc29hxnc"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 92205timestamp: 1767846346532visual: components: Array(35)0: {id: 'PG-1005', type: 'sensor_pressure', label: 'PG 1005', bbox: Array(4), confidence: 0.98, …}1: {id: 'PCV-1004', type: 'valve_control', label: 'PCV 1004', bbox: Array(4), confidence: 0.98, …}2: {id: 'Local-Indicator-1.0', type: 'instrument_indicator', label: '1.0', bbox: Array(4), confidence: 0.9, …}3: {id: 'GV-1', type: 'valve_gate', label: 'GV-001', bbox: Array(4), confidence: 0.95, …}4: {id: 'GV-2', type: 'valve_gate', label: 'GV-002', bbox: Array(4), confidence: 0.95, …}5: {id: 'GV-3', type: 'valve_gate', label: 'GV-003', bbox: Array(4), confidence: 0.95, …}6: {id: 'GV-4', type: 'valve_gate', label: 'GV-004', bbox: Array(4), confidence: 0.95, …}7: {id: 'Orifice-Plate-1', type: 'flow_restriction_orifice', label: 'flow_restriction_orifice', bbox: Array(4), confidence: 0.95, …}8: {id: 'CV-1', type: 'valve_check', label: 'CHV-001', bbox: Array(4), confidence: 0.95, …}9: {id: 'GV-5', type: 'valve_gate', label: 'GV-005', bbox: Array(4), confidence: 0.95, …}10: {id: 'GV-6', type: 'valve_gate', label: 'GV-006', bbox: Array(4), confidence: 0.95, …}11: {id: 'GV-7', type: 'valve_gate', label: 'GV-007', bbox: Array(4), confidence: 0.95, …}12: {id: 'GV-8', type: 'valve_gate', label: 'GV-008', bbox: Array(4), confidence: 0.95, …}13: {id: 'Line-Number-Box-011', type: 'line_number_box', label: 'LN 011', bbox: Array(4), confidence: 0.98, …}14: {id: 'GV-9', type: 'valve_gate', label: 'GV-009', bbox: Array(4), confidence: 0.95, …}15: {id: 'SOV_top', type: 'valve_solenoid', label: 'SOV', bbox: Array(4), confidence: 0.98, …}16: {id: 'GV-10', type: 'valve_gate', label: 'GV-010', bbox: Array(4), confidence: 0.95, …}17: {id: 'GV-11', type: 'valve_gate', label: 'GV-011', bbox: Array(4), confidence: 0.95, …}18: {id: 'XHS-1008_top', type: 'logic_function', label: 'XHS 1008', bbox: Array(4), confidence: 0.98, …}19: {id: 'GV-12', type: 'valve_gate', label: 'GV-012', bbox: Array(4), confidence: 0.95, …}20: {id: 'HS-1009_left', type: 'logic_function', label: 'HS 1009', bbox: Array(4), confidence: 0.98, …}21: {id: 'HS-1008_right', type: 'logic_function', label: 'HS 1008', bbox: Array(4), confidence: 0.98, …}22: {id: 'GV-13', type: 'valve_gate', label: 'GV-013', bbox: Array(4), confidence: 0.95, …}23: {id: 'GV-14', type: 'valve_gate', label: 'GV-014', bbox: Array(4), confidence: 0.95, …}24: {id: 'GV-17', type: 'valve_gate', label: 'GV-015', bbox: Array(4), confidence: 0.95, …}25: {id: 'GV-18', type: 'valve_gate', label: 'GV-016', bbox: Array(4), confidence: 0.95, …}26: {id: 'GV-15', type: 'valve_gate', label: 'GV-017', bbox: Array(4), confidence: 0.95, …}27: {id: 'IS-102', type: 'logic_function', label: 'IS-102', bbox: Array(4), confidence: 0.98, …}28: {id: 'SOV_bottom', type: 'valve_solenoid', label: 'SOV-A', bbox: Array(4), confidence: 0.98, …}29: {id: 'GV-16', type: 'valve_gate', label: 'GV-018', bbox: Array(4), confidence: 0.95, …}30: {id: 'GV-19', type: 'valve_gate', label: 'GV-019', bbox: Array(4), confidence: 0.95, …}31: {id: 'GV-20', type: 'valve_gate', label: 'GV-020', bbox: Array(4), confidence: 0.95, …}32: {id: 'XHS-1009_bottom', type: 'logic_function', label: 'XHS 1009', bbox: Array(4), confidence: 0.98, …}33: {id: 'GV-21', type: 'valve_gate', label: 'GV-021', bbox: Array(4), confidence: 0.95, …}34: {id: 'GV-22', type: 'valve_gate', label: 'GV-022', bbox: Array(4), confidence: 0.95, …}length: 35[[Prototype]]: Array(0)connections: Array(46)0: {id: '1767846346522-5usn42jbx', from_id: 'GV-1', to_id: 'PG-1005', type: 'unknown', confidence: 0.95, …}1: {id: '1767846346522-3rm5qqv2m', from_id: 'PG-1005', to_id: 'GV-2', type: 'unknown', confidence: 0.95, …}2: {id: '1767846346522-jfuk4tcrg', from_id: 'GV-2', to_id: 'GV-3', type: 'unknown', confidence: 0.95, …}3: {id: '1767846346522-j7p9wdv49', from_id: 'GV-3', to_id: 'PCV-1004', type: 'process_flow', confidence: 0.95, …}4: {id: '1767846346522-2hjchsq71', from_id: 'PCV-1004', to_id: 'GV-4', type: 'process_flow', confidence: 0.95, …}5: {id: '1767846346522-vnrawstsp', from_id: 'GV-4', to_id: 'Orifice-Plate-1', type: 'unknown', confidence: 0.95, …}6: {id: '1767846346522-m2a4iakwa', from_id: 'Orifice-Plate-1', to_id: 'CV-1', type: 'unknown', confidence: 0.95, …}7: {id: '1767846346522-px7s9gwjm', from_id: 'CV-1', to_id: 'GV-5', type: 'unknown', confidence: 0.95, …}8: {id: '1767846346522-5gcoeygsn', from_id: 'GV-5', to_id: 'GV-6', type: 'unknown', confidence: 0.95, …}9: {id: '1767846346522-1tlzf3hhf', from_id: 'GV-6', to_id: 'GV-7', type: 'unknown', confidence: 0.95, …}10: {id: '1767846346522-b6lv6k1uv', from_id: 'GV-7', to_id: 'Line-Number-Box-011', type: 'unknown', confidence: 0.95, …}11: {id: '1767846346522-edkeyzavz', from_id: 'Line-Number-Box-011', to_id: 'GV-8', type: 'unknown', confidence: 0.95, …}12: {id: '1767846346522-ah0x6qbdk', from_id: 'PCV-1004', to_id: 'Local-Indicator-1.0', type: 'unknown', confidence: 0.95, …}13: {id: '1767846346522-uss1xdsb4', from_id: 'GV-9', to_id: 'SOV_top', type: 'unknown', confidence: 0.95, …}14: {id: '1767846346522-puf2g6i5d', from_id: 'SOV_top', to_id: 'GV-10', type: 'unknown', confidence: 0.95, …}15: {id: '1767846346522-v2352sdlp', from_id: 'GV-10', to_id: 'GV-11', type: 'unknown', confidence: 0.95, …}16: {id: '1767846346522-so0316f9q', from_id: 'GV-11', to_id: 'XHS-1008_top', type: 'unknown', confidence: 0.95, …}17: {id: '1767846346522-3e2082h4y', from_id: 'XHS-1008_top', to_id: 'GV-12', type: 'unknown', confidence: 0.95, …}18: {id: '1767846346522-bg6ut932u', from_id: 'GV-13', to_id: 'HS-1009_left', type: 'unknown', confidence: 0.95, …}19: {id: '1767846346522-njphpdmr1', from_id: 'HS-1009_left', to_id: 'GV-14', type: 'unknown', confidence: 0.95, …}20: {id: '1767846346522-hkemwy38u', from_id: 'GV-15', to_id: 'IS-102', type: 'unknown', confidence: 0.95, …}21: {id: '1767846346522-r7xcemmn5', from_id: 'IS-102', to_id: 'GV-16', type: 'unknown', confidence: 0.95, …}22: {id: '1767846346522-0yhaqx50f', from_id: 'GV-17', to_id: 'HS-1008_right', type: 'unknown', confidence: 0.95, …}23: {id: '1767846346522-cc3voevtk', from_id: 'HS-1008_right', to_id: 'GV-18', type: 'unknown', confidence: 0.95, …}24: {id: '1767846346522-8wpg9taxr', from_id: 'GV-19', to_id: 'SOV_bottom', type: 'unknown', confidence: 0.95, …}25: {id: '1767846346522-pjtrwrq58', from_id: 'SOV_bottom', to_id: 'GV-20', type: 'unknown', confidence: 0.95, …}26: {id: '1767846346522-z8epctyzo', from_id: 'GV-20', to_id: 'GV-21', type: 'unknown', confidence: 0.95, …}27: {id: '1767846346522-0feg674bp', from_id: 'GV-21', to_id: 'XHS-1009_bottom', type: 'unknown', confidence: 0.95, …}28: {id: '1767846346522-lk4prnr1e', from_id: 'XHS-1009_bottom', to_id: 'GV-22', type: 'unknown', confidence: 0.95, …}29: {id: '1767846346522-m5yg7ae44', from_id: 'XHS-1008_top', to_id: 'IS-102', type: 'signal', confidence: 0.95, …}30: {id: '1767846346522-v5m32b1v5', from_id: 'HS-1009_left', to_id: 'IS-102', type: 'signal', confidence: 0.95, …}31: {id: '1767846346522-xoiy4d8g8', from_id: 'HS-1008_right', to_id: 'IS-102', type: 'signal', confidence: 0.95, …}32: {id: '1767846346522-idr88uzgo', from_id: 'IS-102', to_id: 'SOV_top', type: 'signal', confidence: 0.95, …}33: {id: '1767846346522-j07nikiyn', from_id: 'IS-102', to_id: 'SOV_bottom', type: 'signal', confidence: 0.95, …}34: {id: '1767846346522-czu0ikx6e', from_id: 'XHS-1009_bottom', to_id: 'IS-102', type: 'signal', confidence: 0.95, …}35: {id: 'inferred-path-GV-1-GV-2', from_id: 'GV-1', to_id: 'GV-2', type: 'process_flow', confidence: 0.7224999999999999, …}36: {id: 'inferred-path-GV-3-GV-4', from_id: 'GV-3', to_id: 'GV-4', type: 'process_flow', confidence: 0.7224999999999999, …}37: {id: 'inferred-path-GV-6-CV-1', from_id: 'GV-6', to_id: 'CV-1', type: 'process_flow', confidence: 0.748, …}38: {id: 'inferred-path-GV-7-GV-8', from_id: 'GV-7', to_id: 'GV-8', type: 'process_flow', confidence: 0.7224999999999999, …}39: {id: 'inferred-path-GV-9-GV-10', from_id: 'GV-9', to_id: 'GV-10', type: 'process_flow', confidence: 0.7224999999999999, …}40: {id: 'inferred-path-GV-11-GV-12', from_id: 'GV-11', to_id: 'GV-12', type: 'process_flow', confidence: 0.7224999999999999, …}41: {id: 'inferred-path-GV-13-GV-14', from_id: 'GV-13', to_id: 'GV-14', type: 'process_flow', confidence: 0.7224999999999999, …}42: {id: 'inferred-path-GV-15-GV-16', from_id: 'GV-15', to_id: 'GV-16', type: 'process_flow', confidence: 0.7224999999999999, …}43: {id: 'inferred-path-GV-17-GV-18', from_id: 'GV-17', to_id: 'GV-18', type: 'process_flow', confidence: 0.7224999999999999, …}44: {id: 'inferred-path-GV-19-GV-20', from_id: 'GV-19', to_id: 'GV-20', type: 'process_flow', confidence: 0.7224999999999999, …}45: {id: 'inferred-path-GV-21-GV-22', from_id: 'GV-21', to_id: 'GV-22', type: 'process_flow', confidence: 0.7224999999999999, …}length: 46[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 6inferred_connections: 11isa_detection_enabled: trueisa_detection_rate: 1isa_functions_detected: 35loop_detection_enabled: trueorphaned_labels_merged: 0shape_validation_enabled: trueshape_violations_corrected: 0spatial_association_enabled: truevalidation_enabled: truevalidation_issues: 7[[Prototype]]: Objectlabel_generation: conflicts_resolved: 1generated_count: 24[[Prototype]]: Objectprocess_log: "Detected 32 components including pressure gauges, control valves, solenoid valves, gate valves, check valves, orifice plates, and logic functions. Identified a safety interlock control loop centered around IS-102."quality_metrics: confidence_avg: 0.9571428571428572connection_coverage: 1detection_quality: 1isa_completeness: 1metrics: avg_confidence: 0.9571428571428572excellent_detections: 35isa_functions_detected: 35total_components: 35total_connections: 46[[Prototype]]: Objectoverall_score: 0.9871428571428571[[Prototype]]: Objecttotal_components: 35total_connections: 35validation_issues: Array(7)0: {connection: {…}, issue: 'Connection type mismatch: expected process_flow, got unknown', severity: 'warning'}1: {connection: {…}, issue: 'Connection type mismatch: expected process_flow, got unknown', severity: 'warning'}2: {connection: {…}, issue: 'Connection type mismatch: expected process_flow, got unknown', severity: 'warning'}3: {connection: {…}, issue: 'Connection type mismatch: expected process_flow, got unknown', severity: 'warning'}4: {connection: {…}, issue: 'Connection type mismatch: expected process_flow, got unknown', severity: 'warning'}5: {connection: {…}, issue: 'Connection type mismatch: expected process_flow, got unknown', severity: 'warning'}6: {connection: {…}, issue: 'Connection type mismatch: expected process_flow, got unknown', severity: 'warning'}length: 7[[Prototype]]: Array(0)[[Prototype]]: Object[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:295 [Stage 2] Starting background analysis...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:316 [Stage 2] Background job queued: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:295 [Stage 2] Queuing background analysis on server...
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767846346635
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: completed
BlueprintWorkspace.tsx:146 [Polling] Project completed! Setting final analysis report
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll