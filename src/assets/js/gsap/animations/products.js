// Called by GsapAnimator.animateProductCards() — also available as a standalone global
window.initProductCards = function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  ScrollTrigger.batch('.product-card', {
    start:   'top 90%',
    once:    true,
    onEnter: cards => gsap.from(cards, {
      y: 40, opacity: 0, duration: 0.6, stagger: 0.08,
      force3D: true, clearProps: 'all',
    }),
  });

  document.querySelectorAll('.product-card').forEach(card => {
    const img = card.querySelector('.product-card__img');
    if (!img) return;
    card.addEventListener('mouseenter', () => gsap.to(img, { scale: 1.06, duration: 0.4, force3D: true }));
    card.addEventListener('mouseleave', () => gsap.to(img, { scale: 1.0,  duration: 0.3, force3D: true }));
  });
};
