import { useEffect, useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import type { Booking, Business, ServiceItem } from '@washcut/shared';
import { api, formatRupiah, formatTime } from '../lib/api';
import { Card, EmptyState, PageHeader, Skeleton, StatCard } from '../components/ui/Card';
import { Badge, statusLabel, statusTone } from '../components/ui/Badge';

export function Dashboard() {
  const { business } = useOutletContext<{ business: Business }>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().slice(0, 10);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.listBookings(business.id, today).then((r) => r.ok && setBookings(r.data)),
      api.listServices(business.id).then((r) => r.ok && setServices(r.data)),
    ]).finally(() => setLoading(false));
  }, [business.id, today]);

  const revenue = bookings.filter((b) => b.status === 'completed').reduce((s, b) => s + b.amount, 0);
  const pending = bookings.filter((b) => b.status === 'pending').length;
  const upcoming = bookings.filter((b) => b.status === 'pending' || b.status === 'confirmed');
  const isWash = business.type === 'car_wash';

  return (
    <>
      <PageHeader
        title={`Halo, Owner`}
        subtitle={`${business.name} · ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })}`}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)
        ) : (
          <>
            <StatCard label="Antrian Hari Ini" value={String(bookings.length)} tone="brand" hint={`${pending} menunggu konfirmasi`} />
            <StatCard label="Selesai Hari Ini" value={String(bookings.filter((b) => b.status === 'completed').length)} tone="green" />
            <StatCard label="Pendapatan" value={formatRupiah(revenue)} tone="green" hint="dari transaksi selesai" />
            <StatCard label={isWash ? 'Layanan Cuci' : 'Layanan Potong'} value={String(services.filter((s) => s.active).length)} tone="amber" hint="aktif" />
          </>
        )}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
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
              <EmptyState title="Belum ada jadwal" hint="Booking baru akan muncul di sini." />
            </div>
          ) : (
            <ul className="divide-y divide-ink-100">
              {upcoming.slice(0, 5).map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900">{b.customerName}</p>
                    <p className="truncate text-xs text-ink-500">
                      {b.serviceName} {b.vehiclePlate ? `· ${b.vehiclePlate}` : ''} {b.staffName ? `· ${b.staffName}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-ink-400">{formatTime(b.startsAt)}</span>
                    <Badge tone={statusTone(b.status)}>{statusLabel(b.status)}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5">
          <h2 className="font-display font-bold text-ink-900">Layanan Populer</h2>
          {loading ? (
            <div className="mt-4 space-y-3">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-4" />)}
            </div>
          ) : (
            <ul className="mt-4 space-y-3">
              {services
                .filter((s) => s.active)
                .slice(0, 5)
                .map((s) => (
                  <li key={s.id} className="flex items-center justify-between">
                    <span className="text-sm text-ink-700">{s.name}</span>
                    <span className="text-sm font-semibold text-ink-900">{formatRupiah(s.price)}</span>
                  </li>
                ))}
            </ul>
          )}
          <Link to={`/app/${business.id}/services`} className="mt-5 block text-center text-sm font-semibold text-brand-600 hover:underline">
            Kelola layanan →
          </Link>
        </Card>
      </div>
    </>
  );
}