## ADDED Requirements

### Requirement: RemoteEvent communication
Файл SHALL показать передачу данных от клиента к серверу через RemoteEvent.

#### Scenario: Client sends data to server
- **WHEN** LocalScript вызывает FireServer()
- **THEN** сервер получает данные через OnServerEvent

### Requirement: Bidirectional understanding
Фаза SHALL объяснить разницу между серверными и клиентскими скриптами.

#### Scenario: Security model
- **WHEN** пользователь пишет код
- **THEN** он понимает что серверный скрипт нельзя подделать, а клиентский — можно
