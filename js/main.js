// Navbar scroll effect
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navMenu.classList.toggle('open');
});

// Close mobile menu on link click + smooth scroll
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navToggle.classList.remove('active');
    navMenu.classList.remove('open');

    const targetId = link.getAttribute('href');
    const target = document.querySelector(targetId);
    if (target) {
      const offset = navbar.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// Active link on scroll
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY + 100;
  sections.forEach(section => {
    const top = section.offsetTop - navbar.offsetHeight;
    const bottom = top + section.offsetHeight;
    const id = section.getAttribute('id');
    const link = document.querySelector(`.nav-link[href="#${id}"]`);
    if (link) {
      link.classList.toggle('active', scrollY >= top && scrollY < bottom);
    }
  });
});

// Fade-in on scroll with Intersection Observer
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

fadeEls.forEach(el => fadeObserver.observe(el));

// Stat counter animation
const statNumbers = document.querySelectorAll('.stat-number');
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      let current = 0;
      const increment = Math.max(1, Math.floor(target / 60));
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = current;
      }, 20);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => statObserver.observe(el));

// Cookie consent
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (localStorage.getItem('cookieConsent')) {
  cookieBanner.classList.add('hidden');
}

cookieAccept.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'accepted');
  cookieBanner.classList.add('hidden');
});

cookieDecline.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'declined');
  cookieBanner.classList.add('hidden');
});

// Success modal
const successModal = document.getElementById('successModal');
document.getElementById('modalClose').addEventListener('click', () => {
  successModal.classList.remove('active');
});
successModal.addEventListener('click', (e) => {
  if (e.target === successModal) successModal.classList.remove('active');
});

// Contact form handler via Formspree
document.getElementById('contactForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      btn.textContent = 'Send Message';
      btn.disabled = false;
      form.reset();
      successModal.classList.add('active');
    } else {
      throw new Error('Failed');
    }
  } catch {
    btn.textContent = 'Failed — Try Again';
    btn.style.background = '#ef4444';
    btn.disabled = false;
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
    }, 3000);
  }
});
