# Testing Guide: P&ID Inference Improvements

**Prepared:** 2026-01-01  
**For:** User Validation Testing  
**Test Image:** `docs/test/Screenshot 2026-01-01 062508.png`

---

## Quick Start

### 1. Start the Application
```bash
npm run dev
```

### 2. Upload Test Image
- Navigate to the document upload interface
- Upload: `docs/test/Screenshot 2026-01-01 062508.png`
- Click "Run" to execute analysis

### 3. Verify Results

**Expected Behavior:**
- Blueprint type should be detected as "P&ID" (check console logs)
- Components panel should show instrument tags like:
  - "PDI-1401" (not "unknown-1")
  - "TT-1402" (not "unknown-2")
  - "PI-1402" (not "unknown-3")
  - etc.

**Expected Descriptions:**
- "Pressure Differential Indicator" for PDI tags
- "Temperature Transmitter" for TT tags
- "Pressure Indicator" for PI tags

---

## What Changed

### Before (Broken)
```
Components Panel:
├─ unknown-1 (No description)
├─ unknown-2 (No description)
├─ unknown-3 (No description)
└─ ...
```

**Problem:** Generic HVAC prompts couldn't read ISA-5.1 instrument tags

### After (Fixed)
```
Components Panel:
├─ PDI-1401 (Pressure Differential Indicator)
├─ TT-1402 (Temperature Transmitter)
├─ PI-1402 (Pressure Indicator)
└─ ...
```

**Solution:** OCR-first P&ID prompts with ISA-5.1 knowledge

---

## Validation Checklist

Use this checklist to verify the fix works:

### Blueprint Type Detection
- [ ] Console shows "Blueprint type detected: PID" (not "HVAC")
- [ ] Console shows "Using P&ID-specific prompts"

### Label Extraction Accuracy
- [ ] At least 95% of visible instrument tags correctly extracted
- [ ] Zero "unknown-X" labels on clearly readable tags
- [ ] Tags match the visible text in the image exactly

### ISA-5.1 Decoding
- [ ] PDI tags decoded as "Pressure Differential Indicator"
- [ ] TT tags decoded as "Temperature Transmitter"
- [ ] PI tags decoded as "Pressure Indicator"
- [ ] FIC tags (if any) decoded as "Flow Indicator Controller"

### Bounding Box Accuracy
- [ ] Bounding boxes align with instrument symbols
- [ ] No floating boxes in empty space
- [ ] Boxes capture symbol + text together

### Reasoning Transparency
- [ ] Each component has a "reasoning" field explaining the classification
- [ ] Reasoning mentions the extracted text
- [ ] Reasoning references ISA-5.1 decoding rules

---

## How to Capture Results

### Take a Screenshot
1. Upload the test image
2. Run analysis
3. Wait for completion
4. Screenshot the Components panel showing the results
5. Save as `docs/test/Screenshot_After_Fix.png`

### Compare Before/After
Create a side-by-side comparison:
- **Left:** Original screenshot (all "unknown")
- **Right:** New screenshot (proper ISA-5.1 tags)

---

## Console Logs to Check

Enable developer console and look for:

```
Detecting blueprint type (P&ID vs HVAC)...
Blueprint type detected: PID
Using SOTA tiling approach for high-resolution image
Step 1: Tiling image...
Created 4 tiles
Step 2: Processing tiles in parallel (MAP phase)...
Step 3: Merging tile results (REDUCE phase)...
Before deduplication: XX components
After deduplication: XX components
Step 4: Self-correction refinement...
Refinement complete:
  Components: XX -> XX
  Connections: XX -> XX
```

**Key Indicator:** "Blueprint type detected: PID"

---

## Troubleshooting

### If Blueprint Type Detection Fails
**Symptom:** Console shows "Blueprint type detected: HVAC" for P&ID image

**Solution:** The heuristic may need tuning. The system will still work but use generic HVAC prompts. File an issue with the specific image.

### If Still Getting "Unknown" Labels
**Check:**
1. Is the text in the image clear and readable?
2. Are the tags following ISA-5.1 format (LETTERS-NUMBERS)?
3. Check the reasoning field for explanation

**If text is >70% occluded:** "unknown" is acceptable per the design

### If Bounding Boxes are Wrong
**Note:** This fix focused on label extraction, not spatial accuracy. If bounding boxes are severely off, that's a separate issue (possibly needs Set-of-Mark technique from research).

---

## Success Metrics

**Target:** >95% label accuracy

**How to Calculate:**
```
Accuracy = (Correct Labels / Total Visible Tags) × 100%

Example:
- Image has 10 visible instrument tags
- System correctly extracted 10 tags
- Accuracy = 10/10 × 100% = 100% ✅
```

**Acceptable:** ≥95% accuracy (9 out of 10 correct)

---

## Reporting Results

### If Test Passes ✅
Comment on the PR:
```
Testing complete ✅

Label accuracy: XX% (target: >95%)
Screenshot: [attach before/after comparison]
All ISA-5.1 tags correctly decoded
Zero "unknown" labels on readable text

Ready to merge.
```

### If Test Fails ❌
Comment on the PR with:
1. Screenshot showing the issue
2. Console log output
3. Specific tags that failed to extract
4. Description of what went wrong

---

## Technical Details (Optional)

### Architecture Flow
```
Image Upload
  ↓
Blueprint Type Detection (P&ID vs HVAC)
  ↓
Route to Appropriate Pipeline
  ├─→ P&ID Pipeline
  │    ├─ OCR-First Text Extraction
  │    ├─ Symbol Identification
  │    ├─ ISA-5.1 Decoding
  │    └─ Reasoning Generation
  │
  └─→ HVAC Pipeline (unchanged)
       ├─ Shape Detection
       ├─ Ductwork Classification
       └─ Connection Tracing
```

### Key Files Modified
1. `features/document-analysis/pipelines/visual.ts` - Auto-routing logic
2. `features/document-analysis/prompts/visual/detect-pid.ts` - P&ID prompts

### Research Backing
All changes based on 2024-2025 VLM research:
- OCR-First Strategy (PackageX, Roboflow)
- Visual Chain-of-Thought (CVPR 2025, NeurIPS 2024)
- P&ID ML Best Practices (IEEE, Oxford Academic)

---

## Questions?

Refer to comprehensive documentation:
- `docs/SOTA_RESEARCH_REPORT.md` - Research findings
- `docs/GOLDEN_PROMPT.md` - Prompt engineering strategy
- `docs/PREPROCESSING_VERDICT.md` - Technical decisions
- `docs/PID_IMPLEMENTATION_SUMMARY.md` - Executive summary

---

**Good luck with testing!** 🚀

Expected outcome: Transformation from "unknown" labels to precise ISA-5.1 instrument identification.
