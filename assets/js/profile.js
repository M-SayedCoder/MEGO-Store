const ProfilePage = {
  init() {
    document.querySelectorAll('.profile-nav-link').forEach(link => {
      link.addEventListener('click', () => this.switchTab(link.dataset.tab));
    });
    this.switchTab('overview');
  },
  switchTab(tab) {
    document.querySelectorAll('.profile-tab').forEach(t => t.style.display = 'none');
    document.querySelectorAll('.profile-nav-link').forEach(l => l.classList.remove('active'));
    const el = document.getElementById('tab-' + tab);
    if (el) el.style.display = 'block';
    const btn = document.querySelector('[data-tab="' + tab + '"]');
    if (btn) btn.classList.add('active');
  },
  saveProfile(e) { e.preventDefault(); Toast.show('Profile updated successfully!', 'success'); },
  changePassword(e) {
    e.preventDefault();
    const np = document.getElementById('newPass').value;
    const cp = document.getElementById('confirmNewPass').value;
    if (np !== cp) { Toast.show('Passwords do not match', 'error'); return; }
    if (np.length < 8) { Toast.show('Password must be at least 8 characters', 'error'); return; }
    Toast.show('Password changed successfully!', 'success');
    e.target.reset();
  }
};
document.addEventListener('DOMContentLoaded', () => ProfilePage.init());
