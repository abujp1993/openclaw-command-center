// Command Palette & Shortcuts Types

export type ActionType = 'navigate' | 'create' | 'toggle' | 'custom' | 'search';

export interface Command {
  id: string;
  name: string;
  description?: string;
  shortcut?: string;
  actionType: ActionType;
  actionPayload?: Record<string, unknown>;
  icon?: string;
  group?: string;
  isActive: boolean;
  isBuiltIn: boolean;
  createdAt: number;
}

export interface CommandGroup {
  name: string;
  commands: Command[];
}

export interface CreateCommandInput {
  name: string;
  description?: string;
  shortcut?: string;
  actionType: ActionType;
  actionPayload?: Record<string, unknown>;
  icon?: string;
  group?: string;
}

export interface UpdateCommandInput {
  name?: string;
  description?: string;
  shortcut?: string;
  actionPayload?: Record<string, unknown>;
  icon?: string;
  group?: string;
  isActive?: boolean;
}

export interface ShortcutBinding {
  commandId: string;
  shortcut: string;
  isGlobal: boolean;
}
