"use client";

import { useState } from "react";
import { MediaZone } from "@/components/dropzone";

export default function Home() {
  const [hasFiles, setHasFiles] = useState(false);

  return (
    <main
      className={`min-h-screen flex flex-col items-center px-4 sm:px-6 lg:px-8 py-12 transition-all duration-500 ease-out ${
        hasFiles ? "pt-8" : "justify-center"
      }`}
    >
      <div
        className={`w-full max-w-2xl lg:max-w-3xl transition-all duration-500 ease-out ${
          hasFiles ? "space-y-6" : "space-y-12"
        }`}
      >
        <header
          className={`text-center space-y-4 transition-all duration-500 ease-out ${
            hasFiles ? "scale-75 origin-top mx-auto" : ""
          }`}
        >
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight text-foreground font-pixel font-semibold">
            Convertor
          </h1>
          <p
            className={`text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed font-sans transition-all duration-500 ${
              hasFiles ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
            }`}
          >
            Transform media between formats instantly. Support for audio, video,
            and images — all in your browser.
          </p>
        </header>
        <MediaZone onFilesChange={setHasFiles} />
        <footer
          className={`text-center pt-8 transition-all duration-500 ${
            hasFiles ? "opacity-0 h-0 overflow-hidden pt-0" : "opacity-100"
          }`}
        >
          <p className="text-sm text-muted-foreground/60">
            No uploads — everything happens locally on your device
          </p>
        </footer>
      </div>
    </main>
  );
}
