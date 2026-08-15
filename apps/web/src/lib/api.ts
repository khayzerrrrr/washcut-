import type { ActivityLog, ApiResponse, AppNotification, Booking, Branch, Business, Customer, Expense, InventoryItem, InventoryMovement, Member, MembershipPlan, Payment, Product, QueueItem, ReportPeriod, ReportSummary, ServiceItem, StaffPosition, User, Vehicle } from '@washcut/shared';
import { authFetch } from './auth';

function ok<T>(data: T): ApiResponse<T> {
  return { ok: true, data };
}

function fail(code: string, message: string): never {
  throw { ok: false, error: { code, message } } as ApiResponse<never>;
}

export interface CreateBusinessInput {
  name: string;
  type: Business['type'];
  slug?: string;
  ownerEmail?: string;
  ownerPassword?: string;
}

export const api = {
  listBusinesses: async (): Promise<ApiResponse<Business[]>> => {
    return authFetch<Business[]>('/api/tenants');
  },
  getBusiness: async (id: string): Promise<ApiResponse<Business>> => {
    const r = await authFetch<Business[]>('/api/me/businesses');
    if (r.ok) {
      const b = r.data.find((x) => x.id === id);
      if (b) return ok(b);
    }
    return fail('NOT_FOUND', 'Business tidak ditemukan');
  },
  listMyBusinesses: async (): Promise<ApiResponse<Business[]>> => {
    return authFetch<Business[]>('/api/me/businesses');
  },
  createBusiness: async (input: CreateBusinessInput): Promise<ApiResponse<Business>> => {
    return authFetch<Business>('/api/tenants', {
      method: 'POST',
      body: JSON.stringify({ ...input, slug: input.slug || input.name.toLowerCase().replace(/\s+/g, '-') }),
    });
  },
  updateBusinessStatus: async (id: string, status: Business['status']): Promise<ApiResponse<Business>> => {
    return authFetch<Business>(`/api/tenants/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
  updateBusinessLogo: async (businessId: string, logo: string): Promise<ApiResponse<Business>> => {
    return authFetch<Business>(`/api/businesses/${businessId}/logo`, {
      method: 'PATCH',
      body: JSON.stringify({ logo }),
    });
  },
  listExpenses: async (businessId: string): Promise<ApiResponse<Expense[]>> => {
    return authFetch<Expense[]>(`/api/businesses/${businessId}/expenses`);
  },
  createExpense: async (businessId: string, input: { description: string; amount: number; category?: string }): Promise<ApiResponse<Expense>> => {
    return authFetch<Expense>(`/api/businesses/${businessId}/expenses`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  listNotifications: async (businessId: string): Promise<ApiResponse<AppNotification[]>> => {
    return authFetch<AppNotification[]>(`/api/businesses/${businessId}/notifications`);
  },
  markNotificationRead: async (businessId: string, notificationId: string, read: boolean): Promise<ApiResponse<AppNotification>> => {
    return authFetch<AppNotification>(`/api/businesses/${businessId}/notifications/${notificationId}`, {
      method: 'PATCH',
      body: JSON.stringify({ read }),
    });
  },
  listActivityLogs: async (businessId: string): Promise<ApiResponse<ActivityLog[]>> => {
    return authFetch<ActivityLog[]>(`/api/businesses/${businessId}/activity-logs`);
  },
  listServices: async (businessId: string): Promise<ApiResponse<ServiceItem[]>> => {
    return authFetch<ServiceItem[]>(`/api/businesses/${businessId}/services`);
  },
  createService: async (businessId: string, input: { name: string; category: string; price: number; durationMin: number }): Promise<ApiResponse<ServiceItem>> => {
    return authFetch<ServiceItem>(`/api/businesses/${businessId}/services`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateService: async (businessId: string, serviceId: string, input: Partial<{ name: string; category: string; price: number; durationMin: number; active: boolean }>): Promise<ApiResponse<ServiceItem>> => {
    return authFetch<ServiceItem>(`/api/businesses/${businessId}/services/${serviceId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  deleteService: async (businessId: string, serviceId: string): Promise<ApiResponse<ServiceItem>> => {
    return authFetch<ServiceItem>(`/api/businesses/${businessId}/services/${serviceId}`, { method: 'DELETE' });
  },
  listCustomers: async (businessId: string): Promise<ApiResponse<Customer[]>> => {
    return authFetch<Customer[]>(`/api/businesses/${businessId}/customers`);
  },
  createCustomer: async (businessId: string, input: { name: string; phone?: string; email?: string; notes?: string }): Promise<ApiResponse<Customer>> => {
    return authFetch<Customer>(`/api/businesses/${businessId}/customers`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateCustomer: async (businessId: string, customerId: string, input: Partial<{ name: string; phone: string; email: string; notes: string }>): Promise<ApiResponse<Customer>> => {
    return authFetch<Customer>(`/api/businesses/${businessId}/customers/${customerId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  listVehicles: async (businessId: string): Promise<ApiResponse<Vehicle[]>> => {
    return authFetch<Vehicle[]>(`/api/businesses/${businessId}/vehicles`);
  },
  createVehicle: async (businessId: string, input: { customerId: string; plateNumber: string; brand?: string; model?: string; vehicleClass?: string; color?: string }): Promise<ApiResponse<Vehicle>> => {
    return authFetch<Vehicle>(`/api/businesses/${businessId}/vehicles`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateVehicle: async (businessId: string, vehicleId: string, input: Partial<{ plateNumber: string; brand: string; model: string; vehicleClass: string; color: string }>): Promise<ApiResponse<Vehicle>> => {
    return authFetch<Vehicle>(`/api/businesses/${businessId}/vehicles/${vehicleId}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  deleteVehicle: async (businessId: string, vehicleId: string): Promise<ApiResponse<Vehicle>> => {
    return authFetch<Vehicle>(`/api/businesses/${businessId}/vehicles/${vehicleId}`, { method: 'DELETE' });
  },
  listBookings: async (businessId: string, date?: string, status?: Booking['status']): Promise<ApiResponse<Booking[]>> => {
    const qs = new URLSearchParams();
    if (date) qs.set('date', date);
    if (status) qs.set('status', status);
    const q = qs.toString();
    return authFetch<Booking[]>(`/api/businesses/${businessId}/bookings${q ? `?${q}` : ''}`);
  },
  createBooking: async (
    businessId: string,
    input: { customerId?: string; customerName: string; serviceId: string; startsAt: string; staffId?: string; vehicleId?: string; walkIn?: boolean; notes?: string },
  ): Promise<ApiResponse<Booking>> => {
    return authFetch<Booking>(`/api/businesses/${businessId}/bookings`, { method: 'POST', body: JSON.stringify(input) });
  },
  updateBookingStatus: async (businessId: string, bookingId: string, status: Booking['status']): Promise<ApiResponse<Booking>> => {
    return authFetch<Booking>(`/api/businesses/${businessId}/bookings/${bookingId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },
  listPayments: async (businessId: string): Promise<ApiResponse<Payment[]>> => {
    return authFetch<Payment[]>(`/api/businesses/${businessId}/payments`);
  },
  createPayment: async (businessId: string, input: { amount: number; method: Payment['method']; note?: string }): Promise<ApiResponse<Payment>> => {
    return authFetch<Payment>(`/api/businesses/${businessId}/payments`, { method: 'POST', body: JSON.stringify(input) });
  },
  listQueue: async (businessId: string): Promise<ApiResponse<QueueItem[]>> => {
    return authFetch<QueueItem[]>(`/api/businesses/${businessId}/queue`);
  },
  updateQueueStatus: async (businessId: string, queueId: string, status: QueueItem['status']): Promise<ApiResponse<QueueItem>> => {
    return authFetch<QueueItem>(`/api/businesses/${businessId}/queue/${queueId}`, { method: 'PATCH', body: JSON.stringify({ status }) });
  },
  listProducts: async (businessId: string): Promise<ApiResponse<Product[]>> => {
    return authFetch<Product[]>(`/api/businesses/${businessId}/products`);
  },
  createProduct: async (businessId: string, input: { name: string; category?: string; price: number }): Promise<ApiResponse<Product>> => {
    return authFetch<Product>(`/api/businesses/${businessId}/products`, { method: 'POST', body: JSON.stringify(input) });
  },
  updateProduct: async (businessId: string, productId: string, input: Partial<{ name: string; category: string; price: number; active: boolean }>): Promise<ApiResponse<Product>> => {
    return authFetch<Product>(`/api/businesses/${businessId}/products/${productId}`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  deleteProduct: async (businessId: string, productId: string): Promise<ApiResponse<Product>> => {
    return authFetch<Product>(`/api/businesses/${businessId}/products/${productId}`, { method: 'DELETE' });
  },
  listInventory: async (businessId: string): Promise<ApiResponse<InventoryItem[]>> => {
    return authFetch<InventoryItem[]>(`/api/businesses/${businessId}/inventory`);
  },
  createInventoryItem: async (businessId: string, input: { name: string; category?: string; stock: number; buyPrice: number; sellPrice: number; supplier?: string; threshold?: number }): Promise<ApiResponse<InventoryItem>> => {
    return authFetch<InventoryItem>(`/api/businesses/${businessId}/inventory`, { method: 'POST', body: JSON.stringify(input) });
  },
  adjustInventoryStock: async (businessId: string, itemId: string, input: { type: 'in' | 'out'; qty: number; note?: string }): Promise<ApiResponse<InventoryItem>> => {
    return authFetch<InventoryItem>(`/api/businesses/${businessId}/inventory/${itemId}/stock`, { method: 'PATCH', body: JSON.stringify(input) });
  },
  listInventoryMovements: async (businessId: string): Promise<ApiResponse<InventoryMovement[]>> => {
    return authFetch<InventoryMovement[]>(`/api/businesses/${businessId}/inventory-movements`);
  },
  listMembershipPlans: async (businessId: string): Promise<ApiResponse<MembershipPlan[]>> => {
    return authFetch<MembershipPlan[]>(`/api/businesses/${businessId}/membership-plans`);
  },
  createMember: async (businessId: string, input: { name: string; phone?: string; plan: string }): Promise<ApiResponse<Member>> => {
    return authFetch<Member>(`/api/businesses/${businessId}/members`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  listMembers: async (businessId: string): Promise<ApiResponse<Member[]>> => {
    return authFetch<Member[]>(`/api/businesses/${businessId}/members`);
  },
  listBranches: async (businessId: string): Promise<ApiResponse<Branch[]>> => {
    return authFetch<Branch[]>(`/api/businesses/${businessId}/branches`);
  },
  createBranch: async (businessId: string, input: { name: string; city: string }): Promise<ApiResponse<Branch>> => {
    return authFetch<Branch>(`/api/businesses/${businessId}/branches`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getReports: async (businessId: string, period: ReportPeriod): Promise<ApiResponse<ReportSummary>> => {
    return authFetch<ReportSummary>(`/api/businesses/${businessId}/reports?period=${period}`);
  },
  listStaffAccounts: async (businessId: string): Promise<ApiResponse<User[]>> => {
    return authFetch<User[]>(`/api/businesses/${businessId}/users`);
  },
  createStaffAccount: async (
    businessId: string,
    input: { name: string; email: string; password: string; role: 'admin' | 'staff'; position?: StaffPosition },
  ): Promise<ApiResponse<User>> => {
    return authFetch<User>(`/api/businesses/${businessId}/users`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  getCommission: async (businessId: string): Promise<ApiResponse<{ enabled: boolean; rate: number }>> => {
    return authFetch<{ enabled: boolean; rate: number }>(`/api/businesses/${businessId}/commission`);
  },
  updateCommission: async (businessId: string, input: { enabled: boolean; rate?: number }): Promise<ApiResponse<{ enabled: boolean; rate: number }>> => {
    return authFetch<{ enabled: boolean; rate: number }>(`/api/businesses/${businessId}/commission`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
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

export function formatDateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}