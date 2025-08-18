


export const DescriptionHoverBox = ({darkMode, column}) => {

    return (
        <div
        className={`absolute z-10 opacity-0 group-hover:opacity-100 ${darkMode ? 'bg-gray-800 text-gray-200 border-gray-700' : 'bg-gray-800 text-white'} text-xs rounded py-1 px-2 mb-20 min-w-48 max-w-72 whitespace-normal`}
        style={{ transition: 'opacity 0.2s', transitionDelay: '0.3s' }}
        >
            {column.NameVisible === false ? `${column.Name}: ` : ''}{column.Description}
            <div className={`absolute left-2 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 ${darkMode ? 'border-t-gray-800' : 'border-t-gray-800'}`}></div>
        </div>

    );
    
};