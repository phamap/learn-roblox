# Lua → Roblox: шпаргалка для программиста

Компактная выжимка для того, кто уже умеет программировать и хочет быстро
войти в курс Roblox Studio + Lua.

---

## 1. Синтаксис Lua (для тех, кто знает другой язык)

```lua
-- комментарий
local x = 10          -- переменная (local = локальная, используй всегда)
local s = "привет"
local t = true        -- bool

-- таблица = словарь + массив одновременно
local dict = { name = "Roblox", version = 1 }
print(dict.name)                      -- Roblox

local arr = { "a", "b", "c" }
print(arr[1])                         -- a  (индексы с 1!)
print(#arr)                           -- 3 (длина)

-- условия
if x > 5 then
  print("больше")
elseif x == 5 then
  print("равно")
else
  print("меньше")
end

-- циклы
for i = 1, 10 do print(i) end         -- 1..10 включительно
for i = 10, 1, -1 do print(i) end     -- шаг -1
local n = 0
while n < 5 do n = n + 1 end

-- функции
local function add(a, b)
  return a + b
end

-- nil = null/undefined
local z            -- nil
```

### Ключевые отличия от привычных языков
| Понятие | Lua |
|---|---|
| Индексы массивов | **с 1**, не с 0 |
| `nil` | нет значения; отсутствие ключа в таблице = `nil` |
| `and/or` | возвращают операнд: `x = y or 5` (default), `if x and y then` |
| `..` | конкатенация строк: `"a" .. 5` → `a5` |
| `~=` | не равно (не `!=`) |
| Функции | могут быть объявлены в любом порядке (до вызова) |
| `#arr` | длина таблицы-массива |

---

## 2. Как устроена игра: иерархия

Всё — объекты в дереве. Главный корень — `game`.

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

> Старый стиль `game.Workspace` работает, но для сервисов (Players, Lighting
> и т.д.) всегда пиши `game:GetService("...")` — так правильно и надёжнее.

---

## 3. Типы скриптов

| Тип | Где живёт | Кто исполняет | Когда использовать |
|---|---|---|---|
| **Script** | ServerScriptService, Workspace, внутрь моделей | сервер | вся логика игры: спавн, урон, экономика, проверка |
| **LocalScript** | StarterPlayer/StarterGui/внутрь PlayerGui | конкретный клиент | только своё устройство: ввод, камера, личный UI |
| **ModuleScript** | ReplicatedStorage и др. | не исполняется сам | библиотека функций, подключается через `require` |

**Золотое правило новичка:** вся реальная логика — в `Script`, клиентские
скрипты добавляй только когда поймёшь, зачем (иногда нужны оба + RemoteEvent).

---

## 4. Минимальный API (что понадобится в первом Obby)

### События
```lua
local part = script.Parent
part.Touched:Connect(function(otherPart)
    print("кто-то коснулся:", otherPart.Name)
end)
```
Все события подключаются через `:Connect(функция)`.

### Части и свойства
```lua
local part = script.Parent
part.Color = Color3.fromRGB(255, 0, 0)   -- красный
part.Material = Enum.Material.SmoothPlastic
part.Size = Vector3.new(4, 1, 4)
part.Anchored = true                     -- не падает (обязательно для статики)
```

### Игрок и Humanoid (здоровье)
```lua
local function onTouch(other)
    local model = other.Parent              -- модель игрока (у него Humanoid в корне)
    local humanoid = model:FindFirstChild("Humanoid")
    if humanoid then
        humanoid.Health = 0                 -- мгновенная смерть → респавн
        -- или humanoid:TakeDamage(20)
    end
end
script.Parent.Touched:Connect(onTouch)
```

### Таймеры
```lua
task.wait(1)          -- пауза 1 сек (внутри скрипта)
task.wait()           -- 1 кадр (сокращение от task.wait(0.03))

-- цикл каждые 2 секунды
while true do
    print("тик")
    task.wait(2)
end
```

### Спавн и чекпоинт (Obby)
- **SpawnLocation** — точка появления игрока.
- **Checkpoint** = SpawnLocation с `Neutral = true` (не перезаписывает цвет команды).
- При падении игрок возвращается к последнему заспавнившемуся SpawnLocation.

---

## 5. Стартовый «скелет» первой игры

```lua
-- Script в ServerScriptService
local Players = game:GetService("Players")
local TNT = game:GetService("ReplicatedStorage").Bomb   -- модель бомбы

Players.PlayerAdded:Connect(function(player)
    print(player.Name .. " вошёл в игру!")
end)

-- спавн бомбы каждые 5 секунд
while true do
    local bomb = TNT:Clone()
    bomb.Parent = workspace
    bomb.Position = Vector3.new(0, 10, 0)
    task.wait(5)
end
```

---

## 6. Отладка (ваш лучший друг)

- `print(...)` — вывод в окно **Output** (View → Output).
- Ошибки показываются красным в Output — читай последнюю строку, в ней указан
  скрипт и номер строки.
- `warn(...)` и `error("...")` — для предупреждений/ошибок.
- Command Bar (View → Command Bar): выполнить код прямо в студии:
  ```lua
  print(workspace.Baseplate.Size)
  ```

---

## 7. Частые грабли новичка

| Симптом | Причина |
|---|---|
| Скрипт не работает, ошибок нет | скрипт не `Script`, а `ModuleScript` / не в том сервисе |
| `script.Parent` = nil | скрипт лежит не там, где ожидаешь |
| Ничего не двигается | у Part `Anchored = true` |
| `.Touched` не срабатывает | обе части должны иметь `CanCollide` / двигаться, или часть без физики |
| `FindFirstChild` возвращает nil | имя не совпало — проверь регистр и `Name` |
| `attempt to index nil` | объект не найден — проверь путь через `game:FindFirstChild(...)` |
| Завис на `wait()` | используй `task.wait`, старый `wait()` deprecated |
| Индексация `arr[0]` | Lua начинает с 1 |

---

## 8. Полезные ссылки
- Официальные доки: https://create.roblox.com/docs
- Репозиторий примеров кода: https://create.roblox.com/docs/reference/engine
- Иерархия и описание всех классов: https://create.roblox.com/docs/reference/engine/classes

---

*Шпаргалка для личного изучения. Не заменяет официальную документацию.*
