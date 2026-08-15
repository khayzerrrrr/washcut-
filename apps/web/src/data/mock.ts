import type { Booking, Business, Customer, Payment, ServiceItem, Vehicle } from '@washcut/shared';

export const businesses: Business[] = [
  {
    id: 'b1',
    name: 'Kings Barber & Co',
    type: 'barbershop',
    slug: 'kings-barber',
    status: 'active',
    ownerId: 'u1',
    createdAt: '2026-07-01T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
  },
  {
    id: 'b2',
    name: 'AquaShine Car Wash',
    type: 'car_wash',
    slug: 'aquashine',
    status: 'active',
    ownerId: 'u1',
    createdAt: '2026-07-05T08:00:00Z',
    updatedAt: '2026-08-01T08:00:00Z',
  },
];

export const services: ServiceItem[] = [
  // Barbershop
  { id: 's1', businessId: 'b1', name: 'Potong Rambut', category: 'Potong', price: 50000, durationMin: 30, active: true },
  { id: 's2', businessId: 'b1', name: 'Potong + Cukur Jenggot', category: 'Potong', price: 75000, durationMin: 45, active: true },
  { id: 's3', businessId: 'b1', name: 'Styling & Hair Tattoo', category: 'Styling', price: 65000, durationMin: 40, active: true },
  { id: 's4', businessId: 'b1', name: 'Royal Treatment (Keramas+Masker)', category: 'Perawatan', price: 120000, durationMin: 60, active: true },
  // Car Wash
  { id: 's5', businessId: 'b2', name: 'Cuci Kapsul', category: 'Cuci', price: 25000, durationMin: 15, active: true },
  { id: 's6', businessId: 'b2', name: 'Cuci + Interior', category: 'Cuci', price: 50000, durationMin: 40, active: true },
  { id: 's7', businessId: 'b2', name: 'Detailing Eksterior', category: 'Detailing', price: 250000, durationMin: 120, active: true },
  { id: 's8', businessId: 'b2', name: 'Coating Nano 6 Bulan', category: 'Coating', price: 950000, durationMin: 240, active: true },
];

export const customers: Customer[] = [
  { id: 'c1', businessId: 'b1', name: 'Rizky Pratama', phone: '0812-3456-7890', createdAt: '2026-07-10T08:00:00Z' },
  { id: 'c2', businessId: 'b1', name: 'Andi Wijaya', phone: '0813-9876-5432', createdAt: '2026-07-15T08:00:00Z' },
  { id: 'c3', businessId: 'b1', name: 'Bima Saputra', phone: '0821-1122-3344', createdAt: '2026-07-20T08:00:00Z' },
  { id: 'c4', businessId: 'b2', name: 'Sinta Lestari', phone: '0857-2222-1111', createdAt: '2026-07-12T08:00:00Z' },
  { id: 'c5', businessId: 'b2', name: 'Budi Hartono', phone: '0811-4444-5555', createdAt: '2026-07-18T08:00:00Z' },
];

export const vehicles: Vehicle[] = [
  { id: 'v1', businessId: 'b2', customerId: 'c4', plateNumber: 'B 1234 ABC', brand: 'Toyota', model: 'Avanza', vehicleClass: 'MPV', color: 'Silver' },
  { id: 'v2', businessId: 'b2', customerId: 'c4', plateNumber: 'B 5678 DEF', brand: 'Honda', model: 'Beat', vehicleClass: 'Motor', color: 'Hitam' },
  { id: 'v3', businessId: 'b2', customerId: 'c5', plateNumber: 'B 9012 GHI', brand: 'Mitsubishi', model: 'Pajero Sport', vehicleClass: 'SUV', color: 'Putih' },
];

export const bookings: Booking[] = [
  {
    id: 'bk1', businessId: 'b1', customerId: 'c1', customerName: 'Rizky Pratama',
    serviceId: 's2', serviceName: 'Potong + Cukur Jenggot', staffId: 'st1', staffName: 'Raka',
    startsAt: '2026-08-16T09:00:00Z', endsAt: '2026-08-16T09:45:00Z',
    status: 'confirmed', amount: 75000,
  },
  {
    id: 'bk2', businessId: 'b1', customerId: 'c2', customerName: 'Andi Wijaya',
    serviceId: 's1', serviceName: 'Potong Rambut', staffId: 'st2', staffName: 'Denny',
    startsAt: '2026-08-16T10:00:00Z', endsAt: '2026-08-16T10:30:00Z',
    status: 'pending', amount: 50000,
  },
  {
    id: 'bk3', businessId: 'b1', customerId: 'c3', customerName: 'Bima Saputra',
    serviceId: 's4', serviceName: 'Royal Treatment', staffId: 'st1', staffName: 'Raka',
    startsAt: '2026-08-16T13:00:00Z', endsAt: '2026-08-16T14:00:00Z',
    status: 'completed', amount: 120000, notes: 'Pakai produk lavender',
  },
  {
    id: 'bk4', businessId: 'b2', customerId: 'c4', customerName: 'Sinta Lestari',
    serviceId: 's6', serviceName: 'Cuci + Interior', vehicleId: 'v1', vehiclePlate: 'B 1234 ABC',
    startsAt: '2026-08-16T09:00:00Z', endsAt: '2026-08-16T09:40:00Z',
    status: 'confirmed', amount: 50000,
  },
  {
    id: 'bk5', businessId: 'b2', customerId: 'c5', customerName: 'Budi Hartono',
    serviceId: 's7', serviceName: 'Detailing Eksterior', vehicleId: 'v3', vehiclePlate: 'B 9012 GHI',
    startsAt: '2026-08-16T11:00:00Z', endsAt: '2026-08-16T13:00:00Z',
    status: 'pending', amount: 250000,
  },
];

export const payments: Payment[] = [
  { id: 'p1', businessId: 'b1', bookingId: 'bk3', customerId: 'c3', amount: 120000, method: 'qris', status: 'paid', paidAt: '2026-08-16T14:00:00Z' },
  { id: 'p2', businessId: 'b2', bookingId: 'bk4', customerId: 'c4', amount: 50000, method: 'cash', status: 'paid', paidAt: '2026-08-16T09:40:00Z' },
];