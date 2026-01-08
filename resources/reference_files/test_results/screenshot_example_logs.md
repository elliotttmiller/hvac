[INFO] ======================================================================
[INFO] HVAC AI Platform - Startup Script v2.0
[INFO] ======================================================================
[INFO] Started: 2026-01-08 04:49:48 UTC
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

[dotenv@17.2.3] injecting env (33) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
✅ AI Proxy Initialized. Model: gemini-2.5-flash

  VITE v6.4.1  ready in 646 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.0.163:3000/
  ➜  Network: http://172.20.32.1:3000/
  ➜  press h + enter to show help

Server running at http://localhost:4000
Data Root: D:\AMD\secrets\hvac\extra\hvac\server\data
AI Provider: gemini (Active)
Mock Mode: DISABLED (live AI inference)
AI Vision Request -> model=gemini-2.5-flash imageSize=79320 mimeType=image/png responseMimeType=unset
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: PID
AI Vision Request -> model=gemini-2.5-flash imageSize=79320 mimeType=image/png responseMimeType=application/json
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: {
  "components": [
    {
      "id": "D_1162",
      "label": "D 1162",
      "type": "equipment_vessel",
      "bbox": [0.25, 0.0, 0.35, 0.25],
      "confidence": 0.95,
      "meta": {
        "rea...
[Stage 2] Job analysis-job-1-1767847977899 queued for document 1767847924716-7fhieu3hk
[Stage 2] Job analysis-job-1-1767847977899 - Status: RUNNING
[Stage 2] Job analysis-job-1-1767847977899 - Minifying payload...
   [Minification] Token reduction: 85.3% (24945 → 3672 bytes)
   [Minification] Components: 17, Connections: 15, Ghosts filtered: 0
[Stage 2] Job analysis-job-1-1767847977899 - Minification complete in 1ms
[Stage 2] Job analysis-job-1-1767847977899 - Sending to AI (model: gemini-2.5-flash)...
[Stage 2] Job analysis-job-1-1767847977899 - Token budget: 4550 tokens (17 components × 150 + 2000 base, cap: 16384)
[Stage 2] Job analysis-job-1-1767847977899 - Thinking budget: 3748 tokens
[Stage 2] Job analysis-job-1-1767847977899 - AI timeout configured: 180000ms
[Stage 2] Job analysis-job-1-1767847977899 - AI Response received in 16445ms
[Stage 2] Job analysis-job-1-1767847977899 - Response length: 5617 characters
[Stage 2] Job analysis-job-1-1767847977899 - Response preview (first 200 chars): {
  "report_title": "Process Fluid Transfer and Storage System Analysis",
  "executive_summary": "This report details a process fluid transfer and storage system, designed to move liquid from a primar...
[Stage 2] Job analysis-job-1-1767847977899 - Response preview (last 200 chars): ...irflow rates, exhaust strategies, or fresh air intake. Such considerations would be addressed in separate HVAC system drawings or specifications, as they are outside the scope of this process P&ID."
}
[Stage 2] Job analysis-job-1-1767847977899 - JSON parsed successfully
[Stage 2] Job analysis-job-1-1767847977899 - Response validation passed, all required fields present
[Stage 2] Job analysis-job-1-1767847977899 - Status: COMPLETED
[Stage 2] Job analysis-job-1-1767847977899 - Performance: Total=16449ms, AI=16445ms, Minify=1ms, DB=0ms
[Stage 2] Project default - Final report saved



==================================================


Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767847924716-7fhieu3hk","type":"SCHEMATIC","processing_time_ms":52763,"components":17}]

{
  "document_id": "1767847924716-7fhieu3hk",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767847977479,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."
  },
  "processing_time_ms": 52763,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "D_1162",
        "type": "equipment_vessel",
        "label": "D 1162",
        "bbox": [
          0.25,
          0,
          0.35,
          0.25
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a vertical cylindrical vessel with internal components, clearly labeled 'D 1162'.",
          "description": "Drum/Vessel 1162",
          "equipment_type": "vessel",
          "tag": "D 1162",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.25,
            0,
            0.35,
            0.25
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.470Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0,
                  0.35,
                  0.25
                ],
                "normalized_bbox": [
                  0.25,
                  0,
                  0.35,
                  0.25
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "D",
          "detection_quality": "excellent",
          "parent_category": "process_equipment",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "User's Choice (Usually Density)"
        }
      },
      {
        "id": "LI_1653",
        "type": "sensor_level",
        "label": "LI 1653",
        "bbox": [
          0.38,
          0.1,
          0.42,
          0.14
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected as a simple circle with ISA tag 'LI', indicating a field-mounted Level Indicator. The shape-first rule confirms it's an instrument.",
          "description": "Level Indicator 1653",
          "instrument_function": "indicator",
          "location": "field_mounted",
          "tag": "LI 1653",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.38,
            0.1,
            0.42,
            0.14
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.38,
                  0.1,
                  0.42,
                  0.14
                ],
                "normalized_bbox": [
                  0.38,
                  0.1,
                  0.42,
                  0.14
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "measured_variable": "level",
          "instrument_type": "LI",
          "parent_category": "instruments",
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "L",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_confidence": 0.95,
          "isa_reasoning": "Level Indicator"
        },
        "shape": "circle"
      },
      {
        "id": "Valve_Ball_D1162_Outlet",
        "type": "valve_ball",
        "label": "UNREADABLE",
        "bbox": [
          0.3,
          0.26,
          0.32,
          0.28
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with a diagonal line, which is the standard symbol for a ball valve.",
          "description": "Ball Valve (isolation)",
          "text_clarity": "unreadable",
          "raw_backend_output": [
            0.3,
            0.26,
            0.32,
            0.28
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.26,
                  0.32,
                  0.28
                ],
                "normalized_bbox": [
                  0.3,
                  0.26,
                  0.32,
                  0.28
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        },
        "shape": "circle"
      },
      {
        "id": "Tank_BottomLeft",
        "type": "equipment_tank",
        "label": "UNREADABLE-A",
        "bbox": [
          0,
          0.8,
          0.2,
          0.95
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a horizontal cylindrical tank with a support structure at the bottom left of the diagram.",
          "description": "Storage Tank",
          "equipment_type": "tank",
          "text_clarity": "unreadable",
          "raw_backend_output": [
            0,
            0.8,
            0.2,
            0.95
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0,
                  0.8,
                  0.2,
                  0.95
                ],
                "normalized_bbox": [
                  0,
                  0.8,
                  0.2,
                  0.95
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "UN",
          "detection_quality": "excellent",
          "parent_category": "process_equipment",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Multivariable",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: UNREADABLE",
          "label_conflict_resolved": true,
          "original_label": "UNREADABLE"
        }
      },
      {
        "id": "Strainer_P1161_Inlet",
        "type": "equipment_strainer",
        "label": "UNREADABLE-B",
        "bbox": [
          0.25,
          0.8,
          0.3,
          0.85
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a rectangle with a diagonal line in a process line before a pump, which is a common symbol for a strainer.",
          "description": "Strainer",
          "equipment_type": "strainer",
          "text_clarity": "unreadable",
          "raw_backend_output": [
            0.25,
            0.8,
            0.3,
            0.85
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.8,
                  0.3,
                  0.85
                ],
                "normalized_bbox": [
                  0.25,
                  0.8,
                  0.3,
                  0.85
                ]
              }
            }
          ],
          "shape": "rectangle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "UN",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "rectangle",
            "is_allowed": true,
            "reasoning": "Rectangle shapes represent gate valves or equipment outlines per ISA-5.1"
          },
          "isa_measured_variable": "Multivariable",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: UNREADABLE",
          "label_conflict_resolved": true,
          "original_label": "UNREADABLE"
        },
        "shape": "rectangle"
      },
      {
        "id": "Valve_Ball_P1161_Inlet",
        "type": "valve_ball",
        "label": "UNREADABLE-C",
        "bbox": [
          0.32,
          0.8,
          0.34,
          0.82
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with a diagonal line, which is the standard symbol for a ball valve.",
          "description": "Ball Valve (isolation)",
          "text_clarity": "unreadable",
          "raw_backend_output": [
            0.32,
            0.8,
            0.34,
            0.82
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.32,
                  0.8,
                  0.34,
                  0.82
                ],
                "normalized_bbox": [
                  0.32,
                  0.8,
                  0.34,
                  0.82
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball",
          "label_conflict_resolved": true,
          "original_label": "UNREADABLE"
        },
        "shape": "circle"
      },
      {
        "id": "P_1161",
        "type": "equipment_pump",
        "label": "P 1161",
        "bbox": [
          0.4,
          0.78,
          0.5,
          0.88
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with internal impeller blades and labeled 'P 1161', indicating a centrifugal pump.",
          "description": "Pump 1161",
          "equipment_type": "pump",
          "tag": "P 1161",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.4,
            0.78,
            0.5,
            0.88
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.4,
                  0.78,
                  0.5,
                  0.88
                ],
                "normalized_bbox": [
                  0.4,
                  0.78,
                  0.5,
                  0.88
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "P",
          "detection_quality": "excellent",
          "parent_category": "equipment",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": false,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Pressure / Vacuum"
        },
        "shape": "circle"
      },
      {
        "id": "CheckValve_P1161_Outlet",
        "type": "valve_check",
        "label": "UNREADABLE-D",
        "bbox": [
          0.52,
          0.8,
          0.54,
          0.82
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid triangle (arrow-shaped), which is the standard symbol for a check valve.",
          "description": "Check Valve",
          "text_clarity": "unreadable",
          "raw_backend_output": [
            0.52,
            0.8,
            0.54,
            0.82
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.52,
                  0.8,
                  0.54,
                  0.82
                ],
                "normalized_bbox": [
                  0.52,
                  0.8,
                  0.54,
                  0.82
                ]
              }
            }
          ],
          "shape": "triangle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "CHV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "triangle",
            "is_allowed": true,
            "reasoning": "Triangle shapes represent control valve bodies or check valves per ISA-5.1"
          },
          "isa_measured_variable": "Check",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_check",
          "label_conflict_resolved": true,
          "original_label": "UNREADABLE"
        },
        "shape": "triangle"
      },
      {
        "id": "Valve_Ball_P1161_Outlet",
        "type": "valve_ball",
        "label": "1/2''",
        "bbox": [
          0.56,
          0.8,
          0.58,
          0.82
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with a diagonal line, which is the standard symbol for a ball valve.",
          "description": "Ball Valve (isolation), 1/2 inch",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.56,
            0.8,
            0.58,
            0.82
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.56,
                  0.8,
                  0.58,
                  0.82
                ],
                "normalized_bbox": [
                  0.56,
                  0.8,
                  0.58,
                  0.82
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        },
        "shape": "circle"
      },
      {
        "id": "PI_1651",
        "type": "sensor_pressure",
        "label": "PI 1651",
        "bbox": [
          0.58,
          0.74,
          0.62,
          0.78
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected as a simple circle with ISA tag 'PI', indicating a field-mounted Pressure Indicator. The shape-first rule confirms it's an instrument.",
          "description": "Pressure Indicator 1651",
          "instrument_function": "indicator",
          "location": "field_mounted",
          "tag": "PI 1651",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.58,
            0.74,
            0.62,
            0.78
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.58,
                  0.74,
                  0.62,
                  0.78
                ],
                "normalized_bbox": [
                  0.58,
                  0.74,
                  0.62,
                  0.78
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "measured_variable": "pressure",
          "instrument_type": "PI",
          "parent_category": "instruments",
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "P",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_confidence": 0.95,
          "isa_reasoning": "Pressure Indicator"
        },
        "shape": "circle"
      },
      {
        "id": "RV_1603",
        "type": "valve_relief",
        "label": "RV 1603",
        "bbox": [
          0.4,
          0.58,
          0.45,
          0.63
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a triangle shape with a spring symbol on top and labeled 'RV', indicating a pressure relief valve.",
          "description": "Pressure Relief Valve 1603, set at 6 barg",
          "equipment_type": "valve",
          "tag": "RV 1603",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.4,
            0.58,
            0.45,
            0.63
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.4,
                  0.58,
                  0.45,
                  0.63
                ],
                "normalized_bbox": [
                  0.4,
                  0.58,
                  0.45,
                  0.63
                ]
              }
            }
          ],
          "shape": "triangle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "R",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "triangle",
            "is_allowed": true,
            "reasoning": "Triangle shapes represent control valve bodies or check valves per ISA-5.1"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Radiation Valve / Damper / Actuator"
        },
        "shape": "triangle"
      },
      {
        "id": "Z_1160",
        "type": "equipment_vessel",
        "label": "Z 1160",
        "bbox": [
          0.65,
          0,
          0.95,
          0.4
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a large horizontal cylindrical vessel, clearly labeled 'Z 1160'.",
          "description": "Vessel 1160",
          "equipment_type": "vessel",
          "tag": "Z 1160",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.65,
            0,
            0.95,
            0.4
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0,
                  0.95,
                  0.4
                ],
                "normalized_bbox": [
                  0.65,
                  0,
                  0.95,
                  0.4
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "Z",
          "detection_quality": "excellent",
          "parent_category": "process_equipment",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Position / Dimension"
        }
      },
      {
        "id": "Valve_Ball_Z1160_Inlet",
        "type": "valve_ball",
        "label": "10''",
        "bbox": [
          0.78,
          0.1,
          0.82,
          0.14
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with a diagonal line, which is the standard symbol for a ball valve.",
          "description": "Ball Valve (isolation), 10 inch",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.78,
            0.1,
            0.82,
            0.14
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.78,
                  0.1,
                  0.82,
                  0.14
                ],
                "normalized_bbox": [
                  0.78,
                  0.1,
                  0.82,
                  0.14
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        },
        "shape": "circle"
      },
      {
        "id": "Valve_Ball_Z1160_Outlet_1",
        "type": "valve_ball",
        "label": "1 1/2''",
        "bbox": [
          0.78,
          0.4,
          0.8,
          0.42
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with a diagonal line, which is the standard symbol for a ball valve.",
          "description": "Ball Valve (isolation), 1 1/2 inch",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.78,
            0.4,
            0.8,
            0.42
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.471Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.78,
                  0.4,
                  0.8,
                  0.42
                ],
                "normalized_bbox": [
                  0.78,
                  0.4,
                  0.8,
                  0.42
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        },
        "shape": "circle"
      },
      {
        "id": "Valve_Ball_Z1160_Outlet_2",
        "type": "valve_ball",
        "label": "1 1/2''-A",
        "bbox": [
          0.83,
          0.4,
          0.85,
          0.42
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with a diagonal line, which is the standard symbol for a ball valve.",
          "description": "Ball Valve (isolation), 1 1/2 inch",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.83,
            0.4,
            0.85,
            0.42
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.472Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.83,
                  0.4,
                  0.85,
                  0.42
                ],
                "normalized_bbox": [
                  0.83,
                  0.4,
                  0.85,
                  0.42
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball",
          "label_conflict_resolved": true,
          "original_label": "1 1/2''"
        },
        "shape": "circle"
      },
      {
        "id": "Valve_Ball_Z1160_Outlet_3",
        "type": "valve_ball",
        "label": "1 1/2''-B",
        "bbox": [
          0.88,
          0.4,
          0.9,
          0.42
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with a diagonal line, which is the standard symbol for a ball valve.",
          "description": "Ball Valve (isolation), 1 1/2 inch",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.88,
            0.4,
            0.9,
            0.42
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.472Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.88,
                  0.4,
                  0.9,
                  0.42
                ],
                "normalized_bbox": [
                  0.88,
                  0.4,
                  0.9,
                  0.42
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball",
          "label_conflict_resolved": true,
          "original_label": "1 1/2''"
        },
        "shape": "circle"
      },
      {
        "id": "SP114",
        "type": "sensor_pressure",
        "label": "SP114",
        "bbox": [
          0.78,
          0.5,
          0.82,
          0.54
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected as a simple circle with tag 'SP114', indicating a field-mounted pressure sensor or switch. The shape-first rule confirms it's an instrument.",
          "description": "Pressure Sensor/Switch 114",
          "instrument_function": "switch",
          "location": "field_mounted",
          "tag": "SP114",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.78,
            0.5,
            0.82,
            0.54
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-08T04:52:57.472Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.78,
                  0.5,
                  0.82,
                  0.54
                ],
                "normalized_bbox": [
                  0.78,
                  0.5,
                  0.82,
                  0.54
                ]
              }
            }
          ],
          "shape": "circle",
          "shape_extracted_from_reasoning": true,
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "S",
          "detection_quality": "excellent",
          "parent_category": "instruments",
          "shape_validation": {
            "validated": true,
            "corrected": false,
            "normalized_shape": "circle",
            "is_allowed": true,
            "reasoning": "Circle shapes represent instruments, sensors, or rotary valves (ball/butterfly) per ISA-5.1"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Speed / Frequency Test Point"
        },
        "shape": "circle"
      }
    ],
    "connections": [
      {
        "id": "1767847977472-7idygkals",
        "from_id": "D_1162",
        "to_id": "LI_1653",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_vessel",
          "to_component_type": "sensor_level",
          "from_label": "D 1162",
          "to_label": "LI 1653"
        }
      },
      {
        "id": "1767847977472-s7zlgcp16",
        "from_id": "D_1162",
        "to_id": "Valve_Ball_D1162_Outlet",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_vessel",
          "to_component_type": "valve_ball",
          "from_label": "D 1162",
          "to_label": "UNREADABLE"
        }
      },
      {
        "id": "1767847977472-gcloomvoh",
        "from_id": "Tank_BottomLeft",
        "to_id": "Strainer_P1161_Inlet",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_tank",
          "to_component_type": "equipment_strainer",
          "from_label": "UNREADABLE",
          "to_label": "UNREADABLE"
        }
      },
      {
        "id": "1767847977472-1k0ef029c",
        "from_id": "Strainer_P1161_Inlet",
        "to_id": "Valve_Ball_P1161_Inlet",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_strainer",
          "to_component_type": "valve_ball",
          "from_label": "UNREADABLE",
          "to_label": "UNREADABLE"
        }
      },
      {
        "id": "1767847977472-1qw10muwh",
        "from_id": "Valve_Ball_P1161_Inlet",
        "to_id": "P_1161",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "equipment_pump",
          "from_label": "UNREADABLE",
          "to_label": "P 1161"
        }
      },
      {
        "id": "1767847977472-xva1g4obu",
        "from_id": "P_1161",
        "to_id": "CheckValve_P1161_Outlet",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_pump",
          "to_component_type": "valve_check",
          "from_label": "P 1161",
          "to_label": "UNREADABLE"
        }
      },
      {
        "id": "1767847977472-4s0y88iav",
        "from_id": "CheckValve_P1161_Outlet",
        "to_id": "Valve_Ball_P1161_Outlet",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_check",
          "to_component_type": "valve_ball",
          "from_label": "UNREADABLE",
          "to_label": "1/2''"
        }
      },
      {
        "id": "1767847977472-jyiiqu63e",
        "from_id": "Valve_Ball_P1161_Outlet",
        "to_id": "RV_1603",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "valve_relief",
          "from_label": "1/2''",
          "to_label": "RV 1603"
        }
      },
      {
        "id": "1767847977472-9kf286t3h",
        "from_id": "Valve_Ball_P1161_Outlet",
        "to_id": "PI_1651",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "sensor_pressure",
          "from_label": "1/2''",
          "to_label": "PI 1651"
        }
      },
      {
        "id": "1767847977472-6vmwrs5y9",
        "from_id": "Valve_Ball_P1161_Outlet",
        "to_id": "Valve_Ball_Z1160_Inlet",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "valve_ball",
          "from_label": "1/2''",
          "to_label": "10''"
        }
      },
      {
        "id": "1767847977472-sg3xx2w67",
        "from_id": "Valve_Ball_Z1160_Inlet",
        "to_id": "Z_1160",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "equipment_vessel",
          "from_label": "10''",
          "to_label": "Z 1160"
        }
      },
      {
        "id": "1767847977472-421vo2ny1",
        "from_id": "Z_1160",
        "to_id": "Valve_Ball_Z1160_Outlet_1",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_vessel",
          "to_component_type": "valve_ball",
          "from_label": "Z 1160",
          "to_label": "1 1/2''"
        }
      },
      {
        "id": "1767847977472-jcc8c0r8u",
        "from_id": "Z_1160",
        "to_id": "Valve_Ball_Z1160_Outlet_2",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_vessel",
          "to_component_type": "valve_ball",
          "from_label": "Z 1160",
          "to_label": "1 1/2''"
        }
      },
      {
        "id": "1767847977472-m3p5pa2jq",
        "from_id": "Z_1160",
        "to_id": "Valve_Ball_Z1160_Outlet_3",
        "type": "process_flow",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_vessel",
          "to_component_type": "valve_ball",
          "from_label": "Z 1160",
          "to_label": "1 1/2''"
        }
      },
      {
        "id": "1767847977472-7qelzau9l",
        "from_id": "Z_1160",
        "to_id": "SP114",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment_vessel",
          "to_component_type": "sensor_pressure",
          "from_label": "Z 1160",
          "to_label": "SP114"
        }
      }
    ],
    "metadata": {
      "total_components": 17,
      "total_connections": 15,
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "shape_validation_enabled": true,
        "shape_violations_corrected": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 17,
        "isa_detection_rate": 1,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 0,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 4
      },
      "control_loops": [],
      "validation_issues": [],
      "quality_metrics": {
        "overall_score": 0.9556470588235295,
        "detection_quality": 1,
        "isa_completeness": 1,
        "connection_coverage": 0.8823529411764706,
        "confidence_avg": 0.9305882352941177,
        "metrics": {
          "total_components": 17,
          "total_connections": 15,
          "isa_functions_detected": 17,
          "excellent_detections": 17,
          "avg_confidence": 0.9305882352941177
        }
      },
      "label_generation": {
        "generated_count": 0,
        "conflicts_resolved": 2
      }
    }
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...

