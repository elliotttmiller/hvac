# Mock Mode Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React)                          │
│  • BlueprintAnalyzer.tsx                                        │
│  • Sends: POST /api/ai/generateVision                           │
│  • Receives: { text: "{...json...}" }                           │
│  • Status: AGNOSTIC (doesn't know about mock mode)              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             │ (image + prompt)
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (server/index.cjs)                   │
│                                                                  │
│  POST /api/ai/generateVision                                    │
│  ┌────────────────────────────────────────────────────────┐    │
│  │  1. Check: MOCK_MODE_ENABLED?                          │    │
│  └────────────┬─────────────────────┬─────────────────────┘    │
│               │                     │                           │
│        YES ✓  │                     │  NO ✗                     │
│               ▼                     ▼                           │
│  ┌────────────────────┐   ┌─────────────────────────┐          │
│  │  MOCK MODE PATH    │   │  LIVE INFERENCE PATH    │          │
│  │  ===============   │   │  ===================    │          │
│  │                    │   │                         │          │
│  │  1. Log warning    │   │  1. Validate API key    │          │
│  │  2. Read file:     │   │  2. Call Gemini API     │          │
│  │     golden-record  │   │  3. Wait for response   │          │
│  │     .json          │   │  4. Parse result        │          │
│  │  3. Parse JSON     │   │                         │          │
│  │  4. Sleep(delay)   │   └─────────────────────────┘          │
│  │  5. Return mock    │                │                        │
│  │     data           │                │                        │
│  └────────────────────┘                │                        │
│               │                        │                        │
│               └────────────────────────┴────────────────────────│
│                             │                                   │
│                             ▼                                   │
│              res.json({ text: jsonString })                     │
│                                                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Response
                             │ { text: "{...json...}" }
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       FRONTEND (React)                          │
│  • Parses JSON response                                         │
│  • Renders components in sidebar                                │
│  • Draws bounding boxes on canvas                               │
│  • Status: IDENTICAL EXPERIENCE (mock vs live)                  │
└─────────────────────────────────────────────────────────────────┘
```

## Configuration Flow

```
.env file
├── MOCK_MODE_ENABLED=true          → Activates mock mode
├── MOCK_MODE_DELAY_MS=500          → Sets simulated latency
└── GEMINI_API_KEY=...              → Used only in live mode

                    ↓

server/index.cjs (on startup)
├── Reads environment variables
├── Logs mock mode status
└── Configures bypass logic

                    ↓

Runtime behavior
├── Mock enabled?  → Read server/mocks/golden-record.json
└── Mock disabled? → Call Google Gemini API
```

## Data Flow (Mock Mode)

```
1. Frontend uploads image:
   POST /api/ai/generateVision
   Body: { imageData: "base64...", prompt: "Analyze", ... }

2. Server intercepts:
   ✓ MOCK_MODE_ENABLED = true
   ✓ Ignores imageData payload
   ✓ Reads server/mocks/golden-record.json

3. Server simulates latency:
   await sleep(MOCK_MODE_DELAY_MS)

4. Server returns:
   { text: '{"components":[...],"connections":[...],"metadata":{...}}' }

5. Frontend receives:
   Same format as live AI response
   Parses and renders normally
```

## Error Handling Flow

```
Mock Mode Enabled + File Missing
    ↓
Server attempts: fs.readFile(MOCK_DATA_PATH)
    ↓
Error: ENOENT (file not found)
    ↓
Catch block executes
    ↓
Return: 500 Internal Server Error
Response: {
  error: "Mock mode enabled but mock data file is missing",
  details: "ENOENT: no such file or directory...",
  path: "/path/to/golden-record.json"
}
    ↓
Frontend displays error message
    ↓
Developer fixes by creating golden-record.json
```

## Toggle Flow

```
To Enable Mock Mode:
1. Edit .env → Add MOCK_MODE_ENABLED=true
2. Restart server → npm run dev:api
3. Check console → Should see "🎭 Mock Mode: ENABLED"
4. Upload any image → Returns mock data

To Disable Mock Mode:
1. Edit .env → Set MOCK_MODE_ENABLED=false (or remove line)
2. Restart server → npm run dev:api
3. Check console → Should see "🎭 Mock Mode: DISABLED"
4. Upload image → Calls live AI API
```

## Performance Comparison

```
Live Mode (Gemini API):
├── Network latency: 200-500ms
├── AI inference time: 2-5 seconds
├── Total: ~3-6 seconds
└── Cost: $0.001-0.01 per request

Mock Mode (instant):
├── File read: <1ms
├── JSON parse: <1ms
├── Simulated delay: 0-500ms (configurable)
├── Total: ~0-500ms
└── Cost: $0 (zero)

Speed improvement: 6-∞x faster
Cost reduction: 100%
```

## Security Model

```
Default State:
└── MOCK_MODE_ENABLED is NOT set
    └── Falls back to false
        └── Uses live AI inference
            └── ✓ Production safe

Explicit Opt-In:
└── Developer sets MOCK_MODE_ENABLED=true
    └── Server logs warning on startup
        └── Server logs warning on each request
            └── ✓ Accidental production use is visible

File System:
└── mock files committed to git
    └── No secrets in golden-record.json
        └── Only analysis results (bounding boxes, labels)
            └── ✓ Safe to share and version control
```
