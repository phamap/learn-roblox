## ADDED Requirements

### Requirement: Публикация зеркала на Cloudflare Pages
Сайт SHALL автоматически собираться и публиковаться на Cloudflare Pages при push в основную ветку репозитория, параллельно с существующим деплоем на GitHub Pages.

#### Scenario: Деплой при пуше контента
- **WHEN** автор пушит правку md-файла в `main`
- **THEN** Cloudflare собирает сайт из исходников и публикует обновлённую версию на `*.pages.dev` без ручных действий

#### Scenario: Обе площадки доступны после релиза
- **WHEN** деплой успешно завершён
- **THEN** сайт доступен и на GitHub Pages (`/learn-roblox/`), и на Cloudflare Pages (от корня `*.pages.dev`)

### Requirement: Настраиваемый base path
Base path сайта SHALL задаваться переменной окружения `SITE_BASE`. При отсутствии переменной base MUST равняться `/learn-roblox` (совместимость с GitHub Pages).

#### Scenario: GitHub Pages без изменений
- **WHEN** GitHub Actions собирает сайт без переменной `SITE_BASE`
- **THEN** все ссылки и ресурсы используют префикс `/learn-roblox/`

#### Scenario: Cloudflare от корня
- **WHEN** Cloudflare собирает сайт с `SITE_BASE=/`
- **THEN** главная страница открывается по корневому адресу проекта на `*.pages.dev`, а внутренние ссылки работают без префикса `/learn-roblox`

### Requirement: Документация адресов
README SHALL содержать оба публичных адреса сайта и предупреждение, что прогресс чекбоксов хранится отдельно для каждого адреса (привязан к домену браузера).

#### Scenario: Пользователь находит зеркало
- **WHEN** пользователь читает README или страницу сайта
- **THEN** ему известны оба адреса курса
