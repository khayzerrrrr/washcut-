import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@washcut.id');
  const [password, setPassword] = useState('demo1234');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const submit = (role: 'owner' | 'super_admin') => {
    setError('');
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      navigate(role === 'super_admin' ? '/tenants' : '/business');
    }, 400);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,rgba(220,38,38,0.12),transparent_60%)]" />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <Logo sizeClass="h-14 w-auto" alt="WashCut" />
          <h1 className="font-display mt-4 text-2xl font-bold text-white">Masuk ke WashCut</h1>
          <p className="mt-1 text-sm text-ink-400">Kelola barbershop & car wash Anda</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); submit('owner'); }} className="card-dark p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-danger-500/40 bg-danger-500/10 px-3 py-2 text-sm text-danger-300">
              <Icon name="check" size={15} className="rotate-45" />
              {error}
            </div>
          )}
          <label className="label-dark">Email</label>
          <input className="input-dark" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="label-dark mt-4">Password</label>
          <div className="relative">
            <input
              className="input-dark pr-11"
              type={show ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? 'Sembunyikan password' : 'Tampilkan password'}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-300"
            >
              <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
            </button>
          </div>
          <button type="submit" className="btn-primary mt-6 w-full" disabled={busy}>
            {busy ? <><span className="btn-spinner" /> Memproses...</> : 'Masuk sebagai Owner'}
          </button>
          <button
            type="button"
            onClick={() => submit('super_admin')}
            className="btn-outline-dark mt-3 w-full"
            disabled={busy}
          >
            {busy ? <><span className="btn-spinner" /> Memproses...</> : 'Masuk sebagai Super Admin'}
          </button>
          <p className="mt-4 text-center text-xs text-ink-500">Demo: klik tombol untuk masuk.</p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          <Link to="/" className="text-brand-400 hover:underline">← Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  );
}