# Design Guide — WashCut

> Sumber kebenaran tampilan (UI/UX). Dibuat dari skill `ui-ux-pro-max` (design-system di `design-system/washcut/MASTER.md`) dan diadaptasi untuk SaaS bisnis jasa. Baca sebelum membuat/mengubah komponen atau halaman.

## 1. Prinsip

- **Premium dark + action red** — netral gelap (slate) sebagai fondasi, merah sebagai CTA/aksi.
- **Satu CTA utama per layar** (hero-centric), sisanya button sekunder/ghost.
- **Mobile-first** — target utama HP (iPhone PWA, Android), lalu desktop.
- **Konsisten** — pakai token, jangan warna/heksa hardcoded di komponen.
- **Profesional** — gaya SaaS internasional, bukan playful; **tidak ada emoji sebagai ikon**.

## 2. Warna & Penggunaannya

### Brand (aksi utama) — merah `#DC2626`

| Token | Heksa | Penggunaan |
|-------|-------|------------|
| `brand-50` | `#fef2f2` | Background aksen halus, avatar, badge ring |
| `brand-100` | `#fee2e2` | Background hover ringan, avatar |
| `brand-200` | `#fecaca` | Ring/outline badge |
| `brand-300` | `#fca5a5` | Border hover |
| `brand-400` | `#f87171` | Teks aksen di latar gelap |
| `brand-500` | `#ef4444` | Border fokus, teks aksen |
| `brand-600` | `#dc2626` | **Tombol primary**, teks aksen, nav aktif |
| `brand-700` | `#b91c1c` | Hover tombol primary |
| `brand-800` | `#991b1b` | Active tombol primary |
| `brand-900` | `#7f1d1d` | (cadangan) |

**Aturan pemakaian brand:**
- `brand-600` = CTA utama, item nav aktif, teks link penting, focus ring.
- `brand-50`/`brand-100` untuk latar yang menandai elemen "beraksi" (badge, kartu terpilih).
- JANGAN warna latar teks utama — teks utama tetap `ink-900`.

### Netral (fondasi) — slate

| Token | Heksa | Penggunaan |
|-------|-------|------------|
| `ink-50` | `#f8fafc` | **Background halaman** |
| `ink-100` | `#f1f5f9` | Background row hover, header tabel, seksi |
| `ink-200` | `#e2e8f0` | Border card/divider, skeleton |
| `ink-300` | `#cbd5e1` | Border input, ikon outline |
| `ink-400` | `#94a3b8` | Placeholder, teks hint |
| `ink-500` | `#64748b` | Teks sekunder (subtitle) |
| `ink-600` | `#475569` | Teks muted, label |
| `ink-700` | `#334155` | Teks tabel/secondary |
| `ink-800` | `#1e293b` | **Primary dark** (sidebar, kartu gelap) |
| `ink-900` | `#0f172a` | **Teks utama**, foreground, footer gelap |

**Aturan pemakaian ink:**
- Background halaman selalu `ink-50`; kartu putih `bg-white`.
- Teks utama `ink-900` (kontras ≥ 4.5:1), teks sekunder `ink-500/600`.
- JANGAN teks < `ink-600` (≥ `ink-500`) untuk isi penting — kontras.
- Sidebar/area gelap pakai `ink-900`, aksen aktif `brand-600`.

### Semantik (status) — dari Tailwind default

| Makna | Kelas | Contoh Pakai |
|-------|-------|--------------|
| Sukses / selesai / aktif / lunas | `emerald` (`#10b981`) | Badge `completed`, `paid`, `active` |
| Menunggu / sebagian / trial | `amber` (`#f59e0b`) | Badge `pending`, `partial`, `trial` |
| Info / car wash / biru | `sky` (`#0ea5e9`) | Badge jenis `car_wash` |
| Barbershop / aksi | `brand` (merah) | Badge jenis `barbershop` |
| Batal / bahaya / suspend | `rose`/`red` (`#f43f5e`) | Badge `cancelled`, `suspended` |
| Netral | `gray` | Badge nonaktif |

