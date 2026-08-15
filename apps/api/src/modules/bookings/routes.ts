import { Router } from 'express';
import { z } from 'zod';
import { db, nextId, scoped } from '../../db.js';
import { authenticate, requireTenantAccess } from '../../auth/middleware.js';

const createBookingSchema = z.object({
  customerId: z.string().min(1).optional(),
  customerName: z.string().min(1),
  serviceId: z.string().min(1),
  startsAt: z.string().datetime(),
  staffId: z.string().optional(),
  vehicleId: z.string().optional(),
  walkIn: z.boolean().optional(),
  notes: z.string().optional(),
});

export function registerBookingRoutes(router: Router) {
  router.get('/api/businesses/:businessId/bookings', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    let list = scoped(db.bookings, tenantId);
    if (req.query.date) {
      list = list.filter((b) => b.startsAt.slice(0, 10) === String(req.query.date));
    }
    if (req.query.status) {
      list = list.filter((b) => b.status === String(req.query.status));
    }
    list.sort((a, b) => a.startsAt.localeCompare(b.startsAt));
    res.json({ ok: true, data: list });
  });

  router.post('/api/businesses/:businessId/bookings', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = createBookingSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const service = db.services.find((s) => s.id === parsed.data.serviceId && s.businessId === tenantId);
    if (!service) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Layanan tidak ada di tenant ini' } });
    }
    if (parsed.data.customerId) {
      const customer = db.customers.find((c) => c.id === parsed.data.customerId && c.businessId === tenantId);
      if (!customer) {
        return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Pelanggan tidak ada di tenant ini' } });
      }
    }
    let customerId = parsed.data.customerId;
    if (!customerId) {
      const walkIn = { id: nextId('customers'), businessId: tenantId, name: parsed.data.customerName, createdAt: new Date().toISOString() };
      db.customers.push(walkIn);
      customerId = walkIn.id;
    }
    const startsAt = new Date(parsed.data.startsAt);
    const endsAt = new Date(startsAt.getTime() + service.durationMin * 60000);
    const conflict = db.bookings.some(
      (b) =>
        b.businessId === tenantId &&
        b.status !== 'cancelled' &&
        b.staffId === parsed.data.staffId &&
        startsAt < new Date(b.endsAt) &&
        endsAt > new Date(b.startsAt),
    );
    if (conflict) {
      return res.status(409).json({ ok: false, error: { code: 'SLOT_CONFLICT', message: 'Slot sudah dipesan' } });
    }
    const vehicle = parsed.data.vehicleId ? db.vehicles.find((v) => v.id === parsed.data.vehicleId && v.businessId === tenantId) : undefined;
    const staff = parsed.data.staffId ? db.users.find((u) => u.id === parsed.data.staffId && u.businessId === tenantId) : undefined;
    const booking = {
      id: nextId('bookings'),
      businessId: tenantId,
      ...parsed.data,
      customerId,
      serviceName: service.name,
      staffName: staff?.name,
      vehiclePlate: vehicle?.plateNumber,
      startsAt: startsAt.toISOString(),
      endsAt: endsAt.toISOString(),
      status: 'pending' as const,
      amount: service.price,
    };
    db.bookings.push(booking);
    res.status(201).json({ ok: true, data: booking });
  });

  router.patch('/api/businesses/:businessId/bookings/:bookingId', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const booking = db.bookings.find((b) => b.id === req.params.bookingId && b.businessId === tenantId);
    if (!booking) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Booking tidak ditemukan' } });
    const status = req.body.status;
    if (!['pending', 'confirmed', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'status tidak valid' } });
    }
    booking.status = status;
    res.json({ ok: true, data: booking });
  });
}