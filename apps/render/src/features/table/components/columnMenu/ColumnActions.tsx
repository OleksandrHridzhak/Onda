import React, { useState } from "react";
import { Button } from "shared/ui/Button";
import { ConfirmModal } from "shared/ui/ConfirmModal";
import { useColumnMenuContext } from "./ColumnMenuContext";

export const ColumnActions = (): React.ReactElement => {
  const { actions, ui } = useColumnMenuContext();
  const { handleArchive, handlePermanentDelete, handleSave } = actions;
  const { isSaving } = ui;
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  return (
    <div className="flex justify-between gap-2 mt-6">
      <div className="flex gap-2">
        <Button
          onClick={() => setShowArchiveConfirm(true)}
          disabled={isSaving}
          variant="secondary"
        >
          Archive
        </Button>
        <ConfirmModal
          isOpen={showArchiveConfirm}
          onClose={() => setShowArchiveConfirm(false)}
          onConfirm={handleArchive}
          title="Archive Column"
          message="Archive this column? It will remain visible in historical weeks through the current week."
          confirmText="Archive"
          cancelText="Cancel"
        />
        <Button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isSaving}
          variant="danger"
        >
          Delete permanently
        </Button>
        <ConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handlePermanentDelete}
          title="Delete Column Permanently"
          message="Permanently delete this column and all its historical entries? This action cannot be undone."
          confirmText="Delete permanently"
          cancelText="Cancel"
        />
      </div>
      <Button onClick={handleSave} disabled={isSaving}>
        Save Changes
      </Button>
    </div>
  );
};
