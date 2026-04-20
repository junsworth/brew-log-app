import type { BrewBatch } from "@/types/brew";

export interface StorageAdapter {
  load: () => BrewBatch | null;
  save: (data: BrewBatch) => void;
  clear: () => void;
}

export class LocalStorageAdapter implements StorageAdapter {
  constructor(private readonly key: string) {}

  load() {
    if (typeof window === "undefined") return null;
    const raw = window.localStorage.getItem(this.key);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as BrewBatch;
    } catch {
      return null;
    }
  }

  save(data: BrewBatch) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(this.key, JSON.stringify(data));
  }

  clear() {
    if (typeof window === "undefined") return;
    window.localStorage.removeItem(this.key);
  }
}
