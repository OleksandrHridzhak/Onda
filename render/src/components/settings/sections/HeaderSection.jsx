export default function HeaderSection({ settings, onHeaderChange, darkTheme }) {
  return (
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>
          Header Layout
        </h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
              Layout
            </span>
            <select
              value={settings.header.layout}
              onChange={(e) => onHeaderChange({ layout: e.target.value })}
              className={`block w-40 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white text-gray-600'}`}
            >
              <option value="default">Default</option>
              <option value="withWidget">With Widget</option>
              <option value="bothWidgets">Both widgets</option>
              <option value="spacious">Spacious</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}