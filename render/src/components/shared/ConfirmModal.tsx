import React from 'react';
import { X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
}) => {
  if (!isOpen) return null;

  const darkMode =
    document.documentElement.getAttribute('data-theme-mode') === 'dark';

  const handleConfirm = (): void => {
    onConfirm();
    onClose();
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          onClose();
        }
      }}
      aria-label="Close modal"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-md mx-4 rounded-xl shadow-2xl
          ${darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`flex items-center justify-between p-6 border-b
          ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-200'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className={`flex justify-end gap-3 p-6 border-t
          ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              darkMode
                ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              variant === 'danger'
                ? darkMode
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-red-500 text-white hover:bg-red-600'
                : darkMode
                  ? 'bg-yellow-600 text-white hover:bg-yellow-700'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
