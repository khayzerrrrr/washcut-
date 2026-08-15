import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, QueueItem } from '@washcut/shared';
import { api } from '../lib/api';
import { Card, EmptyState, PageHeader, StatCard } from '../components/ui/Card';
import { Badge, statusLabel, statusTone } from '../components/ui/Badge';

export function Queue() {
  const { business } = useOutletContext<{ business: Business }>();
  const [list, setList] = useState<QueueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.listQueue(business.id).then((r) => {
      if (r.ok) setList(r.data);
      setLoading(false);
    });
  }, [business.id]);

  const waiting = list.filter((q) => q.status === 'waiting').length;
  const inService = list.filter((q) => q.status === 'in-service').length;
  const completed = list.filter((q) => q.status === 'completed').length;

  const setStatus = async (id: string, status: QueueItem['status']) => {
    const r = await api.updateQueueStatus(business.id, id, status);
    if (r.ok) setList((p) => p.map((q) => (q.id === id ? r.data : q)));
  };

  const order = { waiting: 0, 'in-service': 1, completed: 2, cancelled: 3 } as const;
  const rows = [...list].sort((a, b) => order[a.status] - order[b.status] || a.queueNo - b.queueNo);

  return (
    <>
      <PageHeader title="Antrian" subtitle={`Antrian layanan di ${business.name}`} />

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-ink-200/70" />)}
        </div>
      ) : (
        <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Antrian" value={String(list.length)} tone="brand" />
          <StatCard label="Sedang Dilayani" value={String(inService)} tone="amber" />
          <StatCard label="Menunggu" value={String(waiting)} tone="default" />
          <StatCard label="Selesai Hari Ini" value={String(completed)} tone="green" />
        </div>
      )}

      {!loading && rows.length === 0 ? (
        <EmptyState title="Antrian kosong — nikmati ketenangannya." hint="Antrian baru akan muncul di sini." />
      ) : (
        <div className="space-y-3">
          {rows.map((q) => (
            <Card key={q.id} className="p-4 sm:p-5">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-ink-900 font-display text-base font-bold text-white">
                  {String(q.queueNo).padStart(2, '0')}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-bold text-ink-900">{q.customerName}</p>
                    <Badge tone={statusTone(q.status)}>{statusLabel(q.status)}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-ink-500">{q.serviceName}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.status === 'waiting' && (
                    <button className="btn-primary btn-sm" onClick={() => setStatus(q.id, 'in-service')}>Mulai Layanan</button>
                  )}
                  {q.status === 'in-service' && (
                    <button className="btn-primary btn-sm" onClick={() => setStatus(q.id, 'completed')}>Selesai</button>
                  )}
                  {(q.status === 'waiting' || q.status === 'in-service') && (
                    <button className="btn-ghost btn-sm" onClick={() => setStatus(q.id, 'cancelled')}>Batalkan</button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
