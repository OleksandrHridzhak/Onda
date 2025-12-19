import React from 'react';
import { Plus } from 'lucide-react';

interface AddNewColumnBtnProps {
  setShowColumnSelector: (show: boolean) => void;
  showColumnSelector: boolean;
}

export const AddNewColumnBtn: React.FC<AddNewColumnBtnProps> = ({
  setShowColumnSelector,
  showColumnSelector,
}) => {
  return (
    <button
      onClick={() => setShowColumnSelector(!showColumnSelector)}
      className={`
      relative w-12 h-12 ml-2 flex items-center justify-center
      rounded-lg  z-10
      bg-tableBodyBg
      text-toggleIcon
      border-border
      border-t border-l border-r border-b
    `}
      title="Add Column"
    >
      <Plus className="w-4 h-4" />
    </button>
  );
};
