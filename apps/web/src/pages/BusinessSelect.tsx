import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Business } from '@washcut/shared';
import { api } from '../lib/api';
import { clearSession, getUser } from '../lib/auth';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Logo } from '../components/ui/Logo';
import { Card, EmptyState, Skeleton } from '../components/ui/Card';

export function BusinessSelect() {
  const navigate = useNavigate();
  const user = getUser();
  const [list, setList] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.listMyBusinesses().then((r) => {
      if (r.ok) setList(r.data);
      setLoading(false);
    });
  }, []);

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-ink-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <span className="badge ring-1 ring-inset ring-brand-200 bg-brand-50 text-brand-700">Owner</span>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-danger-600">
            <Icon name="logout" size={15} /> Keluar
          </button>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Pilih Bisnis</h1>
        <p className="mt-1 text-sm text-ink-500">
          {user?.name ? `Halo ${user.name}, ` : ''}Anda memiliki {list.length} bisnis. Pilih untuk masuk ke dashboard.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-11 w-11" />
                  <Skeleton className="mt-4 h-5 w-2/3" />
                  <Skeleton className="mt-2 h-3 w-1/3" />
                </Card>
              ))
            : list.length === 0
              ? <div className="sm:col-span-2"><Card className="p-0"><EmptyState title="Belum ada bisnis" hint="Hubungi administrator untuk membuat tenant." /></Card></div>
              : list.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/app/${b.id}/dashboard`)}
              className="card p-6 text-left transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <Logo src={b.logo} sizeClass="h-11 w-auto" alt={b.name} />
                <Badge tone={b.type === 'barbershop' ? 'brand' : 'blue'}>
                  {b.type === 'barbershop' ? 'Barbershop' : 'Car Wash'}
                </Badge>
              </div>
              <p className="mt-4 font-bold text-ink-900">{b.name}</p>
              <p className="text-xs text-ink-500">/{b.slug}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone={b.status === 'active' ? 'green' : 'amber'}>{b.status === 'active' ? 'Aktif' : 'Trial'}</Badge>
                <span className="text-xs text-ink-500">Buka dashboard →</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
