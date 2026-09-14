import React from "react";
import { WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/src/hooks/useOnlineStatus.ts";

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 left-4 z-40 flex items-center gap-2.5 rounded-2xl border border-amber-500/30 bg-amber-950/90 px-4 py-2 text-xs font-semibold text-amber-200 shadow-2xl backdrop-blur-md animate-fade-in">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-500" />
      </span>
      <WifiOff size={14} className="text-amber-400" />
      <span>Mode Offline — Menu & foto tersimpan di perangkat</span>
    </div>
  );
};
