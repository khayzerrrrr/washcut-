import { Router } from 'express';
import { z } from 'zod';
import { Booking } from '@washcut/shared';

const bookings: Booking[] = [];
let nextId = 1;

const createSchema = z.object({
  businessId: z.string().min(1),
  customerId: z.string().min(1),
  customerName: z.string().min(1),
  serviceId: z.string().min(1),
  serviceName: z.string().min(1),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  amount: z.number().nonnegative(),
  staffId: z.string().optional(),
  staffName: z.string().optional(),
  vehicleId: z.string().optional(),
  vehiclePlate: z.string().optional(),
  walkIn: z.boolean().optional(),
  notes: z.string().optional(),
});

export function registerBookingRoutes(router: Router) {
  router.get('/api/businesses/:businessId/bookings', (req, res) => {
    const list = bookings.filter((b) => b.businessId === req.params.businessId);
    res.json({ ok: true, data: list });
  });

  router.post('/api/businesses/:businessId/bookings', (req, res) => {
    const parsed = createSchema.safeParse({ ...req.body, businessId: req.params.businessId });
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const booking: Booking = { id: String(nextId++), ...parsed.data, status: 'pending' };
    bookings.push(booking);
    res.status(201).json({ ok: true, data: booking });
  });
}