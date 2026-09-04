import { Route, Routes } from "react-router-dom";
import { CalendarPage } from "app/routes/CalendarPage";
import { SettingsPage } from "app/routes/SettingsPage";
import { StatisticsPage } from "app/routes/StatisticsPage";
import { TablePage } from "app/routes/TablePage";

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
