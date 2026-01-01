<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HVAC AI Platform - Architecture 2.0

**Production-grade AI platform with universal provider support** featuring document analysis, component detection, and intelligent transcription for HVAC engineering.

## 🎯 Features

- **Universal Document Analysis**: Automatically classifies and processes blueprints, spec sheets, and schedules
- **Multi-Provider AI Support**: Works with Gemini, OpenAI, Anthropic, or custom AI endpoints
- **Component Detection**: AI-powered detection of HVAC components (ducts, VAVs, AHUs, dampers, diffusers)
- **Connectivity Tracing**: Intelligent tracing of supply/return air paths and control signals
- **Smart OCR**: Multi-angle text recognition with rotation correction
- **Semantic Caching**: Fast response times with intelligent caching
- **Real-time Visualization**: Interactive canvas with bounding box overlays
- **Fully Configurable**: All settings managed via environment variables

## 🏗️ Architecture

This project uses a clean, feature-first architecture:

```
hvac/
├── app/              # Configuration & providers (env-based)
├── lib/              # Infrastructure (AI client, caching, file processing)
├── features/         # Feature modules (document-analysis, compliance, etc.)
└── ui/               # Design system components
```

## 🚀 Quick Start

**Prerequisites:**  Node.js 18+

1. **Clone and install:**
   ```bash
   git clone <repo-url>
   cd hvac
   npm install
   ```

2. **Configure AI provider:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and configure your AI provider
   ```

3. **Run the app:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   npm run preview
   ```

## 🔑 AI Provider Configuration

The platform supports multiple AI providers. Configure via `.env.local`:

### Option 1: Gemini (Default)
```bash
VITE_AI_PROVIDER=gemini
VITE_AI_API_KEY=your_gemini_key_here
VITE_AI_MODEL=gemini-2.5-flash
```
Get your API key: https://makersuite.google.com/app/apikey

### Option 2: OpenAI (Coming Soon)
```bash
VITE_AI_PROVIDER=openai
VITE_AI_API_KEY=your_openai_key_here
VITE_AI_MODEL=gpt-4o
```
Get your API key: https://platform.openai.com/api-keys

### Option 3: Anthropic (Coming Soon)
```bash
VITE_AI_PROVIDER=anthropic
VITE_AI_API_KEY=your_anthropic_key_here
VITE_AI_MODEL=claude-3-5-sonnet-20241022
```
Get your API key: https://console.anthropic.com/settings/keys

### Option 4: Custom/Self-Hosted
```bash
VITE_AI_PROVIDER=custom
VITE_AI_API_KEY=your_custom_key_here
VITE_AI_BASE_URL=https://your-custom-api.com
VITE_AI_MODEL=your-model-name
```

## ⚙️ Configuration Options

All features can be configured via environment variables:

```bash
# AI Configuration
VITE_AI_PROVIDER=gemini           # AI provider selection
VITE_AI_MODEL=gemini-2.5-flash    # Model name
VITE_AI_TEMPERATURE=0.2           # Generation temperature (0-1)
VITE_AI_MAX_TOKENS=4096           # Max response tokens

# Feature Flags
VITE_FEATURE_CACHE=true           # Enable semantic caching
VITE_FEATURE_FILE_PROCESSING=true # Enable file processing

# Rate Limiting
VITE_RATE_LIMIT_MAX_RETRIES=3
VITE_RATE_LIMIT_DELAY_MS=1000
VITE_RATE_LIMIT_EXPONENTIAL_BACKOFF=true

# File Processing
VITE_FILE_MAX_SIZE=10485760       # 10MB max file size
VITE_FILE_SUPPORTED_FORMATS=pdf,png,jpg,jpeg,dwg
VITE_FILE_PDF_DPI=300
```

See `.env.example` for complete list of configuration options.

## 📖 Usage

1. **Upload a Document**: Click "Browse Files" and select a blueprint, spec sheet, or schedule
2. **Run Analysis**: Click the "Run" button to start AI analysis
3. **View Results**: Explore detected components, connections, and extracted data in the inspector panel
4. **Interactive Canvas**: Click on detected components to see detailed information

## 🧪 Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **AI Engine**: Google Gemini 2.5 Flash (Vision + Reasoning)
- **UI Components**: Lucide Icons, Recharts
- **Styling**: Tailwind-like utility classes

## 📝 Documentation

View your app in AI Studio: https://ai.studio/apps/drive/1iwdzyxoZmWVlOkA7mlw1ohnk6aaN8PGA

## 🤝 Contributing

This is a production application. Please test thoroughly before submitting changes.

## 📄 License

Proprietary - All rights reserved
