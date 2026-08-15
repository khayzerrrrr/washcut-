import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import type { Business } from '@washcut/shared';
import { Badge } from '../ui/Badge';
import { Logo } from '../ui/Logo';

const nav = [
  { to: 'dashboard', label: 'Dashboard', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
  { to: 'bookings', label: 'Bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2z' },
  { to: 'services', label: 'Layanan', icon: 'M16 11a1 1 0 0 0-1-1H4m12 4h3a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1h-3m-8 0a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3M4 15H2m4-6V5a2 2 0 0 1 4 0v4' },
  { to: 'customers', label: 'Pelanggan', icon: 'M17 20h5v-2a3 3 0 0 0-5.4-1.8M17 20H7m10 0v-2a4 4 0 0 0-3-3.87M7 20H2v-2a3 3 0 0 1 5.4-1.8M7 20v-2a4 4 0 0 1 3-3.87m-1-3.13a3 3 0 1 0-6 0 3 3 0 0 0 6 0zm10 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0z' },
  { to: 'checkout', label: 'Kasir', icon: 'M3 3h18v18H3V3zm3 5h12M3 12h18m-9 0v9M7 16h4' },
];

function TypeBadge({ type }: { type: Business['type'] }) {
  return <Badge tone={type === 'barbershop' ? 'brand' : 'blue'}>{type === 'barbershop' ? 'Barbershop' : 'Car Wash'}</Badge>;
}

function NavItems({ business, onNavigate }: { business: Business; onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((n) => (
        <NavLink
          key={n.to}
          to={`/app/${business.id}/${n.to}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-brand-600/90 text-white shadow' : 'text-ink-300 hover:bg-ink-800 hover:text-white'
            }`
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d={n.icon} />
          </svg>
          {n.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function AppLayout({ business, onChange }: { business: Business; onChange?: (b: Business) => void }) {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink-900 px-4 py-6 lg:flex">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 px-2 text-left">
          <Logo src={business.logo} sizeClass="h-9 w-auto" alt={business.name} />
          <span className="sr-only">{business.name}</span>
        </button>
        <NavItems business={business} />
        <NavLink
          to={`/app/${business.id}/settings`}
          className={({ isActive }) =>
            `mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
              isActive ? 'bg-brand-600/90 text-white shadow' : 'text-ink-300 hover:bg-ink-800 hover:text-white'
            }`
          }
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-3a7.5 7.5 0 0 0-.1-1.2l2.1-1.6-2-3.5-2.5 1a7.7 7.7 0 0 0-2-1.2L14.5 3h-4l-.4 2.5a7.7 7.7 0 0 0-2 1.2l-2.5-1-2 3.5 2.1 1.6a7.5 7.5 0 0 0 0 2.4L3.6 14.8l2 3.5 2.5-1a7.7 7.7 0 0 0 2 1.2l.4 2.5h4l.4-2.5a7.7 7.7 0 0 0 2-1.2l2.5 1 2-3.5-2.1-1.6c.1-.4.1-.8.1-1.2z" />
          </svg>
          Pengaturan
        </NavLink>
        <div className="mt-auto rounded-xl bg-ink-800 p-3">
          <p className="text-[11px] text-ink-400">Bisnis aktif</p>
          <p className="mt-0.5 flex items-center justify-between text-sm font-semibold text-white">
            {business.name} <TypeBadge type={business.type} />
          </p>
        </div>
      </aside>

      {/* Konten */}
      <div className="flex-1 lg:pl-64">
        {/* Topbar mobile */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-200 bg-white/90 px-4 py-3 backdrop-blur lg:hidden">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Logo src={business.logo} sizeClass="h-8 w-auto" alt={business.name} />
            <span className="sr-only">{business.name}</span>
          </button>
          <TypeBadge type={business.type} />
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:py-8 lg:pb-8">
          <Outlet context={{ business, updateBusiness: onChange }} />
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-ink-200 bg-white/95 px-2 py-2 backdrop-blur lg:hidden">
        {nav.map((n) => (
          <NavLink
            key={n.to}
            to={`/app/${business.id}/${n.to}`}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-lg px-3 py-1.5 text-[10px] font-semibold ${
                isActive ? 'text-brand-600' : 'text-ink-400'
              }`
            }
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d={n.icon} />
            </svg>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}