/**
 * Storage utility functions to handle localStorage quota issues
 */

/**
 * Unified storage bridge for Chrome extension and web contexts
 */
export const storageBridge = {
  /**
   * Saves a key-value state pair
   */
  set: async (key: string, value: any): Promise<void> => {
    const isExtensionContext =
      typeof chrome !== 'undefined' &&
      typeof chrome.storage !== 'undefined' &&
      typeof chrome.storage.local !== 'undefined';

    if (isExtensionContext) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: value }, () => resolve());
      });
    } else {
      localStorage.setItem(key, JSON.stringify(value));
      return Promise.resolve();
    }
  },

  /**
   * Retrieves a state value by key
   */
  get: async <T>(key: string, defaultValue: T): Promise<T> => {
    const isExtensionContext =
      typeof chrome !== 'undefined' &&
      typeof chrome.storage !== 'undefined' &&
      typeof chrome.storage.local !== 'undefined';

    if (isExtensionContext) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (result) => {
          if (result && result[key] !== undefined) {
            resolve(result[key] as T);
          } else {
            resolve(defaultValue);
          }
        });
      });
    } else {
      // Corrected non-extension fallback logic
      const localValue = localStorage.getItem(key);
      if (localValue !== null) {
        try {
          return JSON.parse(localValue) as T;
        } catch {
          return defaultValue;
        }
      }
      return defaultValue;
    }
  }
};

/**
 * Safely set an item in localStorage with error handling
 */
export function safeSetItem(key: string, value: string): boolean {
  // Check if the value is too large (> 1MB is suspicious for settings)
  const valueSizeKB = (value.length * 2) / 1024; // Approximate size in KB (UTF-16)

  if (valueSizeKB > 1024) {
    console.warn(`Attempting to save large value (${Math.round(valueSizeKB)}KB) for ${key}. This may cause storage issues.`);
  }

  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    if (error instanceof DOMException && (
      error.name === 'QuotaExceededError' ||
      error.name === 'NS_ERROR_DOM_QUOTA_REACHED'
    )) {
      console.warn('Storage quota exceeded. Attempting cleanup...');
      // Attempt to clear old position data and retry
      clearOldPositionData();
      try {
        localStorage.setItem(key, value);
        console.log('Successfully saved after cleanup');
        return true;
      } catch (retryError) {
        console.error('Failed to save after cleanup:', retryError);
        return false;
      }
    }
    console.error(`Failed to save ${key} to localStorage:`, error);
    return false;
  }
}

/**
 * Get the approximate size of localStorage in bytes
 */
export function getStorageSize(): number {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += key.length + (localStorage.getItem(key)?.length || 0);
    }
  }
  return total;
}

/**
 * Clear old or unnecessary position data
 * This is called when storage quota is exceeded
 */
function clearOldPositionData(): void {
  const positionKeys = [
    'homepage_widget_pos',
    'homepage_search_widget_pos',
    'homepage_ethereal_clock_pos',
    'homepage_glass_calendar_pos'
  ];

  // Clear position data if it exists (users can re-position widgets)
  positionKeys.forEach(key => {
    try {
      const value = localStorage.getItem(key);
      if (value) {
        localStorage.removeItem(key);
        console.log(`Cleared ${key} to free up space`);
      }
    } catch (e) {
      console.error(`Failed to remove ${key}:`, e);
    }
  });

  // Clear media data if it's a Data URL (which can be very large)
  const mediaKey = 'homepage_media';
  try {
    const mediaValue = localStorage.getItem(mediaKey);
    if (mediaValue && mediaValue.startsWith('data:')) {
      localStorage.removeItem(mediaKey);
      console.log(`Cleared large media Data URL to free up space`);
    }
  } catch (e) {
    console.error(`Failed to remove ${mediaKey}:`, e);
  }

  // Clear bookmarks if needed (can be re-added)
  try {
    const bookmarksKey = 'homepage_bookmarks';
    const bookmarksValue = localStorage.getItem(bookmarksKey);
    if (bookmarksValue) {
      localStorage.removeItem(bookmarksKey);
      console.log(`Cleared bookmarks to free up space`);
    }
  } catch (e) {
    console.error('Failed to remove bookmarks:', e);
  }
}

/**
 * Get storage usage info
 */
export function getStorageInfo(): { used: number; usedMB: number; percentUsed: number } {
  const used = getStorageSize();
  const usedMB = used / (1024 * 1024);
  // Most browsers allow 5-10MB, we'll assume 5MB as conservative estimate
  const percentUsed = (used / (5 * 1024 * 1024)) * 100;

  return {
    used,
    usedMB: Math.round(usedMB * 100) / 100,
    percentUsed: Math.round(percentUsed * 100) / 100
  };
}

/**
 * Check if we're approaching storage quota (>80%)
 */
export function isApproachingQuota(): boolean {
  const { percentUsed } = getStorageInfo();
  return percentUsed > 80;
}

/**
 * Clear all non-essential data to free up space
 * Keeps only theme and basic settings
 */
export function clearNonEssentialData(): void {
  const essentialKeys = [
    'homepage_theme',
    'homepage_video_muted',
    'homepage_video_volume',
    'homepage_show_clock',
    'homepage_show_ethereal_clock',
    'homepage_show_glass_calendar',
    'homepage_show_search_widget'
  ];

  const allKeys = Object.keys(localStorage);
  allKeys.forEach(key => {
    if (key.startsWith('homepage_') && !essentialKeys.includes(key)) {
      try {
        localStorage.removeItem(key);
        console.log(`Cleared ${key}`);
      } catch (e) {
        console.error(`Failed to remove ${key}:`, e);
      }
    }
  });

  console.log('Non-essential data cleared. Widget positions, media, and bookmarks have been reset.');
}
