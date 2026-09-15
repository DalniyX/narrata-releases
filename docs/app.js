// Логика страницы: язык (авто по системе + переключатель), живые данные с GitHub (версия,
// прямая ссылка на установщик, число скачиваний и звёзд), анимации при прокрутке и галерея
// с лайтбоксом. Без сборки и зависимостей — открывается как обычная статическая страница.
'use strict';

const REPO = 'DalniyX/narrata-releases';
const LANG_KEY = 'narrata_lang';
const CACHE_KEY = 'narrata_release_cache_v1';
const CACHE_TTL = 10 * 60 * 1000; // 10 минут — как кеш аналитики в Narrata Studio

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ---------- язык ----------

function detectLang() {
  try {
    const saved = localStorage.getItem(LANG_KEY);
    if (saved === 'ru' || saved === 'en') return saved;
  } catch {
    // localStorage может быть недоступен (приватное окно) — просто определяем заново каждый раз
  }
  const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
  return langs.some((l) => l.toLowerCase().startsWith('ru')) ? 'ru' : 'en';
}

function saveLang(lang) {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    // необязательно: без сохранения язык определится заново при следующем визите
  }
}

let currentLang = 'ru';

function applyLang(lang) {
  currentLang = lang;
  const dict = I18N[lang] || I18N.en;
  document.documentElement.lang = lang;
  document.title = lang === 'ru' ? 'Narrata — рабочая среда нарративного дизайнера' : 'Narrata — a workspace for narrative designers';
  const desc = $('meta[name="description"]');
  if (desc) desc.setAttribute('content', dict['hero.subtitle']);

  $$('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  $$('[data-i18n-aria]').forEach((el) => {
    const key = el.getAttribute('data-i18n-aria');
    if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
  });

  const switchEl = $('#langSwitch');
  if (switchEl) {
    switchEl.dataset.lang = lang;
    $$('[data-lang-btn]', switchEl).forEach((btn) => btn.setAttribute('aria-pressed', String(btn.dataset.langBtn === lang)));
  }

  renderFeatures(lang);
  renderGallery(lang);
  applyRelease(); // переводит уже загруженные данные о версии на новый язык
}

// ---------- карточки «Возможности» ----------

function renderFeatures(lang) {
  const dict = I18N[lang] || I18N.en;
  const host = $('#bento');
  if (!host) return;
  host.innerHTML = FEATURES.map((f, i) => {
    const item = dict.features.items[f.key];
    const delay = 'd' + (1 + (i % 4));
    return `<div class="f-card${f.big ? ' big' : ''} reveal ${delay}">
      <div class="f-icon"><svg class="icon" aria-hidden="true"><use href="#${f.icon}"/></svg></div>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </div>`;
  }).join('');
  observeReveals(host);
}

// ---------- галерея и лайтбокс ----------

// Витрина — один большой кадр (во всю ширину контейнера, как у окна программы в hero) с плёнкой
// миниатюр под ним. Раньше здесь была лента узких карточек — на широком экране она выглядела мелко
// и «вертикально» среди пустого места; общий кадр использует всю ширину секции.
let showcaseIndex = 0;
let lightboxTrigger = null;
let touchStartX = 0;
let touchStartY = 0;

function renderGallery(lang) {
  const dict = I18N[lang] || I18N.en;
  const frame = $('#scImgWrap');
  const rail = $('#thumbRail');
  if (!frame || !rail) return;

  frame.innerHTML = SCREENSHOTS.map((s, i) => {
    const caption = dict.screenshots[s.key];
    return `<img src="${s.file}" data-index="${i}" width="1600" height="1000" alt="${caption}" loading="${i === 0 ? 'eager' : 'lazy'}" class="${i === showcaseIndex ? 'active' : ''}">`;
  }).join('');

  rail.innerHTML = SCREENSHOTS.map((s, i) => {
    const caption = dict.screenshots[s.key];
    return `<button type="button" class="thumb${i === showcaseIndex ? ' active' : ''}" data-index="${i}" aria-label="${caption}">
      <img src="${s.file}" width="1600" height="1000" alt="" loading="lazy">
    </button>`;
  }).join('');

  $$('.thumb', rail).forEach((btn) => btn.addEventListener('click', () => setShowcase(Number(btn.dataset.index))));

  updateShowcaseText();
}

/** Подпись и счётчик под текущим языком — вызывается и при переключении языка, без пересборки картинок. */
function updateShowcaseText() {
  const dict = I18N[currentLang] || I18N.en;
  const s = SCREENSHOTS[showcaseIndex];
  if (!s) return;
  const caption = dict.screenshots[s.key];
  $('#scCap').textContent = caption;
  $('#scCounter').textContent = `${showcaseIndex + 1} / ${SCREENSHOTS.length}`;
  $('#scImgWrap').setAttribute('aria-label', `${dict['gallery.zoom']}: ${caption}`);
}

