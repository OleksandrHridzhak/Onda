import React, { useEffect, useRef, useState } from 'react';
import type { CheckboxColumn } from 'app/types/newColumn.types';
import type { ColumnEntry } from 'app/types/columnEntries.types';
import { COLOR_STYLES } from 'app/utils/colorOptions';
import { formatDateKey } from 'app/utils/date';
import { Card } from 'shared/ui/Card';
import { Heading } from 'shared/ui/Heading';
import { ModalShell } from 'shared/ui/ModalShell';

interface CheckboxCardProps {
    column: CheckboxColumn;
    entries: ColumnEntry[];
    dates: Date[];
}

const dateLabelFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
});

const isCheckedValue = (value: unknown): boolean =>
    value === true || value === 'true' || value === 1;

export function CheckboxCard({
    column,
    entries,
    dates,
}: CheckboxCardProps): React.ReactElement {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [visibleDaysCount, setVisibleDaysCount] = useState(28);
    const gridRef = useRef<HTMLDivElement>(null);
    const checkedDateKeys = new Set(
        entries
            .filter((entry) => isCheckedValue(entry.value))
            .map((entry) => entry.dateKey),
    );
    const color = COLOR_STYLES[column.uniqueProps.checkboxColor];
    const visibleDates = dates
        .slice(0, visibleDaysCount)
        .reverse()
        .reduce<Date[]>((orderedDates, _, index, sourceDates) => {
            if (index % 4 === 0) {
                orderedDates.push(...sourceDates.slice(index, index + 4));
            }

            return orderedDates;
        }, []);

    useEffect(() => {
        const grid = gridRef.current;
        if (!grid) return;

        const updateVisibleDays = () => {
            const columnWidth = 16;
            const gap = 7;
            const columnCount = Math.max(
                7,
                Math.floor((grid.clientWidth + gap) / (columnWidth + gap)),
            );

            setVisibleDaysCount(Math.min(dates.length, columnCount * 4));
        };

        const observer = new ResizeObserver(updateVisibleDays);
        observer.observe(grid);
        updateVisibleDays();

        return () => observer.disconnect();
    }, [dates.length]);

    return (
        <>
            <Card
                as="button"
                onClick={() => setIsModalOpen(true)}
                ariaLabel={`Open statistics for ${column.name}`}
                className="w-full p-5 text-left transition-all duration-200 hover:border-primaryColor/30 hover:bg-surfaceMuted hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primaryColor"
            >
                <Heading as="h2" variant="base">
                    {column.name}
                </Heading>

                <div
                    ref={gridRef}
                    className="mt-4 grid grid-flow-col grid-rows-4 auto-cols-[1rem] justify-start gap-2 overflow-hidden"
                >
                    {visibleDates.map((date) => {
                        const dateKey = formatDateKey(date);
                        const isChecked = checkedDateKeys.has(dateKey);
                        const stateLabel = isChecked
                            ? 'checked'
                            : 'not checked';

                        return (
                            <span
                                key={dateKey}
                                role="img"
                                aria-label={`${dateLabelFormatter.format(date)}: ${stateLabel}`}
                                className={`h-5 w-5 rounded border transition-colors ${
                                    isChecked
                                        ? `${color.solid} border-transparent`
                                        : 'border-border bg-surfaceMuted'
                                }`}
                            />
                        );
                    })}
                </div>
            </Card>

            <ModalShell
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={column.name}
                size="large"
            >
                <div />
            </ModalShell>
        </>
    );
}
