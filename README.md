
# 🏨 Roamio

> AI-powered luxury hotel booking platform for the discerning modern traveller.

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Netlify](https://img.shields.io/badge/Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)

---

## Overview

**Roamio** redefines luxury hospitality by combining cutting-edge AI with an elegant,
seamless booking experience. Built for travellers who expect nothing but the best —
curated stays, personalized recommendations, and effortless reservations at the
world's finest hotels.

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Frontend | React 18 + TypeScript | Type-safe component model |
| Build Tool | Vite 5 | Fast HMR, zero-config build |
| Styling | Tailwind CSS + shadcn/ui | Utility-first, accessible components |
| Routing | React Router DOM v6 | Declarative client-side routing |
| State | Zustand | Lightweight, scalable state |
| Server State | TanStack Query v5 | Smart caching and data fetching |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| Charts | Recharts | Composable React chart library |
| Package Manager | Bun | Ultra-fast installs and scripts |
| Testing | Vitest + Testing Library | Fast unit and integration tests |

---

## Features

- **AI-Powered Recommendations** — Personalized hotel suggestions based on preferences
- **Luxury Hotel Search** — Filter by location, amenities, price, and ratings
- **Seamless Booking Flow** — Streamlined reservation with real-time availability
- **User Authentication** — Secure login and session management
- **Booking Dashboard** — Manage upcoming and past reservations
- **Responsive Design** — Pixel-perfect across all devices

---

## Project Structure
```
roamio/
├── public/                  # Static assets
├── src/
│   ├── components/
│   │   └── ui/              # shadcn/ui base components
│   ├── pages/               # Route-level page components
│   ├── hooks/               # Custom React hooks
│   ├── lib/                 # Utility functions
│   ├── store/               # Zustand state stores
│   ├── types/               # TypeScript type definitions
│   ├── App.tsx              # Root component & routing
│   └── main.tsx             # Application entry point
├── index.html
├── tailwind.config.ts
├── vite.config.ts
└── package.json
```

---

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.0 or Node.js >= 18
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/bhavesh310/roamio.git
cd roamio

# Install dependencies
bun install

# Start development server
bun dev
```

### Available Scripts
```bash
bun dev           # Start dev server → localhost:5173
bun build         # Production build
bun build:dev     # Development build
bun preview       # Preview production build
bun lint          # Run ESLint
bun test          # Run all tests once
bun test:watch    # Run tests in watch mode
```

---

## Environment Variables

Create a `.env` file in the root directory:
```env
VITE_APP_NAME=Roamio
VITE_API_BASE_URL=https://api.roamio.com
VITE_API_KEY=your_api_key_here
```

---

## Deployment

### Deploy to Netlify
```bash
bun build
# Deploy the /dist folder to Netlify
```

[![Deploy with Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

---

## UI Components

Roamio uses [shadcn/ui](https://ui.shadcn.com/) — beautifully designed, accessible
components built on Radix UI and Tailwind CSS.
```bash
# Add new components
bunx shadcn@latest add button
bunx shadcn@latest add card
bunx shadcn@latest add dialog
```

---

## License

This project is **private and proprietary**. All rights reserved.

---

## Author

**Bhavesh Ghatode** — Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/bhavesh-kumar-4466a3276/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)](https://github.com/bhavesh310)

---

<p align="center">
  <i>Built with obsession, not tutorials.</i>
</p>
