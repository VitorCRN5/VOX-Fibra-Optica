const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
const year = document.getElementById('year');
const form = document.querySelector('.contact-form');
const formMessage = document.querySelector('.form-message');

const fieldConfig = [
  {
    name: 'name',
    validate: (value) => value.trim().length >= 2,
    message: 'Informe seu nome completo.'
  },
  {
    name: 'phone',
    validate: (value) => /^\(?\d{2}\)?\s?9?\d{4}-?\d{4}$/.test(value.trim()),
    message: 'Informe um telefone válido.'
  },
  {
    name: 'email',
    validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    message: 'Informe um e-mail válido.'
  },
  {
    name: 'city',
    validate: (value) => value.trim().length >= 2,
    message: 'Informe sua cidade.'
  },
  {
    name: 'message',
    validate: (value) => value.trim().length >= 10,
    message: 'Escreva uma mensagem com pelo menos 10 caracteres.'
  }
];

const fields = fieldConfig.reduce((acc, field) => {
  const input = form?.querySelector(`[name="${field.name}"]`);
  const error = form?.querySelector(`[data-error-for="${field.name}"]`);
  acc[field.name] = { input, error, message: field.message, validate: field.validate };
  return acc;
}, {});

if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

if (year) {
  year.textContent = new Date().getFullYear();
}

function validateField(fieldName) {
  const field = fields[fieldName];
  if (!field?.input || !field.error) return true;

  const value = field.input.value.trim();
  const isValid = field.validate(value);

  field.input.classList.toggle('input-error', !isValid && value !== '');
  field.input.classList.toggle('input-success', isValid && value !== '');
  field.error.textContent = !isValid && value !== '' ? field.message : '';
  return isValid;
}

function validateForm() {
  return Object.keys(fields).every((fieldName) => validateField(fieldName));
}

if (form && formMessage) {
  Object.values(fields).forEach((field) => {
    if (field.input) {
      field.input.addEventListener('input', () => validateField(field.input.name));
      field.input.addEventListener('blur', () => validateField(field.input.name));
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      formMessage.textContent = 'Por favor, corrija os campos destacados.';
      formMessage.classList.remove('success');
      return;
    }

    formMessage.textContent = 'Mensagem enviada com sucesso! Nossa equipe entrará em contato em breve.';
    formMessage.classList.add('success');
    form.reset();

    Object.values(fields).forEach((field) => {
      if (field.input) {
        field.input.classList.remove('input-error', 'input-success');
      }
      if (field.error) {
        field.error.textContent = '';
      }
    });
  });
}
