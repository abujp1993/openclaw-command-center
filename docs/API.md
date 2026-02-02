# API Reference

## For Bot Integration

If you want your bot to interact with OpenClaw, here's how.

### IPC API (Electron)

The app exposes a `window.openclaw` API in the renderer process.

```typescript
// Tasks
await window.openclaw.tasks.list()           // Get all tasks
await window.openclaw.tasks.create({ title: "New task" })
await window.openclaw.tasks.update(id, { status: "completed" })
await window.openclaw.tasks.delete(id)

// Notes
await window.openclaw.notes.list()
await window.openclaw.notes.create({ title: "Note", content: "..." })
await window.openclaw.notes.search("keyword")

// AI Chat
await window.openclaw.ai.chat({
  conversationId: "...",
  providerId: "...",
  messages: [{ role: "user", content: "Hello" }]
})

// Listen to stream
window.openclaw.ai.onStream((chunk) => {
  if (chunk.type === "text") console.log(chunk.content)
  if (chunk.type === "done") console.log("Done!")
})

// Settings
const settings = await window.openclaw.settings.get()
await window.openclaw.settings.update({ theme: "dark" })
```

### Data Types

```typescript
interface Task {
  id: string
  title: string
  description?: string
  priority: "high" | "medium" | "low"
  status: "pending" | "in_progress" | "completed"
  dueDate?: number
  parentId?: string
  categories: Category[]
  subtasks?: Task[]
  createdAt: number
  updatedAt: number
}

interface Note {
  id: string
  title: string
  content?: string
  folderId?: string
  tags: string[]
  isPinned: boolean
  createdAt: number
  updatedAt: number
}

interface Message {
  id: string
  conversationId: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: number
}
```

### Database Location

SQLite database is stored at:
- **Windows**: `%APPDATA%/openclaw/data.db`
- **Mac**: `~/Library/Application Support/openclaw/data.db`
- **Linux**: `~/.config/openclaw/data.db`

### CLI Integration (Future)

We plan to add CLI commands:

```bash
openclaw task add "Buy groceries"
openclaw task list --priority high
openclaw note create "Meeting notes"
openclaw chat "What's the weather?"
```
