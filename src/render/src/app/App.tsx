import { useEffect } from 'react';
import { AppLayout } from 'app/layout/AppLayout';
import { initializeApp } from 'app/lib/initializeApp';
import { AppProviders } from 'app/providers/AppProviders';
import 'app/styles/App.css';

export default function App(): React.ReactElement {
    useEffect(() => {
        void initializeApp();
    }, []);

    return (
        <AppProviders>
            <AppLayout />
        </AppProviders>
    );
}
