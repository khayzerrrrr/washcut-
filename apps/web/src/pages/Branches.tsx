import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Branch, Business } from '@washcut/shared';
import { api, formatRupiah } from '../lib/api';
import { Card, EmptyState, PageHeader, Skeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Field, Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';

function BranchCard({ branch }: { branch: Branch }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
            <Icon name="building" size={18} />
          </span>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{branch.name}</p>
            <p className="flex items-center gap-1 text-xs text-ink-500"><Icon name="mapPin" size={12} /> {branch.city}</p>
          </div>
        </div>
        <Badge tone={branch.performance >= 90 ? 'green' : branch.performance >= 80 ? 'brand' : 'amber'}>
          {branch.performance}%
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2 text-center">
        <div className="rounded-xl bg-ink-50 px-1 py-2">
          <p className="text-xs font-semibold text-ink-900">{branch.staff}</p>
          <p className="text-[10px] text-ink-500">Staff</p>
        </div>
        <div className="rounded-xl bg-ink-50 px-1 py-2">
          <p className="text-xs font-semibold text-ink-900">{branch.customers}</p>
          <p className="text-[10px] text-ink-500">Pelanggan</p>
        </div>
        <div className="rounded-xl bg-ink-50 px-1 py-2">
          <p className="text-xs font-semibold text-ink-900">{branch.appointments}</p>
          <p className="text-[10px] text-ink-500">Janji</p>
        </div>
        <div className="rounded-xl bg-ink-50 px-1 py-2">
          <p className="text-xs font-semibold text-brand-600">{formatRupiah(branch.revenue)}</p>
          <p className="text-[10px] text-ink-500">Pendapatan</p>
        </div>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-xs text-ink-500">
          <span>Performa</span>
          <span>{branch.performance}%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-100">
          <span className="block h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-500" style={{ width: `${branch.performance}%` }} />
        </div>
      </div>
    </div>
  );
}

export function Branches() {
  const { business } = useOutletContext<{ business: Business }>();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const refresh = () => {
    setLoading(true);
    api.listBranches(business.id).then((r) => {
      if (r.ok) setBranches(r.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    refresh();
  }, [business.id]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !city.trim()) return;
    setSaving(true);
    setError('');
    const r = await api.createBranch(business.id, { name: name.trim(), city: city.trim() });
    setSaving(false);
    if (!r.ok) {
      setError(r.error.message);
      return;
    }
    setModalOpen(false);
    setName('');
    setCity('');
    refresh();
  };

  const totalRevenue = branches.reduce((s, b) => s + b.revenue, 0);
  const totalStaff = branches.reduce((s, b) => s + b.staff, 0);
  const totalCustomers = branches.reduce((s, b) => s + b.customers, 0);
  const avgPerformance = branches.length ? Math.round(branches.reduce((s, b) => s + b.performance, 0) / branches.length) : 0;

  return (
    <>
      <PageHeader
        title="Cabang"
        subtitle={`Satu bisnis, banyak lokasi — ${branches.length} cabang ${business.name}`}
        action={
          <button type="button" onClick={() => setModalOpen(true)} className="btn-primary"><Icon name="plus" size={16} /> Tambah Cabang</button>
        }
      />

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Tambah Cabang">
        <form onSubmit={submit} className="space-y-4">
          <Field label="Nama Cabang">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="cth. Kings Barber Bandung" required />
          </Field>
          <Field label="Kota">
            <input className="input" value={city} onChange={(e) => setCity(e.target.value)} placeholder="cth. Bandung" required />
          </Field>
          {error && <p className="text-sm text-danger-600">{error}</p>}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost">Batal</button>
            <button type="submit" disabled={saving} className="btn btn-primary">{saving ? 'Menyimpan...' : 'Simpan'}</button>
          </div>
        </form>
      </Modal>

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-40" />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-52" />)}
          </div>
        </div>
      ) : branches.length === 0 ? (
        <EmptyState title="Belum ada cabang" hint="Tambahkan lokasi cabang Anda untuk mulai mengelola." />
      ) : (
        <div className="space-y-6">
          <Card className="relative overflow-hidden border-ink-900 bg-gradient-to-br from-ink-900 via-ink-800 to-cyan-900/70 p-6 text-white">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="flex items-center gap-1.5 text-sm text-cyan-200/80"><Icon name="building" size={15} /> {business.name}</p>
                <h2 className="font-display mt-1 text-xl font-bold">Pusat Jaringan {business.name}</h2>
                <p className="mt-1 text-sm text-ink-300">Terhubung ke {branches.length} lokasi di berbagai kota</p>
              </div>
              <div className="flex gap-6 text-right">
                <div>
                  <p className="font-display text-2xl font-extrabold text-white">{formatRupiah(totalRevenue)}</p>
                  <p className="text-xs text-ink-300">Total Pendapatan</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-white">{totalStaff}</p>
                  <p className="text-xs text-ink-300">Total Staff</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-extrabold text-cyan-300">{avgPerformance}%</p>
                  <p className="text-xs text-ink-300">Performa Rata-rata</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {branches.map((b) => (
              <BranchCard key={b.id} branch={b} />
            ))}
          </div>
          <p className="text-center text-xs text-ink-500">
            Total {totalCustomers} pelanggan tersebar di {branches.length} cabang {business.name}.
          </p>
        </div>
      )}
    </>
  );
}
