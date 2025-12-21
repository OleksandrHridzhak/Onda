import React from 'react';
import { getWidthStyle } from '../TableLogic';

type Props = {
  column: any;
  className?: string;
  children?: React.ReactNode;
};

const TableItemWrapper: React.FC<Props> = ({ column, className, children }) => {
  return (
    <th
      key={column.id}
      style={{
        ...getWidthStyle(column),
        padding: 0,
        verticalAlign: 'top',
      }}
      className={className}
    >
      {children}
    </th>
  );
};

export default TableItemWrapper;
