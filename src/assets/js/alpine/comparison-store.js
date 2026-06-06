document.addEventListener('alpine:init', () => {
  Alpine.store('comparison', {
    items: [],
    max:   4,

    has(productId)    { return this.items.some(p => p.id === Number(productId)); },
    toggle(product)   { this.has(product.id) ? this.remove(product.id) : this.add(product); },

    add(product) {
      if (this.items.length >= this.max) {
        salla.notify.error(salla.lang.get('pages.products.comparison_limit') || 'Max 4 products');
        return;
      }
      if (!this.has(product.id)) this.items.push(product);
    },

    remove(productId) { this.items = this.items.filter(p => p.id !== Number(productId)); },
    clear()           { this.items = []; },
    get count()       { return this.items.length; },
  });
});
