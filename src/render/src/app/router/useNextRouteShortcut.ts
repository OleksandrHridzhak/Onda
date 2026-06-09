import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const routes = ['/', '/calendar', '/statistics', '/settings'];

function getRouteKey(pathname: string): string {
    return (
        routes.find((route) => route !== '/' && pathname.startsWith(route)) ??
        '/'
    );
}

export function useNextRouteShortcut(): void {
    const navigate = useNavigate();
    const location = useLocation();
    const isProcessing = useRef(false);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent): void => {
            if (!event.ctrlKey || event.key !== 'Tab') return;

            event.preventDefault();

            if (isProcessing.current) return;
            isProcessing.current = true;

            const currentIndex = routes.indexOf(getRouteKey(location.pathname));
            navigate(routes[(currentIndex + 1) % routes.length]);

            window.setTimeout(() => {
                isProcessing.current = false;
            }, 300);
        };

        globalThis.addEventListener('keydown', handleKeyDown);
        return () => globalThis.removeEventListener('keydown', handleKeyDown);
    }, [location.pathname, navigate]);
}
