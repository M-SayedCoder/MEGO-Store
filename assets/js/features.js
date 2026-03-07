// ═══════════════════════════════════════════════
// MEGO STORE — ADVANCED FEATURES JS
// ═══════════════════════════════════════════════

// ═══ 1. LOADING SCREEN ═══
const LoadingScreen = {
  init() {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;
    let progress = 0;
    const bar = document.getElementById('loadingBar');
    const num = document.getElementById('loadingNum');
    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) { progress = 100; clearInterval(interval); setTimeout(() => this.hide(), 300); }
      if (bar) bar.style.width = progress + '%';
      if (num) num.textContent = Math.floor(progress) + '%';
    }, 80);
  },
  hide() {
    const screen = document.getElementById('loadingScreen');
    if (!screen) return;
    screen.style.opacity = '0';
    screen.style.transform = 'scale(1.05)';
    setTimeout(() => screen.remove(), 600);
  }
};

// ═══ 2. SKELETON LOADER ═══
const SkeletonLoader = {
  show(containerId, count = 8) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = Array(count).fill(`
      <div class="col-6 col-md-4 col-lg-3">
        <div class="product-card" style="pointer-events:none">
          <div class="skeleton" style="height:220px;border-radius:0"></div>
          <div style="padding:14px">
            <div class="skeleton" style="height:10px;width:40%;margin-bottom:8px;border-radius:4px"></div>
            <div class="skeleton" style="height:14px;width:80%;margin-bottom:8px;border-radius:4px"></div>
            <div class="skeleton" style="height:10px;width:55%;margin-bottom:10px;border-radius:4px"></div>
            <div class="skeleton" style="height:18px;width:35%;border-radius:4px"></div>
          </div>
        </div>
      </div>`).join('');
  }
};

