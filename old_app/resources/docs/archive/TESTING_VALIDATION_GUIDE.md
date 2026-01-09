# End-to-End Inference Testing & Validation Guide

**Document Version:** 1.0  
**Last Updated:** 2026-01-01  
**Purpose:** Comprehensive validation checklist for "Perfect Inference" mandate

---

## 🎯 Testing Objectives

This guide ensures the HVAC AI Platform achieves **100% precision** in:
1. **Zero "Unknowns"** - Every readable component has extracted text labels
2. **Zero Visual Drift** - Pixel-perfect bounding box alignment at any window size
3. **100% OCR Interpretation** - Correct text extraction from rotated/complex tags

---

## 📋 Pre-Testing Checklist

### Environment Verification
- [ ] `.env` file exists with valid `VITE_AI_API_KEY`
- [ ] Temperature set to `0.1` for deterministic OCR
- [ ] API provider set to `gemini`
- [ ] Model set to `gemini-2.5-flash` or `gemini-2.5-pro`

### Build Verification
```bash
npm run build
# Should complete with no TypeScript errors
# Expected output: ✓ 2395 modules transformed
```

### Console Preparation
1. Open browser DevTools (F12)
2. Navigate to Console tab
3. Enable "Preserve log" to capture all messages
4. Clear console before each test

---

## 🧪 Test Suite A: P&ID Precision Test

**Objective:** Validate OCR extraction on Process & Instrumentation Diagrams

### Test A1: Simple Instrument Tags
**Input:** P&ID with basic ISA-5.1 tags (PDI-1401, TT-1402, PI-1402)

**Steps:**
1. Upload P&ID to the platform
2. Wait for analysis to complete
3. Open sidebar with detected components

**Success Criteria:**
- [ ] All instrument tags extracted exactly as shown (e.g., "PDI-1401", not "pdi1401" or "Unknown")
- [ ] Console shows `[Visual Pipeline] SUCCESS: Detected X components`
- [ ] Console shows NO `⚠️ CRITICAL: Component ... has FORBIDDEN generic label`
- [ ] Sidebar lists components with full ISA-5.1 tags

**Validation Commands:**
```javascript
// In browser console, inspect detections:
// Check that labels match visual tags
components.forEach(c => console.log(`${c.id}: ${c.label} (${c.type})`));
```

### Test A2: Complex/Compound Tags
**Input:** P&ID with complex tags like "PZV 0001 A" (with spaces, suffixes)

**Steps:**
1. Upload P&ID with compound instrumentation tags
2. Wait for analysis
3. Inspect component labels in sidebar

**Success Criteria:**
- [ ] Spaces preserved in tags (e.g., "PZV 0001 A", not "PZV0001A")
- [ ] Suffixes captured (A, B, C variations)
- [ ] No truncation of tag text

### Test A3: Rotated Text
**Input:** P&ID with vertically oriented instrument tags (90°, 270°)

**Steps:**
1. Upload P&ID with vertical/rotated text
2. Verify tag extraction

**Success Criteria:**
- [ ] Vertical text correctly read and normalized
- [ ] Console reasoning mentions: "Extracted text: [tag]" with correct orientation handling

### Test A4: OCR Console Log Verification
**Requirement:** Console logs must prove OCR extraction

**Steps:**
1. After any P&ID analysis, search console for component reasoning
2. Look for pattern: `"reasoning": "Extracted text: [actual tag]"`

**Success Criteria:**
- [ ] Every instrument component has reasoning field
- [ ] Reasoning explicitly states: "Extracted text: PDI-1401" (or actual tag)
- [ ] No reasoning says "based on symbol only" for tagged instruments

---

## 🧪 Test Suite B: Zero Visual Drift Test

**Objective:** Validate pixel-perfect bounding box alignment at any window size

### Test B1: Standard Aspect Ratio
**Input:** Square or near-square blueprint (1:1 or 4:3 aspect)

**Steps:**
1. Upload blueprint
2. Observe bounding boxes rendered on image
3. Resize browser window to various sizes

