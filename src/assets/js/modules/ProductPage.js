import BaseComponent from '../core/BaseComponent';

export default class ProductPage extends BaseComponent {
  constructor(el, productData) {
    super(el);
    this.product      = productData;
    this.selectedOpts = {};
    this.price        = productData.price;
    this.available    = productData.status === 'sale';
  }

  async init() {
    if (!this.el) return this;
    this.el.addEventListener('option:changed', e => this._onOptionChanged(e.detail));
    return this;
  }

  async _onOptionChanged(options) {
    this.selectedOpts = options;
    try {
      const res = await salla.product.getPrice({ id: this.product.id, options });
      if (res?.data) {
        this.price     = res.data.price;
        this.available = res.data.is_available;
        this.el.dispatchEvent(new CustomEvent('product:price-updated', {
          detail: { price: this.price, available: this.available },
        }));
      }
    } catch (_) {}
  }

  async addToCart(qty = 1) {
    if (!this.available) {
      return this.notify('error', this.t('pages.products.out_of_stock'));
    }
    await window.__cart.addItem(this.product.id, qty, this.selectedOpts);
  }

  formattedPrice() { return this.money(this.price); }
}