**Aturan pemakaian semantik:**
- Status TIDAK boleh hanya lewat warna — selalu sertakan label teks (lihat `statusLabel`).
- Tone badge dipetakan via fungsi `statusTone()` di `components/ui/Badge.tsx`.

## 3. Tipografi

- **Heading:** `Poppins` (kelas `font-display`) — weight 500–800.
- **Body/UI:** `Open Sans` (default `font-sans`) — weight 400–700.
- Ukuran dasar: `16px` body; line-height 1.5. Judul halaman `text-xl/2xl`; hero sampai `text-6xl`.
- JANGAN teks body < 12px; label/tabel pakai `text-xs` hanya untuk non-kritikal.

## 4. Spacing & Density

- Density 7/10 (standard): ritme **4/8px**. Token: `xs 4`, `sm 8`, `md 16`, `lg 24`, `xl 32`, `2xl 48`, `3xl 64`.
- Padding kartu `p-4/p-5`; jarak antar seksi `mb-6`; jarak antar kartu `gap-4`.
- Konten dibatasi `max-w-6xl`; header tabel `th`, isi `td`.

## 5. Komponen Inti

| Komponen | Spesifikasi |
|----------|-------------|
| Tombol | `btn-primary` (merah), `btn-outline`, `btn-ghost`. Tinggi ~40px, radius `rounded-xl`, transisi 150–300ms, `cursor-pointer`. Disabled: `opacity/disabled` jelas. |
| Card | `bg-white rounded-2xl border ink-200 shadow-sm`. Hover: naikkan shadow, jangan mengubah layout (jangan scale). |
| Input | `input`: border `ink-300`, fokus ring `brand-600/25`. Label selalu terlihat (`label`), bukan placeholder-only. |
| Badge | `rounded-full px-2.5 py-0.5 text-xs` + ring. Warna sesuai semantik. |
| Modal | Overlay `bg-ink-900/50 backdrop-blur-sm`; panel putih `rounded-t-3xl sm:rounded-2xl`; ada tombol tutup; fokus dijaga. |
| Tabel | Header `th` (uppercase, `ink-500`), row hover `ink-50`, divider `ink-100`. |
| Ikon | `components/ui/Icon.tsx` — **SVG stroke 1.8, satu gaya (outline)**, ukuran konsisten (16/18/20). Semua ikon dekoratif diberi `aria-hidden`. |

## 6. Ikon — Aturan Keras

- **DILARANG emoji sebagai ikon.** Semua lewat `<Icon name="...">` (SVG).
- Satu gaya outline, stroke konsisten 1.8; satu ukuran per level hierarki.
- Ikon di samping teks yang sudah deskriptif → `aria-hidden="true"`.
- Tombol ikon-only → wajib `aria-label` + target ≥ 44px.

## 6a. Logo

- **Sumber kebenaran:** file `apps/web/public/logo.png` (logo platform WashCut, PNG transparan). Semua tempat brand memakai komponen `<Logo>` dari `components/ui/Logo.tsx`.
- **Tampilan: tanpa teks nama.** Logo ditampilkan sebagai gambar saja (hanya `alt` untuk aksesibilitas), tidak menempel teks "WashCut"/nama tenant di sampingnya.
- **Fallback:** `<Logo src={business.logo}>` — jika tenant tidak punya logo, otomatis memakai logo platform.
- **Logo tenant:** dikelola di halaman **Pengaturan** (`/app/:businessId/settings`) oleh owner/staff tenant. Upload PNG transparan, maks 500KB; disimpan sebagai data-URL di field `Business.logo`.
- **Isolasi:** hanya anggota tenant tsb (token) yang boleh mengganti logo tenantnya — dijamin `requireTenantAccess` (403 jika URL ≠ token).
- **Aturan tampilan:** `object-contain`, tinggi 8–14 (header), tidak pernah memaksa latar; jangan resize logo saat hover.

## 7. Interaksi & Feedback

