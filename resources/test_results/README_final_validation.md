# 📸 Screenshot Instructions: Final Validation Images

## Files Required
1. `final_validation_image_1.png`
2. `final_validation_image_2.png`
3. `final_validation_image_3.png`

### What to Capture
**Complete validation** of the platform using all 3 example images from `docs/example_images/`.

### Example Images Available
```bash
docs/example_images/
├── 41_2844_01_02_png.rf.c6cf156d0db22b7c6766d2cf235a891e.jpg
├── 41_2852_03_02_png.rf.86c931d98f6019e57e3fb45677037ea3.jpg
└── 41_2853_01_02_png.rf.b1fe72ae7100b8cee6634bc85023e25a.jpg
```

### Required Elements (Per Screenshot)
Each screenshot must demonstrate:

#### 1. Visual Alignment ✓
- Bounding boxes perfectly aligned with components
- No drift or floating boxes in whitespace
- Correct letterboxing/pillarboxing offset handling

#### 2. Label Accuracy ✓
- All visible text correctly extracted as labels
- NO "Unknown" labels for readable components
- Proper OCR handling of rotated text (0°, 90°, 180°, 270°)

#### 3. System Integrity ✓
- Components detected with high confidence (>0.7)
- Connections traced correctly between components
- Metadata properly populated

### Screenshot Composition
For each of the 3 images, capture a **full application view** showing:

```
┌─────────────────────────────────────────────────┐
│  HVAC AI Platform                    [X] [ ] [-]│
├─────────────────────────────────────────────────┤
│                                                  │
│  ┌────────────────────────────────────────┐     │
│  │                                        │     │
│  │    [Uploaded Image with Overlays]     │     │
│  │                                        │     │
│  │    ✓ Bounding boxes aligned           │     │
│  │    ✓ Labels showing extracted text    │     │
│  │                                        │     │
│  └────────────────────────────────────────┘     │
│                                                  │
│  Components Detected:                           │
│  ├─ PDI-1401 (conf: 0.92)  ✓ Labeled           │
│  ├─ VAV-105  (conf: 0.88)  ✓ Labeled           │
│  ├─ TT-1402  (conf: 0.91)  ✓ Labeled           │
│  └─ FCV-203  (conf: 0.85)  ✓ Labeled           │
│                                                  │
│  Connections: 12 traced                         │
│  Processing Time: 3.2s                          │
└─────────────────────────────────────────────────┘
```

### Validation Checklist (Per Image)
Test and verify:
- [ ] Image loads correctly
- [ ] Analysis completes without errors
- [ ] All components have bounding boxes
- [ ] All bounding boxes are pixel-aligned
- [ ] No "Unknown" labels for visible text
- [ ] Component sidebar shows proper labels
- [ ] Confidence scores are reasonable (>0.7)
- [ ] Connections are traced (if applicable)
- [ ] Window resize maintains alignment (test at least 2 sizes)

### How to Capture

#### For Image 1: `41_2844_01_02_png.rf.c6cf156d0db22b7c6766d2cf235a891e.jpg`
```bash
# 1. Start the application
python start.py

# 2. Access http://localhost:3000
# 3. Upload: docs/example_images/41_2844_01_02_png.rf.c6cf156d0db22b7c6766d2cf235a891e.jpg
# 4. Wait for analysis
# 5. Take screenshot showing:
#    - Image with overlays
#    - Component list with labels
#    - Full UI view
# 6. Save as: docs/test_results/final_validation_image_1.png
```

#### For Image 2: `41_2852_03_02_png.rf.86c931d98f6019e57e3fb45677037ea3.jpg`
Repeat above process, save as `final_validation_image_2.png`

#### For Image 3: `41_2853_01_02_png.rf.b1fe72ae7100b8cee6634bc85023e25a.jpg`
Repeat above process, save as `final_validation_image_3.png`

### Success Criteria
All 3 validation screenshots must show:
- ✅ **Zero visual drift** at any aspect ratio
- ✅ **Zero "Unknown" labels** for readable text
- ✅ **High confidence scores** (>0.7 average)
- ✅ **Complete component coverage** (all visible components detected)

### Failure Indicators (Fix if Found)
- ❌ Bounding boxes floating in whitespace → Check CanvasOverlay.tsx calculations
- ❌ "Unknown" labels for visible text → Check detect.ts prompts and visual.ts validation
- ❌ Missing components → Check AI API response and tiling logic
- ❌ Low confidence scores (<0.5) → Check AI model quality and prompts

---

**Status:** 📋 Instructions Ready - Screenshots Pending
**Action Required:** 
1. Run `python start.py`
2. Test all 3 example images sequentially
3. Capture full-application screenshots for each
4. Verify all validation criteria met
