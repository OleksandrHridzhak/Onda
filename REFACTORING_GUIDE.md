# Рефакторинг структури коду таблиці

## Нова архітектура

Код був розділений на логічні модулі для кращої читабельності та підтримки.

### Структура файлів

```
components/
├── utils/
│   ├── columnAdapter.js          # Конвертація між форматами
│   ├── columnCreator.ts           # Класи колонок
│   └── columnHelpers.ts           # Допоміжні функції
└── table/
    ├── hooks/
    │   ├── useColumnsData.js      # Завантаження даних
    │   ├── useColumnOperations.js # Операції з колонками
    │   └── useTableHandlers.js    # Обробники подій
    ├── columnMenu/
    │   └── ColumnMenuLogic.jsx    # Логіка меню колонок
    ├── TableLogicClean.jsx        # Чистий TableLogic (новий)
    └── TableLogic.jsx             # Старий файл (deprecated)
```

## Основні модулі

### 1. **columnAdapter.js**
Відповідає за конвертацію між класовим форматом та legacy форматом.

```javascript
// Конвертація класу -> legacy формат
const legacyColumn = instanceToLegacy(columnInstance);

// Оновлення класу з legacy updates
applyLegacyUpdates(instance, { Name: 'New Name' });

// Конвертація legacy -> JSON для БД
const json = legacyToJSON(legacyColumn);
```

**Чому важливо**: Вся логіка конвертації в одному місці, легко змінювати

### 2. **useColumnOperations.js**
Хук для всіх операцій оновлення колонок.

```javascript
const { updateDayData, updateTasks, updateProperties } = useColumnOperations(columns, setColumns);

// Оновити дані дня
await updateDayData(columnId, 'Monday', 'new value');

// Оновити tasks (Todo)
await updateTasks(columnId, [...newTasks]);

// Оновити властивості
await updateProperties(columnId, { Name: 'New Name', Width: 150 });
```

**Чому важливо**: Єдина точка для оновлення даних, автоматична конвертація форматів

### 3. **useColumnsData.js**
Хук для завантаження даних колонок та таблиці.

```javascript
const { columns, tableData, loading } = useColumnsData();
```

**Що робить**:
- Міграція старих даних
- Завантаження колонок з БД
- Десеріалізація в класи
- Конвертація в legacy формат
- Застосування порядку колонок
- Ініціалізація tableData

**Чому важливо**: Вся логіка завантаження в одному місці

### 4. **useTableHandlers.js**
Всі обробники подій таблиці.

```javascript
const {
  handleAddColumn,
  handleCellChange,
  handleAddTask,
  handleMoveColumn,
  handleChangeWidth,
  handleChangeOptions,
} = useTableHandlers(columns, setColumns, tableData, setTableData);
```

**Чому важливо**: Обробники згруповані логічно, легко знайти потрібний

### 5. **TableLogicClean.jsx**
Чистий основний хук, комбінує всі підхуки.

```javascript
export const useTableLogic = () => {
  // Дані
  const { columns, tableData, loading } = useColumnsData();
  
  // Обробники
  const handlers = useTableHandlers(columns, setColumns, tableData, setTableData);
  
  // Налаштування
  // ...
  
  return { columns, tableData, loading, ...handlers };
};
```

**Розмір**: ~220 рядків (було 700+)

### 6. **ColumnMenuLogic.jsx** (оновлений)
Спрощений за рахунок useColumnOperations.

```javascript
export const useColumnMenuLogic = (columns, setColumns) => {
  const { updateProperties } = useColumnOperations(columns, setColumns);
  
  const handleRename = (id, name) => updateProperties(id, { Name: name });
  const handleChangeIcon = (id, icon) => updateProperties(id, { EmojiIcon: icon });
  // ...
}
```

**Розмір**: ~90 рядків (було 150)

## Переваги нової структури

✅ **Читабельність**: Кожен модуль має чітку відповідальність
✅ **Підтримка**: Легко знайти де що змінювати
✅ **Тестування**: Кожен хук можна тестувати окремо
✅ **Повторне використання**: Хуки можна використовувати в інших компонентах
✅ **DRY**: Логіка конвертації форматів в одному місці
✅ **Менше помилок**: Менше дублювання коду

## Міграція

### Використання нового коду

Замініть в `Table.jsx`:

```javascript
// Було
import { useTableLogic } from './TableLogic';

// Стало
import { useTableLogic } from './TableLogicClean';
```

Все інше працює так само!

## Що далі?

1. Протестувати новий код
2. Якщо все працює - видалити старий `TableLogic.jsx`
3. Перейменувати `TableLogicClean.jsx` -> `TableLogic.jsx`
