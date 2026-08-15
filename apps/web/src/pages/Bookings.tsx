import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Booking, Business } from '@washcut/shared';
import { api, formatRupiah, formatTime } from '../lib/api';
import { Card, EmptyState, PageHeader, Skeleton } from '../components/ui/Card';
import { Badge, statusLabel, statusTone } from '../components/ui/Badge';

const FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled'] as const;

export function Bookings() {
  const { business } = useOutletContext<{ business: Business }>();
  const [list, setList] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('all');
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setLoading(true);
    api.listBookings(business.id, today).then((r) => {
      if (r.ok) setList(r.data);
      setLoading(false);
    });
  }, [business.id, today]);

  const rows = list.filter((b) => filter === 'all' || b.status === filter);

  const setStatus = async (id: string, status: Booking['status']) => {
    const r = await api.updateBookingStatus(business.id, id, status);
    if (r.ok) setList((p) => p.map((b) => (b.id === id ? r.data : b)));
  };

  return (
    <>
      <PageHeader title="Bookings" subtitle={`Jadwal ${business.name} · ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`} />

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
        <EmptyState title="Tidak ada booking" hint="Coba filter lain." />
      ) : (
        <div className="space-y-3">
          {rows.map((b) => (
            <Card key={b.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex w-16 flex-col items-center rounded-xl bg-ink-50 py-2">
                  <span className="text-lg font-extrabold text-ink-900">{formatTime(b.startsAt)}</span>
                  <span className="text-[10px] text-ink-400">s/d {formatTime(b.endsAt)}</span>
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
                  {b.notes && <p className="mt-1 text-xs text-ink-400">{b.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="font-bold text-ink-900">{formatRupiah(b.amount)}</span>
                  <div className="flex gap-2">
                    {b.status === 'pending' && (
                      <button className="btn-primary !py-1.5 !px-3 !text-xs" onClick={() => setStatus(b.id, 'confirmed')}>Konfirmasi</button>
                    )}
                    {b.status === 'confirmed' && (
                      <button className="btn-primary !py-1.5 !px-3 !text-xs" onClick={() => setStatus(b.id, 'completed')}>Selesai</button>
                    )}
                    {(b.status === 'pending' || b.status === 'confirmed') && (
                      <button className="btn-outline !py-1.5 !px-3 !text-xs" onClick={() => setStatus(b.id, 'cancelled')}>Batal</button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}