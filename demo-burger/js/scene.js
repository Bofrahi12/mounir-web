/* ================================================================
   SMASH HOUSE — scene.js: محرك المشهد التحريري ثلاثي الأبعاد.
   - SCENES/LAYER_SRC: choreography الطبقات (x/y/z/s/rz/ry/o/dk).
   - وضع متحرك: تثبيت + تمرير (GSAP ScrollTrigger + Lenis).
   - وضع ثابت (static): بلا WebGL — حركة مخفّضة، جهاز ضعيف،
     فشل WebGL، أو تأخر التهيئة > ثانيتين. الصفحة كاملة بلا به.
   - WebGL كيتحمّل بتكاسل بعد load + idle. المحتوى ما كيتسناهش.
   ================================================================ */

/* ================== بيانات المشاهد ================== */
const KF = (x, y, z, s, rz, ry, o, dk) => ({ x, y, z, s, rz, ry, o, dk: dk || 0 });
const SCENES = [
  { id: 'opening', cam: { x: 0, y: 0, z: 10.6 }, layers: {
    glow:       KF(0, .2, -3.5, 1, 0, 0, .9),
    screen:     KF(.95, -.05, 0, 1, 0, -.06, 1),
    box:        KF(3.6, -2.2, -1.2, .34, .06, -.2, 0),
    cardDouble: KF(-3.4, -2.4, -1.6, .5, -.05, .2, 0),
    cardClassic:KF(3.9, 2.3, -2, .5, .04, -.15, 0),
    cardExp:    KF(-3.8, 2.2, -2.2, .5, -.03, .18, 0),
    patty:      KF(-2.6, 1.9, -1.4, .5, 0, .1, 0)
  }},
  { id: 'layers', cam: { x: 0, y: 0, z: 9.6 }, layers: {
    glow:       KF(-.5, .3, -3.5, 1.05, 0, 0, .8),
    screen:     KF(-2.3, .7, -.4, .74, .03, .22, 1),
    box:        KF(2.5, -.5, .3, .78, -.03, -.18, 1),
    cardDouble: KF(-3.6, -2.3, -1.6, .5, -.05, .2, 0),
    cardClassic:KF(3.9, 2.4, -2, .5, .04, -.15, 0),
    cardExp:    KF(-3.9, 2.4, -2.2, .5, -.03, .18, 0),
    patty:      KF(.4, -.9, 1.6, .62, .05, -.1, 1)
  }},
  { id: 'reveal', cam: { x: 0, y: 0, z: 8.2 }, layers: {
    glow:       KF(0, 0, -3.5, 1.1, 0, 0, .55),
    screen:     KF(-3.4, 1.8, -1.8, .5, .05, .3, .28, .5),
    box:        KF(0, .1, .4, 1.85, 0, 0, 1),
    cardDouble: KF(-3.8, -2.2, -2, .5, -.06, .25, .2, .55),
    cardClassic:KF(3.9, 2.2, -2.2, .5, .05, -.2, .2, .55),
    cardExp:    KF(-3.9, -2.4, -2.4, .5, -.04, .2, .15, .6),
    patty:      KF(2.9, -2, .8, .5, .04, -.15, .3, .4)
  }},
  { id: 'works', cam: { x: -.7, y: .35, z: 9.8 }, layers: {
    glow:       KF(.4, 0, -3.5, 1.05, 0, 0, .7),
    screen:     KF(-2.9, 1.5, -.8, .62, .04, .2, .85, .25),
    box:        KF(3, 1.7, -1.2, .66, -.03, -.16, .85, .25),
    cardDouble: KF(.2, -.2, .9, 1.06, -.02, -.05, 1),
    cardClassic:KF(-3.1, -1.7, -.4, .72, .05, .14, .8, .3),
    cardExp:    KF(3.2, -1.6, -.6, .74, -.05, -.12, .8, .3),
    patty:      KF(-.4, 2.3, -1.8, .45, 0, .1, 0)
  }},
  { id: 'closing', cam: { x: 0, y: 0, z: 10.4 }, layers: {
    glow:       KF(0, .4, -3.5, 1, 0, 0, .8),
    screen:     KF(0, .85, 0, .82, 0, 0, 1),
    box:        KF(3.6, -2.2, -1.4, .4, .05, -.2, 0),
    cardDouble: KF(-3.5, -2.3, -1.8, .5, -.05, .2, 0),
    cardClassic:KF(3.9, 2.3, -2.2, .5, .04, -.15, 0),
    cardExp:    KF(-3.8, 2.2, -2.4, .5, -.03, .18, 0),
    patty:      KF(-2.7, 2, -1.6, .5, 0, .1, 0)
  }}
];
const LAYER_SRC = {
  screen:     { make: 'screen', src: 'demo-burger/img/hero.webp',   url: 'smash.house', w: 6.6 },
  box:        { make: 'photo',  src: 'demo-burger/img/box.webp',    w: 5.4 },
  cardDouble: { make: 'card',   src: 'demo-burger/img/double.jpg',  label: 'DOUBLE SMASH — 65 DH', w: 3.5 },
  cardClassic:{ make: 'card',   src: 'demo-burger/img/classic.jpg', label: 'CLASSIC — 45 DH', w: 3.5 },
  cardExp:    { make: 'card',   src: 'demo-burger/img/exploded.webp', label: 'THE LAYERS — 7', w: 3.5 },
  patty:      { make: 'alpha',  src: 'demo-burger/gl/patty-alpha.webp', w: 3.0 }
};
window.STAGE = { layers: {}, cam: { ...SCENES[0].cam }, ready: false };
Object.keys(SCENES[0].layers).forEach(k => { window.STAGE.layers[k] = { ...SCENES[0].layers[k] }; });

