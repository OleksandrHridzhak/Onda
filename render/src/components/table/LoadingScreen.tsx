import React from 'react';

interface LoadingScreenProps {
  darkMode: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ darkMode }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-20">
      <div className="flex space-x-1 text-5xl font-bold text-blue-600 font-poppins">
        {['O', 'N', 'D', 'A'].map((ch, idx) => (
          <span
            key={idx}
            className="inline-block animate-bounce"
            style={{ animationDelay: `${idx * 0.2}s` }}
          >
            {ch}
          </span>
        ))}
      </div>
      <p
        className={`mt-4 text-lg ${darkMode ? 'text-gray-200' : 'text-gray-600'}`}
      >
        Loading data...
      </p>
    </div>
  );
};
