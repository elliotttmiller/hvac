# 🚀 Manual Testing Instructions - Quick Start

**Status:** Implementation Complete - Ready for Validation  
**Time Required:** 30-45 minutes  
**Prerequisites:** Web browser, sample P&ID/HVAC blueprints

---

## 🎯 Quick Setup

### 1. Start the Development Server

```bash
cd /home/runner/work/hvac/hvac
npm run dev
```

The application will start at `http://localhost:5173` (or next available port).

### 2. Open Browser DevTools

1. Press `F12` (or right-click → Inspect)
2. Navigate to **Console** tab
3. Enable **"Preserve log"** checkbox
4. Keep DevTools open during all tests

---

## ⚡ Fast Track Testing (15 minutes)

### Test 1: P&ID Precision ✅
**Goal:** Verify OCR extracts instrument tags correctly

1. Upload a P&ID with visible tags (e.g., PDI-1401, TT-1402)
2. Wait for analysis to complete
3. **Check Console:**
   - Should see: `[Visual Pipeline] SUCCESS: Detected X components`
   - Should NOT see: `⚠️ CRITICAL: Component ... has FORBIDDEN generic label`
4. **Check Sidebar:**
   - Components should be labeled "PDI-1401", "TT-1402" (exact text)
   - NOT labeled "unknown" or "instrument"

**✅ Pass Criteria:** All readable tags extracted exactly as shown

---

### Test 2: Zero Drift ✅
**Goal:** Verify bounding boxes stay aligned during window resize

1. Upload any blueprint with detected components
2. Observe bounding boxes overlaid on image
3. Resize browser window (drag corners in/out)
4. **Watch boxes:** Should stay perfectly aligned with components
5. **Check Canvas Position:**
   - Right-click canvas → Inspect Element
   - Should have non-zero `top` or `left` style (if letterboxed/pillarboxed)

**✅ Pass Criteria:** No visible drift or floating boxes during resize

---

### Test 3: Console Log Verification ✅
**Goal:** Verify OCR proof in console logs

1. After uploading any P&ID
2. In console, expand the analysis result object
3. Look for component reasoning fields
4. **Check Reasoning:** Should include "Extracted text: [tag]" for every instrument

**✅ Pass Criteria:** Every tagged component has OCR proof in reasoning field

---

## 📸 Required Screenshots (5 minutes)

### Screenshot 1: P&ID Precision
**Capture:**
- Uploaded P&ID with complex tag (e.g., "PZV 0001 A" with spaces)
- Sidebar showing exact tag match
- Bounding box correctly placed
- Console visible in same window

**Save as:** `screenshot-pid-precision.png`

---

### Screenshot 2: Zero Drift
**Capture:**
- Blueprint at non-standard window size (wide or tall)
- Bounding boxes perfectly aligned (no drift)
- Visible letterboxing/pillarboxing (whitespace)
- Canvas position showing offset in DevTools

**Save as:** `screenshot-zero-drift.png`

---

### Screenshot 3: Console Log
**Capture:**
- Browser console with expanded component JSON
- Visible fields: `"label": "PDI-1401"`, `"reasoning": "Extracted text: PDI-1401..."`
- No generic labels like "unknown" or "instrument"

**Save as:** `screenshot-console-proof.png`

---

## 📋 Full Testing Checklist

**If you have more time (45 minutes), complete all 18 tests:**

See `docs/TESTING_VALIDATION_GUIDE.md` for comprehensive testing:

- **Suite A:** P&ID Precision (4 tests)
- **Suite B:** Zero Drift (4 tests)
- **Suite C:** Tiling/Merge (4 tests)
- **Suite D:** Unknown Elimination (3 tests)
- **Suite E:** Error Handling (3 tests)

---

## 🐛 Common Issues & Quick Fixes

### Issue: "unknown" labels appearing
**Fix:**
```bash
# Verify temperature setting
cat .env | grep TEMPERATURE
# Should show: VITE_AI_TEMPERATURE=0.1

# If different, edit .env, then:
npm run build
npm run dev
```

### Issue: Zero components detected
**Fix:**
```bash
# Check API key is set
cat .env | grep VITE_AI_API_KEY
# Should show your Gemini API key

# If missing, add to .env:
# VITE_AI_API_KEY=your_key_here

# Then rebuild
npm run build
npm run dev
```

### Issue: Bounding boxes floating
**Fix:** This should already be fixed from PR #7. If still occurring:
1. Check `ui/visualization/CanvasOverlay.tsx` exists
2. Verify git branch: `git branch` should show `copilot/optimize-inference-pipeline`
3. If wrong branch: `git checkout copilot/optimize-inference-pipeline`

---

## ✅ Validation Criteria

**Minimum to Merge:**
- [ ] Test 1 (P&ID Precision): PASS
- [ ] Test 2 (Zero Drift): PASS
- [ ] Test 3 (Console Logs): PASS
- [ ] Screenshot 1: Captured
- [ ] Screenshot 2: Captured
- [ ] Screenshot 3: Captured

**Ideal (Full Validation):**
- [ ] All 18 tests in `TESTING_VALIDATION_GUIDE.md`: PASS
- [ ] All screenshots reviewed by Lead Engineer
- [ ] No critical warnings in console during normal use

---

## 📤 How to Report Results

### Option 1: Comment on GitHub PR
```markdown
## Manual Testing Results

**Date:** YYYY-MM-DD
**Tester:** [Your Name]
**Environment:** [Browser/OS]

### Fast Track Tests
- [x] Test 1 (P&ID Precision): PASS ✅
- [x] Test 2 (Zero Drift): PASS ✅
- [x] Test 3 (Console Logs): PASS ✅

### Screenshots
- Attached: screenshot-pid-precision.png
- Attached: screenshot-zero-drift.png
- Attached: screenshot-console-proof.png

### Notes
[Any observations or issues encountered]

**Recommendation:** ✅ Approve for merge
```

### Option 2: File Issue (if problems found)
Use prefix: `[INFERENCE-TEST-FAILURE]`

Include:
- Test ID that failed
- Expected vs actual behavior
- Console logs
- Screenshots

---

## 🎓 What Changed (Summary)

**Before this PR:**
- Temperature: 0.5 (too random for OCR)
- Tiling overlap: 10% (missed edge components)
- Generic labels: Only warnings (not blocked)
- OCR verification: Optional

**After this PR:**
- Temperature: 0.1 ✅ (deterministic)
- Tiling overlap: 15% ✅ (better edge detection)
- Generic labels: Blocked & auto-corrected ✅
- OCR verification: Mandatory in reasoning ✅

**Expected Result:** 
- More accurate text extraction (fewer "unknown" labels)
- Better detection of small components near tile edges
- More consistent results across multiple runs
- Better diagnostic logging for debugging

---

## 📚 Reference Documents

- **Full Testing Guide:** `docs/TESTING_VALIDATION_GUIDE.md` (18 tests)
- **Implementation Summary:** `docs/INFERENCE_OPTIMIZATION_SUMMARY.md` (Technical details)
- **Previous Fixes:** `docs/FIXES_2026_01.md` (Visual drift fix)
- **Environment Setup:** `.env.example` (Configuration reference)

---

## 🤝 Support

**Questions?** Create a GitHub issue or comment on the PR.

**Ready to test?** Run `npm run dev` and start with Test 1!

---

**Good luck with testing! 🚀**