function setShowcase(index) {
  showcaseIndex = (index + SCREENSHOTS.length) % SCREENSHOTS.length;
  $$('#scImgWrap img').forEach((img) => img.classList.toggle('active', Number(img.dataset.index) === showcaseIndex));
  $$('.thumb', $('#thumbRail')).forEach((btn) => btn.classList.toggle('active', Number(btn.dataset.index) === showcaseIndex));
  const activeThumb = $(`.thumb[data-index="${showcaseIndex}"]`);
  if (activeThumb) activeThumb.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'nearest', inline: 'center' });
  updateShowcaseText();
}

function openLightbox(index, trigger) {
  setShowcase(index);
  lightboxTrigger = trigger || document.activeElement;
  renderLightbox();
  const lb = $('#lightbox');
  lb.classList.add('open');
  lb.setAttribute('aria-hidden', 'false');
  $('#lbClose').focus();
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  const lb = $('#lightbox');
  lb.classList.remove('open');
  lb.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  if (lightboxTrigger) lightboxTrigger.focus();
}

function renderLightbox() {
  const dict = I18N[currentLang] || I18N.en;
  const s = SCREENSHOTS[showcaseIndex];
  const caption = dict.screenshots[s.key];
  $('#lbImg').src = s.file;
  $('#lbImg').alt = caption;
  $('#lbCap').textContent = `${caption} — ${showcaseIndex + 1}/${SCREENSHOTS.length}`;
}

function stepLightbox(delta) {
  setShowcase(showcaseIndex + delta);
  renderLightbox();
}

function wireLightbox() {
  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', () => stepLightbox(-1));
  $('#lbNext').addEventListener('click', () => stepLightbox(1));
  $('#lightbox').addEventListener('click', (e) => {
    if (e.target.id === 'lightbox') closeLightbox();
  });
  document.addEventListener('keydown', (e) => {
    if (!$('#lightbox').classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowLeft') stepLightbox(-1);
    else if (e.key === 'ArrowRight') stepLightbox(1);
  });
}

/** Стрелки по бокам кадра, клик/Enter на кадре открывает лайтбокс, свайп листает на телефоне. */
function wireShowcase() {
  const frame = $('#scImgWrap');
  $('#scPrev').addEventListener('click', () => setShowcase(showcaseIndex - 1));
  $('#scNext').addEventListener('click', () => setShowcase(showcaseIndex + 1));
  const open = () => openLightbox(showcaseIndex, frame);
  frame.addEventListener('click', open);
  frame.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      open();
    } else if (e.key === 'ArrowLeft') {
      setShowcase(showcaseIndex - 1);
    } else if (e.key === 'ArrowRight') {
      setShowcase(showcaseIndex + 1);
    }
  });
  frame.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    },
    { passive: true }
  );
  frame.addEventListener(
    'touchend',
    (e) => {
      const dx = e.changedTouches[0].clientX - touchStartX;
      const dy = e.changedTouches[0].clientY - touchStartY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.5) setShowcase(showcaseIndex + (dx < 0 ? 1 : -1));
    },
    { passive: true }
  );
}

// ---------- GitHub: версия, ссылки на установщики, звёзды и скачивания ----------

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || Date.now() - data.at > CACHE_TTL) return null;
    return data;
  } catch {
    return null;
  }
}

function writeCache(payload) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ ...payload, at: Date.now() }));
  } catch {
    // кеш необязателен — страница просто спросит GitHub снова при следующей загрузке
  }
}

async function fetchRelease() {
  const cached = readCache();
  if (cached) return cached;
  const [releaseRes, repoRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${REPO}/releases/latest`, { headers: { Accept: 'application/vnd.github+json' } }),
    fetch(`https://api.github.com/repos/${REPO}`, { headers: { Accept: 'application/vnd.github+json' } }),
  ]);
  if (!releaseRes.ok) throw new Error(`GitHub: ${releaseRes.status}`);
  const release = await releaseRes.json();
  const repo = repoRes.ok ? await repoRes.json() : null;
  const assets = Array.isArray(release.assets) ? release.assets : [];
  const exe = assets.find((a) => /\.exe$/i.test(a.name));
  const apk = assets.find((a) => /\.apk$/i.test(a.name));
  const downloads = assets.reduce((sum, a) => sum + (Number(a.download_count) || 0), 0);
  const payload = {
    version: String(release.tag_name || '').replace(/^v/, ''),
    url: release.html_url,
    exe: exe ? { url: exe.browser_download_url, size: exe.size } : null,
    apk: apk ? { url: apk.browser_download_url, size: apk.size } : null,
    downloads,
    stars: repo ? repo.stargazers_count : null,
  };
  writeCache(payload);
  return payload;
}

function detectPlatform() {
  const uaPlatform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  const ua = navigator.userAgent || '';
  if (/android/i.test(ua)) return 'android';
  if (/win/i.test(uaPlatform) || /windows/i.test(ua)) return 'windows';
  return 'other';
}

