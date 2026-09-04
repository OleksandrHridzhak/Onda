import React from "react";
import { OptionsList } from "./OptionList";
import { ColumnBasicSettings } from "./ColumnBasicSettings";
import { ColumnActions } from "./ColumnActions";
import { ColorPicker } from "shared/ui/ColorPicker";
import { ModalShell } from "shared/ui/ModalShell";
import { COLUMN_TYPES, hasOptionsSupport } from "../../types/columnDefinitions";
import { ColumnMenuProvider, useColumnMenuContext } from "./ColumnMenuContext";

interface ColumnMenuProps {
  columnId: string;
  onClose: () => void;
}

const ColumnMenuContent = (): React.ReactElement | null => {
  const { column, activeColumnsOrder, form, actions, onClose } =
    useColumnMenuContext();

  if (!column || !activeColumnsOrder) {
    return null;
  }

  const hasOptions = hasOptionsSupport(column.type);

  return (
    <ModalShell isOpen onClose={onClose} title="Column Settings">
      <ColumnBasicSettings />

      {hasOptions && <OptionsList />}

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

      <ColumnActions />
    </ModalShell>
  );
};

export const ColumnMenu = ({
  columnId,
  onClose,
}: ColumnMenuProps): React.ReactElement => {
  return (
    <ColumnMenuProvider columnId={columnId} onClose={onClose}>
      <ColumnMenuContent />
    </ColumnMenuProvider>
  );
};

export default React.memo(ColumnMenu);
