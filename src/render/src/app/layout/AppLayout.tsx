import { useLocation } from 'react-router-dom';
import { Sidebar } from 'widgets/Sidebar';
import { WindowTitleBar } from 'widgets/WindowTitleBar';
import { AppRouter } from 'app/router/AppRouter';
import { useNextRouteShortcut } from 'app/router/useNextRouteShortcut';

export function AppLayout(): React.ReactElement {
    const location = useLocation();
    const isElectron = Boolean(globalThis.electronAPI);

    useNextRouteShortcut();

    return (
        <div className="flex h-screen flex-col">
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />
                <main className="flex flex-1 flex-col overflow-x-auto overflow-y-hidden bg-background">
                    {isElectron && (
                        <WindowTitleBar currentPage={location.pathname} />
                    )}
                    <AppRouter />
                </main>
            </div>
        </div>
    );
}
