import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';
import type { Vertical } from './Hero';

const fields: Record<
  Vertical,
  readonly (readonly [string, string])[]
> = {
  barbershop: [
    ['users', 'Nama & kontak'],
    ['repeat', 'Riwayat kunjungan'],
    ['tag', 'Layanan favorit'],
    ['cash', 'Total pengeluaran'],
    ['gift', 'Membership'],
    ['scissors', 'Profil rambut'],
    ['settings', 'Preferensi'],
    ['clock', 'Kunjungan terakhir'],
    ['calendar', 'Janji berikutnya'],
  ],
  car_wash: [
    ['users', 'Nama & kontak'],
    ['repeat', 'Riwayat kunjungan'],
    ['tag', 'Layanan favorit'],
    ['cash', 'Total pengeluaran'],
    ['gift', 'Membership'],
    ['car', 'Kendaraan'],
    ['settings', 'Preferensi'],
    ['clock', 'Kunjungan terakhir'],
    ['calendar', 'Janji berikutnya'],
  ],
};

export function CustomerProfile({ vertical }: { vertical: Vertical }) {
  const currentFields = fields[vertical];
  const favorite = vertical === 'barbershop' ? 'Potong Rambut + Beard' : 'Cuci + Interior';
  return (
    <Section id="pelanggan">
      <SectionHeader
        kicker="Profil pelanggan"
        title={
          <>
            Kenali <span className="text-brand-600">setiap pelanggan</span>
          </>
        }
        subtitle="Satu profil lengkap untuk setiap pelanggan, dari kontak sampai preferensi. Tidak ada lagi bertanya ulang di tiap kunjungan."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="card p-6 sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-lg font-bold text-brand-700">
                RA
              </span>
              <div>
                <p className="font-bold text-ink-900">Rangga Saputra</p>
                <p className="text-sm text-ink-500">+62 812-3456-7890</p>
              </div>
            </div>
            <span className="badge ring-1 ring-inset bg-brand-50 text-brand-700 ring-brand-200">
              <Icon name="star" size={12} />
              Member Gold
            </span>
          </div>

          <dl className="mt-5 space-y-3.5 text-sm">
            {[
              ['Kunjungan terakhir', '3 hari lalu'],
              ['Total kunjungan', '24'],
              ['Layanan favorit', favorite],
              ['Total pengeluaran', 'Rp 2,1 jt'],
              ['Janji berikutnya', 'Sabtu, 10:30'],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between gap-4">
                <dt className="text-ink-500">{k}</dt>
                <dd className="font-semibold text-ink-900">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className="text-sm font-semibold text-ink-700">Semua tersimpan dalam satu profil</p>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {currentFields.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon name={icon} size={16} />
                </span>
                <span className="text-sm font-medium text-ink-700">{label}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-ink-500">
            Saat pelanggan memesan ulang, tim Anda langsung tahu sejarahnya tanpa bertanya ulang.
          </p>
        </div>
      </div>
    </Section>
  );
}
