import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';
import type { Vertical } from './Hero';

const methods = [
  ['cash', 'Tunai'],
  ['qr', 'QRIS'],
  ['repeat', 'Transfer'],
  ['wallet', 'Kartu'],
] as const;

const transactions: Record<
  Vertical,
  { items: readonly (readonly [string, string])[]; total: string }
> = {
  barbershop: {
    items: [
      ['Potong Rambut', 'Rp 45.000'],
      ['Beard Grooming', 'Rp 25.000'],
      ['Diskon member', '- Rp 7.000'],
    ],
    total: 'Rp 63.000',
  },
  car_wash: {
    items: [
      ['Cuci Premium', 'Rp 50.000'],
      ['Interior Detail', 'Rp 35.000'],
      ['Diskon member', '- Rp 7.000'],
    ],
    total: 'Rp 78.000',
  },
};

export function PosPayment({ vertical }: { vertical: Vertical }) {
  const { items: lineItems, total } = transactions[vertical];
  return (
    <Section id="kasir">
      <SectionHeader
        kicker="Kasir & pembayaran"
        title={
          <>
            Checkout tanpa <span className="text-brand-600">kekacauan</span>
          </>
        }
        subtitle="Tambahkan layanan, beri diskon, terima pembayaran, dan cetak struk dalam hitungan detik."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
            <span className="text-sm font-bold text-ink-900">Transaksi baru</span>
            <span className="badge ring-1 ring-inset bg-brand-50 text-brand-700 ring-brand-200">POS</span>
          </div>
          <ul className="divide-y divide-ink-100 px-5">
            {lineItems.map(([item, price]) => (
              <li key={item} className="flex items-center justify-between py-3 text-sm">
                <span className="text-ink-700">{item}</span>
                <span className="font-semibold text-ink-900">{price}</span>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-ink-100 bg-ink-50 px-5 py-4">
            <span className="text-sm font-semibold text-ink-600">Total</span>
            <span className="font-display text-xl font-extrabold text-ink-900">{total}</span>
          </div>
          <div className="flex flex-wrap gap-2 px-5 py-4">
            {methods.map(([icon, label]) => (
              <span key={label} className="flex items-center gap-2 rounded-xl border border-ink-200 bg-white px-3 py-2 text-sm font-medium text-ink-700">
                <Icon name={icon} size={15} className="text-brand-600" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-ink-900">Kasir yang cepat dan jelas</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-600">
            {[
              'Pilih pelanggan, tambahkan layanan, dan kasir langsung selesai',
              'Diskon, add-on, dan membership diterapkan otomatis',
              'Terima tunai, QRIS, transfer, atau kartu dalam satu layar',
              'Struk digital terkirim tanpa printer tambahan',
              'Setiap transaksi tercatat untuk laporan dan komisi',
            ].map((t) => (
              <li key={t} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success-50 text-success-600">
                  <Icon name="check" size={12} />
                </span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
