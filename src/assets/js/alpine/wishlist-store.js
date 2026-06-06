document.addEventListener('alpine:init', () => {
  Alpine.store('wishlist', {
    ids: [],

    init() {
      // Seed from Salla's local storage cache
      const cached = salla.storage?.get('salla::wishlist', []) || [];
      this.ids = cached.map(Number);

      window.addEventListener('wishlist:changed', ({ detail }) => {
        if (detail.added) {
          if (!this.ids.includes(detail.productId)) this.ids.push(detail.productId);
        } else {
          this.ids = this.ids.filter(id => id !== detail.productId);
        }
      });
    },

    has(productId)    { return this.ids.includes(Number(productId)); },
    async toggle(id)  { await window.__wishlist?.toggle(id); },
  });
});
