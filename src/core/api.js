const BASE_URL = 'https://finanzas-api.ubunifusoft.digital';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
  }

  async fetch(endpoint, options = {}) {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, { ...options, headers });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          this.clearToken();
          window.location.hash = '#/login';
        }
        throw new Error(data.mensaje || 'Error en la petición');
      }

      return data.data;
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Auth
  login(credentials) {
    return this.fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  register(userData) {
    return this.fetch('/api/auth/registro', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // Workspaces
  getMyWorkspaces(userId) {
    return this.fetch(`/api/workspaces?usuarioId=${userId}`);
  }

  selectWorkspace(workspaceId) {
    return this.fetch(`/api/workspaces/${workspaceId}/seleccionar`, { method: 'POST' });
  }

  // Categories
  getCategories(workspaceId) {
    return this.fetch(`/api/categorias?workspaceId=${workspaceId}`);
  }

  createCategory(categoryData) {
    return this.fetch('/api/categorias', {
      method: 'POST',
      body: JSON.stringify(categoryData)
    });
  }

  // Transactions
  getTransactions(workspaceId) {
    return this.fetch(`/api/transactions?workspaceId=${workspaceId}`);
  }

  createTransaction(transactionData) {
    return this.fetch('/api/transactions', {
      method: 'POST',
      body: JSON.stringify(transactionData)
    });
  }

  // Beneficiaries
  getBeneficiaries(workspaceId) {
    return this.fetch(`/api/beneficiarios?workspaceId=${workspaceId}`);
  }

  createBeneficiary(beneficiaryData) {
    return this.fetch('/api/beneficiarios', {
      method: 'POST',
      body: JSON.stringify(beneficiaryData)
    });
  }

  // Dashboard
  getMonthlySummary(workspaceId, anio, mes) {
    return this.fetch(`/api/dashboard/resumen-mensual?workspaceId=${workspaceId}&anio=${anio}&mes=${mes}`);
  }
}

export const api = new ApiService();
