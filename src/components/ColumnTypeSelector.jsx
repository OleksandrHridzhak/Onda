import React from 'react';
import { CheckSquare, Hash, Tag, Type, X, ListTodo } from 'lucide-react';

const ColumnTypeSelector = ({ onSelect, onCancel, darkMode }) => {
  const columnTypes = [
    { 
      id: 'todo', 
      label: 'Todo List', 
      icon: <ListTodo className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />,
      bgColor: darkMode ? 'bg-red-900' : 'bg-red-50',
      hoverColor: darkMode ? 'hover:bg-red-800' : 'hover:bg-red-100'
    },
    { 
      id: 'checkbox', 
      label: 'Checkbox', 
      icon: <CheckSquare className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />,
      bgColor: darkMode ? 'bg-blue-900' : 'bg-blue-50',
      hoverColor: darkMode ? 'hover:bg-blue-800' : 'hover:bg-blue-100'
    },
    { 
      id: 'numberbox', 
      label: 'Number', 
      icon: <Hash className={`w-5 h-5 ${darkMode ? 'text-green-400' : 'text-green-600'}`} />,
      bgColor: darkMode ? 'bg-green-900' : 'bg-green-50',
      hoverColor: darkMode ? 'hover:bg-green-800' : 'hover:bg-green-100'
    },
    { 
      id: 'multi-select', 
      label: 'Tags', 
      icon: <Tag className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />,
      bgColor: darkMode ? 'bg-purple-900' : 'bg-purple-50',
      hoverColor: darkMode ? 'hover:bg-purple-800' : 'hover:bg-purple-100'
    },
    { 
      id: 'text', 
      label: 'Notes', 
      icon: <Type className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />,
      bgColor: darkMode ? 'bg-amber-900' : 'bg-amber-50',
      hoverColor: darkMode ? 'hover:bg-amber-800' : 'hover:bg-amber-100'
    }
  ];

  return (
    <div className={`absolute right-0 top-full mt-1 w-56 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} rounded-xl shadow-xl z-20 border overflow-hidden animate-fade-in`}>
      <div className={`p-3 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'} flex justify-between items-center`}>
        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>Select Column Type</h3>
        <button 
          onClick={onCancel}
          className={`p-1 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
          aria-label="Close"
        >
          <X className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>
      
      <div className={`divide-y ${darkMode ? 'divide-gray-700' : 'divide-gray-100'}`}>
        {columnTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => onSelect(type.id)}
            className={`w-full px-4 py-3 flex items-center space-x-3 transition-all duration-200 ${type.bgColor} ${type.hoverColor}`}
          >
            <div className={`p-2 rounded-lg ${darkMode ? 'bg-opacity-70' : ''} ${type.bgColor.replace(darkMode ? '900' : '50', darkMode ? '800' : '100')}`}>
              {type.icon}
            </div>
            <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// Додайте цей CSS для анімації
const styles = `
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.15s ease-out forwards;
  }
`;

// Додаємо стилі до документа
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.innerHTML = styles;
  document.head.appendChild(styleElement);
}

export default ColumnTypeSelector;