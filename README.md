# Roblox Obby — интерактивный курс

Учебный курс по разработке игры-обби в Roblox Studio. Контент написан в markdown, сайт собирается [Astro](https://astro.build) и публикуется на GitHub Pages.

**Сайт:** https://phamap.github.io/learn-roblox/

Возможности: рендеринг гайдов с подсветкой Luau, навигация по фазам, интерактивные чекбоксы шагов с сохранением прогресса в браузере (localStorage).

## Структура

```
├── src/
│   ├── content/               # Контент курса (источник правды)
│   │   ├── plan/                  # План обучения
│   │   ├── phases/                # Гайды по фазам
│   │   └── cheatsheets/           # Шпаргалки (Luau, Roblox API)
│   ├── layouts/               # BaseLayout (каркас сайта), PhaseLayout (страница фазы)
│   ├── lib/
│   │   ├── course.ts          # Сортировка фаз, заголовки, подсчёт шагов
│   │   └── progress.ts        # Прогресс: localStorage read/toggle/subscribe
│   └── pages/                 # Главная, /phases/[slug], /cheatsheets/[slug]
├── astro.config.mjs           # site/base под GitHub Pages, Shiki
└── .github/workflows/deploy.yml  # push в main → сборка → деплой на Pages
```

## Разработка

Требуется Node.js (LTS).

```bash
npm install     # один раз
npm run dev     # дев-сервер на http://localhost:4321, hot-reload контента
```

Пишешь/правишь md в `src/content/` → изменения сразу видны на localhost. Коммитишь и пушишь — CI соберёт и выложит сайт автоматически.

Локальная проверка прод-сборки: `npm run build && npm run preview`.

## Как редактировать контент

- Гайды и шпаргалки — обычный markdown (GFM), frontmatter не требуется
- Чекбоксы `- [ ]` автоматически становятся интерактивными шагами прогресса; ID генерируются как `<имя-файла>:step-<N>` по порядку в файле
- Вставка нового чекбокса в середину файла сместит нумерацию последующих шагов этой фазы (прогресс после точки вставки сбросится)
- Порядок фаз определяется номером в имени файла (`phase-1-studio.md` < `phase-2-killbrick.md`, дробные номера поддерживаются)

## Деплой

Push в `main` запускает GitHub Actions: установка зависимостей, `astro build`, публикация в GitHub Pages. Артефакты сборки (`dist/`) не коммитятся.
