PowerShell 7.5.4
PS D:\AMD\secrets\hvac\extra\hvac> & D:/AMD/secrets/hvac/extra/hvac/.venv/Scripts/Activate.ps1
(.venv) PS D:\AMD\secrets\hvac\extra\hvac> & D:/AMD/secrets/hvac/extra/hvac/.venv/Scripts/python.exe d:/AMD/secrets/hvac/extra/hvac/start.py
HVAC - start orchestration script
Found Ollama at localhost:11434
Ollama reports model 'qwen-gpu-optimized' as present.
Starting backend (FastAPI)...
Waiting for backend to be healthy... (timeout 60s)
[06:19:19] BACKEND:ERR | INFO:     Will watch for changes in these directories: ['D:\\AMD\\secrets\\hvac\\extra\\hvac']
[06:19:19] BACKEND:ERR | INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
[06:19:19] BACKEND:ERR | INFO:     Started reloader process [23348] using StatReload
[06:19:22] BACKEND:ERR | INFO:     Started server process [7796]
[06:19:22] BACKEND:ERR | INFO:     Waiting for application startup.
[06:19:22] BACKEND:ERR | INFO:     Application startup complete.
[06:19:24] BACKEND | INFO:     127.0.0.1:55186 - "GET /api/catalog HTTP/1.1" 200 OK
Backend healthy
Starting frontend (Vite)...
Waiting for frontend dev server... (timeout 60s)
[06:19:25] FRONTEND | 
[06:19:25] FRONTEND | > hvac-ai@1.0.0 dev
[06:19:25] FRONTEND | > vite --port 3000
[06:19:25] FRONTEND |
[06:19:25] FRONTEND | 
[06:19:25] FRONTEND |   VITE v6.4.1  ready in 446 ms
[06:19:25] FRONTEND |
[06:19:25] FRONTEND |   ➜  Local:   http://localhost:3000/
[06:19:25] FRONTEND |   ➜  Network: http://172.23.80.1:3000/
[06:19:25] FRONTEND |   ➜  Network: http://192.168.0.13:3000/
[06:19:25] FRONTEND |   ➜  press h + enter to show help
Frontend dev server ready
Frontend URL: http://localhost:3000/
All services started successfully.
All services started successfully. Press Ctrl-C to stop everything.
Open the frontend in your browser: http://localhost:3000/
[06:19:34] BACKEND | 2026-01-17 06:19:34,001 - httpx - [INFO] - HTTP Request: GET http://localhost:11434/v1/models "HTTP/1.1 200 OK"
[06:19:34] BACKEND | INFO:     127.0.0.1:62507 - "GET /api/model HTTP/1.1" 200 OK
[06:19:39] BACKEND | INFO:     127.0.0.1:63433 - "OPTIONS /api/analyze HTTP/1.1" 200 OK
[06:19:39] BACKEND | 2026-01-17 06:19:39,412 - backend.utils - [INFO] - [req-ac83aa1dd699] Starting: analyze_document
[06:19:39] BACKEND | 2026-01-17 06:19:39,412 - backend.utils - [INFO] - [req-ac83aa1dd699] Starting pipeline with qwen-gpu-optimized
[06:19:39] BACKEND | 2026-01-17 06:19:39,416 - backend.utils - [INFO] - [req-ac83aa1dd699] Starting: extract_page_1
[06:20:03] BACKEND | 2026-01-17 06:20:03,995 - httpx - [INFO] - HTTP Request: POST http://localhost:11434/v1/chat/completions "HTTP/1.1 200 OK"
[06:20:04] BACKEND | 2026-01-17 06:20:04,088 - backend.utils - [INFO] - [req-ac83aa1dd699] Completed: extract_page_1 in 24.66s
[06:20:04] BACKEND | 2026-01-17 06:20:04,092 - backend.utils - [INFO] - [req-ac83aa1dd699] Running engineering inference...
[06:20:04] BACKEND | 2026-01-17 06:20:04,094 - backend.utils - [INFO] - [req-ac83aa1dd699] Building deterministic report from extracted text (no LLM JSON generation)
[06:20:04] BACKEND | 2026-01-17 06:20:04,098 - backend.utils - [INFO] - Analysis output validation passed
[06:20:04] BACKEND | 2026-01-17 06:20:04,100 - backend.utils - [INFO] - [req-ac83aa1dd699] Report generated in 24.69s (deterministic)
[06:20:04] BACKEND | 2026-01-17 06:20:04,104 - backend.utils - [INFO] - [req-ac83aa1dd699] Completed: analyze_document in 24.69s
[06:20:04] BACKEND | INFO:     127.0.0.1:63433 - "POST /api/analyze HTTP/1.1" 200 OK