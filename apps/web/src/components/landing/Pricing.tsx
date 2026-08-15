import { Section, SectionHeader, WHATSAPP_URL } from './shared';
import { Icon } from '../ui/Icon';

const plans = [
  {
    name: 'STARTER',
    desc: 'Untuk satu cabang baru memulai.',
    highlight: false,
    features: ['1 cabang', 'Hingga 3 staf', 'Booking & antrian', 'Kasir & pembayaran', 'Laporan dasar'],
  },
  {
    name: 'GROWTH',
    desc: 'Paling populer untuk bisnis yang berkembang.',
    highlight: true,
    features: ['Hingga 3 cabang', 'Staf tanpa batas', 'Semua fitur STARTER', 'Membership & loyalitas', 'Otomasi & reminder', 'Analitik lanjutan'],
  },
  {
    name: 'PRO',
    desc: 'Untuk operasional multi-cabang penuh.',
    highlight: false,
    features: ['Cabang tanpa batas', 'Inventori & supplier', 'Izin akses per cabang', 'API & integrasi', 'Dukungan prioritas'],
  },
] as const;

export function Pricing() {
  return (
    <Section id="harga">
      <SectionHeader
        kicker="Harga"
        title={
          <>
            Paket yang <span className="text-brand-600">fleksibel</span> untuk bisnis Anda
          </>
        }
        subtitle="Untuk informasi harga dan paket yang paling sesuai, silakan hubungi admin kami melalui WhatsApp. Tim kami siap membantu."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`flex flex-col rounded-3xl p-6 sm:p-8 ${
              plan.highlight
                ? 'border-2 border-brand-600 bg-white shadow-xl shadow-brand-600/10'
                : 'border border-ink-200 bg-white'
            }`}
          >
            {plan.highlight && (
              <span className="badge mb-4 self-start bg-brand-600 text-white">Paling populer</span>
            )}
            <h3 className="font-display text-lg font-extrabold text-ink-900">{plan.name}</h3>
            <p className="mt-2 text-sm text-ink-500">{plan.desc}</p>
            <ul className="mt-6 flex-1 space-y-3 text-sm text-ink-700">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon name="check" size={12} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-7 w-full ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}
            >
              <Icon name="whatsapp" size={16} filled />
              Hubungi Admin
            </a>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-ink-200 bg-white p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
        <div>
          <h3 className="text-lg font-bold text-ink-900">Butuh paket khusus?</h3>
          <p className="mt-1 text-sm text-ink-500">
            Konsultasikan kebutuhan bisnis Anda langsung dengan admin kami.
          </p>
        </div>
        <a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-5 inline-flex items-center gap-2 sm:mt-0"
        >
          <Icon name="whatsapp" size={16} filled />
          Hubungi Admin
        </a>
      </div>
    </Section>
  );
}
