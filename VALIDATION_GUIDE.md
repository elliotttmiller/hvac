# P&ID Platform - Validation & Testing Guide

## Quick Validation Checklist

Use this checklist to verify all fixes are working correctly:

### ✅ Visual Alignment (Problem A)
- [ ] Upload reference image from `resources/reference_files/image.png`
- [ ] Click "Run" to analyze
- [ ] Verify bounding boxes align perfectly with instrument symbols
- [ ] No visible offset or drift
- [ ] Test zoom controls - alignment stays perfect at all zoom levels
- [ ] Resize browser window - alignment remains correct

### ✅ Hover Card Data (Problem C.1)
- [ ] Hover over any component (e.g., PT-302318, SOV-301202)
- [ ] Verify hover card displays:
  - ✓ Component label (e.g., "PT-302318")
  - ✓ Full description (e.g., "Pressure Transmitter")
  - ✓ Component type (e.g., "sensor_pressure")
  - ✓ Confidence score (e.g., "95.0%")
- [ ] Test with 3+ different component types

### ✅ Canvas → Inspector Sync (Problem C.2)
- [ ] Hover over a component on the canvas
- [ ] Corresponding row in Inspector Panel should highlight instantly
- [ ] Move cursor away - highlight disappears
- [ ] Repeat with 3+ different components

### ✅ Inspector → Canvas Sync (Problem C.3)
- [ ] Hover over a row in the Inspector Panel
- [ ] Corresponding bounding box on canvas should highlight
- [ ] Move cursor away - highlight disappears
- [ ] Selected row auto-scrolls into view if off-screen

### ✅ Selection Persistence
- [ ] Click on a component on the canvas
- [ ] Component gets cyan ring highlight
- [ ] Inspector Panel row stays highlighted
- [ ] Click on different row in Inspector
- [ ] Canvas updates to show new selection

## Detailed Testing Scenarios

### Scenario 1: First-Time User Experience

**Steps:**
1. Start the application: `npm run dev`
2. Navigate to http://localhost:3000
3. Switch to "Blueprint Analyzer" view
4. Click "Browse Files" and select `resources/reference_files/image.png`
5. Wait for image to load
6. Click "Run" button in top-left toolbar
7. Wait for analysis to complete (14 components detected)

**Expected Results:**
- Cyan bounding boxes appear over all instrument symbols
- Boxes align perfectly - no offset or drift
- Inspector Panel shows list of 14 components
- Each component has label and description

### Scenario 2: Hover Card Information

**Steps:**
1. Continue from Scenario 1
2. Hover over the pressure transmitter labeled "PT-302318"
3. Observe the hover card that appears

**Expected Results:**
```
┌─────────────────────────────┐
│ PT-302318                   │ (bold, uppercase)
│ Pressure Transmitter        │ (cyan, medium weight)
│ sensor_pressure             │ (gray, lowercase)
│ Confidence: 95.0%           │ (green, monospace)
└─────────────────────────────┘
```

**Repeat for:**
- SOV-301202 (Solenoid Valve)
- FCV-302317 (Flow Control Valve)
- TT-302319 (Temperature Transmitter)

### Scenario 3: Bidirectional Highlighting - Canvas to Inspector

