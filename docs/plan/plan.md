# PLAN — WashCut SaaS

> Produk SaaS multi-tenant untuk bisnis jasa: **Barbershop** dan **Car Wash**.
> Satu core, banyak jenis bisnis. Dokumen ini adalah sumber kebenaran produk & roadmap.
> File lain yang harus dibaca agent sebelum coding: `architecture.md`, `technology.md`, `database.md`, `api.md`.

## 1. Visi & Target Pasar

- Pemilik usaha jasa skala kecil-menengah (barbershop, car wash) yang tidak punya tim IT.
- Model bisnis: SaaS berlangganan (per bulan per bisnis), bukan jual lisensi sekali.
- Nilai jual: semua operasional harian (booking, pelanggan, kasir, laporan) dalam satu dashboard.

## 2. Perbedaan Dua Vertikal

| Aspek | Barbershop | Car Wash |
|-------|-----------|----------|
| Objek layanan | Orang (customer) | Kendaraan (customer + vehicle) |
| Penjadwalan | Slot janji temu per barber + walk-in | Antrian bay/service + booking |
| Item layanan | Potong, styling, perawatan rambut | Cuci, detailing, poles, coating |
| Data khusus | Profil rambut, preferensi gaya, foto | Plat nomor, tipe/merk/kelas kendaraan |
| Paket/langganan | Paket grooming berkala | Membership cuci bulanan/tahunan (unlimited) |
| Proses | Barber mengerjakan customer | Check-in kendaraan, multi-tahap (prewash→wash→dry→QC) |

**Kunci SaaS:** kedua vertikal memakai **modul inti yang sama** (booking, customer, staff, payment, laporan, notifikasi). Yang dibedakan adalah **konfigurasi modul + data spesifik vertikal** lewat field `business.type` (`barbershop` | `car_wash`).

## 3. Fitur (Backlog)

### Modul Inti (dipakai semua tenant)
- [ ] P1 Auth & role: `super_admin`, `owner`, `staff`, `customer`
- [ ] P1 Manajemen bisnis (tenant): pendaftaran, langganan, pengaturan
- [ ] P1 Katalog layanan (nama, harga, durasi, aktif)
- [ ] P1 Booking/janji temu + status flow (pending → confirmed → completed / cancelled)
- [ ] P1 Manajemen customer (profil, riwayat kunjungan)
- [ ] P1 Kasir/checkout & pembayaran (tunai, QRIS, transfer, DP/partial)
- [ ] P2 Manajemen staff (jadwal, komisi)
- [ ] P2 Laporan & dashboard (pendapatan, okupansi, layanan terlaris)
- [ ] P2 Notifikasi reminder (WhatsApp/email) sebelum booking
- [ ] P3 Membership & poin loyalitas
- [ ] P3 Multi-cabang per owner

### Vertikal Barbershop
- [ ] P2 Profil rambut customer (jenis rambut, gaya, catatan)
- [ ] P2 Penugasan barber ke booking
- [ ] P3 Paket grooming berkala

### Vertikal Car Wash
- [ ] P1 Profil kendaraan (plat, merk, kelas) per customer
- [ ] P1 Check-in kendaraan + status proses multi-tahap
- [ ] P2 Membership cuci (unlimited bulanan/tahunan)
- [ ] P2 Antrian bay/penjadwalan slot

## 4. Fase Pertama: FRONTEND-FIRST (dikerjakan sekarang)

Strategi: bangun **tampilan yang bagus dulu** (pakai skill `ui-ux-pro-max`, `ui-design`, `ui-styling`, `tailwind-design-system`) memakai **data contoh (mock)**, supaya visual & alur pengguna jelas sebelum backend dibangun. Backend dicolokkan kemudian tanpa mengubah tampilan.

Urutan build fase pertama (v0.2):
1. **Design system** — warna, spacing, tipografi, komponen dasar (button, card, form, table) + Tailwind.
2. **Landing + Login** — halaman brand WashCut, login owner/staff.
3. **Dashboard owner** — ringkasan hari ini (booking, pendapatan, status) berbasis mock.
4. **Halaman modul** — Services, Customers (+ Vehicles untuk car_wash), Bookings/kalender, Checkout/kasir.
5. **Responsif (mobile-first)** + siap **PWA** (manifest, installable) — karena target iPhone pakai PWA.
6. Diferensiasi vertikal di UI: `business.type` menentukan form/halaman (vehicle vs hair profile).

Semua halaman memakai mock data dari `packages/shared`; diganti ke API nyata di v0.3.

## 5. Roadmap Milestone

