ENV setup and CI wiring for the `app` frontend

Overview
- This project uses Vite. Secrets should not be embedded into client bundles where they can be inspected by end users.
- For local development create a `.env.local` file (it is ignored by .gitignore) from `.env.example` and populate secrets.

Recommended secrets & usage
1. GEMINI_API_KEY (server-only)
   - Purpose: API key for `@google/genai`.
   - Where to set: CI / server environment variables (example: GitHub Actions secrets). Do NOT expose this in frontend bundles.
   - Usage: Server code can read `process.env.GEMINI_API_KEY`.

2. VITE_GEMINI_API_KEY (client, optional)
   - Purpose: If you *must* call GenAI directly from the browser, Vite will only expose variables that start with `VITE_` to client code.
   - Caveat: Exposing this to the client is insecure. Prefer a server proxy.

Local development
- Copy `.env.example` -> `.env.local` and fill in values.
- `.env.local` is ignored by git and safe to use for local secrets.

Example `.env.local`
```
GEMINI_API_KEY=sk_live_XXXXXXXXXXXXXXXXXXXX
VITE_GEMINI_API_KEY=
VITE_AI_MODEL=gemini-3-flash-preview
VITE_AI_REQUEST_TIMEOUT_MS=180000
VITE_FEATURE_CACHE=true
PORT=3000
NODE_ENV=development
```

CI / Production (GitHub Actions example)
- Add a repository secret named `GEMINI_API_KEY` in GitHub repo Settings → Secrets.
- In your CI workflow, make sure you *do not* write that secret into a public client environment file. Instead:
  - Option A (recommended): Build and deploy a server that holds the secret and makes GenAI calls for the client.
  - Option B (less secure): If you must embed it in client builds (not recommended), pass it as `VITE_GEMINI_API_KEY` at build time. Example (dangerous):

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install
        run: npm ci
      - name: Build (inject VITE key - WARNING: this embeds secret into bundle)
        env:
          VITE_GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
        run: npm run build
      - name: Deploy
        run: echo "deploy steps"
```

Best practice recommendation
- Move GenAI interactions to a small server-side API that holds `GEMINI_API_KEY` securely. The frontend calls your server endpoints which proxy to GenAI.
- If you need to keep client-only calls, restrict the key's permissions and rotate keys regularly.

Notes about current repo
- `vite.config.ts` currently maps `env.GEMINI_API_KEY` into `process.env.API_KEY` (via `define`). That will inject the secret at build time into the client bundle if you build with GEMINI_API_KEY set. Be cautious and prefer server-side usage.
 - `vite.config.ts` should NOT map raw `env` secrets into `process.env` (via `define`) because that injects the secret at build time into the client bundle. I removed that mapping and the project now prefers `AI_API_KEY` server-side and `VITE_*` vars for any client-visible settings.
- `app/services/aiService.ts` now lazy-imports `@google/genai` but still reads `process.env.API_KEY`. Keep API key server-side or switch the client to call a server proxy.

If you'd like, I can:
- Add a small server proxy endpoint and example implementation to keep the key off the client.
- Update `vite.config.ts` to only read `VITE_` prefixed values or stop injecting secrets via `define`.
