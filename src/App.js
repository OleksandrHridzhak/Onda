import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Table from './components/pages/Table';
import MenuWin from './components/MenuWin';
import Calendar from './components/pages/Calendar';
import Settings from './components/pages/Settings';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Окремий компонент для основного вмісту
function MainContent({ isDarkMode, setIsDarkMode }) {
  const location = useLocation(); // Правильне місце для useLocation
  
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  
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