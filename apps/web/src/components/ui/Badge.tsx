import type { ReactNode } from 'react';

export function Badge({ tone, children }: { tone: 'green' | 'amber' | 'brand' | 'gray' | 'red' | 'blue'; children: ReactNode }) {
  const tones: Record<string, string> = {
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    brand: 'bg-brand-50 text-brand-700 ring-brand-200',
    gray: 'bg-ink-100 text-ink-600 ring-ink-200',
    red: 'bg-rose-50 text-rose-700 ring-rose-200',
    blue: 'bg-sky-50 text-sky-700 ring-sky-200',
  };
  return <span className={`badge ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

export function statusTone(status: string): 'green' | 'amber' | 'brand' | 'gray' | 'red' {
  switch (status) {
    case 'confirmed':
      return 'brand';
    case 'completed':
    case 'active':
    case 'paid':
      return 'green';
    case 'pending':
    case 'trial':
    case 'partial':
      return 'amber';
    case 'cancelled':
    case 'suspended':
      return 'red';
    default:
      return 'gray';
  }
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    confirmed: 'Dikonfirmasi',
    completed: 'Selesai',
    pending: 'Menunggu',
    cancelled: 'Dibatalkan',
    active: 'Aktif',
    trial: 'Trial',
    suspended: 'Ditangguhkan',
    paid: 'Lunas',
    partial: 'Sebagian',
  };
  return map[status] ?? status;
}