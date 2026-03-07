// ========== PRODUCT DETAILS PAGE JS ==========

const ProductDetails = {
  product: null,
  selectedSize: null,
  selectedColor: null,
  qty: 1,

  init() {
    const id = parseInt(new URLSearchParams(window.location.search).get('id')) || 1;
    this.product = PRODUCTS_DATA.find(p => p.id === id) || PRODUCTS_DATA[0];
    this.render();
    this.bindEvents();
    this.renderRelated();
  },

  render() {
    const p = this.product;
    document.title = `${p.name} - MEGO Store`;
    document.getElementById('pdCategory').textContent = p.category;
    document.getElementById('pdName').textContent = p.name;
    document.getElementById('pdStars').textContent = '★'.repeat(Math.floor(p.rating)) + '☆'.repeat(5 - Math.floor(p.rating));
    document.getElementById('pdRatingNum').textContent = p.rating;
    document.getElementById('pdReviews').textContent = `${p.reviews} Reviews`;
    document.getElementById('pdPrice').textContent = `$${p.price.toFixed(2)}`;
    if (p.oldPrice) {
      document.getElementById('pdOldPrice').textContent = `$${p.oldPrice.toFixed(2)}`;
      const disc = Math.round((1 - p.price / p.oldPrice) * 100);
      document.getElementById('pdDisc').textContent = `-${disc}%`;
      document.getElementById('pdDisc').style.display = 'inline';
    }
    document.getElementById('pdMainImg').src = p.image;
    const thumbs = [p.image, ...PRODUCTS_DATA.filter(x => x.id !== p.id).slice(0,3).map(x => x.image)];
    document.getElementById('pdThumbs').innerHTML = thumbs.map((img, i) => `<div class="gallery-thumb${i===0?' active':''}" onclick="ProductDetails.setImg('${img}',this)"><img src="${img}" alt=""></div>`).join('');

    if (p.sizes && p.sizes.length) {
      document.getElementById('pdSizeWrap').innerHTML = `<div class="option-label">Size: <span id="selectedSizeLabel">Select Size</span></div><div class="size-options">${p.sizes.map(s => `<button class="size-btn" onclick="ProductDetails.selectSize('${s}',this)">${s}</button>`).join('')}</div>`;
    } else {
      document.getElementById('pdSizeWrap').innerHTML = '';
    }

    if (p.colors && p.colors.length) {
      document.getElementById('pdColorWrap').innerHTML = `<div class="option-label">Color: <span id="selectedColorLabel">Select Color</span></div><div class="color-options">${p.colors.map(c => `<div class="color-opt" style="background:${c}" onclick="ProductDetails.selectColor('${c}',this)" title="${c}"></div>`).join('')}</div>`;
    } else {
      document.getElementById('pdColorWrap').innerHTML = '';
    }

    // Breadcrumb
    document.getElementById('pdBreadName').textContent = p.name;
    document.getElementById('pdBreadCat').textContent = p.category;
    document.getElementById('pdBreadCatLink').href = `products.html?cat=${p.category.toLowerCase()}`;

    // Wishlist btn
    const wb = document.getElementById('pdWishBtn');
    if (wb) wb.innerHTML = Wishlist.isIn(p.id) ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
  },

  setImg(src, el) {
    document.getElementById('pdMainImg').src = src;
    document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
  },

  selectSize(size, el) {
    document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
    el.classList.add('active');
    this.selectedSize = size;
    const label = document.getElementById('selectedSizeLabel');
    if (label) label.textContent = size;
  },

  selectColor(color, el) {
    document.querySelectorAll('.color-opt').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    this.selectedColor = color;
    const label = document.getElementById('selectedColorLabel');
    if (label) label.textContent = color;
  },

  bindEvents() {
    document.getElementById('qtyMinus')?.addEventListener('click', () => { if (this.qty > 1) { this.qty--; document.getElementById('qtyInput').value = this.qty; } });
    document.getElementById('qtyPlus')?.addEventListener('click', () => { this.qty++; document.getElementById('qtyInput').value = this.qty; });
    document.getElementById('qtyInput')?.addEventListener('change', e => { this.qty = Math.max(1, parseInt(e.target.value) || 1); e.target.value = this.qty; });

    document.getElementById('pdAddCart')?.addEventListener('click', () => {
      const p = { ...this.product, size: this.selectedSize, color: this.selectedColor };
      for (let i = 0; i < this.qty; i++) Cart.add(p);
    });

    document.getElementById('pdBuyNow')?.addEventListener('click', () => {
      const p = { ...this.product, size: this.selectedSize, color: this.selectedColor };
      Cart.add(p);
      window.location = 'cart.html';
    });

    document.getElementById('pdWishBtn')?.addEventListener('click', () => {
      const added = Wishlist.toggle(this.product);
      document.getElementById('pdWishBtn').innerHTML = added ? '<i class="fas fa-heart"></i>' : '<i class="far fa-heart"></i>';
    });
  },

  renderRelated() {
    const p = this.product;
    const related = PRODUCTS_DATA.filter(x => x.id !== p.id && x.category === p.category).slice(0,4);
    const grid = document.getElementById('relatedGrid');
    if (grid) grid.innerHTML = related.map(r => `<div class="col-6 col-md-3">${renderProductCard(r)}</div>`).join('');
  }
};

// ===== REVIEW FORM =====
function submitReview(e) {
  e.preventDefault();
  const name = document.getElementById('reviewName').value;
  const rating = document.querySelector('input[name="reviewRating"]:checked')?.value;
  const text = document.getElementById('reviewText').value;
  if (!name || !rating || !text) { Toast.show('Please fill all fields', 'error'); return; }
  const reviewsContainer = document.getElementById('reviewsList');
  const card = document.createElement('div');
  card.className = 'review-card';
  card.innerHTML = `<div class="review-header"><div><div class="reviewer-name">${name}</div><div class="review-stars">${'★'.repeat(parseInt(rating))}${'☆'.repeat(5-parseInt(rating))}</div></div><div class="review-date">Just now</div></div><p class="review-text">${text}</p>`;
  reviewsContainer.prepend(card);
  e.target.reset();
  Toast.show('Review submitted! Thank you 🎉', 'success');
  bootstrap.Modal.getInstance(document.getElementById('reviewModal'))?.hide();
}

document.addEventListener('DOMContentLoaded', () => ProductDetails.init());
