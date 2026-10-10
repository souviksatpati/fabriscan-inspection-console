# Maruti FabriScan — Complete Frontend Development Specification

## 1. Document Purpose

This document combines the frontend requirements, UI/UX requirements, system design, screens, components, frontend functions, communication requirements, security, performance, responsive behavior, and implementation roadmap for **Maruti FabriScan — Edge Automated Optical Inspection**.

The source project documents define the frontend as an **industrial operator interface**, not a generic SaaS dashboard. Its main objective is real-time industrial visual inspection with immediate, understandable, and safe operator feedback.

Primary surfaces:
- Desktop Web
- Industrial Panel PC
- Tablet
- Smartphone

The main design question for every screen is:

> Can an operator understand the current production state and take the correct action within seconds, without ambiguity?

---

# 2. What Is Maruti FabriScan?

Maruti FabriScan is an edge-based Automated Optical Inspection (AOI) system for automotive manufacturing.

High-level flow:

```text
Camera
   ↓
Frame Capture
   ↓
Preprocessing
   ↓
AI Inference
   ↓
Defect Segmentation
   ↓
Defect Measurement
   ↓
Severity Classification
   ↓
Accept / Reject Decision
   ↓
Rejection Actuation
   ↓
Production Data
   ↓
History / Reports / Traceability
```

The frontend is the human control and interpretation layer.

The system revolves around:
1. Camera acquisition
2. Frame normalization
3. Edge AI inference
4. Defect segmentation
5. Defect measurement
6. Severity classification
7. Rejection actuation
8. Production metrics
9. Supplier traceability
10. Audit/report generation

---

# 3. Core Frontend Idea

The frontend should communicate:

```text
SEE
 ↓
UNDERSTAND
 ↓
DECIDE
 ↓
ACT
 ↓
RECORD
 ↓
ANALYZE
```

The final frontend hierarchy should be:

```text
1. WHAT IS HAPPENING NOW?
          ↓
2. IS THE LINE SAFE / HEALTHY?
          ↓
3. WHAT DID THE AI DETECT?
          ↓
4. WHAT ACTION DID THE SYSTEM TAKE?
          ↓
5. DOES THE OPERATOR NEED TO ACT?
          ↓
6. WHAT DOES THE PRODUCTION DATA SAY?
          ↓
7. WHAT HAPPENED HISTORICALLY?
```

The **Live Inspection** screen is therefore the most important screen.

---

# 4. Frontend Technology Stack

Recommended/intended stack:

| Area | Technology |
|---|---|
| Frontend | React |
| Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | shadcn/ui + Radix |
| Icons | Lucide |
| Charts | Recharts |
| Routing | React Router |
| API Communication | Fetch/Axios |
| Real-Time Communication | WebSocket |
| AI Visualization | Canvas/WebGL |
| Browser AI | ONNX Runtime Web / WASM |
| State Management | Zustand or Context |
| Forms | React Hook Form |
| Validation | Zod |
| Tables | TanStack Table |
| Notifications | Sonner / Toast system |

Backend context:

| Area | Technology |
|---|---|
| Backend | Python |
| API | FastAPI |
| Server | Uvicorn |
| Database | PostgreSQL |
| Time-Series | TimescaleDB |
| Deployment | Docker + Ubuntu |
| Communication | REST + WebSocket |

AI context:

```text
YOLOv8-Seg
    ↓
ONNX
    ↓
INT8
    ↓
ONNX Runtime Web
    ↓
WASM / SIMD
    ↓
Optional WebGPU
```

---

# 5. Main Frontend Modules

The main information structure is:

```text
FabriScan
│
├── Live Inspection
│
├── Production
│   ├── Current Batch
│   ├── Batch History
│   └── Quality Metrics
│
├── Defect History
│
├── Reports
│   ├── Inspection Reports
│   └── Non-Conformance Reports
│
├── Configuration
│
├── Camera & Line Configuration
│
├── System Health
│
└── Administration
```

The Line QC Inspector should see fewer administrative options than the System Administrator.

---

# 6. Login and Authentication

## 6.1 Login Screen

```text
┌─────────────────────────────────────┐
│           MARUTI FABRISCAN          │
│                                     │
│ Username                            │
│ [________________________]          │
│                                     │
│ Password                            │
│ [________________________]          │
│                                     │
│             [ LOGIN ]               │
└─────────────────────────────────────┘
```

## 6.2 Frontend Functions

```text
login()
logout()
checkAuthentication()
getCurrentUser()
refreshToken()
```

Possible API:

```http
POST /api/auth/login
GET  /api/auth/me
POST /api/auth/logout
```

Example login response:

```json
{
  "access_token": "...",
  "user": {
    "id": 1,
    "name": "Operator",
    "role": "QC_INSPECTOR"
  }
}
```

---

# 7. Role-Based Access Control

Four main roles:

## 7.1 Line QC Inspector

Access:
- Live inspection
- Event review
- False-reject review
- Operational controls

## 7.2 QA Supervisor

Additional access:
- Configuration
- Thresholds
- Analytics
- Batch reports
- Supervisor overrides

## 7.3 Supplier QA

Access:
- Supplier portal
- Defect evidence
- Batch reports
- NCR records

Read-only by default.

## 7.4 System Administrator

