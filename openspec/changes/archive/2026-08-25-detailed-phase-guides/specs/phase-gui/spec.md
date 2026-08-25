## ADDED Requirements

### Requirement: ScreenGui creation
Файл SHALL показать создание ScreenGui с TextLabel для отображения информации.

#### Scenario: HUD displays death count
- **WHEN** игрок смотрит на экран
- **THEN** он видит счётчик смертей, обновляющийся в реальном времени

### Requirement: LocalScript for UI
Фаза SHALL объяснить почему UI обновляется в LocalScript, а не в Script.

#### Scenario: UI updates on client
- **WHEN** данные меняются на сервере
- **THEN** UI обновляется через LocalScript

### Requirement: Death screen overlay
Фаза SHALL показать создание экрана смерти с кнопкой.

#### Scenario: Death screen appears
- **WHEN** игрок умирает
- **THEN** появляется overlay с кнопкой "Возродиться"
