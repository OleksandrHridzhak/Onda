import React from 'react';
import { Origami } from 'lucide-react';

export const SymbolBlock: React.FC = ({}) => {
    return (
        <div
            className={`
      relative w-12 h-12 ml-2 flex items-center justify-center
      rounded-lg  z-10
      bg-tableBodyBg
      text-toggleIcon
      border-border
      border-t border-l border-r border-b
    `}
        >
            <Origami className="w-4 h-4" />
        </div>
    );
};
