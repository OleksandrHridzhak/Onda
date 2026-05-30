interface ButtonProps {
    children: React.ReactNode;
    onClick: (e?: React.MouseEvent) => void;
    disabled?: boolean;
    variant: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    className?: string;
}

export function Button({
    children,
    onClick,
    disabled = false,
    variant,
    className = '',
}: ButtonProps) {
    const variantClass: Record<string, string> = {
        primary: 'bg-primaryColor text-white',
        danger: 'bg-danger text-white',
        secondary: 'bg-secondary text-secondaryText',
        //transparent: `alight-center justify-center w-full flex border ${darkTheme ? 'bg-transparent hover:bg-blue-600 border-gray-700' : 'bg-transparent hover:bg-blue-600 hover:text-white border-gray-300'} rounded-xl transition-colors`
    };

    const baseClass = `flex alight-center justify-center w-full items-center flex gap-3 px-4 py-2.5 text-sm rounded-xl transition ${variantClass[variant]}`;
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            className={`${baseClass} ${className}`.trim()}
        >
            {children}
        </button>
    );
}
