## Why

Все западные статические хостинги (`*.github.io`, `*.pages.dev`, `*.netlify.app`, `*.vercel.app`, `*.gitlab.io`) заблокированы провайдером автора — сайт курса недоступен без VPN. Surge.sh — единственный проверенно доступный бесплатный вариант (домен `*.surge.sh` открывается из сети автора).

## What Changes

- Сайт дополнительно публикуется на Surge по адресу `learn-roblox.surge.sh`
- Автодеплой через GitHub Actions: push в `main` → сборка с `SITE_BASE=/` → публикация через `npx surge` (секреты `SURGE_LOGIN`/`SURGE_TOKEN`)
- README дополняется адресом зеркала и предупреждением о раздельном прогрессе

Не меняется: GitHub Pages остаётся каноничным адресом; конфигурация base path уже готова (переменная `SITE_BASE` из change'а `add-cloudflare-mirror`).

## Capabilities

### New Capabilities

- `surge-mirror-deployment`: автоматическая публикация сайта на learn-roblox.surge.sh при push в main

### Modified Capabilities

_(нет)_

## Impact

- **CI**: новый workflow `.github/workflows/deploy-surge.yml`; требуются секреты репозитория SURGE_LOGIN и SURGE_TOKEN
- **Код сайта**: не меняется (SITE_BASE=/ уже поддержан)
- **README**: новый раздел про зеркало
