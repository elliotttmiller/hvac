# Mock Mode Usage Guide

## Quick Start

### 1. Enable Mock Mode

Add to your `.env` file:
```bash
MOCK_MODE_ENABLED=true
```

### 2. Prepare Your Golden Record

Replace `server/mocks/golden-record.json` with real P&ID analysis data:

```json
{
  "components": [
    {
      "id": "TE-1408",
      "type": "temperature_element",
      "label": "TE-1408",
      "bbox": [0.234, 0.456, 0.289, 0.512],
      "confidence": 0.95,
      "rotation": 0,
      "meta": {
        "tag": "TE-1408",
        "description": "Temperature Element",
        "reasoning": "ISA-5.1: T=Temperature, E=Element"
      }
    },
    {
      "id": "FIC-1405",
      "type": "flow_controller",
      "label": "FIC-1405",
      "bbox": [0.567, 0.123, 0.622, 0.178],
      "confidence": 0.93,
      "rotation": 0,
      "meta": {
        "tag": "FIC-1405",
        "description": "Flow Indicating Controller"
      }
    }
  ],
  "connections": [
    {
      "id": "conn-001",
      "from_id": "TE-1408",
      "to_id": "FIC-1405",
      "type": "signal",
      "confidence": 0.85
    }
  ],
  "metadata": {
    "total_components": 2,
    "total_connections": 1,
    "process_log": "P&ID Analysis: Steam Header System with temperature monitoring and flow control"
  }
}
```

### 3. Start Server

```bash
npm run dev:api
```

You should see:
```
🎭 Mock Mode: ENABLED (using /path/to/server/mocks/golden-record.json)
⚠️  WARNING: Mock mode is active. AI inference is bypassed.
```

### 4. Upload Any Image

Upload any P&ID image through the frontend. The server will:
- Ignore the image payload
- Return `golden-record.json` instantly (with 500ms simulated latency)
- Log: `⚠️  MOCK MODE ACTIVE: Bypassing AI provider, returning static golden-record.json`

## Use Cases

### Frontend Geometry Calibration
Use mock mode to iterate on bounding box alignment:
1. Set `golden-record.json` with known-good coordinates
2. Upload the corresponding P&ID image
3. Tweak CSS/geometry math in `InteractiveViewer`
4. Refresh page instantly (no AI inference delay)
5. Verify alignment

### Cost-Free Development
Develop UI features without consuming API quota:
- Sidebar rendering logic
- Component selection
- Search/filter functionality
- Export features

### Reproducible Testing
Ensure consistent results across test runs:
- Mock data never changes
- No AI variance
- Perfect for automated UI tests

## Switching Between Modes

### Enable Mock Mode
```bash
# .env
MOCK_MODE_ENABLED=true
```
Restart server: `npm run dev:api`

### Disable Mock Mode (Live Inference)
```bash
# .env
MOCK_MODE_ENABLED=false
# OR remove the line entirely
```
Restart server: `npm run dev:api`

## Coordinate Format

**CRITICAL:** Bounding boxes must use Gemini's native format:

```
[ymin, xmin, ymax, xmax]
```

All values are **normalized** (0.0 to 1.0):
- `ymin`: Top edge (% from top)
- `xmin`: Left edge (% from left)
- `ymax`: Bottom edge (% from top)
- `xmax`: Right edge (% from left)

### Example
```json
"bbox": [0.2, 0.3, 0.4, 0.5]
```
Means:
- Top: 20% from top
- Left: 30% from left
- Bottom: 40% from top
- Right: 50% from left

## How to Generate Golden Records

### Method 1: Capture Real Inference
1. Disable mock mode
2. Upload your target P&ID
3. Wait for analysis to complete
4. Copy the JSON response from browser DevTools (Network tab)
5. Save to `server/mocks/golden-record.json`

### Method 2: Manual Creation
Use the placeholder template in `golden-record.json` and manually add components based on the P&ID image.

## Troubleshooting

### Issue: "Mock file not found"
**Solution:** Ensure `server/mocks/golden-record.json` exists.

### Issue: Mock mode not activating
**Check:**
1. `MOCK_MODE_ENABLED=true` is in `.env` (not `.env.example`)
2. Server was restarted after adding the variable
3. Console shows: `🎭 Mock Mode: ENABLED`

### Issue: JSON parse error
**Solution:** Validate your JSON:
```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('server/mocks/golden-record.json')))"
```

### Issue: Frontend shows errors
**Check:** Ensure your mock data matches the `VisualAnalysisResult` schema in:
`frontend/features/document-analysis/types.ts`

## Security Note

Mock mode is **disabled by default**. It only activates when explicitly enabled in the environment configuration. This prevents accidental use in production environments.

## Best Practices

1. **Version Control:** Commit golden records to share with team
2. **Documentation:** Document which P&ID image corresponds to which golden record
3. **Validation:** Test live mode before deploying to ensure real inference still works
4. **Coordinate Precision:** Use at least 3 decimal places for bbox coordinates

## Example Workflow

```bash
# Day 1: Capture golden record from successful run
MOCK_MODE_ENABLED=false npm run dev:api
# Upload P&ID, copy JSON from DevTools
# Save to server/mocks/golden-record.json

# Day 2-5: Frontend development
MOCK_MODE_ENABLED=true npm run dev:api
# Iterate on UI without API costs

# Day 6: Final validation
MOCK_MODE_ENABLED=false npm run dev:api
# Test with live AI to ensure nothing broke
```
