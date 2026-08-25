# Фаза 7: Полировка — звук, свет, декор

**Цель:** сделать игру красивой и атмосферной.
**Итог:** звуки, освещение, частицы, декорации, финальный вид Obby.
**Время:** 3-4 часа (2 недели по 1-2 часа).
**Предыдущая фаза:** [Фаза 6: DataStore — сохранение данных](./phase-6-datastore/)

---

## Что ты сможешь после этой фазы

- Добавлять звуки в игру
- Настраивать освещение и атмосферу
- Создавать частицы (ParticleEmitter)
- Декорировать уровень
- Финализировать Obby

---

## Шаг 1: Звуки

### 1.1 Добавь Sound в игру

1. В Explorer найди **SoundService** (или создай Folder в Workspace)
2. Кликни правой кнопкой → Insert Object → **Sound**
3. Настрой:

| Свойство | Значение |
|----------|----------|
| **Name** | `JumpSound` |
| **SoundId** | `rbxassetid://130797689` (прыжок) |
| **Volume** | 0.5 |
| **Looped** | ❌ |

> **SoundId** — ID звука из библиотеки Roblox. Формат: `rbxassetid://ЧИСЛО`.

### 1.2 Воспроизведи звук

Звук лежит в **SoundService** (Шаг 1.1), поэтому обращаемся через `game.SoundService`:

```lua
-- Воспроизвести звук
local sound = game.SoundService:WaitForChild("JumpSound")
sound:Play()
```

### 1.3 Популярные звуки для Obby

| Звук | ID | Где использовать |
|------|-----|-----------------|
| Прыжок | `rbxassetid://130797689` | При прыжке |
| Смерть | `rbxassetid://130797745` | При смерти |
| Урон | `rbxassetid://131961136` | При TakeDamage |
| Чекпоинт | `rbxassetid://130797546` | При достижении чекпоинта |
| Победа | `rbxassetid://131323304` | На финише |

> Это временные заглушки — у разных событий должны быть разные звуки. Замени ID на понравившиеся из каталога Roblox (см. ссылки внизу страницы).

### 1.4 Звук смерти

Добавь в **CheckpointManager** (или отдельный скрипт):

```lua
-- Звук смерти
local deathSound = Instance.new("Sound")
deathSound.SoundId = "rbxassetid://130797745"
deathSound.Volume = 0.5
deathSound.Parent = game.SoundService

Players.PlayerAdded:Connect(function(player)
    player.CharacterAdded:Connect(function(character)
        local humanoid = character:WaitForChild("Humanoid")
        humanoid.Died:Connect(function()
            deathSound:Play()
        end)
    end)
end)
```

---

## Шаг 2: Свет и атмосфера

### 2.1 Настрой Lighting

1. В Explorer найди **Lighting**
2. Настрой свойства:

| Свойство | Значение | Эффект |
|----------|----------|--------|
| **Ambient** | `50, 50, 70` | Мягкий фоновый свет |
| **Brightness** | 2 | Общая яркость |
| **ColorShift_Top** | `100, 100, 120` | Цвет неба |
| **OutdoorAmbient** | `70, 70, 80` | Свет снаружи |
| **TimeOfDay** | `14:00:00` | Дневное время |
| **GeographicLatitude** | 40 | Широта (влияет на тени) |

### 2.2 Добавь атмосферу

1. Insert Object → **Atmosphere** в Lighting
2. Настрой:

| Свойство | Значение |
|----------|----------|
| **Density** | 0.3 |
| **Color** | `200, 200, 220` |
| **Haze** | 1 |

### 2.3 Добавь Sky

1. Insert Object → **Sky** в Lighting
2. Настрой:

| Свойство | Значение |
|----------|----------|
| **StarCount** | 3000 |
| **MoonAngularSize** | 11 |
| **SunAngularSize** | 11 |

### 2.4 Добавь Bloom

1. Insert Object → **BloomEffect** в Lighting
2. Настрой:

| Свойство | Значение |
|----------|----------|
| **Intensity** | 0.5 |
| **Size** | 24 |
| **Threshold** | 1 |

---

## Шаг 3: Частицы

### 3.1 ParticleEmitter для чекпоинта

Добавь **ParticleEmitter** в каждый чекпоинт:

```lua
-- Эмиттер для чекпоинта
local checkpoint = script.Parent
local emitter = Instance.new("ParticleEmitter")
emitter.Color = ColorSequence.new(Color3.fromRGB(0, 255, 0))
emitter.Size = NumberSequence.new({
    NumberSequenceKeypoint.new(0, 0.5),
    NumberSequenceKeypoint.new(1, 0)
})
emitter.Lifetime = NumberRange.new(1, 2)
emitter.Rate = 20
emitter.Speed = NumberRange.new(5, 10)
emitter.SpreadAngle = Vector2.new(360, 360)
emitter.Parent = checkpoint
```

### 3.2 Эмиттер для kill brick

