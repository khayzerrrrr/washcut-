# REMAINING WORK — WashCut (Menuju 100%)

> Daftar pekerjaan tersisa agar WashCut mencapai **100% sesuai full spec WASHCUT**.
> Sumber kebenaran roadmap utama tetap `docs/plan/plan.md`. File ini adalah checklist eksekusi yang lebih granular.
> Perkiraan status saat ini: **MVP ±88–90% · full spec ±70%**.

---

## Status Saat Ini (baseline)

**Sudah selesai:**
- ✅ Design system navy/cyan + landing page 22 section + hero 3D bertema + selector Barbershop/Car Wash
- ✅ Seluruh modul aplikasi (Dashboard, Services, Customers, Bookings, Queue, Staff, POS, Inventory, Membership, Reports, Branches, Settings)
- ✅ Backend API semua modul (tanpa mock) + auth JWT + role (super_admin/owner/admin/staff)
- ✅ Isolasi multi-tenant (11 test PASS)
- ✅ Akun karyawan (admin/capster/washer) + komisi on/off
- ✅ Form buat janji/booking (layanan, pelanggan/walk-in, waktu, barber/washer, kendaraan)
- ✅ Akun demo (batas waktu + kunci otomatis + reminder in-app)
- ✅ SQLite persistence + deploy Docker + subdomain + HTTPS/SSL
- ✅ WhatsApp kontak admin (tombol floating + pricing "hubungi admin")

**Belum / sebagian** → lihat fase di bawah.

---

## Fase A — Fitur Inti yang Masih Bolong

### A1. Profil rambut (barbershop)
- **Status:** ❌ belum (hanya placeholder teks "Profil rambut").
- **Deskripsi:** CRUD profil rambut per pelanggan untuk tenant barbershop: `jenis rambut`, `gaya/catatan`, `gaya terakhir`.
- **Backend:** entitas `hair_profiles` + endpoint (GET/POST/PATCH per customer).
- **Frontend:** panel detail pelanggan (barbershop) tampilkan + edit profil rambut.
- **Done criteria:** owner barbershop bisa simpan & lihat profil rambut pelanggan; car wash tidak melihat modul ini.

### A2. Scope cabang (multi-branch nyata)
- **Status:** ⚠️ sebagian (entitas `branches` ada, tapi booking/transaksi belum di-scope ke cabang).
- **Deskripsi:** tiap cabang punya data operasional sendiri; booking/transaksi/staff terkait ke `branchId`.
- **Backend:** tambah `branchId` ke booking/payment/staff; filter per cabang; laporan per cabang.
- **Frontend:** pilih cabang aktif (branch selector topbar sudah ada tapi belum fungsional); dashboard/laporan per cabang.
- **Done criteria:** memilih cabang mengubah data yang tampil; laporan menampilkan angka per cabang.

### A3. Poin membership otomatis
- **Status:** ⚠️ sebagian (enrol member ada, poin belum terakumulasi dari transaksi).
- **Deskripsi:** poin member bertambah otomatis saat transaksi sesuai `pointsPerSpend` plan; redeem poin.
- **Backend:** hook saat checkout/payment → tambah poin member; endpoint redeem.
- **Frontend:** tampilkan riwayat poin; opsi redeem saat kasir.
- **Done criteria:** transaksi otomatis menambah poin member sesuai plan-nya.

### A4. Dark mode toggle
- **Status:** ❌ belum (token gelap sudah siap, belum ada switch).
- **Deskripsi:** toggle terang/gelap untuk area aplikasi (dashboard, dll), tersimpan di preferensi.
- **Frontend:** context/theme provider + toggle di topbar/settings + persist (localStorage).
- **Done criteria:** user bisa ganti tema terang/gelap dan tersimpan.

### A5. Kelola kendaraan lengkap (car wash)
- **Status:** ⚠️ sebagian (tambah/hapus kendaraan sudah ada di Customers; cek kelengkapan edit).
- **Deskripsi:** pastikan edit kendaraan + relasi kendaraan→riwayat layanan konsisten.
- **Done criteria:** CRUD kendaraan penuh + tampil di riwayat pelanggan.

---

## Fase B — Notifikasi & Komunikasi

### B1. Notifikasi WhatsApp (server-side)
- **Status:** ❌ belum (baru tombol kontak, belum kirim otomatis).
- **Deskripsi:** kirim WhatsApp otomatis (reminder janji, konfirmasi booking, follow-up) via WhatsApp Business API / gateway (mis. Wablas, Fonnte, Twilio).
- **Done criteria:** booking baru → pelanggan terima pesan WhatsApp otomatis (nomor gateway terintegrasi).

### B2. Reminder proaktif (cron)
- **Status:** ⚠️ sebagian (reminder akun demo saat ini hanya saat login).
- **Deskripsi:** cron job harian di VPS untuk: reminder demo, low-stock alert, laporan harian, follow-up.
- **Done criteria:** pengingat terkirim otomatis meski user tidak login (email/WhatsApp/in-app).

---

## Fase C — Persistensi & Database Produksi (v0.4)

