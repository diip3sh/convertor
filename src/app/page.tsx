import { MediaZone } from "@/components/dropzone";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-2xl lg:max-w-3xl space-y-12">
        <header className="text-center space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight text-foreground">
            Convertor
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Transform media between formats instantly. 
            Support for audio, video, and images — all in your browser.
          </p>
        </header>
        <MediaZone />
        <footer className="text-center pt-8">
          <p className="text-sm text-muted-foreground/60">
            No uploads — everything happens locally on your device
          </p>
        </footer>
      </div>
    </main>
  );
}
