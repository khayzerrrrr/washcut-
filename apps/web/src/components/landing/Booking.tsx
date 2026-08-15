import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';
import type { Vertical } from './Hero';

const steps: Record<Vertical, readonly (readonly [string, string])[]> = {
  barbershop: [
    ['tag', 'Pilih layanan'],
    ['scissors', 'Pilih barber'],
    ['calendar', 'Pilih waktu'],
    ['check', 'Konfirmasi'],
    ['wallet', 'Pembayaran'],
    ['clock', 'Janji dibuat'],
  ],
  car_wash: [
    ['tag', 'Pilih layanan'],
    ['calendar', 'Pilih waktu'],
    ['check', 'Konfirmasi'],
    ['wallet', 'Pembayaran'],
    ['clock', 'Janji dibuat'],
  ],
};

export function Booking({ vertical }: { vertical: Vertical }) {
  const currentSteps = steps[vertical];
  const note =
    vertical === 'barbershop'
      ? 'Jadwal yang bentrok otomatis dicegah. Jika barber penuh, sistem menawarkan slot terdekat.'
      : 'Slot bay yang bentrok otomatis dicegah. Jika bay penuh, sistem menawarkan slot terdekat.';
  return (
    <Section id="booking">
      <SectionHeader
        kicker="Sistem booking"
        title={
          <>
            Booking yang bekerja <span className="text-brand-600">mengikuti bisnis Anda</span>
          </>
        }
        subtitle="Alur booking online yang jelas dari pemilihan layanan sampai janji terkunci. Pelanggan juga bisa mengubah jadwal sendiri."
      />

      <ol className="mx-auto mt-12 grid max-w-5xl gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {currentSteps.map(([icon, label], i) => (
          <li key={label} className="relative rounded-2xl border border-ink-200 bg-white p-4 text-center shadow-sm">
            <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Icon name={icon} size={20} />
            </span>
            <span className="mt-3 block text-xs font-bold text-brand-600">Langkah {i + 1}</span>
            <span className="mt-0.5 block text-sm font-semibold text-ink-900">{label}</span>
            {i < currentSteps.length - 1 && (
              <Icon name="arrowRight" size={16} className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-ink-300 sm:block" />
            )}
          </li>
        ))}
      </ol>

      <p className="mt-8 text-center text-sm text-ink-500">{note}</p>
    </Section>
  );
}
