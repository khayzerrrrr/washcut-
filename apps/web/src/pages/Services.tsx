import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, ServiceItem } from '@washcut/shared';
import { api, formatRupiah } from '../lib/api';
import { Card, EmptyState, PageHeader, TableSkeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Field, Modal } from '../components/ui/Modal';

const emptyForm = { name: '', category: '', price: '', durationMin: '', active: true };

export function Services() {
  const { business } = useOutletContext<{ business: Business }>();
  const [list, setList] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  const refresh = () => {
    setLoading(true);
    api
      .listServices(business.id)
      .then((r) => {
        if (r.ok) setList(r.data);
      })
      .catch(() => setError('Gagal memuat layanan. Periksa koneksi server.'))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [business.id]);

  const openCreate = () => {
    setForm(emptyForm);
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (s: ServiceItem) => {
    setForm({ name: s.name, category: s.category ?? '', price: String(s.price), durationMin: String(s.durationMin), active: s.active });
    setEditing(s);
    setOpen(true);
  };

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const input = {
      name: form.name,
      category: form.category || 'Umum',
      price: Number(form.price),
      durationMin: Number(form.durationMin) || 30,
      active: form.active,
    };
    try {
      const r = editing
        ? await api.updateService(business.id, editing.id, input)
        : await api.createService(business.id, input);
      if (r.ok) {
        setOpen(false);
        refresh();
      }
    } catch {
      setError('Gagal menyimpan layanan. Periksa koneksi server.');
    }
  };

  const toggleActive = async (s: ServiceItem) => {
    try {
      const r = await api.updateService(business.id, s.id, { active: !s.active });
      if (r.ok) refresh();
    } catch {
      setError('Gagal mengubah status layanan.');
    }
  };

  const remove = async (s: ServiceItem) => {
    if (!window.confirm(`Hapus layanan "${s.name}"?`)) return;
    try {
      const r = await api.deleteService(business.id, s.id);
      if (r.ok) refresh();
    } catch {
      setError('Gagal menghapus layanan.');
    }
  };

  const categories = [...new Set(list.map((s) => s.category ?? 'Umum'))];

  return (
    <>
      <PageHeader
        title="Layanan"
        subtitle={`${list.filter((s) => s.active).length} layanan aktif di ${business.name}`}
        action={<button className="btn-primary" onClick={openCreate}><Icon name="plus" size={16} /> Tambah Layanan</button>}
      />

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
          <span>{error}</span>
          <button className="font-semibold underline" onClick={() => setError(null)}>Tutup</button>
        </div>
      )}

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
                      <th className="th w-24 text-right">Aksi</th>
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
                            <button className="inline-flex items-center gap-2" onClick={() => toggleActive(s)} aria-label={s.active ? 'Nonaktifkan layanan' : 'Aktifkan layanan'}>
                              <Badge tone={s.active ? 'green' : 'gray'}>{s.active ? 'Aktif' : 'Nonaktif'}</Badge>
                            </button>
                          </td>
                          <td className="td text-right">
                            <div className="inline-flex gap-1">
                              <button className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-brand-700" onClick={() => openEdit(s)} aria-label={`Edit ${s.name}`}>
                                <Icon name="edit" size={16} />
                              </button>
                              <button className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-danger-600" onClick={() => remove(s)} aria-label={`Hapus ${s.name}`}>
                                <Icon name="trash" size={16} />
                              </button>
                            </div>
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

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? 'Edit Layanan' : 'Tambah Layanan'}>
        <form onSubmit={submit} className="space-y-4">
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
          {editing && (
            <label className="flex items-center justify-between rounded-xl border border-ink-200 px-4 py-3">
              <span className="text-sm font-medium text-ink-700">Layanan aktif</span>
              <input type="checkbox" className="h-5 w-5 accent-brand-600" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
            </label>
          )}
          <button type="submit" className="btn-primary w-full">Simpan</button>
        </form>
      </Modal>
    </>
  );
}
