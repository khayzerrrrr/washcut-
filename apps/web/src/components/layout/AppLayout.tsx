import { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import type { AppNotification, Business, Role } from '@washcut/shared';
import { clearSession, getUser } from '../../lib/auth';
import { api } from '../../lib/api';
import { Badge } from '../ui/Badge';
import { Icon } from '../ui/Icon';
import { Logo } from '../ui/Logo';
import { EmptyState } from '../ui/Card';

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return 'baru saja';
  if (min < 60) return `${min} menit lalu`;
  const hour = Math.floor(min / 60);
  if (hour < 24) return `${hour} jam lalu`;
  const day = Math.floor(hour / 24);
  return `${day} hari lalu`;
}

const roleLabel: Record<Role, string> = {
  super_admin: 'Super Admin',
  owner: 'Owner',
  admin: 'Admin',
  staff: 'Staff',
  customer: 'Customer',
};

const nav = [
  { to: 'dashboard', label: 'Overview', icon: 'chart' },
  { to: 'bookings', label: 'Appointments', icon: 'calendar' },
  { to: 'queue', label: 'Queue', icon: 'layers' },
  { to: 'customers', label: 'Customers', icon: 'users' },
  { to: 'services', label: 'Services', icon: 'scissors' },
  { to: 'staff', label: 'Staff', icon: 'user' },
  { to: 'checkout', label: 'POS', icon: 'cash' },
  { to: 'inventory', label: 'Inventory', icon: 'box' },
  { to: 'membership', label: 'Membership', icon: 'gift' },
  { to: 'reports', label: 'Reports', icon: 'note' },
  { to: 'branches', label: 'Branches', icon: 'mapPin' },
  { to: 'settings', label: 'Settings', icon: 'settings' },
];

