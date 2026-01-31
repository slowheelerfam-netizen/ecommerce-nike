import 'server-only';
import { getProducts, getMostPopular, getProductPrices } from '@/lib/external/sneaksDirect';
import { UiProduct, filterByType, transformSneaksProduct } from '@/lib/utils/sneaksTransform';

async function enrichProducts(products: UiProduct[]): Promise<UiProduct[]> {
  const missing = products.filter(p => !p.image && p.styleID);
  
  if (missing.length) {
    // Limit enrichment to avoid hammering the API
    const toEnrich = missing.slice(0, 8);
    const enrichedData = await Promise.all(toEnrich.map(async (p) => {
      try {
        const details = await getProductPrices(p.styleID!);
        const m = details?.media || {};
        const candidates = [m.smallImageUrl, m.imageUrl, m.thumbUrl].filter(Boolean) as string[];
        const url = candidates.find((u) => typeof u === 'string' && /^https?:\/\//.test(u));
        return { styleID: p.styleID, image: url || '' };
      } catch {
        return null;
      }
    }));
    
    const byStyle = new Map<string, string>();
    enrichedData.forEach(e => {
      if (e && e.styleID && e.image) byStyle.set(e.styleID, e.image);
    });
    
    products.forEach(p => {
       if (!p.image && p.styleID && byStyle.has(p.styleID)) {
         p.image = byStyle.get(p.styleID!)!;
       }
    });
  }

  // Finalize images (proxy wrapping)
  return products.map((p) => {
    const remote = p.image && /^https?:\/\//.test(p.image) ? p.image : '';
    // If no remote image, filter it out
    if (!remote) return null;
    
    const img = `/api/image?url=${encodeURIComponent(remote)}`;
    return { ...p, image: img };
  }).filter(Boolean) as UiProduct[];
}

export async function getProductsByType(type: string): Promise<UiProduct[]> {
  const t = (type || '').toLowerCase().replace(/\/+$/, '');
  let products: any[] = [];
  
  // Map type to query
  let keyword = '';
  let isPopular = false;
  let filterType: 'men' | 'women' | 'kids' | 'sale' | 'new-arrivals' = 'sale';
  
  if (t === 'men' || t === 'mens') {
    keyword = 'Nike Men';
    filterType = 'men';
  } else if (t === 'women' || t === 'womens') {
    keyword = 'Nike Women';
    filterType = 'women';
  } else if (t === 'kids') {
    keyword = 'Nike Kids';
    filterType = 'kids';
  } else if (t === 'sale') {
    isPopular = true;
    filterType = 'sale';
  } else if (t === 'new-arrivals' || t === 'newarrivals' || t === 'new' || t === 'arrivals') {
    isPopular = true;
    filterType = 'new-arrivals';
  } else {
    return [];
  }

  const limit = 12;

  try {
    if (isPopular) {
      products = await getMostPopular(limit);
    } else {
      products = await getProducts(keyword, limit);
    }
  } catch (e) {
    console.error('Error fetching products direct:', e);
    products = [];
  }
  
  // Fallback
  if (!products.length && !isPopular) {
     try {
       products = await getMostPopular(limit);
     } catch {}
  }

  // Filter
  const filtered = filterByType(products, filterType);
  
  // Transform
  const base = filtered.map(transformSneaksProduct);
  
  // Enrich and Finalize
  return enrichProducts(base);
}
