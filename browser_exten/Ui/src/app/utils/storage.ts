/**
 * Extension-Safe Storage Utility
 * Dynamically switches between Chrome Extension Storage and IndexedDB for web
 */

const idb = {
  db: null as IDBDatabase | null,
  async init() {
    if (this.db) return this.db;
    return new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('AppStorage', 1);
      request.onupgradeneeded = () => {
        request.result.createObjectStore('store');
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onerror = () => reject(request.error);
    });
  },
  async get(key: string) {
    const db = await this.init();
    return new Promise<any>((resolve, reject) => {
      const tx = db.transaction('store', 'readonly');
      const store = tx.objectStore('store');
      const req = store.get(key);
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
  },
  async set(key: string, value: any) {
    const db = await this.init();
    return new Promise<void>((resolve, reject) => {
      const tx = db.transaction('store', 'readwrite');
      const store = tx.objectStore('store');
      const req = store.put(value, key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

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
      // Use IndexedDB for unlimited web storage
      await idb.set(key, value);
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
      // Use IndexedDB fallback
      try {
        const val = await idb.get(key);
        if (val !== undefined && val !== null) {
          return val as T;
        }
      } catch (e) {
        console.error("IDB get error", e);
      }
      
      // Fallback to old localStorage if IDB doesn't have it (migration)
      const localValue = localStorage.getItem(key);
      if (localValue !== null) {
        try {
          const parsed = JSON.parse(localValue) as T;
          // migrate it to IDB silently
          await idb.set(key, parsed);
          return parsed;
        } catch {
          return defaultValue;
        }
      }
      return defaultValue;
    }
  },
  
  clear: async (): Promise<void> => {
    const isExtensionContext = 
      typeof chrome !== 'undefined' && 
      typeof chrome.storage !== 'undefined' && 
      typeof chrome.storage.local !== 'undefined';

    if (isExtensionContext) {
      return new Promise((resolve) => {
        chrome.storage.local.clear(() => resolve());
      });
    } else {
      localStorage.clear();
      return Promise.resolve();
    }
  }
};
