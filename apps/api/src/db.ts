import type { ActivityLog, AppNotification, Booking, Branch, Business, Customer, Expense, InventoryItem, InventoryMovement, Member, MembershipPlan, Payment, Product, QueueItem, ServiceItem, User, Vehicle } from '@washcut/shared';
import { hashPassword } from './auth/password.js';

/** User internal API: tambahan passwordHash/salt, TIDAK dikembalikan ke client. */
export type StoredUser = User & { passwordHash: string; salt: string };

export interface DB {
  users: StoredUser[];
  businesses: Business[];
  services: ServiceItem[];
  customers: Customer[];
  vehicles: Vehicle[];
  bookings: Booking[];
  payments: Payment[];
  queue: QueueItem[];
  products: Product[];
  inventory: InventoryItem[];
  inventoryMovements: InventoryMovement[];
  membershipPlans: MembershipPlan[];
  members: Member[];
  branches: Branch[];
  expenses: Expense[];
  notifications: AppNotification[];
  activityLogs: ActivityLog[];
}

let next = { users: 5, businesses: 3, services: 9, customers: 6, vehicles: 4, bookings: 6, payments: 3, queue: 6, products: 6, inventory: 10, inventoryMovements: 14, membershipPlans: 3, members: 8, branches: 7, expenses: 4, notifications: 4, activityLogs: 4 };

const iso = (d: Date) => d.toISOString();

