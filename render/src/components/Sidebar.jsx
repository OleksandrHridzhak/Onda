import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {toggleThemeMode} from '../store/slices/newThemeSlice';
import { sideBarItems } from './utils/constants';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const themeMode = useSelector(state => state.newTheme.themeMode);
  const deriveActive = (path) => {
    if (path.startsWith('/calendar')) return 'calendar';
    if (path.startsWith('/settings')) return 'settings';
    if (path.startsWith('/custom')) return 'custom';
    return 'home';
  };
  const [active, setActive] = useState(deriveActive(location.pathname));

  useEffect(() => {
    setActive(deriveActive(location.pathname));
  }, [location.pathname]);

  const toggleTheme = () => {
    dispatch(toggleThemeMode());
  };

  return (
    <div
      className={`w-1/8 h-screen bg-background border-border flex flex-col items-center justify-between p-4 border-r`}
    >
      <div>
        {/* Logo */}
        <p
          className={`font-poppins font-medium text-md mt-6 text-primaryColor`}
        >
          ONDA
        </p>
        <ul className="flex flex-col gap-10 justify-center items-center mt-36">
          {/* List of navigation links */}
          {sideBarItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.path}>
                <li
                  className={`transition-all duration-300 ease-in-out transform p-2 rounded-xl ${active === item.name ? 'bg-primaryColor scale-110 hover:scale-120 shadow-md text-linkActiveText' : 'text-linkInactiveText hover:scale-105 hover:bg-linkInactiveHoverBg'}`}
                  onClick={() => setActive(item.name)}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-300 ${active === item.name ? 'text-iconActive' : 'text-iconInactive'} `}
                    strokeWidth={1.5}
                  />
                </li>
              </Link>
            );
          })}
          {/* Mode toggle btn */}
          <li
            className={`p-2 rounded-xl transition-all duration-300 cursor-pointer`}
            onClick={toggleTheme}
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
