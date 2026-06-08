import { useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { COLOR_STYLES, ColorName } from 'shared/utils/colorOptions';
import { Tag } from 'shared/types/newColumn.types';
import { getColorForTag } from 'features/Table/columns/MultiCheckboxColumn/logic';

interface RootState {
    newTheme: {
        themeMode: string;
    };
}

const getCssColorValue = (cssVar: string): string => {
    return getComputedStyle(document.documentElement)
        .getPropertyValue(cssVar)
        .trim();
};

interface CircleCanvasResult {
    canvasRef: React.RefObject<HTMLCanvasElement>;
    colorOptions: Record<ColorName, (typeof COLOR_STYLES)[ColorName]>;
    colorOrder: string[];
}

/**
 * Hook to render a circular progress indicator with color segments
 * Works directly with Tag IDs and objects
 */
export const useCircleCanvas = (
    selectedOptionIds: string[],
    availableOptions: Tag[],
): CircleCanvasResult => {
    const { themeMode } = useSelector((state: RootState) => state.newTheme);
    const darkMode = themeMode === 'dark' ? true : false;
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const colorOptions = COLOR_STYLES;
    const colorOrder = useMemo(
        () => ['accent1', 'accent2', 'accent3', 'accent4'],
        [],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scale = globalThis.devicePixelRatio || 1;
        const size = 32;
        canvas.width = size * scale;
        canvas.height = size * scale;
        ctx.scale(scale, scale);

        const centerX = size / 2;
        const centerY = size / 2;
        const radius = size / 2 - 4;
        const lineWidth = 4.5;
        const totalOptions = availableOptions.length || 1;
        const progress = selectedOptionIds.length / totalOptions;
        const gapDegrees = 0;
        const gapRadians = (gapDegrees * Math.PI) / 180;

        // Clear canvas
        ctx.clearRect(0, 0, size, size);

        // Draw subtle background circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        ctx.lineWidth = lineWidth;
        ctx.strokeStyle = darkMode ? '#374151' : '#e5e7eb';
        ctx.stroke();

        // Draw selected segments
        const totalAngle = 2 * Math.PI * progress;
        const segmentCount = selectedOptionIds.length;
        const anglePerSegment =
            segmentCount > 1
                ? (totalAngle - gapRadians * (segmentCount - 1)) / segmentCount
                : totalAngle;

        selectedOptionIds.forEach((optionId, index) => {
            const tag = availableOptions.find((opt) => opt.id === optionId);
            if (!tag) return;

            const startAngle =
                index * (anglePerSegment + gapRadians) - Math.PI / 2;
            const endAngle = startAngle + anglePerSegment;
            const color = getColorForTag(tag, index, colorOrder);
            const arcColor =
                getCssColorValue(colorOptions[color]?.cssVar) ||
                getCssColorValue(colorOptions.accent1.cssVar);

            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = arcColor;
            ctx.lineCap = 'round';
            ctx.stroke();
        });
    }, [
        selectedOptionIds,
        darkMode,
        availableOptions,
        colorOptions,
        colorOrder,
    ]);

    return { canvasRef, colorOptions, colorOrder };
};
