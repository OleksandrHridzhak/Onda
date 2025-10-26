import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCustomPageUrl } from '../../../store/slices/settingsSlice';

const CustomPageSettings = () => {
  const dispatch = useDispatch();
  const { url } = useSelector((state) => state.settings);
  const [newUrl, setNewUrl] = useState(url);

  const handleSave = () => {
    dispatch(setCustomPageUrl(newUrl));
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
    </div>
  );
};

export default CustomPageSettings;