- Hover: transisi 150–300ms, `cursor-pointer` di semua elemen klik.
- Loading: **skeleton `animate-pulse`** (`Skeleton`/`TableSkeleton`) — jangan layar kosong saat fetch.
- Fokus keyboard: `:focus-visible` outline `brand-600` global.
- Reduced motion: `prefers-reduced-motion` mematikan animasi/scroll halus (sudah di `index.css`).
- State instan dilarang — semua perubahan butuh transisi.

## 8. Responsif

- Breakpoints: `375px` (HP kecil) → `768px` (tablet) → `1024px` (desktop) → `1440px`.
- Mobile: sidebar jadi topbar + **bottom nav** (maks 5 item). Tanpa scroll horizontal.
- Kartu/statistik: grid 1 kolom di HP, 2–4 kolom di layar besar.
- Tab area aman: bottom nav diberi padding konten (`pb-24`).

## 9. Checklist Sebelum Kirim UI

- [ ] Tidak ada emoji sebagai ikon (semua SVG)
- [ ] Logo memakai komponen `<Logo>`; tidak ada teks nama menempel di samping logo
- [ ] Ikon satu gaya (outline) & `aria-hidden` untuk dekoratif
- [ ] `cursor-pointer` + hover state (150–300ms) di semua klik
- [ ] Kontras teks ≥ 4.5:1 (light); status tidak hanya lewat warna
- [ ] Focus state terlihat (`:focus-visible`)
- [ ] `prefers-reduced-motion` dihormati
- [ ] Loading pakai skeleton, bukan kosong
- [ ] Responsif 375/768/1024/1440; tanpa scroll horizontal; konten tidak tertutup nav
- [ ] Hanya token (brand/ink/semantik) — tidak ada heksa hardcoded di komponen

## 10. Anti-Pola (JANGAN)

- ❌ Emoji sebagai ikon, UI playful, warna acak per halaman
- ❌ Tombol yang terlihat aktif tapi `disabled` tidak jelas
- ❌ Hover scale yang menggeser layout
- ❌ Teks abu-abu di atas abu-abu (kontras < 4.5:1)
- ❌ Placeholder sebagai satu-satunya label form
- ❌ Transisi instan (0ms) atau semua pakai durasi sama

## 11. Anti "AI Slop" — Filter Wajib

Aturan lengkap di `docs/antislop/` (core `antislop.md` + skill `antislop-ui.md`). Untuk UI, copy, people, dan mobile layout, baca file itu **sebelum** menulis. Di bawah ini inti yang relevan dengan WashCut:

- **Hard gate (mutlak):**
  - Jangan default warna `indigo`/gradient hero 2-stop — WashCut punya aksen merah sendiri.
  - Jangan emoji sebagai ikon fitur (sudah dilarang §6).
  - Jangan headline/judul miring (`italic`) sebagai ornamen; emphasis lewat weight/warna/underline.
  - Jangan angka/statistik yang dibuat-buat — hanya pakai data nyata atau placeholder `—`.
  - Jangan shadow/glow berlebihan, gradient acak, atau rounded-everything tanpa tujuan.
- **Dengan alasan (wajib ada tujuan):** glassmorphism, background gradient, chip/pill, kartu rounded-2xl — setiap keputusan dekoratif harus punya alasan fungsional.
- **Quality lock:** konsistensi radius (rounded-xl/2xl), spacing (4/8px), satu aksen per layar, tidak mencampur > 2 font, tidak memakai pattern/gradient yang sama di banyak halaman.
- **Liveliness:** beri gerak/ritme (mis. angka counter, kartu naik halus) supaya tidak terasa generik; hormati `prefers-reduced-motion`.
- **Delivery gate:** sebelum dianggap selesai, audit hasil terhadap §10 dan list ini. Hasil steril = arah hilang, bukan filter gagal.

Skill `hallmark` juga terpasang di `.opencode/skills/hallmark` (anti-AI-slop dengan 58 slop-test gates) — untuk redesign besar gunakan `hallmark audit`/`redesign`.