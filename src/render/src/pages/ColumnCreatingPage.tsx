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
} from 'lucide-react';
import { COLUMN_TYPES } from 'app/constants/columnTypes';
import { COLOR_STYLES, type ColorName } from 'app/utils/colorOptions';
import { PageHeader } from 'shared/layout/PageHeader';

interface ColumnType {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactElement;
    accent: ColorName;
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
            icon: <ListTodo className="w-5 h-5" />,
            accent: 'accent6',
        },
        {
            id: COLUMN_TYPES.CHECKBOX,
            label: 'Checkbox',
            description: 'Simple on/off checkbox for marking items done.',
            icon: <CheckSquare className="w-5 h-5" />,
            accent: 'accent2',
        },
        {
            id: COLUMN_TYPES.NUMBERBOX,
            label: 'Number',
            description: 'Numeric input for counts, scores or measurements.',
            icon: <Hash className="w-5 h-5" />,
            accent: 'accent1',
        },
        {
            id: COLUMN_TYPES.TAGS,
            label: 'Tags',
            description: 'Tag-based multi-select for categorizing items.',
            icon: <Tag className="w-5 h-5" />,
            accent: 'accent3',
        },

        {
            id: COLUMN_TYPES.TEXTBOX,
            label: 'Notes',
            description: 'Free-form text field for notes and descriptions.',
            icon: <Type className="w-5 h-5" />,
            accent: 'accent4',
        },
        {
            id: COLUMN_TYPES.MULTI_CHECKBOX,
            label: 'Multi Checkbox',
            description: 'Multiple checkbox options for subtasks or choices.',
            icon: <Circle className="w-5 h-5" />,
            accent: 'accent8',
        },
        {
            id: COLUMN_TYPES.TASK_TABLE,
            label: 'Task Table',
            description: 'Nested task table for managing tasks inside a row.',
            icon: <Table className="w-5 h-5" />,
            accent: 'accent9',
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
            <div className="relative z-50 flex h-full w-full flex-col border border-border bg-background md:border-l-0 animate-fade-in">
                <PageHeader
                    title="Select Column Type"
                    icon={<Table size={22} />}
                    className="z-10"
                >
                    <button
                        onClick={onCancel}
                        className="rounded-full p-2 text-textMuted transition-colors hover:bg-backgrundHover hover:text-text"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </PageHeader>

                <div
                    className={`grid flex-1 min-h-0 grid-cols-1 gap-4 overflow-auto p-6 md:grid-cols-2 lg:grid-cols-3 ${darkMode ? 'custom-scroll-y-dark' : 'custom-scroll-y-light'} md:hide-scrollbar`}
                >
                    {columnTypes.map((type) => {
                        const accentStyles = COLOR_STYLES[type.accent];

                        return (
                            <button
                                key={type.id}
                                onClick={() => onSelect(type.id)}
                                className="relative flex h-full w-full flex-col items-start justify-start gap-4 overflow-hidden rounded-lg border border-border bg-surface p-6 text-left transition-all duration-200 hover:border-primaryColor/30 hover:bg-surfaceMuted hover:shadow-sm"
                            >
                                <div
                                    className={`rounded-lg p-3 ${accentStyles.bg} ${accentStyles.text}`}
                                >
                                    {type.icon}
                                </div>
                                <div className="text-left">
                                    <div className="font-semibold text-text">
                                        {type.label}
                                    </div>
                                    <div className="mt-1 text-sm text-textMuted">
                                        {type.description}
                                    </div>
                                </div>
                            </button>
                        );
                    })}
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
