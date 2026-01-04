# Mock Data Directory

This directory contains static "Golden Record" data used for Mock Mode debugging.

## Purpose

Mock Mode allows frontend developers to:
- **Iterate rapidly** on UI/geometry calculations without consuming API quota
- **Achieve pixel-perfect calibration** using deterministic data
- **Debug visual alignment issues** without AI inference variance

## How It Works

When `MOCK_MODE_ENABLED=true` is set in `.env`, the backend server will:
1. Bypass the AI provider (Gemini/OpenAI/etc.)
2. Return static JSON data from `golden-record.json` instantly
3. Log "MOCK MODE ACTIVE" to the console for visibility

## File Structure

- **`golden-record.json`** - The canonical "perfect" inference result
  - Must conform to the `VisualAnalysisResult` schema
  - Should contain real data from a successful P&ID analysis
  - Used as the response for ALL vision API calls when mock mode is active

## Setup Instructions

### 1. Prepare Mock Data

Create `golden-record.json` with a valid `VisualAnalysisResult` structure:

```json
{
  "components": [
    {
      "id": "PDI-1401",
      "type": "pressure_indicator",
      "label": "PDI-1401",
      "bbox": [0.2, 0.3, 0.25, 0.35],
      "confidence": 0.95,
      "rotation": 0,
      "meta": {
        "tag": "PDI-1401",
        "description": "Pressure Differential Indicator"
      }
    }
  ],
  "connections": [],
  "metadata": {
    "total_components": 1,
    "total_connections": 0,
    "process_log": "Mock data for testing"
  }
}
```

**CRITICAL:** Bounding boxes must use normalized coordinates `[ymin, xmin, ymax, xmax]` in the range `[0, 1]`.

### 2. Enable Mock Mode

Add to your `.env` file:
```bash
MOCK_MODE_ENABLED=true

# Optional: Adjust simulated latency (default: 500ms)
# Set to 0 for instant responses, useful for rapid iteration
MOCK_MODE_DELAY_MS=500
```

### 3. Restart Server

```bash
npm run dev:api
```

You should see:
```
🚀 Server running at http://localhost:4000
🎭 Mock Mode: ENABLED (using server/mocks/golden-record.json)
   ⏱️  Simulated latency: 500ms
⚠️  WARNING: Mock mode is active. AI inference is bypassed.
```
```

### 4. Test

Upload any P&ID image to the frontend. The server will ignore the image and return `golden-record.json` immediately.

## Disable Mock Mode

To return to live AI inference:
1. Set `MOCK_MODE_ENABLED=false` in `.env` (or remove the variable)
2. Restart the server

## Safety

- Mock Mode is **disabled by default** (safety-first design)
- The frontend is **completely agnostic** to mock mode (no client-side changes needed)
- Mock data files are **committed to version control** so the team can share golden records

## Troubleshooting

### "Mock file not found" error
Ensure `golden-record.json` exists in `server/mocks/` directory.

### "Invalid mock data structure" error
Validate your JSON against the `VisualAnalysisResult` schema in `frontend/features/document-analysis/types.ts`.

### Mock mode not activating
Check console output on server startup. Verify `MOCK_MODE_ENABLED=true` is in your `.env` file.
