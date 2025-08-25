import { Plus } from 'lucide-react';
import { useSelector } from 'react-redux';

export const AddNewColumnBtn = ({
  setShowColumnSelector,
  showColumnSelector,
}) => {
  const theme = useSelector((state) => state.theme.theme);
  return (
    <button
      onClick={() => setShowColumnSelector(!showColumnSelector)}
      className={`
      relative w-12 h-12 ml-2 flex items-center justify-center
      rounded-lg  z-10
      ${theme.tableBodyBg}
      ${theme.toggleIcon}
      ${theme.border}
      border-t border-l border-r border-b
    `}
      title="Add Column"
    >
      <Plus className="w-4 h-4" />
    </button>
  );
};
