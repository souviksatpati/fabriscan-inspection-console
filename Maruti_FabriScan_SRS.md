Markdown
# SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
## Project: Maruti FabriScan (Edge Automated Optical Inspection)
### Standard: ISO/IEC/IEEE 29148:2018 / IEEE 830 Aligned
**Document Identifier:** MSIL-FS-SRS-2026-V1.0  
**Target Program:** Maruti Suzuki Innovation Challenge (TMSL & AEC Edition in partnership with IIM Calcutta Innovation Park)  
**Track:** Manufacturing & Industrial Innovation  
**Status:** Approved for Baseline Implementation  
**Release Date:** September 2026  


1. Document Control & Revision History
Version
Date
Author / Primary Contributor
Description of Changes
0.1-DRAFT
2026-09-20
Lead Systems Architect
Initial structural draft, operational scope, and problem formulation.
0.9-REVIEW
2026-09-24
Core Vision & Full-Stack Team
Added edge WebAssembly inference pipeline and IATF 16949 audit schemas.
1.0-FINAL
2026-09-27
System Engineering Directorate
Final baseline specifications, API schemas, and hardware rejection timings.

2. Introduction
2.1 Purpose
This Software Requirements Specification (SRS) establishes the complete functional, performance, architectural, and interface requirements for Maruti FabriScan. FabriScan is a zero-hardware-addition, edge-accelerated Automated Optical Inspection (AOI) software system designed for Maruti Suzuki India Limited (MSIL) pressing, body-in-white (BIW) welding, and paint-shop assembly lines.
The software enables real-time surface anomaly detection, pixel-accurate defect segmentation, statistical process control (SPC) metric generation, and automated pneumatic rejection triggers using standard commodity image sensors (CCTV, webcams, industrial GigE/RTSP cameras) without requiring proprietary multi-crore AOI hardware rigs.
2.2 Document Conventions & Notation
Requirement Identifiers:
FR-xxx: Functional Requirement
NFR-xxx: Non-Functional Requirement
IF-xxx: Interface Requirement
Priority Levels (MoSCoW Framework):
[MUST]: Mandatory requirement for MVP and production deployment.
[SHOULD]: Highly recommended; required for full production line qualification.
[COULD]: Optional capability planned for post-pilot phases.
Mathematical & Visual Notation: Metric calculations follow standard SI units. Coordinate spaces reference pixel coordinates normalized to $[0.0, 1.0]$.
2.3 Intended Audience
MSIL Plant Operations & Quality Assurance Directors: Evaluation of compliance with Six Sigma standards, PPM reduction targets, and assembly-line cycle times.
IIM Calcutta Innovation Park (IIMCIP) Investment & Incubation Panel: Validation of business model feasibility, unit economics, and operational scalability.
Software Engineering & Computer Vision Teams: Technical implementation, API contract adherence, model quantization, and verification testing.
2.4 Project Scope & System Boundaries



┌────────────────────────────────────────────────────────────────────────┐
│                        FABRISCAN SYSTEM BOUNDARY                       │
│                                                                        │
│   [Conveyor Stream] ──► [Frame Normalizer] ──► [WASM/WebGPU Engine]    │
│                                                       │                │
│   [Pneumatic Reject Relay] ◄── [Line-Stop Logic] ◄───┤                │
│                                                       ▼                │
│   [Vendor Audit PDF] ◄── [Supplier Engine] ◄── [TimescaleDB Metrics]   │
└────────────────────────────────────────────────────────────────────────┘


