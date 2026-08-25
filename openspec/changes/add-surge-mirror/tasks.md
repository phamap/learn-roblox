## 1. Workflow автодеплоя

- [x] 1.1 Написать `.github/workflows/deploy-surge.yml`: push в main → npm ci → build с `SITE_BASE=/` → `npx surge ./dist --domain learn-roblox.surge.sh` с секретами SURGE_LOGIN/SURGE_TOKEN
- [x] 1.2 Обновить README: оба адреса сайта, инструкция по получению SURGE_TOKEN, пометка про раздельный прогресс

## 2. Настройка аккаунта Surge (вручную)

- [x] 2.1 Зарегистрироваться в Surge: локально `npx surge login` (email + пароль)
- [x] 2.2 Получить токен: `npx surge --token` — скопировать значение
- [x] 2.3 Добавить секреты в репозиторий GitHub: Settings → Secrets and variables → Actions → New repository secret: `SURGE_LOGIN` (email) и `SURGE_TOKEN` (токен)

## 3. Запуск и проверка

- [x] 3.1 Закоммитить и запушить изменения; убедиться, что workflow deploy-surge прошёл зелёным
- [x] 3.2 Открыть https://learn-roblox.surge.sh/ из своей сети без VPN: главная, фаза, шпаргалка, чекбоксы
- [x] 3.3 Убедиться, что GitHub Pages не пострадал (деплой зелёный, сайт работает)
