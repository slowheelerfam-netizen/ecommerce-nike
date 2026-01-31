export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

import { getProducts, getProductPrices, getMostPopular } from '@/lib/external/sneaksDirect';

export async function GET(req: Request) {
  const url = new URL(req.url);
  let q = (url.searchParams.get('q') || '').trim();
  const styleID = (url.searchParams.get('styleID') || '').trim();
  const op = (url.searchParams.get('op') || '').trim().toLowerCase();
  const limitParam = url.searchParams.get('limit');
  const limit = Math.max(1, Math.min(50, Number(limitParam ?? 10) || 10));

  // Legacy hack: handle q="Keyword=Limit" if limit param is missing
  if (q.includes('=') && !limitParam) {
    const parts = q.split('=');
    const maybeLimit = Number(parts[parts.length - 1]);
    if (!Number.isNaN(maybeLimit) && maybeLimit > 0) {
      q = parts.slice(0, -1).join('=').trim();
    }
  }

  // Priority 1: Fetch by Style ID (Specific Product)
  if (styleID) {
    const product = await getProductPrices(styleID);
    return Response.json({ op: 'prices', styleID, product });
  }

  // Priority 2: Explicit Popular Request
  if (op === 'popular') {
    const products = await getMostPopular(limit);
    return Response.json({ op: 'popular', limit, count: products.length, products });
  }

  // Priority 3: Search by Keyword
  if (q) {
    const products = await getProducts(q, limit);
    return Response.json({ op: 'search', q, limit, count: products.length, products });
  }

  // Priority 4: Default to Popular (e.g. if q is empty and no other params)
  const products = await getMostPopular(limit);
  return Response.json({ op: 'popular', limit, count: products.length, products });
}
