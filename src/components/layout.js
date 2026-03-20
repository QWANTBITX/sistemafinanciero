export function withLayout(content) {
  const container = document.createElement('div');
  container.style.display = 'flex';
  container.className = 'animate-fade';

  const user = JSON.parse(localStorage.getItem('user_data') || '{}');
  const activeWorkspace = JSON.parse(localStorage.getItem('active_workspace') || '{}');

  const sidebar = `
    <aside class="sidebar glass">
      <div class="logo" style="font-size: 1.5rem; font-weight: 800; background: linear-gradient(135deg, var(--primary), var(--secondary)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
        FINANZAS
      </div>
      
      <nav style="flex: 1; display: flex; flex-direction: column; gap: 8px;">
        <a href="#/" class="nav-link ${window.location.hash === '#/' ? 'active' : ''}">
          <span>Home</span>
        </a>
        <a href="#/accounts" class="nav-link ${window.location.hash === '#/accounts' ? 'active' : ''}">
          <span>Cuentas</span>
        </a>
        <a href="#/transactions" class="nav-link ${window.location.hash === '#/transactions' ? 'active' : ''}">
          <span>Transacciones</span>
        </a>
        <a href="#/categories" class="nav-link ${window.location.hash === '#/categories' ? 'active' : ''}">
          <span>Categorías</span>
        </a>
        <a href="#/beneficiaries" class="nav-link ${window.location.hash === '#/beneficiaries' ? 'active' : ''}">
          <span>Beneficiarios</span>
        </a>
      </nav>

      <div class="user-info" style="padding-top: 20px; border-top: 1px solid var(--glass-border); display: flex; flex-direction: column; gap: 12px;">
        <div>
          <div style="font-size: 0.9rem; font-weight: 600;">${user.nombre || 'Usuario'}</div>
          <div style="font-size: 0.8rem; color: var(--text-muted);">${activeWorkspace.nombre || 'Sin Workspace'}</div>
        </div>
        
        <button id="logout-btn" class="btn btn-outline" style="width: 100%; padding: 8px; font-size: 0.8rem;">Salir</button>
        
        <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px; border-top: 1px solid var(--glass-border); padding-top: 15px;">
           <a href="https://github.com/QWANTBITX" target="_blank" class="nav-link" style="padding: 8px; font-size: 0.8rem;">
             <span>GitHub QWANTBITX</span>
           </a>
           <a href="mailto:harveysantiagoghguh@ufps.edu.co" class="nav-link" style="padding: 8px; font-size: 0.8rem;">
             <span>Contacto Email</span>
           </a>
        </div>
      </div>
    </aside>
  `;

  container.innerHTML = `
    ${sidebar}
    <main class="main-content">
      ${content}
    </main>
  `;

  container.querySelector('#logout-btn').addEventListener('click', () => {
    localStorage.clear();
    window.location.hash = '#/login';
  });

  return container;
}
