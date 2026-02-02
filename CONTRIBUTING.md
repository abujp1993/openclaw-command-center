# Contributing to OpenClaw

Thank you for your interest in contributing!

## Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/openclaw.git
cd openclaw
pnpm install
pnpm dev
```

## Development Workflow

1. Fork the repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Run tests: `pnpm test`
5. Commit: `git commit -m "Add my feature"`
6. Push: `git push origin feature/my-feature`
7. Open a Pull Request

## Project Structure

```
openclaw/
├── apps/
│   ├── desktop/     # Electron main process
│   └── renderer/    # React frontend
└── packages/
    ├── shared/      # Shared types & utilities
    ├── database/    # SQLite database layer
    └── ai-providers/# AI provider integrations
```

## Code Style

- Use TypeScript for all code
- Follow existing patterns in the codebase
- Run `pnpm lint` before committing
- Write descriptive commit messages

## Adding a New AI Provider

1. Create `packages/ai-providers/src/providers/your-provider.provider.ts`
2. Extend `BaseProvider` class
3. Implement required methods: `chat`, `chatStream`, `testConnection`
4. Export from `packages/ai-providers/src/providers/index.ts`

## Adding a New Feature

1. Add types to `packages/shared/src/types/`
2. Add IPC handlers to `apps/desktop/src/main/ipc/`
3. Add UI components to `apps/renderer/src/components/`
4. Update documentation

## Questions?

Open an issue with the `question` label.
