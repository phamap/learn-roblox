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

> Если в твоём шаблоне карты (Baseplate) уже есть стандартный SpawnLocation — удали его, чтобы он не мешал.

### 2.2 Проверь

Запусти Play. Умри (встань на Kill Brick из Фазы 2). Ты respawn'ишься на Checkpoint1.

---

## Шаг 3: Готовим структуру — папка Checkpoints и StartSpawn

Скрипт из следующего шага будет искать чекпоинты в папке `Checkpoints`. Создадим её заранее — до скрипта.

### 3.1 Создай папку Checkpoints

1. В Explorer кликни правой кнопкой по **Workspace**
2. Insert Object → **Folder**
3. Назови её `Checkpoints` (точно так, с большой буквы)
4. Перетащи **Checkpoint1** внутрь этой папки

### 3.2 Добавь StartSpawn

Это стартовая точка — где игрок появляется, пока не достиг ни одного чекпоинта.

1. Кликни правой кнопкой по папке **Checkpoints**
2. Insert Object → **SpawnLocation**
3. Настрой:

| Свойство | Значение |
|----------|----------|
| **Name** | `StartSpawn` |
| **Position** | `0, 3, -20` |
| **Neutral** | ✅ |
| **Enabled** | ✅ |

Структура сейчас:

```
Workspace
└── Checkpoints
    ├── StartSpawn (стартовая точка)
    └── Checkpoint1
```

> **Как Roblox выбирает точку спавна:** при респавне движок использует `player.RespawnLocation`, а если оно не задано — любой включённый SpawnLocation на карте (это не «ближайший»!). В следующем шаге мы будем управлять `RespawnLocation` напрямую.

---

## Шаг 4: Серверное отслеживание чекпоинтов

### Проблема

Нам нужно чтобы игрок respawn'ился на **последнем пройденном** чекпоинте, а не на случайном SpawnLocation.

### Решение: свойство RespawnLocation

У игрока есть свойство **RespawnLocation**: присвой ему SpawnLocation — и все следующие респавны произойдут именно там. Это штатный механизм Roblox, ручная телепортация не нужна.

### 4.1 Создай скрипт

1. Создай **Script** в **ServerScriptService** (не в Workspace!)
2. Назови его `CheckpointManager`
3. Напиши:

```lua
-- CheckpointManager: запоминает последний чекпоинт каждого игрока
local Players = game:GetService("Players")

-- Ждём папку с чекпоинтами (создана в Шаге 3)
-- Таймаут 10 секунд: если папки нет — предупреждаем, а не висим навсегда
local checkpointsFolder = workspace:WaitForChild("Checkpoints", 10)
if not checkpointsFolder then
	warn("Папка Checkpoints не найдена! Выполни Шаг 3.")
	return
end

-- Явно названная стартовая точка (создана в Шаге 3)
local startSpawn = checkpointsFolder:WaitForChild("StartSpawn", 10)
if not startSpawn then
	warn("StartSpawn не найден! Выполни Шаг 3.")
	return
end

-- Таблица для хранения последнего чекпоинта каждого игрока
-- Формат: { [player] = SpawnLocation }
local lastCheckpoint = {}

-- Когда игрок заходит
Players.PlayerAdded:Connect(function(player)
	lastCheckpoint[player] = nil
	-- До первого чекпоинта игрок появляется на StartSpawn.
	-- `or` защищает случай, когда другой скрипт (например,
	-- DataStoreManager из Фазы 6) уже восстановил чекпоинт из сохранения
	player.RespawnLocation = player.RespawnLocation or startSpawn
	print(player.Name .. " зашёл. Чекпоинт: нет")
end)

-- Когда игрок выходит
Players.PlayerRemoving:Connect(function(player)
	lastCheckpoint[player] = nil
end)

-- Обновляем чекпоинт когда игрок касается SpawnLocation
for _, checkpoint in ipairs(checkpointsFolder:GetChildren()) do
	if checkpoint:IsA("SpawnLocation") then
		checkpoint.Touched:Connect(function(hit)
			local character = hit.Parent
			local humanoid = character and character:FindFirstChild("Humanoid")

			if humanoid and humanoid.Health > 0 then
				local player = Players:GetPlayerFromCharacter(character)
				if player then
					lastCheckpoint[player] = checkpoint
					-- Движок сам заспавнит игрока здесь после смерти
					player.RespawnLocation = checkpoint
					print(player.Name .. " достиг чекпоинта: " .. checkpoint.Name)
				end
			end
		end)
	end
end
```

