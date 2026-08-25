# Lua для JS-программиста

Краткая шпаргалка: как писать на Lua, если знаешь JavaScript.

---

## Синтаксис рядом

| Концепция | JavaScript | Lua |
|-----------|-----------|-----|
| Объявление переменной | `let x = 10` | `local x = 10` |
| Константа | `const x = 10` | `local x = 10` (нет const) |
| Конкатенация | `"a" + "b"` | `"a" .. "b"` |
| Длина массива/строки | `arr.length` | `#arr` |
| Не равно | `!==` | `~=` |
| Пустое значение | `null` / `undefined` | `nil` |
| Truthy/Falsy | `0, "", null, undefined` = false | только `nil` и `false` = false |
| Логическое И | `&&` | `and` |
| Логическое ИЛИ | `\|\|` | `or` |
| Тернарный | `x ? a : b` | `x and a or b` (осторожно!) |
| typeof | `typeof x` | `type(x)` |

---

## Переменные и область видимости

```lua
local x = 10            -- локальная (всегда используй local!)
local name = "Roblox"
local flag = true
local nothing           -- nil

-- global = BAD (без local)
badVar = 100            -- глобальная, избегай
```

**Правило:** без `local` переменная становится глобальной. Всегда пиши `local`.

---

## Таблицы (массив + объект одновременно)

```lua
-- Объект (словарь / hashmap)
local player = {
    name = "Игрок",
    level = 5,
    hp = 100
}
print(player.name)          -- "Игрок"
player.xp = 250             -- добавить поле

-- Массив
local inventory = { "меч", "щит", "зелье" }
print(inventory[1])         -- "меч" (индексы с 1!)
print(#inventory)           -- 3 (длина)

-- Смешанный
local mixed = {
    "первый",               -- [1]
    "второй",               -- [2]
    key = "значение",       -- ключ-строка
}
```

**Ключевое отличие:** индексы начинаются с **1**, не с 0.

---

## Итерация

```lua
-- По массиву (только числовые индексы, по порядку)
for i, value in ipairs(inventory) do
    print(i, value)
end

-- По таблице (все ключи, порядок не гарантирован)
for key, value in pairs(player) do
    print(key, value)
end

-- Числовой цикл
for i = 1, 10 do       -- 1, 2, ... 10 (включительно)
    print(i)
end

for i = 10, 1, -1 do   -- 10, 9, ... 1
    print(i)
end

-- while
local n = 0
while n < 5 do
    n = n + 1
end
```

---

## Функции

```lua
-- Обычная функция
local function add(a, b)
    return a + b
end

-- Анонимная функция (коллбэк)
local greet = function(name)
    print("Привет, " .. name)
end

-- Множественные возвраты
local function getPosition()
    return 10, 20, 30
end
local x, y, z = getPosition()

-- Дефолтные аргументы (нет синтаксиса, делаем вручную)
local function greet(name)
    name = name or "незнакомец"
    print("Привет, " .. name)
end
```

---

## Условия

```lua
if hp <= 0 then
    print("мертв")
elseif hp < 30 then
    print("с较но")
elseif hp < 70 then
    print("ранен")
else
    print("ок")
end

-- Нет switch/case — используй if/elseif
-- Нет тернарного оператора, но есть:
local status = (hp > 0) and "жив" or "мертв"
```

---

## Ошибки

```lua
-- Ловить ошибки
local ok, err = pcall(function()
    error("что-то пошло не так")
end)
if not ok then
    print("Ошибка: " .. err)
end
```

---

## Ключевые отличия от JS

| JS | Lua | Почему |
|----|-----|--------|
| `{a: 1}` | `{a = 1}` | Инициализация таблицы |
| `arr[0]` | `arr[1]` | 1-based indexing |
| `null`, `undefined` | `nil` | Одно значение для «пусто» |
| `===` | `==` | Нет строгого сравнения |
| `class { }` | Metatables | Нет классов (но есть метатаблицы) |
| Arrow `=>` | `function() end` | Нет arrow-функций |
| `import/export` | `require` / `module` | Модули через `require` |
| `try/catch` | `pcall()` | Обработка ошибок |
| `this` | `self` (через `:`) | Контекст вызова |

---

## Метатаблицы (если коротко)

```lua
-- Ближайшее к "классу" в Lua
local Dog = {}
Dog.__index = Dog

function Dog.new(name)
    local self = setmetatable({}, Dog)
    self.name = name
    return self
end

function Dog:bark()          -- двоеточие = неявный self
    print(self.name .. ": гаф!")
end

local rex = Dog.new("Rex")
rex:bark()                   -- "Rex: гаф!"
```

---

## Полезные функции

| Функция | Что делает | Пример |
|---------|-----------|--------|
| `type(x)` | Тип значения | `type(42)` → `"number"` |
| `tostring(x)` | В строку | `tostring(42)` → `"42"` |
| `tonumber(s)` | Из строки | `tonumber("42")` → `42` |
| `print(...)` | Вывод | `print("hi")` |
| `error(msg)` | Выбросить ошибку | `error("нет!")` |
| `pcall(fn)` | Безопасный вызов | см. выше |
| `select("#", ...)` | Число аргументов | |
| `unpack(t)` | Таблица → аргументы | `unpack({1,2,3})` → `1,2,3` |

---

*Шпаргалка: Lua для JS-программиста. Дополняй по мере изучения.*
