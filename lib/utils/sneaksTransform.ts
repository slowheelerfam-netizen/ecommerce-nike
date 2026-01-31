export type UiProduct = {
  title: string;
  subtitle: string;
  description: string;
  price: string;
  image: string;
  buttonText: string;
  variant: 'product';
  originalPrice?: string;
  styleID?: string;
};

export function normalizeStr(v: unknown): string {
  return String(v || '').toLowerCase();
}

export function filterByType(items: any[], type: 'men' | 'women' | 'kids' | 'sale' | 'new-arrivals') {
  const isKids = (name: string) => /kids|gs|grade school|ps|td/.test(name);
  const isWomen = (name: string) => /women|wmns|womens/.test(name);
  
  return items.filter((p) => {
    const name = normalizeStr(p.shoeName || p.name || p.title || '');
    
    if (type === 'kids') return isKids(name);
    if (type === 'women') return isWomen(name) && !isKids(name);
    if (type === 'men') return !isWomen(name) && !isKids(name);
    
    // For sale and new-arrivals, we generally include everything, 
    // but we might want to apply some filtering if needed. 
    // The original code didn't filter strictly for 'sale' or 'new-arrivals' 
    // other than the API query itself, so we return true.
    return true;
  });
}

export function transformSneaksProduct(p: any): UiProduct {
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
  
  // Prefer https URLs
  const image = imageCandidates.find((u) => typeof u === 'string' && /^https?:\/\//.test(u)) || '';
  
  return {
    title,
    subtitle,
    description,
    price,
    image,
    buttonText: 'Add to Cart',
    variant: 'product',
    styleID: p.styleID || p.sku || '',
  };
}
