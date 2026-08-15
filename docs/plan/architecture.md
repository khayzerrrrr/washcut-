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
washcut-saas/
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

## 5. Frontend

- SPA React + Vite, proxy `/api` → `localhost:4000`.
- Struktur halaman per role: `login`, `owner/dashboard`, `owner/services`, `owner/bookings`, `owner/customers`, `kasir/checkout`, dst.
- **Diferensiasi vertikal di UI:** komponen `VehicleForm`/`VehicleList` hanya dirender jika `business.type === 'car_wash'`; `HairProfileForm` hanya untuk `barbershop`. Dasar: field `business.type` + konfigurasi modul aktif.
- Design system dari skill `ui-ux-pro-max` / `ui-design` (tokens: warna, spacing, tipografi).

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

## 7. Keamanan

- JWT access token (short) + refresh token (long), disimpan httpOnly cookie (fase web) / secure storage.
- Role check per endpoint (`requireRole('owner','staff')`).
- **Tenant isolation** diuji dengan 2 tenant berbeda — data tidak boleh bocor (lihat reviewer agent).
- Validasi semua input dengan zod; batasi body size; rate limit login.

## 8. Deployment (target)

- Docker: `api` (Node) + `web` (static build via Nginx) + `db` (PostgreSQL).
- Host murah: VPS tunggal atau Railway/Render untuk MVP.
- Env vars: `DATABASE_URL`, `JWT_SECRET`, `PORT`, `DEEPSEEK_API_KEY` (bukan di repo).

## 9. Skalabilitas (nanti, bukan sekarang)

- Cache (Redis) untuk katalog/booking hotspot.
- Pemisahan read replica untuk laporan.
- Per-tenant schema bila satu tenant sangat besar.