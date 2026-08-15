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

## 4. MVP (Scope pertama yang dikerjakan)

Urutan build untuk MVP — versi `0.x`:

1. **Auth** — register owner, login, JWT.
2. **Tenant** — buat bisnis dengan `type` (barbershop/car_wash), status langganan.
3. **Katalog layanan** — CRUD service per bisnis.
4. **Customer + kendaraan** — CRUD customer; profil kendaraan hanya muncul untuk `car_wash`.
5. **Booking** — buat/list/ubah/cancel; validasi slot & durasi.
6. **Kasir & pembayaran** — checkout booking, catat payment, partial.
7. **Dashboard dasar** — ringkasan hari ini (booking, pendapatan, status).
8. **Laporan** — pendapatan harian/mingguan/bulanan, layanan terlaris.

**Keluar-MVP:** notifikasi, membership, komisi, multi-cabang.

## 5. Roadmap Milestone

| Versi | Isi | Status |
|-------|-----|--------|
| v0.1 | Skeleton monorepo + auth + tenant (type) | ✅ terpasang |
| v0.2 | Katalog layanan + customer + kendaraan + booking | 🔜 berikutnya |
| v0.3 | Kasir & pembayaran + dashboard | todo |
| v0.4 | Laporan + notifikasi reminder | todo |
| v0.5 | Membership car wash + paket barbershop | todo |
| v1.0 | Beta multi-tenant aman (isolasi data + subscription billing) | todo |

## 6. Kriteria "Done" per Fitur (dipakai approver)

- Typecheck & build lolos (`npm run typecheck`, `npm run build`).
- API memakai envelope `ApiResponse<T>` + validasi zod.
- Setiap tabel tenant punya kolom `business_id` (isolasi) & diakses via konteks tenant.
- UI memakai komponen yang sudah ada / design system (lihat `architecture.md`).
- Tidak ada fitur "untuk nanti" tanpa diminta (aturan ponytail).

## 7. Metrik Sukses

- Waktu buat bisnis baru < 2 menit.
- Waktu booking baru < 30 detik.
- Checkout < 15 detik.
- Uptime API ≥ 99%.