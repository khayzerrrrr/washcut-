import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('owner@washcut.id');
  const [password, setPassword] = useState('demo1234');

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-600 text-2xl font-black text-white">W</span>
          <h1 className="mt-4 text-2xl font-bold text-white">Masuk ke WashCut</h1>
          <p className="mt-1 text-sm text-ink-400">Kelola barbershop & car wash Anda</p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate('/business');
          }}
          className="card p-6 !bg-ink-800 !border-ink-700"
        >
          <label className="label !text-ink-400">Email</label>
          <input className="input !bg-ink-900 !border-ink-600 !text-white" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <label className="label !text-ink-400 mt-4">Password</label>
          <input className="input !bg-ink-900 !border-ink-600 !text-white" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" className="btn-primary mt-6 w-full">
            Masuk
          </button>
          <p className="mt-4 text-center text-xs text-ink-500">
            Demo: klik "Masuk" langsung masuk ke daftar bisnis.
          </p>
        </form>

        <p className="mt-6 text-center text-sm text-ink-500">
          <Link to="/" className="text-brand-400 hover:underline">← Kembali ke beranda</Link>
        </p>
      </div>
    </div>
  );
}