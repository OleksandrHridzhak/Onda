import { useState, useEffect } from "react";
import { Sun, Moon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { toggleMode } from '../store/slices/newThemeSlice';
import { sideBarItems } from "./utils/constants";

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const {theme, mode} = useSelector((state) => state.newTheme);

  const deriveActive = (path) => {
  if (path.startsWith('/calendar')) return 'calendar';
  if (path.startsWith('/settings')) return 'settings';
  return 'home';
  };
  const [active, setActive] = useState(deriveActive(location.pathname));

  useEffect(() => {
    setActive(deriveActive(location.pathname));
  }, [location.pathname]);

  const linkClass = (name) => `transition-all duration-300 ease-in-out transform p-2 rounded-xl 
    ${active === name
      ? theme.linkActive
      : theme.linkInactive}`;

  const iconClass = (name) => `w-6 h-6 transition-colors duration-300 ${active === name ? theme.iconActive : theme.iconInactive}`;

  const toggleTheme = () => {
    dispatch(toggleMode())
  };

  return (
    <div className={`w-1/8 h-screen ${theme.background} ${theme.border} flex flex-col items-center justify-between p-4 border-r`}>
      <div>
        {/* Logo */}
        <p className={`font-poppins font-medium text-md mt-6 ${theme.textAccent}`}>
          ONDA
        </p>
        <ul className="flex flex-col gap-10 justify-center items-center mt-36">
          {/* List of navigation links */}
          {sideBarItems.map(item => {
            const Icon = item.icon;
            return (
              <Link key={item.name} to={item.path}>
                <li className={linkClass(item.name)} onClick={() => setActive(item.name)}>
                  <Icon className={iconClass(item.name)} strokeWidth={1.5} />
                </li>
              </Link>
            );
          })}
          {/* Mode toggle btn */}
          <li
            className={`p-2 rounded-xl ${theme.sidebarToggleHover} transition-all duration-300 cursor-pointer`}
            onClick={toggleTheme}
          >
            {mode === 'dark' ? (
              <Moon className={`w-6 h-6 ${theme.toggleIcon} transition-all duration-300 transform rotate-0 hover:rotate-[360deg]`} strokeWidth={1.5} />
            ) : (
              <Sun className={`w-6 h-6 ${theme.toggleIcon} transition-all duration-300 transform rotate-0 hover:rotate-180`} strokeWidth={1.5} />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;