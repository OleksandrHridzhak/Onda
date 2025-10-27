import {
  CheckSquare,
  Hash,
  Tag,
  Type,
  X,
  ListTodo,
  Circle,
  Table,
} from 'lucide-react';
import { useSelector } from 'react-redux';

const ColumnTypeSelector = ({ onSelect, onCancel }) => {
  const themeMode = useSelector((state) => state.newTheme.themeMode);
  const columnTypes = [
    {
      id: 'todo',
      label: 'Todo List',
      icon: (
        <ListTodo
          className={`w-5 h-5 ${themeMode === 'dark' ? 'text-red-400' : 'text-red-600'}`}
        />
      ),
      bgColor: themeMode === 'dark' ? 'bg-red-900' : 'bg-red-50',
      hoverColor: themeMode === 'dark' ? 'hover:bg-red-800' : 'hover:bg-red-100',
    },
    {
      id: 'checkbox',
      label: 'Checkbox',
      icon: (
        <CheckSquare
          className={`w-5 h-5 ${themeMode === 'dark' ? 'text-blue-400' : 'text-blue-600'}`}
        />
      ),
      bgColor: themeMode === 'dark' ? 'bg-blue-900' : 'bg-blue-50',
      hoverColor: themeMode === 'dark' ? 'hover:bg-blue-800' : 'hover:bg-blue-100',
    },
    {
      id: 'numberbox',
      label: 'Number',
      icon: (
        <Hash
          className={`w-5 h-5 ${themeMode === 'dark' ? 'text-green-400' : 'text-green-600'}`}
        />
      ),
      bgColor: themeMode === 'dark' ? 'bg-green-900' : 'bg-green-50',
      hoverColor: themeMode === 'dark' ? 'hover:bg-green-800' : 'hover:bg-green-100',
    },
    {
      id: 'multi-select',
      label: 'Tags',
      icon: (
        <Tag
          className={`w-5 h-5 ${themeMode === 'dark' ? 'text-purple-400' : 'text-purple-600'}`}
        />
      ),
      bgColor: themeMode === 'dark' ? 'bg-purple-900' : 'bg-purple-50',
      hoverColor: themeMode === 'dark' ? 'hover:bg-purple-800' : 'hover:bg-purple-100',
    },
    {
      id: 'text',
      label: 'Notes',
      icon: (
        <Type
          className={`w-5 h-5 ${themeMode === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}
        />
      ),
      bgColor: themeMode === 'dark' ? 'bg-amber-900' : 'bg-amber-50',
      hoverColor: themeMode === 'dark' ? 'hover:bg-amber-800' : 'hover:bg-amber-100',
    },
    {
      id: 'multicheckbox',
      label: 'Multi Checkbox',
      icon: (
        <Circle
          className={`w-5 h-5 ${themeMode === 'dark' ? 'text-teal-400' : 'text-teal-600'}`}
        />
      ),
      bgColor: themeMode === 'dark' ? 'bg-teal-900' : 'bg-teal-50',
      hoverColor: themeMode === 'dark' ? 'hover:bg-teal-800' : 'hover:bg-teal-100',
    },
    {
      id: 'tasktable',
      label: 'Tasktable',
      icon: (
        <Table
          className={`w-5 h-5 ${themeMode === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        />
      ),
      bgColor: themeMode === 'dark' ? 'bg-gray-800' : 'bg-gray-50',
      hoverColor: themeMode === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    },
  ];

  return (
    <div className="mt-1 w-56 bg-ui-background border-ui-border rounded-xl shadow-xl z-20 border overflow-hidden animate-fade-in">
      <div className="p-3 border-b border-ui-border bg-ui-background flex justify-between items-center">
        <h3 className="font-medium text-text-primary">Select Column Type</h3>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-ui-hover transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4 text-text-tertiary" />
        </button>
      </div>

      <div className="divide-y divide-ui-border">
        {columnTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`w-full px-4 py-3 flex items-center space-x-3 transition-all duration-200 ${type.bgColor} ${type.hoverColor}`}
          >
            <div className={`p-2 rounded-lg bg-opacity-70 ${type.bgColor}`}>
              {type.icon}
            </div>
            <span className="font-medium text-text-primary">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.15s ease-out forwards;
  }
`;

if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}

export default ColumnTypeSelector;
