// Mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const q = item.querySelector('.faq-q');
  const a = item.querySelector('.faq-a');
  q.addEventListener('click', () => {
    const open = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-a').style.maxHeight = null;
    });
    if (!open) {
      item.classList.add('open');
      a.style.maxHeight = a.scrollHeight + 'px';
    }
  });
});

// Lead form -> WhatsApp deep link
const WA_NUMBER = '212693981822';
document.getElementById('leadForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const err = document.getElementById('formErr');
  const name = document.getElementById('fName').value.trim();
  const phone = document.getElementById('fPhone').value.trim();
  const type = document.getElementById('fType').value;
  const budget = document.getElementById('fBudget').value;
  const msg = document.getElementById('fMsg').value.trim();

  if (!name || !phone || !type) {
    err.textContent = '⚠️ عمر الخانات الضرورية: الاسم، الهاتف، ونوع المشروع.';
    return;
  }
  if (!/^[+\d][\d\s-]{7,}$/.test(phone)) {
    err.textContent = '⚠️ رقم الهاتف ما بانش صحيح — تأكد منو.';
    return;
  }
  err.textContent = '';

  const lines = [
    '🖥️ طلب جديد من الموقع',
    '━━━━━━━━━━━━',
    '👤 الاسم: ' + name,
    '📞 الهاتف: ' + phone,
    '🏷️ نوع المشروع: ' + type,
  ];
  if (budget) lines.push('💰 الميزانية: ' + budget);
  if (msg) lines.push('📝 الوصف: ' + msg);
  lines.push('━━━━━━━━━━━━');

  window.open('https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(lines.join('\n')), '_blank');
});
