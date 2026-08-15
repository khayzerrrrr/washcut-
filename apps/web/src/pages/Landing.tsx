import { Link } from 'react-router-dom';
import { Icon } from '../components/ui/Icon';

const features = [
  {
    title: 'Multi-tenant & aman',
    desc: 'Setiap bisnis adalah tenant terpisah. Data pelanggan, layanan, dan transaksi terisolasi penuh antar tenant.',
    icon: 'shield' as const,
    tone: 'text-brand-400 bg-brand-500/10',
  },
  {
    title: 'Dua vertikal, satu sistem',
    desc: 'Barbershop dan car wash berbagi core yang sama. Modul yang tidak relevan otomatis disembunyikan.',
    icon: 'building' as const,
    tone: 'text-sky-400 bg-sky-500/10',
  },
  {
    title: 'Kasir & pembayaran',
    desc: 'Checkout cepat dengan QRIS, tunai, atau transfer. Riwayat transaksi tersimpan rapi.',
    icon: 'wallet' as const,
    tone: 'text-emerald-400 bg-emerald-500/10',
  },
  {
    title: 'Jadwal & antrian',
    desc: 'Booking janji temu per karyawan, status proses, dan notifikasi reminder ke pelanggan.',
    icon: 'calendar' as const,
    tone: 'text-amber-400 bg-amber-500/10',
  },
];

export function Landing() {
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.18),transparent_60%)]" />

      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-black">W</span>
          <span className="text-lg font-bold">WashCut</span>
        </div>
        <nav className="hidden items-center gap-6 text-sm text-ink-300 md:flex">
          <a href="#fitur" className="hover:text-white">Fitur</a>
          <a href="#platform" className="hover:text-white">Platform</a>
        </nav>
        <Link to="/login" className="btn-outline !border-ink-600 !text-white hover:!bg-ink-800">Masuk</Link>
      </header>

      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <span className="badge ring-1 ring-inset ring-brand-500/40 bg-brand-500/10 text-brand-300">
          Platform SaaS untuk bisnis jasa lokal
        </span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
          Satu dashboard untuk <span className="text-brand-400">barbershop</span> dan{' '}
          <span className="text-sky-400">car wash</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-ink-300 sm:text-lg">
          Booking, pelanggan, kasir, dan laporan dalam satu aplikasi. Berjalan di browser, Android, iPhone, dan Windows.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login" className="btn-primary !px-6 !py-3 !text-base">Mulai Sekarang</Link>
          <a href="#fitur" className="btn-outline !border-ink-600 !text-white hover:!bg-ink-800 !px-6 !py-3 !text-base">Lihat Fitur</a>
        </div>

        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-6 border-t border-ink-800 pt-8 sm:grid-cols-4">
          {[['2', 'vertikal bisnis'], ['100%', 'isolasi data'], ['3', 'platform'], ['24/7', 'akses cloud']].map(([n, l]) => (
            <div key={l}>
              <p className="text-2xl font-extrabold text-white">{n}</p>
              <p className="mt-1 text-xs text-ink-400">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="fitur" className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-800 to-ink-900 p-8">
            <span className="badge ring-1 ring-inset ring-brand-500/40 bg-brand-500/10 text-brand-300">
              <Icon name="scissors" size={13} /> Barbershop
            </span>
            <h2 className="mt-4 text-2xl font-bold">Untuk barbershop</h2>
            <p className="mt-2 text-sm text-ink-400">Janji temu, profil rambut pelanggan, dan paket grooming.</p>
          </div>
          <div className="rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-800 to-ink-900 p-8">
            <span className="badge ring-1 ring-inset ring-sky-500/40 bg-sky-500/10 text-sky-300">
              <Icon name="car" size={13} /> Car Wash
            </span>
            <h2 className="mt-4 text-2xl font-bold">Untuk car wash</h2>
            <p className="mt-2 text-sm text-ink-400">Check-in kendaraan, data plat & kelas, dan membership cuci.</p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-2xl border border-ink-700 bg-ink-800/50 p-6">
              <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.tone}`}>
                <Icon name={f.icon} size={20} />
              </span>
              <h3 className="mt-4 font-bold">{f.title}</h3>
              <p className="mt-2 text-sm text-ink-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="platform" className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="rounded-3xl border border-ink-700 bg-ink-800/40 p-8 sm:p-12">
          <h2 className="text-center text-2xl font-bold sm:text-3xl">Satu kode, banyak perangkat</h2>
          <div className="mt-8 grid gap-4 text-center sm:grid-cols-3">
            {[
              ['iPhone', 'PWA — install dari Safari', 'shield'],
              ['Android', 'App native via Capacitor', 'qr'],
              ['Windows', 'Aplikasi .exe via Tauri', 'building'],
            ].map(([t, d, icon]) => (
              <div key={t} className="rounded-2xl border border-ink-700 bg-ink-900/60 p-6">
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
                  <Icon name={icon!} size={20} />
                </span>
                <p className="mt-4 text-lg font-bold">{t}</p>
                <p className="mt-1 text-sm text-ink-400">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t border-ink-800 py-8 text-center text-sm text-ink-500">
        WashCut Project — satu kode, banyak perangkat.
      </footer>
    </div>
  );
}