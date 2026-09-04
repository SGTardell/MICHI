const CACHE_NAME = 'michi-pwa-v4';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept native iOS / Android PWA Share Target POST requests (/share-target)
  if (event.request.method === 'POST' && url.pathname.endsWith('/share-target')) {
    event.respondWith((async () => {
      try {
        const formData = await event.request.formData();
        const title = formData.get('title') || '';
        const text = formData.get('text') || '';
        const sharedUrl = formData.get('url') || '';
        const imageFile = formData.get('media');

        // Extract URL from text if URL parameter is empty but text contains a link
        let finalUrl = sharedUrl;
        if (!finalUrl && text) {
          const urlMatch = text.match(/(https?:\/\/[^\s]+)/gi);
          if (urlMatch && urlMatch.length > 0) {
            finalUrl = urlMatch[0];
          }
        }

        // Extract Hashtags (e.g. #Travel, #Work, #Ideas)
        const combinedText = `${title} ${text} ${finalUrl}`;
        const hashtagMatches = combinedText.match(/#(\w+)/g) || [];
        const tags = hashtagMatches.map(t => t.replace('#', ''));

        // Handle shared image file if present
        let imageBase64 = '';
        if (imageFile && imageFile.size > 0 && typeof imageFile.arrayBuffer === 'function') {
          try {
            const buffer = await imageFile.arrayBuffer();
            const bytes = new Uint8Array(buffer);
            let binary = '';
            const chunkSize = 8192;
            for (let i = 0; i < bytes.length; i += chunkSize) {
              const sub = bytes.subarray(i, i + chunkSize);
              binary += String.fromCharCode.apply(null, sub);
            }
            imageBase64 = `data:${imageFile.type || 'image/png'};base64,${btoa(binary)}`;
          } catch (imgErr) {
            console.error('Error parsing image in SW:', imgErr);
          }
        }

        const sharedPayload = {
          title: title || 'Shared Clip',
          text: text,
          url: finalUrl,
          tags: tags,
          image: imageBase64,
          timestamp: Date.now()
        };

        // Save payload into Cache Storage so app.js can pick it up on dashboard load
        const cache = await caches.open('michi-shared-clips');
        await cache.put(
          new Request('/latest-share.json'),
          new Response(JSON.stringify(sharedPayload), {
            headers: { 'Content-Type': 'application/json' }
          })
        );

        // Redirect user to dashboard with query parameters
        const redirectUrl = new URL('/dashboard.html', event.request.url);
        redirectUrl.searchParams.set('shared', '1');
        if (finalUrl) redirectUrl.searchParams.set('url', finalUrl);
        if (title) redirectUrl.searchParams.set('title', title.substring(0, 120));

        return Response.redirect(redirectUrl.href, 303);
      } catch (err) {
        console.error('Share Target POST Error:', err);
        return Response.redirect('/dashboard.html?shared=1', 303);
      }
    })());
    return;
  }

  // Standard Network-first fetch handler
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
