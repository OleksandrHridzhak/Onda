import React from 'react';
import SettingsTemplate from 'features/Settings/SettingsTemplate';
import { Button } from 'shared/Button';

const onFullClose = async (): Promise<void> => {
    await globalThis.electronAPI?.closeApp();
};
export default function FullCloseSection(): React.ReactElement {
    return (
        <SettingsTemplate title="System settings">
            <div className="mt-4">
                <Button variant="danger" onClick={onFullClose}>
                    Close Application
                </Button>
            </div>
        </SettingsTemplate>
    );
}
