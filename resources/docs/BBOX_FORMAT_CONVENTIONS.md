# Bounding Box Format Conventions

## Overview

This document defines the standard bounding box (bbox) coordinate format used throughout the HVAC AI Platform.

## Canonical Format

**All bounding boxes in the system use the canonical format:**

```
[xmin, ymin, xmax, ymax]
```

- **Values**: Normalized floating-point numbers in the range `[0.0, 1.0]`
- **Coordinate System**: Top-left origin (0,0), bottom-right (1,1)
- **xmin**: Left edge of the bbox (normalized by image width)
- **ymin**: Top edge of the bbox (normalized by image height)
- **xmax**: Right edge of the bbox (normalized by image width)
- **ymax**: Bottom edge of the bbox (normalized by image height)

### Example

For an object in a 2048×1084 image located at pixel coordinates `(975, 70)` to `(1153, 120)`:

```javascript
// Pixel coordinates
const pixel_bbox = [975, 70, 1153, 120];

// Canonical normalized coordinates
const canonical_bbox = [
  975 / 2048,   // xmin = 0.476
  70 / 1084,    // ymin = 0.065
  1153 / 2048,  // xmax = 0.563
  120 / 1084    // ymax = 0.111
];
// Result: [0.476, 0.065, 0.563, 0.111]
```

## Where the Canonical Format is Used

1. **Mock Data** (`server/mocks/golden-record.json`)
2. **Frontend InteractiveViewer** (rendering overlays)
3. **Detection Results** (from visual pipeline)
4. **Stored Annotations** (in project data)
5. **API Responses** (from document analysis)

## Alternative Formats

### Gemini API Format

Some AI providers (e.g., Google Gemini) return bounding boxes in a different format:

```
[ymin, xmin, ymax, xmax]
```

**Important**: When receiving data from external APIs that use this format, use the `convertCoordinateFormat` utility or specify the `order` parameter:

```typescript
import { normalizeBackendBBox, convertCoordinateFormat } from '@/lib/geometry';

// Method 1: Using order parameter
const gemini_bbox = [0.065, 0.476, 0.111, 0.563];
const canonical = normalizeBackendBBox(gemini_bbox, { 
  order: 'ymin_xmin_ymax_xmax' 
});
// Result: [0.476, 0.065, 0.563, 0.111]

// Method 2: Using explicit conversion
const canonical2 = convertCoordinateFormat(
  gemini_bbox,
  'gemini',      // from format
  'canonical'    // to format
);
```

## Important Notes

### ⚠️ No Automatic Format Detection

Previous versions of this code attempted to automatically detect the coordinate format using heuristics. **This has been removed** because it caused false positives, especially for wide images where x-coordinates are naturally larger than y-coordinates.

**Always default to canonical format** unless you explicitly know the data is in a different format.

## Testing

Run the geometry validation script to verify bbox normalization:

```bash
node scripts/validate-geometry.js
```

## Common Pitfalls

### ❌ Wrong: Assuming Format Based on Values

```typescript
// INCORRECT - Do not assume format based on coordinate values
if (bbox[0] > bbox[1]) {
  // "Must be ymin_xmin format"
  // NO! Wide images naturally have x > y
}
```

### ✅ Correct: Explicit Format Specification

```typescript
// CORRECT - Know your data source and specify explicitly
const bboxFromGemini = normalizeBackendBBox(bbox, { 
  order: 'ymin_xmin_ymax_xmax' 
});

const bboxFromMock = normalizeBackendBBox(bbox);
// Defaults to canonical format
```

## Related Files

- `frontend/lib/geometry.ts` - Core geometry utilities
- `frontend/lib/__tests__/geometry.test.ts` - Test suite
- `server/mocks/golden-record.json` - Mock data example
- `scripts/validate-geometry.js` - Validation script