**Success Criteria:**
- [ ] Bounding boxes stay aligned with components during resize
- [ ] No horizontal or vertical drift visible
- [ ] Canvas offset values visible in console (non-zero `offsetX` or `offsetY`)

### Test B2: Wide Horizontal Blueprint
**Input:** Wide rectangular P&ID (16:9 or wider aspect ratio)

**Steps:**
1. Upload wide horizontal image
2. Verify bounding box alignment
3. Resize window vertically (letterboxing scenario)

**Success Criteria:**
- [ ] Horizontal bars (letterboxing) applied correctly
- [ ] Canvas positioned with non-zero `offsetY`
- [ ] Boxes align with components despite whitespace above/below
- [ ] **Screenshot captured** showing perfect alignment

### Test B3: Tall Vertical Blueprint
**Input:** Tall vertical architectural plan (portrait orientation)

**Steps:**
1. Upload tall vertical image
2. Verify bounding box alignment
3. Resize window horizontally (pillarboxing scenario)

**Success Criteria:**
- [ ] Vertical bars (pillarboxing) applied correctly
- [ ] Canvas positioned with non-zero `offsetX`
- [ ] Boxes align with components despite whitespace on sides
- [ ] **Screenshot captured** showing perfect alignment

### Test B4: Dynamic Resize Stress Test
**Steps:**
1. Upload any blueprint with detected components
2. Rapidly resize browser window in all directions
3. Observe bounding box behavior

**Success Criteria:**
- [ ] No "jumping" or "floating" of bounding boxes
- [ ] Boxes remain locked to image during rapid resize
- [ ] Performance remains smooth (no lag)

---

## 🧪 Test Suite C: Tiling & Merge Test

**Objective:** Validate high-resolution image tiling with 15% overlap

### Test C1: Tiling Threshold Check
**Input:** High-resolution image (≥2048px on any dimension)

**Steps:**
1. Upload high-res blueprint
2. Check console for tiling decision

**Success Criteria:**
- [ ] Console shows: `[Visual Pipeline] Tiling decision: ENABLED`
- [ ] Console shows: `Created 4 tiles (2x2 grid with 15% overlap)`
- [ ] Console logs processing for tiles 1-4

### Test C2: Edge Component Detection
**Input:** Dense architectural floor plan with small VAV tags near tile boundaries

**Steps:**
1. Upload dense floor plan (PDF converted to PNG)
2. Verify small components detected

**Success Criteria:**
- [ ] Small components (VAV tags <50px) detected successfully
- [ ] Components near tile edges not missed
- [ ] Console shows: `After merge: X components` (reasonable count)
- [ ] Console shows deduplication: `removed Y duplicates`

### Test C3: Tile Failure Resilience
**Input:** Any large image (to trigger tiling)

**Steps:**
1. Monitor console during tiled analysis
2. Look for tile processing messages

**Success Criteria:**
- [ ] If individual tile fails, console shows: `ERROR in tile X` but continues
- [ ] Pipeline completes despite partial tile failure
- [ ] Final result includes components from successful tiles

### Test C4: Overlap Validation
**Objective:** Verify 15% overlap prevents missing components

**Steps:**
1. Upload image with components near quadrant boundaries
2. Check that boundary components are detected

**Success Criteria:**
- [ ] Components straddling tile edges captured
- [ ] Deduplication merges overlapping detections correctly
- [ ] Console shows reasonable duplicate removal count

---

## 🧪 Test Suite D: Unknown Label Elimination Test

**Objective:** Validate zero "unknown" labels on readable components

### Test D1: Generic Label Detection
**Input:** Any blueprint with visible text tags

**Steps:**
1. Upload blueprint
2. Monitor console for validation warnings

**Success Criteria:**
- [ ] NO console messages: `⚠️ CRITICAL: Component ... has FORBIDDEN generic label`
- [ ] If warning appears, verify that component truly has illegible text
- [ ] All readable tags extracted correctly

### Test D2: Unreadable Component Handling
**Input:** Blueprint with genuinely occluded/damaged text areas

**Steps:**
1. Upload blueprint with partial occlusion
2. Check how unreadable components are labeled

