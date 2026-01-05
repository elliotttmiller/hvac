Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":0.95,"reasoning":"Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767596208079-iita4tu18","type":"SCHEMATIC","processing_time_ms":76365,"components":66}]
Step 4: Generating comprehensive final analysis report...
Warning: Final analysis report generation failed, continuing with basic analysis

{
  "document_id": "1767596208079-iita4tu18",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767596284444,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 0.95,
    "reasoning": "Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"
  },
  "processing_time_ms": 76365,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "PV-0027",
        "type": "valve_control",
        "label": "PV-0027",
        "bbox": [
          0.059,
          0.08,
          0.106,
          0.126
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'PV' and '0027' inside, indicating a field-mounted pressure indicator.",
          "description": "Pressure Indicator",
          "functional_desc": "Pressure, Indicator",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PV-0027",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.059,
            0.08,
            0.106,
            0.126
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.301Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.059,
                  0.08,
                  0.106,
                  0.126
                ],
                "normalized_bbox": [
                  0.059,
                  0.08,
                  0.106,
                  0.126
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "ZC-0027",
        "type": "instrument_logic",
        "label": "ZC-0027",
        "bbox": [
          0.198,
          0.08,
          0.245,
          0.126
        ],
        "confidence": 0.97,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a diamond symbol with 'ZC' and '0027' inside, indicating a field-mounted logic function for position.",
          "description": "Position Logic Controller",
          "functional_desc": "Position, Logic",
          "hvac_subsystem": "controls",
          "instrument_function": "Z",
          "instrument_type": "Logic",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "ZC-0027",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.198,
            0.08,
            0.245,
            0.126
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.317Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.198,
                  0.08,
                  0.245,
                  0.126
                ],
                "normalized_bbox": [
                  0.198,
                  0.08,
                  0.245,
                  0.126
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "ZC",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "CSO-1",
        "type": "valve_gate",
        "label": "CSO",
        "bbox": [
          0.29,
          0.17,
          0.318,
          0.198
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a gate valve symbol with 'CSO' label, indicating a manual shut-off valve.",
          "description": "Manual Shut-Off Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "CSO",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.17,
            0.318,
            0.198
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.317Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.17,
                  0.318,
                  0.198
                ],
                "normalized_bbox": [
                  0.29,
                  0.17,
                  0.318,
                  0.198
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "CSO-2",
        "type": "valve_gate",
        "label": "CSO",
        "bbox": [
          0.36,
          0.17,
          0.388,
          0.198
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a gate valve symbol with 'CSO' label, indicating a manual shut-off valve.",
          "description": "Manual Shut-Off Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "CSO",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.36,
            0.17,
            0.388,
            0.198
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.317Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.36,
                  0.17,
                  0.388,
                  0.198
                ],
                "normalized_bbox": [
                  0.36,
                  0.17,
                  0.388,
                  0.198
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "FIT-0007A",
        "type": "sensor_flow",
        "label": "FIT-0007A",
        "bbox": [
          0.059,
          0.29,
          0.106,
          0.336
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'FIT' and '0007 A' inside, indicating a field-mounted flow indicating transmitter. An orifice plate is connected upstream.",
          "description": "Flow Indicating Transmitter A",
          "functional_desc": "Flow, Indicator, Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "F",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FIT-0007A",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.059,
            0.29,
            0.106,
            0.336
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.317Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.059,
                  0.29,
                  0.106,
                  0.336
                ],
                "normalized_bbox": [
                  0.059,
                  0.29,
                  0.106,
                  0.336
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FIT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FE-0007",
        "type": "sensor_flow",
        "label": "FE-0007",
        "bbox": [
          0.17,
          0.29,
          0.217,
          0.336
        ],
        "confidence": 0.97,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected an orifice plate symbol with 'FE' and '0007' label, indicating a flow element.",
          "description": "Flow Element",
          "functional_desc": "Flow, Element",
          "hvac_subsystem": "controls",
          "instrument_function": "F",
          "instrument_type": "Mechanical",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FE-0007",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.17,
            0.29,
            0.217,
            0.336
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.317Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.29,
                  0.217,
                  0.336
                ],
                "normalized_bbox": [
                  0.17,
                  0.29,
                  0.217,
                  0.336
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FIT-0007B",
        "type": "sensor_flow",
        "label": "FIT-0007B",
        "bbox": [
          0.17,
          0.39,
          0.217,
          0.436
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'FIT' and '0007 B' inside, indicating a field-mounted flow indicating transmitter. An orifice plate is connected upstream.",
          "description": "Flow Indicating Transmitter B",
          "functional_desc": "Flow, Indicator, Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "F",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FIT-0007B",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.17,
            0.39,
            0.217,
            0.436
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.317Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.39,
                  0.217,
                  0.436
                ],
                "normalized_bbox": [
                  0.17,
                  0.39,
                  0.217,
                  0.436
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FIT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PI-0023",
        "type": "sensor_pressure",
        "label": "PI-0023",
        "bbox": [
          0.059,
          0.52,
          0.106,
          0.566
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'PI' and '0023' inside, indicating a field-mounted pressure indicator.",
          "description": "Pressure Indicator",
          "functional_desc": "Pressure, Indicator",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PI-0023",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.059,
            0.52,
            0.106,
            0.566
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.317Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.059,
                  0.52,
                  0.106,
                  0.566
                ],
                "normalized_bbox": [
                  0.059,
                  0.52,
                  0.106,
                  0.566
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIT-0023",
        "type": "sensor_pressure",
        "label": "PIT-0023",
        "bbox": [
          0.17,
          0.52,
          0.217,
          0.566
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'PIT' and '0023' inside, indicating a field-mounted pressure indicating transmitter.",
          "description": "Pressure Indicating Transmitter",
          "functional_desc": "Pressure, Indicator, Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PIT-0023",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.17,
            0.52,
            0.217,
            0.566
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.317Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.52,
                  0.217,
                  0.566
                ],
                "normalized_bbox": [
                  0.17,
                  0.52,
                  0.217,
                  0.566
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PIT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TI-0025H",
        "type": "sensor_temperature",
        "label": "TI-0025H",
        "bbox": [
          0.059,
          0.65,
          0.106,
          0.696
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TI H' and '0025' inside, indicating a field-mounted high temperature indicator.",
          "description": "High Temperature Indicator",
          "functional_desc": "Temperature, Indicator, High",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TI-0025H",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.059,
            0.65,
            0.106,
            0.696
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.326Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.059,
                  0.65,
                  0.106,
                  0.696
                ],
                "normalized_bbox": [
                  0.059,
                  0.65,
                  0.106,
                  0.696
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TIT-0025",
        "type": "sensor_temperature",
        "label": "TIT-0025",
        "bbox": [
          0.17,
          0.65,
          0.217,
          0.696
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TIT' and '0025' inside, indicating a field-mounted temperature indicating transmitter.",
          "description": "Temperature Indicating Transmitter",
          "functional_desc": "Temperature, Indicator, Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TIT-0025",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.17,
            0.65,
            0.217,
            0.696
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.342Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.65,
                  0.217,
                  0.696
                ],
                "normalized_bbox": [
                  0.17,
                  0.65,
                  0.217,
                  0.696
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TIT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TE-0025",
        "type": "sensor_temperature",
        "label": "TE-0025",
        "bbox": [
          0.29,
          0.65,
          0.318,
          0.696
        ],
        "confidence": 0.97,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a temperature well symbol with 'TE' and '0025' label, indicating a temperature element (RTD).",
          "description": "Temperature Element (RTD)",
          "functional_desc": "Temperature, Element",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Mechanical",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TE-0025",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.65,
            0.318,
            0.696
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.342Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.65,
                  0.318,
                  0.696
                ],
                "normalized_bbox": [
                  0.29,
                  0.65,
                  0.318,
                  0.696
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "V-1",
        "type": "valve_control",
        "label": "V",
        "bbox": [
          0.29,
          0.74,
          0.318,
          0.768
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a control valve symbol with 'V' label, indicating a generic control valve.",
          "description": "Control Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "V",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.74,
            0.318,
            0.768
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.342Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.74,
                  0.318,
                  0.768
                ],
                "normalized_bbox": [
                  0.29,
                  0.74,
                  0.318,
                  0.768
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "CV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Control",
          "isa_modifier": "Valve",
          "isa_confidence": 0.8,
          "isa_reasoning": "Inferred from component type: valve_control"
        }
      },
      {
        "id": "PDIT-0022",
        "type": "instrument_transmitter",
        "label": "PDIT-0022",
        "bbox": [
          0.17,
          0.86,
          0.217,
          0.91
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'PDIT' and '0022' inside, indicating a field-mounted differential pressure indicating transmitter.",
          "description": "Differential Pressure Indicating Transmitter",
          "functional_desc": "Pressure, Differential, Indicator, Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PDIT-0022",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.17,
            0.86,
            0.217,
            0.91
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.343Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.86,
                  0.217,
                  0.91
                ],
                "normalized_bbox": [
                  0.17,
                  0.86,
                  0.217,
                  0.91
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PIT",
          "detection_quality": "excellent",
          "isa_measured_variable": "P",
          "isa_modifier": "D",
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Pressure / Vacuum Differential (e.g., PD = Pressure Diff) Indicator (Readout) Transmitter"
        }
      },
      {
        "id": "PDI-0022H",
        "type": "instrument_indicator",
        "label": "PDI-0022H",
        "bbox": [
          0.29,
          0.86,
          0.337,
          0.91
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'PDI H' and '0022' inside, indicating a field-mounted high differential pressure indicator.",
          "description": "High Differential Pressure Indicator",
          "functional_desc": "Pressure, Differential, Indicator, High",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PDI-0022H",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.86,
            0.337,
            0.91
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.343Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.86,
                  0.337,
                  0.91
                ],
                "normalized_bbox": [
                  0.29,
                  0.86,
                  0.337,
                  0.91
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PDI",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIT-0033",
        "type": "sensor_pressure",
        "label": "PIT-0033",
        "bbox": [
          0.44,
          0.44,
          0.487,
          0.49
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'PIT' and '0033' inside, indicating a field-mounted pressure indicating transmitter.",
          "description": "Pressure Indicating Transmitter",
          "functional_desc": "Pressure, Indicator, Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PIT-0033",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.44,
            0.487,
            0.49
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.343Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.44,
                  0.487,
                  0.49
                ],
                "normalized_bbox": [
                  0.44,
                  0.44,
                  0.487,
                  0.49
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PIT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIC-0033",
        "type": "sensor_pressure",
        "label": "PIC-0033",
        "bbox": [
          0.55,
          0.44,
          0.597,
          0.49
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle-in-square symbol with 'PIC' and '0033' inside, indicating a shared display/control pressure indicating controller.",
          "description": "Pressure Indicating Controller",
          "functional_desc": "Pressure, Indicator, Controller",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Shared Display",
          "location": "Main Panel",
          "occlusion_level": "none",
          "tag": "PIC-0033",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.55,
            0.44,
            0.597,
            0.49
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.343Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.44,
                  0.597,
                  0.49
                ],
                "normalized_bbox": [
                  0.55,
                  0.44,
                  0.597,
                  0.49
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PIC",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "CheckValve-1",
        "type": "valve_check",
        "label": "Check Valve",
        "bbox": [
          0.44,
          0.65,
          0.468,
          0.678
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a check valve symbol (arrow with line) indicating flow in one direction.",
          "description": "Non-Slam Check Valve (Nozzle Type)",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "Check Valve",
          "text_clarity": "good",
          "raw_backend_output": [
            0.44,
            0.65,
            0.468,
            0.678
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.343Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.65,
                  0.468,
                  0.678
                ],
                "normalized_bbox": [
                  0.44,
                  0.65,
                  0.468,
                  0.678
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE"
        }
      },
      {
        "id": "CSO-3",
        "type": "valve_gate",
        "label": "CSO",
        "bbox": [
          0.44,
          0.74,
          0.468,
          0.768
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a gate valve symbol with 'CSO' label, indicating a manual shut-off valve.",
          "description": "Manual Shut-Off Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "CSO",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.74,
            0.468,
            0.768
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.343Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.74,
                  0.468,
                  0.768
                ],
                "normalized_bbox": [
                  0.44,
                  0.74,
                  0.468,
                  0.768
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "TIT-0026",
        "type": "sensor_temperature",
        "label": "TIT-0026",
        "bbox": [
          0.33,
          0.52,
          0.377,
          0.566
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with 'TIT' and '0026' inside, indicating a field-mounted temperature indicating transmitter.",
          "description": "Temperature Indicating Transmitter",
          "functional_desc": "Temperature, Indicator, Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TIT-0026",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.33,
            0.52,
            0.377,
            0.566
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.345Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.33,
                  0.52,
                  0.377,
                  0.566
                ],
                "normalized_bbox": [
                  0.33,
                  0.52,
                  0.377,
                  0.566
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TIT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TE-0026",
        "type": "sensor_temperature",
        "label": "TE-0026",
        "bbox": [
          0.44,
          0.52,
          0.468,
          0.566
        ],
        "confidence": 0.97,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a temperature well symbol with 'TE' and '0026' label, indicating a temperature element (RTD).",
          "description": "Temperature Element (RTD)",
          "functional_desc": "Temperature, Element",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Mechanical",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TE-0026",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.52,
            0.468,
            0.566
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.345Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.52,
                  0.468,
                  0.566
                ],
                "normalized_bbox": [
                  0.44,
                  0.52,
                  0.468,
                  0.566
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TE",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "CSO-4",
        "type": "valve_gate",
        "label": "CSO",
        "bbox": [
          0.33,
          0.74,
          0.358,
          0.768
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a gate valve symbol with 'CSO' label, indicating a manual shut-off valve.",
          "description": "Manual Shut-Off Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "CSO",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.33,
            0.74,
            0.358,
            0.768
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.345Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.33,
                  0.74,
                  0.358,
                  0.768
                ],
                "normalized_bbox": [
                  0.33,
                  0.74,
                  0.358,
                  0.768
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "CS",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "Switch",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CSO"
        }
      },
      {
        "id": "Pipe-1",
        "type": "pipe",
        "label": "1-1/2\" D 15CS2P",
        "bbox": [
          0.001,
          0.17,
          0.048,
          0.202
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '1-1/2\" D 15CS2P' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "1-1/2\" D 15CS2P",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.001,
            0.17,
            0.048,
            0.202
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.345Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.001,
                  0.17,
                  0.048,
                  0.202
                ],
                "normalized_bbox": [
                  0.001,
                  0.17,
                  0.048,
                  0.202
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1-1/2\"-D-15CS2P (type: pipe)"
        }
      },
      {
        "id": "Pipe-2",
        "type": "pipe",
        "label": "25CS2P",
        "bbox": [
          0.09,
          0.17,
          0.137,
          0.202
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '25CS2P' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "25CS2P",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.09,
            0.17,
            0.137,
            0.202
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.345Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.09,
                  0.17,
                  0.137,
                  0.202
                ],
                "normalized_bbox": [
                  0.09,
                  0.17,
                  0.137,
                  0.202
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 25CS2P (type: pipe)"
        }
      },
      {
        "id": "Pipe-3",
        "type": "pipe",
        "label": "1-1/2\" D",
        "bbox": [
          0.24,
          0.17,
          0.287,
          0.202
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '1-1/2\" D' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "1-1/2\" D",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.24,
            0.17,
            0.287,
            0.202
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.345Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.24,
                  0.17,
                  0.287,
                  0.202
                ],
                "normalized_bbox": [
                  0.24,
                  0.17,
                  0.287,
                  0.202
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1-1/2\"-D (type: pipe)"
        }
      },
      {
        "id": "Pipe-4",
        "type": "pipe",
        "label": "1 1/2\" PP",
        "bbox": [
          0.44,
          0.22,
          0.487,
          0.252
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '1 1/2\" PP' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "1 1/2\" PP",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.22,
            0.487,
            0.252
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.345Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.22,
                  0.487,
                  0.252
                ],
                "normalized_bbox": [
                  0.44,
                  0.22,
                  0.487,
                  0.252
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1-1/2\"-PP (type: pipe)"
        }
      },
      {
        "id": "Pipe-5",
        "type": "pipe",
        "label": "18\"-P-0774-25CS2P",
        "bbox": [
          0.44,
          0.26,
          0.587,
          0.292
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '18\"-P-0774-25CS2P' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "18\"-P-0774-25CS2P",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.26,
            0.587,
            0.292
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.26,
                  0.587,
                  0.292
                ],
                "normalized_bbox": [
                  0.44,
                  0.26,
                  0.587,
                  0.292
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 18\"-P-0774-25CS2P (type: pipe)"
        }
      },
      {
        "id": "Pipe-6",
        "type": "pipe",
        "label": "3\"-P-0775-25CS2P",
        "bbox": [
          0.66,
          0.26,
          0.807,
          0.292
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '3\"-P-0775-25CS2P' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "3\"-P-0775-25CS2P",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.66,
            0.26,
            0.807,
            0.292
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.66,
                  0.26,
                  0.807,
                  0.292
                ],
                "normalized_bbox": [
                  0.66,
                  0.26,
                  0.807,
                  0.292
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 3\"-P-0775-25CS2P (type: pipe)"
        }
      },
      {
        "id": "Pipe-7",
        "type": "pipe",
        "label": "PP",
        "bbox": [
          0.82,
          0.26,
          0.867,
          0.292
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text 'PP' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "PP",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.82,
            0.26,
            0.867,
            0.292
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.82,
                  0.26,
                  0.867,
                  0.292
                ],
                "normalized_bbox": [
                  0.82,
                  0.26,
                  0.867,
                  0.292
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "PP",
          "detection_quality": "excellent",
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PP"
        }
      },
      {
        "id": "Pipe-8",
        "type": "pipe",
        "label": "12\"-P-0776-25CS2P",
        "bbox": [
          0.66,
          0.44,
          0.807,
          0.472
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '12\"-P-0776-25CS2P' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "12\"-P-0776-25CS2P",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.66,
            0.44,
            0.807,
            0.472
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.66,
                  0.44,
                  0.807,
                  0.472
                ],
                "normalized_bbox": [
                  0.66,
                  0.44,
                  0.807,
                  0.472
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 12\"-P-0776-25CS2P (type: pipe)"
        }
      },
      {
        "id": "Pipe-9",
        "type": "pipe",
        "label": "PP",
        "bbox": [
          0.82,
          0.44,
          0.867,
          0.472
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text 'PP' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "PP",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.82,
            0.44,
            0.867,
            0.472
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.82,
                  0.44,
                  0.867,
                  0.472
                ],
                "normalized_bbox": [
                  0.82,
                  0.44,
                  0.867,
                  0.472
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "PP",
          "detection_quality": "excellent",
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PP"
        }
      },
      {
        "id": "Pipe-10",
        "type": "pipe",
        "label": "4\"-P-0777-25CS2P",
        "bbox": [
          0.66,
          0.86,
          0.807,
          0.892
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '4\"-P-0777-25CS2P' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "4\"-P-0777-25CS2P",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.66,
            0.86,
            0.807,
            0.892
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.66,
                  0.86,
                  0.807,
                  0.892
                ],
                "normalized_bbox": [
                  0.66,
                  0.86,
                  0.807,
                  0.892
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 4\"-P-0777-25CS2P (type: pipe)"
        }
      },
      {
        "id": "Pipe-11",
        "type": "pipe",
        "label": "PP",
        "bbox": [
          0.82,
          0.86,
          0.867,
          0.892
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text 'PP' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "PP",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.82,
            0.86,
            0.867,
            0.892
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.82,
                  0.86,
                  0.867,
                  0.892
                ],
                "normalized_bbox": [
                  0.82,
                  0.86,
                  0.867,
                  0.892
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": "PP",
          "detection_quality": "excellent",
          "isa_measured_variable": "Pressure",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PP"
        }
      },
      {
        "id": "Text-NOTE10",
        "type": "text_annotation",
        "label": "NOTE 10",
        "bbox": [
          0.059,
          0.05,
          0.106,
          0.07
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 10'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.059,
            0.05,
            0.106,
            0.07
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.059,
                  0.05,
                  0.106,
                  0.07
                ],
                "normalized_bbox": [
                  0.059,
                  0.05,
                  0.106,
                  0.07
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
        "id": "Text-PV",
        "type": "valve_control",
        "label": "PV",
        "bbox": [
          0.12,
          0.08,
          0.14,
          0.09
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'PV'.",
          "description": "Pressure Valve annotation",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.12,
            0.08,
            0.14,
            0.09
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.08,
                  0.14,
                  0.09
                ],
                "normalized_bbox": [
                  0.12,
                  0.08,
                  0.14,
                  0.09
                ]
              }
            }
          ],
          "hvac_subsystem": "controls",
          "component_category": "controls",
          "isa_function": "CV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Control",
          "isa_modifier": "Valve",
          "isa_confidence": 0.8,
          "isa_reasoning": "Inferred from component type: valve_control"
        }
      },
      {
        "id": "Text-DETAIL12",
        "type": "text_annotation",
        "label": "DETAIL 12",
        "bbox": [
          0.12,
          0.09,
          0.16,
          0.1
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'DETAIL 12'.",
          "description": "Drawing detail reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.12,
            0.09,
            0.16,
            0.1
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.09,
                  0.16,
                  0.1
                ],
                "normalized_bbox": [
                  0.12,
                  0.09,
                  0.16,
                  0.1
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "DE",
          "detection_quality": "excellent",
          "isa_measured_variable": "Density/Specific Gravity",
          "isa_modifier": "Element/Sensor",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: DETAIL-12"
        }
      },
      {
        "id": "Text-NOTES1819",
        "type": "text_annotation",
        "label": "NOTES 18,19",
        "bbox": [
          0.17,
          0.13,
          0.22,
          0.14
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTES 18,19'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.17,
            0.13,
            0.22,
            0.14
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.13,
                  0.22,
                  0.14
                ],
                "normalized_bbox": [
                  0.17,
                  0.13,
                  0.22,
                  0.14
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTES-18,19"
        }
      },
      {
        "id": "Text-NOTE8",
        "type": "text_annotation",
        "label": "NOTE 8",
        "bbox": [
          0.25,
          0.08,
          0.28,
          0.09
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 8'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.25,
            0.08,
            0.28,
            0.09
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.25,
                  0.08,
                  0.28,
                  0.09
                ],
                "normalized_bbox": [
                  0.25,
                  0.08,
                  0.28,
                  0.09
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
        "id": "Text-18x16",
        "type": "text_annotation",
        "label": "18\"x16\"",
        "bbox": [
          0.12,
          0.14,
          0.16,
          0.15
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation '18\"x16\"'.",
          "description": "Dimension annotation",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.12,
            0.14,
            0.16,
            0.15
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.14,
                  0.16,
                  0.15
                ],
                "normalized_bbox": [
                  0.12,
                  0.14,
                  0.16,
                  0.15
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
          "isa_reasoning": "No ISA pattern detected for: 18\"X16\" (type: text_annotation)"
        }
      },
      {
        "id": "Text-ACAFOTSO",
        "type": "text_annotation",
        "label": "AC/AFO/TSO",
        "bbox": [
          0.17,
          0.17,
          0.23,
          0.18
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'AC/AFO/TSO'.",
          "description": "Control logic/valve action annotation",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.17,
            0.17,
            0.23,
            0.18
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.17,
                  0.17,
                  0.23,
                  0.18
                ],
                "normalized_bbox": [
                  0.17,
                  0.17,
                  0.23,
                  0.18
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "AC",
          "detection_quality": "excellent",
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Control",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AC/AFO/TSO"
        }
      },
      {
        "id": "Text-SELFDRAINING",
        "type": "text_annotation",
        "label": "SELF DRAINING",
        "bbox": [
          0.33,
          0.17,
          0.38,
          0.18
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'SELF DRAINING'.",
          "description": "Pipe configuration annotation",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.33,
            0.17,
            0.38,
            0.18
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.33,
                  0.17,
                  0.38,
                  0.18
                ],
                "normalized_bbox": [
                  0.33,
                  0.17,
                  0.38,
                  0.18
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SE",
          "detection_quality": "excellent",
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Element/Sensor",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: SELF-DRAINING"
        }
      },
      {
        "id": "Text-NOTE17",
        "type": "text_annotation",
        "label": "NOTE 17",
        "bbox": [
          0.12,
          0.29,
          0.16,
          0.3
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 17'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.12,
            0.29,
            0.16,
            0.3
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.346Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.29,
                  0.16,
                  0.3
                ],
                "normalized_bbox": [
                  0.12,
                  0.29,
                  0.16,
                  0.3
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
        "id": "Text-FF-1",
        "type": "text_annotation",
        "label": "FF",
        "bbox": [
          0.12,
          0.39,
          0.14,
          0.4
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'FF', likely indicating a function block or feedforward control.",
          "description": "Function block / Feedforward",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.12,
            0.39,
            0.14,
            0.4
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.39,
                  0.14,
                  0.4
                ],
                "normalized_bbox": [
                  0.12,
                  0.39,
                  0.14,
                  0.4
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FF",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Ratio",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FF"
        }
      },
      {
        "id": "Text-FF-2",
        "type": "text_annotation",
        "label": "FF",
        "bbox": [
          0.23,
          0.39,
          0.25,
          0.4
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'FF', likely indicating a function block or feedforward control.",
          "description": "Function block / Feedforward",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.23,
            0.39,
            0.25,
            0.4
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.39,
                  0.25,
                  0.4
                ],
                "normalized_bbox": [
                  0.23,
                  0.39,
                  0.25,
                  0.4
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FF",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Ratio",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FF"
        }
      },
      {
        "id": "Text-NOTE3-1",
        "type": "text_annotation",
        "label": "NOTE 3",
        "bbox": [
          0.12,
          0.52,
          0.16,
          0.53
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 3'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.12,
            0.52,
            0.16,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.52,
                  0.16,
                  0.53
                ],
                "normalized_bbox": [
                  0.12,
                  0.52,
                  0.16,
                  0.53
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
        "id": "Text-FF-3",
        "type": "text_annotation",
        "label": "FF",
        "bbox": [
          0.23,
          0.52,
          0.25,
          0.53
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'FF', likely indicating a function block or feedforward control.",
          "description": "Function block / Feedforward",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.23,
            0.52,
            0.25,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.52,
                  0.25,
                  0.53
                ],
                "normalized_bbox": [
                  0.23,
                  0.52,
                  0.25,
                  0.53
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FF",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Ratio",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FF"
        }
      },
      {
        "id": "Text-NOTE2",
        "type": "text_annotation",
        "label": "NOTE 2",
        "bbox": [
          0.23,
          0.65,
          0.27,
          0.66
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 2'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.23,
            0.65,
            0.27,
            0.66
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.65,
                  0.27,
                  0.66
                ],
                "normalized_bbox": [
                  0.23,
                  0.65,
                  0.27,
                  0.66
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
        "id": "Text-RTD-1",
        "type": "text_annotation",
        "label": "RTD",
        "bbox": [
          0.29,
          0.68,
          0.31,
          0.69
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'RTD', specifying the type of temperature element.",
          "description": "Resistance Temperature Detector",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.68,
            0.31,
            0.69
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.68,
                  0.31,
                  0.69
                ],
                "normalized_bbox": [
                  0.29,
                  0.68,
                  0.31,
                  0.69
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "RT",
          "detection_quality": "excellent",
          "isa_measured_variable": "Radiation",
          "isa_modifier": "Transmit",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: RTD"
        }
      },
      {
        "id": "Text-NOTE3-2",
        "type": "text_annotation",
        "label": "NOTE 3",
        "bbox": [
          0.29,
          0.77,
          0.31,
          0.78
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 3'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.77,
            0.31,
            0.78
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.77,
                  0.31,
                  0.78
                ],
                "normalized_bbox": [
                  0.29,
                  0.77,
                  0.31,
                  0.78
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
        "id": "Text-SP-1",
        "type": "text_annotation",
        "label": "SP",
        "bbox": [
          0.12,
          0.79,
          0.14,
          0.8
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'SP', indicating a setpoint.",
          "description": "Setpoint",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.12,
            0.79,
            0.14,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.79,
                  0.14,
                  0.8
                ],
                "normalized_bbox": [
                  0.12,
                  0.79,
                  0.14,
                  0.8
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SP",
          "detection_quality": "excellent",
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: SP"
        }
      },
      {
        "id": "Text-NOTE9",
        "type": "text_annotation",
        "label": "NOTE 9",
        "bbox": [
          0.12,
          0.82,
          0.16,
          0.83
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 9'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.12,
            0.82,
            0.16,
            0.83
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.82,
                  0.16,
                  0.83
                ],
                "normalized_bbox": [
                  0.12,
                  0.82,
                  0.16,
                  0.83
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
        "id": "Text-FF-4",
        "type": "text_annotation",
        "label": "FF",
        "bbox": [
          0.23,
          0.86,
          0.25,
          0.87
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'FF', likely indicating a function block or feedforward control.",
          "description": "Function block / Feedforward",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.23,
            0.86,
            0.25,
            0.87
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.86,
                  0.25,
                  0.87
                ],
                "normalized_bbox": [
                  0.23,
                  0.86,
                  0.25,
                  0.87
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FF",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Ratio",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FF"
        }
      },
      {
        "id": "Text-NOTE13-1",
        "type": "text_annotation",
        "label": "NOTE 13",
        "bbox": [
          0.44,
          0.2,
          0.48,
          0.21
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 13'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.2,
            0.48,
            0.21
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.2,
                  0.48,
                  0.21
                ],
                "normalized_bbox": [
                  0.44,
                  0.2,
                  0.48,
                  0.21
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
        "id": "Text-NOTE13-2",
        "type": "text_annotation",
        "label": "NOTE 13",
        "bbox": [
          0.55,
          0.2,
          0.59,
          0.21
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 13'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.55,
            0.2,
            0.59,
            0.21
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.2,
                  0.59,
                  0.21
                ],
                "normalized_bbox": [
                  0.55,
                  0.2,
                  0.59,
                  0.21
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
        "id": "Text-FF-5",
        "type": "text_annotation",
        "label": "FF",
        "bbox": [
          0.49,
          0.44,
          0.51,
          0.45
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'FF', likely indicating a function block or feedforward control.",
          "description": "Function block / Feedforward",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.49,
            0.44,
            0.51,
            0.45
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.44,
                  0.51,
                  0.45
                ],
                "normalized_bbox": [
                  0.49,
                  0.44,
                  0.51,
                  0.45
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FF",
          "detection_quality": "excellent",
          "isa_measured_variable": "Flow",
          "isa_modifier": "Ratio",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: FF"
        }
      },
      {
        "id": "Text-SP-2",
        "type": "text_annotation",
        "label": "SP",
        "bbox": [
          0.49,
          0.59,
          0.51,
          0.6
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'SP', indicating a setpoint.",
          "description": "Setpoint",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.49,
            0.59,
            0.51,
            0.6
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.347Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.59,
                  0.51,
                  0.6
                ],
                "normalized_bbox": [
                  0.49,
                  0.59,
                  0.51,
                  0.6
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SP",
          "detection_quality": "excellent",
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Point (Test Connection)",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: SP"
        }
      },
      {
        "id": "Text-NON-SLAM",
        "type": "text_annotation",
        "label": "NON-SLAM (NOZZLE CHECK TYPE)",
        "bbox": [
          0.44,
          0.68,
          0.58,
          0.7
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NON-SLAM (NOZZLE CHECK TYPE)', describing the check valve.",
          "description": "Check valve type specification",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.68,
            0.58,
            0.7
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.348Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.68,
                  0.58,
                  0.7
                ],
                "normalized_bbox": [
                  0.44,
                  0.68,
                  0.58,
                  0.7
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
          "isa_reasoning": "Partial ISA pattern match from label: NON-SLAM-(NOZZLE-CHECK-TYPE)"
        }
      },
      {
        "id": "Text-NOTE14",
        "type": "text_annotation",
        "label": "NOTE 14",
        "bbox": [
          0.44,
          0.7,
          0.48,
          0.71
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 14'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.7,
            0.48,
            0.71
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.349Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.7,
                  0.48,
                  0.71
                ],
                "normalized_bbox": [
                  0.44,
                  0.7,
                  0.48,
                  0.71
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
        "id": "Text-RTD-2",
        "type": "text_annotation",
        "label": "RTD",
        "bbox": [
          0.44,
          0.55,
          0.46,
          0.56
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'RTD', specifying the type of temperature element.",
          "description": "Resistance Temperature Detector",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.44,
            0.55,
            0.46,
            0.56
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.349Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.55,
                  0.46,
                  0.56
                ],
                "normalized_bbox": [
                  0.44,
                  0.55,
                  0.46,
                  0.56
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "RT",
          "detection_quality": "excellent",
          "isa_measured_variable": "Radiation",
          "isa_modifier": "Transmit",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: RTD"
        }
      },
      {
        "id": "Text-SLOPE",
        "type": "text_annotation",
        "label": "SLOPE",
        "bbox": [
          0.91,
          0.47,
          0.94,
          0.48
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'SLOPE', indicating pipe slope.",
          "description": "Pipe slope indication",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.91,
            0.47,
            0.94,
            0.48
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.349Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.91,
                  0.47,
                  0.94,
                  0.48
                ],
                "normalized_bbox": [
                  0.91,
                  0.47,
                  0.94,
                  0.48
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SL",
          "detection_quality": "excellent",
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Low",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: SLOPE"
        }
      },
      {
        "id": "Text-SET@3750",
        "type": "text_annotation",
        "label": "SET @ 3750",
        "bbox": [
          0.87,
          0.65,
          0.92,
          0.66
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'SET @ 3750', indicating a setpoint value.",
          "description": "Setpoint value annotation",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.87,
            0.65,
            0.92,
            0.66
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.349Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.87,
                  0.65,
                  0.92,
                  0.66
                ],
                "normalized_bbox": [
                  0.87,
                  0.65,
                  0.92,
                  0.66
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SE",
          "detection_quality": "excellent",
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Element/Sensor",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: SET-@-3750"
        }
      },
      {
        "id": "Text-SET@3938",
        "type": "text_annotation",
        "label": "SET @ 3938",
        "bbox": [
          0.87,
          0.93,
          0.92,
          0.94
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a textual annotation 'SET @ 3938', indicating a setpoint value.",
          "description": "Setpoint value annotation",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.87,
            0.93,
            0.92,
            0.94
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.349Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.87,
                  0.93,
                  0.92,
                  0.94
                ],
                "normalized_bbox": [
                  0.87,
                  0.93,
                  0.92,
                  0.94
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SE",
          "detection_quality": "excellent",
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Element/Sensor",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: SET-@-3938"
        }
      },
      {
        "id": "Pipe-12",
        "type": "pipe",
        "label": "20\"-P-0798-15CS2P",
        "bbox": [
          0.001,
          0.44,
          0.14,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected text '20\"-P-0798-15CS2P' adjacent to a process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "20\"-P-0798-15CS2P",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.001,
            0.44,
            0.14,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.350Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.001,
                  0.44,
                  0.14,
                  0.47
                ],
                "normalized_bbox": [
                  0.001,
                  0.44,
                  0.14,
                  0.47
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 20\"-P-0798-15CS2P (type: pipe)"
        }
      },
      {
        "id": "Pipe-13",
        "type": "pipe",
        "label": "16'-P-0774-25CS2P",
        "bbox": [
          0.39,
          0.22,
          0.43,
          0.41
        ],
        "confidence": 0.9,
        "rotation": 270,
        "meta": {
          "reasoning": "Detected text '16'-P-0774-25CS2P' adjacent to a vertical process line, indicating pipe specification.",
          "description": "Pipe specification",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "tag": "16'-P-0774-25CS2P",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.39,
            0.22,
            0.43,
            0.41
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.350Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.22,
                  0.43,
                  0.41
                ],
                "normalized_bbox": [
                  0.39,
                  0.22,
                  0.43,
                  0.41
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 16'-P-0774-25CS2P (type: pipe)"
        }
      },
      {
        "id": "Text-NOTE15",
        "type": "text_annotation",
        "label": "NOTE 15",
        "bbox": [
          0.39,
          0.41,
          0.43,
          0.45
        ],
        "confidence": 0.99,
        "rotation": 270,
        "meta": {
          "reasoning": "Identified as a textual annotation 'NOTE 15'.",
          "description": "General note reference",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.39,
            0.41,
            0.43,
            0.45
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.350Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.41,
                  0.43,
                  0.45
                ],
                "normalized_bbox": [
                  0.39,
                  0.41,
                  0.43,
                  0.45
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
        "id": "Text-MIN5D",
        "type": "text_annotation",
        "label": "MIN. 5D",
        "bbox": [
          0.49,
          0.59,
          0.51,
          0.63
        ],
        "confidence": 0.99,
        "rotation": 270,
        "meta": {
          "reasoning": "Identified as a textual annotation 'MIN. 5D', indicating a minimum pipe length requirement.",
          "description": "Minimum pipe length for instrument installation",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.49,
            0.59,
            0.51,
            0.63
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T06:58:04.350Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.59,
                  0.51,
                  0.63
                ],
                "normalized_bbox": [
                  0.49,
                  0.59,
                  0.51,
                  0.63
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "MI",
          "detection_quality": "excellent",
          "isa_measured_variable": "Moisture/Humidity",
          "isa_modifier": "Indicate",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: MIN.-5D"
        }
      }
    ],
    "connections": [
      {
        "id": "1767596284361-w34me9fcz",
        "from_id": "PV-0027",
        "to_id": "ZC-0027",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "instrument_logic",
          "from_label": "PV-0027",
          "to_label": "ZC-0027"
        }
      },
      {
        "id": "1767596284361-8b70sohbx",
        "from_id": "FIT-0007A",
        "to_id": "FE-0007",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "sensor_flow",
          "from_label": "FIT-0007A",
          "to_label": "FE-0007"
        }
      },
      {
        "id": "1767596284361-i52sw99of",
        "from_id": "FE-0007",
        "to_id": "FIT-0007B",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "sensor_flow",
          "from_label": "FE-0007",
          "to_label": "FIT-0007B"
        }
      },
      {
        "id": "1767596284361-mm5q3lzpo",
        "from_id": "PIT-0023",
        "to_id": "PI-0023",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_pressure",
          "to_component_type": "sensor_pressure",
          "from_label": "PIT-0023",
          "to_label": "PI-0023"
        }
      },
      {
        "id": "1767596284361-vap6xffow",
        "from_id": "TIT-0025",
        "to_id": "TI-0025H",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TIT-0025",
          "to_label": "TI-0025H"
        }
      },
      {
        "id": "1767596284361-hn5jfapmx",
        "from_id": "TE-0025",
        "to_id": "TIT-0025",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE-0025",
          "to_label": "TIT-0025"
        }
      },
      {
        "id": "1767596284361-10j0bmd64",
        "from_id": "PDIT-0022",
        "to_id": "PDI-0022H",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "electric_signal",
          "type_confidence": 0.92,
          "type_reasoning": "Transmitter signal to indicator display",
          "from_component_type": "instrument_transmitter",
          "to_component_type": "instrument_indicator",
          "from_label": "PDIT-0022",
          "to_label": "PDI-0022H"
        }
      },
      {
        "id": "1767596284361-1ykd1hhtz",
        "from_id": "PIT-0033",
        "to_id": "PIC-0033",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_pressure",
          "to_component_type": "sensor_pressure",
          "from_label": "PIT-0033",
          "to_label": "PIC-0033"
        }
      },
      {
        "id": "1767596284361-wtzwqjevf",
        "from_id": "TE-0026",
        "to_id": "TIT-0026",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TE-0026",
          "to_label": "TIT-0026"
        }
      },
      {
        "id": "1767596284362-f2ybyo8dz",
        "from_id": "Pipe-1",
        "to_id": "CSO-1",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.85,
          "type_reasoning": "Pipe to valve process flow",
          "from_component_type": "pipe",
          "to_component_type": "valve_gate",
          "from_label": "1-1/2\" D 15CS2P",
          "to_label": "CSO"
        }
      },
      {
        "id": "1767596284362-aaas8hyaa",
        "from_id": "CSO-1",
        "to_id": "CSO-2",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "valve_gate",
          "from_label": "CSO",
          "to_label": "CSO"
        }
      },
      {
        "id": "1767596284362-iuluv8obs",
        "from_id": "CSO-2",
        "to_id": "Pipe-3",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "process_flow",
          "type_confidence": 0.85,
          "type_reasoning": "Valve to pipe process flow",
          "from_component_type": "valve_gate",
          "to_component_type": "pipe",
          "from_label": "CSO",
          "to_label": "1-1/2\" D"
        }
      },
      {
        "id": "1767596284362-1suy958kc",
        "from_id": "Pipe-3",
        "to_id": "Pipe-4",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pipe",
          "from_label": "1-1/2\" D",
          "to_label": "1 1/2\" PP"
        }
      },
      {
        "id": "1767596284362-c50haldf1",
        "from_id": "Pipe-4",
        "to_id": "Pipe-5",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pipe",
          "from_label": "1 1/2\" PP",
          "to_label": "18\"-P-0774-25CS2P"
        }
      },
      {
        "id": "1767596284362-0o2zvkfgc",
        "from_id": "Pipe-5",
        "to_id": "Pipe-6",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pipe",
          "from_label": "18\"-P-0774-25CS2P",
          "to_label": "3\"-P-0775-25CS2P"
        }
      },
      {
        "id": "1767596284362-0x34tvogw",
        "from_id": "Pipe-6",
        "to_id": "Pipe-7",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pipe",
          "from_label": "3\"-P-0775-25CS2P",
          "to_label": "PP"
        }
      },
      {
        "id": "1767596284362-m17vlemnl",
        "from_id": "Pipe-5",
        "to_id": "Pipe-8",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pipe",
          "from_label": "18\"-P-0774-25CS2P",
          "to_label": "12\"-P-0776-25CS2P"
        }
      },
      {
        "id": "1767596284362-pbms71otj",
        "from_id": "Pipe-8",
        "to_id": "Pipe-9",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pipe",
          "from_label": "12\"-P-0776-25CS2P",
          "to_label": "PP"
        }
      },
      {
        "id": "1767596284362-ahceuom3p",
        "from_id": "Pipe-5",
        "to_id": "Pipe-10",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pipe",
          "from_label": "18\"-P-0774-25CS2P",
          "to_label": "4\"-P-0777-25CS2P"
        }
      },
      {
        "id": "1767596284362-z7enlwtz8",
        "from_id": "Pipe-10",
        "to_id": "Pipe-11",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pipe",
          "from_label": "4\"-P-0777-25CS2P",
          "to_label": "PP"
        }
      },
      {
        "id": "1767596284362-9b1rc90hw",
        "from_id": "Pipe-12",
        "to_id": "FIT-0007A",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "sensor_flow",
          "from_label": "20\"-P-0798-15CS2P",
          "to_label": "FIT-0007A"
        }
      },
      {
        "id": "1767596284362-oajld1p9l",
        "from_id": "FIT-0007A",
        "to_id": "FE-0007",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "sensor_flow",
          "from_label": "FIT-0007A",
          "to_label": "FE-0007"
        }
      },
      {
        "id": "1767596284362-wy7j4apsa",
        "from_id": "FE-0007",
        "to_id": "FIT-0007B",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "sensor_flow",
          "from_label": "FE-0007",
          "to_label": "FIT-0007B"
        }
      },
      {
        "id": "1767596284362-881r8ndpy",
        "from_id": "Pipe-12",
        "to_id": "PI-0023",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "sensor_pressure",
          "from_label": "20\"-P-0798-15CS2P",
          "to_label": "PI-0023"
        }
      },
      {
        "id": "1767596284362-cvo2gstkk",
        "from_id": "PI-0023",
        "to_id": "PIT-0023",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_pressure",
          "to_component_type": "sensor_pressure",
          "from_label": "PI-0023",
          "to_label": "PIT-0023"
        }
      },
      {
        "id": "1767596284362-yg7ykzgmh",
        "from_id": "Pipe-12",
        "to_id": "TI-0025H",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "sensor_temperature",
          "from_label": "20\"-P-0798-15CS2P",
          "to_label": "TI-0025H"
        }
      },
      {
        "id": "1767596284362-deb6e7cpv",
        "from_id": "TI-0025H",
        "to_id": "TIT-0025",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TI-0025H",
          "to_label": "TIT-0025"
        }
      },
      {
        "id": "1767596284362-m5phvi4tn",
        "from_id": "TIT-0025",
        "to_id": "TE-0025",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TIT-0025",
          "to_label": "TE-0025"
        }
      },
      {
        "id": "1767596284362-rjpmtbpyo",
        "from_id": "TE-0025",
        "to_id": "V-1",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "valve_control",
          "from_label": "TE-0025",
          "to_label": "V"
        }
      },
      {
        "id": "1767596284362-ai84h9c51",
        "from_id": "V-1",
        "to_id": "CSO-4",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "valve_gate",
          "from_label": "V",
          "to_label": "CSO"
        }
      },
      {
        "id": "1767596284362-9kwpiu1fc",
        "from_id": "CSO-4",
        "to_id": "PDIT-0022",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_gate",
          "to_component_type": "instrument_transmitter",
          "from_label": "CSO",
          "to_label": "PDIT-0022"
        }
      },
      {
        "id": "1767596284362-pyn14qof4",
        "from_id": "PDIT-0022",
        "to_id": "PDI-0022H",
        "type": "electric_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "electric_signal",
          "type_confidence": 0.92,
          "type_reasoning": "Transmitter signal to indicator display",
          "from_component_type": "instrument_transmitter",
          "to_component_type": "instrument_indicator",
          "from_label": "PDIT-0022",
          "to_label": "PDI-0022H",
          "original_type": "chilled_water",
          "corrected": true,
          "correction_reasoning": "Transmitter signal to indicator display"
        }
      },
      {
        "id": "1767596284362-am6n6yw10",
        "from_id": "Pipe-13",
        "to_id": "PIT-0033",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "sensor_pressure",
          "from_label": "16'-P-0774-25CS2P",
          "to_label": "PIT-0033"
        }
      },
      {
        "id": "1767596284362-9r4he3br2",
        "from_id": "PIT-0033",
        "to_id": "CheckValve-1",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_pressure",
          "to_component_type": "valve_check",
          "from_label": "PIT-0033",
          "to_label": "Check Valve"
        }
      },
      {
        "id": "1767596284362-02fws3srl",
        "from_id": "CheckValve-1",
        "to_id": "CSO-3",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_check",
          "to_component_type": "valve_gate",
          "from_label": "Check Valve",
          "to_label": "CSO"
        }
      },
      {
        "id": "1767596284362-jdcjakg6t",
        "from_id": "Pipe-13",
        "to_id": "TIT-0026",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "sensor_temperature",
          "from_label": "16'-P-0774-25CS2P",
          "to_label": "TIT-0026"
        }
      },
      {
        "id": "1767596284362-uheiyw20s",
        "from_id": "TIT-0026",
        "to_id": "TE-0026",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TIT-0026",
          "to_label": "TE-0026"
        }
      },
      {
        "id": "inferred-path-CSO-1-Pipe-3",
        "from_id": "CSO-1",
        "to_id": "Pipe-3",
        "type": "process_flow",
        "confidence": 0.7224999999999999,
        "reasoning": "Path-traced: Valve to pipe process flow",
        "inferred": true,
        "meta": {
          "distance": 0.04054935264588083,
          "method": "path_tracing"
        }
      }
    ],
    "metadata": {
      "total_components": 66,
      "total_connections": 37,
      "enhancement": {
        "isa_detection_enabled": true,
        "isa_functions_detected": 55,
        "isa_detection_rate": 0.8333333333333334,
        "connection_inference_enabled": true,
        "inferred_connections": 1,
        "validation_enabled": true,
        "validation_issues": 10,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 31
      },
      "control_loops": [],
      "validation_issues": [
        {
          "connection": {
            "id": "1767596284362-f2ybyo8dz",
            "from_id": "Pipe-1",
            "to_id": "CSO-1",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.85,
              "type_reasoning": "Pipe to valve process flow",
              "from_component_type": "pipe",
              "to_component_type": "valve_gate",
              "from_label": "1-1/2\" D 15CS2P",
              "to_label": "CSO"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got chilled_water",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-iuluv8obs",
            "from_id": "CSO-2",
            "to_id": "Pipe-3",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "process_flow",
              "type_confidence": 0.85,
              "type_reasoning": "Valve to pipe process flow",
              "from_component_type": "valve_gate",
              "to_component_type": "pipe",
              "from_label": "CSO",
              "to_label": "1-1/2\" D"
            }
          },
          "issue": "Connection type mismatch: expected process_flow, got chilled_water",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-oajld1p9l",
            "from_id": "FIT-0007A",
            "to_id": "FE-0007",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "sensor_flow",
              "to_component_type": "sensor_flow",
              "from_label": "FIT-0007A",
              "to_label": "FE-0007"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-wy7j4apsa",
            "from_id": "FE-0007",
            "to_id": "FIT-0007B",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "sensor_flow",
              "to_component_type": "sensor_flow",
              "from_label": "FE-0007",
              "to_label": "FIT-0007B"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-cvo2gstkk",
            "from_id": "PI-0023",
            "to_id": "PIT-0023",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "sensor_pressure",
              "to_component_type": "sensor_pressure",
              "from_label": "PI-0023",
              "to_label": "PIT-0023"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-deb6e7cpv",
            "from_id": "TI-0025H",
            "to_id": "TIT-0025",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "sensor_temperature",
              "to_component_type": "sensor_temperature",
              "from_label": "TI-0025H",
              "to_label": "TIT-0025"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-m5phvi4tn",
            "from_id": "TIT-0025",
            "to_id": "TE-0025",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "sensor_temperature",
              "to_component_type": "sensor_temperature",
              "from_label": "TIT-0025",
              "to_label": "TE-0025"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-pyn14qof4",
            "from_id": "PDIT-0022",
            "to_id": "PDI-0022H",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "electric_signal",
              "type_confidence": 0.92,
              "type_reasoning": "Transmitter signal to indicator display",
              "from_component_type": "instrument_transmitter",
              "to_component_type": "instrument_indicator",
              "from_label": "PDIT-0022",
              "to_label": "PDI-0022H"
            }
          },
          "issue": "Connection type mismatch: expected electric_signal, got chilled_water",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-pyn14qof4",
            "from_id": "PDIT-0022",
            "to_id": "PDI-0022H",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "electric_signal",
              "type_confidence": 0.92,
              "type_reasoning": "Transmitter signal to indicator display",
              "from_component_type": "instrument_transmitter",
              "to_component_type": "instrument_indicator",
              "from_label": "PDIT-0022",
              "to_label": "PDI-0022H"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767596284362-uheiyw20s",
            "from_id": "TIT-0026",
            "to_id": "TE-0026",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "sensor_temperature",
              "to_component_type": "sensor_temperature",
              "from_label": "TIT-0026",
              "to_label": "TE-0026"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        }
      ],
      "quality_metrics": {
        "overall_score": 0.8627121212121214,
        "detection_quality": 1,
        "isa_completeness": 0.8333333333333334,
        "connection_coverage": 0.5757575757575758,
        "confidence_avg": 0.9640909090909097,
        "metrics": {
          "total_components": 66,
          "total_connections": 38,
          "isa_functions_detected": 55,
          "excellent_detections": 66,
          "avg_confidence": 0.9640909090909097
        }
      }
    }
  }
}