### C1. PostgreSQL + Prisma
- **Status:** ❌ belum (masih SQLite snapshot JSON).
- **Deskripsi:** ganti `db.ts` in-memory + SQLite dengan Prisma (PostgreSQL). Model sesuai `docs/plan/database.md`.
- **Done criteria:** semua entitas ternormalisasi, query terindeks, data bertahan & skalabel.

### C2. Migrasi + seed + backup
- **Status:** ❌ belum.
- **Deskripsi:** Prisma Migrate, script seed, backup harian (cron + dump), restore teruji.
- **Done criteria:** migrasi versi terkelola, seed reproduksibel, backup otomatis.

---

## Fase D — Distribusi (v0.7)

### D1. PWA (iPhone installable)
- **Status:** ⚠️ sebagian (manifest ada tapi tidak lengkap; service worker belum).
- **Deskripsi:** manifest.webmanifest lengkap + service worker (offline shell) + ikon + install prompt.
- **Done criteria:** bisa "Add to Home Screen" di iPhone/Android, terasa seperti app.

### D2. Android (Capacitor → .apk)
- **Status:** ❌ belum.
- **Deskripsi:** bungkus web build jadi `.apk` via Capacitor (plugin native FCM bila perlu).
- **Done criteria:** `.apk` terpasang & berjalan di Android.

### D3. Desktop (Tauri → .exe)
- **Status:** ❌ belum.
- **Deskripsi:** bungkus web build jadi `.exe` ringan via Tauri.
- **Done criteria:** `.exe` berjalan di Windows.

---

## Fase E — Hardening & Keamanan Produksi

### E1. Refresh token (httpOnly cookie)
- **Status:** ❌ belum (access token saja di localStorage).
- **Deskripsi:** access token short-lived + refresh token httpOnly cookie + endpoint refresh.
- **Done criteria:** token berotasi aman, tidak tersimpan di localStorage rentan XSS.

### E2. Rate limit login
- **Status:** ❌ belum.
- **Deskripsi:** batasi percobaan login (mis. express-rate-limit) + lockout sementara.
- **Done criteria:** brute-force login diblokir.

### E3. CORS ketat
- **Status:** ⚠️ (belum eksplisit).
- **Deskripsi:** allowlist origin (subdomain resmi), method/header dibatasi.
- **Done criteria:** hanya origin resmi yang bisa akses API.

### E4. Backup & monitoring
- **Status:** ❌ belum.
- **Deskripsi:** backup DB otomatis, healthcheck monitoring (uptime), log error terpusat.
- **Done criteria:** downtime terpantau, data bisa di-recover.

### E5. Activity log otomatis
- **Status:** ⚠️ sebagian (entitas ada, belum auto-log aksi).
- **Deskripsi:** catat aksi penting otomatis (create/update/delete, login, perubahan status).
- **Done criteria:** audit trail lengkap untuk aksi kritis.

---

## Fase F — Billing & Langganan

### F1. Subscription billing
- **Status:** ❌ belum (pricing "hubungi admin" manual).
- **Deskripsi:** integrasi payment gateway (Midtrans/Xendit) + invoice + auto-suspend saat tagihan jatuh tempo + notifikasi.
- **Done criteria:** pelanggan bisa berlangganan & membayar otomatis; tenant nonaktif bila tidak bayar.

---

## Fase G — QA & Performa

### G1. Automated tests
- **Status:** ⚠️ sebagian (hanya verify-isolation + smoke manual).
- **Deskripsi:** unit test (service), integration test (endpoint), E2E (Playwright) untuk alur utama.
- **Done criteria:** CI menjalankan test sebelum merge.

### G2. Optimasi performa
- **Status:** ⚠️ (chunk Hero3D ±883KB lazy, masih bisa dikecilkan).
- **Deskripsi:** kompresi model/tekstur 3D, code-splitting lebih lanjut, target Lighthouse >90.
- **Done criteria:** LCP/CLS/INP dalam target, chunk 3D tidak membebani.

### G3. Audit aksesibilitas
- **Status:** ⚠️ sebagian.
- **Deskripsi:** audit WCAG (kontras, keyboard, ARIA), reduced-motion, fokus terlihat.
- **Done criteria:** Accessibility >95 (Lighthouse).

---

## Urutan Prioritas yang Disarankan

1. **A1–A5** (fitur inti yang bolong) → nutup produk.
2. **C1–C2** (Postgres + backup) → siap produksi.
3. **E1–E5** (hardening) → aman.
4. **B1–B2** (notifikasi proaktif) → nilai jual.
5. **D1–D3** (PWA/native) → distribusi.
6. **F1** (billing) → monetisasi.
7. **G1–G3** (QA/performa) → kualitas berkelanjutan.

---

## Cara Memakai File Ini

- Beri tanda `[x]` pada item yang sudah selesai (ganti status `❌`/`⚠️` jadi `✅`).
- Satu item = satu task delegasi (fase kecil), verifikasi typecheck + build + `verify:isolation` setiap selesai.
- Update file ini setelah tiap task selesai agar selalu jadi "satu sumber kebenaran sisa pekerjaan".
