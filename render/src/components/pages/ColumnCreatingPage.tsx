import React from 'react';
import {
    CheckSquare,
    Hash,
    Tag,
    Type,
    X,
    ListTodo,
    Circle,
    Table,
    FolderOpen,
} from 'lucide-react';
import { COLUMN_TYPES } from '../../constants/columnTypes';

interface ColumnType {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactElement;
    bgColor: string;
    hoverColor: string;
}

interface ColumnCreatingPageProps {
    onSelect: (typeId: string) => void;
    onCancel: () => void;
    darkMode: boolean;
}

const ColumnCreatingPage: React.FC<ColumnCreatingPageProps> = ({
    onSelect,
    onCancel,
    darkMode,
}) => {
    const columnTypes: ColumnType[] = [
        {
            id: COLUMN_TYPES.TODO,
            label: 'Todo List',
            description:
                'Checklist-style column for tasks with categories and quick add.',
            icon: (
                <ListTodo
                    className={`w-5 h-5 ${darkMode ? 'text-red-200' : 'text-red-600'}`}
                />
            ),
            bgColor: darkMode ? 'bg-red-800 bg-opacity-40' : 'bg-red-200',
            hoverColor: darkMode
                ? 'hover:bg-red-700 hover:bg-opacity-50'
                : 'hover:bg-red-300',
        },
        {
            id: COLUMN_TYPES.CHECKBOX,
            label: 'Checkbox',
            description: 'Simple on/off checkbox for marking items done.',
            icon: (
                <CheckSquare
                    className={`w-5 h-5 ${darkMode ? 'text-blue-200' : 'text-blue-600'}`}
                />
            ),
            bgColor: darkMode ? 'bg-blue-800 bg-opacity-40' : 'bg-blue-200',
            hoverColor: darkMode
                ? 'hover:bg-blue-700 hover:bg-opacity-50'
                : 'hover:bg-blue-300',
        },
        {
            id: COLUMN_TYPES.NUMBERBOX,
            label: 'Number',
            description: 'Numeric input for counts, scores or measurements.',
            icon: (
                <Hash
                    className={`w-5 h-5 ${darkMode ? 'text-green-200' : 'text-green-600'}`}
                />
            ),
            bgColor: darkMode ? 'bg-green-800 bg-opacity-40' : 'bg-green-200',
            hoverColor: darkMode
                ? 'hover:bg-green-700 hover:bg-opacity-50'
                : 'hover:bg-green-300',
        },
        {
            id: COLUMN_TYPES.TAGS,
            label: 'Tags',
            description: 'Tag-based multi-select for categorizing items.',
            icon: (
                <Tag
                    className={`w-5 h-5 ${darkMode ? 'text-purple-200' : 'text-purple-600'}`}
                />
            ),
            bgColor: darkMode ? 'bg-purple-800 bg-opacity-40' : 'bg-purple-200',
            hoverColor: darkMode
                ? 'hover:bg-purple-700 hover:bg-opacity-50'
                : 'hover:bg-purple-300',
        },

        {
            id: COLUMN_TYPES.TEXTBOX,
            label: 'Notes',
            description: 'Free-form text field for notes and descriptions.',
            icon: (
                <Type
                    className={`w-5 h-5 ${darkMode ? 'text-amber-200' : 'text-amber-600'}`}
                />
            ),
            bgColor: darkMode ? 'bg-amber-800 bg-opacity-40' : 'bg-amber-200',
            hoverColor: darkMode
                ? 'hover:bg-amber-700 hover:bg-opacity-50'
                : 'hover:bg-amber-300',
        },
        {
            id: COLUMN_TYPES.MULTI_CHECKBOX,
            label: 'Multi Checkbox',
            description: 'Multiple checkbox options for subtasks or choices.',
            icon: (
                <Circle
                    className={`w-5 h-5 ${darkMode ? 'text-teal-200' : 'text-teal-600'}`}
                />
            ),
            bgColor: darkMode ? 'bg-teal-800 bg-opacity-40' : 'bg-teal-200',
            hoverColor: darkMode
                ? 'hover:bg-teal-700 hover:bg-opacity-50'
                : 'hover:bg-teal-300',
        },
        {
            id: COLUMN_TYPES.TASK_TABLE,
            label: 'Task Table',
            description: 'Nested task table for managing tasks inside a row.',
            icon: (
                <Table
                    className={`w-5 h-5 ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
                />
            ),
            bgColor: darkMode ? 'bg-gray-800 bg-opacity-36' : 'bg-gray-200',
            hoverColor: darkMode
                ? 'hover:bg-gray-700 hover:bg-opacity-50'
                : 'hover:bg-gray-300',
        },
        {
            id: COLUMN_TYPES.GROUP_DIVIDER,
            label: 'Group Divider',
            description: 'Visual separator to organize columns into groups.',
            icon: (
                <FolderOpen
                    className={`w-5 h-5 ${darkMode ? 'text-slate-200' : 'text-slate-600'}`}
                />
            ),
            bgColor: darkMode ? 'bg-slate-800 bg-opacity-36' : 'bg-slate-200',
            hoverColor: darkMode
                ? 'hover:bg-slate-700 hover:bg-opacity-50'
                : 'hover:bg-slate-300',
        },
    ];

    return (
        <div
            className={`fixed inset-0 md:left-20 z-50`}
            role="dialog"
            aria-modal="true"
            onClick={(e) => {
                if (e.target === e.currentTarget) onCancel();
            }}
            onKeyDown={(e) => {
                if (e.key === 'Escape') onCancel();
            }}
            tabIndex={-1}
        >
            {/* Panel occupies full viewport except left sidebar on md+ */}
            <div
                className={`relative w-full h-full  ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'} z-50 border md:border-l-0 animate-fade-in`}
            >
                <div
                    className={`p-4 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-100 bg-white'} flex justify-between items-center sticky top-0 z-10`}
                >
                    <h3
                        className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}
                    >
                        Select Column Type
                    </h3>
                    <button
                        onClick={onCancel}
                        className={`p-2 rounded-full ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                        aria-label="Close"
                    >
                        <X
                            className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                        />
                    </button>
                </div>

                <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 h-[calc(100%-64px)] overflow-auto ${darkMode ? 'custom-scroll-y-dark' : 'custom-scroll-y-light'} md:hide-scrollbar`}
                >
                    {columnTypes.map((type) => (
                        <button
                            key={type.id}
                            onClick={() => onSelect(type.id)}
                            className={`w-full h-full flex flex-col items-start justify-start gap-4 p-6 transition-all duration-200 ${type.bgColor} ${type.hoverColor} rounded-lg`}
                        >
                            <div
                                className={`p-3 rounded-lg ${darkMode ? type.bgColor : type.bgColor.replace('200', '100')}`}
                            >
                                {type.icon}
                            </div>
                            <div className="text-left">
                                <div
                                    className={`font-semibold ${darkMode ? 'text-gray-100' : 'text-gray-800'}`}
                                >
                                    {type.label}
                                </div>
                                <div
                                    className={`text-sm mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}
                                >
                                    {type.description}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

const styles = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1;  }
  }
`;

if (typeof document !== 'undefined') {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement);
}

export default ColumnCreatingPage;
