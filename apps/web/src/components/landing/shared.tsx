import type { ReactNode } from 'react';
import { Icon } from '../ui/Icon';

export function Section({
  id,
  dark = false,
  className = '',
  children,
}: {
  id?: string;
  dark?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative ${dark ? 'bg-ink-900 text-white' : 'bg-ink-50 text-ink-900'} ${className}`}
    >
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-20 lg:py-24">{children}</div>
    </section>
  );
}

export function SectionHeader({
  kicker,
  title,
  subtitle,
  dark = false,
  center = true,
}: {
  kicker: string;
  title: ReactNode;
  subtitle?: ReactNode;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`${center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}`}>
      <span
        className={`badge ring-1 ring-inset ${
          dark
            ? 'bg-brand-500/10 text-brand-300 ring-brand-500/40'
            : 'bg-brand-50 text-brand-700 ring-brand-200'
        }`}
      >
        {kicker}
      </span>
      <h2
        className={`font-display mt-4 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl ${
          dark ? 'text-white' : 'text-ink-900'
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base sm:text-lg ${dark ? 'text-ink-300' : 'text-ink-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function CheckItem({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          dark ? 'bg-brand-500/15 text-cyan-400' : 'bg-brand-50 text-brand-600'
        }`}
      >
        <Icon name="check" size={12} />
      </span>
      <span className={dark ? 'text-sm text-ink-200' : 'text-sm text-ink-700'}>{children}</span>
    </li>
  );
}

export function FeatureTile({
  icon,
  title,
  desc,
  dark = false,
  tone = 'brand',
}: {
  icon: string;
  title: string;
  desc: string;
  dark?: boolean;
  tone?: 'brand' | 'cyan' | 'info' | 'success' | 'warn';
}) {
  const tones: Record<string, string> = {
    brand: dark ? 'bg-brand-500/15 text-brand-300 ring-brand-500/30' : 'bg-brand-50 text-brand-600 ring-brand-200',
    cyan: dark ? 'bg-cyan-500/10 text-cyan-300 ring-cyan-500/30' : 'bg-cyan-50 text-cyan-600 ring-cyan-200',
    info: dark ? 'bg-info-500/10 text-info-300 ring-info-500/30' : 'bg-info-50 text-info-600 ring-info-200',
    success: dark ? 'bg-success-500/10 text-success-300 ring-success-500/30' : 'bg-success-50 text-success-600 ring-success-200',
    warn: dark ? 'bg-warn-500/10 text-warn-300 ring-warn-500/30' : 'bg-warn-50 text-warn-600 ring-warn-200',
  };
  return (
    <div className={dark ? 'rounded-2xl border border-ink-700 bg-ink-800/60 p-6' : 'card p-6'}>
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-inset ${tones[tone]}`}
      >
        <Icon name={icon} size={20} />
      </span>
      <h3 className={`mt-4 text-base font-bold ${dark ? 'text-white' : 'text-ink-900'}`}>{title}</h3>
      <p className={`mt-1.5 text-sm leading-relaxed ${dark ? 'text-ink-400' : 'text-ink-500'}`}>{desc}</p>
    </div>
  );
}
