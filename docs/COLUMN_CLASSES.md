# Column Class System Documentation

## Огляд (Overview)

Нова система колонок реалізована за допомогою класів для покращення підтримки та розробки. Система використовує об'єктно-орієнтований підхід із базовим класом `Column` та спеціалізованими класами для кожного типу колонки.

## Структура класів (Class Structure)

### Базовий клас Column

Базовий клас, який містить загальну функціональність для всіх типів колонок:

```javascript
class Column {
  constructor(config)
  generateId()           // Генерує унікальний ID
  getDefaultWidth()      // Повертає ширину за замовчуванням
  getDefaultChosen()     // Повертає значення за замовчуванням
  toJSON()              // Конвертує в JSON об'єкт
  updateValue(day, value) // Оновлює значення для дня
  getValue(day)         // Отримує значення для дня
  validate()            // Валідує колонку
}
```

### Спеціалізовані класи колонок

#### 1. CheckboxColumn
Клас для булевих чекбоксів:
- Властивість: `CheckboxColor`
- Ширина за замовчуванням: 50px
- Значення: boolean (true/false)

#### 2. NumberboxColumn
Клас для числових значень:
- Ширина за замовчуванням: 60px
- Значення: number or string

#### 3. TextColumn
Клас для текстових значень:
- Ширина за замовчуванням: 130px
- Значення: string

#### 4. MultiSelectColumn
Клас для множинного вибору тегів:
- Властивості: `Options`, `TagColors`
- Ширина за замовчуванням: 90px
- Методи: `addOption()`, `removeOption()`, `updateOption()`

#### 5. MultiCheckboxColumn
Клас для множинних чекбоксів:
- Властивості: `Options`, `TagColors`
- Ширина за замовчуванням: 50px
- Методи: `addOption()`, `removeOption()`

#### 6. TodoColumn
Клас для глобального списку завдань:
- Властивості: `Options`, `TagColors`
- Ширина за замовчуванням: 150px
- Методи: `addTodo()`, `updateTodo()`, `removeTodo()`

#### 7. TaskTableColumn
Клас для таблиці завдань:
- Властивості: `Options`, `TagColors`, `DoneTags`
- Ширина за замовчуванням: 150px
- Методи: `addTask()`, `markTaskDone()`

## ColumnFactory

Фабрика для створення екземплярів колонок:

```javascript
ColumnFactory.createColumn(type, config)  // Створює нову колонку
ColumnFactory.fromJSON(data)              // Створює з JSON об'єкта
ColumnFactory.getColumnTemplate(type)     // Отримує шаблон колонки
ColumnFactory.getAllTemplates()           // Отримує всі шаблони
```

## ColumnManager

Менеджер для управління екземплярами колонок:

```javascript
ColumnManager.toColumnInstance(data)       // Конвертує об'єкт в екземпляр
ColumnManager.toPlainObject(instance)      // Конвертує екземпляр в об'єкт
ColumnManager.createColumn(type, config)   // Створює нову колонку
ColumnManager.validateColumn(instance)     // Валідує колонку
ColumnManager.updateColumnValue(instance, day, value) // Оновлює значення
ColumnManager.cloneColumn(instance)        // Клонує колонку
```

## ColumnUtils

Утиліти для роботи з колонками:

```javascript
ColumnUtils.supportsOptions(type)          // Чи підтримує options
ColumnUtils.supportsTagColors(type)        // Чи підтримує tagColors
ColumnUtils.supportsCheckboxColor(type)    // Чи підтримує checkboxColor
ColumnUtils.isGlobalColumn(type)           // Чи є глобальною
ColumnUtils.getCellComponentName(type)     // Отримує назву компонента
ColumnUtils.calculateSummary(column, data, days) // Розраховує підсумок
ColumnUtils.getWidthStyle(column)          // Отримує стиль ширини
```

## Приклади використання (Usage Examples)

### Створення нової колонки

```javascript
import { ColumnFactory } from './columnClasses';

// Створення checkbox колонки
const checkboxColumn = ColumnFactory.createColumn('checkbox', {
  Name: 'Daily Task',
  CheckboxColor: 'blue',
});

// Створення multi-select колонки
const multiSelectColumn = ColumnFactory.createColumn('multi-select', {
  Name: 'Tags',
  Options: ['Work', 'Personal'],
  TagColors: { 'Work': 'blue', 'Personal': 'green' },
});
```

### Робота з існуючими даними

```javascript
import { ColumnManager } from './columnManager';

// Конвертація з JSON
const columnData = { Type: 'checkbox', Name: 'Task', ... };
const columnInstance = ColumnManager.toColumnInstance(columnData);

// Оновлення значення
ColumnManager.updateColumnValue(columnInstance, 'Monday', true);

// Конвертація назад в об'єкт для збереження
const plainObject = ColumnManager.toPlainObject(columnInstance);
```

### Додавання опцій

```javascript
// Для multi-select колонки
const column = ColumnFactory.createColumn('multi-select');
column.addOption('New Option', 'purple');
column.updateOption('Old Option', 'Updated Option');
column.removeOption('Unused Option');

// Для todo колонки
const todoColumn = ColumnFactory.createColumn('todo');
todoColumn.addTodo('New task');
todoColumn.updateTodo(todoId, { completed: true });
todoColumn.removeTodo(todoId);
```

## Переваги нового підходу (Benefits)

1. **Інкапсуляція**: Логіка кожного типу колонки інкапсульована в своєму класі
2. **Повторне використання**: Спільна логіка винесена в базовий клас
3. **Розширюваність**: Легко додавати нові типи колонок
4. **Валідація**: Вбудована валідація для кожного типу
5. **Type Safety**: Чітка структура та методи для кожного типу
6. **Maintainability**: Легше підтримувати та розуміти код

## Міграція (Migration)

Існуючий код продовжує працювати, оскільки:
- `ColumnFactory.getAllTemplates()` повертає ті ж структури даних
- `ColumnManager` надає методи конвертації між класами та об'єктами
- Система сумісна зі старими даними через метод `fromJSON()`

## Файли (Files)

- `/render/src/components/utils/columnClasses.js` - Класи колонок та фабрика
- `/render/src/components/utils/columnManager.js` - Менеджер та утиліти
- `/render/src/components/utils/fileTemplates.js` - Шаблони (оновлений)
