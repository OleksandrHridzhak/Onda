import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface TitleVisibilityToggleProps {
  showTitle: boolean;
  setShowTitle: (show: boolean) => void;
}

export const TitleVisibilityToggle: React.FC<TitleVisibilityToggleProps> = ({ showTitle, setShowTitle }) => (
  <div className="flex items-center h-12 w-12 justify-center absolute right-0 top-0">
    <button
      onClick={() => setShowTitle(!showTitle)}
      className={`flex items-center space-x-2 text-text transition-colors duration-200`}
      aria-label={showTitle ? 'Hide column title' : 'Show column title'}
    >
      {showTitle ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  </div>
);
