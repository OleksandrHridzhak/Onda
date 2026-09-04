import React from "react";
import { Heading } from "shared/ui/Heading";
import { Text } from "shared/ui/Text";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  className = "",
}: EmptyStateProps) => {
  return (
    <div
      className={`flex w-full h-full min-h-[200px] items-center justify-center p-6 ${className}`}
    >
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        {icon && (
          <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-primaryColor/10 text-primaryColor">
            {icon}
          </div>
        )}
        {(title || description) && (
          <div>
            {title && (
              <Heading as="h2" variant="base">
                {title}
              </Heading>
            )}
            {description && (
              <Text tone="muted" className="mt-1">
                {description}
              </Text>
            )}
          </div>
        )}
        {action && <div className="mt-2">{action}</div>}
      </div>
    </div>
  );
};

export default EmptyState;
