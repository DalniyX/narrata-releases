// Кнопка «Планы» в шапке и подвале: включена в настройках (app.config.jsonc → app.showRoadmap, за это
// уже отвечает data-link="roadmap" — см. scripts/site-config.mjs), но карточек ещё никто не опубликовал —
// вести на пустую страницу незачем, поэтому дополнительно прячем кнопку до первой опубликованной карточки.
// Общее для всех страниц (index.html и через subpage.js — guide/changelog/roadmap/license), поэтому
// отдельный маленький файл, а не часть какой-то одной из них. Кеш (10 минут) — тот же, что у roadmap.js,
// оба его читают и оба могут его писать: кто первый выполнил запрос, тот и наполнил его для другого.
'use strict';

(function () {
  var CACHE_KEY = 'narrata_roadmap_cache_v1';
  var CACHE_TTL = 10 * 60 * 1000;
  var STATUSES = ['planned', 'progress', 'done'];

  function hideLinks() {
    var els = document.querySelectorAll('[data-link="roadmap"]');
    for (var i = 0; i < els.length; i++) els[i].hidden = true;
  }

  /** Хотя бы одна карточка с известным статусом и названием хотя бы на одном языке. */
  function hasItems(data) {
    if (!data || !Array.isArray(data.items)) return false;
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      if (item && STATUSES.indexOf(item.status) !== -1 && item.title && (item.title.ru || item.title.en)) return true;
    }
    return false;
  }

  function readCache() {
    try {
      var cached = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
      if (cached && Date.now() - cached.at < CACHE_TTL) return cached.data;
    } catch (error) {
      // повреждённый кеш — спросим GitHub заново
    }
    return undefined;
  }

  document.addEventListener('DOMContentLoaded', function () {
    // Настройка выключена — data-link уже спрятал кнопку при публикации сайта, тут делать нечего.
    if (typeof SITE === 'undefined' || !SITE.roadmap) return;
    var cached = readCache();
    if (cached !== undefined) {
      if (!hasItems(cached)) hideLinks();
      return;
    }
    var repo = (typeof SITE !== 'undefined' && SITE.repo) || 'DalniyX/narrata-releases';
    fetch('https://raw.githubusercontent.com/' + repo + '/HEAD/roadmap.json', { cache: 'no-cache' })
      .then(function (res) {
        return res.ok ? res.json() : null;
      })
      .then(function (data) {
        if (data) {
          try {
            localStorage.setItem(CACHE_KEY, JSON.stringify({ data: data, at: Date.now() }));
          } catch (error) {
            // кеш необязателен
          }
        }
        if (!hasItems(data)) hideLinks();
      })
      .catch(function () {
        hideLinks();
      });
  });
})();
