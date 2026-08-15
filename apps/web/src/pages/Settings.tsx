import { useEffect, useRef, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import type { ActivityLog, Business } from '@washcut/shared';
import { api, formatDate } from '../lib/api';
import { Card, EmptyState, PageHeader, Skeleton } from '../components/ui/Card';
import { Logo } from '../components/ui/Logo';
import { Icon } from '../components/ui/Icon';

interface SettingsContext {
  business: Business;
  updateBusiness: (b: Business) => void;
}

export function Settings() {
  const { business, updateBusiness } = useOutletContext<SettingsContext>();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(business.logo);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.listActivityLogs(business.id)
      .then((r) => {
        if (active && r.ok) setLogs(r.data);
      })
      .finally(() => active && setLogsLoading(false));
    return () => {
      active = false;
    };
  }, [business.id]);

  const onFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    if (file.size > 500_000) {
      alert('Ukuran logo maksimal 500KB. Pilih gambar yang lebih kecil.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(String(reader.result));
      setSaved(false);
    };
    reader.readAsDataURL(file);
  };

  const save = async () => {
    if (preview === business.logo) return;
    setBusy(true);
    const r = await api.updateBusinessLogo(business.id, preview || '');
    setBusy(false);
    if (r.ok) {
      updateBusiness(r.data);
      setSaved(true);
    }
  };

  return (
    <>
      <PageHeader title="Pengaturan" subtitle={`Kelola identitas ${business.name}`} />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <h2 className="font-display text-lg font-bold text-ink-900">Logo Tenant</h2>
          <p className="mt-1 text-sm text-ink-500">
            Logo ini dipakai di dashboard bisnis Anda. Jika tidak diisi, akan memakai logo platform WashCut.
          </p>

          <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl border border-ink-200 bg-ink-50">
              <Logo src={preview} sizeClass="h-16 w-auto" alt={business.name} />
            </div>
            <div className="flex flex-wrap gap-2">
              <button type="button" className="btn-primary" onClick={() => fileRef.current?.click()}>
                <Icon name="upload" size={16} /> Pilih Gambar
              </button>
              {business.logo && (
                <button
                  type="button"
                  className="btn-outline"
                  onClick={() => {
                    setPreview(undefined);
                    setSaved(false);
                  }}
                >
                  Hapus Logo
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
              />
            </div>
          </div>

          <p className="mt-4 text-xs text-ink-500">
            Disarankan PNG transparan. Maks 500KB. Logo otomatis ditampilkan sebagai gambar tanpa teks nama.
          </p>

          <button
            type="button"
            className="btn-primary mt-6"
            onClick={save}
            disabled={busy || preview === business.logo}
          >
            {busy ? <><span className="btn-spinner" /> Menyimpan...</> : 'Simpan Logo'}
          </button>
          {saved && (
            <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-success-600">
              <Icon name="check" size={15} /> Logo berhasil disimpan.
            </p>
          )}
        </Card>

        <Card className="p-6">
          <h3 className="text-xs font-bold text-ink-500 uppercase tracking-wide">Info Tenant</h3>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Nama</dt>
              <dd className="font-semibold text-ink-900">{business.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Slug</dt>
              <dd className="text-ink-900">/{business.slug}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Jenis</dt>
              <dd className="text-ink-900">{business.type === 'barbershop' ? 'Barbershop' : 'Car Wash'}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <Card className="mt-6 p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Aktivitas Terakhir</h2>
        <p className="mt-1 text-sm text-ink-500">Aktivitas terbaru dalam bisnis ini.</p>
        {logsLoading ? (
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
          </div>
        ) : logs.length === 0 ? (
          <div className="mt-4">
            <EmptyState title="Belum ada aktivitas" hint="Aktivitas terbaru akan muncul di sini." />
          </div>
        ) : (
          <ul className="mt-4 divide-y divide-ink-100">
            {logs.slice(0, 10).map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink-900">{l.action}</p>
                  {l.entity && <p className="truncate text-xs text-ink-500">{l.entity}</p>}
                </div>
                <span className="shrink-0 text-xs text-ink-400">{formatDate(l.createdAt)}</span>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}