import { UiProduct as Product, filterByType, transformSneaksProduct } from '@/lib/utils/sneaksTransform';

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
  
  // Fallback to popular if no results
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

  // Filter
  incoming = filterByType(incoming, type);
  
  // Transform to UiProduct
  const base = incoming.map(transformSneaksProduct);

  // Identify missing images (where styleID is present but image is missing)
  const missing = base.filter((p) => !p.image && p.styleID);
  
  if (missing.length) {
    const enrichPromises = missing.slice(0, 8).map(async (p) => {
      try {
        const res = await fetch(apiUrl(`/api/sneaks?styleID=${encodeURIComponent(p.styleID!)}`), { cache: 'no-store' });
        if (!res.ok) return null;
        const data = await res.json();
        const m = data?.product?.media || {};
        const candidates = [m.smallImageUrl, m.imageUrl, m.thumbUrl].filter(Boolean) as string[];
        const url = candidates.find((u) => typeof u === 'string' && /^https?:\/\//.test(u));
        return { styleID: p.styleID, image: url || '' };
      } catch {
        return null;
      }
    });
    
    const enrich = await Promise.all(enrichPromises);
    const byStyle = new Map<string, string>();
    enrich.forEach((e) => {
      if (e && e.styleID && e.image) byStyle.set(e.styleID, e.image);
    });
    
    for (const p of base) {
      if (!p.image && p.styleID && byStyle.has(p.styleID)) {
        p.image = byStyle.get(p.styleID!) as string;
      }
    }
  }

  // Finalize images (proxy wrapping)
  const finalized = base.map((p) => {
    const remote = p.image && /^https?:\/\//.test(p.image) ? p.image : '';
    // If no remote image, filter it out (as per original logic)
    if (!remote) return null;
    
    const img = `/api/image?url=${encodeURIComponent(remote)}`;
    return { ...p, image: img };
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
  
  // No fallback to popular for explicit search queries usually, but original code didn't have it either for search.
  
  const base = incoming.map(transformSneaksProduct);
  
  // Similar enrichment logic could be applied here if needed, but original code didn't show it for fetchSneaksByQuery in my snippet.
  // I will just return the base transformed products with proxy wrapping.
  
  const finalized = base.map((p) => {
     const remote = p.image && /^https?:\/\//.test(p.image) ? p.image : '';
     if (!remote) return null;
     const img = `/api/image?url=${encodeURIComponent(remote)}`;
     return { ...p, image: img };
  }).filter(Boolean) as Product[];
  
  return finalized;
}
