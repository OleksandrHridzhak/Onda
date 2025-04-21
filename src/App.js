import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import Table from './components/pages/Table';
import MenuWin from './components/MenuWin';
import Calendar from './components/pages/Calendar';
import Settings from './components/pages/Settings';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Окремий компонент для основного вмісту
function MainContent({ isDarkMode, setIsDarkMode }) {
  const location = useLocation();

  return (
    <div className={`flex-1 flex flex-col ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <MenuWin darkTheme={isDarkMode} currentPage={location.pathname} />
      <Routes>
        <Route path="/" element={<Table darkMode={isDarkMode} setDarkMode={setIsDarkMode} />} />
        <Route path="/settings" element={<Settings darkTheme={isDarkMode} setDarkTheme={setIsDarkMode} />} />
        <Route path="/calendar" element={<Calendar darkTheme={isDarkMode} setDarkTheme={setIsDarkMode} />} />
      </Routes>
    </div>
  );
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState();

  useEffect(() => {
    window.electronAPI.getTheme().then((res) => {
      if (res?.darkMode !== undefined) {
        setIsDarkMode(res.darkMode);
      }
    });
  }, []);

  useEffect(() => {
    window.electronAPI.switchTheme(isDarkMode);
  }, [isDarkMode]);

  return (
    <Router>
      <div className={`flex flex-col h-screen ${isDarkMode ? 'dark' : ''}`}>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar darkMode={isDarkMode} setDarkMode={setIsDarkMode} />
          <MainContent isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>
      </div>
    </Router>
  );
}

export default App;
