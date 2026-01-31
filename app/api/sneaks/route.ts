export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type SneaksProduct = any;
// Import using require to avoid top-level side effects during module evaluation
const SneaksAPI = require('sneaks-api');

declare global {
  // eslint-disable-next-line no-var
  var __sneaksInstance: any | undefined;
  var __sneaksCache: Map<string, { ts: number; data: any }>;
  var __SneaksCtor: any;
}
function createSneaks() {
  if (!global.__SneaksCtor) {
    global.__SneaksCtor = SneaksAPI;
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
  const ttl = 1000 * 60 * 5;
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

function getProducts(keyword: string, limit: number): Promise<SneaksProduct[]> {
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

function getProductPrices(styleID: string): Promise<SneaksProduct> {
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

function getMostPopular(limit: number): Promise<SneaksProduct[]> {
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

export async function GET(req: Request) {
  const url = new URL(req.url);
  let q = (url.searchParams.get('q') || '').trim();
  const styleID = (url.searchParams.get('styleID') || '').trim();
  const op = (url.searchParams.get('op') || '').trim().toLowerCase();
  const limitParam = url.searchParams.get('limit');
  const limit = Math.max(1, Math.min(50, Number(limitParam ?? 10) || 10));

  if (q.includes('=') && !limitParam) {
    const parts = q.split('=');
    const maybeLimit = Number(parts[parts.length - 1]);
    if (!Number.isNaN(maybeLimit) && maybeLimit > 0) {
      q = parts.slice(0, -1).join('=').trim();
    }
  }
  if (!q) {
    const products = await getMostPopular(limit);
    return Response.json({ op: 'popular', limit, count: products.length, products });
  }

  if (styleID) {
    const product = await getProductPrices(styleID);
    return Response.json({ op: 'prices', styleID, product });
  }
  if (op === 'popular') {
    const products = await getMostPopular(limit);
    return Response.json({ op: 'popular', limit, count: products.length, products });
  }
  if (q) {
    const products = await getProducts(q, limit);
    return Response.json({ op: 'search', q, limit, count: products.length, products });
  }
  const products = await getMostPopular(limit);
  return Response.json({ op: 'popular', limit, count: products.length, products });
}
