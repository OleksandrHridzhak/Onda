import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import SettingsTemplate from 'features/Settings/SettingsTemplate';
import { Button } from 'shared/ui/Button';
import { clearAllData } from 'db/helpers/settings';
import { ConfirmModal } from 'shared/ui/ConfirmModal';

export default function DataSection(): React.ReactElement {
    const [status, setStatus] = useState('');
    const [showClearModal, setShowClearModal] = useState(false);

    const handleClearAllData = async (): Promise<void> => {
        try {
            setShowClearModal(false);

            const result = await clearAllData();

            if (result.success) {
                setTimeout(() => {
                    globalThis.location.reload();
                }, 1000);
            } else {
                setStatus(`Clear failed: ${result.error}`);
                setTimeout(() => setStatus(''), 3000);
            }
        } catch (error) {
            console.error('Error clearing data:', error);
            setStatus('Clear failed!');
            setTimeout(() => setStatus(''), 3000);
        }
    };

    return (
        <SettingsTemplate title="Data Management">
            <div className="flex flex-col gap-2">
                <span className="text-sm text-textMuted">Danger Zone</span>
                <div className="flex flex-row gap-2">
                    <Button
                        onClick={() => setShowClearModal(true)}
                        variant="danger"
                    >
                        <Trash2 className="w-4 h-4 mr-3" />
                        Clear All Data
                    </Button>
                </div>
                {status && (
                    <span className="text-sm text-red-500">{status}</span>
                )}
            </div>

            {showClearModal && (
                <ConfirmModal
                    isOpen={showClearModal}
                    onClose={() => setShowClearModal(false)}
                    onConfirm={handleClearAllData}
                    title="Clear All Data?"
                    message="This will permanently delete all your columns, tasks, calendar events, and settings. This action cannot be undone. Are you sure?"
                    confirmText="Yes, Clear Everything"
                    cancelText="Cancel"
                />
            )}
        </SettingsTemplate>
    );
}
