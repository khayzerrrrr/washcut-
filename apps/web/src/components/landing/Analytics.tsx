import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const kpis = [
  ['cash', 'Pendapatan', 'Rp 184,5 jt', '+12%'],
  ['chart', 'Profit', 'Rp 62,3 jt', '+9%'],
  ['users', 'Pelanggan', '1.248', '+38'],
  ['tag', 'Rata-rata transaksi', 'Rp 148rb', '+4%'],
] as const;

export function Analytics() {
  return (
    <Section id="analitik" dark>
      <SectionHeader
        dark
        kicker="Analitik"
        title={
          <>
            Bisnis Anda, <span className="text-cyan-400">dijelaskan oleh data</span>
          </>
        }
        subtitle="Bukan sekadar angka. WASHCUT menghubungkan penjualan, pelanggan, dan staf menjadi keputusan yang bisa ditindaklanjuti."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(([icon, label, value, delta]) => (
          <div key={label} className="card-dark p-5">
            <div className="flex items-center gap-2 text-ink-400">
              <Icon name={icon} size={15} />
              <span className="text-xs font-semibold uppercase tracking-wide">{label}</span>
            </div>
            <p className="font-display mt-3 text-2xl font-bold text-white">{value}</p>
            <p className="mt-1 text-xs font-medium text-success-400">{delta} periode ini</p>
          </div>
        ))}
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="card-dark p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Pendapatan vs profit</p>
            <span className="text-xs text-ink-400">6 bulan</span>
          </div>
          <div className="mt-6 flex h-48 items-end gap-3">
            {[
              [55, 30],
              [70, 42],
              [52, 33],
              [82, 55],
              [66, 44],
              [95, 68],
            ].map(([rev, profit], i) => (
              <div key={i} className="flex flex-1 items-end gap-1">
                <div className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-cyan-400" style={{ height: `${rev}%` }} />
                <div className="flex-1 rounded-t bg-info-500/70" style={{ height: `${profit}%` }} />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-5 text-xs text-ink-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-brand-500" /> Pendapatan
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-info-500" /> Profit
            </span>
          </div>
        </div>

        <div className="space-y-5">
          <div className="card-dark p-5">
            <p className="text-sm font-semibold text-white">Layanan terlaris</p>
            <ul className="mt-4 space-y-3">
              {[
                ['Cuci Premium', 92, 'cyan'],
                ['Potong + Beard', 74, 'brand'],
                ['Detailing', 51, 'info'],
              ].map(([label, value, tone]) => (
                <li key={label as string}>
                  <div className="flex justify-between text-xs font-medium text-ink-300">
                    <span>{label}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-ink-800">
                    <div
                      className={`h-full rounded-full ${tone === 'cyan' ? 'bg-cyan-500' : tone === 'info' ? 'bg-info-500' : 'bg-brand-600'}`}
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="card-dark p-5">
            <p className="text-sm font-semibold text-white">Performa cabang</p>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                ['Medan', 88],
                ['Jakarta', 74],
                ['Surabaya', 61],
              ].map(([city, value]) => (
                <li key={city as string}>
                  <div className="flex justify-between text-xs font-medium text-ink-300">
                    <span>{city}</span>
                    <span>{value}%</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-ink-800">
                    <div className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-400" style={{ width: `${value}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
