  VITE v6.4.1  ready in 2143 ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://10.0.0.32:3000/
  ➜  press h + enter to show help
AI Vision Request -> model=gemini-2.5-flash imageSize=116848 mimeType=image/png responseMimeType=unset
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: PID
AI Vision Request -> model=gemini-2.5-flash imageSize=116848 mimeType=image/png responseMimeType=application/json
AI Vision: retry settings -> attempts=2, baseDelayMs=800, exponential=true, timeoutMs=120000
AI Vision Response: {
  "components": [
    {
      "id": "F_1151",
      "label": "F 1151",
      "type": "flow_element",
      "bbox": [0.350, 0.150, 0.450, 0.200],
      "confidence": 1.0,
      "meta": {
        "rea...
[Stage 2] Job analysis-job-1-1767753001859 queued for document 1767752947231-lnhjs0dn9
[Stage 2] Job analysis-job-1-1767753001859 - Status: RUNNING
[Stage 2] Job analysis-job-1-1767753001859 - Minifying payload...
   [Minification] Filtered ghost connection: F_1151 → external_PDRSA_2004
   [Minification] Filtered ghost connection: F_1151 → external_R_1200
   [Minification] Token reduction: 83.7% (28619 → 4652 bytes)
   [Minification] Components: 20, Connections: 22, Ghosts filtered: 2
[Stage 2] Job analysis-job-1-1767753001859 - Minification complete in 39ms
[Stage 2] Job analysis-job-1-1767753001859 - Sending to AI (model: gemini-2.5-flash)...
[Stage 2] Job analysis-job-1-1767753001859 - Token budget: 2000 tokens (20 components × 75 + 500 base, cap: 4096)
[Stage 2] Job analysis-job-1-1767753001859 - Thinking budget: 4048 tokens
[Stage 2] Job analysis-job-1-1767753001859 - AI timeout configured: 180000ms        
[Stage 2] Job analysis-job-1-1767753001859 - AI Response received in 11753ms
[Stage 2] Job analysis-job-1-1767753001859 - Response length: 377 characters
[Stage 2] Job analysis-job-1-1767753001859 - JSON parse error: Unterminated string in JSON at position 377
[Stage 2] Job analysis-job-1-1767753001859 - Attempting fallback extraction...      
[Stage 2] Job analysis-job-1-1767753001859 - No JSON structure found in response    
[Stage 2] Job analysis-job-1-1767753001859 - Response missing required fields: report_title, executive_summary, design_overview, system_workflow_narrative, control_logic_analysis, equipment_specifications, standards_compliance
[Stage 2] Job analysis-job-1-1767753001859 - This may indicate response truncation or incomplete generation
[Stage 2] Job analysis-job-1-1767753001859 - Response may be truncated or malformed 
[Stage 2] Job analysis-job-1-1767753001859 - Parsed keys: raw, error
[Stage 2] Job analysis-job-1-1767753001859 - Status: COMPLETED
[Stage 2] Job analysis-job-1-1767753001859 - Performance: Total=11813ms, AI=11753ms, Minify=39ms, DB=0ms
[Stage 2] Project default - Final report saved


Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767752947231-lnhjs0dn9","type":"SCHEMATIC","processing_time_ms":53582,"components":20}]

{
  "document_id": "1767752947231-lnhjs0dn9",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767753000813,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."
  },
  "processing_time_ms": 53582,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "F_1151",
        "type": "flow_element",
        "label": "F 1151",
        "bbox": [
          0.35,
          0.15,
          0.45,
          0.2
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a flow element due to the rectangular shape with a diagonal line, commonly representing an orifice plate or similar primary flow device. The tag 'F' indicates flow.",
          "description": "Flow Element",
          "instrument_function": "Flow Measurement",
          "raw_backend_output": [
            0.35,
            0.15,
            0.45,
            0.2
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.784Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.35,
                  0.15,
                  0.45,
                  0.2
                ],
                "normalized_bbox": [
                  0.35,
                  0.15,
                  0.45,
                  0.2
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "F",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Flow Rate"
        }
      },
      {
        "id": "Valve_F1151_Top",
        "type": "valve_control",
        "label": "N.O. (ET)",
        "bbox": [
          0.45,
          0.05,
          0.5,
          0.1
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as a control valve due to the bowtie shape indicating a valve body and the presence of an actuator symbol on top. 'N.O.' indicates Normally Open and '(ET)' for Electric Actuator.",
          "description": "Control Valve, Normally Open, Electric Actuator",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.45,
            0.05,
            0.5,
            0.1
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.788Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.05,
                  0.5,
                  0.1
                ],
                "normalized_bbox": [
                  0.45,
                  0.05,
                  0.5,
                  0.1
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "CV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Control",
          "isa_modifier": "Valve",
          "isa_confidence": 0.8,
          "isa_reasoning": "Inferred from component type: valve_control"
        }
      },
      {
        "id": "Valve_F1151_Right",
        "type": "valve_ball",
        "label": "N.O. (ET)",
        "bbox": [
          0.5,
          0.05,
          0.55,
          0.1
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a ball valve due to the circular shape with a single diagonal line inside, indicating a quarter-turn rotary valve. 'N.O.' for Normally Open and '(ET)' for Electric Actuator.",
          "description": "Ball Valve, Normally Open, Electric Actuator",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.5,
            0.05,
            0.55,
            0.1
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.788Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.05,
                  0.55,
                  0.1
                ],
                "normalized_bbox": [
                  0.5,
                  0.05,
                  0.55,
                  0.1
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "Valve_F1151_Bottom",
        "type": "valve_control",
        "label": "(ET)",
        "bbox": [
          0.45,
          0.1,
          0.5,
          0.15
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as a control valve due to the bowtie shape indicating a valve body and the presence of an actuator symbol on top, with '(ET)' for Electric Actuator.",
          "description": "Control Valve, Electric Actuator",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.45,
            0.1,
            0.5,
            0.15
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.788Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.1,
                  0.5,
                  0.15
                ],
                "normalized_bbox": [
                  0.45,
                  0.1,
                  0.5,
                  0.15
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "CV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Control",
          "isa_modifier": "Valve",
          "isa_confidence": 0.8,
          "isa_reasoning": "Inferred from component type: valve_control"
        }
      },
      {
        "id": "Z_1151",
        "type": "vessel_tank",
        "label": "Z 1151 (ET)",
        "bbox": [
          0.35,
          0.3,
          0.45,
          0.4
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a tank or vessel due to its rectangular shape and internal wavy line indicating liquid level. '(ET)' likely refers to an associated level transmitter.",
          "description": "Tank/Vessel with Level Indication",
          "equipment_type": "vessel",
          "raw_backend_output": [
            0.35,
            0.3,
            0.45,
            0.4
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.788Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.35,
                  0.3,
                  0.45,
                  0.4
                ],
                "normalized_bbox": [
                  0.35,
                  0.3,
                  0.45,
                  0.4
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": null,
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: Z-1151-(ET) (type: vessel_tank)"
        }
      },
      {
        "id": "PI_1558",
        "type": "sensor_pressure",
        "label": "PI 1558",
        "bbox": [
          0.45,
          0.3,
          0.5,
          0.35
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as a pressure indicator due to the simple circular shape with no internal lines, indicating an instrument, and the ISA tag 'PI' (Pressure Indicator).",
          "description": "Pressure Indicator",
          "instrument_function": "Pressure Indication",
          "raw_backend_output": [
            0.45,
            0.3,
            0.5,
            0.35
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.789Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.3,
                  0.5,
                  0.35
                ],
                "normalized_bbox": [
                  0.45,
                  0.3,
                  0.5,
                  0.35
                ]
              }
            }
          ],
          "measured_variable": "pressure",
          "instrument_type": "PI",
          "parent_category": "instruments",
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "P",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.95,
          "isa_reasoning": "Pressure Indicator"
        }
      },
      {
        "id": "Valve_Z1151_Left_Outlet",
        "type": "valve_ball",
        "label": "N.O.",
        "bbox": [
          0.3,
          0.45,
          0.35,
          0.5
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a ball valve due to the circular shape with a single diagonal line inside, indicating a quarter-turn rotary valve, with 'N.O.' for Normally Open.",
          "description": "Ball Valve, Normally Open",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.3,
            0.45,
            0.35,
            0.5
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.789Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.45,
                  0.35,
                  0.5
                ],
                "normalized_bbox": [
                  0.3,
                  0.45,
                  0.35,
                  0.5
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "RV_1503",
        "type": "valve_relief",
        "label": "RV 1503 (65 barg)",
        "bbox": [
          0.35,
          0.5,
          0.4,
          0.55
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as a pressure relief valve due to the triangular shape with a spring symbol on top, which is the standard symbol for a relief valve. The tag 'RV' (Relief Valve) confirms this.",
          "description": "Pressure Relief Valve, set at 65 barg",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.35,
            0.5,
            0.4,
            0.55
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.789Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.35,
                  0.5,
                  0.4,
                  0.55
                ],
                "normalized_bbox": [
                  0.35,
                  0.5,
                  0.4,
                  0.55
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "RV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Radiation",
          "isa_modifier": "Valve",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: RV-1503-(65-BARG)"
        }
      },
      {
        "id": "P_1151A",
        "type": "pump_centrifugal",
        "label": "P 1151A (ET)",
        "bbox": [
          0.35,
          0.6,
          0.45,
          0.7
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a centrifugal pump due to the circular shape with internal curved lines representing an impeller, and the tag 'P' for pump. '(ET)' indicates an Electric Motor.",
          "description": "Centrifugal Pump, Electric Motor",
          "equipment_type": "pump",
          "raw_backend_output": [
            0.35,
            0.6,
            0.45,
            0.7
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.789Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.35,
                  0.6,
                  0.45,
                  0.7
                ],
                "normalized_bbox": [
                  0.35,
                  0.6,
                  0.45,
                  0.7
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "parent_category": "equipment",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: P-1151A-(ET) (type: pump_centrifugal)"
        }
      },
      {
        "id": "Valve_P1151A_Discharge",
        "type": "valve_ball",
        "label": "1/2\"",
        "bbox": [
          0.45,
          0.6,
          0.5,
          0.65
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a ball valve due to the circular shape with a single diagonal line inside, indicating a quarter-turn rotary valve.",
          "description": "Ball Valve",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.45,
            0.6,
            0.5,
            0.65
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.789Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.6,
                  0.5,
                  0.65
                ],
                "normalized_bbox": [
                  0.45,
                  0.6,
                  0.5,
                  0.65
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "PI_1556",
        "type": "sensor_pressure",
        "label": "PI 1556",
        "bbox": [
          0.45,
          0.65,
          0.5,
          0.7
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as a pressure indicator due to the simple circular shape with no internal lines, indicating an instrument, and the ISA tag 'PI' (Pressure Indicator).",
          "description": "Pressure Indicator",
          "instrument_function": "Pressure Indication",
          "raw_backend_output": [
            0.45,
            0.65,
            0.5,
            0.7
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.45,
                  0.65,
                  0.5,
                  0.7
                ],
                "normalized_bbox": [
                  0.45,
                  0.65,
                  0.5,
                  0.7
                ]
              }
            }
          ],
          "measured_variable": "pressure",
          "instrument_type": "PI",
          "parent_category": "instruments",
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "P",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.95,
          "isa_reasoning": "Pressure Indicator"
        }
      },
      {
        "id": "Valve_Z1151_Right_Outlet",
        "type": "valve_ball",
        "label": "N.O.",
        "bbox": [
          0.5,
          0.45,
          0.55,
          0.5
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a ball valve due to the circular shape with a single diagonal line inside, indicating a quarter-turn rotary valve, with 'N.O.' for Normally Open.",
          "description": "Ball Valve, Normally Open",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.5,
            0.45,
            0.55,
            0.5
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.45,
                  0.55,
                  0.5
                ],
                "normalized_bbox": [
                  0.5,
                  0.45,
                  0.55,
                  0.5
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "RV_1504",
        "type": "valve_relief",
        "label": "RV 1504 (65 barg)",
        "bbox": [
          0.55,
          0.5,
          0.6,
          0.55
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as a pressure relief valve due to the triangular shape with a spring symbol on top, which is the standard symbol for a relief valve. The tag 'RV' (Relief Valve) confirms this.",
          "description": "Pressure Relief Valve, set at 65 barg",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.55,
            0.5,
            0.6,
            0.55
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.5,
                  0.6,
                  0.55
                ],
                "normalized_bbox": [
                  0.55,
                  0.5,
                  0.6,
                  0.55
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "RV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Radiation",
          "isa_modifier": "Valve",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: RV-1504-(65-BARG)"
        }
      },
      {
        "id": "P_1151B",
        "type": "pump_centrifugal",
        "label": "P 1151B (ET)",
        "bbox": [
          0.55,
          0.6,
          0.65,
          0.7
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a centrifugal pump due to the circular shape with internal curved lines representing an impeller, and the tag 'P' for pump. '(ET)' indicates an Electric Motor.",
          "description": "Centrifugal Pump, Electric Motor",
          "equipment_type": "pump",
          "raw_backend_output": [
            0.55,
            0.6,
            0.65,
            0.7
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.6,
                  0.65,
                  0.7
                ],
                "normalized_bbox": [
                  0.55,
                  0.6,
                  0.65,
                  0.7
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "parent_category": "equipment",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: P-1151B-(ET) (type: pump_centrifugal)"
        }
      },
      {
        "id": "Valve_P1151B_Discharge",
        "type": "valve_ball",
        "label": "1/2\"",
        "bbox": [
          0.65,
          0.6,
          0.7,
          0.65
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a ball valve due to the circular shape with a single diagonal line inside, indicating a quarter-turn rotary valve.",
          "description": "Ball Valve",
          "equipment_type": "valve",
          "raw_backend_output": [
            0.65,
            0.6,
            0.7,
            0.65
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.6,
                  0.7,
                  0.65
                ],
                "normalized_bbox": [
                  0.65,
                  0.6,
                  0.7,
                  0.65
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "parent_category": "valves",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "PI_1557",
        "type": "sensor_pressure",
        "label": "PI 1557",
        "bbox": [
          0.65,
          0.65,
          0.7,
          0.7
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as a pressure indicator due to the simple circular shape with no internal lines, indicating an instrument, and the ISA tag 'PI' (Pressure Indicator).",
          "description": "Pressure Indicator",
          "instrument_function": "Pressure Indication",
          "raw_backend_output": [
            0.65,
            0.65,
            0.7,
            0.7
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.65,
                  0.7,
                  0.7
                ],
                "normalized_bbox": [
                  0.65,
                  0.65,
                  0.7,
                  0.7
                ]
              }
            }
          ],
          "measured_variable": "pressure",
          "instrument_type": "PI",
          "parent_category": "instruments",
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "P",
          "detection_quality": "excellent",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.95,
          "isa_reasoning": "Pressure Indicator"
        }
      },
      {
        "id": "PRA_1502",
        "type": "instrument_alarm",
        "label": "PRA 1502 HH LL",
        "bbox": [
          0.7,
          0.3,
          0.75,
          0.35
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as an instrument alarm due to the square shape, indicating a panel-mounted instrument, and the tag 'PRA' (Pressure Alarm) with 'HH LL' indicating high-high and low-low alarm setpoints.",
          "description": "Pressure Alarm High-High Low-Low",
          "instrument_function": "Pressure Alarm",
          "raw_backend_output": [
            0.7,
            0.3,
            0.75,
            0.35
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.7,
                  0.3,
                  0.75,
                  0.35
                ],
                "normalized_bbox": [
                  0.7,
                  0.3,
                  0.75,
                  0.35
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "PAL",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Alarm Low",
          "isa_confidence": 0.75,
          "isa_reasoning": "Extracted from description: \"Pressure Alarm High-High Low-Low\""
        }
      },
      {
        "id": "PS_1502",
        "type": "instrument_switch",
        "label": "PS 1502 H L",
        "bbox": [
          0.7,
          0.4,
          0.75,
          0.45
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as an instrument switch due to the square shape, indicating a panel-mounted instrument, and the tag 'PS' (Pressure Switch) with 'H L' indicating high and low switch setpoints.",
          "description": "Pressure Switch High Low",
          "instrument_function": "Pressure Switch",
          "raw_backend_output": [
            0.7,
            0.4,
            0.75,
            0.45
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.7,
                  0.4,
                  0.75,
                  0.45
                ],
                "normalized_bbox": [
                  0.7,
                  0.4,
                  0.75,
                  0.45
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "P",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_measured_variable": "Pressure",
          "isa_modifier": null,
          "isa_confidence": 0.95,
          "isa_reasoning": "Matched standard ISA tag pattern: Switch (PS-1502-H-L)"
        }
      },
      {
        "id": "EA_1504",
        "type": "instrument_alarm",
        "label": "EA 1504",
        "bbox": [
          0.15,
          0.8,
          0.2,
          0.85
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as an instrument alarm due to the square shape, indicating a panel-mounted instrument, and the tag 'EA' (Event Alarm).",
          "description": "Event Alarm",
          "instrument_function": "Event Alarm",
          "raw_backend_output": [
            0.15,
            0.8,
            0.2,
            0.85
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.15,
                  0.8,
                  0.2,
                  0.85
                ],
                "normalized_bbox": [
                  0.15,
                  0.8,
                  0.2,
                  0.85
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "E",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Voltage Alarm"
        }
      },
      {
        "id": "IS_1507",
        "type": "instrument_interlock",
        "label": "IS 1507",
        "bbox": [
          0.25,
          0.8,
          0.3,
          0.85
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Classified as an interlock switch due to the square shape, indicating a panel-mounted instrument, and the tag 'IS' (Interlock Switch), which is further supported by its dashed line connections to the pumps.",
          "description": "Interlock Switch",
          "instrument_function": "Interlock Switch",
          "raw_backend_output": [
            0.25,
            0.8,
            0.3,
            0.85
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-07T02:30:00.790Z",
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
          "hvac_subsystem": "other",
          "component_category": "other",
          "isa_function": "IS",
          "detection_quality": "excellent",
          "parent_category": "other",
          "shape_validation": {
            "validated": false,
            "reason": "No shape information available"
          },
          "isa_confidence": 0.8,
          "isa_reasoning": "Current (Electrical) Safety"
        }
      }
    ],
    "connections": [
      {
        "id": "1767753000790-ujk57rkd0",
        "from_id": "F_1151",
        "to_id": "Valve_F1151_Top",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "flow_element",
          "to_component_type": "valve_control",
          "from_label": "F 1151",
          "to_label": "N.O. (ET)"
        }
      },
      {
        "id": "1767753000791-isu48st4g",
        "from_id": "F_1151",
        "to_id": "Valve_F1151_Right",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "flow_element",
          "to_component_type": "valve_ball",
          "from_label": "F 1151",
          "to_label": "N.O. (ET)"
        }
      },
      {
        "id": "1767753000791-c2phmrm4d",
        "from_id": "F_1151",
        "to_id": "Valve_F1151_Bottom",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "flow_element",
          "to_component_type": "valve_control",
          "from_label": "F 1151",
          "to_label": "(ET)"
        }
      },
      {
        "id": "1767753000791-bf039wgt8",
        "from_id": "Z_1151",
        "to_id": "Valve_Z1151_Left_Outlet",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "vessel_tank",
          "to_component_type": "valve_ball",
          "from_label": "Z 1151 (ET)",
          "to_label": "N.O."
        }
      },
      {
        "id": "1767753000791-tm2294tcp",
        "from_id": "Valve_Z1151_Left_Outlet",
        "to_id": "P_1151A",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "pump_centrifugal",
          "from_label": "N.O.",
          "to_label": "P 1151A (ET)"
        }
      },
      {
        "id": "1767753000791-834b301p2",
        "from_id": "P_1151A",
        "to_id": "Valve_P1151A_Discharge",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pump_centrifugal",
          "to_component_type": "valve_ball",
          "from_label": "P 1151A (ET)",
          "to_label": "1/2\""
        }
      },
      {
        "id": "1767753000791-b8lscny1w",
        "from_id": "Z_1151",
        "to_id": "Valve_Z1151_Right_Outlet",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "vessel_tank",
          "to_component_type": "valve_ball",
          "from_label": "Z 1151 (ET)",
          "to_label": "N.O."
        }
      },
      {
        "id": "1767753000791-eap0yk6iv",
        "from_id": "Valve_Z1151_Right_Outlet",
        "to_id": "P_1151B",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "pump_centrifugal",
          "from_label": "N.O.",
          "to_label": "P 1151B (ET)"
        }
      },
      {
        "id": "1767753000791-w5hhowbfn",
        "from_id": "P_1151B",
        "to_id": "Valve_P1151B_Discharge",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pump_centrifugal",
          "to_component_type": "valve_ball",
          "from_label": "P 1151B (ET)",
          "to_label": "1/2\""
        }
      },
      {
        "id": "1767753000791-ifd89j030",
        "from_id": "Valve_P1151A_Discharge",
        "to_id": "RV_1503",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "valve_relief",
          "from_label": "1/2\"",
          "to_label": "RV 1503 (65 barg)"
        }
      },
      {
        "id": "1767753000791-4551wcozy",
        "from_id": "Valve_P1151B_Discharge",
        "to_id": "RV_1504",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "valve_relief",
          "from_label": "1/2\"",
          "to_label": "RV 1504 (65 barg)"
        }
      },
      {
        "id": "1767753000791-sfrk4scpl",
        "from_id": "RV_1503",
        "to_id": "Z_1151",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_relief",
          "to_component_type": "vessel_tank",
          "from_label": "RV 1503 (65 barg)",
          "to_label": "Z 1151 (ET)"
        }
      },
      {
        "id": "1767753000791-7k1n8fk7k",
        "from_id": "RV_1504",
        "to_id": "Z_1151",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_relief",
          "to_component_type": "vessel_tank",
          "from_label": "RV 1504 (65 barg)",
          "to_label": "Z 1151 (ET)"
        }
      },
      {
        "id": "1767753000791-7iko2biu0",
        "from_id": "Z_1151",
        "to_id": "PI_1558",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "vessel_tank",
          "to_component_type": "sensor_pressure",
          "from_label": "Z 1151 (ET)",
          "to_label": "PI 1558"
        }
      },
      {
        "id": "1767753000791-3rqufz4j2",
        "from_id": "Valve_P1151A_Discharge",
        "to_id": "PI_1556",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "sensor_pressure",
          "from_label": "1/2\"",
          "to_label": "PI 1556"
        }
      },
      {
        "id": "1767753000791-9qaiijlfe",
        "from_id": "Valve_P1151B_Discharge",
        "to_id": "PI_1557",
        "type": "unknown",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "sensor_pressure",
          "from_label": "1/2\"",
          "to_label": "PI 1557"
        }
      },
      {
        "id": "1767753000791-2o16mtzg5",
        "from_id": "Z_1151",
        "to_id": "PRA_1502",
        "type": "signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "vessel_tank",
          "to_component_type": "instrument_alarm",
          "from_label": "Z 1151 (ET)",
          "to_label": "PRA 1502 HH LL"
        }
      },
      {
        "id": "1767753000791-3h7yau5ap",
        "from_id": "Z_1151",
        "to_id": "PS_1502",
        "type": "signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "vessel_tank",
          "to_component_type": "instrument_switch",
          "from_label": "Z 1151 (ET)",
          "to_label": "PS 1502 H L"
        }
      },
      {
        "id": "1767753000791-fiu952tpl",
        "from_id": "PS_1502",
        "to_id": "IS_1507",
        "type": "signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_switch",
          "to_component_type": "instrument_interlock",
          "from_label": "PS 1502 H L",
          "to_label": "IS 1507"
        }
      },
      {
        "id": "1767753000791-ifivjqrej",
        "from_id": "IS_1507",
        "to_id": "P_1151A",
        "type": "control_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_interlock",
          "to_component_type": "pump_centrifugal",
          "from_label": "IS 1507",
          "to_label": "P 1151A (ET)"
        }
      },
      {
        "id": "1767753000791-t4dpoaua0",
        "from_id": "IS_1507",
        "to_id": "P_1151B",
        "type": "control_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_interlock",
          "to_component_type": "pump_centrifugal",
          "from_label": "IS 1507",
          "to_label": "P 1151B (ET)"
        }
      },
      {
        "id": "1767753000791-fu2d4mlpb",
        "from_id": "IS_1507",
        "to_id": "EA_1504",
        "type": "signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_interlock",
          "to_component_type": "instrument_alarm",
          "from_label": "IS 1507",
          "to_label": "EA 1504"
        }
      },
      {
        "id": "1767753000791-zlwamy887",
        "from_id": "F_1151",
        "to_id": "external_PDRSA_2004",
        "type": "signal",
        "confidence": 0.9
      },
      {
        "id": "1767753000791-9xp8f4mge",
        "from_id": "F_1151",
        "to_id": "external_R_1200",
        "type": "signal",
        "confidence": 0.9
      }
    ],
    "metadata": {
      "total_components": 20,
      "total_connections": 24,
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "shape_validation_enabled": true,
        "shape_violations_corrected": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 17,
        "isa_detection_rate": 0.85,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 2,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 17
      },
      "control_loops": [],
      "validation_issues": [
        {
          "connection": {
            "id": "1767753000791-zlwamy887",
            "from_id": "F_1151",
            "to_id": "external_PDRSA_2004",
            "type": "signal",
            "confidence": 0.9
          },
          "issue": "Target component not found: external_PDRSA_2004",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767753000791-9xp8f4mge",
            "from_id": "F_1151",
            "to_id": "external_R_1200",
            "type": "signal",
            "confidence": 0.9
          },
          "issue": "Target component not found: external_R_1200",
          "severity": "error"
        }
      ],
      "quality_metrics": {
        "overall_score": 0.9624999999999999,
        "detection_quality": 1,
        "isa_completeness": 0.85,
        "connection_coverage": 1,
        "confidence_avg": 1,
        "metrics": {
          "total_components": 20,
          "total_connections": 24,
          "isa_functions_detected": 17,
          "excellent_detections": 20,
          "avg_confidence": 1
        }
      }
    }
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...

