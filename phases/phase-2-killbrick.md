# Фаза 2: Kill Brick + Touched

**Цель:** научиться обрабатывать столкновения, создавать смертельные препятствия для Obby.
**Итог:** платформа с kill bricks разных типов, debounce, ловушки.
**Время:** 4-6 часов (3-5 недель по 1-2 часа).
**Предыдущая фаза:** [Фаза 1: Знакомство с Studio](./phase-1-studio.md)

---

## Что ты сможешь после этой фазы

- Создавать Part'ы, которые убивают игрока при касании
- Реализовать debounce чтобы урон наносился один раз
- Создавать разные типы препятствий (острые, ловушки, движущиеся)
- Управлять здоровьем игрока (Health, TakeDamage)

---

## Шаг 1: Первый Kill Brick

### 1.1 Создай Part

1. В Explorer кликни правой кнопкой по **Workspace**
2. Insert Object → **Part**
3. Настрой свойства:

| Свойство | Значение |
|----------|----------|
| **Name** | `KillBrick` |
| **Size** | `4, 1, 4` |
| **Position** | `0, 3, 0` |
| **Color** | Красный (`255, 0, 0`) |
| **Material** | `SmoothPlastic` |
| **Anchored** | ✅ |

### 1.2 Создай скрипт внутри KillBrick

1. Кликни правой кнопкой по **KillBrick** в Explorer
2. Insert Object → **Script**
3. Напиши:

```lua
-- KillBrick: убивает игрока при касании
local killBrick = script.Parent

local function onTouched(hit)
    -- hit — часть персонажа, которая коснулась
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")

    if humanoid then
        humanoid.Health = 0
        print("Игрок умер!")
    end
end

killBrick.Touched:Connect(onTouched)
```

### 1.3 Запусти Play

Подойди к красному кубику. Как только коснёшься — умрёшь и respawn'ишься.

> **Как это работает:** `humanoid.Health = 0` мгновенно убивает персонажа. Альтернатива — `humanoid:TakeDamage(100)`, которая наносит конкретный урон.

---

## Шаг 2: Debounce — защита от повторного урона

### Проблема

Без debounce событие Touched срабатывает несколько раз за одно касание (несколько частей персонажа касаются по очереди). Это может нанести урон дважды или вызвать странные баги.

### Решение: флаг debounce

1. Создай новый Part с именем `KillBrickDebounce`
2. Добавь скрипт:

```lua
-- KillBrick с debounce: урон только один раз за касание
local killBrick = script.Parent
local debounce = false  -- флаг: "сейчас обрабатываем касание"

local function onTouched(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")

    if humanoid and not debounce then
        debounce = true  -- ставим флаг

        humanoid.Health = 0
        print("Игрок умер! (debounce активен)")

        -- Ждём 2 секунды перед следующим касанием
        task.wait(2)
        debounce = false  -- снимаем флаг
    end
end

killBrick.Touched:Connect(onTouched)
```

> **Debounce** (защёлка) — паттерн: пока `debounce = true`, повторные касания игнорируются. После `task.wait(2)` флаг сбрасывается и кирпич снова может убить.

### Запусти и проверь

Встань на KillBrick. Умрёшь один раз. После respawn'а снова можешь встать — снова умрёшь один раз. Не должно быть двойного урона.

---

## Шаг 3: TakeDamage вместо мгновенной смерти

### 3.1 Part с постепенным уроном

Создай Part с именем `DamageBrick` и скрипт:

```lua
-- TakeDamage: наносит 25 урона за касание
local damageBrick = script.Parent
local DAMAGE = 25
local debounce = false

local function onTouched(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")

    if humanoid and not debounce then
        debounce = true

        humanoid:TakeDamage(DAMAGE)
        print("Нанесено " .. DAMAGE .. " урона! HP: " .. humanoid.Health)

        task.wait(1)
        debounce = false
    end
end

damageBrick.Touched:Connect(onTouched)
```

> **TakeDamage(число)** — наносит указанное количество урона. Если у игрока 100 HP и ты наносишь 25, он выживет 4 касания.

