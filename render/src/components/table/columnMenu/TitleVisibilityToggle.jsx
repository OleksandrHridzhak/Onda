import {Eye, EyeOff} from 'lucide-react';


export const TitleVisibilityToggle = ({ showTitle, setShowTitle, darkMode }) => (
  <div className="flex items-center h-12 w-12 justify-center absolute right-0 top-0">
    <button
      onClick={() => setShowTitle(!showTitle)}
      className={`flex items-center space-x-2 ${darkMode ? 'text-gray-200' : 'text-gray-700'} transition-colors duration-200`}
      aria-label={showTitle ? 'Hide column title' : 'Show column title'}
    >
      {showTitle ? <Eye size={18} /> : <EyeOff size={18} />}
    </button>
  </div>
);