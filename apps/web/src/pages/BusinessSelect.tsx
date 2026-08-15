import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import type { Business } from '@washcut/shared';
import { api } from '../lib/api';
import { Badge } from '../components/ui/Badge';
import { Field, Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';

export function BusinessSelect() {
  const navigate = useNavigate();
  const [list, setList] = useState<Business[]>([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<Business['type']>('barbershop');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    api.listBusinesses().then((r) => {
      if (r.ok) setList(r.data);
    });
  }, []);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setBusy(true);
    const r = await api.createBusiness({ name, type });
    setBusy(false);
    if (r.ok) {
      setOpen(false);
      setName('');
      navigate(`/app/${r.data.id}/dashboard`);
    }
  };

  return (
    <div className="min-h-screen bg-ink-50 px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="text-sm font-semibold text-ink-500 hover:text-ink-800">← Beranda</Link>
          <span className="badge ring-1 ring-inset ring-brand-200 bg-brand-50 text-brand-700">Owner</span>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink-900">Pilih Bisnis</h1>
        <p className="mt-1 text-sm text-ink-500">Anda memiliki {list.length} bisnis. Pilih untuk masuk ke dashboard.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {list.map((b) => (
            <button
              key={b.id}
              onClick={() => navigate(`/app/${b.id}/dashboard`)}
              className="card p-6 text-left transition hover:border-brand-300 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-lg font-black text-brand-600">
                  {b.name.charAt(0)}
                </span>
                <Badge tone={b.type === 'barbershop' ? 'brand' : 'blue'}>
                  {b.type === 'barbershop' ? 'Barbershop' : 'Car Wash'}
                </Badge>
              </div>
              <p className="mt-4 font-bold text-ink-900">{b.name}</p>
              <p className="text-xs text-ink-400">/{b.slug}</p>
              <div className="mt-3 flex items-center gap-2">
                <Badge tone={b.status === 'active' ? 'green' : 'amber'}>{b.status}</Badge>
                <span className="text-xs text-ink-400">Buka dashboard →</span>
              </div>
            </button>
          ))}

          <button
            onClick={() => setOpen(true)}
            className="flex min-h-[150px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ink-300 text-ink-400 transition hover:border-brand-400 hover:text-brand-600"
          >
            <span className="text-3xl">+</span>
            <span className="mt-1 text-sm font-semibold">Buat Bisnis Baru</span>
          </button>
        </div>
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Buat Bisnis Baru">
        <form onSubmit={create} className="space-y-4">
          <Field label="Nama Bisnis">
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="cth: Urban Cuts" />
          </Field>
          <Field label="Jenis Bisnis">
            <div className="grid grid-cols-2 gap-2">
              {(['barbershop', 'car_wash'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                    type === t ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-300 text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  {t === 'barbershop' ? <><Icon name="scissors" size={16} /> Barbershop</> : <><Icon name="car" size={16} /> Car Wash</>}
                </button>
              ))}
            </div>
          </Field>
          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy ? 'Membuat...' : 'Buat & Masuk'}
          </button>
        </form>
      </Modal>
    </div>
  );
}