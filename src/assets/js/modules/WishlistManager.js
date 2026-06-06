import BaseComponent from '../core/BaseComponent';

export default class WishlistManager extends BaseComponent {
  constructor() {
    super(null);
    this.ids = new Set();
    this._bindSDKEvents();
  }

  _bindSDKEvents() {
    salla.event.wishlist.onAdded((r, id) => {
      this.ids.add(Number(id));
      this._emit(id, true);
    });
    salla.event.wishlist.onRemoved((r, id) => {
      this.ids.delete(Number(id));
      this._emit(id, false);
    });
  }

  _emit(productId, added) {
    window.dispatchEvent(new CustomEvent('wishlist:changed', { detail: { productId: Number(productId), added } }));
  }

  async toggle(productId) { await salla.wishlist.toggle(productId); }
  has(productId)          { return this.ids.has(Number(productId)); }
}
