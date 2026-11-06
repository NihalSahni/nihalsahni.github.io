// ── Drifting starfield background ────────────────────────────────────────────
// Draws into <canvas id="starfield"> on any page that has one.
//
// This used to be copy-pasted into ten different files, which meant every page
// shipped its own copy and any change had to be made ten times. It lives here
// now. Load it with:  <script src="/starfield.js"></script>
//
// Three of the old copies ran flat out at the screen's full refresh rate and
// kept drawing while the tab was in the background. This version throttles to
// ~30fps and stops entirely when the tab is hidden.
//
// It draws nothing at all when the person has switched the starfield off in
// Settings, or their system asks for reduced motion — settings.js reports that
// via SBSettings, and style.css hides the canvas to match.
(function () {
  var canvas = document.getElementById('starfield');
  if (!canvas || !canvas.getContext) return;

  // Respect the same choices settings.js applies. Checked here too so we never
  // even allocate the stars when nothing will be shown.
  var S = window.SBSettings;
  if (S && (S.reduceMotion === true || S.get('starfield') === false)) return;

  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var STAR_COUNT = 200;
  var FRAME_MS = 33;          // ~30fps is plenty for drifting dots
  var stars = [];
  var last = 0;
  var raf = null;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function init() {
    stars = [];
    for (var i = 0; i < STAR_COUNT; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        speed: Math.random() * 0.25 + 0.04,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
  }

  function draw(ts) {
    if (ts - last >= FRAME_MS) {
      last = ts;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232,244,255,' + s.opacity + ')';
        ctx.fill();
        s.y += s.speed;
        if (s.y > canvas.height) {
          s.y = 0;
          s.x = Math.random() * canvas.width;
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }

  function start() { if (raf === null) raf = requestAnimationFrame(draw); }
  function stop() {
    if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
  }

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  window.addEventListener('resize', function () { resize(); init(); });

  resize();
  init();
  start();
})();
