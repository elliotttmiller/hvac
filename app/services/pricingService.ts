import { HVAC_PRICING_CATALOG, CatalogItem } from "../data/pricingCatalog";
import { DetectedComponent } from "../types";

type PriceMatch = {
  estimated_cost: number;
  matched_sku: string;
  description: string;
  match_confidence: number;
  is_estimate: boolean;
};

export const getComponentPricing = (component: DetectedComponent): PriceMatch => {
  // 1. PRE-FILTER: Map AI types to Catalog Categories
  const categoryMap: Record<string, string> = {
    "Controller": "Controller",
    "Thermostat": "Thermostat",
    "Sensor": "Sensor",
    "Actuator": "Actuator",
    "Valve": "Valve",
    "Damper": "Actuator"
  };

  const targetCategory = categoryMap[component.type] || "Accessory";
  const candidates = HVAC_PRICING_CATALOG.filter(item => item.category === targetCategory);

  if (candidates.length === 0) {
    return { estimated_cost: 0, matched_sku: "N/A", description: "", match_confidence: 0, is_estimate: true };
  }

  // 2. SCORING ENGINE
  let bestMatch: CatalogItem | null = null;
  let highestScore = 0;

  // Flatten technical specs for searching
  const specsString = component.technicalSpecs 
    ? Object.entries(component.technicalSpecs).map(([k, v]) => `${k} ${v}`).join(' ') 
    : '';
  const searchCorpus = `${component.name} ${specsString}`.toLowerCase();

  for (const item of candidates) {
    let score = 0;
    
    // Critical: Manufacturer Match (High Weight)
    if (searchCorpus.includes(item.manufacturer.toLowerCase())) score += 5;

    // Spec Tag Matching
    item.spec_tags.forEach(tag => {
      if (searchCorpus.includes(tag.toLowerCase())) {
        score += 1;
      }
    });

    // Normalize score
    const normalizedScore = score / (item.spec_tags.length + 2);

    if (normalizedScore > highestScore) {
      highestScore = normalizedScore;
      bestMatch = item;
    }
  }

  // 3. CONFIDENCE THRESHOLD
  if (bestMatch && highestScore > 0.15) {
    return {
      estimated_cost: bestMatch.list_price,
      matched_sku: bestMatch.sku,
      description: bestMatch.description,
      match_confidence: parseFloat(highestScore.toFixed(2)),
      is_estimate: false
    };
  }

  return { estimated_cost: 0, matched_sku: "N/A", description: "", match_confidence: 0, is_estimate: true };
};