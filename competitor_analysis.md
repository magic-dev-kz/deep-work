# Deep Work Timer -- Competitive Research

**Author:** Molot (Recon Agent)
**Date:** 2026-03-29
**Format:** RECON + COMPARISON

---

## 1. Прямые конкуренты

### Tier A -- массовые продукты (1M+ пользователей)

#### Forest
- **Цена:** $3.99 iOS (одноразово), бесплатно Android (с рекламой)
- **Рейтинг:** 4.8 iOS (16K отзывов), 4.4 Android (760K отзывов)
- **Фичи:** Геймификация (сажаешь дерево, если уходишь -- оно умирает), Deep Focus mode, таймер 10-180 мин, реальные деревья за монеты, мультиплеер
- **Целевая:** Студенты, борьба с телефонной зависимостью
- **Слабости:** Нет полноценного Pomodoro-цикла (нет автоматических перерывов), нет heatmap, нет тегов/категорий, тормозит при большом объёме данных, слабые алармы, геймификация надоедает через 2 недели

#### Focus To-Do
- **Цена:** Бесплатно, lifetime $10
- **Рейтинг:** 4.8
- **Фичи:** Pomodoro + таск-менеджер, кросс-платформа (iOS/Android/Mac/Windows/Chrome/Watch), статистика с графиками и календарём, Forest-подобная геймификация
- **Целевая:** Пользователи, которым нужен "всё в одном"
- **Слабости:** Таймер иногда сбрасывается и не считает время, потеря данных при пометке задачи как выполненной, стрик обнуляется без причины, нет тёмной темы в бесплатной версии, перегруженный UI, бэкграунд-режим на iPad ненадёжен

#### Pomofocus.io
- **Цена:** Бесплатно (с рекламой), Premium $3/мес или $54 lifetime
- **Рейтинг:** Нет App Store рейтинга (web-first)
- **Фичи:** Веб-таймер, три режима (pomodoro/short break/long break), задачи с шаблонами, отчёты (день/месяц/год), CSV export (premium), Todoist интеграция, проекты (premium)
- **Целевая:** Массовый пользователь, хочет простой таймер в браузере
- **Слабости:** Таймер останавливается при блокировке телефона (мобильная версия), реклама в бесплатной версии, аутэйджи сервиса, нет heatmap, нет offline-режима, базовый дизайн

### Tier B -- нишевые / Apple-экосистема

