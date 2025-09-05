/**
 * The Pizza Box NY - Cloudflare Worker
 * Serves static website files with proper routing
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Handle root path
    if (pathname === '/') {
      pathname = '/index.html';
    }

    // Handle common file extensions
    if (!pathname.includes('.')) {
      // If no extension, try adding .html
      pathname += '.html';
    }

    // Try to fetch the file from the site bucket
    try {
      const response = await env.ASSETS.fetch(new Request(url.origin + pathname));
      
      if (response.status === 404) {
        // Try without .html extension for directories
        if (pathname.endsWith('.html')) {
          const altPath = pathname.slice(0, -5);
          const altResponse = await env.ASSETS.fetch(new Request(url.origin + altPath));
          if (altResponse.status !== 404) {
            return altResponse;
          }
        }
        
        // Return 404 page if it exists
        const notFoundResponse = await env.ASSETS.fetch(new Request(url.origin + '/404.html'));
        if (notFoundResponse.status !== 404) {
          return new Response(notFoundResponse.body, {
            status: 404,
            headers: notFoundResponse.headers
          });
        }
      }

      return response;
    } catch (error) {
      console.error('Error serving file:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  }
};
