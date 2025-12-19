import React from 'react';
import { Trash2 } from 'lucide-react';
import { InputText } from '../shared/InputText';
import { BubbleBtn } from '../shared/BubbleBtn';

interface Event {
  title: string;
  startTime: string;
  endTime: string;
  color: string;
  isRepeating: boolean;
  repeatDays: number[];
  repeatFrequency: string;
}

interface EventModalProps {
  showEventModal: boolean;
  setShowEventModal: (show: boolean) => void;
  newEvent: Event;
  setNewEvent: (event: Event) => void;
  editingEventId: string | null;
  handleSaveEvent: () => void;
  handleDeleteEvent: (id: string) => void;
  validateTime: (time: string) => boolean;
  adjustEventTimes: (minutes: number) => void;
}

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
}: EventModalProps): React.ReactElement {
  const colorMap: Record<string, string> = {
    '#2563eb': 'Blue',
    '#059669': 'Green',
    '#7c3aed': 'Purple',
    '#dc2626': 'Red',
    '#d97706': 'Orange',
  };

  return (
    <>
      {showEventModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`rounded-2xl p-6 w-full max-w-md shadow-xl border bg-background border-border`}
          >
            <h3 className={`text-lg font-medium text-text mb-4`}>
              {editingEventId ? 'Edit Event' : 'New Event'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className={`block text-sm text-textTableValues mb-1`}>
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
                  <label className={`block text-sm text-textTableValues mb-1`}>
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
                  <label className={`block text-sm text-textTableValues mb-1`}>
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
                <BubbleBtn onClick={() => adjustEventTimes(-5)}>-5m</BubbleBtn>
                <BubbleBtn onClick={() => adjustEventTimes(5)}>+5m</BubbleBtn>
              </div>
              <div>
                <label className={`block text-sm text-textTableValues mb-1`}>
                  Color
                </label>
                <div className="flex gap-3">
                  {Object.entries(colorMap).map(([hex, name]) => (
                    <div
                      key={hex}
                      className={`w-6 h-6 rounded-full cursor-pointer ${
                        newEvent.color === hex
                          ? 'ring-2 ring-offset-2 ring-border'
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
                  className={`flex items-center gap-2 text-sm text-textTableValues mb-1`}
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
                        className={`block text-sm text-textTableValues mb-1`}
                      >
                        Repeat on
                      </label>
                      <div className="flex gap-2 flex-wrap">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(
                          (day, index) => (
                            <label
                              key={day}
                              className={`flex items-center gap-1 text-sm text-textTableValues`}
                            >
                              <input
                                type="checkbox"
                                checked={newEvent.repeatDays.includes(
                                  (index + 1) % 7,
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
                                          (d) => d !== dayIndex,
                                        ),
                                  });
                                }}
                                className="custom-checkbox"
                              />
                              {day}
                            </label>
                          ),
                        )}
                      </div>
                    </div>
                    <div>
                      <label
                        className={`block text-sm text-textTableValues mb-1`}
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
                        className={`w-full border border-border bg-background text-textTableValues rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primaryColor`}
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
                  variant="delete"
                >
                  <Trash2 size={16} />
                  Delete
                </BubbleBtn>
              )}
              <BubbleBtn
                variant="clear"
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
