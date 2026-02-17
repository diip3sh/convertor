"use client";

import { Actions } from "@/types/action";
import { formatFileSize } from "@/utils/file";
import { FormatSelector } from "./format-selector";
import { ImageIcon, FileAudio, FileVideo, FileText, File } from "lucide-react";

interface FileRowProps {
  action: Actions;
  index: number;
  onFormatChange: (format: string) => void;
  onRemove: () => void;
  onDownload?: () => void;
  isConverting?: boolean;
}

export const FileRow = ({ 
  action, 
  index, 
  onFormatChange, 
  onRemove, 
  onDownload,
  isConverting 
}: FileRowProps) => {
  const getFileIcon = () => {
    if (action.file_type.includes("image")) {
      return <ImageIcon className="w-6 h-6 text-[var(--accent-green)]" />;
    }
    if (action.file_type.includes("video")) {
      return <FileVideo className="w-6 h-6 text-[var(--accent-green)]" />;
    }
    if (action.file_type.includes("audio")) {
      return <FileAudio className="w-6 h-6 text-[var(--accent-green)]" />;
    }
    if (action.file_type.includes("text")) {
      return <FileText className="w-6 h-6 text-[var(--text-secondary)]" />;
    }
    return <File className="w-6 h-6 text-[var(--text-secondary)]" />;
  };

  const getFileSpecs = () => {
    const size = formatFileSize(action.file_size);
    
    if (action.file_type.includes("image")) {
      return `${size} • Image`;
    }
    if (action.file_type.includes("video")) {
      return `${size} • Video`;
    }
    if (action.file_type.includes("audio")) {
      return `${size} • Audio`;
    }
    return `${size} • ${action.file_type}`;
  };

  const getFileType = () => {
    if (action.file_type.includes("image")) return "image";
    if (action.file_type.includes("video")) return "video";
    if (action.file_type.includes("audio")) return "audio";
    return "other";
  };

  const displayIndex = String(index + 1).padStart(2, "0");

  return (
    <div 
      className={`
        grid grid-cols-[80px_1fr_1fr_1fr_100px] items-center
        gap-6 py-6 border-t border-[var(--line-color)]
        transition-all duration-200 ease-out
        hover:bg-[radial-gradient(ellipse_at_center,rgba(61,214,140,0.08)_0%,rgba(61,214,140,0.02)_50%,transparent_100%)]
        active:scale-[0.995]
        last:border-b last:border-[var(--line-color)]
        max-lg:grid-cols-[60px_1fr_100px]
      `}
    >
      {/* Preview */}
      <div className="w-20 h-20 bg-[var(--bg-elevated)] border border-[var(--line-color)] rounded-xl overflow-hidden flex items-center justify-center max-lg:w-[60px] max-lg:h-[60px]">
        {getFileIcon()}
      </div>

      {/* Filename */}
      <div className="min-w-0">
        <span className="block text-[0.65rem] font-mono uppercase font-semibold tracking-wider mb-0.5 text-[var(--text-secondary)]">
          {displayIndex}
        </span>
        <h4 className="text-[1.75rem] leading-none font-semibold truncate text-[var(--text-color)] max-lg:text-xl">
          {action.file_name}
        </h4>
      </div>

      {/* Details - hidden on mobile */}
      <div className="max-lg:hidden">
        <div className="text-[0.65rem] font-mono uppercase font-semibold tracking-wider mb-2 text-[var(--text-color)]">
          Details
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          {getFileSpecs()}
        </div>
      </div>

      {/* Format Selector */}
      <div className="max-lg:col-span-2">
        <FormatSelector
          fileType={getFileType()}
          value={action.to}
          onChange={onFormatChange}
          disabled={isConverting || action.is_converted}
          currentFormat={action.from}
        />
      </div>

      {/* Action - hidden on mobile */}
      <div className="text-right max-lg:hidden">
        {action.is_converted && onDownload ? (
          <button
            type="button"
            onClick={onDownload}
            className="text-sm text-[var(--accent-green)] underline hover:text-[var(--accent-cyan)] transition-colors duration-200"
          >
            Download
          </button>
        ) : action.is_converting ? (
          <span className="text-sm text-[var(--accent-green)] animate-pulse">
            Converting...
          </span>
        ) : action.is_error ? (
          <span className="text-sm text-red-500">
            Failed
          </span>
        ) : (
          <button
            type="button"
            onClick={onRemove}
            disabled={isConverting}
            className="text-sm text-[var(--text-secondary)] underline hover:text-[var(--text-color)] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};
