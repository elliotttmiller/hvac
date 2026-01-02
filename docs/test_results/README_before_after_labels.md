# 📸 Screenshot Instructions: Label Accuracy Comparison

## File: `before_after_labels.png`

### What to Capture
A **side-by-side comparison** showing label extraction quality before and after the semantic fixes.

### Test Scenario
Upload one of the complex example images that contains:
- Visible text labels (e.g., "PDI-1401", "VAV-105", "TT-1402")
- Various component types (instruments, valves, equipment)
- Multiple text orientations (horizontal, vertical, rotated)

### Required Elements - BEFORE (Historical/Reference)
Screenshot showing the component sidebar with **PROBLEMS**:
- Components labeled as "Unknown-1", "Unknown-2", etc.
- Generic labels like "instrument", "valve", "component"
- Missing extraction of visible text like "PDI-1401"

Example of BAD output:
```
Components Detected:
├── Unknown-1 (Instrument)
├── Unknown-2 (Valve)  
├── Unknown-3 (Sensor)
└── Instrument-4
```

### Required Elements - AFTER (Current Implementation)
Screenshot showing the component sidebar with **CORRECT** labels:
- All visible text correctly extracted: "PDI-1401", "TT-1402", etc.
- NO generic "Unknown" labels for readable text
- Descriptive fallbacks for truly unreadable text: "unreadable-OCR-failed-instrument-..."

Example of GOOD output:
```
Components Detected:
├── PDI-1401 (Pressure Indicator)
├── TT-1402 (Temperature Transmitter)
├── FCV-203 (Flow Control Valve)
└── LIT-304 (Level Indicator Transmitter)
```

### Technical Validation
The current implementation enforces:

1. **Mandatory Label Field** (`types.ts`):
```typescript
label: string; // MANDATORY - not optional
```

2. **OCR-First Validation** (`visual.ts`):
```typescript
const forbiddenLabels = [
  'unknown', 'unlabeled', 'instrument', 'valve', 'sensor', 'component',
  'equipment', 'device', 'element', 'item', 'object', 'symbol'
];

if (isGenericLabel && !labelLower.includes('unreadable')) {
  console.error(`CRITICAL: Component has FORBIDDEN generic label: "${validated.label}"`);
  validated.label = `unreadable-OCR-failed-${validated.type}-bbox-...`;
}
```

3. **Prompt Instructions** (`detect.ts`):
```
COGNITIVE HIERARCHY: OCR-FIRST APPROACH
STEP 1: TEXT EXTRACTION (Primary Signal)
- Scan the ENTIRE diagram for ALL alphanumeric text strings first
- Extract every visible tag, label, and identifier before identifying shapes
```

### How to Capture
1. Run `python start.py` locally
2. Upload an example image with visible labels (e.g., P&ID with instrument tags)
3. Wait for analysis to complete
4. Open the Components sidebar
5. Screenshot the component list showing proper labels
6. Create side-by-side comparison (if you have historical "bad" screenshots, use those for comparison)

### Layout Suggestion
```
┌────────────────────────┬────────────────────────┐
│    BEFORE (Problem)    │     AFTER (Fixed)      │
├────────────────────────┼────────────────────────┤
│ Components:            │ Components:            │
│  ├─ Unknown-1          │  ├─ PDI-1401          │
│  ├─ Unknown-2          │  ├─ TT-1402           │
│  ├─ Instrument-3       │  ├─ FCV-203           │
│  └─ Valve-4            │  └─ LIT-304           │
│                        │                        │
│ ❌ Generic labels      │ ✅ Extracted text     │
│ ❌ No OCR extraction   │ ✅ OCR-First approach │
└────────────────────────┴────────────────────────┘
```

---

**Status:** 📋 Instructions Ready - Screenshot Pending
**Action Required:** Run local testing with labeled diagram and capture component list
