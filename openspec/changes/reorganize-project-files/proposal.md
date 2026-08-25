## Why

Проект содержит три шпаргалки сsignificant overlapping content (~60% дублирования между robux-shpargalka.md и roblox-shpargalka.md). Это затрудняет навигацию и поддержку. План обучения не покрывает критические темы (RemoteEvent, multiplayer, оптимизация).

## What Changes

- **BREAKING**: Удалить `robux-shpargalka.md` — его контент дублирует lua- и roblox- шпаргалки
- Расширить `roblox-shpargalka.md` секциями из удаляемого файла (минимальный API, стартовый скелет)
- Исправить ошибки: опечатка в lua-shpargalka.md ("с较но"), неточный совет про Touched
- Добавить в `roblox-learning-plan.md` новые фазы: RemoteEvent/клиент-сервер, оптимизация, CI/CD
- Обновить навигацию в плане (ссылки на оставшиеся файлы)

## Capabilities

### New Capabilities

- `file-structure`: Реорганизация файловой структуры проекта — удаление дубликатов, исправление ошибок

### Modified Capabilities

(нет существующих спецификаций)

## Impact

- Удаляемый файл: `robux-shpargalka.md`
- Изменяемые файлы: `roblox-shpargalka.md`, `roblox-learning-plan.md`, `lua-shpargalka.md`
- Затронутые ссылки: все внутренние ссылки в плане обучения
- Новые файлы: изменения в `openspec/specs/file-structure/spec.md`
