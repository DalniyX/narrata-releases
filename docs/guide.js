// Страница руководства: разделы из guide-content.js (его собирает scripts/guide-site.mjs из встроенного
// руководства программы), язык — тот же, что на главной (переключатель и сохранённый выбор общие),
// поиск по разделам и подсветка раздела, который сейчас читают.
'use strict';

(() => {
  const LANG_KEY = 'narrata_lang';
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const PAGE = {
    ru: { 'guide.back': 'На главную', 'guide.search': 'Поиск по разделам', 'guide.nothing': 'Ничего не найдено', 'guide.note': 'Это то же руководство, что открывается в программе: «Справка → Руководство».', 'guide.home': 'Главная' },
    en: { 'guide.back': 'Back to the home page', 'guide.search': 'Search the guide', 'guide.nothing': 'Nothing found', 'guide.note': 'This is the same guide the app opens under “Help → Guide”.', 'guide.home': 'Home' },
  };

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

  let lang = 'ru';
  let observer = null;

  function render() {
    const data = GUIDE[lang] || GUIDE.ru;
    const dict = { ...((typeof I18N !== 'undefined' && (I18N[lang] || I18N.en)) || {}), ...PAGE[lang] };
    document.documentElement.lang = lang;
    document.title = `${data.title} — Narrata`;
    $('meta[name="description"]')?.setAttribute('content', data.subtitle);
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
    const sw = $('#langSwitch');
    if (sw) {
      sw.dataset.lang = lang;
      $$('[data-lang-btn]', sw).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.langBtn === lang)));
    }

    $('#guideTitle').textContent = data.title;
    $('#guideSubtitle').textContent = data.subtitle;

    const toc = $('#guideToc');
    const list = $('#guideSections');
    toc.textContent = '';
    list.textContent = '';
    for (const section of data.sections) {
      const link = document.createElement('a');
      link.href = `#${section.id}`;
      link.dataset.id = section.id;
      const title = document.createElement('b');
      title.textContent = section.title;
      const hint = document.createElement('small');
      hint.textContent = section.hint;
      link.append(title, hint);
      toc.append(link);

      const article = document.createElement('section');
      article.className = 'guide-section';
      article.id = section.id;
      const h2 = document.createElement('h2');
      h2.textContent = section.title;
      const body = document.createElement('div');
      body.className = 'guide-body';
      // HTML собран из собственного руководства программы при публикации сайта, не из ввода посетителей.
      body.innerHTML = section.html;
      article.append(h2, body);
      list.append(article);
    }
    applySearch();
    watchActive();
  }

  function applySearch() {
    const query = $('#guideSearch').value.trim().toLowerCase();
    let shown = 0;
    $$('.guide-section').forEach((section) => {
      const match = !query || section.textContent.toLowerCase().includes(query);
      section.hidden = !match;
      $(`#guideToc a[data-id="${section.id}"]`).hidden = !match;
      if (match) shown++;
    });
    $('#guideEmpty').hidden = shown > 0;
  }

  /** Подсвечивает в оглавлении раздел, который сейчас на экране. */
  function watchActive() {
    observer?.disconnect();
    if (!('IntersectionObserver' in window)) return;
    const visible = new Map();
    observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : null);
        const current = [...visible].filter(([, top]) => top !== null).sort((a, b) => a[1] - b[1])[0]?.[0];
        if (!current) return;
        $$('#guideToc a').forEach((a) => a.classList.toggle('active', a.dataset.id === current));
      },
      { rootMargin: '-24px 0px -55% 0px' }
    );
    $$('.guide-section').forEach((s) => observer.observe(s));
  }

  document.addEventListener('DOMContentLoaded', () => {
    lang = detectLang();
    render();
    document.documentElement.classList.remove('i18n-boot');
    // Переход по ссылке вида guide.html#graph — после того как разделы появились на странице.
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
        render();
      })
    );
    $('#guideSearch').addEventListener('input', applySearch);

    // Кнопка «Наверх» — видна, когда прокрутили дальше первого экрана.
    const toTop = $('#toTop');
    const onScroll = () => toTop?.classList.toggle('visible', window.scrollY > window.innerHeight * 0.8);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    toTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));
  });
})();
