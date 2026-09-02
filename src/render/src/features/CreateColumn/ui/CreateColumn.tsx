import React from 'react';
import { X, Table } from 'lucide-react';
import { getIconComponent } from 'shared/lib/icons';
import { COLUMN_DEFINITIONS } from 'entities/Column';
import { COLOR_STYLES, type ColorName } from 'shared/lib/color';
import { PageHeader } from 'shared/ui/PageHeader';
import { Button } from 'shared/ui/Button';
import { Text } from 'shared/ui/Text';

interface ColumnCreationOption {
    id: string;
    label: string;
    description?: string;
    icon: React.ReactNode;
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
    const columnTypes: ColumnCreationOption[] = Object.values(
        COLUMN_DEFINITIONS,
    ).map((def) => ({
        id: def.template.type,
        label: def.creation.label,
        description: def.creation.description,
        icon: getIconComponent(def.creation.iconName, 20),
        accent: def.creation.accent,
    }));

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
                    <Button
                        onClick={onCancel}
                        variant="ghost"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" />
                    </Button>
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
                                    <Text
                                        as="div"
                                        tone="muted"
                                        className="mt-1"
                                    >
                                        {type.description}
                                    </Text>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ColumnCreatingPage;
