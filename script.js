/* ===== Tanja Web — script.js =====
   Analytics: events are pushed to window.dataLayer and, if a GoatCounter
   code is set below, sent to GoatCounter (privacy-friendly, no cookies).
   To activate: put the account code in TW_GOATCOUNTER (e.g. 'tanjaweb'). */
const TW_GOATCOUNTER = '';
window.dataLayer = window.dataLayer || [];
function trackEvent(name, detail) {
  window.dataLayer.push({ event: name, detail: detail || '', ts: Date.now() });
  if (TW_GOATCOUNTER && window.goatcounter && window.goatcounter.count) {
    window.goatcounter.count({ path: 'event/' + name, title: name, event: true });
  }
}
if (TW_GOATCOUNTER) {
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://gc.zgo.at/count.js';
  s.dataset.goatcounter = 'https://' + TW_GOATCOUNTER + '.goatcounter.com/count';
  document.head.appendChild(s);
}

/* --- Mobile menu (accessible) --- */
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
function closeMenu(returnFocus) {
  navLinks.classList.remove('open');
  burger.setAttribute('aria-expanded', 'false');
  burger.setAttribute('aria-label', 'فتح القائمة');
  if (returnFocus) burger.focus();
}
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'إغلاق القائمة' : 'فتح القائمة');
  });
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => closeMenu(false)));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) closeMenu(true);
  });
  document.addEventListener('click', e => {
    if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && e.target !== burger) closeMenu(false);
  });
}

/* --- FAQ accordion --- */
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  if (!q || !a) return;
  q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
      const oq = o.querySelector('.faq-q');
      if (oq) oq.setAttribute('aria-expanded', 'false');
    });
    if (!open) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
      q.setAttribute('aria-expanded', 'true');
    }
  });
});

/* --- Service preselect: any [data-service] button fills the form type --- */
document.querySelectorAll('[data-service]').forEach(btn => {
  btn.addEventListener('click', () => {
    const sel = document.getElementById('fType');
    if (sel) sel.value = btn.getAttribute('data-service');
    trackEvent('service_select', btn.getAttribute('data-service'));
  });
});

/* --- Click tracking (WhatsApp, email, tracked CTAs, work cards) --- */
document.querySelectorAll('a[href*="wa.me"]').forEach(a =>
  a.addEventListener('click', () => trackEvent('whatsapp_click', a.className || 'link')));
document.querySelectorAll('a[href^="mailto:"]').forEach(a =>
  a.addEventListener('click', () => trackEvent('email_click', '')));
document.querySelectorAll('[data-track]').forEach(a =>
  a.addEventListener('click', () => trackEvent(a.getAttribute('data-track'), a.getAttribute('href') || '')));

/* --- Lead form -> WhatsApp deep link --- */
const WA_NUMBER = '212693981822';
const leadForm = document.getElementById('leadForm');
if (leadForm) {
  let formStarted = false;
  leadForm.addEventListener('focusin', () => {
    if (!formStarted) { formStarted = true; trackEvent('form_start', ''); }
  });
  leadForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const err = document.getElementById('formErr');
    const ok = document.getElementById('formOk');
    const name = document.getElementById('fName').value.trim();
    const phone = document.getElementById('fPhone').value.trim();
    const type = document.getElementById('fType').value;
    const budget = document.getElementById('fBudget').value;
    const msg = document.getElementById('fMsg').value.trim();

    if (!name || !phone || !type) {
      err.textContent = '⚠️ عمر الخانات الضرورية: الاسم، الهاتف، ونوع المشروع.';
      ok.style.display = 'none';
      return;
    }
    if (!/^[+\d][\d\s-]{7,}$/.test(phone)) {
      err.textContent = '⚠️ رقم الهاتف ما بانش صحيح — تأكد منو.';
      ok.style.display = 'none';
      return;
    }
    err.textContent = '';

    const lines = [
      'السلام عليكم، شفت الموقع وبغيت نستفسر على تصميم موقع لمشروعي.',
      '',
      'الاسم: ' + name,
      'رقم الهاتف: ' + phone,
      'نوع المشروع: ' + type,
    ];
    if (budget) lines.push('الميزانية: ' + budget);
    if (msg) lines.push('وصف المشروع: ' + msg);

    const waUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n'));
    trackEvent('form_submit', type);
    window.open(waUrl, '_blank');
    ok.innerHTML = '✅ <strong>وجدنا ليك الرسالة!</strong> تحل واتساب في تبويب جديد — غير ضغط «إرسال». ' +
      'إلا ما تحلش، <a href="' + waUrl + '" target="_blank" rel="noopener">ضغط هنا باش تكمل في واتساب</a>.';
    ok.style.display = 'block';
    ok.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
