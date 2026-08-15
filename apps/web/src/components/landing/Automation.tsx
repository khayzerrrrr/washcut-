import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const automations = [
  ['calendar', 'Reminder janji', 'Ingatkan pelanggan otomatis sebelum jadwal', 'brand'],
  ['box', 'Alert stok', 'Beri tahu saat stok melewati ambang minimum', 'cyan'],
  ['chart', 'Laporan harian', 'Kirim ringkasan pendapatan tiap malam', 'info'],
  ['cash', 'Notifikasi pembayaran', 'Konfirmasi pembayaran yang masuk real-time', 'success'],
  ['users', 'Follow-up pelanggan', 'Ingatkan kembali pelanggan yang sudah lama', 'warn'],
  ['bell', 'Notifikasi staff', 'Sampaikan update jadwal ke tiap staf', 'brand'],
] as const;

export function Automation() {
  return (
    <Section id="otomasi">
      <SectionHeader
        kicker="Otomasi"
        title={
          <>
            Biarkan WASHCUT <span className="text-brand-600">mengurus rutinitas</span>
          </>
        }
        subtitle="Tugas berulang berjalan otomatis di latar belakang, sehingga Anda fokus pada pelanggan — bukan administrasi."
      />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {automations.map(([icon, title, desc, tone]) => (
          <div key={title} className="card p-6">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${tone === 'brand' ? 'bg-brand-50 text-brand-600 ring-brand-200' : tone === 'cyan' ? 'bg-cyan-50 text-cyan-600 ring-cyan-200' : tone === 'info' ? 'bg-info-50 text-info-600 ring-info-200' : tone === 'success' ? 'bg-success-50 text-success-600 ring-success-200' : 'bg-warn-50 text-warn-600 ring-warn-200'}`}>
                <Icon name={icon} size={20} />
              </span>
              <span className="badge ring-1 ring-inset bg-success-50 text-success-700 ring-success-200">Otomatis</span>
            </div>
            <h3 className="mt-4 text-base font-bold text-ink-900">{title}</h3>
            <p className="mt-1 text-sm text-ink-500">{desc}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
