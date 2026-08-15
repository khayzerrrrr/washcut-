import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, Customer, ServiceItem } from '@washcut/shared';
import { api, formatRupiah } from '../lib/api';
import { Card, PageHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';

export function Checkout() {
  const { business } = useOutletContext<{ business: Business }>();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [customer, setCustomer] = useState('');
  const [method, setMethod] = useState<'cash' | 'qris'>('cash');
  const [done, setDone] = useState(false);

  useEffect(() => {
    api.listServices(business.id).then((r) => r.ok && setServices(r.data.filter((s) => s.active)));
    api.listCustomers(business.id).then((r) => r.ok && setCustomers(r.data));
  }, [business.id]);

  const checkout = async () => {
    if (!selectedService) return;
    const r = await api.createBooking(business.id, {
      customerId: 'c' + Date.now(),
      customerName: customer || 'Walk-in',
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      startsAt: new Date().toISOString(),
      durationMin: selectedService.durationMin,
      amount: selectedService.price,
      walkIn: true,
      staffName: 'Kasir',
    });
    if (r.ok) setDone(true);
  };

  return (
    <>
      <PageHeader title="Kasir" subtitle="Transaksi cepat untuk pelanggan langsung" />

      {done ? (
        <Card className="mx-auto max-w-md p-10 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check" size={32} />
          </span>
          <h2 className="mt-4 text-xl font-bold text-ink-900">Transaksi Berhasil</h2>
          <p className="mt-2 text-sm text-ink-500">
            {formatRupiah(selectedService!.price)} · {customer || 'Walk-in'}
          </p>
          <button className="btn-primary mt-6 w-full" onClick={() => { setDone(false); setSelectedService(null); setCustomer(''); }}>
            Transaksi Baru
          </button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-0 overflow-hidden">
            <div className="border-b border-ink-100 px-5 py-3">
              <h2 className="font-bold text-ink-900">Pilih Layanan</h2>
            </div>
            <div className="grid gap-2 p-4 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedService(s)}
                  className={`rounded-xl border p-4 text-left transition ${
                    selectedService?.id === s.id ? 'border-brand-500 bg-brand-50 ring-2 ring-brand-500/20' : 'border-ink-200 hover:border-brand-300 hover:bg-ink-50'
                  }`}
                >
                  <p className="font-semibold text-ink-900">{s.name}</p>
                  <p className="mt-1 flex items-center justify-between">
                    <span className="text-xs text-ink-400">{s.durationMin} mnt</span>
                    <span className="font-bold text-brand-600">{formatRupiah(s.price)}</span>
                  </p>
                </button>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-bold text-ink-900">Ringkasan</h2>
            <label className="label mt-4">Pelanggan</label>
            <input className="input" list="cust" value={customer} onChange={(e) => setCustomer(e.target.value)} placeholder="Nama atau walk-in" />
            <datalist id="cust">
              {customers.map((c) => <option key={c.id} value={c.name} />)}
            </datalist>

            <label className="label mt-4">Metode Bayar</label>
            <div className="grid grid-cols-2 gap-2">
              {(['cash', 'qris'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMethod(m)}
                  className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                    method === m ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-300 text-ink-600 hover:bg-ink-50'
                  }`}
                >
                  {m === 'cash' ? <><Icon name="cash" size={16} /> Tunai</> : <><Icon name="qr" size={16} /> QRIS</>}
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-2 border-t border-ink-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-500">
                <span>Layanan</span>
                <span>{selectedService ? formatRupiah(selectedService.price) : '—'}</span>
              </div>
              <div className="flex justify-between text-ink-500">
                <span>Diskon</span>
                <span>Rp 0</span>
              </div>
              <div className="flex justify-between pt-2 text-base font-bold text-ink-900">
                <span>Total</span>
                <span>{selectedService ? formatRupiah(selectedService.price) : '—'}</span>
              </div>
            </div>

            <button className="btn-primary mt-5 w-full !py-3.5 !text-base" disabled={!selectedService} onClick={checkout}>
              Bayar {selectedService ? formatRupiah(selectedService.price) : ''}
            </button>
            <p className="mt-3 text-center text-xs text-ink-400">
              <Badge tone="blue">Pembayaran</Badge> metode {method.toUpperCase()}
            </p>
          </Card>
        </div>
      )}
    </>
  );
}