# OpenClaw Command Center

A personal assistant command center with glassmorphism UI, AI chat, task management, and more.

![OpenClaw](https://img.shields.io/badge/OpenClaw-v1.0.0-6366f1?style=for-the-badge)

## Quick Start

### 1. Install Dependencies

```bash
# Install pnpm if you don't have it
npm install -g pnpm

# Clone and install
git clone https://github.com/YOUR_USERNAME/openclaw.git
cd openclaw
pnpm install
```

### 2. Run Development Mode

```bash
pnpm dev
```

### 3. Add Your AI Provider (First Time Setup)

1. Open the app
2. Go to **Settings** (Ctrl+,)
3. Click **AI Providers** tab
4. Add your API key:
   - **Claude**: Get key from [console.anthropic.com](https://console.anthropic.com)
   - **OpenAI**: Get key from [platform.openai.com](https://platform.openai.com)
   - **Ollama**: Install [Ollama](https://ollama.ai) locally (no key needed)

### 4. Start Using

- **Ctrl+K** - Command palette
- **Ctrl+1** - Go to Tasks
- **Ctrl+2** - Go to Notes
- **Ctrl+3** - Go to Chat
- **Ctrl+Shift+T** - Quick add task
- **Ctrl+Shift+N** - Quick add note

## Features

- 🎨 **Glassmorphism UI** - Beautiful frosted glass design
- ✅ **Task Management** - Priorities, categories, subtasks
- 💬 **AI Chat** - Claude, OpenAI, Ollama support
- 📝 **Notes** - Markdown with full-text search
- ⌨️ **Command Palette** - Quick actions with Ctrl+K
- 🔔 **Notifications** - Task reminders
- 💾 **Local Storage** - SQLite database, your data stays local

## Build for Production

```bash
# Build all packages
pnpm build

# Package for your platform
pnpm package
```

## Project Structure

```
openclaw/
├── apps/
│   ├── desktop/     # Electron main process
│   └── renderer/    # React frontend
└── packages/
    ├── shared/      # Types & utilities
    ├── database/    # SQLite layer
    └── ai-providers/# AI integrations
```

## License

MIT