Access:
- Cameras
- Models
- System configuration
- Backups
- Network
- Diagnostics

Frontend functions:

```text
hasPermission()
checkPermission()
getUserRole()
```

Components:

```text
ProtectedRoute
RoleProtectedRoute
PermissionRoute
```

---

# 8. Main Application Shell

The global shell contains:

```text
AppShell
├── TopBar
├── Sidebar
├── NotificationBell
├── ConnectionStatus
├── UserMenu
└── PageContent
```

## Top Bar

Left:

```text
FABRISCAN
PRESS SHOP / LINE 04
```

Center:

```text
● RUNNING
31 FPS
64.8 ms
```

Right:
- Notification icon
- Connection status
- User avatar
- User role
- Settings

## Sidebar

Desktop width:

```text
240px
```

Collapsed width:

```text
64px
```

Selected navigation item:
- Subtle surface highlight
- Left 3px active indicator
- White text
- Emphasized icon

Avoid excessive glowing effects.

---

# 9. Live Inspection — MOST IMPORTANT

The majority of frontend design effort should go into Live Inspection.

Basic layout:

```text
┌──────────────────────────────────────────────────────────┐
│ TOP BAR                                                   │
├──────────────┬───────────────────────────────────────────┤
│              │ LIVE INSPECTION                           │
│ NAVIGATION   │                                           │
│              │ ┌────────────────────┬──────────────────┐ │
│              │ │                    │                  │ │
│              │ │    CAMERA FEED     │ DEFECT STATUS   │ │
│              │ │                    │                  │ │
│              │ └────────────────────┴──────────────────┘ │
│              │                                           │
│              │ BATCH METRICS                             │
│              │                                           │
│              │ EVENT / SYSTEM STATUS                     │
└──────────────┴───────────────────────────────────────────┘
```

The live page should answer immediately:

- Is the line running?
- Is the camera working?
- Is AI inference running?
- Is the current panel acceptable?
- Is a defect present?
- What defect is it?
- How severe is it?
- Was rejection triggered?
- Does the operator need to intervene?

---

# 10. Camera Viewport

The camera viewport is the visual center.

It should support:

- Raw video
- Segmentation overlay
- Bounding contours
- Defect labels
- Confidence
- Measurement annotation
- Tracking indicator
- Frame status

Camera header example:

```text
CAMERA 01
● LIVE
1920 × 1080
31 FPS
```

Actions:

```text
Fullscreen
Snapshot
Overlay Toggle
Camera Settings
```

Components:

```text
CameraViewport
CameraStatus
```

Functions:

```text
startCamera()
stopCamera()
pauseCamera()
connectCamera()
disconnectCamera()
reconnectCamera()
getCameraStatus()
takeSnapshot()
toggleOverlay()
enterFullscreen()
```

---

# 11. AI Segmentation Overlay

Detected defects should be rendered directly on the camera image.

The frontend can show:

```text
Camera Image
     +
Segmentation Mask
     +
Defect Marker
     +
Defect Label
     +
Confidence
     +
Area Measurement
```

Example:

```text
┌─────────────────────────────┐
│                             │
│       AUTOMOTIVE PANEL      │
│                             │
│            █████            │
│            █ SCRATCH        │
│            █ 96.4%          │
│            █ 18.4 mm²       │
│                             │
└─────────────────────────────┘
```

Components:

```text
SegmentationOverlay
DefectMarker
ActiveAnomalyPanel
InspectionStatus
```

Frontend responsibilities:
- Receive inference result
- Convert coordinates to display coordinates
- Render mask
- Render defect marker
- Display label
- Display confidence
- Display measurement
- Display severity

---

# 12. Defect Information

Defect panel example:

```text
CURRENT INSPECTION

Part:
PANEL-10293

Result:
REJECTED

Defect:
Scratch

Confidence:
96.4%

Area:
18.4 mm²

Severity:
CRITICAL

Rejection:
ACTUATED
```

If multiple defects exist:

```text
DETECTED DEFECTS

1. Scratch
   Confidence: 96.4%
   Area: 18.4 mm²
   Severity: CRITICAL

2. Inclusion
   Confidence: 89.2%
   Area: 7.2 mm²
   Severity: MAJOR
```

Components:

```text
DefectCard
DefectList
DefectMarker
SeverityBadge
ActiveAnomalyPanel
```

---

# 13. Severity

The frontend should communicate:

```text
MINOR
MAJOR
CRITICAL
```

Never depend only on color.

Example:

```text
⚠ MINOR
⚠ MAJOR
⛔ CRITICAL
```

Critical rejection must be visually unmistakable.

Do not use:
- Color alone
- Tiny text
- Subtle animation
- Hidden notifications
- Ambiguous icons

---

# 14. Rejection Status

Component:

```text
RejectionBanner
RejectionStatus
```

Possible states:

```text
READY
REJECTED
ACTUATED
FAILED
DISCONNECTED
```

Example:

```text
REJECTION SYSTEM

● READY
```

Defect:

```text
⛔ REJECTED

Actuator:
ACTUATED
```

Failure:

```text
⚠ REJECTION FAILURE

Operator intervention required
```

Frontend functions:

```text
getRejectionStatus()
showRejection()
acknowledgeRejection()
```

---

# 15. Production Metrics

Primary live metrics:

