import { Injectable } from '@angular/core';

interface CacheEntry { data: unknown; timestamp: number; }

@Injectable({ providedIn: 'root' })
export class CacheService {
  static readonly LIVE_TTL      = 240_000;
  static readonly TODAY_TTL     = 300_000;
  static readonly STANDINGS_TTL = 600_000;
  static readonly SCORERS_TTL   = 600_000;

  private store = new Map<string, CacheEntry>();

  get(key: string, ttlMs: number): unknown | null {
    const entry = this.store.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > ttlMs) return null;
    return entry.data;
  }

  set(key: string, data: unknown): void {
    this.store.set(key, { data, timestamp: Date.now() });
  }
}
