"use client";

import { Actions } from "@/types/action";
import { FileRow } from "./file-row";
import { ActionsFooter } from "./actions-footer";

interface FileQueueProps {
  actions: Actions[];
  onFormatChange: (index: number, format: string) => void;
  onRemove: (index: number) => void;
  onDownload: (index: number) => void;
  onConvert: () => void;
  isConverting: boolean;
  isReady: boolean;
  isDone: boolean;
}

export const FileQueue = ({
  actions,
  onFormatChange,
  onRemove,
  onDownload,
  onConvert,
  isConverting,
  isReady,
  isDone,
}: FileQueueProps) => {
  const itemCount = actions.length;

  return (
    <section className="py-16">
      {/* Queue Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <span className="block text-[0.65rem] font-mono uppercase font-semibold tracking-wider mb-2 text-[var(--text-color)]">
            Queue
          </span>
          <h3 className="text-2xl font-semibold text-[var(--text-color)]">
            Ready for conversion
          </h3>
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          {itemCount} {itemCount === 1 ? "item" : "items"} selected
        </div>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-[80px_1fr_1fr_1fr_100px] gap-6 mb-4 px-0 text-[0.7rem] font-mono uppercase font-semibold text-[var(--text-secondary)] max-lg:grid-cols-[60px_1fr_100px]">
        <span>Preview</span>
        <span>Filename</span>
        <span className="max-lg:hidden">Original Specs</span>
        <span className="max-lg:hidden">Target Format</span>
        <span className="text-right max-lg:hidden">Action</span>
      </div>

      {/* File Rows */}
      <div className="animate-in">
        {actions.map((action, index) => (
          <FileRow
            key={`${action.file_name}-${index}`}
            action={action}
            index={index}
            onFormatChange={(format) => onFormatChange(index, format)}
            onRemove={() => onRemove(index)}
            onDownload={() => onDownload(index)}
            isConverting={isConverting}
          />
        ))}
      </div>

      {/* Actions Footer */}
      <ActionsFooter
        actions={actions}
        onConvert={onConvert}
        isConverting={isConverting}
        isReady={isReady}
        isDone={isDone}
      />
    </section>
  );
};
