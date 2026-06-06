document.addEventListener('alpine:init', () => {
  Alpine.store('ui', {
    megaMenuOpen:  false,
    searchOpen:    false,
    cartOpen:      false,
    mobileMenuOpen: false,
    activeModal:   null,

    init() {
      window.addEventListener('cart:opened', () => { this.cartOpen = true; });
      window.addEventListener('cart:closed', () => { this.cartOpen = false; });
    },

    open(key) {
      const map = { megaMenu: 'megaMenuOpen', search: 'searchOpen', cart: 'cartOpen', mobileMenu: 'mobileMenuOpen' };
      if (map[key]) this[map[key]] = true;
    },
    close(key) {
      const map = { megaMenu: 'megaMenuOpen', search: 'searchOpen', cart: 'cartOpen', mobileMenu: 'mobileMenuOpen' };
      if (map[key]) this[map[key]] = false;
    },
    toggle(key) {
      const map = { megaMenu: 'megaMenuOpen', search: 'searchOpen', cart: 'cartOpen', mobileMenu: 'mobileMenuOpen' };
      if (map[key]) this[map[key]] = !this[map[key]];
    },

    openCart()  { this.cartOpen = true;  window.dispatchEvent(new CustomEvent('cart:opened')); },
    closeCart() { this.cartOpen = false; window.dispatchEvent(new CustomEvent('cart:closed')); },
    toggleCart(){ this.cartOpen ? this.closeCart() : this.openCart(); },

    openModal(name)  { this.activeModal = name; },
    closeModal()     { this.activeModal = null; },
    isModal(name)    { return this.activeModal === name; },
  });
});
