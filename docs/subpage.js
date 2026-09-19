// Общее для внутренних страниц сайта (guide.html, changelog.html): язык — тот же, что на главной
// (переключатель и сохранённый выбор общие), подстановка текстов data-i18n, кнопка «Наверх».
// Страница вызывает SubPage.start({ texts, render }): texts — свои подписи на двух языках, render(lang) —
// отрисовка содержимого; вызывается при открытии и при смене языка.
'use strict';

const SubPage = (() => {
  const LANG_KEY = 'narrata_lang';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  function detectLang() {
    try {
      const saved = localStorage.getItem(LANG_KEY);
      if (saved === 'ru' || saved === 'en') return saved;
    } catch {
      // приватное окно — определяем по системе
    }
    const langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    return langs.some((l) => l.toLowerCase().startsWith('ru')) ? 'ru' : 'en';
  }

  /** Тексты data-i18n, aria-label и placeholder: словарь сайта (i18n.js) + свои подписи страницы. */
  function applyTexts(dict) {
    $$('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    $$('[data-i18n-aria]').forEach((el) => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key] !== undefined) el.setAttribute('aria-label', dict[key]);
    });
    $$('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) el.setAttribute('placeholder', dict[key]);
    });
  }

  function start({ texts = {}, render }) {
    let lang = 'ru';
    const apply = () => {
      const dict = { ...((typeof I18N !== 'undefined' && (I18N[lang] || I18N.en)) || {}), ...(texts[lang] || texts.ru || {}) };
      document.documentElement.lang = lang;
      applyTexts(dict);
      const sw = $('#langSwitch');
      if (sw) {
        sw.dataset.lang = lang;
        $$('[data-lang-btn]', sw).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang)));
      }
      render(lang, dict);
    };

    document.addEventListener('DOMContentLoaded', () => {
      lang = detectLang();
      apply();
      document.documentElement.classList.remove('i18n-boot');
      // Переход по ссылке с якорем — после того как содержимое появилось на странице.
      if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();

      $$('[data-lang-btn]').forEach((btn) =>
        btn.addEventListener('click', () => {
          if (btn.dataset.langBtn === lang) return;
          lang = btn.dataset.langBtn;
          try {
            localStorage.setItem(LANG_KEY, lang);
          } catch {
            // без сохранения язык определится заново
          }
          apply();
        })
      );

      // Кнопка «Наверх» — видна, когда прокрутили дальше первого экрана.
      const toTop = $('#toTop');
      const onScroll = () => toTop?.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
    });
  }

  /**
   * Оглавление слева + поиск + подсветка раздела на экране — общая раскладка руководства и «Что нового».
   * items: [{ id, title, hint, html (тело раздела), head (HTML заголовка раздела, необязательно) }].
   */
  let observer = null;
  function renderSections({ toc, list, empty, search, items }) {
    toc.textContent = '';
    list.textContent = '';
    for (const item of items) {
      const link = document.createElement('a');
      link.href = `#${item.id}`;
      link.dataset.id = item.id;
      const title = document.createElement('b');
      title.textContent = item.title;
      const hint = document.createElement('small');
      hint.textContent = item.hint ?? '';
      link.append(title, hint);
      toc.append(link);

      const section = document.createElement('section');
      section.className = `guide-section${item.className ? ` ${item.className}` : ''}`;
      section.id = item.id;
      // HTML собран из собственных текстов программы при публикации сайта, не из ввода посетителей.
      section.innerHTML = `${item.head ?? `<h2>${escapeHtml(item.title)}</h2>`}<div class="guide-body">${item.html}</div>`;
      list.append(section);
    }
    const applySearch = () => {
      const query = search.value.trim().toLowerCase();
      let shown = 0;
      $$('.guide-section', list).forEach((section) => {
        const match = !query || section.textContent.toLowerCase().includes(query);
        section.hidden = !match;
        const link = toc.querySelector(`a[data-id="${CSS.escape(section.id)}"]`);
        if (link) link.hidden = !match;
        if (match) shown++;
      });
      empty.hidden = shown > 0;
    };
    search.oninput = applySearch;
    applySearch();

    observer?.disconnect();
    if (!('IntersectionObserver' in window)) return;
    const visible = new Map();
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null);
        const current = [...visible].filter(([, top]) => top !== null).sort((a, b) => a[1] - b[1])[0]?.[0];
        if (!current) return;
        $$('a', toc).forEach((a) => a.classList.toggle('active', a.dataset.id === current));
      },
      { rootMargin: '-24px 0px -55% 0px' }
    );
    $$('.guide-section', list).forEach((s) => observer.observe(s));
  }

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

  return { start, renderSections, escapeHtml };
})();
