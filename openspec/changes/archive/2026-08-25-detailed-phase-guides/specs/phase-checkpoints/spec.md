## ADDED Requirements

### Requirement: SpawnLocation checkpoints
Файл SHALL объяснить использование SpawnLocation с Neutral = true для чекпоинтов.

#### Scenario: Player respawns at last checkpoint
- **WHEN** игрок умирает после прохождения чекпоинта
- **THEN** он respawn'ится на последнем пройденном чекпоинте, а не на старте

### Requirement: Checkpoint tracking
Фаза SHALL показать серверный скрипт отслеживания прогресса через таблицу.

#### Scenario: Progress saved in session
- **WHEN** игрок проходит 3 чекпоинта и умирает
- **THEN** сервер знает что последний чекпоинт — третий

### Requirement: Visual checkpoint markers
Фаза SHALL показать как сделать визуальный маркер чекпоинта (свечение/цвет).

#### Scenario: Checkpoint is visually distinct
- **WHEN** игрок видит чекпоинт
- **THEN** он визуально отличается от обычных платформ
