<div align="center">

  <img src="frontend/public/image.png" alt="F1 Combined Logo" width="180" />

  ### Engineering Analytics & Race Intelligence Platform

  An enterprise-grade Formula 1 analytics workspace delivering post-race intelligence, 2026 World Championship standings, circuit guides, and driver performance comparisons.

  [![Live Deployment](https://img.shields.io/badge/Vercel-Live%20Demo-00d2be?style=for-the-badge&logo=vercel)](https://f1-combined.vercel.app/)
  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
  [![Express](https://img.shields.io/badge/Express-5.2-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
  [![Firebase](https://img.shields.io/badge/Firebase-Auth%20%26%20Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com/)

</div>

---

## Live Deployment

The platform is deployed live on **Vercel** and accessible worldwide:

-  **Live Application**: [https://f1-combined.vercel.app/](https://f1-combined.vercel.app/)

---

## Key Features

- ![Standings](https://img.shields.io/badge/Standings-WDC%20%26%20WCC-ff2800?style=flat-square) **2026 World Championships**: Live standings and points breakdowns for the World Drivers' Championship (WDC) and World Constructors' Championship (WCC).
- ![Calendar](https://img.shields.io/badge/Schedule-Grand%20Prix-0090ff?style=flat-square) **Grand Prix Race Calendar & Session Results**: Schedule and classification results for all 2026 Grand Prix weekends.
- ![Avatars](https://img.shields.io/badge/Avatars-24%20Driver%20Grid-00d2be?style=flat-square) **24-Driver Grid & Cloud Sync**: Full 2026 driver grid avatar selection synchronized to Firebase Cloud Firestore.
- ![Tracks](https://img.shields.io/badge/Tracks-Circuit%20Maps-b33bff?style=flat-square) **Circuit Intelligence**: Track dimensions, lap records, location maps, and weather conditions for all 2026 calendar circuits.
- ![Analytics](https://img.shields.io/badge/Analytics-Compare%20Engine-ffcc00?style=flat-square) **Performance Comparison Engine**: Interactive side-by-side driver statistics and constructor head-to-head metrics.

---

## Architecture & Tech Stack

```text
F1Combined Monorepo
├── frontend/             # Next.js 16 App Router Frontend (Port 3000)
├── backend/              # Node.js + Express API Backend (Port 3001)
└── packages/shared/      # Shared TypeScript data models and interfaces
```

### Stack Highlights
- **Frontend**: Next.js 16 (Turbopack), React 19, TypeScript, CSS Modules, ECharts, TanStack Query.
- **Backend**: Node.js, Express.js, TypeScript, Nodemon, CORS.
- **Database & Auth**: Firebase Authentication (Google OAuth + Email/Password), Cloud Firestore.

---

## Getting Started

### 1. Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### 2. Installation & Setup

```bash
# Clone repository
git clone https://github.com/piyush112007/F1Combined.git
cd F1Combined

# Install workspace dependencies
npm install

# Setup environment
cp frontend/.env.example frontend/.env.local
```

### 3. Running Development Server

```bash
npm run dev
```

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:3001`

---

## Production Build

```bash
npm run build
```

---

## License

This repository is licensed under the MIT License.
