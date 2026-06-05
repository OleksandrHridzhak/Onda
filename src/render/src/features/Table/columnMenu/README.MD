# Column menu

Description: it is a modal menu for editing columns, which appears when we tap on a column header.

Fully atomic and takes from the outside world only `columnId` and `onClose`.

## Structure

```text
ColumnMenu/
|-- ColumnMenu.tsx              # Main component (modal wrapper)
|-- useColumnMenuHandlers.ts    # Custom hook for all state & handlers
|-- README.MD                   # This file
`-- components/
    |-- structure/              # Layout & composition components
    |   |-- ColumnBasicSettings.tsx   # Form inputs (name, icon, description, position)
    |   `-- ColumnActions.tsx         # Action buttons (Save, Delete, Clear)
    `-- ui/                     # Reusable UI components
        |-- OptionList.tsx            # List of options/tags
        |-- OptionItem.tsx            # Single option editor
        |-- IconSelector.tsx          # Icon picker
        |-- CheckBoxColorPicker.tsx   # Checkbox color picker
        `-- TitleVisibilityToggle.tsx # Toggle for column name visibility
```
