/* KisanSetu – shared front-end helpers (all panels) */
(function () {
  'use strict';
  const KS = (window.KS = window.KS || {});
  const panel = document.body.dataset.panel || 'web';
  const t = (k, fb) => (window.KS_I18N ? window.KS_I18N.t(k, fb) : fb || k);
  KS.t = t;

  /* ---------- toast ---------- */
  KS.toast = function (msg, type) {
    type = type || 'success';
    const box = document.getElementById('ks-toasts');
    if (!box) return alert(msg);
    const el = document.createElement('div');
    el.className = 'ks-toast ' + type;
    const icon = { success: 'bi-check-circle-fill', danger: 'bi-x-octagon-fill', warning: 'bi-exclamation-triangle-fill' }[type] || 'bi-info-circle-fill';
    el.innerHTML = '<i class="bi ' + icon + '"></i><div></div>';
    el.lastChild.textContent = msg;
    box.appendChild(el);
    setTimeout(() => { el.style.opacity = '0'; el.style.transition = '.3s'; setTimeout(() => el.remove(), 300); }, 4500);
  };

  /* ---------- fetch helpers ---------- */
  KS.post = async function (url, data) {
    const res = await fetch(url, {
      method: 'POST', credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data || {})
    });
    let json = {};
    try { json = await res.json(); } catch (e) { /* not json */ }
    if (res.status === 401) { location.href = '/login'; }
    return { ok: res.ok && json.success !== false, status: res.status, ...json };
  };
  KS.get = async function (url) {
    const res = await fetch(url, { credentials: 'same-origin', headers: { Accept: 'application/json' } });
    if (res.status === 401) { location.href = '/login'; return null; }
    return res.json();
  };

  /* ---------- formatting ---------- */
  KS.inr = n => '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  KS.esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  KS.date = d => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
  KS.badge = s => { s = String(s || 'pending').toLowerCase(); return '<span class="ks-badge st-' + KS.esc(s.replace(' ', '-')) + '" data-i18n="status.' + KS.esc(s) + '">' + KS.esc(s.charAt(0).toUpperCase() + s.slice(1)) + '</span>'; };

  /* animate a number only when it changed (so people SEE the live update) */
  KS.setStat = function (name, value, formatter) {
    document.querySelectorAll('[data-stat="' + name + '"]').forEach(el => {
      const txt = formatter ? formatter(value) : String(value);
      if (el.textContent.trim() !== txt) {
        el.textContent = txt;
        el.classList.remove('ks-flash-num'); void el.offsetWidth; el.classList.add('ks-flash-num');
      }
    });
  };

  /* ---------- LIVE data: poll the panel API, no page refresh needed ---------- */
  const listeners = [];
  KS.onSummary = fn => listeners.push(fn);
  let timer = null, busy = false;
  async function tick() {
    if (busy || document.hidden || (panel !== 'buyer' && panel !== 'farmer')) return;
    busy = true;
    try {
      const data = await KS.get('/' + panel + '/api/summary');
      if (data && data.success) {
        const dot = document.getElementById('ks-notif-dot');
        if (dot) { const n = data.stats.unreadNotifications || 0; dot.textContent = n > 9 ? '9+' : n; dot.classList.toggle('show', n > 0); }
        listeners.forEach(fn => { try { fn(data); } catch (e) { console.error(e); } });
      }
    } catch (e) { /* offline – ignore */ }
    busy = false;
  }
  KS.refreshNow = tick;
  if (panel === 'buyer' || panel === 'farmer') {
    document.addEventListener('DOMContentLoaded', () => { tick(); timer = setInterval(tick, 12000); });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });
    window.addEventListener('focus', tick);
  }

  /* ---------- language switch without reload ---------- */
  document.addEventListener('click', function (e) {
    const a = e.target.closest('.lang-option');
    if (!a) return;
    e.preventDefault();
    const code = a.dataset.lang;
    document.cookie = 'ks_lang=' + code + ';path=/;max-age=31536000;SameSite=Lax';
    if (window.KS_I18N) window.KS_I18N.apply(code);
    document.querySelectorAll('.lang-option').forEach(o => {
      const on = o.dataset.lang === code;
      o.classList.toggle('active', on);
      const chk = o.querySelector('.bi-check2'); if (chk) chk.remove();
      if (on) o.insertAdjacentHTML('beforeend', '<i class="bi bi-check2 ms-auto"></i>');
    });
    const lbl = document.getElementById('current-lang');
    if (lbl) lbl.textContent = a.textContent.trim();
  });

  /* ---------- image upload boxes with SIZE-LIMIT ALERT ---------- */
  KS.initUploads = function (maxMB) {
    const max = maxMB * 1024 * 1024;
    document.querySelectorAll('.ks-drop').forEach(box => {
      const input = box.querySelector('input[type=file]');
      if (!input) return;
      input.addEventListener('change', () => {
        const f = input.files[0];
        const old = box.querySelector('img.preview.new'); if (old) old.remove();
        box.classList.remove('error');
        if (!f) { box.classList.toggle('has-img', !!box.querySelector('img.preview')); return; }
        if (!/^image\/(jpeg|png|webp|jpg)$/.test(f.type)) {
          input.value = ''; box.classList.add('error');
          const m = t('upload.type', 'Only JPG, PNG or WEBP images are allowed.'); KS.toast(m, 'danger'); alert(m); return;
        }
        if (f.size > max) {
          input.value = ''; box.classList.add('error');
          const mb = (f.size / 1048576).toFixed(1);
          const m = t('upload.size', 'Image is too large') + ' (' + mb + ' MB). ' + t('upload.limit', 'Maximum allowed size is') + ' ' + maxMB + ' MB.';
          KS.toast(m, 'danger'); alert(m); return;
        }
        const img = document.createElement('img'); img.className = 'preview new'; img.alt = 'preview';
        img.src = URL.createObjectURL(f); box.appendChild(img); box.classList.add('has-img');
        const rm = box.querySelector('input[type=checkbox][name^=remove_image]'); if (rm) rm.checked = false;
      });
      ['dragenter', 'dragover'].forEach(ev => box.addEventListener(ev, () => box.classList.add('drag')));
      ['dragleave', 'drop'].forEach(ev => box.addEventListener(ev, () => box.classList.remove('drag')));
    });
  };

  /* ---------- instant client-side table/card filter ---------- */
  KS.filterList = function (opts) {
    const rows = Array.from(document.querySelectorAll(opts.rows));
    const q = opts.search ? document.querySelector(opts.search) : null;
    const sel = opts.select ? document.querySelector(opts.select) : null;
    const tabs = opts.tabs ? document.querySelectorAll(opts.tabs) : [];
    const count = opts.count ? document.querySelector(opts.count) : null;
    const empty = opts.empty ? document.querySelector(opts.empty) : null;
    let tabValue = 'all';
    function run() {
      const term = q ? q.value.trim().toLowerCase() : '';
      const val = sel ? sel.value : tabValue;
      let shown = 0;
      rows.forEach(r => {
        const okText = !term || (r.dataset.search || r.textContent).toLowerCase().includes(term);
        const okVal = val === 'all' || !val || (r.dataset[opts.key || 'status'] || '') === val;
        const show = okText && okVal; r.style.display = show ? '' : 'none'; if (show) shown++;
      });
      if (count) count.textContent = shown;
      if (empty) empty.classList.toggle('d-none', shown !== 0);
    }
    if (q) q.addEventListener('input', run);
    if (sel) sel.addEventListener('change', run);
    tabs.forEach(b => b.addEventListener('click', () => { tabs.forEach(x => x.classList.remove('active')); b.classList.add('active'); tabValue = b.dataset.filter; if (sel) sel.value = tabValue; run(); }));
    run(); return run;
  };

  /* ---------- confirm dialogs + double-submit guard ---------- */
  document.addEventListener('submit', function (e) {
    const f = e.target;
    if (f.dataset.confirm && !confirm(f.dataset.confirm)) { e.preventDefault(); return; }
    const btn = f.querySelector('button[type=submit][data-loading]');
    if (btn && f.checkValidity()) { setTimeout(() => { btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>' + (btn.dataset.loading || '...'); }, 0); }
  });
  window.addEventListener('pageshow', () => document.querySelectorAll('button[type=submit][data-loading]').forEach(b => { if (b.disabled && b.dataset.orig) { b.disabled = false; b.innerHTML = b.dataset.orig; } }));
  document.querySelectorAll('button[type=submit][data-loading]').forEach(b => b.dataset.orig = b.innerHTML);

  /* ---------- wishlist heart (buyer) ---------- */
  document.addEventListener('click', async function (e) {
    const b = e.target.closest('[data-wish]'); if (!b) return;
    e.preventDefault();
    const r = await KS.post('/buyer/wishlist/toggle', { product_id: b.dataset.wish });
    if (!r.ok) return KS.toast(r.message || 'Please login as a buyer.', 'danger');
    b.classList.toggle('on', r.saved);
    const i = b.querySelector('i'); if (i) i.className = 'bi ' + (r.saved ? 'bi-heart-fill' : 'bi-heart');
    KS.toast(r.saved ? t('wish.added', 'Saved to wishlist') : t('wish.removed', 'Removed from wishlist'));
    if (b.dataset.removeRow && !r.saved) { const row = b.closest(b.dataset.removeRow); if (row) row.remove(); }
  });

  /* ---------- active nav link on legacy pages ---------- */
  document.addEventListener('DOMContentLoaded', () => {
    if (window.KS_I18N) window.KS_I18N.apply(document.documentElement.lang || 'en');
    const c = document.getElementById('contactForm');
    if (c) {
      const btn = document.getElementById('contactSubmitButton'), spin = document.getElementById('contactSubmitSpinner');
      c.addEventListener('submit', ev => {
        if (!c.checkValidity()) { ev.preventDefault(); c.classList.add('was-validated'); c.reportValidity(); return; }
        if (btn) { btn.disabled = true; } if (spin) spin.classList.remove('d-none');
      });
      window.addEventListener('pageshow', () => { if (btn) btn.disabled = false; if (spin) spin.classList.add('d-none'); });
    }
  });
})();
