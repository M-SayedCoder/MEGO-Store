// ========== INDEX PAGE JS ==========

// ===== HERO SLIDER =====
const HeroSlider = {
  slides: [],
  dots: [],
  current: 0,
  interval: null,
  init() {
    this.slides = document.querySelectorAll('.hero-slide');
    this.dots = document.querySelectorAll('.hero-dot');
    if (!this.slides.length) return;
    this.show(0);
    this.startAuto();
    this.dots.forEach((d, i) => d.addEventListener('click', () => { this.show(i); this.resetAuto(); }));
  },
  show(n) {
    this.slides.forEach(s => s.classList.remove('active'));
    this.dots.forEach(d => d.classList.remove('active'));
    this.current = n;
    this.slides[n].classList.add('active');
    this.dots[n].classList.add('active');
  },
  next() { this.show((this.current + 1) % this.slides.length); },
  startAuto() { this.interval = setInterval(() => this.next(), 5000); },
  resetAuto() { clearInterval(this.interval); this.startAuto(); }
};

// ===== COUNTDOWN TIMER =====
const CountdownTimer = {
  init() {
    const target = new Date();
    target.setDate(target.getDate() + 3);
    target.setHours(0, 0, 0, 0);
    const update = () => {
      const diff = target - new Date();
      if (diff <= 0) return;
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      const set = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = String(v).padStart(2, '0'); };
      set('cd-days', d); set('cd-hours', h); set('cd-mins', m); set('cd-secs', s);
    };
    update();
    setInterval(update, 1000);
  }
};

// ===== PRODUCTS TAB =====
const ProductsTabs = {
  init() {
    const grid = document.getElementById('featuredGrid');
    if (!grid) return;
    this.render('all');
    document.querySelectorAll('[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.render(btn.getAttribute('data-filter'));
      });
    });
  },
  render(filter) {
    const grid = document.getElementById('featuredGrid');
    const data = filter === 'all' ? PRODUCTS_DATA : filter === 'sale' ? PRODUCTS_DATA.filter(p => p.badge === 'sale') : PRODUCTS_DATA.filter(p => p.category.toLowerCase() === filter);
    const items = data.slice(0, 8);
    grid.innerHTML = items.map(p => `<div class="col-6 col-md-4 col-lg-3">${renderProductCard(p)}</div>`).join('');
    grid.style.animation = 'none';
    setTimeout(() => { grid.style.animation = 'fadeInUp 0.4s ease'; }, 10);
  }
};

// ===== SCROLL ANIMATIONS =====
const ScrollAnimations = {
  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('fade-in-up'); observer.unobserve(e.target); } });
    }, { threshold: 0.1 });
    document.querySelectorAll('.category-card, .testimonial-card, .feature-item, .promo-card').forEach(el => observer.observe(el));
  }
};

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  HeroSlider.init();
  CountdownTimer.init();
  ProductsTabs.init();
  ScrollAnimations.init();
});
