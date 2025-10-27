import React from 'react';

export const TransparentBtn = ({
  children,
  onClick,
  disabled = false,
  light = false,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`px-3 py-2.5 alight-center justify-center text-sm w-full flex border bg-transparent hover:bg-ui-primary hover:text-text-on-primary border-ui-border rounded-xl transition-colors`}
    >
      {children}
    </button>
  );
};