**Success Criteria:**
- [ ] Truly illegible components labeled: `unreadable-OCR-failed-{type}`
- [ ] Confidence score reduced (≤0.3) for failed OCR
- [ ] Console explains: "This violates OCR-First mandate" with reasoning

### Test D3: Schema Validation
**Verification:** Ensure schema rejects lazy labels at AI level

**Success Criteria:**
- [ ] Schema description includes: "ABSOLUTELY MANDATORY"
- [ ] Schema forbids: "unknown", "instrument", "valve", "sensor"
- [ ] Response must include reasoning with OCR proof

---

## 🧪 Test Suite E: Authentication & Error Handling

**Objective:** Validate diagnostic error messages

### Test E1: Missing API Key
**Steps:**
1. Temporarily remove `VITE_AI_API_KEY` from `.env`
2. Rebuild: `npm run build`
3. Upload blueprint

**Success Criteria:**
- [ ] Console shows: `[AI Client] AUTHENTICATION ERROR`
- [ ] Console shows: `Verify VITE_AI_API_KEY is set correctly`
- [ ] Error message is actionable (not silent failure)

### Test E2: Invalid API Key
**Steps:**
1. Set `VITE_AI_API_KEY` to invalid value in `.env`
2. Rebuild and test

**Success Criteria:**
- [ ] Console shows authentication error with 401/403 status
- [ ] Clear error message displayed to user
- [ ] No retry loop (auth errors fail fast)

### Test E3: Rate Limiting
**Steps:**
1. Upload multiple large blueprints rapidly
2. Monitor for rate limit handling

**Success Criteria:**
- [ ] Exponential backoff applied automatically
- [ ] Console shows retry attempts with delays
- [ ] Eventually succeeds after backoff

---

## 📊 Test Results Template

### Summary Table
| Test ID | Name | Status | Notes |
|---------|------|--------|-------|
| A1 | Simple Tags | ⬜ Pass / ⬜ Fail | |
| A2 | Complex Tags | ⬜ Pass / ⬜ Fail | |
| A3 | Rotated Text | ⬜ Pass / ⬜ Fail | |
| A4 | Console Logs | ⬜ Pass / ⬜ Fail | |
| B1 | Standard Aspect | ⬜ Pass / ⬜ Fail | |
| B2 | Wide Horizontal | ⬜ Pass / ⬜ Fail | |
| B3 | Tall Vertical | ⬜ Pass / ⬜ Fail | |
| B4 | Dynamic Resize | ⬜ Pass / ⬜ Fail | |
| C1 | Tiling Threshold | ⬜ Pass / ⬜ Fail | |
| C2 | Edge Components | ⬜ Pass / ⬜ Fail | |
| C3 | Tile Resilience | ⬜ Pass / ⬜ Fail | |
| C4 | Overlap Validation | ⬜ Pass / ⬜ Fail | |
| D1 | Generic Detection | ⬜ Pass / ⬜ Fail | |
| D2 | Unreadable Handling | ⬜ Pass / ⬜ Fail | |
| D3 | Schema Validation | ⬜ Pass / ⬜ Fail | |
| E1 | Missing Key | ⬜ Pass / ⬜ Fail | |
| E2 | Invalid Key | ⬜ Pass / ⬜ Fail | |
| E3 | Rate Limiting | ⬜ Pass / ⬜ Fail | |

---

## 📸 Required Screenshot Artifacts

### Screenshot 1: P&ID Precision
**Filename:** `test-artifact-pid-precision.png`
**Contents:**
- Uploaded P&ID with complex instrumentation tag (e.g., "PZV 0001 A")
- Sidebar showing extracted component with exact tag match
- Bounding box correctly aligned on instrument
- Visible browser console showing OCR extraction logs

### Screenshot 2: Zero Drift
**Filename:** `test-artifact-zero-drift.png`
**Contents:**
- Wide horizontal or tall vertical blueprint
- Bounding boxes pixel-perfect aligned despite letterboxing/pillarboxing
- Browser window with visible aspect ratio mismatch
- Canvas offset visible in DOM inspector or console

