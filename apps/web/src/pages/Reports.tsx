import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Branch, Business, ReportPeriod, ReportSummary } from '@washcut/shared';
import { api, formatDate, formatRupiah } from '../lib/api';
import { Card, EmptyState, PageHeader, StatCard, Skeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

const periods = [
  { key: 'today', label: 'Hari Ini' },
  { key: '7d', label: '7 Hari' },
  { key: '30d', label: '30 Hari' },
] as const;

const emptyReport: ReportSummary = {
  revenue: 0,
  transactions: 0,
  customers: 0,
  avgTransaction: 0,
  commission: 0,
  profit: 0,
  revenueByDay: [],
  topServices: [],
  staffPerformance: [],
};

export function Reports() {
  const { business } = useOutletContext<{ business: Business }>();
  const [report, setReport] = useState<ReportSummary>(emptyReport);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [period, setPeriod] = useState<ReportPeriod>('7d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.getReports(business.id, period).then((r) => r.ok && setReport(r.data)),
      api.listBranches(business.id).then((r) => r.ok && setBranches(r.data)),
    ]).finally(() => setLoading(false));
  }, [business.id, period]);

  const maxRevenue = Math.max(...report.revenueByDay.map((d) => d.revenue), 1);
  const maxService = Math.max(...report.topServices.map((s) => s.revenue), 1);
  const maxStaff = Math.max(...report.staffPerformance.map((s) => s.revenue), 1);
  const sortedBranches = [...branches].sort((a, b) => b.revenue - a.revenue);

  return (
    <>
      <PageHeader
        title="Laporan"
        subtitle={`Ringkasan performa ${business.name}`}
        action={
          <div className="flex gap-1 rounded-xl border border-ink-200 bg-white p-1">
            {periods.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriod(p.key)}
                className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${period === p.key ? 'bg-brand-600 text-white' : 'text-ink-500 hover:text-ink-900'}`}
              >
                {p.label}
              </button>
            ))}
          </div>
        }
      />

      {loading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
          </div>
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Pendapatan" value={formatRupiah(report.revenue)} tone="brand" hint="dari transaksi selesai" />
            <StatCard label="Estimasi Profit" value={formatRupiah(report.profit)} tone="green" hint="setelah komisi staff" />
            <StatCard label="Pelanggan" value={String(report.customers)} tone="default" hint="pelanggan unik" />
            <StatCard label="Rata-rata Transaksi" value={report.avgTransaction ? formatRupiah(report.avgTransaction) : '—'} tone="amber" hint={`${report.transactions} transaksi`} />
          </div>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-ink-900">Pendapatan per Hari</h2>
              <span className="text-xs text-ink-500">{periods.find((p) => p.key === period)?.label}</span>
            </div>
            {report.revenueByDay.length === 0 ? (
              <div className="mt-4"><EmptyState title="Belum ada transaksi" hint="Data akan tampil saat ada transaksi selesai." /></div>
            ) : (
              <div className="mt-6 flex h-44 items-end gap-2 sm:gap-4">
                {report.revenueByDay.map((d) => (
                  <div key={d.day} className="group flex flex-1 flex-col items-center gap-1.5">
                    <span className="text-xs font-semibold text-brand-600">{formatRupiah(d.revenue)}</span>
                    <div className="flex w-full flex-1 items-end">
                      <div className="w-full rounded-t-lg bg-gradient-to-t from-brand-700 to-brand-400 transition-[height] duration-300" style={{ height: `${(d.revenue / maxRevenue) * 100}%` }} />
                    </div>
                    <span className="text-[10px] font-medium text-ink-500">{formatDate(d.day)}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {report.transactions === 0 ? (
            <EmptyState title="Belum ada transaksi" hint="Data agregasi akan tampil saat ada transaksi selesai pada periode ini." />
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              <Card className="p-5">
                <h2 className="font-display font-bold text-ink-900">Top Services</h2>
                <ul className="mt-4 space-y-3">
                  {report.topServices.map((s) => (
                    <li key={s.name} className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink-900">{s.name}</p>
                        <p className="text-xs text-ink-500">{s.count} transaksi</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-100">
                          <span className="block h-full rounded-full bg-brand-500" style={{ width: `${(s.revenue / maxService) * 100}%` }} />
                        </span>
                        <span className="w-20 text-right text-sm font-semibold text-ink-900">{formatRupiah(s.revenue)}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>

              <Card className="p-5">
                <h2 className="font-display font-bold text-ink-900">Performa Staff</h2>
                {report.staffPerformance.length === 0 ? (
                  <div className="mt-4"><EmptyState title="Belum ada data staff" /></div>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {report.staffPerformance.map((s, i) => (
                      <li key={s.name} className="flex items-center gap-3">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${i === 0 ? 'bg-brand-600 text-white' : 'bg-brand-100 text-brand-700'}`}>
                          {s.name.charAt(0)}
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold text-ink-900">{s.name}</p>
                            <span className="text-sm font-semibold text-ink-900">{formatRupiah(s.revenue)}</span>
                          </div>
                          <div className="mt-1 flex items-center gap-2">
                            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-ink-100">
                              <span className="block h-full rounded-full bg-brand-500" style={{ width: `${(s.revenue / maxStaff) * 100}%` }} />
                            </span>
                            <span className="text-xs text-ink-500">{s.servicesCompleted} layanan</span>
                          </div>
                        </div>
                        {i === 0 && <Badge tone="brand">Terbaik</Badge>}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>

              <Card className="p-5">
                <h2 className="font-display font-bold text-ink-900">Performa Cabang</h2>
                {sortedBranches.length === 0 ? (
                  <div className="mt-4"><EmptyState title="Belum ada cabang" hint="Data cabang akan tampil di sini." /></div>
                ) : (
                  <ul className="mt-4 space-y-4">
                    {sortedBranches.map((br) => (
                      <li key={br.id}>
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate text-sm font-semibold text-ink-900">{br.city}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-ink-900">{formatRupiah(br.revenue)}</span>
                            <Badge tone={br.performance >= 90 ? 'green' : br.performance >= 80 ? 'brand' : 'amber'}>{br.performance}%</Badge>
                          </div>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ink-100">
                          <span className="block h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-500" style={{ width: `${br.performance}%` }} />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