const qs = new URLSearchParams(location.search);
const DEBUG = qs.get('debug') === '1';
const FORCED_P = parseFloat(qs.get('p'));
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
const ST = window.STAGE;
const gsap = window.gsap;

/* ================== قرار الوضع: متحرك أم ثابت ================== */
function webglSupported() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}
function weakDevice() {
  const cores = navigator.hardwareConcurrency || 4;
  const mem = navigator.deviceMemory || 4;
  if (innerWidth < 820 && mem <= 2) return true; /* هاتف ضعيف الذاكرة */
  if (cores <= 2 && mem <= 2) return true;       /* جهاز ضعيف جداً */
  return false;
}
let mode = 'animated';
if (REDUCED || weakDevice() || !webglSupported() || !gsap || !window.ScrollTrigger) mode = 'static';

let tl = null, lenis = null;

function goStatic() {
  if (mode === 'static') { document.body.classList.add('static'); return; }
  mode = 'static';
  document.body.classList.add('static');
  const st = window.ScrollTrigger && ScrollTrigger.getById('stage');
  if (st) st.kill(true); /* revert: كيحيّد التثبيت والـ pin-spacer */
  if (tl) { tl.kill(); tl = null; }
  if (window.ScrollTrigger) ScrollTrigger.refresh();
  const fb = document.getElementById('fallback3d');
  if (fb) fb.classList.remove('gone');
  const gw = document.getElementById('glwrap');
  if (gw) gw.classList.remove('on');
}

/* زر تخطي الحركة */
const skipBtn = document.getElementById('skipAnim');
if (skipBtn) skipBtn.addEventListener('click', () => {
  goStatic();
  const t = document.getElementById('menu');
  if (t) (lenis ? lenis.scrollTo(t) : t.scrollIntoView());
});

