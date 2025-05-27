"use client";

import { useSocket } from "@/components/providers/socket-provider";
import { Badge } from "@/components/ui/badge";
import { Circle } from "lucide-react";
import ActionTooltip from "./action-tooltip";

export default function SocketIndicator() {
  const { isConnected } = useSocket();

  return (
    <ActionTooltip
      label={
        isConnected
          ? "Live: Real-Time Updates"
          : "Fallback: polling every 1 seconds"
      }
    >
      <Badge
        variant="outline"
        className={`flex items-center gap-2 dark:text-white border-none text-black font-semibold rounded-full
        ${isConnected ? "bg-emerald-600/30" : "bg-yellow-600/30"}`}
      >
        <Circle
          className={`h-3 w-3 ${
            isConnected
              ? "text-green-500 fill-green-500"
              : "text-yellow-600 fill-yellow-600 animate-pulse"
          }`}
        />
        {isConnected ? "Online" : "Offline"}
      </Badge>
    </ActionTooltip>
  );
}
