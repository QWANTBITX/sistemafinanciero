import { Router } from './core/router.js';

const routes = {
  '#/': { 
    protected: true, 
    component: async () => {
      const { DashboardView } = await import('./views/dashboard.js');
      return new DashboardView().render();
    }
  },
  '#/login': { 
    protected: false, 
    component: async () => {
      const { AuthView } = await import('./views/auth.js');
      return new AuthView().render();
    }
  },
  '#/accounts': { 
    protected: true, 
    component: async () => {
      const { AccountsView } = await import('./views/accounts.js');
      return new AccountsView().render();
    }
  },
  '#/categories': { 
    protected: true, 
    component: async () => {
      const { CategoriesView } = await import('./views/categories.js');
      return new CategoriesView().render();
    }
  },
  '#/transactions': { 
    protected: true, 
    component: async () => {
      const { TransactionsView } = await import('./views/transactions.js');
      return new TransactionsView().render();
    }
  },
  '#/beneficiaries': { 
    protected: true, 
    component: async () => {
      const { BeneficiariesView } = await import('./views/beneficiaries.js');
      return new BeneficiariesView().render();
    }
  }
};

const router = new Router(routes, 'app');
router.init();
