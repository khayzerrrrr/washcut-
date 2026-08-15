import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, Customer, Vehicle } from '@washcut/shared';
import { api } from '../lib/api';
import { Card, EmptyState, PageHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';

export function Customers() {
  const { business } = useOutletContext<{ business: Business }>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selected, setSelected] = useState<Customer | null>(null);
  const isWash = business.type === 'car_wash';

  useEffect(() => {
    api.listCustomers(business.id).then((r) => r.ok && setCustomers(r.data));
    if (isWash) api.listVehicles(business.id).then((r) => r.ok && setVehicles(r.data));
  }, [business.id, isWash]);

  const customerVehicles = (cid: string) => vehicles.filter((v) => v.customerId === cid);

  return (
    <>
      <PageHeader title="Pelanggan" subtitle={`${customers.length} pelanggan terdaftar`} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 p-0 overflow-hidden">
          {customers.length === 0 ? (
            <EmptyState title="Belum ada pelanggan" />
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
                            {customerVehicles(c.id).length === 0 && <span className="text-xs text-ink-400">—</span>}
                          </div>
                        ) : (
                          <span className="text-xs text-ink-400">Profile rambut</span>
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
                <div>
                  <h2 className="font-bold text-ink-900">{selected.name}</h2>
                  <p className="text-xs text-ink-500">{selected.phone}</p>
                </div>
              </div>

              <h3 className="mt-6 text-xs font-bold text-ink-500 uppercase tracking-wide">Detail</h3>
              <dl className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between"><dt className="text-ink-500">Email</dt><dd className="text-ink-900">{selected.email ?? '—'}</dd></div>
                <div className="flex justify-between"><dt className="text-ink-500">Bergabung</dt><dd className="text-ink-900">{new Date(selected.createdAt).toLocaleDateString('id-ID')}</dd></div>
              </dl>

              {isWash && (
                <>
                  <h3 className="mt-6 text-xs font-bold text-ink-500 uppercase tracking-wide">Kendaraan</h3>
                  {customerVehicles(selected.id).length === 0 ? (
                    <p className="mt-2 text-sm text-ink-400">Belum ada kendaraan.</p>
                  ) : (
                    <ul className="mt-2 space-y-2">
                      {customerVehicles(selected.id).map((v) => (
                        <li key={v.id} className="rounded-xl border border-ink-200 p-3">
                          <p className="font-bold text-ink-900">{v.plateNumber}</p>
                          <p className="text-xs text-ink-500">
                            {[v.brand, v.model, v.vehicleClass, v.color].filter(Boolean).join(' · ') || 'Detail belum diisi'}
                          </p>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              )}

              {!isWash && (
                <>
                  <h3 className="mt-6 text-xs font-bold text-ink-500 uppercase tracking-wide">Profil Rambut</h3>
                  <div className="mt-2 rounded-xl bg-ink-50 p-3 text-sm text-ink-600">
                    <p className="mb-1"><span className="font-semibold">Tipe:</span> Lurus</p>
                    <p><span className="font-semibold">Catatan:</span> Suka model taper fade, bagian atas dibiarkan panjang.</p>
                  </div>
                </>
              )}
              <Badge tone="brand" >{selected.id.slice(0, 1).toUpperCase()} · member</Badge>
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
    </>
  );
}