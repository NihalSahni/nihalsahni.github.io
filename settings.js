(function () {
  var DEFAULTS = { sound: true, scanlines: true, starfield: true };

  function load() {
    try { return Object.assign({}, DEFAULTS, JSON.parse(localStorage.getItem('sb_settings') || '{}')); }
    catch (e) { return Object.assign({}, DEFAULTS); }
  }

  // Apply accent color immediately to avoid a color flash on load
  var _s = load();
  if (_s.accent) document.documentElement.style.setProperty('--cyan', _s.accent);

  window.SBSettings = {
    get: function (key) { return load()[key]; },
    set: function (key, val) { var s = load(); s[key] = val; localStorage.setItem('sb_settings', JSON.stringify(s)); },
    all: function () { return load(); }
  };

  document.addEventListener('DOMContentLoaded', function () {
    var s = load();
    if (!s.scanlines) { var sl = document.getElementById('scanlines'); if (sl) sl.style.display = 'none'; }
    if (!s.starfield) { var sf = document.getElementById('starfield'); if (sf) sf.style.display = 'none'; }
  });
})();
