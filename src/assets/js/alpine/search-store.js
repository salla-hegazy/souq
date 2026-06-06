document.addEventListener('alpine:init', () => {
  Alpine.store('search', {
    results: [],
    query:   '',
    loading: false,

    init() {
      window.addEventListener('search:updated', ({ detail }) => {
        this.results = detail.results;
        this.query   = detail.query;
        this.loading = detail.loading;
      });
    },

    async search(q) { await window.__search?.search(q); },
    clear()         { window.__search?.clear(); },
  });
});