| Versi | Isi | Status |
|-------|-----|--------|
| v0.1 | Skeleton monorepo + AI agents + dokumen plan | terpasang |
| v0.2 | **Frontend-first**: design system navy/cyan + landing page 22 section + UI lengkap (login, dashboard, queue, staff, POS, inventory, membership, reports, branches) + mock data | selesai |
| v0.2a | **Auth & isolasi**: login JWT + password, super admin buat tenant + akun owner, akun karyawan (admin/capster/washer), komisi on/off, `requireTenantAccess` | selesai |
| v0.3 | **Wiring backend** — Fase W1–W7 (lihat §9): hubungkan semua modul mock ke backend nyata | berikutnya |
| v0.4 | Persistensi DB (Prisma SQLite/PostgreSQL) + seed menggantikan in-memory | todo |
| v0.5 | Laporan lanjutan + notifikasi reminder (WhatsApp) | todo |
| v0.6 | Membership car wash + paket barbershop (kalau belum selesai di W5) | todo |
| v0.7 | **Distribusi**: PWA (iOS) + Capacitor Android (.apk) + Tauri desktop (.exe) | todo |
| v1.0 | Beta multi-tenant aman (isolasi data + subscription billing) | todo |

## 6. Distribusi Aplikasi

Satu codebase (React), tiga target — semua memakai web build yang sama:

| Target | Teknologi | Catatan |
|--------|-----------|---------|
| iPhone | **PWA** | Install dari Safari (Add to Home Screen); gratis, tanpa App Store. Notif via WhatsApp server-side |
| Android | **Capacitor** | Bungkus web build jadi `.apk` native; sideload atau Play Store nanti |
| Windows | **Tauri** | `.exe` kecil & ringan (alternatif: Electron) |

Backend API tetap server (wajib). PWA siap sejak v0.2 (manifest + service worker).

## 7. Kriteria "Done" per Fitur (dipakai approver)

- Typecheck & build lolos (`npm run typecheck`, `npm run build`).
- API memakai envelope `ApiResponse<T>` + validasi zod.
- Setiap tabel tenant punya kolom `business_id` (isolasi) & diakses via konteks tenant.
- UI memakai komponen yang sudah ada / design system (lihat `architecture.md`).
- Tidak ada fitur "untuk nanti" tanpa diminta (aturan ponytail).

## 8. Metrik Sukses

- Waktu buat bisnis baru < 2 menit.
- Waktu booking baru < 30 detik.
- Checkout < 15 detik.
- Uptime API ≥ 99%.

---

## 9. Fase Wiring Frontend → Backend (v0.3)

> Tujuan: menghubungkan **semua modul frontend yang sudah jadi** (saat ini sebagian besar masih pakai mock di `apps/web/src/lib/api.ts`) ke backend nyata `apps/api`, sambil melengkapi model data & endpoint. UI frontend TIDAK diubah tampilannya — hanya sumber datanya diganti dari mock ke API (prinsip frontend-first).

### 9.1 Kondisi saat ini (baseline)

| Lapisan | Sudah terhubung (backend nyata) | Masih mock |
|---------|-------------------------------|-----------|
| Auth | login (password), `/me`, `/me/businesses` | — |
| Tenancy | list/create/update-status tenant (super admin) | — |
| Akun karyawan | list/create users (admin/capster/washer), komisi get/patch | — |
| Services | — | `listServices`, `createService` |
| Customers & Vehicles | — | `listCustomers`, `listVehicles` |
| Bookings | — | `listBookings`, `createBooking`, `updateBookingStatus` |
| Checkout/POS | — | `listPayments`, produk POS |
| Queue | — | `listQueue`, `updateQueueStatus` |
| Staff performa | — | `listStaff` (revenue/leaderboard) |
| Products & Inventory | — | `listProducts`, `listInventory`, `listInventoryMovements` |
| Membership | — | `listMembers`, `listMembershipPlans` |
| Reports & Branches | — | derivasi mock di Reports.tsx, `listBranches` |

### 9.2 Aturan lintas fase (WAJIB di setiap endpoint baru)

1. **Isolasi**: `businessId` diambil dari **JWT** (bukan URL/body) via `requireTenantAccess`. Tidak boleh ada query yang menyentuh data dua tenant sekaligus.
2. **Kontrak**: validasi zod + envelope `ApiResponse<T>`; tipe entity dari `@washcut/shared` (jangan definisikan ulang).
3. **Order kerja per fase**: (a) definisikan tipe di `packages/shared` → (b) tambah data seed + endpoint backend → (c) ganti fungsi mock di `apps/web/src/lib/api.ts` dengan `authFetch` → (d) sesuaikan halaman kalau field berubah.
4. **UI tidak dirombak**: halaman tetap pakai komponen/design system yang ada; hanya sumber data berubah.
5. **Done criteria**: `npm run typecheck` + `npm run build` lolos, `npm run verify:isolation -w apps/api` tetap 11 PASS, satu smoke test kecil per modul non-trivial.

### 9.3 Fase-fase

