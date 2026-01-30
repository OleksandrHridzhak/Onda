import React from 'react';
import { ColumnHeader } from '../ColumnHeader';
import { GroupDividerColumn as GroupDividerColumnType } from '../../../../../types/newColumn.types';
import { useReactiveColumn } from '../../hooks/useReactiveColumn';
import { DAYS } from '../../TableLogic';

interface GroupDividerColumnProps {
    columnId: string;
}

export const GroupDividerColumn: React.FC<GroupDividerColumnProps> = ({
    columnId,
}) => {
    const { column, isLoading } = useReactiveColumn<GroupDividerColumnType>(
        columnId,
        'groupDividerColumn',
    );

    if (isLoading || !column) {
        return <div></div>;
    }

    const backgroundColor = column.uniqueProps?.backgroundColor || '#94A3B8';

    return (
        <table className="group-divider-nested-table font-poppins">
            <ColumnHeader columnId={columnId} />
            <tbody className="bg-tableBodyBg">
                {DAYS.map((day) => (
                    <tr key={day} className="border-b border-border last:border-0">
                        <td
                            className="px-2 py-3 text-sm"
                            style={{
                                backgroundColor: `${backgroundColor}20`,
                                borderRight: `3px solid ${backgroundColor}`,
                            }}
                        >
                            <div className="h-full flex items-center justify-center">
                                {/* Empty divider cell */}
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};
