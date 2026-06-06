import BaseComponent from '../core/BaseComponent';

export default class CartManager extends BaseComponent {
  constructor() {
    super(null);
    this.state = { items: [], count: 0, subtotal: 0, isOpen: false };
    this._bindSDKEvents();
  }

  _bindSDKEvents() {
    salla.cart.event.onUpdated(summary => {
      this._updateState({ count: summary.count, subtotal: summary.total });
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: this.state }));
    });

    salla.cart.event.onItemAdded(r => {
      if (r?.data) this._updateState(r.data);
      this.open();
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: this.state }));
    });

    salla.cart.event.onItemRemoved(r => {
      if (r?.data) this._updateState(r.data);
      window.dispatchEvent(new CustomEvent('cart:updated', { detail: this.state }));
    });
  }

  _updateState(data) {
    if (!data) return;
    if (data.items    !== undefined) this.state.items    = data.items;
    if (data.count    !== undefined) this.state.count    = data.count;
    if (data.subtotal !== undefined) this.state.subtotal = data.subtotal;
    if (data.total    !== undefined) this.state.subtotal = data.total;
  }

  async init() {
    try {
      const res = await salla.cart.details();
      if (res?.data) this._updateState(res.data);
    } catch (_) {}
    return this;
  }

  async addItem(productId, qty = 1, options = {}) {
    try {
      await salla.cart.addItem({ id: productId, quantity: qty, options });
    } catch (err) { this.notify('error', err.message); }
  }

  async quickAdd(productId)  { await salla.cart.quickAdd(productId); }
  async removeItem(itemId)   { await salla.cart.deleteItem(itemId); }
  async applyCoupon(code)    { await salla.cart.addCoupon(code); }

  open()   { this.state.isOpen = true;  window.dispatchEvent(new CustomEvent('cart:opened')); }
  close()  { this.state.isOpen = false; window.dispatchEvent(new CustomEvent('cart:closed')); }
  toggle() { this.state.isOpen ? this.close() : this.open(); }
}
