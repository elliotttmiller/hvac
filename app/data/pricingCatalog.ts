/**
 * HVAC_PRICING_CATALOG
 * 
 * Sourced from 2024-2025 Distributor Data (Kele, SupplyHouse, Grainger).
 * PRICES = "Street Price" (Contractor Market Rate), not inflated List Price.
 * 
 * LAST AUDIT: JAN 2026
 */

export type CatalogItem = {
  sku: string;
  manufacturer: string;
  category: "Sensor" | "Valve" | "Actuator" | "Controller" | "Thermostat" | "Accessory";
  description: string;
  spec_tags: string[]; // Keywords for AI fuzzy matching
  list_price: number;
  currency: "USD";
  source_ref: string;
};

export const HVAC_PRICING_CATALOG: CatalogItem[] = [
  // ==================================================================================
  // 1. ACTUATORS (DAMPER & VALVE)
  // ==================================================================================
  {
    sku: "LMB24-3",
    manufacturer: "Belimo",
    category: "Actuator",
    description: "Damper Actuator, 45 in-lb, Non-Spring Return, 24V, On/Off Floating",
    spec_tags: ["damper actuator", "non-spring", "floating", "24v", "belimo", "motor"],
    list_price: 114.00,
    currency: "USD",
    source_ref: "SupplyHouse 2025"
  },
  {
    sku: "LF24-SR",
    manufacturer: "Belimo",
    category: "Actuator",
    description: "Damper Actuator, 35 in-lb, Spring Return, 24V, Modulating (2-10V)",
    spec_tags: ["damper actuator", "spring return", "modulating", "fail safe", "0-10v", "belimo"],
    list_price: 357.00,
    currency: "USD",
    source_ref: "Grainger 2025"
  },
  {
    sku: "AFB24-MFT",
    manufacturer: "Belimo",
    category: "Actuator",
    description: "High Torque Actuator, 180 in-lb, Spring Return, 24V, Multi-Function Tech",
    spec_tags: ["damper actuator", "high torque", "spring return", "mft", "large", "belimo"],
    list_price: 534.00,
    currency: "USD",
    source_ref: "Kele 2025"
  },
  {
    sku: "MS7505A2030",
    manufacturer: "Honeywell",
    category: "Actuator",
    description: "Direct Coupled Actuator, 44 in-lb, Spring Return, 24V, Modulating",
    spec_tags: ["damper actuator", "honeywell", "spring return", "modulating", "ms series"],
    list_price: 347.00,
    currency: "USD",
    source_ref: "HVAC Depot 2025"
  },
  {
    sku: "GDE161.1P",
    manufacturer: "Siemens",
    category: "Actuator",
    description: "OpenAir Actuator, 44 in-lb, Non-Spring Return, 24V, Modulating 0-10V",
    spec_tags: ["damper actuator", "siemens", "non-spring", "modulating", "openair"],
    list_price: 146.00,
    currency: "USD",
    source_ref: "Blackhawk Supply 2025"
  },
  {
    sku: "VA9104-GGA-3S",
    manufacturer: "Johnson Controls",
    category: "Actuator",
    description: "Electric Valve Actuator, Non-Spring Return, 24V, Proportional",
    spec_tags: ["valve actuator", "jci", "johnson controls", "non-spring", "proportional"],
    list_price: 236.00,
    currency: "USD",
    source_ref: "EnergyControl 2025"
  },

  // ==================================================================================
  // 2. VALVES (BALL & GLOBE)
  // ==================================================================================
  {
    sku: "599-10305",
    manufacturer: "Siemens",
    category: "Valve",
    description: "1/2\" 2-Way Ball Valve, 4.0 Cv, Chrome-Plated Brass",
    spec_tags: ["valve", "ball valve", "2-way", "1/2 inch", "siemens", "water"],
    list_price: 86.00,
    currency: "USD",
    source_ref: "SupplyHouse 2025"
  },
  {
    sku: "VG1241AD",
    manufacturer: "Johnson Controls",
    category: "Valve",
    description: "1/2\" 2-Way Forged Brass Ball Valve, 1.2 Cv, NPT",
    spec_tags: ["valve", "ball valve", "2-way", "1/2 inch", "jci", "johnson controls"],
    list_price: 58.00,
    currency: "USD",
    source_ref: "Kele 2025"
  },
  {
    sku: "B215",
    manufacturer: "Belimo",
    category: "Valve",
    description: "1/2\" 2-Way Characterized Control Valve (CCV), Stainless Ball",
    spec_tags: ["valve", "ccv", "2-way", "1/2 inch", "belimo", "ball valve"],
    list_price: 135.00,
    currency: "USD",
    source_ref: "Belimo List 2025"
  },

  // ==================================================================================
  // 3. SENSORS (TEMP, PRESSURE, AIRFLOW)
  // ==================================================================================
  {
    sku: "BA/10K-2-D-4",
    manufacturer: "BAPI",
    category: "Sensor",
    description: "Duct Temperature Sensor, 10K Type 2 Thermistor, 4\" Probe",
    spec_tags: ["sensor", "temperature", "duct", "10k", "thermistor", "bapi", "te"],
    list_price: 18.00,
    currency: "USD",
    source_ref: "AlpsControls 2025"
  },
  {
    sku: "A/TT1K-A-24",
    manufacturer: "ACI",
    category: "Sensor",
    description: "Averaging Duct Temp Sensor, 1K RTD, 24' Flexible Probe",
    spec_tags: ["sensor", "averaging", "temperature", "duct", "rtd", "aci", "24 foot"],
    list_price: 417.00,
    currency: "USD",
    source_ref: "Kele 2025"
  },
  {
    sku: "A/DP2-10",
    manufacturer: "ACI",
    category: "Sensor",
    description: "Differential Pressure Transmitter, 0-10\" WC, 4-20mA Output",
    spec_tags: ["sensor", "pressure", "differential", "transmitter", "duct static", "aci", "dpt"],
    list_price: 185.00,
    currency: "USD",
    source_ref: "ACI List 2025"
  },
  {
    sku: "TE-205-Z",
    manufacturer: "Mamac Systems",
    category: "Sensor",
    description: "Duct Temp Sensor, 6\" Probe, 10k Type 3",
    spec_tags: ["sensor", "temperature", "duct", "mamac", "10k"],
    list_price: 25.00,
    currency: "USD",
    source_ref: "ValueControls 2025"
  },

  // ==================================================================================
  // 4. CONTROLLERS & THERMOSTATS
  // ==================================================================================
  {
    sku: "TB7600H5014W",
    manufacturer: "Honeywell",
    category: "Thermostat",
    description: "Communicating Thermostat, BACnet MS/TP, Heat Pump/RTU",
    spec_tags: ["thermostat", "bacnet", "communicating", "honeywell", "controller"],
    list_price: 454.00,
    currency: "USD",
    source_ref: "Industrial Stores 2025"
  },
  {
    sku: "F4-CVM03050-0",
    manufacturer: "Johnson Controls",
    category: "Controller",
    description: "VAV Box Controller with Integral Actuator & DP Sensor, BACnet",
    spec_tags: ["controller", "vav", "jci", "integral actuator", "bacnet"],
    list_price: 480.00,
    currency: "USD",
    source_ref: "JCI Market Estimate"
  }
];