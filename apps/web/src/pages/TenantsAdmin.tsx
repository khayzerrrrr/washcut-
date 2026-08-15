import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import type { Business } from '@washcut/shared';
import { api } from '../lib/api';
import { clearSession, getUser } from '../lib/auth';
import { Badge, statusLabel, statusTone } from '../components/ui/Badge';
import { Card, PageHeader, Skeleton, TableSkeleton } from '../components/ui/Card';
import { Field, Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';

export function TenantsAdmin() {
  const navigate = useNavigate();
  const user = getUser();
  const [tenants, setTenants] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<Business['type']>('barbershop');
  const [ownerEmail, setOwnerEmail] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [demoDays, setDemoDays] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.listBusinesses().then((r) => {
      if (r.ok) setTenants(r.data);
      setLoading(false);
    });
  }, []);

  if (!user || user.role !== 'super_admin') return <Navigate to="/business" replace />;

  const logout = () => {
    clearSession();
    navigate('/login');
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setError('');
    setBusy(true);
    try {
      const r = await api.createBusiness({
        name,
        type,
        ...(ownerEmail ? { ownerEmail } : {}),
        ...(ownerEmail && ownerPassword ? { ownerPassword } : {}),
        ...(demoDays ? { demoDays: Number(demoDays) } : {}),
      });
      setBusy(false);
      if (r.ok) {
        setTenants((p) => [...p, r.data]);
        setOpen(false);
        setName('');
        setOwnerEmail('');
        setOwnerPassword('');
        setDemoDays('');
      }
    } catch (err) {
      setBusy(false);
      setError((err as { error?: { message?: string } })?.error?.message ?? 'Tidak dapat terhubung ke server');
    }
  };

  const toggleStatus = async (id: string, current: Business['status']) => {
    const next = current === 'suspended' ? 'active' : 'suspended';
    const r = await api.updateBusinessStatus(id, next);
    if (r.ok) setTenants((p) => p.map((t) => (t.id === id ? r.data : t)));
  };

  return (
    <div className="min-h-screen bg-ink-50 px-4 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-ink-500 hover:text-ink-800">
            <Icon name="arrowLeft" size={14} className="mr-1 inline" /> Beranda
          </Link>
          <div className="flex items-center gap-3">
            <Badge tone="brand">Super Admin</Badge>
            <button onClick={logout} className="flex items-center gap-1.5 text-sm font-semibold text-ink-500 hover:text-danger-600">
              <Icon name="logout" size={15} /> Keluar
            </button>
          </div>
        </div>

        <PageHeader
          title="Kelola Tenant"
          subtitle="Setup setiap tenant dan pilih jenis usahanya: car wash atau barbershop."
          action={<button className="btn-primary" onClick={() => setOpen(true)}><Icon name="plus" size={16} /> Buat Tenant</button>}
        />

        <Card className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-ink-100 bg-ink-50">
                  <th className="th">Tenant</th>
                  <th className="th">Jenis Usaha</th>
                  <th className="th">Status</th>
                  <th className="th">Masa Demo</th>
                  <th className="th">Dibuat</th>
                  <th className="th text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {loading
                  ? <tr><td colSpan={6}><TableSkeleton rows={4} cols={5} /></td></tr>
                  : tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-ink-50/50">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                          <Icon name={t.type === 'barbershop' ? 'scissors' : 'car'} size={16} />
                        </span>
                        <div>
                          <p className="font-semibold text-ink-900">{t.name}</p>
                          <p className="text-xs text-ink-500">/{t.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="td">
                      <Badge tone={t.type === 'barbershop' ? 'brand' : 'blue'}>
                        {t.type === 'barbershop' ? 'Barbershop' : 'Car Wash'}
                      </Badge>
                    </td>
                    <td className="td">
                      <Badge tone={statusTone(t.status)}>{statusLabel(t.status)}</Badge>
                    </td>
                    <td className="td">
                      {t.demoUntil ? (
                        <span className="text-xs">
                          {new Date(t.demoUntil).toLocaleDateString('id-ID')}
                          <span className="ml-1 text-ink-400">({Math.max(0, Math.ceil((new Date(t.demoUntil).getTime() - Date.now()) / 86400000))} hari)</span>
                        </span>
                      ) : (
                        <span className="text-xs text-ink-400">—</span>
                      )}
                    </td>
                    <td className="td">{new Date(t.createdAt).toLocaleDateString('id-ID')}</td>
                    <td className="td text-right">
                      <button
                        onClick={() => toggleStatus(t.id, t.status)}
                        className={`text-xs font-semibold ${t.status === 'suspended' ? 'text-success-600 hover:underline' : 'text-danger-600 hover:underline'}`}
                      >
                        {t.status === 'suspended' ? 'Aktifkan' : 'Suspend'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <p className="mt-4 text-xs text-ink-500">
          Data setiap tenant terisolasi penuh di backend — anggota tenant tidak dapat mengakses data tenant lain.
        </p>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Buat Tenant Baru">
        <form onSubmit={create} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-sm text-danger-600">
              <Icon name="alert" size={15} />
              {error}
            </div>
          )}
          <Field label="Nama Tenant">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="cth: Urban Cuts" autoFocus />
          </Field>
          <Field label="Jenis Usaha">
            <div className="grid grid-cols-2 gap-2">
              {(['barbershop', 'car_wash'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    type === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-300 text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  <Icon name={t === 'barbershop' ? 'scissors' : 'car'} size={16} />
                  {t === 'barbershop' ? 'Barbershop' : 'Car Wash'}
                </button>
              ))}
            </div>
          </Field>
          <Field label="Email Owner (opsional)">
            <input className="input" type="email" value={ownerEmail} onChange={(e) => setOwnerEmail(e.target.value)} placeholder="cth: owner@urbancuts.id" />
          </Field>
          <Field label="Password Owner (opsional, min 6)">
            <input className="input" type="password" value={ownerPassword} onChange={(e) => setOwnerPassword(e.target.value)} placeholder="Minimal 6 karakter" />
          </Field>
          <Field label="Durasi Demo (hari, opsional)">
            <input className="input" type="number" min={0} max={365} value={demoDays} onChange={(e) => setDemoDays(e.target.value)} placeholder="cth: 14 — kosongkan jika bukan akun demo" />
          </Field>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? <><span className="btn-spinner" /> Membuat...</> : 'Buat Tenant'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
