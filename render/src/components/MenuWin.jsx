import { Minus, Square, X } from 'lucide-react';
import { useSelector } from 'react-redux';

const MenuWin = ({ currentPage = '/' }) => {
  const themeMode = useSelector((state) => state.newTheme.themeMode);

  const getContainerClass = () => {
    if (!(themeMode === 'dark')) return '';

    if (currentPage === '/settings' || currentPage === '/calendar') {
      return ' bg-gray-800';
    }

    return ' bg-gray-900';
  };

  const getButtonClass = () => {
    const base =
      'w-8 h-8 flex items-center justify-center rounded no-drag transition-colors duration-200';
    return themeMode === 'dark'
      ? `${base} text-gray-300 hover:bg-gray-600 hover:text-white`
      : `${base} text-gray-400 hover:bg-gray-200`;
  };

  return (
    <div
      className={`w-full flex items-center justify-end gap-1 drag ${getContainerClass()}`}
    >
      <button
        onClick={() => window.electronAPI?.minimizeWindow()}
        className={getButtonClass()}
        aria-label="Minimize window"
      >
        <Minus size={16} />
      </button>
      <button
        onClick={() => window.electronAPI?.maximizeWindow()}
        className={getButtonClass()}
        aria-label="Maximize window"
      >
        <Square size={16} />
      </button>
      <button
        onClick={() => window.electronAPI?.closeWindow()}
        className={getButtonClass()}
        aria-label="Close window"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default MenuWin;