function formatSize(bytes) {
  if (!bytes) return '';
  return bytes >= 1048576 ? `${(bytes / 1048576).toFixed(0)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function formatNumber(n) {
  return new Intl.NumberFormat(currentLang === 'ru' ? 'ru-RU' : 'en-US').format(n);
}

let releaseData = null;
const platform = detectPlatform();

/** Подставляет уже загруженные данные о релизе в текущий язык — вызывается и после смены языка. */
function applyRelease() {
  if (!releaseData) return;
  const dict = I18N[currentLang] || I18N.en;
  const v = `v${releaseData.version}`;
  $('#badgeVersion').textContent = v;

  const winMeta = releaseData.exe ? `${v} · ${formatSize(releaseData.exe.size)}` : dict['download.unavailable'];
  const androidMeta = releaseData.apk ? `${v} · ${formatSize(releaseData.apk.size)}` : dict['download.unavailable'];
  $('#dlWinMeta').textContent = winMeta;
  $('#dlAndroidMeta').textContent = androidMeta;
  if (releaseData.exe) $('#dlWin').href = releaseData.exe.url;
  if (releaseData.apk) $('#dlAndroid').href = releaseData.apk.url;

  const primary = platform === 'android' ? releaseData.apk : releaseData.exe;
  const primaryLabel = platform === 'android' ? dict['download.android'] : dict['download.windows'];
  if (primary) {
    $('#navDownload').href = primary.url;
    $('#heroDownload').href = primary.url;
    $('#heroDownloadLabel').textContent = `${dict['hero.cta']} — ${primaryLabel}`;
  }

  $('#otherPlatformNote').hidden = platform !== 'other';

  // Нулевое число выглядит как пустая страница — звёзды и скачивания показываем только когда есть что показать.
  const hasStars = !!releaseData.stars;
  const hasDownloads = !!releaseData.downloads;
  $('#statStarsWrap').hidden = !hasStars;
  $('#statDownloadsWrap').hidden = !hasDownloads;
  $('#statRow').hidden = !hasStars && !hasDownloads;
  if (hasStars) animateCount($('#statStars'), releaseData.stars);
  if (hasDownloads) animateCount($('#statDownloads'), releaseData.downloads);
}

function animateCount(el, target) {
  if (Number(el.dataset.target) === target) return; // уже отрисовано это число
  el.dataset.target = String(target);
  if (prefersReducedMotion || target === 0) {
    el.textContent = formatNumber(target);
    return;
  }
  const duration = 900;
  const start = performance.now();
  const from = 0;
  const step = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = formatNumber(Math.round(from + (target - from) * eased));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

async function loadRelease() {
  try {
    releaseData = await fetchRelease();
    applyRelease();
  } catch {
    // Сеть недоступна или лимит запросов GitHub исчерпан — кнопки остаются рабочими
    // (ведут на страницу релизов), просто без точной версии и размера файла.
    $('#badgeVersion').textContent = '—';
    const dict = I18N[currentLang] || I18N.en;
    $('#dlWinMeta').textContent = dict['download.unavailable'];
    $('#dlAndroidMeta').textContent = dict['download.unavailable'];
  }
}

// ---------- прокрутка: шапка, прогресс, появление блоков, активная ссылка ----------

function observeReveals(root = document) {
  const els = $$('.reveal', root).filter((el) => !el.classList.contains('visible'));
  if (prefersReducedMotion) {
    els.forEach((el) => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
  );
  els.forEach((el) => io.observe(el));
}

function wireScrollEffects() {
  const header = $('#siteHeader');
  const progress = $('#scrollProgress');
  const navLinks = $$('#navLinks a[href^="#"]');
  const sections = navLinks.map((a) => document.querySelector(a.getAttribute('href'))).filter(Boolean);

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    header.classList.toggle('scrolled', y > 40);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (sections.length) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const link = navLinks.find((a) => document.querySelector(a.getAttribute('href')) === entry.target);
          if (link) link.classList.toggle('active', entry.isIntersecting);
        });
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );
    sections.forEach((s) => spy.observe(s));
  }
}

function wireCursorGlow() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion) return;
  const hero = $('.hero');
  const glow = $('#cursorGlow');
  if (!hero || !glow) return;
  hero.classList.add('has-hover');
  let raf = 0;
  hero.addEventListener('mousemove', (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const rect = hero.getBoundingClientRect();
      glow.style.setProperty('--gx', `${e.clientX - rect.left}px`);
      glow.style.setProperty('--gy', `${e.clientY - rect.top}px`);
      raf = 0;
    });
  });
}

// ---------- запуск ----------

function wireLangSwitch() {
  $$('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.langBtn;
      if (lang === currentLang) return;
      saveLang(lang);
      applyLang(lang);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  applyLang(detectLang());
  wireLangSwitch();
  wireLightbox();
  wireShowcase();
  wireScrollEffects();
  wireCursorGlow();
  observeReveals();
  void loadRelease();
});
