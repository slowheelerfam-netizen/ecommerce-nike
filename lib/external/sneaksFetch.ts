import type { UiProduct as Product } from '@/lib/data/products';

function normalizeStr(v: unknown): string {
  return String(v || '').toLowerCase();
}

function apiUrl(path: string): string {
  if (typeof window === 'undefined') {
    const vercel = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '';
    const portBase = process.env.PORT ? `http://localhost:${process.env.PORT}` : '';
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ||
      vercel ||
      portBase ||
      'http://localhost:3000';
    const clean = (s: string) => s.trim().replace(/\/+$/, '');
    return `${clean(base)}${path}`;
  }
  return path;
}

function filterByType(items: any[], type: 'men' | 'women' | 'kids' | 'sale' | 'new-arrivals') {
  const isKids = (name: string) => /kids|gs|grade school|ps|td/.test(name);
  const isWomen = (name: string) => /women|wmns|womens/.test(name);
  return items.filter((p) => {
    const name = normalizeStr(p.shoeName || p.name || p.title || '');
    if (type === 'kids') return isKids(name);
    if (type === 'women') return isWomen(name) && !isKids(name);
    if (type === 'men') return !isWomen(name) && !isKids(name);
    return true;
  });
}

export async function fetchSneaksProducts(type: 'men' | 'women' | 'kids' | 'sale' | 'new-arrivals'): Promise<Product[]> {
  const limit = 12;
  const params = new URLSearchParams();
  if (type === 'sale' || type === 'new-arrivals') {
    params.set('op', 'popular');
    params.set('limit', String(limit));
  } else {
    const keyword = type === 'men' ? 'Nike Men' : type === 'women' ? 'Nike Women' : 'Nike Kids';
    params.set('q', keyword);
    params.set('limit', String(limit));
  }
  const url = apiUrl(`/api/sneaks?${params.toString()}`);

  let incoming: any[] = [];
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Sneaks API request failed: ${res.status}`);
    const data = await res.json();
    incoming = Array.isArray(data.products) ? data.products : [];
  } catch {
    incoming = [];
  }
  if (!incoming.length) {
    try {
      const popularUrl = apiUrl(`/api/sneaks?op=popular&limit=${limit}`);
      const res2 = await fetch(popularUrl, { cache: 'no-store' });
      if (res2.ok) {
        const data2 = await res2.json();
        incoming = Array.isArray(data2.products) ? data2.products : [];
      }
    } catch {
      incoming = [];
    }
  }
  incoming = filterByType(incoming, type);
  const base = incoming.map((p) => {
    const title = p.shoeName || p.name || p.title || 'Sneaker';
    const subtitle = p.colorway || p.brand || '';
    const description = p.description || (p.releaseDate ? `Release Date: ${p.releaseDate}` : '');
    const priceNum =
      typeof p.retailPrice === 'number' && p.retailPrice > 0
        ? p.retailPrice
        : typeof p.price === 'number' && p.price > 0
        ? p.price
        : 120;
    const price = `$${priceNum}`;
    const imageCandidates = [
      p.thumbnail,
      p.image,
      p?.media?.smallImageUrl,
      p?.media?.imageUrl,
      p?.media?.thumbUrl,
      Array.isArray(p.imageLinks) && p.imageLinks.length > 0 ? p.imageLinks[0] : '',
    ].filter(Boolean) as string[];
    const image = imageCandidates.find((u) => typeof u === 'string' && /^https?:\/\//.test(u)) || '';
    return {
      styleID: p.styleID || p.sku || '',
      product: {
        title,
        subtitle,
        description,
        price,
        image,
        buttonText: 'Add to Cart',
        variant: 'product',
      } as Product,
    };
  });
  const missing = base.filter((b) => !b.product.image && b.styleID);
  if (missing.length) {
    const enrichPromises = missing.slice(0, 8).map(async (b) => {
      try {
        const res = await fetch(apiUrl(`/api/sneaks?styleID=${encodeURIComponent(b.styleID)}`), { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        const m = data?.product?.media || {};
        const candidates = [m.smallImageUrl, m.imageUrl, m.thumbUrl].filter(Boolean) as string[];
        const url = candidates.find((u) => typeof u === 'string' && /^https?:\/\//.test(u));
        return { styleID: b.styleID, image: url || '' };
      } catch {
        return null;
      }
    });
    const enrich = await Promise.all(enrichPromises);
    const byStyle = new Map<string, string>();
    enrich.forEach((e) => {
      if (e && e.styleID && e.image) byStyle.set(e.styleID, e.image);
    });
    for (const b of base) {
      if (!b.product.image && b.styleID && byStyle.has(b.styleID)) {
        b.product.image = byStyle.get(b.styleID) as string;
      }
    }
  }
  const finalized = base.map((b) => {
    const remote = b.product.image && /^https?:\/\//.test(b.product.image) ? b.product.image : '';
    if (!remote) return null as unknown as Product;
    const img = `/api/image?url=${encodeURIComponent(remote)}`;
    return { ...b.product, image: img };
  }).filter(Boolean) as Product[];
  return finalized;
}

export async function fetchSneaksByQuery(query: string, limit = 12): Promise<Product[]> {
  const params = new URLSearchParams();
  params.set('q', query);
  params.set('limit', String(limit));
  const url = apiUrl(`/api/sneaks?${params.toString()}`);

  let incoming: any[] = [];
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Sneaks API request failed: ${res.status}`);
    const data = await res.json();
    incoming = Array.isArray(data.products) ? data.products : [];
  } catch {
    incoming = [];
  }
  if (!incoming.length) {
    try {
      const popularUrl = apiUrl(`/api/sneaks?op=popular&limit=${limit}`);
      const res2 = await fetch(popularUrl, { cache: 'no-store' });
      if (res2.ok) {
        const data2 = await res2.json();
        incoming = Array.isArray(data2.products) ? data2.products : [];
      }
    } catch {
      incoming = [];
    }
  }
  const base = incoming.map((p) => {
    const title = p.shoeName || p.name || p.title || 'Sneaker';
    const subtitle = p.colorway || p.brand || '';
    const description = p.description || (p.releaseDate ? `Release Date: ${p.releaseDate}` : '');
    const priceNum =
      typeof p.retailPrice === 'number' && p.retailPrice > 0
        ? p.retailPrice
        : typeof p.price === 'number' && p.price > 0
        ? p.price
        : 120;
    const price = `$${priceNum}`;
    const imageCandidates = [
      p.thumbnail,
      p.image,
      p?.media?.smallImageUrl,
      p?.media?.imageUrl,
      p?.media?.thumbUrl,
      Array.isArray(p.imageLinks) && p.imageLinks.length > 0 ? p.imageLinks[0] : '',
    ].filter(Boolean) as string[];
    const image = imageCandidates.find((u) => typeof u === 'string' && /^https?:\/\//.test(u)) || '';
    return {
      styleID: p.styleID || p.sku || '',
      product: {
        title,
        subtitle,
        description,
        price,
        image,
        buttonText: 'Add to Cart',
        variant: 'product',
      } as Product,
    };
  });
  const missing = base.filter((b) => !b.product.image && b.styleID);
  if (missing.length) {
    const enrichPromises = missing.slice(0, 8).map(async (b) => {
      try {
        const res = await fetch(apiUrl(`/api/sneaks?styleID=${encodeURIComponent(b.styleID)}`), { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        const m = data?.product?.media || {};
        const candidates = [m.smallImageUrl, m.imageUrl, m.thumbUrl].filter(Boolean) as string[];
        const url = candidates.find((u) => typeof u === 'string' && /^https?:\/\//.test(u));
        return { styleID: b.styleID, image: url || '' };
      } catch {
        return null;
      }
    });
    const enrich = await Promise.all(enrichPromises);
    const byStyle = new Map<string, string>();
    enrich.forEach((e) => {
      if (e && e.styleID && e.image) byStyle.set(e.styleID, e.image);
    });
    for (const b of base) {
      if (!b.product.image && b.styleID && byStyle.has(b.styleID)) {
        b.product.image = byStyle.get(b.styleID) as string;
      }
    }
  }
  const finalized = base.map((b) => {
    const remote = b.product.image && /^https?:\/\//.test(b.product.image) ? b.product.image : '';
    if (!remote) return null as unknown as Product;
    const img = `/api/image?url=${encodeURIComponent(remote)}`;
    return { ...b.product, image: img };
  }).filter(Boolean) as Product[];
  return finalized;
}