const mobileNav = [
  { to: 'dashboard', label: 'Overview', icon: 'chart' },
  { to: 'bookings', label: 'Appointments', icon: 'calendar' },
  { to: 'queue', label: 'Queue', icon: 'layers' },
  { to: 'checkout', label: 'POS', icon: 'cash' },
  { to: 'settings', label: 'Menu', icon: 'grid' },
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
  dark = false,
}: {
  to: string;
  label: string;
  icon: string;
  onNavigate?: () => void;
  compact?: boolean;
  dark?: boolean;
}) {
  const active = 'bg-brand-600/90 text-white shadow';
  const idle = dark
    ? 'text-ink-300 hover:bg-ink-800 hover:text-white'
    : 'text-ink-600 hover:bg-ink-100 hover:text-ink-900';
  return (
    <NavLink
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl font-medium transition-colors ${
          compact ? 'px-3 py-1.5 text-[10px]' : 'px-3 py-2.5 text-sm'
        } ${isActive ? active : idle}`
      }
    >
      <Icon name={icon} size={compact ? 20 : 18} />
      {label}
    </NavLink>
  );
}

export function AppLayout({ business, onChange }: { business: Business; onChange?: (b: Business) => void }) {
  const navigate = useNavigate();
  const user = getUser();
  const initial = (user?.name || business.name).charAt(0).toUpperCase();
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);

  useEffect(() => {
    let active = true;
    api.listNotifications(business.id).then((r) => {
      if (active && r.ok) setNotifs(r.data);
    });
    return () => {
      active = false;
    };
  }, [business.id]);

  const unread = notifs.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    await api.markNotificationRead(business.id, id, true);
  };

  const markAllRead = async () => {
    const unreadIds = notifs.filter((n) => !n.read).map((n) => n.id);
    setNotifs((prev) => prev.map((n) => ({ ...n, read: true })));
    await Promise.all(unreadIds.map((id) => api.markNotificationRead(business.id, id, true)));
  };

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col bg-ink-900 px-4 py-6 lg:flex">
        <button onClick={() => navigate('/')} className="mb-8 flex items-center gap-2 px-2 text-left">
          <Logo src={business.logo} sizeClass="h-9 w-auto" alt={business.name} />
          <span className="text-sm font-bold text-white">{business.name}</span>
        </button>

        <nav className="flex flex-col gap-1">
          {nav.map((n) => (
            <NavLinkItem key={n.to} to={`/app/${business.id}/${n.to}`} label={n.label} icon={n.icon} dark />
          ))}
        </nav>

        <div className="mt-auto rounded-xl bg-ink-800 p-3">
          <p className="text-[11px] text-ink-400">Bisnis aktif</p>
          <p className="mt-0.5 flex items-center justify-between text-sm font-semibold text-white">
            {business.name} <TypeBadge type={business.type} />
          </p>
        </div>
      </aside>

      {/* Konten */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Topbar (desktop) */}
        <header className="sticky top-0 z-20 hidden items-center gap-4 border-b border-ink-200 bg-white/90 px-6 py-3 backdrop-blur lg:flex">
          <div className="relative w-full max-w-md">
            <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-9" placeholder="Cari pelanggan, layanan, atau transaksi…" />
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <button
                className="relative rounded-xl p-2 text-ink-500 hover:bg-ink-100 hover:text-ink-800"
                aria-label="Notifikasi"
                aria-expanded={notifOpen}
                onClick={() => setNotifOpen((o) => !o)}
              >
                <Icon name="bell" size={20} />
                {unread > 0 && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white">{unread}</span>
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} aria-hidden />
                  <div className="absolute right-0 z-40 mt-2 w-80 rounded-2xl border border-ink-200 bg-white shadow-2xl" role="menu" aria-label="Notifikasi">
                    <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3">
                      <p className="text-sm font-bold text-ink-900">Notifikasi</p>
                      {unread > 0 && (
                        <button type="button" onClick={markAllRead} className="text-xs font-semibold text-brand-600 hover:underline">
                          Tandai semua dibaca
                        </button>
                      )}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.length === 0 ? (
                        <div className="p-4">
                          <EmptyState title="Tidak ada notifikasi" hint="Notifikasi baru akan muncul di sini." />
                        </div>
                      ) : (
                        <ul className="divide-y divide-ink-100">
                          {notifs.map((n) => (
                            <li key={n.id} className={`flex items-start gap-3 px-4 py-3 ${n.read ? '' : 'bg-brand-50/40'}`}>
                              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${n.read ? 'bg-ink-300' : 'bg-brand-500'}`} />
                              <div className="min-w-0 flex-1">
                                <p className={`text-sm ${n.read ? 'text-ink-600' : 'font-semibold text-ink-900'}`}>{n.title}</p>
                                {n.message && <p className="mt-0.5 text-xs text-ink-500">{n.message}</p>}
                                <p className="mt-1 text-[11px] text-ink-400">{relativeTime(n.createdAt)}</p>
                              </div>
                              {!n.read && (
                                <button type="button" onClick={() => markRead(n.id)} className="text-xs font-semibold text-brand-600 hover:underline">
                                  Tandai dibaca
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            <button className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-ink-100" aria-label="Ganti cabang">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
                <Icon name="building" size={15} />
              </span>
              <span className="max-w-[160px] truncate">{business.name}</span>
              <Icon name="chevronDown" size={14} className="text-ink-400" />
            </button>
            <div className="flex items-center gap-2 rounded-xl border-l border-ink-200 pl-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">{initial}</span>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-ink-900">{user?.name || 'Owner'}</p>
                <p className="text-xs text-ink-500">{user ? roleLabel[user.role] : 'Administrator'}</p>
              </div>
            </div>
            <button
              onClick={logout}
              aria-label="Keluar"
              className="rounded-xl p-2 text-ink-500 hover:bg-ink-100 hover:text-danger-600"
            >
              <Icon name="logout" size={20} />
            </button>
          </div>
        </header>

        {/* Topbar mobile */}
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-ink-200 bg-ink-900 px-4 py-3 lg:hidden">
          <button onClick={() => navigate('/')} className="flex items-center gap-2">
            <Logo src={business.logo} sizeClass="h-8 w-auto" alt={business.name} />
            <span className="text-sm font-bold text-white">{business.name}</span>
          </button>
          <div className="flex items-center gap-2">
            <button className="relative rounded-xl p-2 text-ink-300" aria-label="Notifikasi">
              <Icon name="bell" size={20} />
              {unread > 0 && (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-[10px] font-bold text-white">{unread}</span>
              )}
            </button>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">{initial}</span>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-24 sm:px-6 lg:py-8 lg:pb-8">
          <Outlet context={{ business, updateBusiness: onChange }} />
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-ink-700 bg-ink-900/95 px-2 py-2 backdrop-blur lg:hidden">
        {mobileNav.map((n) => (
          <NavLinkItem
            key={n.to}
            to={`/app/${business.id}/${n.to}`}
            label={n.label}
            icon={n.icon}
            compact
            dark
          />
        ))}
      </nav>
    </div>
  );
}
