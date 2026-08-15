import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, ServiceItem } from '@washcut/shared';
import { api, formatRupiah } from '../lib/api';
import { Card, EmptyState, PageHeader, TableSkeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Field, Modal } from '../components/ui/Modal';

export function Services() {
  const { business } = useOutletContext<{ business: Business }>();
  const [list, setList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', category: '', price: '', durationMin: '' });

  useEffect(() => {
    setLoading(true);
    api.listServices(business.id).then((r) => {
      if (r.ok) setList(r.data);
      setLoading(false);
    });
  }, [business.id]);

  const create = async (e: FormEvent) => {
    e.preventDefault();
    const r = await api.createService(business.id, {
      name: form.name,
      category: form.category || 'Umum',
      price: Number(form.price),
      durationMin: Number(form.durationMin) || 30,
    });
    if (r.ok) {
      setList((p) => [...p, r.data]);
      setOpen(false);
      setForm({ name: '', category: '', price: '', durationMin: '' });
    }
  };

  const categories = [...new Set(list.map((s) => s.category ?? 'Umum'))];

  return (
    <>
      <PageHeader
        title="Layanan"
        subtitle={`${list.filter((s) => s.active).length} layanan aktif di ${business.name}`}
        action={<button className="btn-primary" onClick={() => setOpen(true)}>+ Tambah Layanan</button>}
      />

      {loading ? (
        <Card className="p-0 overflow-hidden">
          <TableSkeleton rows={5} cols={4} />
        </Card>
      ) : list.length === 0 ? (
        <EmptyState title="Belum ada layanan" hint="Tambahkan layanan pertama Anda." />
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => (
            <Card key={cat} className="p-0 overflow-hidden">
              <div className="border-b border-ink-100 bg-ink-50 px-5 py-3">
                <h2 className="font-display text-sm font-bold text-ink-700">{cat}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px]">
                  <thead>
                    <tr className="border-b border-ink-100">
                      <th className="th">Layanan</th>
                      <th className="th">Durasi</th>
                      <th className="th">Harga</th>
                      <th className="th text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink-50">
                    {list
                      .filter((s) => (s.category ?? 'Umum') === cat)
                      .map((s) => (
                        <tr key={s.id} className="hover:bg-ink-50/50">
                          <td className="td font-semibold text-ink-900">{s.name}</td>
                          <td className="td">{s.durationMin} mnt</td>
                          <td className="td font-semibold">{formatRupiah(s.price)}</td>
                          <td className="td text-right">
                            <Badge tone={s.active ? 'green' : 'gray'}>{s.active ? 'Aktif' : 'Nonaktif'}</Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="Tambah Layanan">
        <form onSubmit={create} className="space-y-4">
          <Field label="Nama Layanan">
            <input className="input" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder={business.type === 'car_wash' ? 'cth: Cuci Kapsul' : 'cth: Potong Rambut'} />
          </Field>
          <Field label="Kategori">
            <input className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder={business.type === 'car_wash' ? 'Cuci, Detailing, Coating...' : 'Potong, Styling, Perawatan...'} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga (Rp)">
              <input className="input" type="number" min={0} required value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="50000" />
            </Field>
            <Field label="Durasi (menit)">
              <input className="input" type="number" min={1} required value={form.durationMin} onChange={(e) => setForm({ ...form, durationMin: e.target.value })} placeholder="30" />
            </Field>
          </div>
          <button type="submit" className="btn-primary w-full">Simpan</button>
        </form>
      </Modal>
    </>
  );
}