export const db: DB = {
  users: [
    { ...{ id: 'u1', role: 'super_admin', name: 'Super Admin', email: 'admin@washcut.id' }, ...hashPassword('admin1234') },
    { ...{ id: 'u2', role: 'owner', name: 'Raka (Owner)', email: 'owner@kings.id', businessId: 'b1' }, ...hashPassword('demo1234') },
    { ...{ id: 'u3', role: 'staff', name: 'Denny (Staff)', email: 'staff@kings.id', businessId: 'b1', position: 'capster' }, ...hashPassword('demo1234') },
    { ...{ id: 'u4', role: 'owner', name: 'Sinta (Owner)', email: 'owner@aquashine.id', businessId: 'b2' }, ...hashPassword('demo1234') },
  ],
  businesses: [
    { id: 'b1', name: 'Kings Barber & Co', type: 'barbershop', slug: 'kings-barber', status: 'active', ownerId: 'u2', commissionEnabled: false, commissionRate: 10, createdAt: iso(new Date('2026-07-01')), updatedAt: iso(new Date('2026-08-01')) },
    { id: 'b2', name: 'AquaShine Car Wash', type: 'car_wash', slug: 'aquashine', status: 'active', ownerId: 'u4', commissionEnabled: false, commissionRate: 0, createdAt: iso(new Date('2026-07-05')), updatedAt: iso(new Date('2026-08-01')) },
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
  queue: [
    { id: 'q1', businessId: 'b1', queueNo: 1, customerName: 'Rizky Pratama', serviceName: 'Potong + Cukur Jenggot', status: 'waiting' },
    { id: 'q2', businessId: 'b1', queueNo: 2, customerName: 'Andi Wijaya', serviceName: 'Potong Rambut', status: 'in-service' },
    { id: 'q3', businessId: 'b1', queueNo: 3, customerName: 'Bima Saputra', serviceName: 'Royal Treatment', status: 'waiting' },
    { id: 'q4', businessId: 'b2', queueNo: 1, customerName: 'Sinta Lestari', serviceName: 'Cuci + Interior', status: 'in-service' },
    { id: 'q5', businessId: 'b2', queueNo: 2, customerName: 'Budi Hartono', serviceName: 'Detailing Eksterior', status: 'waiting' },
  ],
  products: [
    { id: 'p1', businessId: 'b1', name: 'Pomade Kuat', category: 'Produk', price: 45000, active: true },
    { id: 'p2', businessId: 'b1', name: 'Shampo Khusus', category: 'Produk', price: 60000, active: true },
    { id: 'p3', businessId: 'b1', name: 'Masker Rambut', category: 'Produk', price: 85000, active: true },
    { id: 'p4', businessId: 'b2', name: 'Shampo Mobil', category: 'Produk', price: 35000, active: true },
    { id: 'p5', businessId: 'b2', name: 'Polesan', category: 'Produk', price: 50000, active: true },
  ],
  inventory: [
    { id: 'inv1', businessId: 'b1', name: 'Pomade Kuat', category: 'Haircare', stock: 45, buyPrice: 25000, sellPrice: 45000, supplier: 'PT Gaya Baru', threshold: 10 },
    { id: 'inv2', businessId: 'b1', name: 'Shampo Khusus', category: 'Haircare', stock: 8, buyPrice: 30000, sellPrice: 60000, supplier: 'PT Gaya Baru', threshold: 10 },
    { id: 'inv3', businessId: 'b1', name: 'Masker Rambut', category: 'Haircare', stock: 0, buyPrice: 40000, sellPrice: 85000, supplier: 'Distributor Nusantara', threshold: 5 },
    { id: 'inv4', businessId: 'b1', name: 'Sabun Cukur', category: 'Konsumsi', stock: 26, buyPrice: 12000, sellPrice: 25000, supplier: 'PT Cleancare', threshold: 8 },
    { id: 'inv5', businessId: 'b1', name: 'Minyak Jenggot', category: 'Haircare', stock: 4, buyPrice: 20000, sellPrice: 40000, supplier: 'PT Gaya Baru', threshold: 6 },
    { id: 'inv6', businessId: 'b2', name: 'Shampo Mobil', category: 'Detailing', stock: 30, buyPrice: 18000, sellPrice: 35000, supplier: 'PT Cleantime', threshold: 8 },
    { id: 'inv7', businessId: 'b2', name: 'Polesan Compound', category: 'Detailing', stock: 11, buyPrice: 26000, sellPrice: 50000, supplier: 'PT Cleantime', threshold: 10 },
    { id: 'inv8', businessId: 'b2', name: 'Coating Nano Kit', category: 'Detailing', stock: 3, buyPrice: 150000, sellPrice: 280000, supplier: 'PT NanoPro', threshold: 4 },
    { id: 'inv9', businessId: 'b2', name: 'Handuk Mikrofiber', category: 'Perlengkapan', stock: 60, buyPrice: 15000, sellPrice: 30000, supplier: 'PT Tekstilindo', threshold: 15 },
  ],
  inventoryMovements: [
    { id: 'mv1', businessId: 'b1', productId: 'inv1', productName: 'Pomade Kuat', type: 'in', qty: 20, date: '2026-08-10', note: 'Restock PO-102' },
    { id: 'mv2', businessId: 'b1', productId: 'inv2', productName: 'Shampo Khusus', type: 'out', qty: 5, date: '2026-08-11', note: 'Pemakaian layanan' },
    { id: 'mv3', businessId: 'b1', productId: 'inv3', productName: 'Masker Rambut', type: 'out', qty: 3, date: '2026-08-12', note: 'Pemakaian Royal Treatment' },
    { id: 'mv4', businessId: 'b1', productId: 'inv5', productName: 'Minyak Jenggot', type: 'out', qty: 2, date: '2026-08-13', note: 'Pemakaian layanan' },
    { id: 'mv5', businessId: 'b1', productId: 'inv1', productName: 'Pomade Kuat', type: 'out', qty: 8, date: '2026-08-14', note: 'Penjualan retail' },
    { id: 'mv6', businessId: 'b1', productId: 'inv4', productName: 'Sabun Cukur', type: 'in', qty: 24, date: '2026-08-15', note: 'Restock PO-108' },
    { id: 'mv7', businessId: 'b1', productId: 'inv2', productName: 'Shampo Khusus', type: 'out', qty: 4, date: '2026-08-16', note: 'Pemakaian layanan' },
    { id: 'mv8', businessId: 'b2', productId: 'inv6', productName: 'Shampo Mobil', type: 'in', qty: 30, date: '2026-08-11', note: 'Restock PO-201' },
    { id: 'mv9', businessId: 'b2', productId: 'inv7', productName: 'Polesan Compound', type: 'out', qty: 6, date: '2026-08-12', note: 'Pemakaian detailing' },
    { id: 'mv10', businessId: 'b2', productId: 'inv8', productName: 'Coating Nano Kit', type: 'out', qty: 1, date: '2026-08-13', note: 'Aplikasi coating' },
    { id: 'mv11', businessId: 'b2', productId: 'inv9', productName: 'Handuk Mikrofiber', type: 'in', qty: 40, date: '2026-08-14', note: 'Restock PO-205' },
    { id: 'mv12', businessId: 'b2', productId: 'inv6', productName: 'Shampo Mobil', type: 'out', qty: 5, date: '2026-08-15', note: 'Pemakaian cuci' },
    { id: 'mv13', businessId: 'b2', productId: 'inv8', productName: 'Coating Nano Kit', type: 'out', qty: 1, date: '2026-08-16', note: 'Aplikasi coating' },
  ],
  membershipPlans: [
    { id: 'mp1', businessId: 'b1', name: 'Basic', price: 50000, pointsPerSpend: 1, benefits: ['Diskon 5% semua layanan', 'Prioritas antrian', 'Poin 1x per rupiah'] },
    { id: 'mp2', businessId: 'b1', name: 'Premium', price: 120000, pointsPerSpend: 2, benefits: ['Diskon 10% semua layanan', 'Booking prioritas', 'Poin 2x per rupiah', 'Gratis 1 layanan per bulan'] },
    { id: 'mp3', businessId: 'b1', name: 'VIP', price: 250000, pointsPerSpend: 3, benefits: ['Diskon 15% semua layanan', 'Akses VVIP & event eksklusif', 'Poin 3x per rupiah', 'Gratis 2 layanan per bulan', 'Dedicated customer service'] },
    { id: 'mp4', businessId: 'b2', name: 'Basic', price: 30000, pointsPerSpend: 1, benefits: ['Diskon 5% semua layanan', 'Prioritas antrian', 'Poin 1x per rupiah'] },
    { id: 'mp5', businessId: 'b2', name: 'Premium', price: 80000, pointsPerSpend: 2, benefits: ['Diskon 10% semua layanan', 'Booking prioritas', 'Poin 2x per rupiah', 'Gratis 1 layanan per bulan'] },
    { id: 'mp6', businessId: 'b2', name: 'VIP', price: 180000, pointsPerSpend: 3, benefits: ['Diskon 15% semua layanan', 'Akses VVIP & event eksklusif', 'Poin 3x per rupiah', 'Gratis 2 layanan per bulan', 'Dedicated customer service'] },
  ],
  members: [
    { id: 'm1', businessId: 'b1', name: 'Rizky Pratama', phone: '0812-3456-7890', plan: 'Premium', status: 'active', validUntil: '2026-10-12', points: 340, spent: 1250000, joinedAt: '2026-07-10' },
    { id: 'm2', businessId: 'b1', name: 'Andi Wijaya', phone: '0813-9876-5432', plan: 'Basic', status: 'active', validUntil: '2026-09-08', points: 150, spent: 400000, joinedAt: '2026-07-15' },
    { id: 'm3', businessId: 'b1', name: 'Bima Saputra', phone: '0821-1122-3344', plan: 'VIP', status: 'active', validUntil: '2026-12-01', points: 920, spent: 3400000, joinedAt: '2026-07-20' },
    { id: 'm4', businessId: 'b1', name: 'Dimas Aryo', phone: '0856-9988-7766', plan: 'Basic', status: 'active', validUntil: '2026-08-28', points: 60, spent: 180000, joinedAt: '2026-08-01' },
    { id: 'm5', businessId: 'b1', name: 'Fajar Ramadhan', phone: '0812-7788-9900', plan: 'Premium', status: 'expired', validUntil: '2026-08-02', points: 0, spent: 700000, joinedAt: '2026-05-05' },
    { id: 'm6', businessId: 'b2', name: 'Sinta Lestari', phone: '0857-2222-1111', plan: 'VIP', status: 'active', validUntil: '2026-11-15', points: 780, spent: 2900000, joinedAt: '2026-07-12' },
    { id: 'm7', businessId: 'b2', name: 'Budi Hartono', phone: '0811-4444-5555', plan: 'Basic', status: 'active', validUntil: '2026-09-20', points: 95, spent: 350000, joinedAt: '2026-07-18' },
    { id: 'm8', businessId: 'b2', name: 'Rina Marlina', phone: '0822-3333-4444', plan: 'Premium', status: 'expired', validUntil: '2026-07-30', points: 120, spent: 850000, joinedAt: '2026-04-20' },
  ],
  branches: [
    { id: 'br1', businessId: 'b1', name: 'Kings Barber Medan', city: 'Medan', staff: 3, customers: 120, appointments: 45, revenue: 8500000, performance: 88 },
    { id: 'br2', businessId: 'b1', name: 'Kings Barber Jakarta', city: 'Jakarta', staff: 5, customers: 210, appointments: 78, revenue: 14200000, performance: 95 },
    { id: 'br3', businessId: 'b1', name: 'Kings Barber Surabaya', city: 'Surabaya', staff: 2, customers: 60, appointments: 22, revenue: 4200000, performance: 72 },
    { id: 'br4', businessId: 'b2', name: 'AquaShine Medan', city: 'Medan', staff: 4, customers: 150, appointments: 60, revenue: 9800000, performance: 90 },
    { id: 'br5', businessId: 'b2', name: 'AquaShine Bandung', city: 'Bandung', staff: 3, customers: 90, appointments: 35, revenue: 6200000, performance: 80 },
    { id: 'br6', businessId: 'b2', name: 'AquaShine Jakarta', city: 'Jakarta', staff: 6, customers: 260, appointments: 100, revenue: 16800000, performance: 93 },
  ],
  expenses: [
    { id: 'e1', businessId: 'b1', description: 'Beli pomade & gel rambut', amount: 450000, category: 'Perlengkapan', date: '2026-08-14', createdAt: iso(new Date('2026-08-14T09:00:00Z')) },
    { id: 'e2', businessId: 'b1', description: 'Listrik & air bulanan', amount: 1200000, category: 'Operasional', date: '2026-08-15', createdAt: iso(new Date('2026-08-15T10:00:00Z')) },
    { id: 'e3', businessId: 'b2', description: 'Pembelian shampo mobil', amount: 700000, category: 'Perlengkapan', date: '2026-08-13', createdAt: iso(new Date('2026-08-13T08:00:00Z')) },
  ],
  notifications: [
    { id: 'n1', businessId: 'b1', title: 'Stok menipis: Shampo Khusus', message: 'Sisa stok tinggal 8 unit, di bawah ambang batas 10.', read: false, createdAt: iso(new Date('2026-08-16T07:30:00Z')) },
    { id: 'n2', businessId: 'b1', title: '3 janji menunggu konfirmasi', message: 'Ada 3 janji temu yang masih menunggu konfirmasi hari ini.', read: false, createdAt: iso(new Date('2026-08-16T08:00:00Z')) },
    { id: 'n3', businessId: 'b2', title: 'Booking baru', message: 'Budi Hartono memesan Detailing Eksterior.', read: false, createdAt: iso(new Date('2026-08-16T08:30:00Z')) },
  ],
  activityLogs: [
    { id: 'al1', businessId: 'b1', userId: 'u2', action: 'memperbarui logo tenant', entity: 'Kings Barber & Co', createdAt: iso(new Date('2026-08-15T11:20:00Z')) },
    { id: 'al2', businessId: 'b1', userId: 'u3', action: 'menyelesaikan booking', entity: 'Royal Treatment', createdAt: iso(new Date('2026-08-16T09:00:00Z')) },
    { id: 'al3', businessId: 'b2', userId: 'u4', action: 'membuat booking baru', entity: 'Detailing Eksterior', createdAt: iso(new Date('2026-08-16T08:30:00Z')) },
  ],
};

export function scoped<T extends { businessId: string }>(rows: T[], businessId: string): T[] {
  return rows.filter((r) => r.businessId === businessId);
}

export function nextId(kind: keyof typeof next): string {
  const id = String(next[kind]++);
  const prefix = { users: 'u', businesses: 'b', services: 's', customers: 'c', vehicles: 'v', bookings: 'bk', payments: 'p', queue: 'q', products: 'p', inventory: 'inv', inventoryMovements: 'mv', membershipPlans: 'mp', members: 'm', branches: 'br', expenses: 'e', notifications: 'n', activityLogs: 'al' }[kind];
  return `${prefix}${id}`;
}