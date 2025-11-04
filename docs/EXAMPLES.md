# Column Classes Examples

Практичні приклади використання системи класів колонок.

## Приклад 1: Створення checkbox колонки

```javascript
import { ColumnFactory } from './components/utils/columnClasses';

// Створити нову checkbox колонку
const dailyCheckbox = ColumnFactory.createColumn('checkbox', {
  Name: 'Daily Standup',
  CheckboxColor: 'orange',
});

// Оновити значення для понеділка
dailyCheckbox.updateValue('Monday', true);

// Отримати значення
const isChecked = dailyCheckbox.getValue('Monday'); // true

// Конвертувати в JSON для збереження в БД
const dataToSave = dailyCheckbox.toJSON();
/*
{
  ColumnId: "1699099200000",
  Type: "checkbox",
  Name: "Daily Standup",
  CheckboxColor: "orange",
  Width: 50,
  Chosen: {
    Monday: true,
    Tuesday: false,
    ...
  }
}
*/

// Зберегти в БД
await saveColumnToDB(dataToSave);
```

## Приклад 2: Робота з multi-select колонкою

```javascript
import { ColumnFactory } from './components/utils/columnClasses';

// Створити multi-select колонку
const tagsColumn = ColumnFactory.createColumn('multi-select', {
  Name: 'Project Tags',
});

// Додати нові опції
tagsColumn.addOption('Frontend', 'blue');
tagsColumn.addOption('Backend', 'green');
tagsColumn.addOption('DevOps', 'purple');

// Оновити назву опції
tagsColumn.updateOption('Frontend', 'Frontend Development');

// Видалити опцію
tagsColumn.removeOption('DevOps');

// Встановити теги для понеділка
tagsColumn.updateValue('Monday', 'Frontend Development, Backend');

// Зберегти
await saveColumnToDB(tagsColumn.toJSON());
```

## Приклад 3: Управління todo списком

```javascript
import { ColumnFactory } from './components/utils/columnClasses';

// Завантажити існуючу todo колонку
const todoData = await getColumnFromDB('todo-column-id');
const todoColumn = ColumnFactory.fromJSON(todoData);

// Додати нове завдання
todoColumn.addTodo('Review pull requests');
todoColumn.addTodo('Update documentation');
todoColumn.addTodo('Fix bugs');

// Отримати всі todos
const todos = todoColumn.Chosen.global;
/*
[
  { id: 1699099200001, text: 'Review pull requests', completed: false },
  { id: 1699099200002, text: 'Update documentation', completed: false },
  { id: 1699099200003, text: 'Fix bugs', completed: false }
]
*/

// Позначити як виконане
const todoId = todos[0].id;
todoColumn.updateTodo(todoId, { completed: true });

// Оновити текст
todoColumn.updateTodo(todoId, { text: 'Review and merge pull requests' });

// Видалити todo
todoColumn.removeTodo(todoId);

// Зберегти зміни
await saveColumnToDB(todoColumn.toJSON());
```

## Приклад 4: Робота з Task Table

```javascript
import { ColumnFactory } from './components/utils/columnClasses';

// Створити task table
const taskTable = ColumnFactory.createColumn('tasktable', {
  Name: 'Sprint Tasks',
});

// Додати задачі
taskTable.addTask('Implement authentication', 'red');
taskTable.addTask('Add unit tests', 'blue');
taskTable.addTask('Update UI', 'green');

// Позначити задачу як виконану
taskTable.markTaskDone('Add unit tests');

// Перевірити стан
console.log('Active tasks:', taskTable.Options);
// ['Implement authentication', 'Update UI']

console.log('Done tasks:', taskTable.DoneTags);
// ['Add unit tests']

// Зберегти
await saveColumnToDB(taskTable.toJSON());
```

## Приклад 5: Використання в React компоненті

```javascript
import React, { useState, useEffect } from 'react';
import { ColumnFactory } from './components/utils/columnClasses';
import { ColumnUtils } from './components/utils/columnManager';

const ColumnEditor = ({ columnId }) => {
  const [column, setColumn] = useState(null);
  
  // Завантажити колонку
  useEffect(() => {
    const loadColumn = async () => {
      const data = await getColumnFromDB(columnId);
      setColumn(data); // Зберігаємо як plain object
    };
    loadColumn();
  }, [columnId]);
  
  // Оновити значення
  const handleUpdateValue = async (day, value) => {
    // Конвертуємо в екземпляр класу
    const instance = ColumnFactory.fromJSON(column);
    
    // Оновлюємо значення
    instance.updateValue(day, value);
    
    // Валідуємо
    if (!instance.validate()) {
      console.error('Invalid column data');
      return;
    }
    
    // Конвертуємо назад в plain object
    const updated = instance.toJSON();
    
    // Зберігаємо
    await saveColumnToDB(updated);
    
    // Оновлюємо стан
    setColumn(updated);
  };
  
  // Додати опцію (якщо підтримується)
  const handleAddOption = async (optionText, color) => {
    if (!ColumnUtils.supportsOptions(column.Type)) {
      console.error('This column type does not support options');
      return;
    }
    
    const instance = ColumnFactory.fromJSON(column);
    instance.addOption(optionText, color);
    
    const updated = instance.toJSON();
    await saveColumnToDB(updated);
    setColumn(updated);
  };
  
  if (!column) return <div>Loading...</div>;
  
  return (
    <div>
      <h3>{column.Name}</h3>
      <p>Type: {column.Type}</p>
      
      {/* Render based on column type */}
      {column.Type === 'checkbox' && (
        <CheckboxEditor 
          column={column}
          onUpdate={handleUpdateValue}
        />
      )}
      
      {ColumnUtils.supportsOptions(column.Type) && (
        <OptionsEditor
          options={column.Options}
          tagColors={column.TagColors}
          onAddOption={handleAddOption}
        />
      )}
    </div>
  );
};
```

