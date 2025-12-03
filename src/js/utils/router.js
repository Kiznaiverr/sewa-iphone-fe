export class Router {
  constructor() {
    this.routes = new Map();
    this.currentPath = '';
    this.notFoundCallback = null;
  }

  register(path, callback) {
    this.routes.set(path, callback);
  }

  setNotFound(callback) {
    this.notFoundCallback = callback;
  }

  navigate(path) {
    window.history.pushState({ path }, '', path);
    this.render(path);
  }

  render(path) {
    this.currentPath = path;
    const callback = this.routes.get(path);

    const app = document.getElementById('app');
    if (!app) return;

    if (callback) {
      callback();
    } else if (this.notFoundCallback) {
      this.notFoundCallback();
    } else {
      app.innerHTML = '<div class="text-center p-8">Page not found</div>';
    }
  }

  init() {
    window.addEventListener('popstate', (e) => {
      this.render(e.state?.path || '/');
    });

    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-link]');
      if (link) {
        e.preventDefault();
        this.navigate(link.getAttribute('href'));
      }
    });

    this.render(window.location.pathname);
  }
}

export default Router;
