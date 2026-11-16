# ⚔️ Team Shogun - Agency Operations Command Center

<p align="center">
  A production-grade, full-stack SaaS platform designed specifically for tracking, managing, and scaling a high-volume Fiverr Agency team. Built with modern web architecture to provide a stunning, glassmorphic UI alongside robust operational tools.
</p>

<p align="center">
  <strong>Created by Tanveer Ahmed</strong>
</p>

---

## 🚀 Recent Core Upgrades (Production v4.0 - Cinematic Edition)

### 💎 Ultra-Premium 3D Visual Experience
*   **Interactive 3D Holographic Hero**: Completely replaced static components with an immersive, hardware-accelerated **Three.js** canvas, featuring a glowing 3D hologram of the Shogun warrior emblem.
*   **GPU-Powered Particle Simulation**: Implemented a highly optimized custom WebGL **GLSL ShaderMaterial** to handle thousands of glowing dust particles directly on the GPU, yielding seamless 60fps performance and eliminating CPU main-thread overhead.
*   **Parallax & Cinematic Controls**: Responsive mouse-tracking camera/rotation inertia (desktop) for a dynamic depth effect. Features a cinematic scaling entrance animation via **GSAP** on load.
*   **Visibility State Awareness**: Seamlessly pauses/resumes the WebGL render loop when the browser tab is hidden (`visibilitychange`), conserving system resources, power, and memory.
*   **Tri-Tone Dynamic Lighting**: Configured emerald-green front lights, cyan rim-back lighting, and deep purple bottom underglow for a cinematic cyberpunk aesthetic.

### 🌟 Premium UX & Interactive Micro-Animations
*   **Animated Social Proof Stats**: A high-impact trust strip detailing active metrics (e.g., 547+ Completed Projects, 5.0★ Rating) with scroll-triggered count-up animations for enhanced credibility.
*   **Interactive Deliverables Accordion**: Reimagined the agency roadmap into an intuitive, custom-built accordion. Users can explore granular phases, specific deliverables, and connecting visual tracks with smooth CSS state transitions.
*   **Interactive Live Demo Panel**: Designed a spring-physics-driven UI showcase utilizing **react-spring** with floating active orbs, magnetic hover buttons, and cursor-sensitive click-ripple effects.
*   **Refinement and Consolidation**: Consolidated routing to present a unified landing experience at `/`, featuring dynamic platform badges, hover-state expansions, and a sleek modern layout.

### ⚡ Resilient Real-Time Sync & Hardened Operations
*   **High-Performance Socket Server**: Real-time operations driven by an internal **Socket.io** server, equipped with a resilient polling fallback ensuring 100% dashboard uptime even when deployed to serverless environments like Vercel.
*   **Tiered Deadline Alerts**: Automated system triggering alert states at **72h (Warning)** and **24h (Critical)** before project deadlines, delivering custom HTML email templates and real-time developer notifications.
*   **SweetAlert2 Dialogs**: Full confirmation dialog coverage for sensitive dashboard tasks, including project deletion, status updating, and role assignments.
*   **Instant Session Hydration**: Real-time user avatar and state propagation across all modules (Sidebar, Header, Profile Manager).

---

## 🛠 Tech Stack

### Frontend & Core Design
*   **Framework**: [Next.js](https://nextjs.org/) (App Router, Server Actions, API Routes)
*   **3D Graphics & Animations**: [Three.js](https://threejs.org/) (WebGL, custom GLSL vertex/fragment shaders), [GSAP](https://gsap.com/), [Framer Motion](https://www.framer.com/motion/)
*   **Styling & UI**: Tailwind CSS v4, [SweetAlert2](https://sweetalert2.github.io/), Lucide Icons
*   **Interactive Physics**: React Spring

### Backend, Database & Orchestration
*   **Real-Time**: Standalone Node.js Express server with Socket.io & WebSocket protocols
*   **Database**: MongoDB + [Mongoose ODM](https://mongoosejs.com/)
*   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
*   **Mailing Service**: Nodemailer integration with dynamic HTML templating
*   **Process Management**: Concurrently orchestration for unified dev scripts

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/TanveerAhmed4545/team-shogun.git
cd team-shogun
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory:

```env
# Database
MONGODB_URI=your_mongodb_uri

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

# Real-Time (Socket.io)
NEXT_PUBLIC_SOCKET_URL=http://localhost:4000
INTERNAL_SOCKET_URL=http://localhost:4000

# Security & Cron
CRON_SECRET=your_cron_secret
```

### 4. Run the Development Server
This single command executes both the **Next.js app** and the standalone **Socket.io event server** concurrently in dev mode.
```bash
npm run dev
```

---

## 📊 Feature Walkthrough

### 1. Operations Command Center
A centralized real-time dashboard displaying active revenue metrics, order quantities, developer point lists, and operational KPIs.

### 2. Agile Project Management
Comprehensive pipelines shifting projects transparently across `Pending`, `WIP`, `Revision`, `Delivered`, `Completed`, and `Cancelled` states. Fully protected by SweetAlert confirmation logic and automated 72h/24h warning triggers.

### 3. Strict RBAC System
Granular level system separating Admins, Developers, Clients, and Pending users with robust row-level security over sensitive data collections.

---

## 🔐 Authentication & Roles Matrix

| Feature / Action | Admin | Project Owner / Dev | Standard Member | Pending User |
| :--- | :---: | :---: | :---: | :---: |
| **Login / Register** | ✅ | ✅ | ✅ | ✅ |
| **View Dashboard** | ✅ | ✅ | ✅ | ❌ |
| **Edit Projects** | ✅ | ✅ | ❌ | ❌ |
| **Delete Projects** | ✅ | ❌ | ❌ | ❌ |
| **Manage Team** | ✅ | ❌ | ❌ | ❌ |
| **Tiered Deadline Alerts**| ✅ | ✅ | ✅ | ❌ |

---

<p align="center">
  Developed with ❤️ by <strong>Tanveer Ahmed</strong>
</p>