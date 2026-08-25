# Фаза 3: TweenService — движение платформ

**Цель:** научиться анимировать объекты, создавать движущиеся платформы для Obby.
**Итог:** движущиеся платформы, петля, туда-обратно, разные стили анимации.
**Время:** 3-5 часов (2-3 недели по 1-2 часа).
**Предыдущая фаза:** [Фаза 2: Kill Brick + Touched](./phase-2-killbrick/)

---

## Что ты сможешь после этой фазы

- Анимировать движение Part из точки A в точку B
- Делать бесконечное движение (петля) и движение туда-обратно
- Использовать разные стили анимации (Linear, Sine, Bounce)
- Создавать движущиеся платформы для Obby

---

## Шаг 1: Первый Tween — движение вверх

### 1.1 Создай Part

1. Создай Part в Workspace
2. Настрой:

| Свойство | Значение |
|----------|----------|
| **Name** | `MovingPlatform` |
| **Size** | `6, 1, 6` |
| **Position** | `0, 3, 0` |
| **Color** | Синий |
| **Anchored** | ✅ |

### 1.2 Создай скрипт внутри MovingPlatform

```lua
-- Движение платформы из точки A в точку B
local platform = script.Parent
local TweenService = game:GetService("TweenService")

-- Начальная позиция
local startPos = platform.Position

-- Конечная позиция (подняться на 15 стёп вверх)
local endPos = startPos + Vector3.new(0, 15, 0)

-- Настройка анимации
local tweenInfo = TweenInfo.new(
    3,              -- длительность (секунды)
    Enum.EasingStyle.Linear,  -- стиль анимации
    Enum.EasingDirection.Out, -- направление
    -1,             -- повторять бесконечно (-1)
    true            -- туда-обратно
)

-- Создаём tween
local tween = TweenService:Create(platform, tweenInfo, {Position = endPos})

-- Запускаем
tween:Play()
```

### 1.3 Запусти Play

Платформа будет бесконечно двигаться вверх-вниз.

> **Что тут происходит:** `TweenService:Create()` создаёт анимацию между текущим состоянием и целевым. `TweenInfo.new()` описывает *как* двигаться.

---

## Шаг 2: Разбор TweenInfo

```lua
TweenInfo.new(
    duration,           -- время от начала до конца (секунды)
    EasingStyle,       -- стиль кривой анимации
    EasingDirection,   -- In, Out, InOut
    repeatCount,       -- сколько раз повторять (-1 = бесконечно)
    reverses,          -- туда-обратно?
    delayTime          -- задержка перед стартом
)
```

### EasingStyle — стили анимации

| Стиль | Поведение | Когда использовать |
|-------|-----------|-------------------|
| `Linear` | Равномерно | Платформы, конвейеры |
| `Sine` | Плавное ускорение/замедление | Подъёмники, лифты |
| `Bounce` | Отскоки в конце | Прыгающие платформы |
| `Elastic` | Резиновый отскок | Комичные эффекты |
| `Quad` | Квадратичное ускорение | Естественное движение |
| `Cubic` | Кубическое ускорение | Быстрые рывки |

### EasingDirection — направление

| Направление | Эффект |
|-------------|--------|
| `In` | Ускорение в начале |
| `Out` | Замедление в конце |
| `InOut` | Ускорение + замедление |

---

## Шаг 3: Практика — 3 платформы с разными стилями

Создай 3 платформы и посмотри разницу:

### 3.1 Линейная платформа

```lua
-- Платформа 1: равномерное движение
local platform = script.Parent
local TweenService = game:GetService("TweenService")

local tweenInfo = TweenInfo.new(
    3,
    Enum.EasingStyle.Linear,
    Enum.EasingDirection.InOut,
    -1,
    true
)

local tween = TweenService:Create(
    platform,
    tweenInfo,
    {Position = platform.Position + Vector3.new(15, 0, 0)}
)

tween:Play()
```

### 3.2 Платформа с Bounce

```lua
-- Платформа 2: отскоки
local platform = script.Parent
local TweenService = game:GetService("TweenService")

local tweenInfo = TweenInfo.new(
    2,
    Enum.EasingStyle.Bounce,
    Enum.EasingDirection.Out,
    -1,
    false
)

local tween = TweenService:Create(
    platform,
    tweenInfo,
    {Position = platform.Position + Vector3.new(0, 20, 0)}
)

tween:Play()
```

### 3.3 Платформа с Sine

```lua
-- Платформа 3: плавное ускорение/замедление
local platform = script.Parent
local TweenService = game:GetService("TweenService")

local tweenInfo = TweenInfo.new(
    4,
    Enum.EasingStyle.Sine,
    Enum.EasingDirection.InOut,
    -1,
    true
)

local tween = TweenService:Create(
    platform,
    tweenInfo,
    {Position = platform.Position + Vector3.new(0, 10, 0)}
)

tween:Play()
```

### Запусти и сравни

| Платформа | Стиль | Ощущение |
|-----------|-------|----------|
| Линейная | Linear | Равномерно, как эскалатор |
| Bounce | Bounce | Отскакивает в конце, прыгает |
| Sine | Sine | Плавно разгоняется и тормозит |

---

## Шаг 4: Горизонтальное движение

### 4.1 Платформа влево-вправо

```lua
-- Горизонтальная платформа
local platform = script.Parent
local TweenService = game:GetService("TweenService")

local startPos = platform.Position
local endPos = startPos + Vector3.new(20, 0, 0)  -- двигаем по X

local tweenInfo = TweenInfo.new(
    4,                              -- 4 секунды в одну сторону
    Enum.EasingStyle.Sine,
    Enum.EasingDirection.InOut,
    -1,                             -- бесконечно
    true                            -- туда-обратно
)

local tween = TweenService:Create(platform, tweenInfo, {Position = endPos})

tween:Play()
```

