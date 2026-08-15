import { Section, SectionHeader } from './shared';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const plans = [
  {
    name: 'STARTER',
    price: 'Rp 199rb',
    desc: 'Untuk satu cabang baru memulai.',
    highlight: false,
    features: ['1 cabang', 'Hingga 3 staf', 'Booking & antrian', 'Kasir & pembayaran', 'Laporan dasar'],
  },
  {
    name: 'GROWTH',
    price: 'Rp 449rb',
    desc: 'Paling populer untuk bisnis yang berkembang.',
    highlight: true,
    features: ['Hingga 3 cabang', 'Staf tanpa batas', 'Semua fitur STARTER', 'Membership & loyalitas', 'Otomasi & reminder', 'Analitik lanjutan'],
  },
  {
    name: 'PRO',
    price: 'Rp 899rb',
    desc: 'Untuk operasional multi-cabang penuh.',
    highlight: false,
    features: ['Cabang tanpa batas', 'Inventori & supplier', 'Izin akses per cabang', 'API & integrasi', 'Dukungan prioritas'],
  },
] as const;

const enterpriseFeatures = [
  ['check', 'Pricing custom'],
  ['check', 'Onboarding didampingi'],
  ['check', 'SSO & kebutuhan enterprise'],
] as const;

export function Pricing() {
  return (
    <Section id="harga">
      <SectionHeader
        kicker="Harga"
        title={
          <>
            Harga yang <span className="text-brand-600">tumbuh bersama bisnis Anda</span>
          </>
        }
        subtitle="Mulai gratis, upgrade saat siap. Tidak ada biaya tersembunyi, tanpa kontrak jangka panjang."
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
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-3xl font-extrabold text-ink-900">{plan.price}</span>
              <span className="text-sm text-ink-500">/bulan</span>
            </div>
            <p className="mt-1 text-sm text-ink-500">{plan.desc}</p>
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
            <Link to="/login" className={`mt-7 w-full ${plan.highlight ? 'btn-primary' : 'btn-outline'}`}>
              Pilih {plan.name}
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-3xl border border-ink-200 bg-white p-6 sm:flex sm:items-center sm:justify-between sm:p-8">
        <div>
          <h3 className="text-lg font-bold text-ink-900">Enterprise</h3>
          <p className="mt-1 text-sm text-ink-500">Kebutuhan khusus? Kami siap mendiskusikan solusi.</p>
          <ul className="mt-3 flex flex-wrap gap-3">
            {enterpriseFeatures.map(([icon, label]) => (
              <li key={label} className="flex items-center gap-1.5 text-sm text-ink-700">
                <Icon name={icon} size={15} className="text-brand-600" />
                {label}
              </li>
            ))}
          </ul>
        </div>
        <a href="#cta" className="btn-outline mt-5 sm:mt-0">Hubungi Sales</a>
      </div>
    </Section>
  );
}
