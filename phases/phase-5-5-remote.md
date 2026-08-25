# Фаза 5.5: RemoteEvent — клиент-сервер

**Цель:** научиться передавать данные между клиентом и сервером.
**Итог:** понимание модели безопасности, отправка данных от клиента к серверу, обработка на сервере.
**Время:** 2-3 часа (1-2 недели).
**Предыдущая фаза:** [Фаза 5: GUI — интерфейс](./phase-5-gui.md)

---

## Что ты сможешь после этой фазы

- Понимать разницу между серверными и клиентскими скриптами
- Создавать RemoteEvent для связи клиент ↔ сервер
- Отправлять данные от клиента к серверу
- Понимать модель безопасности Roblox

---

## Шаг 1: Почему RemoteEvent нужен

### Проблема

- **Script** (сервер) не может напрямую управлять GUI
- **LocalScript** (клиент) не может менять серверные данные (здоровье, деньги, чекпоинты)

### Решение

RemoteEvent — это "телефон" между клиентом и сервером. Клиент отправляет сообщение → сервер обрабатывает.

```
┌─────────────┐     FireServer()     ┌─────────────┐
│  LocalScript │ ──────────────────►  │    Script    │
│  (клиент)    │                      │  (сервер)    │
│              │ ◄──────────────────  │              │
└─────────────┘   FireClient()       └─────────────┘
```

---

## Шаг 2: Создание RemoteEvent

### 2.1 Создай RemoteEvent

1. В Explorer найди **ReplicatedStorage**
2. Кликни правой кнопкой → Insert Object → **RemoteEvent**
3. Назови его `DeathCountEvent`

> **ReplicatedStorage** — хранилище, доступное и клиенту, и серверу. Идеально для RemoteEvent.

### 2.2 Серверный скрипт (обработчик)

Создай **Script** в **ServerScriptService**:

```lua
-- Сервер: обрабатывает запросы от клиента
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

-- Находим RemoteEvent
local deathCountEvent = ReplicatedStorage:WaitForChild("DeathCountEvent")

-- Обработчик: клиент просит увеличить счётчик
deathCountEvent.OnServerEvent:Connect(function(player, action)
    -- player — кто отправил
    -- action — что хочет сделать ("increment", "reset")

    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local deaths = leaderstats:FindFirstChild("Deaths")
    if not deaths then return end

    if action == "increment" then
        deaths.Value = deaths.Value + 1
        print(player.Name .. " запросил +1 смерть. Итого: " .. deaths.Value)

    elseif action == "reset" then
        deaths.Value = 0
        print(player.Name .. " сбросил счётчик")
    end
end)
```

### 2.3 Клиентский скрипт (отправитель)

Создай **LocalScript** в **StarterGui** (или StarterPlayerScripts):

```lua
-- Клиент: отправляет запросы на сервер
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- Находим RemoteEvent
local deathCountEvent = ReplicatedStorage:WaitForChild("DeathCountEvent")

-- Отправляем запрос "увеличить смерть"
deathCountEvent:FireServer("increment")
print("Запрос отправлен на сервер!")

-- Позже можно сбросить
task.wait(5)
deathCountEvent:FireServer("reset")
print("Запрос на сброс отправлен!")
```

### 2.4 Запусти Play

Посмотри Output на сервере. Увидишь сообщения о том что сервер получил запросы.

---

## Шаг 3: Передача данных

### 3.1 Отправка чисел

```lua
-- Клиент
deathCountEvent:FireServer(42)

-- Сервер
deathCountEvent.OnServerEvent:Connect(function(player, data)
    print(player.Name .. " отправил: " .. data)  -- 42
end)
```

### 3.2 Отправка строк

```lua
-- Клиент
deathCountEvent:FireServer("hello")

-- Сервер
deathCountEvent.OnServerEvent:Connect(function(player, message)
    print(player.Name .. ": " .. message)  -- hello
end)
```

### 3.3 Отправка таблиц

```lua
-- Клиент
deathCountEvent:FireServer({x = 10, y = 20, z = 30})

-- Сервер
deathCountEvent.OnServerEvent:Connect(function(player, position)
    print(player.Name .. " на позиции: " .. position.x .. ", " .. position.y)
end)
```

### 3.4 Отправка нескольких аргументов

```lua
-- Клиент
deathCountEvent:FireServer("damage", 25, "fire")

-- Сервер
deathCountEvent.OnServerEvent:Connect(function(player, type, amount, element)
    print(player.Name .. " нанёс " .. amount .. " урона (" .. type .. ")")
end)
```

> **Задание со звёздочкой*:** сделай простой чат — добавь в GUI **TextBox**, а по нажатию клавиши Enter отправляй его текст: `deathCountEvent:FireServer(textBox.Text)`. Сервер получает сообщение и выводит его через `print`. Вывод всем игрокам на экран изучим позже.

---

## Шаг 4: Модель безопасности

### Серверные скрипты (Script)

- Выполняются на сервере
- Могут менять **всё**: здоровье, деньги, чекпоинты
- Игрок **не может** подделать серверный код
- **Доверяй серверу**

### Клиентские скрипты (LocalScript)

- Выполняются у игрока
- Меняют только **свой интерфейс** (GUI)
- Могут **отправлять запросы** серверу через RemoteEvent
- Игрок **может** подделать клиентский код (читерство)
- **Не доверяй клиенту**

### Правило

