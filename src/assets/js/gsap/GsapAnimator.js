export default class GsapAnimator {
  constructor() {
    this.isRTL         = document.documentElement.dir === 'rtl';
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this._timelines    = new Map();
  }

  init() {
    if (typeof gsap === 'undefined') return this;

    gsap.registerPlugin(ScrollTrigger);
    gsap.defaults({ ease: 'power2.out', duration: 0.7, force3D: true });

    if (this.reducedMotion) {
      gsap.globalTimeline.timeScale(1000);
      return this;
    }

    this.animateHero();
    this.animateProductCards();
    this.initCartDrawer();
    this.animatePageEnter();
    ScrollTrigger.refresh();
    return this;
  }

  animateHero() {
    const bg = document.querySelector('.hero__bg-image');
    if (!bg) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__bg-image',  { scale: 1.08, duration: 1.4 })
      .from('.hero__eyebrow',   { y: 20, opacity: 0, duration: 0.5 },  '-=0.9')
      .from('.hero__heading',   { y: 40, opacity: 0, duration: 0.65 }, '-=0.4')
      .from('.hero__subtext',   { y: 24, opacity: 0, duration: 0.5 },  '-=0.4')
      .from('.hero__cta-btn',   { y: 20, opacity: 0, scale: 0.95, duration: 0.45 }, '-=0.35')
      .from('.hero__trust-bar', { y: 16, opacity: 0, duration: 0.4 },  '-=0.2');
    this._timelines.set('hero', tl);
  }

  animateProductCards() {
    if (!document.querySelector('.product-card')) return;

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
  }

  initCartDrawer() {
    const drawer  = document.querySelector('.souq-cart-drawer');
    const overlay = document.querySelector('.souq-cart-overlay');
    if (!drawer || !overlay) return;

    gsap.set(drawer,  { xPercent: this.isRTL ? -100 : 100, visibility: 'hidden' });
    gsap.set(overlay, { opacity: 0, visibility: 'hidden' });

    const tl = gsap.timeline({ paused: true })
      .set([drawer, overlay], { visibility: 'visible' })
      .to(overlay, { opacity: 1, duration: 0.3 })
      .to(drawer,  { xPercent: 0, duration: 0.45, ease: 'power3.out' }, '-=0.3')
      .from('.souq-cart-item', { x: this.isRTL ? -20 : 20, opacity: 0, duration: 0.3, stagger: 0.06 }, '-=0.15');

    this._timelines.set('cart', tl);
    window.addEventListener('cart:opened', () => tl.play());
    window.addEventListener('cart:closed', () => tl.reverse());
  }

  animatePageEnter() {
    const main = document.querySelector('#main-content');
    if (!main) return;
    gsap.from('#main-content', { opacity: 0, y: 16, duration: 0.5, force3D: true, clearProps: 'all' });
  }

  kill(name) {
    if (this._timelines.has(name)) {
      this._timelines.get(name).kill();
      this._timelines.delete(name);
    }
  }

  killAll() {
    ScrollTrigger.killAll();
    this._timelines.forEach(tl => tl.kill());
    this._timelines.clear();
  }
}
