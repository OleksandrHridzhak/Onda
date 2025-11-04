# Column Classes Integration Guide

## Як використовувати нові класи колонок у вашому коді

### 1. Імпорт класів

```javascript
// У файлах, які працюють з колонками
import { ColumnFactory } from './components/utils/columnClasses';
import { ColumnManager, ColumnUtils } from './components/utils/columnManager';
```

### 2. Створення нових колонок

Замість прямого створення об'єктів, використовуйте ColumnFactory:

**Старий код:**
```javascript
const newColumn = {
  ColumnId: Date.now().toString(),
  Type: 'checkbox',
  Name: 'My Checkbox',
  CheckboxColor: 'blue',
  Width: 50,
  Chosen: {
    Monday: false,
    Tuesday: false,
    // ...
  }
};
```

**Новий код:**
```javascript
const newColumn = ColumnFactory.createColumn('checkbox', {
  Name: 'My Checkbox',
  CheckboxColor: 'blue',
});

// Конвертуємо в plain object для збереження в БД
const columnToSave = newColumn.toJSON();
```

### 3. Робота з існуючими даними

**При завантаженні з БД:**
```javascript
// Отримуємо дані з БД
const columnData = await getColumnFromDB();

// Конвертуємо в екземпляр класу
const columnInstance = ColumnFactory.fromJSON(columnData);

// Працюємо з методами класу
columnInstance.updateValue('Monday', true);

// Зберігаємо назад
await updateColumn(columnInstance.toJSON());
```

### 4. Додавання опцій до колонок

**Для multi-select колонок:**
```javascript
const multiSelectColumn = ColumnFactory.fromJSON(columnData);

// Додати нову опцію
multiSelectColumn.addOption('New Tag', 'purple');

// Оновити опцію
multiSelectColumn.updateOption('Old Tag', 'New Tag');

// Видалити опцію
multiSelectColumn.removeOption('Unused Tag');

// Зберегти зміни
await updateColumn(multiSelectColumn.toJSON());
```

**Для todo колонок:**
```javascript
const todoColumn = ColumnFactory.fromJSON(columnData);

// Додати todo
todoColumn.addTodo('Complete task');

// Оновити todo
todoColumn.updateTodo(todoId, { completed: true, text: 'Updated task' });

// Видалити todo
todoColumn.removeTodo(todoId);

// Зберегти зміни
await updateColumn(todoColumn.toJSON());
```

### 5. Використання утиліт

**Перевірка підтримки функцій:**
```javascript
// Чи підтримує колонка опції?
if (ColumnUtils.supportsOptions(column.Type)) {
  // Показати UI для управління опціями
}

// Чи підтримує колонка кольори тегів?
if (ColumnUtils.supportsTagColors(column.Type)) {
  // Показати color picker
}

// Чи є колонка глобальною?
if (ColumnUtils.isGlobalColumn(column.Type)) {
  // Не показувати для кожного дня
}
```

**Розрахунок summary:**
```javascript
const summary = ColumnUtils.calculateSummary(column, tableData, DAYS);
```

**Отримання стилів ширини:**
```javascript
const style = ColumnUtils.getWidthStyle(column);
// Повертає: { width: '50px', minWidth: '50px' }
```

### 6. Валідація колонок

```javascript
const column = ColumnFactory.fromJSON(columnData);

if (!column.validate()) {
  console.error('Invalid column configuration');
}
```

### 7. Інтеграція в TableLogic.jsx

**При додаванні нової колонки:**
```javascript
const handleAddColumn = useCallback(async (type) => {
  try {
    // Створюємо нову колонку через фабрику
    const newColumn = ColumnFactory.createColumn(type);
    
    // Зберігаємо як plain object
    const result = await addNewColumn(newColumn.toJSON());
    
    if (result.status) {
      setColumns((prev) => [...prev, result.data]);
    }
  } catch (err) {
    handleError('Failed to create column:', err);
  }
}, []);
```

**При оновленні колонки:**
```javascript
const handleUpdateColumn = useCallback(async (columnId, updates) => {
  try {
    // Знаходимо колонку
    const column = columns.find(col => col.ColumnId === columnId);
    
    // Конвертуємо в екземпляр класу
    const columnInstance = ColumnFactory.fromJSON(column);
    
    // Застосовуємо оновлення
    Object.assign(columnInstance, updates);
    
    // Валідуємо
    if (!columnInstance.validate()) {
      throw new Error('Invalid column configuration');
    }
    
    // Зберігаємо
    await updateColumn(columnInstance.toJSON());
    
    // Оновлюємо стан
    setColumns(prev => prev.map(col => 
      col.ColumnId === columnId ? columnInstance.toJSON() : col
    ));
  } catch (err) {
    handleError('Update failed:', err);
  }
}, [columns]);
```

### 8. Міграція існуючого коду

Старий код буде продовжувати працювати, оскільки:

1. `getColumnTemplates()` тепер використовує `ColumnFactory.getAllTemplates()` під капотом
2. Всі класи мають метод `toJSON()`, який повертає plain objects
3. `ColumnFactory.fromJSON()` може працювати з існуючими даними

**Поступова міграція:**
```javascript
// Крок 1: Імпортуйте класи
import { ColumnFactory } from './utils/columnClasses';

// Крок 2: При роботі з колонкою, конвертуйте її
const columnInstance = ColumnFactory.fromJSON(existingColumn);

// Крок 3: Використовуйте методи класу
columnInstance.updateValue('Monday', value);

// Крок 4: Конвертуйте назад при збереженні
await saveColumn(columnInstance.toJSON());
```

### 9. Переваги нового підходу

1. **Типобезпека**: Кожен клас має чіткі методи та властивості
2. **Валідація**: Автоматична валідація даних
3. **Методи**: Спеціалізовані методи для кожного типу (addOption, addTodo, etc.)
4. **Розширюваність**: Легко додавати нові типи колонок
5. **Підтримка**: Легше знайти і виправити баги

### 10. Приклад повної інтеграції

```javascript
// В TableLogic.jsx або іншому компоненті

import { ColumnFactory } from './utils/columnClasses';
import { ColumnManager, ColumnUtils } from './utils/columnManager';

const MyComponent = () => {
  const [columns, setColumns] = useState([]);
  
  // Завантаження колонок
  useEffect(() => {
    const loadColumns = async () => {
      const data = await getColumnsFromDB();
      // Дані зберігаються як plain objects, але ми можемо працювати з ними
      setColumns(data);
    };
    loadColumns();
  }, []);
  
  // Додавання нової колонки
  const addColumn = async (type) => {
    const newColumn = ColumnFactory.createColumn(type, {
      Name: `New ${type} Column`
    });
    
    await saveColumnToDB(newColumn.toJSON());
    setColumns(prev => [...prev, newColumn.toJSON()]);
  };
  
  // Оновлення значення колонки
  const updateValue = async (columnId, day, value) => {
    const column = columns.find(col => col.ColumnId === columnId);
    const instance = ColumnFactory.fromJSON(column);
    
    instance.updateValue(day, value);
    
    await saveColumnToDB(instance.toJSON());
    setColumns(prev => prev.map(col => 
      col.ColumnId === columnId ? instance.toJSON() : col
    ));
  };
  
  return (
    // Your JSX
  );
};
```

## Додаткові ресурси

- Дивіться `docs/COLUMN_CLASSES.md` для повної документації
- Перегляньте тести в `test-column-classes.js` для прикладів використання
- Перевірте `render/src/components/utils/columnClasses.js` для реалізації