[Stage 2 Complete] Final analysis report generated successfully.


Failed to load resource: the server responded with a status of 500 (Internal Server Error)
:3000/api/projects/default/tree?dir=.:1   Failed to load resource: the server responded with a status of 500 (Internal Server Error)
index.ts:34 Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:34 ["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."}]
index.ts:34 Step 2: Routing to pipeline...
index.ts:34 ["Selected pipeline:","visual"]
index.ts:34 Step 3: Executing pipeline...
visual.ts:80 Detecting blueprint type (P&ID vs HVAC)...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
visual.ts:82 Blueprint type detected: PID
visual.ts:93 Using standard single-pass analysis
visual.ts:98 [Visual Pipeline] Applying enhancements...
visual-enhancements.ts:44 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:51 [Enhancement] Normalizing component and connection types...
3type-normalization.ts:163  [Type Normalization] Unknown connection type: "process_tap", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:163
visual-enhancements.ts:54 [Enhancement] Type normalization complete
visual-enhancements.ts:59 [Enhancement] Applying spatial association to merge orphaned labels...
spatial-association.ts:330 [Spatial Association] Starting spatial association post-processing...
spatial-association.ts:196 [Spatial Association] Starting orphaned label detection...
spatial-association.ts:213 [Spatial Association] Found 0 orphaned labels, 0 unlabeled components, 20 already labeled
spatial-association.ts:220 [Spatial Association] No merging needed
spatial-association.ts:341 [Spatial Association] Post-processing complete in 1ms: 20 → 20 components (0 merged)
visual-enhancements.ts:68 [Enhancement] Spatial association complete: 0 orphaned labels merged, 20 total components remain
visual-enhancements.ts:77 [Enhancement] Applying strict geometric shape validation...
shape-validator.ts:544 [Shape Validator] Starting shape validation...
shape-validator.ts:578 [Shape Validator] All components passed shape validation
shape-validator.ts:595 [Shape Validator] Validation complete: 0/20 validated, 0 corrected
visual-enhancements.ts:80 [Enhancement] Shape validation complete: 0 components corrected
visual-enhancements.ts:87 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:92 [Enhancement] ISA detection complete: 17/20 components have ISA functions (85%)
visual-enhancements.ts:100 [Enhancement] Enhancing connections...
visual-enhancements.ts:106 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:115 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:132 [Enhancement] Validating connections...
visual-enhancements.ts:138  [Enhancement] Connection validation found 2 issues (2 errors, 0 warnings)
enhanceVisualAnalysis @ visual-enhancements.ts:138
visual-enhancements.ts:144 [Enhancement] Auto-correcting connection type mismatches...
visual-enhancements.ts:152 [Enhancement] Detecting control loops...
visual-enhancements.ts:154 [Enhancement] Detected 0 control loops
visual-enhancements.ts:158 [Enhancement] Post-processing complete in 17ms
visual.ts:110 [Visual Pipeline] Quality Score: 0.96
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767752947231-lnhjs0dn9","type":"SCHEMATIC","processing_time_ms":53582,"components":20}]
BlueprintWorkspace.tsx:222 Stage 1 (Visual Analysis) complete: Objectcache_hit: falseclassification: confidence: 1reasoning: "The document clearly displays numerous instrumentation symbols (e.g., PV, FIT, PI, PIT, PIC, TIT, TE, PDIT, PDI) represented by circles and other shapes with alphanumeric tags, interconnected by process flow lines. This aligns perfectly with the definition of a SCHEMATIC, specifically a P&ID (Piping and Instrumentation Diagram)."type: "SCHEMATIC"[[Prototype]]: Objectdocument_id: "1767752947231-lnhjs0dn9"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 53582timestamp: 1767753000813visual: components: Array(20)0: {id: 'F_1151', type: 'flow_element', label: 'F 1151', bbox: Array(4), confidence: 1, …}1: {id: 'Valve_F1151_Top', type: 'valve_control', label: 'N.O. (ET)', bbox: Array(4), confidence: 1, …}2: {id: 'Valve_F1151_Right', type: 'valve_ball', label: 'N.O. (ET)', bbox: Array(4), confidence: 1, …}3: {id: 'Valve_F1151_Bottom', type: 'valve_control', label: '(ET)', bbox: Array(4), confidence: 1, …}4: {id: 'Z_1151', type: 'vessel_tank', label: 'Z 1151 (ET)', bbox: Array(4), confidence: 1, …}5: {id: 'PI_1558', type: 'sensor_pressure', label: 'PI 1558', bbox: Array(4), confidence: 1, …}6: {id: 'Valve_Z1151_Left_Outlet', type: 'valve_ball', label: 'N.O.', bbox: Array(4), confidence: 1, …}7: {id: 'RV_1503', type: 'valve_relief', label: 'RV 1503 (65 barg)', bbox: Array(4), confidence: 1, …}8: {id: 'P_1151A', type: 'pump_centrifugal', label: 'P 1151A (ET)', bbox: Array(4), confidence: 1, …}9: {id: 'Valve_P1151A_Discharge', type: 'valve_ball', label: '1/2"', bbox: Array(4), confidence: 1, …}10: {id: 'PI_1556', type: 'sensor_pressure', label: 'PI 1556', bbox: Array(4), confidence: 1, …}11: {id: 'Valve_Z1151_Right_Outlet', type: 'valve_ball', label: 'N.O.', bbox: Array(4), confidence: 1, …}12: {id: 'RV_1504', type: 'valve_relief', label: 'RV 1504 (65 barg)', bbox: Array(4), confidence: 1, …}13: {id: 'P_1151B', type: 'pump_centrifugal', label: 'P 1151B (ET)', bbox: Array(4), confidence: 1, …}14: {id: 'Valve_P1151B_Discharge', type: 'valve_ball', label: '1/2"', bbox: Array(4), confidence: 1, …}15: {id: 'PI_1557', type: 'sensor_pressure', label: 'PI 1557', bbox: Array(4), confidence: 1, …}16: {id: 'PRA_1502', type: 'instrument_alarm', label: 'PRA 1502 HH LL', bbox: Array(4), confidence: 1, …}17: {id: 'PS_1502', type: 'instrument_switch', label: 'PS 1502 H L', bbox: Array(4), confidence: 1, …}18: {id: 'EA_1504', type: 'instrument_alarm', label: 'EA 1504', bbox: Array(4), confidence: 1, …}19: {id: 'IS_1507', type: 'instrument_interlock', label: 'IS 1507', bbox: Array(4), confidence: 1, …}length: 20[[Prototype]]: Array(0)connections: Array(24)0: {id: '1767753000790-ujk57rkd0', from_id: 'F_1151', to_id: 'Valve_F1151_Top', type: 'process_flow', confidence: 0.9, …}1: {id: '1767753000791-isu48st4g', from_id: 'F_1151', to_id: 'Valve_F1151_Right', type: 'process_flow', confidence: 0.9, …}2: {id: '1767753000791-c2phmrm4d', from_id: 'F_1151', to_id: 'Valve_F1151_Bottom', type: 'process_flow', confidence: 0.9, …}3: {id: '1767753000791-bf039wgt8', from_id: 'Z_1151', to_id: 'Valve_Z1151_Left_Outlet', type: 'process_flow', confidence: 0.9, …}4: {id: '1767753000791-tm2294tcp', from_id: 'Valve_Z1151_Left_Outlet', to_id: 'P_1151A', type: 'process_flow', confidence: 0.9, …}5: {id: '1767753000791-834b301p2', from_id: 'P_1151A', to_id: 'Valve_P1151A_Discharge', type: 'process_flow', confidence: 0.9, …}6: {id: '1767753000791-b8lscny1w', from_id: 'Z_1151', to_id: 'Valve_Z1151_Right_Outlet', type: 'process_flow', confidence: 0.9, …}7: {id: '1767753000791-eap0yk6iv', from_id: 'Valve_Z1151_Right_Outlet', to_id: 'P_1151B', type: 'process_flow', confidence: 0.9, …}8: {id: '1767753000791-w5hhowbfn', from_id: 'P_1151B', to_id: 'Valve_P1151B_Discharge', type: 'process_flow', confidence: 0.9, …}9: {id: '1767753000791-ifd89j030', from_id: 'Valve_P1151A_Discharge', to_id: 'RV_1503', type: 'process_flow', confidence: 0.9, …}10: {id: '1767753000791-4551wcozy', from_id: 'Valve_P1151B_Discharge', to_id: 'RV_1504', type: 'process_flow', confidence: 0.9, …}11: {id: '1767753000791-sfrk4scpl', from_id: 'RV_1503', to_id: 'Z_1151', type: 'process_flow', confidence: 0.9, …}12: {id: '1767753000791-7k1n8fk7k', from_id: 'RV_1504', to_id: 'Z_1151', type: 'process_flow', confidence: 0.9, …}13: {id: '1767753000791-7iko2biu0', from_id: 'Z_1151', to_id: 'PI_1558', type: 'unknown', confidence: 0.9, …}14: {id: '1767753000791-3rqufz4j2', from_id: 'Valve_P1151A_Discharge', to_id: 'PI_1556', type: 'unknown', confidence: 0.9, …}15: {id: '1767753000791-9qaiijlfe', from_id: 'Valve_P1151B_Discharge', to_id: 'PI_1557', type: 'unknown', confidence: 0.9, …}16: {id: '1767753000791-2o16mtzg5', from_id: 'Z_1151', to_id: 'PRA_1502', type: 'signal', confidence: 0.9, …}17: {id: '1767753000791-3h7yau5ap', from_id: 'Z_1151', to_id: 'PS_1502', type: 'signal', confidence: 0.9, …}18: {id: '1767753000791-fiu952tpl', from_id: 'PS_1502', to_id: 'IS_1507', type: 'signal', confidence: 0.9, …}19: {id: '1767753000791-ifivjqrej', from_id: 'IS_1507', to_id: 'P_1151A', type: 'control_signal', confidence: 0.9, …}20: {id: '1767753000791-t4dpoaua0', from_id: 'IS_1507', to_id: 'P_1151B', type: 'control_signal', confidence: 0.9, …}21: {id: '1767753000791-fu2d4mlpb', from_id: 'IS_1507', to_id: 'EA_1504', type: 'signal', confidence: 0.9, …}22: {id: '1767753000791-zlwamy887', from_id: 'F_1151', to_id: 'external_PDRSA_2004', type: 'signal', confidence: 0.9}23: {id: '1767753000791-9xp8f4mge', from_id: 'F_1151', to_id: 'external_R_1200', type: 'signal', confidence: 0.9}length: 24[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 17inferred_connections: 0isa_detection_enabled: trueisa_detection_rate: 0.85isa_functions_detected: 17loop_detection_enabled: trueorphaned_labels_merged: 0shape_validation_enabled: trueshape_violations_corrected: 0spatial_association_enabled: truevalidation_enabled: truevalidation_issues: 2[[Prototype]]: Objectprocess_log: undefinedquality_metrics: confidence_avg: 1connection_coverage: 1detection_quality: 1isa_completeness: 0.85metrics: {total_components: 20, total_connections: 24, isa_functions_detected: 17, excellent_detections: 20, avg_confidence: 1}overall_score: 0.9624999999999999[[Prototype]]: Objecttotal_components: 20total_connections: 24validation_issues: Array(2)0: {connection: {…}, issue: 'Target component not found: external_PDRSA_2004', severity: 'error'}1: {connection: {…}, issue: 'Target component not found: external_R_1200', severity: 'error'}length: 2[[Prototype]]: Array(0)[[Prototype]]: Object[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:259 [Stage 2] Starting background analysis...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767753001080
BlueprintWorkspace.tsx:280 [Stage 2] Background job queued: analysis-job-1-1767753001080
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767753001080
BlueprintWorkspace.tsx:259 [Stage 2] Queuing background analysis on server...
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767753001080
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767753001080
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll
BlueprintWorkspace.tsx:124 [Polling] Starting poll for job: analysis-job-1-1767753001080
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: processing
BlueprintWorkspace.tsx:131 [Polling] Checking project status: default
BlueprintWorkspace.tsx:140 [Polling] Project status: completed
BlueprintWorkspace.tsx:143 [Polling] Project completed! Setting final analysis report
BlueprintWorkspace.tsx:193 [Polling] Cleanup: stopping poll