const CACHE = 'sbcn-v3';
const ASSETS = [
  '/',
  '/index.html',
  '/Practice.html',
  '/BuzzerHP.html',
  '/Buzzer.html',
  '/LearnTopics.html',
  '/LearnTopics-HS.html',
  '/LearnTopics-MS.html',
  '/Progress.html',
  '/Settings.html',
  '/Browse.html',
  '/PrintableTest.html',
  '/settings.js',
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

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
