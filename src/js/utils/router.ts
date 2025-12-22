export class Router {
  routes: Map<string, () => void>;
  currentPath: string;
  notFoundCallback: (() => void) | null;

  constructor() {
    this.routes = new Map();
    this.currentPath = '';
    this.notFoundCallback = null;
  }

  register(path: string, callback: () => void) {
    this.routes.set(path, callback);
  }

  setNotFound(callback: () => void) {
    this.notFoundCallback = callback;
  }

  navigate(path: string) {
    window.history.pushState({ path }, '', path);
    this.render(path);
  }

  render(path: string) {
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
      const link = (e.target as Element)?.closest('a[data-link]');
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) this.navigate(href);
      }
    });

    this.render(window.location.pathname);
  }
}

export default Router;
