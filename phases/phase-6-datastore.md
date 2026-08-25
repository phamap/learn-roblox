# Фаза 6: DataStore — сохранение данных

**Цель:** научиться сохранять данные игроков между сессиями.
**Итог:** сохранение прогресса (чекпоинты, смерти) в DataStore, загрузка при входе.
**Время:** 3-4 часа (2 недели по 1-2 часа).
**Предыдущая фаза:** [Фаза 5.5: RemoteEvent — клиент-сервер](./phase-5-5-remote.md)

---

## Что ты сможешь после этой фазы

- Использовать DataStoreService для хранения данных
- Сохранять и загружать данные при входе/выходе
- Обновлять данные в реальном времени
- Обрабатывать ошибки сохранения

---

## Шаг 1: Зачем DataStore

Без DataStore данные хранятся только во время сессии. Когда игрок выходит — всё теряется. DataStore позволяет сохранять данные на сервере Roblox между сессиями.

> **Важно:** DataStore работает только на **сервере** (Script). Клиент не может напрямую обращаться к DataStore.

---

## Шаг 2: Первое сохранение

### 2.1 Включи API

1. В Studio нажми **Game Settings** → **Security**
2. Включи **Enable Studio Access to API Services**
3. Нажми **Save**

> Это нужно чтобы DataStore работал в Studio. В опубликованной игре это уже включено.

### 2.2 Серверный скрипт

Создай **Script** в **ServerScriptService**:

```lua
-- DataStoreManager: сохраняет и загружает данные
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

-- Получаем DataStore
local myDataStore = DataStoreService:GetDataStore("PlayerData")

-- Когда игрок заходит
Players.PlayerAdded:Connect(function(player)
    -- Загружаем данные
    local success, data = pcall(function()
        return myDataStore:GetAsync("player_" .. player.UserId)
    end)

    if success then
        if data then
            print(player.Name .. " загружен: " .. tostring(data))
        else
            print(player.Name .. " новый игрок, данных нет")
        end
    else
        warn("Ошибка загрузки данных для " .. player.Name)
    end
end)
```

> **pcall** (protected call) — обёртка которая не крашит скрипт при ошибке. DataStore может быть недоступен, поэтому всегда используй pcall.

---

## Шаг 3: Сохранение прогресса

### 3.1 Загрузка при входе

```lua
-- Загружаем прогресс
Players.PlayerAdded:Connect(function(player)
    local success, data = pcall(function()
        return myDataStore:GetAsync("player_" .. player.UserId)
    end)

    if success and data then
        -- Восстанавливаем данные
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats then
            local deaths = leaderstats:FindFirstChild("Deaths")
            if deaths and data.deaths then
                deaths.Value = data.deaths
            end
        end
    end
end)
```

### 3.2 Сохранение при выходе

```lua
-- Сохраняем при выходе
Players.PlayerRemoving:Connect(function(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if leaderstats then
        local deaths = leaderstats:FindFirstChild("Deaths")
        if deaths then
            local data = {
                deaths = deaths.Value
            }

            local success, err = pcall(function()
                myDataStore:SetAsync("player_" .. player.UserId, data)
            end)

            if success then
                print(player.Name .. " сохранён. Deaths: " .. deaths.Value)
            else
                warn("Ошибка сохранения для " .. player.Name .. ": " .. err)
            end
        end
    end
end)
```

### 3.3 Сохранение при краше сервера

```lua
-- Дополнительное сохранение при закрытии игры
game:BindToClose(function()
    for _, player in ipairs(Players:GetPlayers()) do
        -- Сохраняем всех игроков
        local leaderstats = player:FindFirstChild("leaderstats")
        if leaderstats then
            local deaths = leaderstats:FindFirstChild("Deaths")
            if deaths then
                local data = {
                    deaths = deaths.Value
                }

                pcall(function()
                    myDataStore:SetAsync("player_" .. player.UserId, data)
                end)
            end
        end
    end
end)
```

---

## Шаг 4: Автосохранение

### Проблема

Если сервер крашнется до выхода игрока, данные потеряются.

### Решение: периодическое сохранение

```lua
-- Автосохранение каждые 60 секунд
local AUTO_SAVE_INTERVAL = 60

local function autoSave()
    while true do
        task.wait(AUTO_SAVE_INTERVAL)

        for _, player in ipairs(Players:GetPlayers()) do
            local leaderstats = player:FindFirstChild("leaderstats")
            if leaderstats then
                local deaths = leaderstats:FindFirstChild("Deaths")
                if deaths then
                    local data = {
                        deaths = deaths.Value
                    }

                    pcall(function()
                        myDataStore:SetAsync("player_" .. player.UserId, data)
                    end)
                end
            end
        end

        print("Автосохранение завершено!")
    end
end

-- Запускаем в отдельном потоке
task.spawn(autoSave)
```

> **task.spawn** — запускает функцию в отдельном потоке, не блокируя основной.

---

## Шаг 5: Обновление данных в реальном времени

### 5.1 UpdateAsync вместо SetAsync