**Steps:**
1. Locate component "SOV-301202" on the canvas (top-left area)
2. Hover over the bounding box (don't click)
3. Look at the Inspector Panel on the right

**Expected Results:**
- The row "SOV-301202 / Solenoid Valve" highlights with cyan background
- A cyan dot appears on the right side of the row
- The icon changes from gray to cyan
- Highlight disappears when cursor moves away

### Scenario 4: Bidirectional Highlighting - Inspector to Canvas

**Steps:**
1. In the Inspector Panel, hover over "PT-302318" row
2. Look at the canvas

**Expected Results:**
- The bounding box on canvas highlights
- Border opacity increases to 100%
- Background opacity increases
- Returns to normal when cursor moves away

### Scenario 5: Selection and Auto-Scroll

**Steps:**
1. Scroll the Inspector Panel to the top
2. Click on component "TT-302323" on the canvas (near bottom)
3. Observe the Inspector Panel

**Expected Results:**
- Inspector Panel automatically scrolls to show "TT-302323" row
- Row stays highlighted with cyan background
- Component on canvas has cyan ring around the bounding box
- Selection persists even when hovering other components

### Scenario 6: Coordinate Precision Test

**Steps:**
1. Use browser zoom (Ctrl + / Ctrl -)
2. Test at 50%, 75%, 100%, 125%, 150%, 200%
3. At each zoom level, verify alignment

**Expected Results:**
- Bounding boxes stay perfectly aligned at all zoom levels
- No drift or offset appears
- Boxes scale proportionally with image

### Scenario 7: Responsive Design Test

**Steps:**
1. Resize browser window to different widths:
   - 1920px (desktop)
   - 1440px (laptop)
   - 1024px (tablet)
   - 768px (small tablet)
2. At each size, verify alignment

**Expected Results:**
- Bounding boxes maintain perfect alignment
- No coordinate drift as window resizes
- Interface remains functional at all sizes

## Regression Testing

Verify these existing features still work:

### ✅ Layer Toggles
- [ ] "Detect" button toggles component bounding boxes
- [ ] "Text" button toggles text region boxes (if available)
- [ ] Multiple layers can be active simultaneously

### ✅ Analysis Pipeline
- [ ] Document classification works correctly
- [ ] Analysis progress is logged in Inspector Panel
- [ ] Process log can be copied with Copy button
- [ ] Component count displays correctly at bottom

### ✅ Search/Filter
- [ ] Search box filters components by label
- [ ] Search filters by description
- [ ] Filtered results update in real-time
- [ ] Empty search shows all components

## Performance Testing

### Response Time Requirements
- Hover activation: < 50ms
- Highlight sync: < 100ms
- Auto-scroll animation: smooth, < 300ms
- Initial render: < 500ms after analysis

### Load Testing
- Test with 50+ components: performance should remain smooth
- Rapid hover movements should not cause lag
- Selection changes should be instant

## Browser Compatibility

Test in the following browsers:

- [ ] Chrome/Edge (Chromium) v120+
- [ ] Firefox v120+
- [ ] Safari v17+

Expected: Identical behavior across all browsers.

## Known Limitations

1. **Mobile Touch**: Hover effects require mouse - consider tap/press for mobile
2. **Keyboard Navigation**: Not yet implemented - future enhancement
3. **Multi-Select**: Not supported - future enhancement

## Troubleshooting

### Issue: Bounding boxes still misaligned
**Check:**
- Image fully loaded? (check naturalWidth > 0)
- Browser zoom at 100%?
- Container has valid dimensions?
- Console errors?

### Issue: Hover card not showing description
**Check:**
- Backend returned `meta.description` field?
- Component was analyzed (not manually added)?
- Console logs show full component data?

### Issue: Highlighting not syncing
**Check:**
- Both components visible on screen?
- `onSelectBox` prop passed correctly?
- No JavaScript errors in console?

## Success Criteria

All fixes are considered validated when:

1. ✅ Bounding boxes align pixel-perfectly with symbols at any zoom/window size
2. ✅ Hover cards display all metadata (label, description, type, confidence)
3. ✅ Hovering canvas component highlights Inspector Panel row
4. ✅ Hovering Inspector Panel row highlights canvas component
5. ✅ Selected component auto-scrolls into view
6. ✅ Selection persists until changed
7. ✅ No performance degradation
8. ✅ No console errors
9. ✅ Builds successfully without TypeScript errors
10. ✅ All existing features still work

## Reporting Issues

If any test fails, include:

1. **Step-by-step reproduction**
2. **Expected vs actual behavior**
3. **Screenshot or screen recording**
4. **Browser and OS version**
5. **Console errors (if any)**
6. **Network tab (for API issues)**

## Automated Testing

While manual testing is sufficient for validation, consider adding:

```bash
# TypeScript type checking
npm run build

# Check for common issues
npm run lint  # (if configured)

# Visual regression tests
# (Future: screenshot comparison)
```

## Sign-Off

When all tests pass:

- [ ] Validated by: ________________
- [ ] Date: ________________
- [ ] Browser tested: ________________
- [ ] All scenarios passed: Yes / No
- [ ] Ready for production: Yes / No

---

**Questions?** See `IMPLEMENTATION_SUMMARY.md` for technical details.
