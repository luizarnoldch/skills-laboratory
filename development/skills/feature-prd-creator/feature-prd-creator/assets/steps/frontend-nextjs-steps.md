# Next.js Fullstack — Steps to Complete

Use 8 parent tasks in this exact order:

- [ ] **1.0 Prisma Schema & Migration**
  Add or update Prisma model. Generate migration with `prisma migrate dev`.

- [ ] **2.0 Zod Schema**
  Define input/output validation schemas matching Prisma model shapes.

- [ ] **3.0 tRPC Router**
  Add queries and mutations under `src/server/routers/`. Validate inputs with Zod.

- [ ] **4.0 TanStack Query & Form Hooks**
  Create query hook for data fetching and form hook for mutations under `src/features/<entity>/hooks/`.

- [ ] **5.0 App Router Pages**
  Add page component under `src/app/`. Keep pages Server Components by default.

- [ ] **6.0 Views, Layouts & Loading**
  Build view layer, loading states, and layout wrappers in `src/features/<entity>/views/`.

- [ ] **7.0 Component UI — Pure Server**
  Build server components for non-interactive UI pieces in `src/features/<entity>/components/`.

- [ ] **8.0 Component Client Islands**
  Extract only interactive pieces into minimal client components with `'use client'`.

Each parent task breaks into sub-tasks with **Context**, **Files**, and **Skills**.

If a step is not needed → mark done, write "not required".