```lua
-- Безопасное обновление: читаем → меняем → записываем
local function updatePlayerData(player, updateFunc)
    local key = "player_" .. player.UserId

    local success, err = pcall(function()
        myDataStore:UpdateAsync(key, function(oldData)
            -- oldData — текущие данные (или nil если новых нет)
            -- updateFunc возвращает новые данные
            return updateFunc(oldData)
        end)
    end)

    if not success then
        warn("Ошибка обновления для " .. player.Name .. ": " .. err)
    end
end

-- Использование
updatePlayerData(player, function(oldData)
    local data = oldData or {}
    data.deaths = (data.deaths or 0) + 1
    return data
end)
```

> **UpdateAsync** — атомарная операция. Другие серверы не могут изменить данные пока ты обновляешь.

---

## Шаг 6: Полный DataStoreManager

```lua
-- DataStoreManager: полная версия
local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")

local myDataStore = DataStoreService:GetDataStore("PlayerData")
local AUTO_SAVE_INTERVAL = 60

-- Загрузка данных
local function loadData(player)
    local success, data = pcall(function()
        return myDataStore:GetAsync("player_" .. player.UserId)
    end)

    if success and data then
        return data
    else
        if not success then
            warn("Ошибка загрузки для " .. player.Name)
        end
        return {}
    end
end

-- Сохранение данных
local function saveData(player)
    local leaderstats = player:FindFirstChild("leaderstats")
    if not leaderstats then return end

    local deaths = leaderstats:FindFirstChild("Deaths")
    if not deaths then return end

    local data = {
        deaths = deaths.Value
    }

    local success, err = pcall(function()
        myDataStore:SetAsync("player_" .. player.UserId, data)
    end)

    if success then
        print(player.Name .. " сохранён")
    else
        warn("Ошибка сохранения " .. player.Name .. ": " .. err)
    end
end

-- Обработчики
Players.PlayerAdded:Connect(function(player)
    local data = loadData(player)

    -- Создаём leaderstats
    local leaderstats = Instance.new("Folder")
    leaderstats.Name = "leaderstats"
    leaderstats.Parent = player

    local deaths = Instance.new("IntValue")
    deaths.Name = "Deaths"
    deaths.Value = data.deaths or 0
    deaths.Parent = leaderstats
end)

Players.PlayerRemoving:Connect(saveData)

game:BindToClose(function()
    for _, player in ipairs(Players:GetPlayers()) do
        saveData(player)
    end
end)

-- Автосохранение
task.spawn(function()
    while true do
        task.wait(AUTO_SAVE_INTERVAL)
        for _, player in ipairs(Players:GetPlayers()) do
            saveData(player)
        end
    end
end)
```

---

## Типичные ошибки

| Ошибка | Причина | Решение |
|--------|---------|---------|
| "API Services is not available" | API не включена в Studio | Game Settings → Security → Enable API Services |
| "Data request was cancelled" | Лимит запросов | Не делай больше 60 запросов в минуту |
| "Invalid data" | DataStore не принимает тип | Сохраняй только строки, числа, таблицы (не объекты) |
| Данные не загружаются | pcall ловит ошибку | Проверь warnings в Output |
| Данные теряются при краше | Нет BindToClose | Добавь BindToClose для экстренного сохранения |
| UpdateAsync конфликтует | Два сервера пишут одновременно | UpdateAsync безопаснее SetAsync |

---

## Итог: что ты теперь умеешь

- [ ] Включать API Services в Studio
- [ ] Использовать DataStoreService:GetDataStore()
- [ ] Загружать данные через GetAsync
- [ ] Сохранять данные через SetAsync
- [ ] Использовать pcall для обработки ошибок
- [ ] Сохранять при выходе (PlayerRemoving)
- [ ] Делать автосохранение
- [ ] Использовать UpdateAsync для атомарных обновлений
- [ ] Сохранять при краше сервера (BindToClose)

---

## Следующий шаг

Готов к следующей фазе? → **[Фаза 7: Полировка — звук, свет, декор](./phase-7-polish.md)**

Ты создал игру! Теперь пора сделать её красивой.

---

## Ссылки для углубления

| Тема | Ссылка |
|------|--------|
| DataStoreService | https://create.roblox.com/docs/reference/engine/services/DataStoreService |
| GetAsync | https://create.roblox.com/docs/reference/engine/classes/DataStore#GetAsync |
| SetAsync | https://create.roblox.com/docs/reference/engine/classes/DataStore#SetAsync |
| UpdateAsync | https://create.roblox.com/docs/reference/engine/classes/DataStore#UpdateAsync |
| BindToClose | https://create.roblox.com/docs/reference/engine/services/Roblox#BindToClose |
| Паттерны DataStore | https://create.roblox.com/docs/scripting/data/store-data |
| DevForum: DataStore tutorial | https://devforum.roblox.com/t/datastore-tutorial/156983 |

---

*Фаза 6 из [плана обучения](../roblox-learning-plan.md). Предыдущая: [Фаза 5.5](./phase-5-5-remote.md) | Следующая: [Фаза 7](./phase-7-polish.md)*
