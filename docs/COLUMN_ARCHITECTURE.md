# Column Management Architecture

## Overview

This document describes the refactored column management system that provides a clean, maintainable architecture for creating, updating, and managing columns in the Onda application.

## Architecture Components

### 1. Column Models (`/models/columns/`)

**Location:** `render/src/models/columns/`

Column models represent the domain entities with business logic:

- **BaseColumn** - Abstract base class for all columns
- **DayBasedColumn** - Abstract base for columns with day-specific data
- **CheckBoxColumn** - Checkbox column implementation
- **NumberBoxColumn** - Number input column
- **TextBoxColumn** - Text input column
- **TodoColumn** - Todo list column
- **MultiSelectColumn** - Multi-select dropdown
- **MultiCheckboxColumn** - Multiple checkbox options
- **TaskTableColumn** - Task management table

**Responsibilities:**
- Define column structure and behavior
- Provide methods for data manipulation
- Serialize/deserialize to/from JSON

### 2. ColumnService (`/services/ColumnService.ts`)

**Location:** `render/src/services/ColumnService.ts`

The ColumnService is the **single source of truth** for all column operations.

**Key Features:**
- Centralized column CRUD operations
- Column factory methods
- Serialization/deserialization
- Column ordering
- Data migration support

**Main Methods:**
```typescript
// Basic CRUD
columnService.getAllColumns()           // Get all columns
columnService.getColumnById(id)         // Get single column
columnService.addColumn(data)           // Create new column
columnService.updateColumn(data)        // Update existing column
columnService.deleteColumn(id)          // Delete column

// Factory methods
columnService.createColumn(type)        // Create column instance
columnService.deserializeColumns(json)  // JSON to instances
columnService.serializeColumns(cols)    // Instances to JSON

// Order management
columnService.getColumnsOrder()         // Get saved order
columnService.updateColumnsOrder(ids)   // Save new order

// Migration
columnService.migrateColumnsFromWeeks() // One-time migration
```

### 3. React Hooks (`/components/table/hooks/`)

**Location:** `render/src/components/table/hooks/`

Custom hooks provide React-friendly interfaces:

- **useColumnsData** - Load and manage column data
- **useColumnOperations** - Update column operations
- **useTableHandlers** - Table interaction handlers
- **useColumnMenuLogic** - Column menu operations

## Data Flow (Simplified)

```
┌─────────────────┐
│ React Component │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  React Hooks    │  (useColumnsData, useColumnOperations)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ ColumnService   │  Single source of truth
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   IndexedDB     │  Persistence layer
└─────────────────┘
```

**Note:** We removed unnecessary wrapper layers (columnsDB.js, columnHelpers.ts) to simplify the architecture. All code now uses ColumnService directly.

## Adding a New Column Type

Follow these steps to add a new column type:

### 1. Create Column Class

Create a new file in `render/src/models/columns/`:

```typescript
import { BaseColumn } from './BaseColumn';

export class MyNewColumn extends BaseColumn {
  customProperty: string;

  constructor(
    emojiIcon: string = 'Icon',
    width: number = 100,
    nameVisible: boolean = true,
    name: string = '',
    description: string = '',
    id?: string
  ) {
    super('mynewtype', emojiIcon, width, nameVisible, name, description, id);
    this.customProperty = 'default';
  }

  static fromJSON(json: Record<string, any>): MyNewColumn {
    const instance = new MyNewColumn(
      json.emojiIcon,
      json.width,
      json.nameVisible,
      json.name,
      json.description,
      json.id
    );
    instance.customProperty = json.customProperty || 'default';
    return instance;
  }

  toJSON(): Record<string, any> {
    return {
      ...super.toJSON(),
      customProperty: this.customProperty,
    };
  }
}
```

### 2. Register in Factory

Update `render/src/models/columns/index.ts` to add the new column type.

### 3. Create UI Component

Create a cell component in `render/src/components/table/cells/`.

That's it! The ColumnService will automatically handle creating, saving, loading, and serializing the new column type.

## Best Practices

### 1. Always Use ColumnService

✅ **Do** use ColumnService:
```typescript
await columnService.updateColumn(data);
```

### 2. Work with Column Instances

✅ **Do** use column instance methods:
```typescript
column.update({ name: 'New Name', width: 100 });
```

## Benefits of This Architecture

1. **Single Source of Truth** - All column operations go through ColumnService
2. **Simplified Architecture** - Removed unnecessary wrapper layers
3. **Type Safety** - TypeScript provides compile-time type checking
4. **Testability** - Service layer can be easily mocked and tested
5. **Maintainability** - Clear separation of concerns
6. **Extensibility** - Adding new column types is straightforward
7. **Documentation** - JSDoc comments provide inline documentation
