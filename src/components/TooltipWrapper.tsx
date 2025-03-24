
import React from 'react';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
  tooltip?: string | React.ReactNode;
  show?: boolean;
  children: React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltip,
  show = true,
  children,
  side = "right",
  align = "center"
}) => {
  if (!tooltip || !show) {
    return <>{children}</>;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent side={side} align={align}>
          {typeof tooltip === 'string' ? tooltip : tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
