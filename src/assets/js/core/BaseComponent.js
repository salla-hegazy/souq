export default class BaseComponent {
  constructor(el) {
    this.el    = el;
    this.isRTL = document.documentElement.dir === 'rtl';
    this.lang  = document.documentElement.lang || 'ar';
  }

  money(amount)        { return salla.money(amount); }
  t(key, params)       { return salla.lang.get(key, params); }
  notify(type, msg)    { salla.notify[type](msg); }
  destroy()            {}
}
