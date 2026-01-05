Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":0.95,"reasoning":"Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767584903775-2nd4bwq0q","type":"SCHEMATIC","processing_time_ms":65677,"components":73}]
Step 4: Generating comprehensive final analysis report...
Warning: Final analysis report generation failed, continuing with basic analysis

{
  "document_id": "1767584903775-2nd4bwq0q",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767584969452,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 0.95,
    "reasoning": "Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"
  },
  "processing_time_ms": 65677,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "E_1130_GREASE_MELTER",
        "type": "equipment",
        "label": "E 1130 GREASE MELTER",
        "bbox": [
          0.3,
          0.03,
          0.43,
          0.07
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation identifying a piece of equipment. 'E' typically denotes equipment.",
          "description": "Grease Melter equipment",
          "equipment_type": "Grease Melter",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.3,
            0.03,
            0.43,
            0.07
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.401Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.03,
                  0.43,
                  0.07
                ],
                "normalized_bbox": [
                  0.3,
                  0.03,
                  0.43,
                  0.07
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: E-1130-GREASE-MELTER (type: equipment)"
        }
      },
      {
        "id": "A_1130_GREASE_MIXER",
        "type": "equipment",
        "label": "A 1130 GREASE MIXER",
        "bbox": [
          0.46,
          0.03,
          0.59,
          0.07
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation identifying a piece of equipment. 'A' typically denotes an analyzer or auxiliary equipment.",
          "description": "Grease Mixer equipment",
          "equipment_type": "Grease Mixer",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.46,
            0.03,
            0.59,
            0.07
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.404Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.46,
                  0.03,
                  0.59,
                  0.07
                ],
                "normalized_bbox": [
                  0.46,
                  0.03,
                  0.59,
                  0.07
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: A-1130-GREASE-MIXER (type: equipment)"
        }
      },
      {
        "id": "A_1131_OIL_MIXER",
        "type": "equipment",
        "label": "A 1131 OIL MIXER",
        "bbox": [
          0.62,
          0.03,
          0.72,
          0.07
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation identifying a piece of equipment. 'A' typically denotes an analyzer or auxiliary equipment.",
          "description": "Oil Mixer equipment",
          "equipment_type": "Oil Mixer",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.62,
            0.03,
            0.72,
            0.07
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.404Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.62,
                  0.03,
                  0.72,
                  0.07
                ],
                "normalized_bbox": [
                  0.62,
                  0.03,
                  0.72,
                  0.07
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: A-1131-OIL-MIXER (type: equipment)"
        }
      },
      {
        "id": "P_1130_GREASE_LOADING_CIRCULATION_PUMP",
        "type": "pump",
        "label": "P 1130 GREASE LOADING CIRCULATION PUMP",
        "bbox": [
          0.75,
          0.03,
          0.9,
          0.08
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation identifying a piece of equipment. 'P' typically denotes a pump.",
          "description": "Grease Loading Circulation Pump equipment",
          "equipment_type": "Pump",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.75,
            0.03,
            0.9,
            0.08
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.404Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.75,
                  0.03,
                  0.9,
                  0.08
                ],
                "normalized_bbox": [
                  0.75,
                  0.03,
                  0.9,
                  0.08
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: P-1130-GREASE-LOADING-CIRCULATION-PUMP (type: pump)"
        }
      },
      {
        "id": "TO_D_1152_115",
        "type": "text_annotation",
        "label": "TO D 1152 115",
        "bbox": [
          0.06,
          0.2,
          0.2,
          0.23
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a connection to another drawing or system.",
          "description": "Connection reference to drawing D 1152, item 115",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.06,
            0.2,
            0.2,
            0.23
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.404Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.06,
                  0.2,
                  0.2,
                  0.23
                ],
                "normalized_bbox": [
                  0.06,
                  0.2,
                  0.2,
                  0.23
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "TO",
          "detection_quality": "excellent",
          "isa_measured_variable": "Temperature",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: TO-D-1152-115"
        }
      },
      {
        "id": "PN_1",
        "type": "instrument_logic",
        "label": "PN",
        "bbox": [
          0.06,
          0.3,
          0.09,
          0.33
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Diamond symbol with 'PN' indicates a pneumatic signal connection point or source, following ISA-5.1 standards for logic/misc functions.",
          "description": "Pneumatic signal connection",
          "functional_desc": "Pneumatic",
          "hvac_subsystem": "controls",
          "instrument_function": "Pneumatic",
          "instrument_type": "Logic",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PN",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.06,
            0.3,
            0.09,
            0.33
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.405Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.06,
                  0.3,
                  0.09,
                  0.33
                ],
                "normalized_bbox": [
                  0.06,
                  0.3,
                  0.09,
                  0.33
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PN",
          "detection_quality": "excellent",
          "isa_measured_variable": "Pressure",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PN"
        }
      },
      {
        "id": "FO-1303",
        "type": "valve_solenoid",
        "label": "FO 1303",
        "bbox": [
          0.26,
          0.29,
          0.3,
          0.33
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Circle symbol with 'FO' and tag '1303' indicates a fail-open valve, likely a solenoid or block valve. The 'FO' indicates its fail-safe position.",
          "description": "Fail-Open Valve",
          "functional_desc": "Fail Open Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "Valve",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FO-1303",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.26,
            0.29,
            0.3,
            0.33
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.405Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.26,
                  0.29,
                  0.3,
                  0.33
                ],
                "normalized_bbox": [
                  0.26,
                  0.29,
                  0.3,
                  0.33
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FO",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "PN_2",
        "type": "instrument_logic",
        "label": "PN",
        "bbox": [
          0.59,
          0.34,
          0.62,
          0.37
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Diamond symbol with 'PN' indicates a pneumatic signal connection point or source, following ISA-5.1 standards for logic/misc functions.",
          "description": "Pneumatic signal connection",
          "functional_desc": "Pneumatic",
          "hvac_subsystem": "controls",
          "instrument_function": "Pneumatic",
          "instrument_type": "Logic",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PN",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.59,
            0.34,
            0.62,
            0.37
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.405Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.59,
                  0.34,
                  0.62,
                  0.37
                ],
                "normalized_bbox": [
                  0.59,
                  0.34,
                  0.62,
                  0.37
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "PN",
          "detection_quality": "excellent",
          "isa_measured_variable": "Pressure",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: PN"
        }
      },
      {
        "id": "AFC",
        "type": "equipment",
        "label": "AFC",
        "bbox": [
          0.72,
          0.34,
          0.75,
          0.37
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for an Air Filter/Regulator, commonly found in pneumatic control lines. Text 'AFC' confirms its function.",
          "description": "Air Filter/Regulator",
          "equipment_type": "Air Filter/Regulator",
          "hvac_subsystem": "controls",
          "occlusion_level": "none",
          "tag": "AFC",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.72,
            0.34,
            0.75,
            0.37
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.405Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.72,
                  0.34,
                  0.75,
                  0.37
                ],
                "normalized_bbox": [
                  0.72,
                  0.34,
                  0.75,
                  0.37
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "AF",
          "detection_quality": "excellent",
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Ratio",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AFC"
        }
      },
      {
        "id": "FV-1301B",
        "type": "valve_control",
        "label": "FV 1301B",
        "bbox": [
          0.76,
          0.37,
          0.8,
          0.41
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Diamond symbol indicates a control valve. 'FV' denotes a Flow Valve, '1301B' is the loop and suffix. Field mounted (no line).",
          "description": "Flow Control Valve B",
          "functional_desc": "Flow Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "Flow",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FV-1301B",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.76,
            0.37,
            0.8,
            0.41
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.405Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.76,
                  0.37,
                  0.8,
                  0.41
                ],
                "normalized_bbox": [
                  0.76,
                  0.37,
                  0.8,
                  0.41
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FTS-1301",
        "type": "sensor_flow",
        "label": "FTS 1301",
        "bbox": [
          0.72,
          0.54,
          0.76,
          0.58
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Circle symbol indicates a discrete instrument. 'FTS' denotes a Flow Transmitter Switch, '1301' is the loop number. Field mounted (no line).",
          "description": "Flow Transmitter Switch",
          "functional_desc": "Flow Transmitter Switch",
          "hvac_subsystem": "controls",
          "instrument_function": "Flow",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FTS-1301",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.72,
            0.54,
            0.76,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.72,
                  0.54,
                  0.76,
                  0.58
                ],
                "normalized_bbox": [
                  0.72,
                  0.54,
                  0.76,
                  0.58
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FTS",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "HS-1301",
        "type": "instrument_controller",
        "label": "HS 1301",
        "bbox": [
          0.79,
          0.54,
          0.83,
          0.58
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Circle symbol indicates a discrete instrument. 'HS' denotes a Hand Switch, '1301' is the loop number. Field mounted (no line).",
          "description": "Hand Switch",
          "functional_desc": "Hand Switch",
          "hvac_subsystem": "controls",
          "instrument_function": "Hand",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "HS-1301",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.79,
            0.54,
            0.83,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.79,
                  0.54,
                  0.83,
                  0.58
                ],
                "normalized_bbox": [
                  0.79,
                  0.54,
                  0.83,
                  0.58
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "HS",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "FV-1301A",
        "type": "valve_control",
        "label": "FV 1301A",
        "bbox": [
          0.72,
          0.61,
          0.76,
          0.65
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Diamond symbol indicates a control valve. 'FV' denotes a Flow Valve, '1301A' is the loop and suffix. Field mounted (no line).",
          "description": "Flow Control Valve A",
          "functional_desc": "Flow Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "Flow",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FV-1301A",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.72,
            0.61,
            0.76,
            0.65
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.72,
                  0.61,
                  0.76,
                  0.65
                ],
                "normalized_bbox": [
                  0.72,
                  0.61,
                  0.76,
                  0.65
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FV",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "AFO",
        "type": "equipment",
        "label": "AFO",
        "bbox": [
          0.68,
          0.61,
          0.71,
          0.64
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for an Air Filter/Regulator, commonly found in pneumatic control lines. Text 'AFO' confirms its function.",
          "description": "Air Filter/Regulator",
          "equipment_type": "Air Filter/Regulator",
          "hvac_subsystem": "controls",
          "occlusion_level": "none",
          "tag": "AFO",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.68,
            0.61,
            0.71,
            0.64
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.68,
                  0.61,
                  0.71,
                  0.64
                ],
                "normalized_bbox": [
                  0.68,
                  0.61,
                  0.71,
                  0.64
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "AF",
          "detection_quality": "excellent",
          "isa_measured_variable": "Analysis",
          "isa_modifier": "Ratio",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: AFO"
        }
      },
      {
        "id": "FO-1305",
        "type": "valve_solenoid",
        "label": "FO 1305",
        "bbox": [
          0.49,
          0.61,
          0.53,
          0.65
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Circle symbol with 'FO' and tag '1305' indicates a fail-open valve, likely a solenoid or block valve. The 'FO' indicates its fail-safe position.",
          "description": "Fail-Open Valve",
          "functional_desc": "Fail Open Valve",
          "hvac_subsystem": "controls",
          "instrument_function": "Valve",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FO-1305",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.49,
            0.61,
            0.53,
            0.65
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.61,
                  0.53,
                  0.65
                ],
                "normalized_bbox": [
                  0.49,
                  0.61,
                  0.53,
                  0.65
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "FO",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "TI-1303",
        "type": "sensor_temperature",
        "label": "TI 1303",
        "bbox": [
          0.49,
          0.67,
          0.53,
          0.71
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Circle symbol indicates a discrete instrument. 'TI' denotes a Temperature Indicator, '1303' is the loop number. Field mounted (no line).",
          "description": "Temperature Indicator",
          "functional_desc": "Temperature Indicator",
          "hvac_subsystem": "controls",
          "instrument_function": "Temperature",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TI-1303",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.49,
            0.67,
            0.53,
            0.71
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.67,
                  0.53,
                  0.71
                ],
                "normalized_bbox": [
                  0.49,
                  0.67,
                  0.53,
                  0.71
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
        "id": "TIA-1303",
        "type": "sensor_temperature",
        "label": "TIA 1303",
        "bbox": [
          0.49,
          0.73,
          0.53,
          0.77
        ],
        "confidence": 0.99,
        "rotation": 0,
        "meta": {
          "reasoning": "Circle symbol indicates a discrete instrument. 'TIA' denotes a Temperature Indicator/Alarm, '1303' is the loop number. Field mounted (no line). The 'H' indicates a high alarm.",
          "description": "Temperature Indicator/High Alarm",
          "functional_desc": "Temperature Indicator Alarm",
          "hvac_subsystem": "controls",
          "instrument_function": "Temperature",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "TIA-1303",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.49,
            0.73,
            0.53,
            0.77
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.49,
                  0.73,
                  0.53,
                  0.77
                ],
                "normalized_bbox": [
                  0.49,
                  0.73,
                  0.53,
                  0.77
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": "TIA",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "A_1130_D_1130",
        "type": "equipment",
        "label": "A 1130 D 1130",
        "bbox": [
          0.69,
          0.8,
          0.78,
          0.84
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation identifying a major piece of equipment, likely a tank or vessel, with multiple identifiers.",
          "description": "Equipment A 1130 / D 1130",
          "equipment_type": "Vessel/Tank",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.69,
            0.8,
            0.78,
            0.84
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.8,
                  0.78,
                  0.84
                ],
                "normalized_bbox": [
                  0.69,
                  0.8,
                  0.78,
                  0.84
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: A-1130-D-1130 (type: equipment)"
        }
      },
      {
        "id": "manual_valve_1",
        "type": "valve_ball",
        "label": "manual_valve_1",
        "bbox": [
          0.19,
          0.3,
          0.21,
          0.32
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a manual block valve (circle with diagonal line). No tag provided.",
          "description": "Manual Block Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.19,
            0.3,
            0.21,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.19,
                  0.3,
                  0.21,
                  0.32
                ],
                "normalized_bbox": [
                  0.19,
                  0.3,
                  0.21,
                  0.32
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "manual_valve_2",
        "type": "valve_ball",
        "label": "manual_valve_2",
        "bbox": [
          0.23,
          0.3,
          0.25,
          0.32
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a manual block valve (circle with diagonal line). No tag provided.",
          "description": "Manual Block Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.23,
            0.3,
            0.25,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.23,
                  0.3,
                  0.25,
                  0.32
                ],
                "normalized_bbox": [
                  0.23,
                  0.3,
                  0.25,
                  0.32
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "manual_valve_3",
        "type": "valve_ball",
        "label": "manual_valve_3",
        "bbox": [
          0.65,
          0.45,
          0.67,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a manual block valve (circle with diagonal line). No tag provided.",
          "description": "Manual Block Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.65,
            0.45,
            0.67,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.65,
                  0.45,
                  0.67,
                  0.47
                ],
                "normalized_bbox": [
                  0.65,
                  0.45,
                  0.67,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "manual_valve_4",
        "type": "valve_ball",
        "label": "manual_valve_4",
        "bbox": [
          0.69,
          0.67,
          0.71,
          0.69
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a manual block valve (circle with diagonal line). No tag provided.",
          "description": "Manual Block Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.69,
            0.67,
            0.71,
            0.69
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.67,
                  0.71,
                  0.69
                ],
                "normalized_bbox": [
                  0.69,
                  0.67,
                  0.71,
                  0.69
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "manual_valve_5",
        "type": "valve_ball",
        "label": "manual_valve_5",
        "bbox": [
          0.56,
          0.67,
          0.58,
          0.69
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a manual block valve (circle with diagonal line). No tag provided.",
          "description": "Manual Block Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.56,
            0.67,
            0.58,
            0.69
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.56,
                  0.67,
                  0.58,
                  0.69
                ],
                "normalized_bbox": [
                  0.56,
                  0.67,
                  0.58,
                  0.69
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "manual_valve_6",
        "type": "valve_ball",
        "label": "manual_valve_6",
        "bbox": [
          0.44,
          0.67,
          0.46,
          0.69
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a manual block valve (circle with diagonal line). No tag provided.",
          "description": "Manual Block Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.44,
            0.67,
            0.46,
            0.69
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.44,
                  0.67,
                  0.46,
                  0.69
                ],
                "normalized_bbox": [
                  0.44,
                  0.67,
                  0.46,
                  0.69
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "manual_valve_7",
        "type": "valve_ball",
        "label": "manual_valve_7",
        "bbox": [
          0.34,
          0.67,
          0.36,
          0.69
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a manual block valve (circle with diagonal line). No tag provided.",
          "description": "Manual Block Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.34,
            0.67,
            0.36,
            0.69
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.34,
                  0.67,
                  0.36,
                  0.69
                ],
                "normalized_bbox": [
                  0.34,
                  0.67,
                  0.36,
                  0.69
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "manual_valve_8",
        "type": "valve_ball",
        "label": "manual_valve_8",
        "bbox": [
          0.24,
          0.67,
          0.26,
          0.69
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a manual block valve (circle with diagonal line). No tag provided.",
          "description": "Manual Block Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.24,
            0.67,
            0.26,
            0.69
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.406Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.24,
                  0.67,
                  0.26,
                  0.69
                ],
                "normalized_bbox": [
                  0.24,
                  0.67,
                  0.26,
                  0.69
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "BV",
          "detection_quality": "excellent",
          "isa_measured_variable": "Ball",
          "isa_modifier": "Valve",
          "isa_confidence": 0.9,
          "isa_reasoning": "Inferred from component type: valve_ball"
        }
      },
      {
        "id": "check_valve_1",
        "type": "valve_check",
        "label": "check_valve_1",
        "bbox": [
          0.16,
          0.3,
          0.18,
          0.32
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.16,
            0.3,
            0.18,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.16,
                  0.3,
                  0.18,
                  0.32
                ],
                "normalized_bbox": [
                  0.16,
                  0.3,
                  0.18,
                  0.32
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-1"
        }
      },
      {
        "id": "check_valve_2",
        "type": "valve_check",
        "label": "check_valve_2",
        "bbox": [
          0.7,
          0.45,
          0.72,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.7,
            0.45,
            0.72,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.7,
                  0.45,
                  0.72,
                  0.47
                ],
                "normalized_bbox": [
                  0.7,
                  0.45,
                  0.72,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-2"
        }
      },
      {
        "id": "check_valve_3",
        "type": "valve_check",
        "label": "check_valve_3",
        "bbox": [
          0.6,
          0.45,
          0.62,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.6,
            0.45,
            0.62,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.6,
                  0.45,
                  0.62,
                  0.47
                ],
                "normalized_bbox": [
                  0.6,
                  0.45,
                  0.62,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-3"
        }
      },
      {
        "id": "check_valve_4",
        "type": "valve_check",
        "label": "check_valve_4",
        "bbox": [
          0.54,
          0.45,
          0.56,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.54,
            0.45,
            0.56,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.54,
                  0.45,
                  0.56,
                  0.47
                ],
                "normalized_bbox": [
                  0.54,
                  0.45,
                  0.56,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-4"
        }
      },
      {
        "id": "check_valve_5",
        "type": "valve_check",
        "label": "check_valve_5",
        "bbox": [
          0.48,
          0.45,
          0.5,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.48,
            0.45,
            0.5,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.48,
                  0.45,
                  0.5,
                  0.47
                ],
                "normalized_bbox": [
                  0.48,
                  0.45,
                  0.5,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-5"
        }
      },
      {
        "id": "check_valve_6",
        "type": "valve_check",
        "label": "check_valve_6",
        "bbox": [
          0.42,
          0.45,
          0.44,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.42,
            0.45,
            0.44,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.42,
                  0.45,
                  0.44,
                  0.47
                ],
                "normalized_bbox": [
                  0.42,
                  0.45,
                  0.44,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-6"
        }
      },
      {
        "id": "check_valve_7",
        "type": "valve_check",
        "label": "check_valve_7",
        "bbox": [
          0.36,
          0.45,
          0.38,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.36,
            0.45,
            0.38,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.36,
                  0.45,
                  0.38,
                  0.47
                ],
                "normalized_bbox": [
                  0.36,
                  0.45,
                  0.38,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-7"
        }
      },
      {
        "id": "check_valve_8",
        "type": "valve_check",
        "label": "check_valve_8",
        "bbox": [
          0.3,
          0.45,
          0.32,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.3,
            0.45,
            0.32,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3,
                  0.45,
                  0.32,
                  0.47
                ],
                "normalized_bbox": [
                  0.3,
                  0.45,
                  0.32,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-8"
        }
      },
      {
        "id": "check_valve_9",
        "type": "valve_check",
        "label": "check_valve_9",
        "bbox": [
          0.24,
          0.45,
          0.26,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.24,
            0.45,
            0.26,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.24,
                  0.45,
                  0.26,
                  0.47
                ],
                "normalized_bbox": [
                  0.24,
                  0.45,
                  0.26,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-9"
        }
      },
      {
        "id": "check_valve_10",
        "type": "valve_check",
        "label": "check_valve_10",
        "bbox": [
          0.18,
          0.45,
          0.2,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.18,
            0.45,
            0.2,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.18,
                  0.45,
                  0.2,
                  0.47
                ],
                "normalized_bbox": [
                  0.18,
                  0.45,
                  0.2,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-10"
        }
      },
      {
        "id": "check_valve_11",
        "type": "valve_check",
        "label": "check_valve_11",
        "bbox": [
          0.12,
          0.45,
          0.14,
          0.47
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Symbol for a check valve (arrow with line). No tag provided.",
          "description": "Check Valve",
          "hvac_subsystem": "process_equipment",
          "occlusion_level": "none",
          "raw_backend_output": [
            0.12,
            0.45,
            0.14,
            0.47
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.12,
                  0.45,
                  0.14,
                  0.47
                ],
                "normalized_bbox": [
                  0.12,
                  0.45,
                  0.14,
                  0.47
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "CH",
          "detection_quality": "excellent",
          "isa_measured_variable": "Conductivity",
          "isa_modifier": "High",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: CHECK-VALVE-11"
        }
      },
      {
        "id": "pipe_1_2_PN_4CC2_1",
        "type": "pipe",
        "label": "1/2\"-PN--4CC2",
        "bbox": [
          0.39,
          0.12,
          0.49,
          0.14
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size and specification.",
          "description": "1/2 inch pipe, pneumatic, 4CC2 specification",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.39,
            0.12,
            0.49,
            0.14
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.39,
                  0.12,
                  0.49,
                  0.14
                ],
                "normalized_bbox": [
                  0.39,
                  0.12,
                  0.49,
                  0.14
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1/2\"-PN--4CC2 (type: pipe)"
        }
      },
      {
        "id": "pipe_1_2_PN_4CC2_2",
        "type": "pipe",
        "label": "1/2\"-PN--4CC2",
        "bbox": [
          0.1,
          0.3,
          0.16,
          0.32
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size and specification.",
          "description": "1/2 inch pipe, pneumatic, 4CC2 specification",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.1,
            0.3,
            0.16,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.1,
                  0.3,
                  0.16,
                  0.32
                ],
                "normalized_bbox": [
                  0.1,
                  0.3,
                  0.16,
                  0.32
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1/2\"-PN--4CC2 (type: pipe)"
        }
      },
      {
        "id": "pipe_1_2_PN_4CC2_3",
        "type": "pipe",
        "label": "1/2\"-PN--4CC2",
        "bbox": [
          0.31,
          0.3,
          0.37,
          0.32
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size and specification.",
          "description": "1/2 inch pipe, pneumatic, 4CC2 specification",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.31,
            0.3,
            0.37,
            0.32
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.31,
                  0.3,
                  0.37,
                  0.32
                ],
                "normalized_bbox": [
                  0.31,
                  0.3,
                  0.37,
                  0.32
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1/2\"-PN--4CC2 (type: pipe)"
        }
      },
      {
        "id": "pipe_1_PN_4CC2_1",
        "type": "pipe",
        "label": "1\"-PN--4CC2",
        "bbox": [
          0.21,
          0.24,
          0.29,
          0.26
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size and specification.",
          "description": "1 inch pipe, pneumatic, 4CC2 specification",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.21,
            0.24,
            0.29,
            0.26
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.21,
                  0.24,
                  0.29,
                  0.26
                ],
                "normalized_bbox": [
                  0.21,
                  0.24,
                  0.29,
                  0.26
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1\"-PN--4CC2 (type: pipe)"
        }
      },
      {
        "id": "pipe_1_PN_4CC2_2",
        "type": "pipe",
        "label": "1\"-PN--4CC2",
        "bbox": [
          0.59,
          0.4,
          0.62,
          0.48
        ],
        "confidence": 0.95,
        "rotation": 90,
        "meta": {
          "reasoning": "Text annotation indicating pipe size and specification, rotated 90 degrees.",
          "description": "1 inch pipe, pneumatic, 4CC2 specification",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.59,
            0.4,
            0.62,
            0.48
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.59,
                  0.4,
                  0.62,
                  0.48
                ],
                "normalized_bbox": [
                  0.59,
                  0.4,
                  0.62,
                  0.48
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1\"-PN--4CC2 (type: pipe)"
        }
      },
      {
        "id": "pipe_1_PN_4CC2_3",
        "type": "pipe",
        "label": "1\"-PN--4CC2",
        "bbox": [
          0.46,
          0.67,
          0.49,
          0.75
        ],
        "confidence": 0.95,
        "rotation": 90,
        "meta": {
          "reasoning": "Text annotation indicating pipe size and specification, rotated 90 degrees.",
          "description": "1 inch pipe, pneumatic, 4CC2 specification",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.46,
            0.67,
            0.49,
            0.75
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.46,
                  0.67,
                  0.49,
                  0.75
                ],
                "normalized_bbox": [
                  0.46,
                  0.67,
                  0.49,
                  0.75
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1\"-PN--4CC2 (type: pipe)"
        }
      },
      {
        "id": "pipe_1_PN_1CS2",
        "type": "pipe",
        "label": "1\"-PN--1CS2",
        "bbox": [
          0.56,
          0.67,
          0.59,
          0.75
        ],
        "confidence": 0.95,
        "rotation": 90,
        "meta": {
          "reasoning": "Text annotation indicating pipe size and specification, rotated 90 degrees.",
          "description": "1 inch pipe, pneumatic, 1CS2 specification",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.56,
            0.67,
            0.59,
            0.75
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.56,
                  0.67,
                  0.59,
                  0.75
                ],
                "normalized_bbox": [
                  0.56,
                  0.67,
                  0.59,
                  0.75
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1\"-PN--1CS2 (type: pipe)"
        }
      },
      {
        "id": "pipe_3_4",
        "type": "pipe",
        "label": "3/4\"",
        "bbox": [
          0.79,
          0.44,
          0.82,
          0.46
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size.",
          "description": "3/4 inch pipe",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.79,
            0.44,
            0.82,
            0.46
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.79,
                  0.44,
                  0.82,
                  0.46
                ],
                "normalized_bbox": [
                  0.79,
                  0.44,
                  0.82,
                  0.46
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 3/4\" (type: pipe)"
        }
      },
      {
        "id": "pipe_1_inch_1",
        "type": "pipe",
        "label": "1\"",
        "bbox": [
          0.69,
          0.7,
          0.71,
          0.72
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size.",
          "description": "1 inch pipe",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.69,
            0.7,
            0.71,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.7,
                  0.71,
                  0.72
                ],
                "normalized_bbox": [
                  0.69,
                  0.7,
                  0.71,
                  0.72
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1\" (type: pipe)"
        }
      },
      {
        "id": "pipe_1_inch_2",
        "type": "pipe",
        "label": "1\"",
        "bbox": [
          0.6,
          0.7,
          0.62,
          0.72
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size.",
          "description": "1 inch pipe",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.6,
            0.7,
            0.62,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.6,
                  0.7,
                  0.62,
                  0.72
                ],
                "normalized_bbox": [
                  0.6,
                  0.7,
                  0.62,
                  0.72
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1\" (type: pipe)"
        }
      },
      {
        "id": "pipe_1_inch_3",
        "type": "pipe",
        "label": "1\"",
        "bbox": [
          0.5,
          0.7,
          0.52,
          0.72
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size.",
          "description": "1 inch pipe",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5,
            0.7,
            0.52,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.407Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.7,
                  0.52,
                  0.72
                ],
                "normalized_bbox": [
                  0.5,
                  0.7,
                  0.52,
                  0.72
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1\" (type: pipe)"
        }
      },
      {
        "id": "pipe_2_inch",
        "type": "pipe",
        "label": "2\"",
        "bbox": [
          0.4,
          0.7,
          0.42,
          0.72
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size.",
          "description": "2 inch pipe",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.4,
            0.7,
            0.42,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.4,
                  0.7,
                  0.42,
                  0.72
                ],
                "normalized_bbox": [
                  0.4,
                  0.7,
                  0.42,
                  0.72
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 2\" (type: pipe)"
        }
      },
      {
        "id": "pipe_3_inch",
        "type": "pipe",
        "label": "3\"",
        "bbox": [
          0.64,
          0.7,
          0.66,
          0.72
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size.",
          "description": "3 inch pipe",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.64,
            0.7,
            0.66,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.64,
                  0.7,
                  0.66,
                  0.72
                ],
                "normalized_bbox": [
                  0.64,
                  0.7,
                  0.66,
                  0.72
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 3\" (type: pipe)"
        }
      },
      {
        "id": "pipe_1_1_2_inch",
        "type": "pipe",
        "label": "1 1/2\"",
        "bbox": [
          0.73,
          0.7,
          0.77,
          0.72
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating pipe size.",
          "description": "1 1/2 inch pipe",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.73,
            0.7,
            0.77,
            0.72
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.73,
                  0.7,
                  0.77,
                  0.72
                ],
                "normalized_bbox": [
                  0.73,
                  0.7,
                  0.77,
                  0.72
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1-1/2\" (type: pipe)"
        }
      },
      {
        "id": "pipe_1_LS_3CC6_I",
        "type": "pipe",
        "label": "1\"-LS--3CC6 (I)",
        "bbox": [
          0.89,
          0.7,
          0.92,
          0.82
        ],
        "confidence": 0.95,
        "rotation": 90,
        "meta": {
          "reasoning": "Text annotation indicating pipe size and specification, rotated 90 degrees.",
          "description": "1 inch pipe, LS-3CC6 specification, (I) for instrument",
          "hvac_subsystem": "process_piping",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.89,
            0.7,
            0.92,
            0.82
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.89,
                  0.7,
                  0.92,
                  0.82
                ],
                "normalized_bbox": [
                  0.89,
                  0.7,
                  0.92,
                  0.82
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: 1\"-LS--3CC6-(I) (type: pipe)"
        }
      },
      {
        "id": "slope_0_3_min_1",
        "type": "text_annotation",
        "label": "SLOPE 0.3% MIN",
        "bbox": [
          0.4,
          0.17,
          0.48,
          0.2
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a minimum slope requirement for piping.",
          "description": "Minimum slope requirement",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.4,
            0.17,
            0.48,
            0.2
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.4,
                  0.17,
                  0.48,
                  0.2
                ],
                "normalized_bbox": [
                  0.4,
                  0.17,
                  0.48,
                  0.2
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
          "isa_reasoning": "Partial ISA pattern match from label: SLOPE-0.3%-MIN"
        }
      },
      {
        "id": "slope_0_3_min_2",
        "type": "text_annotation",
        "label": "SLOPE 0.3% MIN",
        "bbox": [
          0.5,
          0.17,
          0.58,
          0.2
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a minimum slope requirement for piping.",
          "description": "Minimum slope requirement",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5,
            0.17,
            0.58,
            0.2
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.17,
                  0.58,
                  0.2
                ],
                "normalized_bbox": [
                  0.5,
                  0.17,
                  0.58,
                  0.2
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
          "isa_reasoning": "Partial ISA pattern match from label: SLOPE-0.3%-MIN"
        }
      },
      {
        "id": "slope_0_3_min_3",
        "type": "text_annotation",
        "label": "SLOPE 0.3% MIN",
        "bbox": [
          0.8,
          0.5,
          0.88,
          0.53
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a minimum slope requirement for piping.",
          "description": "Minimum slope requirement",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.8,
            0.5,
            0.88,
            0.53
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.8,
                  0.5,
                  0.88,
                  0.53
                ],
                "normalized_bbox": [
                  0.8,
                  0.5,
                  0.88,
                  0.53
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
          "isa_reasoning": "Partial ISA pattern match from label: SLOPE-0.3%-MIN"
        }
      },
      {
        "id": "note_7_1",
        "type": "text_annotation",
        "label": "NOTE 7",
        "bbox": [
          0.42,
          0.21,
          0.46,
          0.23
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 7",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.42,
            0.21,
            0.46,
            0.23
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.42,
                  0.21,
                  0.46,
                  0.23
                ],
                "normalized_bbox": [
                  0.42,
                  0.21,
                  0.46,
                  0.23
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-7"
        }
      },
      {
        "id": "note_7_2",
        "type": "text_annotation",
        "label": "NOTE 7",
        "bbox": [
          0.52,
          0.21,
          0.56,
          0.23
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 7",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.52,
            0.21,
            0.56,
            0.23
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.52,
                  0.21,
                  0.56,
                  0.23
                ],
                "normalized_bbox": [
                  0.52,
                  0.21,
                  0.56,
                  0.23
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-7"
        }
      },
      {
        "id": "note_8_1",
        "type": "text_annotation",
        "label": "NOTE 8",
        "bbox": [
          0.42,
          0.27,
          0.46,
          0.29
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 8",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.42,
            0.27,
            0.46,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.408Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.42,
                  0.27,
                  0.46,
                  0.29
                ],
                "normalized_bbox": [
                  0.42,
                  0.27,
                  0.46,
                  0.29
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-8"
        }
      },
      {
        "id": "note_8_2",
        "type": "text_annotation",
        "label": "NOTE 8",
        "bbox": [
          0.52,
          0.27,
          0.56,
          0.29
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 8",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.52,
            0.27,
            0.56,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.52,
                  0.27,
                  0.56,
                  0.29
                ],
                "normalized_bbox": [
                  0.52,
                  0.27,
                  0.56,
                  0.29
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-8"
        }
      },
      {
        "id": "note_8_3",
        "type": "text_annotation",
        "label": "NOTE 8",
        "bbox": [
          0.62,
          0.27,
          0.66,
          0.29
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 8",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.62,
            0.27,
            0.66,
            0.29
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.62,
                  0.27,
                  0.66,
                  0.29
                ],
                "normalized_bbox": [
                  0.62,
                  0.27,
                  0.66,
                  0.29
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-8"
        }
      },
      {
        "id": "note_8_4",
        "type": "text_annotation",
        "label": "NOTE 8",
        "bbox": [
          0.29,
          0.37,
          0.33,
          0.39
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 8",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.37,
            0.33,
            0.39
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.37,
                  0.33,
                  0.39
                ],
                "normalized_bbox": [
                  0.29,
                  0.37,
                  0.33,
                  0.39
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-8"
        }
      },
      {
        "id": "note_14",
        "type": "text_annotation",
        "label": "NOTE 14",
        "bbox": [
          0.62,
          0.17,
          0.67,
          0.19
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 14",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.62,
            0.17,
            0.67,
            0.19
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.62,
                  0.17,
                  0.67,
                  0.19
                ],
                "normalized_bbox": [
                  0.62,
                  0.17,
                  0.67,
                  0.19
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-14"
        }
      },
      {
        "id": "note_15",
        "type": "text_annotation",
        "label": "NOTE 15",
        "bbox": [
          0.29,
          0.34,
          0.33,
          0.36
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 15",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.34,
            0.33,
            0.36
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.34,
                  0.33,
                  0.36
                ],
                "normalized_bbox": [
                  0.29,
                  0.34,
                  0.33,
                  0.36
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-15"
        }
      },
      {
        "id": "note_3",
        "type": "text_annotation",
        "label": "NOTE 3",
        "bbox": [
          0.79,
          0.47,
          0.83,
          0.49
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 3",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.79,
            0.47,
            0.83,
            0.49
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.79,
                  0.47,
                  0.83,
                  0.49
                ],
                "normalized_bbox": [
                  0.79,
                  0.47,
                  0.83,
                  0.49
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-3"
        }
      },
      {
        "id": "note_4",
        "type": "text_annotation",
        "label": "NOTE 4",
        "bbox": [
          0.72,
          0.52,
          0.76,
          0.54
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 4",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.72,
            0.52,
            0.76,
            0.54
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.72,
                  0.52,
                  0.76,
                  0.54
                ],
                "normalized_bbox": [
                  0.72,
                  0.52,
                  0.76,
                  0.54
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-4"
        }
      },
      {
        "id": "note_1",
        "type": "text_annotation",
        "label": "NOTE 1",
        "bbox": [
          0.69,
          0.68,
          0.73,
          0.7
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation referring to a general note.",
          "description": "Reference to Note 1",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.69,
            0.68,
            0.73,
            0.7
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.69,
                  0.68,
                  0.73,
                  0.7
                ],
                "normalized_bbox": [
                  0.69,
                  0.68,
                  0.73,
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-1"
        }
      },
      {
        "id": "max_slope_no_pockets",
        "type": "text_annotation",
        "label": "MAX SLOPE NO POCKETS",
        "bbox": [
          0.85,
          0.3,
          0.9,
          0.34
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a piping design requirement.",
          "description": "Maximum slope, no pockets requirement",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.85,
            0.3,
            0.9,
            0.34
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.85,
                  0.3,
                  0.9,
                  0.34
                ],
                "normalized_bbox": [
                  0.85,
                  0.3,
                  0.9,
                  0.34
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "MA",
          "detection_quality": "excellent",
          "isa_measured_variable": "Moisture/Humidity",
          "isa_modifier": "Alarm",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: MAX-SLOPE-NO-POCKETS"
        }
      },
      {
        "id": "min_1",
        "type": "text_annotation",
        "label": "MIN.",
        "bbox": [
          0.67,
          0.22,
          0.7,
          0.24
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a minimum level or flow.",
          "description": "Minimum level/flow indicator",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.67,
            0.22,
            0.7,
            0.24
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.409Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.67,
                  0.22,
                  0.7,
                  0.24
                ],
                "normalized_bbox": [
                  0.67,
                  0.22,
                  0.7,
                  0.24
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
          "isa_reasoning": "Partial ISA pattern match from label: MIN."
        }
      },
      {
        "id": "min_2",
        "type": "text_annotation",
        "label": "MIN.",
        "bbox": [
          0.29,
          0.4,
          0.32,
          0.42
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a minimum level or flow.",
          "description": "Minimum level/flow indicator",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.29,
            0.4,
            0.32,
            0.42
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.410Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.29,
                  0.4,
                  0.32,
                  0.42
                ],
                "normalized_bbox": [
                  0.29,
                  0.4,
                  0.32,
                  0.42
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
          "isa_reasoning": "Partial ISA pattern match from label: MIN."
        }
      },
      {
        "id": "start_button",
        "type": "text_annotation",
        "label": "START",
        "bbox": [
          0.83,
          0.54,
          0.86,
          0.56
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a control function, associated with HS-1301.",
          "description": "Start button label",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.83,
            0.54,
            0.86,
            0.56
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.410Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.83,
                  0.54,
                  0.86,
                  0.56
                ],
                "normalized_bbox": [
                  0.83,
                  0.54,
                  0.86,
                  0.56
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "ST",
          "detection_quality": "excellent",
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Transmit",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: START"
        }
      },
      {
        "id": "stop_button",
        "type": "text_annotation",
        "label": "STOP",
        "bbox": [
          0.83,
          0.56,
          0.86,
          0.58
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a control function, associated with HS-1301.",
          "description": "Stop button label",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.83,
            0.56,
            0.86,
            0.58
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.410Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.83,
                  0.56,
                  0.86,
                  0.58
                ],
                "normalized_bbox": [
                  0.83,
                  0.56,
                  0.86,
                  0.58
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "ST",
          "detection_quality": "excellent",
          "isa_measured_variable": "Speed/Frequency",
          "isa_modifier": "Transmit",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: STOP"
        }
      },
      {
        "id": "CL",
        "type": "text_annotation",
        "label": "C.L.",
        "bbox": [
          0.54,
          0.59,
          0.57,
          0.61
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Text annotation indicating a centerline.",
          "description": "Centerline annotation",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.54,
            0.59,
            0.57,
            0.61
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.410Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.54,
                  0.59,
                  0.57,
                  0.61
                ],
                "normalized_bbox": [
                  0.54,
                  0.59,
                  0.57,
                  0.61
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
          "isa_reasoning": "No ISA pattern detected for: C.L. (type: text_annotation)"
        }
      },
      {
        "id": "note_1_5_9",
        "type": "text_annotation",
        "label": "NOTE 1,5,9",
        "bbox": [
          0.62,
          0.59,
          0.65,
          0.64
        ],
        "confidence": 0.95,
        "rotation": 90,
        "meta": {
          "reasoning": "Text annotation referring to multiple general notes, rotated 90 degrees.",
          "description": "Reference to Notes 1, 5, and 9",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.62,
            0.59,
            0.65,
            0.64
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-05T03:49:29.410Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.62,
                  0.59,
                  0.65,
                  0.64
                ],
                "normalized_bbox": [
                  0.62,
                  0.59,
                  0.65,
                  0.64
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
          "isa_reasoning": "Partial ISA pattern match from label: NOTE-1,5,9"
        }
      }
    ],
    "connections": [
      {
        "id": "1767584969410-5eupsve2f",
        "from_id": "PN_1",
        "to_id": "check_valve_1",
        "type": "pneumatic_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_logic",
          "to_component_type": "valve_check",
          "from_label": "PN",
          "to_label": "check_valve_1"
        }
      },
      {
        "id": "1767584969410-j59ddnc98",
        "from_id": "check_valve_1",
        "to_id": "manual_valve_1",
        "type": "pneumatic_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_check",
          "to_component_type": "valve_ball",
          "from_label": "check_valve_1",
          "to_label": "manual_valve_1"
        }
      },
      {
        "id": "1767584969410-qlwwmigup",
        "from_id": "manual_valve_1",
        "to_id": "manual_valve_2",
        "type": "pneumatic_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "valve_ball",
          "from_label": "manual_valve_1",
          "to_label": "manual_valve_2"
        }
      },
      {
        "id": "1767584969410-4v1khfyuc",
        "from_id": "manual_valve_2",
        "to_id": "FO-1303",
        "type": "pneumatic_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "valve_solenoid",
          "from_label": "manual_valve_2",
          "to_label": "FO 1303"
        }
      },
      {
        "id": "1767584969410-ctg2nv7nc",
        "from_id": "FO-1303",
        "to_id": "pipe_1_2_PN_4CC2_3",
        "type": "pneumatic_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "chilled_water",
          "type_confidence": 0.85,
          "type_reasoning": "Valve to pipe process flow",
          "from_component_type": "valve_solenoid",
          "to_component_type": "pipe",
          "from_label": "FO 1303",
          "to_label": "1/2\"-PN--4CC2"
        }
      },
      {
        "id": "1767584969410-ql3ak7p3z",
        "from_id": "pipe_1_2_PN_4CC2_3",
        "to_id": "E_1130_GREASE_MELTER",
        "type": "pneumatic_signal",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "equipment",
          "from_label": "1/2\"-PN--4CC2",
          "to_label": "E 1130 GREASE MELTER"
        }
      },
      {
        "id": "1767584969410-z1p2ojqcc",
        "from_id": "pipe_1_2_PN_4CC2_3",
        "to_id": "A_1130_GREASE_MIXER",
        "type": "pneumatic_signal",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "equipment",
          "from_label": "1/2\"-PN--4CC2",
          "to_label": "A 1130 GREASE MIXER"
        }
      },
      {
        "id": "1767584969410-nqq4k8ajx",
        "from_id": "pipe_1_2_PN_4CC2_3",
        "to_id": "A_1131_OIL_MIXER",
        "type": "pneumatic_signal",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "equipment",
          "from_label": "1/2\"-PN--4CC2",
          "to_label": "A 1131 OIL MIXER"
        }
      },
      {
        "id": "1767584969410-vnx7e7xkf",
        "from_id": "pipe_1_2_PN_4CC2_3",
        "to_id": "P_1130_GREASE_LOADING_CIRCULATION_PUMP",
        "type": "pneumatic_signal",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pipe",
          "to_component_type": "pump",
          "from_label": "1/2\"-PN--4CC2",
          "to_label": "P 1130 GREASE LOADING CIRCULATION PUMP"
        }
      },
      {
        "id": "1767584969410-5m8ophbei",
        "from_id": "PN_2",
        "to_id": "AFC",
        "type": "pneumatic_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_logic",
          "to_component_type": "equipment",
          "from_label": "PN",
          "to_label": "AFC"
        }
      },
      {
        "id": "1767584969410-euziqq0uh",
        "from_id": "AFC",
        "to_id": "FV-1301B",
        "type": "pneumatic_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment",
          "to_component_type": "valve_control",
          "from_label": "AFC",
          "to_label": "FV 1301B"
        }
      },
      {
        "id": "1767584969410-4fd30c8x5",
        "from_id": "AFO",
        "to_id": "FV-1301A",
        "type": "pneumatic_signal",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment",
          "to_component_type": "valve_control",
          "from_label": "AFO",
          "to_label": "FV 1301A"
        }
      },
      {
        "id": "1767584969410-8nhouu5u6",
        "from_id": "FTS-1301",
        "to_id": "HS-1301",
        "type": "electric_signal",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "instrument_controller",
          "from_label": "FTS 1301",
          "to_label": "HS 1301"
        }
      },
      {
        "id": "1767584969411-tammyalaa",
        "from_id": "HS-1301",
        "to_id": "FV-1301A",
        "type": "electric_signal",
        "confidence": 0.7,
        "meta": {
          "inferred_type": "control_signal",
          "type_confidence": 0.93,
          "type_reasoning": "Controller to control valve actuation",
          "from_component_type": "instrument_controller",
          "to_component_type": "valve_control",
          "from_label": "HS 1301",
          "to_label": "FV 1301A"
        }
      },
      {
        "id": "1767584969411-g1z3kfe2r",
        "from_id": "TI-1303",
        "to_id": "TIA-1303",
        "type": "electric_signal",
        "confidence": 0.8,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TI 1303",
          "to_label": "TIA 1303"
        }
      },
      {
        "id": "1767584969411-pwy6jeu38",
        "from_id": "A_1130_D_1130",
        "to_id": "FV-1301A",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment",
          "to_component_type": "valve_control",
          "from_label": "A 1130 D 1130",
          "to_label": "FV 1301A"
        }
      },
      {
        "id": "1767584969411-vc8r01ga4",
        "from_id": "FV-1301A",
        "to_id": "FTS-1301",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_control",
          "to_component_type": "sensor_flow",
          "from_label": "FV 1301A",
          "to_label": "FTS 1301"
        }
      },
      {
        "id": "1767584969411-5o5uowij0",
        "from_id": "FTS-1301",
        "to_id": "FV-1301B",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "valve_control",
          "from_label": "FTS 1301",
          "to_label": "FV 1301B"
        }
      },
      {
        "id": "1767584969411-lcfeibets",
        "from_id": "A_1130_D_1130",
        "to_id": "FO-1305",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment",
          "to_component_type": "valve_solenoid",
          "from_label": "A 1130 D 1130",
          "to_label": "FO 1305"
        }
      },
      {
        "id": "1767584969411-1w0j5pznv",
        "from_id": "FO-1305",
        "to_id": "TI-1303",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_solenoid",
          "to_component_type": "sensor_temperature",
          "from_label": "FO 1305",
          "to_label": "TI 1303"
        }
      },
      {
        "id": "1767584969411-5vbr1i3uc",
        "from_id": "TI-1303",
        "to_id": "TIA-1303",
        "type": "process_flow",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_temperature",
          "to_component_type": "sensor_temperature",
          "from_label": "TI 1303",
          "to_label": "TIA 1303"
        }
      },
      {
        "id": "inferred-TI-1303-HS-1301",
        "from_id": "TI-1303",
        "to_id": "HS-1301",
        "type": "electric_signal",
        "confidence": 0.85,
        "reasoning": "Inferred control loop connection: default",
        "inferred": true
      },
      {
        "id": "inferred-TIA-1303-HS-1301",
        "from_id": "TIA-1303",
        "to_id": "HS-1301",
        "type": "electric_signal",
        "confidence": 0.85,
        "reasoning": "Inferred control loop connection: default",
        "inferred": true
      },
      {
        "id": "inferred-HS-1301-FO-1303",
        "from_id": "HS-1301",
        "to_id": "FO-1303",
        "type": "control_signal",
        "confidence": 0.82,
        "reasoning": "Inferred control loop actuation: default",
        "inferred": true
      },
      {
        "id": "inferred-HS-1301-FV-1301B",
        "from_id": "HS-1301",
        "to_id": "FV-1301B",
        "type": "control_signal",
        "confidence": 0.82,
        "reasoning": "Inferred control loop actuation: default",
        "inferred": true
      },
      {
        "id": "inferred-HS-1301-FO-1305",
        "from_id": "HS-1301",
        "to_id": "FO-1305",
        "type": "control_signal",
        "confidence": 0.82,
        "reasoning": "Inferred control loop actuation: default",
        "inferred": true
      }
    ],
    "metadata": {
      "total_components": 73,
      "total_connections": 21,
      "process_log": "The provided P&ID excerpt details a portion of a process system involving grease and oil mixing and circulation, likely within an industrial or commercial facility. Key components include a Grease Melter, Grease Mixer, Oil Mixer, and a Grease Loading Circulation Pump, along with a large vessel identified as A 1130 D 1130. The control scheme incorporates flow control valves (FV-1301A/B) with associated flow switches (FTS-1301) and a hand switch (HS-1301) for manual operation or override. Temperature indication (TI-1303) and alarm (TIA-1303) are present, along with fail-open valves (FO-1303, FO-1305) for safety or process isolation. Pneumatic signals are extensively used for valve actuation, indicated by 'PN' connections and air filter/regulators (AFC, AFO). The piping includes various sizes and specifications, with specific notes on slope requirements to prevent pockets, indicating attention to fluid dynamics and drainage. The system appears to be designed with both automated control and manual intervention capabilities, emphasizing process flow and temperature monitoring.",
      "enhancement": {
        "isa_detection_enabled": true,
        "isa_functions_detected": 52,
        "isa_detection_rate": 0.7123287671232876,
        "connection_inference_enabled": true,
        "inferred_connections": 5,
        "validation_enabled": true,
        "validation_issues": 2,
        "loop_detection_enabled": true,
        "control_loops": 3,
        "enhancement_duration_ms": 18
      },
      "control_loops": [
        {
          "id": "loop-FTS 1301",
          "name": "FTS Control Loop (FTS 1301)",
          "components": [
            {
              "id": "FTS-1301",
              "type": "sensor_flow",
              "label": "FTS 1301",
              "bbox": [
                0.72,
                0.54,
                0.76,
                0.58
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'FTS' denotes a Flow Transmitter Switch, '1301' is the loop number. Field mounted (no line).",
                "description": "Flow Transmitter Switch",
                "functional_desc": "Flow Transmitter Switch",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FTS-1301",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.72,
                  0.54,
                  0.76,
                  0.58
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.72,
                        0.54,
                        0.76,
                        0.58
                      ],
                      "normalized_bbox": [
                        0.72,
                        0.54,
                        0.76,
                        0.58
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FTS",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "HS-1301",
              "type": "instrument_controller",
              "label": "HS 1301",
              "bbox": [
                0.79,
                0.54,
                0.83,
                0.58
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'HS' denotes a Hand Switch, '1301' is the loop number. Field mounted (no line).",
                "description": "Hand Switch",
                "functional_desc": "Hand Switch",
                "hvac_subsystem": "controls",
                "instrument_function": "Hand",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "HS-1301",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.79,
                  0.54,
                  0.83,
                  0.58
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.79,
                        0.54,
                        0.83,
                        0.58
                      ],
                      "normalized_bbox": [
                        0.79,
                        0.54,
                        0.83,
                        0.58
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "HS",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FV-1301B",
              "type": "valve_control",
              "label": "FV 1301B",
              "bbox": [
                0.76,
                0.37,
                0.8,
                0.41
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Diamond symbol indicates a control valve. 'FV' denotes a Flow Valve, '1301B' is the loop and suffix. Field mounted (no line).",
                "description": "Flow Control Valve B",
                "functional_desc": "Flow Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FV-1301B",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.76,
                  0.37,
                  0.8,
                  0.41
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.405Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.76,
                        0.37,
                        0.8,
                        0.41
                      ],
                      "normalized_bbox": [
                        0.76,
                        0.37,
                        0.8,
                        0.41
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FV",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FV-1301A",
              "type": "valve_control",
              "label": "FV 1301A",
              "bbox": [
                0.72,
                0.61,
                0.76,
                0.65
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Diamond symbol indicates a control valve. 'FV' denotes a Flow Valve, '1301A' is the loop and suffix. Field mounted (no line).",
                "description": "Flow Control Valve A",
                "functional_desc": "Flow Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FV-1301A",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.72,
                  0.61,
                  0.76,
                  0.65
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.72,
                        0.61,
                        0.76,
                        0.65
                      ],
                      "normalized_bbox": [
                        0.72,
                        0.61,
                        0.76,
                        0.65
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FV",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FO-1303",
              "type": "valve_solenoid",
              "label": "FO 1303",
              "bbox": [
                0.26,
                0.29,
                0.3,
                0.33
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol with 'FO' and tag '1303' indicates a fail-open valve, likely a solenoid or block valve. The 'FO' indicates its fail-safe position.",
                "description": "Fail-Open Valve",
                "functional_desc": "Fail Open Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Valve",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FO-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.26,
                  0.29,
                  0.3,
                  0.33
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.405Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.26,
                        0.29,
                        0.3,
                        0.33
                      ],
                      "normalized_bbox": [
                        0.26,
                        0.29,
                        0.3,
                        0.33
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FO",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FO-1305",
              "type": "valve_solenoid",
              "label": "FO 1305",
              "bbox": [
                0.49,
                0.61,
                0.53,
                0.65
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol with 'FO' and tag '1305' indicates a fail-open valve, likely a solenoid or block valve. The 'FO' indicates its fail-safe position.",
                "description": "Fail-Open Valve",
                "functional_desc": "Fail Open Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Valve",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FO-1305",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.61,
                  0.53,
                  0.65
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.61,
                        0.53,
                        0.65
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.61,
                        0.53,
                        0.65
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FO",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "pipe_1_2_PN_4CC2_3",
              "type": "pipe",
              "label": "1/2\"-PN--4CC2",
              "bbox": [
                0.31,
                0.3,
                0.37,
                0.32
              ],
              "confidence": 0.95,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation indicating pipe size and specification.",
                "description": "1/2 inch pipe, pneumatic, 4CC2 specification",
                "hvac_subsystem": "process_piping",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.31,
                  0.3,
                  0.37,
                  0.32
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.407Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.31,
                        0.3,
                        0.37,
                        0.32
                      ],
                      "normalized_bbox": [
                        0.31,
                        0.3,
                        0.37,
                        0.32
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: 1/2\"-PN--4CC2 (type: pipe)"
              }
            },
            {
              "id": "TI-1303",
              "type": "sensor_temperature",
              "label": "TI 1303",
              "bbox": [
                0.49,
                0.67,
                0.53,
                0.71
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'TI' denotes a Temperature Indicator, '1303' is the loop number. Field mounted (no line).",
                "description": "Temperature Indicator",
                "functional_desc": "Temperature Indicator",
                "hvac_subsystem": "controls",
                "instrument_function": "Temperature",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "TI-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.67,
                  0.53,
                  0.71
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.67,
                        0.53,
                        0.71
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.67,
                        0.53,
                        0.71
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
              "id": "E_1130_GREASE_MELTER",
              "type": "equipment",
              "label": "E 1130 GREASE MELTER",
              "bbox": [
                0.3,
                0.03,
                0.43,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'E' typically denotes equipment.",
                "description": "Grease Melter equipment",
                "equipment_type": "Grease Melter",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.3,
                  0.03,
                  0.43,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.401Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.3,
                        0.03,
                        0.43,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.3,
                        0.03,
                        0.43,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: E-1130-GREASE-MELTER (type: equipment)"
              }
            },
            {
              "id": "A_1130_GREASE_MIXER",
              "type": "equipment",
              "label": "A 1130 GREASE MIXER",
              "bbox": [
                0.46,
                0.03,
                0.59,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'A' typically denotes an analyzer or auxiliary equipment.",
                "description": "Grease Mixer equipment",
                "equipment_type": "Grease Mixer",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.46,
                  0.03,
                  0.59,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.46,
                        0.03,
                        0.59,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.46,
                        0.03,
                        0.59,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: A-1130-GREASE-MIXER (type: equipment)"
              }
            },
            {
              "id": "A_1131_OIL_MIXER",
              "type": "equipment",
              "label": "A 1131 OIL MIXER",
              "bbox": [
                0.62,
                0.03,
                0.72,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'A' typically denotes an analyzer or auxiliary equipment.",
                "description": "Oil Mixer equipment",
                "equipment_type": "Oil Mixer",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.62,
                  0.03,
                  0.72,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.62,
                        0.03,
                        0.72,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.62,
                        0.03,
                        0.72,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: A-1131-OIL-MIXER (type: equipment)"
              }
            },
            {
              "id": "P_1130_GREASE_LOADING_CIRCULATION_PUMP",
              "type": "pump",
              "label": "P 1130 GREASE LOADING CIRCULATION PUMP",
              "bbox": [
                0.75,
                0.03,
                0.9,
                0.08
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'P' typically denotes a pump.",
                "description": "Grease Loading Circulation Pump equipment",
                "equipment_type": "Pump",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.75,
                  0.03,
                  0.9,
                  0.08
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.75,
                        0.03,
                        0.9,
                        0.08
                      ],
                      "normalized_bbox": [
                        0.75,
                        0.03,
                        0.9,
                        0.08
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: P-1130-GREASE-LOADING-CIRCULATION-PUMP (type: pump)"
              }
            },
            {
              "id": "TIA-1303",
              "type": "sensor_temperature",
              "label": "TIA 1303",
              "bbox": [
                0.49,
                0.73,
                0.53,
                0.77
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'TIA' denotes a Temperature Indicator/Alarm, '1303' is the loop number. Field mounted (no line). The 'H' indicates a high alarm.",
                "description": "Temperature Indicator/High Alarm",
                "functional_desc": "Temperature Indicator Alarm",
                "hvac_subsystem": "controls",
                "instrument_function": "Temperature",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "TIA-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.73,
                  0.53,
                  0.77
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.73,
                        0.53,
                        0.77
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.73,
                        0.53,
                        0.77
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "TIA",
                "detection_quality": "excellent"
              }
            }
          ],
          "connections": [
            {
              "id": "1767584969410-8nhouu5u6",
              "from_id": "FTS-1301",
              "to_id": "HS-1301",
              "type": "electric_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "sensor_flow",
                "to_component_type": "instrument_controller",
                "from_label": "FTS 1301",
                "to_label": "HS 1301"
              }
            },
            {
              "id": "1767584969411-5o5uowij0",
              "from_id": "FTS-1301",
              "to_id": "FV-1301B",
              "type": "process_flow",
              "confidence": 0.9,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "sensor_flow",
                "to_component_type": "valve_control",
                "from_label": "FTS 1301",
                "to_label": "FV 1301B"
              }
            },
            {
              "id": "1767584969411-tammyalaa",
              "from_id": "HS-1301",
              "to_id": "FV-1301A",
              "type": "electric_signal",
              "confidence": 0.7,
              "meta": {
                "inferred_type": "control_signal",
                "type_confidence": 0.93,
                "type_reasoning": "Controller to control valve actuation",
                "from_component_type": "instrument_controller",
                "to_component_type": "valve_control",
                "from_label": "HS 1301",
                "to_label": "FV 1301A"
              }
            },
            {
              "id": "inferred-HS-1301-FO-1303",
              "from_id": "HS-1301",
              "to_id": "FO-1303",
              "type": "control_signal",
              "confidence": 0.82,
              "reasoning": "Inferred control loop actuation: default",
              "inferred": true
            },
            {
              "id": "inferred-HS-1301-FO-1305",
              "from_id": "HS-1301",
              "to_id": "FO-1305",
              "type": "control_signal",
              "confidence": 0.82,
              "reasoning": "Inferred control loop actuation: default",
              "inferred": true
            },
            {
              "id": "1767584969410-ctg2nv7nc",
              "from_id": "FO-1303",
              "to_id": "pipe_1_2_PN_4CC2_3",
              "type": "pneumatic_signal",
              "confidence": 0.9,
              "meta": {
                "inferred_type": "chilled_water",
                "type_confidence": 0.85,
                "type_reasoning": "Valve to pipe process flow",
                "from_component_type": "valve_solenoid",
                "to_component_type": "pipe",
                "from_label": "FO 1303",
                "to_label": "1/2\"-PN--4CC2"
              }
            },
            {
              "id": "1767584969411-1w0j5pznv",
              "from_id": "FO-1305",
              "to_id": "TI-1303",
              "type": "process_flow",
              "confidence": 0.9,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "valve_solenoid",
                "to_component_type": "sensor_temperature",
                "from_label": "FO 1305",
                "to_label": "TI 1303"
              }
            },
            {
              "id": "1767584969410-ql3ak7p3z",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "E_1130_GREASE_MELTER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "E 1130 GREASE MELTER"
              }
            },
            {
              "id": "1767584969410-z1p2ojqcc",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "A_1130_GREASE_MIXER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "A 1130 GREASE MIXER"
              }
            },
            {
              "id": "1767584969410-nqq4k8ajx",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "A_1131_OIL_MIXER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "A 1131 OIL MIXER"
              }
            },
            {
              "id": "1767584969410-vnx7e7xkf",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "P_1130_GREASE_LOADING_CIRCULATION_PUMP",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "pump",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "P 1130 GREASE LOADING CIRCULATION PUMP"
              }
            },
            {
              "id": "1767584969411-g1z3kfe2r",
              "from_id": "TI-1303",
              "to_id": "TIA-1303",
              "type": "electric_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "sensor_temperature",
                "to_component_type": "sensor_temperature",
                "from_label": "TI 1303",
                "to_label": "TIA 1303"
              }
            }
          ],
          "type": "fts",
          "confidence": 0.85
        },
        {
          "id": "loop-TI 1303",
          "name": "TI Control Loop (TI 1303)",
          "components": [
            {
              "id": "TI-1303",
              "type": "sensor_temperature",
              "label": "TI 1303",
              "bbox": [
                0.49,
                0.67,
                0.53,
                0.71
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'TI' denotes a Temperature Indicator, '1303' is the loop number. Field mounted (no line).",
                "description": "Temperature Indicator",
                "functional_desc": "Temperature Indicator",
                "hvac_subsystem": "controls",
                "instrument_function": "Temperature",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "TI-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.67,
                  0.53,
                  0.71
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.67,
                        0.53,
                        0.71
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.67,
                        0.53,
                        0.71
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
              "id": "TIA-1303",
              "type": "sensor_temperature",
              "label": "TIA 1303",
              "bbox": [
                0.49,
                0.73,
                0.53,
                0.77
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'TIA' denotes a Temperature Indicator/Alarm, '1303' is the loop number. Field mounted (no line). The 'H' indicates a high alarm.",
                "description": "Temperature Indicator/High Alarm",
                "functional_desc": "Temperature Indicator Alarm",
                "hvac_subsystem": "controls",
                "instrument_function": "Temperature",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "TIA-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.73,
                  0.53,
                  0.77
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.73,
                        0.53,
                        0.77
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.73,
                        0.53,
                        0.77
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "TIA",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "HS-1301",
              "type": "instrument_controller",
              "label": "HS 1301",
              "bbox": [
                0.79,
                0.54,
                0.83,
                0.58
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'HS' denotes a Hand Switch, '1301' is the loop number. Field mounted (no line).",
                "description": "Hand Switch",
                "functional_desc": "Hand Switch",
                "hvac_subsystem": "controls",
                "instrument_function": "Hand",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "HS-1301",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.79,
                  0.54,
                  0.83,
                  0.58
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.79,
                        0.54,
                        0.83,
                        0.58
                      ],
                      "normalized_bbox": [
                        0.79,
                        0.54,
                        0.83,
                        0.58
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "HS",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FV-1301A",
              "type": "valve_control",
              "label": "FV 1301A",
              "bbox": [
                0.72,
                0.61,
                0.76,
                0.65
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Diamond symbol indicates a control valve. 'FV' denotes a Flow Valve, '1301A' is the loop and suffix. Field mounted (no line).",
                "description": "Flow Control Valve A",
                "functional_desc": "Flow Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FV-1301A",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.72,
                  0.61,
                  0.76,
                  0.65
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.72,
                        0.61,
                        0.76,
                        0.65
                      ],
                      "normalized_bbox": [
                        0.72,
                        0.61,
                        0.76,
                        0.65
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FV",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FO-1303",
              "type": "valve_solenoid",
              "label": "FO 1303",
              "bbox": [
                0.26,
                0.29,
                0.3,
                0.33
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol with 'FO' and tag '1303' indicates a fail-open valve, likely a solenoid or block valve. The 'FO' indicates its fail-safe position.",
                "description": "Fail-Open Valve",
                "functional_desc": "Fail Open Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Valve",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FO-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.26,
                  0.29,
                  0.3,
                  0.33
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.405Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.26,
                        0.29,
                        0.3,
                        0.33
                      ],
                      "normalized_bbox": [
                        0.26,
                        0.29,
                        0.3,
                        0.33
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FO",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FV-1301B",
              "type": "valve_control",
              "label": "FV 1301B",
              "bbox": [
                0.76,
                0.37,
                0.8,
                0.41
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Diamond symbol indicates a control valve. 'FV' denotes a Flow Valve, '1301B' is the loop and suffix. Field mounted (no line).",
                "description": "Flow Control Valve B",
                "functional_desc": "Flow Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FV-1301B",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.76,
                  0.37,
                  0.8,
                  0.41
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.405Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.76,
                        0.37,
                        0.8,
                        0.41
                      ],
                      "normalized_bbox": [
                        0.76,
                        0.37,
                        0.8,
                        0.41
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FV",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FO-1305",
              "type": "valve_solenoid",
              "label": "FO 1305",
              "bbox": [
                0.49,
                0.61,
                0.53,
                0.65
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol with 'FO' and tag '1305' indicates a fail-open valve, likely a solenoid or block valve. The 'FO' indicates its fail-safe position.",
                "description": "Fail-Open Valve",
                "functional_desc": "Fail Open Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Valve",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FO-1305",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.61,
                  0.53,
                  0.65
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.61,
                        0.53,
                        0.65
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.61,
                        0.53,
                        0.65
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FO",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FTS-1301",
              "type": "sensor_flow",
              "label": "FTS 1301",
              "bbox": [
                0.72,
                0.54,
                0.76,
                0.58
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'FTS' denotes a Flow Transmitter Switch, '1301' is the loop number. Field mounted (no line).",
                "description": "Flow Transmitter Switch",
                "functional_desc": "Flow Transmitter Switch",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FTS-1301",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.72,
                  0.54,
                  0.76,
                  0.58
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.72,
                        0.54,
                        0.76,
                        0.58
                      ],
                      "normalized_bbox": [
                        0.72,
                        0.54,
                        0.76,
                        0.58
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FTS",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "pipe_1_2_PN_4CC2_3",
              "type": "pipe",
              "label": "1/2\"-PN--4CC2",
              "bbox": [
                0.31,
                0.3,
                0.37,
                0.32
              ],
              "confidence": 0.95,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation indicating pipe size and specification.",
                "description": "1/2 inch pipe, pneumatic, 4CC2 specification",
                "hvac_subsystem": "process_piping",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.31,
                  0.3,
                  0.37,
                  0.32
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.407Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.31,
                        0.3,
                        0.37,
                        0.32
                      ],
                      "normalized_bbox": [
                        0.31,
                        0.3,
                        0.37,
                        0.32
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: 1/2\"-PN--4CC2 (type: pipe)"
              }
            },
            {
              "id": "E_1130_GREASE_MELTER",
              "type": "equipment",
              "label": "E 1130 GREASE MELTER",
              "bbox": [
                0.3,
                0.03,
                0.43,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'E' typically denotes equipment.",
                "description": "Grease Melter equipment",
                "equipment_type": "Grease Melter",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.3,
                  0.03,
                  0.43,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.401Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.3,
                        0.03,
                        0.43,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.3,
                        0.03,
                        0.43,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: E-1130-GREASE-MELTER (type: equipment)"
              }
            },
            {
              "id": "A_1130_GREASE_MIXER",
              "type": "equipment",
              "label": "A 1130 GREASE MIXER",
              "bbox": [
                0.46,
                0.03,
                0.59,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'A' typically denotes an analyzer or auxiliary equipment.",
                "description": "Grease Mixer equipment",
                "equipment_type": "Grease Mixer",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.46,
                  0.03,
                  0.59,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.46,
                        0.03,
                        0.59,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.46,
                        0.03,
                        0.59,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: A-1130-GREASE-MIXER (type: equipment)"
              }
            },
            {
              "id": "A_1131_OIL_MIXER",
              "type": "equipment",
              "label": "A 1131 OIL MIXER",
              "bbox": [
                0.62,
                0.03,
                0.72,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'A' typically denotes an analyzer or auxiliary equipment.",
                "description": "Oil Mixer equipment",
                "equipment_type": "Oil Mixer",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.62,
                  0.03,
                  0.72,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.62,
                        0.03,
                        0.72,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.62,
                        0.03,
                        0.72,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: A-1131-OIL-MIXER (type: equipment)"
              }
            },
            {
              "id": "P_1130_GREASE_LOADING_CIRCULATION_PUMP",
              "type": "pump",
              "label": "P 1130 GREASE LOADING CIRCULATION PUMP",
              "bbox": [
                0.75,
                0.03,
                0.9,
                0.08
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'P' typically denotes a pump.",
                "description": "Grease Loading Circulation Pump equipment",
                "equipment_type": "Pump",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.75,
                  0.03,
                  0.9,
                  0.08
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.75,
                        0.03,
                        0.9,
                        0.08
                      ],
                      "normalized_bbox": [
                        0.75,
                        0.03,
                        0.9,
                        0.08
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: P-1130-GREASE-LOADING-CIRCULATION-PUMP (type: pump)"
              }
            }
          ],
          "connections": [
            {
              "id": "1767584969411-g1z3kfe2r",
              "from_id": "TI-1303",
              "to_id": "TIA-1303",
              "type": "electric_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "sensor_temperature",
                "to_component_type": "sensor_temperature",
                "from_label": "TI 1303",
                "to_label": "TIA 1303"
              }
            },
            {
              "id": "inferred-TI-1303-HS-1301",
              "from_id": "TI-1303",
              "to_id": "HS-1301",
              "type": "electric_signal",
              "confidence": 0.85,
              "reasoning": "Inferred control loop connection: default",
              "inferred": true
            },
            {
              "id": "1767584969411-tammyalaa",
              "from_id": "HS-1301",
              "to_id": "FV-1301A",
              "type": "electric_signal",
              "confidence": 0.7,
              "meta": {
                "inferred_type": "control_signal",
                "type_confidence": 0.93,
                "type_reasoning": "Controller to control valve actuation",
                "from_component_type": "instrument_controller",
                "to_component_type": "valve_control",
                "from_label": "HS 1301",
                "to_label": "FV 1301A"
              }
            },
            {
              "id": "inferred-HS-1301-FO-1303",
              "from_id": "HS-1301",
              "to_id": "FO-1303",
              "type": "control_signal",
              "confidence": 0.82,
              "reasoning": "Inferred control loop actuation: default",
              "inferred": true
            },
            {
              "id": "inferred-HS-1301-FV-1301B",
              "from_id": "HS-1301",
              "to_id": "FV-1301B",
              "type": "control_signal",
              "confidence": 0.82,
              "reasoning": "Inferred control loop actuation: default",
              "inferred": true
            },
            {
              "id": "inferred-HS-1301-FO-1305",
              "from_id": "HS-1301",
              "to_id": "FO-1305",
              "type": "control_signal",
              "confidence": 0.82,
              "reasoning": "Inferred control loop actuation: default",
              "inferred": true
            },
            {
              "id": "1767584969411-vc8r01ga4",
              "from_id": "FV-1301A",
              "to_id": "FTS-1301",
              "type": "process_flow",
              "confidence": 0.9,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "valve_control",
                "to_component_type": "sensor_flow",
                "from_label": "FV 1301A",
                "to_label": "FTS 1301"
              }
            },
            {
              "id": "1767584969410-ctg2nv7nc",
              "from_id": "FO-1303",
              "to_id": "pipe_1_2_PN_4CC2_3",
              "type": "pneumatic_signal",
              "confidence": 0.9,
              "meta": {
                "inferred_type": "chilled_water",
                "type_confidence": 0.85,
                "type_reasoning": "Valve to pipe process flow",
                "from_component_type": "valve_solenoid",
                "to_component_type": "pipe",
                "from_label": "FO 1303",
                "to_label": "1/2\"-PN--4CC2"
              }
            },
            {
              "id": "1767584969410-ql3ak7p3z",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "E_1130_GREASE_MELTER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "E 1130 GREASE MELTER"
              }
            },
            {
              "id": "1767584969410-z1p2ojqcc",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "A_1130_GREASE_MIXER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "A 1130 GREASE MIXER"
              }
            },
            {
              "id": "1767584969410-nqq4k8ajx",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "A_1131_OIL_MIXER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "A 1131 OIL MIXER"
              }
            },
            {
              "id": "1767584969410-vnx7e7xkf",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "P_1130_GREASE_LOADING_CIRCULATION_PUMP",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "pump",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "P 1130 GREASE LOADING CIRCULATION PUMP"
              }
            }
          ],
          "type": "ti",
          "confidence": 0.85
        },
        {
          "id": "loop-TIA 1303",
          "name": "TIA Control Loop (TIA 1303)",
          "components": [
            {
              "id": "TIA-1303",
              "type": "sensor_temperature",
              "label": "TIA 1303",
              "bbox": [
                0.49,
                0.73,
                0.53,
                0.77
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'TIA' denotes a Temperature Indicator/Alarm, '1303' is the loop number. Field mounted (no line). The 'H' indicates a high alarm.",
                "description": "Temperature Indicator/High Alarm",
                "functional_desc": "Temperature Indicator Alarm",
                "hvac_subsystem": "controls",
                "instrument_function": "Temperature",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "TIA-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.73,
                  0.53,
                  0.77
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.73,
                        0.53,
                        0.77
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.73,
                        0.53,
                        0.77
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "TIA",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "HS-1301",
              "type": "instrument_controller",
              "label": "HS 1301",
              "bbox": [
                0.79,
                0.54,
                0.83,
                0.58
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'HS' denotes a Hand Switch, '1301' is the loop number. Field mounted (no line).",
                "description": "Hand Switch",
                "functional_desc": "Hand Switch",
                "hvac_subsystem": "controls",
                "instrument_function": "Hand",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "HS-1301",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.79,
                  0.54,
                  0.83,
                  0.58
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.79,
                        0.54,
                        0.83,
                        0.58
                      ],
                      "normalized_bbox": [
                        0.79,
                        0.54,
                        0.83,
                        0.58
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "HS",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FV-1301A",
              "type": "valve_control",
              "label": "FV 1301A",
              "bbox": [
                0.72,
                0.61,
                0.76,
                0.65
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Diamond symbol indicates a control valve. 'FV' denotes a Flow Valve, '1301A' is the loop and suffix. Field mounted (no line).",
                "description": "Flow Control Valve A",
                "functional_desc": "Flow Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FV-1301A",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.72,
                  0.61,
                  0.76,
                  0.65
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.72,
                        0.61,
                        0.76,
                        0.65
                      ],
                      "normalized_bbox": [
                        0.72,
                        0.61,
                        0.76,
                        0.65
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FV",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FO-1303",
              "type": "valve_solenoid",
              "label": "FO 1303",
              "bbox": [
                0.26,
                0.29,
                0.3,
                0.33
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol with 'FO' and tag '1303' indicates a fail-open valve, likely a solenoid or block valve. The 'FO' indicates its fail-safe position.",
                "description": "Fail-Open Valve",
                "functional_desc": "Fail Open Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Valve",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FO-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.26,
                  0.29,
                  0.3,
                  0.33
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.405Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.26,
                        0.29,
                        0.3,
                        0.33
                      ],
                      "normalized_bbox": [
                        0.26,
                        0.29,
                        0.3,
                        0.33
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FO",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FV-1301B",
              "type": "valve_control",
              "label": "FV 1301B",
              "bbox": [
                0.76,
                0.37,
                0.8,
                0.41
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Diamond symbol indicates a control valve. 'FV' denotes a Flow Valve, '1301B' is the loop and suffix. Field mounted (no line).",
                "description": "Flow Control Valve B",
                "functional_desc": "Flow Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FV-1301B",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.76,
                  0.37,
                  0.8,
                  0.41
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.405Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.76,
                        0.37,
                        0.8,
                        0.41
                      ],
                      "normalized_bbox": [
                        0.76,
                        0.37,
                        0.8,
                        0.41
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FV",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FO-1305",
              "type": "valve_solenoid",
              "label": "FO 1305",
              "bbox": [
                0.49,
                0.61,
                0.53,
                0.65
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol with 'FO' and tag '1305' indicates a fail-open valve, likely a solenoid or block valve. The 'FO' indicates its fail-safe position.",
                "description": "Fail-Open Valve",
                "functional_desc": "Fail Open Valve",
                "hvac_subsystem": "controls",
                "instrument_function": "Valve",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FO-1305",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.61,
                  0.53,
                  0.65
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.61,
                        0.53,
                        0.65
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.61,
                        0.53,
                        0.65
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FO",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "FTS-1301",
              "type": "sensor_flow",
              "label": "FTS 1301",
              "bbox": [
                0.72,
                0.54,
                0.76,
                0.58
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'FTS' denotes a Flow Transmitter Switch, '1301' is the loop number. Field mounted (no line).",
                "description": "Flow Transmitter Switch",
                "functional_desc": "Flow Transmitter Switch",
                "hvac_subsystem": "controls",
                "instrument_function": "Flow",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "FTS-1301",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.72,
                  0.54,
                  0.76,
                  0.58
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.72,
                        0.54,
                        0.76,
                        0.58
                      ],
                      "normalized_bbox": [
                        0.72,
                        0.54,
                        0.76,
                        0.58
                      ]
                    }
                  }
                ],
                "component_category": "controls",
                "isa_function": "FTS",
                "detection_quality": "excellent"
              }
            },
            {
              "id": "pipe_1_2_PN_4CC2_3",
              "type": "pipe",
              "label": "1/2\"-PN--4CC2",
              "bbox": [
                0.31,
                0.3,
                0.37,
                0.32
              ],
              "confidence": 0.95,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation indicating pipe size and specification.",
                "description": "1/2 inch pipe, pneumatic, 4CC2 specification",
                "hvac_subsystem": "process_piping",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.31,
                  0.3,
                  0.37,
                  0.32
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.407Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.31,
                        0.3,
                        0.37,
                        0.32
                      ],
                      "normalized_bbox": [
                        0.31,
                        0.3,
                        0.37,
                        0.32
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: 1/2\"-PN--4CC2 (type: pipe)"
              }
            },
            {
              "id": "TI-1303",
              "type": "sensor_temperature",
              "label": "TI 1303",
              "bbox": [
                0.49,
                0.67,
                0.53,
                0.71
              ],
              "confidence": 0.99,
              "rotation": 0,
              "meta": {
                "reasoning": "Circle symbol indicates a discrete instrument. 'TI' denotes a Temperature Indicator, '1303' is the loop number. Field mounted (no line).",
                "description": "Temperature Indicator",
                "functional_desc": "Temperature Indicator",
                "hvac_subsystem": "controls",
                "instrument_function": "Temperature",
                "instrument_type": "Discrete",
                "location": "Field",
                "occlusion_level": "none",
                "tag": "TI-1303",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.49,
                  0.67,
                  0.53,
                  0.71
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.406Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.49,
                        0.67,
                        0.53,
                        0.71
                      ],
                      "normalized_bbox": [
                        0.49,
                        0.67,
                        0.53,
                        0.71
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
              "id": "E_1130_GREASE_MELTER",
              "type": "equipment",
              "label": "E 1130 GREASE MELTER",
              "bbox": [
                0.3,
                0.03,
                0.43,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'E' typically denotes equipment.",
                "description": "Grease Melter equipment",
                "equipment_type": "Grease Melter",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.3,
                  0.03,
                  0.43,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.401Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.3,
                        0.03,
                        0.43,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.3,
                        0.03,
                        0.43,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: E-1130-GREASE-MELTER (type: equipment)"
              }
            },
            {
              "id": "A_1130_GREASE_MIXER",
              "type": "equipment",
              "label": "A 1130 GREASE MIXER",
              "bbox": [
                0.46,
                0.03,
                0.59,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'A' typically denotes an analyzer or auxiliary equipment.",
                "description": "Grease Mixer equipment",
                "equipment_type": "Grease Mixer",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.46,
                  0.03,
                  0.59,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.46,
                        0.03,
                        0.59,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.46,
                        0.03,
                        0.59,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: A-1130-GREASE-MIXER (type: equipment)"
              }
            },
            {
              "id": "A_1131_OIL_MIXER",
              "type": "equipment",
              "label": "A 1131 OIL MIXER",
              "bbox": [
                0.62,
                0.03,
                0.72,
                0.07
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'A' typically denotes an analyzer or auxiliary equipment.",
                "description": "Oil Mixer equipment",
                "equipment_type": "Oil Mixer",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.62,
                  0.03,
                  0.72,
                  0.07
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.62,
                        0.03,
                        0.72,
                        0.07
                      ],
                      "normalized_bbox": [
                        0.62,
                        0.03,
                        0.72,
                        0.07
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: A-1131-OIL-MIXER (type: equipment)"
              }
            },
            {
              "id": "P_1130_GREASE_LOADING_CIRCULATION_PUMP",
              "type": "pump",
              "label": "P 1130 GREASE LOADING CIRCULATION PUMP",
              "bbox": [
                0.75,
                0.03,
                0.9,
                0.08
              ],
              "confidence": 0.98,
              "rotation": 0,
              "meta": {
                "reasoning": "Text annotation identifying a piece of equipment. 'P' typically denotes a pump.",
                "description": "Grease Loading Circulation Pump equipment",
                "equipment_type": "Pump",
                "hvac_subsystem": "process_equipment",
                "occlusion_level": "none",
                "text_clarity": "excellent",
                "raw_backend_output": [
                  0.75,
                  0.03,
                  0.9,
                  0.08
                ],
                "transform_history": [
                  {
                    "timestamp": "2026-01-05T03:49:29.404Z",
                    "operation": "normalize_bbox",
                    "details": {
                      "original_bbox": [
                        0.75,
                        0.03,
                        0.9,
                        0.08
                      ],
                      "normalized_bbox": [
                        0.75,
                        0.03,
                        0.9,
                        0.08
                      ]
                    }
                  }
                ],
                "component_category": "equipment",
                "isa_function": null,
                "detection_quality": "excellent",
                "isa_measured_variable": null,
                "isa_modifier": null,
                "isa_confidence": 0,
                "isa_reasoning": "No ISA pattern detected for: P-1130-GREASE-LOADING-CIRCULATION-PUMP (type: pump)"
              }
            }
          ],
          "connections": [
            {
              "id": "inferred-TIA-1303-HS-1301",
              "from_id": "TIA-1303",
              "to_id": "HS-1301",
              "type": "electric_signal",
              "confidence": 0.85,
              "reasoning": "Inferred control loop connection: default",
              "inferred": true
            },
            {
              "id": "1767584969411-tammyalaa",
              "from_id": "HS-1301",
              "to_id": "FV-1301A",
              "type": "electric_signal",
              "confidence": 0.7,
              "meta": {
                "inferred_type": "control_signal",
                "type_confidence": 0.93,
                "type_reasoning": "Controller to control valve actuation",
                "from_component_type": "instrument_controller",
                "to_component_type": "valve_control",
                "from_label": "HS 1301",
                "to_label": "FV 1301A"
              }
            },
            {
              "id": "inferred-HS-1301-FO-1303",
              "from_id": "HS-1301",
              "to_id": "FO-1303",
              "type": "control_signal",
              "confidence": 0.82,
              "reasoning": "Inferred control loop actuation: default",
              "inferred": true
            },
            {
              "id": "inferred-HS-1301-FV-1301B",
              "from_id": "HS-1301",
              "to_id": "FV-1301B",
              "type": "control_signal",
              "confidence": 0.82,
              "reasoning": "Inferred control loop actuation: default",
              "inferred": true
            },
            {
              "id": "inferred-HS-1301-FO-1305",
              "from_id": "HS-1301",
              "to_id": "FO-1305",
              "type": "control_signal",
              "confidence": 0.82,
              "reasoning": "Inferred control loop actuation: default",
              "inferred": true
            },
            {
              "id": "1767584969411-vc8r01ga4",
              "from_id": "FV-1301A",
              "to_id": "FTS-1301",
              "type": "process_flow",
              "confidence": 0.9,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "valve_control",
                "to_component_type": "sensor_flow",
                "from_label": "FV 1301A",
                "to_label": "FTS 1301"
              }
            },
            {
              "id": "1767584969410-ctg2nv7nc",
              "from_id": "FO-1303",
              "to_id": "pipe_1_2_PN_4CC2_3",
              "type": "pneumatic_signal",
              "confidence": 0.9,
              "meta": {
                "inferred_type": "chilled_water",
                "type_confidence": 0.85,
                "type_reasoning": "Valve to pipe process flow",
                "from_component_type": "valve_solenoid",
                "to_component_type": "pipe",
                "from_label": "FO 1303",
                "to_label": "1/2\"-PN--4CC2"
              }
            },
            {
              "id": "1767584969411-1w0j5pznv",
              "from_id": "FO-1305",
              "to_id": "TI-1303",
              "type": "process_flow",
              "confidence": 0.9,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "valve_solenoid",
                "to_component_type": "sensor_temperature",
                "from_label": "FO 1305",
                "to_label": "TI 1303"
              }
            },
            {
              "id": "1767584969410-ql3ak7p3z",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "E_1130_GREASE_MELTER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "E 1130 GREASE MELTER"
              }
            },
            {
              "id": "1767584969410-z1p2ojqcc",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "A_1130_GREASE_MIXER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "A 1130 GREASE MIXER"
              }
            },
            {
              "id": "1767584969410-nqq4k8ajx",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "A_1131_OIL_MIXER",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "equipment",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "A 1131 OIL MIXER"
              }
            },
            {
              "id": "1767584969410-vnx7e7xkf",
              "from_id": "pipe_1_2_PN_4CC2_3",
              "to_id": "P_1130_GREASE_LOADING_CIRCULATION_PUMP",
              "type": "pneumatic_signal",
              "confidence": 0.8,
              "meta": {
                "inferred_type": "unknown",
                "type_confidence": 0.5,
                "type_reasoning": "Could not determine connection type from component types",
                "from_component_type": "pipe",
                "to_component_type": "pump",
                "from_label": "1/2\"-PN--4CC2",
                "to_label": "P 1130 GREASE LOADING CIRCULATION PUMP"
              }
            }
          ],
          "type": "tia",
          "confidence": 0.85
        }
      ],
      "validation_issues": [
        {
          "connection": {
            "id": "1767584969410-ctg2nv7nc",
            "from_id": "FO-1303",
            "to_id": "pipe_1_2_PN_4CC2_3",
            "type": "pneumatic_signal",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "chilled_water",
              "type_confidence": 0.85,
              "type_reasoning": "Valve to pipe process flow",
              "from_component_type": "valve_solenoid",
              "to_component_type": "pipe",
              "from_label": "FO 1303",
              "to_label": "1/2\"-PN--4CC2"
            }
          },
          "issue": "Connection type mismatch: expected chilled_water, got pneumatic_signal",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767584969411-tammyalaa",
            "from_id": "HS-1301",
            "to_id": "FV-1301A",
            "type": "electric_signal",
            "confidence": 0.7,
            "meta": {
              "inferred_type": "control_signal",
              "type_confidence": 0.93,
              "type_reasoning": "Controller to control valve actuation",
              "from_component_type": "instrument_controller",
              "to_component_type": "valve_control",
              "from_label": "HS 1301",
              "to_label": "FV 1301A"
            }
          },
          "issue": "Connection type mismatch: expected control_signal, got electric_signal",
          "severity": "warning"
        }
      ],
      "quality_metrics": {
        "overall_score": 0.7826712328767126,
        "detection_quality": 1,
        "isa_completeness": 0.7123287671232876,
        "connection_coverage": 0.3561643835616438,
        "confidence_avg": 0.9445205479452065,
        "metrics": {
          "total_components": 73,
          "total_connections": 26,
          "isa_functions_detected": 52,
          "excellent_detections": 73,
          "avg_confidence": 0.9445205479452065
        }
      }
    }
  }
}