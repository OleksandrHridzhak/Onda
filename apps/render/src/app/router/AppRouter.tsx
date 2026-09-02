import { Route, Routes } from 'react-router-dom';
import { CalendarPage } from 'pages/CalendarPage';
import { SettingsPage } from 'pages/SettingsPage';
import { StatisticsPage } from 'pages/StatisticsPage';
import { TablePage } from 'pages/TablePage';

export function AppRouter(): React.ReactElement {
    return (
        <Routes>
            <Route path="/" element={<TablePage />} />
            <Route path="/calendar" element={<CalendarPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
        </Routes>
    );
}
