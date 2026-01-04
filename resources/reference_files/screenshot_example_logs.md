Step 1: Classifying document...
Step 1: Classifying document...
["Classification result:",{"type":"SCHEMATIC","confidence":0.95,"reasoning":"Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"}]
Step 2: Routing to pipeline...
["Selected pipeline:","visual"]
Step 3: Executing pipeline...
Pipeline execution complete
["Analysis complete:",{"document_id":"1767566296053-46febgcej","type":"SCHEMATIC","processing_time_ms":73609,"components":30}]

{
  "document_id": "1767566296053-46febgcej",
  "document_type": "SCHEMATIC",
  "file_name": "current-image",
  "timestamp": 1767566369662,
  "classification": {
    "type": "SCHEMATIC",
    "confidence": 0.95,
    "reasoning": "Mock classification: Detected P&ID diagram with instrumentation symbols and process flow lines"
  },
  "processing_time_ms": 73609,
  "cache_hit": false,
  "visual": {
    "components": [
      {
        "id": "tank-1",
        "type": "equipment",
        "label": "Tank",
        "bbox": [
          0.0053,
          0.4,
          0.2907,
          0.8
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a large rectangular vessel with internal dashed lines indicating liquid level, consistent with a storage tank symbol.",
          "description": "Storage tank for MRF SS304",
          "equipment_type": "Storage Tank",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "text_clarity": "not_applicable",
          "raw_backend_output": [
            0.0053,
            0.4,
            0.2907,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.628Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.0053,
                  0.4,
                  0.2907,
                  0.8
                ],
                "normalized_bbox": [
                  0.0053,
                  0.4,
                  0.2907,
                  0.8
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "TA",
          "detection_quality": "excellent",
          "isa_measured_variable": "Temperature",
          "isa_modifier": "Alarm",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: TANK"
        }
      },
      {
        "id": "text-tl-mrf-ss304-1",
        "type": "text_annotation",
        "label": "TL MRF SS304",
        "bbox": [
          0.0507,
          0.7707,
          0.1507,
          0.8
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Direct OCR extraction of text label 'TL MRF SS304' associated with the tank.",
          "description": "Tank material specification",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.0507,
            0.7707,
            0.1507,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.630Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.0507,
                  0.7707,
                  0.1507,
                  0.8
                ],
                "normalized_bbox": [
                  0.0507,
                  0.7707,
                  0.1507,
                  0.8
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "TL",
          "detection_quality": "excellent",
          "isa_measured_variable": "Temperature",
          "isa_modifier": "Low",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: TL-MRF-SS304"
        }
      },
      {
        "id": "text-tl-mrf-ss304-2",
        "type": "text_annotation",
        "label": "TL MRF SS304",
        "bbox": [
          0.28,
          0.7707,
          0.38,
          0.8
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Direct OCR extraction of text label 'TL MRF SS304' associated with the tank.",
          "description": "Tank material specification",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.28,
            0.7707,
            0.38,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.631Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.28,
                  0.7707,
                  0.38,
                  0.8
                ],
                "normalized_bbox": [
                  0.28,
                  0.7707,
                  0.38,
                  0.8
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "TL",
          "detection_quality": "excellent",
          "isa_measured_variable": "Temperature",
          "isa_modifier": "Low",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: TL-MRF-SS304"
        }
      },
      {
        "id": "text-150nb-upvc-1",
        "type": "text_annotation",
        "label": "150NB uPVC",
        "bbox": [
          0.28,
          0.6,
          0.38,
          0.6307
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '150NB uPVC'.",
          "description": "Pipe specification: 150 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.28,
            0.6,
            0.38,
            0.6307
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.631Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.28,
                  0.6,
                  0.38,
                  0.6307
                ],
                "normalized_bbox": [
                  0.28,
                  0.6,
                  0.38,
                  0.6307
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
          "isa_reasoning": "No ISA pattern detected for: 150NB-UPVC (type: text_annotation)"
        }
      },
      {
        "id": "text-80nb-upvc-1",
        "type": "text_annotation",
        "label": "80NB uPVC",
        "bbox": [
          0.18,
          0.4,
          0.28,
          0.4307
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '80NB uPVC'.",
          "description": "Pipe specification: 80 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.18,
            0.4,
            0.28,
            0.4307
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.631Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.18,
                  0.4,
                  0.28,
                  0.4307
                ],
                "normalized_bbox": [
                  0.18,
                  0.4,
                  0.28,
                  0.4307
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
          "isa_reasoning": "No ISA pattern detected for: 80NB-UPVC (type: text_annotation)"
        }
      },
      {
        "id": "P-1091",
        "type": "pump",
        "label": "P-1091",
        "bbox": [
          0.3507,
          0.6507,
          0.4507,
          0.7507
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a pump symbol (circle with semicircle at bottom) and associated with the 'P-1091/92' label, indicating the first pump in a pair.",
          "description": "RO-I Feed Pump 1",
          "equipment_type": "Centrifugal Pump",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "parent_system": "RO-I FEED PUMP",
          "tag": "P-1091",
          "text_clarity": "good",
          "raw_backend_output": [
            0.3507,
            0.6507,
            0.4507,
            0.7507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.631Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.3507,
                  0.6507,
                  0.4507,
                  0.7507
                ],
                "normalized_bbox": [
                  0.3507,
                  0.6507,
                  0.4507,
                  0.7507
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "P",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "P-1092",
        "type": "pump",
        "label": "P-1092",
        "bbox": [
          0.5,
          0.6507,
          0.6,
          0.7507
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a pump symbol (circle with semicircle at bottom) and associated with the 'P-1091/92' label, indicating the second pump in a pair.",
          "description": "RO-I Feed Pump 2",
          "equipment_type": "Centrifugal Pump",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "parent_system": "RO-I FEED PUMP",
          "tag": "P-1092",
          "text_clarity": "good",
          "raw_backend_output": [
            0.5,
            0.6507,
            0.6,
            0.7507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.631Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.6507,
                  0.6,
                  0.7507
                ],
                "normalized_bbox": [
                  0.5,
                  0.6507,
                  0.6,
                  0.7507
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "P",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "text-p-1091-92",
        "type": "text_annotation",
        "label": "P-1091/92",
        "bbox": [
          0.68,
          0.7707,
          0.78,
          0.8
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Direct OCR extraction of equipment tag 'P-1091/92'.",
          "description": "Pump identification for both pumps",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.68,
            0.7707,
            0.78,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.631Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.68,
                  0.7707,
                  0.78,
                  0.8
                ],
                "normalized_bbox": [
                  0.68,
                  0.7707,
                  0.78,
                  0.8
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "P",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "text-ro-i-feed-pump",
        "type": "pump",
        "label": "RO-I FEED PUMP",
        "bbox": [
          0.68,
          0.8,
          0.8,
          0.8307
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Direct OCR extraction of descriptive text 'RO-I FEED PUMP'.",
          "description": "Functional description of the pumps",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.68,
            0.8,
            0.8,
            0.8307
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.632Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.68,
                  0.8,
                  0.8,
                  0.8307
                ],
                "normalized_bbox": [
                  0.68,
                  0.8,
                  0.8,
                  0.8307
                ]
              }
            }
          ],
          "hvac_subsystem": "other",
          "component_category": "equipment",
          "isa_function": "RO",
          "detection_quality": "excellent",
          "isa_measured_variable": "Radiation",
          "isa_modifier": "Orifice",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: RO-I-FEED-PUMP"
        }
      },
      {
        "id": "V111",
        "type": "valve_ball",
        "label": "V111",
        "bbox": [
          0.38,
          0.7507,
          0.42,
          0.8
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual ball valve symbol (diamond with internal 'X') with tag 'V111'.",
          "description": "Manual isolation valve for P-1091 suction",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "V111",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.38,
            0.7507,
            0.42,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.632Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.38,
                  0.7507,
                  0.42,
                  0.8
                ],
                "normalized_bbox": [
                  0.38,
                  0.7507,
                  0.42,
                  0.8
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
        "id": "V112",
        "type": "valve_ball",
        "label": "V112",
        "bbox": [
          0.5307,
          0.7507,
          0.5707,
          0.8
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual ball valve symbol (diamond with internal 'X') with tag 'V112'.",
          "description": "Manual isolation valve for P-1092 suction",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "V112",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5307,
            0.7507,
            0.5707,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.632Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5307,
                  0.7507,
                  0.5707,
                  0.8
                ],
                "normalized_bbox": [
                  0.5307,
                  0.7507,
                  0.5707,
                  0.8
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
        "id": "PG-134",
        "type": "instrument_indicator",
        "label": "PG-134",
        "bbox": [
          0.4,
          0.4507,
          0.4507,
          0.5
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a discrete instrument (circle) with tag 'PG-134'. 'P' for Pressure, 'G' for Gauge/Viewing Device. No internal line indicates field mounted.",
          "description": "Pressure gauge for loop 134, indicating discharge pressure of P-1091",
          "functional_desc": "Pressure Gauge",
          "hvac_subsystem": "water_systems",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PG-134",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.4,
            0.4507,
            0.4507,
            0.5
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.632Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.4,
                  0.4507,
                  0.4507,
                  0.5
                ],
                "normalized_bbox": [
                  0.4,
                  0.4507,
                  0.4507,
                  0.5
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "PG",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "V113",
        "type": "valve_ball",
        "label": "V113",
        "bbox": [
          0.42,
          0.5,
          0.46,
          0.5507
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual ball valve symbol (diamond with internal 'X') with tag 'V113'.",
          "description": "Manual isolation valve downstream of PG-134",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "V113",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.42,
            0.5,
            0.46,
            0.5507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.42,
                  0.5,
                  0.46,
                  0.5507
                ],
                "normalized_bbox": [
                  0.42,
                  0.5,
                  0.46,
                  0.5507
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
        "id": "PG-135",
        "type": "instrument_indicator",
        "label": "PG-135",
        "bbox": [
          0.5507,
          0.4507,
          0.6,
          0.5
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a discrete instrument (circle) with tag 'PG-135'. 'P' for Pressure, 'G' for Gauge/Viewing Device. No internal line indicates field mounted.",
          "description": "Pressure gauge for loop 135, indicating discharge pressure of P-1092",
          "functional_desc": "Pressure Gauge",
          "hvac_subsystem": "water_systems",
          "instrument_function": "P",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "PG-135",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5507,
            0.4507,
            0.6,
            0.5
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5507,
                  0.4507,
                  0.6,
                  0.5
                ],
                "normalized_bbox": [
                  0.5507,
                  0.4507,
                  0.6,
                  0.5
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "PG",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "V114",
        "type": "valve_ball",
        "label": "V114",
        "bbox": [
          0.5707,
          0.5,
          0.6107,
          0.5507
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual ball valve symbol (diamond with internal 'X') with tag 'V114'.",
          "description": "Manual isolation valve downstream of PG-135",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "V114",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5707,
            0.5,
            0.6107,
            0.5507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5707,
                  0.5,
                  0.6107,
                  0.5507
                ],
                "normalized_bbox": [
                  0.5707,
                  0.5,
                  0.6107,
                  0.5507
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
        "id": "V115",
        "type": "valve_check",
        "label": "V115",
        "bbox": [
          0.42,
          0.3507,
          0.46,
          0.4
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a check valve symbol (Z-shaped with two slashes) with tag 'V115'.",
          "description": "Check valve to prevent backflow from common header to P-1091 line",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "V115",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.42,
            0.3507,
            0.46,
            0.4
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.42,
                  0.3507,
                  0.46,
                  0.4
                ],
                "normalized_bbox": [
                  0.42,
                  0.3507,
                  0.46,
                  0.4
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
          "isa_reasoning": "No ISA pattern detected for: V115 (type: valve_check)"
        }
      },
      {
        "id": "V116",
        "type": "valve_check",
        "label": "V116",
        "bbox": [
          0.5707,
          0.3507,
          0.6107,
          0.4
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a check valve symbol (Z-shaped with two slashes) with tag 'V116'.",
          "description": "Check valve to prevent backflow from common header to P-1092 line",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "V116",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5707,
            0.3507,
            0.6107,
            0.4
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5707,
                  0.3507,
                  0.6107,
                  0.4
                ],
                "normalized_bbox": [
                  0.5707,
                  0.3507,
                  0.6107,
                  0.4
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
          "isa_reasoning": "No ISA pattern detected for: V116 (type: valve_check)"
        }
      },
      {
        "id": "FIT-104",
        "type": "sensor_flow",
        "label": "FIT-104",
        "bbox": [
          0.5,
          0.2,
          0.5507,
          0.2507
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a discrete instrument (circle) with tag 'FIT-104'. 'F' for Flow, 'I' for Indicator, 'T' for Transmitter. No internal line indicates field mounted.",
          "description": "Flow indicator transmitter for loop 104, measuring combined flow from pumps",
          "functional_desc": "Flow Indicator Transmitter",
          "hvac_subsystem": "water_systems",
          "instrument_function": "F",
          "instrument_type": "Discrete",
          "location": "Field",
          "occlusion_level": "none",
          "tag": "FIT-104",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5,
            0.2,
            0.5507,
            0.2507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.2,
                  0.5507,
                  0.2507
                ],
                "normalized_bbox": [
                  0.5,
                  0.2,
                  0.5507,
                  0.2507
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "FIT",
          "detection_quality": "excellent"
        }
      },
      {
        "id": "V118",
        "type": "valve_ball",
        "label": "V118",
        "bbox": [
          0.7,
          0.0507,
          0.74,
          0.1
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual ball valve symbol (diamond with internal 'X') with tag 'V118'.",
          "description": "Manual isolation valve on a branch line",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "V118",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.7,
            0.0507,
            0.74,
            0.1
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.7,
                  0.0507,
                  0.74,
                  0.1
                ],
                "normalized_bbox": [
                  0.7,
                  0.0507,
                  0.74,
                  0.1
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
        "id": "V119",
        "type": "valve_ball",
        "label": "V119",
        "bbox": [
          0.78,
          0.0507,
          0.82,
          0.1
        ],
        "confidence": 0.98,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a manual ball valve symbol (diamond with internal 'X') with tag 'V119'.",
          "description": "Manual isolation valve on a branch line",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "V119",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.78,
            0.0507,
            0.82,
            0.1
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.78,
                  0.0507,
                  0.82,
                  0.1
                ],
                "normalized_bbox": [
                  0.78,
                  0.0507,
                  0.82,
                  0.1
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
        "id": "VN26",
        "type": "equipment",
        "label": "VN26",
        "bbox": [
          0.38,
          0.4,
          0.42,
          0.4507
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a nozzle/vent symbol (Z-shaped with a line) with tag 'VN26'. 'VN' likely stands for Vent Nozzle.",
          "description": "Vent/Drain connection 26",
          "equipment_type": "Nozzle/Vent",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "VN26",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.38,
            0.4,
            0.42,
            0.4507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.38,
                  0.4,
                  0.42,
                  0.4507
                ],
                "normalized_bbox": [
                  0.38,
                  0.4,
                  0.42,
                  0.4507
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "VN",
          "detection_quality": "excellent",
          "isa_measured_variable": "Vibration/Position",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: VN26"
        }
      },
      {
        "id": "VN27",
        "type": "equipment",
        "label": "VN27",
        "bbox": [
          0.5307,
          0.4,
          0.5707,
          0.4507
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a nozzle/vent symbol (Z-shaped with a line) with tag 'VN27'. 'VN' likely stands for Vent Nozzle.",
          "description": "Vent/Drain connection 27",
          "equipment_type": "Nozzle/Vent",
          "hvac_subsystem": "water_systems",
          "occlusion_level": "none",
          "tag": "VN27",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5307,
            0.4,
            0.5707,
            0.4507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5307,
                  0.4,
                  0.5707,
                  0.4507
                ],
                "normalized_bbox": [
                  0.5307,
                  0.4,
                  0.5707,
                  0.4507
                ]
              }
            }
          ],
          "component_category": "equipment",
          "isa_function": "VN",
          "detection_quality": "excellent",
          "isa_measured_variable": "Vibration/Position",
          "isa_modifier": "User Defined",
          "isa_confidence": 0.7,
          "isa_reasoning": "Partial ISA pattern match from label: VN27"
        }
      },
      {
        "id": "flow-element-104",
        "type": "equipment",
        "label": "M",
        "bbox": [
          0.5,
          0.2507,
          0.52,
          0.2707
        ],
        "confidence": 0.9,
        "rotation": 0,
        "meta": {
          "reasoning": "Identified as a square with 'M' inside, connected by a dashed line to FIT-104. In the context of flow measurement, 'M' often denotes a primary flow element (e.g., orifice plate) that mechanically interfaces with the transmitter.",
          "description": "Primary flow element for FIT-104",
          "equipment_type": "Flow Element",
          "hvac_subsystem": "controls",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5,
            0.2507,
            0.52,
            0.2707
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5,
                  0.2507,
                  0.52,
                  0.2707
                ],
                "normalized_bbox": [
                  0.5,
                  0.2507,
                  0.52,
                  0.2707
                ]
              }
            }
          ],
          "component_category": "controls",
          "isa_function": null,
          "detection_quality": "excellent",
          "isa_measured_variable": null,
          "isa_modifier": null,
          "isa_confidence": 0,
          "isa_reasoning": "No ISA pattern detected for: M (type: equipment)"
        }
      },
      {
        "id": "text-80nb-upvc-2",
        "type": "text_annotation",
        "label": "80NB uPVC",
        "bbox": [
          0.42,
          0.4,
          0.46,
          0.4507
        ],
        "confidence": 0.95,
        "rotation": 270,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '80NB uPVC' rotated vertically.",
          "description": "Pipe specification: 80 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.42,
            0.4,
            0.46,
            0.4507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.42,
                  0.4,
                  0.46,
                  0.4507
                ],
                "normalized_bbox": [
                  0.42,
                  0.4,
                  0.46,
                  0.4507
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
          "isa_reasoning": "No ISA pattern detected for: 80NB-UPVC (type: text_annotation)"
        }
      },
      {
        "id": "text-80nb-upvc-3",
        "type": "text_annotation",
        "label": "80NB uPVC",
        "bbox": [
          0.5707,
          0.4,
          0.6107,
          0.4507
        ],
        "confidence": 0.95,
        "rotation": 270,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '80NB uPVC' rotated vertically.",
          "description": "Pipe specification: 80 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5707,
            0.4,
            0.6107,
            0.4507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5707,
                  0.4,
                  0.6107,
                  0.4507
                ],
                "normalized_bbox": [
                  0.5707,
                  0.4,
                  0.6107,
                  0.4507
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
          "isa_reasoning": "No ISA pattern detected for: 80NB-UPVC (type: text_annotation)"
        }
      },
      {
        "id": "text-100nb-upvc-2",
        "type": "text_annotation",
        "label": "100NB uPVC",
        "bbox": [
          0.38,
          0.7507,
          0.42,
          0.8
        ],
        "confidence": 0.95,
        "rotation": 270,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '100NB uPVC' rotated vertically.",
          "description": "Pipe specification: 100 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.38,
            0.7507,
            0.42,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.38,
                  0.7507,
                  0.42,
                  0.8
                ],
                "normalized_bbox": [
                  0.38,
                  0.7507,
                  0.42,
                  0.8
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
          "isa_reasoning": "No ISA pattern detected for: 100NB-UPVC (type: text_annotation)"
        }
      },
      {
        "id": "text-100nb-upvc-3",
        "type": "text_annotation",
        "label": "100NB uPVC",
        "bbox": [
          0.5307,
          0.7507,
          0.5707,
          0.8
        ],
        "confidence": 0.95,
        "rotation": 270,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '100NB uPVC' rotated vertically.",
          "description": "Pipe specification: 100 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.5307,
            0.7507,
            0.5707,
            0.8
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.5307,
                  0.7507,
                  0.5707,
                  0.8
                ],
                "normalized_bbox": [
                  0.5307,
                  0.7507,
                  0.5707,
                  0.8
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
          "isa_reasoning": "No ISA pattern detected for: 100NB-UPVC (type: text_annotation)"
        }
      },
      {
        "id": "text-80nb-upvc-4",
        "type": "text_annotation",
        "label": "80NB uPVC",
        "bbox": [
          0.18,
          0.4,
          0.22,
          0.4507
        ],
        "confidence": 0.95,
        "rotation": 270,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '80NB uPVC' rotated vertically.",
          "description": "Pipe specification: 80 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.18,
            0.4,
            0.22,
            0.4507
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.18,
                  0.4,
                  0.22,
                  0.4507
                ],
                "normalized_bbox": [
                  0.18,
                  0.4,
                  0.22,
                  0.4507
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
          "isa_reasoning": "No ISA pattern detected for: 80NB-UPVC (type: text_annotation)"
        }
      },
      {
        "id": "text-80nb-upvc-5",
        "type": "text_annotation",
        "label": "80NB uPVC",
        "bbox": [
          0.4507,
          0.1507,
          0.5507,
          0.18
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '80NB uPVC'.",
          "description": "Pipe specification: 80 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.4507,
            0.1507,
            0.5507,
            0.18
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.4507,
                  0.1507,
                  0.5507,
                  0.18
                ],
                "normalized_bbox": [
                  0.4507,
                  0.1507,
                  0.5507,
                  0.18
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
          "isa_reasoning": "No ISA pattern detected for: 80NB-UPVC (type: text_annotation)"
        }
      },
      {
        "id": "text-80nb-upvc-6",
        "type": "text_annotation",
        "label": "80NB uPVC",
        "bbox": [
          0.6507,
          0,
          0.7507,
          0.0307
        ],
        "confidence": 0.95,
        "rotation": 0,
        "meta": {
          "reasoning": "Direct OCR extraction of pipe specification '80NB uPVC'.",
          "description": "Pipe specification: 80 Nominal Bore, unplasticized Polyvinyl Chloride",
          "occlusion_level": "none",
          "text_clarity": "excellent",
          "raw_backend_output": [
            0.6507,
            0,
            0.7507,
            0.0307
          ],
          "transform_history": [
            {
              "timestamp": "2026-01-04T22:39:29.633Z",
              "operation": "normalize_bbox",
              "details": {
                "original_bbox": [
                  0.6507,
                  0,
                  0.7507,
                  0.0307
                ],
                "normalized_bbox": [
                  0.6507,
                  0,
                  0.7507,
                  0.0307
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
          "isa_reasoning": "No ISA pattern detected for: 80NB-UPVC (type: text_annotation)"
        }
      }
    ],
    "connections": [
      {
        "id": "1767566369634-suw65l89p",
        "from_id": "tank-1",
        "to_id": "text-150nb-upvc-1",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment",
          "to_component_type": "text_annotation",
          "from_label": "Tank",
          "to_label": "150NB uPVC"
        }
      },
      {
        "id": "1767566369634-69feeb5ac",
        "from_id": "text-150nb-upvc-1",
        "to_id": "V111",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "text_annotation",
          "to_component_type": "valve_ball",
          "from_label": "150NB uPVC",
          "to_label": "V111"
        }
      },
      {
        "id": "1767566369634-fpois70k8",
        "from_id": "text-150nb-upvc-1",
        "to_id": "V112",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "text_annotation",
          "to_component_type": "valve_ball",
          "from_label": "150NB uPVC",
          "to_label": "V112"
        }
      },
      {
        "id": "1767566369634-32jw2d3qa",
        "from_id": "V111",
        "to_id": "P-1091",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "pump",
          "from_label": "V111",
          "to_label": "P-1091"
        }
      },
      {
        "id": "1767566369634-peetzevsj",
        "from_id": "V112",
        "to_id": "P-1092",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "pump",
          "from_label": "V112",
          "to_label": "P-1092"
        }
      },
      {
        "id": "1767566369634-w3clgmst2",
        "from_id": "P-1091",
        "to_id": "PG-134",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pump",
          "to_component_type": "instrument_indicator",
          "from_label": "P-1091",
          "to_label": "PG-134"
        }
      },
      {
        "id": "1767566369634-bxdsn838s",
        "from_id": "P-1092",
        "to_id": "PG-135",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pump",
          "to_component_type": "instrument_indicator",
          "from_label": "P-1092",
          "to_label": "PG-135"
        }
      },
      {
        "id": "1767566369634-actejuw0z",
        "from_id": "PG-134",
        "to_id": "V113",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_indicator",
          "to_component_type": "valve_ball",
          "from_label": "PG-134",
          "to_label": "V113"
        }
      },
      {
        "id": "1767566369634-4wrp8lb5m",
        "from_id": "PG-135",
        "to_id": "V114",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "instrument_indicator",
          "to_component_type": "valve_ball",
          "from_label": "PG-135",
          "to_label": "V114"
        }
      },
      {
        "id": "1767566369634-wdvipbt9c",
        "from_id": "V113",
        "to_id": "V115",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "valve_check",
          "from_label": "V113",
          "to_label": "V115"
        }
      },
      {
        "id": "1767566369634-ui90kdhz1",
        "from_id": "V114",
        "to_id": "V116",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_ball",
          "to_component_type": "valve_check",
          "from_label": "V114",
          "to_label": "V116"
        }
      },
      {
        "id": "1767566369634-owo3ssbuq",
        "from_id": "V115",
        "to_id": "text-80nb-upvc-2",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_check",
          "to_component_type": "text_annotation",
          "from_label": "V115",
          "to_label": "80NB uPVC"
        }
      },
      {
        "id": "1767566369634-6wvxnzbcy",
        "from_id": "V116",
        "to_id": "text-80nb-upvc-3",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "valve_check",
          "to_component_type": "text_annotation",
          "from_label": "V116",
          "to_label": "80NB uPVC"
        }
      },
      {
        "id": "1767566369634-1hy7sfuzz",
        "from_id": "text-80nb-upvc-2",
        "to_id": "flow-element-104",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "text_annotation",
          "to_component_type": "equipment",
          "from_label": "80NB uPVC",
          "to_label": "M"
        }
      },
      {
        "id": "1767566369634-577624aeh",
        "from_id": "text-80nb-upvc-3",
        "to_id": "flow-element-104",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "text_annotation",
          "to_component_type": "equipment",
          "from_label": "80NB uPVC",
          "to_label": "M"
        }
      },
      {
        "id": "1767566369634-pjod8mlt8",
        "from_id": "flow-element-104",
        "to_id": "FIT-104",
        "type": "mechanical_link",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "equipment",
          "to_component_type": "sensor_flow",
          "from_label": "M",
          "to_label": "FIT-104"
        }
      },
      {
        "id": "1767566369634-f8swzyub4",
        "from_id": "FIT-104",
        "to_id": "text-80nb-upvc-5",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "sensor_flow",
          "to_component_type": "text_annotation",
          "from_label": "FIT-104",
          "to_label": "80NB uPVC"
        }
      },
      {
        "id": "1767566369634-hod2pvetb",
        "from_id": "text-80nb-upvc-5",
        "to_id": "V118",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "text_annotation",
          "to_component_type": "valve_ball",
          "from_label": "80NB uPVC",
          "to_label": "V118"
        }
      },
      {
        "id": "1767566369634-lumrr1wd4",
        "from_id": "text-80nb-upvc-5",
        "to_id": "V119",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "text_annotation",
          "to_component_type": "valve_ball",
          "from_label": "80NB uPVC",
          "to_label": "V119"
        }
      },
      {
        "id": "1767566369634-pvodj6qz7",
        "from_id": "text-80nb-upvc-4",
        "to_id": "tank-1",
        "type": "chilled_water",
        "confidence": 0.95,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "text_annotation",
          "to_component_type": "equipment",
          "from_label": "80NB uPVC",
          "to_label": "Tank"
        }
      },
      {
        "id": "1767566369634-hwfmuyfg1",
        "from_id": "P-1091",
        "to_id": "VN26",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pump",
          "to_component_type": "equipment",
          "from_label": "P-1091",
          "to_label": "VN26"
        }
      },
      {
        "id": "1767566369634-ykmw5qbuk",
        "from_id": "P-1092",
        "to_id": "VN27",
        "type": "chilled_water",
        "confidence": 0.9,
        "meta": {
          "inferred_type": "unknown",
          "type_confidence": 0.5,
          "type_reasoning": "Could not determine connection type from component types",
          "from_component_type": "pump",
          "to_component_type": "equipment",
          "from_label": "P-1092",
          "to_label": "VN27"
        }
      }
    ],
    "metadata": {
      "total_components": 30,
      "total_connections": 22,
      "process_log": "The provided schematic details a dual-pump feed system, likely for a Reverse Osmosis (RO) or similar water treatment application, given the 'RO-I FEED PUMP' label. The system features a storage tank, two parallel centrifugal pumps (P-1091/92) with individual suction and discharge isolation valves (V111, V112, V113, V114), and check valves (V115, V116) on the discharge to prevent backflow. Instrumentation includes local pressure gauges (PG-134, PG-135) for each pump's discharge and a common flow indicator transmitter (FIT-104) on the combined discharge header. The piping is specified as uPVC, indicating a non-corrosive fluid, likely treated water. The design demonstrates standard engineering practices for pump redundancy, isolation, and basic process monitoring.",
      "enhancement": {
        "isa_detection_enabled": true,
        "isa_functions_detected": 18,
        "isa_detection_rate": 0.6,
        "connection_inference_enabled": true,
        "inferred_connections": 0,
        "validation_enabled": true,
        "validation_issues": 9,
        "loop_detection_enabled": true,
        "control_loops": 0,
        "enhancement_duration_ms": 15
      },
      "control_loops": [],
      "validation_issues": [
        {
          "connection": {
            "id": "1767566369634-suw65l89p",
            "from_id": "tank-1",
            "to_id": "text-150nb-upvc-1",
            "type": "chilled_water",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "equipment",
              "to_component_type": "text_annotation",
              "from_label": "Tank",
              "to_label": "150NB uPVC"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767566369634-w3clgmst2",
            "from_id": "P-1091",
            "to_id": "PG-134",
            "type": "chilled_water",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "pump",
              "to_component_type": "instrument_indicator",
              "from_label": "P-1091",
              "to_label": "PG-134"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767566369634-bxdsn838s",
            "from_id": "P-1092",
            "to_id": "PG-135",
            "type": "chilled_water",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "pump",
              "to_component_type": "instrument_indicator",
              "from_label": "P-1092",
              "to_label": "PG-135"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767566369634-1hy7sfuzz",
            "from_id": "text-80nb-upvc-2",
            "to_id": "flow-element-104",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "text_annotation",
              "to_component_type": "equipment",
              "from_label": "80NB uPVC",
              "to_label": "M"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767566369634-577624aeh",
            "from_id": "text-80nb-upvc-3",
            "to_id": "flow-element-104",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "text_annotation",
              "to_component_type": "equipment",
              "from_label": "80NB uPVC",
              "to_label": "M"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767566369634-f8swzyub4",
            "from_id": "FIT-104",
            "to_id": "text-80nb-upvc-5",
            "type": "chilled_water",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "sensor_flow",
              "to_component_type": "text_annotation",
              "from_label": "FIT-104",
              "to_label": "80NB uPVC"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767566369634-pvodj6qz7",
            "from_id": "text-80nb-upvc-4",
            "to_id": "tank-1",
            "type": "chilled_water",
            "confidence": 0.95,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "text_annotation",
              "to_component_type": "equipment",
              "from_label": "80NB uPVC",
              "to_label": "Tank"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767566369634-hwfmuyfg1",
            "from_id": "P-1091",
            "to_id": "VN26",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "pump",
              "to_component_type": "equipment",
              "from_label": "P-1091",
              "to_label": "VN26"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        },
        {
          "connection": {
            "id": "1767566369634-ykmw5qbuk",
            "from_id": "P-1092",
            "to_id": "VN27",
            "type": "chilled_water",
            "confidence": 0.9,
            "meta": {
              "inferred_type": "unknown",
              "type_confidence": 0.5,
              "type_reasoning": "Could not determine connection type from component types",
              "from_component_type": "pump",
              "to_component_type": "equipment",
              "from_label": "P-1092",
              "to_label": "VN27"
            }
          },
          "issue": "Chilled water connection between non-process components",
          "severity": "warning"
        }
      ],
      "quality_metrics": {
        "overall_score": 0.8353666666666666,
        "detection_quality": 1,
        "isa_completeness": 0.6,
        "connection_coverage": 0.7333333333333333,
        "confidence_avg": 0.9623333333333333,
        "metrics": {
          "total_components": 30,
          "total_connections": 22,
          "isa_functions_detected": 18,
          "excellent_detections": 30,
          "avg_confidence": 0.9623333333333333
        }
      }
    }
  }
}