# Translations / Переводы

Community translations of the Narrata interface. Narrata downloads the languages listed in `index.json`: a new language appears in the app settings without a new release.

## How to translate

1. Copy `_template.json` to a file named after your language code: `de.json`, `fr.json`, `pt-BR.json`.
2. Fill in `language` (the code), `name` (the name of the language in that language, e.g. `Deutsch`) and `authors` (your GitHub nickname).
3. Translate the values in `strings`. The keys are the original Russian texts: do not change them. `en.json` contains the English translation of every string for reference.
4. Keep placeholders such as `{name}` or `{n}` exactly as they are.
5. Plural forms are separated by `|` in the order `zero|one|two|few|many|other`, using only the forms your language has. English and German: `one|other`, Polish: `one|few|many|other`.
6. Strings you have not translated can stay empty: the app shows them in English.
7. Open a pull request. Once it is merged, the language becomes available to everyone.

## Как перевести

1. Скопируйте `_template.json` в файл с кодом своего языка: `de.json`, `fr.json`, `pt-BR.json`.
2. Заполните `language` (код), `name` (название языка на нём самом, например `Deutsch`) и `authors` (ваш ник на GitHub).
3. Переведите значения в `strings`. Ключи — исходные русские тексты, их не меняйте. В `en.json` есть английский перевод каждой строки для образца.
4. Метки вроде `{name}` и `{n}` оставляйте как есть.
5. Формы множественного числа разделяются `|` в порядке `zero|one|two|few|many|other` — только те, что есть в языке. Английский и немецкий: `one|other`, польский: `one|few|many|other`.
6. Непереведённые строки можно оставить пустыми — программа покажет их по-английски.
7. Откройте pull request. После одобрения язык станет доступен всем.
