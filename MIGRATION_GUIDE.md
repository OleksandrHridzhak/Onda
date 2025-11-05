# Міграційний посібник - ID та окреме зберігання колонок

## Що було змінено

### 1. Додано поле `id` до всіх колонок
- Кожна колонка має унікальний `id` (генерується автоматично)
- `id` використовується як ключ в IndexedDB
- Старе поле `ColumnId` більше не використовується у новій системі

### 2. IndexedDB - окреме зберігання колонок
- **Версія бази: 1 → 2**
- Нове сховище: `columns` (keyPath: 'id')
- Старе сховище `weeks.body` залишається для зворотної сумісності

## Автоматична міграція

Міграція відбувається **автоматично** при першому завантаженні:

```javascript
// У TableLogicRefactored.jsx
await migrateColumnsFromWeeks();
```

### Що конвертується:

| Старе поле | Нове поле | Примітка |
|------------|-----------|----------|
| `ColumnId` | `id` | Зберігається якщо є, інакше генерується новий |
| `Type` | `type` | Без змін |
| `EmojiIcon` | `emojiIcon` | camelCase |
| `Width` | `width` | Без змін |
| `NameVisible` | `nameVisible` | camelCase |
| `Description` | `description` | Без змін |
| `Chosen` | `days` | Для day-based колонок |
| `Chosen.global` | `tasks` | Для todo/tasktable |
| `Options` | `options` | Без змін |
| `TagColors` | `tagColors` | camelCase |
| `CheckboxColor` | `checkboxColor` | camelCase |
| `DoneTags` | `doneTags` | camelCase |

## Нові функції API

### columnsDB.js

```javascript
import { 
  getAllColumns,      // Отримати всі колонки
  getColumnById,      // Отримати одну колонку за id
  addColumn,          // Додати нову колонку
  updateColumn,       // Оновити існуючу
  deleteColumn,       // Видалити за id
  getColumnsOrder,    // Отримати порядок колонок
  updateColumnsOrder  // Зберегти порядок
} from './services/columnsDB';
```

### Приклади використання

```javascript
// Створити та зберегти нову колонку
const newColumn = createColumn('checkbox');
await addColumn(newColumn.toJSON());

// Оновити колонку
column.setWidth(200);
await updateColumn(column.toJSON());

// Видалити колонку
await deleteColumn(column.id);

// Отримати всі
const columns = await getAllColumns();
const instances = deserializeColumns(columns);
```

## Оновлені компоненти

### TableLogicRefactored.jsx
- Використовує `getAllColumns()` замість `getWeek()`
- Автоматична міграція при завантаженні
- Робота з `column.id` замість `column.ColumnId`

### ColumnMenuLogicRefactored.jsx
- Імпорт з `columnsDB` замість `indexedDB`
- `updateColumn()` і `deleteColumn()` працюють з новим API

## Тестування міграції

### Крок 1: Перевірити стару базу
```javascript
// В консолі браузера
const db = await indexedDB.open('ondaDB', 1);
// Перевірити weeks.body
```

### Крок 2: Запустити міграцію
```javascript
import { migrateColumnsFromWeeks } from './services/columnsDB';
const result = await migrateColumnsFromWeeks();
console.log(result); // { status: 'Migration completed', count: 5 }
```

### Крок 3: Перевірити нові дані
```javascript
import { getAllColumns } from './services/columnsDB';
const columns = await getAllColumns();
console.log(columns); // Масив колонок з id
```

## Відкат (якщо потрібно)

Старі дані в `weeks.body` **не видаляються** при міграції:

1. Змінити версію бази назад на 1
2. Видалити `columns` store
3. Повернутися до старих функцій `getWeek()` / `updateColumn()`

## Сумісність

- ✅ Старі дані автоматично мігруються
- ✅ Можна використовувати обидва API паралельно (перехідний період)
- ✅ Міграція запускається тільки раз (перевіряє чи є дані в `columns`)
- ⚠️ Після міграції рекомендується використовувати тільки новий API

## Чеклист перед деплоєм

- [ ] Перевірити міграцію на тестових даних
- [ ] Переконатися що всі колонки мають `id`
- [ ] Протестувати CRUD операції
- [ ] Перевірити порядок колонок
- [ ] Створити бекап старої бази даних

## Питання та відповіді

**Q: Чи можна видалити старе сховище `weeks`?**  
A: Так, але тільки після того як переконаєтесь що міграція пройшла успішно для всіх користувачів.

**Q: Що якщо у старих даних немає `ColumnId`?**  
A: Міграція згенерує новий унікальний `id` автоматично.

**Q: Чи потрібно оновлювати всі компоненти одразу?**  
A: Ні, можна поступово. Рефакторені компоненти працюють з новим API, старі - зі старим.

**Q: Як зберегти порядок колонок?**  
A: Використовуйте `updateColumnsOrder([id1, id2, ...])` після зміни порядку.
