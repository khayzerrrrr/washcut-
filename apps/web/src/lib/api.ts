import type { ApiResponse, Booking, Business, Customer, Payment, ServiceItem, Vehicle } from '@washcut/shared';
import * as mock from '../data/mock';

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

function ok<T>(data: T): ApiResponse<T> {
  return { ok: true, data };
}

function fail(code: string, message: string): never {
  throw { ok: false, error: { code, message } } as ApiResponse<never>;
}

export const api = {
  listBusinesses: async (): Promise<ApiResponse<Business[]>> => {
    await delay();
    return ok(mock.businesses);
  },
  getBusiness: async (id: string): Promise<ApiResponse<Business>> => {
    await delay(60);
    const b = mock.businesses.find((x) => x.id === id);
    return b ? ok(b) : fail('NOT_FOUND', 'Business tidak ditemukan');
  },
  updateBusinessLogo: async (businessId: string, logo: string): Promise<ApiResponse<Business>> => {
    await delay(80);
    const b = mock.businesses.find((x) => x.id === businessId);
    if (!b) return fail('NOT_FOUND', 'Business tidak ditemukan');
    b.logo = logo;
    b.updatedAt = new Date().toISOString();
    return ok(b);
  },
  createBusiness: async (input: { name: string; type: Business['type'] }): Promise<ApiResponse<Business>> => {
    await delay();
    const now = new Date().toISOString();
    const b: Business = {
      id: `b${mock.businesses.length + 1}`,
      name: input.name,
      type: input.type,
      slug: input.name.toLowerCase().replace(/\s+/g, '-'),
      status: 'trial',
      ownerId: 'u1',
      createdAt: now,
      updatedAt: now,
    };
    mock.businesses.push(b);
    return ok(b);
  },
  listServices: async (businessId: string): Promise<ApiResponse<ServiceItem[]>> => {
    await delay();
    return ok(mock.services.filter((s) => s.businessId === businessId));
  },
  createService: async (businessId: string, input: { name: string; category: string; price: number; durationMin: number }): Promise<ApiResponse<ServiceItem>> => {
    await delay(80);
    const s: ServiceItem = { id: `s${Date.now()}`, businessId, ...input, active: true };
    mock.services.push(s);
    return ok(s);
  },
  listCustomers: async (businessId: string): Promise<ApiResponse<Customer[]>> => {
    await delay();
    return ok(mock.customers.filter((c) => c.businessId === businessId));
  },
  listVehicles: async (businessId: string): Promise<ApiResponse<Vehicle[]>> => {
    await delay();
    return ok(mock.vehicles.filter((v) => v.businessId === businessId));
  },
  listBookings: async (businessId: string, date?: string): Promise<ApiResponse<Booking[]>> => {
    await delay();
    let list = mock.bookings.filter((b) => b.businessId === businessId);
    if (date) list = list.filter((b) => b.startsAt.slice(0, 10) === date);
    return ok(list.sort((a, b) => a.startsAt.localeCompare(b.startsAt)));
  },
  createBooking: async (
    businessId: string,
    input: Omit<Booking, 'id' | 'businessId' | 'endsAt' | 'status' | 'amount'> & { serviceName: string; amount: number; durationMin: number },
  ): Promise<ApiResponse<Booking>> => {
    await delay(100);
    const b: Booking = {
      ...input,
      id: `bk${Date.now()}`,
      businessId,
      endsAt: new Date(new Date(input.startsAt).getTime() + input.durationMin * 60000).toISOString(),
      status: 'pending',
    };
    mock.bookings.push(b);
    return ok(b);
  },
  updateBookingStatus: async (businessId: string, bookingId: string, status: Booking['status']): Promise<ApiResponse<Booking>> => {
    await delay(80);
    const b = mock.bookings.find((x) => x.id === bookingId && x.businessId === businessId);
    if (!b) return fail('NOT_FOUND', 'Booking tidak ditemukan');
    b.status = status;
    return ok(b);
  },
  listPayments: async (businessId: string): Promise<ApiResponse<Payment[]>> => {
    await delay();
    return ok(mock.payments.filter((p) => p.businessId === businessId));
  },
};

export function formatRupiah(n: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' });
}