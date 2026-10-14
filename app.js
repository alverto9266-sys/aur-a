const demoDialog = document.querySelector('#demo-dialog');
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('#mobile-menu');
const toast = document.querySelector('#toast');
const storageKey = 'aurea-isabella-demo-v1';
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2800);
}

document.querySelectorAll('[data-open-demo]').forEach(button => {
  button.addEventListener('click', () => {
    demoDialog.querySelector('.dialog-scroll').scrollTop = 0;
    demoDialog.showModal();
  });
});
document.querySelector('.close-dialog').addEventListener('click', () => demoDialog.close());
demoDialog.addEventListener('click', event => {
  if (event.target === demoDialog) demoDialog.close();
});

function setMenuOpen(open) {
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  mobileMenu.classList.toggle('is-open', open);
  mobileMenu.setAttribute('aria-hidden', String(!open));
  mobileMenu.inert = !open;
}
menuToggle.addEventListener('click', () => {
  setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
});
mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenuOpen(false)));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
    setMenuOpen(false);
    menuToggle.focus();
  }
});
window.matchMedia('(min-width: 801px)').addEventListener('change', event => {
  if (event.matches) setMenuOpen(false);
});

const planCards = [...document.querySelectorAll('.plan-card')];
const planDetail = document.querySelector('#plan-detail');

function selectPlan(card) {
  planCards.forEach(item => {
    const selected = item === card;
    item.classList.toggle('is-selected', selected);
    item.querySelector('.plan-select').setAttribute('aria-pressed', String(selected));
  });

  const label = document.createElement('p');
  label.className = 'plan-detail-label';
  label.textContent = 'QUÉ INCLUYE ESTE PLAN';
  const title = document.createElement('h3');
  title.textContent = card.querySelector('h3').textContent;
  const description = card.querySelector('.plan-description').cloneNode(true);
  const features = card.querySelector('ul').cloneNode(true);
  const link = card.querySelector('.plan-button').cloneNode(true);
  link.setAttribute('aria-label', `Consultar el plan ${title.textContent} por WhatsApp`);
  planDetail.replaceChildren(label, title, description, features, link);
}

planCards.forEach(card => {
  card.querySelector('.plan-select').addEventListener('click', () => selectPlan(card));
});
selectPlan(planCards[1]);
document.documentElement.classList.add('plans-ready');

function updateCountdown() {
  const eventDate = new Date('2026-12-13T00:00:00-03:00');
  const remaining = Math.max(0, eventDate.getTime() - Date.now());
  const totalMinutes = Math.floor(remaining / 60000);
  document.querySelector('#days').textContent = String(Math.floor(totalMinutes / 1440));
  document.querySelector('#hours').textContent = String(Math.floor((totalMinutes % 1440) / 60)).padStart(2, '0');
  document.querySelector('#minutes').textContent = String(totalMinutes % 60).padStart(2, '0');
}
updateCountdown();
window.setInterval(updateCountdown, 60000);

document.querySelector('[data-copy-alias]').addEventListener('click', async event => {
  const alias = event.currentTarget.dataset.copyAlias;
  try {
    await navigator.clipboard.writeText(alias);
    showToast('Alias de ejemplo copiado');
  } catch {
    showToast(`Alias de ejemplo: ${alias}`);
  }
});

function getResponses() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function saveResponses(responses) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(responses));
    return true;
  } catch {
    return false;
  }
}

function renderResponses() {
  const list = document.querySelector('#demo-list-items');
  list.replaceChildren();
  const responses = getResponses();
  if (!responses.length) {
    const item = document.createElement('li');
    item.textContent = 'Todavía no hay respuestas de prueba.';
    list.append(item);
    return;
  }
  responses.forEach(response => {
    const item = document.createElement('li');
    item.textContent = response.name;
    const detail = document.createElement('span');
    detail.textContent = response.attendance === 'Sí, voy'
      ? `${response.attendance} · ${response.count} ${response.count === '1' ? 'persona' : 'personas'}`
      : response.attendance;
    item.append(detail);
    list.append(item);
  });
}

const attendanceSelect = document.querySelector('#guest-attendance');
const countSelect = document.querySelector('#guest-count');
attendanceSelect.addEventListener('change', () => {
  countSelect.disabled = attendanceSelect.value !== 'Sí, voy';
});

document.querySelector('#rsvp-form').addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const name = form.elements.name.value.trim();
  if (!name) return;
  const responses = getResponses();
  responses.push({ name, attendance: form.elements.attendance.value, count: form.elements.attendance.value === 'Sí, voy' ? form.elements.count.value : '0' });
  const saved = saveResponses(responses);
  const feedback = document.querySelector('#rsvp-feedback');
  feedback.textContent = saved ? '¡Listo! Tu respuesta de prueba se guardó en este navegador.' : 'Esta respuesta de prueba no se pudo guardar en el navegador.';
  feedback.hidden = false;
  form.reset();
  countSelect.disabled = false;
  renderResponses();
});

const listToggle = document.querySelector('.demo-list-toggle');
const demoList = document.querySelector('#demo-list');
listToggle.addEventListener('click', () => {
  demoList.hidden = !demoList.hidden;
  listToggle.setAttribute('aria-expanded', String(!demoList.hidden));
  if (!demoList.hidden) renderResponses();
});
document.querySelector('#clear-demo').addEventListener('click', () => {
  try { localStorage.removeItem(storageKey); } catch { /* Private mode may block local storage. */ }
  renderResponses();
  showToast('Respuestas de prueba borradas');
});

document.querySelector('#year').textContent = String(new Date().getFullYear());

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const animatedElements = document.querySelectorAll(
    '.section-label, .intro-grid > *, .feature-card, .process-head > *, .steps article, .pricing-head > *, .plan-card, .faq > *, .contact-inner > *:not(.contact-decoration)'
  );
  animatedElements.forEach(element => element.classList.add('reveal'));
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
  animatedElements.forEach(element => revealObserver.observe(element));
}
