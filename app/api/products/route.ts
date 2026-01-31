import { NextRequest } from 'next/server';
import { getProductsByType } from '@/lib/data/products';
import { fetchSneaksProducts } from '@/lib/external/sneaksFetch';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const type = (searchParams.get('type') || '').toLowerCase().trim();

  let products;
  if (type) {
    products = await getProductsByType(type);
  } else {
    products = await fetchSneaksProducts('new-arrivals');
  }

  return Response.json({
    type: type || null,
    count: products.length,
    products,
  });
}
