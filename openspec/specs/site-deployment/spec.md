# site-deployment Specification

## Purpose
TBD - created by archiving change add-interactive-course-site. Update Purpose after archive.
## Requirements
### Requirement: Автоматический деплой при push
При push в основную ветку репозитория GitHub Actions SHALL выполнять сборку сайта и публиковать его на GitHub Pages.

#### Scenario: Публикация изменений контента
- **WHEN** автор коммитит правку md-файла и делает push
- **THEN** CI собирает сайт и публикует обновлённую версию без локального билда и ручных действий

### Requirement: Артефакты сборки не коммитятся
Каталог сборки (`dist/`) и зависимости (`node_modules/`) MUST быть исключены из git через `.gitignore`.

#### Scenario: Чистый репозиторий
- **WHEN** выполняется деплой-пайплайн
- **THEN** сборка происходит из исходников, и в истории git отсутствуют сгенерированные файлы