#### Fase W1 — Services & Customers (+ Vehicles)
- **Backend**: tambah `PATCH /services/:id` (edit harga/durasi/aktif) dan `DELETE /services/:id` (soft delete). Tambah `PATCH /customers/:id` (edit nama/telepon/notes). Vehicles list/create sudah ada — pastikan `PATCH`/`DELETE` vehicle bila perlu.
- **Frontend**: ganti `listServices`/`createService` → backend, tambah edit/hapus layanan; ganti `listCustomers`/`listVehicles` → backend, tambah edit pelanggan & tambah kendaraan (car_wash).
- **Done**: kelola layanan & pelanggan penuh CRUD dari UI, tersimpan ke backend, terisolasi per tenant.

#### Fase W2 — Bookings & Payments/Checkout (POS)
- **Backend**: bookings list/create/update-status sudah ada — tambah filter `?status=` dan endpoint `cancel`. Checkout/payments sudah ada — pastikan `GET /payments?date=`.
- **Frontend**: ganti `listBookings`/`createBooking`/`updateBookingStatus` → backend; POS (Checkout.tsx) pakai checkout/payments backend (bukan mock), tampilkan sisa tagihan & riwayat pembayaran.
- **Done**: booking + kasir end-to-end nyata (buat booking → checkout → lunas → status confirmed), riwayat pembayaran tersimpan.

#### Fase W3 — Queue & Staff Performa & Komisi
- **Backend**: tambah entitas `queue` (+ `queue_items`) dengan endpoint list & advance status (waiting → in-service → completed → cancelled). Tambah entitas `staff` (profil performa: `user_id`, `name`, `role_title`, `commission_pct`, `revenue`, `services_completed`) terpisah dari `users`; komisi get/patch sudah ada — pastikan terhubung ke `staff.commission_pct`.
- **Frontend**: ganti `listQueue`/`updateQueueStatus` → backend; Staff.tsx leaderboard & kalkulator komisi pakai data `staff` nyata + toggle komisi (sudah ada).
- **Done**: antrian & performa staff berubah status nyata, komisi per staff konsisten dengan toggle owner.

#### Fase W4 — Products & Inventory
- **Backend**: tambah entitas `products`, `inventory`, `inventory_movements` + endpoint (list, create, adjust stock, list movements).
- **Frontend**: ganti `listProducts`/`listInventory`/`listInventoryMovements` → backend; POS katalog produk pakai backend; Inventory.tsx tambah aksi tambah produk & catat pergerakan stok.
- **Done**: stok & pergerakan tersimpan, low-stock konsisten di UI.

#### Fase W5 — Membership
- **Backend**: tambah entitas `membership_plans` + `members` + endpoint (list/create plans, list/enroll members, status aktif/expired).
- **Frontend**: ganti `listMembers`/`listMembershipPlans` → backend; Membership.tsx tambah enrol member & atur plan.
- **Done**: member & plan tersimpan, masa berlaku & poin terhitung nyata.

#### Fase W6 — Reports & Branches
- **Backend**: tambah entitas `branches` + endpoint; tambah endpoint agregasi laporan (`GET /reports/summary?period=`, top services, staff performance, branch performance) — agregasi dari data nyata (bookings/payments), bukan angka palsu.
- **Frontend**: ganti `listBranches` → backend; Reports.tsx & Dashboard pakai endpoint laporan; filter periode (hari/7/30 hari) di backend.
- **Done**: dashboard & laporan menampilkan angka yang dihitung dari transaksi nyata, bukan placeholder.

#### Fase W7 — Expenses, Notifications, Activity Logs (P2)
- **Backend**: tambah entitas `expenses`, `notifications`, `activity_logs` + endpoint (catat pengeluaran, kirim/lihat notifikasi, log aksi penting).
- **Frontend**: Dashboard "Add Expense" pakai backend; notifikasi (bell di topbar) pakai backend; log aktivitas tampil di Settings.
- **Done**: pengeluaran & log tercatat, notifikasi muncul dari data nyata.

### 9.4 Setelah wiring (v0.4 ke atas)
- **Fase W8 (v0.4) — Persistensi DB**: ganti in-memory `db.ts` dengan Prisma (SQLite dev / PostgreSQL prod) + migrasi + seed. Seluruh entitas di atas dipetakan ke tabel sesuai `database.md`.
- **v0.5** — notifikasi reminder WhatsApp + laporan lanjutan.
- **v0.7** — PWA + Capacitor + Tauri (lihat §6).

### 9.5 Pemetaan entitas lengkap (dari spec WASHCUT §30)
| Entitas | Status |
|---------|--------|
| users, businesses, services, customers, vehicles, bookings, payments | sudah (W1/W2 lengkapi CRUD) |
| queues/queue_items, staff, products, inventory/inventory_movements | Fase W3/W4 |
| memberships/membership_plans, branches, reports | Fase W5/W6 |
| expenses, notifications, activity_logs, commissions | Fase W7 (komisi sudah ada) |