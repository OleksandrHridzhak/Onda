import React from 'react';
import { Check } from 'lucide-react';
import { COLOR_STYLES, ColorName } from 'shared/lib/color';
import type { CheckboxColumn } from 'entities/Column';
import { upsertDayEntry } from 'entities/ColumnEntry';
import type { EntryEditorProps } from '../../model/types';

/**
 * A controlled circular checkbox cell for the task table.
 * Uses the shared color palette from colorOptions.
 */
export function CheckboxEntryEditor({
    column,
    dateKey,
    entry,
}: EntryEditorProps<CheckboxColumn>): React.ReactElement {
    const checked = (entry?.value as boolean) || false;
    const color: ColorName = column.uniqueProps.checkboxColor || 'accent1';
    const colorClasses = COLOR_STYLES[color] || COLOR_STYLES.accent1;
    const handleChange = (newValue: boolean): void => {
        void upsertDayEntry({
            columnId: column.id,
            dayDate: dateKey,
            valueType: 'boolean',
            value: newValue,
        });
    };

    return (
        <div className="flex justify-center items-center w-full h-full">
            <label className="relative flex items-center justify-center w-6 h-6 cursor-pointer">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleChange(!checked)}
                    className="sr-only peer"
                />
                <div
                    className={`w-6 h-6 rounded-full border flex items-center justify-center 
                        transition-all duration-150 ease-in-out
                        border-transparent
                        ${checked ? colorClasses.solid : ''}
                        ${checked ? colorClasses.hover : 'hover:border-border'}`}
                >
                    <Check
                        size={16}
                        className={`absolute text-white transition-opacity duration-150 ${
                            checked ? 'opacity-100' : 'opacity-0'
                        }`}
                        strokeWidth={3}
                    />
                </div>
            </label>
        </div>
    );
}
