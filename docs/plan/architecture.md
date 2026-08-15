# ARCHITECTURE — WashCut SaaS

> Struktur sistem & keputusan arsitektur. Bacalah bersama `plan.md`, `technology.md`, `database.md`, `api.md`.

## 1. Prinsip

1. **Satu core, banyak vertikal** — modul inti bersama; perbedaan barbershop/car_wash = konfigurasi + data tambahan, bukan fork kode.
2. **Multi-tenant dengan isolasi data** — setiap baris data tenant punya `business_id`; semua query WAJIB menyaring `business_id` dari konteks (token/subdomain).
3. **Modular & terpisah per domain** — tiap modul punya routes, service, validation sendiri.
4. **Monorepo** — kode frontend, backend, dan shared dalam satu repo (npm workspaces).
5. **Sederhana dulu, skala nanti** — hindari microservices/K8s di awal.

## 2. Struktur Repo

```
washcut-project/
├── apps/
│   ├── web/              # Frontend React + Vite (SPA)
│   └── api/              # Backend REST API (Express + TS)
├── packages/
│   ├── shared/           # Tipe & kontrak bersama (Business, Booking, ApiResponse, ...)
│   └── db/               # (nanti) Prisma schema + migrations + seed
├── docs/
│   └── plan/             # Dokumen plan (proteksi anti-hapus)
└── .opencode/            # Konfigurasi AI agents & skills
```

## 3. Model Multi-Tenancy

- **Shared database, shared schema, row-level tenancy** — satu tabel dipakai semua tenant, dibedakan `business_id`. Paling murah & cukup untuk skala awal.
- Identifikasi tenant:
  1. Header `X-Business-Id` (untuk request staff/owner) ATAU
  2. Dari token JWT (role owner/staff melekat ke business) ATAU
  3. Subdomain `nama-bisnis.washcut.app` (fase berikutnya).
- Middleware `requireBusiness()` memuat konteks tenant & memastikan data hanya diakses milik tenant itu.

## 4. Layer Backend (per modul)

```
routes.ts        → validasi zod + mapping HTTP → service
service.ts       → logika bisnis + akses "database" (sementara in-memory, nanti Prisma)
schema (shared)  → tipe kontrak dipakai juga oleh frontend
```

Modul (di `apps/api/src/modules/`):
- `auth` — login, register, refresh token
- `tenancy` — bisnis/tenant (termasuk `type`)
- `services` — katalog layanan
- `customers` — pelanggan (+ `vehicles` untuk car_wash)
- `bookings` — janji temu & status
- `payments` — checkout, invoice, partial
- `staff` — (P2) jadwal & komisi
- `reports` — (P2) agregasi pendapatan
- `notifications` — (P2) reminder WhatsApp/email

**Aturan:** modul inti tidak boleh import logika modul lain langsung; gunakan service publik atau shared. Ini menjaga agar modul car_wash (vehicles) tidak mencemari barbershop.

## 5. Frontend (FRONTEND-FIRST)

- **Fase v0.2 dibangun UI dulu** dengan data mock, sebelum backend nyata — supaya tampilan & alur jelas. Backend dicolok tanpa mengubah tampilan.
- SPA React + Vite, proxy `/api` → `localhost:4000`.
- Struktur halaman per role: `login`, `owner/dashboard`, `owner/services`, `owner/bookings`, `owner/customers`, `kasir/checkout`, dst.
- **Diferensiasi vertikal di UI:** komponen `VehicleForm`/`VehicleList` hanya dirender jika `business.type === 'car_wash'`; `HairProfileForm` hanya untuk `barbershop`. Dasar: field `business.type` + konfigurasi modul aktif.
- Design system dari skill `ui-ux-pro-max` / `ui-design` (tokens: warna, spacing, tipografi). Mobile-first karena target HP.
- **PWA-ready sejak v0.2**: manifest, theme color, responsive, installable (target iPhone).

## 5b. Distribusi Aplikasi

Satu codebase React → tiga target, semua pakai web build yang sama:

| Target | Teknologi | Catatan |
|--------|-----------|---------|
| iPhone | **PWA** | Install via Safari; gratis, tanpa App Store. Notif via WhatsApp server-side |
| Android | **Capacitor** | `.apk` native, plugin native (FCM, kamera); sideload / Play Store |
| Windows | **Tauri** | `.exe` kecil & ringan (alternatif: Electron) |

Backend API tetap server (wajib). Tambahan build wrapper ada di `apps/desktop` (Tauri) & `apps/mobile` (Capacitor) saat v0.7.

## 6. Alur Utama (contoh: booking + payment)

```
Customer/Staff → POST /api/businesses/:id/bookings
  → validate (zod, slot bebas, durasi) 
  → simpan booking (status pending)
Staff → POST /api/businesses/:id/bookings/:bid/checkout
  → buat invoice
  → POST payment (partial/penuh)
  → booking status → confirmed (lunas) 
  → (nanti) kirim notifikasi
```

## 7. Keamanan & Isolasi Tenant

- JWT access token (short) + refresh token (long), disimpan httpOnly cookie (fase web) / secure storage.
- **Isolasi tenant (anti bocor data):** `businessId` selalu diambil dari **JWT**, bukan URL/body. Middleware `requireTenantAccess` memaksa `token.businessId === :businessId` → beda = **403**. Client tidak bisa mengubah URL untuk mengintip tenant lain. Teruji oleh `npm run verify:isolation -w apps/api` (9 kasus: read, write, checkout silang, staff, tanpa token).
- **Super admin** (pemilik platform) adalah satu-satunya yang bisa membuka `/api/tenants/*` dan menentukan `type` tenant (barbershop / car_wash) lewat `requireSuperAdmin`.
- Role check per endpoint (`owner`/`staff` via token; tenant-scoped data).
- Semua list selalu difilter `businessId === token.businessId` (helper `scoped()`), termasuk di modul services/customers/bookings/payments.
- Validasi semua input dengan zod; batasi body size; rate limit login.
- **Tenant isolation** diuji dengan 2 tenant berbeda — data tidak boleh bocor (lihat `verify-isolation.ts`).

## 8. Deployment (target)

- Docker: `api` (Node) + `web` (static build via Nginx) + `db` (PostgreSQL).
- Host murah: VPS tunggal atau Railway/Render untuk MVP.
- Env vars: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `DEEPSEEK_API_KEY` (bukan di repo).

## 9. Skalabilitas (nanti, bukan sekarang)

- Cache (Redis) untuk katalog/booking hotspot.
- Pemisahan read replica untuk laporan.
- Per-tenant schema bila satu tenant sangat besar.