# Maruti FabriScan: Edge Automated Optical Inspection (AOI) Platform

**Maruti FabriScan** is an industrial edge Automated Optical Inspection (AOI) platform built for automotive press shops, stamping lines, Body-in-White (BIW) robotic cells, and precision spare-part manufacturing.

It detects, measures, and classifies surface defects across cold-rolled automotive sheet metal blanks in real-time, executing deterministic binary quality decisions: **GOOD (Accept)** or **NOT GOOD (Reject)** with physical pneumatic diverter actuation.

---

## Experiences

The application delivers two interconnected experiences:
1. **Public Product Website**: A light industrial showcase featuring technical grid aesthetics, hero inspection slider, 6-stage pipeline rail (`How it works`), and stamped automotive panel surface quality overview.
2. **Inspection Application**: A mission-critical industrial control-room operator interface designed for touch-screen panel PCs and desktop stations, featuring:
   - **Live Inspection**: Continuous edge optical stream with real-time video and canvas overlay, sub-millimeter dimension callouts, unmistakable ACCEPTED / REJECTED decision banner, active batch telemetry, and on-demand report exports.
   - **Production Analytics**: Shift throughput pacing, First-Time-Right (FTR) yield tracking, Parts-Per-Million (PPM) defect densities, downtime intervention logs, and filter-bound Excel/PDF exports.
   - **Defect History**: Sortable and filterable defect catalog with interactive slide-out inspection sheets and custom dataset export.
    - **Camera Array**: GigE and USB3 Vision camera telemetry, temperature monitoring, packet loss detection, and sensor re-synchronization.
    - **System Health**: NVIDIA Jetson AGX Orin GPU load gauges, INT8 TensorRT inference latency histograms, and Profinet PLC cyclic links.
    - **Line Settings**: Automated divert rules, 85dB panel buzzer chimes, and display density modes.
    - **Operators Management**: Dedicated System Administrator provisioning console for adding, editing, disabling, and resetting operator accounts with salted SHA-256 password security.

---

## Responsive Scaling & UI Dimensions

To ensure optimal visibility across industrial displays (touch panel PCs, operator kiosks, and ultra-wide overhead monitoring screens), the entire interface scales proportionally using root `rem` units:

1. **Fluid Root Font Size**:
   ```css
   html {
     font-size: clamp(16px, 1.25vw, 24px);
   }
   ```
   - At **1280px** width and below: root size is **16px** (standard base).
   - At **1920px** (1080p full HD): root size is **24px** (creating a natural 150% visual scale at 100% browser zoom).
   - Above **1920px**: capped at **24px** to preserve ergonomic reading dimensions.
2. **Rem-Based Layout Tokens**:
   - All component padding, gaps, border radii, text sizes, and icon containers are defined in `rem` units so they scale seamlessly with root font changes.
   - Sidebar maintains fixed ergonomics: `15rem` expanded and `4rem` collapsed.
   - Public and dashboard layouts are constrained to a maximum content width of `107.5rem` (~1720px base) to eliminate distortion on ultra-wide monitors.
3. **Dynamic Canvas & Recharts Sizing**:
   - Canvas HUD overlays (bounding box line widths, label sizes, crosshair indicators) dynamically query root scale:
     ```typescript
     const rootSize = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
     const scale = rootSize / 16;
     ```
   - Recharts tick labels, legends, and tooltip fonts scale automatically via the `useRootFontSize()` hook.

---

## Offline Report Export Engine (Excel .xlsx & PDF)

