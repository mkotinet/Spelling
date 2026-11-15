/**
 * 하루맞춤 (Haru Matchum) - PWA Service Worker & Web Push Engine
 * Handles App Lifecycle, Background Push Notifications, Vibration & Realtime Message Routing
 */

const CACHE_NAME = 'haru-pwa-v2.9.14';

// 1. Service Worker Installation
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// 2. Service Worker Activation
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Web Push Event Listener (Runs in Background & Lock Screen)
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { body: event.data.text() };
    }
  }

  const title = data.title || '💌 하루맞춤 응원 메시지';
  const options = {
    body: data.body || '새로운 응원 메시지와 사진이 도착했어요! ✨',
    icon: data.icon || '/public/icons/icon-192.png',
    badge: data.badge || '/public/icons/badge-72.png',
    image: data.image || undefined, // Photo attachment preview if present
    vibrate: [200, 100, 200, 100], // Distinctive tactile rhythm
    tag: data.tag || 'haru-msg-' + Date.now(),
    renotify: true,
    requireInteraction: false,
    data: {
      url: data.url || 'https://haru.danminlove.com?openInbox=1',
      messageId: data.messageId || null,
      timestamp: Date.now()
    }
  };

  // Notify any currently open foreground client tabs to trigger custom chime & UI update
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        client.postMessage({
          type: 'HARU_PUSH_RECEIVED',
          payload: data
        });
      }
      // Apple WebKit & W3C mandatory: Always present the OS notification banner
      return self.registration.showNotification(title, options);
    })
  );
});

// 4. Notification Click Listener (Handles tap on lock screen / banner)
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = (event.notification.data && event.notification.data.url)
    ? event.notification.data.url
    : '/?openInbox=1';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Focus existing open window if available
      for (const client of clientList) {
        if (client.url.includes('danminlove.com') && 'focus' in client) {
          client.postMessage({
            type: 'OPEN_INBOX',
            messageId: event.notification.data ? event.notification.data.messageId : null
          });
          return client.focus();
        }
      }
      // If no window is open, open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});

// 5. Fetch Event Listener (Ensures API calls always bypass cache)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Bypass cache completely for API endpoints, uploads, and dynamic version checks
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/data/')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Network-first strategy for HTML and core scripts with graceful fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request);
    })
  );
});
