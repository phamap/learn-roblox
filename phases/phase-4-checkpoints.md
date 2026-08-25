# Фаза 4: Чекпоинты и респавн

**Цель:** научиться ставить чекпоинты, чтобы игрок respawn'ился на последнем пройденном этапе.
**Итог:** чекпоинты с визуальными маркерами, серверное отслеживание прогресса, правильный респавн.
**Время:** 3-4 часа (2 недели по 1-2 часа).
**Предыдущая фаза:** [Фаза 3: TweenService — движение платформ](./phase-3-tween.md)

---

## Что ты сможешь после этой фазы

- Создавать чекпоинты через SpawnLocation
- Отслеживать прогресс игрока на сервере
- Делать визуальные маркеры чекпоинтов
- Управлять респавном игрока

---

## Шаг 1: Почему чекпоинты важны

Без чекпоинтов каждый респавн начинается с самого начала. В Obby это быстро утомляет. Чекпоинты позволяют игроку respawn'иться на последнем пройденном этапе.

---

## Шаг 2: SpawnLocation — базовый чекпоинт

### 2.1 Добавь SpawnLocation

1. В Explorer кликни правой кнопкой по **Workspace**
2. Insert Object → **SpawnLocation**
3. Настрой:

| Свойство | Значение |
|----------|----------|
| **Name** | `Checkpoint1` |
| **Position** | `0, 3, 5` |
| **Neutral** | ✅ (важно!) |
| **Enabled** | ✅ |

> **Neutral = true** — означает что любой игрок может спавниться на этом SpawnLocation. Без этого чекпоинт не будет работать для всех игроков.

### 2.2 Проверь

Запусти Play. Умри (встань на Kill Brick из Фазы 2). Ты respawn'ишься на Checkpoint1.

---

## Шаг 3: Серверное отслеживание чекпоинтов

### Проблема

Roblox автоматически респавнит на **ближайшем** SpawnLocation. Но нам нужно чтобы игрок respawn'ился на **последнем пройденном**, а не ближайшем.

### Решение: серверный скрипт

1. Создай **Script** в **ServerScriptService** (не в Workspace!)
2. Назови его `CheckpointManager`
3. Напиши:

```lua
-- CheckpointManager: отслеживает какой чекпоинт последний для каждого игрока
local Players = game:GetService("Players")

-- Таблица для хранения последнего чекпоинта каждого игрока
-- Формат: { [player] = SpawnLocation }
local lastCheckpoint = {}

-- Все чекпоинты в игре
local checkpoints = workspace:WaitForChild("Checkpoints"):GetChildren()

-- Когда игрок заходит
Players.PlayerAdded:Connect(function(player)
    lastCheckpoint[player] = nil  -- начинаем без чекпоинта
    print(player.Name .. " зашёл. Чекпоинт: нет")
end)

-- Когда игрок выходит
Players.PlayerRemoving:Connect(function(player)
    lastCheckpoint[player] = nil
end)

-- Обновляем чекпоинт когда игрок касается SpawnLocation
for _, checkpoint in ipairs(checkpoints) do
    if checkpoint:IsA("SpawnLocation") then
        checkpoint.Touched:Connect(function(hit)
            local character = hit.Parent
            local humanoid = character:FindFirstChild("Humanoid")

            if humanoid then
                local player = Players:GetPlayerFromCharacter(character)
                if player then
                    -- Сохраняем последний чекпоинт
                    lastCheckpoint[player] = checkpoint
                    print(player.Name .. " достиг чекпоинта: " .. checkpoint.Name)
                end
            end
        end)
    end
end

-- Функция для получения точки спавна
local function getSpawnPoint(player)
    if lastCheckpoint[player] then
        return lastCheckpoint[player]
    end
    -- Если нет чекпоинта — первый SpawnLocation
    return checkpoints[1]
end
```

### 4.2 Настрой SpawnLocation для respawn

Теперь нужно заставить Roblox использовать наш чекпоинт. Добавь в тот же скрипт:

```lua
-- Перехватываем respawn
Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local spawnPoint = getSpawnPoint(player)
        local rootPart = character:WaitForChild("HumanoidRootPart")

        -- Телепортируем в точку спавна
        rootPart.CFrame = spawnPoint.CFrame + Vector3.new(0, 3, 0)
    end)
end)
```

---

## Шаг 4: Визуальные маркеры чекпоинтов

### 4.1 Добавь свечение

1. Выбери **Checkpoint1** в Explorer
2. Insert Object → **PointLight**
3. Настрой:

| Свойство | Значение |
|----------|----------|
| **Color** | Зелёный (0, 255, 0) |
| **Brightness** | 2 |
| **Range** | 20 |

### 4.2 Добавь скрипт для анимации

Создай **Script** внутри Checkpoint1:

```lua
-- Анимация чекпоинта: пульсирующее свечение
local checkpoint = script.Parent
local light = checkpoint:FindFirstChild("PointLight")

if light then
    local TweenService = game:GetService("TweenService")

    while true do
        -- Плавно увеличиваем яркость
        local tweenUp = TweenService:Create(
            light,
            TweenInfo.new(1, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut),
            {Brightness = 3}
        )
        tweenUp:Play()
        tweenUp.Completed:Wait()

        -- Плавно уменьшаем яркость
        local tweenDown = TweenService:Create(
            light,
            TweenInfo.new(1, Enum.EasingStyle.Sine, Enum.EasingDirection.InOut),
            {Brightness = 1}
        )
        tweenDown:Play()
        tweenDown.Completed:Wait()
    end
end
```

