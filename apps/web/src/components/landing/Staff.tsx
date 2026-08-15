import { Section, SectionHeader, CheckItem } from './shared';
import { Icon } from '../ui/Icon';

const metrics = [
  ['cash', 'Pendapatan per staff'],
  ['check', 'Layanan selesai'],
  ['calendar', 'Janji terjadwal'],
  ['settings', 'Komisi'],
  ['clock', 'Kehadiran'],
  ['chart', 'Performa'],
] as const;

const leaderboard = [
  ['Budi Santoso', 'Rp 18,4 jt', 92, 'brand'],
  ['Ahmad Fauzi', 'Rp 16,1 jt', 84, 'info'],
  ['Rizki Pratama', 'Rp 14,7 jt', 78, 'cyan'],
] as const;

export function Staff() {
  return (
    <Section id="staff">
      <SectionHeader
        kicker="Manajemen staff"
        title={
          <>
            Tim Anda. <span className="text-brand-600">Angka Anda.</span>
          </>
        }
        subtitle="Performa, komisi, dan kehadiran tiap staf terlihat jelas. Keputusan gaji dan jadwal jadi lebih adil."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="grid gap-3 sm:grid-cols-2">
          {metrics.map(([icon, label]) => (
            <div key={label} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name={icon} size={18} />
              </span>
              <span className="text-sm font-medium text-ink-700">{label}</span>
            </div>
          ))}
        </div>

        <div className="card p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-ink-900">Leaderboard performa</p>
            <span className="text-xs text-ink-500">30 hari terakhir</span>
          </div>
          <ul className="mt-4 space-y-3">
            {leaderboard.map(([name, value, pct, tone], i) => (
              <li key={name} className="rounded-xl border border-ink-200 p-3.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 font-semibold text-ink-900">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-500">
                      {i + 1}
                    </span>
                    {name}
                  </span>
                  <span className="font-bold text-ink-900">{value}</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-ink-100">
                  <div
                    className={`h-full rounded-full ${tone === 'brand' ? 'bg-brand-600' : tone === 'info' ? 'bg-info-500' : 'bg-cyan-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ink-500">
            Data kinerja nyata dari sistem — bukan opini atau tebakan.
          </p>
        </div>
      </div>

      <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          'Komisi dihitung otomatis per layanan',
          'Jadwal shift anti-bentrok',
          'Kehadiran tercatat setiap transaksi',
          'Terlihat siapa yang menonjol bulan ini',
        ].map((t) => (
          <CheckItem key={t}>{t}</CheckItem>
        ))}
      </ul>
    </Section>
  );
}
