# Нова архітектура колонок (Class-based)

## Що змінилося

Замість роботи з plain JavaScript об'єктами, тепер використовуються **класи TypeScript** для кожного типу колонки. Це дає:

- ✅ Інкапсуляцію логіки (методи всередині класів)
- ✅ Валідацію даних
- ✅ Простіше тестування
- ✅ Менше дублювання коду
- ✅ Легша міграція на TypeScript
- ✅ **Унікальний id для кожної колонки**
- ✅ **Окреме зберігання колонок в IndexedDB**

---

## Структура класів

### Базові класи

**`BaseColumn`** — абстрактний базовий клас для всіх колонок:
- Поля: `id`, `type`, `emojiIcon`, `width`, `nameVisible`, `description`
- Методи: `setEmojiIcon()`, `setWidth()`, `setNameVisible()`, `setDescription()`, `update()`, `toJSON()`
- **`id`** — унікальний ідентифікатор, генерується автоматично при створенні

**`DayBasedColumn`** — абстрактний клас для колонок з даними по днях (наслідує `BaseColumn`):
- Поля: `days` (Record<Day, string>)
- Методи: `clearDays()`, `toJSON()`

### Конкретні класи колонок

| Клас | Тип | Особливості |
|------|-----|-------------|
| `CheckBoxColumn` | checkbox | `checkboxColor`, `checkDay()` |
| `NumberBoxColumn` | numberbox | `setNumber()` |
| `TextBoxColumn` | text | `setText()` |
| `TodoColumn` | todo | `tasks[]`, `addTask()`, `toggleTask()` |
| `MultiSelectColumn` | multi-select | `options[]`, `tagColors`, `setTags()` |
| `MultiCheckboxColumn` | multicheckbox | `options[]`, `setChecked()` |
| `TaskTableColumn` | tasktable | `options[]`, `doneTags[]`, `addTask()`, `markAsDone()` |

---

## Використання

### Створення нової колонки

```javascript
import { createColumn } from './utils/columnCreator';

// Створити нову колонку за типом (id генерується автоматично)
const newColumn = createColumn('checkbox');
console.log(newColumn.id); // "1699123456789abc"
```

### Конвертація з/в JSON

```javascript
// Серіалізація (для збереження в IndexedDB)
const json = column.toJSON();
await updateColumn(json);

// Десеріалізація (відновлення з бази)
import { ColumnFactory } from './utils/columnCreator';
const column = ColumnFactory(jsonFromDB);
```

### Оновлення колонки

```javascript
// Використовуємо методи класу замість ручного редагування об'єкта
column.setWidth(150);
column.setEmojiIcon('Star');
column.setText('Monday', 'Hello');

// Зберігаємо (по id)
await updateColumn(column.toJSON());
```

---

## IndexedDB - окреме зберігання

### Нова структура бази даних

**Версія 2** додає окреме сховище `columns`:

```javascript
// Старе (версія 1):
weeks: [
  {
    id: 1,
    body: [column1, column2, ...] // масив колонок
  }
]

// Нове (версія 2):
columns: [
  { id: "abc123", type: "checkbox", ... },
  { id: "def456", type: "text", ... },
  { id: "ghi789", type: "todo", ... }
]
```

### Нові CRUD функції

```javascript
import { 
  getAllColumns, 
  addColumn, 
  updateColumn, 
  deleteColumn 
} from './services/columnsDB';

// Отримати всі колонки
const columns = await getAllColumns();

// Додати нову
await addColumn(columnData);

// Оновити існуючу (по id)
await updateColumn(columnData);

// Видалити (по id)
await deleteColumn(columnId);
```

### Порядок колонок

```javascript
import { getColumnsOrder, updateColumnsOrder } from './services/columnsDB';

// Отримати порядок
const order = await getColumnsOrder(); // ["abc123", "def456", ...]

// Зберегти новий порядок
await updateColumnsOrder(["def456", "abc123", ...]);
```

---

## Міграція старих даних

