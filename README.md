# Quantiri – AI-Powered SaaS Analytics Dashboard

Quantiri is a modern **SaaS subscription dashboard** with a built-in **AI data assistant**.  
It allows users to upload CSV datasets, chat with their data in natural language,  
and build collaborative real-time dashboards with smart analytics insights.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with React 19  
- **Language:** TypeScript 5  
- **Styling:** Tailwind CSS 4 + shadcn/ui  
- **State Management:** Zustand + TanStack Query  
- **Charts:** Recharts  
- **Database:** PostgreSQL (Neon) with Prisma ORM  
- **Realtime:** Socket.io  
- **AI:** Groq API integration  
- **Hosting:** Vercel  

---

## ⚡ Getting Started

Follow these steps to set up the project locally:

# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/quantiri.git
cd quantiri

# 2. Install dependencies (using pnpm)
pnpm install

# 3. Database setup (Neon Postgres + Prisma)
pnpm db:push      # Push schema to database
pnpm db:studio    # Open Prisma Studio

# 4. Run the development server
pnpm dev