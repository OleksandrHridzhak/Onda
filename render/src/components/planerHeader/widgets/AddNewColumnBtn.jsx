import { Plus } from 'lucide-react';

export const AddNewColumnBtn = ({
  setShowColumnSelector,
  showColumnSelector,
}) => {
  return (
    <button
      onClick={() => setShowColumnSelector(!showColumnSelector)}
      className={`
      relative w-12 h-12 ml-2 flex items-center justify-center
      rounded-lg  z-10
      bg-table-body-background
      text-text-accent
      border-ui-border
      border
    `}
      title="Add Column"
    >
      <Plus className="w-4 h-4" />
    </button>
  );
};
