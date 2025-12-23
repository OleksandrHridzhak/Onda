import React from 'react';
import SettingsTemplate from '../SettingsTemplate';
import { BubbleBtn } from '../../../shared/BubbleBtn';

const onFullClose = async (): Promise<void> => {
  await globalThis.electronAPI?.closeApp();
};
export default function FullCloseSection(): React.ReactElement {
  return (
    <SettingsTemplate title="System settings">
      <div className="mt-4">
        <BubbleBtn variant="delete" onClick={onFullClose}>
          Close Application
        </BubbleBtn>
      </div>
    </SettingsTemplate>
  );
}
