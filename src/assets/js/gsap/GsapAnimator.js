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
    this.animateSectionTitles();
    this.animateFeatureCards();
    this.animateBanners();
    this.animateDataBlocks();
    ScrollTrigger.refresh();
    return this;
  }

  animateHero() {
    const bg = document.querySelector('.hero__bg-image');
    if (!bg) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero__bg-image',  { scale: 1.1, duration: 1.6 })
      .from('.hero__eyebrow',   { y: 24, opacity: 0, duration: 0.55 }, '-=1.1')
      .from('.hero__heading',   { y: 48, opacity: 0, duration: 0.7 },  '-=0.45')
      .from('.hero__subtext',   { y: 28, opacity: 0, duration: 0.55 }, '-=0.45')
      .from('.hero__cta-btn',   { y: 24, opacity: 0, scale: 0.95, duration: 0.5 }, '-=0.38')
      .from('.hero__trust-bar', { y: 20, opacity: 0, duration: 0.45 }, '-=0.25');
    this._timelines.set('hero', tl);
  }

  animateProductCards() {
    if (!document.querySelector('.product-card')) return;

    ScrollTrigger.batch('.product-card', {
      start:   'top 90%',
      once:    true,
      onEnter: cards => gsap.from(cards, {
        y: 50, opacity: 0, duration: 0.65, stagger: 0.08,
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

  // Scroll-triggered section title + "view all" link reveal
  animateSectionTitles() {
    document.querySelectorAll('.s-block__title').forEach(block => {
      const h2   = block.querySelector('h2');
      const link = block.querySelector('.s-block__display-all');
      if (!h2) return;

      const tl = gsap.timeline({
        scrollTrigger: { trigger: block, start: 'top 88%', once: true },
      });
      tl.from(h2, { y: 28, opacity: 0, duration: 0.55, ease: 'power3.out', clearProps: 'all' });
      if (link) {
        tl.from(link, {
          x: this.isRTL ? -18 : 18, opacity: 0, duration: 0.45, ease: 'power2.out', clearProps: 'all',
        }, '-=0.3');
      }
    });
  }

  // Staggered DaisyUI feature cards entrance
  animateFeatureCards() {
    const cards = document.querySelectorAll('.s-block--features__item');
    if (!cards.length) return;

    ScrollTrigger.batch(cards, {
      start:   'top 88%',
      once:    true,
      onEnter: els => gsap.from(els, {
        y: 56, opacity: 0, duration: 0.7, stagger: 0.12,
        ease: 'power3.out', clearProps: 'all',
      }),
    });

    // Icon wiggle on hover
    cards.forEach(card => {
      const icon = card.querySelector('.feature-icon i');
      if (!icon) return;
      card.addEventListener('mouseenter', () =>
        gsap.fromTo(icon,
          { rotate: -15, scale: 0.8 },
          { rotate: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }
        )
      );
    });
  }

  // Promo banner + square banner entry animations
  animateBanners() {
    document.querySelectorAll('.promo-banner__card').forEach(card => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: 'top 88%', once: true },
        scale: 0.96, opacity: 0, duration: 0.75, ease: 'power2.out', clearProps: 'all',
      });
    });

    const bannerEntries = document.querySelectorAll('.banner-entry');
    if (bannerEntries.length) {
      ScrollTrigger.batch(bannerEntries, {
        start:   'top 88%',
        once:    true,
        onEnter: els => gsap.from(els, {
          y: 36, opacity: 0, duration: 0.6, stagger: 0.08,
          ease: 'power2.out', clearProps: 'all',
        }),
      });
    }
  }

  // data-animate generic scroll reveal (newsletter, promo blocks, etc.)
  animateDataBlocks() {
    const els = document.querySelectorAll('[data-animate]');
    if (!els.length) return;

    ScrollTrigger.batch(els, {
      start:   'top 88%',
      once:    true,
      onEnter: batch => gsap.from(batch, {
        y: 36, opacity: 0, duration: 0.65, stagger: 0.07,
        ease: 'power3.out', clearProps: 'all',
      }),
    });
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
