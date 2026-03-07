const ContactPage = {
  init() {
    document.querySelectorAll('.faq-question').forEach(q => {
      q.addEventListener('click', () => {
        const answer = q.nextElementSibling;
        const isOpen = answer.classList.contains('open');
        document.querySelectorAll('.faq-answer').forEach(a => { a.classList.remove('open'); a.previousElementSibling.classList.remove('open'); });
        if (!isOpen) { answer.classList.add('open'); q.classList.add('open'); }
      });
    });
    document.getElementById('contactForm')?.addEventListener('submit', e => this.submitForm(e));
  },
  submitForm(e) {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;
    setTimeout(() => {
      Toast.show('Message sent successfully! We\'ll reply within 24 hours 📧', 'success');
      e.target.reset();
      btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
      btn.disabled = false;
    }, 1500);
  }
};
document.addEventListener('DOMContentLoaded', () => ContactPage.init());
