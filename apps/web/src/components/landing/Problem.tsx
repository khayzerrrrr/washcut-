import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const barbershopFlow = ['Booking', 'Staff', 'Layanan', 'Pembayaran', 'Pelanggan'];
const carwashFlow = ['Antrian', 'Bay', 'Layanan', 'Pembayaran', 'Pelanggan'];

const withoutWashcut = [
  ['note', 'Spreadsheet untuk jadwal'],
  ['mobile', 'Booking lewat WhatsApp'],
  ['cash', 'POS terpisah per kasir'],
  ['trash', 'Catatan manual di buku'],
] as const;

export function Problem() {
  return (
    <Section id="masalah">
      <SectionHeader
        kicker="Masalah"
        title={
          <>
            Menjalankan dua bisnis jasa{' '}
            <span className="text-brand-600">tidak berarti dua sistem</span>
          </>
        }
        subtitle="Booking, staf, pembayaran, dan laporan berpencar di aplikasi berbeda. Semakin banyak tool, semakin banyak pekerjaan yang terlewat."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        <FlowCard
          icon="scissors"
          title="Barbershop"
          tone="text-brand-600 bg-brand-50"
          flow={barbershopFlow}
        />
        <FlowCard
          icon="car"
          title="Car wash"
          tone="text-cyan-600 bg-cyan-50"
          flow={carwashFlow}
        />
      </div>

      <div className="mt-10 rounded-2xl border border-danger-200 bg-white p-6 sm:p-8">
        <p className="flex items-center gap-2 text-sm font-semibold text-danger-600">
          <Icon name="x" size={16} />
          Tanpa WASHCUT, urutan itu tersebar
        </p>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {withoutWashcut.map(([icon, label]) => (
            <li key={label} className="flex items-center gap-3 rounded-xl border border-ink-200 bg-ink-50 px-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-danger-50 text-danger-500">
                <Icon name={icon} size={18} />
              </span>
              <span className="text-sm font-medium text-ink-700">{label}</span>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-sm text-ink-500">
          Hasilnya: antrian menumpuk, laporan dibuat manual setiap malam, dan pelanggan menunggu lebih lama.
        </p>
      </div>
    </Section>
  );
}

function FlowCard({
  icon,
  title,
  tone,
  flow,
}: {
  icon: string;
  title: string;
  tone: string;
  flow: string[];
}) {
  return (
    <div className="card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${tone}`}>
          <Icon name={icon} size={20} />
        </span>
        <h3 className="font-display text-xl font-bold text-ink-900">{title}</h3>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        {flow.map((step, i) => (
          <div key={step} className="flex items-center gap-2">
            <span className="rounded-xl border border-brand-200 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">
              {step}
            </span>
            {i < flow.length - 1 && <Icon name="arrowRight" size={16} className="text-ink-400" />}
          </div>
        ))}
      </div>
    </div>
  );
}
