# WashCut — Agent Guidelines

WashCut is a multi-tenant SaaS platform for barbershops and car washes. Monorepo:

- `apps/web` — React + Vite + Tailwind v4 frontend
- `apps/api` — Node HTTP API with in-memory DB and JWT auth
- `packages/shared` — shared types and utilities
- `docs/` — architecture, API and design documentation

## Core rules

- Communication language: Indonesian.
- No emojis anywhere in code, docs, or UI. Use SVG icons only (`apps/web/src/components/ui/Icon.tsx`).
- Multi-tenant isolation is mandatory: `businessId` comes from the JWT and must match the URL path; mismatches return 403. Never break this.
- Follow the design system in `docs/design.md` and `design-system/washcut/MASTER.md`.
- Superadmin (platform owner) sets up tenants; regular users belong to exactly one tenant.

<!-- antislop: auto-managed block, do not edit -->
## antislop
For UI, copy, people, or mobile layout work, read `antislop.md` (core) and then the skill for the task:
- UI / visual: `antislop-ui.md`
- Copy & text: `antislop-copywriting.md`
- People: `antislop-human.md`
- Mobile / responsive: `antislop-layoutmobile.md`
Before starting, ask the user when antislop applies: during the work, or after it is done.

The antislop files live in `docs/antislop/`. `docs/design.md` is the project's DESIGN.md (direction).