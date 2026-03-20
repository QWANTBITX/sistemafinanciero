import { api } from '../core/api.js';
import { withLayout } from '../components/layout.js';

export class AccountsView {
  async render() {
    const activeWorkspace = JSON.parse(localStorage.getItem('active_workspace') || '{}');
    if (!activeWorkspace.id) return withLayout('<h2>Selecciona un workspace primero.</h2>');

    const accounts = await api.fetch(`/api/cuentas?workspaceId=${activeWorkspace.id}`);

    const html = `
      <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <h1 class="animate-slide">Cuentas Bancarias</h1>
        <button id="add-acc-btn" class="btn btn-primary">Nueva Cuenta</button>
      </header>

      <div class="stats-grid animate-fade" style="margin-bottom: 2rem;">
        ${accounts.map(acc => `
          <div class="glass card stat-card">
            <span class="stat-label">${acc.tipo} - ${acc.moneda}</span>
            <span class="stat-value" style="color: var(--primary);">$${acc.saldoInicial.toLocaleString()}</span>
            <div style="font-weight: 600; margin-top: 10px;">${acc.nombre}</div>
          </div>
        `).join('')}
      </div>

      <div id="modal" class="glass" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 32px; z-index: 100; min-width: 350px;">
        <h2>Nueva Cuenta</h2>
        <form id="acc-form" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label class="stat-label">Nombre</label>
            <input type="text" id="acc-nombre" required placeholder="E.g. Ahorros Principal">
          </div>
          <div>
            <label class="stat-label">Tipo</label>
            <select id="acc-tipo">
              <option value="AHORROS">Ahorros</option>
              <option value="CORRIENTE">Corriente</option>
              <option value="EFECTIVO">Efectivo</option>
            </select>
          </div>
          <div>
            <label class="stat-label">Saldo Inicial</label>
            <input type="number" id="acc-saldo" required step="0.01" value="0">
          </div>
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="button" id="close-modal" class="btn btn-outline" style="flex: 1;">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">Crear</button>
          </div>
        </form>
      </div>
    `;

    const container = withLayout(html);
    this.setupEvents(container, activeWorkspace.id);
    return container;
  }

  setupEvents(container, workspaceId) {
    const modal = container.querySelector('#modal');
    const addBtn = container.querySelector('#add-acc-btn');
    const closeBtn = container.querySelector('#close-modal');
    const form = container.querySelector('#acc-form');

    addBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';

    form.onsubmit = async (e) => {
      e.preventDefault();
      const payload = {
        workspaceId,
        nombre: container.querySelector('#acc-nombre').value,
        tipo: container.querySelector('#acc-tipo').value,
        moneda: 'COP',
        saldoInicial: Number(container.querySelector('#acc-saldo').value)
      };

      try {
        await api.fetch('/api/cuentas', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    };
  }
}
