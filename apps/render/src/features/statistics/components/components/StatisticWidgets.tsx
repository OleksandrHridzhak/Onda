import React from 'react';
import { Card } from 'shared/ui/Card';
import { Heading } from 'shared/ui/Heading';
import { Text } from 'shared/ui/Text';

export const StatisticWidgetGrid = ({ children }: {
    children: React.ReactNode;
}) => (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3">
        {children}
    </div>
);

export const StatisticValueWidget = ({ label, value, detail }: {
    label: string;
    value: React.ReactNode;
    detail: React.ReactNode;
}) => (
    <Card className="flex flex-col items-center justify-center gap-2 p-5 text-center">
        <p className="text-3xl font-semibold text-primaryColor">{value}</p>
        <Heading as="h3" variant="s">
            {label}
        </Heading>
        <Text variant="caption" tone="muted">
            {detail}
        </Text>
    </Card>
);

export const StatisticProgressWidget = ({ label, percentage, detail }: {
    label: string;
    percentage: number;
    detail: React.ReactNode;
}) => {
    const radius = 34;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference * (1 - percentage / 100);

    return (
        <Card className="flex flex-col items-center gap-3 p-5 text-center">
            <div className="relative h-24 w-24">
                <svg
                    viewBox="0 0 80 80"
                    className="h-full w-full -rotate-90"
                    aria-hidden="true"
                >
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="none"
                        stroke="var(--border)"
                        strokeWidth="7"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="7"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={progress}
                    />
                </svg>
                <span className="absolute inset-0 flex items-center justify-center text-xl font-semibold text-text">
                    {percentage}%
                </span>
            </div>
            <div>
                <Heading as="h3" variant="s">
                    {label}
                </Heading>
                <Text variant="caption" tone="muted" className="mt-1">
                    {detail}
                </Text>
            </div>
        </Card>
    );
};

export const StatisticVisualizationCard = ({ children }: {
    children: React.ReactNode;
}) => <Card className="w-full p-5">{children}</Card>;
