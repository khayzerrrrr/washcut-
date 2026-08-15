import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Booking, Business, Customer, Payment, ServiceItem, User, Vehicle } from '@washcut/shared';
import { api, formatDate, formatDateKey, formatRupiah, formatTime } from '../lib/api';
import { Card, EmptyState, PageHeader, Skeleton } from '../components/ui/Card';
import { Badge, statusLabel, statusTone } from '../components/ui/Badge';
import { Field, Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const;

export function Bookings() {
  const { business } = useOutletContext<{ business: Business }>();
  const isWash = business.type === 'car_wash';
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const today = formatDateKey(new Date());

  // Form state
  const [open, setOpen] = useState(false);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [staff, setStaff] = useState<User[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [form, setForm] = useState({ serviceId: '', customerId: '', customerName: '', startsAt: '', staffId: '', vehicleId: '', notes: '' });
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState('');

  const load = () => {
    setLoading(true);
    setError('');
    api
      .listBookings(business.id, today)
      .then((r) => {
        if (r.ok) setList(r.data);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        setError((e as { error?: { message?: string } })?.error?.message || 'Tidak dapat terhubung ke server');
      });
  };

  useEffect(load, [business.id, today]);

  const rows = list.filter((b) => filter === 'all' || b.status === filter);

  const setStatus = async (id: string, status: Booking['status']) => {
    try {
      const r = await api.updateBookingStatus(business.id, id, status);
      if (r.ok) setList((p) => p.map((b) => (b.id === id ? r.data : b)));
    } catch (e) {
      setError((e as { error?: { message?: string } })?.error?.message || 'Tidak dapat terhubung ke server');
    }
  };

  const openPayments = async () => {
    setPayments([]);
    try {
      const r = await api.listPayments(business.id);
      if (r.ok) setPayments(r.data.slice().sort((a, b) => b.paidAt.localeCompare(a.paidAt)).slice(0, 10));
    } catch {
      setPayments(null);
    }
  };

  const openForm = () => {
    setForm({ serviceId: '', customerId: '', customerName: '', startsAt: '', staffId: '', vehicleId: '', notes: '' });
    setFormError('');
    Promise.all([
      api.listServices(business.id).then((r) => r.ok && setServices(r.data.filter((s) => s.active))),
      api.listCustomers(business.id).then((r) => r.ok && setCustomers(r.data)),
      api.listStaffAccounts(business.id).then((r) => r.ok && setStaff(r.data.filter((u) => u.role === 'staff'))),
      isWash ? api.listVehicles(business.id).then((r) => r.ok && setVehicles(r.data)) : Promise.resolve(),
    ]);
    setOpen(true);
  };

  const isWalkIn = form.customerId === '';

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.serviceId || !form.startsAt) return;
    setBusy(true);
    setFormError('');
    try {
      const selectedCustomer = customers.find((c) => c.id === form.customerId);
      const r = await api.createBooking(business.id, {
        serviceId: form.serviceId,
        customerId: isWalkIn ? undefined : form.customerId,
        customerName: isWalkIn ? form.customerName : selectedCustomer?.name ?? '',
        startsAt: new Date(form.startsAt).toISOString(),
        staffId: form.staffId || undefined,
        vehicleId: isWash ? form.vehicleId || undefined : undefined,
        walkIn: isWalkIn || undefined,
        notes: form.notes || undefined,
      });
      setBusy(false);
      if (r.ok) {
        setOpen(false);
        load();
      }
    } catch (err) {
      setBusy(false);
      setFormError((err as { error?: { message?: string } })?.error?.message ?? 'Gagal membuat janji');
    }
  };

  return (
    <>
      <PageHeader
        title="Pesanan"
        subtitle={`Jadwal ${business.name} · ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`}
        action={
          <div className="flex gap-2">
            <button className="btn-outline btn-sm" onClick={openPayments}>Riwayat Pembayaran</button>
            <button className="btn-primary btn-sm" onClick={openForm}><Icon name="plus" size={14} /> Tambah Janji</button>
          </div>
        }
      />

      {error && (
        <div className="mb-4 flex items-center justify-between gap-3 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
          <span>{error}</span>
          <button className="text-sm font-semibold underline" onClick={load}>Muat ulang</button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              filter === f ? 'bg-ink-900 text-white' : 'bg-white text-ink-600 ring-1 ring-ink-200 hover:bg-ink-50'
            }`}
          >
            {statusLabel(f)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : rows.length === 0 ? (
        <EmptyState title="Belum ada janji" hint="Klik 'Tambah Janji' untuk membuat janji temu pertama." />
      ) : (
        <div className="space-y-3">
          {rows.map((b) => (
            <Card key={b.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex w-16 flex-col items-center rounded-xl bg-ink-50 py-2">
                  <span className="text-lg font-extrabold text-ink-900">{formatTime(b.startsAt)}</span>
                  <span className="text-[10px] text-ink-500">s/d {formatTime(b.endsAt)}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink-900">{b.customerName}</p>
                    <Badge tone={statusTone(b.status)}>{statusLabel(b.status)}</Badge>
                    {b.walkIn && <Badge tone="amber">Walk-in</Badge>}
                  </div>
                  <p className="mt-0.5 text-sm text-ink-500">
                    {b.serviceName}
                    {b.vehiclePlate ? ` · ${b.vehiclePlate}` : ''}
                    {b.staffName ? ` · ${b.staffName}` : ''}
                  </p>
                  {b.notes && <p className="mt-1 text-xs text-ink-500">{b.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-ink-900">{formatRupiah(b.amount)}</span>
                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <button className="btn-primary btn-sm" onClick={() => setStatus(b.id, 'confirmed')}>Konfirmasi</button>
                    )}
                    {b.status === 'confirmed' && (
                      <button className="btn-primary btn-sm" onClick={() => setStatus(b.id, 'completed')}>Selesai</button>
                    )}
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button className="btn-outline btn-sm" onClick={() => setStatus(b.id, 'cancelled')}>Batal</button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={payments !== null} onClose={() => setPayments(null)} title="Riwayat Pembayaran">
        {payments && payments.length === 0 ? (
          <EmptyState title="Belum ada pembayaran" hint="Pembayaran POS akan tampil di sini." />
        ) : (
          <div className="divide-y divide-ink-100">
            {payments?.map((p) => (
              <div key={p.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="font-semibold text-ink-900">{formatRupiah(p.amount)}</p>
                  <p className="text-xs text-ink-500">{p.method.toUpperCase()} · {formatDate(p.paidAt)}</p>
                </div>
                <Badge tone="green">Lunas</Badge>
              </div>
            ))}
          </div>
        )}
      </Modal>

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Janji">
        <form onSubmit={submit} className="space-y-4">
          {formError && (
            <div className="flex items-center gap-2 rounded-xl border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-sm text-danger-600">
              <Icon name="alert" size={15} />
              {formError}
            </div>
          )}

          <Field label="Layanan">
            <select className="input" required value={form.serviceId} onChange={(e) => setForm({ ...form, serviceId: e.target.value })}>
              <option value="">Pilih layanan…</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>{s.name} · {formatRupiah(s.price)} · {s.durationMin} mnt</option>
              ))}
            </select>
          </Field>

          <Field label="Pelanggan">
            <select className="input" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
              <option value="">Walk-in (pelanggan baru)</option>
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </Field>

          {isWalkIn && (
            <Field label="Nama pelanggan">
              <input className="input" required value={form.customerName} onChange={(e) => setForm({ ...form, customerName: e.target.value })} placeholder="cth: Budi Santoso" />
            </Field>
          )}

          <Field label="Tanggal & jam">
            <input className="input" type="datetime-local" required value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} />
          </Field>

          <Field label={isWash ? 'Staff (washer)' : 'Barber'}>
            <select className="input" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })}>
              <option value="">Tanpa penugasan</option>
              {staff.map((u) => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </Field>

          {isWash && (
            <Field label="Kendaraan">
              <select className="input" value={form.vehicleId} onChange={(e) => setForm({ ...form, vehicleId: e.target.value })}>
                <option value="">Tanpa kendaraan</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>{v.plateNumber} · {v.brand} {v.model}</option>
                ))}
              </select>
            </Field>
          )}

          <Field label="Catatan (opsional)">
            <textarea className="input" rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="cth: ingin potongan pendek" />
          </Field>

          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? <><span className="btn-spinner" /> Menyimpan...</> : 'Simpan Janji'}
          </button>
        </form>
      </Modal>
    </>
  );
}
