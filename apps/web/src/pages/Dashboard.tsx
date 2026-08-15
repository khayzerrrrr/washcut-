import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import type { Booking, Business, Customer, QueueItem, ReportSummary } from '@washcut/shared';
import { api, formatDateKey, formatRupiah, formatTime } from '../lib/api';
import { Card, EmptyState, Skeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Field, Modal } from '../components/ui/Modal';

const kpiIcons = ['cash', 'calendar', 'users', 'layers', 'user'] as const;

function greeting(): string {
  const h = new Date().getHours();
  if (h < 11) return 'Selamat pagi';
  if (h < 15) return 'Selamat siang';
  if (h < 19) return 'Selamat sore';
  return 'Selamat malam';
}

function BarChart({ series }: { series: { label: string; value: number; today?: boolean }[] }) {
  const max = Math.max(...series.map((s) => s.value), 1);
  return (
    <div className="flex h-40 items-end gap-2 sm:gap-3">
      {series.map((s) => (
        <div key={s.label} className="flex flex-1 flex-col items-center gap-1.5">
          <span className={`text-xs font-semibold ${s.today ? 'text-brand-600' : 'text-ink-500'}`}>
            {formatRupiah(s.value)}
          </span>
          <div className="flex w-full flex-1 items-end">
            <div
              className={`w-full rounded-t-lg ${s.today ? 'bg-gradient-to-t from-brand-700 to-brand-400' : 'bg-ink-200'}`}
              style={{ height: `${(s.value / max) * 100}%` }}
            />
          </div>
          <span className={`text-xs font-medium ${s.today ? 'text-brand-700' : 'text-ink-500'}`}>{s.label}</span>
        </div>
      ))}
    </div>
  );
}

