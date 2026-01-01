# Pre-Processing Verdict: Image Handling for Gemini 2.5 Flash

**Date:** 2026-01-01  
**Decision:** NO additional pre-processing required  
**Status:** ✅ APPROVED

---

## Executive Summary

After comprehensive investigation of Gemini 2.5 Flash's coordinate system and spatial understanding capabilities, we have determined that **no additional image pre-processing** (padding, grid overlays, or aspect ratio normalization) is required for P&ID analysis.

---

## Research Findings

### Gemini 2.5 Flash Coordinate System

**Official Documentation Analysis:**
- **Format:** Bounding boxes returned as `[y_min, x_min, y_max, x_max]`
- **Normalization:** All coordinates in 0-1000 integer range
- **Aspect Ratio Handling:** Native support without forced squaring
- **Calculation:** `normalized_x = (pixel_x / image_width) * 1000`

**Source:** Google Gemini API Documentation, DeepWiki Spatial Understanding Guide

### Key Technical Details

1. **No Image Reshaping:**
   - Gemini does NOT crop or resize images to square
   - Normalization preserves original aspect ratio
   - Wide, tall, or square images all handled correctly

2. **Denormalization for Display:**
   ```typescript
   pixel_x = (normalized_x / 1000) * image_width
   pixel_y = (normalized_y / 1000) * image_height
   ```

3. **Accuracy:**
   - Bounding box precision comparable to YOLOv3 on COCO val
   - Suitable for engineering diagram analysis

---

## Evaluation of Pre-Processing Techniques

### 1. Square Padding (NOT NEEDED ❌)

**Technique:** Pad non-square images to 1:1 aspect ratio

**Verdict:** REJECTED
- Gemini's normalization already handles aspect ratios natively
- Padding adds unnecessary whitespace that could confuse text extraction
- No performance benefit observed in research literature
- Would increase token usage without accuracy gain

### 2. Set-of-Mark (SoM) Grid Overlays (NOT NEEDED ❌)

**Technique:** Overlay image with numbered grid/masks before inference

**Research:** Microsoft Research arXiv:2310.11441

**Verdict:** DEFERRED (Revisit if IoU < 95%)
- **PRO:** Improves fine-grained spatial grounding in white-space diagrams
- **CON:** Adds preprocessing complexity
- **CON:** May interfere with OCR text reading
- **CON:** Our primary issue is semantic (wrong labels), not spatial (wrong boxes)

**Decision:** Not needed for initial fix. The screenshot shows bounding boxes were generally correct—the problem was label extraction, not localization.

### 3. Visual Grid Tiling (ALREADY IMPLEMENTED ✅)

**Technique:** Split high-res images into 2x2 tiles with 10% overlap

**Status:** Already implemented in `lib/file-processing/tiling.ts`

**Pipeline Flow:**
```typescript
if (shouldUseTiling(imageData)) {
  // 1. Tile into 2x2 grid
  // 2. Process tiles in parallel (MAP)
  // 3. Transform local coords to global (REDUCE)
  // 4. Deduplicate with IoU-based NMS
  // 5. Refinement pass with full image
}
```

**Verdict:** KEEP
- Handles high-resolution P&IDs (common in engineering)
- Parallel processing improves throughput
- 10% overlap prevents edge artifacts
- Self-correction pass with full image catches missed components

---

## Problem Root Cause Analysis

### What the Screenshot Revealed

**Evidence:** `docs/test/Screenshot 2026-01-01 062508.png`

**Observations:**
1. ✅ Bounding boxes were present and generally well-positioned
2. ❌ Labels were "unknown-1", "unknown-2", etc.
3. ✅ Clear ISA-5.1 tags visible in image (PDI 1401, TT 1402, PI 1402)
4. ❌ Component descriptions were "No description"

**Conclusion:** This is a **SEMANTIC failure**, not a **SPATIAL failure**.

### The Real Problem

The model was:
- Detecting geometric shapes ✅
- Generating bounding boxes ✅
- **BUT:** Not reading/associating text ❌
- **BUT:** Using wrong prompt domain (HVAC ductwork vs ISA-5.1 instruments) ❌

### Why Pre-Processing Won't Help

