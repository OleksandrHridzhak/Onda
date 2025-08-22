import React from 'react';
import { Trash2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { BubbleBtn} from '../shared/BubbleBtn';

const EventModal = ({
  show,
  onClose,
  event,
  setEvent,
  onSave,
  onDelete,
  validateTime,
  colorMap,
  editingId,
  adjustEventTimes
}) => {
   const {theme, mode} = useSelector((state) => state.theme);
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`rounded-2xl p-6 w-full max-w-md shadow-xl border ${theme.background} ${theme.border}`}>
        <h3 className={`text-lg font-medium mb-4 ${theme.text}`}>
          {editingId ? 'Edit Event' : 'New Event'}
        </h3>
        <div className="space-y-4">
          <div>
            <label className={`block text-sm mb-1 ${theme.textTableValues}`}>Title</label>
            <input
              type="text"
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${theme.border} ${theme.background} ${theme.text}`}
              placeholder="Event title"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {['startTime', 'endTime'].map((key, i) => (
              <div key={key}>
                <label className={`block text-sm mb-1 ${theme.textTableValues}`}>{key === 'startTime' ? 'Start' : 'End'}</label>
                <input
                  type="text"
                  value={event[key]}
                  onChange={(e) => setEvent({ ...event, [key]: e.target.value })}
                  placeholder="HH:mm"
                  className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${theme.border} ${theme.background} ${theme.text} ${!validateTime(event[key]) && event[key] ? 'border-red-500' : ''}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mb-4">
            <BubbleBtn onClick={() => adjustEventTimes(-5)} theme={theme}>-5m</BubbleBtn>
            <BubbleBtn onClick={() => adjustEventTimes(5)} theme={theme}>+5m</BubbleBtn>
          </div>

          <div>
            <label className={`block text-sm mb-1 ${theme.textTableValues}`}>Color</label>
            <div className="flex gap-3">
              {Object.entries(colorMap).map(([hex, name]) => (
                <div
                  key={hex}
                  style={{ backgroundColor: hex }}
                  className={`w-6 h-6 rounded-full cursor-pointer ${event.color === hex ? 'ring-2 ring-offset-2 ring-gray-300' : ''}`}
                  onClick={() => setEvent({ ...event, color: hex })}
                  title={name}
                />
              ))}
            </div>
          </div>

          <div>
            <label className={`flex items-center gap-2 text-sm mb-1 ${theme.textTableValues}`}>
              <input
                type="checkbox"
                checked={event.isRepeating}
                onChange={(e) => setEvent({ ...event, isRepeating: e.target.checked, repeatDays: [] })}
                className="custom-checkbox"
              />
              Repeat Event
            </label>

            {event.isRepeating && (
              <div className="mt-2 space-y-2">
                <div>
                  <label className={`block text-sm mb-1 ${theme.textTableValues}`}>Repeat on</label>
                  <div className="flex gap-2 flex-wrap">
                    {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, idx) => (
                      <label key={day} className={`flex items-center gap-1 text-sm ${theme.textTableValues}`}>
                        <input
                          type="checkbox"
                          checked={event.repeatDays.includes((idx+1)%7)}
                          onChange={(e) => {
                            const dayIndex = (idx+1)%7;
                            setEvent({
                              ...event,
                              repeatDays: e.target.checked
                                ? [...event.repeatDays, dayIndex].sort()
                                : event.repeatDays.filter(d => d !== dayIndex),
                            });
                          }}
                          className="custom-checkbox"
                        />
                        {day}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className={`block text-sm mb-1 ${theme.textTableValues}`}>Frequency</label>
                  <select
                    value={event.repeatFrequency}
                    onChange={(e) => setEvent({ ...event, repeatFrequency: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 ${theme.border} ${theme.background} ${theme.text}`}
                  >
                    <option value="weekly">Every Week</option>
                    <option value="biweekly">Every Other Week</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          {editingId && (
            <button
              onClick={() => onDelete(editingId)}
              className={`px-4 py-2 text-sm rounded-xl transition-colors flex items-center gap-1 ${theme.textAccent} ${theme.background} hover:opacity-80`}
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-4 py-2 text-sm rounded-xl transition-colors ${theme.text} ${theme.background} hover:opacity-80`}
          >
            Cancel
          </button>
          <BubbleBtn
            onClick={onSave}
            theme={theme}
            disabled={!validateTime(event.startTime) || !validateTime(event.endTime)}
          >
            {editingId ? 'Update' : 'Create'}
          </BubbleBtn>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