Step 1: Classifying document...
classifier.ts:31 Classification cache hit
index.ts:33 ["Classification result:",{"type":"SCHEMATIC","confidence":0.95,"reasoning":"Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"}]
index.ts:33 Step 2: Routing to pipeline...
index.ts:33 ["Selected pipeline:","visual"]
index.ts:33 Step 3: Executing pipeline...
visual.ts:79 Detecting blueprint type (P&ID vs HVAC)...
client.ts:40 [AI Client] Initialized in Proxy Mode. Forwarding to: http://localhost:4000
visual.ts:81 Blueprint type detected: PID
visual.ts:92 Using standard single-pass analysis
visual.ts:97 [Visual Pipeline] Applying enhancements...
visual-enhancements.ts:37 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:45 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:50 [Enhancement] ISA detection complete: 55/66 components have ISA functions (83%)
visual-enhancements.ts:58 [Enhancement] Enhancing connections...
visual-enhancements.ts:64 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:73 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:82 [Enhancement] Discovered 1 additional connections via path tracing
visual-enhancements.ts:90 [Enhancement] Validating connections...
visual-enhancements.ts:96 
 [Enhancement] Connection validation found 10 issues (0 errors, 10 warnings)
enhanceVisualAnalysis	@	visual-enhancements.ts:96
visual-enhancements.ts:102 [Enhancement] Auto-correcting connection type mismatches...
connection-engine.ts:932 
 Correcting connection type: 1767596284362-pyn14qof4 from 'chilled_water' to 'electric_signal'
