import { useSelector } from 'react-redux';


export const BubbleBtn = ({ children, onClick, disablet = false, variant = 'standard' }) => {
  const { theme } = useSelector((state) => state.theme);

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disablet}
      className={`items-center flex px-4 py-2.5 text-sm ${theme.bubbleBtn[variant]} rounded-xl transition-colors`}
    >
      {children}
    </button>
  );
};
