/* ================================================================
   SMASH HOUSE — نظام الطلب (order.js)
   سلة + نافذة منتج + نافذة إتمام → رسالة واتساب منظمة.
   كل الأرقام والاسم من SMASH_CONFIG (config.js) — بلا تكرار.
   أزرار «اطلب» في HTML روابط واتساب مباشرة؛ هذا الملف كيحوّلها
   لتجربة النافذة عند توفر JavaScript (تحسين تدريجي).
   ================================================================ */
(function () {
  'use strict';
  var CFG = window.SMASH_CONFIG || {};
  var WA = CFG.whatsapp || '212693981822';
  var CUR = CFG.currency || 'DH';
  var CHEESE_PRICE = 5; // جبن إضافي — من data/menu.json (extras)

  /* ---------- فهرس المنتجات من أزرار القائمة نفسها ---------- */
  var PRODUCTS = {};
  document.querySelectorAll('[data-order][data-id]').forEach(function (btn) {
    PRODUCTS[btn.getAttribute('data-id')] = {
      id: btn.getAttribute('data-id'),
      name: btn.getAttribute('data-name'),
      price: parseFloat(btn.getAttribute('data-price')) || 0,
      img: btn.getAttribute('data-img') || '',
      extras: (btn.getAttribute('data-extras') || '') === 'cheese'
    };
  });

  /* ---------- السلة ---------- */
  var cart = new Map(); // id -> {id,name,price,img,cheese,qty}
  function lineTotal(l) { return l.price * l.qty + (l.cheese ? CHEESE_PRICE : 0); }
  function cartCount() { var n = 0; cart.forEach(function (l) { n += l.qty; }); return n; }
  function cartTotal() { var t = 0; cart.forEach(function (l) { t += lineTotal(l); }); return t; }

  /* ---------- عناصر DOM ---------- */
  var cartbar = document.getElementById('cartbar');
  var cartSum = document.getElementById('cartSum');
  var itemModal = document.getElementById('itemModal');
  var checkoutModal = document.getElementById('checkoutModal');
  var lastFocus = null;

  function refreshBar() {
    var n = cartCount(), t = cartTotal();
    if (n > 0) {
      cartbar.classList.add('show'); cartbar.classList.remove('empty');
      cartSum.innerHTML = 'الطلب: <b>' + n + '</b> منتجات — المجموع <b>' + t + ' ' + CUR + '</b>';
      document.body.classList.add('with-bar');
    } else {
      cartbar.classList.add('show', 'empty');
      document.body.classList.toggle('with-bar', window.matchMedia('(max-width:820px)').matches);
    }
  }
  window.addEventListener('resize', refreshBar);

  /* ---------- إدارة النوافذ ---------- */
  function openModal(m) {
    lastFocus = document.activeElement;
    m.hidden = false;
    document.body.classList.add('locked');
    var f = m.querySelector('input[type="text"], input[type="tel"], textarea') ||
            m.querySelector('.qty button') || m.querySelector('button');
    setTimeout(function () { if (f) f.focus(); }, 40);
  }
  function closeModal(m) {
    m.hidden = true;
    if (itemModal.hidden && checkoutModal.hidden) document.body.classList.remove('locked');
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  [itemModal, checkoutModal].forEach(function (m) {
    if (!m) return;
    m.querySelector('.scrim').addEventListener('click', function () { closeModal(m); });
    m.querySelectorAll('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () { closeModal(m); });
    });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (!checkoutModal.hidden) closeModal(checkoutModal);
    else if (!itemModal.hidden) closeModal(itemModal);
  });

  /* ---------- نافذة المنتج ---------- */
  var cur = null; // {product, qty, cheese}
  var imImg = document.getElementById('imImg'), imName = document.getElementById('imName'),
      imPrice = document.getElementById('imPrice'), imQty = document.getElementById('imQty'),
      imTotal = document.getElementById('imTotal'), imCheeseRow = document.getElementById('imCheeseRow'),
      imCheese = document.getElementById('imCheese');

  function renderItem() {
    var p = cur.product;
    imImg.src = p.img; imImg.alt = p.name;
    imName.textContent = p.name;
    imPrice.textContent = p.price + ' ' + CUR;
    imQty.textContent = cur.qty;
    imCheeseRow.style.display = p.extras ? '' : 'none';
    imCheese.checked = cur.cheese;
    imTotal.textContent = (p.price * cur.qty + (cur.cheese && p.extras ? CHEESE_PRICE : 0)) + ' ' + CUR;
  }
  function openItem(id) {
    var p = PRODUCTS[id];
    if (!p) return false;
    var existing = cart.get(id);
    cur = { product: p, qty: existing ? existing.qty : 1, cheese: existing ? existing.cheese : false };
    renderItem();
    openModal(itemModal);
    return true;
  }
  document.getElementById('imMinus').addEventListener('click', function () { if (cur.qty > 1) { cur.qty--; renderItem(); } });
  document.getElementById('imPlus').addEventListener('click', function () { if (cur.qty < 30) { cur.qty++; renderItem(); } });
  imCheese.addEventListener('change', function () { cur.cheese = imCheese.checked; renderItem(); });
  function saveItem() {
    cart.set(cur.product.id, {
      id: cur.product.id, name: cur.product.name, price: cur.product.price,
      img: cur.product.img, cheese: cur.cheese && cur.product.extras, qty: cur.qty
    });
    refreshBar();
  }
  document.getElementById('imAdd').addEventListener('click', function () { saveItem(); closeModal(itemModal); });
  document.getElementById('imNow').addEventListener('click', function () { saveItem(); closeModal(itemModal); openCheckout(); });

  /* ---------- نافذة إتمام الطلب ---------- */
  var coLines = document.getElementById('coLines'), coTotal = document.getElementById('coTotal'),
      feeRow = document.getElementById('feeRow'), feeVal = document.getElementById('feeVal');

  function renderCheckout() {
    coLines.innerHTML = '';
    if (cart.size === 0) {
      coLines.innerHTML = '<p class="empty-cart">السلة خاوية — زيد شي حاجة من القائمة أولاً.</p>';
    }
    cart.forEach(function (l) {
      var row = document.createElement('div');
      row.className = 'cart-line';
      row.innerHTML =
        '<div><div class="nm"></div><div class="dt"></div>' +
        '<button type="button" class="rm">حذف</button></div>' +
        '<div style="display:flex;align-items:center;gap:12px"><span class="qty">' +
        '<button type="button" aria-label="إنقاص">−</button><output></output><button type="button" aria-label="زيادة">+</button></span>' +
        '<span class="lt"></span></div>';
      row.querySelector('.nm').textContent = l.name;
      row.querySelector('.dt').textContent = l.price + ' ' + CUR + (l.cheese ? ' · + جبن إضافي ' + CHEESE_PRICE + ' ' + CUR : '');
      row.querySelector('output').textContent = l.qty;
      row.querySelector('.lt').textContent = lineTotal(l) + ' ' + CUR;
      var btns = row.querySelectorAll('.qty button');
      btns[0].addEventListener('click', function () { l.qty = Math.max(1, l.qty - 1); renderCheckout(); refreshBar(); });
      btns[1].addEventListener('click', function () { l.qty = Math.min(30, l.qty + 1); renderCheckout(); refreshBar(); });
      row.querySelector('.rm').addEventListener('click', function () { cart.delete(l.id); renderCheckout(); refreshBar(); });
      coLines.appendChild(row);
    });
    var total = cartTotal();
    if (CFG.deliveryFee != null) {
      feeRow.style.display = '';
      feeVal.textContent = CFG.deliveryFee + ' ' + CUR;
      total += Number(CFG.deliveryFee) || 0;
    } else { feeRow.style.display = 'none'; }
    coTotal.textContent = total + ' ' + CUR;
  }
  function openCheckout() { renderCheckout(); openModal(checkoutModal); }
  document.getElementById('cartCheckout').addEventListener('click', openCheckout);

  /* ---------- بناء رسالة واتساب (الصيغة المعتمدة) ---------- */
  function buildMessage() {
    var lines = ['السلام عليكم ' + (CFG.name || 'Smash House'), '', 'الطلب:'];
    cart.forEach(function (l) { lines.push('- ' + l.name + ' x' + l.qty + ' = ' + (l.price * l.qty) + ' ' + CUR); });
    var cheeseCount = 0;
    cart.forEach(function (l) { if (l.cheese) cheeseCount++; });
    if (cheeseCount > 0) lines.push('- إضافة جبن x' + cheeseCount + ' = ' + (cheeseCount * CHEESE_PRICE) + ' ' + CUR);
    var total = cartTotal();
    if (CFG.deliveryFee != null) total += Number(CFG.deliveryFee) || 0;
    lines.push('', 'المجموع: ' + total + ' ' + CUR, '');
    lines.push('الاسم: ' + document.getElementById('fName').value.trim());
    lines.push('العنوان: ' + document.getElementById('fAddress').value.trim());
    lines.push('الحي: ' + (document.getElementById('fDistrict').value.trim() || '—'));
    lines.push('ملاحظات: ' + (document.getElementById('fNotes').value.trim() || '—'));
    return lines.join('\n');
  }

  function validate() {
    var ok = true;
    [['fName', 'fldName'], ['fAddress', 'fldAddress']].forEach(function (pair) {
      var input = document.getElementById(pair[0]), fld = document.getElementById(pair[1]);
      var bad = !input.value.trim();
      fld.classList.toggle('invalid', bad);
      input.setAttribute('aria-invalid', bad ? 'true' : 'false');
      if (bad) ok = false;
    });
    return ok;
  }

  document.getElementById('coForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (cart.size === 0) return;
    if (!validate()) return;
    var msg = buildMessage();
    var url = 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg);
    var win = window.open(url, '_blank', 'noopener');
    if (!win) {
      var fb = document.getElementById('waFallback');
      document.getElementById('waPhone').textContent = CFG.phoneDisplay || '';
      document.getElementById('waPhone').href = 'tel:' + (CFG.phoneIntl || '');
      document.getElementById('waDirect').href = url;
      fb.classList.add('show');
    }
  });
  document.getElementById('waCopy').addEventListener('click', function () {
    var msg = buildMessage(), btn = this;
    function done() { btn.textContent = 'تم النسخ ✓'; setTimeout(function () { btn.textContent = 'نسخ الرسالة'; }, 2000); }
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(msg).then(done, done);
    else {
      var ta = document.createElement('textarea');
      ta.value = msg; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch (err) { /* ignore */ }
      ta.remove(); done();
    }
  });

  /* ---------- اعتراض أزرار الطلب (تحسين تدريجي) ---------- */
  document.querySelectorAll('[data-order]').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      var id = btn.getAttribute('data-order');
      if (PRODUCTS[id]) { e.preventDefault(); openItem(id); }
      /* إلا ما كانش المنتج معروف، كنخليو الرابط الأصلي يخدم */
    });
  });

  refreshBar();
})();
