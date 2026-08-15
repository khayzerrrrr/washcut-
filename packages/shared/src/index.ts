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
  price: number;
  durationMin: number;
  active: boolean;
}

export interface Booking {
  id: string;
  businessId: string;
  customerName: string;
  serviceId: string;
  startsAt: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export type ApiResponse<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };