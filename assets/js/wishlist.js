const WishlistPage = {
  init() { this.render(); },
  render() {
    const list = Wishlist.get();
    const grid = document.getElementById('wishlistGrid');
    const count = document.getElementById('wishCount');
    if (count) count.textContent = list.length;
    if (!list.length) {
      grid.innerHTML = `<div class="col-12"><div class="empty-state"><div class="empty-state-icon">❤️</div><h4>Your wishlist is empty</h4><p>Save your favourite items and shop them later.</p><a href="products.html" class="btn-primary-custom"><i class="fas fa-shopping-bag"></i> Browse Products</a></div></div>`;
      return;
    }
    grid.innerHTML = list.map(p => `<div class="col-6 col-md-4 col-lg-3">${renderProductCard(p)}</div>`).join('');
  },
  clearAll() {
    if (confirm('Clear all wishlist items?')) { localStorage.removeItem('mego-wishlist'); Wishlist.updateBadge(); this.render(); Toast.show('Wishlist cleared', 'info'); }
  }
};
document.addEventListener('DOMContentLoaded', () => WishlistPage.init());
