import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, Customer, Vehicle } from '@washcut/shared';
import { api } from '../lib/api';
import { Card, EmptyState, PageHeader, Skeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Field, Modal } from '../components/ui/Modal';

const emptyCustomerForm = { name: '', phone: '', email: '', notes: '' };
const emptyVehicleForm = { plateNumber: '', brand: '', model: '', vehicleClass: '', color: '' };

export function Customers() {
  const { business } = useOutletContext<{ business: Business }>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [custOpen, setCustOpen] = useState(false);
  const [custEditing, setCustEditing] = useState<Customer | null>(null);
  const [custForm, setCustForm] = useState(emptyCustomerForm);
  const [vehOpen, setVehOpen] = useState(false);
  const [vehForm, setVehForm] = useState(emptyVehicleForm);
  const isWash = business.type === 'car_wash';

  const refresh = () => {
    setLoading(true);
    Promise.all([
      api.listCustomers(business.id).then((r) => r.ok && setCustomers(r.data)),
      isWash ? api.listVehicles(business.id).then((r) => r.ok && setVehicles(r.data)) : Promise.resolve(),
    ])
      .catch(() => setError('Gagal memuat data. Periksa koneksi server.'))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [business.id, isWash]);

  const customerVehicles = (cid: string) => vehicles.filter((v) => v.customerId === cid);

  const openCustomerCreate = () => {
    setCustForm(emptyCustomerForm);
    setCustEditing(null);
    setCustOpen(true);
  };

  const openCustomerEdit = (c: Customer) => {
    setCustForm({ name: c.name, phone: c.phone ?? '', email: c.email ?? '', notes: c.notes ?? '' });
    setCustEditing(c);
    setCustOpen(true);
  };

  const submitCustomer = async (e: FormEvent) => {
    e.preventDefault();
    const input = {
      name: custForm.name,
      ...(custForm.phone ? { phone: custForm.phone } : {}),
      ...(custForm.email ? { email: custForm.email } : {}),
      ...(custForm.notes ? { notes: custForm.notes } : {}),
    };
    try {
      const r = custEditing
        ? await api.updateCustomer(business.id, custEditing.id, input)
        : await api.createCustomer(business.id, input);
      if (r.ok) {
        setCustOpen(false);
        refresh();
      }
    } catch {
      setError('Gagal menyimpan pelanggan.');
    }
  };

  const openVehicleCreate = () => {
    setVehForm(emptyVehicleForm);
    setVehOpen(true);
  };

  const submitVehicle = async (e: FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    const input = {
      customerId: selected.id,
      plateNumber: vehForm.plateNumber,
      ...(vehForm.brand ? { brand: vehForm.brand } : {}),
      ...(vehForm.model ? { model: vehForm.model } : {}),
      ...(vehForm.vehicleClass ? { vehicleClass: vehForm.vehicleClass } : {}),
      ...(vehForm.color ? { color: vehForm.color } : {}),
    };
    try {
      const r = await api.createVehicle(business.id, input);
      if (r.ok) {
        setVehOpen(false);
        refresh();
      }
    } catch {
      setError('Gagal menambahkan kendaraan.');
    }
  };

  const removeVehicle = async (v: Vehicle) => {
    if (!window.confirm(`Hapus kendaraan "${v.plateNumber}"?`)) return;
    try {
      const r = await api.deleteVehicle(business.id, v.id);
      if (r.ok) refresh();
    } catch {
      setError('Gagal menghapus kendaraan.');
    }
  };

  return (
    <>
      <PageHeader
        title="Pelanggan"
        subtitle={`${customers.length} pelanggan terdaftar`}
        action={<button className="btn-primary" onClick={openCustomerCreate}><Icon name="plus" size={16} /> Tambah Pelanggan</button>}
      />

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
          <span>{error}</span>
          <button className="font-semibold underline" onClick={() => setError(null)}>Tutup</button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          {loading ? (
            <div className="space-y-3 p-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-4 flex-1" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          ) : customers.length === 0 ? (
            <EmptyState title="Belum ada pelanggan" hint="Tambahkan pelanggan pertama Anda." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px]">
                <thead>
                  <tr className="border-b border-ink-100">
                    <th className="th">Nama</th>
                    <th className="th">Kontak</th>
                    <th className="th">{isWash ? 'Kendaraan' : ''}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {customers.map((c) => (
                    <tr key={c.id} className="cursor-pointer hover:bg-ink-50/50" onClick={() => setSelected(c)}>
                      <td className="td">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                          {c.name.charAt(0)}
                        </span>
                        <span className="ml-3 font-semibold text-ink-900">{c.name}</span>
                      </td>
                      <td className="td">{c.phone ?? '—'}</td>
                      <td className="td">
                        {isWash ? (
                          <div className="flex flex-wrap gap-1">
                            {customerVehicles(c.id).map((v) => (
                              <span key={v.id} className="badge ring-1 ring-inset ring-ink-200 bg-ink-50 text-ink-700">{v.plateNumber}</span>
                            ))}
                            {customerVehicles(c.id).length === 0 && <span className="text-xs text-ink-500">—</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-ink-500">Profile rambut</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        <Card className="p-5">
          {selected ? (
            <>
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-lg font-black text-brand-700">
                  {selected.name.charAt(0)}
                </span>
                <div className="flex-1">
                  <h2 className="font-display font-bold text-ink-900">{selected.name}</h2>
                  <p className="text-xs text-ink-500">{selected.phone}</p>
                </div>
                <button className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-brand-700" onClick={() => openCustomerEdit(selected)} aria-label={`Edit ${selected.name}`}>
                  <Icon name="edit" size={16} />
                </button>
              </div>

              <h3 className="mt-6 text-xs font-bold text-ink-500 uppercase tracking-wide">Detail</h3>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-ink-500">Email</dt><dd className="text-ink-900">{selected.email ?? '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Bergabung</dt><dd className="text-ink-900">{new Date(selected.createdAt).toLocaleDateString('id-ID')}</dd></div>
              </dl>

              {isWash && (
                <>
                  <div className="mt-6 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-ink-500 uppercase tracking-wide">Kendaraan</h3>
                    <button className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700" onClick={openVehicleCreate}>
                      <Icon name="plus" size={14} /> Tambah
                    </button>
                  </div>
                  {customerVehicles(selected.id).length === 0 ? (
                    <p className="mt-2 text-sm text-ink-500">Belum ada kendaraan.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {customerVehicles(selected.id).map((v) => (
                        <li key={v.id} className="rounded-xl border border-ink-200 p-3">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-bold text-ink-900">{v.plateNumber}</p>
                              <p className="text-xs text-ink-500">
                                {[v.brand, v.model, v.vehicleClass, v.color].filter(Boolean).join(' · ') || 'Detail belum diisi'}
                              </p>
                            </div>
                            <button className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-danger-600" onClick={() => removeVehicle(v)} aria-label={`Hapus ${v.plateNumber}`}>
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {!isWash && (
                <>
                  <h3 className="mt-6 text-xs font-bold text-ink-500 uppercase tracking-wide">Catatan</h3>
                  {selected.notes ? (
                    <p className="mt-2 rounded-xl bg-ink-50 p-3 text-sm text-ink-600">{selected.notes}</p>
                  ) : (
                    <p className="mt-2 text-sm text-ink-500">Belum ada catatan untuk pelanggan ini.</p>
                  )}
                </>
              )}
              <div className="mt-4">
                <Badge tone="brand" >{selected.id.slice(0, 1).toUpperCase()} · member</Badge>
              </div>
            </>
          ) : (
            <div className="py-10 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-ink-100 text-ink-400">
                <Icon name="users" size={26} />
              </span>
              <p className="mt-2 text-sm text-ink-500">Klik pelanggan untuk melihat detail.</p>
            </div>
          )}
        </Card>
      </div>

      <Modal open={custOpen} onClose={() => setCustOpen(false)} title={custEditing ? 'Edit Pelanggan' : 'Tambah Pelanggan'}>
        <form onSubmit={submitCustomer} className="space-y-4">
          <Field label="Nama">
            <input className="input" required value={custForm.name} onChange={(e) => setCustForm({ ...custForm, name: e.target.value })} placeholder="Nama pelanggan" />
          </Field>
          <Field label="No. HP">
            <input className="input" value={custForm.phone} onChange={(e) => setCustForm({ ...custForm, phone: e.target.value })} placeholder="08xx-xxxx-xxxx" />
          </Field>
          <Field label="Email">
            <input className="input" type="email" value={custForm.email} onChange={(e) => setCustForm({ ...custForm, email: e.target.value })} placeholder="nama@email.com" />
          </Field>
          <Field label="Catatan">
            <textarea className="input" value={custForm.notes} onChange={(e) => setCustForm({ ...custForm, notes: e.target.value })} placeholder="Catatan untuk pelanggan (opsional)" rows={3} />
          </Field>
          <button type="submit" className="btn-primary w-full">Simpan</button>
        </form>
      </Modal>

      {isWash && (
        <Modal open={vehOpen} onClose={() => setVehOpen(false)} title="Tambah Kendaraan">
          <form onSubmit={submitVehicle} className="space-y-4">
            <Field label="Plat Nomor">
              <input className="input" required value={vehForm.plateNumber} onChange={(e) => setVehForm({ ...vehForm, plateNumber: e.target.value })} placeholder="cth: B 1234 ABC" />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Merek">
                <input className="input" value={vehForm.brand} onChange={(e) => setVehForm({ ...vehForm, brand: e.target.value })} placeholder="Toyota" />
              </Field>
              <Field label="Model">
                <input className="input" value={vehForm.model} onChange={(e) => setVehForm({ ...vehForm, model: e.target.value })} placeholder="Avanza" />
              </Field>
              <Field label="Kelas">
                <input className="input" value={vehForm.vehicleClass} onChange={(e) => setVehForm({ ...vehForm, vehicleClass: e.target.value })} placeholder="MPV, SUV, Motor..." />
              </Field>
              <Field label="Warna">
                <input className="input" value={vehForm.color} onChange={(e) => setVehForm({ ...vehForm, color: e.target.value })} placeholder="Silver" />
              </Field>
            </div>
            <button type="submit" className="btn-primary w-full">Simpan</button>
          </form>
        </Modal>
      )}
    </>
  );
}
