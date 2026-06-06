import BaseComponent from '../core/BaseComponent';

export default class SearchManager extends BaseComponent {
  constructor() {
    super(null);
    this.results = [];
    this.query   = '';
    this.loading = false;
    this._timer  = null;
    this.perPage = 8;
  }

  async search(q) {
    this.query = q;
    clearTimeout(this._timer);
    if (q.length < 2) { this.results = []; this._emit(); return; }

    this._timer = setTimeout(async () => {
      this.loading = true;
      this._emit();
      try {
        const res    = await salla.product.search({ q, per_page: this.perPage });
        this.results = res?.data?.products || [];
      } catch (_) {
        this.results = [];
      } finally {
        this.loading = false;
        this._emit();
      }
    }, 300);
  }

  _emit() {
    window.dispatchEvent(new CustomEvent('search:updated', {
      detail: { results: this.results, query: this.query, loading: this.loading },
    }));
  }

  clear() { this.query = ''; this.results = []; this._emit(); }
}
