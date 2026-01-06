Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":1,"reasoning":"The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767681168351-drr0owjwe","type":"SCHEMATIC","processing_time_ms":69609,"components":23}]

{
  "document_id": "1767681168351-drr0owjwe",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767681237960,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 1,
    "reasoning": "The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."
  },
  "processing_time_ms": 69609,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "L-NOTE6",
        "type": "sensor_level",
        "label": "L",
        "bbox": [
          0.493,
          0.054,
          0.536,
          0.098
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with a horizontal line inside, indicating a level measurement point, and associated with the text 'L' and 'NOTE 6'.",
          "description": "Level Primary Element, associated with NOTE 6",
          "instrument_function": "Level",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "L",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.493,
            0.054,
            0.536,
            0.098
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.493,
                  0.054,
                  0.536,
                  0.098
                ],
                "normalized_bbox": [
                  0.493,
                  0.054,
                  0.536,
                  0.098
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "LT",
          "detection_quality": "excellent",
          "isa_measured_variable": "Level",
          "isa_modifier": "Transmit",
          "isa_confidence": 0.85,
          "isa_reasoning": "Inferred from component type: sensor_level"
        }
      },
      {
        "id": "1LI-12422",
        "type": "Level Indicator",
        "label": "1LI 12422",
        "bbox": [
          0.479,
          0.22,
          0.55,
          0.286
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with the ISA tag '1LI' and loop number '12422', indicating a field-mounted Level Indicator. 'H' and 'L' labels suggest high/low alarm points.",
          "description": "Level Indicator, High/Low Alarm points",
          "instrument_function": "Level Indicator",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1LI-12422",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.479,
            0.22,
            0.55,
            0.286
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.479,
                  0.22,
                  0.55,
                  0.286
                ],
                "normalized_bbox": [
                  0.479,
                  0.22,
                  0.55,
                  0.286
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "1AL",
          "detection_quality": "excellent",
          "isa_measured_variable": "Unknown",
          "isa_modifier": "Alarm Low",
          "isa_confidence": 0.75,
          "isa_reasoning": "Extracted from description: \"Level Indicator, High/Low Alarm points\""
        }
      },
      {
        "id": "1VA-120704_CV",
        "type": "valve_control",
        "label": "1VA-120704",
        "bbox": [
          0.297,
          0.14,
          0.34,
          0.183
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie valve symbol with a mushroom/diaphragm actuator, indicating a control valve. The tag '1VA-120704' is associated with the incoming line.",
          "description": "Control Valve, Diaphragm Actuated",
          "equipment_type": "Control Valve",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-120704",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.297,
            0.14,
            0.34,
            0.183
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.297,
                  0.14,
                  0.34,
                  0.183
                ],
                "normalized_bbox": [
                  0.297,
                  0.14,
                  0.34,
                  0.183
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Control",
          "isa_modifier": "Valve",
          "isa_confidence": 0.8,
          "isa_reasoning": "Inferred from component type: valve_control"
        }
      },
      {
        "id": "1VA-121271_MV",
        "type": "Manual Valve",
        "label": "1VA-121271",
        "bbox": [
          0.353,
          0.14,
          0.38,
          0.167
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie valve symbol with an 'X' indicating manual operation, likely a gate valve. The tag '1VA-121271' is associated with the adjacent line.",
          "description": "Manual Gate Valve",
          "equipment_type": "Gate Valve",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-121271",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.353,
            0.14,
            0.38,
            0.167
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.353,
                  0.14,
                  0.38,
                  0.167
                ],
                "normalized_bbox": [
                  0.353,
                  0.14,
                  0.38,
                  0.167
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
          "isa_reasoning": "No ISA pattern detected for: 1VA-121271 (type: Manual Valve)"
        }
      },
      {
        "id": "1VA-121270_MV",
        "type": "Manual Valve",
        "label": "1VA-121270",
        "bbox": [
          0.392,
          0.14,
          0.419,
          0.167
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie valve symbol with an 'X' indicating manual operation, likely a gate valve. The tag '1VA-121270' is associated with the adjacent line.",
          "description": "Manual Gate Valve",
          "equipment_type": "Gate Valve",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-121270",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.392,
            0.14,
            0.419,
            0.167
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.392,
                  0.14,
                  0.419,
                  0.167
                ],
                "normalized_bbox": [
                  0.392,
                  0.14,
                  0.419,
                  0.167
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
          "isa_reasoning": "No ISA pattern detected for: 1VA-121270 (type: Manual Valve)"
        }
      },
      {
        "id": "1LIT-12422B",
        "type": "Level Indicating Transmitter",
        "label": "1LIT 12422B",
        "bbox": [
          0.308,
          0.493,
          0.379,
          0.559
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with the ISA tag '1LIT' and loop number '12422B', indicating a field-mounted Level Indicating Transmitter. 'D/P ERS' suggests differential pressure measurement.",
          "description": "Level Indicating Transmitter, Differential Pressure",
          "instrument_function": "Level Indicating Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1LIT-12422B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.308,
            0.493,
            0.379,
            0.559
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.308,
                  0.493,
                  0.379,
                  0.559
                ],
                "normalized_bbox": [
                  0.308,
                  0.493,
                  0.379,
                  0.559
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
          "isa_reasoning": "No ISA pattern detected for: 1LIT-12422B (type: Level Indicating Transmitter)"
        }
      },
      {
        "id": "1LIT-12422A",
        "type": "Level Indicating Transmitter",
        "label": "1LIT 12422A",
        "bbox": [
          0.308,
          0.62,
          0.379,
          0.686
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with the ISA tag '1LIT' and loop number '12422A', indicating a field-mounted Level Indicating Transmitter. 'D/P ERS' suggests differential pressure measurement.",
          "description": "Level Indicating Transmitter, Differential Pressure",
          "instrument_function": "Level Indicating Transmitter",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1LIT-12422A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.308,
            0.62,
            0.379,
            0.686
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.308,
                  0.62,
                  0.379,
                  0.686
                ],
                "normalized_bbox": [
                  0.308,
                  0.62,
                  0.379,
                  0.686
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
          "isa_reasoning": "No ISA pattern detected for: 1LIT-12422A (type: Level Indicating Transmitter)"
        }
      },
      {
        "id": "1VA-121269_CV",
        "type": "valve_control",
        "label": "1VA-121269",
        "bbox": [
          0.297,
          0.709,
          0.34,
          0.752
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie valve symbol with a mushroom/diaphragm actuator, indicating a control valve. The tag '1VA-121269' is associated with the incoming line.",
          "description": "Control Valve, Diaphragm Actuated",
          "equipment_type": "Control Valve",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-121269",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.297,
            0.709,
            0.34,
            0.752
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.297,
                  0.709,
                  0.34,
                  0.752
                ],
                "normalized_bbox": [
                  0.297,
                  0.709,
                  0.34,
                  0.752
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Control",
          "isa_modifier": "Valve",
          "isa_confidence": 0.8,
          "isa_reasoning": "Inferred from component type: valve_control"
        }
      },
      {
        "id": "1VA-121268_MV1",
        "type": "Manual Valve",
        "label": "1VA-121268",
        "bbox": [
          0.353,
          0.709,
          0.38,
          0.736
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie valve symbol with an 'X' indicating manual operation, likely a gate valve. The tag '1VA-121268' is associated with the adjacent line.",
          "description": "Manual Gate Valve",
          "equipment_type": "Gate Valve",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-121268",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.353,
            0.709,
            0.38,
            0.736
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.353,
                  0.709,
                  0.38,
                  0.736
                ],
                "normalized_bbox": [
                  0.353,
                  0.709,
                  0.38,
                  0.736
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
          "isa_reasoning": "No ISA pattern detected for: 1VA-121268 (type: Manual Valve)"
        }
      },
      {
        "id": "1VA-121268_MV2",
        "type": "Manual Valve",
        "label": "1VA-121268",
        "bbox": [
          0.392,
          0.709,
          0.419,
          0.736
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie valve symbol with an 'X' indicating manual operation, likely a gate valve. The tag '1VA-121268' is associated with the adjacent line.",
          "description": "Manual Gate Valve",
          "equipment_type": "Gate Valve",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-121268",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.392,
            0.709,
            0.419,
            0.736
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.392,
                  0.709,
                  0.419,
                  0.736
                ],
                "normalized_bbox": [
                  0.392,
                  0.709,
                  0.419,
                  0.736
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
          "isa_reasoning": "No ISA pattern detected for: 1VA-121268 (type: Manual Valve)"
        }
      },
      {
        "id": "F-1.5IN",
        "type": "Flow Element",
        "label": "F 1.5\"",
        "bbox": [
          0.596,
          0.14,
          0.623,
          0.167
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a rectangle symbol with a diagonal line, labeled 'F 1.5\"', indicating a flow restriction or orifice plate.",
          "description": "Flow Element, 1.5 inch Orifice Plate",
          "equipment_type": "Orifice Plate",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "F-1.5IN",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.596,
            0.14,
            0.623,
            0.167
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.596,
                  0.14,
                  0.623,
                  0.167
                ],
                "normalized_bbox": [
                  0.596,
                  0.14,
                  0.623,
                  0.167
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "F",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "1VA-121201_CV",
        "type": "valve_control",
        "label": "1VA-121201",
        "bbox": [
          0.635,
          0.14,
          0.678,
          0.183
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie valve symbol with a grid-like actuator and 'N' symbol, indicating a control valve. The tag '1VA-121201' is associated with the adjacent line.",
          "description": "Control Valve, Actuated (type N)",
          "equipment_type": "Control Valve",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-121201",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.635,
            0.14,
            0.678,
            0.183
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.635,
                  0.14,
                  0.678,
                  0.183
                ],
                "normalized_bbox": [
                  0.635,
                  0.14,
                  0.678,
                  0.183
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Control",
          "isa_modifier": "Valve",
          "isa_confidence": 0.8,
          "isa_reasoning": "Inferred from component type: valve_control"
        }
      },
      {
        "id": "1LG-12427",
        "type": "Level Gauge",
        "label": "1LG 12427",
        "bbox": [
          0.77,
          0.292,
          0.841,
          0.358
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle symbol with the ISA tag '1LG' and loop number '12427', indicating a field-mounted Level Gauge. 'MAG' nearby suggests Magnetic Level Gauge.",
          "description": "Level Gauge, Magnetic",
          "instrument_function": "Level Gauge",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1LG-12427",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.77,
            0.292,
            0.841,
            0.358
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.77,
                  0.292,
                  0.841,
                  0.358
                ],
                "normalized_bbox": [
                  0.77,
                  0.292,
                  0.841,
                  0.358
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
          "isa_reasoning": "No ISA pattern detected for: 1LG-12427 (type: Level Gauge)"
        }
      },
      {
        "id": "1VA-120702_Logic",
        "type": "Logic Function",
        "label": "1VA-120702",
        "bbox": [
          0.596,
          0.406,
          0.623,
          0.433
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a diamond shape with an 'I' inside, indicating a logic or interlock function. The tag '1VA-120702' is associated with the adjacent line.",
          "description": "Logic Function / Interlock",
          "instrument_function": "Logic",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-120702",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.596,
            0.406,
            0.623,
            0.433
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.596,
                  0.406,
                  0.623,
                  0.433
                ],
                "normalized_bbox": [
                  0.596,
                  0.406,
                  0.623,
                  0.433
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
          "isa_reasoning": "No ISA pattern detected for: 1VA-120702 (type: Logic Function)"
        }
      },
      {
        "id": "1VA-121809_CV",
        "type": "valve_control",
        "label": "1VA-121809",
        "bbox": [
          0.635,
          0.457,
          0.678,
          0.5
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a bowtie valve symbol with a grid-like actuator, indicating a control valve. The tag '1VA-121809' is associated with the adjacent line.",
          "description": "Control Valve, Actuated",
          "equipment_type": "Control Valve",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-121809",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.635,
            0.457,
            0.678,
            0.5
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.635,
                  0.457,
                  0.678,
                  0.5
                ],
                "normalized_bbox": [
                  0.635,
                  0.457,
                  0.678,
                  0.5
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "CV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Control",
          "isa_modifier": "Valve",
          "isa_confidence": 0.8,
          "isa_reasoning": "Inferred from component type: valve_control"
        }
      },
      {
        "id": "1LG-12426B",
        "type": "Level Gauge",
        "label": "1LG 12426B",
        "bbox": [
          0.479,
          0.709,
          0.55,
          0.775
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle-in-square symbol with the ISA tag '1LG' and loop number '12426B', indicating a shared display/control Level Gauge. 'MAG' nearby suggests Magnetic Level Gauge.",
          "description": "Level Gauge, Magnetic, Shared Display/Control",
          "instrument_function": "Level Gauge",
          "location": "Shared Display/Control",
          "occlusion_level": "none",
          "tag": "1LG-12426B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.479,
            0.709,
            0.55,
            0.775
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.479,
                  0.709,
                  0.55,
                  0.775
                ],
                "normalized_bbox": [
                  0.479,
                  0.709,
                  0.55,
                  0.775
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
          "isa_reasoning": "No ISA pattern detected for: 1LG-12426B (type: Level Gauge)"
        }
      },
      {
        "id": "1LG-12426A",
        "type": "Level Gauge",
        "label": "1LG 12426A",
        "bbox": [
          0.77,
          0.709,
          0.841,
          0.775
        ],
        "confidence": 1,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a circle-in-square symbol with the ISA tag '1LG' and loop number '12426A', indicating a shared display/control Level Gauge. 'MAG' nearby suggests Magnetic Level Gauge.",
          "description": "Level Gauge, Magnetic, Shared Display/Control",
          "instrument_function": "Level Gauge",
          "location": "Shared Display/Control",
          "occlusion_level": "none",
          "tag": "1LG-12426A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.77,
            0.709,
            0.841,
            0.775
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.77,
                  0.709,
                  0.841,
                  0.775
                ],
                "normalized_bbox": [
                  0.77,
                  0.709,
                  0.841,
                  0.775
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
          "isa_reasoning": "No ISA pattern detected for: 1LG-12426A (type: Level Gauge)"
        }
      },
      {
        "id": "1VA-120287_Logic",
        "type": "Logic Function",
        "label": "1VA-120287",
        "bbox": [
          0.596,
          0.819,
          0.623,
          0.846
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Detected a diamond shape with an 'I' inside, indicating a logic or interlock function. The tag '1VA-120287' is associated with the adjacent line.",
          "description": "Logic Function / Interlock",
          "instrument_function": "Logic",
          "location": "Field Mounted",
          "occlusion_level": "none",
          "tag": "1VA-120287",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.596,
            0.819,
            0.623,
            0.846
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.596,
                  0.819,
                  0.623,
                  0.846
                ],
                "normalized_bbox": [
                  0.596,
                  0.819,
                  0.623,
                  0.846
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
          "isa_reasoning": "No ISA pattern detected for: 1VA-120287 (type: Logic Function)"
        }
      },
      {
        "id": "L1A",
        "type": "Process Line",
        "label": "L1A",
        "bbox": [
          0.12,
          0.25,
          0.15,
          0.28
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Text label 'L1A' indicating a process line.",
          "description": "Process Line L1A",
          "occlusion_level": "none",
          "tag": "L1A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.12,
            0.25,
            0.15,
            0.28
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.25,
                  0.15,
                  0.28
                ],
                "normalized_bbox": [
                  0.12,
                  0.25,
                  0.15,
                  0.28
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "L",
          "detection_quality": "excellent",
          "isa_measured_variable": "L",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Level"
        }
      },
      {
        "id": "N2",
        "type": "Process Line",
        "label": "N2",
        "bbox": [
          0.12,
          0.31,
          0.15,
          0.34
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Text label 'N2' indicating a process line.",
          "description": "Process Line N2",
          "occlusion_level": "none",
          "tag": "N2",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.12,
            0.31,
            0.15,
            0.34
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.31,
                  0.15,
                  0.34
                ],
                "normalized_bbox": [
                  0.12,
                  0.31,
                  0.15,
                  0.34
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "N",
          "detection_quality": "excellent",
          "isa_measured_variable": "N",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: User's Choice"
        }
      },
      {
        "id": "L2A",
        "type": "Process Line",
        "label": "L2A",
        "bbox": [
          0.05,
          0.38,
          0.08,
          0.41
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Text label 'L2A' indicating a process line.",
          "description": "Process Line L2A",
          "occlusion_level": "none",
          "tag": "L2A",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.38,
            0.08,
            0.41
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.38,
                  0.08,
                  0.41
                ],
                "normalized_bbox": [
                  0.05,
                  0.38,
                  0.08,
                  0.41
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "L",
          "detection_quality": "excellent",
          "isa_measured_variable": "L",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Level"
        }
      },
      {
        "id": "L1B",
        "type": "Process Line",
        "label": "L1B",
        "bbox": [
          0.12,
          0.78,
          0.15,
          0.81
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Text label 'L1B' indicating a process line.",
          "description": "Process Line L1B",
          "occlusion_level": "none",
          "tag": "L1B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.12,
            0.78,
            0.15,
            0.81
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.78,
                  0.15,
                  0.81
                ],
                "normalized_bbox": [
                  0.12,
                  0.78,
                  0.15,
                  0.81
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "L",
          "detection_quality": "excellent",
          "isa_measured_variable": "L",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Level"
        }
      },
      {
        "id": "L2B",
        "type": "Process Line",
        "label": "L2B",
        "bbox": [
          0.05,
          0.88,
          0.08,
          0.91
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Text label 'L2B' indicating a process line.",
          "description": "Process Line L2B",
          "occlusion_level": "none",
          "tag": "L2B",
          "text_clarity": "clear",
          "raw_backend_output": [
            0.05,
            0.88,
            0.08,
            0.91
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-06T06:33:57.949Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.05,
                  0.88,
                  0.08,
                  0.91
                ],
                "normalized_bbox": [
                  0.05,
                  0.88,
                  0.08,
                  0.91
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "L",
          "detection_quality": "excellent",
          "isa_measured_variable": "L",
          "isa_modifier": null,
          "isa_confidence": 0.7,
          "isa_reasoning": "Parsed ISA tag: Level"
        }
      }
    ],
    "connections": [
      {
        "id": "1767681237949-ma1h7afpi",
        "from_id": "L-NOTE6",
        "to_id": "1LI-12422",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_level",
          "to_component_type": "Level Indicator",
          "from_label": "L",
          "to_label": "1LI 12422"
        }
      },
      {
        "id": "1767681237949-0917tfhnu",
        "from_id": "1LI-12422",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_1",
        "type": "unknown",
        "confidence": 0.9
      },
      {
        "id": "1767681237950-q5f0xcoix",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_2",
        "to_id": "1VA-120704_CV",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-rc7nchjhu",
        "from_id": "1VA-120704_CV",
        "to_id": "1VA-121271_MV",
        "type": "process",
        "confidence": 0.98,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "Manual Valve",
          "from_label": "1VA-120704",
          "to_label": "1VA-121271"
        }
      },
      {
        "id": "1767681237950-9j4fsp1gq",
        "from_id": "1VA-121271_MV",
        "to_id": "1VA-121270_MV",
        "type": "process",
        "confidence": 0.98,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Manual Valve",
          "to_component_type": "Manual Valve",
          "from_label": "1VA-121271",
          "to_label": "1VA-121270"
        }
      },
      {
        "id": "1767681237950-h2ds971tw",
        "from_id": "1VA-121270_MV",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_3",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-mdgo3icr7",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_4",
        "to_id": "1LIT-12422B",
        "type": "unknown",
        "confidence": 0.95
      },
      {
        "id": "1767681237950-tnxjgtk4e",
        "from_id": "1LIT-12422B",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_5",
        "type": "unknown",
        "confidence": 0.95
      },
      {
        "id": "1767681237950-v7so74a0p",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_6",
        "to_id": "1LIT-12422A",
        "type": "unknown",
        "confidence": 0.95
      },
      {
        "id": "1767681237950-qo3qr12ay",
        "from_id": "1LIT-12422A",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_7",
        "type": "unknown",
        "confidence": 0.95
      },
      {
        "id": "1767681237950-40pi7zrha",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_8",
        "to_id": "1VA-121269_CV",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-ceag5e0rw",
        "from_id": "1VA-121269_CV",
        "to_id": "1VA-121268_MV1",
        "type": "process",
        "confidence": 0.98,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "Manual Valve",
          "from_label": "1VA-121269",
          "to_label": "1VA-121268"
        }
      },
      {
        "id": "1767681237950-1wkiorhzx",
        "from_id": "1VA-121268_MV1",
        "to_id": "1VA-121268_MV2",
        "type": "process",
        "confidence": 0.98,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Manual Valve",
          "to_component_type": "Manual Valve",
          "from_label": "1VA-121268",
          "to_label": "1VA-121268"
        }
      },
      {
        "id": "1767681237950-pz7r0kp87",
        "from_id": "1VA-121268_MV2",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_9",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-ny8osc6k3",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_10",
        "to_id": "F-1.5IN",
        "type": "process",
        "confidence": 0.95
      },
      {
        "id": "1767681237950-756ncxmse",
        "from_id": "F-1.5IN",
        "to_id": "1VA-121201_CV",
        "type": "process",
        "confidence": 0.98,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Flow Element",
          "to_component_type": "valve_control",
          "from_label": "F 1.5\"",
          "to_label": "1VA-121201"
        }
      },
      {
        "id": "1767681237950-76sfm4aua",
        "from_id": "1VA-121201_CV",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_11",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-5m6iypdam",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_12",
        "to_id": "1LG-12427",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-ng1bhp4rk",
        "from_id": "1LG-12427",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_13",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-cojqbjpii",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_14",
        "to_id": "1VA-120702_Logic",
        "type": "unknown",
        "confidence": 0.95
      },
      {
        "id": "1767681237950-jmudwnika",
        "from_id": "1VA-120702_Logic",
        "to_id": "1VA-121809_CV",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Logic Function",
          "to_component_type": "valve_control",
          "from_label": "1VA-120702",
          "to_label": "1VA-121809"
        }
      },
      {
        "id": "1767681237950-isnqyi28o",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_15",
        "to_id": "1VA-121809_CV",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-o4f1iqkcb",
        "from_id": "1VA-121809_CV",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_16",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-sbdhmo830",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_17",
        "to_id": "1LG-12426B",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-rcuii6gq9",
        "from_id": "1LG-12426B",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_18",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-aq8ufx662",
        "from_id": "UNIDENTIFIED_CONNECTION_POINT_19",
        "to_id": "1LG-12426A",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-xg9uec0h3",
        "from_id": "1LG-12426A",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_20",
        "type": "process",
        "confidence": 0.98
      },
      {
        "id": "1767681237950-j5n4whz2k",
        "from_id": "1LG-12426B",
        "to_id": "1VA-120287_Logic",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Level Gauge",
          "to_component_type": "Logic Function",
          "from_label": "1LG 12426B",
          "to_label": "1VA-120287"
        }
      },
      {
        "id": "1767681237950-vpowch14o",
        "from_id": "1LG-12426A",
        "to_id": "1VA-120287_Logic",
        "type": "unknown",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "Level Gauge",
          "to_component_type": "Logic Function",
          "from_label": "1LG 12426A",
          "to_label": "1VA-120287"
        }
      },
      {
        "id": "1767681237950-zcpkvdyfy",
        "from_id": "1VA-120287_Logic",
        "to_id": "UNIDENTIFIED_CONNECTION_POINT_21",
        "type": "unknown",
        "confidence": 0.95
      }
    ],
    "metadata": {
      "total_components": 23,
      "total_connections": 30,
      "process_log": "The schematic depicts a section of a process system with multiple level measurement and control points. It includes field-mounted level sensors, indicators, and transmitters, as well as shared display/control level gauges. Several control valves with diaphragm or grid-like actuators are present, along with manual gate valves. Two diamond-shaped logic functions are identified, likely for interlocks or control sequencing. Various process lines with specified sizes and materials are shown, along with undefined signal lines connecting instruments and logic functions. The diagram shows multiple branches for process flow, with some lines having specific pipe specifications including material and schedule. The overall system appears to be involved in level control and monitoring, potentially for a tank or vessel, with associated flow elements and control valves.",
      "enhancement": {
        "spatial_association_enabled": true,
        "orphaned_labels_merged": 0,
        "isa_detection_enabled": true,
        "isa_functions_detected": 12,
        "isa_detection_rate": 0.5217391304347826,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 21,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 3
      },
      "control_loops": [],
      "validation_issues": [
        {
          "connection": {
            "id": "1767681237949-0917tfhnu",
            "from_id": "1LI-12422",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_1",
            "type": "unknown",
            "confidence": 0.9
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_1",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-q5f0xcoix",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_2",
            "to_id": "1VA-120704_CV",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_2",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-h2ds971tw",
            "from_id": "1VA-121270_MV",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_3",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_3",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-mdgo3icr7",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_4",
            "to_id": "1LIT-12422B",
            "type": "unknown",
            "confidence": 0.95
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_4",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-tnxjgtk4e",
            "from_id": "1LIT-12422B",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_5",
            "type": "unknown",
            "confidence": 0.95
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_5",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-v7so74a0p",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_6",
            "to_id": "1LIT-12422A",
            "type": "unknown",
            "confidence": 0.95
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_6",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-qo3qr12ay",
            "from_id": "1LIT-12422A",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_7",
            "type": "unknown",
            "confidence": 0.95
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_7",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-40pi7zrha",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_8",
            "to_id": "1VA-121269_CV",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_8",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-pz7r0kp87",
            "from_id": "1VA-121268_MV2",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_9",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_9",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-ny8osc6k3",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_10",
            "to_id": "F-1.5IN",
            "type": "process",
            "confidence": 0.95
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_10",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-76sfm4aua",
            "from_id": "1VA-121201_CV",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_11",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_11",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-5m6iypdam",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_12",
            "to_id": "1LG-12427",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_12",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-ng1bhp4rk",
            "from_id": "1LG-12427",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_13",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_13",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-cojqbjpii",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_14",
            "to_id": "1VA-120702_Logic",
            "type": "unknown",
            "confidence": 0.95
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_14",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-isnqyi28o",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_15",
            "to_id": "1VA-121809_CV",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_15",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-o4f1iqkcb",
            "from_id": "1VA-121809_CV",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_16",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_16",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-sbdhmo830",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_17",
            "to_id": "1LG-12426B",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_17",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-rcuii6gq9",
            "from_id": "1LG-12426B",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_18",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_18",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-aq8ufx662",
            "from_id": "UNIDENTIFIED_CONNECTION_POINT_19",
            "to_id": "1LG-12426A",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Source component not found: UNIDENTIFIED_CONNECTION_POINT_19",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-xg9uec0h3",
            "from_id": "1LG-12426A",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_20",
            "type": "process",
            "confidence": 0.98
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_20",
          "severity": "error"
        },
        {
          "connection": {
            "id": "1767681237950-zcpkvdyfy",
            "from_id": "1VA-120287_Logic",
            "to_id": "UNIDENTIFIED_CONNECTION_POINT_21",
            "type": "unknown",
            "confidence": 0.95
          },
          "issue": "Target component not found: UNIDENTIFIED_CONNECTION_POINT_21",
          "severity": "error"
        }
      ],
      "quality_metrics": {
        "overall_score": 0.8692173913043477,
        "detection_quality": 1,
        "isa_completeness": 0.5217391304347826,
        "connection_coverage": 1,
        "confidence_avg": 0.9626086956521734,
        "metrics": {
          "total_components": 23,
          "total_connections": 30,
          "isa_functions_detected": 12,
          "excellent_detections": 23,
          "avg_confidence": 0.9626086956521734
        }
      }
    }
  }
}
[Background] Starting background analysis...
[Background] Queuing background analysis on server...



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
visual-enhancements.ts:41 [Enhancement] Starting post-processing enhancements...
visual-enhancements.ts:48 [Enhancement] Normalizing component and connection types...
11type-normalization.ts:155  [Type Normalization] Unknown connection type: "Signal Line", defaulting to "unknown"
normalizeConnectionType @ type-normalization.ts:155
visual-enhancements.ts:51 [Enhancement] Type normalization complete
visual-enhancements.ts:56 [Enhancement] Applying spatial association to merge orphaned labels...
spatial-association.ts:330 [Spatial Association] Starting spatial association post-processing...
spatial-association.ts:196 [Spatial Association] Starting orphaned label detection...
spatial-association.ts:213 [Spatial Association] Found 0 orphaned labels, 0 unlabeled components, 23 already labeled
spatial-association.ts:220 [Spatial Association] No merging needed
spatial-association.ts:341 [Spatial Association] Post-processing complete in 0ms: 23 → 23 components (0 merged)
visual-enhancements.ts:65 [Enhancement] Spatial association complete: 0 orphaned labels merged, 23 total components remain
visual-enhancements.ts:73 [Enhancement] Detecting ISA functions...
visual-enhancements.ts:78 [Enhancement] ISA detection complete: 12/23 components have ISA functions (52%)
visual-enhancements.ts:86 [Enhancement] Enhancing connections...
visual-enhancements.ts:92 [Enhancement] Inferring missing connections via control loops...
visual-enhancements.ts:101 [Enhancement] Tracing physical connection paths...
visual-enhancements.ts:118 [Enhancement] Validating connections...
visual-enhancements.ts:124  [Enhancement] Connection validation found 21 issues (21 errors, 0 warnings)
enhanceVisualAnalysis @ visual-enhancements.ts:124
visual-enhancements.ts:130 [Enhancement] Auto-correcting connection type mismatches...
visual-enhancements.ts:138 [Enhancement] Detecting control loops...
visual-enhancements.ts:140 [Enhancement] Detected 0 control loops
visual-enhancements.ts:144 [Enhancement] Post-processing complete in 3ms
visual.ts:108 [Visual Pipeline] Quality Score: 0.87
index.ts:34 Pipeline execution complete
index.ts:34 ["Analysis complete:",{"document_id":"1767681168351-drr0owjwe","type":"SCHEMATIC","processing_time_ms":69609,"components":23}]
BlueprintWorkspace.tsx:97 Stage 1 (Visual Analysis) complete: Objectcache_hit: falseclassification: confidence: 1reasoning: "The document clearly displays numerous instrumentation symbols (circles, diamonds, and other standard P&ID symbols) and process flow lines, which are characteristic of a P&ID or control logic diagram. This directly matches the primary criterion for a SCHEMATIC classification."type: "SCHEMATIC"[[Prototype]]: Objectdocument_id: "1767681168351-drr0owjwe"document_type: "SCHEMATIC"file_name: "current-image"processing_time_ms: 69609timestamp: 1767681237960visual: components: Array(23)0: {id: 'L-NOTE6', type: 'sensor_level', label: 'L', bbox: Array(4), confidence: 0.95, …}1: {id: '1LI-12422', type: 'Level Indicator', label: '1LI 12422', bbox: Array(4), confidence: 1, …}2: {id: '1VA-120704_CV', type: 'valve_control', label: '1VA-120704', bbox: Array(4), confidence: 0.98, …}3: {id: '1VA-121271_MV', type: 'Manual Valve', label: '1VA-121271', bbox: Array(4), confidence: 0.98, …}4: {id: '1VA-121270_MV', type: 'Manual Valve', label: '1VA-121270', bbox: Array(4), confidence: 0.98, …}5: {id: '1LIT-12422B', type: 'Level Indicating Transmitter', label: '1LIT 12422B', bbox: Array(4), confidence: 1, …}6: {id: '1LIT-12422A', type: 'Level Indicating Transmitter', label: '1LIT 12422A', bbox: Array(4), confidence: 1, …}7: {id: '1VA-121269_CV', type: 'valve_control', label: '1VA-121269', bbox: Array(4), confidence: 0.98, …}8: {id: '1VA-121268_MV1', type: 'Manual Valve', label: '1VA-121268', bbox: Array(4), confidence: 0.98, …}9: {id: '1VA-121268_MV2', type: 'Manual Valve', label: '1VA-121268', bbox: Array(4), confidence: 0.98, …}10: {id: 'F-1.5IN', type: 'Flow Element', label: 'F 1.5"', bbox: Array(4), confidence: 0.95, …}11: {id: '1VA-121201_CV', type: 'valve_control', label: '1VA-121201', bbox: Array(4), confidence: 0.98, …}12: {id: '1LG-12427', type: 'Level Gauge', label: '1LG 12427', bbox: Array(4), confidence: 1, …}13: {id: '1VA-120702_Logic', type: 'Logic Function', label: '1VA-120702', bbox: Array(4), confidence: 0.95, …}14: {id: '1VA-121809_CV', type: 'valve_control', label: '1VA-121809', bbox: Array(4), confidence: 0.98, …}15: {id: '1LG-12426B', type: 'Level Gauge', label: '1LG 12426B', bbox: Array(4), confidence: 1, …}16: {id: '1LG-12426A', type: 'Level Gauge', label: '1LG 12426A', bbox: Array(4), confidence: 1, …}17: {id: '1VA-120287_Logic', type: 'Logic Function', label: '1VA-120287', bbox: Array(4), confidence: 0.95, …}18: {id: 'L1A', type: 'Process Line', label: 'L1A', bbox: Array(4), confidence: 0.9, …}19: {id: 'N2', type: 'Process Line', label: 'N2', bbox: Array(4), confidence: 0.9, …}20: {id: 'L2A', type: 'Process Line', label: 'L2A', bbox: Array(4), confidence: 0.9, …}21: {id: 'L1B', type: 'Process Line', label: 'L1B', bbox: Array(4), confidence: 0.9, …}22: {id: 'L2B', type: 'Process Line', label: 'L2B', bbox: Array(4), confidence: 0.9, …}length: 23[[Prototype]]: Array(0)connections: Array(30)0: {id: '1767681237949-ma1h7afpi', from_id: 'L-NOTE6', to_id: '1LI-12422', type: 'unknown', confidence: 0.95, …}1: {id: '1767681237949-0917tfhnu', from_id: '1LI-12422', to_id: 'UNIDENTIFIED_CONNECTION_POINT_1', type: 'unknown', confidence: 0.9}2: {id: '1767681237950-q5f0xcoix', from_id: 'UNIDENTIFIED_CONNECTION_POINT_2', to_id: '1VA-120704_CV', type: 'process', confidence: 0.98}3: {id: '1767681237950-rc7nchjhu', from_id: '1VA-120704_CV', to_id: '1VA-121271_MV', type: 'process', confidence: 0.98, …}4: {id: '1767681237950-9j4fsp1gq', from_id: '1VA-121271_MV', to_id: '1VA-121270_MV', type: 'process', confidence: 0.98, …}5: {id: '1767681237950-h2ds971tw', from_id: '1VA-121270_MV', to_id: 'UNIDENTIFIED_CONNECTION_POINT_3', type: 'process', confidence: 0.98}6: {id: '1767681237950-mdgo3icr7', from_id: 'UNIDENTIFIED_CONNECTION_POINT_4', to_id: '1LIT-12422B', type: 'unknown', confidence: 0.95}7: {id: '1767681237950-tnxjgtk4e', from_id: '1LIT-12422B', to_id: 'UNIDENTIFIED_CONNECTION_POINT_5', type: 'unknown', confidence: 0.95}8: {id: '1767681237950-v7so74a0p', from_id: 'UNIDENTIFIED_CONNECTION_POINT_6', to_id: '1LIT-12422A', type: 'unknown', confidence: 0.95}9: {id: '1767681237950-qo3qr12ay', from_id: '1LIT-12422A', to_id: 'UNIDENTIFIED_CONNECTION_POINT_7', type: 'unknown', confidence: 0.95}10: {id: '1767681237950-40pi7zrha', from_id: 'UNIDENTIFIED_CONNECTION_POINT_8', to_id: '1VA-121269_CV', type: 'process', confidence: 0.98}11: {id: '1767681237950-ceag5e0rw', from_id: '1VA-121269_CV', to_id: '1VA-121268_MV1', type: 'process', confidence: 0.98, …}12: {id: '1767681237950-1wkiorhzx', from_id: '1VA-121268_MV1', to_id: '1VA-121268_MV2', type: 'process', confidence: 0.98, …}13: {id: '1767681237950-pz7r0kp87', from_id: '1VA-121268_MV2', to_id: 'UNIDENTIFIED_CONNECTION_POINT_9', type: 'process', confidence: 0.98}14: {id: '1767681237950-ny8osc6k3', from_id: 'UNIDENTIFIED_CONNECTION_POINT_10', to_id: 'F-1.5IN', type: 'process', confidence: 0.95}15: {id: '1767681237950-756ncxmse', from_id: 'F-1.5IN', to_id: '1VA-121201_CV', type: 'process', confidence: 0.98, …}16: {id: '1767681237950-76sfm4aua', from_id: '1VA-121201_CV', to_id: 'UNIDENTIFIED_CONNECTION_POINT_11', type: 'process', confidence: 0.98}17: {id: '1767681237950-5m6iypdam', from_id: 'UNIDENTIFIED_CONNECTION_POINT_12', to_id: '1LG-12427', type: 'process', confidence: 0.98}18: {id: '1767681237950-ng1bhp4rk', from_id: '1LG-12427', to_id: 'UNIDENTIFIED_CONNECTION_POINT_13', type: 'process', confidence: 0.98}19: {id: '1767681237950-cojqbjpii', from_id: 'UNIDENTIFIED_CONNECTION_POINT_14', to_id: '1VA-120702_Logic', type: 'unknown', confidence: 0.95}20: {id: '1767681237950-jmudwnika', from_id: '1VA-120702_Logic', to_id: '1VA-121809_CV', type: 'unknown', confidence: 0.95, …}21: {id: '1767681237950-isnqyi28o', from_id: 'UNIDENTIFIED_CONNECTION_POINT_15', to_id: '1VA-121809_CV', type: 'process', confidence: 0.98}22: {id: '1767681237950-o4f1iqkcb', from_id: '1VA-121809_CV', to_id: 'UNIDENTIFIED_CONNECTION_POINT_16', type: 'process', confidence: 0.98}23: {id: '1767681237950-sbdhmo830', from_id: 'UNIDENTIFIED_CONNECTION_POINT_17', to_id: '1LG-12426B', type: 'process', confidence: 0.98}24: {id: '1767681237950-rcuii6gq9', from_id: '1LG-12426B', to_id: 'UNIDENTIFIED_CONNECTION_POINT_18', type: 'process', confidence: 0.98}25: {id: '1767681237950-aq8ufx662', from_id: 'UNIDENTIFIED_CONNECTION_POINT_19', to_id: '1LG-12426A', type: 'process', confidence: 0.98}26: {id: '1767681237950-xg9uec0h3', from_id: '1LG-12426A', to_id: 'UNIDENTIFIED_CONNECTION_POINT_20', type: 'process', confidence: 0.98}27: {id: '1767681237950-j5n4whz2k', from_id: '1LG-12426B', to_id: '1VA-120287_Logic', type: 'unknown', confidence: 0.95, …}28: {id: '1767681237950-vpowch14o', from_id: '1LG-12426A', to_id: '1VA-120287_Logic', type: 'unknown', confidence: 0.95, …}29: {id: '1767681237950-zcpkvdyfy', from_id: '1VA-120287_Logic', to_id: 'UNIDENTIFIED_CONNECTION_POINT_21', type: 'unknown', confidence: 0.95}length: 30[[Prototype]]: Array(0)metadata: control_loops: Array(0)length: 0[[Prototype]]: Array(0)enhancement: connection_inference_enabled: truecontrol_loops: 0enhancement_duration_ms: 3inferred_connections: 0isa_detection_enabled: trueisa_detection_rate: 0.5217391304347826isa_functions_detected: 12loop_detection_enabled: trueorphaned_labels_merged: 0spatial_association_enabled: truevalidation_enabled: truevalidation_issues: 21[[Prototype]]: Objectprocess_log: "The schematic depicts a section of a process system with multiple level measurement and control points. It includes field-mounted level sensors, indicators, and transmitters, as well as shared display/control level gauges. Several control valves with diaphragm or grid-like actuators are present, along with manual gate valves. Two diamond-shaped logic functions are identified, likely for interlocks or control sequencing. Various process lines with specified sizes and materials are shown, along with undefined signal lines connecting instruments and logic functions. The diagram shows multiple branches for process flow, with some lines having specific pipe specifications including material and schedule. The overall system appears to be involved in level control and monitoring, potentially for a tank or vessel, with associated flow elements and control valves."quality_metrics: confidence_avg: 0.9626086956521734connection_coverage: 1detection_quality: 1isa_completeness: 0.5217391304347826metrics: avg_confidence: 0.9626086956521734excellent_detections: 23isa_functions_detected: 12total_components: 23total_connections: 30[[Prototype]]: Objectoverall_score: 0.8692173913043477[[Prototype]]: Objecttotal_components: 23total_connections: 30validation_issues: Array(21)0: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_1', severity: 'error'}1: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_2', severity: 'error'}2: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_3', severity: 'error'}3: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_4', severity: 'error'}4: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_5', severity: 'error'}5: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_6', severity: 'error'}6: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_7', severity: 'error'}7: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_8', severity: 'error'}8: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_9', severity: 'error'}9: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_10', severity: 'error'}10: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_11', severity: 'error'}11: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_12', severity: 'error'}12: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_13', severity: 'error'}13: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_14', severity: 'error'}14: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_15', severity: 'error'}15: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_16', severity: 'error'}16: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_17', severity: 'error'}17: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_18', severity: 'error'}18: {connection: {…}, issue: 'Source component not found: UNIDENTIFIED_CONNECTION_POINT_19', severity: 'error'}19: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_20', severity: 'error'}20: {connection: {…}, issue: 'Target component not found: UNIDENTIFIED_CONNECTION_POINT_21', severity: 'error'}length: 21[[Prototype]]: Array(0)[[Prototype]]: Object[[Prototype]]: Object[[Prototype]]: Object
index.ts:155 [Stage 2] Starting background final analysis...
BlueprintWorkspace.tsx:134 [Stage 2] Starting background analysis...
BlueprintWorkspace.tsx:134 [Stage 2] Queuing background analysis on server...
index.ts:169 [Stage 2] Background analysis queued with job ID: analysis-job-1-1767681238270
BlueprintWorkspace.tsx:168 [Stage 2] Background job queued: analysis-job-1-1767681238270