const CheckoutPage = {
  init() {
    this.renderOrderItems();
    this.updateTotals();
    this.bindEvents();
  },
  renderOrderItems() {
    const cart = Cart.get();
    const container = document.getElementById('orderItems');
    if (!cart.length) { container.innerHTML = '<p style="color:var(--text-muted);font-size:0.875rem">Your cart is empty</p>'; return; }
    container.innerHTML = cart.map(item => `<div class="order-item"><img src="${item.image}" alt="" class="order-item-img"><div><div class="order-item-name">${item.name}</div><div class="order-item-qty">Qty: ${item.qty||1}</div></div><div class="order-item-price">$${(parseFloat(item.price)*(item.qty||1)).toFixed(2)}</div></div>`).join('');
  },
  updateTotals() {
    const subtotal = Cart.getTotal();
    const shipping = subtotal >= 99 ? 0 : 9.99;
    const total = subtotal + shipping;
    document.getElementById('coSubtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('coShipping').textContent = shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`;
    document.getElementById('coTotal').textContent = `$${total.toFixed(2)}`;
  },
  bindEvents() {
    document.querySelectorAll('.payment-method').forEach(el => {
      el.addEventListener('click', () => {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
        el.classList.add('active');
        el.querySelector('input[type="radio"]').checked = true;
        const cardFields = document.getElementById('cardFields');
        if (cardFields) cardFields.style.display = el.dataset.method === 'card' ? 'block' : 'none';
      });
    });
    document.getElementById('placeOrderBtn')?.addEventListener('click', () => this.placeOrder());
  },
  placeOrder() {
    const fields = ['firstName','lastName','email','phone','address','city','country'];
    for (const f of fields) { if (!document.getElementById(f)?.value.trim()) { Toast.show('Please fill all required fields', 'error'); return; } }
    const method = document.querySelector('input[name="paymentMethod"]:checked')?.value;
    if (!method) { Toast.show('Please select a payment method', 'error'); return; }
    document.getElementById('checkoutForm').style.display = 'none';
    document.getElementById('orderSuccess').style.display = 'block';
    Cart.clear();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};
document.addEventListener('DOMContentLoaded', () => CheckoutPage.init());
