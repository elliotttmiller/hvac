# 📸 Screenshot Instructions: Visual Drift Comparison

## File: `before_after_drift.png`

### What to Capture
A **side-by-side comparison** showing bounding box alignment before and after the drift fix.

### Test Scenario
1. Load one of the example images from `docs/example_images/`
2. Resize the browser window to different aspect ratios
3. Observe bounding box behavior

### Required Elements - BEFORE (Historical/Reference)
Since the current code already has drift fixes, use this as a reference of what "bad drift" looks like:
- Bounding boxes floating in whitespace when window resizes
- Misalignment between boxes and actual components
- Boxes not respecting image letterboxing/pillarboxing

### Required Elements - AFTER (Current Implementation)
Screenshot showing:
- **Multiple aspect ratios tested** (wide screen, narrow, square)
- Bounding boxes **perfectly aligned** with components at all sizes
- Boxes correctly positioned within the image area (not in letterbox bars)
- Example: Resize window from 1920x1080 → 800x600 → 1200x900

### Technical Validation
The current implementation in `CanvasOverlay.tsx` calculates:
```typescript
// Determines if letterboxed or pillarboxed
if (imageAspect > containerAspect) {
  // Pillarboxing (vertical bars)
  actualWidth = containerWidth;
  actualHeight = containerWidth / imageAspect;
  offsetX = 0;
  offsetY = (containerHeight - actualHeight) / 2;
} else {
  // Letterboxing (horizontal bars)
  actualHeight = containerHeight;
  actualWidth = containerHeight * imageAspect;
  offsetX = (containerWidth - actualWidth) / 2;
  offsetY = 0;
}
```

### How to Capture
1. Run `python start.py` locally
2. Upload an example image
3. Use browser DevTools to test different viewport sizes
4. Take screenshots at 3 different aspect ratios
5. Create a composite image showing all three side-by-side

### Layout Suggestion
```
┌─────────────────┬─────────────────┬─────────────────┐
│   Wide Screen   │     Square      │     Narrow      │
│   (16:9 ratio)  │   (1:1 ratio)   │   (9:16 ratio)  │
│                 │                 │                 │
│  ✓ Aligned      │  ✓ Aligned      │  ✓ Aligned      │
│  ✓ No Drift     │  ✓ No Drift     │  ✓ No Drift     │
└─────────────────┴─────────────────┴─────────────────┘
```

---

**Status:** 📋 Instructions Ready - Screenshot Pending
**Action Required:** Run local testing and capture multi-aspect-ratio comparison
