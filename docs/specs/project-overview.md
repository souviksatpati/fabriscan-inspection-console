# Maruti FabriScan — Comprehensive Project Audit & Technical Overview

> **Audit Date:** October 2026  
> **Target Document:** `docs/PROJECT_OVERVIEW.md`  
> **Source Codebase:** `Maruti FabriScan — Edge AOI Platform` (Frontend)  
> **Verification Status:** `npm install` passed (code 0), `npm run build` passed (code 0 in 13.95s, 0 errors, 0 warnings).

---

## 1. Overview

### 1.1 What the App Is
**Maruti FabriScan** is an industrial-grade edge Automated Optical Inspection (AOI) frontend platform tailored for automotive sheet metal stamping lines (specifically modeled on **Stamping Press Line 04 · Bay B**). It serves as the real-time operational interface connecting floor operators, quality supervisors, plant managers, and Tier-1 steel suppliers with edge AI inference hardware (NVIDIA Jetson AGX Orin 64GB).

### 1.2 Core Purpose
The platform's primary mandate is high-speed, deterministic visual quality verification of stamped vehicle body panels (e.g., Swift outer door skins, Brezza quarter panels, Jimny tailgate stampings). It inspects continuous conveyor throughput at ~30 FPS with sub-35ms inference latency, identifying micro-millimeter surface flaws (scratches, rolled-in mill scale, draw crazing, slag inclusions) and triggering 24V PLC pneumatic reject actuators to divert non-conforming panels into quarantine bins before they reach downstream Body-in-White (BIW) welding lines.

### 1.3 Main User Flows

```
[1. Unauthenticated Visitor]
      │
      ├── Explore Overview (/, /about)
      └── Login Page (/login) ──► Role-Based Quick Sign-In or Credential Form
                                    │
                                    ▼
[2. Authenticated Operator / Supervisor / Admin / Supplier QA]
      │
      ├── Floor Operator (QC_INSPECTOR)
      │     ├── Live Inspection Console (/app/live-inspection)
      │     │     ├── Monitor continuous video stream & laser scan sweep
      │     │     ├── View immediate GOOD / NOT GOOD decision banner
      │     │     ├── Inspect AI defect bounding boxes & segmentation masks
      │     │     ├── Inject simulated defects for diagnostic testing
      │     │     └── Acknowledge edge alerts & confirm quarantine clearing
      │     ├── Production Shift Telemetry (/app/production)
      │     └── Defect History Log (/app/defects)
      │
      ├── Quality Supervisor (QA_SUPERVISOR)
      │     ├── All Operator stations
      │     ├── Configuration Wizard (/app/configuration): Metrology & tolerance sliders
      │     └── Quality Audit Reports & Non-Conformance Records (/app/reports)
      │
      ├── Supplier QA Auditor (SUPPLIER_QA)
      │     ├── Automatic Landing at Reports (/app/reports)
      │     ├── Traceability logs, disposition tracking, and NCR sign-offs
      │     └── Read-only access to Production and Defect History
      │
      └── System Administrator (ADMIN)
            ├── All application routes
            ├── Camera Sensor Grid (/app/cameras): GigE / USB3 parameters & ping sync
            ├── Hardware Telemetry & Health (/app/system-health): Jetson GPU load & Profinet links
            └── Line Settings & Rejection Policies (/app/settings)
```

---

## 2. Tech Stack

