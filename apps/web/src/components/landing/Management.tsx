import { Section, SectionHeader, FeatureTile } from './shared';

const barbershop = [
  ['calendar', 'Booking online', 'Pelanggan pilih waktu dan barber favorit mereka sendiri.'],
  ['clock', 'Kalender & antrian', 'Lihat jadwal hari ini dan antrean yang berjalan jelas.'],
  ['scissors', 'Jadwal barber', 'Atur shift dan slot per barber tanpa bentrok.'],
  ['users', 'Performa staff', 'Pendapatan dan layanan selesai per barber.'],
  ['tag', 'Database pelanggan', 'Profil, kunjungan, dan layanan favorit terpusat.'],
  ['note', 'Layanan & harga', 'Kelola daftar layanan dan harga sekali klik.'],
  ['gift', 'Membership & loyalitas', 'Program member dan poin untuk pelanggan setia.'],
  ['wallet', 'Pembayaran', 'Checkout cepat dari kursi barber.'],
  ['cash', 'Penjualan harian', 'Rekap pendapatan tiap shift tanpa hitung manual.'],
  ['chart', 'Laporan', 'Data penjualan siap untuk keputusan bulan depan.'],
] as const;

export function BarbershopManagement() {
  return (
    <Section id="barbershop">
      <SectionHeader
        kicker="Barbershop"
        title={
          <>
            Barbershop Anda, <span className="text-brand-600">sepenuhnya terkendali</span>
          </>
        }
        subtitle="Booking, kursi, dan kasir terhubung dalam satu alur. Pelanggan tahu persis kapan giliran mereka."
        center={false}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {barbershop.map(([icon, title, desc]) => (
          <FeatureTile key={title} icon={icon} title={title} desc={desc} tone="brand" />
        ))}
      </div>
    </Section>
  );
}

const carwash = [
  ['clock', 'Antrian kendaraan', 'Urutan masuk–keluar terkelola, tidak ada yang lompat.'],
  ['building', 'Service bay', 'Status tiap bay: kosong, isi, atau selesai.'],
  ['car', 'Registrasi kendaraan', 'Data plat dan riwayat tiap kendaraan tersimpan.'],
  ['tag', 'Paket layanan', 'Cuci standar, premium, atau grooming dalam satu daftar.'],
  ['users', 'Penugasan staff', 'Tugaskan staf ke kendaraan dan bay.'],
  ['zap', 'Status layanan', 'Update proses cuci secara real-time.'],
  ['wallet', 'Pembayaran', 'Kasir cepat di titik check-out.'],
  ['repeat', 'Riwayat pelanggan', 'Catat kendaraan dan layanan terakhir.'],
  ['cash', 'Pendapatan harian', 'Rekap harian dari setiap bay dan staf.'],
  ['chart', 'Laporan operasional', 'Lihat volume, waktu siklus, dan kapasitas.'],
] as const;

export function CarwashManagement() {
  return (
    <Section id="carwash">
      <SectionHeader
        kicker="Car wash"
        title={
          <>
            Dari antrian sampai <span className="text-cyan-600">mobil bersih</span>
          </>
        }
        subtitle="Alur cuci yang rapi dari kendaraan masuk sampai pembayaran. Semua staf tahu status terkini."
        center={false}
      />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {carwash.map(([icon, title, desc]) => (
          <FeatureTile key={title} icon={icon} title={title} desc={desc} tone="cyan" />
        ))}
      </div>
    </Section>
  );
}
