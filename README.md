# ⚔️ Team Shogun - Agency Operations Command Center

<p align="center">
  A production-grade, full-stack SaaS platform designed specifically for tracking, managing, and scaling a high-volume Fiverr Agency team. Built with modern web architecture to provide a stunning, glassmorphic UI alongside robust operational tools.
</p>

<p align="center">
  <strong>Created by Tanveer Ahmed</strong>
</p>

---

## 🚀 Recent Core Upgrades (Production v3.0 - Hardened)
- **⚡ Resilient Real-Time Sync**: Replaced third-party Pusher with a high-performance internal **Socket.io** server. Integrated a **polling fallback** to ensure 100% dashboard uptime on serverless platforms like Vercel.
- **⏰ Tiered Deadline Alerts**: Automated cron system with **72h (Warning)** and **24h (Critical)** alerts. Includes color-coded email templates and in-app notifications for developers.
- **🛡️ Hardened Administrative Workflows**: Integrated **SweetAlert2** for high-fidelity confirmation dialogs. Implemented strict RBAC enforcement on project deletions and team management.
- **👤 Instant Session Synchronization**: Automatic avatar and profile sync across all dashboard components (Header, Sidebar, Profile) using real-time session hydration.
- **📈 Production-Safe Seeding**: Refactored database maintenance tools to allow for "Safe Seeds" that preserve production data while ensuring core administrative access.

## 🌟 Key Features

### 📊 Operations Dashboard (Command Center)
- **Real-Time KPIs**: Live tracking of Total Revenue, Active Orders, and Success Rates with trend indicators.
- **Revenue Growth Chart**: Dynamic visualization of monthly financial trends aggregated from live transactions.
- **Top Performers Widget**: Live leaderboard tracking individual developer points and project volume in real-time.

### 📝 Agile Project Management
- **Status Lifecycle**: Standardized workflow through `Pending`, `WIP`, `Revision`, `Delivered`, `Completed`, and `Cancelled`.
- **Dynamic Time Tracking**: Auto-calculating deadlines with tiered alerts (72h Email/24h Critical).
- **Activity Audit Trail**: Secure, role-filtered history of every project update and status transition.

### 🔒 Enterprise RBAC & Security
- **Admin Command**: Global visibility, user management, project deletion, and financial overrides.
- **Developer Focus**: Secure access to assigned projects with instant status update capabilities.
- **Data Privacy**: Strict row-level security for notifications and activities.

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Frontend / UI:** React, Tailwind CSS, [Framer Motion](https://www.framer.com/motion/), [SweetAlert2](https://sweetalert2.github.io/)
- **Real-Time:** Socket.io (with internal Polling Fallback for Serverless)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/)
- **Database:** MongoDB (via Mongoose)
- **Deployment:** Vercel

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/TanveerAhmed4545/team-shogun.git
cd team-shogun
```

### 2. Install dependencies
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

### 4. Run the Development Environment
This will start both the **Next.js Dev Server** and the **Standalone Socket.io Server** concurrently.
```bash
npm run dev
```

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