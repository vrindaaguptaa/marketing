# Marketplace Frontend 

A **production-ready shadcn/ui React SPA template** built with **Vite,
TypeScript, TailwindCSS 4, and Vercel deployment**.

This template is designed as a **pure frontend marketplace starter**.\
No backend is included by default --- you can add API endpoints only
when needed (for private keys, databases, or secure operations).

------------------------------------------------------------------------

# Tech Stack

## Package Manager

-   npm / pnpm

## Frontend

-   React 18
-   React Router 6 (SPA Routing)
-   TypeScript
-   Vite 7
-   TailwindCSS 4
-   shadcn/ui

## UI System

-   shadcn/ui
-   Radix UI
-   TailwindCSS
-   class-variance-authority
-   clsx
-   tailwind-merge
-   Lucide React Icons

## Testing

-   Vitest

## Deployment

-   Vercel (Global CDN + Edge Network)

------------------------------------------------------------------------

# Project Structure

    src/
    │
    ├── pages/                # Route components (index.tsx = homepage)
    │   └── index.tsx
    │
    ├── libs/                 # Custom utilities
    ├── hooks/                # React hooks
    │
    ├── components/           # UI components
    │   └── ui/               # shadcn/ui component library
    │
    ├── App.tsx               # SPA routing configuration
    ├── main.tsx              # React application entry
    └── global.css            # TailwindCSS + theme configuration

    Root Files
    ├── package.json
    ├── tsconfig.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── README.md

------------------------------------------------------------------------

# Key Features

## SPA Routing System

Powered by **React Router 6**.

-   `src/pages/index.tsx` → Homepage
-   Routes defined in `src/App.tsx`
-   Simple scalable page structure

Example:

``` tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Add custom routes above catch-all */}
      </Routes>
    </BrowserRouter>
  );
}
```

------------------------------------------------------------------------

# Styling System

### Primary Styling

-   TailwindCSS 4 utility classes
-   shadcn/ui components

### Theme Configuration

Defined inside:

    src/global.css

Example:

``` css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.7 0.2 260);
  --color-secondary: oklch(0.6 0.15 220);
}
```

### Utility Function

Use the `cn()` helper for conditional styling.

``` tsx
import { cn } from "@/libs/utils";

className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className
)}
```

------------------------------------------------------------------------

# Path Aliases

Configured in `vite.config.ts` and `tsconfig.json`.

``` ts
resolve: {
  alias: {
    "@/": "./src/",
    "@shared/": "./shared/"
  }
}
```

------------------------------------------------------------------------

# Development Commands

Start development server:

    npm run dev

Build for production:

    npm run build

Preview production build:

    npm run preview

TypeScript validation:

    npm run typecheck

Run tests:

    npm run test

------------------------------------------------------------------------

# Adding Features

## Create a New Page

1.  Create a new file:

```{=html}
<!-- -->
```
    src/pages/MyPage.tsx

2.  Add route in `src/App.tsx`

``` tsx
<Route path="/my-page" element={<MyPage />} />
```

------------------------------------------------------------------------

# Adding shadcn/ui Components

Install new components:

    npx shadcn-ui@latest add button
    npx shadcn-ui@latest add dialog

Components will be added to:

    src/components/ui/

------------------------------------------------------------------------

# Theme Customization

Edit:

    src/global.css

Example:

``` css
@theme {
  --color-primary: oklch(0.7 0.2 260);
  --color-secondary: oklch(0.6 0.15 220);
}
```

------------------------------------------------------------------------

# Vercel Deployment

Deployment is automatic on **git push**.

    git add .
    git commit -m "Deploy shadcn/ui marketplace"
    git push origin main

### Vercel Features

-   Global CDN (Edge Network)
-   Automatic HTTPS
-   Custom domain support
-   Preview deployments for PRs
-   Zero-config React + Vite detection

Live URL Example:

    https://your-marketplace.vercel.app

------------------------------------------------------------------------

# Production Build

Create production build:

    npm run build

Preview production build locally:

    npm run preview

Output:

    dist/

A fully optimized **static SPA ready for Vercel, Netlify, or any CDN**.

------------------------------------------------------------------------

# Architecture Notes

-   Pure **Vite + React SPA**
-   **TypeScript everywhere**
-   **Hot Module Reloading (HMR)**
-   shadcn/ui component architecture
-   TailwindCSS 4 with **OKLCH color system**
-   Optimized Vercel deployment
-   Mobile-first responsive design

------------------------------------------------------------------------

# Quick Start

Clone the project:

    git clone <repository-url>
    cd Current_frontend

Install dependencies:

    npm install

Start development server:

    npm run dev

Open:

    http://localhost:5173

Your **shadcn/ui marketplace frontend** is now running locally.

------------------------------------------------------------------------

# License

This project is intended as a **starter template for marketplace
frontends**. Customize and extend it as needed for your production
projects.
