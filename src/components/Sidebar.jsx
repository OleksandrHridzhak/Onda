import React, { useState, useEffect } from "react";
import { Settings, Home, Calendar1, Sun, Moon } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({darkMode,setDarkMode}) => {
  const [active, setActive] = useState("home");


  // Зберігаємо вибір теми в localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const linkClass = (name) =>
    `transition-all duration-300 ease-in-out transform p-2 rounded-xl 
    ${active === name
      ? darkMode
        ? "bg-blue-500 scale-110 shadow-md text-white"
        : "bg-blue-600 scale-110 shadow-md text-white"
      : darkMode
        ? "text-gray-300 hover:scale-105 hover:bg-gray-700"
        : "text-gray-600 hover:scale-105 hover:bg-blue-50"}`;

  const iconClass = (name) =>
    `w-6 h-6 transition-colors duration-300 
    ${active === name ? "text-white" : darkMode ? "text-gray-300" : "text-gray-600"}`;

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className={`w-1/8 h-screen ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} flex flex-col items-center justify-between p-4 border-r`}>
      <style jsx global>{`
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: ${darkMode ? 'rgba(55, 65, 81, 0.5)' : 'rgba(241, 241, 241, 0.2)'};
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: ${darkMode ? 'rgba(156, 163, 175, 0.7)' : 'rgba(156, 163, 175, 0.5)'};
          border-radius: 4px;
        }
        .custom-scroll::-webkit-scrollbar-thumb:hover {
          background: ${darkMode ? 'rgba(107, 114, 128, 0.9)' : 'rgba(107, 114, 128, 0.7)'};
        }
      `}</style>
      <div>
        <p className={`font-poppins font-medium text-md mt-6 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
          ONDA
        </p>
        <ul className="flex flex-col gap-10 justify-center items-center mt-36">
          <Link to="/">
            <li className={linkClass("home")} onClick={() => setActive("home")}>
              <Home className={iconClass("home")} strokeWidth={1.5} />
            </li>
          </Link>
          <Link to="/calendar">
            <li className={linkClass("calendar")} onClick={() => setActive("calendar")}>
              <Calendar1 className={iconClass("calendar")} strokeWidth={1.5} />
            </li>
          </Link>
          <Link to="/settings">
            <li className={linkClass("settings")} onClick={() => setActive("settings")}>
              <Settings className={iconClass("settings")} strokeWidth={1.5} />
            </li>
          </Link>
          <li
            className={`p-2 rounded-xl ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-blue-50'} transition-all duration-300 cursor-pointer`}
            onClick={toggleTheme}
          >
            {darkMode ? (
              <Moon className="w-6 h-6 text-blue-400 transition-all duration-300 transform rotate-0 hover:rotate-[360deg]" strokeWidth={1.5} />
            ) : (
              <Sun className="w-6 h-6 text-blue-500 transition-all duration-300 transform rotate-0 hover:rotate-180" strokeWidth={1.5} />
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;