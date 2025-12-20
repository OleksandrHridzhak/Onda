import { useEffect, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  getCheckBoxColorOptions,
  CheckBoxColorOptions,
} from '../../../../../utils/colorOptions';

interface RootState {
  newTheme: {
    themeMode: string;
  };
}

interface CircleCanvasResult {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  colorOptions: CheckBoxColorOptions;
  colorOrder: string[];
}

export const useCircleCanvas = (
  selectedOptions: string[],
  options: string[],
  tagColors: Record<string, string>,
): CircleCanvasResult => {
  const { themeMode } = useSelector((state: RootState) => state.newTheme);
  const darkMode = themeMode === 'dark' ? true : false;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const colorOptions = getCheckBoxColorOptions({ darkMode });
  const colorOrder = useMemo(() => ['green', 'blue', 'purple', 'orange'], []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scale = window.devicePixelRatio || 1;
    const size = 32;
    canvas.width = size * scale;
    canvas.height = size * scale;
    ctx.scale(scale, scale);

    const centerX = size / 2;
    const centerY = size / 2;
    const radius = size / 2 - 4;
    const lineWidth = 4.5;
    const totalOptions = options.length || 1;
    const progress = selectedOptions.length / totalOptions;
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
    const segmentCount = selectedOptions.length;
    const anglePerSegment =
      segmentCount > 1
        ? (totalAngle - gapRadians * (segmentCount - 1)) / segmentCount
        : totalAngle;

    selectedOptions.forEach((option, index) => {
      const startAngle = index * (anglePerSegment + gapRadians) - Math.PI / 2;
      const endAngle = startAngle + anglePerSegment;
      const color = tagColors[option] || colorOrder[index % colorOrder.length];
      const arcColor = colorOptions[color]?.hex || colorOptions.green.hex;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = arcColor;
      ctx.lineCap = 'round';
      ctx.stroke();
    });
  }, [selectedOptions, darkMode, options, tagColors, colorOptions, colorOrder]);

  return { canvasRef, colorOptions, colorOrder };
};
