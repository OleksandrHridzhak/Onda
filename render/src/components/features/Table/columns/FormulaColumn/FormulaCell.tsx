import React, { useState, useRef, useEffect } from 'react';

interface FormulaCellProps {
    formula: string;
    result: string | number | null;
    onChange: (formula: string) => void;
}

export const FormulaCell: React.FC<FormulaCellProps> = ({
    formula,
    result,
    onChange,
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [tempFormula, setTempFormula] = useState(formula);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = () => {
        setIsEditing(false);
        if (tempFormula !== formula) {
            onChange(tempFormula);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            e.preventDefault();
            setTempFormula(formula);
            setIsEditing(false);
        }
    };

    const handleStartEditing = () => {
        setIsEditing(true);
        setTempFormula(formula);
    };

    const handleKeyDownDiv = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleStartEditing();
        }
    };

    // Format the result for display
    const displayValue = (() => {
        if (isEditing) return null;
        
        if (formula && !formula.trim()) {
            return '';
        }

        if (result === null || result === undefined) {
            return formula ? '—' : '';
        }

        if (typeof result === 'string' && result.startsWith('Error:')) {
            return <span className="text-red-500 text-xs">{result}</span>;
        }

        if (typeof result === 'number') {
            // Format numbers nicely
            if (Number.isInteger(result)) {
                return result;
            }
            return result.toFixed(2);
        }

        return String(result);
    })();

    return isEditing ? (
        <div className="w-full relative font-poppins">
            <input
                ref={inputRef}
                type="text"
                value={tempFormula}
                onChange={(e) => setTempFormula(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                placeholder="Enter formula..."
                className="w-full px-2 py-1 text-sm bg-transparent font-poppins rounded-md focus:outline-none text-textTableValues border border-blue-400"
            />
        </div>
    ) : (
        <div
            role="button"
            tabIndex={0}
            onClick={handleStartEditing}
            onKeyDown={handleKeyDownDiv}
            className="w-full min-h-8 px-2 py-1 rounded-md cursor-text text-sm flex items-center group transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            aria-label="Edit formula"
        >
            <div className="flex-1 min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap text-textTableValues">
                {displayValue}
            </div>
            {formula && !isEditing && (
                <div className="opacity-0 group-hover:opacity-100 ml-2 text-xs text-gray-400 transition-opacity">
                    fx
                </div>
            )}
        </div>
    );
};
