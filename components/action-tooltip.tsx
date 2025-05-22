"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface ActionTooptipProps {
  label: string;
  children: React.ReactNode;
  side?: "top" | "right" | "left" | "bottom";
  align?: "start" | "center" | "end";
}

export default function ActionTooltip({
  label,
  children,
  side = "top",
  align = "center",
}: ActionTooptipProps) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={50}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side} align={align}>
          <p className="font-semibold text-sm capitalize">
            {label.toLowerCase()}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
