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
| v0.1 | Skeleton monorepo + AI agents + dokumen plan | ✅ terpasang |
| v0.2 | **Frontend-first**: design system + UI lengkap (login, dashboard, services, customers, bookings, checkout) + mock data + PWA-ready | 🔜 berikutnya |
| v0.3 | Backend: auth + tenant + services + customers + bookings; hubungkan ke frontend | todo |
| v0.4 | Kasir & pembayaran + dashboard data real | todo |
| v0.5 | Laporan + notifikasi reminder | todo |
| v0.6 | Membership car wash + paket barbershop | todo |
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