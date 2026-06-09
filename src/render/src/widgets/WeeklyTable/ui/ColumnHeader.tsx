import { useState } from 'react';
import type { Column } from 'entities/Column';
import { ColumnMenu } from 'features/ManageColumn';
import { getIconComponent } from 'shared/lib/icons';

interface ColumnHeaderProps {
    column: Column;
    archivedAt: Date;
}

export function ColumnHeader({
    column,
    archivedAt,
}: ColumnHeaderProps): React.ReactElement {
    const [showMenu, setShowMenu] = useState(false);
    const isEmptyHeader =
        !column.emojiIconName &&
        (column.isNameVisible === false || !column.name);

    return (
        <>
            <thead className="bg-surfaceMuted">
                <tr>
                    <th className="border-b border-border">
                        <div
                            role="button"
                            tabIndex={0}
                            className={`font-poppins flex items-center justify-between group cursor-pointer px-3 py-3 text-left text-sm font-medium ${column.isNameVisible === false || isEmptyHeader ? 'justify-center' : ''}`}
                            onClick={() => setShowMenu(true)}
                            onKeyDown={(event) => {
                                if (
                                    event.key === 'Enter' ||
                                    event.key === ' '
                                ) {
                                    event.preventDefault();
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
                                        {getIconComponent(
                                            column.emojiIconName,
                                            16,
                                        )}
                                    </span>
                                )}
                                {column.isNameVisible !== false &&
                                    column.name && (
                                        <span className="truncate block text-textMuted max-w-full">
                                            {column.name}
                                        </span>
                                    )}
                                {isEmptyHeader && (
                                    <span className="opacity-0">...</span>
                                )}
                            </div>
                        </div>
                    </th>
                </tr>
            </thead>
            {showMenu && (
                <ColumnMenu
                    columnId={column.id}
                    archivedAt={archivedAt}
                    onClose={() => setShowMenu(false)}
                />
            )}
        </>
    );
}