### 4.2 Платформа по диагонали

```lua
-- Диагональное движение
local platform = script.Parent
local TweenService = game:GetService("TweenService")

local startPos = platform.Position
local endPos = startPos + Vector3.new(15, 10, 15)  -- по X, Y и Z

local tweenInfo = TweenInfo.new(
    5,
    Enum.EasingStyle.Quad,
    Enum.EasingDirection.InOut,
    -1,
    true
)

local tween = TweenService:Create(platform, tweenInfo, {Position = endPos})

tween:Play()
```

---

## Шаг 5: Управление tween

### 5.1 Остановить tween

```lua
-- Cancel(): останавливает анимацию на текущей позиции
tween:Cancel()

-- Play(): запускает tween заново с начала
tween:Play()
```

### 5.2 Задержка перед стартом

```lua
local tweenInfo = TweenInfo.new(
    3,
    Enum.EasingStyle.Linear,
    Enum.EasingDirection.InOut,
    -1,
    true,
    2  -- задержка 2 секунды перед каждым повторением
)
```

### 5.3 Проверить состояние

```lua
if tween.PlaybackState == Enum.PlaybackState.Playing then
    print("Tween играет")
end
```

---

## Шаг 6: Мини-проект — движущийся Obby уровень

Создай уровень Obby с движущимися платформами:

### Структура

```
Workspace
├── StartPlatform (статичная)
├── MovingPlatforms
│   ├── Platform1 (горизонтальная, Linear)
│   ├── Platform2 (вертикальная, Sine)
│   ├── Platform3 (диагональная, Bounce)
│   └── Platform4 (круговая — комбинация)
├── KillZones (3 KillBrick из Фазы 2)
└── EndPlatform (статичная, финиш)
```

### Код для Platform4 (круговая траектория)

```lua
-- Круговое движение через смену целей
local platform = script.Parent
local TweenService = game:GetService("TweenService")

local center = platform.Position
local radius = 10
local STEP_ANGLE = 0.1   -- угол одного сегмента (радианы)
local segmentTime = 0.25 -- время анимации одного сегмента (секунды)
-- Полный оборот: 2π / STEP_ANGLE ≈ 63 сегмента → ~16 секунд
local angle = 0

while true do
    angle = angle + STEP_ANGLE
    local targetPos = center + Vector3.new(
        math.cos(angle) * radius,
        0,
        math.sin(angle) * radius
    )

    local tweenInfo = TweenInfo.new(segmentTime, Enum.EasingStyle.Linear)
    local tween = TweenService:Create(platform, tweenInfo, {Position = targetPos})
    tween:Play()
    tween.Completed:Wait()  -- ждём завершения сегмента, потом следующий
end
```

### Упражнение: мёртвая зона

Платформа, которая исчезает, когда игрок на неё наступает. Создай Part с именем `DeadZone` между платформами и добавь скрипт:

```lua
-- DeadZone: исчезает при касании — игрок проваливается
local zone = script.Parent

zone.Touched:Connect(function(hit)
    local humanoid = hit.Parent:FindFirstChild("Humanoid")
    if humanoid then
        zone.Transparency = 1   -- делаем невидимой
        zone.CanCollide = false -- отключаем физику — сквозь неё можно провалиться
    end
end)
```

> **Задание со звёздочкой*:** верни платформу через 3 секунды после исчезновения (`task.wait(3)` в отдельном потоке через `task.spawn`, затем `Transparency = 0` и `CanCollide = true`).

---

## Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| Платформа не двигается | Tween не создан или не Play() | Проверь что `tween:Play()` вызывается |
| Платформа двигается, но телепортирует игрока | Anchored = false | Включи Anchored для платформ |
| Движение рывками | Слишком короткий duration | Увеличь время (3-5 секунд) |
| TweenInfo.new() ошибка | Неправильные аргументы | Проверь порядок: duration, style, direction, repeats, reverse, delay |
| Платформа уезжает за карту | endPos слишком далеко | Проверь координаты, используй relative: `startPos + Vector3.new(...)` |
| Bounce не отскакивает | EasingDirection не тот | Для bounce используй `Out` |

---

## Итог: что ты теперь умеешь

- [ ] Создавать tween через TweenService
- [ ] Настраивать TweenInfo (duration, style, direction)
- [ ] Делать бесконечное движение (repeatCount = -1)
- [ ] Делать туда-обратно (reverses = true)
- [ ] Использовать Linear, Sine, Bounce стили
- [ ] Анимировать позицию (Position) и другие свойства
- [ ] Управлять tween (Play, Cancel)
- [ ] Создавать движущиеся платформы для Obby

---

## Следующий шаг

Готов к следующей фазе? → **[Фаза 4: Чекпоинты и респавн](./phase-4-checkpoints/)**

Там ты научишься делать чекпоинты, чтобы игрок respawn'ился не в начале, а на последнем пройденном этапе.

---

## Ссылки для углубления

| Тема | Ссылка |
|------|--------|
| TweenService (документация) | https://create.roblox.com/docs/reference/engine/services/TweenService |
| TweenInfo | https://create.roblox.com/docs/reference/engine/datatypes/TweenInfo |
| EasingStyle | https://create.roblox.com/docs/reference/engine/enum/EasingStyle |
| EasingDirection | https://create.roblox.com/docs/reference/engine/enum/EasingDirection |
| DevForum: Tween tutorials | https://devforum.roblox.com/t/tweening-tutorial/156979 |

---

*Фаза 3 из [плана обучения](../../). Предыдущая: [Фаза 2](./phase-2-killbrick/) | Следующая: [Фаза 4](./phase-4-checkpoints/)*
