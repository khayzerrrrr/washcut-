import { Router } from 'express';
import { z } from 'zod';
import { db, nextId, scoped } from '../../db.js';
import { authenticate, requireTenantAccess } from '../../auth/middleware.js';

const checkoutSchema = z.object({
  bookingId: z.string().min(1),
  method: z.enum(['cash', 'qris', 'transfer', 'card']),
  amount: z.number().positive(),
});

const standalonePaymentSchema = z.object({
  amount: z.number().positive(),
  method: z.enum(['cash', 'qris', 'transfer', 'card']),
  note: z.string().optional(),
});

export function registerCheckoutRoutes(router: Router) {
  router.get('/api/businesses/:businessId/payments', authenticate, requireTenantAccess, (req, res) => {
    res.json({ ok: true, data: scoped(db.payments, req.user!.businessId!) });
  });

  router.post('/api/businesses/:businessId/payments', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = standalonePaymentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const payment = {
      id: nextId('payments'),
      businessId: tenantId,
      amount: parsed.data.amount,
      method: parsed.data.method,
      status: 'paid' as const,
      paidAt: new Date().toISOString(),
    };
    db.payments.push(payment);
    res.status(201).json({ ok: true, data: payment });
  });

  router.post('/api/businesses/:businessId/checkout', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = checkoutSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const booking = db.bookings.find((b) => b.id === parsed.data.bookingId && b.businessId === tenantId);
    if (!booking) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Booking tidak ada di tenant ini' } });
    }
    if (parsed.data.amount > booking.amount) {
      return res.status(400).json({ ok: false, error: { code: 'OVERPAYMENT', message: 'Jumlah melebihi tagihan' } });
    }
    const paid = db.payments.filter((p) => p.bookingId === booking.id).reduce((s, p) => s + p.amount, 0);
    const remaining = booking.amount - paid;
    const payment = {
      id: nextId('payments'),
      businessId: tenantId,
      bookingId: booking.id,
      customerId: booking.customerId,
      amount: parsed.data.amount,
      method: parsed.data.method,
      status: parsed.data.amount >= remaining ? ('paid' as const) : ('partial' as const),
      paidAt: new Date().toISOString(),
    };
    db.payments.push(payment);
    if (payment.status === 'paid') booking.status = 'confirmed';
    res.status(201).json({ ok: true, data: { payment, remaining: remaining - parsed.data.amount, bookingStatus: booking.status } });
  });
}