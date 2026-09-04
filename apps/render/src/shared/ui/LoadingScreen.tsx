import React from "react";
import { Text } from "shared/ui/Text";

interface LoadingScreenProps {
  message?: string;
  className?: string;
}

export const LoadingScreen = ({
  message = "Syncing data...",
  className = "",
}: LoadingScreenProps) => {
  return (
    <div
      className={`flex items-center justify-center w-full h-full min-h-[250px] rounded-lg bg-background p-6 ${className}`}
    >
      <div className="flex flex-col items-center gap-4">
        {/* Animated circles */}
        <div className="relative w-24 h-24">
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primaryColor animate-spin" />
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-t-primaryColor/50 animate-spin"
            style={{
              animationDirection: "reverse",
              animationDuration: "1.5s",
            }}
          />

          {/* ONDA text in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold tracking-wider text-primaryColor">
              ONDA
            </span>
          </div>
        </div>

        {/* Loading text */}
        {message && (
          <Text tone="muted" className="font-medium animate-pulse">
            {message}
          </Text>
        )}
      </div>
    </div>
  );
};

export default LoadingScreen;
