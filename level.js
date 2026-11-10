// ── Level preference: middle school or high school ──────────────────────────
// Asked once on the home page, then stored as the SBSettings 'defaultLevel'
// that the Settings page has always used. Every tool opens on that level
// instead of making you choose again.
//
// There is always a way back: the tools show "MIDDLE SCHOOL · CHANGE", and the
// Settings page has the same control. A preference should never be a dead end.
//
// Load this AFTER a page's own script, so the page has already applied its
// saved defaults by the time we tidy the panel away.
(function () {
  var S = window.SBSettings;
  if (!S) return;

  function get() {
    var v = S.get('defaultLevel');
    return (v === 'MS' || v === 'HS') ? v : null;
  }

  function set(v) { S.set('defaultLevel', v); }
  function clear() { S.set('defaultLevel', ''); }
  function label(v) { return v === 'MS' ? 'MIDDLE SCHOOL' : 'HIGH SCHOOL'; }

  window.SBLevel = { get: get, set: set, clear: clear, label: label };

  // ── the one-time question, home page only ────────────────────────────────
  function ask() {
    var box = document.getElementById('level-ask');
    if (!box) return;                       // not the home page
    if (get() || S.get('levelAsked')) { pointLinks(); return; }

    // Show it, then fade it in on the next frame so the transition runs.
    box.style.display = 'flex';
    box.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { box.classList.add('is-open'); });
    });

    var closed = false;
    function choose(v) {
      if (closed) return;
      closed = true;
      if (v) set(v);
      S.set('levelAsked', true);
      box.setAttribute('aria-hidden', 'true');
      pointLinks();
      // Fade out, then take it off the page entirely.
      box.classList.remove('is-open');
      setTimeout(function () { box.style.display = 'none'; }, 320);
    }

    var picks = box.querySelectorAll('[data-pick]');
    for (var i = 0; i < picks.length; i++) {
      (function (btn) {
        btn.addEventListener('click', function () {
          var v = btn.getAttribute('data-pick');
          choose(v === 'MS' || v === 'HS' ? v : null);
        });
      })(picks[i]);
    }

    // Escape dismisses it the same way "not sure yet" does.
    document.addEventListener('keydown', function esc(e) {
      if (e.key === 'Escape' && !closed) {
        choose(null);
        document.removeEventListener('keydown', esc);
      }
    });

    var first = box.querySelector('[data-pick]');
    if (first) first.focus();
  }

  // Send level-specific links straight to the chosen level's page.
  function pointLinks() {
    var lvl = get();
    if (!lvl) return;
    var links = document.querySelectorAll('[data-level-link]');
    for (var i = 0; i < links.length; i++) {
      links[i].href = links[i].getAttribute('data-level-link').replace('{L}', lvl);
    }
  }

  // ── fold the level buttons away in Practice and Buzzer ───────────────────
  function fold() {
    var panel = document.getElementById('ranks');
    var lvl = get();
    if (!panel || !lvl) return;

    var btns = panel.querySelectorAll('button');
    if (!btns.length) return;

    var row = document.createElement('div');
    row.className = 'level-chosen';

    var val = document.createElement('span');
    val.className = 'level-chosen-val';
    val.textContent = label(lvl);

    var change = document.createElement('button');
    change.type = 'button';
    change.className = 'level-change';
    change.textContent = 'CHANGE';

    row.appendChild(val);
    row.appendChild(change);
    panel.appendChild(row);

    for (var i = 0; i < btns.length; i++) btns[i].style.display = 'none';

    change.addEventListener('click', function () {
      // Forget the preference and hand the choice back, with the current pick
      // still highlighted so it's clear what was selected.
      clear();
      panel.removeChild(row);
      for (var j = 0; j < btns.length; j++) btns[j].style.display = '';
      btns[0].focus();
    });
  }

  // ── pre-select the level filter on Browse and Printable Test ─────────────
  // Clicking their own button reuses the page's existing handler, so the
  // filter state stays consistent with however that page tracks it.
  function presetFilter() {
    var lvl = get();
    if (!lvl) return;
    var btn = document.querySelector('.level-btn[data-level="' + lvl + '"]');
    if (btn && btn.className.indexOf('active') === -1) btn.click();
  }

  document.addEventListener('DOMContentLoaded', function () {
    ask();
    pointLinks();
    fold();
    presetFilter();
  });
})();
