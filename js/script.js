'use strict';

// Feature 1: switch between light and dark themes.
const themeToggle = document.querySelector('#theme-toggle');
themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark-theme');
  themeToggle.setAttribute('aria-pressed', String(isDark));
  themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
  themeToggle.textContent = isDark ? '☀️ Light mode' : '🌙 Dark mode';
});

// Feature 2: filter project cards by category.
const filterButtons = document.querySelectorAll('.filter-button');
const projectCards = document.querySelectorAll('.project-card');
const filterStatus = document.querySelector('#filter-status');
filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    projectCards.forEach((card) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show) visibleCount += 1;
    });
    filterStatus.textContent = `Showing ${visibleCount} project${visibleCount === 1 ? '' : 's'}.`;
  });
});

// Feature 3: open gallery images in an accessible dialog.
const photoDialog = document.querySelector('#photo-dialog');
const dialogImage = document.querySelector('#dialog-image');
document.querySelectorAll('.photo-button').forEach((button) => {
  button.addEventListener('click', () => {
    const image = button.querySelector('img');
    dialogImage.src = button.dataset.full;
    dialogImage.alt = image.alt;
    if (typeof photoDialog.showModal === 'function') photoDialog.showModal();
    else window.open(button.dataset.full, '_blank', 'noopener');
  });
});
function closePhotoDialog() { if (photoDialog.open) photoDialog.close(); }
document.querySelector('#close-dialog').addEventListener('click', closePhotoDialog);
photoDialog.addEventListener('click', (event) => { if (event.target === photoDialog) closePhotoDialog(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closePhotoDialog(); });

// Feature 4: validate the contact form in the browser. No message is transmitted.
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const validationFields = [
  { id: 'name', errorId: 'name-error', validate: (value) => value.trim().length >= 2, message: 'Please enter your name (at least 2 characters).' },
  { id: 'email', errorId: 'email-error', validate: (value, field) => field.validity.valid && value.trim() !== '', message: 'Please enter a valid email address.' },
  { id: 'message', errorId: 'message-error', validate: (value) => value.trim().length >= 10, message: 'Please enter a message of at least 10 characters.' }
];
function validateField(item) {
  const field = document.getElementById(item.id);
  const error = document.getElementById(item.errorId);
  const valid = item.validate(field.value, field);
  error.textContent = valid ? '' : item.message;
  field.setAttribute('aria-invalid', String(!valid));
  return valid;
}
validationFields.forEach((item) => {
  document.getElementById(item.id).addEventListener('input', () => validateField(item));
});
contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const allValid = validationFields.map(validateField).every(Boolean);
  if (!allValid) {
    formStatus.textContent = 'Please correct the highlighted fields and try again.';
    formStatus.className = 'status-message error-message';
    const firstInvalid = contactForm.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }
  formStatus.textContent = 'Validation successful! This is a demo form; no message was sent or stored.';
  formStatus.className = 'status-message success-message';
  contactForm.reset();
  validationFields.forEach((item) => document.getElementById(item.id).setAttribute('aria-invalid', 'false'));
});

document.querySelector('#year').textContent = new Date().getFullYear();