In-Scope Capabilities:
Ingesting high-speed 1080p/720p visual feeds at $\ge 30\text{ frames per second (FPS)}$.
Pixel-accurate segmentation of metal stamping and weld defects: crazing, rolled-in scale, inclusions, surface pits, scratches, and weld porosity.
Calculating real-time physical defect area in square millimeters ($mm^2$).
Triggering millisecond-range digital signals (WebSocket/GPIO emulation) to trip sorting gates or pneumatic reject cylinders.
Auto-generation of supplier non-conformance debit notes when defect density exceeds predefined Parts Per Million (PPM) thresholds.
Out-of-Scope Capabilities:
Internal subsurface micro-crack detection requiring Ultrasonic, Eddy Current, or X-ray radiography testing.
Direct low-level firmware flashing of proprietary industrial PLC microcontrollers (interaction occurs strictly via open WebSockets, OPC-UA, or Modbus-TCP gateways).
2.5 Definitions, Acronyms, and Abbreviations
AOI: Automated Optical Inspection
BIW: Body in White (the automotive stage where sheet metal components have been welded together)
DMS: Dealer Management System / Plant Management System
DTC: Diagnostic Trouble Code
FTR: First Time Right (percentage of manufactured units without rework)
IoU: Intersection over Union
MGP: Maruti Genuine Parts
NMS: Non-Maximum Suppression
ONNX: Open Neural Network Exchange
PPM: Parts Per Million (measure of defect density in manufacturing)
SOP: Standard Operating Procedure
SPC: Statistical Process Control
WASM: WebAssembly
2.6 References
ISO/IEC/IEEE 29148:2018: Systems and software engineering — Life cycle processes — Requirements engineering.
IATF 16949:2016: Quality management systems for automotive production and relevant service parts.
NEU Surface Defect Database: Northeastern University (China) benchmark for steel strip surface defects.
MVTec Anomaly Detection (MVTec AD): Comprehensive industrial benchmark for unsupervised optical anomaly localization.
3. Overall Description
3.1 Product Perspective & Industrial Context
In automotive manufacturing (such as Maruti Suzuki's plants in Manesar, Gurugram, and Hansalpur Gujarat), stamping presses shape high-tensile steel body panels at rates exceeding 20 strokes per minute. A single undetected stamping die blemish, trapped metal flake, or weld spatter can propagate across 500 panels before a human inspector spots it during end-of-line audits.
FabriScan installs inline at critical inspection gates:
Gate 1 (Press/Stamping Shop): Validates raw stamped panels (fenders, doors, hoods) for drawing cracks, rolled-in scale, and surface scratches.
Gate 2 (Body-in-White Assembly): Validates robotic spot and laser welding lines for porosity, burn-through, and weld seam alignment.
Gate 3 (Paint Preparation): Inspects phosphatized panels prior to electro-deposition (ED) primer coating to prevent paint blisters.
3.2 Product Functions (High-Level Functional Block)
Real-time Video Ingestion: Continuous capture and buffer management of moving assembly line parts.
Local Edge Segmentation: Zero-cloud-dependency neural network inference running directly inside the plant edge browser via WebAssembly (SIMD/WebGPU enabled).
Defect Parameter Extraction: Extraction of defect centroid, bounding contour, aspect ratio, and computed surface area.
Closed-Loop Actuation: Low-latency outbound signalling to divert defective panels onto rework conveyors.
Vendor Traceability & Accounting: Automated logging of batch non-conformances with photographic evidence for supplier dispute settlement.
3.3 User Classes and Operational Personas



┌─────────────────────┐   ┌─────────────────────┐   ┌─────────────────────┐
│  LINE QC INSPECTOR  │   │   PLANT SUPERVISOR  │   │  VENDOR QA AUDITOR  │
├─────────────────────┤   ├─────────────────────┤   ├─────────────────────┤
│ • Monitors live HUD │   │ • Configures limits │   │ • Reviews disputes  │
│ • Validates rejects │   │ • Audits line FTR   │   │ • Receives automated│
│ • Overrides halts   │   │ • Tracks cycle time │   │   batch debit notes │
└─────────────────────┘   └─────────────────────┘   └─────────────────────┘


Line QC Inspector (Shop Floor Operator):
Role: Stationed directly beside the conveyor inspection portal.
Privilege: Views live inference HUD; marks false rejects; confirms verified defects; initiates line restarts.
Plant Quality Assurance Supervisor:
Role: Oversees entire shift operations across multiple lines.
Privilege: Adjusts sensitivity tolerances; configures camera configuration parameters; reviews hourly yield drops.
Tier-1 Supplier Quality Representative:
Role: External vendor (e.g., steel coil suppliers or stamped sub-assembly partners).
Privilege: Read-only access to supplier portal containing high-resolution defect imagery and timestamped non-conformance logs.
System Administrator:
Role: Maintenance IT / OT engineer.
Privilege: Manages camera network streams, updates ONNX model weights, and configures backup routines.
3.4 Operating Environment & Constraints
Client Operating Environment:
Host Hardware: Industrial Panel PC or standard technician laptop (Intel Core i5 8th Gen+ or AMD Ryzen 5, 8 GB RAM).
Runtime Environment: Chromium-based browser (Google Chrome v118+, Microsoft Edge v118+) with WebAssembly SIMD and WebGL/WebGPU acceleration enabled.
Server & Gateway Environment:
Container Runtime: Docker Engine v24.0+ running on Ubuntu 22.04 LTS.
Application Framework: Python 3.10+ / FastAPI running via Uvicorn workers.
Database: TimescaleDB (PostgreSQL 15 with time-series extension).
Physical Line Environment:
Optical Sensors: Fixed focal-length USB 3.0 / RTSP IP camera (min. resolution 1280x720 @ 30 FPS).
Lighting: Diffuse white LED array / Ring light (eliminating specular glare on bare sheet metal).
3.5 Design and Implementation Constraints
Zero Specialized Hardware: The entire perception and alerting stack must operate without requiring specialized proprietary industrial smart cameras (e.g., Cognex, Keyence).
Deterministic Air-Gapped Operation: The core inference, classification, and rejection pipeline must function with 100% reliability in an isolated factory LAN without outbound Internet connectivity.
Latency Invariant: Total elapsed time from frame acquisition to rejection relay trigger must not exceed $80\text{ milliseconds}$ to accommodate conveyor velocities up to $1.2\text{ meters per second}$.
4. Specific Functional Requirements (FR)
4.1 Module 1: Video Ingestion & Optical Normalization (ACQ)
FR-ACQ-01 [MUST]: Dual Camera Stream Ingestion
The system shall ingest video frames from either a local MediaDevices.getUserMedia stream (Webcam/USB Industrial Sensor) or an IP camera via RTSP-to-WebRTC/WebSocket bridge at a baseline resolution of $1280 \times 720$ at $\ge 30\text{ FPS}$.
FR-ACQ-02 [MUST]: Offscreen Buffer & Spatial Normalization
The system shall render incoming video frames onto an internal OffscreenCanvas, letterbox-scale the content to $640 \times 640$ pixels, and normalize color space values from uint8 $[0, 255]$ to planar IEEE float32 $[0.0, 1.0]$.
FR-ACQ-03 [SHOULD]: Dynamic Lighting & Contrast Equalization
The system shall implement an automated client-side Histogram Equalization pass via Canvas WebGL Shaders to neutralize fluctuating ambient shop-floor illumination.
4.2 Module 2: Edge Inference & Instance Segmentation (INF)



[Normalized Tensor: 1x3x640x640]
              │
              ▼
   [YOLOv8-Seg INT8 / WASM]
              │
      ┌───────┴───────┐
      ▼               ▼
[Box Coordinates] [Prototype Masks]
 (1x4x8400)        (32x160x160)
      │               │
      └───────┬───────┘
              ▼
    [Matrix Multiplication]
              ▼
[Pixel-Level Defect Mask (640x640)]


FR-INF-01 [MUST]: In-Browser WebAssembly Model Execution
The system shall execute an INT8-quantized YOLOv8-Segmentation neural network using ort-web (ONNX Runtime Web) utilizing multi-threaded WASM SIMD.
FR-INF-02 [MUST]: Six-Class Defect Categorization
The model shall accurately segment and label the following six industrial defect types:
crazing: Fine superficial fatigue micro-cracking networks.
inclusion: Embedded non-metallic foreign particles from steel mill rollers.
patches: Localized metal deformation, plate overlap, or surface tearing.
pitted_surface: Clustered cavities caused by scale indentation or acid wash corrosion.
rolled_in_scale: Iron oxide scale pressed directly into the steel matrix.
scratches: Linear abrasive grooves from handling rails or dirty dies.
FR-INF-03 [MUST]: Vectorized Non-Maximum Suppression (NMS)
The post-processing pipeline shall evaluate bounding boxes and mask coefficients, discarding detections with confidence scores below a user-configurable threshold ($\tau_{\text{conf}}$, default $0.40$) and suppressing overlapping proposals using an IoU threshold of $\tau_{\text{IoU}} = 0.45$.
4.3 Module 3: Defect Quantification & Metric Extraction (MET)
FR-MET-01 [MUST]: Pixel-to-Millimeter Spatial Configuration
The system shall maintain a configuration ratio $K$ (pixels per millimeter). The physical defect area $A_{\text{defect}}$ shall be computed dynamically using the segmented binary mask contour:

$$A_{\text{defect}} = \frac{\sum_{(x, y) \in M} 1}{K^2} \quad (\text{expressed in } mm^2)$$
where $M$ is the set of positive pixels belonging to the defect mask.
FR-MET-02 [MUST]: Severity Classification Matrix
The system shall assign a severity level to each detected anomaly based on physical area and defect classification:
Defect Class
Minor Anomaly (Advisory)
Major Anomaly (Line Alert)
Critical Anomaly (Instant Line Rejection)
scratches
$< 2.0\text{ mm}^2$
$2.0\text{ to } 10.0\text{ mm}^2$
$> 10.0\text{ mm}^2$ or Depth Indicator
crazing
N/A (Zero Tolerance)
$< 1.0\text{ mm}^2$
$\ge 1.0\text{ mm}^2$ (Structural Hazard)
rolled_in_scale
$< 5.0\text{ mm}^2$
$5.0\text{ to } 15.0\text{ mm}^2$
$> 15.0\text{ mm}^2$
pitted_surface
$< 3.0\text{ mm}^2$
$3.0\text{ to } 8.0\text{ mm}^2$
$> 8.0\text{ mm}^2$
inclusion
$< 1.5\text{ mm}^2$
$1.5\text{ to } 5.0\text{ mm}^2$
$> 5.0\text{ mm}^2$
patches
N/A
$< 4.0\text{ mm}^2$
$\ge 4.0\text{ mm}^2$

FR-MET-03 [MUST]: Real-Time Yield & PPM Calculation
The system shall compute rolling statistical quality metrics across the active production batch:

$$\text{First Time Right (FTR \%)} = \left(\frac{N_{\text{total}} - N_{\text{rejected}}}{N_{\text{total}}}\right) \times 100$$

$$\text{Defect Rate (PPM)} = \left(\frac{N_{\text{rejected}}}{N_{\text{total}}}\right) \times 1,000,000$$
4.4 Module 4: Automated Rejection Logic & PLC Interlocking (ACT)
FR-ACT-01 [MUST]: Rejection Signal Dispatch
Upon detection of any Critical Anomaly (or a configurable count of Major Anomalies within a single panel), the system shall dispatch an active-high rejection signal within $\le 20\text{ ms}$ over a dedicated WebSocket connection or local TCP socket to the line PLC/actuator gateway.
FR-ACT-02 [MUST]: Visual & Audible Shop Floor Alerting
The client user interface shall flash a high-contrast industrial warning banner (BG-COLOR: #DC2626, TEXT: REJECTED - CRITICAL DEFECT), accompanied by a localized 880Hz audio alert tone via the Web Audio API.
FR-ACT-03 [SHOULD]: Digital Playback Scrubber for False Rejects
The system shall store an in-memory 5-second circular ring buffer of raw frames. When a rejection occurs, the inspector shall have the ability to review the 30 frames preceding the rejection event and execute a manual override if determined to be a false positive.
4.5 Module 5: Supplier Quality Non-Conformance & Reporting (VND)
FR-VND-01 [MUST]: Automated Batch Audit Logging
Each inspection event shall generate an immutable record containing: unique panel serial ID, timestamp (UTC+05:30), conveyor velocity, raw inspection frame, segmented defect mask, and classified severity.
FR-VND-02 [MUST]: Supplier Debit Note Generation
If a delivered coil or raw material batch exhibits an aggregate defect rate exceeding $50\text{ PPM}$, the system shall automatically generate a standardized ISO/IATF 16949-compliant Non-Conformance Report (PDF) containing high-resolution defect crops, vendor ID, and calculated debit recovery amounts.
5. External Interface Requirements
5.1 User Interfaces (UI / UX)



┌────────────────────────────────────────────────────────────────────────┐
│ [MSIL LOGO]  FABRISCAN - PRESS SHOP LINE 04   [STATUS: RUNNING (31 FPS)]│
├───────────────────────────────────┬────────────────────────────────────┤
│                                   │ BATCH METRICS: #BATCH-2026-0927    │
│                                   │ • Inspected: 4,812 units           │
│         LIVE CAMERA FEED          │ • Defective: 14 units              │
│       WITH SEGMENTATION MASK      │ • Current FTR: 99.71%              │
│                                   │ • Running PPM: 2,909               │
│     [ RED CONTOUR: SCRATCH ]      ├────────────────────────────────────┤
│      Area: 14.8 mm² | SEV: CRIT   │ ACTIVE ANOMALY PROFILE             │
│                                   │ Type: Rolled-In Scale (94.2%)      │
│                                   │ Severity: CRITICAL [ACTUATED]      │
├───────────────────────────────────┴────────────────────────────────────┤
│ [BUTTON: MANUAL OVERRIDE]  [BUTTON: RECONFIGURE]  [BUTTON: EXPORT PDF] │
└────────────────────────────────────────────────────────────────────────┘


IF-UI-01: The UI shall be built using mobile-responsive, dark-mode CSS (optimizing visibility under industrial fluorescent lighting with contrast ratio $\ge 7:1$).
IF-UI-02: The main display shall render a split canvas: the raw camera stream alongside the real-time segmented mask overlay rendered at 60Hz using requestAnimationFrame.
5.2 Hardware & Physical Interfaces
IF-HW-01 (Camera Interface): Compliant with USB Video Class (UVC) v1.5 or GigE Vision standards communicating over RTSP/HTTP.
IF-HW-02 (Pneumatic Ejector Interlock): Standard digital relay interface triggered via USB-to-Relay module (FTDI chip) or WebSocket-to-Raspberry-Pi/ESP32 GPIO pin capable of sinking up to 500mA at 24V DC.
5.3 Software Interfaces & API Specifications
REST Endpoints (app/api/v1/)
POST /api/v1/inspections/record
Ingests an inspection event from an edge client node.
Request Payload (application/json):



JSON
{
  "station_id": "STATION-MANESAR-PS04",
  "batch_id": "BATCH-STEEL-TATA-9941A",
  "conveyor_speed_mps": 0.85,
  "defects_detected": [
    {
      "defect_class": "scratches",
      "confidence": 0.9412,
      "surface_area_mm2": 14.82,
      "severity": "CRITICAL",
      "bbox_normalized": [0.32, 0.45, 0.12, 0.08]
    }
  ],
  "rejection_actuated": true,
  "frame_timestamp": "2026-09-27T22:15:30.124Z"
}


Response Payload (201 Created):



JSON
{
  "status": "LOGGED",
  "audit_uuid": "e7b1c4a0-5cb2-4f8e-9d21-43210abced4f",
  "batch_current_ftr": 99.71,
  "line_action": "HOLD_REVERT_READY"
}


GET /api/v1/reports/non-conformance/{batch_id}
Generates and downloads an official vendor debit note PDF for a defective supplier lot.
Response: Streamed binary application/pdf with header Content-Disposition: attachment; filename=MSIL_NCR_{batch_id}.pdf.
Low-Latency WebSocket Interface (ws://:8000/ws/rejection-relay)
Used for ultra-low latency push alerts to hardware actuator gateways:
Outbound Message (Server $\to$ Actuator Gateway):



JSON
{
  "command": "TRIGGER_PNEUMATIC_EJECTOR",
  "line_id": "LINE_04",
  "duration_ms": 250,
  "timestamp_us": 1727475330124000
}


6. Non-Functional Requirements (NFR)
6.1 Performance & Execution Budget
NFR-PERF-01 (Inference Latency): Maximum allowable client-side model execution time per frame shall not exceed $35\text{ ms}$ on standard modern x86/ARM hardware running Chrome WASM.
NFR-PERF-02 (End-to-End Latency Budget):



Frame Capture (Camera Buffer)   : 16.6 ms (at 60 Hz sensor clock)
Spatial Preprocessing (Canvas)  :  4.2 ms
WASM INT8 YOLOv8-Seg Inference  : 32.5 ms
Contour & Area Quantification   :  3.8 ms
WebSocket Signal Transmission   :  4.5 ms
PLC Relay Actuation Response    :  3.4 ms
─────────────────────────────────────────────
TOTAL PIPELINE LATENCY          : 65.0 ms  (Target: < 80 ms) [PASS]


NFR-PERF-03 (Memory Footprint): Total browser heap allocation shall remain stable below $450\text{ MB}$ over an 8-hour continuous shift without exhibiting JavaScript garbage-collection spikes or memory leaks.
6.2 Reliability & Industrial Fail-Safe State
NFR-REL-01 (Fail-Safe Default): If the visual sensor disconnects or the browser drops below 15 FPS, the system shall assert a LINE_INTERRUPT_WARNING state to avoid allowing uninspected panels to pass down the assembly line.
NFR-REL-02 (Availability): Backend logging and analytics services shall provide $99.95\%$ operational availability during active shift hours.
6.3 Security & Traceability Compliance
NFR-SEC-01 (Tamper-Proof Audit Trail): Defect logs, severity classifications, and supervisor overrides shall be cryptographically hashed using SHA-256 to ensure compliance with IATF 16949 Section 8.5.2 (Identification and Traceability).
NFR-SEC-02 (Role-Based Access Control): Modifying physical defect configuration thresholds ($K$) or disabling pneumatic reject triggers shall require Supervisor credentials authenticated via JWT (JSON Web Tokens).
7. Data Models & Database Schemas
7.1 Entity-Relationship Diagram



 ┌──────────────────────┐        1:N        ┌────────────────────────┐
 │     PlantLines       │───────────────────┤      BatchRecords      │
 ├──────────────────────┤                   ├────────────────────────┤
 │ line_id: STR [PK]    │                   │ batch_id: STR [PK]     │
 │ plant_code: VARCHAR  │                   │ line_id: STR [FK]      │
 │ station_name: VARCHAR│                   │ supplier_code: VARCHAR │
 └──────────────────────┘                   │ start_time: DATETIME   │
                                            └────────────────────────┘
                                                         │ 1:N
                                                         ▼
 ┌──────────────────────┐        1:N        ┌────────────────────────┐
 │   VendorDebitNotes   │◄──────────────────│     InspectionLogs     │
 ├──────────────────────┤                   ├────────────────────────┤
 │ debit_note_id: [PK]  │                   │ inspection_id: [PK]    │
 │ batch_id: STR [FK]   │                   │ batch_id: STR [FK]     │
 │ penalty_amount: NUM  │                   │ defect_class: ENUM     │
 │ status: VARCHAR      │                   │ surface_area_mm2: NUM  │
 └──────────────────────┘                   │ severity: VARCHAR      │
                                            │ is_rejected: BOOLEAN   │
                                            │ image_blob_uri: TEXT   │
                                            │ timestamp: TIMESTAMP   │
                                            └────────────────────────┘


7.2 Relational DDL (TimescaleDB / PostgreSQL)



SQL
-- Core Production Line Table
CREATE TABLE plant_lines (
    line_id VARCHAR(32) PRIMARY KEY,
    plant_code VARCHAR(16) NOT NULL, -- e.g., 'MANESAR_PLANT_1'
    station_name VARCHAR(64) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);

-- Material Batch Master Table
CREATE TABLE batch_records (
    batch_id VARCHAR(64) PRIMARY KEY,
    line_id VARCHAR(32) REFERENCES plant_lines(line_id),
    supplier_code VARCHAR(32) NOT NULL, -- e.g., 'TATA_STEEL_BOKARO'
    material_grade VARCHAR(32) NOT NULL, -- e.g., 'EDD_HIGH_TENSILE'
    start_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_inspected INT DEFAULT 0,
    total_defects INT DEFAULT 0
);

-- Time-Series Inspection Event Log
CREATE TABLE inspection_logs (
    inspection_id UUID DEFAULT gen_random_uuid(),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    batch_id VARCHAR(64) REFERENCES batch_records(batch_id),
    defect_class VARCHAR(32) NOT NULL,
    surface_area_mm2 NUMERIC(8, 2) NOT NULL,
    severity VARCHAR(16) NOT NULL,
    is_rejected BOOLEAN NOT NULL,
    image_blob_uri TEXT,
    sha256_hash CHAR(64) NOT NULL
);

-- Convert to TimescaleDB Hypertable for rapid aggregations
SELECT create_hypertable('inspection_logs', 'timestamp', if_not_exists => TRUE);


8. Verification, Acceptance Criteria & Traceability
8.1 Model Acceptance Benchmarks (NEU & MVTec Datasets)
Before deployment, the quantized edge model must meet or exceed the following metrics on test datasets:
Target Performance Metric
Minimum Acceptance Threshold
Verification Methodology
Mean Average Precision (mAP@0.50:0.95)
$\ge 88.5\%$
Evaluated over 360 held-out images from NEU Surface Defect test split.
Structural Crack Recall Rate
$\ge 99.2\%$
Evaluated over severe crazing and rupture samples (Zero Type-II error focus).
Inference Latency (INT8 WebAssembly)
$\le 35\text{ ms}$
Benchmarked on an Intel i5-1135G7 test node at $640\times 640$ resolution.
False Rejection Rate (Type-I Error)
$\le 0.4\%$
Benchmarked on 2,000 certified defect-free baseline panels.

8.2 Requirement Traceability Matrix (RTM)
Requirement ID
Description
Source Standard
Verification Method
FR-ACQ-01
Dual Stream Ingestion (UVC/RTSP)
Plant Floor Spec
Integration Test (Physical Sensor Loop)
FR-INF-01
WebAssembly On-Device Execution
System Boundary
Automated Browser Test (Playwright / Chromium)
FR-MET-01
Defect Area Calculation ($mm^2$)
Quality Engineering
Optical Alignment Target Measurement
FR-ACT-01
Sub-20ms Rejection Dispatch
Safety Standard
Digital Storage Oscilloscope (GPIO trace)
NFR-PERF-02
End-to-End Latency $< 80\text{ ms}$
Conveyor Cycle Time
High-Speed Camera Synchronization Benchmark