```text
INSPECTED
4,812

DEFECTIVE
14

FTR
99.71%

PPM
2,909
```

Each metric can contain:
- Label
- Value
- Optional delta
- Optional threshold state

Components:

```text
MetricValue
MetricStrip
FTRIndicator
PPMIndicator
```

Functions:

```text
getProductionMetrics()
updateMetrics()
resetBatchMetrics()
```

Do not make metric cards unnecessarily large or decorative.

---

# 16. Line Status

Supported states:

```text
RUNNING
WARNING / DEGRADED
LINE INTERRUPTED
STOPPED
INITIALIZING
OFFLINE
```

Examples:

```text
● RUNNING
▲ DEGRADED
■ LINE INTERRUPTED
■ STOPPED
◌ INITIALIZING
○ OFFLINE
```

Use consistent vocabulary throughout the application.

---

# 17. Camera Failure State

If the camera disconnects:

```text
CAMERA CONNECTION LOST

Inspection has been interrupted.

[ RECONNECT CAMERA ]
```

The UI must make clear that the inspection state is no longer trustworthy.

Functions:

```text
handleCameraDisconnect()
retryCameraConnection()
showCameraFailure()
```

---

# 18. Low FPS State

If FPS falls below the defined threshold:

```text
INSPECTION QUALITY DEGRADED

Camera stream: 12 FPS
Required minimum: 15 FPS

LINE INTERRUPT WARNING
```

Do not hide this as a tiny badge.

---

# 19. AI Engine Status

System diagnostics can expose:

```text
AI ENGINE
● READY

MODEL
YOLOv8-Seg INT8

INFERENCE
32.5 ms

WASM
SIMD ENABLED

WEBGPU
ENABLED
```

This information should mainly be available in diagnostics rather than constantly displayed to ordinary operators.

---

# 20. WebSocket

WebSocket is important for real-time events.

Data flow:

```text
Camera / AI / Backend
        ↓
    FastAPI
        ↓
    WebSocket
        ↓
    React Frontend
        ↓
Live UI
```

Frontend functions:

```text
connectWebSocket()
disconnectWebSocket()
reconnectWebSocket()
sendWebSocketMessage()
handleWebSocketMessage()
handleWebSocketError()
subscribe()
unsubscribe()
```

Possible message:

```json
{
  "type": "inspection_result",
  "part_id": "P10293",
  "result": "REJECTED",
  "defect": "Scratch",
  "confidence": 0.964,
  "area_mm2": 18.4,
  "severity": "CRITICAL"
}
```

WebSocket states should be explicit:

```text
CONNECTED
CONNECTING
RECONNECTING
DISCONNECTED
```

---

# 21. Production Module

Production contains:

```text
Current Batch
Batch History
Quality Metrics
```

## Current Batch

Display:
- Batch ID
- Start time
- End time
- Total parts
- Accepted
- Rejected
- FTR
- PPM
- Supplier
- Production line

Functions:

```text
getCurrentBatch()
getBatchDetails()
```

## Batch History

Table:

```text
Batch ID | Date | Parts | Defects | FTR | PPM | Status
```

Functions:

```text
getBatchHistory()
searchBatches()
filterBatches()
sortBatches()
```

---

# 22. Defect History

Show previous inspection defects.

Example:

```text
Date        Part       Defect       Confidence   Area    Severity
02/10/26    P10293     Scratch      96.4%        18.4    Critical
02/10/26    P10294     Inclusion    91.2%        9.1     Major
02/10/26    P10295     Crazing      88.7%        4.2     Minor
```

Filters:
- Date
- Batch
- Defect type
- Severity
- Supplier
- Camera
- Line

Functions:

```text
getDefects()
searchDefects()
filterDefects()
sortDefects()
getDefectDetails()
```

Components:

```text
DefectTable
DefectFilters
InspectionEventDrawer
```

---

# 23. Defect Details

When a defect is selected:

```text
DEFECT #D102938

Part ID
P10293

Batch
BATCH-102

Defect
Scratch

Confidence
96.4%

Area
18.4 mm²

Severity
CRITICAL

Camera
CAM-01

Timestamp
10:32:42

Rejection
ACTUATED
```

Show:
- Original image
- Segmentation mask
- Defect location
- Inspection metadata

This supports traceability and event investigation.

---

# 24. Event Playback

The component library includes:

```text
EventPlayback
```

It can be used to review a previous inspection event.

Possible controls:

```text
Play
Pause
Previous
Next
Timeline
Fullscreen
```

---

# 25. Reports

Reports contain:

```text
Inspection Reports
Non-Conformance Reports
```

## Inspection Report

Include:
- Batch
- Production statistics
- Defect statistics
- FTR
- PPM
- Rejected parts
- Evidence

Actions:

```text
VIEW REPORT
EXPORT CSV
GENERATE PDF
```

## Non-Conformance Report

Example:

```text
Supplier
Batch
Defect
Defect Count
Defect Rate
PPM
Evidence
Date
Status
```

Example:

```text
Defect Rate
74 PPM

Threshold
50 PPM

Status
NON-CONFORMING
```

Use:

```text
GENERATE NCR PDF
```

rather than a generic "Download" action.

Functions:

```text
getInspectionReports()
getNCRReports()
generateInspectionReport()
generateNCRReport()
downloadReport()
exportCSV()
```

