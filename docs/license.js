// Страница лицензии: то же соглашение, что принимается при установке программы (legal/eula.*.md),
// собирает scripts/license-site.mjs в license-content.js. Язык, оглавление, поиск и кнопка «Наверх» —
// общие, в subpage.js.
'use strict';

SubPage.start({
  texts: {
    ru: { 'guide.search': 'Поиск по пунктам', 'guide.nothing': 'Ничего не найдено', 'guide.note': 'Это то же соглашение, которое принимается при установке программы.', 'guide.home': 'Главная' },
    en: { 'guide.search': 'Search the agreement', 'guide.nothing': 'Nothing found', 'guide.note': 'This is the same agreement accepted when installing the app.', 'guide.home': 'Home' },
  },
  render(lang) {
    const data = LICENSE[lang] || LICENSE.ru;
    document.title = `${data.title} — Narrata`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', data.title);
    document.getElementById('licenseTitle').textContent = data.title;
    document.getElementById('licenseSubtitle').textContent = data.subtitle;
    document.getElementById('licenseIntro').innerHTML = data.intro;
    SubPage.renderSections({
      toc: document.getElementById('licenseToc'),
      list: document.getElementById('licenseSections'),
      empty: document.getElementById('licenseEmpty'),
      search: document.getElementById('licenseSearch'),
      items: data.sections.map((s) => ({ id: s.id, title: s.title, hint: s.hint, html: s.html })),
    });
  },
});
