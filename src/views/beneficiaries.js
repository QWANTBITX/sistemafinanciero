import { api } from '../core/api.js';
import { withLayout } from '../components/layout.js';

export class BeneficiariesView {
  async render() {
    const activeWorkspace = JSON.parse(localStorage.getItem('active_workspace') || '{}');
    if (!activeWorkspace.id) return withLayout('<h2>Selecciona un workspace primero.</h2>');

    const beneficiaries = await api.getBeneficiaries(activeWorkspace.id);

    const html = `
      <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <h1 class="animate-slide">Beneficiarios</h1>
        <button id="add-ben-btn" class="btn btn-primary">Nuevo Beneficiario</button>
      </header>

      <div class="glass card animate-fade">
        <ul style="list-style: none;">
          ${beneficiaries.map(b => `
            <li style="padding: 16px; border-bottom: 1px solid var(--glass-border); display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="display: block;">${b.nombre}</strong>
                <span style="font-size: 0.8rem; color: var(--text-muted);">Activo desde: ${new Date().toLocaleDateString()}</span>
              </div>
              <span style="padding: 4px 12px; border-radius: 20px; font-size: 0.7rem; background: rgba(16, 185, 129, 0.1); color: var(--success);">Confirmado</span>
            </li>
          `).join('')}
        </ul>
      </div>

      <div id="modal" class="glass" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 32px; z-index: 100; min-width: 320px;">
        <h2>Registrar Beneficiario</h2>
        <form id="ben-form" style="margin-top: 1.5rem;">
          <div style="margin-bottom: 2rem;">
            <label class="stat-label">Nombre Completo</label>
            <input type="text" id="ben-nombre" required placeholder="E.g. Empresa Eléctrica">
          </div>
          <div style="display: flex; gap: 1rem;">
            <button type="button" id="close-modal" class="btn btn-outline" style="flex: 1;">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">Guardar</button>
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
    const addBtn = container.querySelector('#add-ben-btn');
    const closeBtn = container.querySelector('#close-modal');
    const form = container.querySelector('#ben-form');

    addBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';

    form.onsubmit = async (e) => {
      e.preventDefault();
      const nombre = container.querySelector('#ben-nombre').value;

      try {
        await api.createBeneficiary({ workspaceId, nombre });
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    };
  }
}
