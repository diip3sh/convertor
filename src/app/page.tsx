"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/hero-section";
import { FileQueue } from "@/components/file-queue";
import loadFfmpeg from "@/utils/load-ffmpeg";
import convertFile from "@/utils/media-convert";
import { Actions } from "@/types/action";
import { useToast } from "@/hooks/use-toast";
import { isValidFile } from "@/utils/file";

export default function Home() {
  const [actions, setActions] = useState<Actions[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const ffmpegRef = useRef<FFmpeg | null>(null);
  const { toast } = useToast();

  // Load FFmpeg on mount
  useEffect(() => {
    const load = async () => {
      try {
        const ffmpeg = await loadFfmpeg();
        ffmpegRef.current = ffmpeg;
        setIsLoaded(true);
      } catch (error) {
        console.error("Failed to load FFmpeg:", error);
        toast({
          title: "Error",
          description: "Failed to load conversion engine. Please refresh.",
          variant: "destructive",
        });
      }
    };
    load();
  }, [toast]);

  // Check if all files have target formats selected
  const isReady =
    actions.length > 0 &&
    actions.every((action) => action.to !== null && action.to !== "");

  // Handle file drop
  const handleDrop = useCallback(
    (files: File[]) => {
      const validFiles = files.filter((file) => {
        const valid = isValidFile(file);
        if (!valid) {
          toast({
            title: "Invalid file",
            description: `${file.name} is not a supported format.`,
            variant: "destructive",
          });
        }
        return valid;
      });

      if (validFiles.length === 0) return;

      const newActions: Actions[] = validFiles.map((file) => {
        const extension = file.name.split(".").pop()?.toLowerCase() || "";
        return {
          file,
          file_name: file.name,
          file_size: file.size,
          from: extension,
          to: null,
          file_type: file.type,
          is_converted: false,
          is_converting: false,
          is_error: false,
        };
      });

      setActions((prev) => [...prev, ...newActions]);
      setIsDone(false);
    },
    [toast],
  );

  // Update target format for a file
  const handleFormatChange = useCallback((index: number, format: string) => {
    setActions((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], to: format };
      return updated;
    });
  }, []);

  // Remove a file from the queue
  const handleRemove = useCallback((index: number) => {
    setActions((prev) => {
      const updated = [...prev];
      // Revoke object URL if exists to prevent memory leaks
      if (updated[index].url) {
        URL.revokeObjectURL(updated[index].url);
      }
      updated.splice(index, 1);
      return updated;
    });
  }, []);

  // Download a single file
  const handleDownload = useCallback(
    (index: number) => {
      const action = actions[index];
      if (action.url && action.output) {
        const link = document.createElement("a");
        link.href = action.url;
        link.download = action.output;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    },
    [actions],
  );

  // Convert all files
  const handleConvert = useCallback(async () => {
    if (!ffmpegRef.current || !isReady) return;

    setIsConverting(true);
    setIsDone(false);

    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      if (!action.to || action.is_converted) continue;

      // Mark as converting
      setActions((prev) => {
        const updated = [...prev];
        updated[i] = { ...updated[i], is_converting: true };
        return updated;
      });

      try {
        const result = await convertFile(ffmpegRef.current, action);

        // Mark as converted
        setActions((prev) => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            is_converting: false,
            is_converted: true,
            url: result.url,
            output: result.output,
          };
          return updated;
        });
      } catch (error) {
        console.error("Conversion failed:", error);

        // Mark as error
        setActions((prev) => {
          const updated = [...prev];
          updated[i] = {
            ...updated[i],
            is_converting: false,
            is_error: true,
          };
          return updated;
        });

        toast({
          title: "Conversion failed",
          description: `Failed to convert ${action.file_name}`,
          variant: "destructive",
        });
      }
    }

    setIsConverting(false);
    setIsDone(true);
  }, [actions, isReady, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 container mx-auto px-8">
        <Header />

        <main className="pb-16">
          <HeroSection onDrop={handleDrop} isLoaded={isLoaded} />

          {actions.length > 0 && (
            <FileQueue
              actions={actions}
              onFormatChange={handleFormatChange}
              onRemove={handleRemove}
              onDownload={handleDownload}
              onConvert={handleConvert}
              isConverting={isConverting}
              isReady={isReady}
              isDone={isDone}
            />
          )}
        </main>
      </div>
    </div>
  );
}
