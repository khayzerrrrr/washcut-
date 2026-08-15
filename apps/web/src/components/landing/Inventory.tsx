import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';
import type { Vertical } from './Hero';

const items: Record<Vertical, readonly (readonly [string, number, string])[]> = {
  barbershop: [
    ['Shampoo Premium 1L', 42, 'brand'],
    ['Gel Rambut 120ml', 12, 'warn'],
    ['Pomade Kuat 100g', 8, 'warn'],
    ['Masker Rambut', 4, 'danger'],
  ],
  car_wash: [
    ['Shampo Mobil 5L', 42, 'brand'],
    ['Kain Microfiber', 18, 'cyan'],
    ['Polesan Compound', 8, 'warn'],
    ['Pewangi Interior', 4, 'danger'],
  ],
};

const features = [
  ['box', 'Katalog produk', 'Simpan produk, varian, dan harga beli–jual.'],
  ['clock', 'Stok menipis', 'Notifikasi saat stok melewati ambang minimum.'],
  ['truck', 'Pembelian & supplier', 'Catat pembelian dan sumber barang dengan rapi.'],
  ['chart', 'Pergerakan stok', 'Lacak barang masuk, keluar, dan terpakai.'],
] as const;

export function Inventory({ vertical }: { vertical: Vertical }) {
  const currentItems = items[vertical];
  return (
    <Section id="inventori">
      <SectionHeader
        kicker="Inventori"
        title={
          <>
            Tahu stok <span className="text-brand-600">sebelum habis</span>
          </>
        }
        subtitle="Jangan sampai kehabisan barang di tengah hari ramai. Inventori memberi tahu lebih awal."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
            <span className="text-sm font-bold text-ink-900">Level stok</span>
            <span className="text-xs text-ink-500">diperbarui real-time</span>
          </div>
          <ul className="divide-y divide-ink-100 px-5">
            {currentItems.map(([name, stock, tone]) => (
              <li key={name as string} className="flex items-center gap-4 py-3.5">
                <div className="flex-1">
                  <p className="text-sm font-medium text-ink-900">{name}</p>
                  <div className="mt-1.5 h-2 rounded-full bg-ink-100">
                    <div
                      className={`h-full rounded-full ${tone === 'danger' ? 'bg-danger-500' : tone === 'warn' ? 'bg-warn-500' : tone === 'cyan' ? 'bg-cyan-500' : 'bg-brand-600'}`}
                      style={{ width: `${stock}%` }}
                    />
                  </div>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${tone === 'danger' ? 'text-danger-600' : tone === 'warn' ? 'text-warn-600' : 'text-ink-700'}`}
                >
                  {stock} unit
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(([icon, title, desc]) => (
            <div key={title} className="card p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                <Icon name={icon} size={20} />
              </span>
              <h3 className="mt-3 text-sm font-bold text-ink-900">{title}</h3>
              <p className="mt-1 text-sm text-ink-500">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