---

# 26. Configuration

Configuration is a sensitive operation.

Example:

```text
CAMERA CONFIGURATION

Camera: CAM-01

Pixels / mm
[ 12.50 ]

Reference distance
[ 100 mm ]

Current configuration
12.48 ratio

[ TEST ]
[ SAVE CONFIGURATION ]
```

Functions:

```text
getConfiguration()
calculateConfiguration()
testConfiguration()
saveConfiguration()
```

Configuration changes require the appropriate authentication/permission.

---

# 27. Camera Configuration

Example:

```text
CAMERA CONFIGURATION

Camera ID
CAM-01

Resolution
1280 × 720

FPS
30

Exposure
...

Status
CONNECTED
```

Functions:

```text
getCameraConfig()
updateCameraConfig()
testCamera()
```

---

# 28. Line Configuration

Example:

```text
LINE CONFIGURATION

Line ID
LINE-01

Conveyor Speed
2.4 m/s

Station
STAMPING-01
```

Functions:

```text
getLineConfig()
updateLineConfig()
```

---

# 29. System Health

System health should show:

```text
SYSTEM HEALTH

Camera
● Healthy

AI Engine
● Healthy

WebSocket
● Connected

Database
● Healthy

PLC Gateway
● Connected

CPU
42%

Memory
61%

FPS
30

Inference
32 ms

Pipeline
65 ms
```

Functions:

```text
getSystemHealth()
getCameraHealth()
getAIHealth()
getDatabaseHealth()
getPLCHealth()
getPerformanceMetrics()
```

---

# 30. Alerts and Notifications

Two main notification classes:

## Informational Toast

Short-lived.

Example:

```text
Configuration saved successfully.
```

## Critical Alert

Persistent until acknowledged.

Example:

```text
CRITICAL DEFECT DETECTED

Rejection actuated.
```

Never automatically hide a critical industrial event after a few seconds.

Components:

```text
NotificationBell
AlertPanel
AlertToast
CriticalAlert
```

Functions:

```text
getAlerts()
showAlert()
acknowledgeAlert()
dismissAlert()
```

---

# 31. Loading States

Never leave a blank screen.

Use industrial-specific messages:

```text
INITIALIZING CAMERA...
LOADING MODEL...
CONNECTING TO LINE...
SYNCING BATCH...
```

If progress is known:

```text
Loading model
██████████████░░ 86%
```

Components:

```text
LoadingState
ProgressIndicator
```

---

# 32. Empty States

Example:

```text
NO DEFECT EVENTS

No defects have been recorded
for the selected period.
```

Avoid generic:

```text
Nothing here.
```

---

# 33. Error States

Every error should explain:

1. What happened
2. Impact
3. What the operator can do

Example:

```text
CAMERA CONNECTION LOST

Inspection is currently unavailable.

Check camera power and network connection.

[ RECONNECT CAMERA ]
```

Functions:

```text
handleError()
retryAction()
showError()
```

---

# 34. Offline Mode

FabriScan must support air-gapped operation.

Do not require:
- Google Fonts at runtime
- Cloud APIs
- External analytics
- CDN-hosted critical assets
- External authentication services

Production-critical assets must be locally deployable.

Frontend should work during degraded connectivity.

---

# 35. Mobile Frontend

Mobile is not simply a smaller desktop UI.

It should be restructured.

Recommended bottom navigation:

```text
Live
History
Reports
System
```

Primary action remains:

```text
Live
```

Do not put ten navigation items on mobile.

---

# 36. Mobile Live Inspection

Example:

```text
┌───────────────────────────┐
│ FABRISCAN      ● RUNNING  │
├───────────────────────────┤
│                           │
│       CAMERA VIEW         │
│                           │
│      DEFECT OVERLAY       │
│                           │
├───────────────────────────┤
│ CRITICAL                  │
│ Scratch • 14.8 mm²        │
│ Confidence 94.2%          │
├───────────────────────────┤
│ INSPECTED  4812           │
│ FTR 99.71%   PPM 2909     │
├───────────────────────────┤
│ REVIEW EVENT              │
└───────────────────────────┘
```

Smartphone camera mode should be supported where appropriate.

---

# 37. Responsive Breakpoints

Recommended:

```text
Mobile
< 640px

Tablet
640–1023px

Desktop
1024–1439px

Industrial Large
≥ 1440px
```

Exact breakpoints can be adjusted after testing with target hardware.

---

# 38. Fullscreen Operator Mode

Live inspection should support fullscreen.

Fullscreen removes:
- Unnecessary navigation
- Secondary controls
- Irrelevant application chrome

Fullscreen maximizes:
- Camera feed
- Defect overlay
- Active anomaly
- Line state

Example:

```text
┌────────────────────────────────────────────────────┐
│ LINE 04 ● RUNNING 31 FPS 65 ms                    │
├────────────────────────────────────────────────────┤
│                                                    │
│                                                    │
│                   CAMERA VIEW                      │
│                                                    │
│                   [DEFECT MASK]                    │
│                                                    │
├────────────────────────────────────────────────────┤
│ ACTIVE: SCRATCH 14.8 mm² CRITICAL                  │
└────────────────────────────────────────────────────┘
```

This is preferred for a dedicated shop-floor display.

