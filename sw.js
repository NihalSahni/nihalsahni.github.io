const CACHE = 'sbcn-v12';
const ASSETS = [
  '/',
  '/index.html',
  '/Practice/',
  '/Buzzer/',
  '/LearnTopics/',
  '/LearnTopics-HS/',
  '/LearnTopics-MS/',
  '/Progress/',
  '/Settings/',
  '/Browse/',
  '/PrintableTest/',
  '/FAQ/',
  '/settings.js',
  '/starfield.js',
  '/level.js',
  '/style.css',
  '/question.js',
  '/Practice.js',
  '/Flashcards.js',
  '/Learn.js',
  '/Buzzer.js',
  'https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Save a copy for next time. Opaque cross-origin responses (status 0) and
// errors can't be cached, so skip those.
function store(request, response) {
  if (!response || !response.ok || response.type === 'opaque') return response;
  const copy = response.clone();
  caches.open(CACHE).then(c => c.put(request, copy)).catch(() => {});
  return response;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Live multiplayer traffic must never be served from a cache.
  if (url.pathname.startsWith('/parties/') || url.protocol === 'ws:' || url.protocol === 'wss:') return;

  // Pages: network first, so an edit shows up on the next visit without having
  // to bump CACHE by hand. Falls back to the cached copy when offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req)
        .then(res => store(req, res))
        .catch(() => caches.match(req).then(hit => hit || caches.match('/index.html')))
    );
    return;
  }

  // Everything else: answer from cache for speed, then refresh the copy in the
  // background so the next load gets the new version.
  e.respondWith(
    caches.match(req).then(cached => {
      const fresh = fetch(req).then(res => store(req, res)).catch(() => cached);
      return cached || fresh;
    })
  );
});
