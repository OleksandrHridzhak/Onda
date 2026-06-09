import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export interface ChartPoint {
    dateKey: string;
    value: number | null;
}

interface NumberLineChartProps {
    points: ChartPoint[];
    height: number;
    compact?: boolean;
}

const formatChartDate = (dateKey: unknown): string => {
    if (typeof dateKey !== 'string') return '';

    const date = new Date(`${dateKey}T00:00:00`);
    if (Number.isNaN(date.getTime())) return '';

    return date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
};

export const NumberLineChart: React.FC<NumberLineChartProps> = ({
    points,
    height,
    compact = false,
}) => {
    if (points.length === 0) {
        return (
            <div
                className="flex items-center justify-center text-sm text-textMuted"
                style={{ height }}
            >
                No numeric data yet
            </div>
        );
    }

    const gradientId = compact
        ? 'number-chart-gradient-compact'
        : 'number-chart-gradient-large';

    return (
        <div style={{ height }} className="w-full">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                    data={points}
                    margin={
                        compact
                            ? { top: 6, right: 4, bottom: 0, left: 4 }
                            : { top: 12, right: 12, bottom: 8, left: 0 }
                    }
                >
                    <defs>
                        <linearGradient
                            id={gradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                        >
                            <stop
                                offset="5%"
                                stopColor="var(--primary)"
                                stopOpacity={0.3}
                            />
                            <stop
                                offset="95%"
                                stopColor="var(--primary)"
                                stopOpacity={0}
                            />
                        </linearGradient>
                    </defs>
                    {!compact && (
                        <CartesianGrid
                            stroke="var(--border)"
                            strokeDasharray="3 3"
                            vertical={false}
                        />
                    )}
                    {!compact && (
                        <XAxis
                            dataKey="dateKey"
                            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            interval={0}
                            angle={-45}
                            textAnchor="end"
                            height={56}
                            tickFormatter={(dateKey: string) =>
                                new Date(
                                    `${dateKey}T00:00:00`,
                                ).toLocaleDateString('en-US', {
                                    month: 'numeric',
                                    day: 'numeric',
                                })
                            }
                        />
                    )}
                    {!compact && (
                        <YAxis
                            tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            width={44}
                        />
                    )}
                    {!compact && (
                        <Tooltip
                            cursor={{ stroke: 'var(--border)' }}
                            contentStyle={{
                                background: 'var(--surface)',
                                border: '1px solid var(--border)',
                                borderRadius: '0.75rem',
                                color: 'var(--text)',
                                fontSize: '0.75rem',
                            }}
                            labelFormatter={formatChartDate}
                        />
                    )}
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="var(--primary)"
                        strokeWidth={compact ? 2 : 3}
                        fill={`url(#${gradientId})`}
                        activeDot={{
                            r: 5,
                            fill: 'var(--surface)',
                            stroke: 'var(--primary)',
                            strokeWidth: 2,
                        }}
                        dot={false}
                        animationDuration={500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};
