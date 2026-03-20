import { api } from '../core/api.js';

export class AuthView {
  render() {
    const container = document.createElement('div');
    container.className = 'auth-container animate-fade';
    
    container.innerHTML = `
      <div class="auth-card glass">
        <h1 style="margin-bottom: 2rem; text-align: center;">Bienvenido</h1>
        <form id="auth-form" class="animate-slide">
          <div style="margin-bottom: 1.5rem;">
            <label class="stat-label">Email</label>
            <input type="email" id="email" required placeholder="tu@email.com">
          </div>
          <div style="margin-bottom: 2rem;">
            <label class="stat-label">Contraseña</label>
            <input type="password" id="password" required placeholder="••••••••">
          </div>
          <div id="register-fields" style="display: none;">
             <div style="margin-bottom: 1.5rem;">
               <label class="stat-label">Nombre Full</label>
               <input type="text" id="nombre" placeholder="Nombre completo">
             </div>
          </div>
          <button type="submit" class="btn btn-primary" style="width: 100%;">Ingresar</button>
          <p style="text-align: center; margin-top: 1.5rem; color: var(--text-muted);">
            <span id="toggle-text">¿No tienes cuenta?</span> 
            <a href="#" id="toggle-mode" style="color: var(--primary); text-decoration: none; font-weight: 600;">Regístrate</a>
          </p>
          <div id="error-msg" style="color: var(--error); margin-top: 1rem; text-align: center; font-size: 0.9rem;"></div>
          
          <div style="margin-top: 2rem; border-top: 1px solid var(--glass-border); padding-top: 1.5rem; display: flex; flex-direction: column; gap: 10px; align-items: center;">
            <a href="https://github.com/QWANTBITX" target="_blank" style="color: var(--text-muted); text-decoration: none; font-size: 0.8rem; border: 1px solid var(--glass-border); padding: 5px 15px; border-radius: 20px; transition: 0.3s; width: 100%; text-align: center;" onmouseover="this.style.borderColor='var(--primary)'" onmouseout="this.style.borderColor='var(--glass-border)'">GitHub QWANTBITX</a>
            <a href="mailto:harveysantiagoghguh@ufps.edu.co" style="color: var(--text-muted); text-decoration: none; font-size: 0.8rem;" onmouseover="this.style.color='var(--primary)'" onmouseout="this.style.color='var(--text-muted)'">harveysantiagoghguh@ufps.edu.co</a>
          </div>
        </form>
      </div>
    `;

    this.setupEvents(container);
    return container;
  }

  setupEvents(container) {
    const form = container.querySelector('#auth-form');
    const toggleBtn = container.querySelector('#toggle-mode');
    const toggleText = container.querySelector('#toggle-text');
    const regFields = container.querySelector('#register-fields');
    const submitBtn = form.querySelector('button');
    const errorMsg = container.querySelector('#error-msg');
    
    let isLogin = true;

    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      isLogin = !isLogin;
      regFields.style.display = isLogin ? 'none' : 'block';
      submitBtn.textContent = isLogin ? 'Ingresar' : 'Crear Cuenta';
      toggleText.textContent = isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?';
      toggleBtn.textContent = isLogin ? 'Regístrate' : 'Inicia Sesión';
      errorMsg.textContent = '';
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      errorMsg.textContent = '';
      submitBtn.disabled = true;
      submitBtn.textContent = 'Procesando...';

      const email = form.querySelector('#email').value;
      const password = form.querySelector('#password').value;
      const nombre = form.querySelector('#nombre').value;

      try {
        let res;
        if (isLogin) {
          res = await api.login({ email, password });
        } else {
          res = await api.register({ email, password, nombre });
        }

        api.setToken(res.token);
        localStorage.setItem('user_data', JSON.stringify(res));
        
        // Select first workspace if available
        if (res.workspaces && res.workspaces.length > 0) {
          localStorage.setItem('active_workspace', JSON.stringify(res.workspaces[0]));
        }

        window.location.hash = '#/';
      } catch (err) {
        errorMsg.textContent = err.message;
        submitBtn.disabled = false;
        submitBtn.textContent = isLogin ? 'Ingresar' : 'Crear Cuenta';
      }
    });
  }
}