---

# 39. UI Design Language

FabriScan should communicate:

- Precision
- Engineering
- Reliability
- Instrumentation
- Manufacturing
- Machine vision

Avoid:
- Excessive gradients
- Decorative illustrations
- Excessive rounded cards
- Consumer-app styling
- Oversized marketing graphics
- Unnecessary animation

The frontend should feel like a modern industrial vision-control system.

---

# 40. Color and Status Rules

Critical status must not depend on color alone.

Use:

```text
● RUNNING
▲ DEGRADED
⛔ CRITICAL
■ STOPPED
● READY
```

Always combine:
- Icon
- Text
- Visual state

---

# 41. Status Vocabulary

Use the same vocabulary everywhere:

```text
RUNNING
WARNING
DEGRADED
CRITICAL
REJECTED
ACTUATED
STOPPED
DISCONNECTED
RECONNECTING
READY
INITIALIZING
```

Do not alternate between:

```text
Offline
Disconnected
Not Connected
No Connection
```

for the same state.

---

# 42. Industrial Microcopy

Prefer:

```text
CAMERA DISCONNECTED
```

instead of:

```text
Oops! Something went wrong with your camera.
```

Prefer:

```text
REJECTION ACTUATED
```

instead of:

```text
We've successfully processed this item.
```

Prefer:

```text
LINE INTERRUPT WARNING
```

instead of:

```text
Please be aware that something may be wrong.
```

---

# 43. Button System

Three categories:

## Primary

Example:

```text
SAVE CONFIGURATION
```

## Secondary

Example:

```text
VIEW EVENT
```

## Destructive

Example:

```text
STOP LINE
```

Destructive actions must never look like ordinary actions.

---

# 44. Button Dimensions

Desktop:

```text
Height: 40px
Padding: 12–16px
```

Compact:

```text
Height: 32px
```

Mobile:

```text
Minimum height: 44px
```

Critical operator actions:

```text
Minimum height: 48px
```

---

# 45. Tooltips

Every icon-only button must have a tooltip.

Example:

```text
[⛶]
```

Tooltip:

```text
Enter fullscreen
```

Never make an operator guess what an icon means.

---

# 46. Tables

Tables should support:

- Sticky header
- Sorting
- Filtering
- Pagination
- Row selection
- Detail drawer

Critical status:

```text
● CRITICAL
```

not color alone.

Components:

```text
DefectTable
BatchTable
InspectionEventDrawer
```

---

# 47. Accessibility

Minimum requirements:

- Keyboard navigation
- Visible focus states
- Semantic buttons
- Accessible labels
- Sufficient contrast
- No color-only status
- Reduced-motion support
- Screen-reader labels for controls

All icon-only controls need accessible labels/tooltips.

---

# 48. Animation Rules

Animation should communicate state.

Allowed:
- Subtle live-state pulse
- Controlled critical alert animation
- Progress transitions
- Drawer transitions
- Hover/focus transitions

Avoid:
- Bouncing cards
- Continuous decorative animation
- Excessive gradients
- Spinning elements without meaning

---

# 49. Spacing

Use a 4px base spacing scale.

Common values:

```text
4px
8px
12px
16px
20px
24px
32px
40px
48px
64px
```

Default UI padding:

```text
Compact:       8px
Standard:     16px
Section:      24px
Major Layout: 32px
```

---

# 50. Border Radius

Industrial interfaces should avoid excessive rounding.

Recommended:

```text
Buttons:          6px
Inputs:           6px
Panels:           8px
Dialogs:         10px
Status indicators: 999px
```

Do not use highly rounded mobile-SaaS cards everywhere.

---

# 51. Design Tokens

Use one centralized token system.

Recommended:

```text
tokens/
├── colors.ts
├── spacing.ts
├── typography.ts
├── radii.ts
├── shadows.ts
└── motion.ts
```

Do not scatter random design values throughout the codebase.

---

# 52. Core Component Inventory

## Application

```text
AppShell
TopBar
Sidebar
MobileNavigation
```

## Inspection

```text
CameraViewport
SegmentationOverlay
DefectMarker
ActiveAnomalyPanel
InspectionStatus
RejectionBanner
EventPlayback
```

## Metrics

```text
MetricValue
MetricStrip
FTRIndicator
PPMIndicator
```

## System

```text
CameraStatus
AIStatus
ConnectionStatus
LineStatus
```

## Actions

```text
ManualOverrideButton
ReconfigureButton
ExportReportButton
```

## Data

```text
DefectTable
BatchTable
InspectionEventDrawer
```

---

# 53. Recommended React Folder Structure

```text
src/
│
├── app/
│   ├── router/
│   ├── providers/
│   └── layout/
│
├── pages/
│   ├── LiveInspection/
│   ├── Production/
│   ├── DefectHistory/
│   ├── Reports/
│   ├── Configuration/
│   ├── CameraConfig/
│   ├── SystemHealth/
│   └── Administration/
│
├── components/
│   ├── camera/
│   ├── inspection/
│   ├── defects/
│   ├── metrics/
│   ├── alerts/
│   ├── tables/
│   ├── forms/
│   └── navigation/
│
├── services/
│   ├── api/
│   ├── websocket/
│   └── camera/
│
├── inference/
│   ├── workers/
│   ├── preprocessing/
│   ├── postprocessing/
│   └── model/
│
├── stores/
│
├── hooks/
│
├── types/
│
├── tokens/
│
├── utils/
│
└── assets/
```

