import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { NotesPage } from './pages/NotesPage';
import { ChatPage } from './pages/ChatPage';
import { SettingsPage } from './pages/SettingsPage';
import { CommandPalette } from './components/commands/CommandPalette';
import { AmbientBackground } from './components/layout/AmbientBackground';

export function App() {
  return (
    <BrowserRouter>
      {/* Ambient background with animated orbs */}
      <AmbientBackground />

      {/* Command palette (Ctrl+K) */}
      <CommandPalette />

      {/* Main app layout with sidebar */}
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/notes" element={<NotesPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}
