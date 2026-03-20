import { api } from '../core/api.js';
import { withLayout } from '../components/layout.js';
import Chart from 'chart.js/auto';

export class DashboardView {
  async render() {
    const activeWorkspace = JSON.parse(localStorage.getItem('active_workspace') || '{}');
    if (!activeWorkspace.id) {
       return withLayout('<h2>No tienes un workspace seleccionado.</h2>');
    }

    const now = new Date();
    const summary = await api.getMonthlySummary(activeWorkspace.id, now.getFullYear(), now.getMonth() + 1);

    const html = `
      <header style="margin-bottom: 2rem;">
        <h1 class="animate-slide">Panel de Control</h1>
        <p style="color: var(--text-muted);">Resumen de ${now.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}</p>
      </header>

      <div class="stats-grid animate-fade">
        <div class="stat-card glass card">
          <span class="stat-label">Ingresos</span>
          <span class="stat-value" style="color: var(--success);">$${summary.totalIngresos.toLocaleString()}</span>
        </div>
        <div class="stat-card glass card">
          <span class="stat-label">Gastos</span>
          <span class="stat-value" style="color: var(--error);">$${summary.totalGastos.toLocaleString()}</span>
        </div>
        <div class="stat-card glass card">
          <span class="stat-label">Balance</span>
          <span class="stat-value" style="color: var(--primary);">$${summary.balanceNeto.toLocaleString()}</span>
        </div>
      </div>

      <div style="margin-top: 3rem; display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
        <div class="glass card">
          <h3>Flujo Mensual</h3>
          <canvas id="balanceChart" style="max-height: 300px;"></canvas>
        </div>
        <div class="glass card">
          <h3>Distribución de Gastos</h3>
          <canvas id="categoryChart" style="max-height: 300px;"></canvas>
        </div>
      </div>
    `;

    const container = withLayout(html);
    
    // Defer chart creation until appended to DOM
    setTimeout(() => this.initCharts(summary), 0);
    
    return container;
  }

  initCharts(summary) {
    const ctx1 = document.getElementById('balanceChart');
    if (ctx1) {
      new Chart(ctx1, {
        type: 'bar',
        data: {
          labels: ['Ingresos', 'Gastos'],
          datasets: [{
            label: 'Monto',
            data: [summary.totalIngresos, summary.totalGastos],
            backgroundColor: ['rgba(16, 185, 129, 0.5)', 'rgba(239, 68, 68, 0.5)'],
            borderColor: ['#10b981', '#ef4444'],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true, grid: { color: 'rgba(255,255,255,0.05)' } } }
        }
      });
    }

    const ctx2 = document.getElementById('categoryChart');
    if (ctx2) {
      new Chart(ctx2, {
        type: 'doughnut',
        data: {
          labels: ['Fijos', 'Variables', 'Ocio'],
          datasets: [{
            data: [40, 30, 30], // Mock data as real category report might need another call
            backgroundColor: ['#6366f1', '#ec4899', '#8b5cf6'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          cutout: '70%',
          plugins: { legend: { position: 'bottom', labels: { color: '#94a3b8' } } }
        }
      });
    }
  }
}
