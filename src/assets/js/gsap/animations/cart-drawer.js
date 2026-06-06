// RTL-safe cart drawer GSAP timeline
window.initCartDrawer = function () {
  if (typeof gsap === 'undefined') return;

  const isRTL   = document.documentElement.dir === 'rtl';
  const drawer  = document.querySelector('.souq-cart-drawer');
  const overlay = document.querySelector('.souq-cart-overlay');
  if (!drawer || !overlay) return;

  gsap.set(drawer,  { xPercent: isRTL ? -100 : 100, visibility: 'hidden' });
  gsap.set(overlay, { opacity: 0, visibility: 'hidden' });

  const tl = gsap.timeline({ paused: true })
    .set([drawer, overlay], { visibility: 'visible' })
    .to(overlay, { opacity: 1, duration: 0.3 })
    .to(drawer,  { xPercent: 0, duration: 0.45, ease: 'power3.out' }, '-=0.3')
    .from('.souq-cart-item', { x: isRTL ? -20 : 20, opacity: 0, duration: 0.3, stagger: 0.06 }, '-=0.15');

  window.addEventListener('cart:opened', () => tl.play());
  window.addEventListener('cart:closed', () => tl.reverse());
};
