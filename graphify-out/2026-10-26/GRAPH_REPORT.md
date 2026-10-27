# Graph Report - omni-project  (2026-10-26)

## Corpus Check
- 122 files · ~48,958 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 32 file(s) not represented in the graph (top: .css 20, (none) 5, .ino 3)

## Summary
- 769 nodes · 1405 edges · 45 communities (37 shown, 8 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b9f3ae23`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- App.jsx
- omni-front-end/package.json
- api.js
- bridge.js
- platform-service/package.json
- 20260120083600_init_platform_v1/migration.sql
- ingest-service/package.json
- คู่มือการทำงานและการรันระบบ Omni Project (ฉบับปรับปรุง Data Flow)
- platform-service/index.js
- 0009 — Use .agents for project agent configuration
- omni-back-end/package.json
- tugAssessment.jsx
- ref_prisma_client
- adminController.js
- test_influx.js
- ref_dotenv
- deviceProfileController.js
- DESIGN.md
- 🌐 Omni Project: Backend API & Service Documentation
- Ingest Service Documentation
- Omni Serial Bridge: Developer Guide & Workflow
- data.jsx
- 2. วิธีการใช้งาน (User Guide)
- Omni Project Frontend (ส่วนหน้าบ้าน)
- Repository Guidelines
- Fall Risk Software
- InfluxDB Integration Guide
- Proposal_Hospital.md
- Project agent configuration
- TUG staff workspace prototype
- 0001 — Adopt version-controlled ADRs with mandatory maintenance
- 0002 — Reuse the existing application foundations
- 0003 — Separate telemetry ingestion from the platform API
- 0004 — Separate relational metadata from time-series telemetry storage
- 0005 — Use one staff workspace for recording and clinical review
- 0006 — Isolate the UI prototype from live integrations
- 0007 — Link participants, assessments, attempts, and evidence by stable IDs
- 0008 — Preserve approved assessment revisions when creating amendments
- NNNN — Imperative decision title
- Architecture Decision Record index

## God Nodes (most connected - your core abstractions)
1. `react` - 39 edges
2. `react-router-dom` - 24 edges
3. `Button()` - 24 edges
4. `Modal()` - 20 edges
5. `BilingualHeading()` - 19 edges
6. `useWorkflow()` - 19 edges
7. `lucide-react` - 18 edges
8. `Card()` - 18 edges
9. `DemoNotice()` - 17 edges
10. `AssessmentDetail()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Don'ts` --references--> `Modal()`  [INFERRED]
  omni-front-end/DESIGN.md → omni-front-end/src/components/common/Modal.jsx
- `createSession()` --calls--> `publishRecordingEvent()`  [EXTRACTED]
  omni-back-end/platform-service/controllers/sessionController.js → omni-back-end/platform-service/services/mqttService.js
- `endSession()` --calls--> `publishRecordingEvent()`  [EXTRACTED]
  omni-back-end/platform-service/controllers/sessionController.js → omni-back-end/platform-service/services/mqttService.js
- `devices_serial_number_key` --indexes--> `"devices"`  [EXTRACTED]
  omni-back-end/platform-service/prisma/migrations/20260123073924_add_serial_number_to_device/migration.sql → omni-back-end/platform-service/prisma/migrations/20260120083600_init_platform_v1/migration.sql
- `AdminLiveAssessment()` --calls--> `Heatmap()`  [EXTRACTED]
  omni-front-end/src/pages/adminLiveAssessment.jsx → omni-front-end/src/components/Heatmap.jsx

## Import Cycles
- None detected.

## Communities (45 total, 8 thin omitted)

### Community 0 - "react"
Cohesion: 0.08
Nodes (31): DeviceInventory(), DeviceProfile(), UserManagement(), api, Button(), Card(), Input(), Select() (+23 more)

### Community 1 - "App.jsx"
Cohesion: 0.11
Nodes (34): AdminDashboard(), metrics, AdminDevices(), AdminPatients(), BilingualHeading(), DemoNotice(), ResultCallout(), RiskBadge() (+26 more)

### Community 2 - "omni-front-end/package.json"
Cohesion: 0.07
Nodes (39): dependencies, axios@^1.13.3, lucide-react@^0.468.0, react@^19.2.0, react-dom@^19.2.0, react-router-dom@^7.13.0, recharts@^3.7.0, socket.io-client@^4.8.3 (+31 more)

### Community 3 - "api.js"
Cohesion: 0.13
Nodes (15): app, INDEX_PATH, PROFILE_DIR, startApi(), influxDB, queryApi, readTelemetry(), writeApi (+7 more)

### Community 4 - "bridge.js"
Cohesion: 0.07
Nodes (27): client, createSession(), endSession(), exportSessionCsv(), getSessionData(), prisma, getSessionTelemetry(), connectMqtt() (+19 more)

### Community 5 - "platform-service/package.json"
Cohesion: 0.06
Nodes (40): author, dependencies, cors@^2.8.5, dotenv@^17.2.3, express@^5.2.1, @influxdata/influxdb-client@^1.35.0, jsonwebtoken@^9.0.3, mqtt@^5.15.0 (+32 more)

### Community 6 - "20260120083600_init_platform_v1/migration.sql"
Cohesion: 0.18
Nodes (21): "device_profiles", device_profiles_profile_id_key, "devices", devices_project_id_device_name_key, "labels", labels_name_key, "project_users", "projects" (+13 more)

### Community 7 - "ingest-service/package.json"
Cohesion: 0.08
Nodes (31): author, dependencies, body-parser@^2.2.2, cors@^2.8.5, dotenv@^17.2.3, express@^5.2.1, @influxdata/influxdb-client@^1.35.0, mqtt@^5.14.1 (+23 more)

### Community 8 - "คู่มือการทำงานและการรันระบบ Omni Project (ฉบับปรับปรุง Data Flow)"
Cohesion: 0.08
Nodes (24): 1. `omni-back-end/serial-bridge`, 1. ภาพรวมระบบ (Architecture Overview), 2. `omni-back-end/platform-service`, 2. ขั้นตอนการรันระบบ (Step-by-Step), 3. `omni-back-end/ingest-service` (ตัวเสริม), 3. เจาะลึก Data Flow (ข้อมูลวิ่งยังไง?), 4. โครงสร้าง Database ใหม่ (หลังจากลบ Project), 5. Git Commit Summary (สำหรับใช้งาน) (+16 more)

### Community 9 - "platform-service/index.js"
Cohesion: 0.16
Nodes (9): app, io, mqttClient, server, authenticateToken(), requireRole(), router, router (+1 more)

### Community 11 - "0009 — Use .agents for project agent configuration"
Cohesion: 0.22
Nodes (9): 0009 — Use .agents for project agent configuration, 2026-10-26 — Directory consolidation, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 12 - "omni-back-end/package.json"
Cohesion: 0.18
Nodes (10): author, description, keywords, license, main, name, scripts, test (+2 more)

### Community 13 - "tugAssessment.jsx"
Cohesion: 0.10
Nodes (53): App(), LegacyAssessmentRedirect(), CameraFrame(), EvidenceViewer(), Heatmap(), AssessmentTable(), Badge(), Empty() (+45 more)

### Community 16 - "test_influx.js"
Cohesion: 0.14
Nodes (8): client, testPoint, writeApi, getDeviceTelemetry(), prisma, getRecentTelemetry(), influxDB, queryApi

### Community 17 - "ref_dotenv"
Cohesion: 0.14
Nodes (5): queryApi, prisma, bcrypt@^6.0.0, prisma, bcrypt

### Community 19 - "DESIGN.md"
Cohesion: 0.08
Nodes (23): Buttons, Cards, Clinical & Functional Accents, Colors, Components, Do's, Do's and Don'ts, Don'ts (+15 more)

### Community 20 - "🌐 Omni Project: Backend API & Service Documentation"
Cohesion: 0.13
Nodes (14): 🔑 1. Authentication (ยืนยันตัวตน), 1. Prerequisites (สิ่งที่ต้องมี), 👥 2. User & Admin Management, 2. ตั้งค่า Environment Variables (.env), 📟 3. Device Management (จัดการอุปกรณ์), 3. รันโปรแกรม (Running), 🔌 API Documentation, 📌 Database Schema (Postgres) (+6 more)

### Community 21 - "Ingest Service Documentation"
Cohesion: 0.14
Nodes (13): 1. Prerequisites, 2. Configuration (`.env`), 3. Installation & Run, 🔌 API Documentation, 🏗️ Architecture, 📁 File Structure, 🚀 Getting Started, Ingest Service Documentation (+5 more)

### Community 22 - "Omni Serial Bridge: Developer Guide & Workflow"
Cohesion: 0.15
Nodes (12): ✅ 1.1 ระบบ Auto-Discovery, ✅ 1.2 ระบบ Dynamic Matrix Parsing, 1. สิ่งที่ทีม Backend ทำไปแล้ว (Latest Updates), 2. ไม่มี Hardware? ไม่ต้องห่วง! (Mock Device Simulator) 🛠️, 3. Workflow การเพิ่มอุปกรณ์ใหม่ (Step-by-Step), 4. ตัวอย่างโค้ด Arduino (.ino), 5. UI Mapping Reference, Omni Serial Bridge: Developer Guide & Workflow (+4 more)

### Community 23 - "data.jsx"
Cohesion: 0.50
Nodes (3): deviceProfiles, sessionEvents, users

### Community 24 - "2. วิธีการใช้งาน (User Guide)"
Cohesion: 0.17
Nodes (11): 1. ภาพรวม (Overview), 2.1 การเริ่มบันทึก (Start Recording), 2.2 การหยุดบันทึก (Stop Recording), 2.3 การดูประวัติย้อนหลัง (View History), 2.4 การดาวน์โหลดข้อมูล CSV (Export Data), 2. วิธีการใช้งาน (User Guide), 3.1 Database Schema (PostgreSQL), 3.2 Backend API (Platform Service) (+3 more)

### Community 25 - "Omni Project Frontend (ส่วนหน้าบ้าน)"
Cohesion: 0.20
Nodes (9): 1. ติดตั้ง Dependencies, 2. รันโหมด Development, 3. Build สำหรับ Production, 4. ตรวจสอบ Code (Linting), Omni Project Frontend (ส่วนหน้าบ้าน), 📦 การติดตั้งและเริ่มต้นใช้งาน (Getting Started), 🚀 เกี่ยวกับโปรเจกต์, 🛠 เทคโนโลยีที่ใช้ (Tech Stack) (+1 more)

### Community 28 - "Repository Guidelines"
Cohesion: 0.18
Nodes (11): Architecture Decision Records — Mandatory Coding Task Completion, Build, Test, and Development Commands, Codebase Knowledge Graph (`graphify`), Coding Style & Naming Conventions, Commit & Pull Request Guidelines, Design System & UI Consistency (`DESIGN.md`), Mandatory Rules for AI Agents:, Project Agent Configuration Directory (+3 more)

### Community 29 - "Fall Risk Software"
Cohesion: 0.25
Nodes (8): Documentation, Fall Risk Software, Getting Started, License, Prerequisites, Project Structure, Running the Backend, Running the Frontend

### Community 30 - "InfluxDB Integration Guide"
Cohesion: 0.25
Nodes (7): 1. การทำงาน (Pipeline), 2. การตั้งค่า (.env), 3. Data Schema, 4. การดูข้อมูล (Querying), 5. ขั้นตอนการรันระบบ (Startup Sequence), API Endpoint, InfluxDB Integration Guide

### Community 32 - "Project agent configuration"
Cohesion: 0.67
Nodes (3): Graphify migration — 26 October 2026, Hook loading and execution, Project agent configuration

### Community 33 - "TUG staff workspace prototype"
Cohesion: 0.40
Nodes (5): Demonstration scenarios, Local data and boundaries, Run and explore, TUG staff workspace prototype, Validation record — 26 October 2026

### Community 34 - "0001 — Adopt version-controlled ADRs with mandatory maintenance"
Cohesion: 0.22
Nodes (9): 0001 — Adopt version-controlled ADRs with mandatory maintenance, 2026-10-26 — Initial record, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 36 - "0002 — Reuse the existing application foundations"
Cohesion: 0.22
Nodes (9): 0002 — Reuse the existing application foundations, 2026-10-26 — Initial record, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 37 - "0003 — Separate telemetry ingestion from the platform API"
Cohesion: 0.22
Nodes (9): 0003 — Separate telemetry ingestion from the platform API, 2026-10-26 — Initial record, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 38 - "0004 — Separate relational metadata from time-series telemetry storage"
Cohesion: 0.22
Nodes (9): 0004 — Separate relational metadata from time-series telemetry storage, 2026-10-26 — Initial record, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 39 - "0005 — Use one staff workspace for recording and clinical review"
Cohesion: 0.22
Nodes (9): 0005 — Use one staff workspace for recording and clinical review, 2026-10-26 — Initial record, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 40 - "0006 — Isolate the UI prototype from live integrations"
Cohesion: 0.22
Nodes (9): 0006 — Isolate the UI prototype from live integrations, 2026-10-26 — Initial record, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 41 - "0007 — Link participants, assessments, attempts, and evidence by stable IDs"
Cohesion: 0.22
Nodes (9): 0007 — Link participants, assessments, attempts, and evidence by stable IDs, 2026-10-26 — Initial record, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 42 - "0008 — Preserve approved assessment revisions when creating amendments"
Cohesion: 0.22
Nodes (9): 0008 — Preserve approved assessment revisions when creating amendments, 2026-10-26 — Initial record, Alternatives, Consequences, Context, Decision, Implementation and verification, Sources (+1 more)

### Community 43 - "NNNN — Imperative decision title"
Cohesion: 0.22
Nodes (9): Alternatives, Consequences, Context, Decision, Implementation and verification, NNNN — Imperative decision title, Sources, Status (+1 more)

### Community 44 - "Architecture Decision Record index"
Cohesion: 0.29
Nodes (7): Architecture Decision Record index, Coding-task history, Collection validation, Decision log, How to read and maintain the log, Open production decisions, Source availability

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Modal()` connect `react` to `DESIGN.md`, `tugAssessment.jsx`?**
  _High betweenness centrality (0.151) - this node is a cross-community bridge._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.07963089542036911 - nodes in this community are weakly interconnected._
- **Why does `Don'ts` connect `DESIGN.md` to `react`?**
  _High betweenness centrality (0.147) - this node is a cross-community bridge._
- **Should `App.jsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10844155844155844 - nodes in this community are weakly interconnected._
- **Should `omni-front-end/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06620209059233449 - nodes in this community are weakly interconnected._
- **Should `api.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12615384615384614 - nodes in this community are weakly interconnected._
- **Should `bridge.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06906906906906907 - nodes in this community are weakly interconnected._