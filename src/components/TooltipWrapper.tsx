
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
  className?: string;
  delayDuration?: number;
  animation?: "fade" | "scale" | "slide";
}

const TooltipWrapper: React.FC<TooltipWrapperProps> = ({
  tooltip,
  show = true,
  children,
  side = "right",
  align = "center",
  className = "",
  delayDuration = 300,
  animation = "fade"
}) => {
  if (!tooltip || !show) {
    return <>{children}</>;
  }

  // Generate animation class based on the animation prop
  const getAnimationClass = () => {
    switch (animation) {
      case "scale":
        return "animate-scale-in";
      case "slide":
        return "animate-slide-up";
      case "fade":
      default:
        return "animate-fade-in";
    }
  };

  return (
    <TooltipProvider delayDuration={delayDuration}>
      <Tooltip>
        <TooltipTrigger asChild>
          {children}
        </TooltipTrigger>
        <TooltipContent 
          side={side} 
          align={align} 
          className={`${getAnimationClass()} ${className}`}
          sideOffset={5}
        >
          {typeof tooltip === 'string' ? tooltip : tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
