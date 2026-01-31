export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const target = url.searchParams.get('url') || '';
  if (!target || !/^https?:\/\//.test(target)) {
    return new Response('Bad Request', { status: 400 });
  }
  try {
    const u = new URL(target);
    const host = u.hostname.toLowerCase();
    const refererMap: Record<string, string> = {
      'stockx.com': 'https://stockx.com/',
      'images.stockx.com': 'https://stockx.com/',
      'stockx.imgix.net': 'https://stockx.com/',
      'goat.com': 'https://goat.com/',
      'images.goat.com': 'https://goat.com/',
      'static.nike.com': 'https://www.nike.com/',
      'cdn.shopify.com': 'https://cdn.shopify.com/',
    };
    const referer = refererMap[host] || `https://${host}/`;
    const res = await fetch(target, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': referer,
      },
    });
    if (!res.ok) {
      return new Response('Upstream Error', { status: 502 });
    }
    const contentType = res.headers.get('content-type') || 'image/jpeg';
    const data = await res.arrayBuffer();
    return new Response(data, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    return new Response('Fetch Error', { status: 500 });
  }
}
