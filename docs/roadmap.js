// Страница «Планы»: раньше это был блок на главной, теперь отдельная страница (кнопка «Планы» в шапке) —
// первый экран index.html не пустеет ради того, чего у части проектов вообще нет. Данные и логика те же,
// что были в app.js: roadmap.json репозитория релизов, с кешем на 10 минут. Показ страницы целиком решает
// app.config.jsonc → app.showRoadmap (кнопка появляется только при включённой настройке, см. site-config.mjs);
// здесь же лишь разбор по статусам — пустой список даёт пустые колонки, а не пустую страницу.
'use strict';

const REPO = (typeof SITE !== 'undefined' && SITE.repo) || 'DalniyX/narrata-releases';
const ROADMAP_URL = `https://raw.githubusercontent.com/${REPO}/HEAD/roadmap.json`;
const ROADMAP_CACHE_KEY = 'narrata_roadmap_cache_v1';
const CACHE_TTL = 10 * 60 * 1000; // 10 минут — как кеш аналитики в Narrata Studio
const ROADMAP_STATUSES = ['planned', 'progress', 'done'];

const $ = (sel, root = document) => root.querySelector(sel);
const escapeHtml = SubPage.escapeHtml;
const safeLink = (value) => (/^https:\/\/[^\s"<>]+$/.test(String(value ?? '')) ? String(value) : '');
/** Текст на языке страницы, иначе на другом — карточка без перевода всё равно видна. */
const pickLang = (pair, lang) => (pair && typeof pair === 'object' ? pair[lang] || pair.en || pair.ru || '' : String(pair ?? ''));

async function fetchRoadmap() {
  try {
    const cached = JSON.parse(localStorage.getItem(ROADMAP_CACHE_KEY) || 'null');
    if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data;
  } catch {
    // нет кеша — спросим GitHub
  }
  const res = await fetch(ROADMAP_URL, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`roadmap: ${res.status}`);
  const data = await res.json();
  try {
    localStorage.setItem(ROADMAP_CACHE_KEY, JSON.stringify({ data, at: Date.now() }));
  } catch {
    // кеш необязателен
  }
  return data;
}

/** Три колонки по статусу. Нет файла, сеть недоступна или колонка пуста — просто «Пока пусто» в ней. */
function renderBoard(dict, lang, data) {
  const grid = $('#roadmapGrid');
  if (!grid) return;
  const items = Array.isArray(data?.items) ? data.items.filter((i) => i && ROADMAP_STATUSES.includes(i.status) && pickLang(i.title, lang)) : [];
  grid.innerHTML = ROADMAP_STATUSES.map((status, col) => {
    const list = items.filter((i) => i.status === status);
    const cards = list
      .map((item) => {
        const text = pickLang(item.text, lang);
        const link = safeLink(item.link);
        return `<article class="rm-item"><h3>${escapeHtml(pickLang(item.title, lang))}</h3>${text ? `<p>${escapeHtml(text)}</p>` : ''}${link ? `<a href="${escapeHtml(link)}" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="#i-github"/></svg>${escapeHtml(dict['roadmap.details'])}</a>` : ''}</article>`;
      })
      .join('');
    return `<div class="rm-col" data-status="${status}"><div class="rm-col-head"><span class="dot"></span>${escapeHtml(dict[`roadmap.${status}`])}<span class="count">${list.length}</span></div>${cards || `<p class="rm-empty">${escapeHtml(dict['roadmap.empty'])}</p>`}</div>`;
  }).join('');
  const foot = $('#roadmapFoot');
  const board = safeLink(data?.board);
  const updated = /^\d{4}-\d{2}-\d{2}$/.test(String(data?.updatedAt ?? ''))
    ? new Date(`${data.updatedAt}T00:00:00`).toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    : '';
  if (foot) {
    foot.hidden = !board && !updated;
    foot.innerHTML = `${updated ? `<span>${escapeHtml(dict['roadmap.updated'])}: ${escapeHtml(updated)}</span>` : ''}${board ? `<a href="${escapeHtml(board)}" target="_blank" rel="noopener"><svg class="icon" aria-hidden="true"><use href="#i-github"/></svg>${escapeHtml(dict['roadmap.board'])}</a>` : ''}`;
  }
}

// Файл грузится один раз и кешируется в памяти — переключение языка перерисовывает те же данные, не просит их заново.
let roadmapData;
SubPage.start({
  render(lang, dict) {
    if (roadmapData !== undefined) {
      renderBoard(dict, lang, roadmapData);
      return;
    }
    fetchRoadmap()
      .then((data) => {
        roadmapData = data;
        renderBoard(dict, lang, data);
      })
      .catch(() => {
        roadmapData = null;
        renderBoard(dict, lang, null);
      });
  },
});