### Screenshot 3: Console Log Verification
**Filename:** `test-artifact-console-proof.png`
**Contents:**
- Browser console showing JSON response from Gemini
- Component object with:
  - `"label": "PDI-1401"` (actual extracted text)
  - `"reasoning": "Extracted text: PDI-1401..."` (OCR proof)
- No generic labels like "unknown" or "instrument"

---

## 🚨 Failure Diagnosis

### Symptom: "Unknown" Labels Appearing
**Possible Causes:**
1. Text truly occluded/illegible → **Expected** (should use "unreadable-OCR-failed")
2. AI ignoring OCR-First prompt → **Check prompt loaded correctly**
3. Temperature too high → **Verify .env has temperature=0.1**
4. Schema not enforced → **Check VISUAL_ANALYSIS_SCHEMA in types.ts**

**Fix:**
- Review console for generic label warnings
- Check prompt system instruction is loading
- Verify temperature is 0.1 in both .env and visual.ts

### Symptom: Bounding Boxes Drifting
**Possible Causes:**
1. Canvas offset not calculated → **Check CanvasOverlay.tsx lines 43-95**
2. Object-fit not set to 'contain' → **Verify image CSS**
3. Aspect ratio math incorrect → **Check containerAspect vs imageAspect logic**

**Fix:**
- Inspect canvas element in DevTools (should have non-zero top/left)
- Console should log: `offsetX: X, offsetY: Y` (non-zero if letterboxed)
- Verify actualWidth/actualHeight match rendered image size

### Symptom: Zero Components Detected
**Possible Causes:**
1. Authentication failure → **Check console for auth errors**
2. Tiling coordinate error → **Check console for tile processing logs**
3. Overly aggressive filtering → **Check confidence threshold**
4. API rate limit → **Check for 429 errors**

**Fix:**
- Search console for: `[AI Client] AUTHENTICATION ERROR`
- Search console for: `[Visual Pipeline] WARNING: Zero components`
- Check confidence threshold (should be low, ~0.3)

### Symptom: Small Components Missed
**Possible Causes:**
1. Tiling overlap insufficient → **Should be 15%, verify in tiling.ts**
2. Image resolution too low → **Check original image DPI**
3. Confidence filtering too strict → **Lower threshold**

**Fix:**
- Verify console shows: `15% overlap`
- Check image dimensions (should be ≥300 DPI for print quality)
- Try lower confidence threshold temporarily

---

## ✅ Definition of Done

The system achieves **Perfect Inference** when ALL of these are true:

- [ ] **Test Suite A (P&ID):** 100% pass rate (4/4 tests)
- [ ] **Test Suite B (Drift):** 100% pass rate (4/4 tests)
- [ ] **Test Suite C (Tiling):** 100% pass rate (4/4 tests)
- [ ] **Test Suite D (Unknown):** 100% pass rate (3/3 tests)
- [ ] **Test Suite E (Errors):** 100% pass rate (3/3 tests)
- [ ] **Screenshot Artifacts:** All 3 screenshots captured and reviewed
- [ ] **Build Status:** Passing with no TypeScript errors
- [ ] **Console Logs:** No critical warnings during normal operation
- [ ] **User Acceptance:** Manual review by Lead Engineer confirms quality

---

## 📞 Support & Escalation

### If Tests Fail
1. **Document the failure** with screenshots and console logs
2. **File GitHub issue** with `[INFERENCE-TEST-FAILURE]` prefix
3. **Include:**
   - Test ID that failed
   - Expected vs actual behavior
   - Console logs (with timestamps)
   - Screenshot of issue
   - Browser and OS version

### Contacts
- **Lead Engineer:** (TBD - assign after testing)
- **GitHub Issues:** `https://github.com/elliotttmiller/hvac/issues`

---

## 📚 Reference Documentation

- **Implementation Guide:** `docs/FIXES_2026_01.md`
- **P&ID Prompts:** `features/document-analysis/prompts/visual/detect-pid.ts`
- **Canvas Overlay:** `ui/visualization/CanvasOverlay.tsx`
- **Visual Pipeline:** `features/document-analysis/pipelines/visual.ts`
- **ISA-5.1 Knowledge Base:** `lib/knowledge-base/isa-5-1.ts`

---

**End of Testing Guide**
