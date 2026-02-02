# Setup Guide

## Prerequisites

- **Node.js** 18+ ([download](https://nodejs.org))
- **pnpm** (`npm install -g pnpm`)
- **Git** ([download](https://git-scm.com))

## Installation

### Option 1: Clone from GitHub

```bash
git clone https://github.com/YOUR_USERNAME/openclaw.git
cd openclaw
pnpm install
pnpm dev
```

### Option 2: Download ZIP

1. Download the repository as ZIP
2. Extract to a folder
3. Open terminal in that folder
4. Run:
```bash
pnpm install
pnpm dev
```

## First Run

When you first open OpenClaw:

1. The app opens with the Dashboard
2. Go to **Settings** → **AI Providers**
3. Click **Add Provider**
4. Choose your AI service and add the API key

## AI Provider Setup

### Claude (Anthropic)

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys
4. Create a new key
5. Copy and paste into OpenClaw

### OpenAI

1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Go to API Keys
4. Create a new key
5. Copy and paste into OpenClaw

### Ollama (Local - Free)

1. Download [Ollama](https://ollama.ai)
2. Install and run it
3. In terminal: `ollama pull llama2` (or any model)
4. In OpenClaw, add Ollama provider (no API key needed)

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+K | Command Palette |
| Ctrl+1 | Go to Tasks |
| Ctrl+2 | Go to Notes |
| Ctrl+3 | Go to Chat |
| Ctrl+B | Toggle Sidebar |
| Ctrl+Shift+T | New Task |
| Ctrl+Shift+N | New Note |
| Ctrl+, | Settings |

## Troubleshooting

### App won't start

```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm -rf apps/*/node_modules
rm -rf packages/*/node_modules
pnpm install
```

### Database issues

```bash
# Delete database and restart
rm -rf ~/.openclaw/data.db
pnpm dev
```

### AI not responding

1. Check your API key is correct
2. Check your internet connection
3. For Ollama, make sure it's running (`ollama serve`)
