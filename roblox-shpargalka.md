# Roblox: шпаргалка по разработке

Справочник для создания Obby-игр. Используй как referencia при обучении.

---

## 1. Иерархия игры

```
game
├── Workspace          -- всё, что видно в мире (части, модели, игроки)
│   ├── Baseplate
│   └── SpawnLocation
├── Players            -- список игроков
├── ServerScriptService -- скрипты сервера (обычно тут)
├── ReplicatedStorage   -- вещи, видимые серверу И клиенту
├── Lighting            -- свет/небо
└── StarterGui          -- что выдать игроку при спавне
```

Доступ в коде:
```lua
local part = workspace.Baseplate        -- сокращение для game.Workspace
local players = game:GetService("Players")
local storage = game:GetService("ReplicatedStorage")
```

> Всегда пиши `game:GetService("...")` для сервисов — так правильнее.

---

## 2. Типы скриптов

| Тип | Где живёт | Кто исполняет | Когда использовать |
|-----|-----------|---------------|-------------------|
| **Script** | ServerScriptService, Workspace | сервер | логика: спавн, урон, экономика |
| **LocalScript** | StarterPlayer/StarterGui | клиент | ввод, камера, личный UI |
| **ModuleScript** | ReplicatedStorage и др. | не исполняется | библиотека, подключается через `require` |

**Правило:** вся реальная логика — в Script. LocalScript добавляй для UI и ввода.

---

## 3. Vector3 и CFrame

### Vector3 — точка в 3D

```lua
local pos = Vector3.new(10, 5, 0)     -- x, y, z
print(pos.X, pos.Y, pos.Z)            -- 10  5  0

-- Операции
local a = Vector3.new(1, 0, 0)
local b = Vector3.new(0, 1, 0)
local c = a + b                        -- (1, 1, 0)
local d = a * 2                        -- (2, 0, 0)
local dist = (a - b).Magnitude         -- расстояние между точками
```

### CFrame — позиция + поворот

```lua
-- Только позиция
local cf = CFrame.new(10, 5, 0)

-- Позиция + поворот (в градусах)
local cf = CFrame.new(10, 5, 0) * CFrame.Angles(0, math.rad(90), 0)

-- Изменить позицию Part
part.CFrame = CFrame.new(0, 20, 0)

-- Двигать относительно текущей позиции
part.CFrame = part.CFrame * CFrame.new(0, 5, 0)  -- поднять на 5

-- LookAt — смотреть на точку
part.CFrame = CFrame.lookAt(part.Position, Vector3.new(0, 0, 0))
```

---

## 4. Part — ключевые свойства

| Свойство | Тип | Описание |
|----------|-----|----------|
| `Anchored` | bool | true = не падает, стоит на месте |
| `CanCollide` | bool | true = коллизия (врезаешься), false = проходишь насквозь |
| `Transparency` | number | 0 = видимый, 1 = невидимый |
| `Color` | Color3 | Цвет: `Color3.fromRGB(255, 0, 0)` |
| `Material` | Enum | `Enum.Material.Neon`, `.Wood`, `.Glass` |
| `Size` | Vector3 | Размер: `Vector3.new(4, 1, 4)` |
| `Position` | Vector3 | Позиция (упрощённо, лучше CFrame) |
| `CFrame` | CFrame | Позиция + поворот (основной способ) |

```lua
local part = Instance.new("Part")
part.Size = Vector3.new(4, 1, 4)
part.Position = Vector3.new(0, 10, 0)
part.Anchored = true
part.CanCollide = true
part.Color = Color3.fromRGB(255, 0, 0)
part.Material = Enum.Material.Neon
part.Parent = workspace
```

---

## 5. Kill Brick

Классический паттерн для Obby — коснулся = умер.

```lua
-- Script внутри Part (kill brick)
local killBrick = script.Parent
local debounce = false

killBrick.Touched:Connect(function(hit)
    if debounce then return end

    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        debounce = true
        humanoid.Health = 0
        task.wait(1)
        debounce = false
    end
end)
```

**Зачем debounce:** без него событие срабатывает много раз за кадр, что вызывает лаги.

---

## 6. TweenService — анимация

Плавное движение/изменение свойств без циклов.

```lua
local TweenService = game:GetService("TweenService")

local part = workspace.MovingPlatform
local info = TweenInfo.new(
    2,                              -- длительность (сек)
    Enum.EasingStyle.Sine,         -- стиль
    Enum.EasingDirection.InOut,    -- направление
    -1,                            -- repeatCount (-1 = бесконечно)
    true                           -- reverse (туда-обратно)
)

local goal = {
    Position = part.Position + Vector3.new(0, 10, 0)
}

local tween = TweenService:Create(part, info, goal)
tween:Play()
```

### EasingStyle — таблица

| Стиль | Описание |
|-------|----------|
| `Linear` | равномерно |
| `Sine` | плавное ускорение/замедление |
| `Quad` | квадратичное |
| `Bounce` | отскок |
| `Elastic` | пружина |
| `Back` | заход за цель |

---

## 7. Checkpoint система

### SpawnLocation

```lua
-- Создай SpawnLocation на каждом уровне
-- Свойства:
--   Neutral = true    -- не привязан к команде
--   Duration = 0      -- время до респавна (0 = мгновенно)
```

### Сохранение чекпоинта

