# AGENTS.md - Developer Guide for convertor

This document provides guidance for AI agents working in this repository.

## Project Overview

A Next.js 16 web application for converting media files (audio, video, images) between formats using FFmpeg in the browser. The application features a dark-themed, modern UI with drag-and-drop functionality, batch conversion support, and real-time conversion status updates.

## Tech Stack

- **Framework**: Next.js 16.1.6 with App Router
- **Language**: TypeScript 5.9.3 (strict mode enabled)
- **UI**: React 19.2.4, Tailwind CSS 3.4.19, shadcn/ui (new-york style)
- **Fonts**: Geist (Sans, Mono, Pixel Grid)
- **Icons**: Lucide React, Phosphor Icons
- **Animation**: Anime.js 4.3.6
- **Media Processing**: @ffmpeg/ffmpeg 0.12.15, @ffmpeg/util 0.12.2
- **File Upload**: react-dropzone 15.0.0
- **Notifications**: sonner 2.0.7, Radix UI Toast
- **Package Manager**: pnpm (primary), npm (fallback)

## Project Structure

```
src/
├── app/                          # Next.js App Router pages
│   ├── layout.tsx               # Root layout with Geist fonts
│   ├── page.tsx                 # Home page with conversion logic
│   ├── globals.css              # Global styles, CSS variables, animations
│   └── favicon.ico              # Site favicon
├── components/
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx           # Button with cva variants
│   │   ├── badge.tsx            # Badge component
│   │   ├── select.tsx           # Select dropdown
│   │   ├── dropdown-menu.tsx    # Dropdown menu (Radix)
│   │   ├── tabs.tsx             # Tabs component
│   │   ├── toast.tsx            # Toast notification
│   │   ├── toaster.tsx          # Toast container
│   │   ├── tooltip.tsx          # Tooltip component
│   │   └── skeleton.tsx         # Loading skeleton
│   ├── dropzone-new.tsx         # Main file dropzone with animations
│   ├── hero-section.tsx         # Hero section with dropzone
│   ├── file-queue.tsx           # File list container
│   ├── file-row.tsx             # Individual file row
│   ├── format-selector.tsx      # Target format dropdown
│   ├── actions-footer.tsx       # Convert/Download buttons
│   ├── header.tsx               # Site header
│   └── nav-bottomBar.tsx        # GitHub link floating button
├── hooks/
│   └── use-toast.ts             # Toast notification hook
├── lib/
│   └── utils.ts                 # cn() utility for Tailwind classes
├── types/
│   ├── file.ts                  # File type definitions
│   └── action.ts                # Action type for conversions
└── utils/
    ├── constant.ts              # File extensions and accepted formats
    ├── file.ts                  # File validation and formatting utilities
    ├── file-to-icon.tsx         # File type to icon mapping
    ├── media-convert.ts         # FFmpeg conversion logic
    ├── load-ffmpeg.ts           # FFmpeg initialization
    └── compress-filenames.ts    # Filename truncation utility

public/
└── svg/
    └── github.tsx               # GitHub SVG icon component
```

## Commands

### Development

```bash
pnpm dev          # Start dev server with Turbopack (port 3000)
npm run dev       # Alternative using npm
```

### Build & Production

```bash
pnpm build        # Production build
pnpm start        # Start production server
```

### Linting

```bash
pnpm lint         # Run ESLint (next/core-web-vitals + next/typescript)
```

### Testing

No test framework is configured. Do not add tests unless explicitly requested.

## Code Style Guidelines

### TypeScript

- Use explicit types for function parameters and return types
- Use `type` for object shapes, `interface` for extensible types
- Avoid `any`; use `unknown` when type is truly unknown
- Use `strict: true` - all strict flags enabled in tsconfig

### Naming Conventions

- **Components**: PascalCase (e.g., `MediaZone`, `DropzoneNew`)
- **Functions**: camelCase (e.g., `formatFileSize`, `convertFile`)
- **Constants**: SCREAMING_SNAKE_CASE for config values, camelCase otherwise
- **Files**: kebab-case for utilities, PascalCase for components

### Imports

Order imports groups:
1. External libraries (React, Next.js)
2. UI components (Radix, shadcn)
3. Internal imports (@/components, @/hooks, @/utils, @/types)
4. Relative imports (../, ./)

Example:
```typescript
import { useState, useEffect, useRef, useCallback } from "react";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { useDropzone } from "react-dropzone";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatFileSize } from "@/utils/file";
import { Actions } from "@/types/action";
```

Use path aliases:
- `@/*` for `./src/*`
- `@/components/*` for components
- `@/ui/*` for UI components
- `@/hooks/*` for hooks
- `@/utils/*` for utilities
- `@/types/*` for type definitions

### React Patterns

- Use `"use client"` directive for client-side components
- Use functional components with hooks
- Memoize callbacks with `useCallback` when passed as props
- Use `useState` with proper type annotations
- Extract complex logic into custom hooks

