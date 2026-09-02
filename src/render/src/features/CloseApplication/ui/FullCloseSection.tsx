import React from 'react';
import SettingsSection from 'shared/ui/SettingsSection';
import { Button } from 'shared/ui/Button';

const onFullClose = async (): Promise<void> => {
    await globalThis.electronAPI?.closeApp();
};
export default function FullCloseSection(): React.ReactElement {
    return (
        <SettingsSection title="System settings">
            <div className="mt-4">
                <Button variant="danger" onClick={onFullClose}>
                    Close Application
                </Button>
            </div>
        </SettingsSection>
    );
}