```lua
-- Огненные частицы для kill brick
local killBrick = script.Parent
local emitter = Instance.new("ParticleEmitter")
emitter.Color = ColorSequence.new({
    ColorSequenceKeypoint.new(0, Color3.fromRGB(255, 100, 0)),
    ColorSequenceKeypoint.new(1, Color3.fromRGB(255, 0, 0))
})
emitter.Size = NumberSequence.new({
    NumberSequenceKeypoint.new(0, 1),
    NumberSequenceKeypoint.new(1, 0)
})
emitter.Lifetime = NumberRange.new(0.5, 1)
emitter.Rate = 30
emitter.Speed = NumberRange.new(3, 5)
emitter.SpreadAngle = Vector2.new(180, 180)
emitter.Parent = killBrick
```

---

## Шаг 4: Декорации

### 4.1 Декоративные Part'ы

Добавь декоративные элементы:

| Элемент | Описание | Материал |
|---------|----------|----------|
| Деревья | CylinderPart (ствол) + SpherePart (крона) | Wood / Grass |
| Камни | Random Size Part | Slate |
| Вода | Flat Part с прозрачностью | Glass |
| Ограда | Тонкие Part'ы | Metal |

### 4.2 Дерево (пример)

```lua
-- Создаём дерево
local trunk = Instance.new("Part")
trunk.Size = Vector3.new(1, 8, 1)
trunk.Position = Vector3.new(20, 4, 20)
trunk.Color = Color3.fromRGB(100, 70, 30)
trunk.Material = Enum.Material.Wood
trunk.Anchored = true
trunk.Parent = workspace

local crown = Instance.new("Part")
crown.Size = Vector3.new(6, 6, 6)
crown.Position = Vector3.new(20, 10, 20)
crown.Color = Color3.fromRGB(30, 120, 30)
crown.Material = Enum.Material.Grass
crown.Shape = Enum.PartType.Ball
crown.Anchored = true
crown.Parent = workspace
```

### 4.3 Вода

```lua
-- Платформа-вода (не убивает, но замедляет)
local water = Instance.new("Part")
water.Size = Vector3.new(20, 0.5, 20)
water.Position = Vector3.new(0, 0.5, 40)
water.Color = Color3.fromRGB(0, 100, 200)
water.Material = Enum.Material.Glass
water.Transparency = 0.5
water.Anchored = true
water.Parent = workspace

-- Замедление при касании воды
water.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.WalkSpeed = 4
        task.wait(2)
        humanoid.WalkSpeed = 16
    end
end)
```

---

## Шаг 5: Финальная сборка

### Структура финальной игры

```
Workspace
├── Terrain (автоматический ландшафт)
├── StartPlatform
├── Checkpoints
│   ├── Checkpoint1
│   ├── Checkpoint2
│   └── Checkpoint3
├── Level1
│   ├── Платформы
│   └── KillBrick
├── Level2
│   ├── Движущиеся платформы
│   └── DamageBrick
├── Level3
│   ├── Невидимые стены
│   └── LaunchBrick
├── Decorations
│   ├── Деревья
│   ├── Камни
│   └── Вода
├── FinishPlatform
└── Lighting
    ├── Atmosphere
    ├── Sky
    └── BloomEffect

SoundService (звуки здесь, а не в Workspace)
├── JumpSound
├── DeathSound
└── CheckpointSound
```

---

## Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| Звук не играет | SoundId неправильный | Проверь формат `rbxassetid://ЧИСЛО` |
| Частицы не видны | Эмиттер скрыт | Проверь что Parent установлен |
| Освещение не изменилось | Properties не сохранены | Проверь Lighting в Explorer |
| Деревья падают | Anchored = false | Включи Anchored |
| Игра тормозит | Слишком много Part'ов | Оптимизируй (Фаза 7.5) |

---

## Итог: что ты теперь умеешь

- [ ] Добавлять звуки (Sound, SoundId, Volume)
- [ ] Воспроизводить звуки через Play()
- [ ] Настраивать освещение (Lighting properties)
- [ ] Добавлять атмосферу (Atmosphere, Sky, Bloom)
- [ ] Создавать частицы (ParticleEmitter)
- [ ] Декорировать уровень деревьями, камнями, водой
- [ ] Финализировать Obby

---

## Следующий шаг

Готов к следующей фазе? → **[Фаза 7.5: Оптимизация производительности](./phase-7-5-optimization/)**

Ты создал красивую игру. Теперь убедись что она быстро работает.

---

## Ссылки для углубления

| Тема | Ссылка |
|------|--------|
| Sound | https://create.roblox.com/docs/reference/engine/classes/Sound |
| Lighting | https://create.roblox.com/docs/reference/engine/services/Lighting |
| Atmosphere | https://create.roblox.com/docs/reference/engine/classes/Atmosphere |
| ParticleEmitter | https://create.roblox.com/docs/reference/engine/classes/ParticleEmitter |
| BloomEffect | https://create.roblox.com/docs/reference/engine/classes/BloomEffect |
| Sound catalog | https://create.roblox.com/assets?sort=Type-Asset&sortOrder=Asc&requests=Type-Asset&category=12 |
| DevForum: Polish tips | https://devforum.roblox.com/t/polish-your-game/156984 |

---

*Фаза 7 из [плана обучения](../../). Предыдущая: [Фаза 6](./phase-6-datastore/) | Следующая: [Фаза 7.5](./phase-7-5-optimization/)*
