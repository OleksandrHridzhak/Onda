import React from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { icons } from 'shared/lib/icons';
import { OptionsList } from './components/OptionList';
import { ColumnBasicSettings } from './components/ColumnBasicSettings';
import { ColumnActions } from './components/ColumnActions';
import { ColorPicker } from 'shared/ui/ColorPicker';
import { ModalShell } from 'shared/ui/ModalShell';
import { getColumnById, getColumnsByIds } from 'entities/Column';
import { getColumnsOrder } from 'entities/Settings';
import { useColumnMenuHandlers } from '../model/useColumnMenuHandlers';
import { COLUMN_TYPES } from 'entities/Column';
import { hasOptionsSupport } from 'entities/Column';
import { isColumnArchived } from 'entities/Column';

interface ColumnMenuProps {
    columnId: string;
    archivedAt: Date;
    onClose: () => void;
}

const ColumnMenu: React.FC<ColumnMenuProps> = ({
    columnId,
    archivedAt,
    onClose,
}) => {
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
    const activeColumnsOrder = useLiveQuery(async () => {
        const result = await getColumnsOrder();
        if (!result.success || !result.data) return [];

        const columns = await getColumnsByIds(result.data);
        return result.data.filter(
            (_, index) => columns[index] && !isColumnArchived(columns[index]!),
        );
    }, []);

    // All state and handlers from custom hook
    const { form, actions, ui } = useColumnMenuHandlers({
        columnId,
        column,
        archivedAt,
        onClose,
    });

    const darkMode =
        document.documentElement.getAttribute('data-theme-mode') === 'dark';

    if (!column || !activeColumnsOrder) {
        return null;
    }

    const currentIndex = activeColumnsOrder.indexOf(columnId);
    const canMoveLeft = currentIndex > 0;
    const canMoveRight = currentIndex < activeColumnsOrder.length - 1;

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
                handleArchive={actions.handleArchive}
                handlePermanentDelete={actions.handlePermanentDelete}
                handleSave={actions.handleSave}
                isSaving={ui.isSaving}
            />
        </ModalShell>
    );
};

export default React.memo(ColumnMenu);
