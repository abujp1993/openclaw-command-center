// Validation utility functions

/**
 * Check if a string is empty or only whitespace
 */
export function isEmpty(value: string | undefined | null): boolean {
  return !value || value.trim().length === 0;
}

/**
 * Validate task title
 */
export function validateTaskTitle(title: string): { valid: boolean; error?: string } {
  if (isEmpty(title)) {
    return { valid: false, error: 'Title is required' };
  }
  if (title.length > 200) {
    return { valid: false, error: 'Title must be less than 200 characters' };
  }
  return { valid: true };
}

/**
 * Validate note title
 */
export function validateNoteTitle(title: string): { valid: boolean; error?: string } {
  if (isEmpty(title)) {
    return { valid: false, error: 'Title is required' };
  }
  if (title.length > 200) {
    return { valid: false, error: 'Title must be less than 200 characters' };
  }
  return { valid: true };
}

/**
 * Validate folder name
 */
export function validateFolderName(name: string): { valid: boolean; error?: string } {
  if (isEmpty(name)) {
    return { valid: false, error: 'Folder name is required' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'Folder name must be less than 100 characters' };
  }
  // Check for invalid characters
  if (/[<>:"/\\|?*]/.test(name)) {
    return { valid: false, error: 'Folder name contains invalid characters' };
  }
  return { valid: true };
}

/**
 * Validate category name
 */
export function validateCategoryName(name: string): { valid: boolean; error?: string } {
  if (isEmpty(name)) {
    return { valid: false, error: 'Category name is required' };
  }
  if (name.length > 50) {
    return { valid: false, error: 'Category name must be less than 50 characters' };
  }
  return { valid: true };
}

/**
 * Validate hex color
 */
export function validateHexColor(color: string): boolean {
  return /^#[0-9A-Fa-f]{6}$/.test(color);
}

/**
 * Validate API key format (basic check)
 */
export function validateApiKey(key: string): { valid: boolean; error?: string } {
  if (isEmpty(key)) {
    return { valid: false, error: 'API key is required' };
  }
  if (key.length < 20) {
    return { valid: false, error: 'API key seems too short' };
  }
  return { valid: true };
}

/**
 * Validate URL format (http/https only)
 */
export function validateUrl(url: string): { valid: boolean; error?: string } {
  if (isEmpty(url)) {
    return { valid: true }; // URL is optional
  }
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'URL must use http or https protocol' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}
