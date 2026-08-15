import { useState } from 'react';
import { Section, SectionHeader } from './shared';
import { Icon } from '../ui/Icon';

const faqs = [
  ['Bisa mengelola barbershop dan car wash sekaligus?', 'Ya. WASHCUT dirancang untuk kedua vertikal. Modul yang tidak relevan untuk bisnis Anda otomatis disembunyikan, jadi setiap orang hanya melihat apa yang dibutuhkan.'],
  ['Apakah mendukung multi cabang?', 'Tentu. Data tiap cabang tetap terpisah, tapi Anda melihat semuanya dalam satu dashboard dan bisa membandingkan performa antar lokasi.'],
  ['Bagaimana perhitungan komisi staff?', 'Komisi dihitung otomatis dari setiap layanan yang selesai, sesuai aturan yang Anda atur. Tidak perlu hitung manual.'],
  ['Pelanggan bisa booking online sendiri?', 'Bisa. Pelanggan memilih layanan, staf, dan waktu. Slot yang bentrok otomatis dicegah.'],
  ['Bagaimana sistem antrian bekerja?', 'Setiap pelanggan punya status jelas — menunggu, dalam layanan, selesai, atau dibatalkan — yang bisa di-update sekali klik.'],
  ['Apakah tersedia manajemen inventori?', 'Ya. Pantau stok, pembelian, supplier, dan dapatkan notifikasi saat stok menipis.'],
  ['Bagaimana laporan pendapatan?', 'Pendapatan, profit, layanan terlaris, dan performa staff tersedia otomatis. Tidak perlu rekap manual tiap malam.'],
  ['Bisa diakses dari ponsel?', 'Bisa. Semua fitur inti tersedia di ponsel, sehingga Anda tetap memantau bisnis saat di luar lokasi.'],
  ['Berapa lama waktu setup?', 'Hanya hitungan menit. Buat akun, pilih jenis bisnis, tambahkan layanan dan staf — Anda siap berjalan.'],
] as const;

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <Section id="faq">
      <SectionHeader
        kicker="FAQ"
        title={
          <>
            Pertanyaan yang <span className="text-brand-600">sering ditanyakan</span>
          </>
        }
      />

      <div className="mx-auto mt-12 max-w-3xl space-y-3">
        {faqs.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <div key={q} className={`card overflow-hidden ${isOpen ? 'ring-1 ring-brand-200' : ''}`}>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                aria-expanded={isOpen}
                onClick={() => setOpen(isOpen ? null : i)}
              >
                <span className="font-semibold text-ink-900">{q}</span>
                <Icon
                  name="chevronDown"
                  size={18}
                  className={`shrink-0 text-ink-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="border-t border-ink-100 px-5 py-4 text-sm leading-relaxed text-ink-600">
                  {a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Section>
  );
}
