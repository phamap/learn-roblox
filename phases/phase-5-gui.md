# Фаза 5: GUI — интерфейс

**Цель:** научиться создавать интерфейс: счётчики, HUD, экраны.
**Итог:** счётчик смертей, HUD с здоровьем, экран смерти с кнопкой.
**Время:** 4-5 часов (2-3 недели по 1-2 часа).
**Предыдущая фаза:** [Фаза 4: Чекпоинты и респавн](./phase-4-checkpoints.md)

---

## Что ты сможешь после этой фазы

- Создавать ScreenGui с TextLabel
- Обновлять интерфейс через LocalScript
- Делать HUD (Health, счётчики)
- Создавать экраны смерти с кнопками

---

## Шаг 1: Почему GUI отдельная тема

В Roblox интерфейс (GUI) рендерится на **клиенте** (у игрока), а не на сервере. Поэтому:
- **Script** (серверный) — управляет логикой (здоровье, чекпоинты)
- **LocalScript** (клиентский) — управляет интерфейсом (отображает данные)

> **Важно:** LocalScript не может изменить серверные данные. Он только отображает то, что сервер разрешил.

---

## Шаг 2: Первый TextLabel

### 2.1 Создай ScreenGui

1. В Explorer найди **StarterGui**
2. Кликни правой кнопкой → Insert Object → **ScreenGui**
3. Назови его `GameHUD`

### 2.2 Добавь TextLabel

1. Кликни правой кнопкой по **GameHUD**
2. Insert Object → **TextLabel**
3. Настрой в Properties:

| Свойство | Значение |
|----------|----------|
| **Name** | `DeathLabel` |
| **Text** | `Смертей: 0` |
| **Size** | `{0, 200}, {0, 50}` |
| **Position** | `{0, 10}, {0, 10}` |
| **BackgroundColor3** | Чёрный |
| **TextColor3** | Белый |
| **TextSize** | 24 |
| **Font** | GothamBold |

> **Size** и **Position** в GUI используют **UDim2**: `{Scale, Offset}, {Scale, Offset}`.
> - Scale = доля экрана (0.5 = половина)
> - Offset = пиксели

---

## Шаг 3: Обновление GUI через LocalScript

### 3.1 Создай LocalScript

1. Кликни правой кнопкой по **GameHUD**
2. Insert Object → **LocalScript**
3. Назови его `HUDUpdater`
4. Напиши:

```lua
-- HUDUpdater: обновляет счётчик смертей
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local leaderstats = player:WaitForChild("leaderstats")
local deaths = leaderstats:WaitForChild("Deaths")

local deathLabel = script.Parent:WaitForChild("DeathLabel")

-- Обновляем текст когда меняется значение
deaths.Changed:Connect(function(newValue)
    deathLabel.Text = "Смертей: " .. newValue
end)

-- Начальное значение
deathLabel.Text = "Смертей: " .. deaths.Value
```

### 3.2 Создай leaderstats (серверный скрипт)

Чтобы GUI работало, нужно чтобы сервер хранил данные. Создай **Script** в **ServerScriptService**:

```lua
-- Leaderstats: создаёт статистику для каждого игрока
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    -- Создаём папку leaderstats
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    -- Счётчик смертей
    local deaths = Instance.new("IntValue")
    deaths.Name = "Deaths"
    deaths.Value = 0
    deaths.Parent = leaderstats

    print(player.Name .. " зашёл. Deaths: 0")
end)
```

> **leaderstats** — особая папка. Roblox автоматически показывает её значения в таблице игроков (Tab). LocalScript может читать эти данные.

### 3.3 Увеличивай смерти

Добавь в **CheckpointManager** (или создай отдельный скрипт):

```lua
-- Увеличиваем смерть при respawn
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")

        humanoid.Died:Connect(function()
            -- Увеличиваем счётчик
            local deaths = player:FindFirstChild("leaderstats")
            if deaths then
                local deathValue = deaths:FindFirstChild("Deaths")
                if deathValue then
                    deathValue.Value = deathValue.Value + 1
                    print(player.Name .. " умер. Deaths: " .. deathValue.Value)
                end
            end
        end)
    end)
end)
```

### 3.4 Запусти Play

Нажми Tab — увидишь таблицу с именами и смертями. Умри — счётчик увеличится. GUI обновится автоматически.

---

## Шаг 4: Health Bar (полоска здоровья)

### 4.1 Добавь TextLabel для здоровья

1. В **GameHUD** создай новый TextLabel
2. Настрой:

| Свойство | Значение |
|----------|----------|
| **Name** | `HealthLabel` |
| **Text** | `HP: 100` |
| **Size** | `{0, 200}, {0, 50}` |
| **Position** | `{0, 10}, {0, 70}` |
| **BackgroundColor3** | Тёмно-серый |
| **TextColor3** | Зелёный |
| **TextSize** | 24 |

