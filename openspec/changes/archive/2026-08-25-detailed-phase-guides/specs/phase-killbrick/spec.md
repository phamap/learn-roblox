## ADDED Requirements

### Requirement: Kill brick implementation
Файл SHALL содержать пошаговую инструкцию создания Kill Brick с использованием Touched и Humanoid.Health.

#### Scenario: Player dies on touch
- **WHEN** игрок касается Kill Brick
- **THEN** его здоровье падает до 0 и он умирает

### Requirement: Debounce pattern
Фаза SHALL объяснить и реализовать debounce (флаг предотвращающий повторное срабатывание).

#### Scenario: No double damage
- **WHEN** игрок стоит на Kill Brick
- **THEN** урон наносится только один раз

### Requirement: Multiple kill bricks
Фаза SHALL показать как создать несколько Kill Brick с разными свойствами.

#### Scenario: Variety of obstacles
- **WHEN** пользователь создаёт 3-5 Kill Brick
- **THEN** каждый работает независимо
