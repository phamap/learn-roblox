## ADDED Requirements

### Requirement: Phase file structure
Файл `phases/phase-1-studio.md` SHALL содержать все 7 блоков: цель, результат, шаги, мини-проект, ошибки, чеклист, ссылки.

#### Scenario: Complete phase file
- **WHEN** пользователь открывает `phases/phase-1-studio.md`
- **THEN** файл содержит цель фазы, что сможешь после, пошаговые инструкции с кодом, мини-проект, таблицу ошибок, чеклист, ссылки

### Requirement: Step-by-step instructions
Каждый шаг SHALL содержать конкретные действия (куда кликнуть, что написать) и полный код для копирования.

#### Scenario: Executable code snippets
- **WHEN** пользователь копирует код из шага
- **THEN** код выполняется без дополнительных правок (кроме указанных)

#### Scenario: Click-by-click Studio instructions
- **WHEN** шаг требует действий в Studio
- **THEN** инструкция указывает точные пункты меню/панели (например: "View → Command Bar")

### Requirement: Touched event basics
Фаза SHALL научить подписываться на событие Touched и реагировать на касание игрока.

#### Scenario: Part changes color on touch
- **WHEN** игрок касается Part'а со скриптом
- **THEN** Part меняет цвет

### Requirement: Troubleshooting table
Фаза SHALL содержать таблицу минимум из 5 типичных ошибок с причинами и решениями.

#### Scenario: Error table present
- **WHEN** пользователь encountривает ошибку
- **THEN** он находит её в таблице и видит решение

### Requirement: Checklist
Фаза SHALL завершаться чеклистом навыков, которые пользователь получил.

#### Scenario: Self-assessment
- **WHEN** пользователь завершает фазу
- **THEN** он может отметить в чеклисте что именно освоил
