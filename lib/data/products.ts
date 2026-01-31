export type UiProduct = {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  buttonText: string;
  variant: 'product';
  originalPrice?: string;
};

import { fetchSneaksProducts } from '@/lib/external/sneaksFetch';

export async function getProductsByType(type: string): Promise<UiProduct[]> {
  const t = (type || '').toLowerCase().replace(/\/+$/, '');
  if (t === 'men' || t === 'mens') {
    return fetchSneaksProducts('men');
  }
  if (t === 'women' || t === 'womens') {
    return fetchSneaksProducts('women');
  }
  if (t === 'kids') {
    return fetchSneaksProducts('kids');
  }
  if (t === 'sale') {
    return fetchSneaksProducts('sale');
  }
  if (t === 'new-arrivals' || t === 'newarrivals' || t === 'new' || t === 'arrivals') {
    return fetchSneaksProducts('new-arrivals');
  }
  return [];
}
