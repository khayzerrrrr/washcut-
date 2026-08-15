import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { Business, InventoryItem, InventoryMovement } from '@washcut/shared';
import { api, formatDate, formatRupiah } from '../lib/api';
import { Card, EmptyState, PageHeader, StatCard, TableSkeleton } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Icon } from '../components/ui/Icon';
import { Field, Modal } from '../components/ui/Modal';

type StockStatus = 'aman' | 'menipis' | 'habis';

function stockStatus(item: InventoryItem): StockStatus {
  if (item.stock === 0) return 'habis';
  if (item.stock <= item.threshold) return 'menipis';
  return 'aman';
}

const statusBadge: Record<StockStatus, { tone: 'green' | 'amber' | 'red'; label: string }> = {
  aman: { tone: 'green', label: 'Stok Aman' },
  menipis: { tone: 'amber', label: 'Stok Menipis' },
  habis: { tone: 'red', label: 'Habis' },
};

const emptyCreate = { name: '', category: '', buyPrice: '', sellPrice: '', supplier: '', threshold: '', stock: '' };

export function Inventory() {
  const { business } = useOutletContext<{ business: Business }>();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState(emptyCreate);
  const [adjust, setAdjust] = useState<{ item: InventoryItem; type: 'in' | 'out' } | null>(null);
  const [adjustForm, setAdjustForm] = useState({ qty: '', note: '' });
  const [busy, setBusy] = useState(false);

  const refresh = () => {
    setLoading(true);
    Promise.all([
      api.listInventory(business.id).then((r) => r.ok && setItems(r.data)),
      api.listInventoryMovements(business.id).then((r) => r.ok && setMovements(r.data)),
    ])
      .catch(() => setError('Gagal memuat data inventori. Periksa koneksi server.'))
      .finally(() => setLoading(false));
  };

  useEffect(refresh, [business.id]);

  const openCreate = () => {
    setCreateForm(emptyCreate);
    setCreateOpen(true);
  };

  const submitCreate = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api.createInventoryItem(business.id, {
        name: createForm.name,
        category: createForm.category || undefined,
        buyPrice: Number(createForm.buyPrice) || 0,
        sellPrice: Number(createForm.sellPrice) || 0,
        supplier: createForm.supplier || undefined,
        threshold: Number(createForm.threshold) || 0,
        stock: Number(createForm.stock) || 0,
      });
      if (r.ok) {
        setCreateOpen(false);
        refresh();
      }
    } catch (err) {
      setError((err as { error?: { message?: string } })?.error?.message || 'Gagal menyimpan produk. Periksa koneksi server.');
    } finally {
      setBusy(false);
    }
  };

  const openAdjust = (item: InventoryItem, type: 'in' | 'out') => {
    setAdjust({ item, type });
    setAdjustForm({ qty: '', note: '' });
  };

  const submitAdjust = async (e: FormEvent) => {
    e.preventDefault();
    if (!adjust) return;
    setBusy(true);
    setError(null);
    try {
      const r = await api.adjustInventoryStock(business.id, adjust.item.id, {
        type: adjust.type,
        qty: Number(adjustForm.qty) || 0,
        note: adjustForm.note || undefined,
      });
      if (r.ok) {
        setAdjust(null);
        refresh();
      }
    } catch (err) {
      setError((err as { error?: { message?: string } })?.error?.message || 'Gagal mencatat stok. Periksa koneksi server.');
    } finally {
      setBusy(false);
    }
  };

  const lowStock = items.filter((i) => stockStatus(i) !== 'aman');
  const inventoryValue = items.reduce((s, i) => s + i.stock * i.buyPrice, 0);
  const inCount = movements.filter((m) => m.type === 'in').reduce((s, m) => s + m.qty, 0);
  const outCount = movements.filter((m) => m.type === 'out').reduce((s, m) => s + m.qty, 0);

  return (
    <>
      <PageHeader
        title="Inventori"
        subtitle={`Kelola stok dan pergerakan barang di ${business.name}`}
        action={<button className="btn-primary" onClick={openCreate}><Icon name="plus" size={16} /> Tambah Produk</button>}
      />

      {error && (
        <div className="mb-4 flex items-center justify-between rounded-xl border border-danger-200 bg-danger-50 px-4 py-3 text-sm text-danger-700">
          <span>{error}</span>
          <button className="font-semibold underline" onClick={() => setError(null)}>Tutup</button>
        </div>
      )}

      {loading ? (
        <Card className="p-0 overflow-hidden"><TableSkeleton rows={5} cols={5} /></Card>
      ) : items.length === 0 ? (
        <EmptyState title="Belum ada produk inventori" hint="Tambahkan produk untuk mulai memantau stok." />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Produk" value={String(items.length)} tone="default" hint="SKU terdaftar" />
            <StatCard label="Stok Menipis" value={String(lowStock.length)} tone="amber" hint="perlu segera restock" />
            <StatCard label="Nilai Inventori" value={formatRupiah(inventoryValue)} tone="brand" hint="berdasarkan harga beli" />
            <StatCard label="Pergerakan Stok" value={`${inCount} in / ${outCount} out`} tone="green" hint="total masuk & keluar" />
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="border-b border-ink-100 bg-ink-50 px-5 py-3">
              <h2 className="font-display text-sm font-bold text-ink-700">Daftar Produk</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px]">
                <thead>
                  <tr className="border-b border-ink-100">
                    <th className="th">Produk</th>
                    <th className="th">Kategori</th>
                    <th className="th">Stok</th>
                    <th className="th">Harga Beli</th>
                    <th className="th">Harga Jual</th>
                    <th className="th">Supplier</th>
                    <th className="th text-right">Status</th>
                    <th className="th w-32 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {items.map((i) => {
                    const st = stockStatus(i);
                    const b = statusBadge[st];
                    return (
                      <tr key={i.id} className={`hover:bg-ink-50/50 ${st === 'menipis' ? 'bg-warn-50/50' : ''}`}>
                        <td className="td font-semibold text-ink-900">{i.name}</td>
                        <td className="td">{i.category}</td>
                        <td className="td font-semibold">{i.stock}</td>
                        <td className="td">{formatRupiah(i.buyPrice)}</td>
                        <td className="td font-semibold">{formatRupiah(i.sellPrice)}</td>
                        <td className="td">{i.supplier ?? '—'}</td>
                        <td className="td text-right"><Badge tone={b.tone}>{b.label}</Badge></td>
                        <td className="td text-right">
                          <div className="inline-flex gap-1">
                            <button className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-success-600" onClick={() => openAdjust(i, 'in')} aria-label={`Catat stok masuk ${i.name}`}>
                              <Icon name="plus" size={16} />
                            </button>
                            <button className="rounded-lg p-2 text-ink-400 hover:bg-ink-100 hover:text-danger-600" onClick={() => openAdjust(i, 'out')} aria-label={`Catat stok keluar ${i.name}`}>
                              <Icon name="arrowRight" size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <div className="border-b border-ink-100 bg-ink-50 px-5 py-3">
              <h2 className="font-display text-sm font-bold text-ink-700">Riwayat Pergerakan Stok</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr className="border-b border-ink-100">
                    <th className="th">Tanggal</th>
                    <th className="th">Produk</th>
                    <th className="th">Jenis</th>
                    <th className="th">Jumlah</th>
                    <th className="th">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {movements.map((m) => (
                    <tr key={m.id} className="hover:bg-ink-50/50">
                      <td className="td whitespace-nowrap">{formatDate(m.date)}</td>
                      <td className="td font-semibold text-ink-900">{m.productName}</td>
                      <td className="td">
                        {m.type === 'in' ? (
                          <span className="inline-flex items-center gap-1 text-success-600"><Icon name="plus" size={14} /> Masuk</span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-danger-600"><Icon name="arrowRight" size={14} /> Keluar</span>
                        )}
                      </td>
                      <td className="td font-semibold">{m.type === 'in' ? '+' : '-'}{m.qty}</td>
                      <td className="td text-ink-500">{m.note ?? '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Tambah Produk">
        <form onSubmit={submitCreate} className="space-y-4">
          <Field label="Nama Produk">
            <input className="input" required value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="cth: Pomade Kuat" />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Kategori">
              <input className="input" value={createForm.category} onChange={(e) => setCreateForm({ ...createForm, category: e.target.value })} placeholder="Haircare, Detailing..." />
            </Field>
            <Field label="Supplier">
              <input className="input" value={createForm.supplier} onChange={(e) => setCreateForm({ ...createForm, supplier: e.target.value })} placeholder="cth: PT Gaya Baru" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga Beli (Rp)">
              <input className="input" type="number" min={0} required value={createForm.buyPrice} onChange={(e) => setCreateForm({ ...createForm, buyPrice: e.target.value })} placeholder="25000" />
            </Field>
            <Field label="Harga Jual (Rp)">
              <input className="input" type="number" min={0} required value={createForm.sellPrice} onChange={(e) => setCreateForm({ ...createForm, sellPrice: e.target.value })} placeholder="45000" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Stok Awal">
              <input className="input" type="number" min={0} value={createForm.stock} onChange={(e) => setCreateForm({ ...createForm, stock: e.target.value })} placeholder="0" />
            </Field>
            <Field label="Batas Stok Menipis">
              <input className="input" type="number" min={0} value={createForm.threshold} onChange={(e) => setCreateForm({ ...createForm, threshold: e.target.value })} placeholder="10" />
            </Field>
          </div>
          <button type="submit" className="btn-primary w-full" disabled={busy}>Simpan</button>
        </form>
      </Modal>

      <Modal open={!!adjust} onClose={() => setAdjust(null)} title={adjust ? `Catat Stok ${adjust.type === 'in' ? 'Masuk' : 'Keluar'} — ${adjust.item.name}` : ''}>
        <form onSubmit={submitAdjust} className="space-y-4">
          <Field label={`Jumlah (stok saat ini: ${adjust?.item.stock ?? 0})`}>
            <input className="input" type="number" min={1} required autoFocus value={adjustForm.qty} onChange={(e) => setAdjustForm({ ...adjustForm, qty: e.target.value })} placeholder="1" />
          </Field>
          <Field label="Catatan">
            <input className="input" value={adjustForm.note} onChange={(e) => setAdjustForm({ ...adjustForm, note: e.target.value })} placeholder={adjust?.type === 'in' ? 'cth: Restock PO-102' : 'cth: Pemakaian layanan'} />
          </Field>
          <button type="submit" className="btn-primary w-full" disabled={busy}>{adjust?.type === 'in' ? 'Tambah Stok' : 'Kurangi Stok'}</button>
        </form>
      </Modal>
    </>
  );
}
