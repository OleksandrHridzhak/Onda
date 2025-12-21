import { useEffect, useRef } from 'react';
import './App.css';
import {
  HashRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { settingsService } from './services/settingsDB';
import Sidebar from './components/Sidebar';
import Table from './components/pages/TablePage';
import MenuWin from './components/layout/MenuWin';
import Calendar from './components/pages/CalendarPage';
import Settings from './components/pages/SettingsPage';

const routes = ['/', '/calendar', '/settings'];

function MainContent() {
  const location = useLocation();

  useEffect(() => {
    // First, try to apply theme from localStorage to prevent flash
    const savedTheme = localStorage.getItem('themeMode');
    const savedColor = localStorage.getItem('colorScheme');

    if (savedTheme) {
      document.documentElement.setAttribute('data-theme-mode', savedTheme);
    }
    if (savedColor) {
      document.documentElement.setAttribute('data-color-scheme', savedColor);
    }
  }, []);

  const isElectron = typeof window !== 'undefined' && !!window.electronAPI;

  return (
    <div className={`flex-1 flex flex-col bg-background overflow-x-auto`}>
      {isElectron && <MenuWin currentPage={location.pathname} />}
      <Routes>
        <Route path="/" element={<Table />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const isProcessing = useRef(false);

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

    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'Tab') {
        event.preventDefault();
        handleNextTab();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

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