export function Dashboard() {
  const { business } = useOutletContext<{ business: Business }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [savingExpense, setSavingExpense] = useState(false);
  const [expenseError, setExpenseError] = useState('');
  const [expenseSaved, setExpenseSaved] = useState(false);
  const today = formatDateKey(new Date());

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.listBookings(business.id, today).then((r) => r.ok && setBookings(r.data)),
      api.listCustomers(business.id).then((r) => r.ok && setCustomers(r.data)),
      api.listQueue(business.id).then((r) => r.ok && setQueue(r.data)),
      api.getReports(business.id, '7d').then((r) => r.ok && setReport(r.data)),
    ]).finally(() => setLoading(false));
  }, [business.id, today]);

  const revenueToday = bookings.filter((b) => b.status === 'completed').reduce((s, b) => s + b.amount, 0);
  const upcoming = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const activeQueue = queue.filter((q) => q.status !== 'completed').length;
  const staffWorking = new Set(bookings.map((b) => b.staffName).filter((n): n is string => Boolean(n))).size;

  const series =
    report?.revenueByDay.map((d) => ({
      label: new Date(d.day).toLocaleDateString('id-ID', { weekday: 'short' }),
      value: d.revenue,
      today: formatDateKey(new Date(d.day)) === today,
    })) ?? [];

  const kpis = [
    { label: 'Pendapatan Hari Ini', value: formatRupiah(revenueToday), tone: 'text-success-600', hint: 'dari transaksi selesai' },
    { label: 'Janji Temu', value: String(bookings.length), tone: 'text-brand-600', hint: `${upcoming.length} akan datang` },
    { label: 'Pelanggan', value: String(customers.length), tone: 'text-ink-900', hint: 'terdaftar' },
    { label: 'Antrian Aktif', value: String(activeQueue), tone: 'text-warn-600', hint: 'menunggu layanan' },
    { label: 'Staff Bekerja', value: String(staffWorking), tone: 'text-info-600', hint: 'dari booking hari ini' },
  ];

  const dateStr = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const openExpense = () => {
    setExpenseDesc('');
    setExpenseAmount('');
    setExpenseCategory('');
    setExpenseError('');
    setExpenseSaved(false);
    setExpenseOpen(true);
  };

  const submitExpense = async () => {
    const amount = Number(expenseAmount);
    if (!expenseDesc.trim()) {
      setExpenseError('Deskripsi wajib diisi.');
      return;
    }
    if (!Number.isFinite(amount) || amount <= 0) {
      setExpenseError('Jumlah harus angka lebih dari 0.');
      return;
    }
    setSavingExpense(true);
    setExpenseError('');
    try {
      const r = await api.createExpense(business.id, {
        description: expenseDesc.trim(),
        amount,
        category: expenseCategory.trim() || undefined,
      });
      if (!r.ok) throw r;
      setExpenseOpen(false);
      setExpenseSaved(true);
    } catch (e) {
      setExpenseError('Gagal menyimpan pengeluaran. Coba lagi.');
    } finally {
      setSavingExpense(false);
    }
  };

  return (
    <>
      {/* Hero band navy */}
      <section className="relative -mx-4 overflow-hidden rounded-2xl bg-gradient-to-br from-ink-900 via-ink-800 to-cyan-900/60 px-5 py-8 text-white sm:-mx-6 sm:px-8">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" aria-hidden />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-cyan-200/80">{dateStr}</p>
            <h1 className="font-display mt-1 text-2xl font-bold sm:text-3xl">{greeting()}, {business.name}</h1>
            <p className="mt-1 text-sm text-ink-300">
              {upcoming.length} janji hari ini · {activeQueue} antrian aktif · {staffWorking} staff bekerja
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs font-semibold text-ink-300 uppercase tracking-wide">Pendapatan hari ini</p>
            <p className="font-display mt-1 text-3xl font-extrabold text-white sm:text-4xl">{formatRupiah(revenueToday)}</p>
          </div>
        </div>
      </section>

      {/* KPI cards */}
      {loading ? (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {kpis.map((k, i) => (
            <Card key={k.label} className="p-4">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                <Icon name={kpiIcons[i]} size={16} />
              </span>
              <p className="mt-3 text-xs font-semibold text-ink-500 uppercase tracking-wide">{k.label}</p>
              <p className={`font-display mt-1 text-xl font-bold ${k.tone}`}>{k.value}</p>
              <p className="mt-0.5 text-xs text-ink-500">{k.hint}</p>
            </Card>
          ))}
        </div>
      )}

      {/* Chart + quick actions */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display font-bold text-ink-900">Pendapatan 7 Hari Terakhir</h2>
              <p className="text-xs text-ink-500">Ringkasan harian bisnis Anda</p>
            </div>
            <Link to={`/app/${business.id}/reports`} className="text-sm font-semibold text-brand-600 hover:underline">
              Laporan →
            </Link>
          </div>
          <div className="mt-6">
            {loading ? (
              <Skeleton className="h-40" />
            ) : series.length === 0 ? (
              <EmptyState title="Belum ada transaksi" hint="Pendapatan akan muncul di sini." />
            ) : (
              <BarChart series={series} />
            )}
          </div>
        </Card>

        <Card className="p-5">
          <h2 className="font-display font-bold text-ink-900">Aksi Cepat</h2>
          {expenseSaved && (
            <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-success-50 px-3 py-2 text-sm font-medium text-success-700">
              <Icon name="check" size={15} /> Pengeluaran berhasil dicatat.
            </p>
          )}
          <div className="mt-4 grid gap-2">
            <Link to={`/app/${business.id}/bookings`} className="btn-primary justify-start">
              <Icon name="calendar" size={16} /> New Appointment
            </Link>
            <Link to={`/app/${business.id}/customers`} className="btn-outline justify-start">
              <Icon name="users" size={16} /> New Customer
            </Link>
            <Link to={`/app/${business.id}/checkout`} className="btn-outline justify-start">
              <Icon name="cash" size={16} /> Open POS
            </Link>
            <button type="button" className="btn-outline justify-start" onClick={openExpense}>
              <Icon name="note" size={16} /> Add Expense
            </button>
          </div>
        </Card>
      </div>

      {/* Timeline + queue */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="p-0 overflow-hidden lg:col-span-2">
          <div className="flex items-center justify-between px-5 py-4">
            <h2 className="font-display font-bold text-ink-900">Jadwal Hari Ini</h2>
            <Link to={`/app/${business.id}/bookings`} className="text-sm font-semibold text-brand-600 hover:underline">
              Semua →
            </Link>
          </div>
          {loading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
            </div>
          ) : upcoming.length === 0 ? (
            <div className="px-5 pb-6">
              <EmptyState title="Belum ada janji hari ini" hint="Booking baru akan muncul di sini." />
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {upcoming.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="w-14 shrink-0 rounded-lg bg-ink-50 py-1 text-center text-xs font-bold text-ink-700">
                      {formatTime(b.startsAt)}
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink-900">{b.customerName}</p>
                      <p className="truncate text-xs text-ink-500">
                        {b.serviceName}
                        {b.staffName ? ` · ${b.staffName}` : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-ink-900">{formatRupiah(b.amount)}</span>
                    <Badge tone={b.status === 'confirmed' ? 'brand' : 'amber'}>
                      {b.status === 'confirmed' ? 'Dikonfirmasi' : 'Menunggu'}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-ink-900">Antrian</h2>
            <span className="badge ring-1 ring-inset ring-ink-200 bg-ink-50 text-ink-600">{activeQueue} aktif</span>
          </div>
          {loading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : queue.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="Antrian kosong" hint="Nikmati ketenangannya." />
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {queue.map((q) => (
                <li key={q.id} className="flex items-center justify-between gap-2 rounded-xl border border-ink-200 p-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{q.customerName}</p>
                    <p className="truncate text-xs text-ink-500">{q.serviceName}</p>
                  </div>
                  <Badge tone={q.status === 'waiting' ? 'amber' : q.status === 'in-service' ? 'brand' : 'green'}>
                    {q.status === 'waiting' ? 'Menunggu' : q.status === 'in-service' ? 'Dilayani' : 'Selesai'}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      {/* Top services + staff performance */}
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display font-bold text-ink-900">Layanan Teratas</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4" />)}
            </div>
          ) : report?.topServices.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="Belum ada layanan" hint="Layanan terlaris akan muncul di sini." />
            </div>
          ) : (
            (() => {
              const maxRevenue = Math.max(...(report?.topServices.map((s) => s.revenue) ?? []), 1);
              return (
                <ul className="mt-4 space-y-3">
                  {report?.topServices.slice(0, 5).map((s) => (
                    <li key={s.name} className="flex items-center justify-between gap-3">
                      <span className="truncate text-sm text-ink-700">{s.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-100">
                          <span className="block h-full rounded-full bg-brand-500" style={{ width: `${(s.revenue / maxRevenue) * 100}%` }} />
                        </span>
                        <span className="w-20 text-right text-sm font-semibold text-ink-900">{formatRupiah(s.revenue)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              );
            })()
          )}
          <Link to={`/app/${business.id}/services`} className="mt-5 block text-center text-sm font-semibold text-brand-600 hover:underline">
            Kelola layanan →
          </Link>
        </Card>

        <Card className="p-5">
          <h2 className="font-display font-bold text-ink-900">Kinerja Staff</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-12" />)}
            </div>
          ) : report?.staffPerformance.length === 0 ? (
            <div className="mt-4">
              <EmptyState title="Belum ada kinerja staff" hint="Kinerja staff akan muncul setelah ada transaksi." />
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {[...(report?.staffPerformance ?? [])]
                .sort((a, b) => b.revenue - a.revenue)
                .map((s, i) => (
                  <li key={s.name} className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                      {s.name.charAt(0)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate text-sm font-semibold text-ink-900">{s.name}</p>
                        <span className="text-sm font-semibold text-ink-900">{formatRupiah(s.revenue)}</span>
                      </div>
                      <p className="text-xs text-ink-500">{s.servicesCompleted} layanan selesai</p>
                    </div>
                    {i === 0 && <Badge tone="brand">Terbaik</Badge>}
                  </li>
                ))}
            </ul>
          )}
        </Card>
      </div>

      <Modal open={expenseOpen} onClose={() => setExpenseOpen(false)} title="Catat Pengeluaran">
        <form
          className="grid gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            submitExpense();
          }}
        >
          <Field label="Deskripsi">
            <input className="input" placeholder="Contoh: Beli pomade" value={expenseDesc} onChange={(e) => setExpenseDesc(e.target.value)} required />
          </Field>
          <Field label="Jumlah (Rp)">
            <input className="input" type="number" min="0" step="1" placeholder="50000" value={expenseAmount} onChange={(e) => setExpenseAmount(e.target.value)} required />
          </Field>
          <Field label="Kategori (opsional)">
            <input className="input" placeholder="Contoh: Perlengkapan" value={expenseCategory} onChange={(e) => setExpenseCategory(e.target.value)} />
          </Field>
          {expenseError && <p className="text-sm font-medium text-danger-600">{expenseError}</p>}
          <div className="flex gap-2">
            <button type="button" className="btn-outline flex-1" onClick={() => setExpenseOpen(false)}>Batal</button>
            <button type="submit" className="btn-primary flex-1" disabled={savingExpense}>
              {savingExpense ? <><span className="btn-spinner" /> Menyimpan...</> : 'Simpan'}
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
