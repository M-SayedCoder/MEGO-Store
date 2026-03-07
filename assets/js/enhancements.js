// ========== MEGO STORE - ENHANCEMENTS JS ==========

// ===== LOADING SCREEN =====
const LoadingScreen = {
  init() {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;
    setTimeout(() => screen.classList.add('hide'), 1400);
    setTimeout(() => screen.remove(), 1900);
  }
};

// ===== RECENTLY VIEWED =====
const RecentlyViewed = {
  key: 'mego-recently-viewed',
  get() { try { return JSON.parse(localStorage.getItem(this.key)) || []; } catch { return []; } },
  add(product) {
    let list = this.get().filter(p => p.id !== product.id);
    list.unshift(product);
    list = list.slice(0, 8);
    localStorage.setItem(this.key, JSON.stringify(list));
  },
  render(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const list = this.get();
    if (!list.length) { container.closest('.recently-viewed-section')?.remove(); return; }
    container.innerHTML = list.map(p => `
      <div class="recently-viewed-card" onclick="window.location='product-details.html?id=${p.id}'">
        <img src="${p.image}" alt="${p.name}" class="recently-viewed-img">
        <div class="recently-viewed-name">${p.name}</div>
        <div class="recently-viewed-price">$${parseFloat(p.price).toFixed(2)}</div>
      </div>`).join('');
  }
};

// ===== EXIT INTENT POPUP =====
const ExitIntent = {
  shown: false,
  init() {
    if (sessionStorage.getItem('mego-exit-shown')) return;
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !this.shown) {
        this.shown = true;
        sessionStorage.setItem('mego-exit-shown', '1');
        setTimeout(() => this.show(), 300);
      }
    });
  },
  show() {
    const popup = document.getElementById('exitPopup');
    if (popup) popup.classList.add('show');
  },
  hide() {
    const popup = document.getElementById('exitPopup');
    if (popup) popup.classList.remove('show');
  },
  copyCode() {
    navigator.clipboard?.writeText('STAY20').catch(() => {});
    Toast.show('Coupon code STAY20 copied! 🎉', 'success');
    this.hide();
  }
};

// ===== COOKIE CONSENT =====
const CookieConsent = {
  init() {
    if (localStorage.getItem('mego-cookies')) return;
    const banner = document.getElementById('cookieBanner');
    if (banner) setTimeout(() => banner.style.display = 'flex', 2000);
  },
  accept() {
    localStorage.setItem('mego-cookies', 'accepted');
    document.getElementById('cookieBanner')?.remove();
    Toast.show('Preferences saved!', 'success');
  },
  decline() {
    localStorage.setItem('mego-cookies', 'declined');
    document.getElementById('cookieBanner')?.remove();
  }
};

// ===== LIVE CHAT =====
const LiveChat = {
  open: false,
  msgs: [
    "👋 Hi there! Welcome to MEGO Store!",
    "How can I help you today? I'm here to assist with orders, products, or anything else!"
  ],
  init() {
    const toggle = document.getElementById('chatToggle');
    const window_ = document.getElementById('chatWindow');
    if (!toggle || !window_) return;
    toggle.addEventListener('click', () => {
      this.open = !this.open;
      window_.classList.toggle('open', this.open);
      toggle.innerHTML = this.open ? '<i class="fas fa-times"></i>' : '<i class="fab fa-whatsapp"></i>';
    });
    document.getElementById('chatSend')?.addEventListener('click', () => this.sendMsg());
    document.getElementById('chatInput')?.addEventListener('keypress', e => { if (e.key === 'Enter') this.sendMsg(); });
  },
  sendMsg() {
    const input = document.getElementById('chatInput');
    const body = document.getElementById('chatBody');
    if (!input?.value.trim()) return;
    const userMsg = document.createElement('div');
    userMsg.style.cssText = 'background:var(--primary);color:white;border-radius:12px 12px 4px 12px;padding:8px 14px;font-size:0.82rem;margin-bottom:8px;margin-left:auto;max-width:85%;text-align:right';
    userMsg.textContent = input.value;
    body.appendChild(userMsg);
    input.value = '';
    body.scrollTop = body.scrollHeight;
    setTimeout(() => {
      const replies = ["Thanks for reaching out! Let me check that for you 😊", "Great question! Our team will get back to you shortly.", "I'd be happy to help with that! 🌟", "Sure thing! Can you provide your order number?"];
      const reply = document.createElement('div');
      reply.className = 'chat-bubble';
      reply.textContent = replies[Math.floor(Math.random() * replies.length)];
      body.appendChild(reply);
      body.scrollTop = body.scrollHeight;
    }, 1000);
  }
};

