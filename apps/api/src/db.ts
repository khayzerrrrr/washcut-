import type { Booking, Business, Customer, Payment, ServiceItem, User, Vehicle } from '@washcut/shared';

export interface DB {
  users: User[];
  businesses: Business[];
  services: ServiceItem[];
  customers: Customer[];
  vehicles: Vehicle[];
  bookings: Booking[];
  payments: Payment[];
}

let next = { users: 3, businesses: 3, services: 9, customers: 6, vehicles: 4, bookings: 6, payments: 3 };

const iso = (d: Date) => d.toISOString();

export const db: DB = {
  users: [
    { id: 'u1', role: 'super_admin', name: 'Super Admin', email: 'admin@washcut.id' },
    { id: 'u2', role: 'owner', name: 'Raka (Owner)', email: 'owner@kings.id', businessId: 'b1' },
    { id: 'u3', role: 'staff', name: 'Denny (Staff)', email: 'staff@kings.id', businessId: 'b1' },
    { id: 'u4', role: 'owner', name: 'Sinta (Owner)', email: 'owner@aquashine.id', businessId: 'b2' },
  ],
  businesses: [
    { id: 'b1', name: 'Kings Barber & Co', type: 'barbershop', slug: 'kings-barber', status: 'active', ownerId: 'u2', createdAt: iso(new Date('2026-07-01')), updatedAt: iso(new Date('2026-08-01')) },
    { id: 'b2', name: 'AquaShine Car Wash', type: 'car_wash', slug: 'aquashine', status: 'active', ownerId: 'u4', createdAt: iso(new Date('2026-07-05')), updatedAt: iso(new Date('2026-08-01')) },
  ],
  services: [
    { id: 's1', businessId: 'b1', name: 'Potong Rambut', category: 'Potong', price: 50000, durationMin: 30, active: true },
    { id: 's2', businessId: 'b1', name: 'Potong + Cukur Jenggot', category: 'Potong', price: 75000, durationMin: 45, active: true },
    { id: 's3', businessId: 'b1', name: 'Royal Treatment', category: 'Perawatan', price: 120000, durationMin: 60, active: true },
    { id: 's4', businessId: 'b2', name: 'Cuci Kapsul', category: 'Cuci', price: 25000, durationMin: 15, active: true },
    { id: 's5', businessId: 'b2', name: 'Cuci + Interior', category: 'Cuci', price: 50000, durationMin: 40, active: true },
    { id: 's6', businessId: 'b2', name: 'Detailing Eksterior', category: 'Detailing', price: 250000, durationMin: 120, active: true },
  ],
  customers: [
    { id: 'c1', businessId: 'b1', name: 'Rizky Pratama', phone: '0812-3456-7890', createdAt: iso(new Date('2026-07-10')) },
    { id: 'c2', businessId: 'b1', name: 'Andi Wijaya', phone: '0813-9876-5432', createdAt: iso(new Date('2026-07-15')) },
    { id: 'c3', businessId: 'b2', name: 'Sinta Lestari', phone: '0857-2222-1111', createdAt: iso(new Date('2026-07-12')) },
    { id: 'c4', businessId: 'b2', name: 'Budi Hartono', phone: '0811-4444-5555', createdAt: iso(new Date('2026-07-18')) },
  ],
  vehicles: [
    { id: 'v1', businessId: 'b2', customerId: 'c3', plateNumber: 'B 1234 ABC', brand: 'Toyota', model: 'Avanza', vehicleClass: 'MPV', color: 'Silver' },
    { id: 'v2', businessId: 'b2', customerId: 'c4', plateNumber: 'B 9012 GHI', brand: 'Mitsubishi', model: 'Pajero Sport', vehicleClass: 'SUV', color: 'Putih' },
  ],
  bookings: [
    { id: 'bk1', businessId: 'b1', customerId: 'c1', customerName: 'Rizky Pratama', serviceId: 's2', serviceName: 'Potong + Cukur Jenggot', staffId: 'u3', staffName: 'Denny', startsAt: iso(new Date('2026-08-16T09:00:00Z')), endsAt: iso(new Date('2026-08-16T09:45:00Z')), status: 'confirmed', amount: 75000 },
    { id: 'bk2', businessId: 'b1', customerId: 'c2', customerName: 'Andi Wijaya', serviceId: 's1', serviceName: 'Potong Rambut', startsAt: iso(new Date('2026-08-16T10:00:00Z')), endsAt: iso(new Date('2026-08-16T10:30:00Z')), status: 'pending', amount: 50000 },
    { id: 'bk3', businessId: 'b2', customerId: 'c3', customerName: 'Sinta Lestari', serviceId: 's5', serviceName: 'Cuci + Interior', vehicleId: 'v1', vehiclePlate: 'B 1234 ABC', startsAt: iso(new Date('2026-08-16T09:00:00Z')), endsAt: iso(new Date('2026-08-16T09:40:00Z')), status: 'confirmed', amount: 50000 },
    { id: 'bk4', businessId: 'b2', customerId: 'c4', customerName: 'Budi Hartono', serviceId: 's6', serviceName: 'Detailing Eksterior', vehicleId: 'v2', vehiclePlate: 'B 9012 GHI', startsAt: iso(new Date('2026-08-16T11:00:00Z')), endsAt: iso(new Date('2026-08-16T13:00:00Z')), status: 'pending', amount: 250000 },
  ],
  payments: [
    { id: 'p1', businessId: 'b1', bookingId: 'bk2', amount: 50000, method: 'cash', status: 'paid', paidAt: iso(new Date('2026-08-16T10:30:00Z')) },
  ],
};

export function scoped<T extends { businessId: string }>(rows: T[], businessId: string): T[] {
  return rows.filter((r) => r.businessId === businessId);
}

export function nextId(kind: keyof typeof next): string {
  const id = String(next[kind]++);
  const prefix = { users: 'u', businesses: 'b', services: 's', customers: 'c', vehicles: 'v', bookings: 'bk', payments: 'p' }[kind];
  return `${prefix}${id}`;
}