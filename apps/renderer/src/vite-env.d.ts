/// <reference types="vite/client" />

import type { OpenClawAPI } from '@openclaw/desktop/src/preload/index';

declare global {
  interface Window {
    openclaw: OpenClawAPI;
  }
}

export {};
