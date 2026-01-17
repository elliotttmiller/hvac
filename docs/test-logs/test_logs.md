PS D:\AMD\secrets\hvac\extra\hvac> & D:/AMD/secrets/hvac/extra/hvac/.venv/Scripts/Activate.ps1
(.venv) PS D:\AMD\secrets\hvac\extra\hvac> & D:/AMD/secrets/hvac/extra/hvac/.venv/Scripts/python.exe d:/AMD/secrets/hvac/extra/hvac/start.py
HVAC - start orchestration script
Found Ollama at localhost:11434
Ollama reports model 'qwen-gpu-optimized' as present.
Starting backend (FastAPI)...
Waiting for backend to be healthy... (timeout 60s)
[05:29:44] BACKEND:ERR | INFO:     Will watch for changes in these directories: ['D:\\AMD\\secrets\\hvac\\extra\\hvac']
[05:29:44] BACKEND:ERR | INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
[05:29:44] BACKEND:ERR | INFO:     Started reloader process [10460] using StatReload
[05:29:50] BACKEND:ERR | INFO:     Started server process [23560]
[05:29:50] BACKEND:ERR | INFO:     Waiting for application startup.
[05:29:50] BACKEND:ERR | INFO:     Application startup complete.
[05:29:52] BACKEND | INFO:     127.0.0.1:63956 - "GET /api/catalog HTTP/1.1" 200 OK
Backend healthy
Starting frontend (Vite)...
Waiting for frontend dev server... (timeout 60s)
[05:29:52] FRONTEND | 
[05:29:52] FRONTEND | > hvac-ai@1.0.0 dev
[05:29:52] FRONTEND | > vite --port 3000
[05:29:52] FRONTEND |
[05:29:53] FRONTEND | 
[05:29:53] FRONTEND |   VITE v6.4.1  ready in 498 ms
[05:29:53] FRONTEND |
[05:29:53] FRONTEND |   ➜  Local:   http://localhost:3000/
[05:29:53] FRONTEND |   ➜  Network: http://172.23.80.1:3000/
[05:29:53] FRONTEND |   ➜  Network: http://192.168.0.13:3000/
[05:29:53] FRONTEND |   ➜  press h + enter to show help
Frontend dev server ready
Frontend URL: http://localhost:3000/
All services started successfully.
All services started successfully. Press Ctrl-C to stop everything.
Open the frontend in your browser: http://localhost:3000/
[05:29:59] BACKEND | 2026-01-17 05:29:59,595 - httpx - [INFO] - HTTP Request: GET http://localhost:11434/v1/models "HTTP/1.1 200 OK"
[05:29:59] BACKEND | INFO:     127.0.0.1:64328 - "GET /api/model HTTP/1.1" 200 OK
[05:30:01] BACKEND | INFO:     127.0.0.1:64328 - "OPTIONS /api/analyze HTTP/1.1" 200 OK
[05:30:01] BACKEND | 2026-01-17 05:30:01,426 - backend.utils - [INFO] - [req-29d922be96bd] Starting: analyze_document
[05:30:01] BACKEND | 2026-01-17 05:30:01,427 - backend.utils - [INFO] - [req-29d922be96bd] Starting pipeline with qwen-gpu-optimized
[05:30:01] BACKEND | 2026-01-17 05:30:01,431 - backend.utils - [INFO] - [req-29d922be96bd] Starting: extract_page_1
[05:30:23] BACKEND | 2026-01-17 05:30:23,673 - httpx - [INFO] - HTTP Request: POST http://localhost:11434/v1/chat/completions "HTTP/1.1 200 OK"
[05:30:23] BACKEND | 2026-01-17 05:30:23,744 - backend.utils - [INFO] - [req-29d922be96bd] Completed: extract_page_1 in 22.31s
[05:30:23] BACKEND | 2026-01-17 05:30:23,746 - backend.utils - [INFO] - [req-29d922be96bd] Running engineering inference...
[05:30:23] BACKEND | 2026-01-17 05:30:23,747 - backend.utils - [INFO] - [req-29d922be96bd] Building deterministic report from extracted text (no LLM JSON generation)
[05:30:23] BACKEND | 2026-01-17 05:30:23,749 - backend.utils - [INFO] - Analysis output validation passed
[05:30:23] BACKEND | 2026-01-17 05:30:23,750 - backend.utils - [INFO] - [req-29d922be96bd] Report generated in 22.32s (deterministic)
[05:30:23] BACKEND | 2026-01-17 05:30:23,750 - backend.utils - [INFO] - [req-29d922be96bd] Completed: analyze_document in 22.32s
[05:30:23] BACKEND | INFO:     127.0.0.1:51579 - "POST /api/analyze HTTP/1.1" 200 OK