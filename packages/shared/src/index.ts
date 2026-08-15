export type BusinessType = 'barbershop' | 'car_wash';

export type BusinessStatus = 'active' | 'suspended' | 'trial';

export interface Business {
  id: string;
  name: string;
  type: BusinessType;
  slug: string;
  status: BusinessStatus;
  ownerId: string;
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

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };