import { Minus, Square, X } from 'lucide-react';
import {useSelector} from 'react-redux';

const MenuWin = ({ currentPage = '/' }) => {
  const themeMode = useSelector((state) => state.newTheme.themeMode);
 
  const getContainerClass = () => {
    if (currentPage === '/settings' || currentPage === '/calendar') {
      return 'bg-table-body-background';
    }
    return 'bg-ui-background';
  };

  const buttonClass = `w-8 h-8 flex items-center justify-center rounded no-drag transition-colors duration-200 text-text-tertiary hover:bg-ui-hover`;

  return (
    <div className={`w-full flex items-center justify-end gap-1 drag ${getContainerClass()}`}>
      <button
        onClick={() => window.electronAPI?.minimizeWindow()}
        className={buttonClass}
        aria-label="Minimize window"
      >
        <Minus size={16} />
      </button>
      <button
        onClick={() => window.electronAPI?.maximizeWindow()}
        className={buttonClass}
        aria-label="Maximize window"
      >
        <Square size={16} />
      </button>
      <button
        onClick={() => window.electronAPI?.closeWindow()}
        className={buttonClass}
        aria-label="Close window"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default MenuWin;
