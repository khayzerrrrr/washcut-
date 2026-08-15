export type BusinessType = 'barbershop' | 'car_wash';

export type Role = 'super_admin' | 'owner' | 'admin' | 'staff' | 'customer';

export type StaffPosition = 'capster' | 'washer';

export type BusinessStatus = 'active' | 'suspended' | 'trial';

export interface User {
  id: string;
  role: Role;
  name: string;
  email: string;
  /** null untuk super_admin (bukan anggota tenant) */
  businessId?: string;
  /** posisi hanya bermakna untuk role staff (capster/washer) */
  position?: StaffPosition;
}

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  slug: string;
  status: BusinessStatus;
  ownerId: string;
  /** URL/data-URL logo tenant. Fallback ke logo platform (logo.png). */
  logo?: string;
  /** aktif/tidaknya skema komisi staff untuk tenant ini */
  commissionEnabled?: boolean;
  /** persentase komisi staff (0-100), default 0 */
  commissionRate?: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceItem {
  id: string;
  businessId: string;
  name: string;
  category?: string;
  price: number;
  durationMin: number;
  active: boolean;
  /** terisi saat layanan di-soft-delete */
  deletedAt?: string;
}

export interface Product {
  id: string;
  businessId: string;
  name: string;
  category?: string;
  price: number;
  active: boolean;
  deletedAt?: string;
}

export interface InventoryItem {
  id: string;
  businessId: string;
  name: string;
  category?: string;
  stock: number;
  buyPrice: number;
  sellPrice: number;
  supplier?: string;
  threshold: number;
}

export interface InventoryMovement {
  id: string;
  businessId: string;
  productId: string;
  productName: string;
  type: 'in' | 'out';
  qty: number;
  date: string;
  note?: string;
}

export interface Customer {
  id: string;
  businessId: string;
  name: string;
  phone?: string;
  email?: string;
  notes?: string;
  createdAt: string;
}

export interface Vehicle {
  id: string;
  businessId: string;
  customerId: string;
  plateNumber: string;
  brand?: string;
  model?: string;
  vehicleClass?: string;
  color?: string;
}

export interface HairProfile {
  id: string;
  businessId: string;
  customerId: string;
  hairType?: string;
  styleNotes?: string;
  lastStyle?: string;
}

export interface Payment {
  id: string;
  businessId: string;
  bookingId?: string;
  customerId?: string;
  amount: number;
  method: 'cash' | 'qris' | 'transfer' | 'card';
  status: 'paid' | 'partial' | 'refunded';
  paidAt: string;
}

export type QueueStatus = 'waiting' | 'in-service' | 'completed' | 'cancelled';

export interface QueueItem {
  id: string;
  businessId: string;
  queueNo: number;
  customerName: string;
  serviceName: string;
  status: QueueStatus;
}

export interface Booking {
  id: string;
  businessId: string;
  customerId: string;
  customerName: string;
  serviceId: string;
  serviceName: string;
  staffId?: string;
  staffName?: string;
  vehicleId?: string;
  vehiclePlate?: string;
  startsAt: string;
  endsAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  walkIn?: boolean;
  notes?: string;
  amount: number;
}

export type MembershipPlanName = 'Basic' | 'Premium' | 'VIP';

export interface MembershipPlan {
  id: string;
  businessId: string;
  name: MembershipPlanName;
  price: number;
  pointsPerSpend: number;
  benefits: string[];
}

export interface Member {
  id: string;
  businessId: string;
  name: string;
  phone?: string;
  plan: string;
  status: 'active' | 'expired';
  validUntil: string;
  points: number;
  spent: number;
  joinedAt: string;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export interface Branch {
  id: string;
  businessId: string;
  name: string;
  city: string;
  staff: number;
  customers: number;
  appointments: number;
  revenue: number;
  performance: number;
}

export interface Expense {
  id: string;
  businessId: string;
  description: string;
  amount: number;
  category?: string;
  date: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  businessId: string;
  title: string;
  message?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  businessId: string;
  userId?: string;
  action: string;
  entity?: string;
  createdAt: string;
}

export type ReportPeriod = 'today' | '7d' | '30d';

export interface ReportSummary {
  revenue: number;
  transactions: number;
  customers: number;
  avgTransaction: number;
  commission: number;
  profit: number;
  revenueByDay: { day: string; revenue: number }[];
  topServices: { name: string; count: number; revenue: number }[];
  staffPerformance: { name: string; revenue: number; servicesCompleted: number }[];
}