### 4.2 Обновляй здоровье

Добавь в **HUDUpdater** (LocalScript):

```lua
-- Обновляем здоровье
local function updateHealth()
    local character = player.Character
    if character then
        local humanoid = character:FindFirstChild("Humanoid")
        if humanoid then
            local hp = math.floor(humanoid.Health)
            healthLabel.Text = "HP: " .. hp

            -- Меняем цвет в зависимости от здоровья
            if hp > 60 then
                healthLabel.TextColor3 = Color3.fromRGB(0, 255, 0)  -- зелёный
            elseif hp > 30 then
                healthLabel.TextColor3 = Color3.fromRGB(255, 255, 0)  -- жёлтый
            else
                healthLabel.TextColor3 = Color3.fromRGB(255, 0, 0)  -- красный
            end
        end
    end
end

-- Обновляем каждые 0.1 секунды
while true do
    updateHealth()
    task.wait(0.1)
end
```

---

## Шаг 5: Экран смерти

### 5.1 Создай экран

1. В **GameHUD** создай **Frame**
2. Настрой:

| Свойство | Значение |
|----------|----------|
| **Name** | `DeathScreen` |
| **Size** | `{1, 0}, {1, 0}` (весь экран) |
| **Position** | `{0, 0}, {0, 0}` |
| **BackgroundColor3** | Чёрный |
| **BackgroundTransparency** | 0.3 (полупрозрачный) |
| **Visible** | ❌ (скрыт по умолчанию) |

### 5.2 Добавь текст

Внутри **DeathScreen** создай **TextLabel**:

| Свойство | Значение |
|----------|----------|
| **Name** | `DeathText` |
| **Text** | `Вы умерли!` |
| **Size** | `{0, 400}, {0, 80}` |
| **Position** | `{0.5, -200}, {0.3, 0}` |
| **BackgroundTransparency** | 1 |
| **TextColor3** | Красный |
| **TextSize** | 48 |

### 5.3 Добавь кнопку

Внутри **DeathScreen** создай **TextButton**:

| Свойство | Значение |
|----------|----------|
| **Name** | `RespawnButton` |
| **Text** | `Возродиться` |
| **Size** | `{0, 200}, {0, 60}` |
| **Position** | `{0.5, -100}, {0.5, 0}` |
| **BackgroundColor3** | Зелёный |
| **TextColor3** | Белый |
| **TextSize** | 24 |

### 5.4 Логика появления

Добавь в **HUDUpdater** (LocalScript):

```lua
local deathScreen = script.Parent:WaitForChild("DeathScreen")
local respawnButton = deathScreen:WaitForChild("RespawnButton")

-- Показываем экран смерти
local function showDeathScreen()
    deathScreen.Visible = true
end

-- Скрываем экран смерти
local function hideDeathScreen()
    deathScreen.Visible = false
end

-- Обновляем здоровье
local function updateHealth()
    local character = player.Character
    if character then
        local humanoid = character:FindFirstChild("Humanoid")
        if humanoid then
            local hp = math.floor(humanoid.Health)
            healthLabel.Text = "HP: " .. hp

            if hp > 60 then
                healthLabel.TextColor3 = Color3.fromRGB(0, 255, 0)
            elseif hp > 30 then
                healthLabel.TextColor3 = Color3.fromRGB(255, 255, 0)
            else
                healthLabel.TextColor3 = Color3.fromRGB(255, 0, 0)
            end
        end
    end
end

-- Показываем экран когда игрок умирает
local function onCharacterAdded(character)
    hideDeathScreen()

    local humanoid = character:WaitForChild("Humanoid")
    humanoid.Died:Connect(showDeathScreen)

    -- Обновляем здоровье
    while character.Parent do
        updateHealth()
        task.wait(0.1)
    end
end

-- Настраиваем при первом появлении
if player.Character then
    onCharacterAdded(player.Character)
end
player.CharacterAdded:Connect(onCharacterAdded)

-- Кнопка "Возродиться"
respawnButton.MouseButton1Click:Connect(function()
    -- Сервер должен вызвать LoadCharacter
    -- На клиенте мы просто скрываем экран
    hideDeathScreen()
end)
```

> **MouseButton1Click** — событие клика по кнопке. LocalScript может реагировать на клики.

---

## Шаг 6: Полный HUD

### Структура

```
StarterGui
└── GameHUD (ScreenGui)
    ├── DeathLabel (TextLabel) — счётчик смертей
    ├── HealthLabel (TextLabel) — полоска здоровья
    └── DeathScreen (Frame)
        ├── DeathText (TextLabel) — "Вы умерли!"
        └── RespawnButton (TextButton) — "Возродиться"
```

