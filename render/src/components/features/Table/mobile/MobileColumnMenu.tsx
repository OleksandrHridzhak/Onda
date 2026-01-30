import React from 'react';
import ColumnMenu from '../columnMenu/ColumnMenu';

interface MobileColumnMenuProps {
    columnId: string;
    onClose: () => void;
}

export const MobileColumnMenu: React.FC<MobileColumnMenuProps> = ({
    columnId,
    onClose,
}) => {
    return <ColumnMenu columnId={columnId} onClose={onClose} />;
};
