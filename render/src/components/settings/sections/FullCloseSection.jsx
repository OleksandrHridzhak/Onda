import SettingsTemplate from '../SettingsTemplate';
import { BubbleBtn } from '../../shared/BubbleBtn';

const onFullClose = async () => {
  await window.electronAPI.closeApp();
};

export default function FullCloseSection() {
  return (
    <SettingsTemplate title="Full Close">
      <div className="mt-4">
        <BubbleBtn variant="delete" onClick={onFullClose}>
          FULL CLOSE
        </BubbleBtn>
      </div>
    </SettingsTemplate>
  );
}