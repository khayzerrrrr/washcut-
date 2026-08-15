import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import type { Business } from '@washcut/shared';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';

const nav = [
  { to: 'dashboard', label: 'Dashboard', icon: 'chart' as const },
  { to: 'bookings', label: 'Pesanan', icon: 'calendar' as const },
  { to: 'services', label: 'Layanan', icon: 'tag' as const },
  { to: 'customers', label: 'Pelanggan', icon: 'users' as const },
  { to: 'checkout', label: 'Kasir', icon: 'cash' as const },
];

function TypeBadge({ type }: { type: Business['type'] }) {
  return <Badge tone={type === 'barbershop' ? 'brand' : 'blue'}>{type === 'barbershop' ? 'Barbershop' : 'Car Wash'}</Badge>;
}

function NavLinkItem({
  to,
  label,
  icon,
  onNavigate,
  compact = false,
}: {
  to: string;
  label: string;
  icon: string;
  onNavigate?: () => void;
  compact?: boolean;
}) {
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl font-medium transition-colors ${
          compact ? 'px-3 py-1.5 text-[10px]' : 'px-3 py-2.5 text-sm'
        } ${isActive ? 'bg-brand-600/90 text-white shadow' : 'text-ink-300 hover:bg-ink-800 hover:text-white'}`
      }
    >
      <Icon name={icon} size={compact ? 20 : 18} />
      {label}
    </NavLink>
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

        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <NavLinkItem key={n.to} to={`/app/${business.id}/${n.to}`} label={n.label} icon={n.icon} />
          ))}
          <NavLinkItem to={`/app/${business.id}/settings`} label="Pengaturan" icon="settings" />
        </nav>

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
          <NavLinkItem
            key={n.to}
            to={`/app/${business.id}/${n.to}`}
            label={n.label}
            icon={n.icon}
            compact
          />
        ))}
      </nav>
    </div>
  );
}