/* BELINA — Way to Glow. | Vanilla JS, no dependencies. */
(() => {
  'use strict';

  /* ===== Easy-to-edit settings ===== */
  const CONFIG = {
    instagram: 'https://www.instagram.com/your-belina-handle', // replace with your link
    tiktok: 'https://www.tiktok.com/@your-belina-handle',      // replace with your link
    email: 'hello@belina.example',
    phone: '+20 100 000 0000',
    address: 'Cairo, Egypt',
    freeShippingFrom: 1500
  };

  /* ===== Products (launch placeholders — replace images/prices freely) ===== */
  const U = (id, w = 700) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
  const PRODUCTS = [
    { id: 'glow-foundation', name: 'Belina Glow Foundation', cat: 'face', price: 890, badge: 'Best Seller',
      desc: 'Skin-like, buildable coverage with a luminous satin finish.', img: U('1596462502278-27bfdc403348'),
      alt: 'Glow Foundation bottle styled with makeup on a cream background' },
    { id: 'blush-crush', name: 'Belina Blush Crush', cat: 'face', price: 650, badge: 'Best Seller',
      desc: 'Silky blush that melts into a natural, healthy flush.', img: U('1522335789203-aabd1fc54bc9'),
      alt: 'Soft pink blush and brushes in warm light' },
    { id: 'lip-gloss', name: 'Belina Lip Gloss', cat: 'lips', price: 480, badge: 'Best Seller',
      desc: 'Plumping shine with a cushiony, never-sticky feel.', img: U('1599305090598-fe179d501227'),
      alt: 'Glossy pink lips with a lip gloss wand' },
    { id: 'radiance-highlighter', name: 'Belina Radiance Highlighter', cat: 'glow', price: 720, badge: 'Best Seller',
      desc: 'A champagne pearl glow that catches the light, not glitter.', img: U('1625093742435-6fa192b6fb10'),
      alt: 'Champagne highlighter compact with a soft shimmer' },
    { id: 'velvet-lipstick', name: 'Belina Velvet Lipstick', cat: 'lips', price: 580, badge: 'Best Seller',
      desc: 'Weightless velvet colour with all-day comfort.', img: U('1586495777744-4413f21062fa'),
      alt: 'Velvet lipstick bullet in a rich rosy shade' },
    { id: 'glow-setting-spray', name: 'Belina Glow Setting Spray', cat: 'glow', price: 540, badge: 'Best Seller',
      desc: 'A fine, hydrating mist that locks makeup in with a dewy finish.', img: U('1571781926291-c477ebfd024b'),
      alt: 'Setting spray bottle on a soft beige surface' },
    { id: 'lash-lift-mascara', name: 'Belina Lash Lift Mascara', cat: 'eyes', price: 520, badge: 'New',
      desc: 'Lifted, defined lashes with a flake-free, featherlight formula.', img: U('1512496015851-a90fb38ba796'),
      alt: 'Woman’s eye with defined, lifted lashes' },
    { id: 'soft-focus-palette', name: 'Belina Soft Focus Eye Palette', cat: 'eyes', price: 780, badge: 'New',
      desc: 'Nine warm neutrals, from creamy mattes to molten shimmers.', img: U('1631214524020-7e18db9a8f92'),
      alt: 'Neutral eyeshadow palette in warm browns and champagne' }
  ];
  const byId = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
  const CAT_NAMES = { all: 'all products', face: 'Face', lips: 'Lips', eyes: 'Eyes', glow: 'Glow & Skincare' };

  /* ===== Helpers ===== */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const money = n => 'EGP ' + n.toLocaleString('en-US');
  const el = (tag, props = {}, kids = []) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === 'class') n.className = v;
      else if (k === 'text') n.textContent = v;
      else n.setAttribute(k, v);
    }
    kids.forEach(c => n.append(c));
    return n;
  };
  const makeImg = (p, lazy = true) => {
    const media = el('div', { class: 'media' });
    const img = el('img', { src: p.img, alt: p.alt });
    if (lazy) img.loading = 'lazy';
    media.append(img);
    return media;
  };

  /* ===== Image fallback (keeps the layout elegant if a photo can't load) ===== */
  const markBroken = img => {
    img.style.display = 'none';
    const m = img.closest('.media');
    if (m) m.classList.add('no-img');
  };
  document.addEventListener('error', e => { if (e.target && e.target.tagName === 'IMG') markBroken(e.target); }, true);
  const checkImages = () => $$('img').forEach(i => { if (i.complete && i.naturalWidth === 0 && i.src) markBroken(i); });
  window.addEventListener('load', checkImages);

  /* ===== Config -> footer ===== */
  $$('[data-social]').forEach(a => { a.href = CONFIG[a.dataset.social] || '#'; });
  const mail = $('#contactEmail');
  mail.href = 'mailto:' + CONFIG.email; mail.textContent = CONFIG.email;
  $('#contactPhone').textContent = CONFIG.phone;
  $('#contactAddress').textContent = CONFIG.address;
  $('#year').textContent = new Date().getFullYear();

  /* ===== Toast ===== */
  const toast = $('#toast');
  let toastTimer;
  const showToast = msg => {
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  };

  /* ===== Cart state (localStorage) ===== */
  const KEY = 'belina-cart-v1';
  let cart = [];
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (Array.isArray(raw)) {
      cart = raw.filter(i => i && byId[i.id] && Number.isInteger(i.qty) && i.qty > 0)
                .map(i => ({ id: i.id, qty: Math.min(i.qty, 99) }));
    }
  } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* storage unavailable */ } };

  const cartCount = () => cart.reduce((s, i) => s + i.qty, 0);
  const cartTotal = () => cart.reduce((s, i) => s + i.qty * byId[i.id].price, 0);

  const addToCart = id => {
    const found = cart.find(i => i.id === id);
    if (found) found.qty = Math.min(found.qty + 1, 99); else cart.push({ id, qty: 1 });
    save(); renderCart(true);
  };
  const setQty = (id, qty) => {
    if (qty <= 0) cart = cart.filter(i => i.id !== id);
    else { const f = cart.find(i => i.id === id); if (f) f.qty = Math.min(qty, 99); }
    save(); renderCart();
  };

  /* ===== Render cart ===== */
  const list = $('#cartList'), emptyBox = $('#cartEmpty'), foot = $('#cartFoot');
  const bagCount = $('#bagCount'), bagBtn = $('#bagBtn');

  function renderCart(bump = false) {
    const n = cartCount(), total = cartTotal();
    bagCount.textContent = n;
    bagCount.classList.toggle('show', n > 0);
    bagBtn.setAttribute('aria-label', `Open shopping bag, ${n} ${n === 1 ? 'item' : 'items'}`);
    if (bump) { bagCount.classList.remove('bump'); void bagCount.offsetWidth; bagCount.classList.add('bump'); }

    list.replaceChildren();
    cart.forEach(({ id, qty }) => {
      const p = byId[id];
      const minus = el('button', { type: 'button', 'aria-label': `Decrease quantity of ${p.name}`, text: '−' });
      const plus = el('button', { type: 'button', 'aria-label': `Increase quantity of ${p.name}`, text: '+' });
      const rm = el('button', { type: 'button', class: 'remove', 'aria-label': `Remove ${p.name} from bag`, text: 'Remove' });
      minus.addEventListener('click', () => setQty(id, qty - 1));
      plus.addEventListener('click', () => setQty(id, qty + 1));
      rm.addEventListener('click', () => setQty(id, 0));
      const li = el('li', { class: 'cart-item' }, [
        makeImg(p),
        el('div', {}, [
          el('h3', { text: p.name }),
          el('p', { class: 'p', text: money(p.price) }),
          el('div', { class: 'qty', role: 'group', 'aria-label': `Quantity of ${p.name}` }, [minus, el('span', { 'aria-live': 'polite', text: String(qty) }), plus])
        ]),
        el('div', { class: 'side' }, [el('b', { text: money(p.price * qty) }), rm])
      ]);
      list.append(li);
    });

    const has = n > 0;
    list.hidden = !has; foot.hidden = !has; $('#shipProgress').hidden = !has; emptyBox.hidden = has;
    $('#cartTotal').textContent = money(total);
    const left = CONFIG.freeShippingFrom - total;
    $('#shipText').textContent = left > 0
      ? `You’re ${money(left)} away from complimentary shipping.`
      : 'You’ve unlocked complimentary shipping.';
    $('#shipFill').style.width = Math.min(100, (total / CONFIG.freeShippingFrom) * 100) + '%';
    if (!has) $('#checkoutNote').hidden = true;
    checkImages();
  }

  /* ===== Drawer open/close with focus handling ===== */
  const drawer = $('#cart'), overlay = $('#overlay');
  let lastFocus = null;
  const openCart = () => {
    lastFocus = document.activeElement;
    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add('show'));
    drawer.classList.add('open'); drawer.setAttribute('aria-hidden', 'false');
    bagBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#closeCart').focus(), 50);
  };
  const closeCart = () => {
    overlay.classList.remove('show');
    setTimeout(() => { if (!overlay.classList.contains('show')) overlay.hidden = true; }, 350);
    drawer.classList.remove('open'); drawer.setAttribute('aria-hidden', 'true');
    bagBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  };
  bagBtn.addEventListener('click', openCart);
  $('#closeCart').addEventListener('click', closeCart);
  overlay.addEventListener('click', () => { closeCart(); closeMenu(); });
  $('#emptyShop').addEventListener('click', closeCart);
  $('#clearCart').addEventListener('click', () => { cart = []; save(); renderCart(); });
  $('#checkoutBtn').addEventListener('click', () => { const n = $('#checkoutNote'); n.hidden = false; });

  drawer.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    const f = $$('button, a[href]', drawer).filter(x => !x.closest('[hidden]') && !x.disabled);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ===== Mobile navigation ===== */
  const nav = $('#mainNav'), menuBtn = $('#menuBtn');
  function openMenu() {
    nav.classList.add('open'); menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Close menu');
    overlay.hidden = false; requestAnimationFrame(() => overlay.classList.add('show'));
  }
  function closeMenu() {
    if (!nav.classList.contains('open')) return;
    nav.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Open menu');
    if (!drawer.classList.contains('open')) {
      overlay.classList.remove('show'); setTimeout(() => { if (!overlay.classList.contains('show')) overlay.hidden = true; }, 350);
    }
  }
  menuBtn.addEventListener('click', () => nav.classList.contains('open') ? closeMenu() : openMenu());
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));

  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (drawer.classList.contains('open')) closeCart();
    closeMenu();
  });

  /* ===== Products: render, filter, search ===== */
  const grid = $('#productGrid'), emptyMsg = $('#emptyMsg'), note = $('#resultNote');
  const searchInput = $('#searchInput');
  let activeCat = 'all', query = '';

  function renderProducts() {
    const q = query.trim().toLowerCase();
    const items = PRODUCTS.filter(p =>
      (activeCat === 'all' || p.cat === activeCat) &&
      (!q || (p.name + ' ' + p.desc + ' ' + CAT_NAMES[p.cat]).toLowerCase().includes(q)));
    grid.replaceChildren();
    items.forEach(p => {
      const media = makeImg(p);
      media.prepend(el('span', { class: 'badge', text: p.badge }));
      const btn = el('button', { type: 'button', class: 'add', 'aria-label': `Add ${p.name} to bag`, text: 'Add to bag' });
      btn.addEventListener('click', () => {
        addToCart(p.id);
        btn.classList.add('done'); btn.textContent = 'Added ✓';
        showToast(`${p.name} added to your bag`);
        setTimeout(() => { btn.classList.remove('done'); btn.textContent = 'Add to bag'; }, 1600);
      });
      grid.append(el('article', { class: 'card' }, [
        media,
        el('div', { class: 'info' }, [
          el('h3', { text: p.name }),
          el('p', { class: 'desc', text: p.desc }),
          el('div', { class: 'row' }, [el('span', { class: 'price', text: money(p.price) }), btn])
        ])
      ]));
    });
    emptyMsg.hidden = items.length > 0;
    note.textContent = items.length
      ? `Showing ${items.length} ${items.length === 1 ? 'product' : 'products'}${activeCat !== 'all' ? ' in ' + CAT_NAMES[activeCat] : ''}${q ? ` for “${query.trim()}”` : ''}.`
      : '';
    checkImages();
  }
  function setCat(cat) {
    activeCat = cat;
    $$('.chip').forEach(c => { const on = c.dataset.cat === cat; c.classList.toggle('is-active', on); c.setAttribute('aria-pressed', String(on)); });
    renderProducts();
  }
  $$('.chip').forEach(c => c.addEventListener('click', () => setCat(c.dataset.cat)));
  $$('.cat').forEach(c => c.addEventListener('click', () => { searchInput.value = ''; query = ''; setCat(c.dataset.cat); }));
  searchInput.addEventListener('input', () => { query = searchInput.value; renderProducts(); });
  $('#searchBtn').addEventListener('click', () => {
    $('#shop').scrollIntoView({ behavior: 'smooth' });
    setTimeout(() => searchInput.focus({ preventScroll: true }), 450);
  });

  /* ===== Newsletter validation ===== */
  const form = $('#newsForm'), email = $('#email'), msg = $('#newsMsg');
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const v = email.value.trim();
    msg.className = 'form-msg';
    if (!v) { msg.textContent = 'Please enter your email address.'; msg.classList.add('err'); email.setAttribute('aria-invalid', 'true'); email.focus(); return; }
    if (!EMAIL_RE.test(v)) { msg.textContent = 'That email doesn’t look right. Please check it and try again.'; msg.classList.add('err'); email.setAttribute('aria-invalid', 'true'); email.focus(); return; }
    email.removeAttribute('aria-invalid');
    msg.textContent = 'Thank you! You’re on the list. (Demo form — connect an email service to collect sign-ups.)';
    msg.classList.add('ok');
    form.reset();
  });
  email.addEventListener('input', () => { email.removeAttribute('aria-invalid'); if (msg.classList.contains('err')) { msg.textContent = ''; msg.className = 'form-msg'; } });

  /* ===== Footer info (placeholder policies) ===== */
  const INFO = {
    care: 'Customer care: write to ' + CONFIG.email + ' or call ' + CONFIG.phone + '. (Placeholder — add your support hours and FAQs.)',
    shipping: 'Shipping & returns: complimentary shipping on orders over ' + money(CONFIG.freeShippingFrom) + '. Add your delivery times and returns window here. (Placeholder)',
    privacy: 'Privacy policy: add your full policy here before collecting any customer data. (Placeholder)'
  };
  const infoBox = $('#infoBox');
  $$('[data-info]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); infoBox.hidden = false; infoBox.textContent = INFO[a.dataset.info];
  }));

  /* ===== Header shadow + reveal on scroll ===== */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(r => io.observe(r));
  } else revealEls.forEach(r => r.classList.add('in'));

  /* ===== Init ===== */
  renderProducts();
  renderCart();
  checkImages();
})();