/* ================== الوضع المتحرك: الخط الزمني ================== */
if (mode === 'animated') {
  gsap.registerPlugin(ScrollTrigger);
  if (!REDUCED && window.Lenis && isNaN(FORCED_P)) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    window.__lenis = lenis;
  }
  const railDots = document.querySelectorAll('#rail .rdot');
  const dbg = document.getElementById('debug');
  if (DEBUG && dbg) dbg.style.display = 'block';
  tl = gsap.timeline({
    defaults: { ease: 'power1.inOut' },
    scrollTrigger: {
      id: 'stage', trigger: '#stage', start: 'top top', end: '+=460%',
      pin: '#pin', scrub: isNaN(FORCED_P) ? .6 : true, anticipatePin: 1,
      onUpdate(self) {
        const p = self.progress;
        document.getElementById('progress').style.width = (p * 100) + '%';
        const rf = document.getElementById('rfill'); if (rf) rf.style.height = (p * 100) + '%';
        const scene = Math.min(Math.floor(p * 5), 4);
        railDots.forEach((d, i) => d.classList.toggle('on', i === scene));
        const near = [.2, .4, .6, .8].some(b => Math.abs(p - b) < .007);
        document.getElementById('glwrap').classList.toggle('trans', near && ST.ready);
        if (DEBUG && dbg) dbg.textContent = 'progress: ' + (p * 100).toFixed(1) + '%';
      }
    }
  });
  for (let i = 0; i < SCENES.length - 1; i++) {
    const at = i * 20, dur = 20;
    tl.to(ST.cam, { ...SCENES[i + 1].cam, duration: dur }, at);
    Object.keys(SCENES[i].layers).forEach(k => {
      tl.to(ST.layers[k], { ...SCENES[i + 1].layers[k], duration: dur }, at);
    });
  }
  gsap.fromTo('#ov1', { opacity: 0, x: -46 }, { opacity: 1, x: 0, duration: 1.15, delay: .25, ease: 'power3.out' });
  tl.to('#scrollcue', { opacity: 0, duration: 3 }, 15)
    .to('#ov1', { opacity: 0, x: -30, duration: 4 }, 16.5)
    .fromTo('#ov2', { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 4 }, 19.5)
    .to('#ov2', { opacity: 0, duration: 4 }, 36.5)
    .fromTo('#ov3', { opacity: 0 }, { opacity: 1, duration: 4 }, 41.5)
    .fromTo('#ov3 .statement', { y: 56 }, { y: 0, duration: 7, ease: 'power2.out' }, 41.5)
    .to('#ov3', { opacity: 0, duration: 4 }, 56.5)
    .fromTo('#ov4', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 4 }, 60.5)
    .to('#ov4', { opacity: 0, duration: 4 }, 76.5)
    .fromTo('#ov5', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 5 }, 82.5)
    .to({}, { duration: 3 }, 97);
  if (!isNaN(FORCED_P)) {
    setTimeout(() => {
      const st = ScrollTrigger.getById('stage');
      if (st) { st.scroll(st.start + Math.min(Math.max(FORCED_P, 0), 1) * (st.end - st.start)); ScrollTrigger.update(); }
    }, 80);
  }
} else {
  document.body.classList.add('static');
}

