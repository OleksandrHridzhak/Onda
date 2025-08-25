
import { useSelector } from 'react-redux';

export default function SettingsTemplate({ title, children }) {
  const { theme } = useSelector((state) => state.theme);

  return (
    <div className="space-y-6">
      <div className={`border-b ${theme.border} pb-4`}>
        <h3 className={`text-base font-medium ${theme.textTableValues}`}>
          {title}
        </h3>
        <div className="mt-4 space-y-3">
          {children}
        </div>
      </div>
    </div>
  );
}
