// ========== PRODUCTS PAGE JS ==========

const ProductsPage = {
  allProducts: [...PRODUCTS_DATA],
  filtered: [],
  currentPage: 1,
  perPage: 8,
  view: 'grid',
  filters: { categories: [], colors: [], minPrice: 0, maxPrice: 500, rating: 0, badge: null },
  sort: 'featured',

  init() {
    this.parseURL();
    this.filtered = [...this.allProducts];
    this.apply();
    this.bindEvents();
    this.renderFilterCounts();
  },

  parseURL() {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('cat');
    const sale = params.get('sale');
    if (cat) { this.filters.categories = [cat.charAt(0).toUpperCase() + cat.slice(1)]; }
    if (sale) { this.filters.badge = 'sale'; }
    if (cat) { document.querySelector(`[data-cat="${cat}"]`)?.classList.add('active'); }
    if (sale) { document.getElementById('filterSale')?.setAttribute('checked', true); }
  },

  bindEvents() {
    // Sort
    const sortSel = document.getElementById('sortSelect');
    if (sortSel) sortSel.addEventListener('change', e => { this.sort = e.target.value; this.apply(); });

    // Price range
    const priceRange = document.getElementById('priceRange');
    if (priceRange) {
      priceRange.addEventListener('input', e => {
        this.filters.maxPrice = parseInt(e.target.value);
        document.getElementById('priceMax').textContent = '$' + e.target.value;
        this.apply();
      });
    }

    // Category checkboxes
    document.querySelectorAll('[data-cat-filter]').forEach(el => {
      el.addEventListener('change', () => {
        const cats = [...document.querySelectorAll('[data-cat-filter]:checked')].map(e => e.value);
        this.filters.categories = cats;
        this.apply();
      });
    });

    // Rating filter
    document.querySelectorAll('.rating-option').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.rating-option').forEach(r => r.classList.remove('active'));
        el.classList.add('active');
        this.filters.rating = parseFloat(el.dataset.rating) || 0;
        this.apply();
      });
    });

    // Badge filter
    document.getElementById('filterSale')?.addEventListener('change', e => {
      this.filters.badge = e.target.checked ? 'sale' : null;
      this.apply();
    });

    // View toggle
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.view = btn.dataset.view;
        this.renderProducts();
      });
    });

    // Mobile filter
    document.getElementById('mobileFilterBtn')?.addEventListener('click', () => {
      document.getElementById('filtersSidebar').classList.add('open');
    });
    document.getElementById('filterCloseBtn')?.addEventListener('click', () => {
      document.getElementById('filtersSidebar').classList.remove('open');
    });

    // Clear all filters
    document.getElementById('clearAllFilters')?.addEventListener('click', () => this.clearAll());
  },

  clearAll() {
    this.filters = { categories: [], colors: [], minPrice: 0, maxPrice: 500, rating: 0, badge: null };
    document.querySelectorAll('[data-cat-filter]').forEach(el => el.checked = false);
    document.querySelectorAll('.rating-option').forEach(el => el.classList.remove('active'));
    const pr = document.getElementById('priceRange');
    if (pr) { pr.value = 500; document.getElementById('priceMax').textContent = '$500'; }
    const fs = document.getElementById('filterSale');
    if (fs) fs.checked = false;
    this.apply();
    Toast.show('Filters cleared', 'info');
  },

  apply() {
    let data = [...this.allProducts];
    if (this.filters.categories.length) data = data.filter(p => this.filters.categories.some(c => p.category.toLowerCase() === c.toLowerCase()));
    if (this.filters.badge) data = data.filter(p => p.badge === this.filters.badge);
    data = data.filter(p => p.price >= this.filters.minPrice && p.price <= this.filters.maxPrice);
    if (this.filters.rating) data = data.filter(p => p.rating >= this.filters.rating);

    switch(this.sort) {
      case 'price-asc': data.sort((a,b) => a.price - b.price); break;
      case 'price-desc': data.sort((a,b) => b.price - a.price); break;
      case 'rating': data.sort((a,b) => b.rating - a.rating); break;
      case 'newest': data.sort((a,b) => (b.badge === 'new') - (a.badge === 'new')); break;
      case 'name': data.sort((a,b) => a.name.localeCompare(b.name)); break;
    }

    this.filtered = data;
    this.currentPage = 1;
    this.renderProducts();
    this.renderPagination();
    this.renderActiveTags();
    document.getElementById('resultsCount').textContent = data.length;
  },

  renderProducts() {
    const grid = document.getElementById('productsGrid');
    if (!grid) return;
    const start = (this.currentPage - 1) * this.perPage;
    const page = this.filtered.slice(start, start + this.perPage);

    if (!page.length) {
      grid.innerHTML = `<div class="col-12"><div class="empty-state"><div class="empty-state-icon">🔍</div><h4>No products found</h4><p>Try adjusting your filters or search terms.</p><button class="btn-primary-custom" onclick="ProductsPage.clearAll()">Clear Filters</button></div></div>`;
      return;
    }

    if (this.view === 'grid') {
      grid.className = 'row g-3';
      grid.innerHTML = page.map(p => `<div class="col-6 col-md-4 col-lg-3">${renderProductCard(p)}</div>`).join('');
    } else {
      grid.className = 'd-flex flex-column gap-3';
      grid.innerHTML = page.map(p => `
        <div class="product-card-list">
          <div class="product-card-list-img"><img src="${p.image}" alt="${p.name}"></div>
          <div class="product-card-list-body">
            <div>
              <div class="product-category">${p.category}</div>
              <div class="product-name" style="font-family:var(--font-display);font-size:1.1rem;font-weight:600">${p.name}</div>
              <div class="product-rating mt-1"><span class="stars">${'★'.repeat(Math.floor(p.rating))}</span><span class="rating-count">(${p.reviews})</span></div>
            </div>
            <div class="d-flex justify-content-between align-items-center flex-wrap gap-2">
              <div class="product-price"><span class="price-current">$${p.price.toFixed(2)}</span>${p.oldPrice?`<span class="price-old">$${p.oldPrice.toFixed(2)}</span>`:''}</div>
              <div class="product-card-list-actions">
                <button class="btn-primary-custom py-2 px-3" onclick="quickAdd(${p.id})" style="font-size:0.82rem"><i class="fas fa-shopping-bag"></i> Add to Cart</button>
                <a href="product-details.html?id=${p.id}" class="btn-outline-custom py-2 px-3" style="font-size:0.82rem"><i class="fas fa-eye"></i> View</a>
                <button class="product-action-btn${Wishlist.isIn(p.id)?' active':''}" onclick="toggleWishlist(${p.id},event)" style="position:static;opacity:1;transform:none"><i class="fas fa-heart"></i></button>
              </div>
            </div>
          </div>
        </div>`).join('');
    }
  },

  renderPagination() {
    const wrap = document.getElementById('pagination');
    if (!wrap) return;
    const total = Math.ceil(this.filtered.length / this.perPage);
    if (total <= 1) { wrap.innerHTML = ''; return; }
    let html = `<button class="page-btn" onclick="ProductsPage.goPage(${this.currentPage-1})" ${this.currentPage===1?'disabled':''}><i class="fas fa-chevron-left"></i></button>`;
    for (let i = 1; i <= total; i++) html += `<button class="page-btn${i===this.currentPage?' active':''}" onclick="ProductsPage.goPage(${i})">${i}</button>`;
    html += `<button class="page-btn" onclick="ProductsPage.goPage(${this.currentPage+1})" ${this.currentPage===total?'disabled':''}><i class="fas fa-chevron-right"></i></button>`;
    wrap.innerHTML = html;
  },

  goPage(n) {
    const total = Math.ceil(this.filtered.length / this.perPage);
    if (n < 1 || n > total) return;
    this.currentPage = n;
    this.renderProducts();
    this.renderPagination();
    window.scrollTo({ top: 300, behavior: 'smooth' });
  },

  renderActiveTags() {
    const wrap = document.getElementById('activeTags');
    if (!wrap) return;
    const tags = [];
    this.filters.categories.forEach(c => tags.push({ label: c, clear: () => { this.filters.categories = this.filters.categories.filter(x => x !== c); this.apply(); } }));
    if (this.filters.badge) tags.push({ label: 'Sale Only', clear: () => { this.filters.badge = null; document.getElementById('filterSale').checked = false; this.apply(); } });
    if (this.filters.rating) tags.push({ label: `${this.filters.rating}★+`, clear: () => { this.filters.rating = 0; this.apply(); } });
    wrap.innerHTML = tags.map((t, i) => `<span class="filter-tag">${t.label}<button onclick="ProductsPage.filterTags[${i}].clear()">✕</button></span>`).join('');
    this.filterTags = tags;
  },

  renderFilterCounts() {
    const cats = ['Men','Women','Accessories','Footwear','Jewelry'];
    cats.forEach(c => {
      const el = document.getElementById(`count-${c.toLowerCase()}`);
      if (el) el.textContent = PRODUCTS_DATA.filter(p => p.category === c).length;
    });
  }
};

document.addEventListener('DOMContentLoaded', () => ProductsPage.init());
