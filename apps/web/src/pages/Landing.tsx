import { Link } from 'react-router-dom';

export function Landing() {
  return (
    <div className="min-h-screen bg-ink-900 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 font-black">W</span>
          <span className="text-lg font-bold">WashCut</span>
        </div>
        <Link to="/login" className="btn-outline !border-ink-600 !text-white hover:!bg-ink-800">
          Masuk
        </Link>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 text-center sm:pt-24">
        <span className="badge ring-1 ring-inset ring-brand-500/40 bg-brand-500/10 text-brand-300">Satu sistem untuk 2 jenis bisnis</span>
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl">
          Kelola <span className="text-brand-400">Barbershop</span> & <span className="text-sky-400">Car Wash</span> dari satu dashboard
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base text-ink-300 sm:text-lg">
          Booking, pelanggan, kasir, dan laporan dalam satu aplikasi. Bisa dipakai di browser, Android (app), dan iPhone (PWA).
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/login" className="btn-primary !px-6 !py-3 !text-base">
            Mulai Sekarang
          </Link>
          <a href="#fitur" className="btn-outline !border-ink-600 !text-white hover:!bg-ink-800 !px-6 !py-3 !text-base">
            Lihat Fitur
          </a>
        </div>
      </section>

      <section id="fitur" className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-800 to-ink-900 p-8">
            <span className="badge ring-1 ring-inset ring-brand-500/40 bg-brand-500/10 text-brand-300">Barbershop</span>
            <h2 className="mt-4 text-2xl font-bold">Untuk barbershop</h2>
            <ul className="mt-5 space-y-3 text-ink-300">
              <li className="flex gap-2"><span className="text-brand-400">✓</span> Janji temu per barber + walk-in</li>
              <li className="flex gap-2"><span className="text-brand-400">✓</span> Profil rambut & riwayat gaya pelanggan</li>
              <li className="flex gap-2"><span className="text-brand-400">✓</span> Paket grooming berkala</li>
            </ul>
          </div>
          <div className="rounded-3xl border border-ink-700 bg-gradient-to-br from-ink-800 to-ink-900 p-8">
            <span className="badge ring-1 ring-inset ring-sky-500/40 bg-sky-500/10 text-sky-300">Car Wash</span>
            <h2 className="mt-4 text-2xl font-bold">Untuk car wash</h2>
            <ul className="mt-5 space-y-3 text-ink-300">
              <li className="flex gap-2"><span className="text-sky-400">✓</span> Check-in kendaraan & status proses</li>
              <li className="flex gap-2"><span className="text-sky-400">✓</span> Data kendaraan (plat, kelas) per pelanggan</li>
              <li className="flex gap-2"><span className="text-sky-400">✓</span> Membership cuci bulanan/tahunan</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-4 text-center sm:grid-cols-3">
          {[
            ['iPhone', 'PWA — install dari Safari'],
            ['Android', 'App native via Capacitor'],
            ['Windows', 'Aplikasi .exe via Tauri'],
          ].map(([t, d]) => (
            <div key={t} className="rounded-2xl border border-ink-700 bg-ink-800/50 p-6">
              <p className="text-lg font-bold">{t}</p>
              <p className="mt-1 text-sm text-ink-400">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-ink-800 py-8 text-center text-sm text-ink-500">
        WashCut Project — satu kode, banyak perangkat.
      </footer>
    </div>
  );
}