### Финальный LocalScript

```lua
-- HUDUpdater: полный интерфейс
local Players = game:GetService("Players")
local player = Players.LocalPlayer

-- Ждём leaderstats
local leaderstats = player:WaitForChild("leaderstats")
local deaths = leaderstats:WaitForChild("Deaths")

-- Находим элементы UI
local deathLabel = script.Parent:WaitForChild("DeathLabel")
local healthLabel = script.Parent:WaitForChild("HealthLabel")
local deathScreen = script.Parent:WaitForChild("DeathScreen")
local respawnButton = deathScreen:WaitForChild("RespawnButton")

-- Обновляем смерти
deaths.Changed:Connect(function(newValue)
    deathLabel.Text = "Смертей: " .. newValue
end)
deathLabel.Text = "Смертей: " .. deaths.Value

-- Функции экрана смерти
local function showDeathScreen()
    deathScreen.Visible = true
end

local function hideDeathScreen()
    deathScreen.Visible = false
end

-- Обновление здоровья
local function updateHealth()
    local character = player.Character
    if character then
        local humanoid = character:FindFirstChild("Humanoid")
        if humanoid then
            local hp = math.floor(humanoid.Health)
            healthLabel.Text = "HP: " .. hp

            if hp > 60 then
                healthLabel.TextColor3 = Color3.fromRGB(0, 255, 0)
            elseif hp > 30 then
                healthLabel.TextColor3 = Color3.fromRGB(255, 255, 0)
            else
                healthLabel.TextColor3 = Color3.fromRGB(255, 0, 0)
            end
        end
    end
end

-- Обработка персонажа
local function onCharacterAdded(character)
    hideDeathScreen()

    local humanoid = character:WaitForChild("Humanoid")
    humanoid.Died:Connect(showDeathScreen)

    while character.Parent do
        updateHealth()
        task.wait(0.1)
    end
end

if player.Character then
    onCharacterAdded(player.Character)
end
player.CharacterAdded:Connect(onCharacterAdded)

-- Кнопка возрождения
respawnButton.MouseButton1Click:Connect(function()
    hideDeathScreen()
end)
```

---

## Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| GUI не появляется | ScreenGui не в StarterGui | Перенеси в StarterGui |
| Текст не обновляется | LocalScript не видит данные | Проверь что leaderstats создан на сервере |
| "Deaths is not a valid member" | leaderstats не создан | Создай leaderstats в ServerScriptService |
| DeathScreen не скрывается | Visible = true по умолчанию | Поставь Visible = false |
| Кнопка не работает | MouseButton1Click не подключен | Проверь что обработчик подключён |
| GUI залипает после респавна | Скриншот не скрывается | Добавь `hideDeathScreen()` в `onCharacterAdded` |
| LocalScript в StarterGui не работает | Тип скрипта | Убедись что это **LocalScript**, а не Script |

---

## Итог: что ты теперь умеешь

- [ ] Создавать ScreenGui с TextLabel и TextButton
- [ ] Настраивать Size, Position, Color через Properties
- [ ] Использовать LocalScript для обновления GUI
- [ ] Создавать leaderstats на сервере для хранения данных
- [ ] Делать Health Bar с цветовой индикацией
- [ ] Создавать экран смерти с кнопкой
- [ ] Понимать разницу между Script и LocalScript
- [ ] Подключать обработчики событий (Changed, MouseButton1Click)

---

## Следующий шаг

Готов к следующей фазе? → **[Фаза 5.5: RemoteEvent — клиент-сервер](./phase-5-5-remote.md)**

Там ты научишься передавать данные между клиентом и сервером.

---

## Ссылки для углубления

| Тема | Ссылка |
|------|--------|
| ScreenGui | https://create.roblox.com/docs/reference/engine/classes/ScreenGui |
| TextLabel | https://create.roblox.com/docs/reference/engine/classes/TextLabel |
| TextButton | https://create.roblox.com/docs/reference/engine/classes/TextButton |
| LocalScript | https://create.roblox.com/docs/reference/engine/classes/LocalScript |
| Leaderstats | https://create.roblox.com/docs/players/leaderboards |
| UDim2 | https://create.roblox.com/docs/reference/engine/datatypes/UDim2 |
| DevForum: GUI tutorial | https://devforum.roblox.com/t/gui-tutorial/156981 |

---

*Фаза 5 из [плана обучения](../roblox-learning-plan.md). Предыдущая: [Фаза 4](./phase-4-checkpoints.md) | Следующая: [Фаза 5.5](./phase-5-5-remote.md)*
