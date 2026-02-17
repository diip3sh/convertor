"use client";

import { useRef, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface DropzoneNewProps {
  onDrop: (files: File[]) => void;
  isLoaded: boolean;
}

export const DropzoneNew = ({ onDrop, isLoaded }: DropzoneNewProps) => {
  const dropzoneRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsProcessing(true);
        onDrop(acceptedFiles);
        setTimeout(() => setIsProcessing(false), 1500);
      }
    },
    [onDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      "image/*": [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".bmp",
        ".webp",
        ".ico",
        ".tif",
        ".tiff",
        ".raw",
        ".tga",
      ],
      "audio/*": [".mp3", ".wav", ".ogg", ".aac", ".wma", ".flac", ".m4a"],
      "video/*": [
        ".mp4",
        ".m4v",
        ".mp4v",
        ".3gp",
        ".3g2",
        ".avi",
        ".mov",
        ".wmv",
        ".mkv",
        ".flv",
        ".ogv",
        ".webm",
        ".h264",
        ".264",
        ".hevc",
        ".265",
      ],
    },
    disabled: !isLoaded,
  });

  const rootProps = getRootProps();
  const originalOnClick = rootProps.onClick;

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (originalOnClick) {
      originalOnClick(e);
    }
  };

  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);
  const handleMouseLeave = () => setIsPressed(false);

  // Number of dashed rectangles
  const numRects = 5;

  return (
    <div
      className="relative w-full h-[420px]"
      style={{ perspective: "1200px" }}
    >
      {/* Main Dropzone */}
      <div
        {...rootProps}
        ref={dropzoneRef}
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        className={cn(
          "relative w-full h-full rounded-[28px] overflow-hidden cursor-pointer",
          "transition-all duration-200 ease-out",
          "flex flex-col items-center justify-center",
          "active:scale-[0.98]",
          isDragActive
            ? "bg-background/90"
            : isProcessing
              ? "bg-muted-foreground/5"
              : "bg-muted-foreground/5",
          !isLoaded && "opacity-50 cursor-not-allowed",
        )}
        style={{
          transform: isDragActive
            ? "scale(0.96)"
            : isPressed
              ? "scale(0.98)"
              : "scale(1)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <input {...getInputProps()} />

        {/* Dashed rectangles - same style for both states, different animation */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[...Array(numRects)].map((_, i) => (
            <div
              key={i}
              className={cn(
                "absolute rounded-[24px] border-2 border-dashed transition-all duration-200",
                isDragActive ? "animate-ripple-pulse" : "",
                isDragActive ? "border-white/40" : "border-white/20",
              )}
              style={{
                width: `${90 - i * 15}%`,
                height: `${90 - i * 15}%`,
                opacity: isDragActive ? 0.5 - i * 0.08 : 0.2 - i * 0.03,
                animationDelay: `${i * 0.04}s`,
                transitionDelay: `${i * 25}ms`,
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
              }}
            />
          ))}
        </div>

        {/* Center Content - Text only */}
        <div
          className={cn(
            "relative z-10 flex flex-col items-center justify-center transition-all duration-200",
            isDragActive && "scale-105",
          )}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Text only - uppercase, font-mono, font-semibold, tracking-tight */}
          <p
            className={cn(
              "text-lg font-mono font-semibold uppercase tracking-tight transition-colors duration-200",
              isDragActive ? "text-white" : "text-[var(--text-color)]",
            )}
          >
            {isProcessing
              ? "Uploading..."
              : isDragActive
                ? "Release"
                : "Drag file here"}
          </p>
          {!isDragActive && !isProcessing && (
            <p className="text-sm text-[var(--text-secondary)] mt-2 font-mono">
              {isLoaded ? "or click to browse" : "Loading FFmpeg..."}
            </p>
          )}
        </div>
      </div>

      {/* Global styles for ripple animation */}
      <style jsx global>{`
        @keyframes ripple-pulse {
          0%,
          100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.03);
          }
        }

        .animate-ripple-pulse {
          animation: ripple-pulse 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
