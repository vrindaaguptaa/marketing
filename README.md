
**Fusion Marketplace Frontend**
A production-ready shadcn/ui React SPA template with Vite, TypeScript, TailwindCSS 4, and Vercel deployment.

No backend included - pure frontend marketplace template. Add API endpoints only when needed (private keys, DB operations).

Tech Stack
Package Manager: npm/pnpm

Frontend: React 18 + React Router 6 (SPA) + TypeScript + Vite 7 + TailwindCSS 4 + shadcn/ui

UI: shadcn/ui + Radix UI + TailwindCSS + class-variance-authority + clsx + tailwind-merge + Lucide React icons

Testing: Vitest

Deployment: Vercel (global CDN, Edge Network)

**Project Structure**
text
src/                      # React SPA frontend (Vercel-ready)
├── pages/                # Route components (index.tsx = home)
│   └── index.tsx         # Homepage
├── libs/                 # Custom utilities/hooks
├── hooks/                # React hooks
├── components/           # shadcn/ui + custom components
│   └── ui/               # Pre-built shadcn/ui component library
├── App.tsx               # App entry point + SPA routing
├── main.tsx              # React entry point
└── global.css            # TailwindCSS 4 + shadcn/ui theme
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
Key Features
SPA Routing System
Powered by React Router 6:

src/pages/index.tsx = Homepage

Routes defined in src/App.tsx

File-based routing structure

tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

<Routes>
  <Route path="/" element={<Index />} />
  {/* Add custom routes above catch-all */}
  <Route path="*" element={<NotFound />} />
</Routes>
Styling System
Primary: TailwindCSS 4 utility classes + shadcn/ui

Theme: Custom design tokens in src/global.css

UI Components: Full shadcn/ui library (src/components/ui/)

Utility: cn() helper (clsx + tailwind-merge)

tsx
import { cn } from "@/libs/utils";

className={cn(
  "base-classes",
  { "conditional-class": condition },
  props.className
)}
Path Aliases
ts
// vite.config.ts + tsconfig.json
resolve: {
  alias: {
    "@/*": "./src/*",      // React components
    "@shared/*": "./shared/*"  // Shared types
  }
}
🚀 **Development Commands**
bash
npm run dev       # Vite dev server (localhost:5173)
npm run build     # Production build → dist/
npm run preview   # Preview production build
npm run typecheck # TypeScript validation
npm run test      # Vitest tests
Adding Features
New Page Route
Create src/pages/MyPage.tsx

Add route in src/App.tsx:

tsx
<Route path="/my-page" element={<MyPage />} />
Custom shadcn/ui Components
bash
npx shadcn-ui@latest add button dialog
# Adds to src/components/ui/
Theme Customization
Edit src/global.css:

css
@import "tailwindcss";

@theme {
  --color-primary: oklch(0.7 0.2 260);
  --color-secondary: oklch(0.6 0.15 220);
  /* Add custom colors */
}
🚀 Vercel Deployment
Automatic deployment on git push:

bash
git add .
git commit -m "Deploy shadcn/ui marketplace"
git push origin main
Vercel Features:

✅ Global CDN (Edge Network)

✅ Automatic HTTPS

✅ Custom domain support

✅ Preview deployments (every PR)

✅ Zero-config Vite + React detection

Live URL: https://your-marketplace.vercel.app

Production Build
bash
npm run build     # Creates dist/ folder
npm run preview   # Test production build
Output: Static SPA in dist/ - perfect for Vercel/Netlify/CDN

Architecture Notes
Pure Vite + React SPA (no server bundling)

TypeScript throughout

Full HMR for rapid development

shadcn/ui component system

TailwindCSS 4 with OKLCH colors

Vercel-optimized production builds

Mobile-first responsive design

Quick Start
bash
git clone <your-repo>
cd Current_frontend
npm install
npm run dev
# Open http://localhost:5173
Your shadcn/ui marketplace is LIVE on Vercel! 🎉🚀
