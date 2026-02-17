# Media Converter

A modern, browser-based media converter that transforms audio, video, and images between formats — entirely client-side using FFmpeg WebAssembly. No uploads, no servers, just fast conversions right in your browser.

![Media Converter Screenshot](https://via.placeholder.com/800x450?text=Media+Converter+UI)

## Features

- Convert images between formats (jpg, jpeg, png, gif, bmp, webp, avif, etc.)
- Convert videos to different formats (mp4, mov, webm, gif, etc.)
- Convert audio files between formats (mp3, wav, ogg, flac, etc.)
- Drag and drop interface with batch upload support
- Real-time conversion progress tracking
- Batch conversion — convert multiple files at once
- Download converted files individually or all at once

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 16.1.6 (App Router) |
| Language | TypeScript 5.9.3 (strict mode) |
| UI | React 19, Tailwind CSS 3.4, shadcn/ui |
| Fonts | Geist (Sans, Mono, Pixel Grid) |
| Icons | Lucide React, Phosphor Icons |
| Animation | Anime.js 4.3 |
| Media Processing | @ffmpeg/ffmpeg 0.12, @ffmpeg/util 0.12 |
| File Upload | react-dropzone 15.0 |
| Notifications | sonner 2.0, Radix UI Toast |

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with Geist fonts
│   ├── page.tsx            # Home page with conversion logic
│   ├── globals.css         # Global styles, CSS variables, animations
│   └── favicon.ico
├── components/
│   ├── ui/                 # shadcn/ui components (button, badge, select, etc.)
│   ├── dropzone-new.tsx    # Drag & drop zone with animations
│   ├── hero-section.tsx    # Hero section containing dropzone
│   ├── file-queue.tsx      # File list container
│   ├── file-row.tsx        # Individual file row with format selector
│   ├── format-selector.tsx # Target format dropdown
│   ├── actions-footer.tsx  # Convert/Download action buttons
│   ├── header.tsx         # Site header
│   └── nav-bottomBar.tsx   # GitHub link floating button
├── hooks/
│   └── use-toast.ts       # Toast notification hook
├── lib/
│   └── utils.ts           # cn() utility for Tailwind classes
├── types/
│   ├── file.ts            # File type definitions
│   └── action.ts          # Action type for conversions
└── utils/
    ├── constant.ts         # File extensions and accepted formats
    ├── file.ts            # File validation and formatting utilities
    ├── file-to-icon.tsx   # File type to icon mapping
    ├── media-convert.ts   # FFmpeg conversion logic
    ├── load-ffmpeg.ts     # FFmpeg initialization
    └── compress-filenames.ts # Filename truncation utility

public/
└── svg/
    └── github.tsx         # GitHub SVG icon component
```

## How FFmpeg Works

The application runs FFmpeg entirely in the browser using WebAssembly (WASM). Here's how it works:

### 1. FFmpeg Loading

FFmpeg is lazy-loaded only when the user first initiates a conversion:

```typescript
// From utils/load-ffmpeg.ts
const loadFFmpeg = async () => {
  const ffmpeg = new FFmpeg();
  await ffmpeg.load({
    coreURL: "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd/ffmpeg-core.js",
    wasmURL: "https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd/ffmpeg-core.wasm",
  });
  return ffmpeg;
};
```

### 2. File Conversion

When a user selects a target format and clicks convert:

1. The file is read as a `Uint8Array` using FFmpeg's `writeFile`
2. FFmpeg runs the appropriate command (e.g., `ffmpeg -i input.png output.webp`)
3. The converted file is read back using `readFile`
4. A download URL is created using `URL.createObjectURL`

### 3. Supported Conversions

| Input Type | Output Formats |
|------------|----------------|
| Images | webp, png, jpg, avif |
| Video | gif, webm, mp4, mov |
| Audio | mp3, wav, ogg, flac |

### Key Learnings

- **Client-side processing**: All conversion happens in the user's browser — no server costs, no privacy concerns
- **WebAssembly power**: FFmpeg WASM brings desktop-grade media processing to the web
- **Memory management**: Important to revoke object URLs after download to prevent memory leaks
- **Format filtering**: Dynamically filter output formats based on input type to prevent invalid conversions
- **Async operations**: FFmpeg operations are async — need proper loading states and progress tracking

## TODO

- [ ] Add more output formats (HEIC, TIFF, etc.)
- [ ] Implement video compression options (quality presets)
- [ ] Add conversion speed/size optimization
- [ ] Progress bar for individual files during batch conversion
- [ ] Persist conversion history in localStorage
- [ ] Add keyboard shortcuts (e.g., Cmd+Enter to convert)
- [ ] Mobile-optimized UI improvements

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/yourusername/media-converter.git
cd media-converter
```

2. Install dependencies:

```bash
npm install
# or
pnpm install
```

3. Run the development server:

```bash
npm run dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
