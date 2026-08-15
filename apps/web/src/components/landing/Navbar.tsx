import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from '../ui/Logo';
import { Icon } from '../ui/Icon';

const links = [
  ['Produk', '#produk'],
  ['Solusi', '#solusi'],
  ['Fitur', '#fitur'],
  ['Harga', '#harga'],
  ['FAQ', '#faq'],
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-white/10 bg-ink-900/80 backdrop-blur-xl'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#" className="flex items-center gap-2.5" aria-label="WashCut beranda">
          <Logo sizeClass="h-8 w-auto" alt="WashCut" />
          <span className="font-display text-lg font-extrabold tracking-tight text-white">WashCut</span>
        </a>

        <nav className="hidden items-center gap-7 text-sm font-medium text-ink-300 lg:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="transition-colors hover:text-white">
              {label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link to="/login" className="btn-ghost text-ink-300 hover:text-white">
            Masuk
          </Link>
          <Link to="/login" className="btn-primary">
            Mulai Gratis
          </Link>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-600 text-white lg:hidden"
          aria-label="Buka menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? 'x' : 'plus'} size={20} />
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-ink-900/95 px-6 py-4 lg:hidden">
          <nav className="flex flex-col gap-1 text-sm font-medium text-ink-200">
            {links.map(([label, href]) => (
              <a key={href} href={href} onClick={() => setOpen(false)} className="rounded-lg px-2 py-2.5 hover:bg-ink-800 hover:text-white">
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
            <Link to="/login" onClick={() => setOpen(false)} className="btn-outline-dark w-full">
              Masuk
            </Link>
            <Link to="/login" onClick={() => setOpen(false)} className="btn-primary w-full">
              Mulai Gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