### 4.3 Добавь частицы (ParticleEmitter)

1. Insert Object → **ParticleEmitter** внутрь Checkpoint1
2. Настрой:

| Свойство | Значение |
|----------|----------|
| **Color** | Зелёный |
| **Size** | 0.5 |
| **Lifetime** | 1 |
| **Rate** | 20 |
| **Speed** | 5 |
| **SpreadAngle** | 360, 360 |

Теперь чекпоинт будет светиться и искриться.

---

## Шаг 5: Организация чекпоинтов

### 5.1 Создай папку

1. В Explorer создай **Folder** в Workspace
2. Назови её `Checkpoints`

### 5.2 Добавь 3 чекпоинта

```
Workspace
├── Checkpoints
│   ├── Checkpoint1 (Position: 0, 3, 5)
│   ├── Checkpoint2 (Position: 0, 3, 30)
│   └── Checkpoint3 (Position: 0, 3, 60)
└── CheckpointManager (Script в ServerScriptService)
```

Каждый чекпоинт:
- `Neutral = true`
- `Enabled = true`
- PointLight с зелёным свечением
- ParticleEmitter

### 5.3 Добавь KillBrick между чекпоинтами

Между каждым чекпоинтом поставь KillBrick из Фазы 2. Это заставит игроков умирать и重生яться на чекпоинтах.

---

## Шаг 6: Мини-проект — Obby с чекпоинтами

### Структура

```
Workspace
├── StartSpawn (SpawnLocation, начальная точка)
├── Checkpoints
│   ├── Checkpoint1 (после уровня 1)
│   ├── Checkpoint2 (после уровня 2)
│   └── Checkpoint3 (после уровня 3)
├── Level1
│   ├── Платформы (5 штук)
│   └── KillBrick (3 штуки)
├── Level2
│   ├── Движущиеся платформы (TweenService)
│   └── KillBrick (5 штук)
├── Level3
│   ├── Невидимые стены
│   └── PoisonBrick (3 штуки)
└── Finish (финальная платформа)
```

### Тестирование

1. Запусти Play
2. Пройди Level1 → умри → respawn на Checkpoint1 ✓
3. Пройди Level2 → умри → respawn на Checkpoint2 ✓
4. Пройди Level3 → умри → respawn на Checkpoint3 ✓

---

## Типичные ошибки

| Ошибка | Причина | Р�ешение |
|--------|---------|---------|
| Чекпоинт не работает | `Neutral = false` | Включи Neutral в Properties |
| Игрок respawn'ится в начале | `CheckpointManager` не создан | Создай скрипт в ServerScriptService |
| Несколько игроков спавнятся на одном чекпоинте | Это нормально | Каждый игрок хранит свой последний чекпоинт |
| `lastCheckpoint` не обновляется | Touched не срабатывает | Проверь что чекпоинт в папке `Checkpoints` |
| Респавн происходит не на чекпоинте | Неправильный путь | Проверь `getSpawnPoint()` возвращает нужный SpawnLocation |
| Телепортация не работает | `HumanoidRootPart` не найден | Используй `WaitForChild("HumanoidRootPart")` |

---

## Итог: что ты теперь умеешь

- [ ] Создавать SpawnLocation с Neutral = true
- [ ] Отслеживать прогресс игрока на сервере (таблица player → checkpoint)
- [ ] Перехватывать respawn через PlayerAdded + CharacterAdded
- [ ] Делать визуальные маркеры (PointLight, ParticleEmitter)
- [ ] Анимировать свечение через TweenService
- [ ] Организовывать объекты в папки
- [ ] Понимать разницу между серверными и клиентскими скриптами (CheckpointManager — серверный)

---

## Следующий шаг

Готов к следующей фазе? → **[Фаза 5: GUI — интерфейс](./phase-5-gui.md)**

Там ты научишься создавать интерфейс: счётчик, HUD, экран смерти.

---

## Ссылки для углубления

| Тема | Ссылка |
|------|--------|
| SpawnLocation | https://create.roblox.com/docs/reference/engine/classes/SpawnLocation |
| Neutral property | https://create.roblox.com/docs/reference/engine/classes/SpawnLocation#Neutral |
| PlayerAdded | https://create.roblox.com/docs/reference/engine/services/Players#PlayerAdded |
| CharacterAdded | https://create.roblox.com/docs/reference/engine/services/Players#CharacterAdded |
| PointLight | https://create.roblox.com/docs/reference/engine/classes/PointLight |
| ParticleEmitter | https://create.roblox.com/docs/reference/engine/classes/ParticleEmitter |
| DevForum: Checkpoint system | https://devforum.roblox.com/t/checkpoint-system-tutorial/156980 |

---

*Фаза 4 из [плана обучения](../roblox-learning-plan.md). Предыдущая: [Фаза 3](./phase-3-tween.md) | Следующая: [Фаза 5](./phase-5-gui.md)*
