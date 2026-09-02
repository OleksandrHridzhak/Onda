import React from 'react';
import { useNotesEdit } from './useTextboxEdit';
import type { TextboxColumn } from 'entities/Column';
import { upsertDayEntry } from 'entities/ColumnEntry';
import type { EntryEditorProps } from '../../model/types';

export function TextEntryEditor({
    column,
    dateKey,
    entry,
}: EntryEditorProps<TextboxColumn>): React.ReactElement {
    const value = (entry?.value as string) || '';
    const onChange = (newValue: string): void => {
        void upsertDayEntry({
            columnId: column.id,
            dayDate: dateKey,
            valueType: 'text',
            value: newValue,
        });
    };

    const {
        isEditing,
        setIsEditing,
        tempValue,
        setTempValue,
        textareaRef,
        handleSave,
        handleKeyDown,
    } = useNotesEdit(value, onChange);

    const handleStartEditing = (
        value: string,
        setIsEditing: (isEditing: boolean) => void,
        setTempValue: (value: string) => void,
    ) => {
        setIsEditing(true);
        setTempValue(value);
    };

    const handleKeyDownDiv = (e: React.KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleStartEditing(value, setIsEditing, setTempValue);
        }
    };

    return isEditing ? (
        <div className="w-full min-w-32 relative font-poppins">
            <textarea
                ref={textareaRef}
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="w-full px-2 py-1 text-sm bg-transparent font-poppins rounded-md focus:outline-none resize-none text-text"
                rows={1}
                autoFocus
            />
        </div>
    ) : (
        <div
            role="button"
            tabIndex={0}
            onClick={() =>
                handleStartEditing(value, setIsEditing, setTempValue)
            }
            onKeyDown={handleKeyDownDiv}
            className="w-full min-h-8 px-2 py-1 rounded-md cursor-text text-sm flex items-center group transition-colors text-text"
            aria-label="Edit note"
        >
            <div className="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap">
                {value}
            </div>
        </div>
    );
}
