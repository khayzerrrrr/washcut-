# TECHNOLOGY — WashCut SaaS

> Pilihan stack & alasan. Bacalah bersama `plan.md`, `architecture.md`, `database.md`, `api.md`.
> Aturan: gunakan yang SUDAH terpasang; jangan tambah dependensi tanpa alasan (aturan ponytail).

## 1. Stack Inti

| Lapisan | Teknologi | Versi | Alasan |
|---------|-----------|-------|--------|
| Bahasa | TypeScript | ^5.5 | Satu bahasa FE+BE+shared; kontrak aman |
| Backend | Node.js + Express | Node 24 / Express ^4 | Stabil, banyak docs, sudah terpasang di skeleton |
| Frontend | React + Vite | React 18 / Vite ^5 | Cepat dev, SPA sederhana, sudah terpasang |
| Styling | Tailwind CSS | v4 (nanti) | Utility-first, hemat kode; pakai skill `tailwind-design-system` |
| Database | PostgreSQL + Prisma | (nanti) | Relasional, migrasi aman, type-safe |
| Validasi | zod | ^3.23 | Satu-satunya source of truth validasi, sudah terpasang |
| State FE | React hooks (Context) | — | Cukup untuk MVP; tambah TanStack Query bila perlu |

## 2. Keputusan Terpilih & Catatan

- **Express dipertahankan** dari skeleton (bukan pindah Fastify/Nest) — sederhana, sudah jalan, tidak perlu migrasi.
- **Prisma + PostgreSQL** ditambahkan di milestone v0.2 (sekarang API masih in-memory array). Prisma dipilih: migrasi + tipe otomatis dari schema.
- **Tailwind v4** diadopsi saat mulai styling serius; coret template CSS bawaan Vite.
- **Tanpa Redux** untuk MVP — Context + useReducer cukup. Tambah hanya bila state global meledak.
- **Notifikasi** (P2): WhatsApp via provider (mis. Fonnte/Whapi), email via Resend/Nodemailer — keputusan diundur sampai fitur masuk.
- **Pembayaran** (v0.3): mulai tunai/QRIS manual (catat payment), integrasi Midtrans/Xendit di fase lanjut.

## 3. Versi Terkunci (installed)

- Node.js `v24.19.0` (LTS), npm `11.17.0`
- Express `^4.19.0`, zod `^3.23.0`
- React `^18.3.0`, Vite `^5.4.x`, TypeScript `^5.5.x`
- Python `3.13.15` (hanya untuk skill `ui-ux-pro-max`, bukan runtime aplikasi)

## 4. Konvensi Kode

- TypeScript `strict: true`; `noEmit` di typecheck; module `ESNext`.
- Error response selalu `{ ok: false, error: { code, message } }`.
- Naming: file `kebab-case.ts`; tipe PascalCase; fungsi camelCase.
- Komentar hanya bila diminta user (aturan repo).
- Ikuti tipe dari `@washcut/shared`; jangan duplikasi tipe di FE/BE.

## 5. Tooling & AI

- opencode + DeepSeek (V4 Pro orchestrator, V4 Flash reviewer, free model coder) — lihat `.opencode/agent/*`.
- Skills aktif: `ui-ux-pro-max`, `ui-design`, `ui-styling`, `tailwind-design-system`, `responsive-design`, `react-state-management`, `api-design-principles`, `architecture-patterns`, `postgresql`, `ponytail`, `ponytail-review`.
- Verifikasi wajib sebelum "selesai": `npm run typecheck` && `npm run build`.

## 6. Anti-Aturan (jangan dilakukan)

- Jangan tambah framework UI berat (MUI/Ant) — Tailwind + komponen kecil.
- Jangan buat microservices, K8s, atau message queue di MVP.
- Jangan commit secret (.env, API key) — pakai env var.
- Jangan fork kode per vertikal (barbershop vs car_wash) — gunakan `business.type`.