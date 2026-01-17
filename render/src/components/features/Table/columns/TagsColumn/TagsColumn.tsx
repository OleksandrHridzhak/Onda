import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { TagsCell } from './TagsCell';
import { DayColumnLayout } from '../DayColumnLayout';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { TagsColumn as TagsColumnType } from '../../../../../types/newColumn.types';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import { getCheckBoxColorOptions } from '../../../../../utils/colorOptions';

interface TagsColumnProps {
    columnId: string;
}

export const TagsColumn: React.FC<TagsColumnProps> = ({ columnId }) => {
    const { column, isLoading, isError } = useReactiveColumn<TagsColumnType>(
        columnId,
        'tagsColumn',
    );

    // TODO: Add proper skeleton/error UI later
    if (isLoading) {
        return <div></div>;
    }

    if (isError || !column) {
        return null;
    }

    const availableTags = column.uniqueProps.availableTags || [];
    const days = column.uniqueProps.days;

    // Build helper maps between tag ids, names and colors
    const nameToId: Record<string, string> = {};
    const idToName: Record<string, string> = {};
    availableTags.forEach((tag) => {
        nameToId[tag.name] = tag.id;
        idToName[tag.id] = tag.name;
    });

    // Map stored hex colors to semantic color names understood by getColorOptions
    const checkboxColors = getCheckBoxColorOptions({ darkMode: false });
    const hexToName: Record<string, string> = {};
    Object.entries(checkboxColors).forEach(([name, cfg]) => {
        if (cfg.hex) {
            hexToName[cfg.hex.toLowerCase()] = name;
        }
    });

    const tagColors: Record<string, string> = {};
    availableTags.forEach((tag) => {
        const hex = (tag.color || '').toLowerCase();
        const colorName = hexToName[hex] || 'blue';
        tagColors[tag.name] = colorName;
    });

    const handleCellChange = (day: string, newValue: string) => {
        const names = newValue
            .split(',')
            .map((n) => n.trim())
            .filter(Boolean);

        const ids = names
            .map((name) => nameToId[name])
            .filter((id): id is string => Boolean(id));

        updateColumnFields(columnId, {
            [`uniqueProps.days.${day}`]: ids,
        });
    };

    return (
        <table className="checkbox-nested-table font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout>
                {(day) => {
                    const idsForDay = days[day as keyof typeof days] || [];
                    const value = idsForDay
                        .map((id) => idToName[id])
                        .filter(Boolean)
                        .join(', ');

                    return (
                        <TagsCell
                            value={value}
                            onChange={(newValue) =>
                                handleCellChange(day, newValue)
                            }
                            options={availableTags.map((tag) => tag.name)}
                            tagColors={tagColors}
                        />
                    );
                }}
            </DayColumnLayout>
        </table>
    );
};
