import { Suspense, lazy, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const Hero3D = lazy(() => import('../three/Hero3D').then((m) => ({ default: m.Hero3D })));

export type Vertical = 'barbershop' | 'car_wash';

const trust = [
  ['check', 'Tanpa kartu kredit'],
  ['clock', 'Setup dalam hitungan menit'],
  ['building', 'Dibangun untuk bisnis jasa modern'],
] as const;

const copy: Record<
  Vertical,
  { title: ReactNode; sub: string }
> = {
  barbershop: {
    title: (
      <>
        Jalankan barbershop Anda dari satu sistem yang{' '}
        <span className="text-brand-400">rapi</span>
      </>
    ),
    sub: 'Booking kursi, jadwal barber, grooming, kasir, dan pelanggan — semua terhubung dalam satu dashboard. Tidak perlu buku jadwal, POS terpisah, atau catatan manual.',
  },
  car_wash: {
    title: (
      <>
        Dari antrian sampai mobil <span className="text-cyan-400">bersih</span> — semua dari satu
        sistem
      </>
    ),
    sub: 'Antrian, bay, kendaraan, kasir, dan pelanggan — semua terhubung dalam satu dashboard. Tidak perlu papan tulis, POS terpisah, atau catatan manual.',
  },
};

export function Hero({
  vertical,
  onSelect,
}: {
  vertical: Vertical;
  onSelect: (v: Vertical) => void;
}) {
  const current = copy[vertical];
  return (
    <section className="relative overflow-hidden bg-ink-900 text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(18,107,255,0.18),transparent_55%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <Suspense fallback={null}>
        <Hero3D />
      </Suspense>

      <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-32 sm:pt-36 lg:pt-40">
        <div className="mx-auto max-w-3xl text-center">
          <span className="badge ring-1 ring-inset ring-cyan-500/30 bg-cyan-500/10 text-cyan-300">
            <Icon name="zap" size={12} />
            Platform operasional untuk bisnis jasa
          </span>
          <h1 className="font-display mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
            {current.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-ink-300 sm:text-lg">{current.sub}</p>

          <div className="mx-auto mt-8 grid max-w-md grid-cols-2 gap-3" role="group" aria-label="Pilih jenis bisnis">
            <BusinessButton
              active={vertical === 'barbershop'}
              onClick={() => onSelect('barbershop')}
              icon="scissors"
              label="Barbershop"
              activeClass="border-brand-400 bg-brand-500/15 text-brand-200 ring-2 ring-brand-400/60"
              idleClass="border-white/15 bg-ink-800/60 text-ink-300 hover:border-white/30 hover:text-white"
            />
            <BusinessButton
              active={vertical === 'car_wash'}
              onClick={() => onSelect('car_wash')}
              icon="car"
              label="Car Wash"
              activeClass="border-cyan-400 bg-cyan-500/15 text-cyan-200 ring-2 ring-cyan-400/60"
              idleClass="border-white/15 bg-ink-800/60 text-ink-300 hover:border-white/30 hover:text-white"
            />
          </div>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login" className="btn-primary btn-lg">
              Mulai Gratis
            </Link>
            <a href="#produk" className="btn-outline-dark btn-lg">
              Lihat Cara Kerja
            </a>
          </div>

          <ul className="mx-auto mt-10 flex max-w-xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
            {trust.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-2 text-sm text-ink-300">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-500/15 text-cyan-400">
                  <Icon name={icon} size={12} />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <FloatingDashboard vertical={vertical} />
      </div>
    </section>
  );
}

function BusinessButton({
  active,
  onClick,
  icon,
  label,
  activeClass,
  idleClass,
}: {
  active: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  activeClass: string;
  idleClass: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex items-center justify-center gap-2.5 rounded-xl border px-4 py-3.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-900 ${
        active ? activeClass : idleClass
      }`}
    >
      <Icon name={icon} size={18} />
      {label}
    </button>
  );
}

function FloatingDashboard({ vertical }: { vertical: Vertical }) {
  const stats =
    vertical === 'barbershop'
      ? ([
          ['Pendapatan hari ini', 'Rp 4,2 jt', 'success'],
          ['Janji temu', '18', 'brand'],
          ['Barber aktif', '6', 'warn'],
          ['Pelanggan baru', '12', 'cyan'],
        ] as const)
      : ([
          ['Pendapatan hari ini', 'Rp 4,2 jt', 'success'],
          ['Antrian aktif', '6', 'warn'],
          ['Bay tersedia', '3', 'brand'],
          ['Pelanggan baru', '12', 'cyan'],
        ] as const);

  return (
    <div className="mx-auto mt-16 max-w-3xl lg:mt-20">
      <div className="rounded-2xl border border-white/10 bg-ink-800/80 p-4 shadow-2xl shadow-brand-950/40 backdrop-blur sm:p-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-ink-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-500" />
            <span className="h-2.5 w-2.5 rounded-full bg-ink-500" />
          </div>
          <span className="text-xs font-semibold text-ink-400">WashCut — Dashboard</span>
        </div>
        <div className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
          {stats.map(([label, value, tone]) => (
            <div key={label} className="rounded-xl border border-white/10 bg-ink-900/60 p-3">
              <p className="text-[11px] font-medium text-ink-400">{label}</p>
              <p className={`mt-1 text-lg font-bold ${tone === 'success' ? 'text-success-400' : tone === 'warn' ? 'text-warn-400' : tone === 'cyan' ? 'text-cyan-400' : 'text-brand-400'}`}>
                {value}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-end gap-1.5 rounded-xl border border-white/10 bg-ink-900/60 p-3">
          {[35, 55, 40, 70, 52, 85, 62, 95, 74, 60].map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-cyan-400"
              style={{ height: `${v * 0.8}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
