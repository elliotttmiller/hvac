<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HVAC AI Platform - Architecture 2.0

**Production-grade AI platform powered by Gemini 2.5 Flash** featuring universal document analysis, component detection, and intelligent transcription for HVAC engineering.

## 🎯 Features

- **Universal Document Analysis**: Automatically classifies and processes blueprints, spec sheets, and schedules
- **Component Detection**: AI-powered detection of HVAC components (ducts, VAVs, AHUs, dampers, diffusers)
- **Connectivity Tracing**: Intelligent tracing of supply/return air paths and control signals
- **Smart OCR**: Multi-angle text recognition with rotation correction
- **Semantic Caching**: Fast response times with intelligent caching
- **Real-time Visualization**: Interactive canvas with bounding box overlays

## 🏗️ Architecture

This project uses a clean, feature-first architecture:

```
hvac/
├── app/              # Configuration & providers
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

2. **Configure API key:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local and add your Gemini API key
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

## 🔑 Getting a Gemini API Key

Get your free API key from: https://makersuite.google.com/app/apikey

Set it in `.env.local`:
```
VITE_GEMINI_API_KEY=your_api_key_here
```

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
