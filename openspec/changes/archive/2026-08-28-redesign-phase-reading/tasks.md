# Tasks: навигация и ориентация внутри фазы

## 1. Парсинг шагов на сервере

- [x] 1.1 В `src/pages/phases/[slug].astro` добавить парсинг `phase.body` регэкспом `/^##\s+Шаг\s+(\d+(?:\.\d+)?)\s*:?\s*(.*)$/gm` → `steps: {n: string, title: string}[]`
- [x] 1.2 Передать `steps` пропом в `PhaseLayout`
- [x] 1.3 Убедиться, что число шагов совпадает с визуальными `## Шаг N` на всех 12 фазах (проверка скриптом/вручную)

## 2. Разметка PhaseLayout: rail + sticky-блок

- [x] 2.1 В `PhaseLayout.astro` добавить `<nav class="step-rail">` со списком `steps` (номер-бейдж + заголовок, `data-step`, `href="#step-N"`)
- [x] 2.2 Добавить в `PhaseLayout` (или пробросить в BaseLayout) sticky-блок индикатора: «Фаза N · Шаг K/M» + `<div class="reading-track"><div class="reading-fill"></div></div>`
- [x] 2.3 Обернуть `<article>` и rail в контейнер для двухколоночной сетки

## 3. Стили в BaseLayout

- [x] 3.1 Сделать единый sticky-блок: `<header>` + индикатор чтения (`position: sticky; top: 0`, фон `--bg-soft`, тень, без layout-сдвига)
- [x] 3.2 Двухколоночная сетка на ≥900px: rail (≈240px, `position: sticky; top: <высота блока>`) + контент (max-width ≈680px)
- [x] 3.3 Скрыть rail и показать dropdown-вариант в sticky-блоке ниже 900px
- [x] 3.4 Стили rail: фон/бордер, номер-бейдж, состояние `.current` (акцент), scroll-past (приглушение) — на переменных Solarized
- [x] 3.5 Поправить `scroll-margin-top` заголовков на высоту sticky-блока + отступ

## 4. Клиентский слой: scroll-spy + scroll-%

- [x] 4.1 IntersectionObserver на heading'и шагов (`[data-step]`): выбрать верхний видимый как текущий, обновить «Шаг K/M» и класс `.current` на rail
- [x] 4.2 Scroll listener на `<article>`: обновлять ширину `.reading-fill` = % прокрутки
- [x] 4.3 Клик по rail-элементу → плавный `scrollIntoView` целевого heading (с учётом `scroll-margin-top`)
- [x] 4.4 Мобильный dropdown: переключение видимого шага и подсветка current

## 5. Верификация

- [x] 5.1 `npm run build` проходит успешно
- [x] 5.2 Ручные сценарии: открыть Фазу 1 на десктопе — rail виден, current подсвечивается при скролле, fill растёт; на мобиле rail свёрнут в dropdown; нижний чек-лист «Самопроверка X/N» и прогресс-бар работают как раньше
- [x] 5.3 Проверить крайние фазы (Фаза 1 и Фаза 8) и фазу с дробным номером (phase-5-5-remote, phase-7-5-optimization)
