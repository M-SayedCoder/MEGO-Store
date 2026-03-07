// ========== CART PAGE JS ==========
const CartPage = {
  discount: 0,
  coupon: null,

  init() { this.render(); },

  render() {
    const cart = Cart.get();
    const container = document.getElementById('cartItems');
    if (!cart.length) {
      document.getElementById('cartMain').innerHTML = `<div class="empty-state"><div class="empty-state-icon">🛍️</div><h4>Your cart is empty</h4><p>Start shopping to add products to your cart.</p><a href="products.html" class="btn-primary-custom"><i class="fas fa-shopping-bag"></i> Continue Shopping</a></div>`;
      return;
    }
    container.innerHTML = cart.map(item => `
      <div class="cart-item" data-key="${item.key}">
        <div class="cart-product">
          <img src="${item.image}" alt="${item.name}" class="cart-product-img">
          <div>
            <div class="cart-product-name">${item.name}</div>
            <div class="cart-product-meta">${[item.size && 'Size: '+item.size, item.color && 'Color: '+item.color].filter(Boolean).join(' · ') || item.category}</div>
          </div>
        </div>
        <div class="cart-price">$${parseFloat(item.price).toFixed(2)}</div>
        <div class="cart-qty">
          <button class="cart-qty-btn" onclick="CartPage.updateQty('${item.key}', ${(item.qty||1)-1})"><i class="fas fa-minus"></i></button>
          <span class="cart-qty-val">${item.qty || 1}</span>
          <button class="cart-qty-btn" onclick="CartPage.updateQty('${item.key}', ${(item.qty||1)+1})"><i class="fas fa-plus"></i></button>
        </div>
        <div class="cart-subtotal">$${(parseFloat(item.price) * (item.qty||1)).toFixed(2)}</div>
        <button class="cart-remove" onclick="CartPage.removeItem('${item.key}')"><i class="fas fa-times"></i></button>
      </div>`).join('');
    this.updateSummary();
  },

  updateQty(key, qty) {
    Cart.updateQty(key, qty);
    this.render();
  },

  removeItem(key) {
    Cart.remove(key);
    this.render();
    Toast.show('Item removed from cart', 'info');
  },

  applyCoupon() {
    const code = document.getElementById('couponInput').value.trim().toUpperCase();
    const coupons = { 'MEGO30': 30, 'SAVE20': 20, 'WELCOME10': 10 };
    if (coupons[code]) {
      this.discount = coupons[code];
      this.coupon = code;
      Toast.show(`Coupon "${code}" applied! ${coupons[code]}% off 🎉`, 'success');
      this.updateSummary();
    } else {
      Toast.show('Invalid coupon code', 'error');
    }
  },

  updateSummary() {
    const cart = Cart.get();
    const subtotal = Cart.getTotal();
    const shipping = subtotal >= 99 ? 0 : 9.99;
    const discAmt = this.discount ? subtotal * (this.discount / 100) : 0;
    const total = subtotal - discAmt + shipping;
    document.getElementById('summarySubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('summaryShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    const discRow = document.getElementById('discountRow');
    if (discAmt > 0) { discRow.style.display = 'flex'; document.getElementById('summaryDiscount').textContent = `-$${discAmt.toFixed(2)}`; }
    else { discRow.style.display = 'none'; }
    document.getElementById('summaryTotal').textContent = `$${total.toFixed(2)}`;
    document.getElementById('itemCount').textContent = Cart.getCount();
  },

  clearCart() {
    if (confirm('Clear all items from cart?')) {
      Cart.clear();
      this.render();
      Toast.show('Cart cleared', 'info');
    }
  }
};

document.addEventListener('DOMContentLoaded', () => CartPage.init());