Функція `migrateColumnsFromWeeks()` автоматично конвертує дані зі старого формату:

```javascript
import { migrateColumnsFromWeeks } from './services/columnsDB';

// Викликається автоматично при першому завантаженні
await migrateColumnsFromWeeks();
```

**Що мігрується:**

```
ColumnId → id
Type → type
EmojiIcon → emojiIcon
Width → width
NameVisible → nameVisible
Description → description
Chosen → days (для day-based колонок)
Chosen.global → tasks (для todo/tasktable)
```

Міграція відбувається автоматично при завантаженні колонок у `TableLogicRefactored.jsx`.

---

## Рефакторинг логіки

### TableLogicRefactored.jsx

**Що спрощено:**
- Завантаження колонок: автоматична міграція + десеріалізація у класи
- `handleCellChange`: оновлює `column.days[day]` напряму
- `handleAddTask`: викликає `column.addTask()`
- `handleChangeWidth`: викликає `column.setWidth()`

**Переваги:**
- Менше коду (не треба вручну копіювати об'єкти)
- Валідація всередині методів класу
- Легше тестувати

### ColumnMenuLogicRefactored.jsx

**Що спрощено:**
- Єдина функція `updateColumnInstance()` — викликає методи класу та зберігає
- Всі handler'и використовують методи класів (`setEmojiIcon()`, `setDescription()`, тощо)

**Переваги:**
- DRY (Don't Repeat Yourself) — немає дублювання коду оновлення
- Автоматична валідація через методи класів
- Простіше додавати нові типи колонок

---

## Приклади використання

### Додавання задачі в TodoColumn

```javascript
const todoColumn = columns.find(c => c.type === 'todo');
todoColumn.addTask('Buy milk');
todoColumn.toggleTask(taskId);
await updateColumn(todoColumn.toJSON());
```

### Зміна тегів у MultiSelectColumn

```javascript
const multiSelect = columns.find(c => c.type === 'multi-select');
multiSelect.setTags('Monday', 'Work, Home');
multiSelect.addOption('Urgent', 'red');
await updateColumn(multiSelect.toJSON());
```

### Робота з TaskTableColumn

```javascript
const taskTable = columns.find(c => c.type === 'tasktable');
taskTable.addTask('New task', 'blue');
taskTable.markAsDone('Completed task');
await updateColumn(taskTable.toJSON());
```

---

## Файли проекту

| Файл | Призначення |
|------|-------------|
| `columnCreator.ts` | Класи колонок + ColumnFactory |
| `columnHelpers.ts` | Допоміжні функції (міграція, серіалізація) |
| `columnsDB.js` | **Нові CRUD функції для окремих колонок** |
| `indexedDB.js` | База даних (версія 2 з columns store) |
| `TableLogicRefactored.jsx` | Рефакторинг логіки таблиці |
| `ColumnMenuLogicRefactored.jsx` | Рефакторинг логіки меню колонок |

---

## Поступовий перехід

1. Нові файли (`*Refactored.jsx`) створені окремо — старий код працює
2. Можна поступово переключатися: замінити імпорт `TableLogic` → `TableLogicRefactored`
3. Міграція даних відбувається автоматично при першому завантаженні
4. Після тестування — видалити старі файли

---

## Підсумок

✅ Всі класи колонок мають унікальний `id`  
✅ Всі класи мають `toJSON()` і `fromJSON()`  
✅ Фабрика `ColumnFactory()` створює потрібний клас за типом  
✅ **Колонки зберігаються окремо в IndexedDB (`columns` store)**  
✅ **Нові CRUD функції в `columnsDB.js`**  
✅ Міграція старих даних автоматична (з `weeks.body` → `columns`)  
✅ Логіка спрощена — використовуємо методи класів  
✅ Підтримка порядку колонок через `getColumnsOrder()`  
✅ Коротка документація у цьому файлі  

**Тепер додавати нові фічі простіше — вся логіка інкапсульована у класах, а кожна колонка має свій унікальний id!**
