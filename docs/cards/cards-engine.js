// Создано scripts/cards-site.mjs из scripts/studio/cards.cjs — не правьте вручную: правки пропадут.
window.Cards = (function () {
'use strict';
const module = { exports: {} };
// Карточки для постов и сайта: шаблоны в едином стиле (цвета и шрифт сайта) → HTML → PNG.
// Шаблон — чистая функция «поля → HTML», поэтому всё, кроме самой отрисовки, проверяется тестами
// (cards.test.ts). Отрисовка — невидимое окно Electron: renderPng() вызывает главный процесс Studio
// и скрипт превью ссылки сайта (og-image.cjs).
'use strict';

const SIZES = {
  post: { label: 'Пост 4:5 · 1080×1350', width: 1080, height: 1350 },
  tall: { label: 'Пост 3:4 · 1080×1440', width: 1080, height: 1440 },
  square: { label: 'Квадрат · 1080×1080', width: 1080, height: 1080 },
  story: { label: 'Сторис 9:16 · 1080×1920', width: 1080, height: 1920 },
  og: { label: 'Превью ссылки · 1200×630', width: 1200, height: 630 },
  // Social preview репозитория на GitHub (Settings → General → Social preview) — GitHub требует ровно
  // этот размер, картинку заливают там вручную, своего API на этот счёт у GitHub нет.
  github: { label: 'GitHub превью · 1280×640', width: 1280, height: 640 },
};

const esc = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/** Строчная разметка: **жирный** и `код`; всё остальное экранируется. */
function inline(value) {
  return esc(value)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

/** Непустые строки поля «по строке на пункт». */
const lines = (value) =>
  String(value ?? '')
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);

// ---------- акцентный цвет карточек ----------
// Один выбранный цвет на всю карточку (Studio → «Карточки») — второй тон градиентов вычисляется
// осветлением того же цвета в HSL, чтобы не просить второй пикер. Статусные цвета (зелёный/жёлтый
// в «Планах», галочка в «Уровнях поддержки») — это не бренд, их не трогаем.
const DEFAULT_ACCENT = '#5b5bf0';

function hexToHsl(hex) {
  const n = /^#?[0-9a-f]{6}$/i.test(hex || '') ? hex.replace('#', '') : DEFAULT_ACCENT.slice(1);
  const r = parseInt(n.slice(0, 2), 16) / 255;
  const g = parseInt(n.slice(2, 4), 16) / 255;
  const b = parseInt(n.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return [h * 360, s * 100, l * 100];
}
function hslToHex(h, s, l) {
  const sN = s / 100;
  const lN = l / 100;
  const k = (n) => (n + h / 30) % 12;
  const a = sN * Math.min(lN, 1 - lN);
  const f = (n) => lN - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const toHex = (x) => Math.round(255 * x).toString(16).padStart(2, '0');
  return `#${toHex(f(0))}${toHex(f(8))}${toHex(f(4))}`;
}
/** Второй тон градиента — тот же цвет светлее, без второго пикера. */
const lighten = (hex, amount) => {
  const [h, s, l] = hexToHsl(hex);
  return hslToHex(h, s, Math.min(94, l + amount));
};
/** Валидный #rrggbb или запасной цвет по умолчанию — на случай испорченного docs/cards.json. */
const cleanAccent = (hex) => (/^#[0-9a-f]{6}$/i.test(hex || '') ? hex : DEFAULT_ACCENT);

// Тот же значок, что на экране приветствия (WelcomeMark), но цвет — от выбранного акцента,
// чтобы уголок карточки совпадал с общим брендингом, а не оставался фиксированным индиго.
const LOGO = `<svg class="logo" viewBox="0 0 120 120" aria-hidden="true"><defs><radialGradient id="lg" cx="35%" cy="35%" r="70%"><stop offset="0" style="stop-color:var(--accent-2)"/><stop offset="1" style="stop-color:var(--accent)"/></radialGradient><filter id="lgw" x="-60%" y="-60%" width="220%" height="220%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><g filter="url(#lgw)"><path d="M38 60 H54 C 70 60, 70 34, 86 34" style="stroke:var(--accent-2)" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.9"/><path d="M54 60 C 70 60, 70 86, 86 86" style="stroke:var(--accent-2)" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.9"/><circle cx="38" cy="60" r="8" fill="url(#lg)"/><circle cx="86" cy="34" r="6" style="fill:color-mix(in srgb,var(--accent-2) 80%,white)"/><circle cx="86" cy="86" r="6" style="fill:color-mix(in srgb,var(--accent-2) 80%,white)"/></g></svg>`;

// Общий стиль: те же токены, что у сайта (landing/site.css) — тёмный фон, Inter, --accent/--accent-2
// подставляются в page() из выбранного в Studio цвета (по умолчанию — тот же индиго, что и раньше).
const BASE_CSS = `
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:var(--w);height:var(--h);overflow:hidden}
body{font-family:Inter,'Segoe UI',system-ui,sans-serif;color:#f4f4f5;background:#09090b;position:relative;-webkit-font-smoothing:antialiased}
.glow{position:absolute;border-radius:50%;filter:blur(40px);pointer-events:none}
.g1{width:780px;height:780px;top:-320px;left:-280px;background:radial-gradient(circle,var(--accent) 0%,transparent 65%);opacity:.55}
.g2{width:720px;height:720px;bottom:-340px;right:-280px;background:radial-gradient(circle,var(--accent-2) 0%,transparent 65%);opacity:.4}
.wrap{position:relative;height:100%;display:flex;flex-direction:column;padding:72px 76px 56px}
.tag{display:inline-flex;align-items:center;gap:12px;align-self:flex-start;padding:10px 22px;border-radius:999px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);font-size:24px;font-weight:600;color:color-mix(in srgb,var(--accent) 45%,white);margin-bottom:28px}
h1{font-size:78px;font-weight:800;letter-spacing:-.03em;line-height:1.04;margin:28px 0 14px}
.grad{background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 62%,white),color-mix(in srgb,var(--accent-2) 55%,white));-webkit-background-clip:text;color:transparent}
.lead{font-size:30px;color:#a1a1aa;line-height:1.42}
.grow{flex:0 0 auto;min-height:0;margin-bottom:28px}
/* Заголовок и содержимое — посередине между меткой сверху и подписью снизу: карточка без пустого низа. */
.wrap>h1{margin-top:auto}
.box{padding:24px 28px;border-radius:24px;background:rgba(24,24,27,.78);border:1px solid #27272a}
.num{flex:none;width:58px;height:58px;border-radius:17px;display:flex;align-items:center;justify-content:center;font-size:30px;font-weight:800;color:#fff;background:linear-gradient(135deg,var(--accent),var(--accent-2));box-shadow:0 8px 22px color-mix(in srgb,var(--accent) 35%,transparent)}
.muted{color:#a1a1aa}
b{font-weight:700;color:#fff}
code{font-family:'JetBrains Mono',Consolas,monospace;font-size:.9em;padding:2px 10px;border-radius:8px;background:#27272a;border:1px solid #3f3f46}
.foot{display:flex;align-items:center;gap:16px;margin-top:auto;font-size:24px;color:#71717a}
.foot .logo{width:44px;height:44px}
.foot .name{font-weight:700;color:#e4e4e7;font-size:26px}
.foot .right{margin-left:auto;text-align:right}
`;

function page({ width, height, body, css = '', accent = DEFAULT_ACCENT }) {
  const a1 = cleanAccent(accent);
  const a2 = lighten(a1, 16);
  return `<!doctype html><html><head><meta charset="utf-8"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"><style>:root{--w:${width}px;--h:${height}px;--accent:${a1};--accent-2:${a2}}${BASE_CSS}${css}</style></head><body><div class="glow g1"></div><div class="glow g2"></div>${body}</body></html>`;
}

const foot = (ctx, right) =>
  `<div class="foot">${LOGO}<span class="name">${esc(ctx.appName)}</span>${right ? `<span class="right">${inline(right)}</span>` : ''}</div>`;

/** Короткая строка пункта журнала: жирное начало («**Прохождение на холсте**: …») или первая фраза. */
function shortItem(item) {
  const text = String(item ?? '').trim();
  const bold = text.match(/^\*\*(.+?)\*\*/);
  if (bold) return bold[1].replace(/[.:]$/, '');
  const plain = text.replace(/\*\*/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  const cut = plain.split(/(?:\s—\s|:\s|\.\s)/)[0];
  return cut.length > 90 ? `${cut.slice(0, 88).trim()}…` : cut;
}

// ---------- шаблоны ----------
// fields: key, label, kind ('text' | 'area' | 'lines'), hint. defaults(ctx, lang) — начальные значения
// (из журнала, планов и т. п.); html(values, ctx, size, lang) — ctx.accent доступен всем через page().

const T = (ru, en) => ({ ru, en });
const pick = (pair, lang) => (typeof pair === 'string' ? pair : pair[lang] ?? pair.ru);

const TEMPLATES = [
  {
    id: 'release',
    label: 'Релиз',
    hint: 'Номер версии и 3–5 главных изменений — из журнала изменений текущей версии.',
    sizes: ['post', 'tall', 'square', 'story'],
    fields: [
      { key: 'version', label: 'Версия', kind: 'text' },
      { key: 'title', label: 'Заголовок', kind: 'text' },
      { key: 'items', label: 'Главное (по строке на пункт, до 5)', kind: 'lines' },
      { key: 'link', label: 'Ссылка внизу', kind: 'text' },
    ],
    defaults: (ctx, lang) => {
      const cl = ctx.changelog;
      const items = [];
      for (const group of cl?.groups ?? []) for (const item of group.items) if (items.length < 4 && item[lang]) items.push(shortItem(item[lang]));
      return {
        version: ctx.version,
        title: pick(T('Новая версия', 'New version'), lang),
        items: items.join('\n'),
        link: ctx.siteShort,
      };
    },
    html: (v, ctx, size, lang) => {
      const items = lines(v.items).slice(0, 5);
      const body = `<div class="wrap"><span class="tag">${esc(ctx.appName)}</span>
        <h1>${esc(v.title)}<br><span class="grad ver">${esc(v.version)}</span></h1>
        <div class="grow list">${items.map((item) => `<div class="box row"><span class="dot"></span><span>${inline(item)}</span></div>`).join('')}</div>
        ${foot(ctx, v.link)}</div>`;
      return page({
        ...size,
        body,
        accent: ctx.accent,
        css: `.ver{font-size:1.5em;letter-spacing:-.04em}.list{display:flex;flex-direction:column;gap:16px;margin-top:36px}.row{display:flex;gap:24px;align-items:center;font-size:36px;font-weight:600;line-height:1.3;padding:28px 32px}.dot{flex:none;width:16px;height:16px;border-radius:50%;background:linear-gradient(135deg,var(--accent),var(--accent-2));box-shadow:0 0 18px color-mix(in srgb,var(--accent-2) 70%,transparent)}`,
      });
    },
  },
  {
    id: 'tip',
    label: 'Совет',
    hint: 'Одна функция программы крупно — лёгкий регулярный пост.',
    sizes: ['post', 'square', 'tall', 'story'],
    fields: [
      { key: 'label', label: 'Метка', kind: 'text' },
      { key: 'title', label: 'Заголовок', kind: 'text' },
      { key: 'text', label: 'Текст', kind: 'area' },
      { key: 'keys', label: 'Клавиши или путь в меню (через +, необязательно)', kind: 'text' },
    ],
    defaults: (ctx, lang) => ({
      label: pick(T('Совет', 'Tip'), lang),
      title: pick(T('Командная палитра', 'Command palette'), lang),
      text: pick(T('Не помните, где кнопка? Нажмите Ctrl+K и начните печатать название действия — палитра найдёт его сама.', 'Can’t remember where a button is? Press Ctrl+K and type the action — the palette finds it for you.'), lang),
      keys: 'Ctrl + K',
    }),
    html: (v, ctx, size) => {
      const keys = String(v.keys ?? '').trim();
      const body = `<div class="wrap"><span class="tag">💡 ${esc(v.label)}</span>
        <h1>${inline(v.title)}</h1>
        ${keys ? `<div class="keys">${keys.split('+').map((k) => `<span class="key">${esc(k.trim())}</span>`).join('<span class="plus">+</span>')}</div>` : ''}
        <div class="grow"><p class="lead big">${inline(v.text)}</p></div>
        ${foot(ctx, ctx.siteShort)}</div>`;
      return page({
        ...size,
        body,
        accent: ctx.accent,
        css: `.keys{display:flex;align-items:center;gap:16px;margin:18px 0 34px}.key{padding:18px 30px;border-radius:18px;background:#18181b;border:2px solid #3f3f46;border-bottom-width:6px;font-size:44px;font-weight:700}.plus{font-size:40px;color:#71717a}.big{font-size:40px;color:#d4d4d8;line-height:1.5}`,
      });
    },
  },
  {
    id: 'announce',
    label: 'Объявление',
    hint: 'Свободная карточка: метка, заголовок, текст.',
    sizes: ['post', 'square', 'tall', 'story'],
    fields: [
      { key: 'label', label: 'Метка', kind: 'text' },
      { key: 'title', label: 'Заголовок (**выделение** цветом)', kind: 'text' },
      { key: 'text', label: 'Текст', kind: 'area' },
      { key: 'footer', label: 'Строка внизу', kind: 'text' },
    ],
    defaults: (ctx, lang) => ({
      label: pick(T('Новости', 'News'), lang),
      title: pick(T('Скоро — **что-то новое**', 'Coming soon — **something new**'), lang),
      text: '',
      footer: ctx.siteShort,
    }),
    html: (v, ctx, size) => {
      const title = esc(v.title).replace(/\*\*(.+?)\*\*/g, '<span class="grad">$1</span>');
      const body = `<div class="wrap"><span class="tag">${esc(v.label)}</span><h1 class="huge">${title}</h1><div class="grow"><p class="lead big">${inline(v.text)}</p></div>${foot(ctx, v.footer)}</div>`;
      return page({ ...size, body, accent: ctx.accent, css: `.huge{font-size:100px}.big{font-size:40px;color:#d4d4d8;line-height:1.5;margin-top:10px}` });
    },
  },
  {
    id: 'steps',
    label: 'Шаги и правила',
    hint: 'Нумерованный список: как оформить баг-репорт, правила клуба, навигация по веткам. Строка: «Заголовок — пояснение».',
    sizes: ['tall', 'post', 'story'],
    fields: [
      { key: 'label', label: 'Метка', kind: 'text' },
      { key: 'title', label: 'Заголовок (**выделение** цветом)', kind: 'text' },
      { key: 'lead', label: 'Подзаголовок', kind: 'text' },
      { key: 'items', label: 'Пункты — по строке: «Заголовок — пояснение»', kind: 'lines' },
      { key: 'footer', label: 'Строка внизу', kind: 'text' },
      { key: 'start', label: 'Нумерация с (0 или 1)', kind: 'text' },
    ],
    defaults: (ctx, lang) => ({
      label: pick(T('Правила клуба', 'Club rules'), lang),
      title: pick(T('Как у нас **принято**', 'How we **do things**'), lang),
      lead: '',
      items: pick(
        T(
          'Голосования — совет — итоги влияют на план, решение и сроки за автором\nБаги и идеи — в свою ветку, по шаблону из закрепа\nЧто в клубе — остаётся в клубе — не выкладываем закрытое наружу\nУважение — без рекламы, спама и политики',
          'Polls are advice — results shape the plan, the final call and dates are the author’s\nBugs and ideas — in their thread, using the pinned template\nWhat’s in the club stays in the club — nothing private goes outside\nRespect — no ads, spam or politics'
        ),
        lang
      ),
      footer: '',
      start: '1',
    }),
    html: (v, ctx, size) => {
      const start = Number.parseInt(v.start, 10) || 0;
      const items = lines(v.items).slice(0, 8);
      const title = esc(v.title).replace(/\*\*(.+?)\*\*/g, '<span class="grad">$1</span>');
      const rows = items
        .map((item, i) => {
          const [head, ...rest] = item.split(/\s[—–-]\s/);
          return `<div class="box step"><div class="num">${start + i}</div><div><div class="st">${inline(head)}</div>${rest.length ? `<div class="sd">${inline(rest.join(' — '))}</div>` : ''}</div></div>`;
        })
        .join('');
      const body = `<div class="wrap"><span class="tag">${esc(v.label)}</span><h1>${title}</h1>${v.lead ? `<p class="lead">${inline(v.lead)}</p>` : ''}<div class="grow steps">${rows}</div>${foot(ctx, v.footer)}</div>`;
      return page({
        ...size,
        body,
        accent: ctx.accent,
        css: `.steps{display:flex;flex-direction:column;gap:14px;margin-top:34px}.step{display:flex;gap:26px;align-items:flex-start;padding:22px 26px}.st{font-size:31px;font-weight:700;line-height:1.25}.sd{font-size:24px;color:#a1a1aa;line-height:1.42;margin-top:6px}`,
      });
    },
  },
  {
    id: 'roadmap',
    label: 'Планы',
    hint: 'Три колонки из страницы «Планы»: что готово, что делается, что дальше.',
    sizes: ['tall', 'post', 'story'],
    fields: [
      { key: 'title', label: 'Заголовок', kind: 'text' },
      { key: 'footer', label: 'Строка внизу', kind: 'text' },
    ],
    defaults: (ctx, lang) => ({ title: pick(T('Что дальше', 'What’s next'), lang), footer: ctx.siteShort }),
    html: (v, ctx, size, lang) => {
      const cols = [
        { id: 'progress', label: T('В работе', 'In progress'), color: '#f59e0b' },
        { id: 'planned', label: T('В планах', 'Planned'), color: 'var(--accent-2)' },
        { id: 'done', label: T('Готово', 'Done'), color: '#34d399' },
      ];
      const items = ctx.roadmap?.items ?? [];
      const col = (c) => {
        const list = items.filter((i) => i.status === c.id).slice(0, 4);
        return `<div class="rc"><div class="rh"><span class="rd" style="background:${c.color}"></span>${esc(pick(c.label, lang))}<span class="rn">${items.filter((i) => i.status === c.id).length}</span></div>${list.map((i) => `<div class="box ri">${esc(i.title?.[lang] || i.title?.ru || i.title?.en || '')}</div>`).join('') || '<div class="re">—</div>'}</div>`;
      };
      const body = `<div class="wrap"><span class="tag">${esc(ctx.appName)}</span><h1>${esc(v.title)}</h1><div class="grow rcols">${cols.map(col).join('')}</div>${foot(ctx, v.footer)}</div>`;
      return page({
        ...size,
        body,
        accent: ctx.accent,
        css: `.rcols{display:flex;flex-direction:column;gap:26px;margin-top:30px}.rh{display:flex;align-items:center;gap:14px;font-size:34px;font-weight:700;margin-bottom:12px}.rd{width:16px;height:16px;border-radius:50%}.rn{font-size:22px;color:#71717a;font-weight:600}.ri{padding:20px 26px;font-size:30px;line-height:1.3;margin-bottom:10px}.re{color:#52525b;font-size:26px;padding-left:4px}`,
      });
    },
  },
  {
    id: 'thanks',
    label: 'Спасибо спонсорам',
    hint: 'Имена из «Благодарностей» (supporters.json). Показывайте только тех, кто согласен.',
    sizes: ['post', 'square', 'tall', 'story'],
    fields: [
      { key: 'title', label: 'Заголовок (**выделение** цветом)', kind: 'text' },
      { key: 'names', label: 'Имена — по строке (из «Благодарностей»)', kind: 'lines' },
      { key: 'text', label: 'Текст', kind: 'area' },
    ],
    defaults: (ctx, lang) => ({
      title: pick(T('Спасибо, что **вы с нами**', 'Thank you for **being here**'), lang),
      names: (ctx.supporters ?? []).map((s) => s.name).join('\n'),
      text: pick(T('Благодаря вам проект живёт и развивается.', 'You keep this project alive and growing.'), lang),
    }),
    html: (v, ctx, size) => {
      const names = lines(v.names).slice(0, 30);
      const title = esc(v.title).replace(/\*\*(.+?)\*\*/g, '<span class="grad">$1</span>');
      const body = `<div class="wrap"><span class="tag">♥ ${esc(ctx.appName)}</span><h1>${title}</h1><p class="lead">${inline(v.text)}</p><div class="grow names">${names.map((n) => `<span class="nm">${esc(n)}</span>`).join('')}</div>${foot(ctx, ctx.siteShort)}</div>`;
      return page({
        ...size,
        body,
        accent: ctx.accent,
        css: `.names{display:flex;flex-wrap:wrap;align-content:flex-start;gap:14px;margin-top:40px}.nm{padding:16px 30px;border-radius:999px;font-size:34px;font-weight:600;background:color-mix(in srgb,var(--accent) 14%,transparent);border:1px solid color-mix(in srgb,var(--accent-2) 35%,transparent);color:color-mix(in srgb,var(--accent-2) 40%,white)}`,
      });
    },
  },
  {
    id: 'poll',
    label: 'Итоги голосования',
    hint: 'Варианты с процентами: строка «Вариант — 45». Победитель подсвечивается.',
    sizes: ['post', 'tall', 'square', 'story'],
    fields: [
      { key: 'title', label: 'Вопрос', kind: 'text' },
      { key: 'options', label: 'Варианты — по строке: «Вариант — 45»', kind: 'lines' },
      { key: 'result', label: 'Итог (что берём в работу)', kind: 'area' },
    ],
    defaults: (ctx, lang) => ({
      title: pick(T('Что делаем следующим?', 'What do we build next?'), lang),
      options: pick(T('Оптимизация больших графов — 46\nНовые узлы — 31\nМобильная версия — 23', 'Large graph performance — 46\nNew node types — 31\nMobile version — 23'), lang),
      result: pick(T('Берём в работу оптимизацию — спасибо всем, кто голосовал!', 'Performance it is — thanks to everyone who voted!'), lang),
    }),
    html: (v, ctx, size, lang) => {
      const options = lines(v.options).map((line) => {
        const m = line.match(/^(.*?)\s*[—–-]\s*(\d{1,3})\s*%?$/);
        return m ? { text: m[1], pct: Math.min(100, Number(m[2])) } : { text: line, pct: 0 };
      });
      const max = Math.max(0, ...options.map((o) => o.pct));
      const rows = options
        .slice(0, 6)
        .map((o) => `<div class="opt${o.pct === max && max > 0 ? ' win' : ''}"><div class="bar" style="width:${o.pct}%"></div><span class="ot">${inline(o.text)}</span><span class="op">${o.pct}%</span></div>`)
        .join('');
      const body = `<div class="wrap"><span class="tag">🗳 ${esc(pick(T('Итоги голосования', 'Poll results'), lang))}</span><h1>${inline(v.title)}</h1><div class="opts">${rows}</div><div class="grow"><p class="lead res">${inline(v.result)}</p></div>${foot(ctx, ctx.siteShort)}</div>`;
      return page({
        ...size,
        body,
        accent: ctx.accent,
        css: `.opts{display:flex;flex-direction:column;gap:16px;margin-top:34px}.opt{position:relative;overflow:hidden;display:flex;align-items:center;gap:20px;padding:26px 30px;border-radius:22px;background:rgba(24,24,27,.78);border:1px solid #27272a;font-size:31px;font-weight:600}.bar{position:absolute;inset:0 auto 0 0;background:rgba(113,113,122,.22)}.win{border-color:color-mix(in srgb,var(--accent-2) 55%,transparent)}.win .bar{background:linear-gradient(90deg,color-mix(in srgb,var(--accent) 45%,transparent),color-mix(in srgb,var(--accent-2) 35%,transparent))}.ot,.op{position:relative}.op{margin-left:auto;font-weight:800}.res{margin-top:34px;font-size:32px;color:#d4d4d8}`,
      });
    },
  },
  {
    id: 'tiers',
    label: 'Уровни поддержки',
    hint: 'Уровни подписки рядом. Для каждого: название, цена и что входит — по строке.',
    sizes: ['tall', 'post', 'story'],
    fields: [
      { key: 'title', label: 'Заголовок (**выделение** цветом)', kind: 'text' },
      { key: 't1', label: 'Уровень 1: название', kind: 'text' },
      { key: 'p1', label: 'Уровень 1: цена', kind: 'text' },
      { key: 'l1', label: 'Уровень 1: что входит — по строке', kind: 'lines' },
      { key: 't2', label: 'Уровень 2: название', kind: 'text' },
      { key: 'p2', label: 'Уровень 2: цена', kind: 'text' },
      { key: 'l2', label: 'Уровень 2: что входит — по строке', kind: 'lines' },
      { key: 'footer', label: 'Строка внизу (ссылка)', kind: 'text' },
    ],
    defaults: (ctx, lang) => ({
      title: pick(T('Поддержать **разработку**', 'Support **development**'), lang),
      t1: pick(T('На чай и печенье ☕', 'Tea and biscuits ☕'), lang),
      p1: pick(T('150 ₽ / мес', '150 ₽ / month'), lang),
      l1: pick(T('Закрытые новости разработки\nИмя в «Благодарностях» программы', 'Private devlog posts\nYour name in the app’s credits'), lang),
      t2: pick(T('Голос проекта 🗳', 'Project voice 🗳'), lang),
      p2: pick(T('450 ₽ / мес', '450 ₽ / month'), lang),
      l2: pick(T('Всё из первого уровня\nГолосования за новые функции\nЗакрытый клуб в Telegram\nИмя в топе «Благодарностей»', 'Everything from tier one\nVotes on new features\nPrivate Telegram club\nTop spot in the credits'), lang),
      footer: ctx.boostyShort || ctx.siteShort,
    }),
    html: (v, ctx, size) => {
      const tier = (name, price, list, hot) =>
        name
          ? `<div class="box tier${hot ? ' hot' : ''}"><div class="tn">${inline(name)}</div><div class="tp">${inline(price)}</div>${lines(list).map((l) => `<div class="tl"><span class="ck">✓</span>${inline(l)}</div>`).join('')}</div>`
          : '';
      const title = esc(v.title).replace(/\*\*(.+?)\*\*/g, '<span class="grad">$1</span>');
      const body = `<div class="wrap"><span class="tag">${esc(ctx.appName)}</span><h1>${title}</h1><div class="grow tiers">${tier(v.t1, v.p1, v.l1)}${tier(v.t2, v.p2, v.l2, true)}</div>${foot(ctx, v.footer)}</div>`;
      return page({
        ...size,
        body,
        accent: ctx.accent,
        css: `.tiers{display:flex;flex-direction:column;gap:20px;margin-top:30px}.tier{padding:30px 34px}.hot{border-color:color-mix(in srgb,var(--accent-2) 55%,transparent);background:linear-gradient(160deg,color-mix(in srgb,var(--accent) 20%,transparent),rgba(24,24,27,.85))}.tn{font-size:36px;font-weight:800}.tp{font-size:30px;font-weight:700;color:color-mix(in srgb,var(--accent-2) 55%,white);margin:6px 0 16px}.tl{display:flex;gap:14px;font-size:26px;color:#d4d4d8;line-height:1.4;margin-top:8px}.ck{color:#34d399;font-weight:800}`,
      });
    },
  },
  {
    id: 'og',
    label: 'Превью ссылки',
    hint: 'Картинка под ссылкой в Telegram, Discord и соцсетях. Два размера: «Превью ссылки» — под сайт («В сайт» кладёт её в landing/og-image.png), «GitHub превью» — под Social preview репозитория (Settings → General → Social preview на GitHub, заливается там вручную — своего API на этот счёт у GitHub нет). Текст и картинка — общие, под GitHub стоит вписать другие: сайт и репозиторий видят разные люди в разных местах.',
    sizes: ['og', 'github'],
    fields: [
      { key: 'title', label: 'Слоган', kind: 'text' },
      { key: 'text', label: 'Подпись', kind: 'text' },
      { key: 'platforms', label: 'Платформы', kind: 'text' },
    ],
    defaults: (ctx, lang) => ({
      title: 'Write it. Branch it. Ship it together.',
      text: pick(T('Рабочая среда нарративного дизайнера: графы диалогов и квестов, персонажи, экспорт в движки', 'A workspace for narrative designers: dialogue and quest graphs, characters, export to game engines'), lang),
      platforms: 'Windows · Android · Free',
    }),
    html: (v, ctx, size) => {
      const body = `${OG_GRAPH}<div class="og"><div class="ol">${LOGO}<span class="on">${esc(ctx.appName)}</span></div><div class="ot">${inline(v.title)}</div><div class="os">${inline(v.text)}</div><div class="op">${esc(v.platforms)}</div></div>`;
      return page({
        ...size,
        body,
        accent: ctx.accent,
        css: `.g1{width:640px;height:640px;top:-260px;left:-200px}.g2{width:600px;height:600px;bottom:-320px;right:-160px}.og{position:relative;height:100%;display:flex;flex-direction:column;justify-content:center;padding:0 84px}.ol{display:flex;align-items:center;gap:22px}.ol .logo{width:92px;height:92px}.on{font-size:64px;font-weight:800;letter-spacing:-.02em}.ot{font-size:50px;font-weight:800;letter-spacing:-.02em;line-height:1.1;margin-top:34px;max-width:500px;background:linear-gradient(135deg,color-mix(in srgb,var(--accent) 55%,white),color-mix(in srgb,var(--accent-2) 45%,white));-webkit-background-clip:text;color:transparent}.os{font-size:27px;color:#a1a1aa;line-height:1.4;margin-top:18px;max-width:620px}.gr{position:absolute;right:40px;top:50%;transform:translateY(-50%);width:440px;height:400px}.op{margin-top:30px;font-size:22px;font-weight:600;color:color-mix(in srgb,var(--accent) 45%,white);letter-spacing:.04em}`,
      });
    },
  },
];

/** Мини-граф диалога для превью ссылки: старт → реплика → выбор из двух веток → концовки. */
const OG_GRAPH = (() => {
  const node = (x, y, w, color, label) =>
    `<g><rect x="${x}" y="${y}" width="${w}" height="58" rx="12" fill="#18181b" stroke="${color}" stroke-width="2.5"/><rect x="${x}" y="${y}" width="${w}" height="16" rx="8" fill="${color}" opacity=".9"/><rect x="${x + 14}" y="${y + 28}" width="${w - 50}" height="8" rx="4" fill="#52525b"/><rect x="${x + 14}" y="${y + 42}" width="${w - 80}" height="6" rx="3" fill="#3f3f46"/>${label ? `<text x="${x + 12}" y="${y + 12}" font-size="10" font-weight="700" fill="#fff" font-family="Inter,sans-serif">${label}</text>` : ''}</g>`;
  const edge = (x1, y1, x2, y2, color = '#6366f1') => `<path d="M${x1} ${y1} C ${x1 + 50} ${y1}, ${x2 - 50} ${y2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" opacity=".85"/>`;
  return `<svg class="gr" viewBox="0 0 440 400" aria-hidden="true">
    ${edge(120, 200, 150, 200, '#10b981')}${edge(270, 200, 300, 110)}${edge(270, 200, 300, 290)}
    ${node(10, 171, 110, '#10b981', 'START')}${node(150, 171, 120, '#6366f1', 'LINE')}${node(300, 81, 130, '#8b5cf6', 'CHOICE')}${node(300, 261, 130, '#f59e0b', 'CHOICE')}
    <circle cx="120" cy="200" r="6" fill="#10b981"/><circle cx="270" cy="200" r="6" fill="#8b5cf6"/>
  </svg>`;
})();

const templateById = (id) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];


/** HTML карточки: шаблон + значения полей (пустые — из значений по умолчанию) + размер + акцентный цвет. */
function cardHtml({ template, values = {}, sizeId, lang = 'ru', accent }, ctx) {
  const t = templateById(template);
  const size = SIZES[t.sizes.includes(sizeId) ? sizeId : t.sizes[0]];
  const base = t.defaults(ctx, lang);
  const merged = { ...base };
  for (const f of t.fields) if (values[f.key] !== undefined && values[f.key] !== null) merged[f.key] = String(values[f.key]);
  const ctxWithAccent = { ...ctx, accent: cleanAccent(accent) };
  return { html: t.html(merged, ctxWithAccent, size, lang), width: size.width, height: size.height };
}

/** Описание шаблонов для окна Studio (без функций). */
const templatesMeta = () =>
  TEMPLATES.map((t) => ({ id: t.id, label: t.label, hint: t.hint, fields: t.fields, sizes: t.sizes.map((id) => ({ id, label: SIZES[id].label })) }));

/**
 * Рисует HTML в PNG в невидимом окне Electron. Окно одно на процесс и переиспользуется; вызовы идут
 * по очереди, чтобы две карточки не рисовались в одном окне одновременно.
 */
let renderWindow = null;
let queue = Promise.resolve();
function renderPng({ html, width, height }, { maxWidth } = {}) {
  const job = queue.then(async () => {
    const { BrowserWindow } = require('electron');
    if (!renderWindow || renderWindow.isDestroyed()) {
      renderWindow = new BrowserWindow({
        width,
        height,
        show: false,
        frame: false,
        useContentSize: true,
        enableLargerThanScreen: true,
        webPreferences: { offscreen: true, sandbox: true, contextIsolation: true, nodeIntegration: false },
      });
      renderWindow.webContents.setWindowOpenHandler(() => ({ action: 'deny' }));
      renderWindow.webContents.on('will-navigate', (event) => event.preventDefault());
    }
    renderWindow.setContentSize(width, height);
    await renderWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(html)}`);
    // Шрифт Inter грузится с Google Fonts; без сети остаётся системный — карточка всё равно рисуется.
    await Promise.race([renderWindow.webContents.executeJavaScript('document.fonts.ready.then(() => true)'), new Promise((r) => setTimeout(r, 4000))]);
    await new Promise((r) => setTimeout(r, 120));
    let image = await renderWindow.webContents.capturePage({ x: 0, y: 0, width, height });
    if (maxWidth && image.getSize().width > maxWidth) image = image.resize({ width: maxWidth, quality: 'good' });
    return image;
  });
  queue = job.catch(() => undefined);
  return job;
}

function closeRenderer() {
  if (renderWindow && !renderWindow.isDestroyed()) renderWindow.destroy();
  renderWindow = null;
}

module.exports = { SIZES, TEMPLATES, templatesMeta, cardHtml, shortItem, inline, lines, renderPng, closeRenderer, DEFAULT_ACCENT };

return module.exports;
})();
