/* ============================================
   Relatista Landing Page — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Mobile Navigation ---
  const hamburger = document.querySelector('.hamburger');
  const navMobile = document.querySelector('.nav-mobile');

  if (hamburger && navMobile) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMobile.classList.toggle('active');
      document.body.style.overflow = navMobile.classList.contains('active') ? 'hidden' : '';
    });

    navMobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMobile.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // --- FAQ Accordion ---
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasActive = item.classList.contains('active');

      // Close all
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });

  // --- Scroll Fade-in Animation ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // --- Contact Form Messages (from URL params) ---
  const formMsg = document.getElementById('form-message');
  if (formMsg) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('sent') === '1') {
      formMsg.textContent = 'お問い合わせを受け付けました。3営業日以内にご返信いたします。';
      formMsg.className = 'form-message success';
      formMsg.style.display = '';
    } else if (params.has('error')) {
      const err = params.get('error');
      const msgs = {
        email: 'メールアドレスを正しく入力してください。',
        content: 'お問い合わせ内容を入力してください。',
        spam: '送信に失敗しました。もう一度お試しください。',
        send: 'メールの送信に失敗しました。お手数ですが support@relatista.com まで直接ご連絡ください。'
      };
      formMsg.textContent = msgs[err] || 'エラーが発生しました。もう一度お試しください。';
      formMsg.className = 'form-message error';
      formMsg.style.display = '';
    }
  }

  // --- Contact Form Validation ---
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      const email = contactForm.querySelector('[name="email"]');
      const content = contactForm.querySelector('[name="content"]');
      let valid = true;

      if (!email.value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        email.style.borderColor = '#c45c5c';
        valid = false;
      } else {
        email.style.borderColor = '';
      }

      if (!content.value.trim()) {
        content.style.borderColor = '#c45c5c';
        valid = false;
      } else {
        content.style.borderColor = '';
      }

      if (!valid) {
        e.preventDefault();
      }
    });
  }

  // --- Smooth scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});
