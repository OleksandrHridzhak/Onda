# Column Classes Quick Reference

## Quick Import

```javascript
import { ColumnFactory } from './components/utils/columnClasses';
import { ColumnManager, ColumnUtils } from './components/utils/columnManager';
```

## Create Columns

```javascript
// Any column type
ColumnFactory.createColumn('checkbox', { Name: 'My Column' })
ColumnFactory.createColumn('numberbox', { Name: 'Count' })
ColumnFactory.createColumn('text', { Name: 'Notes' })
ColumnFactory.createColumn('multi-select', { Name: 'Tags' })
ColumnFactory.createColumn('multicheckbox', { Name: 'Tasks' })
ColumnFactory.createColumn('todo', { Name: 'Todo List' })
ColumnFactory.createColumn('tasktable', { Name: 'Task Table' })

// From existing data
ColumnFactory.fromJSON(existingColumnData)

// Get all templates
ColumnFactory.getAllTemplates()
```

## Column Methods

```javascript
// All columns
column.updateValue(day, value)      // Update value for a day
column.getValue(day)                // Get value for a day
column.toJSON()                     // Convert to plain object
column.validate()                   // Validate column config

// Multi-select, Multicheckbox
column.addOption(text, color)       // Add new option
column.removeOption(text)           // Remove option
column.updateOption(old, new)       // Update option (multi-select only)

// Todo
column.addTodo(text)                // Add todo item
column.updateTodo(id, updates)      // Update todo
column.removeTodo(id)               // Remove todo

// Task Table
column.addTask(text, color)         // Add task
column.markTaskDone(task)           // Mark as done
```

## Utilities

```javascript
// Type checking
ColumnUtils.supportsOptions(type)           // → boolean
ColumnUtils.supportsTagColors(type)         // → boolean
ColumnUtils.supportsCheckboxColor(type)     // → boolean
ColumnUtils.isGlobalColumn(type)            // → boolean

// Helpers
ColumnUtils.getCellComponentName(type)      // → string
ColumnUtils.calculateSummary(col, data, DAYS)  // → number|string
ColumnUtils.getWidthStyle(column)           // → { width, minWidth }

// Manager
ColumnManager.toColumnInstance(data)        // JSON → Instance
ColumnManager.toPlainObject(instance)       // Instance → JSON
ColumnManager.validateColumn(instance)      // Validate
ColumnManager.cloneColumn(instance)         // Clone instance
```

## Common Patterns

### Load from DB
```javascript
const data = await getColumnFromDB(id);
const column = ColumnFactory.fromJSON(data);
```

### Save to DB
```javascript
const column = ColumnFactory.createColumn('checkbox');
await saveColumnToDB(column.toJSON());
```

### Update and Save
```javascript
const column = ColumnFactory.fromJSON(existingData);
column.updateValue('Monday', true);
await updateColumnInDB(column.toJSON());
```

### Add Option
```javascript
const column = ColumnFactory.fromJSON(existingData);
column.addOption('New Tag', 'purple');
await updateColumnInDB(column.toJSON());
```

### Working with State
```javascript
// Load
const [columns, setColumns] = useState([]);
useEffect(() => {
  const load = async () => {
    const data = await getColumns();
    setColumns(data); // Store as plain objects
  };
  load();
}, []);

// Update
const updateColumn = (id, updates) => {
  const col = columns.find(c => c.ColumnId === id);
  const instance = ColumnFactory.fromJSON(col);
  Object.assign(instance, updates);
  
  setColumns(prev => prev.map(c => 
    c.ColumnId === id ? instance.toJSON() : c
  ));
};
```

## Column Types Reference

| Type | Width | Has Options | Has TagColors | Global | Checkbox Color |
|------|-------|-------------|---------------|--------|----------------|
| checkbox | 50 | ❌ | ❌ | ❌ | ✅ |
| numberbox | 60 | ❌ | ❌ | ❌ | ❌ |
| text | 130 | ❌ | ❌ | ❌ | ❌ |
| multi-select | 90 | ✅ | ✅ | ❌ | ❌ |
| multicheckbox | 50 | ✅ | ✅ | ❌ | ❌ |
| todo | 150 | ✅ | ✅ | ✅ | ❌ |
| tasktable | 150 | ✅ | ✅ | ✅ | ❌ |

## Property Reference

### All Columns
```javascript
{
  ColumnId: string,
  Type: string,
  Name: string,
  Description: string,
  EmojiIcon: string,
  NameVisible: boolean,
  Width: number,
  Chosen: object
}
```

### Checkbox Column
```javascript
{
  ...baseProperties,
  CheckboxColor: string,
  Chosen: {
    Monday: boolean,
    Tuesday: boolean,
    // ... all days
  }
}
```

### Multi-select / Multicheckbox / Todo / TaskTable
```javascript
{
  ...baseProperties,
  Options: string[],
  TagColors: { [option: string]: string }
}
```

### Task Table (Additional)
```javascript
{
  ...above,
  DoneTags: string[]
}
```

## Tips

1. **Always convert to JSON before saving**: `column.toJSON()`
2. **Always validate after updates**: `column.validate()`
3. **Use Factory for creation**: Don't use `new ColumnClass()` directly
4. **Store as plain objects in state**: Convert when needed with `fromJSON()`
5. **Check type support**: Use `ColumnUtils.supports*()` methods
