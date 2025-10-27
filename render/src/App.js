import { useEffect, useRef } from 'react';
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
//import { fetchTheme } from './store/slices/themeSlice';
import { fetchTheme } from './store/slices/themeSlice';
import { fetchSettings } from './store/slices/settingsSlice';

import Sidebar from './components/Sidebar';
import Table from './components/table/Table';
import MenuWin from './components/MenuWin';
import Calendar from './components/calendar/Calendar';
import Settings from './components/settings/Settings';
import CustomPage from './components/customPage/CustomPage';

// Persistent wrapper keeps CustomPage mounted and only toggles visibility
const PersistentCustomPageWrapper = () => {
  const location = useLocation();
  const { customPageEnabled } = useSelector((state) => state.settings);
  const show = location.pathname === '/custom' && customPageEnabled;

  return (
    <div className={`absolute inset-0 z-10 ${show ? '' : 'hidden'}`}>
      <CustomPage />
    </div>
  );
};

const routes = ['/', '/calendar', '/settings', '/custom'];

function MainContent({ isDarkMode, setIsDarkMode }) {
  const location = useLocation();
    useEffect(() => {
    // themeMode
    let themeMode = localStorage.getItem("themeMode");
    if (!themeMode) {
      themeMode = "light"; // дефолтна тема
      localStorage.setItem("themeMode", themeMode);
    }
    document.documentElement.setAttribute("data-theme-mode", themeMode);

    // colorScheme
    let colorScheme = localStorage.getItem("colorScheme");
    if (!colorScheme) {
      colorScheme = "standard"; // дефолтна схема
      localStorage.setItem("colorScheme", colorScheme);
    }
    document.documentElement.setAttribute("data-color-scheme", colorScheme);
  }, []);
  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  return (
    <div className={`flex-1 flex flex-col bg-background relative`}>
      {isElectron && (  
        <MenuWin darkTheme={isDarkMode} currentPage={location.pathname} />
      )}
      <Routes>
        <Route path="/" element={<Table />} />
        <Route
          path="/calendar"
          element={
            <Calendar darkTheme={isDarkMode} setDarkTheme={setIsDarkMode} />
          }
        />
        <Route
          path="/settings"
          element={
            <Settings darkTheme={isDarkMode} setDarkTheme={setIsDarkMode} />
          }
        />
        {/* NOTE: '/custom' route is intentionally not rendering CustomPage directly
            because CustomPage is mounted persistently below to avoid reloads on navigation. */}
      </Routes>

      {/* Persistent CustomPage mount — kept mounted to preserve webview state. */}
      <PersistentCustomPageWrapper />
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isProcessing = useRef(false);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTheme()); // тут отримуємо тему з Electron при старті апки
    dispatch(fetchSettings());
  }, [dispatch]);
  // Початкове отримання теми

  // Гаряча клавіша для перемикання вкладок
  useEffect(() => {
    const handleNextTab = () => {
      if (isProcessing.current) return;
      isProcessing.current = true;

      const currentIndex = routes.indexOf(location.pathname);
      const nextIndex = (currentIndex + 1) % routes.length;
      navigate(routes[nextIndex]);

      setTimeout(() => {
        isProcessing.current = false;
      }, 300);
    };

    // Локальний шорткат Control+Tab
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Tab') {
        event.preventDefault();
        handleNextTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    // Очищення
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, location.pathname]);

  return (
    <div className={`flex flex-col h-screen`}>
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MainContent />
      </div>
    </div>
  );
}

export default function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}