#### Session (Apple)
- **Цена:** Free basic, Pro $4.99/мес или $39.99/год
- **Рейтинг:** Высокий (Apple editors' choice уровень)
- **Фичи:** Лучший Apple-нативный таймер, Dynamic Island, Apple Watch, блокировка приложений, Slack интеграция, аналитика, ambient sounds, календарная интеграция
- **Целевая:** Apple power users
- **Слабости:** Дорого ("безумно дорого для таймера"), неинтуитивное управление (кнопка STOP спрятана за "..."), только Apple, нет web-версии, подписочная модель

#### Be Focused (Apple)
- **Цена:** Бесплатно, Pro $4.99 (one-time или подписка)
- **Рейтинг:** Высокий
- **Фичи:** Mac/iOS/Watch, задачи с привязкой Pomodoro, кастомизация таймеров, виджеты, 3D Touch
- **Целевая:** Apple-пользователи, которым нужно простое решение
- **Слабости:** Только Apple, базовая статистика, нет heatmap, нет web-версии

#### Flow (Apple)
- **Цена:** Free basic, Pro подписка
- **Фичи:** iOS/macOS/visionOS/watchOS, синхронизация таймера между устройствами
- **Слабости:** Только Apple, нет heatmap, нет web

### Tier C -- прямые конкуренты по heatmap

#### Pomotroid (Desktop, open source)
- **Цена:** Бесплатно, open source
- **Рейтинг:** GitHub stars
- **Фичи:** 52-недельный heatmap (!), дневная/недельная/all-time статистика, 37 тем, глобальные шорткаты, WebSocket API, desktop notifications
- **Целевая:** Разработчики, Linux/Mac/Windows
- **Слабости:** Desktop-only (Electron), нет мобильной/web версии, нет тегов, нет облачной синхронизации, только для гиков

#### Pomogrids (Web)
- **Цена:** Бесплатно
- **Фичи:** Calendar heatmap + Pomodoro таймер в браузере
- **Целевая:** Простой веб-таймер с визуализацией
- **Слабости:** Минимальный функционал, нет тегов, нет PWA, нет сообщества

### Tier D -- не таймеры, но конкурируют за ту же аудиторию

#### Toggl Track
- **Цена:** Free (базовый), $9/user/мес (Starter)
- **Фичи:** Time tracking + Pomodoro mode (в расширении), биллинг, инвойсы, проекты, клиенты, отчёты
- **Слабости для нашей ниши:** Pomodoro -- вторичная фича, нет heatmap, тяжёлый для "просто таймера", требует аккаунт

#### Reclaim.ai
- **Цена:** Free (базовый), $8/user/мес
- **Фичи:** AI-автоматизация календаря, Focus Time блоки, интеграция со Slack/Google Calendar
- **Слабости для нашей ниши:** Это AI-планировщик, не таймер. Другая категория. Требует аккаунт и интеграции.

#### WakaTime
- **Цена:** Free (базовый), Premium $11.99/мес
- **Фичи:** Автоматический трекинг кодинга, heatmap, дашборд, GitHub README интеграция, API
- **Слабости для нашей ниши:** Только кодинг (IDE плагин), не таймер вообще, не для дизайнеров/писателей

---

## 2. Feature Comparison Table

| Feature | **Deep Work Timer** | Forest | Pomofocus | Focus To-Do | Session | Pomotroid | Toggl |
|---|---|---|---|---|---|---|---|
| **Цена** | Бесплатно навсегда | $3.99 iOS | Free + $3/мес | Free + $10 lifetime | $4.99/мес | Бесплатно | Free + $9/мес |
| **Аккаунт** | Не нужен | Нужен | Опционально | Нужен для sync | Нужен | Не нужен | Нужен |
| **Timer types** | Pomodoro + custom | Один таймер | Pomodoro | Pomodoro + tasks | Pomodoro | Pomodoro | Pomodoro (extension) |
| **Tags/categories** | 6 preset | Нет | Проекты (premium) | Задачи + проекты | Нет (интеграции) | Нет | Проекты + клиенты |
| **Heatmap** | GitHub-style 365 дней | Нет | Нет | Нет | Нет | 52-week heatmap | Нет |
| **History/stats** | Today/week/month/streak | Базовая | Day/month/year | Графики + календарь | Аналитика | Daily/weekly/all-time | Полная |
| **Offline** | 100% | Да (локально) | Нет (web) | Частично | Да | Да (desktop) | Нет |
| **Dark mode** | Единственная тема | Есть | Нет | Нет (бесплатно) | Есть | 37 тем | Есть |
| **Notifications** | Browser + chime | Push | Browser | Push | Push + Dynamic Island | Desktop native | Push |
| **Spotify/music** | Нет | Нет | Ambient sounds | Нет | Ambient sounds | Нет | Нет |
| **Block distractions** | Нет | Да (exit = tree dies) | Нет | Нет | Да (app blocking) | Нет | Нет |
| **Team/social** | Нет | Мультиплеер | Нет | Group chats | Slack status | Нет | Команды |
| **Widget** | Нет (PWA) | Нет | Нет | Нет | Да | Нет | Нет |
| **Apple Watch** | Нет | Нет | Нет | Да | Да | Нет | Нет |
| **CSV export** | Да (бесплатно) | Нет | Premium ($54) | Premium | Нет | Нет | Да (premium) |
| **Платформа** | Web (любой браузер) | iOS/Android | Web + apps | Все платформы | Apple only | Desktop (Electron) | Все платформы |

---

## 3. Gap Analysis -- что платные конкуренты делают ЛУЧШЕ

### Блокировка отвлечений
Session и Forest блокируют приложения/сайты. Deep Work Timer не блокирует ничего. Это осознанное решение (таймер != blocker), но для части аудитории это must-have.

### Ambient sounds / музыка
Session и Pomofocus предлагают фоновые звуки. Наш продукт -- тишина. Для персоны "разработчик в наушниках" это норма (у них Spotify), но для "студент в библиотеке" -- минус.

### Кросс-девайс sync
Focus To-Do, Toggl, Session -- всё синхронизируется между устройствами. Наш подход (localStorage, no account) -- это сила (приватность, zero friction), но и слабость (сменил браузер = потерял историю).

### Apple Watch / виджеты
Session, Be Focused, Focus To-Do -- все на запястье. Наш PWA не может дать это. Это ограничение платформы, не продукта.

### Интеграции
Session интегрируется со Slack, Pomofocus с Todoist, Toggl с инвойсингом. У нас ноль интеграций. Для v1 это ОК, для v2 -- вопрос.

### Аналитика глубже
Toggl даёт breakdown по проектам и клиентам. Session даёт паттерны продуктивности. Наша статистика -- today/week/month/streak. Достаточно для MVP, но продвинутые пользователи захотят больше.

---

## 4. Негативные отзывы конкурентов (1-2 звезды) = наш roadmap

### Forest
- "Геймификация надоедает через 2 недели"
- "Нет нормального Pomodoro-цикла, нужно каждый раз заново запускать"
- "Нет таймерных нотификаций -- приходится открывать телефон чтобы проверить"
- "Приложение тормозит когда много данных"
- "Монеты списываются непонятно за что"

### Pomofocus
- "Таймер останавливается когда блокирую телефон -- какой смысл?"
- "Реклама в приложении для фокуса -- ирония"
- "Два раза за месяц сервис лежал"
- "Базовый дизайн, выглядит как учебный проект"

### Session
- "БЕЗУМНО дорого для таймера -- $40/год?!"
- "Кнопка STOP спрятана за три точки. Я 6 месяцев не мог нормально остановить сессию"
- "Слишком навязчивое, отвлекает само по себе"
- "80% функций есть в бесплатных аналогах"

### Focus To-Do
- "Таймер сбросился и не записал время -- потерял 2 часа работы"
- "Стрик обнулился после 47 дней без причины"
- "Отметил задачу как выполненную -- пропали данные за несколько дней"
- "Нет тёмной темы! В 2026 году!"
- "Пишу в саппорт -- тишина"

### Общие паттерны жалоб (= наши возможности):
1. **Потеря данных** -- самая болезненная проблема. localStorage + export = наш ответ
2. **Подписки за таймер** -- люди ненавидят платить за Pomodoro. Мы бесплатные навсегда
3. **Нет тёмной темы** -- у нас тёмная тема единственная. Готово
4. **Перегруженный UI** -- люди хотят ПРОСТОТУ. Мы -- один экран
5. **Ненадёжный бэкграунд** -- мобильные приложения убивают таймер в фоне. Веб-таймер с Web Audio API стабильнее
6. **Реклама в фокус-приложении** -- когнитивный диссонанс. У нас рекламы нет

---

## 5. Рекомендации для Deep Work Timer v2

### Tier 1 -- Высокий приоритет (следующий релиз)

**1. Import/Export данных + backup reminder**
- Уже есть CSV export. Добавить JSON import/export для бэкапа
- Раз в 30 дней показывать ненавязчивое напоминание "Скачай бэкап" (один dismiss)
- Это решает главную боль конкурентов: потеря данных

**2. Keyboard shortcuts**
- Space = start/pause, S = skip, 1-4 = выбор длительности, T = сменить тег
- Целевая аудитория (разработчики) живёт на клавиатуре. Это бесплатный дифференциатор

**3. URL-параметры для автозапуска**
- `?duration=50&tag=Code&autostart=true`
- Позволяет интегрировать в Alfred/Raycast/закладки/Notion
- Zero effort, огромная ценность для power users

**4. Звуковые настройки**
- Выбор звука: мягкий chime / sharp beep / тишина
- Регулировка громкости
- Одна из частых жалоб на конкурентов

### Tier 2 -- Средний приоритет (через 1-2 релиза)

**5. Фильтры в heatmap по тегу**
- Нажал "Code" -- heatmap показывает только Code-сессии
- Показывает, сколько времени уходит на код vs. дизайн vs. планирование

**6. Weekly goal**
- "Моя цель: 20 часов deep work в неделю"
- Progress bar на главном экране
- Простой, мотивирующий, не перегружает UI

**7. Pomodoro counter в title страницы**
- `(3/4) Deep Work Timer` -- видно во вкладке браузера
- Или favicon меняется на зелёный/красный кружок

**8. Полноценный PWA с install prompt**
- service worker для офлайн
- manifest.json для "Add to Home Screen"
- Иконки для всех разрешений

### Tier 3 -- Низкий приоритет (v3+)

**9. Мини-дашборд "Year in Review"**
- Генерация годовой карточки (shareable image) с итогами: "2026: 847 часов deep work, 1,423 сессии, longest streak 34 дня"
- Virality mechanic для Twitter/LinkedIn
- Аналог GitHub year in review

**10. API / webhook на завершение сессии**
- POST на указанный URL при завершении сессии
- Позволяет интеграцию с Notion, Zapier, Google Sheets, Telegram
- Для power users и автоматизаторов

**11. LocalStorage sync через URL**
- Генерация зашифрованного URL с данными (для переноса между браузерами)
- Или QR-код для переноса на мобильный

**12. Настраиваемые теги**
- Добавить/удалить/переименовать теги
- Кастомные цвета тегов

---

## 6. Позиционирование: формула WifiCard

### Persona + Function + Enemy + Emotion + Result

> **Для фрилансеров и разработчиков** (Persona)
> **которые хотят видеть свой прогресс в deep work** (Function)
> **но ненавидят подписки, аккаунты и перегруженные приложения** (Enemy)
> **Deep Work Timer даёт чувство контроля и честности перед собой** (Emotion)
> **через GitHub-style heatmap который растёт с каждой сессией** (Result)

### В чём ниша?

Deep Work Timer -- это **WakaTime для всей продуктивной работы, а не только кодинга**.

Разработчики уже привыкли к GitHub heatmap и WakaTime dashboard. Они интуитивно понимают визуальный язык: зелёные квадратики = прогресс. Но WakaTime трекает только код в IDE. А что с дизайном в Figma? Написанием документации? Планированием? Обучением?

Deep Work Timer закрывает этот gap:
- Тот же визуальный язык (heatmap)
- Та же аудитория (developers + tech people)
- Но для ЛЮБОЙ глубокой работы

### Враг

Не другие таймеры. **Враг -- это невидимость усилий.** Ты работал 8 часов, но не можешь доказать это ни клиенту, ни себе. Forest даёт деревья -- детский сад. Toggl даёт таблицы -- бухгалтерия. Deep Work Timer даёт heatmap -- визуальное доказательство, что ты не зря прожил этот год.

### Одно предложение для лендинга

**"Your deep work, visualized. Free. No account. No bullshit."**

---

## 7. Конкурентная карта (summary)

```
                    ПРОСТОЙ                          СЛОЖНЫЙ
                       |                                |
    FREE   Deep Work Timer          Pomotroid          Toggl (free)
                       |                                |
           Pomogrids   |   Pomofocus (free)             |
                       |                                |
    -------|-----------|----------------|----------------|--------
                       |                                |
    PAID   Forest      |   Be Focused Pro   Session     | Reclaim
                       |                                |
                       |   Focus To-Do      Toggl Pro   |
                       |                                |
                    ПРОСТОЙ                          СЛОЖНЫЙ
```

Deep Work Timer занимает уникальную позицию: **бесплатный + простой + с heatmap**.
Ни один конкурент не сочетает все три.

---

## Sources

- [Reclaim.ai -- Best Pomodoro Timer Apps](https://reclaim.ai/blog/best-pomodoro-timer-apps)
- [Zapier -- 6 Best Pomodoro Timer Apps](https://zapier.com/blog/best-pomodoro-apps/)
- [Pomofocus.io](https://pomofocus.io/)
- [Forest App Store](https://apps.apple.com/us/app/forest-focus-for-productivity/id866450515)
- [Session -- stayinsession.com](https://www.stayinsession.com/)
- [Pomotroid -- GitHub](https://github.com/splode/pomotroid)
- [Pomogrids](https://www.pomogrids.com/)
- [Focus To-Do](https://www.focustodo.cn/)
- [Be Focused -- App Store](https://apps.apple.com/us/app/be-focused-pomodoro-timer/id973134470)
- [Toggl Track Pomodoro](https://toggl.com/track/pomodoro-timer-toggl/)
- [Reclaim.ai Pricing](https://reclaim.ai/pricing)
- [WakaTime](https://wakatime.com/)
- [Session -- Indie Hackers AMA](https://www.indiehackers.com/post/i-made-session-a-productivity-timer-that-makes-5k-month-in-net-profit-ama-25b59d75f5)
- [Mindful Suite -- Best Pomodoro Timer Apps 2026](https://www.mindfulsuite.com/reviews/best-pomodoro-timer-apps)
- [JustUseApp -- Forest Reviews](https://justuseapp.com/en/app/866450515/forest-stay-focused/reviews)
- [TrustRadius -- Pomofocus Reviews](https://www.trustradius.com/products/pomofocus/reviews)
- [Setapp -- Session Reviews](https://setapp.com/apps/session/customer-reviews)
- [JustUseApp -- Focus To-Do Reviews](https://justuseapp.com/en/app/966057213/focus-to-do-focus-timer-tasks/reviews)
