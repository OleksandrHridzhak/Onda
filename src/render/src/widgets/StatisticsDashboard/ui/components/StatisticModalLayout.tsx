import React from 'react';
import type { BaseColumn } from 'entities/Column';
import { getIconComponent } from 'shared/lib/icons';
import { Card } from 'shared/ui/Card';
import { Heading } from 'shared/ui/Heading';
import { ModalShell } from 'shared/ui/ModalShell';
import { Text } from 'shared/ui/Text';

export interface StatisticMetric {
    label: string;
    value: React.ReactNode;
}

interface StatisticModalLayoutProps {
    isOpen: boolean;
    onClose: () => void;
    column: BaseColumn;
    metrics: StatisticMetric[];
    children: React.ReactNode;
}

export const StatisticModalLayout: React.FC<StatisticModalLayoutProps> = ({
    isOpen,
    onClose,
    column,
    metrics,
    children,
}) => (
    <ModalShell isOpen={isOpen} onClose={onClose} title="Statistics" size="fit">
        <div className="mx-auto flex w-max min-w-[56rem] max-w-[calc(100vw-4rem)] flex-col gap-4 p-4">
            <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2">
                <Card className="flex min-h-48 items-center gap-5 p-6">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-border bg-surfaceMuted text-primaryColor">
                        {column.emojiIconName &&
                            getIconComponent(
                                column.emojiIconName,
                                40,
                                'text-primaryColor',
                            )}
                    </div>
                    <Heading as="h2" variant="2xl">
                        {column.name}
                    </Heading>
                </Card>

                <div
                    className="grid min-h-48 gap-4"
                    style={{
                        gridTemplateRows: `repeat(${metrics.length}, minmax(0, 1fr))`,
                    }}
                >
                    {metrics.map((metric) => (
                        <StatisticMetricCard
                            key={metric.label}
                            metric={metric}
                        />
                    ))}
                </div>
            </div>

            {children}
        </div>
    </ModalShell>
);

const StatisticMetricCard: React.FC<{ metric: StatisticMetric }> = ({
    metric,
}) => (
    <Card className="flex items-center justify-between px-5 py-4">
        <Text tone="muted">{metric.label}</Text>
        <p className="text-2xl font-semibold text-text">{metric.value}</p>
    </Card>
);
