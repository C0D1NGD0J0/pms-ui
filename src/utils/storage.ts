/**
 * Unified Storage System
 * Provides a consistent API for client-side storage with support for:
 * - localStorage/sessionStorage
 * - In-memory fallback for SSR
 * - Optional encryption for sensitive data
 * - TTL/expiration support
 * - Future Redis integration support
 */

export interface IStorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  getAllKeys?(): string[];
}

export class BrowserStorageAdapter implements IStorageAdapter {
  private storage: Storage;

  constructor(type: "local" | "session" = "local") {
    if (typeof window === "undefined") {
      throw new Error("BrowserStorageAdapter requires browser environment");
    }
    this.storage = type === "local" ? localStorage : sessionStorage;
  }

  getItem(key: string): string | null {
    try {
      return this.storage.getItem(key);
    } catch (error) {
      console.error(`Error reading from storage: ${key}`, error);
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      this.storage.setItem(key, value);
    } catch (error) {
      console.error(`Error writing to storage: ${key}`, error);
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (error) {
      console.error(`Error removing from storage: ${key}`, error);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error("Error clearing storage", error);
    }
  }

  getAllKeys(): string[] {
    try {
      return Object.keys(this.storage);
    } catch (error) {
      console.error("Error getting storage keys", error);
      return [];
    }
  }
}

export class MemoryStorageAdapter implements IStorageAdapter {
  private store: Map<string, string> = new Map();

  getItem(key: string): string | null {
    return this.store.get(key) || null;
  }

  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }

  removeItem(key: string): void {
    this.store.delete(key);
  }

  clear(): void {
    this.store.clear();
  }

  getAllKeys(): string[] {
    return Array.from(this.store.keys());
  }
}

export class RedisStorageAdapter {
  private client: any;

  constructor(client: any) {
    this.client = client;
  }

  async getItem(key: string): Promise<string | null> {
    try {
      return await this.client.get(key);
    } catch (error) {
      console.error(`Error reading from Redis: ${key}`, error);
      return null;
    }
  }

  async setItem(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      console.error(`Error writing to Redis: ${key}`, error);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error(`Error removing from Redis: ${key}`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      console.error("Error clearing Redis", error);
    }
  }
}

export type StorageType = "local" | "session" | "memory";

interface StorageOptions {
  ttl?: number;
  encrypt?: boolean;
  type?: StorageType;
}

interface StoredValue<T> {
  value: T;
  expiresAt?: number;
  encrypted?: boolean;
}

export class StorageManager {
  private adapters: Map<StorageType, IStorageAdapter>;
  private defaultType: StorageType;
  private namespace: string;

  constructor(
    defaultType: StorageType = "session",
    namespace: string = "app"
  ) {
    this.defaultType = defaultType;
    this.namespace = namespace;
    this.adapters = new Map();
    this.initializeAdapters();
  }

  private initializeAdapters(): void {
    if (typeof window === "undefined") {
      const memoryAdapter = new MemoryStorageAdapter();
      this.adapters.set("local", memoryAdapter);
      this.adapters.set("session", memoryAdapter);
      this.adapters.set("memory", memoryAdapter);
    } else {
      try {
        this.adapters.set("local", new BrowserStorageAdapter("local"));
        this.adapters.set("session", new BrowserStorageAdapter("session"));
        this.adapters.set("memory", new MemoryStorageAdapter());
      } catch {
        const fallback = new MemoryStorageAdapter();
        this.adapters.set("local", fallback);
        this.adapters.set("session", fallback);
        this.adapters.set("memory", fallback);
      }
    }
  }

  private getAdapter(type?: StorageType): IStorageAdapter {
    const storageType = type || this.defaultType;
    const adapter = this.adapters.get(storageType);
    if (!adapter) {
      throw new Error(`Storage adapter not found for type: ${storageType}`);
    }
    return adapter;
  }

  private getFullKey(key: string): string {
    return `${this.namespace}:${key}`;
  }

  private simpleEncrypt(value: string): string {
    if (typeof btoa === "undefined") return value;
    return btoa(value);
  }

  private simpleDecrypt(value: string): string {
    if (typeof atob === "undefined") return value;
    try {
      return atob(value);
    } catch {
      return value;
    }
  }

  get<T = any>(key: string, type?: StorageType): T | null {
    try {
      const adapter = this.getAdapter(type);
      const fullKey = this.getFullKey(key);
      const rawValue = adapter.getItem(fullKey);

      if (!rawValue) return null;

      const stored: StoredValue<T> = JSON.parse(rawValue);

      if (stored.expiresAt && Date.now() > stored.expiresAt) {
        this.remove(key, type);
        return null;
      }

      let value = stored.value;

      if (stored.encrypted && typeof value === "string") {
        value = JSON.parse(this.simpleDecrypt(value)) as T;
      }

      return value;
    } catch (error) {
      console.error(`Error parsing stored value for key: ${key}`, error);
      return null;
    }
  }

  set<T = any>(key: string, value: T, options?: StorageType | StorageOptions): void {
    try {
      let storageType: StorageType | undefined;
      let storageOptions: StorageOptions = {};

      if (typeof options === "string") {
        storageType = options;
      } else if (options) {
        storageType = options.type;
        storageOptions = options;
      }

      const adapter = this.getAdapter(storageType);
      const fullKey = this.getFullKey(key);

      let valueToStore = value;

      if (storageOptions.encrypt) {
        const stringified = JSON.stringify(value);
        valueToStore = this.simpleEncrypt(stringified) as T;
      }

      const stored: StoredValue<T> = {
        value: valueToStore,
        encrypted: storageOptions.encrypt,
        ...(storageOptions.ttl && { expiresAt: Date.now() + storageOptions.ttl }),
      };

      adapter.setItem(fullKey, JSON.stringify(stored));
    } catch (error) {
      console.error(`Error storing value for key: ${key}`, error);
    }
  }

  remove(key: string, type?: StorageType): void {
    const adapter = this.getAdapter(type);
    const fullKey = this.getFullKey(key);
    adapter.removeItem(fullKey);
  }

  clear(type?: StorageType): void {
    const adapter = this.getAdapter(type);

    if (adapter.getAllKeys) {
      const keys = adapter.getAllKeys();
      const namespacePrefix = `${this.namespace}:`;

      keys.forEach((key) => {
        if (key.startsWith(namespacePrefix)) {
          adapter.removeItem(key);
        }
      });
    } else {
      adapter.clear();
    }
  }

  has(key: string, type?: StorageType): boolean {
    return this.get(key, type) !== null;
  }

  setDefaultType(type: StorageType): void {
    this.defaultType = type;
  }

  getDefaultType(): StorageType {
    return this.defaultType;
  }
}

const storage = new StorageManager("session", "pms");

export { storage, storage as default };
