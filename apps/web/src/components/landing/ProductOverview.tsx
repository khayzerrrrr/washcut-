import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';
import type { Vertical } from './Hero';

const stats: Record<Vertical, readonly (readonly [string, string, string, string])[]> = {
  barbershop: [
    ['cash', 'Pendapatan', 'Rp 184,5 jt', '+12% bulan ini'],
    ['calendar', 'Janji temu hari ini', '24', '8 tersedia'],
    ['scissors', 'Kursi aktif', '8', '4 barber'],
  ],
  car_wash: [
    ['cash', 'Pendapatan', 'Rp 184,5 jt', '+12% bulan ini'],
    ['clock', 'Antrian aktif', '7', 'perkiraan 40 menit'],
    ['car', 'Bay tersedia', '6', '2 terisi'],
  ],
};

const sales: Record<
  Vertical,
  readonly (readonly [string, number, string])[]
> = {
  barbershop: [
    ['Potong Rambut', 72, 'brand'],
    ['Cukur Jenggot', 58, 'cyan'],
    ['Styling & Hair Tattoo', 41, 'info'],
  ],
  car_wash: [
    ['Cuci Kapsul', 72, 'brand'],
    ['Cuci + Interior', 58, 'cyan'],
    ['Detailing Eksterior', 41, 'info'],
  ],
};

const overviewFeatures = [
  'Performa staf',
  'Performa cabang',
  'Statistik pelanggan',
  'Penjualan layanan',
];

export function ProductOverview({ vertical }: { vertical: Vertical }) {
  const currentStats = stats[vertical];
  const currentSales = sales[vertical];
  return (
    <Section id="produk">
      <SectionHeader
        kicker="Ikhtisar"
        title={
          <>
            Seluruh bisnis Anda, <span className="text-brand-600">dalam satu pandangan</span>
          </>
        }
        subtitle="Setiap buka aplikasi, langsung tahu berapa pendapatan, janji, dan antrian hari ini tanpa menebak-nebak."
      />

      <div className="relative mt-14">
        <div className="rounded-3xl border border-ink-200 bg-white p-4 shadow-xl shadow-ink-900/5 sm:p-6 lg:p-8">
          <div className="flex items-center gap-2 border-b border-ink-100 pb-4">
            <span className="h-3 w-3 rounded-full bg-ink-200" />
            <span className="h-3 w-3 rounded-full bg-ink-200" />
            <span className="h-3 w-3 rounded-full bg-ink-200" />
            <span className="ml-2 text-sm font-semibold text-ink-500">Dashboard</span>
          </div>

          <div className="grid gap-4 pt-5 sm:grid-cols-3">
            {currentStats.map(([icon, label, value, hint]) => (
              <div key={label} className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
                <div className="flex items-center gap-2 text-ink-500">
                  <Icon name={icon} size={15} />
                  <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
                </div>
                <p className="font-display mt-2 text-2xl font-bold text-ink-900">{value}</p>
                <p className="mt-1 text-xs text-success-600">{hint}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
              <p className="text-sm font-semibold text-ink-700">Pendapatan 30 hari terakhir</p>
              <div className="mt-4 flex h-40 items-end gap-2">
                {[42, 58, 45, 70, 55, 82, 64, 90, 72, 84, 66, 95].map((v, i) => (
                  <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-cyan-400" style={{ height: `${v}%` }} />
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-ink-200 bg-ink-50 p-4">
              <p className="text-sm font-semibold text-ink-700">Penjualan layanan</p>
              <ul className="mt-4 space-y-3">
                {currentSales.map(([label, value, tone]) => (
                  <li key={label as string}>
                    <div className="flex justify-between text-xs font-medium text-ink-600">
                      <span>{label}</span>
                      <span>{value}%</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-ink-200">
                      <div
                        className={`h-full rounded-full ${tone === 'brand' ? 'bg-brand-600' : tone === 'cyan' ? 'bg-cyan-500' : 'bg-info-500'}`}
                        style={{ width: `${value}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {overviewFeatures.map((f) => (
            <div key={f} className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm font-medium text-ink-700 shadow-sm">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                <Icon name="check" size={13} />
              </span>
              {f}
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