---

# 54. Page Structure

Recommended pages:

```text
pages/

├── Login/
│   └── Login.tsx
│
├── Dashboard/
│   └── Dashboard.tsx
│
├── LiveInspection/
│   └── LiveInspection.tsx
│
├── Production/
│   ├── CurrentBatch.tsx
│   └── BatchHistory.tsx
│
├── Defects/
│   ├── DefectHistory.tsx
│   └── DefectDetails.tsx
│
├── Reports/
│   ├── InspectionReports.tsx
│   └── NCRReports.tsx
│
├── Configuration/
│   └── Configuration.tsx
│
├── Configuration/
│   ├── CameraConfig.tsx
│   └── LineConfig.tsx
│
├── SystemHealth/
│   └── SystemHealth.tsx
│
└── Administration/
    ├── Users.tsx
    ├── Roles.tsx
    └── AuditLogs.tsx
```

---

# 55. Services Layer

Do not put API calls randomly inside every component.

Create:

```text
services/
├── api.ts
├── authApi.ts
├── inspectionApi.ts
├── productionApi.ts
├── defectApi.ts
├── reportApi.ts
├── configurationApi.ts
├── cameraApi.ts
├── systemApi.ts
└── websocket.ts
```

Example functions:

```text
authApi.login()
inspectionApi.getLiveInspection()
inspectionApi.getInspectionHistory()
defectApi.getDefects()
productionApi.getCurrentBatch()
productionApi.getProductionMetrics()
systemApi.getHealth()
cameraApi.getCameraStatus()
```

---

# 56. State Management

Important real-time state:

```text
cameraStatus
lineStatus
aiStatus
currentPart
currentDefects
currentSeverity
rejectionStatus
metrics
alerts
```

Suggested stores:

```text
stores/
├── authStore.ts
├── inspectionStore.ts
├── productionStore.ts
├── defectStore.ts
├── systemStore.ts
└── alertStore.ts
```

---

# 57. Hooks

Useful custom hooks:

```text
hooks/
├── useAuth.ts
├── useWebSocket.ts
├── useCamera.ts
├── useInspection.ts
├── useProduction.ts
└── usePermissions.ts
```

Example:

```text
useAuth()
useWebSocket()
useCamera()
useInspection()
usePermissions()
```

---

# 58. Types

Create strong TypeScript types:

```text
types/
├── auth.ts
├── inspection.ts
├── defect.ts
├── production.ts
├── camera.ts
├── reports.ts
└── system.ts
```

Example:

```typescript
type Severity =
  | "MINOR"
  | "MAJOR"
  | "CRITICAL";

type LineStatus =
  | "RUNNING"
  | "WARNING"
  | "DEGRADED"
  | "STOPPED"
  | "INITIALIZING"
  | "OFFLINE";

type RejectionStatus =
  | "READY"
  | "REJECTED"
  | "ACTUATED"
  | "FAILED";
```

---

# 59. Frontend Function Checklist

## Authentication

```text
login()
logout()
getCurrentUser()
refreshToken()
checkAuthentication()
```

## Permissions

```text
hasPermission()
checkPermission()
getUserRole()
```

## Camera

```text
connectCamera()
disconnectCamera()
reconnectCamera()
getCameraStatus()
startCamera()
stopCamera()
pauseCamera()
takeSnapshot()
```

## Inspection

```text
startInspection()
stopInspection()
pauseInspection()
getInspectionResult()
```

## AI Visualization

```text
displaySegmentation()
drawDefectMarker()
showConfidence()
showMeasurement()
updateOverlay()
```

## WebSocket

```text
connectWebSocket()
disconnectWebSocket()
reconnectWebSocket()
handleWebSocketMessage()
handleWebSocketError()
subscribe()
unsubscribe()
```

## Defects

```text
getDefects()
searchDefects()
filterDefects()
sortDefects()
getDefectDetails()
```

## Production

```text
getCurrentBatch()
getBatchHistory()
getProductionMetrics()
searchBatches()
filterBatches()
```

## Rejection

```text
getRejectionStatus()
showRejection()
acknowledgeRejection()
```

## Alerts

```text
getAlerts()
showAlert()
acknowledgeAlert()
dismissAlert()
```

## Reports

```text
getInspectionReports()
getNCRReports()
generateInspectionReport()
generateNCRReport()
downloadReport()
exportCSV()
```

## Configuration

```text
getConfiguration()
calculateConfiguration()
testConfiguration()
saveConfiguration()
```

## Configuration

```text
getCameraConfig()
updateCameraConfig()
testCamera()
getLineConfig()
updateLineConfig()
```

## System

```text
getSystemHealth()
getCameraHealth()
getAIHealth()
getDatabaseHealth()
getPLCHealth()
getPerformanceMetrics()
```

## Audit

```text
getAuditLogs()
filterAuditLogs()
viewAuditDetails()
```

---

# 60. Frontend ↔ Backend API Structure

A possible structure:

