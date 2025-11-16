import { Minus, Square, X } from 'lucide-react';
import { useSelector } from 'react-redux';

interface MenuWinProps {
  currentPage?: string;
}

interface RootState {
  newTheme: {
    themeMode: string;
  };
}

const MenuWin: React.FC<MenuWinProps> = ({ currentPage = '/' }) => {
  const themeMode = useSelector((state: RootState) => state.newTheme.themeMode);

  const getContainerClass = (): string => {
    if (!(themeMode === 'dark')) return '';

    if (currentPage === '/settings' || currentPage === '/calendar') {
      return ' bg-gray-800';
    }

    return ' bg-gray-900';
  };

  const getButtonClass = (isClose = false): string => {
    const base =
      'w-8 h-8 flex items-center justify-center rounded no-drag transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1';

    if (isClose) {
      return themeMode === 'dark'
        ? `${base} text-gray-300 hover:bg-red-600 hover:text-white focus:ring-red-500`
        : `${base} text-gray-400 hover:bg-red-500 hover:text-white focus:ring-red-400`;
    }

    return themeMode === 'dark'
      ? `${base} text-gray-300 hover:bg-gray-600 hover:text-white focus:ring-gray-500`
      : `${base} text-gray-400 hover:bg-gray-200 hover:text-gray-900 focus:ring-gray-400`;
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
        className={getButtonClass(true)}
        aria-label="Close window"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default MenuWin;
