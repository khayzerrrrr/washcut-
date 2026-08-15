import { Section } from './shared';
import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

const ecosystem = ['scissors', 'car', 'zap', 'chart'];

export function FinalCta() {
  return (
    <Section id="cta" dark className="!py-0">
      <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-brand-900 via-ink-900 to-ink-900 px-6 py-16 text-center sm:py-20">
        <div className="pointer-events-none absolute -inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(18,107,255,0.22),transparent_60%)]" />

        <div className="relative mx-auto max-w-3xl">
          <div className="flex justify-center gap-3">
            {ecosystem.map((icon, i) => (
              <span
                key={i}
                className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-cyan-300"
              >
                <Icon name={icon} size={22} />
              </span>
            ))}
          </div>

          <h2 className="font-display mt-8 text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Bisnis Anda layak lebih dari{' '}
            <span className="text-cyan-400">spreadsheet</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-base text-ink-300 sm:text-lg">
            Gabungkan booking, antrian, kasir, pelanggan, dan laporan dalam satu sistem yang
            tumbuh dari satu cabang hingga puluhan lokasi.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link to="/login" className="btn-primary btn-lg">
              Mulai Pakai WASHCUT
            </Link>
            <a href="#harga" className="btn-outline-dark btn-lg">
              Lihat Harga
            </a>
          </div>

          <p className="mt-6 text-sm text-ink-400">Tanpa kartu kredit · Setup dalam hitungan menit</p>
        </div>
      </div>
    </Section>
  );
}
