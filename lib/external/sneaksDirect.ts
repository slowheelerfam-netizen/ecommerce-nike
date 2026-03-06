import 'server-only';

export const runtime = 'nodejs';

const KICKS_API_KEY = process.env.KICKSDB_API_KEY || '';
const KICKS_BASE = 'https://api.kicks.dev/v3';

type SneaksProduct = any;

// ─── Cache ────────────────────────────────────────────────────────────────────

declare global {
  // eslint-disable-next-line no-var
  var __sneaksCache: Map<string, { ts: number; data: any }>;
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
  const ttl = 1000 * 60 * 5; // 5 minutes
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

// ─── KicksDB fetch helper ─────────────────────────────────────────────────────

async function kicksFetch(path: string): Promise<any> {
  const res = await fetch(`${KICKS_BASE}${path}`, {
    headers: {
      Authorization: `Bearer ${KICKS_API_KEY}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 300 }, // 5 min Next.js cache
  });
  if (!res.ok) throw new Error(`KicksDB ${res.status}: ${path}`);
  return res.json();
}

// ─── Map KicksDB product → shape the rest of the app expects ─────────────────

function mapProduct(item: any): SneaksProduct {
  return {
    shoeName:      item.title   ?? item.name ?? 'Unknown',
    brand:         item.brand   ?? '',
    colorway:      item.colorway ?? '',
    styleID:       item.style_id ?? item.sku ?? item.id ?? '',
    retailPrice:   item.retail_price ?? item.msrp ?? 0,
    thumbnail:     item.image   ?? (item.images?.[0]) ?? '',
    releaseDate:   item.release_date ?? '',
    description:   item.description ?? '',
    urlKey:        item.slug    ?? item.url_key ?? '',
    make:          item.model   ?? '',
    silhoutte:     item.model   ?? '',
    lowestResellPrice: {
      stockX:        item.lowest_ask ?? item.price ?? 0,
      goat:          0,
      flightClub:    0,
      stadiumGoods:  0,
    },
    resellLinks: {
      stockX:        item.slug ? `https://stockx.com/${item.slug}` : '',
      goat:          '',
      flightClub:    '',
      stadiumGoods:  '',
    },
    resellPrices: {
      stockX:        {},
      goat:          {},
      flightClub:    {},
      stadiumGoods:  {},
    },
    imageLinks: item.images ?? (item.image ? [item.image] : []),
  };
}

// ─── Public API (same signatures as the old sneaksDirect.ts) ─────────────────

export async function getProducts(keyword: string, limit: number): Promise<SneaksProduct[]> {
  const key = getCacheKey('search', { keyword, limit });
  const cached = getFromCache(key);
  if (cached) return cached;

  try {
    // KicksDB unified search endpoint
    const json = await kicksFetch(
      `/stockx/products?query=${encodeURIComponent(keyword)}&limit=${limit}`
    );
    const items: any[] = json.data ?? [];
    const data = items.slice(0, limit).map(mapProduct);
    setCache(key, data);
    return data;
  } catch (err) {
    console.error('[sneaksDirect] getProducts error:', err);
    return [];
  }
}

export async function getProductPrices(styleID: string): Promise<SneaksProduct> {
  const key = getCacheKey('prices', { styleID });
  const cached = getFromCache(key);
  if (cached) return cached;

  try {
    const json = await kicksFetch(`/stockx/products/${encodeURIComponent(styleID)}`);
    const item = json.data ?? {};
    const product = mapProduct(item);

    // Build size → price map from variants if available
    if (Array.isArray(item.variants)) {
      const priceMap: Record<string, number> = {};
      for (const v of item.variants) {
        if (v.size && v.lowest_ask) priceMap[v.size] = v.lowest_ask;
      }
      product.resellPrices.stockX = priceMap;
    }

    setCache(key, product);
    return product;
  } catch (err) {
    console.error('[sneaksDirect] getProductPrices error:', err);
    return {};
  }
}

export async function getMostPopular(limit: number): Promise<SneaksProduct[]> {
  const key = getCacheKey('popular', { limit });
  const cached = getFromCache(key);
  if (cached) return cached;

  try {
    // Use a broad Nike search as a "popular" proxy — KicksDB has no dedicated popular endpoint
    const json = await kicksFetch(`/stockx/products?query=nike&limit=${limit}`);
    const items: any[] = json.data ?? [];
    const data = items.slice(0, limit).map(mapProduct);
    setCache(key, data);
    return data;
  } catch (err) {
    console.error('[sneaksDirect] getMostPopular error:', err);
    return [];
  }
}