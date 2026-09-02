# FSD migration of the renderer

## Purpose

The renderer was reorganized according to Feature-Sliced Design (FSD) to make
module responsibilities explicit and to prevent business logic, page
composition, and reusable infrastructure from being mixed together.

The migration does not intentionally change application behavior, IndexedDB
schema, or stored user data.

## Layer responsibilities

```text
app      Application initialization, providers, router, store and global styles
pages    Route-level composition
widgets  Independent page blocks and complex layout composition
features User actions and scenarios
entities Business types, read APIs and domain rules
shared   Infrastructure, generic utilities and reusable UI
```

Allowed dependency direction:

```text
app      -> pages, widgets, features, entities, shared
pages    -> widgets, features, entities, shared
widgets  -> features, entities, shared
features -> entities, shared
entities -> shared
shared   -> shared
```

## Main changes

### Application layer

`App` no longer contains routing, keyboard shortcut handling, providers, and
database initialization in one component.

The responsibilities were separated into:

- `app/providers` for Redux, Router and table-week providers;
- `app/router` for routes and route keyboard shortcuts;
- `app/layout` for application-level layout;
- `app/lib/initializeApp.ts` for database and theme initialization.

This keeps the application entry point declarative and prevents app-level
concerns from leaking into pages and widgets.

### Shared infrastructure

Dexie configuration, schema versions, migration logic and `DbResult` were moved
to `shared/api/db`.

Generic utilities were grouped by purpose:

- dates in `shared/lib/date`;
- colors in `shared/lib/color`;
- icons in `shared/lib/icons`;
- document theme observation in `shared/lib/theme`.

The old top-level `db` directory was removed. Database table names and schema
versions were preserved, so existing IndexedDB data remains compatible.

### Entities

Business data is represented by four entities:

- `Column`;
- `ColumnEntry`;
- `CalendarEvent`;
- `Settings`.

Entities contain types, read APIs, defaults and domain rules. They do not own
application composition or feature UI.

`ColumnHeaderSlot`, its React context, and `useReactiveColumn` were removed from
`entities/Column`. They existed only to work around an incorrect dependency
between column features and the table widget.

### Weekly table

Complete column rendering belongs to `widgets/WeeklyTable` because a rendered
column is part of the table layout, not a standalone user action.

The widget now owns:

- column headers;
- nested table structure;
- day and filler columns;
- column renderer selection;
- row layout and height synchronization;
- loading and empty states.

`DynamicColumn` receives an already loaded `Column` object. Individual column
components no longer create duplicate Dexie subscriptions.

Column selection is performed using the discriminated `column.type` union. This
keeps type-specific rendering explicit and type-safe.

### Updating column entries

`features/UpdateColumnEntry` now represents the user action of editing data.
It exports entry editors instead of complete table columns:

- `CheckboxEntryEditor`;
- `NumberEntryEditor`;
- `TagsEntryEditor`;
- `TextEntryEditor`;
- `MultiCheckboxEntryEditor`;
- `TodoListEditor`;
- `TaskTableEditor`.

Day-based editors use the shared contract:

```ts
interface EntryEditorProps<TColumn extends Column> {
    column: TColumn;
    dateKey: string;
    entry?: ColumnEntry;
}
```

Editors own write operations such as `upsertDayEntry`. The `WeeklyTable` widget
only provides layout and data to the appropriate editor.

Todo and task-table editors receive the complete column because their content
spans the whole week and is stored in column-specific properties.

### Managing columns

`features/ManageColumn` was normalized into `api`, `model` and `ui` segments.

It owns user commands for:

- editing column settings;
- moving columns;
- archiving columns;
- permanently deleting columns.

The static visual header belongs to `WeeklyTable`. Opening and operating the
settings menu belongs to `ManageColumn`.

Write operations for column settings were removed from the `Column` entity and
placed in the feature that performs the user action.

### Sidebar and calendar

`Sidebar` no longer keeps an `active` state that duplicates router state. The
active item is derived directly from `location.pathname`.

Creating a calendar event from the sidebar no longer uses a global browser
event. It navigates to:

```text
/calendar?createEvent=1
```

`CalendarBoard` consumes the command, opens the event editor and removes the
query parameter. This makes the interaction observable through the router and
removes hidden coupling between widgets.

### Theme and Redux state

Repeated local `RootState` interfaces were replaced by selectors exported from
the owning features.

Lower-level features that cannot depend on `ChangeTheme` use
`useDocumentThemeMode` from `shared/lib/theme`. This preserves FSD dependency
direction while reacting to theme changes.

### Statistics

`StatisticsDashboard` was normalized into standard slice segments:

```text
StatisticsDashboard/
  ui/
  lib/
  index.ts
```

Internal imports use relative paths. External consumers use the slice public
API.

## Public API rules

Each slice exposes its supported API through its root `index.ts`.

Examples:

```ts
import { WeeklyTable } from 'widgets/WeeklyTable';
import { TagsEntryEditor } from 'features/UpdateColumnEntry';
import type { Column } from 'entities/Column';
```

External deep imports are forbidden:

```ts
// Incorrect
import { TagsEntryEditor } from 'features/UpdateColumnEntry/ui/TagsColumn/TagsEntryEditor';

// Correct
import { TagsEntryEditor } from 'features/UpdateColumnEntry';
```

Inside the same slice, imports must be relative:

```ts
// Incorrect inside UpdateColumnEntry
import { useTodoState } from 'features/UpdateColumnEntry/ui/TodoColumn/TodoCell/hooks/useTodoState';

// Correct
import { useTodoState } from './hooks/useTodoState';
```

## Architecture enforcement

`npm run check:fsd` verifies:

- allowed layer dependency direction;
- absence of cross-slice imports on the same layer;
- use of public APIs for imports between slices;
- relative imports inside a slice;
- absence of React contexts in entities;
- absence of entity UI unless explicitly allow-listed.

ESLint also contains layer-level `no-restricted-imports` rules.

## Verification

The migration was verified with:

```bash
npm run build
npm run build:render
npm run typecheck:electron
npm run lint
npm run check:fsd
npx prettier --check src/render/src scripts/check-fsd-imports.mjs
```

The build, typecheck, FSD check and formatting check pass. ESLint reports no
errors; remaining warnings are pre-existing cleanup items.

Manual Electron GUI verification is still required for:

- all column editor types;
- column creation, editing, movement, archive and deletion;
- week navigation;
- calendar event CRUD;
- theme changes;
- data clearing;
- Pomodoro;
- Electron window controls.

## Guideline for future code

Use the following question when choosing a layer:

- Is it business data or a domain rule? Put it in `entities`.
- Is it a user action? Put it in `features`.
- Is it page-level visual composition? Put it in `widgets`.
- Is it a route composition? Put it in `pages`.
- Is it generic and unaware of the business domain? Put it in `shared`.

UI is allowed in a feature when that UI directly performs the feature action.
A complete table column belongs to the table widget, while the interactive
editor inside its cell belongs to `UpdateColumnEntry`.