### 4.2 Проверь

Запусти Play. Пройди до Checkpoint1 и умри на Kill Brick. Ты respawn'ишься на Checkpoint1: скрипт записал его в `RespawnLocation` при касании, и движок заспавнил тебя именно там.

> **Заметь:** никакого перехвата `CharacterAdded` и ручного телепорта. Движок сам решает, где спавнить, — мы лишь указываем ему точку через `player.RespawnLocation`.

---

## Шаг 5: Визуальные маркеры чекпоинтов

### 5.1 Добавь свечение

1. Выбери **Checkpoint1** в Explorer
2. Insert Object → **PointLight**
3. Настрой:

| Свойство | Значение |
|----------|----------|
| **Color** | Зелёный (0, 255, 0) |
| **Brightness** | 2 |
| **Range** | 20 |

### 5.2 Добавь скрипт для анимации

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

### 5.3 Добавь частицы (ParticleEmitter)

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

## Шаг 6: Добавь ещё чекпоинты

### 6.1 Добавь Checkpoint2 и Checkpoint3

Скопируй Checkpoint1 (Ctrl+D) дважды, переименуй копии и расставь:

```
Workspace
└── Checkpoints
    ├── StartSpawn
    ├── Checkpoint1 (Position: 0, 3, 5)
    ├── Checkpoint2 (Position: 0, 3, 30)
    └── Checkpoint3 (Position: 0, 3, 60)
```

Каждый чекпоинт:
- `Neutral = true`
- `Enabled = true`
- PointLight с зелёным свечением
- ParticleEmitter

Скрипт подхватит их автоматически — он обходит всех детей папки `Checkpoints`.

### 6.2 Добавь KillBrick между чекпоинтами

Между каждым чекпоинтом поставь KillBrick из Фазы 2. Это заставит игроков умирать и respawn'иться на чекпоинтах.

---

## Шаг 7: Мини-проект — Obby с чекпоинтами

### Структура

```
Workspace
├── Checkpoints
│   ├── StartSpawn (начальная точка)
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

| Ошибка | Причина | Решение |
|--------|---------|---------|
| Чекпоинт не работает | `Neutral = false` | Включи Neutral в Properties |
| Игрок respawn'ится в начале | `CheckpointManager` не создан | Создай скрипт в ServerScriptService |
| Несколько игроков спавнятся на одном чекпоинте | Это нормально | Каждый игрок хранит свой последний чекпоинт |
| `lastCheckpoint` не обновляется | Touched не срабатывает | Проверь что чекпоинт в папке `Checkpoints` |
| Игрок respawn'ится на StartSpawn | Скрипт не записал RespawnLocation | Проверь Output: есть ли сообщение о достижении чекпоинта |
| Infinite yield warning в Output | Нет папки `Checkpoints` или StartSpawn | Выполни Шаг 3, проверь имена (точно `Checkpoints` и `StartSpawn`) |

---

## Итог: что ты теперь умеешь

- [ ] Создавать SpawnLocation с Neutral = true
- [ ] Отслеживать прогресс игрока на сервере (таблица player → checkpoint)
- [ ] Направлять респавн через `player.RespawnLocation`
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
| Player.RespawnLocation | https://create.roblox.com/docs/reference/engine/classes/Player#RespawnLocation |
| PlayerAdded | https://create.roblox.com/docs/reference/engine/services/Players#PlayerAdded |
| PointLight | https://create.roblox.com/docs/reference/engine/classes/PointLight |
| ParticleEmitter | https://create.roblox.com/docs/reference/engine/classes/ParticleEmitter |
| DevForum: Checkpoint system | https://devforum.roblox.com/t/checkpoint-system-tutorial/156980 |

---

*Фаза 4 из [плана обучения](../roblox-learning-plan.md). Предыдущая: [Фаза 3](./phase-3-tween.md) | Следующая: [Фаза 5](./phase-5-gui.md)*
