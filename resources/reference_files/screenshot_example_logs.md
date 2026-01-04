Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":0.98,"reasoning":"The document displays process flow lines, instrumentation symbols (e.g., CVA, PT, HS, SOV), and control logic connections. These elements are characteristic of a Process and Instrumentation Diagram (P&ID) or a control schematic, which falls under the 'SCHEMATIC' classification."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767558768340-2vfh670tn","type":"SCHEMATIC","processing_time_ms":63274,"components":47}]

{
  "document_id": "1767558768340-2vfh670tn",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767558831614,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 0.98,
    "reasoning": "The document displays process flow lines, instrumentation symbols (e.g., CVA, PT, HS, SOV), and control logic connections. These elements are characteristic of a Process and Instrumentation Diagram (P&ID) or a control schematic, which falls under the 'SCHEMATIC' classification."
  },
  "processing_time_ms": 63274,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "SVC-1",
        "type": "instrument_controller",
        "label": "SVC",
        "bbox": [
          0.0805,
          0.392,
          0.158,
          0.457
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a rectangle with 'SVC' and 'P' inside, indicating a Service Controller with a pump function. Connected via electric signal (dashed line).",
          "description": "Service Controller with pump function",
          "functional_desc": "Service / Pump Controller",
          "hvac_subsystem": "controls",
          "instrument_function": "SVC",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "SVC",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.0805,
            0.392,
            0.158,
            0.457
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.0805,
                  0.392,
                  0.158,
                  0.457
                ],
                "normalized_bbox": [
                  0.0805,
                  0.392,
                  0.158,
                  0.457
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
        "id": "PI-1",
        "type": "sensor_pressure",
        "label": "PI",
        "bbox": [
          0.247,
          0.392,
          0.297,
          0.437
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PI' inside, indicating a Pressure Indicator. Field mounted.",
          "description": "Pressure Indicator",
          "functional_desc": "Pressure Indicator",
          "hvac_subsystem": "controls",
          "instrument_function": "PI",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PI",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.247,
            0.392,
            0.297,
            0.437
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.247,
                  0.392,
                  0.297,
                  0.437
                ],
                "normalized_bbox": [
                  0.247,
                  0.392,
                  0.297,
                  0.437
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
          0.299,
          0.456,
          0.379,
          0.499
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a square box with diagonal lines and 'POSITION INDICATOR' text, indicating a position indicator. Connected via mechanical link and electric signal.",
          "description": "Position Indicator",
          "functional_desc": "Position Indicator",
          "hvac_subsystem": "controls",
          "instrument_function": "Z",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "POSITION INDICATOR",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.299,
            0.456,
            0.379,
            0.499
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.299,
                  0.456,
                  0.379,
                  0.499
                ],
                "normalized_bbox": [
                  0.299,
                  0.456,
                  0.379,
                  0.499
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
        "id": "SDV-1",
        "type": "valve_solenoid",
        "label": "SDV",
        "bbox": [
          0.306,
          0.548,
          0.356,
          0.593
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'SDV' inside, indicating a Solenoid Operated Valve. Field mounted.",
          "description": "Solenoid Operated Valve",
          "functional_desc": "Switch / User's Choice / Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "SDV",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "SDV",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.306,
            0.548,
            0.356,
            0.593
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.306,
                  0.548,
                  0.356,
                  0.593
                ],
                "normalized_bbox": [
                  0.306,
                  0.548,
                  0.356,
                  0.593
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
        "id": "FCV-301217",
        "type": "valve_control",
        "label": "FCV-301217",
        "bbox": [
          0.177,
          0.297,
          0.222,
          0.347
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'FCV' inside and loop number '301217', indicating a Flow Control Valve. Field mounted.",
          "description": "Flow Control Valve",
          "functional_desc": "Flow Rate / Controller / Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "FCV",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FCV-301217",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.297,
            0.177,
            0.347,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.297,
                  0.177,
                  0.347,
                  0.222
                ],
                "normalized_bbox": [
                  0.177,
                  0.297,
                  0.222,
                  0.347
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
          0.177,
          0.362,
          0.222,
          0.412
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PT' inside and loop number '301218', indicating a Pressure Transmitter. Field mounted.",
          "description": "Pressure Transmitter",
          "functional_desc": "Pressure / Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "PT",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PT-301218",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.362,
            0.177,
            0.412,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.362,
                  0.177,
                  0.412,
                  0.222
                ],
                "normalized_bbox": [
                  0.177,
                  0.362,
                  0.222,
                  0.412
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
          0.177,
          0.427,
          0.222,
          0.477
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'TT' inside and loop number '301219', indicating a Temperature Transmitter. Field mounted.",
          "description": "Temperature Transmitter",
          "functional_desc": "Temperature / Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "TT",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TT-301219",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.427,
            0.177,
            0.477,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.427,
                  0.177,
                  0.477,
                  0.222
                ],
                "normalized_bbox": [
                  0.177,
                  0.427,
                  0.222,
                  0.477
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
        "id": "FCV-301220",
        "type": "valve_control",
        "label": "FCV-301220",
        "bbox": [
          0.177,
          0.587,
          0.222,
          0.637
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'FCV' inside and loop number '301220', indicating a Flow Control Valve. Field mounted.",
          "description": "Flow Control Valve",
          "functional_desc": "Flow Rate / Controller / Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "FCV",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FCV-301220",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.587,
            0.177,
            0.637,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.587,
                  0.177,
                  0.637,
                  0.222
                ],
                "normalized_bbox": [
                  0.177,
                  0.587,
                  0.222,
                  0.637
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
          0.177,
          0.652,
          0.222,
          0.702
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'BV' inside and loop number '301221', indicating a Ball Valve. Field mounted.",
          "description": "Ball Valve",
          "functional_desc": "Burner / Combustion / Valve (User's Choice)",
          "hvac_subsystem": "controls",
          "instrument_function": "BV",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "BV-301221",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.652,
            0.177,
            0.702,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.652,
                  0.177,
                  0.702,
                  0.222
                ],
                "normalized_bbox": [
                  0.177,
                  0.652,
                  0.222,
                  0.702
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
          0.177,
          0.717,
          0.222,
          0.767
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PT' inside and loop number '301222', indicating a Pressure Transmitter. Field mounted.",
          "description": "Pressure Transmitter",
          "functional_desc": "Pressure / Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "PT",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PT-301222",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.717,
            0.177,
            0.767,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.717,
                  0.177,
                  0.767,
                  0.222
                ],
                "normalized_bbox": [
                  0.177,
                  0.717,
                  0.222,
                  0.767
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
          0.177,
          0.782,
          0.222,
          0.832
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'TT' inside and loop number '301223', indicating a Temperature Transmitter. Field mounted.",
          "description": "Temperature Transmitter",
          "functional_desc": "Temperature / Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "TT",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TT-301223",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.782,
            0.177,
            0.832,
            0.222
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.782,
                  0.177,
                  0.832,
                  0.222
                ],
                "normalized_bbox": [
                  0.177,
                  0.782,
                  0.222,
                  0.832
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
        "id": "PALL-292204",
        "type": "instrument_controller",
        "label": "PALL-292204",
        "bbox": [
          0.392,
          0.597,
          0.437,
          0.647
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a hexagon with 'PALL' inside and loop number '292204', indicating a Pressure Alarm Low Level computer function. Connected via electric signal (dashed line).",
          "description": "Pressure Alarm Low Level",
          "functional_desc": "Pressure / Alarm / Low / Low",
          "hvac_subsystem": "controls",
          "instrument_function": "PALL",
          "instrument_type": "Computer",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PALL-292204",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.597,
            0.392,
            0.647,
            0.437
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.597,
                  0.392,
                  0.647,
                  0.437
                ],
                "normalized_bbox": [
                  0.392,
                  0.597,
                  0.437,
                  0.647
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
        "id": "FCW-1",
        "type": "instrument_relay",
        "label": "FCW",
        "bbox": [
          0.392,
          0.507,
          0.437,
          0.557
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a triangle with 'C' inside and 'FCW' text, indicating a signal converter/relay for Flow Control Water. Connected via electric signal (dashed line).",
          "description": "Flow Control Water Signal Converter",
          "functional_desc": "Flow Rate / Controller / User's Choice",
          "hvac_subsystem": "controls",
          "instrument_function": "FCW",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FCW",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.507,
            0.392,
            0.557,
            0.437
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.507,
                  0.392,
                  0.557,
                  0.437
                ],
                "normalized_bbox": [
                  0.392,
                  0.507,
                  0.437,
                  0.557
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
        "id": "PT-292205",
        "type": "sensor_pressure",
        "label": "PT-292205",
        "bbox": [
          0.497,
          0.548,
          0.547,
          0.593
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PT' inside and loop number '292205', indicating a Pressure Transmitter. Field mounted.",
          "description": "Pressure Transmitter",
          "functional_desc": "Pressure / Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "PT",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PT-292205",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.497,
            0.548,
            0.547,
            0.593
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.497,
                  0.548,
                  0.547,
                  0.593
                ],
                "normalized_bbox": [
                  0.497,
                  0.548,
                  0.547,
                  0.593
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
        "id": "PT-292204",
        "type": "sensor_pressure",
        "label": "PT-292204",
        "bbox": [
          0.548,
          0.602,
          0.593,
          0.652
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PT' inside and loop number '292204', indicating a Pressure Transmitter. Field mounted. Note the shared loop number with PALL-292204.",
          "description": "Pressure Transmitter",
          "functional_desc": "Pressure / Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "PT",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PT-292204",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.602,
            0.548,
            0.652,
            0.593
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.602,
                  0.548,
                  0.652,
                  0.593
                ],
                "normalized_bbox": [
                  0.548,
                  0.602,
                  0.593,
                  0.652
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
        "id": "PI-292203",
        "type": "sensor_pressure",
        "label": "PI-292203",
        "bbox": [
          0.548,
          0.797,
          0.593,
          0.847
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'PI' inside and loop number '292203', indicating a Pressure Indicator. Field mounted.",
          "description": "Pressure Indicator",
          "functional_desc": "Pressure / Indicator",
          "hvac_subsystem": "controls",
          "instrument_function": "PI",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PI-292203",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.797,
            0.548,
            0.847,
            0.593
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.797,
                  0.548,
                  0.847,
                  0.593
                ],
                "normalized_bbox": [
                  0.548,
                  0.797,
                  0.593,
                  0.847
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
        "id": "TT-292206",
        "type": "sensor_temperature",
        "label": "TT-292206",
        "bbox": [
          0.382,
          0.548,
          0.432,
          0.593
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'TT' inside and loop number '292206', indicating a Temperature Transmitter. Field mounted.",
          "description": "Temperature Transmitter",
          "functional_desc": "Temperature / Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "TT",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TT-292206",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.382,
            0.548,
            0.432,
            0.593
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.382,
                  0.548,
                  0.432,
                  0.593
                ],
                "normalized_bbox": [
                  0.382,
                  0.548,
                  0.432,
                  0.593
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
        "id": "TT-292208",
        "type": "sensor_temperature",
        "label": "TT-292208",
        "bbox": [
          0.447,
          0.548,
          0.497,
          0.593
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a circle with 'TT' inside and loop number '292208', indicating a Temperature Transmitter. Field mounted.",
          "description": "Temperature Transmitter",
          "functional_desc": "Temperature / Transmitter",
          "hvac_subsystem": "controls",
          "instrument_function": "TT",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TT-292208",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.447,
            0.548,
            0.497,
            0.593
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.447,
                  0.548,
                  0.497,
                  0.593
                ],
                "normalized_bbox": [
                  0.447,
                  0.548,
                  0.497,
                  0.593
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
        "id": "SIGNAL_RELAY-S-1",
        "type": "instrument_relay",
        "label": "S",
        "bbox": [
          0.382,
          0.456,
          0.432,
          0.501
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a triangle with 'S' inside, indicating a signal relay or switch. Connected via electric signal (dashed line).",
          "description": "Signal Relay/Switch",
          "functional_desc": "Switch",
          "hvac_subsystem": "controls",
          "instrument_function": "S",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "S",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.382,
            0.456,
            0.432,
            0.501
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.382,
                  0.456,
                  0.432,
                  0.501
                ],
                "normalized_bbox": [
                  0.382,
                  0.456,
                  0.432,
                  0.501
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
        "id": "SIGNAL_RELAY-C-1",
        "type": "instrument_relay",
        "label": "C",
        "bbox": [
          0.447,
          0.456,
          0.497,
          0.501
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a triangle with 'C' inside, indicating a signal relay or converter. Connected via electric signal (dashed line).",
          "description": "Signal Relay/Converter",
          "functional_desc": "Controller",
          "hvac_subsystem": "controls",
          "instrument_function": "C",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "C",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.447,
            0.456,
            0.497,
            0.501
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.447,
                  0.456,
                  0.497,
                  0.501
                ],
                "normalized_bbox": [
                  0.447,
                  0.456,
                  0.497,
                  0.501
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
        "id": "SIGNAL_RELAY-S-2",
        "type": "instrument_relay",
        "label": "S",
        "bbox": [
          0.456,
          0.602,
          0.501,
          0.652
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a triangle with 'S' inside, indicating a signal relay or switch. Connected via electric signal (dashed line).",
          "description": "Signal Relay/Switch",
          "functional_desc": "Switch",
          "hvac_subsystem": "controls",
          "instrument_function": "S",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "S",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.602,
            0.456,
            0.652,
            0.501
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.602,
                  0.456,
                  0.652,
                  0.501
                ],
                "normalized_bbox": [
                  0.456,
                  0.602,
                  0.501,
                  0.652
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
        "id": "MANUAL_VALVE-1",
        "type": "valve_manual",
        "label": "Manual Valve",
        "bbox": [
          0.306,
          0.509,
          0.356,
          0.539
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a gate valve symbol with a T-bar handle, indicating a manual valve. Connected to the Position Indicator.",
          "description": "Manual Gate Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "none",
          "raw_backend_output": [
            0.306,
            0.509,
            0.356,
            0.539
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.306,
                  0.509,
                  0.356,
                  0.539
                ],
                "normalized_bbox": [
                  0.306,
                  0.509,
                  0.356,
                  0.539
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
        "id": "MANUAL_VALVE-2",
        "type": "valve_manual",
        "label": "Manual Valve",
        "bbox": [
          0.497,
          0.602,
          0.547,
          0.632
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a gate valve symbol with a T-bar handle, indicating a manual valve. Connected to PT-292205.",
          "description": "Manual Gate Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "none",
          "raw_backend_output": [
            0.497,
            0.602,
            0.547,
            0.632
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.497,
                  0.602,
                  0.547,
                  0.632
                ],
                "normalized_bbox": [
                  0.497,
                  0.602,
                  0.547,
                  0.632
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
        "id": "MANUAL_VALVE-3",
        "type": "valve_manual",
        "label": "Manual Valve",
        "bbox": [
          0.602,
          0.602,
          0.652,
          0.632
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a gate valve symbol with a T-bar handle, indicating a manual valve. Connected to PT-292204.",
          "description": "Manual Gate Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "none",
          "raw_backend_output": [
            0.602,
            0.602,
            0.652,
            0.632
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.602,
                  0.602,
                  0.652,
                  0.632
                ],
                "normalized_bbox": [
                  0.602,
                  0.602,
                  0.652,
                  0.632
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
        "id": "MANUAL_VALVE-4",
        "type": "valve_manual",
        "label": "Manual Valve",
        "bbox": [
          0.602,
          0.797,
          0.632,
          0.847
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a gate valve symbol with a T-bar handle, indicating a manual valve. Connected to PI-292203.",
          "description": "Manual Gate Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "none",
          "raw_backend_output": [
            0.797,
            0.602,
            0.847,
            0.632
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.797,
                  0.602,
                  0.847,
                  0.632
                ],
                "normalized_bbox": [
                  0.602,
                  0.797,
                  0.632,
                  0.847
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
        "id": "MANUAL_VALVE-5",
        "type": "valve_manual",
        "label": "Manual Valve",
        "bbox": [
          0.231,
          0.297,
          0.261,
          0.347
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a gate valve symbol with a T-bar handle, indicating a manual valve. Connected to FCV-301217.",
          "description": "Manual Gate Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "none",
          "raw_backend_output": [
            0.297,
            0.231,
            0.347,
            0.261
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.297,
                  0.231,
                  0.347,
                  0.261
                ],
                "normalized_bbox": [
                  0.231,
                  0.297,
                  0.261,
                  0.347
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
        "id": "MANUAL_VALVE-6",
        "type": "valve_manual",
        "label": "Manual Valve",
        "bbox": [
          0.231,
          0.587,
          0.261,
          0.637
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a gate valve symbol with a T-bar handle, indicating a manual valve. Connected to FCV-301220.",
          "description": "Manual Gate Valve",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "none",
          "raw_backend_output": [
            0.587,
            0.231,
            0.637,
            0.261
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.587,
                  0.231,
                  0.637,
                  0.261
                ],
                "normalized_bbox": [
                  0.231,
                  0.587,
                  0.261,
                  0.637
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
        "id": "PIPE-1",
        "type": "pipe",
        "label": "1/2\" Pipe",
        "bbox": [
          0.147,
          0.297,
          0.177,
          0.322
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line labeled '1/2\"', indicating a process pipe.",
          "description": "1/2 inch process pipe",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.297,
            0.147,
            0.322,
            0.177
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.297,
                  0.147,
                  0.322,
                  0.177
                ],
                "normalized_bbox": [
                  0.147,
                  0.297,
                  0.177,
                  0.322
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
        "id": "PIPE-2",
        "type": "pipe",
        "label": "1/2\" Pipe",
        "bbox": [
          0.261,
          0.297,
          0.291,
          0.322
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line labeled '1/2\"', indicating a process pipe.",
          "description": "1/2 inch process pipe",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.297,
            0.261,
            0.322,
            0.291
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.297,
                  0.261,
                  0.322,
                  0.291
                ],
                "normalized_bbox": [
                  0.261,
                  0.297,
                  0.291,
                  0.322
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
        "id": "PIPE-3",
        "type": "pipe",
        "label": "7\" PRE-DRILLED LINER",
        "bbox": [
          0.231,
          0.482,
          0.261,
          0.572
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line with text '7\" PRE-DRILLED LINER', indicating a process pipe.",
          "description": "7 inch pre-drilled liner pipe",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.482,
            0.231,
            0.572,
            0.261
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.482,
                  0.231,
                  0.572,
                  0.261
                ],
                "normalized_bbox": [
                  0.231,
                  0.482,
                  0.261,
                  0.572
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
        "id": "PIPE-4",
        "type": "pipe",
        "label": "4-1/2\" TUBING",
        "bbox": [
          0.291,
          0.482,
          0.321,
          0.572
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line with text '4-1/2\" TUBING', indicating a process tubing.",
          "description": "4-1/2 inch process tubing",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.482,
            0.291,
            0.572,
            0.321
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.482,
                  0.291,
                  0.572,
                  0.321
                ],
                "normalized_bbox": [
                  0.291,
                  0.482,
                  0.321,
                  0.572
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
        "id": "PIPE-5",
        "type": "pipe",
        "label": "2\" Pipe",
        "bbox": [
          0.382,
          0.632,
          0.432,
          0.662
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line labeled '2\"', indicating a process pipe.",
          "description": "2 inch process pipe",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.382,
            0.632,
            0.432,
            0.662
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.382,
                  0.632,
                  0.432,
                  0.662
                ],
                "normalized_bbox": [
                  0.382,
                  0.632,
                  0.432,
                  0.662
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
        "id": "PIPE-6",
        "type": "pipe",
        "label": "2\" Pipe",
        "bbox": [
          0.447,
          0.632,
          0.497,
          0.662
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line labeled '2\"', indicating a process pipe.",
          "description": "2 inch process pipe",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.447,
            0.632,
            0.497,
            0.662
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.612Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.447,
                  0.632,
                  0.497,
                  0.662
                ],
                "normalized_bbox": [
                  0.447,
                  0.632,
                  0.497,
                  0.662
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
        "id": "PIPE-7",
        "type": "pipe",
        "label": "1\" Pipe",
        "bbox": [
          0.497,
          0.632,
          0.547,
          0.662
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line labeled '1\"', indicating a process pipe.",
          "description": "1 inch process pipe",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.497,
            0.632,
            0.547,
            0.662
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.497,
                  0.632,
                  0.547,
                  0.662
                ],
                "normalized_bbox": [
                  0.497,
                  0.632,
                  0.547,
                  0.662
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
        "id": "PIPE-8",
        "type": "pipe",
        "label": "1\" Pipe",
        "bbox": [
          0.602,
          0.632,
          0.652,
          0.662
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line labeled '1\"', indicating a process pipe.",
          "description": "1 inch process pipe",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.602,
            0.632,
            0.652,
            0.662
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.602,
                  0.632,
                  0.652,
                  0.662
                ],
                "normalized_bbox": [
                  0.602,
                  0.632,
                  0.652,
                  0.662
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
        "id": "PIPE-9",
        "type": "pipe",
        "label": "2\" x 1 1/2\" Pipe",
        "bbox": [
          0.632,
          0.797,
          0.662,
          0.847
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a solid line labeled '2\" x 1 1/2\"', indicating a process pipe.",
          "description": "2 inch by 1 1/2 inch process pipe",
          "hvac_subsystem": "chilled_water",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.797,
            0.632,
            0.847,
            0.662
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.797,
                  0.632,
                  0.847,
                  0.662
                ],
                "normalized_bbox": [
                  0.632,
                  0.797,
                  0.662,
                  0.847
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
        "id": "TEXT_ANNOTATION-ZONE-2",
        "type": "text_annotation",
        "label": "ZONE 2",
        "bbox": [
          0.147,
          0.362,
          0.177,
          0.412
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'ZONE 2'.",
          "description": "Zone identifier",
          "hvac_subsystem": "controls",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.362,
            0.147,
            0.412,
            0.177
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.362,
                  0.147,
                  0.412,
                  0.177
                ],
                "normalized_bbox": [
                  0.147,
                  0.362,
                  0.177,
                  0.412
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
        "id": "TEXT_ANNOTATION-ZONE-1",
        "type": "text_annotation",
        "label": "ZONE 1",
        "bbox": [
          0.147,
          0.717,
          0.177,
          0.767
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'ZONE 1'.",
          "description": "Zone identifier",
          "hvac_subsystem": "controls",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.717,
            0.147,
            0.767,
            0.177
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.717,
                  0.147,
                  0.767,
                  0.177
                ],
                "normalized_bbox": [
                  0.147,
                  0.717,
                  0.177,
                  0.767
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
        "id": "TEXT_ANNOTATION-NOTE-41",
        "type": "text_annotation",
        "label": "NOTE 41",
        "bbox": [
          0.297,
          0.321,
          0.347,
          0.351
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'NOTE 41'.",
          "description": "Drawing note reference",
          "hvac_subsystem": "general",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.297,
            0.321,
            0.347,
            0.351
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.297,
                  0.321,
                  0.347,
                  0.351
                ],
                "normalized_bbox": [
                  0.297,
                  0.321,
                  0.347,
                  0.351
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TEXT_ANNOTATION-NOTE-11-1",
        "type": "text_annotation",
        "label": "NOTE 11",
        "bbox": [
          0.306,
          0.593,
          0.356,
          0.623
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'NOTE 11'.",
          "description": "Drawing note reference",
          "hvac_subsystem": "general",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.306,
            0.593,
            0.356,
            0.623
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.306,
                  0.593,
                  0.356,
                  0.623
                ],
                "normalized_bbox": [
                  0.306,
                  0.593,
                  0.356,
                  0.623
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TEXT_ANNOTATION-NOTE-11-2",
        "type": "text_annotation",
        "label": "NOTE 11",
        "bbox": [
          0.518,
          0.797,
          0.548,
          0.847
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'NOTE 11'.",
          "description": "Drawing note reference",
          "hvac_subsystem": "general",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.797,
            0.518,
            0.847,
            0.548
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.797,
                  0.518,
                  0.847,
                  0.548
                ],
                "normalized_bbox": [
                  0.518,
                  0.797,
                  0.548,
                  0.847
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TEXT_ANNOTATION-NOTE-15",
        "type": "text_annotation",
        "label": "NOTE 15",
        "bbox": [
          0.662,
          0.702,
          0.692,
          0.752
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'NOTE 15'.",
          "description": "Drawing note reference",
          "hvac_subsystem": "general",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.702,
            0.662,
            0.752,
            0.692
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.702,
                  0.662,
                  0.752,
                  0.692
                ],
                "normalized_bbox": [
                  0.662,
                  0.702,
                  0.692,
                  0.752
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TEXT_ANNOTATION-NOTE-8",
        "type": "text_annotation",
        "label": "NOTE 8",
        "bbox": [
          0.702,
          0.702,
          0.752,
          0.732
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'NOTE 8'.",
          "description": "Drawing note reference",
          "hvac_subsystem": "general",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.702,
            0.702,
            0.752,
            0.732
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.702,
                  0.702,
                  0.752,
                  0.732
                ],
                "normalized_bbox": [
                  0.702,
                  0.702,
                  0.752,
                  0.732
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TEXT_ANNOTATION-ASDC-1-GPS-292202-ED1",
        "type": "text_annotation",
        "label": "ASDC-1\"-GPS-292202-ED1",
        "bbox": [
          0.456,
          0.672,
          0.646,
          0.697
        ],
        "confidence": 0.95,
        "rotation": 270,
        "meta": {
          "reasoning": "Identified as a vertical text label 'ASDC-1\"-GPS-292202-ED1'.",
          "description": "Drawing or component identifier",
          "hvac_subsystem": "general",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.672,
            0.456,
            0.697,
            0.646
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.672,
                  0.456,
                  0.697,
                  0.646
                ],
                "normalized_bbox": [
                  0.456,
                  0.672,
                  0.646,
                  0.697
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TEXT_ANNOTATION-SET-13.8-barg",
        "type": "text_annotation",
        "label": "SET @ 13.8 barg",
        "bbox": [
          0.422,
          0.652,
          0.452,
          0.702
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a text label 'SET @ 13.8 barg'.",
          "description": "Set point for PALL-292204",
          "hvac_subsystem": "controls",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.652,
            0.422,
            0.702,
            0.452
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.652,
                  0.422,
                  0.702,
                  0.452
                ],
                "normalized_bbox": [
                  0.422,
                  0.652,
                  0.452,
                  0.702
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
        "id": "TEXT_ANNOTATION-0.6",
        "type": "text_annotation",
        "label": ".6",
        "bbox": [
          0.362,
          0.509,
          0.382,
          0.529
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a numerical text label '.6'.",
          "description": "Numerical annotation, possibly a signal value or ratio.",
          "hvac_subsystem": "controls",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.362,
            0.509,
            0.382,
            0.529
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.362,
                  0.509,
                  0.382,
                  0.529
                ],
                "normalized_bbox": [
                  0.362,
                  0.509,
                  0.382,
                  0.529
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
        "id": "TEXT_ANNOTATION-590",
        "type": "text_annotation",
        "label": "590",
        "bbox": [
          0.301,
          0.892,
          0.331,
          0.922
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a numerical text label '590'.",
          "description": "Numerical annotation, possibly a pipe or duct identifier.",
          "hvac_subsystem": "general",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.892,
            0.301,
            0.922,
            0.331
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T20:33:51.613Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.892,
                  0.301,
                  0.922,
                  0.331
                ],
                "normalized_bbox": [
                  0.301,
                  0.892,
                  0.331,
                  0.922
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      }
    ],
    "connections": [
      {
        "id": "1767558831613-hkxauv970",
        "from_id": "SVC-1",
        "to_id": "POSITION_INDICATOR-1",
        "type": "electric_signal",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-kgg8wbwwi",
        "from_id": "MANUAL_VALVE-1",
        "to_id": "POSITION_INDICATOR-1",
        "type": "mechanical_link",
        "confidence": 0.9
      },
      {
        "id": "1767558831613-u6o2uzib0",
        "from_id": "FCV-301217",
        "to_id": "PIPE-1",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-v0a4tkzc1",
        "from_id": "PIPE-1",
        "to_id": "MANUAL_VALVE-5",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-x3uabo9jk",
        "from_id": "MANUAL_VALVE-5",
        "to_id": "PIPE-2",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-ov2e1s77l",
        "from_id": "PT-301218",
        "to_id": "PIPE-2",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-2948filn6",
        "from_id": "TT-301219",
        "to_id": "PIPE-2",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-m1ag0sh88",
        "from_id": "FCV-301220",
        "to_id": "PIPE-3",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-wqseqxgs7",
        "from_id": "PIPE-3",
        "to_id": "MANUAL_VALVE-6",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-gcws86zsi",
        "from_id": "MANUAL_VALVE-6",
        "to_id": "PIPE-4",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-0o58ta7j0",
        "from_id": "BV-301221",
        "to_id": "PIPE-4",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-z1egxnbqr",
        "from_id": "PT-301222",
        "to_id": "PIPE-4",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-12vdm5dr3",
        "from_id": "TT-301223",
        "to_id": "PIPE-4",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-bd03zjwt5",
        "from_id": "PT-292205",
        "to_id": "MANUAL_VALVE-2",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-1uhsv86a2",
        "from_id": "MANUAL_VALVE-2",
        "to_id": "PIPE-7",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-bdrozc6ep",
        "from_id": "PT-292204",
        "to_id": "MANUAL_VALVE-3",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-jxc5ik432",
        "from_id": "MANUAL_VALVE-3",
        "to_id": "PIPE-8",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-50mk85dh2",
        "from_id": "PI-292203",
        "to_id": "MANUAL_VALVE-4",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-9xxtsiuzp",
        "from_id": "MANUAL_VALVE-4",
        "to_id": "PIPE-9",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-8aagall49",
        "from_id": "TT-292206",
        "to_id": "PIPE-5",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-shhvjg68k",
        "from_id": "TT-292208",
        "to_id": "PIPE-6",
        "type": "chilled_water",
        "confidence": 0.95
      },
      {
        "id": "1767558831613-xoppa79ya",
        "from_id": "SIGNAL_RELAY-S-1",
        "to_id": "TT-292206",
        "type": "electric_signal",
        "confidence": 0.9
      },
      {
        "id": "1767558831613-p67vk9ois",
        "from_id": "SIGNAL_RELAY-C-1",
        "to_id": "TT-292208",
        "type": "electric_signal",
        "confidence": 0.9
      },
      {
        "id": "1767558831613-3kc8upibz",
        "from_id": "FCW-1",
        "to_id": "PT-292205",
        "type": "electric_signal",
        "confidence": 0.9
      },
      {
        "id": "1767558831613-iam6js0ow",
        "from_id": "SIGNAL_RELAY-S-2",
        "to_id": "PT-292204",
        "type": "electric_signal",
        "confidence": 0.9
      },
      {
        "id": "1767558831613-ndpw0g4di",
        "from_id": "PALL-292204",
        "to_id": "PT-292204",
        "type": "data",
        "confidence": 0.8
      }
    ],
    "metadata": {
      "total_components": 47,
      "total_connections": 26,
      "process_log": "The provided schematic details a segment of a process control system, likely involving chilled water or a similar fluid, given the presence of flow and temperature control valves and various pressure/temperature transmitters. The system includes both discrete field-mounted instruments and a computer-based supervisory function (PALL-292204). Several control loops are identified, primarily for measurement and indication, with some flow control. The use of signal relays (triangles with S/C) suggests signal conditioning or interlock logic. The presence of 'ZONE 1' and 'ZONE 2' indicates a segmented control strategy. Overall, the design appears to focus on precise monitoring and control of process parameters within distinct zones, with a mix of manual and automated valve operations."
    }
  }
}