Example component structure:
```typescript
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ComponentProps {
  className?: string;
  onAction: (value: string) => void;
}

export const Component = ({ className, onAction }: ComponentProps) => {
  const [state, setState] = useState(false);

  const handleClick = useCallback(() => {
    onAction("value");
  }, [onAction]);

  return (
    <div className={cn("base-classes", className)}>
      <Button onClick={handleClick}>Action</Button>
    </div>
  );
};
```

### CSS & Styling

- Use Tailwind CSS exclusively
- Use `cn()` utility for conditional classes:
```typescript
import { cn } from "@/lib/utils";

// Good
<div className={cn("base-classes", condition && "conditional-class", className)} />

// Avoid
<div className={`base-classes ${condition ? "conditional-class" : ""} ${className}`} />
```

- Use CSS variables from globals.css for theming:
  - `--bg-color`, `--bg-darker`, `--bg-elevated` - Background colors
  - `--text-color`, `--text-secondary` - Text colors
  - `--line-color` - Border/divider colors
  - `--accent-green`, `--accent-cyan` - Accent colors
  - `--radius-lg`, `--radius-sm` - Border radius values

- Keep Tailwind classes organized (structure: layout → spacing → visual → state)

### Animation Guidelines

The project uses Anime.js for animations following these principles:
- **Micro-interactions**: Maximum 300ms duration, ease-out easing
- **Ambient animations**: Exempt from 300ms rule (e.g., floating icons with 3s loops)
- **Decorative effects**: Particle effects, ripple animations
- **Hover states**: 200ms duration, ease-out easing
- **Active/pressed states**: Scale down to 0.98

Common animation patterns:
```typescript
// Hover lift effect
hover:-translate-y-2 hover:shadow-[0_20px_60px_rgba(61,214,140,0.15)]

// Active press
active:scale-[0.98]

// Page load animation
animate-in  // Custom keyframe: fade in + translateY
```

### Error Handling

- Use try/catch with proper error typing
- Log errors appropriately (console.error for critical, console.log for debug)
- Handle errors in UI with toast notifications using the useToast hook
- Always clean up object URLs to prevent memory leaks: `URL.revokeObjectURL(url)`

## Supported File Formats

### Images
Input: jpg, jpeg, png, gif, bmp, webp, ico, tif, tiff, svg, raw, tga
Output: webp, png, jpg, avif

### Video
Input: mp4, m4v, mp4v, 3gp, 3g2, avi, mov, wmv, mkv, flv, ogv, webm, h264, 264, hevc, 265
Output: gif, webm, mp4, mov

### Audio
Input: mp3, wav, ogg, aac, wma, flac, m4a
Output: mp3, wav, ogg, flac

## FFmpeg Integration

FFmpeg is loaded from unpkg CDN (@ffmpeg/core@0.12.2) in the browser:
- Core URL: `https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd/ffmpeg-core.js`
- WASM URL: `https://unpkg.com/@ffmpeg/core@0.12.2/dist/umd/ffmpeg-core.wasm`

Special handling for 3GP format with specific encoding parameters.

## shadcn/ui Components

Components are located in `src/components/ui/` and follow shadcn/ui conventions:
- Use cva (class-variance-authority) for variants
- Use Radix UI primitives as base
- Style with Tailwind CSS
- Use `cn()` utility for class merging

To add a new component:
```bash
npx shadcn@latest add [component-name]
```

## Configuration Files

- `tsconfig.json`: Strict TypeScript, ES2017 target, jsx: react-jsx
- `tailwind.config.ts`: shadcn/ui with gray base color, custom font families
- `eslint.config.mjs`: next/core-web-vitals + next/typescript
- `next.config.ts`: Next.js configuration (currently minimal)
- `components.json`: shadcn/ui configuration (new-york style)
- `postcss.config.mjs`: PostCSS with Tailwind plugin

## State Management

The application uses React's built-in state management:
- `useState` for local component state
- `useCallback` for memoized event handlers
- `useRef` for FFmpeg instance persistence
- `useToast` for notification state

No external state management library (Redux, Zustand, etc.) is used.

## Browser Compatibility

- Modern browsers with WebAssembly support required for FFmpeg
- Chrome, Firefox, Safari, Edge (latest versions)
- Mobile browsers with sufficient memory for file processing

## Security Considerations

- File conversion happens entirely client-side via FFmpeg WASM
- No files are uploaded to any server
- Object URLs are properly revoked to prevent memory leaks
- File type validation before processing
- Sanitize file names in output

## Performance Guidelines

- Use `useCallback` for functions passed to child components
- Lazy load FFmpeg only when needed
- Revoke object URLs after download to free memory
- Use CSS transforms for animations (GPU accelerated)
- Implement proper cleanup in useEffect return functions