All data export functionality runs 100% client-side and offline on air-gapped industrial plant networks, implemented in [`src/services/reportExport.ts`](file:///e:/Maruti%20febriscan/src/services/reportExport.ts):

- **Dynamic Lazy Loading**: `exceljs`, `jspdf`, and `jspdf-autotable` are loaded on demand via dynamic `import()` only when the operator triggers an export, keeping the initial bundle light.
- **Export Trigger**: Available via the `ExportReportDropdown` component on **Live Inspection**, **Production**, **Defect History**, and **Quality Reports** (Report Builder).
- **File Naming**: Deterministic ISO-stamped format: `FabriScan_Report_YYYY-MM-DD_HHmm.xlsx` and `FabriScan_Report_YYYY-MM-DD_HHmm.pdf`.
- **Excel (.xlsx) Structure**:
  1. **Summary Sheet**: Station metadata, inspection period, active filters, generation timestamp (Asia/Kolkata), total parts inspected, Good/Reject counts, FTR %, and PPM.
  2. **Defects by Class**: Defect categorization breakdown, instance counts, and percentage share.
  3. **Records**: Granular inspection log (timestamp, serial number, batch, part type, scanner name, verdict, defect count, defect classes) with frozen header rows, autofilter, and real date formatting.
  4. **Defect Details**: Itemized flaw log with bounding box area in mm², confidence scores, and severity rankings.
- **PDF (.pdf) Structure**:
  - High-resolution A4 landscape document.
  - Formatted header with station and operator audit details.
  - Summary KPI cards followed by repeated auto-table headers across pagination.
  - Plant confidentiality footer and running page count (`Page x of y`).

---

## Edge Model Integration: Single Entry Point (`recordInspection`)

The frontend persistence layer is decoupled from inference engines and hardware sensors:

- **Location**: [`src/services/inspectionStore.ts`](file:///e:/Maruti%20febriscan/src/services/inspectionStore.ts)
- **Primary Function**:
  ```typescript
  export async function recordInspection(
    record: Omit<InspectionRecord, 'id'> & { id?: string }
  ): Promise<InspectionRecord>
  ```
- **Where It Is Called**:
  - In a connected deployment, edge computer vision workers (e.g. Python YOLOv8-Seg TensorRT pipelines, C++ inference daemons, RTSP frame grabbers, or WebSocket streaming clients) invoke `recordInspection(record)` upon completing every blank cycle.
  - The function commits the record into the client's local IndexedDB store (`fabriscan_inspections`), tags it with high-precision timestamping, and calls `notifySubscribers()` to reactively refresh all active views.
- **Prototype Empty State**:
  - Without live edge hardware connected, all historical and real-time data views state:
    > *"NO INSPECTIONS RECORDED. Records appear when the AI model sends results."*
  - As soon as the edge service dispatches its first payload to `recordInspection()`, the UI populates immediately without requiring page reloads.

---

## Technology Stack

- **Framework**: React 18 + TypeScript (Strict mode enabled)
- **Build Tool**: Vite 6
- **Styling**: Tailwind CSS v4 (CSS-first `@theme` configuration in `src/index.css`)
- **Typography (Bundled via npm for 100% offline support)**:
  - `@fontsource-variable/geist`: Display typography
  - `@fontsource/jetbrains-mono`: Telemetry, HUD, and industrial labels
- **Icons**: `lucide-react`
- **Charts**: `recharts` (dynamically scaled for fluid rem dimensions)
- **Reporting**: `exceljs`, `jspdf`, `jspdf-autotable` (offline client-side generation)
- **Motion**: `motion` (Framer Motion, respects `prefers-reduced-motion`)
- **UI Primitives**: Radix UI (`@radix-ui/*`)

---

## Industrial Status Vocabulary

Every status in the application strictly maps through the reusable `StatusBadge` component (`src/components/common/StatusBadge.tsx` and `src/constants/status.ts`):

| Status | Tone | Border Style | Pulse | Description |
|---|---|---|---|---|
| `RUNNING` | Success (Emerald) | Solid | Yes | System actively inspecting continuous line throughput |
| `READY` | Success (Emerald) | Solid | No | Line standby, sensors synchronized, awaiting part entry |
| `ACCEPTED` | Success (Emerald) | Solid | No | Quality verification passed within tolerance parameters |
| `INITIALIZING` | Blue (Azure) | Dashed | Yes | Loading model weights and initializing optical sensors |
| `RECONNECTING` | Blue (Azure) | Dashed | Yes | Re-establishing edge PLC and sensor telemetry bridge |
| `WARNING` | Warning (Amber) | Solid | No | Minor variance detected or lighting threshold drift |
| `DEGRADED` | Warning (Amber) | Solid | No | Inference latency degraded or single lens occluded |
| `CRITICAL` | Critical (Rose) | Thick 2px | Yes | Safety interlock triggered or structural line failure |
| `REJECTED` | Critical (Rose) | Thick 2px | Yes | Out-of-spec defect identified; pneumatic diverter engaged |
| `ACTUATED` | Critical (Rose) | Thick 2px | Yes | Solenoid reject ram fired to quarantine defect bin |
| `STOPPED` | Muted (Slate) | Dotted | No | Inspection line paused by supervisor or E-stop |
| `DISCONNECTED` | Muted (Slate) | Dotted | No | Camera optical feed or edge unit offline |

---

## Role-Based Access Control (RBAC)

The application includes four pre-configured industrial operator profiles accessible via `/login`:

1. **Line QC Inspector (`qc_inspector`)**:
   - Access: Live Inspection, Production, Defect History
2. **QA Supervisor (`qa_supervisor`)**:
   - Access: Live Inspection, Production, Defect History, Quality Reports
3. **Supplier QA Auditor (`supplier_qa`)**:
   - Access: Quality Reports, Defect History, Production Summary (Read-Only)
4. **Lead Systems Administrator (`sys_admin`)**:
   - Access: Complete root console (All routes including Camera Array, System Health, Line Settings, and Operators management)

Route protection is enforced via `RequireRole` (`src/routes/RequireRole.tsx`), synchronized with the dynamic sidebar filter (`src/constants/roles.ts`).

---

## Project Structure

```
├── docs/
│   ├── specs/        # Functional specifications, PRDs, and PDF documentation
│   ├── prompts/      # AI prompts and generation guides
│   └── screenshots/  # UI captures and reference screenshots
├── public/
│   ├── favicons/     # Application favicons and web clip icons
│   └── images/       # Static public image assets
├── scripts/          # Automation scripts (UI capture, etc.)
└── src/
    ├── assets/       # Media and static assets imported directly by code
    ├── components/
    │   ├── ui/       # shadcn/ui primitives only
    │   ├── layout/   # Layout components (navbar, footer, sidebar, topbar, user menu)
    │   ├── common/   # Reusable UI pieces (badges, empty states, headers, cards)
    │   ├── marketing/# Public website sections (hero, how-it-works, surface-quality)
    │   └── features/ # Domain feature components (inspection, etc.)
    ├── constants/    # Global configuration, role definitions, and status maps
    ├── data/         # Mock datasets and domain mock stores
    ├── hooks/        # Custom React hooks (useXxx)
    ├── layouts/      # Root route layout shells (PublicLayout, AppLayout)
    ├── lib/          # Pure helper utilities (cn, formatters)
    ├── pages/
    │   ├── public/   # Public routes (Home, About, Login, NotFound)
    │   └── app/      # Control room /app routes (LiveInspection, Production, etc.)
    ├── routes/       # Router definition and route protection guards
    ├── services/     # Client-side API abstractions, data stores, and exports
    └── types/        # Shared TypeScript interfaces and domain type definitions
```

### Where to Put What

| Folder | What Goes Here | Example |
|---|---|---|
| `docs/specs/` | Loose markdown and PDF specification documents | `fabriscan-spec.pdf`, `software-requirements-spec.md` |
| `docs/prompts/` | Prompt templates and LLM guidance specs | `ui-prompt.md` |
| `docs/screenshots/` | Full-page UI captures and reference screenshots | `hero.png`, `live_inspection.png` |
| `public/favicons/` | Favicon icons, SVGs, Apple touch icons | `favicon.ico`, `apple-touch-icon.png` |
| `public/images/` | Publicly served images referenced by static URL | `parts-1.webp`, `login-illustration.png` |
| `src/assets/` | Static media files imported into TypeScript/React code | `parts-1.jpg` |
| `src/components/ui/` | shadcn/ui and Radix UI primitive building blocks | `button.tsx`, `dialog.tsx`, `sheet.tsx` |
| `src/components/layout/` | Shell navigation and persistent frame components | `Sidebar.tsx`, `TopBar.tsx`, `PublicNavbar.tsx` |
| `src/components/common/` | Shared UI widgets, metric cards, status pills | `StatusBadge.tsx`, `MetricCard.tsx`, `Logo.tsx` |
| `src/components/marketing/` | Public marketing landing page components | `Hero.tsx`, `HowItWorks.tsx`, `SurfaceQuality.tsx` |
| `src/components/features/` | Complex app components grouped by domain | `features/inspection/CameraViewport.tsx` |
| `src/constants/` | Constant configurations, route permissions, status metadata | `roles.ts`, `status.ts` |
| `src/data/` | Mock seed data and static fixture objects | `mockAlerts.ts`, `mockCameras.ts`, `mockUsers.ts` |
| `src/hooks/` | Custom React hooks named `useXxx.ts` | `useRole.ts`, `useInspectionStream.ts` |
| `src/layouts/` | Top-level layout wrappers providing page shells | `AppLayout.tsx`, `PublicLayout.tsx` |
| `src/lib/` | Pure helper utilities and style class merge helpers | `utils.ts`, `format.ts` |
| `src/pages/public/` | Unauthenticated public page views | `Home.tsx`, `About.tsx`, `Login.tsx` |
| `src/pages/app/` | Protected inspection console views | `LiveInspection.tsx`, `Production.tsx` |
| `src/routes/` | Router definitions and role authorization guards | `router.tsx`, `RequireRole.tsx` |
| `src/services/` | State stores, export engines, mock API / WebSocket clients | `inspectionStore.ts`, `reportExport.ts`, `auth.ts` |
| `src/types/` | Shared TypeScript domain interfaces and types | `inspection.ts`, `status.ts`, `user.ts` |

---

## Routes

### Public Pages
- `/`: Single-page product overview with in-page anchor navigation (Hero with fluid wipe typography, How It Works, Surface Quality)
- `/about`: Project genesis, timeline, and engineering team
- `/login`: Multi-role operator authentication portal (locked static layout, popover demo selector)

### Control-Room Pages (`/app/*`)
- `/app/live-inspection`: Primary live continuous inspection stream & active batch telemetry
- `/app/production`: Shift throughput, FTR, PPM variance, and downtime tracking
- `/app/defects`: Defect catalog with slide-out segmentation sheet
- `/app/reports`: Interactive Report Builder with date range, batch filters, and Excel/PDF generation
- `/app/cameras`: Multi-camera GigE vision array diagnostics
- `/app/system-health`: NVIDIA Jetson AGX Orin edge hardware telemetry
- `/app/settings`: Automated pneumatic divert policies and station audio alarms
- `/app/operators`: Station operator provisioning, credential reset, and RBAC control (System Administrator only)
- `/app/profile`: Operator station profile details and permission scope

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Build & Typecheck for Production
```bash
npm run build
```

---

## How to Swap Mock WebSocket for a Real Edge Backend

The real-time streaming pipeline is cleanly decoupled into two files:
1. `src/services/mockWebSocket.ts`
2. `src/hooks/useInspectionStream.ts`

To swap the simulated state machine for a live production edge WebSocket server (e.g. FastAPI / Python or C++ inference daemon):

1. Edit `src/services/mockWebSocket.ts`:
```typescript
class ProductionWebSocketClient {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();

  connect(url: string = 'ws://192.168.10.10:8000/ws/inspection') {
    this.socket = new WebSocket(url);
    this.socket.onmessage = (event) => {
      const { type, payload } = JSON.parse(event.data);
      const set = this.listeners.get(type);
      if (set) set.forEach((fn) => fn(payload));
    };
    this.socket.onclose = () => {
      setTimeout(() => this.connect(url), 2000); // Auto reconnect
    };
  }

  subscribe(event: string, listener: (data: any) => void) {
    if (!this.listeners.has(event)) this.listeners.set(event, new Set());
    this.listeners.get(event)!.add(listener);
    return () => this.listeners.get(event)!.delete(listener);
  }
}

export const mockWebSocket = new ProductionWebSocketClient();
```
2. Disable the self-starting `inspectionEngine.ts` timer loop by removing `this.start()` from its constructor. All UI components, canvas viewports, and decision banners will automatically update from live edge messages without any other code changes.

---

## Known Design & Implementation Decisions

- **Deterministic PRNG**: The Check Part workbench uses seeded hashing (`hashString(file.name + file.size)`) so uploading the same file or testing a sample always yields repeatable, deterministic defect segmentations.
- **Canvas rAF Isolation**: The `InspectionViewport` stores incoming state in mutable React refs, running requestAnimationFrame without triggering React component re-renders on every frame. Offscreen inspection viewports pause rendering via `IntersectionObserver`.
- **Offline Self-Contained Typography**: Geist and JetBrains Mono fonts are bundled directly from `@fontsource` npm packages. The application functions completely offline on air-gapped industrial plant networks without external CDN dependencies.
- **Hero Entrance Animation**: Features an intentional 4-line fluid clamp headline (`clamp(2.5rem, 4.6vw, 5.5rem)`) with three industrial color tokens (dark ink, blue accent, and teal). Each line is wrapped in an overflow-hidden mask and reveals with a left-to-right wipe (`clip-path: inset(0 100% 0 0)` to `inset(0 0 0 0)`) and a horizontal slide, completing in under 2 seconds. The animation honors `prefers-reduced-motion` and ensures text remains readable even if JavaScript fails.
- **Pill Navbar Alignment**: The floating navbar uses a strict 3-column CSS grid (`1fr auto 1fr`) to ensure navigation links remain centered regardless of logo or button width, with equal padding and `user-select: none`.
- **Operators Page & Salted Cryptographic Storage**: Station operator accounts are persisted via `userStore.ts` using salted SHA-256 password hashing powered by the Web Cryptography API (`crypto.subtle`). Only System Administrators have access to `/app/operators`, with strict validation ensuring an administrator cannot self-demote or disable their own account, and at least one active System Administrator always exists. Disabled accounts are barred from signing in and actively revoked if currently authenticated.

