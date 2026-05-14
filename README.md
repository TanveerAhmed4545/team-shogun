# ⚔️ Team Shogun - Agency Operations Command Center

<p align="center">
  A production-grade, full-stack SaaS platform designed specifically for tracking, managing, and scaling a high-volume Fiverr Agency team. Built with modern web architecture to provide a stunning, glassmorphic UI alongside robust operational tools.
</p>

<p align="center">
  <strong>Created by Tanveer Ahmed</strong>
</p>

---

## 🚀 Recent Core Upgrades (Production v2.0)
- **⚡ Real-Time Status Sync**: Integrated Pusher for live, cross-device dashboard updates.
- **📜 Activity Audit Logs**: Full accountability with a persistent history of every administrative action.
- **🎨 Modern UI/UX**: Professional skeleton loading states and optimized Next.js image handling for 90+ Lighthouse scores.
- **🔍 Command Center Search**: Global `Ctrl + K` navigation for high-speed operation.


## 🌟 Key Features

### 📊 Real-Time KPI Dashboard
- **Financial Analytics**: Track total earnings, active order values, and completed projects at a glance.
- **Dynamic Charting**: Visual insights into agency performance over time.
- **Activity Feed**: Live timeline of status changes, new orders, and completed work.

### 📝 Agile Project Management (Kanban & Table Views)
- **Order Tracking**: Seamlessly shift between high-density Table View and visual Kanban Boards.
- **Status Lifecycle**: Manage orders through strictly defined phases: `Pending`, `WIP`, `Revision`, `Delivered`, `Completed`, `Cancelled`.
- **Dynamic Time Tracking**: Auto-calculating deadlines with color-coded urgencies (Green, Yellow, Red) based on time remaining.

### 🔒 Enterprise-Grade Role-Based Access Control (RBAC)
Strict security protocols to protect business operations:
- **Administrators**: Full system control. Can delete projects, assign team roles, approve pending accounts, and view global notifications.
- **Project Owners/Developers**: Can edit and update the statuses of the specific projects they are assigned to or have created.
- **Standard Members**: Can view projects and the team roster but are restricted from mutating external data or managing user accounts. Privacy-first notifications ensure members only see their own alerts.

### 👥 Team Roster & Onboarding
- **Account Approvals**: New registrations enter a `Pending` state awaiting Admin approval before they can access the platform.
- **Performance Tracking**: Built-in developer metrics including individual scoreings, project counts, and revenue attribution.

---

## 🛠 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Actions, API Routes)
- **Frontend / UI:** React, Tailwind CSS, [Framer Motion](https://www.framer.com/motion/) (Animations), [shadcn/ui](https://ui.shadcn.com/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Credentials Provider with Role/Status mapping)
- **Database:** MongoDB (via Mongoose)
- **Deployment:** Vercel

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/team-shogun.git
cd team-shogun
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Setup Environment Variables
Create a `.env.local` file in the root directory and configure the following variables:

```env
# Database connection string
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/team-shogun

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_super_secret_string

# Node Environment
NODE_ENV=development
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🔐 Authentication & Roles Matrix

| Feature / Action | Admin | Project Owner / Dev | Standard Member | Pending User |
| :--- | :---: | :---: | :---: | :---: |
| **Login / Register** | ✅ | ✅ | ✅ | ✅ |
| **View Dashboard** | ✅ | ✅ | ✅ | ❌ |
| **View Projects** | ✅ | ✅ | ✅ | ❌ |
| **Edit Projects** | ✅ | ✅ | ❌ | ❌ |
| **Delete Projects** | ✅ | ❌ | ❌ | ❌ |
| **View Team Roster** | ✅ | ✅ | ✅ | ❌ |
| **Approve/Reject Users** | ✅ | ❌ | ❌ | ❌ |
| **Change User Roles** | ✅ | ❌ | ❌ | ❌ |
| **View Global Notifications**| ✅ | ❌ | ❌ | ❌ |

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/your-username/team-shogun/issues).

## 📄 License
This project is proprietary and confidential. Unauthorized copying of this file, via any medium, is strictly prohibited.

---

<p align="center">
  Developed with ❤️ by <strong>Tanveer Ahmed</strong>
</p>