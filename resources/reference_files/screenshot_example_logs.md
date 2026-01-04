Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":0.95,"reasoning":"Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767564036419-bobakvbnf","type":"SCHEMATIC","processing_time_ms":143623,"components":45}]

{
  "document_id": "1767564036419-bobakvbnf",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767564180042,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 0.95,
    "reasoning": "Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"
  },
  "processing_time_ms": 143623,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "SVC-1",
        "type": "instrument_controller",
        "label": "SVC",
        "bbox": [
          0.069,
          0.301,
          0.138,
          0.359
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a square with a circle inside and a diagonal line, containing 'SVC' and 'P'. This indicates a Shared Display/Control function, likely a Signal Converter or Controller for Pressure (P).",
          "description": "Shared Display Signal Converter/Controller for Pressure",
          "functional_desc": "Signal Converter / Pressure",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Shared Display",
          "location": "Main Panel",
          "occlusion_level": "none",
          "tag": "SVC",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.069,
            0.301,
            0.138,
            0.359
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.021Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.069,
                  0.301,
                  0.138,
                  0.359
                ],
                "normalized_bbox": [
                  0.069,
                  0.301,
                  0.138,
                  0.359
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PI-unlabeled-1",
        "type": "sensor_pressure",
        "label": "PI",
        "bbox": [
          0.199,
          0.301,
          0.245,
          0.347
        ],
        "confidence": 0.97,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PI' inside, indicating a discrete Pressure Indicator, field mounted.",
          "description": "Pressure Indicator",
          "functional_desc": "Pressure Indicator",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PI",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.199,
            0.301,
            0.245,
            0.347
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.024Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.199,
                  0.301,
                  0.245,
                  0.347
                ],
                "normalized_bbox": [
                  0.199,
                  0.301,
                  0.245,
                  0.347
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "POSITION_INDICATOR-1",
        "type": "instrument_indicator",
        "label": "POSITION INDICATOR",
        "bbox": [
          0.283,
          0.354,
          0.366,
          0.385
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'POSITION INDICATOR' next to a mechanical linkage symbol, indicating a mechanical position indicator.",
          "description": "Mechanical Position Indicator",
          "instrument_type": "Mechanical",
          "location": "Field",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.283,
            0.354,
            0.366,
            0.385
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.025Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.283,
                  0.354,
                  0.366,
                  0.385
                ],
                "normalized_bbox": [
                  0.283,
                  0.354,
                  0.366,
                  0.385
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SDV-unlabeled-1",
        "type": "valve_solenoid",
        "label": "SDV",
        "bbox": [
          0.298,
          0.443,
          0.344,
          0.489
        ],
        "confidence": 0.96,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'SDV' inside, indicating a discrete Solenoid Operated Valve, field mounted.",
          "description": "Solenoid Operated Valve",
          "functional_desc": "Solenoid Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "V",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "SDV",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.298,
            0.443,
            0.344,
            0.489
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.025Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.298,
                  0.443,
                  0.344,
                  0.489
                ],
                "normalized_bbox": [
                  0.298,
                  0.443,
                  0.344,
                  0.489
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "NOTE_11-left",
        "type": "text_annotation",
        "label": "NOTE 11",
        "bbox": [
          0.283,
          0.421,
          0.329,
          0.434
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'NOTE 11'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.283,
            0.421,
            0.329,
            0.434
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.025Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.283,
                  0.421,
                  0.329,
                  0.434
                ],
                "normalized_bbox": [
                  0.283,
                  0.421,
                  0.329,
                  0.434
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FCV-301217",
        "type": "valve_control",
        "label": "FCV-301217",
        "bbox": [
          0.353,
          0.299,
          0.4,
          0.346
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'FCV' and '301217' inside, indicating a discrete Flow Control Valve, field mounted.",
          "description": "Flow Control Valve for Zone 2",
          "functional_desc": "Flow Control Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "F",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FCV-301217",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.353,
            0.299,
            0.4,
            0.346
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.026Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.353,
                  0.299,
                  0.4,
                  0.346
                ],
                "normalized_bbox": [
                  0.353,
                  0.299,
                  0.4,
                  0.346
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FCV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PT-301218",
        "type": "sensor_pressure",
        "label": "PT-301218",
        "bbox": [
          0.407,
          0.299,
          0.454,
          0.346
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PT' and '301218' inside, indicating a discrete Pressure Transmitter, field mounted.",
          "description": "Pressure Transmitter for Zone 2",
          "functional_desc": "Pressure Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PT-301218",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.407,
            0.299,
            0.454,
            0.346
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.026Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.407,
                  0.299,
                  0.454,
                  0.346
                ],
                "normalized_bbox": [
                  0.407,
                  0.299,
                  0.454,
                  0.346
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-301219",
        "type": "sensor_temperature",
        "label": "TT-301219",
        "bbox": [
          0.461,
          0.299,
          0.508,
          0.346
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'TT' and '301219' inside, indicating a discrete Temperature Transmitter, field mounted.",
          "description": "Temperature Transmitter for Zone 2",
          "functional_desc": "Temperature Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TT-301219",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.461,
            0.299,
            0.508,
            0.346
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.026Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.461,
                  0.299,
                  0.508,
                  0.346
                ],
                "normalized_bbox": [
                  0.461,
                  0.299,
                  0.508,
                  0.346
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "ZONE_2",
        "type": "text_annotation",
        "label": "ZONE 2",
        "bbox": [
          0.407,
          0.273,
          0.454,
          0.286
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'ZONE 2'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.407,
            0.273,
            0.454,
            0.286
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.026Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.407,
                  0.273,
                  0.454,
                  0.286
                ],
                "normalized_bbox": [
                  0.407,
                  0.273,
                  0.454,
                  0.286
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "7_PRE-DRILLED_LINER-1",
        "type": "text_annotation",
        "label": "7\" PRE-DRILLED LINER",
        "bbox": [
          0.519,
          0.326,
          0.659,
          0.339
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block '7\" PRE-DRILLED LINER'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.519,
            0.326,
            0.659,
            0.339
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.027Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.519,
                  0.326,
                  0.659,
                  0.339
                ],
                "normalized_bbox": [
                  0.519,
                  0.326,
                  0.659,
                  0.339
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "4-1/2_TUBING-1",
        "type": "text_annotation",
        "label": "4-1/2\" TUBING",
        "bbox": [
          0.435,
          0.36,
          0.536,
          0.373
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block '4-1/2\" TUBING'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.435,
            0.36,
            0.536,
            0.373
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.027Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.435,
                  0.36,
                  0.536,
                  0.373
                ],
                "normalized_bbox": [
                  0.435,
                  0.36,
                  0.536,
                  0.373
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "NOTE_41",
        "type": "text_annotation",
        "label": "NOTE 41",
        "bbox": [
          0.353,
          0.409,
          0.4,
          0.422
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'NOTE 41'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.353,
            0.409,
            0.4,
            0.422
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.027Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.353,
                  0.409,
                  0.4,
                  0.422
                ],
                "normalized_bbox": [
                  0.353,
                  0.409,
                  0.4,
                  0.422
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FCV-301220",
        "type": "valve_control",
        "label": "FCV-301220",
        "bbox": [
          0.59,
          0.299,
          0.637,
          0.346
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'FCV' and '301220' inside, indicating a discrete Flow Control Valve, field mounted.",
          "description": "Flow Control Valve for Zone 1",
          "functional_desc": "Flow Control Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "F",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FCV-301220",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.59,
            0.299,
            0.637,
            0.346
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.028Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.59,
                  0.299,
                  0.637,
                  0.346
                ],
                "normalized_bbox": [
                  0.59,
                  0.299,
                  0.637,
                  0.346
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FCV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "BV-301221",
        "type": "valve_ball",
        "label": "BV-301221",
        "bbox": [
          0.644,
          0.299,
          0.691,
          0.346
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'BV' and '301221' inside, indicating a discrete Ball Valve, field mounted.",
          "description": "Ball Valve for Zone 1",
          "functional_desc": "Ball Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "V",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "BV-301221",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.644,
            0.299,
            0.691,
            0.346
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.028Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.644,
                  0.299,
                  0.691,
                  0.346
                ],
                "normalized_bbox": [
                  0.644,
                  0.299,
                  0.691,
                  0.346
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "BV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PT-301222",
        "type": "sensor_pressure",
        "label": "PT-301222",
        "bbox": [
          0.698,
          0.299,
          0.745,
          0.346
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PT' and '301222' inside, indicating a discrete Pressure Transmitter, field mounted.",
          "description": "Pressure Transmitter for Zone 1",
          "functional_desc": "Pressure Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PT-301222",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.698,
            0.299,
            0.745,
            0.346
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.028Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.698,
                  0.299,
                  0.745,
                  0.346
                ],
                "normalized_bbox": [
                  0.698,
                  0.299,
                  0.745,
                  0.346
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-301223",
        "type": "sensor_temperature",
        "label": "TT-301223",
        "bbox": [
          0.752,
          0.299,
          0.799,
          0.346
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'TT' and '301223' inside, indicating a discrete Temperature Transmitter, field mounted.",
          "description": "Temperature Transmitter for Zone 1",
          "functional_desc": "Temperature Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TT-301223",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.752,
            0.299,
            0.799,
            0.346
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.028Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.752,
                  0.299,
                  0.799,
                  0.346
                ],
                "normalized_bbox": [
                  0.752,
                  0.299,
                  0.799,
                  0.346
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "ZONE_1",
        "type": "text_annotation",
        "label": "ZONE 1",
        "bbox": [
          0.698,
          0.273,
          0.745,
          0.286
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'ZONE 1'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.698,
            0.273,
            0.745,
            0.286
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.028Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.698,
                  0.273,
                  0.745,
                  0.286
                ],
                "normalized_bbox": [
                  0.698,
                  0.273,
                  0.745,
                  0.286
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "7_PRE-DRILLED_LINER-2",
        "type": "text_annotation",
        "label": "7\" PRE-DRILLED LINER",
        "bbox": [
          0.81,
          0.326,
          0.95,
          0.339
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block '7\" PRE-DRILLED LINER'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.81,
            0.326,
            0.95,
            0.339
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.029Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.81,
                  0.326,
                  0.95,
                  0.339
                ],
                "normalized_bbox": [
                  0.81,
                  0.326,
                  0.95,
                  0.339
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TEXT-590",
        "type": "text_annotation",
        "label": "590",
        "bbox": [
          0.887,
          0.38,
          0.914,
          0.393
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a numerical text block '590'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.887,
            0.38,
            0.914,
            0.393
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.029Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.887,
                  0.38,
                  0.914,
                  0.393
                ],
                "normalized_bbox": [
                  0.887,
                  0.38,
                  0.914,
                  0.393
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SIGNAL_CONDITIONER-S-1",
        "type": "instrument_relay",
        "label": "S",
        "bbox": [
          0.407,
          0.46,
          0.44,
          0.493
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a triangle symbol with 'S' inside, indicating a signal conditioner or relay, likely a switch function.",
          "description": "Signal Conditioner/Relay (Switch)",
          "functional_desc": "Switch / Relay",
          "hvac_subsystem": "controls",
          "instrument_function": "S",
          "instrument_type": "Logic",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "S",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.407,
            0.46,
            0.44,
            0.493
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.029Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.407,
                  0.46,
                  0.44,
                  0.493
                ],
                "normalized_bbox": [
                  0.407,
                  0.46,
                  0.44,
                  0.493
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SIGNAL_CONDITIONER-C-1",
        "type": "instrument_relay",
        "label": "C",
        "bbox": [
          0.461,
          0.46,
          0.494,
          0.493
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a triangle symbol with 'C' inside, indicating a signal conditioner or relay, likely a control function.",
          "description": "Signal Conditioner/Relay (Control)",
          "functional_desc": "Controller / Relay",
          "hvac_subsystem": "controls",
          "instrument_function": "C",
          "instrument_type": "Logic",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "C",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.461,
            0.46,
            0.494,
            0.493
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.029Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.461,
                  0.46,
                  0.494,
                  0.493
                ],
                "normalized_bbox": [
                  0.461,
                  0.46,
                  0.494,
                  0.493
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TEXT-FCW",
        "type": "text_annotation",
        "label": "FCW",
        "bbox": [
          0.499,
          0.46,
          0.529,
          0.473
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'FCW'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.499,
            0.46,
            0.529,
            0.473
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.030Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.499,
                  0.46,
                  0.529,
                  0.473
                ],
                "normalized_bbox": [
                  0.499,
                  0.46,
                  0.529,
                  0.473
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SIGNAL_CONDITIONER-unlabeled-1",
        "type": "instrument_relay",
        "label": "SIGNAL CONDITIONER",
        "bbox": [
          0.548,
          0.46,
          0.581,
          0.493
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as an unlabeled triangle symbol, indicating a signal conditioner or relay.",
          "description": "Unlabeled Signal Conditioner/Relay",
          "hvac_subsystem": "controls",
          "instrument_type": "Logic",
          "location": "Field",
          "occlusion_level": "none",
          "text_clarity": "unreadable",
          "raw_backend_output": [
            0.548,
            0.46,
            0.581,
            0.493
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.030Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.548,
                  0.46,
                  0.581,
                  0.493
                ],
                "normalized_bbox": [
                  0.548,
                  0.46,
                  0.581,
                  0.493
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PALL-292204",
        "type": "instrument_controller",
        "label": "PALL-292204",
        "bbox": [
          0.59,
          0.429,
          0.64,
          0.469
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a hexagon with 'PALL' and '292204' inside, indicating a computer function for Pressure Alarm Low/Level.",
          "description": "Pressure Alarm Low/Level (Computer Function)",
          "functional_desc": "Pressure Alarm Low/Level",
          "hvac_subsystem": "controls",
          "instrument_function": "PAL",
          "instrument_type": "Computer",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PALL-292204",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.59,
            0.429,
            0.64,
            0.469
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.030Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.59,
                  0.429,
                  0.64,
                  0.469
                ],
                "normalized_bbox": [
                  0.59,
                  0.429,
                  0.64,
                  0.469
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SET_13.8_barg",
        "type": "text_annotation",
        "label": "SET @ 13.8 barg",
        "bbox": [
          0.644,
          0.439,
          0.73,
          0.462
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'SET @ 13.8 barg'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.644,
            0.439,
            0.73,
            0.462
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.030Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.644,
                  0.439,
                  0.73,
                  0.462
                ],
                "normalized_bbox": [
                  0.644,
                  0.439,
                  0.73,
                  0.462
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PT-292204",
        "type": "sensor_pressure",
        "label": "PT-292204",
        "bbox": [
          0.59,
          0.52,
          0.637,
          0.567
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PT' and '292204' inside, indicating a discrete Pressure Transmitter, field mounted.",
          "description": "Pressure Transmitter",
          "functional_desc": "Pressure Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PT-292204",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.59,
            0.52,
            0.637,
            0.567
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.031Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.59,
                  0.52,
                  0.637,
                  0.567
                ],
                "normalized_bbox": [
                  0.59,
                  0.52,
                  0.637,
                  0.567
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PT-292205",
        "type": "sensor_pressure",
        "label": "PT-292205",
        "bbox": [
          0.499,
          0.52,
          0.546,
          0.567
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PT' and '292205' inside, indicating a discrete Pressure Transmitter, field mounted.",
          "description": "Pressure Transmitter",
          "functional_desc": "Pressure Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PT-292205",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.499,
            0.52,
            0.546,
            0.567
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.031Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.499,
                  0.52,
                  0.546,
                  0.567
                ],
                "normalized_bbox": [
                  0.499,
                  0.52,
                  0.546,
                  0.567
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-292208",
        "type": "sensor_temperature",
        "label": "TT-292208",
        "bbox": [
          0.445,
          0.52,
          0.492,
          0.567
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'TT' and '292208' inside, indicating a discrete Temperature Transmitter, field mounted.",
          "description": "Temperature Transmitter",
          "functional_desc": "Temperature Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TT-292208",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.445,
            0.52,
            0.492,
            0.567
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.031Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.445,
                  0.52,
                  0.492,
                  0.567
                ],
                "normalized_bbox": [
                  0.445,
                  0.52,
                  0.492,
                  0.567
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TT-292206",
        "type": "sensor_temperature",
        "label": "TT-292206",
        "bbox": [
          0.391,
          0.52,
          0.438,
          0.567
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'TT' and '292206' inside, indicating a discrete Temperature Transmitter, field mounted.",
          "description": "Temperature Transmitter",
          "functional_desc": "Temperature Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "T",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TT-292206",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.391,
            0.52,
            0.438,
            0.567
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.031Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.391,
                  0.52,
                  0.438,
                  0.567
                ],
                "normalized_bbox": [
                  0.391,
                  0.52,
                  0.438,
                  0.567
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PI-292203",
        "type": "sensor_pressure",
        "label": "PI-292203",
        "bbox": [
          0.798,
          0.479,
          0.845,
          0.526
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PI' and '292203' inside, indicating a discrete Pressure Indicator, field mounted.",
          "description": "Pressure Indicator",
          "functional_desc": "Pressure Indicator",
          "hvac_subsystem": "controls",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PI-292203",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.798,
            0.479,
            0.845,
            0.526
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.031Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.798,
                  0.479,
                  0.845,
                  0.526
                ],
                "normalized_bbox": [
                  0.798,
                  0.479,
                  0.845,
                  0.526
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
        "id": "NOTE_11-right",
        "type": "text_annotation",
        "label": "NOTE 11",
        "bbox": [
          0.798,
          0.457,
          0.845,
          0.47
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'NOTE 11'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.798,
            0.457,
            0.845,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.031Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.798,
                  0.457,
                  0.845,
                  0.47
                ],
                "normalized_bbox": [
                  0.798,
                  0.457,
                  0.845,
                  0.47
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "ASDC-1-GPS-292202-ED1",
        "type": "text_annotation",
        "label": "ASDC-1\"-GPS-292202-ED1",
        "bbox": [
          0.76,
          0.409,
          0.773,
          0.57
        ],
        "confidence": 0.98,
        "rotation": 270,
        "meta": {
          "reasoning": "Identified as a vertical text block 'ASDC-1\"-GPS-292202-ED1'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.76,
            0.409,
            0.773,
            0.57
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.031Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.76,
                  0.409,
                  0.773,
                  0.57
                ],
                "normalized_bbox": [
                  0.76,
                  0.409,
                  0.773,
                  0.57
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "VALVE-manual-1",
        "type": "valve_control",
        "label": "VALVE-manual-1",
        "bbox": [
          0.508,
          0.579,
          0.537,
          0.608
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual valve symbol (diamond shape with implied handwheel), with '1\"' size annotation.",
          "description": "1 inch Manual Isolation Valve",
          "hvac_subsystem": "chilled_water",
          "instrument_type": "Mechanical",
          "location": "Field",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.508,
            0.579,
            0.537,
            0.608
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.508,
                  0.579,
                  0.537,
                  0.608
                ],
                "normalized_bbox": [
                  0.508,
                  0.579,
                  0.537,
                  0.608
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "VALVE-manual-2",
        "type": "valve_control",
        "label": "VALVE-manual-2",
        "bbox": [
          0.599,
          0.579,
          0.628,
          0.608
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual valve symbol (diamond shape with implied handwheel), with '1\"' size annotation and 'LO' indicating Lock Open.",
          "description": "1 inch Manual Isolation Valve, Lock Open",
          "hvac_subsystem": "chilled_water",
          "instrument_type": "Mechanical",
          "location": "Field",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.599,
            0.579,
            0.628,
            0.608
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.599,
                  0.579,
                  0.628,
                  0.608
                ],
                "normalized_bbox": [
                  0.599,
                  0.579,
                  0.628,
                  0.608
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "VALVE-manual-3",
        "type": "valve_control",
        "label": "VALVE-manual-3",
        "bbox": [
          0.807,
          0.579,
          0.836,
          0.608
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual valve symbol (diamond shape with implied handwheel), with '1\"' size annotation.",
          "description": "1 inch Manual Isolation Valve",
          "hvac_subsystem": "chilled_water",
          "instrument_type": "Mechanical",
          "location": "Field",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.807,
            0.579,
            0.836,
            0.608
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.807,
                  0.579,
                  0.836,
                  0.608
                ],
                "normalized_bbox": [
                  0.807,
                  0.579,
                  0.836,
                  0.608
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIPE-MAIN-HORIZONTAL",
        "type": "pipe",
        "label": "Main Process Pipe",
        "bbox": [
          0,
          0.385,
          1,
          0.398
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a thick solid horizontal line spanning across the diagram, representing a main process pipe.",
          "description": "Main process fluid line, likely chilled water based on connected instruments.",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "n/a",
          "raw_backend_output": [
            0,
            0.385,
            1,
            0.398
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0,
                  0.385,
                  1,
                  0.398
                ],
                "normalized_bbox": [
                  0,
                  0.385,
                  1,
                  0.398
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIPE-1/2-ZONE2-INLET",
        "type": "pipe",
        "label": "1/2\" Pipe",
        "bbox": [
          0.353,
          0.28,
          0.366,
          0.385
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line with '1/2\"' annotation, connecting to FCV-301217.",
          "description": "1/2 inch process pipe for Zone 2 inlet.",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.353,
            0.28,
            0.366,
            0.385
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.353,
                  0.28,
                  0.366,
                  0.385
                ],
                "normalized_bbox": [
                  0.353,
                  0.28,
                  0.366,
                  0.385
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIPE-1/2-ZONE1-INLET",
        "type": "pipe",
        "label": "1/2\" Pipe",
        "bbox": [
          0.59,
          0.28,
          0.603,
          0.385
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line with '1/2\"' annotation, connecting to FCV-301220.",
          "description": "1/2 inch process pipe for Zone 1 inlet.",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.59,
            0.28,
            0.603,
            0.385
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.59,
                  0.28,
                  0.603,
                  0.385
                ],
                "normalized_bbox": [
                  0.59,
                  0.28,
                  0.603,
                  0.385
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIPE-2-TT292206",
        "type": "pipe",
        "label": "2\" Pipe",
        "bbox": [
          0.407,
          0.579,
          0.42,
          0.608
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line with '2\"' annotation, connected below TT-292206.",
          "description": "2 inch process pipe.",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.407,
            0.579,
            0.42,
            0.608
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.407,
                  0.579,
                  0.42,
                  0.608
                ],
                "normalized_bbox": [
                  0.407,
                  0.579,
                  0.42,
                  0.608
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIPE-2-TT292208",
        "type": "pipe",
        "label": "2\" Pipe",
        "bbox": [
          0.461,
          0.579,
          0.474,
          0.608
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line with '2\"' annotation, connected below TT-292208.",
          "description": "2 inch process pipe.",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.461,
            0.579,
            0.474,
            0.608
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.461,
                  0.579,
                  0.474,
                  0.608
                ],
                "normalized_bbox": [
                  0.461,
                  0.579,
                  0.474,
                  0.608
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIPE-4x2-HORIZONTAL",
        "type": "pipe",
        "label": "4\" x 2\" Pipe",
        "bbox": [
          0.445,
          0.608,
          0.492,
          0.621
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified by text '4\" x 2\"' indicating a pipe dimension for a horizontal pipe segment.",
          "description": "4 inch by 2 inch process pipe.",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.445,
            0.608,
            0.492,
            0.621
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.032Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.445,
                  0.608,
                  0.492,
                  0.621
                ],
                "normalized_bbox": [
                  0.445,
                  0.608,
                  0.492,
                  0.621
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PIPE-2x1.5-HORIZONTAL",
        "type": "pipe",
        "label": "2\" x 1 1/2\" Pipe",
        "bbox": [
          0.845,
          0.608,
          0.92,
          0.621
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified by text '2\" x 1 1/2\"' indicating a pipe dimension for a horizontal pipe segment.",
          "description": "2 inch by 1 1/2 inch process pipe.",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.845,
            0.608,
            0.92,
            0.621
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.033Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.845,
                  0.608,
                  0.92,
                  0.621
                ],
                "normalized_bbox": [
                  0.845,
                  0.608,
                  0.92,
                  0.621
                ]
              }
            }
          ],
          "component_category": "water_system",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "NOTE_15",
        "type": "text_annotation",
        "label": "NOTE 15",
        "bbox": [
          0.7,
          0.608,
          0.747,
          0.621
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'NOTE 15'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.7,
            0.608,
            0.747,
            0.621
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.033Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.7,
                  0.608,
                  0.747,
                  0.621
                ],
                "normalized_bbox": [
                  0.7,
                  0.608,
                  0.747,
                  0.621
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "NOTE_8",
        "type": "text_annotation",
        "label": "NOTE 8",
        "bbox": [
          0.7,
          0.63,
          0.747,
          0.643
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text block 'NOTE 8'.",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.7,
            0.63,
            0.747,
            0.643
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.033Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.7,
                  0.63,
                  0.747,
                  0.643
                ],
                "normalized_bbox": [
                  0.7,
                  0.63,
                  0.747,
                  0.643
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "DATA_LINK-TOP",
        "type": "data",
        "label": "Data Link Bus",
        "bbox": [
          0.353,
          0.25,
          0.8,
          0.26
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a horizontal line with circles (o-o-o) indicating a software/data link bus connecting multiple instruments.",
          "description": "Main data communication bus for field instruments.",
          "hvac_subsystem": "controls",
          "instrument_type": "Data",
          "location": "Field",
          "occlusion_level": "none",
          "text_clarity": "n/a",
          "raw_backend_output": [
            0.353,
            0.25,
            0.8,
            0.26
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:03:00.033Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.353,
                  0.25,
                  0.8,
                  0.26
                ],
                "normalized_bbox": [
                  0.353,
                  0.25,
                  0.8,
                  0.26
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      }
    ],
    "connections": [
      {
        "id": "1767564180033-d82ido9xg",
        "from_id": "SVC-1",
        "to_id": "POSITION_INDICATOR-1",
        "type": "electric_signal",
        "confidence": 0.98
      },
      {
        "id": "1767564180033-1rbe77f95",
        "from_id": "POSITION_INDICATOR-1",
        "to_id": "SDV-unlabeled-1",
        "type": "electric_signal",
        "confidence": 0.98
      },
      {
        "id": "1767564180033-19lfx47vq",
        "from_id": "PIPE-MAIN-HORIZONTAL",
        "to_id": "PIPE-1/2-ZONE2-INLET",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180033-llleycz4g",
        "from_id": "PIPE-1/2-ZONE2-INLET",
        "to_id": "FCV-301217",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180033-kyy7xqjuu",
        "from_id": "FCV-301217",
        "to_id": "PT-301218",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180033-u7cz72hg0",
        "from_id": "PT-301218",
        "to_id": "TT-301219",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180033-pi4bu2db6",
        "from_id": "PIPE-MAIN-HORIZONTAL",
        "to_id": "PIPE-1/2-ZONE1-INLET",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180033-4t81gfz1v",
        "from_id": "PIPE-1/2-ZONE1-INLET",
        "to_id": "FCV-301220",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180033-4eb6wwezg",
        "from_id": "FCV-301220",
        "to_id": "BV-301221",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180033-bo2b3uf0y",
        "from_id": "BV-301221",
        "to_id": "PT-301222",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180034-awnt5x48k",
        "from_id": "PT-301222",
        "to_id": "TT-301223",
        "type": "chilled_water",
        "confidence": 0.99
      },
      {
        "id": "1767564180034-r0dsxnuur",
        "from_id": "PT-301218",
        "to_id": "SIGNAL_CONDITIONER-S-1",
        "type": "electric_signal",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-354agysra",
        "from_id": "TT-301219",
        "to_id": "SIGNAL_CONDITIONER-C-1",
        "type": "electric_signal",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-a3ryuuc1e",
        "from_id": "SIGNAL_CONDITIONER-S-1",
        "to_id": "TT-292206",
        "type": "electric_signal",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-51tbni4gz",
        "from_id": "SIGNAL_CONDITIONER-C-1",
        "to_id": "TT-292208",
        "type": "electric_signal",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-qzhtmt9ub",
        "from_id": "SIGNAL_CONDITIONER-unlabeled-1",
        "to_id": "PT-292205",
        "type": "electric_signal",
        "confidence": 0.9
      },
      {
        "id": "1767564180034-36qdtecsz",
        "from_id": "PALL-292204",
        "to_id": "PT-292204",
        "type": "electric_signal",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-epzbn1m7s",
        "from_id": "PT-292205",
        "to_id": "VALVE-manual-1",
        "type": "chilled_water",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-v28khjxy2",
        "from_id": "PT-292204",
        "to_id": "VALVE-manual-2",
        "type": "chilled_water",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-9hi5kv76v",
        "from_id": "PI-292203",
        "to_id": "VALVE-manual-3",
        "type": "chilled_water",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-pk97zwxoj",
        "from_id": "VALVE-manual-1",
        "to_id": "PIPE-4x2-HORIZONTAL",
        "type": "chilled_water",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-jv518j7l3",
        "from_id": "VALVE-manual-2",
        "to_id": "PIPE-4x2-HORIZONTAL",
        "type": "chilled_water",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-hk3wf9nrj",
        "from_id": "VALVE-manual-3",
        "to_id": "PIPE-2x1.5-HORIZONTAL",
        "type": "chilled_water",
        "confidence": 0.98
      },
      {
        "id": "1767564180034-64tey0mbb",
        "from_id": "DATA_LINK-TOP",
        "to_id": "FCV-301217",
        "type": "data",
        "confidence": 0.95
      },
      {
        "id": "1767564180034-9r4buu58h",
        "from_id": "DATA_LINK-TOP",
        "to_id": "PT-301218",
        "type": "data",
        "confidence": 0.95
      },
      {
        "id": "1767564180034-2u5p820zy",
        "from_id": "DATA_LINK-TOP",
        "to_id": "TT-301219",
        "type": "data",
        "confidence": 0.95
      },
      {
        "id": "1767564180034-69omdxim4",
        "from_id": "DATA_LINK-TOP",
        "to_id": "FCV-301220",
        "type": "data",
        "confidence": 0.95
      },
      {
        "id": "1767564180034-ncp7edf1u",
        "from_id": "DATA_LINK-TOP",
        "to_id": "BV-301221",
        "type": "data",
        "confidence": 0.95
      },
      {
        "id": "1767564180034-kq8pf8co2",
        "from_id": "DATA_LINK-TOP",
        "to_id": "PT-301222",
        "type": "data",
        "confidence": 0.95
      },
      {
        "id": "1767564180034-2m3armsa1",
        "from_id": "DATA_LINK-TOP",
        "to_id": "TT-301223",
        "type": "data",
        "confidence": 0.95
      }
    ],
    "metadata": {
      "total_components": 45,
      "total_connections": 30,
      "process_log": "The provided schematic details a process control system for two distinct zones (Zone 1 and Zone 2), likely involving fluid flow, pressure, and temperature monitoring. Each zone features a Flow Control Valve (FCV), Pressure Transmitter (PT), and Temperature Transmitter (TT), suggesting individual zone control and monitoring. A main data link bus connects these field instruments to a supervisory system. The diagram also includes a pressure alarm (PALL) with a defined setpoint, and several manual isolation valves, some with specific operational states like 'Lock Open'. A separate control loop involving a Signal Converter (SVC), Position Indicator, and Solenoid Operated Valve (SDV) is present, indicating a safety or critical control function. The use of specialized 'PRE-DRILLED LINER' and 'TUBING' suggests a specific application for the process fluid. The overall design indicates a robust, instrumented system with provisions for control, monitoring, and safety."
    }
  }
}