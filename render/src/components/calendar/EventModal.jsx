import { Trash2 } from 'lucide-react';
import { InputText } from '../shared/InputText';
import { BubbleBtn } from '../shared/BubbleBtn';
import { useSelector } from 'react-redux';
export default function EventModal({
  showEventModal,
  setShowEventModal,
  newEvent,
  setNewEvent,
  editingEventId,
  handleSaveEvent,
  handleDeleteEvent,
  validateTime,
  adjustEventTimes,
}) {
  const colorMap = {
    '#2563eb': 'Blue',
    '#059669': 'Green',
    '#7c3aed': 'Purple',
    '#dc2626': 'Red',
    '#d97706': 'Orange',
  };
  const { mode } = useSelector((state) => state.theme);
  const darkTheme = mode === 'dark' ? true : false;
  return (
    <>
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-2xl p-6 w-full max-w-md shadow-xl border ${darkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
          >
            <h3
              className={`text-lg font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-800'} mb-4`}
            >
              {editingEventId ? 'Edit Event' : 'New Event'}
            </h3>
            <div className="space-y-4">
              <div>
                <label
                  className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                >
                  Title
                </label>
                <InputText
                  value={newEvent.title}
                  onChange={(e) =>
                    setNewEvent({ ...newEvent, title: e.target.value })
                  }
                  placeholder="Event title"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                  >
                    Start
                  </label>
                  <div className="flex items-center gap-2">
                    <InputText
                      value={newEvent.startTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, startTime: e.target.value })
                      }
                      placeholder="HH:mm"
                    />
                  </div>
                </div>
                <div>
                  <label
                    className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                  >
                    End
                  </label>
                  <div className="flex items-center gap-2">
                    <InputText
                      value={newEvent.endTime}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, endTime: e.target.value })
                      }
                      placeholder="HH:mm"
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-2 mb-4">
                <BubbleBtn
                  onClick={() => adjustEventTimes(-5)}
                >
                  -5m
                </BubbleBtn>
                <BubbleBtn
                  onClick={() => adjustEventTimes(5)}
                >
                  +5m
                </BubbleBtn>
              </div>
              <div>
                <label
                  className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                >
                  Color
                </label>
                <div className="flex gap-3">
                  {Object.entries(colorMap).map(([hex, name]) => (
                    <div
                      key={hex}
                      className={`w-6 h-6 rounded-full cursor-pointer ${
                        newEvent.color === hex
                          ? 'ring-2 ring-offset-2 ring-gray-300'
                          : ''
                      }`}
                      style={{ backgroundColor: hex }}
                      onClick={() => setNewEvent({ ...newEvent, color: hex })}
                      title={name}
                    />
                  ))}
                </div>
              </div>
              <div>
                <label
                  className={`flex items-center gap-2 text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                >
                  <input
                    type="checkbox"
                    checked={newEvent.isRepeating}
                    onChange={(e) =>
                      setNewEvent({
                        ...newEvent,
                        isRepeating: e.target.checked,
                        repeatDays: [],
                      })
                    }
                    className="custom-checkbox"
                  />
                  Repeat Event
                </label>
                {newEvent.isRepeating && (
                  <div className="mt-2 space-y-2">
                    <div>
                      <label
                        className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                      >
                        Repeat on
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                          (day, index) => (
                            <label
                              key={day}
                              className={`flex items-center gap-1 text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'}`}
                            >
                              <input
                                type="checkbox"
                                checked={newEvent.repeatDays.includes(
                                  (index + 1) % 7
                                )}
                                onChange={(e) => {
                                  const dayIndex = (index + 1) % 7;
                                  setNewEvent({
                                    ...newEvent,
                                    repeatDays: e.target.checked
                                      ? [
                                          ...newEvent.repeatDays,
                                          dayIndex,
                                        ].sort()
                                      : newEvent.repeatDays.filter(
                                          (d) => d !== dayIndex
                                        ),
                                  });
                                }}
                                className="custom-checkbox"
                              />
                              {day}
                            </label>
                          )
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                      >
                        Frequency
                      </label>
                      <select
                        value={newEvent.repeatFrequency}
                        onChange={(e) =>
                          setNewEvent({
                            ...newEvent,
                            repeatFrequency: e.target.value,
                          })
                        }
                        className={`w-full border ${darkTheme ? 'border-gray-700 bg-gray-900 text-gray-200' : 'border-gray-200 bg-white text-gray-600'} rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300`}
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
              {editingEventId && (
                <BubbleBtn
                  onClick={() => handleDeleteEvent(editingEventId)}
                  variant='delete'
                >
                  <Trash2 size={16} />
                  Delete
                </BubbleBtn>
              )}
              <BubbleBtn
                variant='clear'
                onClick={() => setShowEventModal(false)}
              >
                Cancel
              </BubbleBtn>
              <BubbleBtn
                onClick={handleSaveEvent}
                disabled={
                  !validateTime(newEvent.startTime) ||
                  !validateTime(newEvent.endTime)
                }
              >
                {editingEventId ? 'Update' : 'Create'}
              </BubbleBtn>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
