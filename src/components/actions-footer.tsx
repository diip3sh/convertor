"use client";

import { Actions } from "@/types/action";
import { Download } from "lucide-react";

interface ActionsFooterProps {
  actions: Actions[];
  onConvert: () => void;
  isConverting: boolean;
  isReady: boolean;
  isDone: boolean;
}

export const ActionsFooter = ({
  actions,
  onConvert,
  isConverting,
  isReady,
  isDone,
}: ActionsFooterProps) => {
  const convertedCount = actions.filter((a) => a.is_converted).length;

  const handleDownloadAll = () => {
    actions.forEach((action) => {
      if (action.url && action.output) {
        const link = document.createElement("a");
        link.href = action.url;
        link.download = action.output;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    });
  };

  // Calculate estimated time (placeholder logic)
  const getEstimatedTime = () => {
    const totalSize = actions.reduce((acc, action) => acc + action.file_size, 0);
    const estimatedSeconds = Math.max(2, Math.ceil(totalSize / (1024 * 1024 * 5))); // ~5MB/s
    return estimatedSeconds < 60 
      ? `~${estimatedSeconds} Seconds` 
      : `~${Math.ceil(estimatedSeconds / 60)} Minutes`;
  };

  return (
    <div className="mt-12 flex justify-end items-center gap-8">
      {/* Time Estimate */}
      {!isDone && !isConverting && isReady && (
        <div className="text-right">
          <div className="text-[0.8rem] font-mono uppercase font-semibold mb-1 text-[var(--text-color)]">
            Est. Time
          </div>
          <div className="text-[var(--text-secondary)]">
            {getEstimatedTime()}
          </div>
        </div>
      )}

      {/* Convert Button */}
      {!isDone && (
        <button
          type="button"
          onClick={onConvert}
          disabled={!isReady || isConverting}
          className={`
            relative flex items-center gap-2
            px-12 py-5 rounded-lg font-semibold text-base
            transition-all duration-200 ease-out
            ${isReady && !isConverting
              ? "bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-cyan)] text-black hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(61,214,140,0.3)] active:translate-y-0 active:scale-[0.98]"
              : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] cursor-not-allowed"
            }
          `}
        >
          <span className="text-xl">↳</span>
          {isConverting ? "Converting..." : "Start Conversion"}
        </button>
      )}

      {/* Download All Button */}
      {isDone && convertedCount > 0 && (
        <button
          type="button"
          onClick={handleDownloadAll}
          className="flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-base bg-gradient-to-r from-[var(--accent-green)] to-[var(--accent-cyan)] text-black hover:-translate-y-0.5 hover:shadow-[0_10px_40px_rgba(61,214,140,0.3)] transition-all duration-200 ease-out active:translate-y-0 active:scale-[0.98]"
        >
          <Download className="w-5 h-5" />
          Download All ({convertedCount})
        </button>
      )}
    </div>
  );
};
