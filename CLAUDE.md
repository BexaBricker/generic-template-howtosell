# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Essential Commands

- **Development**: `npm run dev` - Start Vite development server
- **Build**: `npm run build` - Production build
- **Build (dev mode)**: `npm run build:dev` - Development build
- **Lint**: `npm run lint` - Run ESLint
- **Preview**: `npm run preview` - Preview production build

## Architecture Overview

This is a React + TypeScript single-page application built with Vite, using shadcn/ui component library and Tailwind CSS for styling.

### Key Technologies
- **Vite** - Build tool and dev server
- **React 18** with React Router for navigation
- **TypeScript** - Type safety throughout
- **shadcn/ui** - Component library based on Radix UI primitives
- **Tailwind CSS** - Utility-first CSS framework
- **React Query (TanStack Query)** - Data fetching and caching
- **React Hook Form + Zod** - Form handling and validation

### Project Structure

```
src/
├── components/        # Application components
│   ├── ui/           # shadcn/ui components (pre-configured)
│   └── *.tsx         # Page section components
├── pages/            # Route components
├── hooks/            # Custom React hooks
├── lib/              # Utilities (mainly utils.ts for cn() helper)
└── App.tsx           # Main app with routing setup
```

### Key Patterns

1. **Component Organization**: Section components (Header, Footer, etc.) are composed in the Index page
2. **Styling**: Uses Tailwind CSS classes with `cn()` utility from `lib/utils.ts` for conditional classes
3. **Routing**: React Router with catch-all route for 404 handling
4. **State Management**: React Query for server state, local state with React hooks
5. **UI Components**: All UI primitives are from shadcn/ui in `components/ui/`

### Lovable Platform Integration

This project was created with Lovable.dev and includes:
- Automatic deployment via Lovable platform
- Git integration for version control
- Support for custom domains through Lovable settings