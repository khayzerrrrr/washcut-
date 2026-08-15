import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const lifecycle = ['Pelanggan baru', 'Kunjungan pertama', 'Pelanggan berulang', 'Member', 'VIP'];

const tools = [
  ['gift', 'Membership', 'Program member dengan tingkatan dan benefit'],
  ['star', 'Poin & loyalitas', 'Hadiah poin untuk tiap transaksi'],
  ['tag', 'Paket & promo', 'Bundling layanan dan diskon musiman'],
  ['users', 'Segmentasi', 'Kirim penawaran per kelompok pelanggan'],
  ['zap', 'Follow-up otomatis', 'Ingatkan yang sudah lama tak kembali'],
] as const;

export function Retention() {
  return (
    <Section id="retensi">
      <SectionHeader
        kicker="Retensi pelanggan"
        title={
          <>
            Ubah pengunjung pertama jadi <span className="text-brand-600">pelanggan setia</span>
          </>
        }
        subtitle="Satu siklus loyalitas yang jelas: tiap pelanggan tahu manfaat terus datang kembali."
      />

      <div className="mt-12 flex flex-wrap items-center justify-center gap-2">
        {lifecycle.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span
              className={`rounded-xl px-4 py-2 text-sm font-semibold ${
                i >= lifecycle.length - 1
                  ? 'bg-brand-600 text-white'
                  : 'border border-brand-200 bg-brand-50 text-brand-700'
              }`}
            >
              {step}
            </span>
            {i < lifecycle.length - 1 && <Icon name="arrowRight" size={15} className="text-ink-400" />}
          </div>
        ))}
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map(([icon, title, desc]) => (
          <div key={title} className="card p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={icon} size={20} />
            </span>
            <h3 className="mt-4 text-base font-bold text-ink-900">{title}</h3>
            <p className="mt-1 text-sm text-ink-500">{desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
