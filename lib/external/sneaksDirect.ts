import 'server-only';

export const runtime = 'nodejs';

type SneaksProduct = any;

declare global {
  // eslint-disable-next-line no-var
  var __sneaksInstance: any | undefined;
  // eslint-disable-next-line no-var
  var __sneaksCache: Map<string, { ts: number; data: any }>;
  // eslint-disable-next-line no-var
  var __SneaksCtor: any;
}

function createSneaks() {
  if (!global.__SneaksCtor) {
    // PREVENT OverwriteModelError
    // sneaks-api requires 'mongoose' and calls mongoose.model('Sneaker', ...) at top level.
    // We must check if the model already exists and, if so, we can try to prevent re-compilation
    // OR just rely on the fact that we are inside a function.
    // However, require() caches the module, so the side effect should only happen once per process.
    // The issue is if multiple versions of mongoose are loaded or if next.js reloads the module.
    
    // We can try to proactively load mongoose and check models.
    try {
      const mongoose = require('mongoose');
      if (mongoose.models && mongoose.models.Sneaker) {
         // Model already exists. 
         // If we require('sneaks-api'), it will try to define it again and crash if it's the same mongoose instance.
         // But if 'sneaks-api' requires its own mongoose, it might be different.
         // Usually it's the same if versions match.
         
         // If we delete the model, it might allow re-definition.
         delete mongoose.models.Sneaker;
         delete mongoose.modelSchemas.Sneaker;
      }
    } catch (e) {
      // ignore
    }

    global.__SneaksCtor = require('sneaks-api');
  }
  if (!global.__sneaksInstance) {
    global.__sneaksInstance = new global.__SneaksCtor();
  }
  return global.__sneaksInstance;
}

function getCacheKey(op: string, params: Record<string, string | number>) {
  const p = Object.entries(params)
    .sort(([a], [b]) => (a > b ? 1 : a < b ? -1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `${op}?${p}`;
}

function getFromCache(key: string) {
  if (!global.__sneaksCache) global.__sneaksCache = new Map();
  const item = global.__sneaksCache.get(key);
  if (!item) return null;
  const ttl = 1000 * 60 * 5; // 5 minutes cache
  if (Date.now() - item.ts > ttl) {
    global.__sneaksCache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key: string, data: any) {
  if (!global.__sneaksCache) global.__sneaksCache = new Map();
  global.__sneaksCache.set(key, { ts: Date.now(), data });
}

export function getProducts(keyword: string, limit: number): Promise<SneaksProduct[]> {
  const sneaks = createSneaks();
  const key = getCacheKey('search', { keyword, limit });
  const cached = getFromCache(key);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    sneaks.getProducts(keyword, limit, (err: unknown, products: SneaksProduct[]) => {
      if (err) {
        resolve([]);
        return;
      }
      const data = products || [];
      setCache(key, data);
      resolve(data);
    });
  });
}

export function getProductPrices(styleID: string): Promise<SneaksProduct> {
  const sneaks = createSneaks();
  const key = getCacheKey('prices', { styleID });
  const cached = getFromCache(key);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    sneaks.getProductPrices(styleID, (err: unknown, product: SneaksProduct) => {
      if (err) {
        resolve({});
        return;
      }
      const data = product || {};
      setCache(key, data);
      resolve(data);
    });
  });
}

export function getMostPopular(limit: number): Promise<SneaksProduct[]> {
  const sneaks = createSneaks();
  const key = getCacheKey('popular', { limit });
  const cached = getFromCache(key);
  if (cached) return Promise.resolve(cached);
  return new Promise((resolve) => {
    sneaks.getMostPopular(limit, (err: unknown, products: SneaksProduct[]) => {
      if (err) {
        resolve([]);
        return;
      }
      const data = products || [];
      setCache(key, data);
      resolve(data);
    });
  });
}
