# Calculator Calories (JS + Node.js + MongoDB)

Веб-застосунок для обліку калорій, макронутрієнтів, ваги та активності з UI-частиною і збереженням даних у MongoDB.

## Тема проєкту

**Тема:** Калькулятор калорій.


## Функціональність

### 1) Профіль користувача
- Збереження базових параметрів: ім'я, вік, стать, зріст, вага, активність.
- Автоматичний перерахунок BMR, TDEE та денної норми води.
- Автоматичний запис ваги при оновленні профілю.
- Файли:
  - [src/controllers/apiController.js](src/controllers/apiController.js)
  - [src/services/profileService.js](src/services/profileService.js)
  - [src/services/metabolismService.js](src/services/metabolismService.js)
  - [src/repositories/profileRepository.js](src/repositories/profileRepository.js)

### 2) Цілі по калоріях і макросах
- Створення цілей: схуднення / підтримка / набір.
- Рекомендовані цілі на основі профілю (TDEE + корекція).
- Розрахунок цільових грамів Б/Ж/В з ratios.
- Файли:
  - [src/services/goalService.js](src/services/goalService.js)
  - [src/services/metabolismService.js](src/services/metabolismService.js)
  - [public/js/modules/goalsModule.js](public/js/modules/goalsModule.js)

### 3) Прийоми їжі
- Додавання прийому їжі з бази продуктів.
- Автоматичний підрахунок калорій і Б/Ж/В за грамами.
- Відображення списку прийомів їжі за дату та видалення.
- Файли:
  - [src/services/mealService.js](src/services/mealService.js)
  - [src/repositories/mealRepository.js](src/repositories/mealRepository.js)
  - [public/js/modules/mealsModule.js](public/js/modules/mealsModule.js)

### 4) Фізична активність
- Додавання активності (назва, інтенсивність, тривалість).
- Оцінка витрачених калорій за MET-моделлю.
- Перегляд і видалення активностей за дату.
- Файли:
  - [src/services/activityService.js](src/services/activityService.js)
  - [src/repositories/activityRepository.js](src/repositories/activityRepository.js)
  - [public/js/modules/activitiesModule.js](public/js/modules/activitiesModule.js)

### 5) Контроль ваги
- Додавання замірів ваги з датою.
- 14-денний тренд (up/down/stable) зі slope-аналітикою.
- Відображення ряду точок ваги у UI.
- Файли:
  - [src/services/weightService.js](src/services/weightService.js)
  - [src/repositories/weightRepository.js](src/repositories/weightRepository.js)
  - [public/js/modules/weightModule.js](public/js/modules/weightModule.js)

### 6) Dashboard / аналітика
- Добовий snapshot: спожито, спалено, нетто, залишок.
- Тижневий ряд: consumed / burned / net.
- Збір агрегованої аналітики в одному сервісі.
- Файли:
  - [src/services/dashboardService.js](src/services/dashboardService.js)
  - [src/controllers/pageController.js](src/controllers/pageController.js)
  - [public/js/modules/dashboardModule.js](public/js/modules/dashboardModule.js)

### 7) UI-частина
- Server-side рендеринг через EJS.
- Окремі модулі фронтенду для кожної сутності.
- Робота форм через REST API без перезавантаження логіки вручну.
- Файли:
  - [views/pages/dashboard.ejs](views/pages/dashboard.ejs)
  - [public/js/app.js](public/js/app.js)
  - [public/js/modules](public/js/modules)

### 8) Збереження даних у БД
- Всі сутності зберігаються в MongoDB через Mongoose.
- Окремі моделі для профілю, цілей, продуктів, прийомів їжі, активностей, ваги.
- Файли:
  - [src/models/UserProfile.js](src/models/UserProfile.js)
  - [src/models/GoalPlan.js](src/models/GoalPlan.js)
  - [src/models/FoodItem.js](src/models/FoodItem.js)
  - [src/models/MealEntry.js](src/models/MealEntry.js)
  - [src/models/ActivityEntry.js](src/models/ActivityEntry.js)
  - [src/models/WeightEntry.js](src/models/WeightEntry.js)
  - [src/config/db.js](src/config/db.js)

## Programming Principles

1. **Single Responsibility Principle (SRP)**
   - Кожен рівень має свою відповідальність: модель, репозиторій, сервіс, контролер, UI-модуль.
   - Приклади: [src/services/mealService.js](src/services/mealService.js), [src/repositories/mealRepository.js](src/repositories/mealRepository.js), [public/js/modules/mealsModule.js](public/js/modules/mealsModule.js).

2. **Separation of Concerns**
   - Бізнес-логіка відділена від HTTP і від представлення.
   - Приклади: [src/controllers/apiController.js](src/controllers/apiController.js), [src/services/dashboardService.js](src/services/dashboardService.js), [views/pages/dashboard.ejs](views/pages/dashboard.ejs).

