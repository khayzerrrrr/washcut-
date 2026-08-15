# WashCut SaaS

Platform SaaS multi-tenant untuk bisnis jasa: **Barbershop** dan **Car Wash**.
Satu kode sumber, core fitur yang sama, tapi tiap bisnis bisa punya konfigurasi & modul yang berbeda.

## Dokumen Plan

Baca dokumen plan sebelum membangun fitur (sumber kebenaran untuk agent AI):

- `docs/plan/plan.md` — visi, fitur, MVP, roadmap
- `docs/plan/architecture.md` — arsitektur sistem & multi-tenancy
- `docs/plan/technology.md` — tech stack & konvensi
- `docs/plan/database.md` — data model & isolasi tenant
- `docs/plan/api.md` — kontrak REST API

## Arsitektur

```
washcut-project/
├── apps/
│   ├── api/        # Backend REST API (Express + TypeScript)
│   └── web/        # Frontend (React + Vite + TypeScript)
└── packages/
    └── shared/     # Tipe & schema bersama (business, booking, service, ...)
```

## Konsep: Satu core, banyak jenis bisnis

| Fitur | Barbershop | Car Wash |
|-------|-----------|----------|
| Booking janji temu | Ya | Ya |
| Manajemen layanan & harga | Ya (potong rambut, styling) | Ya (cuci, detailing) |
| Karyawan / antrian | Ya | Ya |
| Modul khusus | Klien profil & riwayat gaya | Paket & membership kendaraan |

Semua dibedakan lewat field `business.type` (`barbershop` | `car_wash`) dan konfigurasi per tenant.
Modul yang tidak relevan untuk satu jenis bisnis bisa disembunyikan di UI.

## Menjalankan

```bash
npm install          # install semua workspace
npm run dev:api      # API di http://localhost:4000
npm run dev:web      # Web di http://localhost:5173
```

## Next steps

1. Tambah Prisma + database (SQLite untuk dev, PostgreSQL untuk production)
2. Auth multi-role (super admin, owner, staff, customer)
3. Modul payment, reminder, laporan
4. Konfigurasi modul per jenis bisnis