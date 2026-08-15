const paths: Record<string, string> = {
  check: 'M20 6 9 17l-5-5',
  car: 'M5 11 7 7a2 2 0 0 1 2-1h6a2 2 0 0 1 2 1l2 4m-14 0h14m-14 0v5h-1a1 1 0 0 1-1-1v-4zm14 0v5h1a1 1 0 0 0 1-1v-4zM7 16a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2z',
  scissors: 'M6 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 0 6 6m0 0 6-6M6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm6-9 6 6',
  note: 'M4 4h16v16H4V4zm4 4h8m-8 4h8m-8 4h4',
  cash: 'M3 5h18v14H3V5zm0 7h18M6 10h.01M6 14h.01M18 10h.01M18 14h.01M9 8v.01M9 16v.01M15 8v.01M15 16v.01',
  qr: 'M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h3v3h-3v-3zm4 0h3v7h-3v-7zM4 4m2 0v2h-2',
  wallet: 'M21 12V7H5a2 2 0 0 1 0-4h14v4M3 5v14a2 2 0 0 0 2 2h16v-5M3 12h18m-4 2h.01',
  chart: 'M4 20h16M6 16v-5m4 5V8m4 8v-7m4 7V6',
  calendar: 'M8 2v4m8-4v4M4 8h16M5 4h14a1 1 0 0 1 1 1v16H4V5a1 1 0 0 1 1-1z',
  users: 'M17 20h5v-2a3 3 0 0 0-5.4-1.8M17 20H7m10 0v-2a4 4 0 0 0-3-3.87M7 20H2v-2a3 3 0 0 1 5.4-1.8M7 20v-2a4 4 0 0 1 3-3.87m-1-3.13a3 3 0 1 0-6 0 3 3 0 0 0 6 0zm10 0a3 3 0 1 0-6 0 3 3 0 0 0 6 0z',
  tag: 'M20.6 13.4 12 22l-9-9V3h10l7.6 7.6a2 2 0 0 1 0 2.8zM7 7h.01',
  arrowLeft: 'M19 12H5m7 7-7-7 7-7',
  arrowRight: 'M5 12h14m-7-7 7 7-7 7',
  plus: 'M12 5v14m-7-7h14',
  building: 'M4 21h16M6 21V4h12v17M9 8h2m-2 4h2m-2 4h2m4-8h2m-2 4h2m-2 4h2',
  shield: 'M12 3 4 7v6c0 5 3.4 7.7 8 9 4.6-1.3 8-4 8-9V7l-8-4zm0 6v6m0 0 3-3',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14 5-5-5-5m5 5H9',
};

export function Icon({ name, size = 18, className = '' }: { name: keyof typeof paths | string; size?: number; className?: string }) {
  const d = paths[name] ?? paths.check;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}

export const typeIcons = {
  barbershop: paths.scissors,
  car_wash: paths.car,
} as const;