# Translations / Переводы

Community translations of the Narrata interface. Each language is one file in this folder. Narrata reads the list of languages from `index.json`, so a new language appears in the app settings without a new release.

## How to translate on github.com

No tools are needed, only a GitHub account.

1. Open `_template.json` and click **Copy raw file** (the copy icon above the file).
2. Go back to this folder and click **Add file → Create new file**. Name the file with your language code: `de.json`, `fr.json`, `es.json`, `pt-BR.json`.
3. Paste the template and fill in the header:
   - `language`: the code, the same as the file name;
   - `name`: the name of the language in that language, e.g. `Deutsch`;
   - `authors`: your GitHub nickname, e.g. `["nick"]`.
4. Translate. In `strings` the **left side is the English text: do not change it**. Write your translation on the right side, between the quotes.
5. Click **Commit changes → Propose changes → Create pull request**. The maintainer reviews it, and once it is merged the language becomes available to everyone.

You can translate only part of the strings and send it: empty values are shown in English. To improve an existing language, edit its file the same way (the pencil icon).

## Rules

- Keep placeholders in curly braces exactly as they are: `{name}`, `{n}`, `{app}`.
- Plural forms are separated by `|`. Write the forms your language has in the order `zero|one|two|few|many|other`. English and German: `one|other`, Polish: `one|few|many|other`.
- Keep the file valid JSON: a quote inside a translation is written as `\"`.
- Keep translations about as long as the English text: buttons and menus have limited space.

## Example

```json
{
  "language": "de",
  "name": "Deutsch",
  "authors": ["nick"],
  "strings": {
    "Save": "Speichern",
    "Hello, {name}": "Hallo, {name}",
    "{n} file|{n} files": "{n} Datei|{n} Dateien"
  }
}
```

## Как перевести

Нужен только аккаунт на GitHub.

1. Откройте `_template.json` и нажмите **Copy raw file** (значок копирования над файлом).
2. Вернитесь в эту папку, нажмите **Add file → Create new file** и назовите файл кодом языка: `de.json`, `fr.json`, `pt-BR.json`.
3. Вставьте шаблон и заполните шапку: `language` — код, как в имени файла; `name` — название языка на нём самом; `authors` — ваш ник на GitHub.
4. Переведите: в `strings` **слева английский текст — его не меняйте**, перевод пишите справа, в кавычках.
5. Нажмите **Commit changes → Propose changes → Create pull request**. После проверки и слияния язык станет доступен всем.

Можно прислать и частичный перевод: пустые строки программа покажет по-английски. Метки вроде `{name}` и `{n}` оставляйте как есть; формы множественного числа разделяются `|` в порядке `zero|one|two|few|many|other`.