### 3.2 Сравни: Health = 0 vs TakeDamage

| Метод | Поведение | Когда использовать |
|-------|-----------|-------------------|
| `humanoid.Health = 0` | Мгновенная смерть | Kill brick, ловушка |
| `humanoid:TakeDamage(25)` | Постепенный урон | яды, лава, платформы |

---

## Шаг 4: Разные типы Kill Bricks

Создай 5 разных препятствий на платформе:

### 4.1 Красный кирпич (мгновенная смерть)

```lua
-- KillBrick: мгновенная смерть
local brick = script.Parent

brick.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.Health = 0
    end
end)
```

### 4.2 Оранжевый кирпич (периодический урон)

```lua
-- PoisonBrick: 10 урона каждые 0.5 сек, пока игрок стоит на кирпиче
local brick = script.Parent
local DAMAGE = 10
local RATE = 0.5  -- интервал между уронами (секунды)

local onBrick = {}  -- какие гуманоиды сейчас стоят на кирпиче

brick.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid and not onBrick[humanoid] then
        onBrick[humanoid] = true

        -- Наносим урон по таймеру, пока игрок стоит на кирпиче
        while onBrick[humanoid] and humanoid.Health > 0 do
            humanoid:TakeDamage(DAMAGE)
            task.wait(RATE)
        end
    end
end)

brick.TouchEnded:Connect(function(hit)
    -- Игрок сошёл с кирпича — прекращаем урон
    local humanoid = hit.Parent and hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        onBrick[humanoid] = nil
    end
end)
```

> **TouchEnded** — событие, обратное Touched: срабатывает когда часть перестаёт касаться. Пока игрок стоит на кирпиче, цикл наносит `DAMAGE` каждые `RATE` секунд.

### 4.3 Жёлтый кирпич (отбрасывание)

```lua
-- LaunchBrick: отбрасывает игрока вверх
local brick = script.Parent
local FORCE = 50  -- сила отбрасывания

brick.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")
    local rootPart = character:FindFirstChild("HumanoidRootPart")

    if humanoid and rootPart then
        -- Отбрасываем вверх
        local bodyVelocity = Instance.new("BodyVelocity")
        bodyVelocity.Velocity = Vector3.new(0, FORCE, 0)
        bodyVelocity.MaxForce = Vector3.new(0, FORCE, 0)
        bodyVelocity.Parent = rootPart

        -- Удаляем через 0.2 секунды
        game:GetService("Debris"):AddItem(bodyVelocity, 0.2)
    end
end)
```

> **BodyVelocity** — объект, который придаёт скорость. `Debris:AddItem(obj, time)` автоматически удаляет объект через указанное время.

### 4.4 Синий кирпич (замедление)

```lua
-- SlowBrick: временно замедляет игрока
local brick = script.Parent
local SLOW_SPEED = 2  -- замедленная скорость
local SLOW_TIME = 3   -- сколько секунд держится замедление
local debounce = false

brick.Touched:Connect(function(hit)
    local character = hit.Parent
    local humanoid = character:FindFirstChild("Humanoid")

    if humanoid and not debounce and humanoid.Health > 0 then
        debounce = true

        -- Запоминаем скорость, которая была до касания
        local originalSpeed = humanoid.WalkSpeed

        humanoid.WalkSpeed = SLOW_SPEED
        print("Замедление!")

        task.wait(SLOW_TIME)

        -- Восстанавливаем исходную скорость (если игрок ещё жив)
        if humanoid.Health > 0 then
            humanoid.WalkSpeed = originalSpeed
            print("Скорость восстановлена!")
        end

        debounce = false
    end
end)
```

> **WalkSpeed** — скорость ходьбы. По умолчанию 16. Мы не хардкодим «нормальную» скорость, а запоминаем ту, что была до касания: так замедление не сломается, если игрок уже замедлен чем-то другим.

### 4.5 Фиолетовый кирпич (невидимая стена)

