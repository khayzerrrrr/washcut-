import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, Payment, Product, ServiceItem } from '@washcut/shared';
import { api, formatDate, formatRupiah } from '../lib/api';
import { Card, EmptyState, PageHeader, Skeleton } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Icon } from '../components/ui/Icon';

type LineItem = { id: string; name: string; unitPrice: number; qty: number };

const PAYMENT_METHODS = [
  { key: 'cash', label: 'Tunai', icon: 'cash' },
  { key: 'qris', label: 'QRIS', icon: 'qr' },
  { key: 'transfer', label: 'Transfer', icon: 'wallet' },
  { key: 'card', label: 'Kartu', icon: 'tag' },
] as const;

export function Checkout() {
  const { business } = useOutletContext<{ business: Business }>();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Semua');
  const [items, setItems] = useState<LineItem[]>([]);
  const [discountType, setDiscountType] = useState<'none' | 'amount' | 'percent'>('none');
  const [discount, setDiscount] = useState(0);
  const [method, setMethod] = useState<(typeof PAYMENT_METHODS)[number]['key']>('cash');
  const [receipt, setReceipt] = useState<LineItem[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [payError, setPayError] = useState('');
  const [payments, setPayments] = useState<Payment[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const loadPayments = useCallback(() => {
    api.listPayments(business.id).then((r) => {
      if (r.ok) setPayments(r.data.slice().sort((a, b) => b.paidAt.localeCompare(a.paidAt)).slice(0, 10));
    });
  }, [business.id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.listServices(business.id).then((r) => r.ok && setServices(r.data.filter((s) => s.active))),
      api.listProducts(business.id).then((r) => r.ok && setProducts(r.data)),
    ]).finally(() => setLoading(false));
    loadPayments();
  }, [business.id, loadPayments]);

  useEffect(() => {
    if (!loading) searchRef.current?.focus();
  }, [loading]);

  const catalog = useMemo(() => {
    const all: { id: string; name: string; category: string; price: number }[] = [
      ...services.map((s) => ({ id: s.id, name: s.name, category: s.category ?? 'Layanan', price: s.price })),
      ...products.map((p) => ({ id: p.id, name: p.name, category: p.category ?? 'Produk', price: p.price })),
    ];
    const q = query.trim().toLowerCase();
    return all.filter(
      (i) => (category === 'Semua' || i.category === category) && (!q || i.name.toLowerCase().includes(q)),
    );
  }, [services, products, query, category]);

  const categories = useMemo(
    () => ['Semua', ...new Set([...services.map((s) => s.category ?? 'Layanan'), ...products.map((p) => p.category ?? 'Produk')])],
    [services, products],
  );

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.qty, 0);
  const discountValue = discountType === 'amount' ? Math.min(discount, subtotal) : discountType === 'percent' ? Math.min(discount, 100) / 100 * subtotal : 0;
  const tax = (subtotal - discountValue) * 0.11;
  const total = subtotal - discountValue + tax;

  const addItem = (name: string, price: number) => {
    setItems((p) => {
      const existing = p.find((i) => i.name === name);
      return existing ? p.map((i) => (i.name === name ? { ...i, qty: i.qty + 1 } : i)) : [...p, { id: name, name, unitPrice: price, qty: 1 }];
    });
  };

  const onAddFromSearch = (e: FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    const hit = catalog.find((i) => i.name.toLowerCase() === query.trim().toLowerCase());
    if (hit) addItem(hit.name, hit.price);
    setQuery('');
    searchRef.current?.focus();
  };

  const changeQty = (name: string, delta: number) => {
    setItems((p) =>
      p
        .map((i) => (i.name === name ? { ...i, qty: Math.max(0, i.qty + delta) } : i))
        .filter((i) => i.qty > 0),
    );
  };

  const pay = async () => {
    if (items.length === 0 || busy) return;
    setBusy(true);
    setPayError('');
    try {
      const r = await api.createPayment(business.id, { amount: Math.round(total), method });
      if (r.ok) {
        setReceipt(items);
        setItems([]);
        setDiscountType('none');
        setDiscount(0);
        loadPayments();
      }
    } catch (e) {
      setPayError((e as { error?: { message?: string } })?.error?.message || 'Tidak dapat terhubung ke server');
    } finally {
      setBusy(false);
    }
  };

  const reset = () => {
    setItems([]);
    setDiscountType('none');
    setDiscount(0);
    setReceipt(null);
    searchRef.current?.focus();
  };

  return (
    <>
      <PageHeader title="Kasir (POS)" subtitle="Transaksi cepat untuk pelanggan langsung" />

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2 p-0 overflow-hidden"><div className="p-5"><Skeleton className="mb-3 h-10" /><Skeleton className="h-24" /><Skeleton className="mt-2 h-24" /></div></Card>
          <Card className="p-5"><Skeleton className="h-40" /></Card>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Katalog */}
          <Card className="p-0 overflow-hidden lg:col-span-1">
            <form onSubmit={onAddFromSearch} className="border-b border-ink-100 p-4">
              <div className="relative">
                <Icon name="search" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
                <input ref={searchRef} className="input pl-9" placeholder="Cari layanan / produk, Enter…" value={query} onChange={(e) => setQuery(e.target.value)} />
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button key={c} onClick={() => setCategory(c)} className={`rounded-full px-3 py-1 text-xs font-semibold transition ${category === c ? 'bg-ink-900 text-white' : 'bg-ink-50 text-ink-600 hover:bg-ink-100'}`}>
                    {c}
                  </button>
                ))}
              </div>
            </form>
            <div className="max-h-[26rem] space-y-2 overflow-y-auto p-4">
              {catalog.map((i) => (
                <button key={i.id} onClick={() => addItem(i.name, i.price)} className="flex w-full items-center justify-between rounded-xl border border-ink-200 px-4 py-3 text-left transition hover:border-brand-400 hover:bg-brand-50/40">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-ink-900">{i.name}</span>
                    <span className="block text-xs text-ink-500">{i.category}</span>
                  </span>
                  <span className="ml-3 font-bold text-brand-600">{formatRupiah(i.price)}</span>
                </button>
              ))}
              {catalog.length === 0 && <p className="py-8 text-center text-sm text-ink-500">Tidak ada item yang cocok.</p>}
            </div>
          </Card>

          {/* Pesanan */}
          <Card className="p-0 overflow-hidden lg:col-span-1">
            <div className="flex items-center justify-between border-b border-ink-100 px-5 py-3">
              <h2 className="font-display font-bold text-ink-900">Pesanan</h2>
              <span className="text-xs text-ink-500">{items.reduce((s, i) => s + i.qty, 0)} item</span>
            </div>
            <div className="max-h-[26rem] space-y-2 overflow-y-auto p-4">
              {items.length === 0 ? (
                <p className="py-10 text-center text-sm text-ink-500">Belum ada item. Pilih dari katalog.</p>
              ) : (
                items.map((i) => (
                  <div key={i.id} className="flex items-center gap-3 rounded-xl bg-ink-50 px-3 py-2.5">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink-900">{i.name}</p>
                      <p className="text-xs text-ink-500">{formatRupiah(i.unitPrice)}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button className="btn-outline btn-sm !px-2" onClick={() => changeQty(i.name, -1)} aria-label="Kurangi">−</button>
                      <span className="w-6 text-center text-sm font-bold text-ink-900">{i.qty}</span>
                      <button className="btn-outline btn-sm !px-2" onClick={() => changeQty(i.name, 1)} aria-label="Tambah">+</button>
                    </div>
                    <button className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-100 hover:text-danger-600" onClick={() => changeQty(i.name, -i.qty)} aria-label="Hapus">
                      <Icon name="trash" size={16} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Ringkasan */}
          <Card className="p-5 lg:col-span-1">
            <h2 className="font-display font-bold text-ink-900">Ringkasan</h2>

            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between text-ink-500"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-ink-500">Diskon</span>
                <span className="flex items-center gap-2">
                  <select className="rounded-lg border border-ink-300 px-1.5 py-1 text-xs" value={discountType} onChange={(e) => { setDiscountType(e.target.value as typeof discountType); setDiscount(0); }}>
                    <option value="none">Tanpa</option>
                    <option value="amount">Rp</option>
                    <option value="percent">%</option>
                  </select>
                  {discountType !== 'none' && (
                    <input className="input w-20 !py-1 text-right text-xs" type="number" min={0} value={discount || ''} onChange={(e) => setDiscount(Number(e.target.value) || 0)} placeholder="0" />
                  )}
                  <span className="w-20 text-right font-semibold text-ink-900">{formatRupiah(discountValue)}</span>
                </span>
              </div>
              <div className="flex justify-between text-ink-500"><span>Pajak (11%)</span><span>{formatRupiah(tax)}</span></div>
              <div className="flex justify-between border-t border-ink-100 pt-2 text-base font-bold text-ink-900"><span>Total</span><span className="text-brand-600">{formatRupiah(total)}</span></div>
            </div>

            <label className="label mt-5">Metode Bayar</label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((m) => (
                <button key={m.key} onClick={() => setMethod(m.key)} className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${method === m.key ? 'border-brand-500 bg-brand-50 text-brand-700' : 'border-ink-300 text-ink-600 hover:bg-ink-50'}`}>
                  <Icon name={m.icon} size={16} /> {m.label}
                </button>
              ))}
            </div>

            {payError && (
              <p className="mt-4 rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">{payError}</p>
            )}

            <button className="btn-primary btn-lg mt-5 w-full" disabled={items.length === 0 || busy} onClick={pay}>
              {busy ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" aria-hidden />
                  Memproses...
                </span>
              ) : (
                <>Bayar {formatRupiah(total)}</>
              )}
            </button>
          </Card>
        </div>
      )}

      <Card className="mt-6 p-5">
        <h2 className="font-display font-bold text-ink-900">Riwayat Pembayaran</h2>
        <p className="text-xs text-ink-500">10 transaksi terakhir</p>
        <div className="mt-3">
          {payments.length === 0 ? (
            <EmptyState title="Belum ada pembayaran" hint="Transaksi POS akan tercatat di sini." />
          ) : (
            <div className="divide-y divide-ink-100">
              {payments.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-3 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Icon name={PAYMENT_METHODS.find((m) => m.key === p.method)?.icon ?? 'cash'} size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-ink-900">{formatRupiah(p.amount)}</p>
                      <p className="text-xs text-ink-500">{p.method.toUpperCase()} · {formatDate(p.paidAt)}</p>
                    </div>
                  </div>
                  <span className="rounded-full bg-success-50 px-2.5 py-0.5 text-xs font-semibold text-success-700 ring-1 ring-inset ring-success-100">Lunas</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>

      <Modal open={!!receipt} onClose={reset} title="Transaksi Berhasil">
        {receipt && (
          <div>
            <div className="mb-4 flex flex-col items-center text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success-50 text-success-600"><Icon name="check" size={28} /></span>
              <h3 className="font-display mt-3 font-bold text-ink-900">Pembayaran {method.toUpperCase()} diterima</h3>
              <p className="text-sm text-ink-500">{business.name}</p>
            </div>
            <div className="space-y-1.5 border-t border-dashed border-ink-200 pt-4">
              {receipt.map((i) => (
                <div key={i.id} className="flex justify-between text-sm text-ink-700">
                  <span>{i.name} × {i.qty}</span>
                  <span className="font-semibold">{formatRupiah(i.unitPrice * i.qty)}</span>
                </div>
              ))}
            </div>
            <div className="mt-3 space-y-1 border-t border-ink-100 pt-3 text-sm">
              <div className="flex justify-between text-ink-500"><span>Subtotal</span><span>{formatRupiah(subtotal)}</span></div>
              <div className="flex justify-between text-ink-500"><span>Diskon</span><span>−{formatRupiah(discountValue)}</span></div>
              <div className="flex justify-between text-ink-500"><span>Pajak</span><span>{formatRupiah(tax)}</span></div>
              <div className="flex justify-between pt-1 text-base font-bold text-ink-900"><span>Total</span><span className="text-brand-600">{formatRupiah(total)}</span></div>
            </div>
            <button className="btn-primary mt-6 w-full" onClick={reset}>Transaksi Baru</button>
          </div>
        )}
      </Modal>
    </>
  );
}
