import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const items = [
  ['users', 'Akses berbasis peran', 'Owner, manajer, dan staf punya tingkat akses berbeda'],
  ['key', 'Autentikasi aman', 'Login aman untuk setiap pengguna bisnis Anda'],
  ['shield', 'Proteksi data', 'Isolasi penuh antar tenant di satu platform'],
  ['eye', 'Log aktivitas', 'Catat siapa yang mengubah apa dan kapan'],
  ['building', 'Izin per cabang', 'Atur akses staf berdasarkan lokasi'],
  ['repeat', 'Strategi backup', 'Data terbackup otomatis dan bisa dipulihkan'],
] as const;

export function Security() {
  return (
    <Section id="keamanan" dark>
      <SectionHeader
        dark
        kicker="Keamanan"
        title={
          <>
            Data bisnis Anda <span className="text-cyan-400">tetap milik Anda</span>
          </>
        }
        subtitle="Keamanan dibangun ke dalam platform, bukan ditambahkan setelahnya. Setiap tenant terisolasi penuh."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(([icon, title, desc]) => (
          <div key={title} className="card-dark p-6">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset bg-brand-500/15 text-cyan-300 ring-brand-500/30">
              <Icon name={icon} size={20} />
            </span>
            <h3 className="mt-4 text-base font-bold text-white">{title}</h3>
            <p className="mt-1 text-sm text-ink-400">{desc}</p>
          </div>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-ink-400">
        Setiap bisnis adalah tenant terpisah dengan isolasi data penuh. Pelanggan, layanan, dan
        transaksi Anda tidak pernah tercampur dengan bisnis lain.
      </p>
    </Section>
  );
}
