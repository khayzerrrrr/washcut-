import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, StaffPosition, User } from '@washcut/shared';
import { api } from '../lib/api';
import { getUser } from '../lib/auth';
import { Card, EmptyState, PageHeader, TableSkeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Field, Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';

type RoleChoice = 'admin' | 'capster' | 'washer';

function roleBadge(u: User) {
  if (u.role === 'owner') return <Badge tone="amber">Owner</Badge>;
  if (u.role === 'admin') return <Badge tone="brand">Admin</Badge>;
  if (u.role === 'staff') {
    if (u.position === 'washer') return <Badge tone="cyan">Washer</Badge>;
    if (u.position === 'capster') return <Badge tone="blue">Capster</Badge>;
    return <Badge tone="gray">Staff</Badge>;
  }
  return <Badge tone="gray">{u.role}</Badge>;
}

export function StaffPage() {
  const { business } = useOutletContext<{ business: Business }>();
  const user = getUser();
  const [list, setList] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState<{ name: string; email: string; password: string; role: RoleChoice }>({ name: '', email: '', password: '', role: 'admin' });
  const [commission, setCommission] = useState<{ enabled: boolean; rate: number }>({ enabled: false, rate: 0 });
  const [commissionLoading, setCommissionLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');

  const canAdd = user?.role === 'owner' || user?.role === 'admin';
  const canManageCommission = user?.role === 'owner';

  const load = () => {
    setLoading(true);
    api
      .listStaffAccounts(business.id)
      .then((r) => {
        if (r.ok) setList(r.data);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [business.id]);

  useEffect(() => {
    api
      .getCommission(business.id)
      .then((r) => {
        if (r.ok) setCommission(r.data);
      })
      .catch(() => undefined)
      .finally(() => setCommissionLoading(false));
  }, [business.id]);

  const roleOptions: { value: RoleChoice; label: string; hint: string }[] = [
    { value: 'admin', label: 'Admin', hint: 'Mengelola operasional bisnis' },
    ...(business.type === 'barbershop' ? [{ value: 'capster' as const, label: 'Capster', hint: 'Staff pemotong rambut' }] : []),
    ...(business.type === 'car_wash' ? [{ value: 'washer' as const, label: 'Washer', hint: 'Staff pencuci kendaraan' }] : []),
  ];

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setBusy(true);
    const role = form.role === 'admin' ? 'admin' : 'staff';
    const position: StaffPosition | undefined = form.role === 'capster' ? 'capster' : form.role === 'washer' ? 'washer' : undefined;
    try {
      const r = await api.createStaffAccount(business.id, { name: form.name, email: form.email, password: form.password, role, ...(position ? { position } : {}) });
      setBusy(false);
      if (r.ok) {
        setList((p) => [...p, r.data]);
        setOpen(false);
        setForm({ name: '', email: '', password: '', role: 'admin' });
        setSuccess(`Akun ${r.data.name} berhasil ditambahkan.`);
      }
    } catch (err) {
      setBusy(false);
      setError((err as { error?: { message?: string } })?.error?.message ?? 'Tidak dapat terhubung ke server');
    }
  };

  const toggleCommission = async (enabled: boolean) => {
    if (!canManageCommission) return;
    setSaving(true);
    setError('');
    try {
      const r = await api.updateCommission(business.id, { enabled });
      setSaving(false);
      if (r.ok) setCommission(r.data);
    } catch (err) {
      setSaving(false);
      setError((err as { error?: { message?: string } })?.error?.message ?? 'Gagal menyimpan komisi');
    }
  };

  const saveRate = async (rate: number) => {
    if (!canManageCommission) return;
    setSaving(true);
    setError('');
    try {
      const r = await api.updateCommission(business.id, { enabled: commission.enabled, rate });
      setSaving(false);
      if (r.ok) setCommission(r.data);
    } catch (err) {
      setSaving(false);
      setError((err as { error?: { message?: string } })?.error?.message ?? 'Gagal menyimpan komisi');
    }
  };

  return (
    <>
      <PageHeader
        title="Karyawan"
        subtitle={`Tim dan komisi di ${business.name}`}
        action={canAdd ? <button className="btn-primary" onClick={() => setOpen(true)}><Icon name="plus" size={16} /> Tambah Karyawan</button> : undefined}
      />

      {success && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-success-500/40 bg-success-500/10 px-3 py-2 text-sm text-success-700">
          <Icon name="check" size={15} />
          {success}
        </div>
      )}

      {loading ? (
        <Card className="p-0 overflow-hidden">
          <TableSkeleton rows={5} cols={4} />
        </Card>
      ) : list.length === 0 ? (
        <EmptyState title="Belum ada karyawan" hint="Tambahkan tim Anda untuk mulai." />
      ) : (
        <Card className="p-0 overflow-hidden">
          <div className="border-b border-ink-100 bg-ink-50 px-5 py-3">
            <h2 className="font-display text-sm font-bold text-ink-700">Daftar Karyawan ({list.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-ink-100">
                  <th className="th">Karyawan</th>
                  <th className="th">Email</th>
                  <th className="th text-right">Peran</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {list.map((u) => (
                  <tr key={u.id} className="hover:bg-ink-50/50">
                    <td className="td">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                          {u.name.charAt(0).toUpperCase()}
                        </span>
                        <p className="font-semibold text-ink-900">{u.name}</p>
                      </div>
                    </td>
                    <td className="td">{u.email}</td>
                    <td className="td text-right">{roleBadge(u)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {user?.role !== 'staff' && (
        <Card className="p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-ink-900">Komisi Staff</h2>
              <p className="mt-0.5 text-sm text-ink-500">Persentase komisi yang dibayarkan ke staff dari total pendapatan.</p>
            </div>
            {canManageCommission && (
              <button
                role="switch"
                aria-checked={commission.enabled}
                aria-label="Aktifkan komisi staff"
                disabled={commissionLoading || saving}
                onClick={() => toggleCommission(!commission.enabled)}
                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50 ${commission.enabled ? 'bg-brand-600' : 'bg-ink-300'}`}
              >
                <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${commission.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            )}
          </div>
          {commissionLoading ? (
            <div className="mt-4 space-y-3">
              <div className="h-4 animate-pulse rounded-lg bg-ink-200/70" />
              <div className="h-4 animate-pulse rounded-lg bg-ink-200/70 w-1/2" />
            </div>
          ) : (
            <div className="mt-4">
              <div className="flex items-center justify-between rounded-xl border border-ink-200 px-4 py-3">
                <span className="text-sm font-semibold text-ink-700">Komisi aktif</span>
                <span className="text-xs text-ink-500">{commission.enabled ? 'Aktif' : 'Nonaktif'}</span>
              </div>
              <label className="label mt-4">Persentase Komisi (%)</label>
              <div className="flex items-center gap-3">
                <input
                  className="input max-w-[180px]"
                  type="number"
                  min={0}
                  max={100}
                  disabled={!commission.enabled || !canManageCommission || saving}
                  value={commission.rate || ''}
                  onChange={(e) => {
                    const v = Math.min(100, Math.max(0, Number(e.target.value) || 0));
                    setCommission((c) => ({ ...c, rate: v }));
                  }}
                  onBlur={() => saveRate(commission.rate)}
                  placeholder="cth: 10"
                />
                {saving && <span className="btn-spinner text-brand-600" />}
              </div>
              {!canManageCommission && (
                <p className="mt-2 text-xs text-ink-500">Hanya owner yang dapat mengubah pengaturan komisi.</p>
              )}
              {!commission.enabled && (
                <p className="mt-2 text-xs text-ink-500">Nyalakan toggle untuk mengaktifkan skema komisi.</p>
              )}
            </div>
          )}
        </Card>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Karyawan">
        <form onSubmit={create} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-sm text-danger-600">
              <Icon name="alert" size={15} />
              {error}
            </div>
          )}
          <Field label="Nama">
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="cth: Budi Santoso" autoFocus />
          </Field>
          <Field label="Email">
            <input className="input" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="cth: budi@email.com" />
          </Field>
          <Field label="Password">
            <input className="input" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Minimal 6 karakter" />
          </Field>
          <Field label="Peran">
            <div className="grid gap-2">
              {roleOptions.map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: o.value })}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition ${
                    form.role === o.value ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-300 text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  <span className="font-semibold">{o.label}</span>
                  <span className="text-xs text-ink-400">{o.hint}</span>
                </button>
              ))}
            </div>
          </Field>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? <><span className="btn-spinner" /> Menyimpan...</> : 'Simpan'}
          </button>
        </form>
      </Modal>
    </>
  );
}
