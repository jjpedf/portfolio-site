/* ── THEME ── */
function toggleTheme() {
  const html = document.documentElement;
  const isNowLight = html.getAttribute('data-theme') === 'dark';
  html.setAttribute('data-theme', isNowLight ? 'light' : 'dark');
  document.getElementById('theme-btn').textContent = isNowLight ? '☾' : '☀';
}

/* ── LANGUAGE ── */
function setLang(lang) {
  document.documentElement.setAttribute('data-lang', lang);
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-pt').classList.toggle('active', lang === 'pt');
  document.getElementById('ph-opt').textContent = lang === 'pt' ? 'Selecione o assunto' : 'Select a subject';
}
setLang('en');

/* ── SCROLL REVEAL ── */
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ── NAV HIGHLIGHT ── */
const allSections = document.querySelectorAll('section[id], div[id]');
const navAs = document.querySelectorAll('.nav-center a');
window.addEventListener('scroll', () => {
  let cur = '';
  allSections.forEach(s => { if (window.scrollY >= s.offsetTop - 200) cur = s.id; });
  navAs.forEach(a => { a.style.color = a.getAttribute('href') === `#${cur}` ? 'var(--accent)' : ''; });
});

/* ── FORM ── */
function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  setTimeout(() => {
    document.getElementById('contact-form').style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
  }, 700);
}
