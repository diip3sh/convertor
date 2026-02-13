# AGENTS.md - Developer Guide for convertor

This document provides guidance for AI agents working in this repository.

## Project Overview

A Next.js 16 web application for converting media files (audio, video, images) between formats using FFmpeg in the browser.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode enabled)
- **UI**: React 19, Tailwind CSS, shadcn/ui (new-york style)
- **Icons**: Lucide React
- **Media Processing**: @ffmpeg/ffmpeg
- **Package Manager**: pnpm

---

## Commands

### Development

```bash
pnpm dev          # Start dev server with Turbopack (port 3000)
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

---

## Code Style Guidelines

### TypeScript

- Use explicit types for function parameters and return types
- Use `type` for object shapes, `interface` for extensible types
- Avoid `any`; use `unknown` when type is truly unknown
- Use `strict: true` - all strict flags enabled in tsconfig

### Naming Conventions

- **Components**: PascalCase (e.g., `MediaZone`, `Dropzone`)
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
import ReactDropzone from "react-dropzone";
import { UploadCloud, FileSymlink } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/utils/file";
import { FilesType } from "@/types/file";
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

import { useState } from "react";
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

- Use shadcn/ui design tokens (hsl variables) for colors
- Keep Tailwind classes organized (structure: layout → spacing → visual → state)

### Error Handling

- Use try/catch with proper error typing
- Log errors appropriately (console.error for critical, console.log for debug)
- Handle errors in UI with toast notifications using sonner

### shadcn/ui Components

- Follow shadcn/ui conventions (use cva for variants)
- Components are in `src/components/ui/`
- Use existing patterns from button.tsx, badge.tsx, etc.

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout
│   ├── page.tsx           # Home page
│   ├── globals.css        # Global styles with CSS variables
│   └── [route]/           # Route pages
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── dropzone.tsx       # Main dropzone component
│   └── header.tsx         # Header component
├── hooks/
│   └── use-toast.ts       # Toast hook
├── lib/
│   └── utils.ts           # cn() utility
├── types/
│   ├── file.ts           # File type definitions
│   └── action.ts         # Action type definitions
└── utils/
    ├── file.ts           # File utilities
    ├── media-convert.ts  # FFmpeg conversion
    ├── load-ffmpeg.ts    # FFmpeg loader
    ├── constant.ts       # Constants
    └── compress-filenames.ts
```

---

## Configuration Files

- `tsconfig.json`: Strict TypeScript, ES2017 target, jsx: react-jsx
- `tailwind.config.ts`: shadcn/ui with gray base color
- `eslint.config.mjs`: next/core-web-vitals + next/typescript
- `next.config.ts`: Next.js configuration
- `components.json`: shadcn/ui configuration (new-york style)

---

## Common Tasks

### Adding a new UI component

1. Use shadcn/cli to add: `npx shadcn@latest add [component-name]`
2. Component will be created in `src/components/ui/`
3. Import using `@/components/ui/[component-name]`

### Adding a new utility function

1. Create in appropriate `src/utils/` file or new file
2. Export with proper TypeScript types
3. Import using `@/utils/[filename]`

### Modifying styles

Edit `src/app/globals.css` for CSS variables, or use Tailwind classes directly in components.
