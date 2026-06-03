/**
 * ToolsBase Worker — handles /api routing directly via ASSETS binding.
 * No _redirects needed. This intercepts all /api* paths and returns the
 * correct file from the asset bundle.
 */
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Normalize /api paths to /api/index.html
    if (path === '/api' || path === '/api/' || path === '/api/index' || path === '/api/index.html') {
      const assetRequest = new Request(new URL('/api/index.html', url), request);
      const asset = await env.ASSETS.fetch(assetRequest);
      // Clone with no-store so CDN doesn't cache the wrong content
      const clone = new Response(asset.body, {
        status: 200,
        headers: {
          'content-type': 'text/html; charset=utf-8',
          'cache-control': 'no-store'
        }
      });
      return clone;
    }

    // All other requests: pass through to Assets
    return env.ASSETS.fetch(request);
  }
};