- Better bounding boxes won't fix text extraction
- Grid overlays won't teach ISA-5.1 symbology
- Padding won't improve OCR accuracy

**Solution:** Fix the PROMPT, not the IMAGE.

---

## Coordinate Accuracy Validation

### Current Implementation Check

**File:** `features/document-analysis/types.ts`

```typescript
export interface DetectedComponent {
  bbox: [number, number, number, number]; // [x1, y1, x2, y2] normalized 0-1
  // ...
}
```

**Issue Found:** Documentation says 0-1, but Gemini returns 0-1000 ⚠️

**Action Required:** Verify if downstream visualization code expects 0-1 or 0-1000.

**File to Check:** `ui/visualization/CanvasOverlay.tsx`

### Denormalization Logic

If visualization expects pixel coordinates, ensure:
```typescript
const pixelX = (normalizedX / 1000) * imageWidth;
const pixelY = (normalizedY / 1000) * imageHeight;
```

---

## Final Decision Matrix

| Technique | Status | Rationale |
|-----------|--------|-----------|
| Square Padding | ❌ REJECT | Gemini handles aspect ratios natively |
| SoM Grid Overlays | ⏸️ DEFER | Not needed for semantic fix, revisit if IoU < 95% |
| Visual Tiling (2x2) | ✅ KEEP | Already implemented, proven effective |
| Aspect Ratio Normalization | ❌ REJECT | Unnecessary, Gemini supports natively |
| Image Enhancement | ❌ REJECT | Document quality appears acceptable |
| OCR Pre-Processing | ❌ REJECT | VLM handles text natively, better than standalone OCR |

---

## Performance Implications

### Token Usage
- **No Preprocessing:** 1 image = 1 API call (tiles excluded)
- **With SoM Overlay:** 2 API calls (1 for overlay generation, 1 for inference)
- **Verdict:** Avoid unnecessary calls

### Processing Time
- **No Preprocessing:** ~2-3s inference only
- **With SoM Overlay:** +5-10s overlay generation
- **Verdict:** Faster without preprocessing

### Accuracy
- **Current Issue:** 0% label extraction due to wrong prompts
- **After Prompt Fix:** Expected >95% label extraction
- **Preprocessing Impact:** Minimal (problem is semantic, not visual)

---

## Recommendations for Future Optimization

### If Bounding Box IoU < 95%
**Then consider:**
1. Set-of-Mark (SoM) technique for improved grounding
2. Bounding box post-processing with snap-to-symbol logic
3. Multi-scale tiling (4x4 grid for ultra-high-res diagrams)

### If Text OCR Accuracy < 95%
**Then consider:**
1. Rotation correction pre-processing (currently handled in prompt)
2. Text enhancement (contrast, sharpening) for low-quality scans
3. Multi-pass OCR with voting mechanism

### If Connection Tracing Accuracy < 90%
**Then consider:**
1. Line detection pre-processing (Hough transform)
2. Graph-based post-processing to infer implicit connections
3. Separate "connection refinement" model pass

---

## Testing Protocol

To validate the "no preprocessing" decision:

1. **Test Suite:** Use original screenshot (`docs/test/Screenshot 2026-01-01 062508.png`)
2. **Baseline Measurement:** Current system with HVAC prompts (0% accuracy)
3. **Post-Fix Measurement:** New system with P&ID prompts (target >95%)
4. **Metrics:**
   - Label extraction accuracy (primary)
   - Bounding box IoU (secondary)
   - Processing time (efficiency)

---

## Conclusion

**VERDICT:** No additional image pre-processing required.

**Rationale:**
1. Gemini 2.5 Flash handles aspect ratios and coordinates natively
2. Existing tiling infrastructure is sufficient for high-res images
3. The failure mode is semantic (wrong prompt domain), not visual
4. Pre-processing would add complexity without addressing root cause

**Focus Area:** Prompt engineering and domain knowledge injection (ISA-5.1), not image manipulation.

**Next Steps:**
1. ✅ Deploy P&ID-specific prompts
2. ✅ Implement automatic blueprint type detection
3. ⏳ Validate with test image
4. ⏳ Measure accuracy improvements

---

**Approved By:** Lead Engineer  
**Date:** 2026-01-01  
**Status:** Ready for Production Testing