/* ================== WebGL: تهيئة كسولة مع مهلة ثانيتين ================== */
function initGL() {
  if (mode !== 'animated') return;
  let settled = false;
  const timeout = setTimeout(() => {
    if (!settled) { settled = true; console.warn('[smash] WebGL slow — static mode'); goStatic(); }
  }, 2000);
  (async () => {
    try {
      const THREE = await import('../gl/three.module.js');
      if (settled || mode !== 'animated') return;
      const canvas = document.getElementById('gl');
      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 820 ? 1.6 : 2));
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);

      const loadImg = src => new Promise((res, rej) => {
        const img = new Image(); if (location.protocol.indexOf('http') === 0) img.crossOrigin = 'anonymous';
        img.onload = () => res(img); img.onerror = rej; img.src = src;
      });
      function cover(ctx, img, x, y, w, h) {
        const ir = img.naturalWidth / img.naturalHeight, r = w / h;
        let sw, sh, sx, sy;
        if (ir > r) { sh = img.naturalHeight; sw = sh * r; sx = (img.naturalWidth - sw) / 2; sy = 0; }
        else { sw = img.naturalWidth; sh = sw / r; sx = 0; sy = (img.naturalHeight - sh) / 2; }
        ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
      }
      function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
      async function screenTexture(src, url) {
        const img = await loadImg(src);
        const c = document.createElement('canvas'); c.width = 1100; c.height = 730;
        const x = c.getContext('2d');
        x.fillStyle = '#101013'; rr(x, 4, 4, 1092, 722, 26); x.fill();
        x.fillStyle = '#17171b'; rr(x, 4, 4, 1092, 74, 26); x.fill(); x.fillRect(4, 52, 1092, 26);
        ['#e8362a', '#f5bf42', '#39d353'].forEach((col, i) => { x.fillStyle = col; x.beginPath(); x.arc(44 + i * 34, 41, 10, 0, 7); x.fill(); });
        x.fillStyle = '#232329'; rr(x, 200, 22, 560, 38, 19); x.fill();
        x.fillStyle = '#9a958a'; x.font = '24px Courier New'; x.fillText('https://' + url, 224, 49);
        x.fillStyle = '#9a958a'; x.font = '22px Courier New'; x.fillText('≡', 1030, 50);
        x.save(); rr(x, 22, 96, 1056, 612, 14); x.clip(); cover(x, img, 22, 96, 1056, 612); x.restore();
        x.strokeStyle = 'rgba(244,241,234,.16)'; x.lineWidth = 2; rr(x, 4, 4, 1092, 722, 26); x.stroke();
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        return { tex: t, aspect: 730 / 1100 };
      }
      async function cardTexture(src, label) {
        const img = await loadImg(src);
        const c = document.createElement('canvas'); c.width = 800; c.height = 600;
        const x = c.getContext('2d');
        x.fillStyle = '#0c0c0e'; x.fillRect(0, 0, 800, 600);
        cover(x, img, 0, 0, 800, 492);
        x.fillStyle = '#101013'; x.fillRect(0, 492, 800, 108);
        x.fillStyle = '#e8362a'; x.fillRect(28, 522, 34, 4);
        x.fillStyle = '#f4f1ea'; x.font = '700 30px Courier New'; x.fillText(label, 28, 570);
        x.strokeStyle = 'rgba(244,241,234,.22)'; x.lineWidth = 2; x.strokeRect(1, 1, 798, 598);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        return { tex: t, aspect: 600 / 800 };
      }
      async function photoTexture(src) {
        const img = await loadImg(src);
        const c = document.createElement('canvas'); c.width = 1024; c.height = 1024;
        const x = c.getContext('2d'); cover(x, img, 0, 0, 1024, 1024);
        x.strokeStyle = 'rgba(244,241,234,.18)'; x.lineWidth = 3; x.strokeRect(2, 2, 1020, 1020);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        return { tex: t, aspect: 1 };
      }
      async function alphaTexture(src) {
        const img = await loadImg(src);
        const c = document.createElement('canvas'); c.width = img.naturalWidth; c.height = img.naturalHeight;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const d = x.getImageData(0, 0, c.width, c.height), px = d.data;
        let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
        for (let i = 3; i < px.length; i += 16) { if (px[i] > 12) { const n = (i - 3) / 4, X = n % c.width, Y = (n / c.width) | 0;
          if (X < minX) minX = X; if (X > maxX) maxX = X; if (Y < minY) minY = Y; if (Y > maxY) maxY = Y; } }
        const pad = 10; minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
        maxX = Math.min(c.width - 1, maxX + pad); maxY = Math.min(c.height - 1, maxY + pad);
        const cw = maxX - minX + 1, ch = maxY - minY + 1;
        const cc = document.createElement('canvas'); cc.width = cw; cc.height = ch;
        cc.getContext('2d').drawImage(c, minX, minY, cw, ch, 0, 0, cw, ch);
        const t = new THREE.CanvasTexture(cc); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
        return { tex: t, aspect: ch / cw };
      }
      function glowTexture() {
        const c = document.createElement('canvas'); c.width = 512; c.height = 512;
        const x = c.getContext('2d');
        const g = x.createRadialGradient(256, 256, 20, 256, 256, 256);
        g.addColorStop(0, 'rgba(232,54,42,.34)'); g.addColorStop(.55, 'rgba(232,54,42,.10)'); g.addColorStop(1, 'rgba(232,54,42,0)');
        x.fillStyle = g; x.fillRect(0, 0, 512, 512);
        const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
        return { tex: t, aspect: 1 };
      }

      const defs = {
        glow: { make: 'glow' },
        screen: LAYER_SRC.screen, box: LAYER_SRC.box,
        cardDouble: LAYER_SRC.cardDouble, cardClassic: LAYER_SRC.cardClassic,
        cardExp: LAYER_SRC.cardExp, patty: LAYER_SRC.patty
      };
      const meshes = {};
      for (const [key, d] of Object.entries(defs)) {
        let r;
        if (d.make === 'screen') r = await screenTexture(d.src, d.url);
        else if (d.make === 'card') r = await cardTexture(d.src, d.label);
        else if (d.make === 'photo') r = await photoTexture(d.src);
        else if (d.make === 'alpha') r = await alphaTexture(d.src);
        else r = glowTexture();
        if (settled || mode !== 'animated') return;
        const w = key === 'glow' ? 15 : d.w;
        const m = new THREE.Mesh(new THREE.PlaneGeometry(w, w * r.aspect),
          new THREE.MeshBasicMaterial({ map: r.tex, transparent: true, depthWrite: false }));
        m.renderOrder = key === 'glow' ? 0 : 5;
        scene.add(m); meshes[key] = m;
      }
      settled = true; clearTimeout(timeout);
      ST.ready = true;
      (window.__meshes = window.__meshes || []).push(meshes);
      document.getElementById('glwrap').classList.add('on');
      document.getElementById('fallback3d').classList.add('gone');

      let mx = 0, my = 0, visible = true;
      if (matchMedia('(pointer:fine)').matches)
        addEventListener('pointermove', e => { mx = e.clientX / innerWidth - .5; my = e.clientY / innerHeight - .5; }, { passive: true });
      new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(document.getElementById('stage'));
      function resize() {
        const w = canvas.clientWidth || innerWidth, h = canvas.clientHeight || innerHeight;
        renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
      }
      resize(); addEventListener('resize', resize);

      function tick(t) {
        requestAnimationFrame(tick);
        if (!visible || mode !== 'animated') return;
        const ms = innerWidth < 820 ? .62 : 1;
        for (const [key, m] of Object.entries(meshes)) {
          const L = ST.layers[key]; if (!L) continue;
          m.position.set(L.x * (innerWidth < 820 ? .45 : 1), L.y, L.z);
          m.rotation.set(0, L.ry + mx * .12, L.rz);
          const sc = L.s * ms; m.scale.set(sc, sc, 1);
          m.material.opacity = L.o;
          m.renderOrder = 5 + L.z * 2;
          const dk = 1 - (L.dk || 0) * .75;
          m.material.color.setScalar(dk);
        }
        camera.position.set(ST.cam.x + mx * .35, ST.cam.y - my * .25 + Math.sin(t * .0004) * .04, ST.cam.z);
        camera.lookAt(ST.cam.x * .6, ST.cam.y * .6, 0);
        renderer.render(scene, camera);
      }
      requestAnimationFrame(tick);
    } catch (e) {
      clearTimeout(timeout);
      if (!settled) { settled = true; console.warn('[smash] WebGL failed — static mode', e); goStatic(); }
    }
  })();
}
if (mode === 'animated') {
  if (document.readyState === 'complete') {
    if (window.requestIdleCallback) requestIdleCallback(initGL, { timeout: 600 });
    else setTimeout(initGL, 60);
  } else {
    addEventListener('load', () => {
      if (window.requestIdleCallback) requestIdleCallback(initGL, { timeout: 600 });
      else setTimeout(initGL, 60);
    });
  }
}
