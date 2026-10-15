/* ================================================================
   SMASH HOUSE — app.js: تنقل، فلاتر القائمة، ظهور العناصر،
   العدادات، شريط متحرك، والسنة. (الطلب في order.js،
   والمشهد ثلاثي الأبعاد في scene.js)
   ================================================================ */
(function () {
  'use strict';
  var CFG = window.SMASH_CONFIG || {};

  /* ---------- Loader: كيختفي بسرعة، ما كيحبس حتى واحد ---------- */
  var loader = document.getElementById('loader');
  function hideLoader() {
    if (!loader || loader.classList.contains('done')) return;
    loader.classList.add('done');
    setTimeout(function () { loader.style.display = 'none'; }, 500);
  }
  if (document.readyState === 'complete') hideLoader();
  else window.addEventListener('load', hideLoader);
  setTimeout(hideLoader, 1200); /* سقف صارم: 1.2 ثانية */

  /* ---------- الهيدر عند التمرير ---------- */
  var hdr = document.getElementById('hdr');
  window.addEventListener('scroll', function () {
    hdr.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* ---------- معلومات المطعم من الإعدادات (إلا متوفرة) ---------- */
  var infoGrid = document.getElementById('infoGrid');
  if (infoGrid && CFG) {
    infoGrid.querySelectorAll('[data-info]').forEach(function (el) {
      var key = el.getAttribute('data-info');
      var val = CFG[key];
      if (val == null || val === '') { el.remove(); return; }
      var v = el.querySelector('.val');
      if (v) v.textContent = val;
      if (key === 'mapsUrl' && v) { v.textContent = 'افتح في خرائط جوجل'; v.setAttribute('href', val); }
      if ((key === 'instagram' || key === 'facebook') && v) { v.setAttribute('href', val); v.textContent = val.replace(/^https?:\/\//, ''); }
    });
  }

  /* ---------- فلاتر القائمة ---------- */
  var chips = document.querySelectorAll('.chip[data-filter]');
  var cards = document.querySelectorAll('#menuGrid .card[data-cat]');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chips.forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
      chip.setAttribute('aria-pressed', 'true');
      var f = chip.getAttribute('data-filter');
      cards.forEach(function (card) {
        card.hidden = !(f === 'all' || card.getAttribute('data-cat') === f);
      });
    });
  });

  /* ---------- ظهور العناصر عند التمرير ---------- */
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });

  /* ---------- العدادات ---------- */
  var cio = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var end = +e.target.getAttribute('data-count'), t0 = null;
      function step(ts) {
        if (!t0) t0 = ts;
        var p = Math.min((ts - t0) / 1400, 1);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: .5 });
  document.querySelectorAll('[data-count]').forEach(function (el) { cio.observe(el); });

  /* ---------- الشريط المتحرك: كيوقف ملي يخرج من الشاشة ---------- */
  var mq = document.querySelector('.marquee');
  if (mq) {
    new IntersectionObserver(function (es) {
      mq.classList.toggle('paused', !es[0].isIntersecting);
    }).observe(mq);
  }

  /* ---------- روابط داخلية: تمرير سلس (Lenis إلا كان خدام) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (id.length < 2) return;
      var t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      if (window.__lenis) window.__lenis.scrollTo(t);
      else t.scrollIntoView({ behavior: 'smooth' });
    });
  });

  /* ---------- سنة الفوتر ---------- */
  var yr = document.getElementById('year');
  if (yr) yr.textContent = new Date().getFullYear();
})();
