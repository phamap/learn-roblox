## ADDED Requirements

### Requirement: TweenService basics
Файл SHALL содержать инструкцию анимации Part из точки A в B с использованием TweenService.

#### Scenario: Platform moves between two points
- **WHEN** пользователь запускает Play
- **THEN** платформа плавно двигается между двумя точками

### Requirement: Loop and reverse
Фаза SHALL показать бесконечное движение (repeatCount = -1) и движение туда-обратно (reverse = true).

#### Scenario: Continuous movement
- **WHEN** tween настроен с repeatCount = -1
- **THEN** платформа двигается бесконечно

### Requirement: Easing styles
Фаза SHALL продемонстрировать минимум 3 стиля EasingStyle (Linear, Sine, Bounce).

#### Scenario: Different animation feels
- **WHEN** пользователь меняет EasingStyle
- **THEN** характер движения меняется (равномерное / плавное / отскок)
