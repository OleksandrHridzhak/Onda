import React from 'react';
import { Origami } from 'lucide-react';

export const SymbolBlock: React.FC = ({}) => {
    return (
        <div
            className={`
      relative w-12 h-12  flex items-center justify-center
      rounded-lg  z-10
      bg-surface
      text-primaryColor
      border-border
      border-t border-l border-r border-b
    `}
        >
            <Origami className="w-4 h-4" />
        </div>
    );
};
