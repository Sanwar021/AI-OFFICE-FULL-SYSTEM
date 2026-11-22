# 🏢 AI OFFICE — Autonomous 3D Virtual Workspace
### A Fully Interactive 3D Virtual Office Powered by 8 Autonomous AI Specialists and Google Gemini

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black.svg?logo=three.js&logoColor=white)](https://threejs.org/)
[![React Three Fiber](https://img.shields.io/badge/R3F-9.0-white.svg)](https://docs.pmnd.rs/react-three-fiber)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.0%20Flash-4285f4.svg?logo=google&logoColor=white)](https://ai.google.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.0-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/State-Zustand-orange.svg)](https://github.com/pmndrs/zustand)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

---

## 1. Executive Overview

**AI OFFICE** is a production-grade, interactive 3D virtual workspace where eight autonomous AI employees operate as a real corporate business team. Users can assign targeted micro-tasks to individual specialists or provide broad strategic business objectives.

When an objective is assigned:
1. **Emma Taylor (Chief of Staff)** analyzes the requirements, formulates a multi-step execution plan, and divides work into a dependency graph (DAG).
2. The AI specialists receive their assigned subtasks and physically work at their workstations in the 3D office.
3. Specialists stream code, draft copy, analyze market data, and generate deliverables directly onto their **live 3D desktop monitors**.
4. When assistance or review is required, employees walk between desks to hand over documents.
5. Completed deliverables appear as physical 3D paper stacks on desks and in the **Deliverable Inspector** for human review, approval, and 1-click download.

---

## 2. Visual Architecture & 3D Procedural Modeling

The 3D office environment is procedurally modeled with Three.js geometry, physically-based materials (PBR), and real-time lighting—closely recreating a modern executive corporate office.

```
                           [ SKYLINE & SUN GLARE ]
    +-------------------------------------------------------------+
    |  MASSIVE FLOOR-TO-CEILING GLASS CURTAIN WALL (Windows)      | [Potted Fiddle-Leaf Fig]
    +-------------------------------------------------------------+
    |                                                             |
    |      [Desk Pod 2: James, Isabella, Noah, Emma]              |
    |                  === Linear LED Light ===                   |
    |                                                             |
    |      [Desk Pod 1: Alex, Olivia, Ethan, Sophia]              |
    |                  === Linear LED Light ===                   |
    |                                                             |
    +-------------------------------------------------------------+
    |  DARK CHARCOAL CABINETRY WALL | Shelving | 65" Task Board   |
    +-------------------------------------------------------------+
```

### Architectural Details:
- **Floor-to-Ceiling Glass Curtain Wall**: Runs along the perimeter with structural columns, horizontal transom mullions, glass physical refraction (`ior: 1.5`), and daylight sun glare.
- **Exterior Skyline**: Crisp daylight cityscape with adjacent modern glass architecture.
- **Dark Charcoal Cabinetry Feature Wall**: Situated on the perimeter featuring recessed warm-LED display shelving, categorized document binders, books, ceramic vases, and a **65" Wall Task Board**.
- **Modern Desk Pods**: Pure white beveled tabletops with inverted silver chrome A-frame legs, modesty cable trays, black executive leather desk blotters, silver keyboards, and optical mice.
- **Ergonomic Mesh Task Chairs**: Black contoured breathable mesh backrests with chrome lumbar bars, pneumatic gas-lift cylinders, and 5-star polished chrome spider bases with dual casters.
- **Suspended Linear Pendant Lights**: Minimalist white linear LED fixtures suspended along the desk rows by chrome aircraft cables.
- **Lush Indoor Flora**: Organic fiddle-leaf fig tree with broad scallop-edged leaves in a glazed white ceramic pot by the window.
- **Under-Desk Accessories**: Executive paper shredders with chrome viewing windows, leather document bags, ceramic coffee mugs, and pen cups.

---

## 3. The 8 Autonomous AI Specialists

| Avatar | Specialist Name | Role | Core Capabilities |
|:---:|:---|:---|:---|
| <span style="color:#10b981">●</span> **AM** | **Alex Morgan** | GTM Engineer | Designs Go-To-Market strategies, launch roadmaps, ICP segmentation, and weekly launch scorecards. |
| <span style="color:#2563eb">●</span> **OC** | **Olivia Chen** | SEO/AEO Specialist | High-intent keyword clustering, search intent mapping, and Answer Engine Optimization for Perplexity & Gemini. |
| <span style="color:#6366f1">●</span> **EB** | **Ethan Brooks** | Web Development Engineer | Fullstack software architecture, TypeScript, React, Node.js code generation, and dependency audits. |
| <span style="color:#f43f5e">●</span> **SP** | **Sophia Parker** | Social Media Manager | Multi-channel social strategies (X/Twitter, LinkedIn), viral hooks, editorial calendars, and community playbooks. |
| <span style="color:#f59e0b">●</span> **JW** | **James Wilson** | Advertisement Manager | Performance paid acquisition across Google & Meta Ads, ROAS optimization, and ad copy variants. |
| <span style="color:#0d9488">●</span> **IR** | **Isabella Reed** | Enterprise Sales Executive | Account prospecting, enterprise account intelligence, cold outreach sequences, and objection-handling scripts. |
| <span style="color:#14b8a6">●</span> **ND** | **Noah Davis** | Customer Satisfaction Specialist | Ticket sentiment analysis, empathy-first response drafts, recurring complaint diagnosis, and churn playbooks. |
| <span style="color:#8b5cf6">●</span> **ET** | **Emma Taylor** | Chief of Staff | Central team orchestrator. Deconstructs objectives into subtasks, delegates to specialists, and compiles morning briefs. |

---

## 4. Key Interactive Features

### 1. Watch AI Employees Physically Work in 3D
- **Natural Seated Avatars**: Employees are seated comfortably in ergonomic chairs facing their monitors, with arms resting horizontally on desks and fingers typing on keyboards.
- **Dynamic 1024×640 Screen Textures**: Each desktop monitor displays a real-time canvas texture streaming live code, Gemini token output, and task progress bars.
- **Physical Deliverable Paper Stacks**: 3D document dossiers with silver binder clips appear on desks as specialists complete assignments.
- **Smart Staggered 3D Nameplates**: Floating badges are vertically staggered by desk row so that every specialist's name and role tag remains 100% visible and readable from any camera angle without occlusion.

### 2. Autonomous Multi-Step Objective Planning
- When assigned a broad company goal (e.g., *"Launch an enterprise B2B campaign"*), Victoria Sterling (Chief of Staff) automatically drafts an execution plan, identifies dependencies, and schedules parallel specialist execution.

### 3. Human Approval Gateway
- High-risk external actions (such as deploying public websites, sending marketing blasts, or charging ad budgets) are routed to the **Approval Gateway** modal, giving the human manager final approve/reject control.

### 4. Scheduled Routines & Morning Briefing
- Configurable automated cron routines (e.g., daily 9:00 AM status summaries or weekly SEO audits) automatically execute in the background and archive results for inspection.

### 5. Interactive 65" Wall Task Board
- Mounted directly in the 3D office on the cabinetry feature wall, the real-time canvas Kanban display shows columns for **QUEUED**, **RUNNING**, **APPROVAL**, and **COMPLETED** tasks.

### 6. Figma-Grade Collapsible UI
- **Left Sidebar (AI Team Roster)**: One-click collapse button (`<`) tucks the roster into a sleek **56px vertical icon rail** with 8 agent avatar dots, opening the 3D office to a full widescreen view.
- **Right Sidebar (Task Inspector)**: Minimizes into a floating glass pill (`[MV] Marcus Vance <`). When opened, offers tabs for **Live Terminal** (with 1-click **Copy**), **Deliverables** (with 1-click **Download .MD**), and **Specialist Profile**.
- **Top Navigation Bar**: Floating glass bar with brand badge, approval counts, lighting mode toggle, and camera controls.
- **Bottom Status Dock**: Floating dock displaying real-time orchestration pulse and morning routine shortcuts.

### 7. Camera Navigation Modes
- **Overview**: Architectural wide-angle perspective matching the reference office.
- **Team View**: Close isometric angle focusing on active workstations.
- **Follow Desk**: First-person camera following the selected employee's monitor.
- **360° Cinematic Tour**: Smooth auto-orbiting cinematic camera that gracefully circles the office.

---

## 5. Technology Stack

### Frontend & 3D Engine
- **Framework**: React 19, TypeScript
- **Bundler**: Vite
- **3D Graphics**: Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`)
- **Styling**: Tailwind CSS v4, Lucide React Icons
- **State Management**: Zustand
- **Real-Time Streaming**: Server-Sent Events (SSE)

### Backend & AI Engine
- **Runtime**: Node.js, Express, TypeScript
- **AI Model**: Google Gemini (`@google/genai` with `gemini-2.0-flash` / `gemini-3.8-flash`)
- **Database**: SQLite (`better-sqlite3`) with WAL journal mode
- **Scheduler**: Node-Cron (`node-cron`) for automated office routines

---

## 6. Project Structure

```
PROJECT AI OFFICE/
├── client/                      # Frontend Application (Vite + React + Three.js)
│   ├── src/
│   │   ├── components/          # Figma-Grade UI Components
│   │   │   ├── modals/          # Task, Plan, Approval, Routine, Settings Modals
│   │   │   ├── EmployeeSidebar.tsx  # Collapsible Team Roster & Minimal Rail
│   │   │   ├── Navbar.tsx           # Floating Glass Navigation & Camera Rig
│   │   │   └── TaskInspector.tsx    # Live Terminal, Deliverables & Copy/Download
│   │   ├── hooks/               # useSSE Real-time Synchronization
│   │   ├── scene/               # Three.js Procedural 3D Virtual Office
│   │   │   ├── CameraRig.tsx        # OrbitControls & Cinematic 360° Tour
│   │   │   ├── CharacterAvatar.tsx  # Humanoid Seated Avatars & Floating Badges
│   │   │   ├── Lighting.tsx         # Sun Glare, Ambient & Directional Lighting
│   │   │   ├── OfficeProps.tsx      # Desks, Mesh Chairs, Cabinet Wall & Flora
│   │   │   ├── OfficeScene.tsx      # R3F Master Office Canvas
│   │   │   ├── RoomArchitecture.tsx# Windows, Ceilings, Skylines & Baseboards
│   │   │   ├── textures.ts          # High-Res Screen Textures, Flooring & Skyline
│   │   │   └── WallTaskBoard.tsx    # 65" Wall-Mounted Real-Time Task Board
│   │   ├── store/               # Zustand Global State Management
│   │   ├── types/               # TypeScript Interfaces & Definitions
│   │   ├── App.tsx              # Application Root & Responsive Overlays
│   │   └── index.css            # Tailwind & Typography Configuration
│   └── vite.config.ts           # Vite Config (Port 5174 + API Proxy)
├── server/                      # Backend API & AI Orchestration Server
│   ├── src/
│   │   ├── db/                  # SQLite Database Schema & Migrations
│   │   ├── routes/              # Express API Routes (Tasks, Plans, Approvals)
│   │   ├── services/            # Gemini AI Engine & Chief of Staff Planner
│   │   └── index.ts             # Server Entry (Port 3002 + SSE Hub)
│   └── package.json
├── make/                        # Figma Make & Preview Runner Scripts
├── scripts/                     # Automated QA & Puppeteer Responsive Test Suite
│   ├── capture.js               # Multi-Viewport Automated Capture Suite
│   └── test_views.cjs           # Inspector & Cinematic View Verification
├── package.json                 # Root Monorepo Scripts
└── README.md                    # Project Documentation
```

---

## 7. Getting Started

### Prerequisites
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- A valid **Google Gemini API Key** (from [Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Sanwar021/AI-OFFICE-FULL-SYSTEM.git
   cd AI-OFFICE-FULL-SYSTEM
   ```

2. **Install All Dependencies**:
   ```bash
   npm run install:all
   ```

3. **Configure Environment Variables**:
   In `server/.env`:
   ```env
   PORT=3002
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Launch the Application**:
   ```bash
   npm run dev
   ```
   - **Frontend UI & 3D Scene**: `http://localhost:5174`
   - **Backend API & SSE Engine**: `http://localhost:3002`

---

## 8. Responsive Design & Viewport QA

The application has been tested and verified across 9 distinct device viewports with **zero horizontal scrolling** and accessible 44×44px touch targets:

| Device Category | Resolution | Layout Adaptation | Status |
|:---|:---|:---|:---:|
| **Small Mobile** | 320 × 740 | Drawer roster, single-cycle camera button, touch controls | **PASS** |
| **Standard Mobile** | 360 × 800 | Full-screen 3D view, bottom action sheet | **PASS** |
| **Modern Mobile** | 390 × 844 | Bottom control pill, compact badges | **PASS** |
| **Large Mobile** | 430 × 932 | High-DPI badges, bottom floating bar | **PASS** |
| **Tablet Portrait** | 768 × 1024 | Slide-over inspector, icon bar | **PASS** |
| **Tablet Landscape**| 1024 × 768 | Segmented camera controls, collapsible roster | **PASS** |
| **Laptop Desktop** | 1280 × 800 | Full UI, widescreen 3D office | **PASS** |
| **Large Desktop** | 1440 × 900 | Complete dashboard, collapsible rail, Inspector | **PASS** |
| **4K Ultra-Wide** | 1920 × 1080 | Ultra-high definition procedural textures | **PASS** |

---

## 9. License

This project is open-source and licensed under the **MIT License**.