## Приклад 6: Валідація та обробка помилок

```javascript
import { ColumnFactory } from './components/utils/columnClasses';

const createAndValidateColumn = (type, config) => {
  try {
    // Створити колонку
    const column = ColumnFactory.createColumn(type, config);
    
    // Валідувати
    if (!column.validate()) {
      throw new Error('Invalid column configuration');
    }
    
    // Перевірити ширину
    if (column.Width < 50 || column.Width > 1000) {
      throw new Error('Width must be between 50 and 1000');
    }
    
    // Для multi-select, перевірити опції
    if (type === 'multi-select' && (!column.Options || column.Options.length === 0)) {
      throw new Error('Multi-select column must have at least one option');
    }
    
    return { success: true, column: column.toJSON() };
  } catch (error) {
    console.error('Column creation failed:', error);
    return { success: false, error: error.message };
  }
};

// Використання
const result = createAndValidateColumn('checkbox', {
  Name: 'My Checkbox',
  CheckboxColor: 'blue',
  Width: 75,
});

if (result.success) {
  await saveColumnToDB(result.column);
} else {
  showErrorMessage(result.error);
}
```

## Приклад 7: Клонування колонки

```javascript
import { ColumnFactory } from './components/utils/columnClasses';

const duplicateColumn = async (originalColumnId) => {
  // Завантажити оригінальну колонку
  const originalData = await getColumnFromDB(originalColumnId);
  const original = ColumnFactory.fromJSON(originalData);
  
  // Клонувати через JSON
  const clone = ColumnFactory.fromJSON(original.toJSON());
  
  // Змінити назву та ID
  clone.Name = `${clone.Name} (Copy)`;
  clone.ColumnId = clone.generateId();
  
  // Зберегти клон
  await saveColumnToDB(clone.toJSON());
  
  return clone.toJSON();
};
```

## Приклад 8: Масова обробка колонок

```javascript
import { ColumnFactory } from './components/utils/columnClasses';
import { ColumnUtils } from './components/utils/columnManager';

// Отримати всі колонки з опціями
const getColumnsWithOptions = (columns) => {
  return columns.filter(col => ColumnUtils.supportsOptions(col.Type));
};

// Отримати всі глобальні колонки
const getGlobalColumns = (columns) => {
  return columns.filter(col => ColumnUtils.isGlobalColumn(col.Type));
};

// Розрахувати summary для всіх колонок
const calculateAllSummaries = (columns, tableData, DAYS) => {
  return columns.reduce((acc, col) => {
    acc[col.ColumnId] = ColumnUtils.calculateSummary(col, tableData, DAYS);
    return acc;
  }, {});
};

// Валідувати всі колонки
const validateAllColumns = (columns) => {
  const errors = [];
  
  columns.forEach(colData => {
    const column = ColumnFactory.fromJSON(colData);
    if (!column.validate()) {
      errors.push({
        columnId: colData.ColumnId,
        name: colData.Name,
        error: 'Validation failed'
      });
    }
  });
  
  return errors;
};

// Використання
const columns = await getAllColumnsFromDB();

const withOptions = getColumnsWithOptions(columns);
console.log('Columns with options:', withOptions.length);

const global = getGlobalColumns(columns);
console.log('Global columns:', global.length);

const summaries = calculateAllSummaries(columns, tableData, DAYS);
console.log('Summaries:', summaries);

const validationErrors = validateAllColumns(columns);
if (validationErrors.length > 0) {
  console.error('Validation errors:', validationErrors);
}
```

## Приклад 9: Міграція старого коду

```javascript
// ДО: Старий спосіб
const createOldColumn = () => {
  return {
    ColumnId: Date.now().toString(),
    Type: 'checkbox',
    Name: 'Task',
    CheckboxColor: 'green',
    Width: 50,
    Chosen: {
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
      Sunday: false,
    },
  };
};

// ПІСЛЯ: Новий спосіб
import { ColumnFactory } from './components/utils/columnClasses';

const createNewColumn = () => {
  const column = ColumnFactory.createColumn('checkbox', {
    Name: 'Task',
    CheckboxColor: 'green',
  });
  return column.toJSON();
};

// Обидва способи повертають однаковий результат!
```

## Приклад 10: Розширення функціональності

```javascript
import { ColumnFactory } from './components/utils/columnClasses';

// Створити хелпер для роботи з тегами
class TagHelper {
  constructor(column) {
    if (!['multi-select', 'multicheckbox'].includes(column.Type)) {
      throw new Error('Column does not support tags');
    }
    this.column = ColumnFactory.fromJSON(column);
  }
  
  getTags() {
    return this.column.Options;
  }
  
  getTagColor(tag) {
    return this.column.TagColors[tag] || 'gray';
  }
  
  addTag(tag, color = 'blue') {
    this.column.addOption(tag, color);
  }
  
  removeTag(tag) {
    this.column.removeOption(tag);
  }
  
  changeTagColor(tag, newColor) {
    if (this.column.TagColors[tag]) {
      this.column.TagColors[tag] = newColor;
    }
  }
  
  toJSON() {
    return this.column.toJSON();
  }
}

// Використання
const columnData = await getColumnFromDB('tags-column');
const tagHelper = new TagHelper(columnData);

tagHelper.addTag('Urgent', 'red');
tagHelper.addTag('Low Priority', 'gray');
tagHelper.changeTagColor('Urgent', 'orange');

await saveColumnToDB(tagHelper.toJSON());
```
