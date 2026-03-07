// ========== MEGO STORE - GLOBAL JS ==========

// ===== THEME =====
const ThemeManager = {
  init() {
    const saved = localStorage.getItem('mego-theme') || 'light';
    this.apply(saved);
  },
  apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('mego-theme', theme);
  },
  toggle() {
    const current = document.documentElement.getAttribute('data-theme');
    this.apply(current === 'dark' ? 'light' : 'dark');
  }
};

// ===== CART =====
const Cart = {
  get() { try { return JSON.parse(localStorage.getItem('mego-cart')) || []; } catch { return []; } },
  save(cart) { localStorage.setItem('mego-cart', JSON.stringify(cart)); this.updateBadge(); },
  add(product) {
    const cart = this.get();
    const key = `${product.id}-${product.size||''}-${product.color||''}`;
    const idx = cart.findIndex(i => `${i.id}-${i.size||''}-${i.color||''}` === key);
    if (idx > -1) { cart[idx].qty = (cart[idx].qty || 1) + 1; }
    else { cart.push({ ...product, qty: 1, key }); }
    this.save(cart);
    Toast.show(`${product.name} added to cart!`, 'success');
  },
  remove(key) {
    const cart = this.get().filter(i => i.key !== key);
    this.save(cart);
  },
  updateQty(key, qty) {
    const cart = this.get();
    const idx = cart.findIndex(i => i.key === key);
    if (idx > -1) {
      if (qty <= 0) { cart.splice(idx, 1); }
      else { cart[idx].qty = qty; }
    }
    this.save(cart);
  },
  getTotal() { return this.get().reduce((s, i) => s + (parseFloat(i.price) * (i.qty || 1)), 0); },
  getCount() { return this.get().reduce((s, i) => s + (i.qty || 1), 0); },
  clear() { localStorage.removeItem('mego-cart'); this.updateBadge(); },
  updateBadge() {
    const count = this.getCount();
    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ===== WISHLIST =====
const Wishlist = {
  get() { try { return JSON.parse(localStorage.getItem('mego-wishlist')) || []; } catch { return []; } },
  save(list) { localStorage.setItem('mego-wishlist', JSON.stringify(list)); this.updateBadge(); },
  toggle(product) {
    const list = this.get();
    const idx = list.findIndex(i => i.id === product.id);
    if (idx > -1) { list.splice(idx, 1); Toast.show('Removed from wishlist', 'info'); }
    else { list.push(product); Toast.show(`${product.name} added to wishlist!`, 'success'); }
    this.save(list);
    return idx === -1;
  },
  isIn(id) { return this.get().some(i => i.id === id); },
  getCount() { return this.get().length; },
  updateBadge() {
    const count = this.getCount();
    document.querySelectorAll('.wishlist-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'flex' : 'none';
    });
  }
};

// ===== TOAST =====
const Toast = {
  container: null,
  init() {
    this.container = document.querySelector('.toast-container-custom');
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container-custom';
      document.body.appendChild(this.container);
    }
  },
  show(msg, type = 'default', duration = 3000) {
    if (!this.container) this.init();
    const icons = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠', default: '●' };
    const toast = document.createElement('div');
    toast.className = `toast-custom toast-${type}`;
    toast.innerHTML = `<span class="toast-icon">${icons[type] || icons.default}</span><span class="toast-msg">${msg}</span><button class="toast-close" onclick="this.parentElement.remove()">✕</button>`;
    this.container.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateX(50px)'; toast.style.transition = 'all 0.3s ease'; setTimeout(() => toast.remove(), 300); }, duration);
  }
};

// ===== BACK TO TOP =====
const BackToTop = {
  init() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;
    window.addEventListener('scroll', () => { btn.classList.toggle('show', window.scrollY > 400); });
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }
};

// ===== SEARCH =====
const Search = {
  products: [],
  init() {
    const input = document.querySelector('.search-bar-nav input');
    if (!input) return;
    input.addEventListener('input', e => this.handleInput(e.target.value));
    document.addEventListener('click', e => { if (!e.target.closest('.search-bar-nav')) this.hideSuggestions(); });
  },
  handleInput(q) {
    if (q.length < 2) { this.hideSuggestions(); return; }
    const results = PRODUCTS_DATA.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.category.toLowerCase().includes(q.toLowerCase())).slice(0, 5);
    this.showSuggestions(results, q);
  },
  showSuggestions(results, q) {
    let box = document.querySelector('.search-suggestions');
    if (!box) {
      box = document.createElement('div');
      box.className = 'search-suggestions';
      document.querySelector('.search-bar-nav').appendChild(box);
    }
    if (!results.length) { box.innerHTML = `<div class="suggestion-item"><span>No results for "${q}"</span></div>`; }
    else { box.innerHTML = results.map(p => `<div class="suggestion-item" onclick="window.location='product-details.html?id=${p.id}'"><span class="suggestion-icon">🔍</span><span>${p.name}</span></div>`).join(''); }
    box.classList.add('active');
  },
  hideSuggestions() {
    const box = document.querySelector('.search-suggestions');
    if (box) box.classList.remove('active');
  }
};

