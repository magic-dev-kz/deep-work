const CACHE = 'deepwork-v25';
const ASSETS = ['./', './index.html'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
// v21: Push notification support
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  const title = data.title || 'Deep Work Timer';
  const options = {
    body: data.body || 'Time to focus!',
    icon: data.icon || '',
    badge: data.badge || '',
    tag: 'deepwork-push'
  };
  e.waitUntil(self.registration.showNotification(title, options));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.matchAll({ type: 'window' }).then(list => {
    for (const client of list) {
      if (client.url.includes('deep-work') && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow('./');
  }));
});
