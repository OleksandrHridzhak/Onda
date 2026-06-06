import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { icons } from 'app/utils/icons';
import { OptionsList } from 'features/Table/columnMenu/components/ui/OptionList';
import { ColumnBasicSettings } from 'features/Table/columnMenu/components/structure/ColumnBasicSettings';
import { ColumnActions } from 'features/Table/columnMenu/components/structure/ColumnActions';
import { ColorPicker } from 'shared/ui/ColorPicker';
import { ModalShell } from 'shared/ui/ModalShell';
import { getColumnById } from 'db/helpers/columns';
import { getColumnsOrder } from 'db/helpers/settings';
import { useColumnMenuHandlers } from 'features/Table/columnMenu/useColumnMenuHandlers';
import { COLUMN_TYPES, hasOptionsSupport } from 'app/constants/columnTypes';

interface ColumnMenuProps {
    columnId: string;
    onClose: () => void;
}

const ColumnMenu: React.FC<ColumnMenuProps> = ({ columnId, onClose }) => {
    // Fetch column data from Dexie using liveQuery
    const column = useLiveQuery(async () => {
        const result = await getColumnById(columnId);
        if (result.success) {
            return result.data;
        }
        console.error('Failed to fetch column:', result.error);
        return null;
    }, [columnId]);

    // Fetch column order to determine if can move
    const columnsOrder = useLiveQuery(async () => {
        const result = await getColumnsOrder();
        if (result.success) {
            return result.data;
        }
        return [];
    }, []);

    // All state and handlers from custom hook
    const { form, actions, ui } = useColumnMenuHandlers({
        columnId,
        column,
        onClose,
    });

    const darkMode =
        document.documentElement.getAttribute('data-theme-mode') === 'dark';

    if (!column || !columnsOrder) {
        return null;
    }

    const currentIndex = columnsOrder.indexOf(columnId);
    const canMoveLeft = currentIndex > 0;
    const canMoveRight = currentIndex < columnsOrder.length - 1;

    // Determine column type for options list
    const hasOptions = hasOptionsSupport(column.type);

    return (
        <ModalShell isOpen onClose={onClose} title="Column Settings">
            <ColumnBasicSettings
                name={form.name}
                setName={actions.setName}
                selectedIcon={form.selectedIcon}
                setSelectedIcon={actions.setSelectedIcon}
                showTitle={form.showTitle}
                setShowTitle={actions.setShowTitle}
                isIconSectionExpanded={ui.isIconSectionExpanded}
                setIsIconSectionExpanded={() =>
                    ui.setIsIconSectionExpanded(!ui.isIconSectionExpanded)
                }
                icons={icons}
                description={form.description}
                setDescription={actions.setDescription}
                width={form.width}
                handleWidthChange={actions.handleWidthChange}
                canMoveLeft={canMoveLeft}
                canMoveRight={canMoveRight}
                handleMoveLeft={actions.handleMoveLeft}
                handleMoveRight={actions.handleMoveRight}
                darkMode={darkMode}
            />

            {hasOptions && (
                <OptionsList
                    columnType={column.type}
                    tags={form.tags}
                    newOption={form.newOption}
                    setNewOption={actions.setNewOption}
                    handleAddOption={actions.handleAddOption}
                    handleRemoveOption={actions.handleRemoveOption}
                    handleEditOption={actions.handleEditOption}
                    handleColorChange={actions.handleColorChange}
                />
            )}

            {column.type === COLUMN_TYPES.CHECKBOX && (
                <ColorPicker
                    label="Checkbox Color"
                    value={form.checkboxColor}
                    onChange={actions.setCheckboxColor}
                    layout="grid"
                    shape="square"
                    className="mb-4"
                />
            )}

            <ColumnActions
                handleDelete={actions.handleDelete}
                handleClear={actions.handleClear}
                handleSave={actions.handleSave}
                isSaving={ui.isSaving}
            />
        </ModalShell>
    );
};

export default React.memo(ColumnMenu);
