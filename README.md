# 🏢 PROJECT: AI OFFICE
### A Fully Interactive 3D Virtual Office Powered by 8 AI Employees & Google Gemini

[![React](https://img.shields.io/badge/React-19-blue.svg)](https://react.dev)
[![Three.js](https://img.shields.io/badge/Three.js-r174-black.svg)](https://threejs.org/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-3.8_Flash-orange.svg)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-cyan.svg)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/SQLite-Native_Node_24-lightgrey.svg)](https://nodejs.org/)

---

## 1. Project Overview

**AI OFFICE** is an autonomous 3D virtual office where eight specialized AI employees operate as a real business team. The user can assign individual tasks or input high-level executive business objectives. 

The **Chief of Staff (Victoria Sterling)** intelligently deconstructs the objective into actionable subtasks, assigns the most qualified specialist employees, calculates dependency graphs (DAG) with parallel execution paths, and presents an interactive plan for user approval before execution begins.

The entire workflow is visually rendered in an interactive 3D office matching the visual reference photo, with animated humanoid characters, physical document handoffs between desks, live computer monitor streams, human-in-the-loop approval gateways, and scheduled background routines.

---

## 2. Visual Architecture & 3D Procedural Design

The 3D environment is built procedurally in **Three.js** and **React Three Fiber (R3F)** without static photo textures:
- **Floor-to-Ceiling Windows**: Multi-pane curtain wall with white structural frames, overlooking an adjacent modern glass office facade and daytime city skyline.
- **Natural Corporate Lighting**: Dynamic daylight with warm sun rays and soft PCF contact shadows, switchable to Evening Mode with warm interior fixtures and night cityscape.
- **Ergonomic Workstations**: Two 4-desk pods (8 workstations total) with splayed chrome A-frame legs, cable management trays, black leather desk pads, silver all-in-one desktop monitors (iMac/Studio Display style), and black mesh ergonomic swivel chairs with 5-star chrome bases.
- **Executive Rear Wall**: Dark charcoal/graphite architectural cabinetry with warm shelf lighting, document binders, art books, ceramic decor vases, and a central **65" Wall-Mounted 3D Task Board**.
- **Foliage & Props**: Potted broad-leaf Fiddle Leaf Fig tree in a tapered glossy white ceramic planter by the window, ceramic coffee mugs, pen holders, hardbound notebooks, paper shredders, and briefcases.

---

## 3. The Eight AI Employees

| ID | Name | Role | Color | Responsibilities |
|---|---|---|---|---|
| **emp-1** | Marcus Vance | **GTM Engineer** | Emerald (`#10b981`) | Go-to-market strategies, product launch roadmaps, ICP targeting, outbound sales plays. |
| **emp-2** | Elena Rostova | **SEO/AEO Specialist** | Royal Blue (`#2563eb`) | High-intent keyword research, Answer Engine Optimization (AEO), content briefs. |
| **emp-3** | Liam Chen | **Web Development Engineer**| Indigo (`#6366f1`) | Technical analysis, architectural reviews, fullstack code generation, bug fixing. |
| **emp-4** | Chloe Bennett | **Social Media Manager** | Coral/Rose (`#f43f5e`) | Multi-channel social copy, viral hooks, 30-day editorial calendars. |
| **emp-5** | Alexander Wright | **Advertisement Manager** | Amber (`#f59e0b`) | ROAS analysis, Google & Meta ad copy variants, campaign structures. |
| **emp-6** | Sarah Jenkins | **Sales Executive** | Teal (`#0d9488`) | B2B lead qualification, personalized cold email sequences, objection handling. |
| **emp-7** | David O'Connor | **Customer Satisfaction** | Mint (`#14b8a6`) | Support ticket triage, empathy responses, churn analysis, knowledge-base FAQs. |
| **emp-8** | Victoria Sterling| **Chief of Staff** | Navy/Silver (`#1e293b`) | Central coordinator, task planning, subtask delegation, reviews, morning brief. |

---

## 4. Key Capabilities & Technical Features

- **Google Gemini Official SDK**: Powered by `@google/genai` with streaming responses, function calling, and automated exponential backoff retries.
- **Server-Side Security**: API key is stored strictly on the server (`server/.env` or in-memory settings) and never exposed to the client.
- **Function Calling Tools**:
  - `save_file`: Writes generated documents (`.md`, `.json`, `.txt`) to `/workspace` with directory traversal security.
  - `read_file`: Reads workspace files.
  - `hand_off`: Delegates subtasks to colleagues and triggers the physical 3D walking document handoff in the office.
- **Human Approval Gateway**: Outward-facing business actions (cold emails, public posts, ad budgets, customer replies) are held in `Needs Approval` state until explicit user review.
- **Scheduled Routines (`node-cron`)**: Automated cron jobs for daily morning briefs and recurring business reports.
- **SQLite Database**: Synchronous, persistent storage using Node 24 native `node:sqlite`.
- **Fully Responsive Glassmorphic UI**: Fluid design supporting viewports from 320px mobile to 1920px large desktop.

---

## 5. Installation & Local Setup

### Prerequisites
- **Node.js**: v22.5.0 or higher (v24 recommended for native SQLite).
- **npm**: v10+

### Clone & Install

```bash
git clone https://github.com/Sanwar021/AI-OFFICE-FULL-SYSTEM.git
cd AI-OFFICE-FULL-SYSTEM

# Install root dependencies
npm install

# Install client and server dependencies
npm run install:all
```

### Environment Configuration

Configure `server/.env`:

```env
PORT=3002
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-3.8-flash
MAX_CONCURRENT_TASKS=3
WORKSPACE_DIR=../workspace
```

---

## 6. Running the Application

Start both the backend server and frontend client concurrently:

```bash
npm run dev
```

- **Frontend Client**: `http://localhost:5173`
- **Backend API**: `http://localhost:3002`
- **SSE Stream**: `http://localhost:3002/events`
- **Workspace Deliverables**: `http://localhost:3002/workspace`

---

## 7. How to Add a New AI Employee

1. Open `server/src/db/index.ts` and add the employee to `initialEmployees` with a unique ID, role, avatar color, and detailed system prompt.
2. Open `client/src/store/useOfficeStore.ts` and append the new employee record to `initialEmployees` with designated desk coordinates.
3. Open `client/src/types/office.ts` and add the new role to `EmployeeRole`.

---

## 8. Troubleshooting

- **Gemini Rate Limit / 503**: The server automatically retries with exponential backoff. You can also select other models in Settings.
- **Port Conflict**: Change `PORT` in `server/.env` and update the proxy target in `client/vite.config.ts`.
- **Workspace Files**: Generated deliverables are saved in the root `/workspace` directory and accessible in the Settings file manager.
