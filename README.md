<style>
  @import url('https://fonts.googleapis.com/css2?family=Racing+Sans+One&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Racing Sans One', cursive, sans-serif !important;
    color: #ff2800;
    letter-spacing: 0.8px;
  }
</style>

<div align="center">

  <img src="frontend/public/image.png" alt="F1 Combined Logo" width="180" style="margin-bottom: 16px;" />

  <h1 style="font-family: 'Racing Sans One', cursive, sans-serif; font-size: 2.8rem; color: #ff2800; letter-spacing: 1px; margin-bottom: 0;">
    F1 COMBINED
  </h1>
  <h3 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ffffff; margin-top: 4px; font-weight: 400;">
    ENGINEERING ANALYTICS & RACE INTELLIGENCE PLATFORM
  </h3>

  <p style="font-family: 'Inter', sans-serif; font-size: 1.05rem; color: #a0a0a0; max-width: 680px; margin: 12px auto 24px auto; line-height: 1.5;">
    An enterprise-grade Formula 1 analytics workspace delivering post-race intelligence, 2026 World Championship standings, circuit guides, and driver performance comparisons.
  </p>

  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

</div>

---

<h2 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ff2800; letter-spacing: 0.8px;">
  Key Features
</h2>

- ![Standings](https://img.shields.io/badge/Standings-WDC%20%26%20WCC-ff2800?style=flat-square) **2026 World Championships**: Live standings and points breakdowns for the World Drivers' Championship (WDC) and World Constructors' Championship (WCC).
- ![Calendar](https://img.shields.io/badge/Schedule-Grand%20Prix-0090ff?style=flat-square) **Grand Prix Race Calendar & Session Results**: Schedule and classification results for all 2026 Grand Prix weekends.
- ![Avatars](https://img.shields.io/badge/Avatars-24%20Driver%20Grid-00d2be?style=flat-square) **24-Driver Grid & Cloud Sync**: Full 2026 driver grid avatar selection synchronized to Firebase Cloud Firestore.
- ![Tracks](https://img.shields.io/badge/Tracks-Circuit%20Maps-b33bff?style=flat-square) **Circuit Intelligence**: Track dimensions, lap records, location maps, and weather conditions for all 2026 calendar circuits.
- ![Analytics](https://img.shields.io/badge/Analytics-Compare%20Engine-ffcc00?style=flat-square) **Performance Comparison Engine**: Interactive side-by-side driver statistics and constructor head-to-head metrics.

---

<h2 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ff2800; letter-spacing: 0.8px;">
  Architecture & Tech Stack
</h2>

```text
F1Combined Monorepo
├── frontend/             # Next.js 16 App Router Frontend (Port 3000)
├── backend/              # Node.js + Express API Backend (Port 3001)
└── packages/shared/      # Shared TypeScript data models and interfaces
```

<h3 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ffffff; font-weight: 400; letter-spacing: 0.5px; margin-top: 16px;">
  Stack Highlights
</h3>

- **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript, CSS Modules, ECharts, TanStack Query.
- **Backend**: Node.js, Express.js, TypeScript, Nodemon, CORS.
- **Database & Auth**: Firebase Authentication (Google OAuth + Email/Password), Cloud Firestore.

---

<h2 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ff2800; letter-spacing: 0.8px;">
  Getting Started
</h2>

<h3 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ffffff; font-weight: 400; letter-spacing: 0.5px;">
  1. Prerequisites
</h3>

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

<h3 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ffffff; font-weight: 400; letter-spacing: 0.5px;">
  2. Installation & Setup
</h3>

```bash
# Clone repository
git clone https://github.com/piyush112007/F1Combined.git
cd F1Combined

# Install workspace dependencies
npm install

# Setup environment
cp frontend/.env.example frontend/.env.local
```

<h3 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ffffff; font-weight: 400; letter-spacing: 0.5px;">
  3. Running Development Server
</h3>

```bash
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`

---

<h2 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ff2800; letter-spacing: 0.8px;">
  Production Build
</h2>

```bash
npm run build
```

---

<h2 style="font-family: 'Racing Sans One', cursive, sans-serif; color: #ff2800; letter-spacing: 0.8px;">
  License
</h2>

This repository is licensed under the MIT License.
