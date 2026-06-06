import React from 'react';
import { Trash2 } from 'lucide-react';
import { Button } from 'shared/ui/Button';
import { ColorPicker } from 'shared/ui/ColorPicker';
import { Field } from 'shared/ui/Field';
import { Input } from 'shared/ui/Input';
import { ModalShell } from 'shared/ui/ModalShell';
import { Select } from 'shared/ui/Select';
import type { NewEvent } from 'features/Calendar/hooks/useCalendar';

interface EventModalProps {
    showEventModal: boolean;
    setShowEventModal: (show: boolean) => void;
    newEvent: NewEvent;
    setNewEvent: (event: NewEvent) => void;
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
    return (
        <ModalShell
            isOpen={showEventModal}
            onClose={() => setShowEventModal(false)}
            title={editingEventId ? 'Edit Event' : 'New Event'}
        >
            <div className="space-y-4">
                <Field label="Title" htmlFor="event-title">
                    <Input
                        id="event-title"
                        value={newEvent.title}
                        onChange={(e) =>
                            setNewEvent({
                                ...newEvent,
                                title: e.target.value,
                            })
                        }
                        placeholder="Event title"
                    />
                </Field>

                <div className="grid grid-cols-2 gap-4">
                    <Field label="Start" htmlFor="event-start">
                        <Input
                            id="event-start"
                            value={newEvent.startTime}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    startTime: e.target.value,
                                })
                            }
                            placeholder="HH:mm"
                        />
                    </Field>

                    <Field label="End" htmlFor="event-end">
                        <Input
                            id="event-end"
                            value={newEvent.endTime}
                            onChange={(e) =>
                                setNewEvent({
                                    ...newEvent,
                                    endTime: e.target.value,
                                })
                            }
                            placeholder="HH:mm"
                        />
                    </Field>
                </div>

                <div className="mb-4 flex justify-center gap-2">
                    <Button onClick={() => adjustEventTimes(-5)}>-5m</Button>
                    <Button onClick={() => adjustEventTimes(5)}>+5m</Button>
                </div>

                <ColorPicker
                    label="Color"
                    value={newEvent.color}
                    onChange={(color) =>
                        setNewEvent({
                            ...newEvent,
                            color,
                        })
                    }
                />

                <div>
                    <label className="mb-1 flex items-center gap-2 text-sm text-textMuted">
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
                            <Field label="Repeat on">
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        'Mon',
                                        'Tue',
                                        'Wed',
                                        'Thu',
                                        'Fri',
                                        'Sat',
                                        'Sun',
                                    ].map((day, index) => (
                                        <label
                                            key={day}
                                            className="flex items-center gap-1 text-sm text-textMuted"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={newEvent.repeatDays.includes(
                                                    (index + 1) % 7,
                                                )}
                                                onChange={(e) => {
                                                    const dayIndex =
                                                        (index + 1) % 7;
                                                    setNewEvent({
                                                        ...newEvent,
                                                        repeatDays: e.target
                                                            .checked
                                                            ? [
                                                                  ...newEvent.repeatDays,
                                                                  dayIndex,
                                                              ].sort()
                                                            : newEvent.repeatDays.filter(
                                                                  (d) =>
                                                                      d !==
                                                                      dayIndex,
                                                              ),
                                                    });
                                                }}
                                                className="custom-checkbox"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>
                            </Field>

                            <Field
                                label="Frequency"
                                htmlFor="event-repeat-frequency"
                            >
                                <Select
                                    id="event-repeat-frequency"
                                    value={newEvent.repeatFrequency}
                                    onChange={(e) =>
                                        setNewEvent({
                                            ...newEvent,
                                            repeatFrequency: e.target.value,
                                        })
                                    }
                                    inputSize="sm"
                                >
                                    <option value="weekly">Every Week</option>
                                    <option value="biweekly">
                                        Every Other Week
                                    </option>
                                </Select>
                            </Field>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
                {editingEventId && (
                    <Button
                        onClick={() => handleDeleteEvent(editingEventId)}
                        variant="danger"
                    >
                        <Trash2 size={16} />
                        Delete
                    </Button>
                )}

                <Button
                    variant="secondary"
                    onClick={() => setShowEventModal(false)}
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleSaveEvent}
                    disabled={
                        !validateTime(newEvent.startTime) ||
                        !validateTime(newEvent.endTime)
                    }
                >
                    {editingEventId ? 'Update' : 'Create'}
                </Button>
            </div>
        </ModalShell>
    );
}