// ===== PRODUCTS DATA =====
const PRODUCTS_DATA = [
  { id: 1, name: 'Classic Leather Watch', category: 'Accessories', price: 129.99, oldPrice: 179.99, image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&q=80', rating: 4.8, reviews: 124, badge: 'sale', colors: ['#1a1a2e','#8B4513','#C0C0C0'], sizes: [] },
  { id: 2, name: 'Premium Sneakers', category: 'Footwear', price: 89.99, oldPrice: null, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', rating: 4.6, reviews: 89, badge: 'new', colors: ['#fff','#000','#e63946'], sizes: ['38','39','40','41','42','43'] },
  { id: 3, name: 'Silk Evening Dress', category: 'Women', price: 199.99, oldPrice: 279.99, image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80', rating: 4.9, reviews: 67, badge: 'hot', colors: ['#c8a96e','#000','#8B0000'], sizes: ['XS','S','M','L','XL'] },
  { id: 4, name: 'Wool Blazer', category: 'Men', price: 159.99, oldPrice: null, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80', rating: 4.7, reviews: 45, badge: null, colors: ['#1a1a2e','#808080','#8B4513'], sizes: ['S','M','L','XL','XXL'] },
  { id: 5, name: 'Designer Handbag', category: 'Accessories', price: 249.99, oldPrice: 349.99, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&q=80', rating: 4.8, reviews: 203, badge: 'sale', colors: ['#c8a96e','#000','#8B4513'], sizes: [] },
  { id: 6, name: 'Casual Linen Shirt', category: 'Men', price: 59.99, oldPrice: null, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&q=80', rating: 4.4, reviews: 78, badge: 'new', colors: ['#fff','#87CEEB','#f4a261'], sizes: ['S','M','L','XL'] },
  { id: 7, name: 'Sports Running Shoes', category: 'Footwear', price: 119.99, oldPrice: 149.99, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&q=80', rating: 4.7, reviews: 156, badge: 'sale', colors: ['#000','#e63946','#1a1a2e'], sizes: ['38','39','40','41','42','43','44'] },
  { id: 8, name: 'Summer Floral Dress', category: 'Women', price: 79.99, oldPrice: null, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&q=80', rating: 4.5, reviews: 92, badge: null, colors: ['#FFB6C1','#FFF','#87CEEB'], sizes: ['XS','S','M','L','XL'] },
  { id: 9, name: 'Gold Chain Necklace', category: 'Jewelry', price: 89.99, oldPrice: 119.99, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&q=80', rating: 4.9, reviews: 187, badge: 'hot', colors: ['#c8a96e','#C0C0C0'], sizes: [] },
  { id: 10, name: 'Denim Jacket', category: 'Men', price: 99.99, oldPrice: null, image: 'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?w=400&q=80', rating: 4.6, reviews: 134, badge: 'new', colors: ['#4169E1','#000','#808080'], sizes: ['S','M','L','XL','XXL'] },
  { id: 11, name: 'Pearl Earrings Set', category: 'Jewelry', price: 69.99, oldPrice: 89.99, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&q=80', rating: 4.8, reviews: 76, badge: 'sale', colors: ['#FFF','#f4a261'], sizes: [] },
  { id: 12, name: 'Leather Backpack', category: 'Accessories', price: 139.99, oldPrice: null, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', rating: 4.7, reviews: 109, badge: null, colors: ['#8B4513','#000','#c8a96e'], sizes: [] },
];

// ===== NAVBAR HTML =====
function renderNavbar(activePage) {
  const pages = [
    { href: 'index.html', label: 'Home' },
    { href: 'products.html', label: 'Products' },
    { href: 'about.html', label: 'About' },
    { href: 'contact.html', label: 'Contact' },
  ];
  return `
  <div class="announcement-bar">🚚 Free shipping on orders over $99 &nbsp;|&nbsp; 🔥 Sale up to 40% OFF &nbsp;|&nbsp; ✨ New arrivals every week</div>
  <nav class="navbar navbar-mego navbar-expand-lg px-3 px-lg-4">
    <div class="container-fluid">
      <a class="navbar-brand-mego" href="index.html">MEGO<span>.</span></a>
      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMain">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav mx-auto gap-1">
          ${pages.map(p => `<li class="nav-item"><a class="nav-link-mego${activePage===p.label?' active':''}" href="${p.href}">${p.label}</a></li>`).join('')}
        </ul>
        <div class="d-flex align-items-center gap-2">
          <div class="search-bar-nav d-none d-lg-block">
            <i class="fas fa-search search-icon"></i>
            <input type="text" placeholder="Search products..." id="navSearchInput" autocomplete="off">
          </div>
          <button class="dark-mode-toggle ms-2" id="darkToggle" title="Toggle theme"></button>
          <a href="wishlist.html"><button class="nav-icon-btn"><i class="fas fa-heart"></i><span class="nav-badge wishlist-badge" style="display:none">0</span></button></a>
          <a href="cart.html"><button class="nav-icon-btn"><i class="fas fa-shopping-bag"></i><span class="nav-badge cart-badge" style="display:none">0</span></button></a>
          <a href="login.html"><button class="nav-icon-btn"><i class="fas fa-user"></i></button></a>
          <a href="admin/admin-index.html" target="_blank"><button class="nav-icon-btn" title="Admin Dashboard" style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));color:white;border-radius:var(--radius-sm);width:32px;height:32px;font-size:0.75rem"><i class="fas fa-cog"></i></button></a>
        </div>
      </div>
    </div>
  </nav>`;
}

// ===== FOOTER HTML =====
function renderFooter() {
  return `
  <footer class="footer-mego">
    <div class="container">
      <div class="row g-5">
        <div class="col-lg-4">
          <div class="footer-brand">MEGO<span>.</span></div>
          <p class="footer-desc">Your premium destination for fashion, accessories & lifestyle. Quality products with exceptional style delivered worldwide.</p>
          <div class="footer-social">
            <a href="#" class="social-link"><i class="fab fa-instagram"></i></a>
            <a href="#" class="social-link"><i class="fab fa-facebook-f"></i></a>
            <a href="#" class="social-link"><i class="fab fa-twitter"></i></a>
            <a href="#" class="social-link"><i class="fab fa-tiktok"></i></a>
            <a href="#" class="social-link"><i class="fab fa-pinterest-p"></i></a>
          </div>
        </div>
        <div class="col-6 col-lg-2">
          <h6 class="footer-heading">Shop</h6>
          <ul class="footer-links">
            <li><a href="products.html?cat=men"><i class="fas fa-chevron-right"></i>Men</a></li>
            <li><a href="products.html?cat=women"><i class="fas fa-chevron-right"></i>Women</a></li>
            <li><a href="products.html?cat=accessories"><i class="fas fa-chevron-right"></i>Accessories</a></li>
            <li><a href="products.html?cat=footwear"><i class="fas fa-chevron-right"></i>Footwear</a></li>
            <li><a href="products.html?cat=jewelry"><i class="fas fa-chevron-right"></i>Jewelry</a></li>
            <li><a href="products.html?sale=true"><i class="fas fa-chevron-right"></i>Sale</a></li>
          </ul>
        </div>
        <div class="col-6 col-lg-2">
          <h6 class="footer-heading">Info</h6>
          <ul class="footer-links">
            <li><a href="about.html"><i class="fas fa-chevron-right"></i>About Us</a></li>
            <li><a href="contact.html"><i class="fas fa-chevron-right"></i>Contact</a></li>
            <li><a href="#"><i class="fas fa-chevron-right"></i>Shipping Policy</a></li>
            <li><a href="#"><i class="fas fa-chevron-right"></i>Returns</a></li>
            <li><a href="#"><i class="fas fa-chevron-right"></i>Size Guide</a></li>
            <li><a href="#"><i class="fas fa-chevron-right"></i>FAQ</a></li>
          </ul>
        </div>
        <div class="col-lg-4">
          <h6 class="footer-heading">Newsletter</h6>
          <p style="color:rgba(255,255,255,0.6);font-size:0.85rem;margin-bottom:16px;">Subscribe for exclusive offers and new arrivals.</p>
          <div class="footer-newsletter-input">
            <input type="email" placeholder="your@email.com" id="newsletterEmail">
            <button onclick="subscribeNewsletter()"><i class="fas fa-paper-plane"></i></button>
          </div>
          <div class="mt-3 d-flex gap-2 flex-wrap">
            <span style="font-size:0.75rem;color:rgba(255,255,255,0.5);"><i class="fas fa-shield-alt me-1" style="color:var(--primary)"></i>Secure Payments</span>
            <span style="font-size:0.75rem;color:rgba(255,255,255,0.5);"><i class="fas fa-undo me-1" style="color:var(--primary)"></i>Easy Returns</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p class="footer-copy">© 2025 <span>MEGO Store</span>. All rights reserved.</p>
        <a href="admin/admin-index.html" class="admin-link-footer"><i class="fas fa-cog"></i> Admin Panel</a><div class="footer-payment">
          <span class="payment-icon">VISA</span>
          <span class="payment-icon">MC</span>
          <span class="payment-icon">AMEX</span>
          <span class="payment-icon">PayPal</span>
        </div>
      </div>
    </div>
  </footer>`;
}

// ===== PRODUCT CARD HTML =====
function renderProductCard(p) {
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : null;
  const inWish = Wishlist.isIn(p.id);
  return `
  <div class="product-card" data-id="${p.id}">
    <div class="product-card-img-wrap">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      ${p.badge ? `<div class="product-badges"><span class="product-badge badge-${p.badge}">${p.badge}</span></div>` : ''}
      <div class="product-actions">
        <button class="product-action-btn wishlist-btn${inWish?' active':''}" onclick="toggleWishlist(${p.id},event)" title="Wishlist"><i class="fas fa-heart"></i></button>
        <button class="product-action-btn" onclick="quickView(${p.id})" title="Quick View"><i class="fas fa-eye"></i></button>
        <a href="product-details.html?id=${p.id}"><button class="product-action-btn" title="View Details"><i class="fas fa-link"></i></button></a>
      </div>
      <button class="quick-add-btn" onclick="quickAdd(${p.id})"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
    </div>
    <div class="product-card-body">
      <div class="product-category">${p.category}</div>
      <div class="product-name">${p.name}</div>
      <div class="product-rating">
        <div class="stars">${'★'.repeat(Math.floor(p.rating))}${'☆'.repeat(5-Math.floor(p.rating))}</div>
        <span class="rating-count">(${p.reviews})</span>
      </div>
      <div class="product-price">
        <span class="price-current">$${p.price.toFixed(2)}</span>
        ${p.oldPrice ? `<span class="price-old">$${p.oldPrice.toFixed(2)}</span><span class="price-discount">-${discount}%</span>` : ''}
      </div>
    </div>
  </div>`;
}

// ===== ACTIONS =====
function toggleWishlist(id, e) {
  if (e) e.preventDefault();
  const p = PRODUCTS_DATA.find(x => x.id === id);
  if (!p) return;
  const added = Wishlist.toggle(p);
  document.querySelectorAll(`.product-card[data-id="${id}"] .wishlist-btn`).forEach(btn => btn.classList.toggle('active', added));
}
function quickAdd(id) {
  const p = PRODUCTS_DATA.find(x => x.id === id);
  if (p) Cart.add(p);
}
function quickView(id) {
  const p = PRODUCTS_DATA.find(x => x.id === id);
  if (!p) return;
  const modal = document.getElementById('quickViewModal');
  if (!modal) { window.location = `product-details.html?id=${id}`; return; }
  document.getElementById('qvImage').src = p.image;
  document.getElementById('qvName').textContent = p.name;
  document.getElementById('qvCategory').textContent = p.category;
  document.getElementById('qvPrice').textContent = `$${p.price.toFixed(2)}`;
  document.getElementById('qvOldPrice').textContent = p.oldPrice ? `$${p.oldPrice.toFixed(2)}` : '';
  document.getElementById('qvRating').textContent = `${'★'.repeat(Math.floor(p.rating))} (${p.reviews} reviews)`;
  document.getElementById('qvAddCart').onclick = () => { Cart.add(p); bootstrap.Modal.getInstance(modal).hide(); };
  document.getElementById('qvLink').href = `product-details.html?id=${id}`;
  new bootstrap.Modal(modal).show();
}
function subscribeNewsletter() {
  const el = document.getElementById('newsletterEmail');
  if (el && el.value && el.value.includes('@')) { Toast.show('Subscribed successfully! 🎉', 'success'); el.value = ''; }
  else { Toast.show('Please enter a valid email.', 'error'); }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  ThemeManager.init();
  Cart.updateBadge();
  Wishlist.updateBadge();
  Toast.init();
  BackToTop.init();
  Search.init();

  // Dark toggle
  const dt = document.getElementById('darkToggle');
  if (dt) dt.addEventListener('click', () => ThemeManager.toggle());

  // Inject back-to-top if not present
  if (!document.querySelector('.back-to-top')) {
    const btn = document.createElement('button');
    btn.className = 'back-to-top';
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(btn);
    BackToTop.init();
  }
});