3. **DRY (Don’t Repeat Yourself)**
   - Загальні утиліти дат/математики/валідації винесено в окремі модулі.
   - Приклади: [src/utils/dateUtils.js](src/utils/dateUtils.js), [src/utils/mathUtils.js](src/utils/mathUtils.js), [src/utils/validators.js](src/utils/validators.js).

4. **KISS (Keep It Simple, Stupid)**
   - Проста зрозуміла архітектура без надмірних абстракцій.
   - Приклад: один `apiController` + окремі сервіси під сутності: [src/controllers/apiController.js](src/controllers/apiController.js).

5. **Dependency Injection (manual DI)**
   - Сервіси приймають репозиторії через конструктор, що полегшує тестування і заміну реалізацій.
   - Приклади: [src/services/mealService.js](src/services/mealService.js), [src/services/dashboardService.js](src/services/dashboardService.js).

6. **Defensive Programming**
   - Валідація вхідних даних і обмеження діапазонів.
   - Приклади: [src/utils/validators.js](src/utils/validators.js), [src/middleware/errorHandlers.js](src/middleware/errorHandlers.js).

## Design Patterns

1. **Repository Pattern**
   - Доступ до MongoDB інкапсульовано в репозиторіях.
   - Навіщо: ізолювати запити до БД від бізнес-логіки.
   - Приклади: [src/repositories/profileRepository.js](src/repositories/profileRepository.js), [src/repositories/mealRepository.js](src/repositories/mealRepository.js), [src/repositories/activityRepository.js](src/repositories/activityRepository.js).

2. **Factory Pattern**
   - `ServiceFactory` створює і кешує сервіси.
   - Навіщо: централізована точка створення залежностей.
   - Приклад: [src/services/serviceFactory.js](src/services/serviceFactory.js).

3. **Strategy Pattern (goal calculation strategy)**
   - Вибір різної стратегії обрахунку калорій залежно від `goalType` (`lose/maintain/gain`).
   - Навіщо: гнучко змінювати поведінку без змін зовнішнього API.
   - Приклади: [src/services/metabolismService.js](src/services/metabolismService.js), [src/services/goalService.js](src/services/goalService.js).

4. **Module Pattern (frontend ES modules)**
   - Кожен UI-блок реалізований окремим модулем.
   - Навіщо: локалізація стану й подій, легше масштабування UI.
   - Приклади: [public/js/modules/profileModule.js](public/js/modules/profileModule.js), [public/js/modules/mealsModule.js](public/js/modules/mealsModule.js), [public/js/modules/dashboardModule.js](public/js/modules/dashboardModule.js).

## Refactoring Techniques

1. **Extract Method**
   - Виділено окремі функції під нормалізацію, рендер і валідацію.
   - Приклади: [public/js/modules/mealsModule.js](public/js/modules/mealsModule.js), [src/services/mealService.js](src/services/mealService.js).

2. **Extract Class / Service**
   - Винесення логіки з контролерів у `*Service`.
   - Приклади: [src/services/profileService.js](src/services/profileService.js), [src/services/dashboardService.js](src/services/dashboardService.js).

3. **Introduce Parameter Object**
   - Використання `payload` для передачі параметрів між шарами.
   - Приклади: [src/controllers/apiController.js](src/controllers/apiController.js), [src/services/activityService.js](src/services/activityService.js).

4. **Replace Magic Numbers with Named Constants**
   - Константи активності й множники винесені в іменовані структури.
   - Приклади: [src/services/metabolismService.js](src/services/metabolismService.js), [src/services/activityService.js](src/services/activityService.js).

5. **Consolidate Duplicate Logic**
   - Повторювані обчислення і форматування обʼєднані в utils та formatters.
   - Приклади: [src/utils/mathUtils.js](src/utils/mathUtils.js), [public/js/modules/formatters.js](public/js/modules/formatters.js).

6. **Guard Clauses**
   - Раннє завершення при невалідному стані або відсутності даних.
   - Приклади: [src/services/goalService.js](src/services/goalService.js), [src/services/weightService.js](src/services/weightService.js).

## Структура проєкту

- [src](src) — серверна логіка (моделі, репозиторії, сервіси, контролери, роути, utils).
- [public/js](public/js) — клієнтська логіка (ES modules).
- [views/pages](views/pages) — EJS шаблони UI.
- [src/seed/seedFoods.js](src/seed/seedFoods.js) — заповнення базових продуктів.

## Локальний запуск

1. Встановіть залежності:
   ```bash
   npm install
   ```

2. Створіть `.env` на базі [.env.example](.env.example):
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/calorie_calculator
   APP_TIMEZONE=Europe/Kyiv
   ```

3. (Опційно) Заповніть базу продуктами:
   ```bash
   npm run seed
   ```

4. Запустіть застосунок:
   ```bash
   npm run dev
   ```

5. Відкрийте:
   - `http://localhost:3000`

## Перевірка розміру коду (.js)

Для підрахунку рядків JS у відстежуваних git-файлах:

```bash
git ls-files '*.js' | xargs wc -l
```

Або через npm-скрипт:

```bash
npm run count:js
```


