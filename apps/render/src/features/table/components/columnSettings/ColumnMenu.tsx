import React from "react";
import { useDbQuery } from "shared/api/db";
import { icons } from "shared/lib/icons";
import { OptionsList } from "./OptionList";
import { ColumnBasicSettings } from "./ColumnBasicSettings";
import { ColumnActions } from "./ColumnActions";
import { ColorPicker } from "shared/ui/ColorPicker";
import { ModalShell } from "shared/ui/ModalShell";
import { getColumnById, getColumnsByIds } from "../../api/columns";
import { getColumnsOrder } from "features/settings/api/settings";
import { useColumnMenuHandlers } from "../../hooks/useColumnMenuHandlers";
import { COLUMN_TYPES, hasOptionsSupport } from "../../types/columnDefinitions";
import { isColumnArchived } from "../../utils/lifecycle";

interface ColumnMenuProps {
  columnId: string;
  archivedAt: Date;
  onClose: () => void;
}

export const ColumnMenu = ({
  columnId,
  archivedAt,
  onClose,
}: ColumnMenuProps) => {
  const column = useDbQuery(
    async () => {
      const result = await getColumnById(columnId);
      if (result.success && result.data) {
        return result.data;
      }
      return null;
    },
    ["columns"],
    columnId,
  );

  const activeColumnsOrder = useDbQuery(async () => {
    const result = await getColumnsOrder();
    if (!result.success || !result.data) return [];

    const columns = await getColumnsByIds(result.data);
    return result.data.filter(
      (_, index) => columns[index] && !isColumnArchived(columns[index]!),
    );
  }, ["columns", "settings"]);

  // All state and handlers from custom hook
  const { form, actions, ui } = useColumnMenuHandlers({
    columnId,
    column,
    archivedAt,
    onClose,
  });

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
