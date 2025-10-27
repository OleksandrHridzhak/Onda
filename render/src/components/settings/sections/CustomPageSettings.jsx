import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setCustomPageUrl,
  setCustomPageEnabled,
} from '../../../store/slices/settingsSlice';

const CustomPageSettings = () => {
  const dispatch = useDispatch();
  const { url, customPageEnabled } = useSelector((state) => state.settings);
  const [newUrl, setNewUrl] = useState(url);
  const [enabled, setEnabled] = useState(customPageEnabled);

  useEffect(() => {
    setNewUrl(url);
  }, [url]);

  useEffect(() => {
    setEnabled(customPageEnabled);
  }, [customPageEnabled]);

  const handleSave = () => {
    dispatch(setCustomPageUrl(newUrl));
  };

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    dispatch(setCustomPageEnabled(next));
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold">Custom Page Settings</h2>
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Enter a URL"
        />
        <button onClick={handleSave} className="px-4 py-2 bg-blue-500 text-white rounded">
          Save
        </button>
      </div>

      <div className="flex items-center gap-2 mt-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={enabled} onChange={handleToggle} />
          <span>Enable Custom Page</span>
        </label>
      </div>
    </div>
  );
};

export default CustomPageSettings;
