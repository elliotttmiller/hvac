PS D:\AMD\secrets\hvac\extra\hvac> & D:/AMD/secrets/hvac/extra/hvac/.venv/Scripts/Activate.ps1
(.venv) PS D:\AMD\secrets\hvac\extra\hvac> & D:/AMD/secrets/hvac/extra/hvac/.venv/Scripts/python.exe d:/AMD/secrets/hvac/extra/hvac/start.py
HVAC - start orchestration script
Found Ollama at localhost:11434
Ollama reports model 'qwen-gpu-optimized' as present.
Starting backend (FastAPI)...
Waiting for backend to be healthy... (timeout 60s)
[05:04:58] BACKEND:ERR | INFO:     Will watch for changes in these directories: ['D:\\AMD\\secrets\\hvac\\extra\\hvac']
[05:04:58] BACKEND:ERR | INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
[05:04:58] BACKEND:ERR | INFO:     Started reloader process [16636] using StatReload
[05:05:00] BACKEND:ERR | INFO:     Started server process [23676]
[05:05:00] BACKEND:ERR | INFO:     Waiting for application startup.
[05:05:00] BACKEND:ERR | INFO:     Application startup complete.
[05:05:02] BACKEND | INFO:     127.0.0.1:57844 - "GET /api/catalog HTTP/1.1" 200 OK
Backend healthy
Starting frontend (Vite)...
Waiting for frontend dev server... (timeout 60s)
[05:05:03] FRONTEND | 
[05:05:03] FRONTEND | > hvac-ai@1.0.0 dev
[05:05:03] FRONTEND | > vite --port 3000
[05:05:03] FRONTEND |
[05:05:03] FRONTEND | 
[05:05:03] FRONTEND |   VITE v6.4.1  ready in 441 ms
[05:05:03] FRONTEND |
[05:05:03] FRONTEND |   ➜  Local:   http://localhost:3000/
[05:05:03] FRONTEND |   ➜  Network: http://172.23.80.1:3000/
[05:05:03] FRONTEND |   ➜  Network: http://192.168.0.13:3000/
[05:05:03] FRONTEND |   ➜  press h + enter to show help
Frontend dev server ready
Frontend URL: http://localhost:3000/
All services started successfully.
All services started successfully. Press Ctrl-C to stop everything.
Open the frontend in your browser: http://localhost:3000/
[05:05:10] BACKEND | 2026-01-17 05:05:10,485 - httpx - [INFO] - HTTP Request: GET http://localhost:11434/v1/models "HTTP/1.1 200 OK"
[05:05:10] BACKEND | INFO:     127.0.0.1:50961 - "GET /api/model HTTP/1.1" 200 OK
[05:05:12] BACKEND | 2026-01-17 05:05:12,747 - backend.utils - [INFO] - [req-34afde815476] Starting: analyze_document
[05:05:12] BACKEND | 2026-01-17 05:05:12,747 - backend.utils - [INFO] - [req-34afde815476] Starting pipeline with qwen-gpu-optimized
[05:05:12] BACKEND | 2026-01-17 05:05:12,752 - backend.utils - [INFO] - [req-34afde815476] Starting: extract_page_1
[05:05:34] BACKEND | 2026-01-17 05:05:34,257 - httpx - [INFO] - HTTP Request: POST http://localhost:11434/v1/chat/completions "HTTP/1.1 200 OK"
[05:05:34] BACKEND | 2026-01-17 05:05:34,314 - backend.utils - [INFO] - [req-34afde815476] Completed: extract_page_1 in 21.56s
[05:05:34] BACKEND | 2026-01-17 05:05:34,316 - backend.utils - [INFO] - [req-34afde815476] Running engineering inference...
[05:05:34] BACKEND | 2026-01-17 05:05:34,316 - backend.utils - [INFO] - [req-34afde815476] Building deterministic report from extracted text (no LLM JSON generation)
[05:05:34] BACKEND | 2026-01-17 05:05:34,320 - backend.utils - [INFO] - Analysis output validation passed
[05:05:34] BACKEND | 2026-01-17 05:05:34,321 - backend.utils - [INFO] - [req-34afde815476] Report generated in 21.57s (deterministic)
[05:05:34] BACKEND | 2026-01-17 05:05:34,322 - backend.utils - [INFO] - [req-34afde815476] Completed: analyze_document in 21.57s
[05:05:34] BACKEND | INFO:     127.0.0.1:50961 - "POST /api/analyze HTTP/1.1" 200 OK