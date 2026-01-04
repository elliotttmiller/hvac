Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":0.98,"reasoning":"The document displays process flow lines, instrumentation symbols (e.g., CVA, PT, HS, SOV), and control logic connections. These elements are characteristic of a Process and Instrumentation Diagram (P&ID) or a control schematic, which falls under the 'SCHEMATIC' classification."}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767519095941-nso8e69x1","type":"SCHEMATIC","processing_time_ms":1061,"components":14}]

{
  "document_id": "1767519095941-nso8e69x1",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767519097002,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 0.98,
    "reasoning": "The document displays process flow lines, instrumentation symbols (e.g., CVA, PT, HS, SOV), and control logic connections. These elements are characteristic of a Process and Instrumentation Diagram (P&ID) or a control schematic, which falls under the 'SCHEMATIC' classification."
  },
  "processing_time_ms": 1061,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "SOV-301202",
        "type": "valve_solenoid",
        "label": "SOV-301202",
        "bbox": [
          0.123,
          0.252,
          0.151,
          0.285
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "SOV-301202",
          "description": "Solenoid Valve",
          "reasoning": "ISA-5.1: S=Switch, O=Operated, V=Valve (Electrically actuated valve)",
          "raw_backend_output": [
            0.123,
            0.252,
            0.151,
            0.285
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.001Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.123,
                  0.252,
                  0.151,
                  0.285
                ],
                "normalized_bbox": [
                  0.123,
                  0.252,
                  0.151,
                  0.285
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SOV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SOV-301203A",
        "type": "valve_solenoid",
        "label": "SOV-301203A",
        "bbox": [
          0.065,
          0.476,
          0.111,
          0.563
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "SOV-301203A",
          "description": "Solenoid Valve",
          "reasoning": "ISA-5.1: S=Switch, O=Operated, V=Valve (Electrically actuated valve)",
          "raw_backend_output": [
            0.476,
            0.065,
            0.563,
            0.111
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.001Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.476,
                  0.065,
                  0.563,
                  0.111
                ],
                "normalized_bbox": [
                  0.065,
                  0.476,
                  0.111,
                  0.563
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SOV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SOV-291201A",
        "type": "valve_solenoid",
        "label": "SOV-291201A",
        "bbox": [
          0.136,
          0.476,
          0.18,
          0.563
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "SOV-291201A",
          "description": "Solenoid Valve",
          "reasoning": "ISA-5.1: S=Switch, O=Operated, V=Valve (Electrically actuated valve)",
          "raw_backend_output": [
            0.476,
            0.136,
            0.563,
            0.18
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.476,
                  0.136,
                  0.563,
                  0.18
                ],
                "normalized_bbox": [
                  0.136,
                  0.476,
                  0.18,
                  0.563
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SOV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SOV-301203B",
        "type": "valve_solenoid",
        "label": "SOV-301203B",
        "bbox": [
          0.207,
          0.477,
          0.255,
          0.561
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "SOV-301203B",
          "description": "Solenoid Valve",
          "reasoning": "ISA-5.1: S=Switch, O=Operated, V=Valve (Electrically actuated valve)",
          "raw_backend_output": [
            0.477,
            0.207,
            0.561,
            0.255
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.477,
                  0.207,
                  0.561,
                  0.255
                ],
                "normalized_bbox": [
                  0.207,
                  0.477,
                  0.255,
                  0.561
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SOV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "ZSC-301201",
        "type": "valve_position_switch",
        "label": "ZSC-301201",
        "bbox": [
          0.1,
          0.55,
          0.145,
          0.633
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "ZSC-301201",
          "description": "Valve Position Switch (Closed)",
          "reasoning": "ISA-5.1: Z=Position, S=Switch, C=Closed (Valve position indicator)",
          "raw_backend_output": [
            0.55,
            0.1,
            0.633,
            0.145
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.55,
                  0.1,
                  0.633,
                  0.145
                ],
                "normalized_bbox": [
                  0.1,
                  0.55,
                  0.145,
                  0.633
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "ZSC",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "SOV-291201B",
        "type": "valve_solenoid",
        "label": "SOV-291201B",
        "bbox": [
          0.172,
          0.552,
          0.213,
          0.631
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "SOV-291201B",
          "description": "Solenoid Valve",
          "reasoning": "ISA-5.1: S=Switch, O=Operated, V=Valve (Electrically actuated valve)",
          "raw_backend_output": [
            0.552,
            0.172,
            0.631,
            0.213
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.552,
                  0.172,
                  0.631,
                  0.213
                ],
                "normalized_bbox": [
                  0.172,
                  0.552,
                  0.213,
                  0.631
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "SOV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FCV-302317",
        "type": "flow_control_valve",
        "label": "FCV-302317",
        "bbox": [
          0.03,
          0.554,
          0.072,
          0.63
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "FCV-302317",
          "description": "Flow Control Valve",
          "reasoning": "ISA-5.1: F=Flow, C=Control, V=Valve (Automated flow regulation)",
          "raw_backend_output": [
            0.554,
            0.03,
            0.63,
            0.072
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.554,
                  0.03,
                  0.63,
                  0.072
                ],
                "normalized_bbox": [
                  0.03,
                  0.554,
                  0.072,
                  0.63
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FCV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PT-302318",
        "type": "sensor_pressure",
        "label": "PT-302318",
        "bbox": [
          0.381,
          0.58,
          0.424,
          0.662
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "PT-302318",
          "description": "Pressure Transmitter",
          "reasoning": "ISA-5.1: P=Pressure, T=Transmitter (Measures and transmits pressure data)",
          "raw_backend_output": [
            0.58,
            0.381,
            0.662,
            0.424
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.58,
                  0.381,
                  0.662,
                  0.424
                ],
                "normalized_bbox": [
                  0.381,
                  0.58,
                  0.424,
                  0.662
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
        "id": "TT-302319",
        "type": "sensor_temperature",
        "label": "TT-302319",
        "bbox": [
          0.581,
          0.685,
          0.666,
          0.731
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "TT-302319",
          "description": "Temperature Transmitter",
          "reasoning": "ISA-5.1: T=Temperature, T=Transmitter (Measures and transmits temperature data)",
          "raw_backend_output": [
            0.581,
            0.685,
            0.666,
            0.731
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.581,
                  0.685,
                  0.666,
                  0.731
                ],
                "normalized_bbox": [
                  0.581,
                  0.685,
                  0.666,
                  0.731
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
        "id": "FCV-302320",
        "type": "flow_control_valve",
        "label": "FCV-302320",
        "bbox": [
          0.445,
          0.582,
          0.487,
          0.66
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "FCV-302320",
          "description": "Flow Control Valve",
          "reasoning": "ISA-5.1: F=Flow, C=Control, V=Valve (Automated flow regulation)",
          "raw_backend_output": [
            0.582,
            0.445,
            0.66,
            0.487
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.582,
                  0.445,
                  0.66,
                  0.487
                ],
                "normalized_bbox": [
                  0.445,
                  0.582,
                  0.487,
                  0.66
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "FCV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "BV-302321",
        "type": "valve_ball",
        "label": "BV-302321",
        "bbox": [
          0.487,
          0.582,
          0.529,
          0.662
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "BV-302321",
          "description": "Ball Valve",
          "reasoning": "ISA-5.1: B=Ball, V=Valve (Quarter-turn isolation valve)",
          "raw_backend_output": [
            0.582,
            0.487,
            0.662,
            0.529
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.582,
                  0.487,
                  0.662,
                  0.529
                ],
                "normalized_bbox": [
                  0.487,
                  0.582,
                  0.529,
                  0.662
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PT-302322",
        "type": "sensor_pressure",
        "label": "PT-302322",
        "bbox": [
          0.582,
          0.835,
          0.664,
          0.879
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "PT-302322",
          "description": "Pressure Transmitter",
          "reasoning": "ISA-5.1: P=Pressure, T=Transmitter (Measures and transmits pressure data)",
          "raw_backend_output": [
            0.582,
            0.835,
            0.664,
            0.879
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.582,
                  0.835,
                  0.664,
                  0.879
                ],
                "normalized_bbox": [
                  0.582,
                  0.835,
                  0.664,
                  0.879
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
        "id": "TT-302323",
        "type": "sensor_temperature",
        "label": "TT-302323",
        "bbox": [
          0.582,
          0.878,
          0.662,
          0.921
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "TT-302323",
          "description": "Temperature Transmitter",
          "reasoning": "ISA-5.1: T=Temperature, T=Transmitter (Measures and transmits temperature data)",
          "raw_backend_output": [
            0.582,
            0.878,
            0.662,
            0.921
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.582,
                  0.878,
                  0.662,
                  0.921
                ],
                "normalized_bbox": [
                  0.582,
                  0.878,
                  0.662,
                  0.921
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
        "id": "valve-4-fc",
        "type": "control_valve",
        "label": "4\" FC",
        "bbox": [
          0.633,
          0.792,
          0.714,
          0.837
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "tag": "4\" FC",
          "description": "4-inch Control Valve (Fail Closed)",
          "reasoning": "ISA-5.1: FC = Fail Closed (valve fails in closed position upon loss of power/signal)",
          "raw_backend_output": [
            0.633,
            0.792,
            0.714,
            0.837
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T09:31:37.002Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.633,
                  0.792,
                  0.714,
                  0.837
                ],
                "normalized_bbox": [
                  0.633,
                  0.792,
                  0.714,
                  0.837
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent"
        }
      }
    ],
    "connections": [],
    "metadata": {
      "total_components": 14,
      "total_connections": 0
    }
  }
}
