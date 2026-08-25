# Фаза 7.5: Оптимизация производительности

**Цель:** научиться оптимизировать игру для быстрой работы.
**Итог:** оптимизированный Obby, понимание производительности, отладка.
**Время:** 2-3 часа (1-2 недели).
**Предыдущая фаза:** [Фаза 7: Полировка — звук, свет, декор](./phase-7-polish.md)

---

## Что ты сможешь после этой фазы

- Проверять производительность игры (FPS, memory)
- Оптимизировать количество Part'ов
- Использовать StreamingEnabled
- Настраивать Level of Detail (LOD)
- Исправлять проблемы с производительностью

---

## Шаг 1: Замер производительности

### 1.1 Microprofiler

1. Нажми **View** → **Microprofiler** (или Ctrl+M)
2. Появится панель с детализацией времени выполнения
3. Наведи на колонки — увидишь что скрипт выполняется

### 1.2 Stats

1. Нажми **View** → **Stats**
2. Появятся 4 вкладки:

| Вкладка | Что показывает |
|---------|----------------|
| **Summary** | Общая статистика (Part'ы, скрипты, соединения) |
| **Render** | Время рендеринга |
| **Network** | Сетевой трафик |
| **Server** | Время серверных скриптов |

### 1.3 Быстрый тест

```lua
-- Проверка FPS
local RunService = game:GetService("RunService")

local frames = 0
local startTime = tick()

RunService.Heartbeat:Connect(function()
    frames = frames + 1
end)

task.wait(10)  -- ждём 10 секунд
local fps = frames / 10
print("FPS: " .. math.floor(fps))

if fps < 30 then
    warn("Низкий FPS! Нужна оптимизация")
end
```

---

## Шаг 2: Оптимизация Part'ов

### 2.1 Проблема: слишком много Part'ов

Каждый Part — это объект для рендеринга и физики. Много Part'ов = медленная игра.

**Что влияет на производительность:**
- Общее количество объектов: каждый Part занимает память и время на рендеринг
- Каждый Part с `CanCollide = true` нагружает физику
- Сложные материалы (Neon, Glass) и большие текстуры дороже в отрисовке

> **Важно:** официального лимита «сколько Part'ов можно» не существует — FPS зависит от устройства игрока, геометрии и материалов. Ориентируйся на замеры из Шага 1, а не на универсальные цифры. Как эмпирическая оценка: несколько тысяч простых статичных Part'ов обычно держат 60 FPS на среднем ПК.

### 2.2 Решение: Union и Negate

1. Выдели несколько Part'ов
2. Нажми **Model** → **Union** (объединяет в один)
3. Или **Model** → **Negate** (вырезает форму)

> Union создаёт один объект вместо нескольких. Уменьшает количество Part'ов.

### 2.3 Решение: MeshPart

Используй **MeshPart** вместо группы Part'ов. Сделай модель в Blender/CSG и импортируй.

### 2.4 Проверка количества

```lua
-- Подсчёт Part'ов
local partCount = 0
for _, obj in ipairs(workspace:GetDescendants()) do
    if obj:IsA("BasePart") then
        partCount = partCount + 1
    end
end
print("Part'ов в игре: " .. partCount)
```

---

## Шаг 3: CanCollide оптимизация

### 3.1 Декоративные Part'ы

Для декораций (деревья, камни, вода) отключи физику:

```lua
-- Декоративный Part без физики
local decoration = workspace.Decorations.Tree
decoration.CanCollide = false
```

### 3.2 KillBrick оптимизация

KillBrick'ам не нужна физика если они тонкие:

```lua
-- Тонкий kill brick
local killBrick = script.Parent
killBrick.CanCollide = false  -- игрок проваливается, но Touched срабатывает
```

### 3.3 Скрипт проверки

```lua
-- Проверка CanCollide
local collidableParts = 0
local totalParts = 0

for _, obj in ipairs(workspace:GetDescendants()) do
    if obj:IsA("BasePart") then
        totalParts = totalParts + 1
        if obj.CanCollide then
            collidableParts = collidableParts + 1
        end
    end
end

print("Всего Part'ов: " .. totalParts)
print("С физикой: " .. collidableParts)
print("Без физики: " .. (totalParts - collidableParts))
```

---

## Шаг 4: StreamingEnabled

### 4.1 Что это

**StreamingEnabled** — функция Roblox, которая подгружает мир по мере приближения игрока. Уменьшает начальную загрузку и потребление памяти.

### 4.2 Включение

1. В Explorer найди **Workspace**
2. В Properties найди **StreamingEnabled**
3. Включи ✅

### 4.3 Настройка

| Свойство | Значение | Описание |
|----------|----------|----------|
| **StreamingEnabled** | ✅ | Включить стриминг |
| **PlayerDiscoveryRadius** | 500 | Радиус загрузки вокруг игрока |
| **RequestPriority** | 0 | Приоритет загрузки |

### 4.4 Что происходит

- Игрок загружается в начальной зоне
- По мере движения подгружаются новые зоны
- Дальние зоны выгружаются

> **Важно:** StreamingEnabled может сломать скрипты, которые обращаются к объектам далеко от игрока — объект ещё не загружен. Для таких объектов используй `WaitForChild()` **с таймаутом** (см. Фазу 4) и проверяй результат на nil. Но не оборачивай каждый доступ в WaitForChild: если объект гарантированно существует, прямая ссылка проще и надёжнее.

---

## Шаг 5: LOD (Level of Detail)

### 5.1 Автоматический LOD

Roblox автоматически уменьшает детализацию дальних объектов. Но можно настроить:

```lua
-- Уменьшаем детализацию для дальних объектов
for _, part in ipairs(workspace:GetDescendants()) do
    if part:IsA("BasePart") then
        -- Чем дальше — тем проще рендеринг
        part.RenderFidelity = Enum.RenderFidelity.Performance
    end
end
```

### 5.2 Collision Groups

Создай группы столкновений чтобы не проверять столкновения между ненужными объектами:

```lua
-- Пример: KillBrick не сталкивается с другими KillBrick
local PhysicsService = game:GetService("PhysicsService")

-- Создаём группы (в Studio через Physics Properties)
PhysicsService:RegisterCollisionGroup("KillBricks")
PhysicsService:RegisterCollisionGroup("Decorations")

-- Настраиваем: KillBricks не сталкиваются друг с другом
PhysicsService:CollisionGroupSetCollidable("KillBricks", "KillBricks", false)
PhysicsService:CollisionGroupSetCollidable("KillBricks", "Decorations", false)
```

---

## Шаг 6: Оптимизация скриптов

### 6.1 Избегай while true без task.wait

```lua
-- ПЛОХО: нагружает CPU
while true do
    -- что-то делаем
end

-- ХОРОШО: даём паузу
while true do
    -- что-то делаем
    task.wait(0.1)
end
```

### 6.2 Кэшируй Service

```lua
-- ПЛОХО: каждый раз ищет сервис
game:GetService("Players").PlayerAdded:Connect(...)

-- ХОРОШО: кэшируем
local Players = game:GetService("Players")
Players.PlayerAdded:Connect(...)
```

### 6.3 Используй task.spawn для параллельных задач

```lua
-- Параллельное сохранение
task.spawn(function()
    saveData(player1)
end)

task.spawn(function()
    saveData(player2)
end)
```

---

## Шаг 7: Чеклист оптимизации

### Общее

- [ ] Замер FPS (Шаг 1) показывает стабильные значения
- [ ] Декоративные Part'ы: `CanCollide = false`
- [ ] StreamingEnabled включен
- [ ] Нет `while true` без `task.wait()`

### Скрипты

- [ ] Services кэшированы
- [ ] Нет ресурсоемких вычислений в Heartbeat
- [ ] DataStore не спамит запросами
- [ ] RemoteEvent не отправляет слишком часто

### Рендеринг

- [ ] Текстуры не слишком большие (512x512 максимум)
- [ ] Материалы простые (неすべて Neon/Glass)
- [ ] Тени включены только для важных объектов

---

## Типичные ошибки

| Проблема | Причина | Решение |
|----------|---------|---------|
| Низкий FPS (<30) | Слишком много Part'ов | Оптимизируй, используй Union |
| Долгая загрузка | StreamingEnabled выключен | Включи StreamingEnabled |
| Лаги при входе | Все объекты загружаются сразу | StreamingEnabled + Remove Hints |
| Скрипт тормозит | while true без паузы | Добавь task.wait() |
| Память переполняется | ParticleEmitter без лимита | Ограничь Rate и Lifetime |
| Физика тормозит | Много CanCollide = true | Отключи CanCollide для декораций |

---

## Итог: что ты теперь умеешь

- [ ] Проверять FPS через Microprofiler и Stats
- [ ] Подсчитывать количество Part'ов
- [ ] Оптимизировать Part'ы (Union, CanCollide)
- [ ] Включать и настраивать StreamingEnabled
- [ ] Используй Collision Groups для оптимизации физики
- [ ] Оптимизировать скрипты (кэширование, task.wait)
- [ ] Проходить чеклист оптимизации

---

## Следующий шаг

Готов к финалу? → **[Фаза 8: Публикация — выложи игру!](./phase-8-publish.md)**

Твоя игра готова и оптимизирована. Пора поделиться с миром!

---

## Ссылки для углубления

| Тема | Ссылка |
|------|--------|
| StreamingEnabled | https://create.roblox.com/docs/reference/engine/classes/Workspace#StreamingEnabled |
| Microprofiler | https://create.roblox.com/docs/production/optimization/microprofiler |
| Collision Groups | https://create.roblox.com/docs/reference/engine/services/PhysicsService |
| Оптимизация производительности | https://create.roblox.com/docs/production/optimization |
| DevForum: Performance tips | https://devforum.roblox.com/t/performance-optimization/156985 |

---

*Фаза 7.5 из [плана обучения](../roblox-learning-plan.md). Предыдущая: [Фаза 7](./phase-7-polish.md) | Следующая: [Фаза 8](./phase-8-publish.md)*
