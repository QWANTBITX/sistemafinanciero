import { api } from '../core/api.js';
import { withLayout } from '../components/layout.js';

export class CategoriesView {
  async render() {
    const activeWorkspace = JSON.parse(localStorage.getItem('active_workspace') || '{}');
    if (!activeWorkspace.id) return withLayout('<h2>Selecciona un workspace primero.</h2>');

    const categories = await api.getCategories(activeWorkspace.id);

    const html = `
      <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <h1 class="animate-slide">Categorías</h1>
        <button id="add-cat-btn" class="btn btn-primary">Nueva Categoría</button>
      </header>

      <div class="glass card animate-fade">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--glass-border); color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">
              <th style="padding: 12px;">Nombre</th>
              <th style="padding: 12px;">Tipo</th>
              <th style="padding: 12px;">Estado</th>
            </tr>
          </thead>
          <tbody>
            ${categories.map(c => `
              <tr style="border-bottom: 1px solid var(--glass-border);">
                <td style="padding: 12px;">${c.nombre}</td>
                <td style="padding: 12px;">${c.tipo}</td>
                <td style="padding: 12px;"><span style="color: ${c.activa ? 'var(--success)' : 'var(--error)'}">${c.activa ? 'Activa' : 'Inactiva'}</span></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div id="modal" class="glass" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 32px; z-index: 100; min-width: 320px;">
        <h2>Nueva Categoría</h2>
        <form id="cat-form" style="margin-top: 1.5rem;">
          <div style="margin-bottom: 1rem;">
            <label class="stat-label">Nombre</label>
            <input type="text" id="cat-nombre" required>
          </div>
          <div style="margin-bottom: 2rem;">
            <label class="stat-label">Tipo</label>
            <select id="cat-tipo">
              <option value="INGRESO">Ingreso</option>
              <option value="GASTO">Gasto</option>
            </select>
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
    const addBtn = container.querySelector('#add-cat-btn');
    const closeBtn = container.querySelector('#close-modal');
    const form = container.querySelector('#cat-form');

    addBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';

    form.onsubmit = async (e) => {
      e.preventDefault();
      const nombre = container.querySelector('#cat-nombre').value;
      const tipo = container.querySelector('#cat-tipo').value;

      try {
        await api.createCategory({ workspaceId, nombre, tipo });
        window.location.reload();
      } catch (err) {
        alert(err.message);
      }
    };
  }
}