(anonymous)	@	connection-engine.ts:932
visual-enhancements.ts:110 [Enhancement] Detecting control loops...
visual-enhancements.ts:112 [Enhancement] Detected 0 control loops
visual-enhancements.ts:116 [Enhancement] Post-processing complete in 31ms
visual.ts:107 [Visual Pipeline] Quality Score: 0.86
index.ts:33 Pipeline execution complete
index.ts:33 ["Analysis complete:",{"document_id":"1767596208079-iita4tu18","type":"SCHEMATIC","processing_time_ms":76365,"components":66}]
index.ts:33 Step 4: Generating comprehensive final analysis report...
index.ts:113 
 Failed to generate final analysis report: ReferenceError: require is not defined
    at final-analysis.ts:13:25
analyzeDocument	@	index.ts:113
index.ts:33 Warning: Final analysis report generation failed, continuing with basic analysis
BlueprintWorkspace.tsx:86 Analysis result: 
Object
cache_hit
: 
false
classification
: 
{type: 'SCHEMATIC', confidence: 0.95, reasoning: 'Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines'}
document_id
: 
"1767596208079-iita4tu18"
document_type
: 
"SCHEMATIC"
file_name
: 
"current-image"
processing_time_ms
: 
76365
timestamp
: 
1767596284444
visual
: 
components
: 
Array(66)
0
: 
{id: 'PV-0027', type: 'valve_control', label: 'PV-0027', bbox: Array(4), confidence: 0.98, …}
1
: 
{id: 'ZC-0027', type: 'instrument_logic', label: 'ZC-0027', bbox: Array(4), confidence: 0.97, …}
2
: 
{id: 'CSO-1', type: 'valve_gate', label: 'CSO', bbox: Array(4), confidence: 0.95, …}
3
: 
{id: 'CSO-2', type: 'valve_gate', label: 'CSO', bbox: Array(4), confidence: 0.95, …}
4
: 
{id: 'FIT-0007A', type: 'sensor_flow', label: 'FIT-0007A', bbox: Array(4), confidence: 0.98, …}
5
: 
{id: 'FE-0007', type: 'sensor_flow', label: 'FE-0007', bbox: Array(4), confidence: 0.97, …}
6
: 
{id: 'FIT-0007B', type: 'sensor_flow', label: 'FIT-0007B', bbox: Array(4), confidence: 0.98, …}
7
: 
{id: 'PI-0023', type: 'sensor_pressure', label: 'PI-0023', bbox: Array(4), confidence: 0.98, …}
8
: 
{id: 'PIT-0023', type: 'sensor_pressure', label: 'PIT-0023', bbox: Array(4), confidence: 0.98, …}
9
: 
{id: 'TI-0025H', type: 'sensor_temperature', label: 'TI-0025H', bbox: Array(4), confidence: 0.98, …}
10
: 
{id: 'TIT-0025', type: 'sensor_temperature', label: 'TIT-0025', bbox: Array(4), confidence: 0.98, …}
11
: 
{id: 'TE-0025', type: 'sensor_temperature', label: 'TE-0025', bbox: Array(4), confidence: 0.97, …}
12
: 
{id: 'V-1', type: 'valve_control', label: 'V', bbox: Array(4), confidence: 0.9, …}
13
: 
{id: 'PDIT-0022', type: 'instrument_transmitter', label: 'PDIT-0022', bbox: Array(4), confidence: 0.98, …}
14
: 
{id: 'PDI-0022H', type: 'instrument_indicator', label: 'PDI-0022H', bbox: Array(4), confidence: 0.98, …}
15
: 
{id: 'PIT-0033', type: 'sensor_pressure', label: 'PIT-0033', bbox: Array(4), confidence: 0.98, …}
16
: 
{id: 'PIC-0033', type: 'sensor_pressure', label: 'PIC-0033', bbox: Array(4), confidence: 0.98, …}
17
: 
{id: 'CheckValve-1', type: 'valve_check', label: 'Check Valve', bbox: Array(4), confidence: 0.9, …}
18
: 
{id: 'CSO-3', type: 'valve_gate', label: 'CSO', bbox: Array(4), confidence: 0.95, …}
19
: 
{id: 'TIT-0026', type: 'sensor_temperature', label: 'TIT-0026', bbox: Array(4), confidence: 0.98, …}
20
: 
{id: 'TE-0026', type: 'sensor_temperature', label: 'TE-0026', bbox: Array(4), confidence: 0.97, …}
21
: 
{id: 'CSO-4', type: 'valve_gate', label: 'CSO', bbox: Array(4), confidence: 0.95, …}
22
: 
{id: 'Pipe-1', type: 'pipe', label: '1-1/2" D 15CS2P', bbox: Array(4), confidence: 0.9, …}
23
: 
{id: 'Pipe-2', type: 'pipe', label: '25CS2P', bbox: Array(4), confidence: 0.9, …}
24
: 
{id: 'Pipe-3', type: 'pipe', label: '1-1/2" D', bbox: Array(4), confidence: 0.9, …}
25
: 
{id: 'Pipe-4', type: 'pipe', label: '1 1/2" PP', bbox: Array(4), confidence: 0.9, …}
26
: 
{id: 'Pipe-5', type: 'pipe', label: '18"-P-0774-25CS2P', bbox: Array(4), confidence: 0.9, …}
27
: 
{id: 'Pipe-6', type: 'pipe', label: '3"-P-0775-25CS2P', bbox: Array(4), confidence: 0.9, …}
28
: 
{id: 'Pipe-7', type: 'pipe', label: 'PP', bbox: Array(4), confidence: 0.9, …}
29
: 
{id: 'Pipe-8', type: 'pipe', label: '12"-P-0776-25CS2P', bbox: Array(4), confidence: 0.9, …}
30
: 
{id: 'Pipe-9', type: 'pipe', label: 'PP', bbox: Array(4), confidence: 0.9, …}
31
: 
{id: 'Pipe-10', type: 'pipe', label: '4"-P-0777-25CS2P', bbox: Array(4), confidence: 0.9, …}
32
: 
{id: 'Pipe-11', type: 'pipe', label: 'PP', bbox: Array(4), confidence: 0.9, …}
33
: 
{id: 'Text-NOTE10', type: 'text_annotation', label: 'NOTE 10', bbox: Array(4), confidence: 0.99, …}
34
: 
{id: 'Text-PV', type: 'valve_control', label: 'PV', bbox: Array(4), confidence: 0.99, …}
35
: 
{id: 'Text-DETAIL12', type: 'text_annotation', label: 'DETAIL 12', bbox: Array(4), confidence: 0.99, …}
36
: 
{id: 'Text-NOTES1819', type: 'text_annotation', label: 'NOTES 18,19', bbox: Array(4), confidence: 0.99, …}
37
: 
{id: 'Text-NOTE8', type: 'text_annotation', label: 'NOTE 8', bbox: Array(4), confidence: 0.99, …}
38
: 
{id: 'Text-18x16', type: 'text_annotation', label: '18"x16"', bbox: Array(4), confidence: 0.99, …}
39
: 
{id: 'Text-ACAFOTSO', type: 'text_annotation', label: 'AC/AFO/TSO', bbox: Array(4), confidence: 0.99, …}
40
: 
{id: 'Text-SELFDRAINING', type: 'text_annotation', label: 'SELF DRAINING', bbox: Array(4), confidence: 0.99, …}
41
: 
{id: 'Text-NOTE17', type: 'text_annotation', label: 'NOTE 17', bbox: Array(4), confidence: 0.99, …}
42
: 
{id: 'Text-FF-1', type: 'text_annotation', label: 'FF', bbox: Array(4), confidence: 0.99, …}
43
: 
{id: 'Text-FF-2', type: 'text_annotation', label: 'FF', bbox: Array(4), confidence: 0.99, …}
44
: 
{id: 'Text-NOTE3-1', type: 'text_annotation', label: 'NOTE 3', bbox: Array(4), confidence: 0.99, …}
45
: 
{id: 'Text-FF-3', type: 'text_annotation', label: 'FF', bbox: Array(4), confidence: 0.99, …}
46
: 
{id: 'Text-NOTE2', type: 'text_annotation', label: 'NOTE 2', bbox: Array(4), confidence: 0.99, …}
47
: 
{id: 'Text-RTD-1', type: 'text_annotation', label: 'RTD', bbox: Array(4), confidence: 0.99, …}
48
: 
{id: 'Text-NOTE3-2', type: 'text_annotation', label: 'NOTE 3', bbox: Array(4), confidence: 0.99, …}
49
: 
{id: 'Text-SP-1', type: 'text_annotation', label: 'SP', bbox: Array(4), confidence: 0.99, …}
50
: 
{id: 'Text-NOTE9', type: 'text_annotation', label: 'NOTE 9', bbox: Array(4), confidence: 0.99, …}
51
: 
{id: 'Text-FF-4', type: 'text_annotation', label: 'FF', bbox: Array(4), confidence: 0.99, …}
52
: 
{id: 'Text-NOTE13-1', type: 'text_annotation', label: 'NOTE 13', bbox: Array(4), confidence: 0.99, …}
53
: 
{id: 'Text-NOTE13-2', type: 'text_annotation', label: 'NOTE 13', bbox: Array(4), confidence: 0.99, …}
54
: 
{id: 'Text-FF-5', type: 'text_annotation', label: 'FF', bbox: Array(4), confidence: 0.99, …}
55
: 
{id: 'Text-SP-2', type: 'text_annotation', label: 'SP', bbox: Array(4), confidence: 0.99, …}
56
: 
{id: 'Text-NON-SLAM', type: 'text_annotation', label: 'NON-SLAM (NOZZLE CHECK TYPE)', bbox: Array(4), confidence: 0.99, …}
57
: 
{id: 'Text-NOTE14', type: 'text_annotation', label: 'NOTE 14', bbox: Array(4), confidence: 0.99, …}
58
: 
{id: 'Text-RTD-2', type: 'text_annotation', label: 'RTD', bbox: Array(4), confidence: 0.99, …}
59
: 
{id: 'Text-SLOPE', type: 'text_annotation', label: 'SLOPE', bbox: Array(4), confidence: 0.99, …}
60
: 
{id: 'Text-SET@3750', type: 'text_annotation', label: 'SET @ 3750', bbox: Array(4), confidence: 0.99, …}
61
: 
{id: 'Text-SET@3938', type: 'text_annotation', label: 'SET @ 3938', bbox: Array(4), confidence: 0.99, …}
62
: 
{id: 'Pipe-12', type: 'pipe', label: '20"-P-0798-15CS2P', bbox: Array(4), confidence: 0.9, …}
63
: 
{id: 'Pipe-13', type: 'pipe', label: "16'-P-0774-25CS2P", bbox: Array(4), confidence: 0.9, …}
64
: 
{id: 'Text-NOTE15', type: 'text_annotation', label: 'NOTE 15', bbox: Array(4), confidence: 0.99, …}
65
: 
{id: 'Text-MIN5D', type: 'text_annotation', label: 'MIN. 5D', bbox: Array(4), confidence: 0.99, …}
length
: 
66
[[Prototype]]
: 
Array(0)
connections
: 
Array(38)
0
: 
{id: '1767596284361-w34me9fcz', from_id: 'PV-0027', to_id: 'ZC-0027', type: 'electric_signal', confidence: 0.9, …}
1
: 
{id: '1767596284361-8b70sohbx', from_id: 'FIT-0007A', to_id: 'FE-0007', type: 'electric_signal', confidence: 0.9, …}
2
: 
{id: '1767596284361-i52sw99of', from_id: 'FE-0007', to_id: 'FIT-0007B', type: 'electric_signal', confidence: 0.9, …}
3
: 
{id: '1767596284361-mm5q3lzpo', from_id: 'PIT-0023', to_id: 'PI-0023', type: 'electric_signal', confidence: 0.9, …}
4
: 
{id: '1767596284361-vap6xffow', from_id: 'TIT-0025', to_id: 'TI-0025H', type: 'electric_signal', confidence: 0.9, …}
5
: 
{id: '1767596284361-hn5jfapmx', from_id: 'TE-0025', to_id: 'TIT-0025', type: 'electric_signal', confidence: 0.9, …}
6
: 
{id: '1767596284361-10j0bmd64', from_id: 'PDIT-0022', to_id: 'PDI-0022H', type: 'electric_signal', confidence: 0.9, …}
7
: 
{id: '1767596284361-1ykd1hhtz', from_id: 'PIT-0033', to_id: 'PIC-0033', type: 'electric_signal', confidence: 0.9, …}
8
: 
{id: '1767596284361-wtzwqjevf', from_id: 'TE-0026', to_id: 'TIT-0026', type: 'electric_signal', confidence: 0.9, …}
9
: 
{id: '1767596284362-f2ybyo8dz', from_id: 'Pipe-1', to_id: 'CSO-1', type: 'chilled_water', confidence: 0.9, …}
10
: 
{id: '1767596284362-aaas8hyaa', from_id: 'CSO-1', to_id: 'CSO-2', type: 'chilled_water', confidence: 0.9, …}
11
: 
{id: '1767596284362-iuluv8obs', from_id: 'CSO-2', to_id: 'Pipe-3', type: 'chilled_water', confidence: 0.9, …}
12
: 
{id: '1767596284362-1suy958kc', from_id: 'Pipe-3', to_id: 'Pipe-4', type: 'chilled_water', confidence: 0.9, …}
13
: 
{id: '1767596284362-c50haldf1', from_id: 'Pipe-4', to_id: 'Pipe-5', type: 'chilled_water', confidence: 0.9, …}
14
: 
{id: '1767596284362-0o2zvkfgc', from_id: 'Pipe-5', to_id: 'Pipe-6', type: 'chilled_water', confidence: 0.9, …}
15
: 
{id: '1767596284362-0x34tvogw', from_id: 'Pipe-6', to_id: 'Pipe-7', type: 'chilled_water', confidence: 0.9, …}
16
: 
{id: '1767596284362-m17vlemnl', from_id: 'Pipe-5', to_id: 'Pipe-8', type: 'chilled_water', confidence: 0.9, …}
17
: 
{id: '1767596284362-pbms71otj', from_id: 'Pipe-8', to_id: 'Pipe-9', type: 'chilled_water', confidence: 0.9, …}
18
: 
{id: '1767596284362-ahceuom3p', from_id: 'Pipe-5', to_id: 'Pipe-10', type: 'chilled_water', confidence: 0.9, …}
19
: 
{id: '1767596284362-z7enlwtz8', from_id: 'Pipe-10', to_id: 'Pipe-11', type: 'chilled_water', confidence: 0.9, …}
20
: 
{id: '1767596284362-9b1rc90hw', from_id: 'Pipe-12', to_id: 'FIT-0007A', type: 'chilled_water', confidence: 0.9, …}
21
: 
{id: '1767596284362-oajld1p9l', from_id: 'FIT-0007A', to_id: 'FE-0007', type: 'chilled_water', confidence: 0.9, …}
22
: 
{id: '1767596284362-wy7j4apsa', from_id: 'FE-0007', to_id: 'FIT-0007B', type: 'chilled_water', confidence: 0.9, …}
23
: 
{id: '1767596284362-881r8ndpy', from_id: 'Pipe-12', to_id: 'PI-0023', type: 'chilled_water', confidence: 0.9, …}
24
: 
{id: '1767596284362-cvo2gstkk', from_id: 'PI-0023', to_id: 'PIT-0023', type: 'chilled_water', confidence: 0.9, …}
25
: 
{id: '1767596284362-yg7ykzgmh', from_id: 'Pipe-12', to_id: 'TI-0025H', type: 'chilled_water', confidence: 0.9, …}
26
: 
{id: '1767596284362-deb6e7cpv', from_id: 'TI-0025H', to_id: 'TIT-0025', type: 'chilled_water', confidence: 0.9, …}
27
: 
{id: '1767596284362-m5phvi4tn', from_id: 'TIT-0025', to_id: 'TE-0025', type: 'chilled_water', confidence: 0.9, …}
28
: 
{id: '1767596284362-rjpmtbpyo', from_id: 'TE-0025', to_id: 'V-1', type: 'chilled_water', confidence: 0.9, …}
29
: 
{id: '1767596284362-ai84h9c51', from_id: 'V-1', to_id: 'CSO-4', type: 'chilled_water', confidence: 0.9, …}
30
: 
{id: '1767596284362-9kwpiu1fc', from_id: 'CSO-4', to_id: 'PDIT-0022', type: 'chilled_water', confidence: 0.9, …}
31
: 
{id: '1767596284362-pyn14qof4', from_id: 'PDIT-0022', to_id: 'PDI-0022H', type: 'electric_signal', confidence: 0.9, …}
32
: 
{id: '1767596284362-am6n6yw10', from_id: 'Pipe-13', to_id: 'PIT-0033', type: 'chilled_water', confidence: 0.9, …}
33
: 
{id: '1767596284362-9r4he3br2', from_id: 'PIT-0033', to_id: 'CheckValve-1', type: 'chilled_water', confidence: 0.9, …}
34
: 
{id: '1767596284362-02fws3srl', from_id: 'CheckValve-1', to_id: 'CSO-3', type: 'chilled_water', confidence: 0.9, …}
35
: 
{id: '1767596284362-jdcjakg6t', from_id: 'Pipe-13', to_id: 'TIT-0026', type: 'chilled_water', confidence: 0.9, …}
36
: 
{id: '1767596284362-uheiyw20s', from_id: 'TIT-0026', to_id: 'TE-0026', type: 'chilled_water', confidence: 0.9, …}
37
: 
{id: 'inferred-path-CSO-1-Pipe-3', from_id: 'CSO-1', to_id: 'Pipe-3', type: 'process_flow', confidence: 0.7224999999999999, …}
length
: 
38
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
31
inferred_connections
: 
1
isa_detection_enabled
: 
true
isa_detection_rate
: 
0.8333333333333334
isa_functions_detected
: 
55
loop_detection_enabled
: 
true
validation_enabled
: 
true
validation_issues
: 
10
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
0.9640909090909097
connection_coverage
: 
0.5757575757575758
detection_quality
: 
1
isa_completeness
: 
0.8333333333333334
metrics
: 
avg_confidence
: 
0.9640909090909097
excellent_detections
: 
66
isa_functions_detected
: 
55
total_components
: 
66
total_connections
: 
38
[[Prototype]]
: 
Object
overall_score
: 
0.8627121212121214
[[Prototype]]
: 
Object
total_components
: 
66
total_connections
: 
37
validation_issues
: 
Array(10)
0
: 
{connection: {…}, issue: 'Connection type mismatch: expected process_flow, got chilled_water', severity: 'warning'}
1
: 
{connection: {…}, issue: 'Connection type mismatch: expected process_flow, got chilled_water', severity: 'warning'}
2
: 
{connection: {…}, issue: 'Chilled water connection between non-process components', severity: 'warning'}
3
: 
{connection: {…}, issue: 'Chilled water connection between non-process components', severity: 'warning'}
4
: 
{connection: {…}, issue: 'Chilled water connection between non-process components', severity: 'warning'}
5
: 
{connection: {…}, issue: 'Chilled water connection between non-process components', severity: 'warning'}
6
: 
{connection: {…}, issue: 'Chilled water connection between non-process components', severity: 'warning'}
7
: 
{connection: {…}, issue: 'Connection type mismatch: expected electric_signal, got chilled_water', severity: 'warning'}
8
: 
{connection: {…}, issue: 'Chilled water connection between non-process components', severity: 'warning'}
9
: 
{connection: {…}, issue: 'Chilled water connection between non-process components', severity: 'warning'}
length
: 
10
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