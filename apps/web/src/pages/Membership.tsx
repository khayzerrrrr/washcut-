import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, Member, MembershipPlan } from '@washcut/shared';
import { api, formatDate, formatRupiah } from '../lib/api';
import { Card, EmptyState, PageHeader, StatCard, Skeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Field, Modal } from '../components/ui/Modal';

const planStyles: Record<string, { ring: string; badge: 'gray' | 'brand' | 'green' }> = {
  Basic: { ring: 'ring-ink-200', badge: 'gray' },
  Premium: { ring: 'ring-brand-300', badge: 'brand' },
  VIP: { ring: 'ring-warn-300', badge: 'green' },
};

export function Membership() {
  const { business } = useOutletContext<{ business: Business }>();
  const [members, setMembers] = useState<Member[]>([]);
  const [plans, setPlans] = useState<MembershipPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', phone: '', plan: '' });

  const refresh = () => {
    setLoading(true);
    Promise.all([
      api.listMembers(business.id).then((r) => r.ok && setMembers(r.data)),
      api.listMembershipPlans(business.id).then((r) => r.ok && setPlans(r.data)),
    ])
      .catch(() => setError('Gagal memuat data. Periksa koneksi server.'))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [business.id]);

  const now = Date.now();
  const active = members.filter((m) => m.status === 'active');
  const expiring = active.filter((m) => new Date(m.validUntil).getTime() - now <= 30 * 86400000);
  const newThisMonth = members.filter((m) => now - new Date(m.joinedAt).getTime() <= 30 * 86400000);
  const revenue = members.reduce((s, m) => s + m.spent, 0);

  const openCreate = () => {
    setForm({ name: '', phone: '', plan: plans[0]?.id ?? '' });
    setError(null);
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const input = {
      name: form.name,
      ...(form.phone ? { phone: form.phone } : {}),
      plan: form.plan,
    };
    try {
      const r = await api.createMember(business.id, input);
      if (r.ok) {
        setOpen(false);
        refresh();
      } else {
        setError(r.error.message);
      }
    } catch {
      setError('Gagal mendaftarkan member.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Membership"
        subtitle={`Program loyalitas dan kartu member di ${business.name}`}
        action={
          <button className="btn-primary" onClick={openCreate}>
            <Icon name="plus" size={16} /> Daftarkan Member
          </button>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="h-64" />
        </div>
      ) : members.length === 0 && plans.length === 0 ? (
        <EmptyState title="Belum ada data membership" hint="Atur paket dan daftarkan member pertama Anda." />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Member Aktif" value={String(active.length)} tone="default" hint="status aktif" />
            <StatCard label="Akan Berakhir" value={String(expiring.length)} tone="amber" hint="dalam 30 hari" />
            <StatCard label="Member Baru" value={String(newThisMonth.length)} tone="brand" hint="30 hari terakhir" />
            <StatCard label="Pendapatan Membership" value={formatRupiah(revenue)} tone="green" hint="total pembelanjaan member" />
          </div>

          <section>
            <h2 className="font-display mb-3 text-lg font-bold text-ink-900">Paket Membership</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map((p) => {
                const s = planStyles[p.name] ?? planStyles.Basic;
                return (
                  <Card key={p.id} className={`p-5 ring-2 ring-inset ${s.ring} ${p.name === 'VIP' ? 'bg-gradient-to-br from-ink-900 to-cyan-900 text-white' : ''}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-display text-lg font-bold ${p.name === 'VIP' ? 'text-white' : 'text-ink-900'}`}>{p.name}</span>
                      <Badge tone={s.badge}>{p.pointsPerSpend}x Poin</Badge>
                    </div>
                    <p className={`mt-1 font-display text-2xl font-extrabold ${p.name === 'VIP' ? 'text-cyan-300' : 'text-brand-600'}`}>
                      {formatRupiah(p.price)}<span className={`text-sm font-medium ${p.name === 'VIP' ? 'text-ink-300' : 'text-ink-500'}`}>/bulan</span>
                    </p>
                    <ul className={`mt-4 space-y-2 text-sm ${p.name === 'VIP' ? 'text-ink-200' : 'text-ink-600'}`}>
                      {p.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <Icon name="check" size={16} className="mt-0.5 shrink-0 text-success-500" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </Card>
                );
              })}
            </div>
          </section>

          <section>
            <h2 className="font-display mb-3 text-lg font-bold text-ink-900">Kartu Member</h2>
            {members.length === 0 ? (
              <EmptyState title="Belum ada member" hint="Member yang terdaftar akan tampil di sini." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((m) => {
                  const s = planStyles[m.plan] ?? planStyles.Basic;
                  return (
                    <Card key={m.id} className={`p-5 ring-2 ring-inset ${s.ring}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-3">
                          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                            {m.name.charAt(0)}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-ink-900">{m.name}</p>
                            <p className="text-xs text-ink-500">{m.phone}</p>
                          </div>
                        </div>
                        <Badge tone={m.status === 'active' ? 'green' : 'red'}>{m.status === 'active' ? 'Aktif' : 'Kadaluarsa'}</Badge>
                      </div>
                      <div className="mt-4 flex items-center justify-between rounded-xl bg-ink-50 px-3 py-2.5">
                        <span className="text-xs font-semibold text-ink-500 uppercase tracking-wide">Plan {m.plan}</span>
                        <span className="text-sm font-bold text-brand-600">{m.points} poin</span>
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-ink-500">
                        <span className="inline-flex items-center gap-1"><Icon name="calendar" size={13} /> Berlaku hingga {formatDate(m.validUntil)}</span>
                        <span className="font-semibold text-ink-700">{formatRupiah(m.spent)}</span>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Daftarkan Member">
        <form onSubmit={submit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 rounded-xl border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-sm text-danger-600">
              <Icon name="alert" size={15} />
              {error}
            </div>
          )}
          <Field label="Nama">
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="cth: Budi Santoso" autoFocus />
          </Field>
          <Field label="No. HP">
            <input className="input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="cth: 0812-3456-7890" />
          </Field>
          <Field label="Paket">
            <select className="input" required value={form.plan} onChange={(e) => setForm({ ...form, plan: e.target.value })}>
              <option value="" disabled>Pilih paket</option>
              {plans.map((p) => (
                <option key={p.id} value={p.id}>{p.name} - {formatRupiah(p.price)}/bulan</option>
              ))}
            </select>
          </Field>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? <><span className="btn-spinner" /> Menyimpan...</> : 'Daftarkan'}
          </button>
        </form>
      </Modal>
    </>
  );
}
