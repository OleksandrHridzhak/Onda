import React, { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { getColorOptions } from '../../../../../../utils/colorOptions';
import {
    Tag,
    TagWithProbability,
} from '../../../../../../types/newColumn.types';

interface OptionItemProps {
    tag: Tag;
    darkMode: boolean;
    handleColorChange: (tagId: string, color: string) => void;
    handleRemoveOption: (tagId: string) => void;
    handleEditOption: (tagId: string, newName: string) => void;
    handleProbabilityChange?: (tagId: string, probability: number) => void;
    columnType?: string;
}

export const OptionItem: React.FC<OptionItemProps> = ({
    tag,
    darkMode,
    handleColorChange,
    handleRemoveOption,
    handleEditOption,
    handleProbabilityChange,
    columnType,
}) => {
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
    const [editingTagId, setEditingTagId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [editingProbability, setEditingProbability] = useState(false);
    const [probabilityValue, setProbabilityValue] = useState(0);
    const menuRef = useRef<HTMLDivElement>(null);

    const isRandomTagsColumn = columnType === 'randomTagsColumn';
    const tagWithProb = tag as TagWithProbability;

    const startEditing = (): void => {
        setEditingTagId(tag.id);
        setEditValue(tag.name);
    };

    const startEditingProbability = (): void => {
        setEditingProbability(true);
        setProbabilityValue(tagWithProb.probability || 0);
    };

    const saveEdit = (): void => {
        if (editValue.trim()) {
            handleEditOption(tag.id, editValue.trim());
        }
        setEditingTagId(null);
        setEditValue('');
        setIsContextMenuOpen(false);
    };

    const saveProbability = (): void => {
        if (handleProbabilityChange) {
            const clampedValue = Math.max(0, Math.min(100, probabilityValue));
            handleProbabilityChange(tag.id, clampedValue);
        }
        setEditingProbability(false);
        setIsContextMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setIsContextMenuOpen(false);
            }
        };

        if (isContextMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isContextMenuOpen]);

    const colorOption = getColorOptions({ darkMode }).find(
        (c) => c.name === tag.color,
    );

    return (
        <div key={tag.id} className="relative">
            {editingTagId === tag.id ? (
                <div className="flex items-center">
                    <input
                        type="text"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className={`px-2 py-1 rounded-full text-xs font-medium border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primaryColor`}
                        aria-label={`Edit ${tag.name}`}
                    />
                    <button
                        onClick={saveEdit}
                        className={`ml-2 p-1 rounded-lg text-primaryColor hover:bg-hoverBg transition-colors duration-200`}
                        aria-label={`Save edit for ${tag.name}`}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            ) : editingProbability ? (
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        min="0"
                        max="100"
                        value={probabilityValue}
                        onChange={(e) =>
                            setProbabilityValue(parseInt(e.target.value) || 0)
                        }
                        onKeyPress={(e) =>
                            e.key === 'Enter' && saveProbability()
                        }
                        className={`w-16 px-2 py-1 rounded text-xs font-medium border border-border bg-background text-text focus:outline-none focus:ring-2 focus:ring-primaryColor`}
                        aria-label={`Edit probability for ${tag.name}`}
                    />
                    <span className="text-xs">%</span>
                    <button
                        onClick={saveProbability}
                        className={`p-1 rounded-lg text-primaryColor hover:bg-hoverBg transition-colors duration-200`}
                        aria-label={`Save probability for ${tag.name}`}
                    >
                        <Plus size={14} />
                    </button>
                </div>
            ) : (
                <>
                    <button
                        onClick={() => setIsContextMenuOpen(!isContextMenuOpen)}
                        className={`px-2 py-1 rounded-full text-xs font-medium ${colorOption?.bg} ${colorOption?.text || 'text-text'}`}
                        aria-label={`Options for ${tag.name}`}
                    >
                        {tag.name}
                        {isRandomTagsColumn &&
                            tagWithProb.probability !== undefined && (
                                <span className="ml-1 opacity-75">
                                    ({tagWithProb.probability}%)
                                </span>
                            )}
                    </button>
                    {isContextMenuOpen && (
                        <div
                            ref={menuRef}
                            className={`absolute left-0 top-full mt-1 bg-background border-border border rounded-lg shadow-lg p-2 z-10`}
                        >
                            <div className="flex items-center space-x-2 p-2 overflow-x-auto max-w-xs">
                                {getColorOptions({ darkMode }).map((color) => (
                                    <button
                                        key={color.name}
                                        onClick={() => {
                                            handleColorChange(
                                                tag.id,
                                                color.name,
                                            );
                                            setIsContextMenuOpen(false);
                                        }}
                                        className={`w-6 h-6 rounded-full ${color.bg} ${color.text || 'text-text'} border-2 ${tag.color === color.name ? 'ring-2 ring-primaryColor ring-offset-2' : 'border-transparent'} hover:scale-110 hover:shadow-md transition-all duration-200`}
                                        aria-label={`Select ${color.name} color for ${tag.name}`}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between mt-2">
                                <button
                                    onClick={() => {
                                        startEditing();
                                        setIsContextMenuOpen(false);
                                    }}
                                    className={`p-1 rounded-lg text-primaryColor hover:bg-hoverBg transition-colors duration-200`}
                                    aria-label={`Edit ${tag.name}`}
                                >
                                    <Edit2 size={14} />
                                </button>
                                {isRandomTagsColumn && (
                                    <button
                                        onClick={() => {
                                            startEditingProbability();
                                            setIsContextMenuOpen(false);
                                        }}
                                        className={`p-1 rounded-lg text-blue-500 hover:bg-hoverBg transition-colors duration-200`}
                                        aria-label={`Edit probability for ${tag.name}`}
                                        title="Edit probability"
                                    >
                                        %
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        handleRemoveOption(tag.id);
                                        setIsContextMenuOpen(false);
                                    }}
                                    className={`p-1 rounded-lg text-red-500 hover:bg-hoverBg transition-colors duration-200`}
                                    aria-label={`Remove ${tag.name}`}
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