```text
/api/v1

/auth
    POST /login
    POST /logout
    GET  /me

/inspections
    GET  /live
    GET  /history
    GET  /{id}

/defects
    GET  /
    GET  /{id}

/batches
    GET  /
    GET  /current
    GET  /{id}

/metrics
    GET  /production

/cameras
    GET  /
    GET  /{id}
    PUT  /{id}

/configuration
    GET  /{camera_id}
    POST /{camera_id}

/reports
    GET /inspection/{batch_id}
    GET /non-conformance/{batch_id}

/system
    GET /health

/audit
    GET /
```

The actual API paths should be aligned with the implemented FastAPI backend.

---

# 61. Frontend Data Flow

```text
                CAMERA
                  │
                  ▼
             BACKEND/API
                  │
                  ▼
             AI ENGINE
                  │
                  ▼
          INSPECTION RESULT
                  │
          ┌───────┴────────┐
          │                │
          ▼                ▼
      WebSocket          Database
          │
          ▼
       FRONTEND
          │
    ┌─────┼──────┐
    │     │      │
    ▼     ▼      ▼
 Camera  Defect  Metrics
 Overlay Panel
    │     │      │
    └─────┼──────┘
          ▼
       Operator
          │
          ▼
    Acknowledge/
    Take Action
```

---

# 62. AI and Browser Performance

Frontend performance targets:

```text
UI interaction latency: <100 ms where practical
Inference:               ≤35 ms
Total inspection:        <80 ms
Overlay rendering:       60 FPS target
Browser heap:            <450 MB
```

Performance rules:

## Never

```text
Render every inference result as a React state update
Recreate large arrays every frame
Store video frames in global state
Trigger unnecessary component trees from camera updates
Perform expensive image processing on the main thread
```

## Prefer

```text
Web Workers
Canvas/WebGL
Typed arrays
Memoization
Throttled UI updates
Object reuse
Ring buffers
```

---

# 63. Camera Rendering Pipeline

Recommended:

```text
Camera Stream
     ↓
Video Element / Frame Source
     ↓
Canvas
     ↓
AI Overlay
     ↓
Defect Labels
     ↓
Operator Display
```

Avoid storing every video frame in React state.

For high-frequency updates, use:
- Canvas
- Web Workers
- Typed arrays
- Object reuse

---

# 64. Browser AI / Inference Structure

If inference is performed in the browser:

```text
inference/
├── workers/
├── preprocessing/
├── postprocessing/
└── model/
```

Flow:

```text
Camera Frame
     ↓
Preprocessing
     ↓
Worker
     ↓
YOLOv8-Seg
     ↓
Postprocessing
     ↓
Mask / Detection
     ↓
Measurement
     ↓
UI Overlay
```

The exact split between browser inference and backend inference should follow the final implementation design.

---

# 65. Security UI

Sensitive actions must require authentication.

Examples:

```text
Change configuration
Change rejection settings
Change model
Disable rejection
Change thresholds
```

Supervisor authentication is required for critical configuration/rejection configuration.

Frontend should:
1. Check permission
2. Show confirmation
3. Request authentication if required
4. Submit action
5. Show result
6. Record audit information

---

# 66. Audit Trail

For auditable actions display:

```text
Action
Changed configuration

User
QA_SUPERVISOR

Timestamp
2026-09-27 22:18:42

Previous
12.38 ratio

New
12.42 ratio
```

The frontend should make auditability visible without exposing cryptographic implementation details to ordinary operators.

---

# 67. Manual Override

Component:

```text
ManualOverrideButton
```

Because manual override is an operationally sensitive action:
- Require permission
- Show confirmation
- Clearly describe impact
- Record user
- Record timestamp
- Record previous/new state

---

# 68. Reconfiguration

Component:

```text
ReconfigureButton
```

Recommended flow:

```text
Click Reconfigure
      ↓
Permission Check
      ↓
Confirmation
      ↓
Configuration Screen
      ↓
Test Configuration
      ↓
Save Configuration
      ↓
Audit Record
```

---

# 69. Export Report

Component:

```text
ExportReportButton
```

Possible options:

```text
PDF
CSV
```

Reports should be generated from backend data where appropriate.

---

# 70. UX Priority

Very High Priority:

```text
Camera feed
Defect segmentation
Critical alert
Line status
Rejection status
Active defect information
Camera health
```

High Priority:

```text
FTR
PPM
Inspected count
Defect history
Event playback
Manual override
```

Medium Priority:

```text
Analytics
Reports
Configuration
System diagnostics
```

Lower Priority:

```text
Advanced configuration
Historical comparisons
Administrative settings
```

The live operator experience must never be overloaded with lower-priority information.

---

# 71. Recommended Development Order

Do not build everything at once.

## Phase 1 — Project Foundation

Build:

```text
React
TypeScript
Vite
Tailwind
Routing
AppShell
Sidebar
TopBar
Theme / tokens
```

## Phase 2 — Authentication

Build:

```text
Login
Protected Routes
Role-Based UI
User Menu
Logout
```

## Phase 3 — Live Inspection

Build first:

```text
Camera View
Camera Status
AI Overlay Placeholder
Defect Panel
Severity
Rejection Status
Live Metrics
```

## Phase 4 — WebSocket

Connect:

```text
Live inspection result
Camera status
Rejection status
Alerts
```

## Phase 5 — Backend/API

Connect:

```text
FastAPI
PostgreSQL
TimescaleDB
REST APIs
```

