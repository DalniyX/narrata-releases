// Страница «Карточки» для телефона — та же Cards (cards-engine.js, собран из scripts/studio/cards.cjs)
// движок, что у Narrata Studio, только без Electron: HTML карточки живёт в iframe (изоляция стилей — те
// же .wrap/.tag/h1 из движка иначе перебили бы стили этой страницы), а PNG рисует html-to-image прямо
// внутри iframe и отдаёт родителю через postMessage — без сервера и без Electron.
//
// Шрифт в экспорте — системный, не Inter: у Google Fonts нет CORS-заголовка на сам CSS (проверено
// напрямую), поэтому html-to-image не может встроить файл шрифта в картинку — только сослаться на него,
// а этого достаточно для страницы, но не для растеризации. В предпросмотре (iframe рендерит как обычную
// страницу) и в карточках из Studio (Electron, свой захват экрана) шрифт настоящий, отличие только здесь.
'use strict';

const REPO = (typeof SITE !== 'undefined' && SITE.repo) || 'DalniyX/narrata-releases';
const ROADMAP_URL = `https://raw.githubusercontent.com/${REPO}/HEAD/roadmap.json`;
const SUPPORTERS_URL = `https://raw.githubusercontent.com/${REPO}/main/supporters.json`;
const EXPORT_SCRIPT = `
<script src="https://cdn.jsdelivr.net/npm/html-to-image@1.11.11/dist/html-to-image.min.js"><\/script>
<script>
window.addEventListener('message', async (e) => {
  if (!e.data || e.data.type !== 'narrata-export') return;
  try {
    // У Google Fonts нет CORS на CSS — html-to-image всё равно попробует встроить файл шрифта и просто
    // нашумит в консоль об отказе. Раз встроить не даст в любом случае, убираем ссылку заранее: тише и быстрее.
    document.querySelectorAll('link[rel=stylesheet]').forEach((el) => el.remove());
    const blob = await htmlToImage.toBlob(document.body, { width: e.data.width, height: e.data.height, pixelRatio: 2, cacheBust: true, backgroundColor: '#09090b', skipFonts: true });
    parent.postMessage({ type: 'narrata-exported', blob }, '*');
  } catch (err) {
    parent.postMessage({ type: 'narrata-export-error', message: String((err && err.message) || err) }, '*');
  }
});
<\/script>`;

const shortHost = (url) => {
  try { const u = new URL(url); return (u.hostname + u.pathname).replace(/\/$/, ''); } catch { return url || ''; }
};

/** Короткий пункт из HTML-раздела журнала (landing/changelog-content.js уже хранит готовый HTML, не
 *  markdown) — берём текст <strong> (жирное начало пункта), а нет его — начало обычного текста. */
function shortFromHtml(li) {
  const strong = li.querySelector('strong');
  const text = (strong ? strong.textContent : li.textContent).trim().replace(/[.:]$/, '');
  return text.length > 90 ? `${text.slice(0, 88).trim()}…` : text;
}

function changelogItems(lang) {
  const versions = (typeof CHANGES !== 'undefined' && CHANGES[lang]?.versions) || [];
  const groups = versions[0]?.groups || [];
  const items = [];
  const parser = new DOMParser();
  for (const group of groups) {
    if (!group.html) continue;
    const doc = parser.parseFromString(group.html, 'text/html');
    for (const li of doc.querySelectorAll('li')) {
      if (items.length >= 4) break;
      items.push(shortFromHtml(li));
    }
  }
  return items;
}

