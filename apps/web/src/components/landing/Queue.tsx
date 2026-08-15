import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const statuses = [
  ['clock', 'MENUNGGU', '3', 'border-warn-300 bg-warn-50 text-warn-700', 'bg-warn-500'],
  ['zap', 'DALAM LAYANAN', '2', 'border-brand-300 bg-brand-50 text-brand-700', 'bg-brand-500'],
  ['check', 'SELESAI', '9', 'border-success-300 bg-success-50 text-success-700', 'bg-success-500'],
  ['x', 'DIBATALKAN', '1', 'border-ink-200 bg-ink-50 text-ink-500', 'bg-ink-400'],
] as const;

export function Queue() {
  return (
    <Section id="antrian">
      <SectionHeader
        kicker="Manajemen antrian"
        title={
          <>
            Jangan pernah kehilangan <span className="text-brand-600">kendali antrian</span>
          </>
        }
        subtitle="Setiap pelanggan punya status yang jelas dan bisa di-update sekali klik. Tim selalu tahu siapa berikutnya."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statuses.map(([icon, title, count, card, dot]) => (
          <div key={title} className={`rounded-2xl border bg-white p-5 shadow-sm ${card}`}>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-bold tracking-wide">
                <span className={`h-2 w-2 rounded-full ${dot}`} />
                {title}
              </span>
              <Icon name={icon} size={16} />
            </div>
            <p className="font-display mt-4 text-3xl font-extrabold">{count}</p>
            <p className="mt-1 text-xs text-ink-500">antrean</p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-ink-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {[
            ['MENUNGGU', 'warn', 'Rizky'],
            ['MENUNGGU', 'warn', 'Andi'],
            ['DALAM LAYANAN', 'brand', 'Budi'],
            ['DALAM LAYANAN', 'brand', 'Sari'],
            ['MENUNGGU', 'warn', 'Tono'],
          ].map(([status, tone, name]) => (
            <span
              key={name}
              className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium ring-1 ring-inset ${
                tone === 'warn' ? 'bg-warn-50 text-warn-700 ring-warn-200' : 'bg-brand-50 text-brand-700 ring-brand-200'
              }`}
            >
              <Icon name={tone === 'warn' ? 'clock' : 'zap'} size={14} />
              {name} · {status}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
