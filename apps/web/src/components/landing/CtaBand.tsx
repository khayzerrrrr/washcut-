import { Link } from 'react-router-dom';
import { Icon } from '../ui/Icon';

export function CtaBand({
  title,
  sub,
  cta = 'Mulai Gratis',
  dark = false,
}: {
  title: string;
  sub: string;
  cta?: string;
  dark?: boolean;
}) {
  return (
    <div
      className={`mt-16 flex flex-col items-start gap-6 rounded-[1.5rem] p-8 sm:flex-row sm:items-center sm:justify-between ${
        dark
          ? 'border border-ink-700 bg-ink-800/60'
          : 'border border-brand-200 bg-white shadow-sm'
      }`}
    >
      <div>
        <h3 className={`text-xl font-bold sm:text-2xl ${dark ? 'text-white' : 'text-ink-900'}`}>{title}</h3>
        <p className={`mt-1 text-sm ${dark ? 'text-ink-400' : 'text-ink-500'}`}>{sub}</p>
      </div>
      <Link to="/login" className={`${dark ? 'btn-primary' : 'btn-primary'} shrink-0`}>
        {cta}
        <Icon name="arrowRight" size={16} />
      </Link>
    </div>
  );
}
