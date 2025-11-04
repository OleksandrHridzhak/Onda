# Column Logic Architecture Comparison

## Before: Object-based approach

```
fileTemplates.js
└── getColumnTemplates()
    ├── Hardcoded object for 'todo'
    ├── Hardcoded object for 'checkbox'
    ├── Hardcoded object for 'numberbox'
    ├── Hardcoded object for 'text'
    ├── Hardcoded object for 'multi-select'
    ├── Hardcoded object for 'multicheckbox'
    └── Hardcoded object for 'tasktable'

Problems:
- No validation
- No encapsulation
- Difficult to extend
- Repeated logic
- No type safety
```

## After: Class-based approach

```
columnClasses.js
├── Column (Base Class)
│   ├── generateId()
│   ├── getDefaultWidth()
│   ├── getDefaultChosen()
│   ├── toJSON()
│   ├── updateValue()
│   ├── getValue()
│   └── validate()
│
├── CheckboxColumn extends Column
│   ├── CheckboxColor property
│   ├── getDefaultWidth() → 50px
│   └── Custom validation
│
├── NumberboxColumn extends Column
│   ├── getDefaultWidth() → 60px
│   └── Number validation
│
├── TextColumn extends Column
│   └── getDefaultWidth() → 130px
│
├── MultiSelectColumn extends Column
│   ├── Options, TagColors properties
│   ├── addOption()
│   ├── removeOption()
│   ├── updateOption()
│   └── Options validation
│
├── MultiCheckboxColumn extends Column
│   ├── Options, TagColors properties
│   ├── addOption()
│   ├── removeOption()
│   └── Options validation
│
├── TodoColumn extends Column
│   ├── Options, TagColors properties
│   ├── addTodo()
│   ├── updateTodo()
│   ├── removeTodo()
│   └── Global todos validation
│
├── TaskTableColumn extends Column
│   ├── Options, TagColors, DoneTags properties
│   ├── addTask()
│   ├── markTaskDone()
│   └── Tasks validation
│
└── ColumnFactory
    ├── createColumn(type, config)
    ├── fromJSON(data)
    ├── getColumnTemplate(type)
    └── getAllTemplates()

columnManager.js
├── ColumnManager
│   ├── toColumnInstance()
│   ├── toPlainObject()
│   ├── createColumn()
│   ├── validateColumn()
│   ├── updateColumnValue()
│   ├── getColumnValue()
│   ├── cloneColumn()
│   └── mergeColumnConfig()
│
└── ColumnUtils
    ├── supportsOptions()
    ├── supportsTagColors()
    ├── supportsCheckboxColor()
    ├── isGlobalColumn()
    ├── getCellComponentName()
    ├── calculateSummary()
    └── getWidthStyle()

fileTemplates.js (Updated)
└── getColumnTemplates()
    └── Uses ColumnFactory.getAllTemplates()
        └── Customizes with icons and visibility

Benefits:
✓ Encapsulation
✓ Validation
✓ Type safety
✓ Reusable methods
✓ Easy to extend
✓ Better maintainability
```

## Usage Examples

### Creating a new column

**Before:**
```javascript
const newColumn = {
  ColumnId: Date.now().toString(),
  Type: 'checkbox',
  Name: 'Task',
  EmojiIcon: 'Star',
  NameVisible: false,
  Width: 50,
  CheckboxColor: 'green',
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
```

**After:**
```javascript
const newColumn = ColumnFactory.createColumn('checkbox', {
  Name: 'Task',
  CheckboxColor: 'green',
});
// All defaults handled automatically
// Built-in validation
// Methods available: updateValue(), validate(), toJSON()
```

### Adding an option to multi-select

**Before:**
```javascript
const column = columns.find(col => col.ColumnId === columnId);
if (!column.Options) column.Options = [];
if (!column.TagColors) column.TagColors = {};

column.Options.push('New Option');
column.TagColors['New Option'] = 'blue';

await updateColumn(column);
```

**After:**
```javascript
const column = ColumnFactory.fromJSON(
  columns.find(col => col.ColumnId === columnId)
);

column.addOption('New Option', 'blue');

await updateColumn(column.toJSON());
```

### Managing todos

**Before:**
```javascript
const column = columns.find(col => col.ColumnId === columnId);
if (!column.Chosen) column.Chosen = {};
if (!column.Chosen.global) column.Chosen.global = [];

column.Chosen.global.push({
  id: Date.now(),
  text: 'New task',
  completed: false,
});

await updateColumn(column);
```

**After:**
```javascript
const column = ColumnFactory.fromJSON(
  columns.find(col => col.ColumnId === columnId)
);

column.addTodo('New task');

await updateColumn(column.toJSON());
```

## Architecture Benefits

### 1. Separation of Concerns
- **Data structure** defined in classes
- **Business logic** in class methods
- **UI logic** stays in components

### 2. Single Responsibility
- Each class handles one column type
- Factory handles creation
- Manager handles conversion
- Utils handle common operations

### 3. Open/Closed Principle
- Easy to add new column types
- No need to modify existing code
- Extend base class for new functionality

### 4. DRY (Don't Repeat Yourself)
- Common logic in base class
- Type-specific logic in subclasses
- Utilities for shared operations

### 5. Testability
- Each class can be tested independently
- Factory can be mocked
- Clear interfaces for testing

## Migration Path

### Phase 1: ✅ Completed
- Create class system
- Update fileTemplates.js
- Create utilities
- Add documentation

### Phase 2: Optional - Future Enhancement
- Refactor TableLogic.jsx to use classes internally
- Add TypeScript definitions
- Create more specialized methods
- Add advanced validation rules

### Phase 3: Optional - Future Enhancement
- Implement plugin system for custom column types
- Add column presets
- Create visual column designer