[Stage 2 Complete] Final analysis report generated successfully.


=======================================================


Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."}]
index.ts:34 Step 2: Routing to pipeline...
index.ts:34 ["Selected pipeline:","visual"]
index.ts:34 Step 3: Executing pipeline...
visual.ts:82 Detecting blueprint type (P&ID vs HVAC)...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
visual.ts:84 Blueprint type detected: PID
visual.ts:409 [Visual Pipeline] Image dimensions: 1309x728px, tiling: NO (threshold: 2000px)
visual.ts:95 Using standard single-pass analysis
visual.ts:100 [Visual Pipeline] Applying enhancements...
visual-enhancements.ts:44 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:51 [Enhancement] Normalizing component and connection types...
3type-normalization.ts:163  [Type Normalization] Unknown connection type: "process_connection", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:163
visual-enhancements.ts:54 [Enhancement] Type normalization complete
visual-enhancements.ts:59 [Enhancement] Applying spatial association to merge orphaned labels...
spatial-association.ts:330 [Spatial Association] Starting spatial association post-processing...
spatial-association.ts:196 [Spatial Association] Starting orphaned label detection...
spatial-association.ts:213 [Spatial Association] Found 0 orphaned labels, 0 unlabeled components, 17 already labeled
spatial-association.ts:220 [Spatial Association] No merging needed
spatial-association.ts:341 [Spatial Association] Post-processing complete in 1ms: 17 → 17 components (0 merged)
visual-enhancements.ts:68 [Enhancement] Spatial association complete: 0 orphaned labels merged, 17 total components remain
visual-enhancements.ts:77 [Enhancement] Applying strict geometric shape validation...
shape-validator.ts:544 [Shape Validator] Starting shape validation...
shape-validator.ts:578 [Shape Validator] All components passed shape validation
shape-validator.ts:595 [Shape Validator] Validation complete: 14/17 validated, 0 corrected
visual-enhancements.ts:80 [Enhancement] Shape validation complete: 0 components corrected
visual-enhancements.ts:87 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:92 [Enhancement] ISA detection complete: 17/17 components have ISA functions (100%)
visual-enhancements.ts:100 [Enhancement] Enhancing connections...
visual-enhancements.ts:106 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:115 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:132 [Enhancement] Validating connections...
visual-enhancements.ts:152 [Enhancement] Detecting control loops...
visual-enhancements.ts:154 [Enhancement] Detected 0 control loops
visual-enhancements.ts:158 [Enhancement] Post-processing complete in 4ms
visual.ts:111 [Visual Pipeline] Generating intelligent labels for unlabeled components...
visual.ts:115 [Visual Pipeline] Label generation: 0 components labeled
visual.ts:120  [Visual Pipeline] Label conflicts detected: 2 duplicates
analyzeVisual @ visual.ts:120
visual.ts:122 [Visual Pipeline] Label conflicts resolved
visual.ts:127 [Visual Pipeline] Quality Score: 0.96
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767847924716-7fhieu3hk","type":"SCHEMATIC","processing_time_ms":52763,"components":17}]
BlueprintWorkspace.tsx:258 Stage 1 (Visual Analysis) complete: Objectcache_hit: falseclassification: confidence: 1reasoning: "The document clearly displays numerous instrumentation symbols (e.g., PI, EA, ZL, HV, HS, TRCA, PSA, TISA, FRCA), valves, and pumps, interconnected by process flow lines. This is characteristic of a Process & Instrumentation Diagram (P&ID) or a control schematic, which falls under the SCHEMATIC classification."type: "SCHEMATIC"[[Prototype]]: Objectdocument_id: "1767847924716-7fhieu3hk"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 52763timestamp: 1767847977479visual: components: Array(17)0: {id: 'D_1162', type: 'equipment_vessel', label: 'D 1162', bbox: Array(4), confidence: 0.95, …}1: {id: 'LI_1653', type: 'sensor_level', label: 'LI 1653', bbox: Array(4), confidence: 0.98, …}2: {id: 'Valve_Ball_D1162_Outlet', type: 'valve_ball', label: 'UNREADABLE', bbox: Array(4), confidence: 0.9, …}3: {id: 'Tank_BottomLeft', type: 'equipment_tank', label: 'UNREADABLE-A', bbox: Array(4), confidence: 0.9, …}4: {id: 'Strainer_P1161_Inlet', type: 'equipment_strainer', label: 'UNREADABLE-B', bbox: Array(4), confidence: 0.9, …}5: {id: 'Valve_Ball_P1161_Inlet', type: 'valve_ball', label: 'UNREADABLE-C', bbox: Array(4), confidence: 0.9, …}6: {id: 'P_1161', type: 'equipment_pump', label: 'P 1161', bbox: Array(4), confidence: 0.98, …}7: {id: 'CheckValve_P1161_Outlet', type: 'valve_check', label: 'UNREADABLE-D', bbox: Array(4), confidence: 0.95, …}8: {id: 'Valve_Ball_P1161_Outlet', type: 'valve_ball', label: "1/2''", bbox: Array(4), confidence: 0.9, …}9: {id: 'PI_1651', type: 'sensor_pressure', label: 'PI 1651', bbox: Array(4), confidence: 0.98, …}10: {id: 'RV_1603', type: 'valve_relief', label: 'RV 1603', bbox: Array(4), confidence: 0.98, …}11: {id: 'Z_1160', type: 'equipment_vessel', label: 'Z 1160', bbox: Array(4), confidence: 0.95, …}12: {id: 'Valve_Ball_Z1160_Inlet', type: 'valve_ball', label: "10''", bbox: Array(4), confidence: 0.9, …}13: {id: 'Valve_Ball_Z1160_Outlet_1', type: 'valve_ball', label: "1 1/2''", bbox: Array(4), confidence: 0.9, …}14: {id: 'Valve_Ball_Z1160_Outlet_2', type: 'valve_ball', label: "1 1/2''-A", bbox: Array(4), confidence: 0.9, …}15: {id: 'Valve_Ball_Z1160_Outlet_3', type: 'valve_ball', label: "1 1/2''-B", bbox: Array(4), confidence: 0.9, …}16: {id: 'SP114', type: 'sensor_pressure', label: 'SP114', bbox: Array(4), confidence: 0.95, …}length: 17[[Prototype]]: Array(0)connections: Array(15)0: {id: '1767847977472-7idygkals', from_id: 'D_1162', to_id: 'LI_1653', type: 'unknown', confidence: 0.95, …}1: {id: '1767847977472-s7zlgcp16', from_id: 'D_1162', to_id: 'Valve_Ball_D1162_Outlet', type: 'process_flow', confidence: 0.95, …}2: {id: '1767847977472-gcloomvoh', from_id: 'Tank_BottomLeft', to_id: 'Strainer_P1161_Inlet', type: 'process_flow', confidence: 0.95, …}3: {id: '1767847977472-1k0ef029c', from_id: 'Strainer_P1161_Inlet', to_id: 'Valve_Ball_P1161_Inlet', type: 'process_flow', confidence: 0.95, …}4: {id: '1767847977472-1qw10muwh', from_id: 'Valve_Ball_P1161_Inlet', to_id: 'P_1161', type: 'process_flow', confidence: 0.95, …}5: {id: '1767847977472-xva1g4obu', from_id: 'P_1161', to_id: 'CheckValve_P1161_Outlet', type: 'process_flow', confidence: 0.95, …}6: {id: '1767847977472-4s0y88iav', from_id: 'CheckValve_P1161_Outlet', to_id: 'Valve_Ball_P1161_Outlet', type: 'process_flow', confidence: 0.95, …}7: {id: '1767847977472-jyiiqu63e', from_id: 'Valve_Ball_P1161_Outlet', to_id: 'RV_1603', type: 'process_flow', confidence: 0.9, …}8: {id: '1767847977472-9kf286t3h', from_id: 'Valve_Ball_P1161_Outlet', to_id: 'PI_1651', type: 'unknown', confidence: 0.9, …}9: {id: '1767847977472-6vmwrs5y9', from_id: 'Valve_Ball_P1161_Outlet', to_id: 'Valve_Ball_Z1160_Inlet', type: 'process_flow', confidence: 0.9, …}10: {id: '1767847977472-sg3xx2w67', from_id: 'Valve_Ball_Z1160_Inlet', to_id: 'Z_1160', type: 'process_flow', confidence: 0.95, …}11: {id: '1767847977472-421vo2ny1', from_id: 'Z_1160', to_id: 'Valve_Ball_Z1160_Outlet_1', type: 'process_flow', confidence: 0.95, …}12: {id: '1767847977472-jcc8c0r8u', from_id: 'Z_1160', to_id: 'Valve_Ball_Z1160_Outlet_2', type: 'process_flow', confidence: 0.95, …}13: {id: '1767847977472-m3p5pa2jq', from_id: 'Z_1160', to_id: 'Valve_Ball_Z1160_Outlet_3', type: 'process_flow', confidence: 0.95, …}14: {id: '1767847977472-7qelzau9l', from_id: 'Z_1160', to_id: 'SP114', type: 'unknown', confidence: 0.95, …}length: 15[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 4inferred_connections: 0isa_detection_enabled: trueisa_detection_rate: 1isa_functions_detected: 17loop_detection_enabled: trueorphaned_labels_merged: 0shape_validation_enabled: trueshape_violations_corrected: 0spatial_association_enabled: truevalidation_enabled: truevalidation_issues: 0[[Prototype]]: Objectlabel_generation: conflicts_resolved: 2generated_count: 0[[Prototype]]: Objectprocess_log: undefinedquality_metrics: confidence_avg: 0.9305882352941177connection_coverage: 0.8823529411764706detection_quality: 1isa_completeness: 1metrics: avg_confidence: 0.9305882352941177excellent_detections: 17isa_functions_detected: 17total_components: 17total_connections: 15[[Prototype]]: Objectoverall_score: 0.9556470588235295[[Prototype]]: Objecttotal_components: 17total_connections: 15validation_issues: Array(0)length: 0[[Prototype]]: Array(0)[[Prototype]]: Object[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:295 [Stage 2] Starting background analysis...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:316 [Stage 2] Background job queued: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:295 [Stage 2] Queuing background analysis on server...
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:127 [Polling] Starting poll for job: analysis-job-1-1767847977811
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: processing
BlueprintWorkspace.tsx:134 [Polling] Checking project status: default
BlueprintWorkspace.tsx:143 [Polling] Project status: completed
BlueprintWorkspace.tsx:146 [Polling] Project completed! Setting final analysis report
BlueprintWorkspace.tsx:196 [Polling] Cleanup: stopping poll
