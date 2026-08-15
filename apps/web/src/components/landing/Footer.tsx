import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Icon } from '../ui/Icon';

const productLinks = [
  ['Booking', '#booking'],
  ['Antrian', '#antrian'],
  ['Kasir', '#kasir'],
  ['Inventori', '#inventori'],
  ['Laporan', '#analitik'],
] as const;

const companyLinks = [
  ['Cara kerja', '#produk'],
  ['Harga', '#harga'],
  ['FAQ', '#faq'],
] as const;

const trustSignals = [
  ['shield', 'Data terisolasi per bisnis'],
  ['repeat', 'Akses multi perangkat'],
  ['clock', 'Siap dalam hitungan menit'],
] as const;

export function Footer() {
  return (
    <footer className="bg-ink-900 text-ink-400">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5">
              <Logo sizeClass="h-8 w-auto" alt="WashCut" />
              <span className="font-display text-lg font-extrabold tracking-tight text-white">WashCut</span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Sistem operasional untuk barbershop dan car wash. Booking, antrian, kasir, pelanggan,
              dan laporan dalam satu platform.
            </p>
            <ul className="mt-5 space-y-2">
              {trustSignals.map(([icon, label]) => (
                <li key={label} className="flex items-center gap-2.5 text-sm">
                  <Icon name={icon} size={16} className="text-cyan-400" />
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Produk</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {productLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="transition-colors hover:text-white">{label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Perusahaan</p>
            <ul className="mt-4 space-y-2.5 text-sm">
              {companyLinks.map(([label, href]) => (
                <li key={label}>
                  <a href={href} className="transition-colors hover:text-white">{label}</a>
                </li>
              ))}
            </ul>
            <Link to="/login" className="btn-primary mt-6">Mulai Gratis</Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-ink-500 sm:flex-row">
          <p>© {new Date().getFullYear()} WashCut. Semua hak dilindungi.</p>
          <p className="flex items-center gap-1.5">
            Setiap tenant terisolasi penuh demi keamanan data
            <Icon name="shield" size={12} className="text-cyan-400" />
          </p>
        </div>
      </div>
    </footer>
  );
}
