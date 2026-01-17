why is our ai inferences analysis report/output so simple and not comprehensive/intelligent?

PS D:\AMD\secrets\hvac\extra\hvac> & D:/AMD/secrets/hvac/extra/hvac/.venv/Scripts/Activate.ps1
(.venv) PS D:\AMD\secrets\hvac\extra\hvac> & D:/AMD/secrets/hvac/extra/hvac/.venv/Scripts/python.exe d:/AMD/secrets/hvac/extra/hvac/start.py
HVAC - start orchestration script
Found Ollama at localhost:11434
Ollama reports model 'qwen-gpu-optimized' as present.
Starting backend (FastAPI)...
Waiting for backend to be healthy... (timeout 60s)
[05:56:31] BACKEND:ERR | INFO: Will watch for changes in these directories: ['D:\AMD\secrets\hvac\extra\hvac']
[05:56:31] BACKEND:ERR | INFO: Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
[05:56:31] BACKEND:ERR | INFO: Started reloader process [21916] using StatReload
[05:56:39] BACKEND:ERR | INFO: Started server process [19932]
[05:56:39] BACKEND:ERR | INFO: Waiting for application startup.
[05:56:39] BACKEND:ERR | INFO: Application startup complete.
[05:56:42] BACKEND | INFO: 127.0.0.1:62161 - "GET /api/catalog HTTP/1.1" 200 OK
Backend healthy
Starting frontend (Vite)...
Waiting for frontend dev server... (timeout 60s)
[05:56:42] FRONTEND |
[05:56:42] FRONTEND | > hvac-ai@1.0.0 dev
[05:56:42] FRONTEND | > vite --port 3000
[05:56:42] FRONTEND |
[05:56:43] FRONTEND |
[05:56:43] FRONTEND | VITE v6.4.1 ready in 518 ms
[05:56:43] FRONTEND |
[05:56:43] FRONTEND | ➜ Local: http://localhost:3000/
[05:56:43] FRONTEND | ➜ Network: http://172.23.80.1:3000/
[05:56:43] FRONTEND | ➜ Network: http://192.168.0.13:3000/
[05:56:43] FRONTEND | ➜ press h + enter to show help
Frontend dev server ready
Frontend URL: http://localhost:3000/
All services started successfully.
All services started successfully. Press Ctrl-C to stop everything.
Open the frontend in your browser: http://localhost:3000/
[05:56:49] BACKEND | 2026-01-17 05:56:49,940 - httpx - [INFO] - HTTP Request: GET http://localhost:11434/v1/models "HTTP/1.1 200 OK"
[05:56:49] BACKEND | INFO: 127.0.0.1:59482 - "GET /api/model HTTP/1.1" 200 OK
[05:56:52] BACKEND | INFO: 127.0.0.1:59482 - "OPTIONS /api/analyze HTTP/1.1" 200 OK
[05:56:52] BACKEND | 2026-01-17 05:56:52,172 - backend.utils - [INFO] - [req-51a65ce0f081] Starting: analyze_document
[05:56:52] BACKEND | 2026-01-17 05:56:52,172 - backend.utils - [INFO] - [req-51a65ce0f081] Starting pipeline with qwen-gpu-optimized
[05:56:52] BACKEND | 2026-01-17 05:56:52,177 - backend.utils - [INFO] - [req-51a65ce0f081] Starting: extract_page_1
[05:57:26] BACKEND | 2026-01-17 05:57:26,595 - httpx - [INFO] - HTTP Request: POST http://localhost:11434/v1/chat/completions "HTTP/1.1 200 OK"
[05:57:26] BACKEND | 2026-01-17 05:57:26,678 - backend.utils - [INFO] - [req-51a65ce0f081] Completed: extract_page_1 in 34.50s
[05:57:26] BACKEND | 2026-01-17 05:57:26,680 - backend.utils - [INFO] - [req-51a65ce0f081] Running engineering inference...
[05:57:26] BACKEND | 2026-01-17 05:57:26,680 - backend.utils - [INFO] - [req-51a65ce0f081] Building deterministic report from extracted text (no LLM JSON generation)
[05:57:26] BACKEND | 2026-01-17 05:57:26,682 - backend.utils - [INFO] - Analysis output validation passed
[05:57:26] BACKEND | 2026-01-17 05:57:26,683 - backend.utils - [INFO] - [req-51a65ce0f081] Report generated in 34.51s (deterministic)
[05:57:26] BACKEND | 2026-01-17 05:57:26,683 - backend.utils - [INFO] - [req-51a65ce0f081] Completed: analyze_document in 34.51s
[05:57:26] BACKEND | INFO: 127.0.0.1:51132 - "POST /api/analyze HTTP/1.1" 200 OK