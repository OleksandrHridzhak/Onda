import React from 'react';
import { ColumnHeader } from './shared/ColumnHeader';
import { DayColumnLayout } from './shared/DayColumnLayout';
import type { Column } from '../../types/columnTypes';
import { COLUMN_TYPES } from '../../types/columnDefinitions';
import type { ColumnEntryValueMap } from '../../types/entryTypes';
import { CheckboxEntryEditor } from './CheckboxColumn/CheckBoxCell';
import { NumberEntryEditor } from './NumberboxColumn/NumberboxCell';
import { TextEntryEditor } from './TextboxColumn/TextboxCell';
import { TagsEntryEditor } from './TagsColumn/TagsEntryEditor';
import { MultiCheckboxEntryEditor } from './MultiCheckboxColumn/MultiCheckboxEntryEditor';

const DAY_EDITORS: Record<string, React.ComponentType<any>> = {
    [COLUMN_TYPES.CHECKBOX]: CheckboxEntryEditor,
    [COLUMN_TYPES.NUMBERBOX]: NumberEntryEditor,
    [COLUMN_TYPES.TEXTBOX]: TextEntryEditor,
    [COLUMN_TYPES.TAGS]: TagsEntryEditor,
    [COLUMN_TYPES.MULTI_CHECKBOX]: MultiCheckboxEntryEditor,
};

const DAY_COLUMN_CLASSES: Record<string, string> = {
    [COLUMN_TYPES.CHECKBOX]: 'column-checkbox',
    [COLUMN_TYPES.NUMBERBOX]: 'column-numberbox',
    [COLUMN_TYPES.TEXTBOX]: 'column-text',
    [COLUMN_TYPES.MULTI_CHECKBOX]: 'column-multicheckbox',
};

interface DayBasedColumnProps {
    column: Column;
    weekDates: Date[];
    weekEntriesByDate: ColumnEntryValueMap;
    archivedAt: Date;
}

/**
 * Shared wrapper for all 7-day columns (Checkbox, Numberbox, Textbox, Tags, MultiCheckbox).
 * Uses pure divs with Flexbox layout, no nested table elements.
 */
export const DayBasedColumn = ({
    column,
    weekDates,
    weekEntriesByDate,
    archivedAt,
}: DayBasedColumnProps) => {
    const Editor = DAY_EDITORS[column.type];
    if (!Editor) return null;

    const columnClass = DAY_COLUMN_CLASSES[column.type] || '';

    return (
        <div
            className={`checkbox-nested-table ${columnClass} font-poppins flex flex-col h-full w-full`}
        >
            <ColumnHeader column={column} archivedAt={archivedAt} />
            <DayColumnLayout weekDates={weekDates}>
                {(_day, dateKey) => (
                    <Editor
                        column={column}
                        dateKey={dateKey}
                        entry={weekEntriesByDate[dateKey]}
                    />
                )}
            </DayColumnLayout>
        </div>
    );
};
