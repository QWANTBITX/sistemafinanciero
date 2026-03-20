import { api } from '../core/api.js';
import { withLayout } from '../components/layout.js';

export class TransactionsView {
  async render() {
    const activeWorkspace = JSON.parse(localStorage.getItem('active_workspace') || '{}');
    if (!activeWorkspace.id) return withLayout('<h2>Selecciona un workspace primero.</h2>');

    const [transactions, categories, beneficiaries, accounts] = await Promise.all([
      api.getTransactions(activeWorkspace.id),
      api.getCategories(activeWorkspace.id),
      api.getBeneficiaries(activeWorkspace.id),
      api.fetch(`/api/cuentas?workspaceId=${activeWorkspace.id}`)
    ]);

    const html = `
      <header style="margin-bottom: 2rem; display: flex; justify-content: space-between; align-items: center;">
        <h1 class="animate-slide">Transacciones</h1>
        <button id="add-tx-btn" class="btn btn-primary">Registrar Movimiento</button>
      </header>

      <div class="glass card animate-fade">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="border-bottom: 1px solid var(--glass-border); color: var(--text-muted); font-size: 0.8rem; text-transform: uppercase;">
              <th style="padding: 12px;">Fecha</th>
              <th style="padding: 12px;">Concepto</th>
              <th style="padding: 12px;">Categoría</th>
              <th style="padding: 12px;">Cuenta</th>
              <th style="padding: 12px; text-align: right;">Monto</th>
            </tr>
          </thead>
          <tbody>
            ${transactions.map(t => `
              <tr style="border-bottom: 1px solid var(--glass-border);">
                <td style="padding: 12px;">${new Date(t.fecha).toLocaleDateString()}</td>
                <td style="padding: 12px;">${t.descripcion}</td>
                <td style="padding: 12px;">${t.categoriaNombre}</td>
                <td style="padding: 12px;">${t.fuenteNombre || '-'}</td>
                <td style="padding: 12px; text-align: right; color: ${t.tipo === 'INGRESO' ? 'var(--success)' : 'var(--error)'}; font-weight: 600;">
                  ${t.tipo === 'INGRESO' ? '+' : '-'}$${t.monto.toLocaleString()}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div id="modal" class="glass" style="display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); padding: 32px; z-index: 100; min-width: 400px; max-height: 90vh; overflow-y: auto;">
        <h2>Nuevo Movimiento</h2>
        <form id="tx-form" style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 1rem;">
          <div>
            <label class="stat-label">Tipo</label>
            <select id="tx-tipo">
              <option value="INGRESO">Ingreso</option>
              <option value="GASTO">Gasto</option>
            </select>
          </div>
          <div>
            <label class="stat-label">Cuenta / Origen</label>
            <select id="tx-cuenta" required>
              ${accounts.map(a => `<option value="${a.id}">${a.nombre} ($${a.saldoInicial})</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="stat-label">Monto</label>
            <input type="number" id="tx-monto" required step="0.01">
          </div>
          <div>
            <label class="stat-label">Fecha</label>
            <input type="date" id="tx-fecha" required>
          </div>
          <div>
            <label class="stat-label">Categoría</label>
            <select id="tx-categoria" required>
              ${categories.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="stat-label">Beneficiario</label>
            <select id="tx-beneficiario">
              <option value="">Ninguno</option>
              ${beneficiaries.map(b => `<option value="${b.id}">${b.nombre}</option>`).join('')}
            </select>
          </div>
          <div>
            <label class="stat-label">Descripción</label>
            <input type="text" id="tx-desc" placeholder="Comentario opcional">
          </div>
          <div style="display: flex; gap: 1rem; margin-top: 1rem;">
            <button type="button" id="close-modal" class="btn btn-outline" style="flex: 1;">Cancelar</button>
            <button type="submit" class="btn btn-primary" style="flex: 1;">Registrar</button>
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
    const addBtn = container.querySelector('#add-tx-btn');
    const closeBtn = container.querySelector('#close-modal');
    const form = container.querySelector('#tx-form');

    addBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';

    form.onsubmit = async (e) => {
      e.preventDefault();
      const tipo = form.querySelector('#tx-tipo').value;
      const cuentaId = Number(form.querySelector('#tx-cuenta').value);
      const monto = Number(form.querySelector('#tx-monto').value);
      const fecha = form.querySelector('#tx-fecha').value;
      const categoriaId = Number(form.querySelector('#tx-categoria').value);
      const beneficiarioId = form.querySelector('#tx-beneficiario').value ? Number(form.querySelector('#tx-beneficiario').value) : null;
      const descripcion = form.querySelector('#tx-desc').value;

      const payload = {
        workspaceId,
        tipo,
        cuentaId,
        cuenta_id: cuentaId, 
        monto,
        fecha,
        categoriaId,
        descripcion,
        medioPago: 'TRANSFERENCIA' 
      };

      if (beneficiarioId) {
        payload.beneficiarioId = beneficiarioId;
        payload.beneficiario_id = beneficiarioId;
      }

      console.log('Sending final debug payload:', payload);

      try {
        await api.createTransaction(payload);
        window.location.reload();
      } catch (err) {
        console.error('Final attempt failed:', err);
        alert(`Error: ${err.message}. Intentando con otro medio de pago...`);
      }
    };
  }
}