## Phase 6 — Historical Data

Build:

```text
Defect History
Batch History
Production Metrics
Event Playback
```

## Phase 7 — Reports

Build:

```text
Inspection Reports
NCR Reports
PDF
CSV
```

## Phase 8 — Configuration

Build:

```text
Configuration
Camera Configuration
Line Configuration
```

## Phase 9 — System Health

Build:

```text
Camera Health
AI Health
Database Health
WebSocket Health
PLC/Gateway Health
Performance
```

## Phase 10 — Administration

Build:

```text
Users
Roles
Permissions
Audit Logs
System Settings
```

---

# 72. Minimum Viable Frontend

If your team has limited time, build these first:

```text
1. Login
2. App Layout
3. Live Inspection
4. Camera View
5. AI Overlay
6. Defect Panel
7. Severity
8. Rejection Status
9. Live Metrics
10. WebSocket
11. Camera Status
12. Defect History
13. Batch History
14. System Health
15. Role Permissions
```

These are more important than building every advanced analytics feature first.

---

# 73. Final Frontend Checklist

## Authentication

- [ ] Login works
- [ ] Logout works
- [ ] Protected routes work
- [ ] Roles work
- [ ] Permissions work

## Live Inspection

- [ ] Camera feed works
- [ ] Camera status visible
- [ ] FPS visible
- [ ] AI status visible
- [ ] Segmentation overlay works
- [ ] Defect marker works
- [ ] Confidence visible
- [ ] Measurement visible
- [ ] Severity visible
- [ ] Rejection status visible
- [ ] Operator action visible

## Real-Time

- [ ] WebSocket connects
- [ ] WebSocket reconnects
- [ ] Connection state visible
- [ ] Inspection result updates
- [ ] Alerts update
- [ ] Rejection status updates

## Production

- [ ] Current batch
- [ ] Batch history
- [ ] Inspected count
- [ ] Defective count
- [ ] FTR
- [ ] PPM

## Defects

- [ ] Defect history
- [ ] Filters
- [ ] Search
- [ ] Sorting
- [ ] Defect details
- [ ] Original evidence
- [ ] Segmentation evidence

## Reports

- [ ] Inspection reports
- [ ] NCR reports
- [ ] PDF
- [ ] CSV

## Configuration

- [ ] Camera configuration
- [ ] Line configuration
- [ ] Configuration
- [ ] Threshold settings
- [ ] Permission checks

## System

- [ ] Camera health
- [ ] AI health
- [ ] Database health
- [ ] WebSocket health
- [ ] Gateway health
- [ ] FPS warning
- [ ] Camera-loss warning

## Security

- [ ] Role-based UI
- [ ] Sensitive-action authentication
- [ ] Confirmation dialogs
- [ ] Audit trail
- [ ] Manual override permission

## Responsive

- [ ] Mobile
- [ ] Tablet
- [ ] Desktop
- [ ] Industrial panel PC
- [ ] Fullscreen mode

## Accessibility

- [ ] Keyboard navigation
- [ ] Focus states
- [ ] Tooltips
- [ ] Accessible labels
- [ ] High contrast
- [ ] No color-only status
- [ ] Reduced motion

## Offline

- [ ] No critical CDN dependency
- [ ] No required cloud dependency
- [ ] Local assets
- [ ] Offline/degraded states
- [ ] Camera-loss state
- [ ] Low-FPS state

---

# 74. Definition of Done

The frontend is NOT complete merely because all pages exist.

It is complete when:

- Operator understands line state immediately
- Camera status is unmistakable
- Defects are visually localized
- Severity is immediately understandable
- Rejection state cannot be missed
- Critical actions require deliberate interaction
- Mobile camera inspection works
- Desktop/panel-PC inspection works
- UI remains usable during degraded connectivity
- Camera loss produces the required warning state
- Low FPS produces the required warning state
- Live rendering remains performant
- WebSocket status is visible where relevant
- Permissions are respected
- Audit-sensitive actions are traceable
- Controls have consistent icons
- Icon-only controls have accessible labels/tooltips
- Application works without Internet access
- Visual hierarchy remains clear at different resolutions

---

# 75. Final Project Philosophy

The frontend should communicate:

> The machine sees the defect. The operator immediately understands what happened. The system takes the appropriate action. Every event remains traceable.

Therefore:

```text
Clarity > Decoration
Signal > Noise
Operational Confidence > Visual Novelty
```

The most important screen remains:

```text
LIVE INSPECTION
```

Everything else supports:

```text
Operation
Investigation
Quality Management
Traceability
Maintenance
Reporting
```

---

# 76. One-Line Frontend Definition

**Maruti FabriScan frontend is an industrial real-time control and visualization interface that receives camera/AI/production data, visually localizes defects, communicates severity and rejection state, allows authorized operator actions, maintains traceability, and provides production, quality, system-health, and reporting interfaces.**

---

# 77. Simplest Mental Model

Remember FabriScan frontend using this:

```text
CAMERA
   ↓
AI
   ↓
DEFECT
   ↓
SEVERITY
   ↓
REJECT / ACCEPT
   ↓
OPERATOR
   ↓
METRICS
   ↓
HISTORY
   ↓
REPORT
```

That is the complete frontend direction for the FabriScan prototype.