// ═══ 3. EXIT INTENT POPUP ═══
const ExitIntent = {
  shown: false,
  init() {
    if (sessionStorage.getItem('exitIntentShown')) return;
    document.addEventListener('mouseleave', (e) => {
      if (e.clientY < 10 && !this.shown) {
        this.shown = true;
        sessionStorage.setItem('exitIntentShown', '1');
        setTimeout(() => this.show(), 300);
      }
    });
  },
  show() {
    const modal = document.getElementById('exitIntentModal');
    if (modal) { modal.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
  },
  close() {
    const modal = document.getElementById('exitIntentModal');
    if (modal) { modal.style.display = 'none'; document.body.style.overflow = ''; }
  },
  apply() {
    Toast.show('🎉 Coupon MEGO15 applied! 15% off your first order', 'success');
    this.close();
  }
};

// ═══ 4. STOCK COUNTER ═══
const StockCounter = {
  inject(productId) {
    const stock = Math.floor(Math.random() * 8) + 1;
    const el = document.querySelector(`.product-card[data-id="${productId}"] .stock-counter`);
    if (el) {
      el.textContent = `🔥 Only ${stock} left!`;
      el.style.display = stock <= 5 ? 'block' : 'none';
    }
  }
};

// ═══ 5. RECENTLY VIEWED ═══
const RecentlyViewed = {
  max: 6,
  get() { try { return JSON.parse(localStorage.getItem('mego-recently') || '[]'); } catch { return []; } },
  add(product) {
    let list = this.get().filter(p => p.id !== product.id);
    list.unshift(product);
    if (list.length > this.max) list = list.slice(0, this.max);
    localStorage.setItem('mego-recently', JSON.stringify(list));
  },
  render(containerId) {
    const list = this.get();
    const container = document.getElementById(containerId);
    if (!container || !list.length) return;
    container.innerHTML = list.map(p => `<div class="col-6 col-md-4 col-lg-2">${renderProductCard(p)}</div>`).join('');
  }
};

// ═══ 6. COMPARE PRODUCTS ═══
const Compare = {
  list: [],
  max: 3,
  add(id) {
    const p = PRODUCTS_DATA.find(x => x.id === id);
    if (!p) return;
    if (this.list.find(x => x.id === id)) { Toast.show('Already in compare list', 'info'); return; }
    if (this.list.length >= this.max) { Toast.show(`Max ${this.max} products to compare`, 'warning'); return; }
    this.list.push(p);
    this.updateBar();
    Toast.show(`${p.name} added to compare`, 'success');
  },
  remove(id) {
    this.list = this.list.filter(x => x.id !== id);
    this.updateBar();
  },
  clear() { this.list = []; this.updateBar(); },
  updateBar() {
    const bar = document.getElementById('compareBar');
    const count = document.getElementById('compareCount');
    if (!bar) return;
    if (count) count.textContent = this.list.length;
    bar.style.transform = this.list.length ? 'translateY(0)' : 'translateY(100%)';
    const items = document.getElementById('compareItems');
    if (items) {
      items.innerHTML = this.list.map(p => `
        <div style="display:flex;align-items:center;gap:8px;background:rgba(255,255,255,0.1);padding:6px 10px;border-radius:8px">
          <img src="${p.image}" style="width:30px;height:30px;border-radius:6px;object-fit:cover">
          <span style="font-size:0.78rem;font-weight:600;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${p.name}</span>
          <button onclick="Compare.remove(${p.id})" style="background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;padding:0;font-size:0.8rem">✕</button>
        </div>`).join('');
    }
  },
  open() {
    if (this.list.length < 2) { Toast.show('Add at least 2 products to compare', 'info'); return; }
    const modal = document.getElementById('compareModal');
    if (!modal) return;
    const fields = ['price','category','rating','reviews'];
    const fieldLabels = { price:'Price', category:'Category', rating:'Rating', reviews:'Reviews' };
    let html = `<div style="display:grid;grid-template-columns:120px ${this.list.map(()=>'1fr').join(' ')};gap:0">`;
    // header
    html += `<div style="padding:12px;background:rgba(0,0,0,0.2);border-radius:8px 0 0 0"></div>`;
    this.list.forEach(p => {
      html += `<div style="padding:14px;text-align:center;border-left:1px solid var(--border)">
        <img src="${p.image}" style="width:100%;height:100px;object-fit:cover;border-radius:8px;margin-bottom:8px">
        <div style="font-family:var(--font-display);font-weight:700;font-size:0.9rem">${p.name}</div>
      </div>`;
    });
    // rows
    fields.forEach(f => {
      html += `<div style="padding:12px 14px;background:rgba(0,0,0,0.1);font-size:0.78rem;font-weight:700;letter-spacing:0.5px;color:var(--text-muted);display:flex;align-items:center">${fieldLabels[f]}</div>`;
      this.list.forEach(p => {
        const val = f === 'price' ? `<span style="color:var(--primary);font-weight:700">$${p[f]}</span>` :
                    f === 'rating' ? `${'★'.repeat(Math.floor(p[f]))}` : p[f];
        html += `<div style="padding:12px;text-align:center;border-left:1px solid var(--border);font-size:0.875rem">${val}</div>`;
      });
    });
    // add to cart row
    html += `<div style="padding:12px;background:rgba(0,0,0,0.1)"></div>`;
    this.list.forEach(p => {
      html += `<div style="padding:10px;text-align:center;border-left:1px solid var(--border)">
        <button class="btn-primary-custom" style="width:100%;justify-content:center;font-size:0.78rem;padding:8px" onclick="quickAdd(${p.id})"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
      </div>`;
    });
    html += '</div>';
    document.getElementById('compareContent').innerHTML = html;
    modal.style.display = 'flex';
  }
};

// ═══ 7. LIVE SEARCH ═══
const LiveSearch = {
  init() {
    const input = document.getElementById('navSearchInput');
    if (!input) return;
    let timeout;
    input.addEventListener('input', e => {
      clearTimeout(timeout);
      timeout = setTimeout(() => this.search(e.target.value), 200);
    });
    input.addEventListener('keydown', e => { if (e.key === 'Escape') this.close(); });
    document.addEventListener('click', e => { if (!e.target.closest('.search-bar-nav')) this.close(); });
  },
  search(q) {
    const box = this.getBox();
    if (!q || q.length < 2) { box.innerHTML = ''; box.style.display = 'none'; return; }
    const results = PRODUCTS_DATA.filter(p =>
      p.name.toLowerCase().includes(q.toLowerCase()) ||
      p.category.toLowerCase().includes(q.toLowerCase())
    ).slice(0, 6);

    if (!results.length) {
      box.innerHTML = `<div style="padding:16px;text-align:center;color:var(--text-muted);font-size:0.85rem">No results found for "<strong>${q}</strong>"</div>`;
    } else {
      box.innerHTML = `
        <div style="padding:8px 12px;font-size:0.68rem;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--text-muted);border-bottom:1px solid var(--border)">Products</div>
        ${results.map(p => `
          <a href="product-details.html?id=${p.id}" style="display:flex;align-items:center;gap:12px;padding:10px 14px;transition:background 0.15s;text-decoration:none;color:inherit" onmouseover="this.style.background='var(--light-2)'" onmouseout="this.style.background=''"  >
            <img src="${p.image}" style="width:40px;height:40px;border-radius:8px;object-fit:cover;flex-shrink:0">
            <div style="flex:1;min-width:0">
              <div style="font-size:0.85rem;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${this.highlight(p.name, q)}</div>
              <div style="font-size:0.72rem;color:var(--text-muted)">${p.category}</div>
            </div>
            <div style="font-family:var(--font-display);font-size:0.9rem;font-weight:700;color:var(--primary);flex-shrink:0">$${p.price}</div>
          </a>`).join('')}
        <a href="products.html" style="display:block;text-align:center;padding:10px;font-size:0.8rem;color:var(--primary);font-weight:600;border-top:1px solid var(--border)">View all results →</a>`;
    }
    box.style.display = 'block';
  },
  highlight(text, q) {
    const re = new RegExp(`(${q})`, 'gi');
    return text.replace(re, '<mark style="background:rgba(200,169,110,0.3);color:inherit;border-radius:2px">$1</mark>');
  },
  getBox() {
    let box = document.getElementById('liveSearchBox');
    if (!box) {
      box = document.createElement('div');
      box.id = 'liveSearchBox';
      box.style.cssText = 'position:absolute;top:calc(100% + 8px);left:0;right:0;background:white;border-radius:var(--radius-md);box-shadow:var(--shadow-lg);border:1px solid var(--border);z-index:200;display:none;overflow:hidden';
      document.querySelector('.search-bar-nav')?.appendChild(box);
    }
    return box;
  },
  close() {
    const box = document.getElementById('liveSearchBox');
    if (box) box.style.display = 'none';
  }
};

// ═══ 8. STICKY ADD TO CART ═══
const StickyCart = {
  init() {
    const bar = document.getElementById('stickyCartBar');
    if (!bar) return;
    const trigger = document.querySelector('.product-detail-name') || document.querySelector('.product-detail-price');
    if (!trigger) return;
    const obs = new IntersectionObserver(entries => {
      bar.style.transform = entries[0].isIntersecting ? 'translateY(100%)' : 'translateY(0)';
    }, { threshold: 0 });
    obs.observe(trigger);
  }
};

// ═══ 9. LOYALTY POINTS ═══
const LoyaltyPoints = {
  get() { return parseInt(localStorage.getItem('mego-points') || '0'); },
  add(amount) {
    const pts = this.get() + Math.floor(amount * 10);
    localStorage.setItem('mego-points', pts);
    this.update();
    return pts;
  },
  update() {
    const pts = this.get();
    document.querySelectorAll('.loyalty-points-display').forEach(el => {
      el.textContent = pts.toLocaleString() + ' pts';
    });
  },
  getDiscount() { return Math.floor(this.get() / 100) * 0.5; } // $0.50 per 100 pts
};

// ═══ 10. PRICE DROP ALERT ═══
const PriceAlert = {
  subscribe(productId, email) {
    const alerts = JSON.parse(localStorage.getItem('mego-alerts') || '{}');
    alerts[productId] = { email, since: Date.now() };
    localStorage.setItem('mego-alerts', JSON.stringify(alerts));
    Toast.show(`🔔 We'll notify you at ${email} if the price drops!`, 'success');
  }
};

// ═══ 11. COOKIE CONSENT ═══
const CookieConsent = {
  init() {
    if (localStorage.getItem('mego-cookies')) return;
    const banner = document.getElementById('cookieBanner');
    if (banner) setTimeout(() => { banner.style.transform = 'translateY(0)'; }, 2000);
  },
  accept() {
    localStorage.setItem('mego-cookies', 'accepted');
    const banner = document.getElementById('cookieBanner');
    if (banner) { banner.style.transform = 'translateY(100%)'; setTimeout(() => banner.remove(), 400); }
    Toast.show('Cookie preferences saved ✓', 'success');
  },
  reject() {
    localStorage.setItem('mego-cookies', 'rejected');
    const banner = document.getElementById('cookieBanner');
    if (banner) { banner.style.transform = 'translateY(100%)'; setTimeout(() => banner.remove(), 400); }
  }
};

// ═══ 12. LIVE CHAT WIDGET ═══
const LiveChat = {
  open: false,
  messages: [{ from:'bot', text:'Hi! 👋 Welcome to MEGO Store. How can I help you today?', time: new Date() }],
  init() {
    const widget = document.getElementById('liveChatWidget');
    if (!widget) return;
  },
  toggle() {
    this.open = !this.open;
    const box = document.getElementById('chatBox');
    const btn = document.getElementById('chatToggleBtn');
    if (box) box.style.display = this.open ? 'flex' : 'none';
    if (btn) btn.innerHTML = this.open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-comments"></i>';
    if (this.open) { this.renderMessages(); setTimeout(() => document.getElementById('chatInput')?.focus(), 100); }
  },
  renderMessages() {
    const container = document.getElementById('chatMessages');
    if (!container) return;
    container.innerHTML = this.messages.map(m => `
      <div style="display:flex;${m.from==='user'?'justify-content:flex-end':''};margin-bottom:10px">
        <div style="max-width:80%;padding:9px 13px;border-radius:${m.from==='user'?'14px 14px 0 14px':'14px 14px 14px 0'};background:${m.from==='user'?'linear-gradient(135deg, var(--primary), var(--primary-dark))':'var(--light-2)'};color:${m.from==='user'?'white':'var(--text-dark)'};font-size:0.83rem;line-height:1.5">${m.text}</div>
      </div>`).join('');
    container.scrollTop = container.scrollHeight;
  },
  send() {
    const input = document.getElementById('chatInput');
    if (!input || !input.value.trim()) return;
    const text = input.value.trim();
    this.messages.push({ from:'user', text, time: new Date() });
    input.value = '';
    this.renderMessages();
    setTimeout(() => {
      const replies = [
        'Thanks for reaching out! Let me check that for you. 🔍',
        'Great question! Our team will get back to you shortly.',
        'Sure, I can help with that! Can you share your order number?',
        'We offer free returns within 30 days. Would you like more info?',
        'Our support team is available 24/7. Anything else I can help with? 😊'
      ];
      this.messages.push({ from:'bot', text: replies[Math.floor(Math.random()*replies.length)], time: new Date() });
      this.renderMessages();
    }, 1000 + Math.random()*1000);
  },
  sendOnEnter(e) { if (e.key === 'Enter') this.send(); }
};

// ═══ GLOBAL WIDGETS HTML ═══
function injectGlobalWidgets() {
  const body = document.body;

  // Loading Screen
  const ls = document.createElement('div');
  ls.id = 'loadingScreen';
  ls.style.cssText = 'position:fixed;inset:0;background:var(--dark);z-index:99999;display:flex;flex-direction:column;align-items:center;justify-content:center;transition:opacity 0.5s ease, transform 0.5s ease';
  ls.innerHTML = `
    <div style="font-family:var(--font-display);font-size:3rem;font-weight:900;color:white;margin-bottom:30px">MEGO<span style="color:var(--primary)">.</span></div>
    <div style="width:200px;height:3px;background:rgba(255,255,255,0.1);border-radius:10px;overflow:hidden;margin-bottom:12px">
      <div id="loadingBar" style="height:100%;width:0%;background:linear-gradient(90deg,var(--primary),var(--primary-dark));border-radius:10px;transition:width 0.1s ease"></div>
    </div>
    <div id="loadingNum" style="font-size:0.8rem;color:rgba(255,255,255,0.4);font-family:var(--font-body)">0%</div>`;
  body.insertBefore(ls, body.firstChild);

  // Cookie Banner
  const cb = document.createElement('div');
  cb.id = 'cookieBanner';
  cb.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:var(--secondary);color:white;padding:16px 24px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:14px;z-index:9998;transform:translateY(100%);transition:transform 0.4s ease;box-shadow:0 -4px 20px rgba(0,0,0,0.2)';
  cb.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px">
      <span style="font-size:1.4rem">🍪</span>
      <div><div style="font-weight:600;font-size:0.9rem">We use cookies</div><div style="font-size:0.78rem;opacity:0.7">We use cookies to enhance your experience. By continuing, you agree to our cookie policy.</div></div>
    </div>
    <div style="display:flex;gap:10px">
      <button onclick="CookieConsent.reject()" style="background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);color:white;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:0.82rem">Decline</button>
      <button onclick="CookieConsent.accept()" style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));border:none;color:white;padding:8px 20px;border-radius:8px;cursor:pointer;font-weight:700;font-size:0.82rem">Accept All</button>
    </div>`;
  body.appendChild(cb);

  // Compare Bar
  const compareBar = document.createElement('div');
  compareBar.id = 'compareBar';
  compareBar.style.cssText = 'position:fixed;bottom:0;left:50%;transform:translate(-50%,100%);background:var(--secondary);color:white;padding:12px 20px;border-radius:16px 16px 0 0;display:flex;align-items:center;gap:14px;z-index:998;transition:transform 0.3s ease;box-shadow:0 -4px 20px rgba(0,0,0,0.3);white-space:nowrap';
  compareBar.innerHTML = `
    <span style="font-size:0.82rem;font-weight:600"><span id="compareCount">0</span> items to compare</span>
    <div id="compareItems" style="display:flex;gap:8px"></div>
    <button onclick="Compare.open()" style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));border:none;color:white;padding:7px 16px;border-radius:8px;cursor:pointer;font-size:0.82rem;font-weight:700">Compare</button>
    <button onclick="Compare.clear()" style="background:rgba(255,255,255,0.1);border:none;color:rgba(255,255,255,0.7);padding:7px 10px;border-radius:8px;cursor:pointer;font-size:0.82rem">✕</button>`;
  body.appendChild(compareBar);

  // Compare Modal
  const compareModal = document.createElement('div');
  compareModal.id = 'compareModal';
  compareModal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9990;display:none;align-items:center;justify-content:center;padding:20px';
  compareModal.innerHTML = `
    <div style="background:white;border-radius:20px;padding:28px;max-width:800px;width:100%;max-height:85vh;overflow-y:auto;position:relative">
      <button onclick="document.getElementById('compareModal').style.display='none'" style="position:absolute;top:16px;right:16px;background:var(--light-2);border:none;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center">✕</button>
      <h3 style="font-family:var(--font-display);margin-bottom:20px">Compare Products</h3>
      <div id="compareContent" style="overflow-x:auto"></div>
    </div>`;
  body.appendChild(compareModal);

  // Exit Intent Modal
  const exitModal = document.createElement('div');
  exitModal.id = 'exitIntentModal';
  exitModal.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.7);z-index:9991;display:none;align-items:center;justify-content:center;padding:20px';
  exitModal.innerHTML = `
    <div style="background:white;border-radius:24px;overflow:hidden;max-width:480px;width:100%;position:relative">
      <button onclick="ExitIntent.close()" style="position:absolute;top:14px;right:14px;background:rgba(0,0,0,0.1);border:none;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1rem;z-index:1">✕</button>
      <div style="background:linear-gradient(135deg,var(--secondary),var(--dark));padding:36px;text-align:center;color:white">
        <div style="font-size:3rem;margin-bottom:12px">🎁</div>
        <div style="font-family:var(--font-display);font-size:1.8rem;font-weight:900;margin-bottom:8px">Wait! Don't leave yet.</div>
        <div style="opacity:0.7;font-size:0.9rem">Here's an exclusive offer just for you:</div>
      </div>
      <div style="padding:30px;text-align:center">
        <div style="background:var(--light-2);border:2px dashed var(--primary);border-radius:12px;padding:16px;margin-bottom:20px">
          <div style="font-size:0.75rem;color:var(--text-muted);letter-spacing:1px;text-transform:uppercase;margin-bottom:6px">Use coupon code</div>
          <div style="font-family:var(--font-display);font-size:2rem;font-weight:900;color:var(--primary);letter-spacing:3px">MEGO15</div>
          <div style="font-size:0.8rem;color:var(--text-muted);margin-top:6px">15% OFF your entire order</div>
        </div>
        <button onclick="ExitIntent.apply()" class="btn-primary-custom" style="width:100%;justify-content:center;padding:14px;font-size:1rem">Claim My 15% Discount</button>
        <button onclick="ExitIntent.close()" style="background:none;border:none;color:var(--text-muted);font-size:0.82rem;cursor:pointer;margin-top:12px;display:block;width:100%">No thanks, I'll pay full price</button>
      </div>
    </div>`;
  body.appendChild(exitModal);

  // Live Chat Widget
  const chat = document.createElement('div');
  chat.id = 'liveChatWidget';
  chat.style.cssText = 'position:fixed;bottom:30px;left:30px;z-index:997;';
  chat.innerHTML = `
    <div id="chatBox" style="display:none;flex-direction:column;width:300px;height:380px;background:white;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.2);border:1px solid var(--border);overflow:hidden;margin-bottom:12px">
      <div style="background:linear-gradient(135deg,var(--secondary),var(--dark));padding:14px 16px;display:flex;align-items:center;gap:10px">
        <div style="width:36px;height:36px;background:var(--primary);border-radius:50%;display:flex;align-items:center;justify-content:center;color:white;font-size:1rem">🤖</div>
        <div><div style="font-weight:700;color:white;font-size:0.875rem">MEGO Support</div><div style="font-size:0.7rem;color:rgba(255,255,255,0.6);display:flex;align-items:center;gap:4px"><span style="width:6px;height:6px;background:#2dc653;border-radius:50%;display:inline-block"></span>Online</div></div>
        <button onclick="LiveChat.toggle()" style="margin-left:auto;background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:1rem">✕</button>
      </div>
      <div id="chatMessages" style="flex:1;overflow-y:auto;padding:14px;background:var(--light)"></div>
      <div style="padding:10px 12px;border-top:1px solid var(--border);display:flex;gap:8px;background:white">
        <input id="chatInput" type="text" placeholder="Type a message..." onkeydown="LiveChat.sendOnEnter(event)" style="flex:1;border:1.5px solid var(--border);border-radius:10px;padding:8px 12px;font-family:var(--font-body);font-size:0.82rem;outline:none;color:var(--text-dark)">
        <button onclick="LiveChat.send()" style="background:linear-gradient(135deg,var(--primary),var(--primary-dark));border:none;width:36px;height:36px;border-radius:10px;color:white;cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0"><i class="fas fa-paper-plane" style="font-size:0.8rem"></i></button>
      </div>
    </div>
    <button id="chatToggleBtn" onclick="LiveChat.toggle()" style="width:52px;height:52px;background:linear-gradient(135deg,var(--primary),var(--primary-dark));border:none;border-radius:50%;color:white;cursor:pointer;font-size:1.2rem;box-shadow:0 8px 24px rgba(200,169,110,0.4);display:flex;align-items:center;justify-content:center;position:relative">
      <i class="fas fa-comments"></i>
      <span style="position:absolute;top:0;right:0;width:14px;height:14px;background:var(--accent);border-radius:50%;border:2px solid white;animation:pulse 2s infinite"></span>
    </button>`;
  body.appendChild(chat);
}

// ═══ INIT ALL ═══
document.addEventListener('DOMContentLoaded', () => {
  injectGlobalWidgets();
  LoadingScreen.init();
  ExitIntent.init();
  CookieConsent.init();
  LiveSearch.init();
  LoyaltyPoints.update();

  // Add compare buttons to product cards dynamically
  document.querySelectorAll('.product-card').forEach(card => {
    const id = card.dataset.id;
    if (!id) return;
    const actions = card.querySelector('.product-actions');
    if (actions && !actions.querySelector('.compare-btn')) {
      const btn = document.createElement('button');
      btn.className = 'product-action-btn compare-btn';
      btn.title = 'Compare';
      btn.innerHTML = '<i class="fas fa-balance-scale"></i>';
      btn.onclick = (e) => { e.preventDefault(); Compare.add(parseInt(id)); };
      actions.appendChild(btn);
    }
  });
});
