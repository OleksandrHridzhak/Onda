import React from "react";
import { Eye, EyeOff } from "lucide-react";

export interface VisibilityToggleProps {
  isVisible: boolean;
  onToggle: (visible: boolean) => void;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export function VisibilityToggle({
  isVisible,
  onToggle,
  size = 18,
  className = "",
  ariaLabel,
}: VisibilityToggleProps): React.ReactElement {
  return (
    <button
      type="button"
      onClick={() => onToggle(!isVisible)}
      className={`flex items-center justify-center text-textMuted hover:text-text transition-colors cursor-pointer ${className}`}
      aria-label={ariaLabel || (isVisible ? "Hide content" : "Show content")}
    >
      {isVisible ? <Eye size={size} /> : <EyeOff size={size} />}
    </button>
  );
}

export default VisibilityToggle;
