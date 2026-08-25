## ADDED Requirements

### Requirement: Project files SHALL not contain duplicate content
The project SHALL maintain two reference files maximum: one for Lua syntax, one for Roblox development.

#### Scenario: No overlapping sections between reference files
- **WHEN** a developer reads both reference files
- **THEN** each section appears in exactly one file with no duplication

### Requirement: Unique content from deleted files SHALL be preserved
Content from `robux-shpargalka.md` that is not present in other files SHALL be migrated to `roblox-shpargalka.md`.

#### Scenario: Minimal API section preserved
- **WHEN** the "Минимальный API" section from robux-shpargalka.md is reviewed
- **THEN** it exists in roblox-shpargalka.md after migration

#### Scenario: Starter skeleton preserved
- **WHEN** the "Стартовый скелет" section from robux-shpargalka.md is reviewed
- **THEN** it exists in roblox-shpargalka.md after migration

### Requirement: File errors SHALL be corrected
Known errors in reference files SHALL be fixed during reorganization.

#### Scenario: Typo in lua-shpargalka.md fixed
- **WHEN** line 135 of lua-shpargalka.md is reviewed
- **THEN** it contains "серьёзно" instead of "с较но"

#### Scenario: Touched behavior clarified
- **WHEN** the "Грабли" table in roblox-shpargalka.md is reviewed
- **THEN** the Touched entry correctly states that CanCollide is not required for Touched events

### Requirement: Learning plan SHALL cover RemoteEvent and multiplayer
The learning plan SHALL include a phase covering client-server communication via RemoteEvent.

#### Scenario: RemoteEvent phase exists
- **WHEN** roblox-learning-plan.md is reviewed
- **THEN** it contains a phase covering RemoteEvent, OnServerEvent, FireServer

### Requirement: Internal references SHALL remain valid
All internal markdown links in the project SHALL point to existing files.

#### Scenario: No broken links after reorganization
- **WHEN** all markdown files are reviewed for `[text](./path)` links
- **THEN** every linked file exists at the specified path
