// Page enter animation + section reveal via ScrollTrigger
window.initPageEnter = function () {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.from('#main-content', {
    opacity: 0, y: 16, duration: 0.5, force3D: true, clearProps: 'all',
  });

  ScrollTrigger.batch('[data-animate]', {
    start:   'top 88%',
    once:    true,
    onEnter: els => gsap.from(els, {
      y: 32, opacity: 0, duration: 0.55, stagger: 0.07,
      force3D: true, clearProps: 'all',
    }),
  });
};
