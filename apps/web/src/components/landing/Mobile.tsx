import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const features = [
  ['cash', 'Penjualan hari ini'],
  ['calendar', 'Janji temu'],
  ['clock', 'Antrian'],
  ['users', 'Staf'],
  ['bell', 'Notifikasi'],
] as const;

export function Mobile() {
  return (
    <Section id="mobile" dark>
      <SectionHeader
        dark
        kicker="Pengalaman mobile"
        title={
          <>
            Bisnis Anda tidak berhenti <span className="text-cyan-400">saat Anda pergi</span>
          </>
        }
        subtitle="Pantau dan kelola dari mana saja lewat ponsel. Semua fitur yang sama, di genggaman Anda."
      />

      <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
        <div className="mx-auto w-64 rounded-[2rem] border border-white/10 bg-ink-800/70 p-3 shadow-2xl shadow-brand-950/40">
          <div className="rounded-[1.6rem] bg-ink-900 p-4">
            <div className="mx-auto mb-4 h-1.5 w-20 rounded-full bg-ink-700" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-ink-400">Penjualan hari ini</p>
                <p className="text-xl font-bold text-white">Rp 3,8 jt</p>
              </div>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/15 text-cyan-400">
                <Icon name="cash" size={18} />
              </span>
            </div>
            <div className="mt-4 flex items-end gap-1.5">
              {[40, 65, 50, 80, 60, 90].map((v, i) => (
                <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-brand-600 to-cyan-400" style={{ height: `${v * 0.5}px` }} />
              ))}
            </div>
            <ul className="mt-4 space-y-2.5 text-sm">
              {[
                ['calendar', 'Janji temu', '6 jadwal'],
                ['clock', 'Antrian aktif', '4 orang'],
                ['users', 'Staf online', '5 orang'],
              ].map(([icon, label, value]) => (
                <li key={label} className="flex items-center justify-between rounded-xl border border-white/10 bg-ink-900 px-3 py-2.5">
                  <span className="flex items-center gap-2 text-ink-300">
                    <Icon name={icon} size={15} className="text-cyan-400" />
                    {label}
                  </span>
                  <span className="font-semibold text-white">{value}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-brand-500/30 bg-brand-500/10 px-3 py-2.5">
              <Icon name="bell" size={15} className="text-cyan-300" />
              <span className="text-xs text-ink-200">3 pembayaran belum diverifikasi</span>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {features.map(([icon, title]) => (
            <div key={title} className="card-dark p-6">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset bg-brand-500/15 text-brand-300 ring-brand-500/30">
                <Icon name={icon} size={20} />
              </span>
              <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
              <p className="mt-1 text-sm text-ink-400">
                Semua data utama tersedia langsung di layar ponsel Anda.
              </p>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
