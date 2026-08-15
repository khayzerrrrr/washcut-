import type { ReactNode } from 'react';

export function Badge({ tone, children }: { tone: 'green' | 'amber' | 'brand' | 'gray' | 'red' | 'blue' | 'cyan'; children: ReactNode }) {
  const tones: Record<string, string> = {
    green: 'bg-success-50 text-success-700 ring-success-100',
    amber: 'bg-warn-50 text-warn-700 ring-warn-100',
    brand: 'bg-brand-50 text-brand-700 ring-brand-200',
    gray: 'bg-ink-100 text-ink-600 ring-ink-200',
    red: 'bg-danger-50 text-danger-700 ring-danger-100',
    blue: 'bg-info-50 text-info-700 ring-info-100',
    cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
  };
  return <span className={`badge ring-1 ring-inset ${tones[tone]}`}>{children}</span>;
}

export function statusTone(status: string): 'green' | 'amber' | 'brand' | 'gray' | 'red' {
  switch (status) {
    case 'confirmed':
    case 'in-service':
      return 'brand';
    case 'completed':
    case 'active':
    case 'paid':
      return 'green';
    case 'pending':
    case 'waiting':
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
    waiting: 'Menunggu',
    'in-service': 'Dalam Layanan',
    cancelled: 'Dibatalkan',
    active: 'Aktif',
    trial: 'Trial',
    suspended: 'Ditangguhkan',
    paid: 'Lunas',
    partial: 'Sebagian',
  };
  return map[status] ?? status;
}