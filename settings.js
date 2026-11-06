(function () {
  var DEFAULTS = { sound: true, scanlines: true, starfield: true };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('sb_settings') || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }

  // Apply accent color immediately to avoid a color flash on load
  var _s = load();
  if (_s.accent) document.documentElement.style.setProperty('--cyan', _s.accent);

  // Does this person's system ask for less animation? style.css hides the
  // moving background when it does; we also need to stop it being drawn.
  var reduceMotion = false;
  try {
    reduceMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  } catch (e) { reduceMotion = false; }

  // The drifting starfield canvas is the only thing on this site that animates
  // via requestAnimationFrame. When it isn't being shown — switched off in
  // Settings, or the system asked for reduced motion — its loop would otherwise
  // keep redrawing an invisible canvas forever and drain the battery, so stop
  // the frames from being delivered at all.
  //
  // HEADS UP: this turns off requestAnimationFrame for the whole page. If you
  // ever add an animation that is NOT the starfield, don't rely on this —
  // give that animation its own check against SBSettings.reduceMotion.
  if (reduceMotion || _s.starfield === false) {
    window.requestAnimationFrame = function () { return 0; };
    window.cancelAnimationFrame = function () {};
  }

  window.SBSettings = {
    get: function (key) { return load()[key]; },
    set: function (key, val) { var s = load(); s[key] = val; localStorage.setItem('sb_settings', JSON.stringify(s)); },
    all: function () { return load(); },
    reduceMotion: reduceMotion
  };

  document.addEventListener('DOMContentLoaded', function () {
    var s = load();
    if (reduceMotion || !s.scanlines) { var sl = document.getElementById('scanlines'); if (sl) sl.style.display = 'none'; }
    if (reduceMotion || !s.starfield) { var sf = document.getElementById('starfield'); if (sf) sf.style.display = 'none'; }
  });
})();