All versions are extracted directly from [`package.json`](file:///e:/Maruti%20febriscan/package.json):

### 2.1 Dependencies
| Category | Package Name | Exact Version | Description |
| :--- | :--- | :--- | :--- |
| **Core UI Framework** | `react` | `^18.3.1` | React core library |
| **DOM Renderer** | `react-dom` | `^18.3.1` | React DOM binding |
| **Routing** | `react-router-dom` | `^6.28.0` | Client-side routing with `createBrowserRouter` |
| **Typography (Sans)** | `@fontsource-variable/geist` | `^5.1.0` | Modern industrial sans-serif variable font |
| **Typography (Mono)** | `@fontsource/jetbrains-mono` | `^5.1.0` | Monospace font for telemetry, coordinates, and codes |
| **UI Primitive: Dialog** | `@radix-ui/react-dialog` | `^1.1.4` | Accessible modal dialog primitive |
| **UI Primitive: Dropdown** | `@radix-ui/react-dropdown-menu` | `^2.1.4` | User menu and contextual action dropdowns |
| **UI Primitive: Progress** | `@radix-ui/react-progress` | `^1.1.1` | Staged pipeline progress indicators |
| **UI Primitive: Scroll** | `@radix-ui/react-scroll-area` | `^1.2.2` | Custom themed scroll containers |
| **UI Primitive: Select** | `@radix-ui/react-select` | `^2.1.4` | Accessible form select inputs |
| **UI Primitive: Separator**| `@radix-ui/react-separator` | `^1.1.1` | 1px structural dividers |
| **UI Primitive: Slider** | `@radix-ui/react-slider` | `^1.2.2` | Configuration threshold range sliders |
| **UI Primitive: Slot** | `@radix-ui/react-slot` | `^1.1.1` | Component composability primitive |
| **UI Primitive: Switch** | `@radix-ui/react-switch` | `^1.1.2` | Rejection policy toggles |
| **UI Primitive: Tabs** | `@radix-ui/react-tabs` | `^1.1.2` | Shift selectors and report category tabs |
| **UI Primitive: Tooltip** | `@radix-ui/react-tooltip` | `^1.1.6` | Accessible hover microcopy tooltips |
| **Styling Utilities** | `clsx` | `^2.1.1` | Conditional className concatenation |
| **Styling Utilities** | `tailwind-merge` | `^2.6.0` | Tailwind CSS class collision resolution |
| **Iconography** | `lucide-react` | `^0.469.0` | Line-based industrial iconography |
| **Charting Engine** | `recharts` | `^2.15.0` | Area, line, and bar charts for production & latency |
| **Animation Library** | `motion` | `^11.15.0` | Hardware-accelerated UI transitions |
| **Smooth Scroll** | `lenis` | `^1.1.18` | Physics-based smooth scroll controller |

### 2.2 DevDependencies
| Category | Package Name | Exact Version | Description |
| :--- | :--- | :--- | :--- |
| **Build Tool** | `vite` | `^6.0.0` | Next-generation frontend bundler and dev server |
| **Vite React Plugin** | `@vitejs/plugin-react` | `^4.3.4` | Fast Refresh and JSX transformation |
| **Tailwind Vite Plugin**| `@tailwindcss/vite` | `^4.0.0` | Native Tailwind CSS v4 compiler plugin |
| **CSS Framework** | `tailwindcss` | `^4.0.0` | Tailwind CSS v4 engine |
| **Type System** | `typescript` | `^5.7.2` | Static type checking and compiler |
| **TypeScript Types** | `@types/node` | `^22.10.5` | Node.js standard library type definitions |
| **TypeScript Types** | `@types/react` | `^18.3.18` | React type definitions |
| **TypeScript Types** | `@types/react-dom` | `^18.3.5` | React DOM type definitions |

### 2.3 NPM Scripts
- `npm run dev`: Starts local Vite development server at `http://localhost:3000` (configured with `usePolling: true` on Windows).
- `npm run build`: Executes `tsc && vite build` (typechecks without emitting, then compiles production bundle to `dist/`).
- `npm run preview`: Starts local HTTP server previewing production build output in `dist/`.
- `npm run lint`: Runs `tsc --noEmit` to validate TypeScript correctness across all modules.

---

## 3. Folder Structure & Complete File Tree

```
e:/Maruti febriscan/
├── index.html                                 # HTML entry point with meta tags, title, and fonts
├── package.json                               # Package manifest, dependencies, and npm scripts
├── package-lock.json                          # Lockfile with pinned transitive dependency graph
├── tsconfig.json                              # Main TypeScript compiler configuration (ESNext, React JSX)
├── tsconfig.node.json                         # Node-specific TypeScript config for vite.config.ts
├── vite.config.ts                             # Vite configuration with React, Tailwind v4, and poll watcher
├── README.md                                  # Original repository overview and quickstart guide
├── Maruti_FabriScan_Complete_Frontend_Development_Specification.md  # Comprehensive 3000-line specification
├── Maruti FabriScanuiux.md                    # UI/UX guidelines and operator interface principles
├── Maruti_FabriScan_SRS.md                    # Software Requirements Specification (SRS)
├── Maruti FabriScan Frontend Specification.pdf # Original specification PDF export
│
├── public/                                    # Static assets served at web root
│   ├── favicon.svg                            # Vector favicon glyph
│   ├── favicon-16x16.png                      # 16px PNG favicon
│   ├── favicon-32x32.png                      # 32px PNG favicon
│   ├── favicon.ico                            # Legacy ICO favicon
│   ├── apple-touch-icon.png                   # Apple touch icon
│   ├── images/                                # Production-ready 4:3 WebP/JPG slider assets
│   │   ├── parts-1.jpg & parts-1.webp         # Stamped body panels on assembly conveyor
│   │   ├── parts-2.jpg & parts-2.webp         # CNC sheet metal cutting & stamping gantry
│   │   ├── parts-3.jpg & parts-3.webp         # Precision machined powertrain assembly
│   │   └── parts-4.jpg & parts-4.webp         # Multi-axis chassis stamping & welding cell
│   └── image/                                 # Raw user-supplied source imagery (originals)
│       ├── parts-1.jpg.webp
│       ├── parts-2.jpg.avif
│       ├── parts-3.jpg.avif
│       ├── parts-4.jpg.avif
│       └── parts-5.jpg.jpg
│
├── screenshots/                               # Reference interface capture captures
│   ├── hero.png
│   ├── hero_mobile_360.png
│   ├── landing_section.png
│   ├── live_inspection.png
│   └── login.png
│
├── scripts/                                   # Automation & auxiliary developer utilities
│   └── capture_screenshots.cjs               # Playwright automated UI capture script
│
├── src/                                       # Core application source code
│   ├── App.tsx                                # Root React component providing RouterProvider
│   ├── main.tsx                               # Client DOM bootstrapping and font imports
│   ├── index.css                              # Tailwind v4 @theme, tokens, and industrial keyframes
│   │
│   ├── assets/                                # Bundled assets directory
│   │   └── images/                            # Project-level 4:3 images (parts-1 to parts-4)
│   │
│   ├── components/                            # Reusable React components
│   │   ├── common/                            # Shared interface primitives
│   │   │   ├── CornerBrackets.tsx             # Hairline optical corner bracket reticles
│   │   │   ├── CountUp.tsx                    # Animated numeric counter component
│   │   │   ├── EmptyState.tsx                 # Standardized empty buffer state card
│   │   │   ├── LoadingState.tsx               # Industrial subsystem loading spinner card
│   │   │   ├── Logo.tsx                       # Maruti FabriScan reticle logo with status pulse
│   │   │   ├── MetricCard.tsx                 # Standardized KPI card with sparkline & pacing trend
│   │   │   ├── Reveal.tsx                     # In-view reveal motion container
│   │   │   ├── SectionHeading.tsx             # Standardized category heading with description
│   │   │   ├── Sparkline.tsx                  # SVG inline trend sparkline component
│   │   │   └── StatusBadge.tsx                # Status indicator badge with semantic tint styling
│   │   │
│   │   ├── dashboard/                         # Inspection console control room components
│   │   │   ├── AlertsPanel.tsx                # Active system alert cards & acknowledgment controls
│   │   │   ├── CurrentInspectionPanel.tsx     # Current part telemetry, metadata, and defect summary
│   │   │   ├── DecisionBanner.tsx             # Unmistakable GOOD / NOT GOOD quality verdict banner
│   │   │   ├── InspectionViewport.tsx         # HTML5 Canvas optical feed renderer with HUD & overlays
│   │   │   ├── MetricsBar.tsx                 # Shift KPI summary bar (throughput, yield, PPM)
│   │   │   ├── OperatorActionBox.tsx          # Operator directive card with quarantine confirm button
│   │   │   ├── PipelineProgress.tsx           # 5-stage staged YOLOv8-Seg progress animation
│   │   │   ├── RecentInspections.tsx          # Live inspection buffer feed table (last 20 parts)
│   │   │   ├── StatusStrip.tsx                # Industrial hardware, camera, AI, and actuator strip
│   │   │   └── VerdictCard.tsx                # Large post-inspection verdict card with metric breakdown
│   │   │
│   │   ├── forms/                             # Form inputs and uploader components
│   │   │   └── PartUploader.tsx               # Drag-and-drop part uploader with 6 OEM test specimens
│   │   │
│   │   ├── landing/                           # Marketing website showcase components
│   │   │   ├── Hero.tsx                       # Homepage hero section with headline and 50/50 layout
│   │   │   ├── HeroSlider.tsx                 # Pure-CSS seamless infinite looping image slider
│   │   │   ├── HowItWorks.tsx                 # 6-step optical inspection pipeline breakdown
│   │   │   └── SurfaceQuality.tsx             # Stamped panel surface quality overview
│   │   │
│   │   ├── navigation/                        # Layout navigation headers, sidebars, and menus
│   │   │   ├── Footer.tsx                     # Minimal light industrial page footer
│   │   │   ├── Sidebar.tsx                    # Collapsible control room navigation sidebar
│   │   │   ├── TopBar.tsx                     # Control room header with line status & user badge
│   │   │   └── UserMenu.tsx                   # User profile popup with role switcher & logout
│   │   │
│   │   └── ui/                                # Headless Radix UI styled primitives
│   │       ├── badge.tsx                      # Semantic status badges
│   │       ├── button.tsx                     # Solid accent blue and white bordered buttons
│   │       ├── card.tsx                       # Flat bordered card container
│   │       ├── dialog.tsx                     # Modal dialog overlays
│   │       ├── dropdown-menu.tsx              # Dropdown menu components
│   │       ├── progress.tsx                   # Linear progress bar track
│   │       ├── scroll-area.tsx                # Styled scrollable viewport
│   │       ├── select.tsx                     # Form dropdown selects
│   │       ├── separator.tsx                  # 1px hairline divider lines
│   │       ├── sheet.tsx                      # Slide-out drawer sheet (used for defect details)
│   │       ├── slider.tsx                     # Interactive range slider
│   │       ├── switch.tsx                     # Toggle switch input
│   │       ├── table.tsx                      # Semantic table elements with #F5F7FA headers
│   │       ├── tabs.tsx                       # Tab triggers and container
│   │       └── tooltip.tsx                    # Hover microcopy tooltips
│   │
│   ├── data/mock/                             # Static datasets and factory state fixtures
│   │   ├── mockAlerts.ts                      # System alarms and optical notifications
│   │   ├── mockCameras.ts                     # 5 camera device specifications and GigE statuses
│   │   ├── mockDefects.ts                     # Defect taxonomy catalog (causes, thresholds, actions)
│   │   ├── mockInspections.ts                 # Initial inspection history records
│   │   ├── mockProduction.ts                  # Shift summary metrics, hourly points, and downtime
│   │   ├── mockReports.ts                     # QA audit reports and Non-Conformance Records (NCR)
│   │   └── mockUsers.ts                       # Pre-configured demo user accounts across all 4 roles
│   │
│   ├── hooks/                                 # Custom React lifecycle hooks
│   │   ├── useCountUp.ts                      # Numeric counter easing hook
│   │   ├── useDocumentTitle.ts                # Tab title updater per route
│   │   ├── useInView.ts                       # Viewport intersection detection hook
│   │   ├── useInspectionStream.ts             # Live stream coordinator connecting engine & WebSocket
│   │   ├── useReducedMotion.ts                # Media query detector for prefers-reduced-motion
│   │   └── useRole.ts                         # Role management and authentication hook
│   │
│   ├── layouts/                               # Layout wrappers
│   │   ├── AppLayout.tsx                      # Control room shell with TopBar, Sidebar, and Outlet
│   │   └── PublicLayout.tsx                   # Public website shell with TopNav, Content, and Footer
│   │
│   ├── lib/                                   # Core utilities and drawing libraries
│   │   ├── defectPainters.ts                  # Canvas algorithms drawing scratches, scales, crazing
│   │   ├── drawOverlay.ts                     # Canvas HUD, crosshairs, scan laser beam, and boxes
│   │   ├── format.ts                          # Unit formatters for area (mm²), confidence (%), time
│   │   ├── metalTexture.ts                    # Procedural brushed automotive sheet metal generator
│   │   ├── prng.ts                            # Seeded pseudo-random number generator (deterministic)
│   │   ├── roles.ts                           # Route permissions matrix and role definitions
│   │   ├── status.ts                          # SystemStatus configuration (colors, labels, icons)
│   │   └── utils.ts                           # cn() class utility combining clsx and tailwind-merge
│   │
│   ├── pages/                                 # Route page components
│   │   ├── app/                               # Authenticated control room views
│   │   │   ├── Configuration.tsx                # Metrology & tolerance configuration wizard
│   │   │   ├── Cameras.tsx                    # GigE/USB3 camera sensor grid monitoring
│   │   │   ├── CheckPart.tsx                  # Manual part verification workbench
│   │   │   ├── Defects.tsx                    # Defect history table and filterable log
│   │   │   ├── LiveInspection.tsx             # Primary real-time optical inspection console
│   │   │   ├── Production.tsx                 # Shift pacing, throughput, and downtime analytics
│   │   │   ├── Reports.tsx                    # Quality reports and Non-Conformance Records (NCR)
│   │   │   ├── Settings.tsx                   # Operational actuation rules & preferences
│   │   │   └── SystemHealth.tsx               # Jetson Orin telemetry & industrial bus health
│   │   │
│   │   └── public/                            # Public informational views
│   │       ├── About.tsx                      # Vision, leadership, and industrial benchmarks
│   │       ├── Home.tsx                       # Main landing page with all showcase sections
│   │       ├── Login.tsx                      # Operator authentication screen with role selector
│   │       └── NotFound.tsx                   # 404 error page with navigation fallback
│   │
│   ├── routes/                                # Routing definitions and guards
│   │   ├── RequireRole.tsx                    # Role-based route guard and unpermitted fallback
│   │   └── router.tsx                         # Client-side router tree with lazy-loaded routes
│   │
│   ├── services/mock/                         # Hardware & real-time simulation layer
│   │   ├── auth.ts                            # Mock authentication service with localStorage session
│   │   ├── inspectionEngine.ts                # Stepped automated inspection engine simulating parts
│   │   └── mockWebSocket.ts                   # In-memory pub/sub broker simulating industrial socket
│   │
│   └── types/                                 # Shared TypeScript type definitions
│       ├── alert.ts                           # SystemAlert interface and severity types
│       ├── camera.ts                          # CameraDevice interface and resolution types
│       ├── defect.ts                          # DefectType, DefectMeasurement, and catalog types
│       ├── events.ts                          # WebSocket event mapping types
│       ├── inspection.ts                      # InspectionRecord, LiveInspectionState, engine phases
│       ├── production.ts                      # ProductionShiftSummary and downtime event types
│       ├── report.ts                          # InspectionReportSummary and NonConformanceRecord
│       ├── status.ts                          # SystemStatus union and StatusMeta definitions
│       └── user.ts                            # UserProfile, UserRole, and session definitions
│
└── docs/                                      # Project documentation directory
    └── PROJECT_OVERVIEW.md                    # This complete audit and technical overview report
```

---

## 4. Routes and Pages

| Route Path | Component File | Allowed Roles | Description & Rendered Content |
| :--- | :--- | :--- | :--- |
| `/login` | [`src/pages/public/Login.tsx`](file:///e:/Maruti%20febriscan/src/pages/public/Login.tsx) | All (Public) | Centered white card with Operator ID & Password inputs, Sign In button, and demo accounts. |
| `/` | [`src/pages/public/Home.tsx`](file:///e:/Maruti%20febriscan/src/pages/public/Home.tsx) | All (Public) | Main overview page with in-page anchors: Hero, How It Works, Surface Quality. |
| `/about` | [`src/pages/public/About.tsx`](file:///e:/Maruti%20febriscan/src/pages/public/About.tsx) | All (Public) | Engineering mission, manufacturing vision, production benchmarks, and leadership team. |
| `/*` | [`src/pages/public/NotFound.tsx`](file:///e:/Maruti%20febriscan/src/pages/public/NotFound.tsx) | All (Public) | 404 error page with status badge, error details, and redirect links to home and live inspection. |
| `/app` | `AppIndexRedirect` in [`src/routes/RequireRole.tsx`](file:///e:/Maruti%20febriscan/src/routes/RequireRole.tsx) | Authenticated | Redirects `SUPPLIER_QA` to `/app/reports`, and all other authenticated roles to `/app/live-inspection`. |
| `/app/live-inspection` | [`src/pages/app/LiveInspection.tsx`](file:///e:/Maruti%20febriscan/src/pages/app/LiveInspection.tsx) | `QC_INSPECTOR`, `QA_SUPERVISOR`, `ADMIN` | Primary control room screen: live status strip, video viewport, GOOD / NOT GOOD decision banner, current part telemetry, batch controls, recent feed table, and alerts panel. |
| `/app/production` | [`src/pages/app/Production.tsx`](file:///e:/Maruti%20febriscan/src/pages/app/Production.tsx) | `QC_INSPECTOR`, `QA_SUPERVISOR`, `SUPPLIER_QA`, `ADMIN` | Shift production telemetry: date filters, KPI metric cards, defect distribution bar chart, and trend chart. |
| `/app/defects` | [`src/pages/app/Defects.tsx`](file:///e:/Maruti%20febriscan/src/pages/app/Defects.tsx) | `QC_INSPECTOR`, `QA_SUPERVISOR`, `SUPPLIER_QA`, `ADMIN` | Gallery and tabular log of segmented defect instances with search input, defect type filter, severity filter, and slide-out Sheet for mask inspection. |
| `/app/reports` | [`src/pages/app/Reports.tsx`](file:///e:/Maruti%20febriscan/src/pages/app/Reports.tsx) | `QA_SUPERVISOR`, `SUPPLIER_QA`, `ADMIN` | Quality audit reports and Non-Conformance Records (NCR): tabbed view between weekly quality audit summaries and NCR quarantine log with supervisor sign-offs. |
| `/app/configuration` | [`src/pages/app/Configuration.tsx`](file:///e:/Maruti%20febriscan/src/pages/app/Configuration.tsx) | `QA_SUPERVISOR`, `ADMIN` | Metrology wizard: 4-step stepper (Target alignment, Metrology matrix, Tolerance thresholds, Verification) with ceramic checkerboard visual, millimeter ratio slider, and area thresholds. |
| `/app/cameras` | [`src/pages/app/Cameras.tsx`](file:///e:/Maruti%20febriscan/src/pages/app/Cameras.tsx) | `ADMIN` | Camera sensor array: grid of 5 GigE / USB3 Vision cameras with resolution, IP, lens model, exposure, sensor temperature, packet loss, and ping/re-synchronize button. |
| `/app/system-health` | [`src/pages/app/SystemHealth.tsx`](file:///e:/Maruti%20febriscan/src/pages/app/SystemHealth.tsx) | `ADMIN` | NVIDIA Jetson AGX Orin 64GB telemetry: GPU load, TensorRT inference latency, SoC temperature, unified LPDDR5 RAM usage, latency distribution histogram, and Profinet PLC / GigE switch links. |
| `/app/settings` | [`src/pages/app/Settings.tsx`](file:///e:/Maruti%20febriscan/src/pages/app/Settings.tsx) | `ADMIN` | Operational preferences: pneumatic divert policy switches, 85dB audible alarm chime toggles, panel PC display density selector, and commit to flash button. |
| `/app/profile` | `Profile` | All | Operator station identity, credentials summary, and role privileges. |

---

## 5. Roles and Permissions

### 5.1 Roles Defined
Defined in [`src/types/user.ts`](file:///e:/Maruti%20febriscan/src/types/user.ts) and [`src/lib/roles.ts`](file:///e:/Maruti%20febriscan/src/lib/roles.ts):

| Role Identifier | Role Title | Station Assignment | Accessible Console Routes |
| :--- | :--- | :--- | :--- |
| `QC_INSPECTOR` | QC Line Inspector | Stamping Press 04 · Bay B | Live Inspection, Check Part, Production, Defect History |
| `QA_SUPERVISOR` | QA Supervisor | Press & BIW Quality Control | Live Inspection, Check Part, Production, Defect History, Reports, Configuration |
| `SUPPLIER_QA` | Supplier QA Auditor | Cold Rolled Coil Reception | Production, Defect History, Reports (Lands on Reports by default) |
| `ADMIN` | System Administrator | Central Automation & Edge Nodes | All 9 console routes |

### 5.2 Access Enforcement Mechanism
- Route checking is implemented via `hasRouteAccess(role, path)` in [`src/lib/roles.ts`](file:///e:/Maruti%20febriscan/src/lib/roles.ts#L81).
- Enforced at route level by [`src/routes/RequireRole.tsx`](file:///e:/Maruti%20febriscan/src/routes/RequireRole.tsx):
  1. Checks `isAuthenticated`: If user is null, redirects to `/login` preserving target location.
  2. Resolves root `/app`: Redirects `SUPPLIER_QA` to `/app/reports`, and others to `/app/live-inspection`.
  3. Checks `isAllowed`: If the role lacks permission, renders a high-visibility light red alert card stating *"Access Restricted by Operator Role"* and provides a direct button redirecting to their authorized station.
- Enforced at UI level in [`src/components/navigation/Sidebar.tsx`](file:///e:/Maruti%20febriscan/src/components/navigation/Sidebar.tsx#L48):
  - Filters `APP_ROUTES` with `getAllowedRoutes(role)` so unauthorized links do not appear in the operator's sidebar.

### 5.3 How Role Switching Works
- Implemented in [`src/services/mock/auth.ts`](file:///e:/Maruti%20febriscan/src/services/mock/auth.ts) and exposed via [`src/hooks/useRole.ts`](file:///e:/Maruti%20febriscan/src/hooks/useRole.ts).
- Sessions persist in `localStorage` under key `fabriscan_user_session`.
- Role switching methods:
  1. **Login Page Demo Cards**: Clicking any of the 4 role buttons (`QC Inspector`, `QA Supervisor`, `Supplier QA`, `Admin`) invokes `authService.login(key)`, setting the session and immediately routing to the app.
  2. **User Menu Switcher**: The avatar menu in [`src/components/navigation/UserMenu.tsx`](file:///e:/Maruti%20febriscan/src/components/navigation/UserMenu.tsx) has a *"Switch Profile"* submenu enabling live in-app switching between any of the 4 profiles without logging out.
  3. **Credential Form**: Submitting the login form with username/password matches user profiles.

---

## 6. Design System

### 6.1 Theme Mode
- **Light Industrial Theme** only.
- Dark mode toggle is intentionally removed. Root HTML in `index.html` uses `class=""` (no `dark` class).

### 6.2 Design Tokens & Values
Defined in [`src/index.css`](file:///e:/Maruti%20febriscan/src/index.css):

| Token Name | CSS Variable | Hex / Value | Purpose |
| :--- | :--- | :--- | :--- |
| **Page Background** | `--bg-page` | `#FFFFFF` | Core application and landing surface background |
| **Alternate Surface** | `--bg-panel` | `#F5F7FA` | Table headers, metadata boxes, sub-panels, status strips |
| **Borders & Dividers**| `--border` | `#D9DEE5` | 1px flat structural dividers and container borders |
| **Border Active** | `--border-active` | `#1D4ED8` | Focused inputs, active tabs, corner reticles |
| **Primary Text** | `--text-primary` | `#0F172A` | Headlines, primary data values, table text (15.6:1 contrast) |
| **Secondary Text** | `--text-secondary`| `#475569` | Explanatory paragraphs, card descriptions (6.96:1 contrast) |
| **Muted Text / Labels**| `--text-muted` | `#64748B` | Table column titles, telemetry labels, timestamps (4.54:1 AA) |
| **Primary Accent Blue**| `--accent-blue` | `#1D4ED8` | Solid buttons, active links, 2px focus rings |
| **Accepted / OK Text**| `--status-ok-text` | `#15803D` | Passed parts, verified status, online sensors |
| **Accepted Background**| `--status-ok-bg` | `#F0FDF4` | Tint background for Accepted badges and banners |
| **Accepted Border** | `--status-ok-border`| `#BBF7D0` | 1px border for Accepted badges |
| **Rejected / Critical Text**| `--status-rej-text`| `#B91C1C` | Out-of-spec defects, pneumatic diverters, error text |
| **Rejected Background**| `--status-rej-bg` | `#FEF2F2` | Tint background for Rejected badges and directive alerts |
| **Rejected Border** | `--status-rej-border`| `#FECACA` | 1px border for Rejected badges |
| **Warning / Major Text**| `--status-warn-text`| `#B45309` | Major defects, high temperature warnings |
| **Warning Background**| `--status-warn-bg`| `#FFFBEB` | Tint background for Warning badges |
| **Warning Border** | `--status-warn-border`| `#FDE68A` | 1px border for Warning badges |
| **Info / Moderate Text**| `--status-info-text`| `#1D4ED8` | Active stage progress, moderate defects |
| **Info Background** | `--status-info-bg`| `#EFF6FF` | Tint background for Info badges and active tab chips |
| **Info Border** | `--status-info-border`| `#BFDBFE` | 1px border for Info badges |

### 6.3 Typography
- **Headings & Body**: `@fontsource-variable/geist` (`Geist Variable`, sans-serif). Headings use `font-semibold` (`600`), body uses `font-normal` (`400`). Tight, legible line height (`1.15` to `1.5`).
- **Data & Telemetry Only**: `@fontsource/jetbrains-mono` (`JetBrains Mono`, monospace). Strictly reserved for Part IDs, coordinates, timestamps, measurements (`mm²`, `ms`, `FPS`), status codes, and table figures. Monospace is deliberately removed from navigation links and decorative labels.

### 6.4 Spacing & Sizing Scale
Strict linear scale based on 4px grid: `4, 8, 12, 16, 20, 24, 32, 48, 64, 96px` (`p-1` to `p-24`).

### 6.5 Border Radii
Strict industrial small radius: `rounded-[2px]`, `rounded-[3px]`, `rounded-[4px]`. No pill-shaped buttons or badges anywhere.

### 6.6 Shadows
Flat design philosophy: No drop shadows on cards, buttons, or panels. The only shadow permitted is subtle `0 1px 2px rgba(15,23,42,0.06)` on floating menus (DropdownMenu, Tooltip).

---

## 7. Components Inventory

### 7.1 Common Components (`src/components/common/`)
| Component | Key Props | Where Used |
| :--- | :--- | :--- |
| `CornerBrackets` | `size?: number`, `color?: string`, `className?: string` | `CurrentInspectionPanel`, `RecentInspections`, `AlertsPanel`, `OperatorActionBox`, `PipelineProgress`, `VerdictCard`, `InspectionViewport`, `PartUploader`, `Production`, `Defects`, `Reports`, `Configuration`, `Cameras`, `SystemHealth`, `Settings` |
| `EmptyState` | `title: string`, `description?: string`, `icon?: LucideIcon`, `action?: ReactNode` | Extensible fallback placeholder |
| `LoadingState` | `message?: string`, `subMessage?: string` | `router.tsx` (Suspense fallback) |
| `Logo` | `showStatus?: boolean`, `size?: 'sm' \| 'md' \| 'lg'`, `className?: string` | `PublicLayout`, `TopBar`, `Sidebar`, `Login`, `Footer` |
| `MetricCard` | `label: string`, `value: string \| number`, `subtitle?: string`, `sparklineData?: number[]`, `sparklineColor?: string`, `highlight?: boolean`, `trend?: { value: string; isPositive: boolean }` | `MetricsBar`, `Production`, `SystemHealth` |
| `Reveal` | `children: ReactNode`, `delay?: number`, `direction?: 'up' \| 'down' \| 'none'` | `Home`, `Platform`, `Technology`, `Inspection`, `About` |
| `SectionHeading` | `label?: string`, `title: string`, `description?: string`, `align?: 'left' \| 'center'`, `className?: string` | `Home`, `Platform`, `Technology`, `Inspection`, `About` |
| `Sparkline` | `data: number[]`, `color?: string`, `width?: number`, `height?: number` | `MetricCard` |
| `StatusBadge` | `status: SystemStatus`, `size?: 'sm' \| 'md'`, `showIcon?: boolean`, `className?: string` | `CurrentInspectionPanel`, `StatusStrip`, `RecentInspections`, `AlertsPanel`, `TopBar`, `Defects`, `Cameras`, `NotFound` |

### 7.2 Dashboard Components (`src/components/dashboard/`)
| Component | Key Props | Where Used |
| :--- | :--- | :--- |
| `AlertsPanel` | `alerts: SystemAlert[]`, `onAcknowledge?: (id: string) => void`, `className?: string` | `LiveInspection` |
| `CurrentInspectionPanel` | `inspection: InspectionRecord \| null`, `onForceDefect?: (type: DefectType) => void`, `onSelectDefect?: (id: string) => void`, `selectedDefectId?: string` | `LiveInspection` |
| `DecisionBanner` | `inspection: InspectionRecord \| null`, `className?: string` | `LiveInspection` |
| `InspectionViewport` | `inspection: InspectionRecord \| null`, `fps?: number`, `resolution?: string`, `cameraName?: string`, `isInspecting?: boolean`, `selectedDefectId?: string`, `onSelectDefect?: (id: string) => void`, `interactive?: boolean` | `LiveInspection`, `CheckPart`, `Defects` |
| `MetricsBar` | `metrics: ProductionShiftSummary`, `className?: string` | `LiveInspection` |
| `OperatorActionBox` | `required: boolean`, `actionText: string`, `className?: string`, `onClearAction?: () => void` | `CurrentInspectionPanel` |
| `PipelineProgress` | `progress: StagedInspectionProgress`, `className?: string` | `CheckPart` |
| `RecentInspections` | `inspections: InspectionRecord[]`, `onSelectInspection?: (rec: InspectionRecord) => void`, `activeId?: string` | `LiveInspection` |
| `StatusStrip` | `lineStatus`, `cameraStatus`, `aiStatus`, `actuatorStatus: SystemStatus`, `fps?: number`, `inferenceMs?: number` | `LiveInspection` |
| `VerdictCard` | `inspection: InspectionRecord`, `onReinspect: () => void`, `className?: string` | `CheckPart` |

### 7.3 Forms Components (`src/components/forms/`)
| Component | Key Props | Where Used |
| :--- | :--- | :--- |
| `PartUploader` | `onSelectSample: (sample: SamplePart) => void`, `onUploadFile: (file: File) => void`, `selectedPartId?: string`, `isProcessing: boolean` | `CheckPart` |

### 7.4 Landing Components (`src/components/landing/`)
| Component | Key Props | Where Used |
| :--- | :--- | :--- |
| `Hero` | None | `Home` |
| `HeroSlider` | None | `Hero` |
| `HowItWorks` | None | `Home` |
| `SurfaceQuality` | None | `Home` |

### 7.5 Navigation Components (`src/components/navigation/`)
| Component | Key Props | Where Used |
| :--- | :--- | :--- |
| `TopBar` | `onToggleSidebar?: () => void` | `AppLayout` |
| `Sidebar` | `collapsed?: boolean`, `onToggle?: () => void` | `AppLayout` |
| `UserMenu` | None | `TopBar`, `Sidebar` |
| `Footer` | None | `PublicLayout` |

### 7.6 UI Primitives (`src/components/ui/`)
- `Button`: `variant ('default'|'destructive'|'outline'|'secondary'|'ghost'|'link')`, `size ('default'|'sm'|'lg'|'icon')`, `asChild`
- `Badge`: `variant ('default'|'secondary'|'destructive'|'outline'|'success'|'warning'|'critical')`
- `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`
- `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`, `DropdownMenuSeparator`
- `Progress`, `ScrollArea`, `ScrollBar`, `Select`, `Separator`, `Sheet`, `Slider`, `Switch`, `Table`, `Tabs`, `Tooltip`

---

## 8. State Management

The application uses dedicated singleton services with custom React subscription hooks:

### 8.1 `AuthService` (`src/services/mock/auth.ts`)
- **State Fields**:
  - `currentUser: UserProfile | null` (loaded and persisted to `localStorage['fabriscan_user_session']`)
- **Actions**:
  - `getCurrentUser(): UserProfile | null`
  - `isAuthenticated(): boolean`
  - `login(userKey: 'qc'|'supervisor'|'supplier'|'admin'): UserProfile`
  - `loginUser(user: UserProfile): UserProfile`
  - `loginAsRole(role: UserRole): UserProfile`
  - `logout(): void`
  - `subscribe(listener): () => void`
- **Consumer Hook**: [`useRole()`](file:///e:/Maruti%20febriscan/src/hooks/useRole.ts)
- **Used By**: `TopBar`, `Sidebar`, `UserMenu`, `RequireRole`, `Login`, `Hero`, `PublicLayout`.

### 8.2 `InspectionEngineService` (`src/services/mock/inspectionEngine.ts`)
- **State Fields**:
  - `currentState: LiveInspectionState`:
    - `currentPhase: InspectionEnginePhase` (`'SCANNING' | 'ANALYZING' | 'DEFECT_DETECTED' | 'MEASURING' | 'DECISION' | 'ACCEPTED' | 'REJECTED'`)
    - `phaseProgressPct: number` (0 to 100)
    - `lineStatus: SystemStatus` (`'RUNNING' | 'STOPPED'`)
    - `cameraStatus: SystemStatus` (`'RUNNING' | 'WARNING' | 'DISCONNECTED'`)
    - `aiStatus: SystemStatus` (`'RUNNING' | 'DEGRADED'`)
    - `actuatorStatus: SystemStatus` (`'READY' | 'ACTUATED'`)
    - `currentPart: InspectionRecord`
    - `fps: number` (e.g., 30.2)
    - `inferenceTimeMs: number` (e.g., 28.4ms)
    - `resolution: string` (`'1280×720'`)
    - `cameraName: string` (`'CAM-01 · LINE 04'`)
    - `stationName: string` (`'Stamping Press 04 · Bay B'`)
    - `isInspecting: boolean`
  - `shiftMetrics: ProductionShiftSummary`:
    - `shiftId`, `shiftName`, `operatorOnDuty`, `stationId`, `startTime`
    - `targetCount`, `totalInspected`, `acceptedCount`, `rejectedCount`
    - `firstTimeRightPct`, `partsPerMillionDefective`, `avgInferenceTimeMs`, `avgCycleTimeMs`, `lineUptimePct`
  - `forcedDefectType: DefectType | null`
- **Actions**:
  - `getState(): LiveInspectionState`
  - `getMetrics(): ProductionShiftSummary`
  - `start(): void`
  - `pause(): void`
  - `toggle(): void`
  - `forceNextDefect(type: DefectType): void`
- **Consumer Hook**: [`useInspectionStream()`](file:///e:/Maruti%20febriscan/src/hooks/useInspectionStream.ts)
- **Used By**: `LiveInspection`, `CurrentInspectionPanel`, `StatusStrip`, `MetricsBar`, `RecentInspections`.

### 8.3 `MockWebSocketClient` (`src/services/mock/mockWebSocket.ts`)
- **Broker Details**: In-memory event bus implementing `subscribe(event, listener)` and `emit(event, data)`.
- **Supported Channels**:
  - `'state_change'`: Emits updated `LiveInspectionState`
  - `'inspection'`: Emits completed `InspectionRecord`
  - `'rejection'`: Emits pneumatic divert actuation event
  - `'metrics'`: Emits updated `ProductionShiftSummary`
  - `'alert'`: Emits `SystemAlert`
  - `'camera'`: Emits updated `CameraDevice`

---

## 9. Services and Mock Data

### 9.1 Services
1. **`authService`** ([`src/services/mock/auth.ts`](file:///e:/Maruti%20febriscan/src/services/mock/auth.ts)): Session persistence, role switching, user profiles.
2. **`inspectionEngine`** ([`src/services/mock/inspectionEngine.ts`](file:///e:/Maruti%20febriscan/src/services/mock/inspectionEngine.ts)): 6-phase stepped conveyor loop, random/injected defect generation, real-time FPS/latency jitter calculation, shift metrics aggregation.
3. **`mockWebSocket`** ([`src/services/mock/mockWebSocket.ts`](file:///e:/Maruti%20febriscan/src/services/mock/mockWebSocket.ts)): Event emission and listener dispatching.

### 9.2 Mock Data Files
- [`mockUsers.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockUsers.ts): 4 demo profiles (`qc`, `supervisor`, `supplier`, `admin`).
- [`mockInspections.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockInspections.ts): Initial 5 historical inspection records (`MF-2026-00120` to `MF-2026-00124`) with defect bounding contours.
- [`mockDefects.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockDefects.ts): Full metallurgical catalog for 6 defect types (root cause, threshold, severity, detection measurement, corrective action).
- [`mockProduction.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockProduction.ts): Current shift summary (1684 inspected, 26 rejected, 98.46% FTR, 15,439 PPM), hourly points (06:00 to 12:00), and 2 downtime events.
- [`mockReports.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockReports.ts): 3 quality audit reports and 3 non-conformance records (NCR).
- [`mockCameras.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockCameras.ts): 5 GigE / USB3 Vision cameras with IPs, frame rates, lens specs, exposure, and temperatures.
- [`mockAlerts.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockAlerts.ts): 4 system alerts spanning Camera, Actuator, Communication, and AI Model categories.

### 9.3 How to Trigger Simulated States

| Simulated State | Exact Trigger Method in the Code |
| :--- | :--- |
| **Inject Critical Defect (`Scratches`)** | Click `+ Scratches` in `CurrentInspectionPanel.tsx` (calls `inspectionEngine.forceNextDefect('Scratches')`). The next passing part is guaranteed to have a critical scratch defect with area > 12.5mm², triggering pneumatic reject actuation. |
| **Inject Mill Scale (`Rolled-in Scale`)** | Click `+ Rolled-in Scale` in `CurrentInspectionPanel.tsx`. |
| **Inject Crazing (`Crazing`)** | Click `+ Crazing` in `CurrentInspectionPanel.tsx`. |
| **Pause / Resume Conveyor Stream** | Click `Pause Stream` / `Resume` button in `LiveInspection.tsx` (calls `inspectionEngine.toggle()`). When paused, `lineStatus` becomes `STOPPED`, interval timer clears. |
| **Clear Quarantine Alarm** | Click `Confirm Bay Cleared` button in `OperatorActionBox.tsx`. |
| **Acknowledge Alert** | Click checkmark button on any alert card in `AlertsPanel.tsx` (calls `acknowledgeAlert(id)`). |
| **Camera Lost / Offline State** | Camera 05 (`CAM-05`) in `mockCameras.ts` has `status: 'DISCONNECTED'`, `packetLossPct: 100%`, `fps: 0`. Click `Ping / Re-synchronize Sensor` in `Cameras.tsx` to simulate reconnecting sequence (switches to `RUNNING` after 1200ms). |
| **Camera High Temp / Warning State** | Camera 04 (`CAM-04`) in `mockCameras.ts` has `status: 'WARNING'`, `temperatureC: 49.3°C`. Alert `ALT-1082` notifies operator of threshold approach. |
| **Low FPS / Latency Degradation** | `inspectionEngine.ts` naturally jitters FPS between 29.3 and 30.4 FPS and latency between 26.0 and 34.5 ms using `SeededPRNG`. |

---

## 10. Inspection Logic & Decision Gate

### 10.1 Defect Generation (`inspectionEngine.ts`)
- Part identification serials are deterministic via [`SeededPRNG`](file:///e:/Maruti%20febriscan/src/lib/prng.ts) (`PRT-SWIFT-LH-0924`, `BATCH-2026-10-A`).
- Defect probability: ~28% base occurrence rate per cycle (unless forced by operator).
- Defect spatial bounding box coordinates: normalized ratios (`x: 0.20-0.65`, `y: 0.25-0.65`, `width: 0.12-0.25`, `height: 0.10-0.20`).
- Confidence calculation: INT8 model probability modeled between `0.880` and `0.985` (`88.0%` to `98.5%`).

### 10.2 Defect Types & Rejection Thresholds
Defined in [`src/data/mock/mockDefects.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockDefects.ts):

| Defect Type | Rejection Threshold | Typical Severity | Auto-Rejection Action |
| :--- | :--- | :--- | :--- |
| **Scratches** | Length > 12.0 mm or Area > 10.0 mm² | `CRITICAL` | Part REJECTED immediately; pneumatic diverter fired |
| **Rolled-in Scale** | Area > 8.0 mm² or aggregate count > 2 | `MAJOR` | Part REJECTED if exceeding threshold |
| **Crazing** | Area > 5.0 mm² in critical draw radius | `CRITICAL` | Part REJECTED to prevent tensile split in stamping |
| **Inclusion** | Core diameter > 1.2 mm or Area > 4.0 mm² | `MAJOR` | Part REJECTED when exceeding tolerance |
| **Patches** | Area > 25.0 mm² or luminance delta > 18% | `MODERATE` | Flagged & logged for die maintenance; part ACCEPTED |
| **Pitted Surface** | Cluster density > 5 pits/cm² or depth > 15µm | `MODERATE` | Flagged & logged; part ACCEPTED if cosmetic |

### 10.3 Decision Gate Evaluation
In [`src/services/mock/inspectionEngine.ts`](file:///e:/Maruti%20febriscan/src/services/mock/inspectionEngine.ts#L227):
```typescript
const isRejected = defects.some((d) => d.decision === 'REJECT');
```
1. If **any defect** on the component has `decision === 'REJECT'`:
   - Final Quality Verdict: **`NOT GOOD (REJECT)`**
   - System Status: `REJECTED`
   - Actuator Status: `ACTUATED` (solenoid pneumatic ram diverts part)
   - Shift Metrics: `rejectedCount` incremented by 1; `firstTimeRightPct` and `partsPerMillionDefective` updated.
   - Operator Directive: `Remove rejected door panel from Quarantine Bin B-04`
   - Event Broadcast: Emits `rejection` event to `mockWebSocket`.
2. If **no defect** or all defects are within tolerance (`ACCEPT`):
   - Final Quality Verdict: **`GOOD (ACCEPT)`**
   - System Status: `ACCEPTED`
   - Actuator Status: `READY`
   - Shift Metrics: `acceptedCount` incremented by 1.
   - Operator Directive: `No action required: Part routed downstream`

---

## 11. Text Content Audit (User-Visible Copy)

A representative index of user-visible headlines, status text, and buttons across primary files:

| File Path | Line | Text Content / Copy | Element Type |
| :--- | :--- | :--- | :--- |
| `src/components/landing/Hero.tsx` | 17 | `Surface defect inspection for stamped automotive parts.` | `h1` Headline |
| `src/components/landing/Hero.tsx` | 21 | `Camera-based inspection that measures each defect and signals accept or reject.` | Paragraph |
| `src/components/landing/Hero.tsx` | 33 | `Open inspection console` | Button text |
| `src/components/landing/HeroSlider.tsx`| 37 | `Stamped automotive sheet metal body panels on factory assembly conveyor line` | Image Alt text |
| `src/components/landing/HeroSlider.tsx`| 44 | `Automated industrial CNC sheet metal cutting and stamping inspection gantry` | Image Alt text |
| `src/components/landing/HeroSlider.tsx`| 51 | `High-precision machined and cast automotive powertrain assembly` | Image Alt text |
| `src/components/landing/HeroSlider.tsx`| 58 | `Robotic multi-axis chassis stamping and spot welding production cell` | Image Alt text |
| `src/pages/public/Login.tsx` | 126 | `Operator Sign In` | Card Title |
| `src/pages/public/Login.tsx` | 129 | `Select your factory authorization profile to access edge station controls.` | Card Description |
| `src/pages/public/Login.tsx` | 137 | `Operator Identifier` | Field Label |
| `src/pages/public/Login.tsx` | 148 | `Access Key / Password` | Field Label |
| `src/pages/public/Login.tsx` | 160 | `Sign in to Station Console` | Button text |
| `src/components/dashboard/DecisionBanner.tsx` | 27 | `PART VERIFIED: GOOD (ACCEPT)` | Verdict Headline |
| `src/components/dashboard/DecisionBanner.tsx` | 28 | `PART REJECTED: NOT GOOD (DEFECT)` | Verdict Headline |
| `src/components/dashboard/CurrentInspectionPanel.tsx` | 46 | `CURRENT PART TELEMETRY` | Telemetry Label |
| `src/components/dashboard/CurrentInspectionPanel.tsx` | 80 | `AI DEFECT SEGMENTATION` | Section Title |
| `src/components/dashboard/CurrentInspectionPanel.tsx` | 122 | `ZERO SURFACE DEFECTS IDENTIFIED` | Status text |
| `src/components/dashboard/CurrentInspectionPanel.tsx` | 137 | `SIMULATE DEFECT TRIGGER` | Section Title |
| `src/components/dashboard/OperatorActionBox.tsx` | 46 | `OPERATOR DIRECTIVE` | Directive Title |
| `src/components/dashboard/OperatorActionBox.tsx` | 50 | `ACTION REQUIRED` | Badge text |
| `src/components/dashboard/OperatorActionBox.tsx` | 67 | `Confirm Bay Cleared` | Button text |
| `src/components/dashboard/StatusStrip.tsx` | 36 | `LINE:` | Label |
| `src/components/dashboard/StatusStrip.tsx` | 42 | `CAMERA:` | Label |
| `src/components/dashboard/StatusStrip.tsx` | 48 | `AI ENGINE:` | Label |
| `src/components/dashboard/StatusStrip.tsx` | 54 | `ACTUATOR:` | Label |
| `src/pages/app/Production.tsx` | 32 | `SHIFT PRODUCTION & QUALITY METRICS` | Section Header |
| `src/pages/app/Production.tsx` | 35 | `Stamping Press Line 04` | `h1` Headline |
| `src/pages/app/Production.tsx` | 105 | `Hourly Inspection Output & Rejection Trend` | Chart Title |
| `src/pages/app/Defects.tsx` | 54 | `DEFECT CLASSIFICATION & ANNOTATION LOG` | Section Header |
| `src/pages/app/Defects.tsx` | 60 | `Defect History` | `h1` Headline |
| `src/pages/app/Reports.tsx` | 36 | `QUALITY AUDIT & TRACEABILITY ARCHIVE` | Section Header |
| `src/pages/app/Reports.tsx` | 42 | `Inspection Reports & NCRs` | `h1` Headline |
| `src/pages/app/Configuration.tsx` | 28 | `METROLOGY & SENSOR METROLOGY WIZARD` | Section Header |
| `src/pages/app/Configuration.tsx` | 34 | `Optical Alignment` | `h1` Headline |
| `src/pages/app/Cameras.tsx` | 41 | `GIGE & USB3 VISION SENSOR ARRAY` | Section Header |
| `src/pages/app/Cameras.tsx` | 47 | `Camera Sensor Grid` | `h1` Headline |
| `src/pages/app/SystemHealth.tsx` | 32 | `EDGE HARDWARE & NEURAL ACCELERATOR HEALTH` | Section Header |
| `src/pages/app/SystemHealth.tsx` | 38 | `System Health Diagnostics` | `h1` Headline |
| `src/pages/app/Settings.tsx` | 27 | `LINE OPERATIONAL PREFERENCES` | Section Header |
| `src/pages/app/Settings.tsx` | 30 | `Line Settings & Rules` | `h1` Headline |
| `src/routes/RequireRole.tsx` | 41 | `Access Restricted by Operator Role` | Alert Title |

---

## 12. Assets Inventory

### 12.1 Images
| File Path | Type & Dimensions | Purpose & Where Used |
| :--- | :--- | :--- |
| `public/images/parts-1.jpg` & `.webp` | JPEG & WebP (1000×750, 4:3) | Hero Slider Slide 1: Stamped automotive car body panels on assembly conveyor |
| `public/images/parts-2.jpg` & `.webp` | JPEG & WebP (1000×750, 4:3) | Hero Slider Slide 2: CNC sheet metal cutting and stamping inspection gantry |
| `public/images/parts-3.jpg` & `.webp` | JPEG & WebP (1000×750, 4:3) | Hero Slider Slide 3: Precision machined and cast powertrain assembly |
| `public/images/parts-4.jpg` & `.webp` | JPEG & WebP (1000×750, 4:3) | Hero Slider Slide 4: Robotic multi-axis stamping and spot welding cell |
| `src/assets/images/parts-1` to `parts-4` | Duplicate mirror | Bundled asset backup of the above images |
| `public/image/parts-1` to `parts-5` | Raw sources (AVIF, WebP, JPG)| Original user-supplied high-resolution images |
| `public/favicon.svg` | SVG | Browser tab icon |
| `public/favicon-16x16.png`, `32x32.png` | PNG | Raster favicons |
| `public/apple-touch-icon.png` | PNG (180×180) | Apple mobile device bookmark icon |

### 12.2 Fonts
| Font Family | Package & Origin | Weights Used | Purpose |
| :--- | :--- | :--- | :--- |
| `Geist Variable` | `@fontsource-variable/geist` | `400` (normal), `600` (semibold), `700` (bold) | All headings, body copy, navigation labels, and UI buttons |
| `JetBrains Mono` | `@fontsource/jetbrains-mono` | `400` (regular), `500` (medium), `700` (bold) | Technical figures, coordinates, serials, timestamps, and codes |

*(No external video files or external stock CDN assets are linked. All images and fonts are local and self-hosted).*

---

## 13. Gaps and Discrepancies vs. Spec

A comparative analysis against [`Maruti_FabriScan_Complete_Frontend_Development_Specification.md`](file:///e:/Maruti%20febriscan/Maruti_FabriScan_Complete_Frontend_Development_Specification.md):

| Spec Section / Topic | Specification Expectation | Current Codebase Implementation | Status & Impact |
| :--- | :--- | :--- | :--- |
| **Theme Aesthetic** | Section 8 suggests dark control room styling (`#05070B`). | Restyled per user request to clean, trustworthy light industrial theme (`#FFFFFF` surface, `#F5F7FA` panels, `#D9DEE5` borders). | **Intentional User Design Choice**: Fully consistent across all pages and passes WCAG AA contrast. |
| **Live WebSocket** | Section 20 specifies real `ws://` connection to FastAPI backend. | Implemented via `MockWebSocketClient` in-memory event bus with pub/sub event pattern. | **Simulated for Frontend**: Drop-in ready for backend integration by replacing `mockWebSocket` with native `WebSocket`. |
| **Edge AI Runtime** | Section 4 mentions ONNX Runtime Web / WASM in-browser inference. | Local IndexedDB persistence and client camera viewport with Canvas overlay. | **Simulated for Frontend**: Demonstrates real-time camera streaming without requiring 50MB ONNX models. |
| **Camera Feed** | Section 10 mentions WebRTC/RTSP real camera streams. | Simulated using procedural automotive sheet metal texture, laser scan lines, and Canvas overlay. | **Simulated for Frontend**: Fully interactive and GPU-friendly with zero external dependencies. |
| **PDF/CSV Report Generation** | Section 25 specifies downloadable server-generated PDF audits. | Client generates dynamic in-memory text/JSON blob download. | **Functional Simulation**: Triggers browser download without requiring external backend PDF renderer. |
| **Unused Files** | Clean repository audit | `src/components/landing/HeroScene.tsx` was cleanly removed. `src/assets/images/parts-5.jpg` is a spare asset from the user's initial 5-image upload. | **Clean**: 0 TypeScript errors, 0 lint warnings, 0 broken imports. |
| **TODO / FIXME Stubs** | Source code scan | Grep search for `TODO` and `FIXME` returned 0 matches across the entire codebase. | **Clean**: Production-grade code. |

---

## 14. Where to Change Things

For future maintenance, customize specific areas by editing the designated files:

### 14.1 Branding & Logo
- **Logo Symbol & Brand Name**: Edit [`src/components/common/Logo.tsx`](file:///e:/Maruti%20febriscan/src/components/common/Logo.tsx) (controls reticle SVG, "MARUTI" accent text, and "FABRISCAN" title).
- **Website Title & Meta Description**: Edit [`index.html`](file:///e:/Maruti%20febriscan/index.html#L6-L10).
- **Favicon Glyphs**: Replace files in [`public/favicon.svg`](file:///e:/Maruti%20febriscan/public/favicon.svg) and [`public/favicon-32x32.png`](file:///e:/Maruti%20febriscan/public/favicon-32x32.png).

### 14.2 Design Tokens & Colors
- **Palette Tokens (Background, Border, Text, Accents)**: Edit the `:root` and `@theme` definitions in [`src/index.css`](file:///e:/Maruti%20febriscan/src/index.css#L1-L85).
- **Status Colors (OK, Rejected, Warning, Info)**: Edit status variables in [`src/index.css`](file:///e:/Maruti%20febriscan/src/index.css#L44-L65) and metadata definitions in [`src/lib/status.ts`](file:///e:/Maruti%20febriscan/src/lib/status.ts#L3-L100).

### 14.3 Hero Slider Images & Motion
- **Slider Images & Alt Descriptions**: Edit the `HERO_SLIDES` array in [`src/components/landing/HeroSlider.tsx`](file:///e:/Maruti%20febriscan/src/components/landing/HeroSlider.tsx#L25-L60).
- **Flipping Slider Scroll Direction**: Change `SLIDER_DIRECTION` constant from `'normal'` to `'reverse'` in [`src/components/landing/HeroSlider.tsx`](file:///e:/Maruti%20febriscan/src/components/landing/HeroSlider.tsx#L8).
- **Slider Speed**: Change `SLIDER_DURATION` constant in [`src/components/landing/HeroSlider.tsx`](file:///e:/Maruti%20febriscan/src/components/landing/HeroSlider.tsx#L14).

### 14.4 User Copy & Headlines
- **Homepage Headlines & Paragraphs**: Edit [`src/components/landing/Hero.tsx`](file:///e:/Maruti%20febriscan/src/components/landing/Hero.tsx), [`HowItWorks.tsx`](file:///e:/Maruti%20febriscan/src/components/landing/HowItWorks.tsx), [`SurfaceQuality.tsx`](file:///e:/Maruti%20febriscan/src/components/landing/SurfaceQuality.tsx).
- **Login Screen Copy**: Edit [`src/pages/public/Login.tsx`](file:///e:/Maruti%20febriscan/src/pages/public/Login.tsx).
- **Station Headings**: Edit each page in [`src/pages/app/`](file:///e:/Maruti%20febriscan/src/pages/app/).

### 14.5 Roles and Permissions Matrix
- **Route Permissions**: Edit `APP_ROUTES` array in [`src/lib/roles.ts`](file:///e:/Maruti%20febriscan/src/lib/roles.ts#L12-L79).
- **Role Display Names & Subtitles**: Edit `ROLE_LABELS` in [`src/lib/roles.ts`](file:///e:/Maruti%20febriscan/src/lib/roles.ts#L91-L112).
- **Default Users & Credentials**: Edit `MOCK_USERS` in [`src/data/mock/mockUsers.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockUsers.ts#L3-L48).

### 14.6 Mock Data, Defect Rules & Simulation
- **Defect Types, Root Causes & Thresholds**: Edit `DEFECT_CATALOG` in [`src/data/mock/mockDefects.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockDefects.ts#L3-L118).
- **Shift Production Counts & Downtime**: Edit `CURRENT_SHIFT_SUMMARY` and `MOCK_DOWNTIME_EVENTS` in [`src/data/mock/mockProduction.ts`](file:///e:/Maruti%20febriscan/src/data/mock/mockProduction.ts).
- **Inspection Engine Speeds & Jitter**: Edit timings in [`src/services/mock/inspectionEngine.ts`](file:///e:/Maruti%20febriscan/src/services/mock/inspectionEngine.ts).

### 14.7 Routes & Navigation
- **Adding or Renaming Pages**: Edit router definitions in [`src/routes/router.tsx`](file:///e:/Maruti%20febriscan/src/routes/router.tsx#L34-L77) and navigation items in [`src/components/navigation/Sidebar.tsx`](file:///e:/Maruti%20febriscan/src/components/navigation/Sidebar.tsx).
- **Public Navigation Links**: Edit `NAV_LINKS` in [`src/layouts/PublicLayout.tsx`](file:///e:/Maruti%20febriscan/src/layouts/PublicLayout.tsx#L14-L20).

---

## 15. Audit Summary & Build Verification

- **Package Installation**: `npm install` executed successfully with code `0`.
- **Bundle Compilation**: `npm run build` (`tsc && vite build`) executed successfully with code `0`.
  - 2,704 modules transformed.
  - Zero TypeScript compiler diagnostics (`tsc --noEmit` clean).
  - Production bundle generated cleanly in `dist/`.
- **Specification Check**: Verified that `docs/FABRISCAN_SPEC.md` does not exist as a standalone file; the root specification [`Maruti_FabriScan_Complete_Frontend_Development_Specification.md`](file:///e:/Maruti%20febriscan/Maruti_FabriScan_Complete_Frontend_Development_Specification.md) was thoroughly audited and reconciled against the active codebase.
