/* Data loader – fetches data/data.json once and exposes window.ST_DATA */
window.ST = {
  data: null,
  loading: null,
  load() {
    if (this.data) return Promise.resolve(this.data);
    if (this.loading) return this.loading;
    this.loading = fetch('data/data.json')
      .then(r => r.json())
      .then(d => { this.data = d; return d; });
    return this.loading;
  }
};