async function fetchJson(url) {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Модель ctx.changelog у движка — group.items[] из { ru, en }, а не два отдельных списка по языкам
// (см. defaults() шаблона release в scripts/studio/cards.cjs). Языки по числу пунктов могут не совпасть —
// берём по максимальной длине, недостающее просто пусто.
function changelogGroups() {
  const ru = changelogItems('ru');
  const en = changelogItems('en');
  const n = Math.max(ru.length, en.length);
  const items = [];
  for (let i = 0; i < n; i++) items.push({ ru: ru[i] || '', en: en[i] || '' });
  return [{ items }];
}

async function buildCtx() {
  const [roadmap, supporters] = await Promise.all([fetchJson(ROADMAP_URL), fetchJson(SUPPORTERS_URL)]);
  const version = (typeof CHANGES !== 'undefined' && CHANGES.ru?.versions?.[0]?.version) || '';
  const site = typeof SITE !== 'undefined' ? SITE : {};
  return {
    appName: site.appName || 'Narrata',
    siteShort: shortHost(site.website),
    boostyShort: site.boosty ? shortHost(site.boosty) : shortHost(site.website),
    version,
    changelog: { groups: changelogGroups() },
    roadmap: roadmap || { items: [] },
    // supporters.json — { updatedAt, supporters: [{name}] }, не голый массив.
    supporters: Array.isArray(supporters?.supporters) ? supporters.supporters : [],
  };
}

(async function init() {
  const status = (text, isError) => {
    const el = document.getElementById('status');
    el.textContent = text || '';
    el.classList.toggle('err', !!isError);
  };

  if (!window.Cards) { status('Движок карточек не загрузился (cards-engine.js).', true); return; }

  const ctx = await buildCtx();

  const templates = window.Cards.templatesMeta();
  const templateSel = document.getElementById('fTemplate');
  const sizeSel = document.getElementById('fSize');
  const langSel = document.getElementById('fLang');
  const accentInput = document.getElementById('fAccent');
  const fieldset = document.getElementById('fields');
  const iframe = document.getElementById('previewIframe');
  const frameWrap = document.getElementById('previewFrame');
  const shareBtn = document.getElementById('shareBtn');
  const dlLink = document.getElementById('dlLink');

  for (const t of templates) templateSel.appendChild(new Option(t.label, t.id, false, false));

  let currentFields = [];
  let currentSize = { width: 1080, height: 1350 };

  function fieldInputs() {
    const values = {};
    for (const el of fieldset.querySelectorAll('[data-field]')) values[el.dataset.field] = el.value;
    return values;
  }

  function renderFieldset(templateId, lang) {
    const meta = templates.find((t) => t.id === templateId);
    const full = window.Cards.TEMPLATES.find((t) => t.id === templateId);
    const defaults = full.defaults(ctx, lang);
    fieldset.innerHTML = '<legend>Текст карточки</legend>';
    currentFields = meta.fields;
    for (const f of meta.fields) {
      const label = document.createElement('label');
      label.textContent = f.label;
      label.htmlFor = `field-${f.key}`;
      fieldset.appendChild(label);
      const input = f.kind === 'text' ? document.createElement('input') : document.createElement('textarea');
      if (f.kind === 'text') input.type = 'text';
      input.id = `field-${f.key}`;
      input.dataset.field = f.key;
      input.value = defaults[f.key] ?? '';
      input.addEventListener('input', renderPreview);
      fieldset.appendChild(input);
    }
  }

  function renderSizeOptions(templateId) {
    const meta = templates.find((t) => t.id === templateId);
    const prev = sizeSel.value;
    sizeSel.innerHTML = '';
    for (const s of meta.sizes) sizeSel.appendChild(new Option(s.label, s.id));
    if (meta.sizes.some((s) => s.id === prev)) sizeSel.value = prev;
  }

  function fitPreview(width, height) {
    const containerWidth = frameWrap.parentElement.clientWidth;
    const scale = containerWidth / width;
    frameWrap.style.height = `${height * scale}px`;
    iframe.style.width = `${width}px`;
    iframe.style.height = `${height}px`;
    iframe.style.transform = `scale(${scale})`;
    iframe.style.transformOrigin = 'top left';
  }

  function renderPreview() {
    const template = templateSel.value;
    const sizeId = sizeSel.value;
    const lang = langSel.value;
    const accent = accentInput.value;
    const { html, width, height } = window.Cards.cardHtml({ template, values: fieldInputs(), sizeId, lang, accent }, ctx);
    currentSize = { width, height };
    iframe.srcdoc = html.replace('</body>', `${EXPORT_SCRIPT}</body>`);
    fitPreview(width, height);
  }

  function onTemplateOrLangChange() {
    renderSizeOptions(templateSel.value);
    renderFieldset(templateSel.value, langSel.value);
    renderPreview();
  }

  templateSel.addEventListener('change', onTemplateOrLangChange);
  langSel.addEventListener('change', onTemplateOrLangChange);
  sizeSel.addEventListener('change', renderPreview);
  accentInput.addEventListener('input', renderPreview);
  document.getElementById('resetBtn').addEventListener('click', () => renderFieldset(templateSel.value, langSel.value) || renderPreview());
  window.addEventListener('resize', () => fitPreview(currentSize.width, currentSize.height));

  onTemplateOrLangChange();

  function exportPng() {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => { cleanup(); reject(new Error('таймаут рендера')); }, 15000);
      function handler(e) {
        if (e.source !== iframe.contentWindow || !e.data) return;
        if (e.data.type === 'narrata-exported') { cleanup(); resolve(e.data.blob); }
        else if (e.data.type === 'narrata-export-error') { cleanup(); reject(new Error(e.data.message)); }
      }
      function cleanup() { clearTimeout(timeout); window.removeEventListener('message', handler); }
      window.addEventListener('message', handler);
      iframe.contentWindow.postMessage({ type: 'narrata-export', width: currentSize.width, height: currentSize.height }, '*');
    });
  }

  shareBtn.addEventListener('click', async () => {
    shareBtn.disabled = true;
    status('Рисую картинку…');
    try {
      const blob = await exportPng();
      const file = new File([blob], 'narrata-card.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file] });
        status('');
      } else {
        const url = URL.createObjectURL(blob);
        dlLink.href = url;
        dlLink.click();
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        status('Скачано.');
      }
    } catch (err) {
      if (err && err.name !== 'AbortError') status(`Не получилось: ${err.message}`, true);
      else status('');
    } finally {
      shareBtn.disabled = false;
    }
  });
})();
