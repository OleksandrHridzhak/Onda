import { useState, useEffect } from 'react';
import { Sun, Moon, Plus } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toggleThemeMode } from '../../store/slices/newThemeSlice';
import { createNewColumn } from '../../store/tableSlice/tableSlice';
import ColumnTypeSelector from '../features/PlannerHeader/ColumnTypeSelector';
import { sideBarItems } from '../../utils/constants';

interface RootState {
  newTheme: {
    themeMode: string;
  };
}

type ActivePage = 'home' | 'calendar' | 'settings';

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const themeMode = useSelector((state: RootState) => state.newTheme.themeMode);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const deriveActive = (path: string): ActivePage => {
    if (path.startsWith('/calendar')) return 'calendar';
    if (path.startsWith('/settings')) return 'settings';
    return 'home';
  };

  const [active, setActive] = useState<ActivePage>(
    deriveActive(location.pathname),
  );

  useEffect(() => {
    const newActive = deriveActive(location.pathname);
    if (newActive !== active) {
      setActive(newActive);
    }
  }, [location.pathname, active]);

  const toggleTheme = (): void => {
    dispatch(toggleThemeMode());
  };

  return (
    <div
      className={`
  fixed bottom-0 w-full h-auto bg-background border-t border-border 
  flex flex-row items-center justify-center p-2 z-50
  md:relative md:w-20 md:h-screen md:flex-col md:items-center 
  md:justify-between md:p-4 md:border-r md:border-t-0
`}
    >
      <div>
        <p
          className={`
            hidden md:block font-poppins font-medium text-md mt-6 text-primaryColor
          `}
        >
          ONDA
        </p>
        <ul
          className={`
            flex flex-row gap-6 justify-around items-center w-full mt-0
            md:flex-col md:gap-10 md:justify-center md:items-center md:mt-36 md:w-auto
          `}
        >
          {sideBarItems.map((item) => {
            const Icon = item.icon;
            const isActive = !showColumnSelector && active === item.name;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => {
                  setActive(item.name as ActivePage);
                  setShowColumnSelector(false);
                }}
              >
                <li
                  className={`transition-all duration-300 ease-in-out transform p-2 rounded-xl ${
                    isActive
                      ? 'bg-primaryColor scale-110 hover:scale-120 shadow-md text-linkActiveText'
                      : 'text-linkInactiveText hover:scale-105 hover:bg-linkInactiveHoverBg'
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-300 ${
                      isActive ? 'text-iconActive' : 'text-iconInactive'
                    } `}
                    strokeWidth={1.5}
                  />
                </li>
              </Link>
            );
          })}

          {/* Add new table column button + type selector */}
          <li
            role="button"
            tabIndex={0}
            className={`transition-all duration-300 ease-in-out transform p-2 rounded-xl ${
              showColumnSelector
                ? 'bg-primaryColor scale-110 hover:scale-120 shadow-md text-linkActiveText'
                : 'text-linkInactiveText hover:scale-105 hover:bg-linkInactiveHoverBg'
            } ${active === 'settings' ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:bg-transparent' : ''}`}
            onClick={() => {
              if (active === 'settings') return;
              if (active === 'calendar') {
                window.dispatchEvent(
                  new CustomEvent('open-calendar-new-event'),
                );
                setShowColumnSelector(false);
              } else {
                setShowColumnSelector(true);
              }
            }}
            onKeyDown={(e) => {
              if (active === 'settings') return;
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (active === 'calendar') {
                  window.dispatchEvent(
                    new CustomEvent('open-calendar-new-event'),
                  );
                  setShowColumnSelector(false);
                } else {
                  setShowColumnSelector(true);
                }
              }
            }}
            aria-label="Open add column selector"
            aria-pressed={showColumnSelector}
            aria-disabled={active === 'settings'}
            title={
              active === 'settings' ? 'Disabled in Settings' : 'Add column'
            }
          >
            <Plus
              className={`w-6 h-6 transition-colors duration-300 ${showColumnSelector ? 'text-iconActive' : 'text-iconInactive'}`}
              strokeWidth={1.5}
            />
          </li>

          {showColumnSelector && (
            <div className="absolute left-12 z-50">
              <ColumnTypeSelector
                onSelect={(type: string) => {
                  dispatch(createNewColumn({ columnType: type }));
                  setShowColumnSelector(false);
                }}
                onCancel={() => setShowColumnSelector(false)}
                darkMode={themeMode === 'dark'}
              />
            </div>
          )}
          <li
            role="button"
            tabIndex={0}
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer`}
            onClick={toggleTheme}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTheme();
              }
            }}
            aria-label="Toggle theme"
          >
            {themeMode === 'dark' ? (
              <Moon
                className={`w-6 h-6 text-toggleIcon transition-all duration-300 transform rotate-0 hover:rotate-[360deg]`}
                strokeWidth={1.5}
              />
            ) : (
              <Sun
                className={`w-6 h-6 text-toggleIcon transition-all duration-300 transform rotate-0 hover:rotate-180`}
                strokeWidth={1.5}
              />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