```lua
-- InvisibleWall: незаметная стена, убивает при касании
local brick = script.Parent
brick.Transparency = 1  -- делаем невидимым
brick.CanCollide = true  -- но физика остаётся

brick.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.Health = 0
        print("Попался в ловушку!")
    end
end)
```

---

## Шаг 5: Мини-проект — платформа с 3 уровнями

Собери все вместе:

### Уровень 1: Простой

5 синих платформ, на каждой по одной красной Kill Brick. Добеги до конца.

### Уровень 2: Средний

- 3 платформы с постепенным уроном (оранжевые)
- 2 движущиеся платформы (пока просто статичные — движение изучим в Фазе 3)
- Синяя платформа с замедлением

### Уровень 3: Сложный

- Невидимые стены между платформами
- Жёлтые отбрасывающие кирпичи
- Длинный коридор с poison bricks

### Структура

```
Workspace
├── Level1
│   ├── Platform1 (5 штук)
│   └── KillBrick (5 штук)
├── Level2
│   ├── Platform2 (5 штук)
│   ├── DamageBrick (3 штук)
│   └── SlowBrick (1 штука)
└── Level3
    ├── Platform3 (5 штук)
    ├── InvisibleWall (2 штуки)
    └── LaunchBrick (2 штуки)
```

> **Совет:** используй Group (выдели объекты → правой кнопкой → Group), чтобы объединить уровень в одну модель. Так удобнее перемещать.

---

## Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| Урон наносится 2-3 раза за касание | Нет debounce | Добавь флаг `debounce = false` и `task.wait()` |
| Kill Brick не убивает | Внутри кирпича LocalScript — сервер его не выполняет | Замени на обычный **Script** (правая кнопка по кирпичу → Insert Object → Script) |
| "Health is not a valid member" | Объект не Humanoid | Проверь `hit.Parent:FindFirstChild("Humanoid")` |
| Весь персонаж умирает сразу | Все части касаются одновременно | Это нормально, debounce решает проблему повторного урона |
| `TakeDamage` не работает | Health уже = 0 | Проверь что `humanoid.Health > 0` перед уроном |
| Невидимый кирпич не убивает | Transparency = 1 + CanCollide = false | Для невидимой стены нужно `CanCollide = true` |
| Игрок проваливается сквозь платформу | Part не Anchored или размер слишком мал | Увеличь Size, проверь Anchored |

---

## Итог: что ты теперь умеешь

- [ ] Создавать kill brick с `Health = 0`
- [ ] Реализовать debounce (флаг + task.wait)
- [ ] Использовать `TakeDamage()` для постепенного урона
- [ ] Создавать невидимые ловушки (`Transparency = 1`)
- [ ] Отбрасывать игрока (`BodyVelocity`)
- [ ] Замедлять игрока (`WalkSpeed`)
- [ ] Организовывать объекты в группы (модели)
- [ ] Понимать разницу между instant kill и gradual damage

---

## Следующий шаг

Готов к следующей фазе? → **[Фаза 3: TweenService — движение платформ](./phase-3-tween.md)**

Там ты научишься анимировать платформы, делать движущиеся платформы и ловушки.

---

## Ссылки для углубления

| Тема | Ссылка |
|------|--------|
| Событие Touched | https://create.roblox.com/docs/reference/engine/classes/BasePart#Touched |
| Humanoid.Health | https://create.roblox.com/docs/reference/engine/classes/Humanoid#Health |
| TakeDamage | https://create.roblox.com/docs/reference/engine/classes/Humanoid#TakeDamage |
| BodyVelocity (устаревшее, но рабочее) | https://create.roblox.com/docs/reference/engine/classes/BodyVelocity |
| Debris Service | https://create.roblox.com/docs/reference/engine/services/Debris |
| WalkSpeed | https://create.roblox.com/docs/reference/engine/classes/Humanoid#WalkSpeed |
| DevForum: Debounce patterns | https://devforum.roblox.com/t/debounce-patterns/156978 |

---

*Фаза 2 из [плана обучения](../roblox-learning-plan.md). Предыдущая: [Фаза 1](./phase-1-studio.md) | Следующая: [Фаза 3](./phase-3-tween.md)*
