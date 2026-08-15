import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const branches = [
  ['Medan', 'Rp 58,2 jt', 9, 312, 'brand'],
  ['Jakarta', 'Rp 64,7 jt', 12, 428, 'cyan'],
  ['Surabaya', 'Rp 43,1 jt', 7, 265, 'info'],
  ['Bandung', 'Rp 51,9 jt', 8, 291, 'success'],
] as const;

const facets = [
  ['cash', 'Pendapatan per cabang'],
  ['users', 'Staf per cabang'],
  ['repeat', 'Pelanggan per cabang'],
  ['calendar', 'Janji per cabang'],
  ['chart', 'Perbandingan performa'],
] as const;

export function Branches() {
  return (
    <Section id="cabang">
      <SectionHeader
        kicker="Multi cabang"
        title={
          <>
            Satu bisnis. <span className="text-brand-600">Banyak lokasi.</span>
          </>
        }
        subtitle="Kelola semua cabang dari satu akun. Data tiap lokasi tetap terpisah tapi tetap terlihat dalam satu dashboard."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {branches.map(([city, revenue, staff, customers, tone]) => (
          <div key={city as string} className="card p-5">
            <div className="flex items-center gap-2">
              <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone === 'brand' ? 'bg-brand-50 text-brand-600' : tone === 'cyan' ? 'bg-cyan-50 text-cyan-600' : tone === 'info' ? 'bg-info-50 text-info-600' : 'bg-success-50 text-success-600'}`}>
                <Icon name="mapPin" size={16} />
              </span>
              <span className="font-bold text-ink-900">{city}</span>
            </div>
            <p className="font-display mt-4 text-2xl font-extrabold text-ink-900">{revenue}</p>
            <p className="text-xs font-medium text-ink-500">pendapatan 30 hari</p>
            <div className="mt-4 flex justify-between border-t border-ink-100 pt-3 text-xs text-ink-500">
              <span>{staff} staf</span>
              <span>{customers} pelanggan</span>
            </div>
          </div>
        ))}
      </div>

      <ul className="mx-auto mt-8 grid max-w-3xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {facets.map(([icon, label]) => (
          <li key={label} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <Icon name={icon} size={16} />
            </span>
            <span className="text-sm font-medium text-ink-700">{label}</span>
          </li>
        ))}
      </ul>
    </Section>
  );
}
