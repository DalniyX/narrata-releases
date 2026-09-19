// Страница руководства: разделы из guide-content.js (его собирает scripts/guide-site.mjs из встроенного
// руководства программы). Язык, оглавление, поиск и кнопка «Наверх» — общие, в subpage.js.
'use strict';

SubPage.start({
  texts: {
    ru: { 'guide.back': 'На главную', 'guide.search': 'Поиск по разделам', 'guide.nothing': 'Ничего не найдено', 'guide.note': 'Это то же руководство, что открывается в программе: «Справка → Руководство».', 'guide.home': 'Главная' },
    en: { 'guide.back': 'Back to the home page', 'guide.search': 'Search the guide', 'guide.nothing': 'Nothing found', 'guide.note': 'This is the same guide the app opens under “Help → Guide”.', 'guide.home': 'Home' },
  },
  render(lang) {
    const data = GUIDE[lang] || GUIDE.ru;
    document.title = `${data.title} — Narrata`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', data.subtitle);
    document.getElementById('guideTitle').textContent = data.title;
    document.getElementById('guideSubtitle').textContent = data.subtitle;
    SubPage.renderSections({
      toc: document.getElementById('guideToc'),
      list: document.getElementById('guideSections'),
      empty: document.getElementById('guideEmpty'),
      search: document.getElementById('guideSearch'),
      items: data.sections.map((s) => ({ id: s.id, title: s.title, hint: s.hint, html: s.html })),
    });
  },
});