```
Клиент говорит: "Я хочу сделать X"
Сервер проверяет: "Может ли этот игрок сделать X?"
Сервер делает: X (или отклоняет)
```

### Пример: защита от читеров

```lua
-- ПЛОХО: клиент отправляет "убей игрока"
-- Сервер слепо выполняет
deathCountEvent.OnServerEvent:Connect(function(player, action)
    if action == "kill" then
        player.Character.Humanoid.Health = 0  -- ЛОХ! Читер может убить любого
    end
end)

-- ХОРОШО: клиент говорит "я хочу нанести урон"
-- Сервер проверяет расстояние и лимиты
deathCountEvent.OnServerEvent:Connect(function(player, action, amount)
    if action == "damage" then
        -- Проверяем: игрок рядом с целью?
        -- Проверяем: урон не больше максимума?
        -- Проверяем: кулдаун прошёл?
        if amount <= 25 then  -- лимит урона
            -- Наносим урон
        end
    end
end)
```

---

## Шаг 5: Практический пример — кнопка «Возродиться»

Помнишь кнопку **RespawnButton** из Фазы 5? Она умела только скрывать экран смерти. Теперь подключим её к серверу: клиент отправит запрос через RemoteEvent, а сервер возродит игрока командой `LoadCharacter()`.

### 5.1 RemoteEvent

Создай `RespawnEvent` в ReplicatedStorage.

### 5.2 Серверный обработчик

```lua
-- Сервер: возрождает игрока по запросу
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local respawnEvent = ReplicatedStorage:WaitForChild("RespawnEvent")

respawnEvent.OnServerEvent:Connect(function(player)
    -- LoadCharacter() удаляет текущего персонажа и создаёт нового.
    -- Новый персонаж появится на player.RespawnLocation — то есть на
    -- последнем чекпоинте из CheckpointManager (Фаза 4)
    player:LoadCharacter()
    print(player.Name .. " возродился по кнопке")
end)
```

> **Почему это безопасно:** сервер сам вызывает `LoadCharacter` для того игрока, который прислал запрос. Клиент не может возродить кого-то другого.

### 5.3 Подключаем кнопку из Фазы 5

Открой **HUDUpdater** (LocalScript в GameHUD из Фазы 5) и замени обработчик кнопки:

```lua
-- Было (Фаза 5): кнопка только скрывала экран
-- respawnButton.MouseButton1Click:Connect(function()
--     hideDeathScreen()
-- end)

-- Стало: кнопка просит сервер возродить игрока
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local respawnEvent = ReplicatedStorage:WaitForChild("RespawnEvent")

respawnButton.MouseButton1Click:Connect(function()
    respawnEvent:FireServer()
end)
```

Экран скрывать вручную больше не нужно: после `LoadCharacter` у игрока появится новый персонаж, сработает `CharacterAdded`, и `hideDeathScreen()` вызовется сам (см. `onCharacterAdded` из Фазы 5).

### 5.4 Запусти и проверь

Умри → нажми «Возродиться» → игрок появляется на последнем чекпоинте. Кнопка из Фазы 5 наконец работает по-настоящему.

> **Задание со звёздочкой*:** добавь кулдаун — не давай игроку спамить FireServer чаще раза в секунду (на сервере сравнивай `os.clock()` с временем прошлого запроса).

---

## Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| "RemoteEvent is not a valid member" | RemoteEvent не найден | Проверь имя иlocation (ReplicatedStorage) |
| Сервер не получает данные | OnServerEvent не подключен | Проверь что Script в ServerScriptService |
| Клиент не может отправить | FireServer не вызывается | Проверь что LocalScript в StarterGui или StarterPlayerScripts |
| "attempt to index nil" | Объект не найден | Используй `WaitForChild()` вместо `FindFirstChild()` |
| Данные приходят undefined | Порядок аргументов другой | Проверь порядок: сервер получает (player, ...args) |
| Читер изменил здоровье | Сервер доверяет клиенту | Всё важное делай на сервере, проверяй данные |

---

## Итог: что ты теперь умеешь

- [ ] Создавать RemoteEvent в ReplicatedStorage
- [ ] Подключать OnServerEvent на сервере
- [ ] Вызывать FireServer на клиенте
- [ ] Передавать числа, строки, таблицы
- [ ] Понимать модель безопасности (клиент → запрос, сервер → действие)
- [ ] Делать серверные проверки перед действием
- [ ] Отличать Script от LocalScript и их роли

---

## Следующий шаг

Готов к следующей фазе? → **[Фаза 6: DataStore — сохранение данных](./phase-6-datastore.md)**

Там ты научишься сохранять данные игроков между сессиями.

---

## Ссылки для углубления

| Тема | Ссылка |
|------|--------|
| RemoteEvent | https://create.roblox.com/docs/reference/engine/classes/RemoteEvent |
| FireServer | https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#FireServer |
| OnServerEvent | https://create.roblox.com/docs/reference/engine/classes/RemoteEvent#OnServerEvent |
| Модель безопасности | https://create.roblox.com/docs/scripting/security |
| ReplicatedStorage | https://create.roblox.com/docs/reference/engine/services/ReplicatedStorage |
| DevForum: Remote events | https://devforum.roblox.com/t/remote-events-tutorial/156982 |

---

*Фаза 5.5 из [плана обучения](../roblox-learning-plan.md). Предыдущая: [Фаза 5](./phase-5-gui.md) | Следующая: [Фаза 6](./phase-6-datastore.md)*
