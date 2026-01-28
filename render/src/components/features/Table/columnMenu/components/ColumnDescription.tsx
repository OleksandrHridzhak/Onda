import React from 'react';

interface ColumnDescriptionProps {
    description: string;
    setDescription: (value: string) => void;
}

export const ColumnDescription: React.FC<ColumnDescriptionProps> = ({
    description,
    setDescription,
}) => {
    return (
        <textarea
            value={description}
            placeholder="Description"
            onChange={(e) => setDescription(e.target.value)}
            className={`w-full px-4 py-2 border border-border bg-background text-text rounded-xl focus:outline-none focus:ring-2 focus:ring-primaryColor text-sm transition-all duration-200 resize-none`}
            rows={3}
            aria-label="Column description"
        />
    );
};
