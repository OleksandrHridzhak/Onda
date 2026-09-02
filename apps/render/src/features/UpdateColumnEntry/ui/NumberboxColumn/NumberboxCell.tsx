import React from 'react';
import type { NumberBoxColumn } from 'entities/Column';
import { upsertDayEntry } from 'entities/ColumnEntry';
import type { EntryEditorProps } from '../../model/types';

export function NumberEntryEditor({
    column,
    dateKey,
    entry,
}: EntryEditorProps<NumberBoxColumn>): React.ReactElement {
    const value = ((entry?.value as number | null) ?? '') as string | number;
    const handleChange = (newValue: string): void => {
        const numericValue = newValue === '' ? null : Number(newValue);
        if (Number.isNaN(numericValue)) {
            return;
        }

        void upsertDayEntry({
            columnId: column.id,
            dayDate: dateKey,
            valueType: 'number',
            value: numericValue,
        });
    };

    return (
        <input
            type="number"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            className="w-full text-center px-1 py-0.5 text-lg bg-transparent border-none 
                 outline-none ring-0 focus:ring-0 focus:outline-none focus:border-none text-text
                 [&::-webkit-outer-spin-button]:appearance-none
                 [&::-webkit-inner-spin-button]:appearance-none"
            style={{
                MozAppearance: 'textfield', // for Firefox
            }}
        />
    );
}
