# Column Management Architecture Diagram

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Components                          │
│  (Table, Cells, ColumnMenu, Settings, etc.)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                       React Custom Hooks                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │useColumnsData│  │useColumnOps  │  │useTableHndlrs│          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ColumnService (Service Layer)                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • getAllColumns()        • createColumn()              │   │
│  │  • getColumnById()        • deserializeColumns()        │   │
│  │  • addColumn()            • serializeColumns()          │   │
│  │  • updateColumn()         • getColumnsOrder()           │   │
│  │  • deleteColumn()         • updateColumnsOrder()        │   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Column Models (Domain)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │  BaseColumn  │  │DayBasedColumn│  │  TodoColumn  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │CheckBoxColumn│  │NumberColumn  │  │TaskTableCol  │  ...     │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    IndexedDB (Persistence)                       │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  • columns table (column data)                          │   │
│  │  • settings table (column order, preferences)           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Layer Responsibilities

### 1. React Components Layer
- **Purpose**: User interface and presentation
- **Responsibilities**: 
  - Render UI elements
  - Handle user interactions
  - Display data
- **Examples**: Table, Cell components, ColumnMenu

### 2. React Hooks Layer
- **Purpose**: React state management and side effects
- **Responsibilities**:
  - Manage component state
  - Handle data loading
  - Coordinate updates
- **Key Hooks**:
  - `useColumnsData` - Load and manage column data
  - `useColumnOperations` - Column CRUD operations
  - `useTableHandlers` - User interaction handlers

### 3. Service Layer (ColumnService)
- **Purpose**: Business logic and data operations
- **Responsibilities**:
  - Centralize all column operations
  - Coordinate between models and storage
  - Handle serialization/deserialization
  - Manage column ordering
  - Perform migrations
- **Key Feature**: Single source of truth

### 4. Domain Models Layer
- **Purpose**: Business entities and domain logic
- **Responsibilities**:
  - Define column structure
  - Provide type-specific behavior
  - Serialize/deserialize to JSON
  - Validate data
- **Pattern**: Class hierarchy with inheritance

### 5. Persistence Layer (IndexedDB)
- **Purpose**: Data storage
- **Responsibilities**:
  - Store column data
  - Store settings and preferences
  - Handle queries
- **Storage**: Browser IndexedDB

## Data Flow Examples

### Example 1: Loading Columns on App Start

```
Component Mount
      ↓
useColumnsData hook
      ↓
columnService.getAllColumns()
      ↓
IndexedDB query
      ↓
JSON data returned
      ↓
columnService.deserializeColumns()
      ↓
Column instances created
      ↓
State updated (setColumns)
      ↓
Component re-renders with data
```

### Example 2: User Updates Column Name

```
User types in input
      ↓
onChange handler
      ↓
useColumnOperations.updateProperties()
      ↓
column.update({ name: newName })
      ↓
columnService.updateColumn(column.toJSON())
      ↓
IndexedDB update
      ↓
State updated (setColumns)
      ↓
UI updates immediately
```

### Example 3: Adding New Column

```
User clicks "Add Column"
      ↓
handleAddColumn(type)
      ↓
columnService.createColumn(type)
      ↓
New column instance created
      ↓
columnService.addColumn(instance)
      ↓
IndexedDB insert
      ↓
State updated (setColumns)
      ↓
New column appears in table
```

## Key Design Patterns

### 1. Service Pattern
- **ColumnService** acts as facade for all column operations
- Centralizes business logic
- Simplifies testing and maintenance

### 2. Factory Pattern
- **ColumnFactory** creates appropriate column instances
- **createColumn()** handles type-specific instantiation
- Extensible for new column types

### 3. Repository Pattern
- ColumnService abstracts data access
- Components don't know about IndexedDB
- Easy to swap storage implementation

### 4. Strategy Pattern
- Different column types have different behaviors
- Polymorphic behavior through inheritance
- Easy to add new column types

## Benefits of This Architecture

1. **Separation of Concerns**: Each layer has clear responsibility
2. **Testability**: Service layer can be mocked easily
3. **Maintainability**: Changes localized to specific layers
4. **Scalability**: Easy to add new features
5. **Type Safety**: TypeScript throughout
6. **Single Source of Truth**: ColumnService centralizes operations
7. **Backward Compatibility**: Legacy API wrapper provided

## Migration from Old Architecture

### Old Architecture Issues
```
Component → Direct IndexedDB calls
         → Duplicate functions in multiple files
         → Unclear data flow
         → Hard to test
```

### New Architecture Benefits
```
Component → Hook → Service → Model → Storage
         Clean layers, clear flow, easy to test
```
