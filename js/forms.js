import { showToast } from './ui.js';
import { sounds } from './sound.js';

export function initContactForm() {
  const form    = document.getElementById('contactForm');
  const btn     = document.getElementById('contactSubmitBtn');
  const success = document.getElementById('formSuccess');

  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();

    if (!validateForm(form)) return;

    btn.disabled    = true;
    btn.textContent = 'Sending…';

    try {
      const response = await fetch('/', {
        method:  'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:    new URLSearchParams(new FormData(form)).toString(),
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);

      sounds.addCart();
      form.style.display    = 'none';
      success.style.display = 'block';
      showToast('Message sent — Tinashe will reply within 48 hours');

    } catch (err) {
      console.error('Contact form error:', err);
      btn.disabled    = false;
      btn.textContent = 'Send Message';
      showToast('Something went wrong — please email or WhatsApp Tinashe directly');
    }
  });
}

function validateForm(form) {
  let valid = true;
  clearErrors(form);

  const name    = form.querySelector('#contact-name');
  const email   = form.querySelector('#contact-email');
  const message = form.querySelector('#contact-message');

  if (!name.value.trim()) {
    showError('error-name', 'Please enter your name');
    valid = false;
  }

  if (!email.value.trim() || !isValidEmail(email.value)) {
    showError('error-email', 'Please enter a valid email address');
    valid = false;
  }

  if (!message.value.trim() || message.value.trim().length < 10) {
    showError('error-message', 'Please enter a message (at least 10 characters)');
    valid = false;
  }

  if (!valid) {
    const firstError = form.querySelector('.field-error:not(:empty)');
    if (firstError) firstError.previousElementSibling?.focus();
  }

  return valid;
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = msg;
    el.previousElementSibling?.setAttribute('aria-invalid', 'true');
  }
}

function clearErrors(form) {
  form.querySelectorAll('.field-error').forEach(el => { el.textContent = ''; });
  form.querySelectorAll('[aria-invalid]').forEach(el => el.removeAttribute('aria-invalid'));
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}