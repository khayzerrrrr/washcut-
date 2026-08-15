import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const nodes = [
  ['users', 'Pelanggan', 'Profil, riwayat, dan preferensi'],
  ['calendar', 'Janji temu', 'Booking dan jadwal'],
  ['scissors', 'Karyawan', 'Jadwal, komisi, performa'],
  ['cash', 'Pembayaran', 'Kasir dan transaksi'],
  ['box', 'Inventori', 'Stok dan pembelian'],
  ['chart', 'Laporan', 'Data dan performa'],
  ['building', 'Cabang', 'Multi lokasi'],
] as const;

export function Solution() {
  return (
    <Section id="solusi" dark>
      <SectionHeader
        dark
        kicker="Solusi"
        title={
          <>
            Satu sistem operasi. <span className="text-cyan-400">Semuanya terhubung.</span>
          </>
        }
        subtitle="Dari pusat WASHCUT, setiap modul berbagi data yang sama. Satu kali update, terlihat di seluruh bagian bisnis Anda."
      />

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="hidden items-center justify-center lg:flex">
          <div className="relative flex h-56 w-56 items-center justify-center rounded-full border border-white/10 bg-gradient-to-br from-brand-600/20 to-cyan-500/10">
            <div className="flex h-20 w-20 flex-col items-center justify-center rounded-2xl border border-brand-500/40 bg-ink-900 text-center shadow-lg shadow-brand-500/10">
              <Icon name="zap" size={24} className="text-cyan-400" />
              <span className="mt-1 text-xs font-bold text-white">WASHCUT</span>
            </div>
            <span className="absolute -inset-4 rounded-full border border-brand-500/10" />
          </div>
        </div>

        {nodes.map(([icon, title, desc]) => (
          <div key={title} className="card-dark p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset bg-brand-500/15 text-brand-300 ring-brand-500/30">
              <Icon name={icon} size={20} />
            </span>
            <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-ink-400">{desc}</p>
          </div>
        ))}

        <div className="hidden items-center justify-center lg:flex">
          <p className="max-w-[10rem] text-sm leading-relaxed text-ink-400">
            Satu sumber data terpusat yang dipakai setiap modul secara real-time.
          </p>
        </div>
      </div>
    </Section>
  );
}
