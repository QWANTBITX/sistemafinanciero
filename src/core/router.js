export class Router {
  constructor(routes, containerId) {
    this.routes = routes;
    this.container = document.getElementById(containerId);
    window.addEventListener('hashchange', () => this.handleRoute());
  }

  init() {
    this.handleRoute();
  }

  async handleRoute() {
    const hash = window.location.hash || '#/';
    const route = this.routes[hash] || this.routes['#/'];
    
    // Auth check
    const isAuth = !!localStorage.getItem('auth_token');
    if (route.protected && !isAuth) {
      window.location.hash = '#/login';
      return;
    }

    if (this.container) {
      this.container.innerHTML = '<div class="loader">Cargando...</div>';
      try {
        const view = await route.component();
        this.container.innerHTML = '';
        this.container.appendChild(view);
      } catch (error) {
        this.container.innerHTML = `<div class="error">Error al cargar la vista: ${error.message}</div>`;
      }
    }
  }
}
