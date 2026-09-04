import React, { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "shared/ui/Button";
import { ColorPicker } from "shared/ui/ColorPicker";
import { Field } from "shared/ui/Field";
import { Input } from "shared/ui/Input";
import { ModalShell } from "shared/ui/ModalShell";
import { Select } from "shared/ui/Select";
import { DEFAULT_COLOR_NAME, type ColorName } from "shared/lib/color";
import { formatDateKey } from "shared/lib/date";
import { useCalendarContext } from "../context/CalendarContext";
import { validateTime, shiftTime } from "../utils/time";

const REPEAT_DAYS = [
  { label: "Mon", dayIndex: 1 },
  { label: "Tue", dayIndex: 2 },
  { label: "Wed", dayIndex: 3 },
  { label: "Thu", dayIndex: 4 },
  { label: "Fri", dayIndex: 5 },
  { label: "Sat", dayIndex: 6 },
  { label: "Sun", dayIndex: 0 },
];

export function EventModal(): React.ReactElement | null {
  const {
    isModalOpen,
    closeModal,
    modalEvent,
    initialSlot,
    saveEvent,
    deleteEvent,
  } = useCalendarContext();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [color, setColor] = useState<ColorName>(DEFAULT_COLOR_NAME);
  const [isRepeating, setIsRepeating] = useState(false);
  const [repeatDays, setRepeatDays] = useState<number[]>([]);
  const [repeatFrequency, setRepeatFrequency] = useState<"weekly" | "biweekly">(
    "weekly",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isModalOpen) return;

    if (modalEvent) {
      setTitle(modalEvent.title);
      setDate(modalEvent.date);
      setStartTime(modalEvent.startTime);
      setEndTime(modalEvent.endTime);
      setColor((modalEvent.color as ColorName) || DEFAULT_COLOR_NAME);
      setIsRepeating(Boolean(modalEvent.isRepeating));
      setRepeatDays(modalEvent.repeatDays ?? []);
      setRepeatFrequency(
        (modalEvent.repeatFrequency as "weekly" | "biweekly") || "weekly",
      );
    } else if (initialSlot) {
      setTitle("");
      setDate(initialSlot.date);
      setStartTime(initialSlot.startTime);
      setEndTime(initialSlot.endTime);
      setColor(DEFAULT_COLOR_NAME);
      setIsRepeating(false);
      setRepeatDays([]);
      setRepeatFrequency("weekly");
    } else {
      setTitle("");
      setDate(formatDateKey(new Date()));
      setStartTime("09:00");
      setEndTime("10:00");
      setColor(DEFAULT_COLOR_NAME);
      setIsRepeating(false);
      setRepeatDays([]);
      setRepeatFrequency("weekly");
    }
  }, [isModalOpen, modalEvent, initialSlot]);

  if (!isModalOpen) {
    return null;
  }

  const isTimeValid = validateTime(startTime) && validateTime(endTime);
  const isFormValid = title.trim().length > 0 && isTimeValid;

  const handleAdjustTimes = (minutes: number) => {
    setStartTime((prev) => shiftTime(prev, minutes));
    setEndTime((prev) => shiftTime(prev, minutes));
  };

  const handleToggleDay = (dayIndex: number) => {
    setRepeatDays((prev) =>
      prev.includes(dayIndex)
        ? prev.filter((d) => d !== dayIndex)
        : [...prev, dayIndex].sort(),
    );
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!isFormValid || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await saveEvent({
        id: modalEvent?.id,
        title: title.trim(),
        date,
        startTime,
        endTime,
        color,
        isRepeating,
        repeatDays,
        repeatFrequency,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!modalEvent?.id || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await deleteEvent(modalEvent.id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ModalShell
      isOpen={isModalOpen}
      onClose={closeModal}
      title={modalEvent ? "Edit Event" : "New Event"}
    >
      <div className="space-y-4">
        <Field label="Title" htmlFor="event-title">
          <Input
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Event title"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Start" htmlFor="event-start">
            <Input
              id="event-start"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              placeholder="HH:mm"
            />
          </Field>

          <Field label="End" htmlFor="event-end">
            <Input
              id="event-end"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              placeholder="HH:mm"
            />
          </Field>
        </div>

        <div className="mb-4 flex justify-center gap-2">
          <Button onClick={() => handleAdjustTimes(-5)}>-5m</Button>
          <Button onClick={() => handleAdjustTimes(5)}>+5m</Button>
        </div>

        <ColorPicker
          label="Color"
          value={color}
          onChange={(newColor) => setColor(newColor as ColorName)}
        />

        <div>
          <label className="mb-1 flex items-center gap-2 text-sm text-textMuted">
            <input
              type="checkbox"
              checked={isRepeating}
              onChange={(e) => {
                setIsRepeating(e.target.checked);
                if (!e.target.checked) {
                  setRepeatDays([]);
                }
              }}
              className="custom-checkbox"
            />
            Repeat Event
          </label>

          {isRepeating && (
            <div className="mt-2 space-y-2">
              <Field label="Repeat on">
                <div className="flex flex-wrap gap-2">
                  {REPEAT_DAYS.map(({ label, dayIndex }) => (
                    <label
                      key={label}
                      className="flex items-center gap-1 text-sm text-textMuted"
                    >
                      <input
                        type="checkbox"
                        checked={repeatDays.includes(dayIndex)}
                        onChange={() => handleToggleDay(dayIndex)}
                        className="custom-checkbox"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              </Field>

              <Field label="Frequency" htmlFor="event-repeat-frequency">
                <Select
                  id="event-repeat-frequency"
                  value={repeatFrequency}
                  onChange={(e) =>
                    setRepeatFrequency(e.target.value as "weekly" | "biweekly")
                  }
                  inputSize="sm"
                >
                  <option value="weekly">Every Week</option>
                  <option value="biweekly">Every Other Week</option>
                </Select>
              </Field>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        {modalEvent && (
          <Button
            type="button"
            onClick={handleDelete}
            variant="danger"
            disabled={isSubmitting}
          >
            <Trash2 size={16} />
            Delete
          </Button>
        )}

        <Button
          type="button"
          variant="secondary"
          onClick={closeModal}
          disabled={isSubmitting}
        >
          Cancel
        </Button>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!isFormValid || isSubmitting}
        >
          {modalEvent ? "Update" : "Create"}
        </Button>
      </div>
    </ModalShell>
  );
}

export default EventModal;
