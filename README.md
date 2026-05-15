# ⚔️ Team Shogun - Agency Operations Command Center

<p align="center">
  A production-grade, full-stack SaaS platform designed specifically for tracking, managing, and scaling a high-volume Fiverr Agency team. Built with modern web architecture to provide a stunning, glassmorphic UI alongside robust operational tools.
</p>

<p align="center">
  <strong>Created by Tanveer Ahmed</strong>
</p>

---

## 🚀 Recent Core Upgrades (Production v2.5)
- **⚡ Real-Time Engine (Pusher)**: Full-stack live synchronization. KPIs, charts, and leaderboards update instantly across all sessions.
- **🛡️ Privacy-First Activity**: Role-based visibility for activity feeds. Members see their own actions; Admins manage the entire agency log.
- **📈 Dynamic Performance Logic**: Advanced MongoDB aggregation for real-time leaderboard rankings based on live revenue and stars.
- **🎨 Glassmorphic Modernization**: Synchronized 1600px container layouts across all operational pages with animated mesh-glow backgrounds.
- **📊 Professional Financial Exports**: Modern, styled export engine for operational reports and data snapshots.

## 🌟 Key Features

### 📊 Operations Dashboard (Command Center)
- **Real-Time KPIs**: Live tracking of Total Revenue, Active Orders, and Success Rates with trend indicators.
- **Revenue Growth Chart**: Dynamic visualization of monthly financial trends aggregated from live transactions.
- **Top Performers Widget**: Live leaderboard tracking individual developer points and project volume in real-time.

### 📝 Agile Project Management
- **Status Lifecycle**: Standardized workflow through `Pending`, `WIP`, `Revision`, `Delivered`, `Completed`, and `Cancelled`.
- **Dynamic Time Tracking**: Auto-calculating deadlines with color-coded priority alerts (Green/Yellow/Red).
- **Activity Audit Trail**: Secure, role-filtered history of every project update and status transition.

### 🔒 Enterprise RBAC & Security
- **Admin Command**: Global visibility, user management, project deletion, and financial overrides.
- **Developer Focus**: Secure access to assigned projects with instant status update capabilities.
- **Data Privacy**: Strict row-level security for notifications and activities. Members can only access their personal operational data.

### 👥 Team Performance System
- **Dynamic Leaderboard**: Real-time ranking of team members based on delivered revenue and customer stars.
- **Revenue Targets**: Administrative control panel for setting and monitoring individual monthly revenue goals.
- **Profile Synchronization**: stylized high-fidelity avatars and initials system for consistent professional appearance.

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