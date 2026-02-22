import { safeStorage } from 'electron';

/**
 * Encrypt a sensitive string (e.g., API key) using Electron's safeStorage.
 * Falls back to base64 encoding when safeStorage is unavailable (e.g., in tests).
 * Returns a prefixed string to distinguish encrypted from plaintext values.
 */
export function encryptSecret(plaintext: string): string {
  if (safeStorage.isEncryptionAvailable()) {
    const encrypted = safeStorage.encryptString(plaintext);
    return `enc:${encrypted.toString('base64')}`;
  }
  // Fallback: store as-is but mark as unencrypted so callers are aware
  return `plain:${plaintext}`;
}

/**
 * Decrypt a value previously encrypted with encryptSecret.
 * Returns null if decryption fails.
 */
export function decryptSecret(stored: string): string | null {
  try {
    if (stored.startsWith('enc:')) {
      const encrypted = Buffer.from(stored.slice(4), 'base64');
      return safeStorage.decryptString(encrypted);
    }
    if (stored.startsWith('plain:')) {
      return stored.slice(6);
    }
    // Legacy plaintext value (no prefix) — return as-is
    return stored;
  } catch {
    return null;
  }
}

/**
 * Check whether secrets will be encrypted at rest on this platform.
 */
export function isEncryptionAvailable(): boolean {
  return safeStorage.isEncryptionAvailable();
}
