# Roblox Obby — интерактивный курс

Учебный курс по разработке игры-обби в Roblox Studio. Контент написан в markdown, сайт собирается [Astro](https://astro.build) и публикуется на GitHub Pages.

**Сайт:**
- https://learn-roblox.surge.sh/ — зеркало, доступное из РФ без VPN
- https://phamap.github.io/learn-roblox/ — канонический адрес (GitHub Pages)

Возможности: рендеринг гайдов с подсветкой Luau, навигация по фазам, интерактивные чекбоксы шагов с сохранением прогресса в браузере (localStorage).

> Прогресс привязан к домену: отметки на surge.sh и на github.io хранятся отдельно.

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

Push в `main` запускает два независимых workflow:

| Workflow | Куда | Адрес |
|---|---|---|
| `deploy.yml` | GitHub Pages (Actions) | `phamap.github.io/learn-roblox/` |
| `deploy-surge.yml` | Surge | `learn-roblox.surge.sh` |

Base path задаётся переменной окружения `SITE_BASE`: на Pages — `/learn-roblox` (умолчание), на Surge — `/`.

### Секреты деплоя на Surge

Один раз: зарегистрироваться (`npx surge login`), получить токен (`npx surge --token`), затем в GitHub → Settings → Secrets and variables → Actions добавить `SURGE_LOGIN` и `SURGE_TOKEN`.