```lua
-- Серверный скрипт
local Players = game:GetService("Players")

local checkpoints = {}  -- [player] = checkpointNumber

Players.PlayerAdded:Connect(function(player)
    checkpoints[player] = 0

    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")
        humanoid.Died:Connect(function()
            -- Респавн будет автоматическим через SpawnLocation
        end)
    end)
end)

-- При касании чекпоинта
checkpoint.Touched:Connect(function(hit)
    local player = Players:GetPlayerFromCharacter(hit.Parent)
    if player then
        checkpoints[player] = checkpointNumber
    end
end)
```

---

## 8. Humanoid — здоровье и смерть

```lua
local humanoid = character:FindFirstChild("Humanoid")

-- Свойства
humanoid.Health           -- текущее здоровье (0-100)
humanoid.MaxHealth        -- максимальное (по умолчанию 100)
humanoid.WalkSpeed        -- скорость (по умолчанию 16)
humanoid.JumpPower        -- сила прыжка (по умолчанию 50)

-- Методы
humanoid:TakeDamage(20)   -- урон
humanoid.Health = 0       -- мгновенная смерть
humanoid:MoveTo(position) -- идти в точку

-- Событие
humanoid.Died:Connect(function()
    print("Игрок умер")
end)
```

---

## 9. Респавн

```lua
local Players = game:GetService("Players")

Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")

        humanoid.Died:Connect(function()
            -- Ждём и респавним
            task.wait(3)
            player:LoadCharacter()  -- загрузить персонажа заново
        end)
    end)
end)
```

---

## 10. GUI — интерфейс

### Базовая структура

```
StarterGui
└── ScreenGui              -- корень GUI
    ├── Frame              -- контейнер (фон)
    │   ├── UICorner       -- скруглённые углы
    │   └── UIListLayout   -- автос расположение
    ├── TextLabel           -- текст
    └── TextButton          -- кнопка
```

### Пример: счётчик смертей

```lua
-- LocalScript в StarterGui
local Players = game:GetService("Players")
local player = Players.LocalPlayer
local gui = script.Parent

local deaths = 0
local label = gui.Frame.DeathCount

player.CharacterAdded:Connect(function(character)
    character:WaitForChild("Humanoid").Died:Connect(function()
        deaths = deaths + 1
        label.Text = "Смертей: " .. deaths
    end)
end)
```

---

## 11. DataStore — сохранение данных

```lua
-- Серверный скрипт
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local dataStore = DataStoreService:GetDataStore("PlayerData")

-- Загрузка
Players.PlayerAdded:Connect(function(player)
    local success, data = pcall(function()
        return dataStore:GetAsync("player_" .. player.UserId)
    end)

    if success and data then
        print("Загружено:", data.deaths, data.checkpoint)
    else
        print("Нет данных, стартовые значения")
    end
end)

-- Сохранение
Players.PlayerRemoving:Connect(function(player)
    pcall(function()
        dataStore:SetAsync("player_" .. player.UserId, {
            deaths = 5,
            checkpoint = 3
        })
    end)
end)
```

---

## 12. RemoteEvent — клиент-сервер

```lua
-- ReplicatedStorage → RemoteEvent

-- Сервер (Script)
local remote = game.ReplicatedStorage.MyRemote
remote.OnServerEvent:Connect(function(player, data)
    print(player.Name .. " отправил:", data)
end)

-- Клиент (LocalScript)
local remote = game.ReplicatedStorage.MyRemote
remote:FireServer("привет от клиента")
```

---

## 13. Debugging

| Инструмент | Где | Как |
|------------|-----|-----|
| `print(...)` | Output | Вывод текста/значений |
| `warn(...)` | Output | Предупреждение (жёлтый) |
| `error("msg")` | Output | Ошибка (красный) |
| Command Bar | View → Command Bar | Выполнить код прямо в Studio |
| Script Performance | View → Script Performance | Что вызывает лаги |

---

## 14. Модели из Toolbox

| Категория | Что искать | Зачем |
|-----------|-----------|-------|
| Свет | "light pack", "neon lights" | Освещение уровней |
| Частицы | "particle effects", "fire", "smoke" | Эффекты смерти/победы |
| Звуки | "obby sounds", "death sound", "checkpoint" | Фоновая музыка, эффекты |
| Декор | "nature pack", "trees", "rocks" | Оформление платформ |
| GUI | "GUI kit", "modern UI" | Готовые интерфейсы |
| Анимации | "animation pack", "emotes" | Движения персонажа |
| Спавн | "spawn effects", "teleport" | Эффекты появления |

> **Совет:** ищи по-английски — больше моделей. Фильтруй по "Free" и "Model".

---

## 15. Грабли Obby

| Симптом | Причина | Решение |
|---------|---------|---------|
| Kill brick не работает | `CanCollide = false` или нет физики | Проверь CanCollide, двигается ли часть |
| Платформа не двигается | `Anchored = false` | Для Tween нужно Anchored = true |
| Tween дёргается | Нет debounce | Добавь флаг debounce |
| Чекпоинт не сохраняется | Нет `Neutral = true` | Настрой SpawnLocation |
| GUI не обновляется | Script вместо LocalScript | UI обновляй в LocalScript |
| DataStore ошибка | Нет pcall | Оберни в pcall() |
| Респавн на старте | SpawnLocation не на уровне | Проверь позицию SpawnLocation |
| `FindFirstChild` = nil | Имя не совпало | Проверь регистр, используй WaitForChild |

---

*Шпаргалка: Roblox Obby-разработка. Дополняй по мере изучения.*
