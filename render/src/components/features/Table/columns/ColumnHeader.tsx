import React, { useState } from 'react';
import ColumnMenu from '../ColumnMenu/ColumnMenu';
import { getIconComponent } from '../../../../utils/icons';
import { useLiveQuery } from 'dexie-react-hooks';
import { Column } from '../../../../types/newColumn.types';
import { getColumnById } from '../../../../db/helpers/columns';

interface ColumnHeaderProps {
    columnId: string;
}

export const ColumnHeader: React.FC<ColumnHeaderProps> = ({ columnId }) => {
    const [showMenu, setShowMenu] = useState(false);

    const column = useLiveQuery<Column | null>(async () => {
        const res = await getColumnById(columnId);
        console.log(res.data.emojiIconName);
        if (!res) {
            console.log(res.error);
            return null;
        }
        return res.data || null;
    }, [columnId]);

    if (!column) {
        return null;
    }

    const isEmptyHeader =
        !column.emojiIconName &&
        (column.isNameVisible === false || !column.name);

    const handleClose = (): void => {
        setShowMenu(false);
    };

    return (
        <>
            <thead className="bg-tableHeader">
                <tr>
                    <th className="border-b border-border">
                        <div
                            role="button"
                            tabIndex={column.id !== 'days' ? 0 : -1}
                            className={`font-poppins flex items-center justify-between group cursor-pointer px-3 py-3 text-left text-sm font-medium ${column.isNameVisible === false || isEmptyHeader ? 'justify-center' : ''}`}
                            onClick={() =>
                                column.id !== 'days' && setShowMenu(true)
                            }
                            onKeyDown={(e) => {
                                if (
                                    (e.key === 'Enter' || e.key === ' ') &&
                                    column.id !== 'days'
                                ) {
                                    e.preventDefault();
                                    setShowMenu(true);
                                }
                            }}
                            aria-label={column.name || 'Column settings'}
                        >
                            <div
                                className={`flex items-center ${column.isNameVisible === false || isEmptyHeader ? 'justify-center w-full' : ''}`}
                            >
                                {column.emojiIconName && (
                                    <span
                                        className={
                                            column.isNameVisible !== false
                                                ? 'mr-1'
                                                : ''
                                        }
                                    >
                                        {getIconComponent(column.emojiIconName, 16)}
                                    </span>
                                )}
                                {column.isNameVisible !== false && column.name && (
                                    <span
                                        className={`truncate block text-textTableValues max-w-full`}
                                    >
                                        {column.name}
                                    </span>
                                )}
                                {isEmptyHeader && (
                                    <span className="opacity-0">∅</span>
                                )}
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>
            {showMenu && <ColumnMenu columnId={columnId} onClose={handleClose} />}
        </>
    );
};
