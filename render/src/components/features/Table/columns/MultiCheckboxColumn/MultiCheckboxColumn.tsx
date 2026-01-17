import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { MultiCheckboxCell } from './MultiCheckBoxCell';
import { DayColumnLayout } from '../DayColumnLayout';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { updateColumnFields } from '../../../../../db/helpers/columns';
import {
    MultiCheckboxColumn as MultiCheckboxColumnType,
    Tag,
} from '../../../../../types/newColumn.types';
import { getCheckBoxColorOptions } from '../../../../../utils/colorOptions';

interface MultiCheckboxColumnProps {
    columnId: string;
}

const COLOR_ORDER = ['green', 'blue', 'purple', 'orange'];

const COLOR_KEY_BY_HEX = (() => {
    const palette = getCheckBoxColorOptions({ darkMode: false });
    const map: Record<string, string> = {};

    Object.entries(palette).forEach(([key, value]) => {
        map[value.hex.toLowerCase()] = key;
    });

    return map;
})();

const mapTagColors = (availableOptions: Tag[]): Record<string, string> => {
    return availableOptions.reduce<Record<string, string>>(
        (acc, option, index) => {
            const rawColor = option.color || '';
            const lowerColor = rawColor.toLowerCase();

            let colorKey: string | undefined;

            // If the stored color is one of our named palette keys
            if (COLOR_KEY_BY_HEX[lowerColor]) {
                colorKey = COLOR_KEY_BY_HEX[lowerColor];
            } else if (!rawColor.startsWith('#') && rawColor) {
                // Treat non-hex strings as direct palette keys
                colorKey = rawColor;
            }

            // Fallback to a deterministic color if nothing matched
            if (!colorKey) {
                colorKey = COLOR_ORDER[index % COLOR_ORDER.length];
            }

            acc[option.name] = colorKey;
            return acc;
        },
        {},
    );
};

export const MultiCheckboxColumn: React.FC<MultiCheckboxColumnProps> = ({
    columnId,
}) => {
    const { column, isLoading, isError } =
        useReactiveColumn<MultiCheckboxColumnType>(
            columnId,
            'multiCheckBoxColumn',
        );

    if (isLoading) {
        // TODO: Replace with a proper skeleton loader
        return <div></div>;
    }

    const availableOptions = column?.uniqueProps?.availableOptions || [];
    const optionNames = availableOptions.map((option) => option.name);
    const tagColors = mapTagColors(availableOptions);

    const getValueForDay = (day: string): string => {
        if (!column) return '';

        const selectedIds = column.uniqueProps.days?.[day] || [];
        const selectedNames = availableOptions
            .filter((option) => selectedIds.includes(option.id))
            .map((option) => option.name);

        return selectedNames.join(', ');
    };

    const handleCellChange = (day: string, newValue: string) => {
        const selectedNames = newValue
            .split(',')
            .map((name) => name.trim())
            .filter(Boolean);

        const selectedIds = availableOptions
            .filter((option) => selectedNames.includes(option.name))
            .map((option) => option.id);

        updateColumnFields(columnId, {
            [`uniqueProps.days.${day}`]: selectedIds,
        });
    };

    return (
        <table className="checkbox-nested-table column-multicheckbox font-poppins">
            <ColumnHeader columnId={columnId} />
            <DayColumnLayout>
                {(day) => (
                    <MultiCheckboxCell
                        value={getValueForDay(day)}
                        onChange={(newValue) => handleCellChange(day, newValue)}
                        options={optionNames}
                        tagColors={tagColors}
                    />
                )}
            </DayColumnLayout>
        </table>
    );
};
