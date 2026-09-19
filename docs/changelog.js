// Страница «Что нового»: все версии из changelog-content.js (его собирает scripts/changelog-site.mjs из
// журнала изменений — того же, что в программе). Язык, оглавление, поиск и «Наверх» — в subpage.js.
'use strict';

const CHANGE_TEXTS = {
  ru: { 'changes.title': 'Что нового', 'changes.subtitle': 'Все версии и что в них изменилось — то же, что показывает окно «Что нового» в программе.', 'changes.search': 'Поиск по изменениям', 'changes.current': 'Текущая', 'guide.back': 'На главную', 'guide.nothing': 'Ничего не найдено', 'guide.home': 'Главная' },
  en: { 'changes.title': 'What’s new', 'changes.subtitle': 'Every version and what changed in it — the same as the app’s “What’s new” window.', 'changes.search': 'Search the changes', 'changes.current': 'Current', 'guide.back': 'Back to the home page', 'guide.nothing': 'Nothing found', 'guide.home': 'Home' },
};

/** 2026-09-19 → «19 сентября 2026». */
function formatDate(iso, lang) {
  if (!iso) return '';
  const date = new Date(`${iso}T12:00:00`);
  return Number.isNaN(date.getTime()) ? iso : date.toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

SubPage.start({
  texts: CHANGE_TEXTS,
  render(lang, dict) {
    const data = CHANGES[lang] || CHANGES.ru;
    document.title = `${dict['changes.title']} — Narrata`;
    const esc = SubPage.escapeHtml;
    SubPage.renderSections({
      toc: document.getElementById('changesToc'),
      list: document.getElementById('changesList'),
      empty: document.getElementById('changesEmpty'),
      search: document.getElementById('changesSearch'),
      items: data.versions.map((v, i) => ({
        // Якорь вида #v2.5.5 — на него ведёт плашка версии на главной.
        id: `v${v.version}`,
        title: `v${v.version}${i === 0 ? ` · ${dict['changes.current']}` : ''}`,
        hint: formatDate(v.date, lang),
        className: 'change',
        head: `<div class="change-head"><h2>v${esc(v.version)}</h2>${i === 0 ? `<span class="change-current">${esc(dict['changes.current'])}</span>` : ''}<span class="change-date">${esc(formatDate(v.date, lang))}</span></div>`,
        html: `${v.intro ?? ''}${v.groups.map((g) => `<h3 class="change-kind kind-${esc(g.kind)}">${esc(g.title)}</h3>${g.html}`).join('')}`,
      })),
    });
  },
});
