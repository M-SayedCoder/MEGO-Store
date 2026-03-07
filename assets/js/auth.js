const AuthPage = {
  init() {
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
    document.getElementById('loginForm')?.addEventListener('submit', e => this.login(e));
    document.getElementById('registerForm')?.addEventListener('submit', e => this.register(e));
    document.querySelectorAll('.password-toggle').forEach(btn => {
      btn.addEventListener('click', () => {
        const inp = btn.previousElementSibling || btn.closest('.input-icon-wrap').querySelector('input');
        inp.type = inp.type === 'password' ? 'text' : 'password';
        btn.querySelector('i').classList.toggle('fa-eye');
        btn.querySelector('i').classList.toggle('fa-eye-slash');
      });
    });
  },
  switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.toggle('active', t.dataset.tab === tab));
    document.getElementById('loginSection').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerSection').style.display = tab === 'register' ? 'block' : 'none';
  },
  login(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const pass = document.getElementById('loginPass').value;
    if (!email || !pass) { Toast.show('Please fill all fields', 'error'); return; }
    Toast.show('Login successful! Welcome back 👋', 'success');
    setTimeout(() => window.location = 'profile.html', 1200);
  },
  register(e) {
    e.preventDefault();
    const pass = document.getElementById('regPass').value;
    const confirm = document.getElementById('regConfirm').value;
    if (pass !== confirm) { Toast.show('Passwords do not match', 'error'); return; }
    Toast.show('Account created! Welcome to MEGO 🎉', 'success');
    setTimeout(() => window.location = 'profile.html', 1200);
  }
};
document.addEventListener('DOMContentLoaded', () => AuthPage.init());
