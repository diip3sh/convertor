"use client";

import { DropzoneNew } from "./dropzone-new";

interface HeroSectionProps {
  onDrop: (files: File[]) => void;
  isLoaded: boolean;
}

export const HeroSection = ({ onDrop, isLoaded }: HeroSectionProps) => {
  return (
    <section className="py-12 ">
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr] gap-8">
        {/* Left Content */}
        <div className="pr-8">
          <span className="block text-[0.65rem] uppercase font-semibold tracking-wider mb-4 text-[var(--text-color)]">
            Upload Media
          </span>

          <h1 className="text-[3.5rem] leading-[0.95] font-semibold tracking-tight mb-6 text-[var(--text-color)] max-lg:text-[2.5rem]">
            Convert your visual assets to any format
          </h1>

          <p className="text-lg leading-relaxed max-w-md mb-8 text-[var(--text-color)]">
            This tool was built to strip away the complexity of file encoding.
            Simple drag and drop for high-fidelity conversion.
          </p>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-sm text-[var(--text-color)] border-b border-transparent hover:border-[var(--text-color)] transition-colors duration-200 bg-transparent"
          >
            <span className="text-lg relative -top-0.5">↳</span>
            View supported formats
          </button>
        </div>

        {/* Right Content - Dropzone */}
        <div>
          <DropzoneNew onDrop={onDrop} isLoaded={isLoaded} />
        </div>
      </div>
    </section>
  );
};
