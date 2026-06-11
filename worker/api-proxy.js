const API_BASE = 'https://v3.football.api-sports.io';

// TTL in seconds per endpoint pattern
function getTtl(pathname, searchParams) {
  if (pathname === '/fixtures' && searchParams.get('live')) return 60;
  if (pathname === '/fixtures') return 300;
  if (pathname === '/standings') return 600;
  if (pathname.startsWith('/players/')) return 600;
  return 0; // no cache for other paths (e.g. fixtures/statistics)
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// API-Football returns HTTP 200 even for rate limits and plan errors.
// Parse the body to detect these cases and avoid caching them.
function hasApiErrors(body) {
  try {
    const parsed = JSON.parse(body);
    return parsed.errors && Object.keys(parsed.errors).length > 0;
  } catch {
    return false;
  }
}

export default {
  async fetch(request, env, ctx) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== 'GET') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(request.url);
    const apiUrl = new URL(url.pathname + url.search, API_BASE).toString();
    const ttl = getTtl(url.pathname, url.searchParams);
    const cache = caches.default;

    // --- Cache read ---
    if (ttl > 0) {
      const cached = await cache.match(apiUrl);
      if (cached) {
        const hit = new Response(cached.body, cached);
        hit.headers.set('Access-Control-Allow-Origin', '*');
        hit.headers.set('X-Cache', 'HIT');
        return hit;
      }
    }

    // --- Upstream fetch ---
    const upstream = await fetch(apiUrl, {
      headers: { 'x-apisports-key': env.API_FOOTBALL_KEY },
    });

    const body = await upstream.text();

    if (!upstream.ok) {
      return new Response(body, {
        status: upstream.status,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    const responseHeaders = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'X-Cache': 'MISS',
    };

    // Only cache successful responses with actual data — never cache API error bodies
    // (rate limit, plan restriction, etc. all return HTTP 200 with errors in the JSON)
    const shouldCache = ttl > 0 && !hasApiErrors(body);
    if (shouldCache) {
      responseHeaders['Cache-Control'] = `public, max-age=${ttl}`;
    }

    const response = new Response(body, {
      status: upstream.status,
      headers: responseHeaders,
    });

    if (shouldCache) {
      ctx.waitUntil(cache.put(apiUrl, response.clone()));
    }

    return response;
  },
};