// ===== STICKY ADD TO CART =====
const StickyCart = {
  init() {
    const bar = document.getElementById('stickyCartBar');
    if (!bar) return;
    const threshold = 500;
    window.addEventListener('scroll', () => { bar.classList.toggle('show', window.scrollY > threshold); });
  }
};

// ===== IMAGE ZOOM =====
const ImageZoom = {
  init() {
    document.querySelectorAll('.zoom-container').forEach(container => {
      container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        container.style.setProperty('--x', x + '%');
        container.style.setProperty('--y', y + '%');
      });
    });
  }
};

// ===== STOCK COUNTER =====
const StockCounter = {
  render(containerId, productId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const stocks = { 1:3, 2:12, 3:7, 4:1, 5:5, 6:20, 7:8, 8:15, 9:2, 10:9, 11:4, 12:11 };
    const stock = stocks[productId] || Math.floor(Math.random() * 20) + 1;
    const pct = Math.min((stock / 20) * 100, 100);
    const level = stock <= 3 ? 'low' : stock <= 8 ? 'medium' : 'high';
    const label = stock <= 3 ? `Only ${stock} left!` : stock <= 8 ? `${stock} items left` : 'In Stock';
    el.innerHTML = `
      <div class="stock-counter">
        <div class="stock-bar"><div class="stock-fill ${level}" style="width:${pct}%"></div></div>
        <span class="stock-text ${level}"><i class="fas fa-box-open me-1"></i>${label}</span>
      </div>
      ${stock <= 5 ? '<div class="urgency-badge"><i class="fas fa-fire"></i> Selling fast! ' + Math.floor(Math.random()*10+3) + ' people viewing now</div>' : ''}`;
  }
};

// ===== COMPARE =====
const CompareManager = {
  list: [],
  toggle(product) {
    const idx = this.list.findIndex(p => p.id === product.id);
    if (idx > -1) { this.list.splice(idx, 1); }
    else if (this.list.length < 3) { this.list.push(product); }
    else { Toast.show('You can compare up to 3 products', 'warning'); return; }
    this.updateBar();
  },
  updateBar() {
    const bar = document.getElementById('compareBar');
    if (!bar) return;
    bar.classList.toggle('show', this.list.length > 0);
    const items = bar.querySelector('.compare-items');
    if (!items) return;
    const slots = [...this.list, ...Array(3 - this.list.length).fill(null)];
    items.innerHTML = slots.map(p => p
      ? `<img src="${p.image}" class="compare-item-thumb" alt="${p.name}">`
      : `<div class="compare-item-placeholder">+</div>`).join('');
    bar.querySelector('.compare-count').textContent = `${this.list.length} product${this.list.length !== 1 ? 's' : ''} selected`;
  },
  compare() {
    if (this.list.length < 2) { Toast.show('Select at least 2 products to compare', 'warning'); return; }
    Toast.show('Compare feature coming soon! 🔧', 'info');
  }
};

// ===== PRICE DROP ALERT =====
const PriceAlert = {
  set(productId, productName) {
    const email = prompt(`Get notified when "${productName}" drops in price!\nEnter your email:`);
    if (email && email.includes('@')) {
      Toast.show(`Alert set! We'll email you when the price drops 🔔`, 'success');
    } else if (email) {
      Toast.show('Invalid email address', 'error');
    }
  }
};

// ===== LOYALTY POINTS =====
const LoyaltyPoints = {
  getPoints() { return parseInt(localStorage.getItem('mego-points') || '0'); },
  addPoints(amount) {
    const pts = this.getPoints() + amount;
    localStorage.setItem('mego-points', pts);
    return pts;
  },
  renderBadge(containerId) {
    const el = document.getElementById(containerId);
    if (!el) return;
    const pts = this.getPoints();
    el.innerHTML = `<div class="points-badge">⭐ ${pts} Points</div>`;
  }
};

// ===== PWA / SERVICE WORKER =====
const PWAManager = {
  init() {
    if ('serviceWorker' in navigator) {
      // Register SW if available
    }
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBtn = document.getElementById('installPWA');
      if (installBtn) installBtn.style.display = 'block';
    });
  }
};

// ===== INIT ALL =====
document.addEventListener('DOMContentLoaded', () => {
  LoadingScreen.init();
  ExitIntent.init();
  CookieConsent.init();
  LiveChat.init();
  StickyCart.init();
  ImageZoom.init();
  PWAManager.init();
});
