import { Router } from 'express';
import { z } from 'zod';
import { db, nextId, scoped } from '../../db.js';
import { authenticate, requireTenantAccess } from '../../auth/middleware.js';

const createSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1).optional(),
  price: z.number().nonnegative(),
  durationMin: z.number().int().positive(),
});

export function registerServiceRoutes(router: Router) {
  router.get('/api/businesses/:businessId/services', authenticate, requireTenantAccess, (req, res) => {
    res.json({ ok: true, data: scoped(db.services, req.user!.businessId!) });
  });

  router.post('/api/businesses/:businessId/services', authenticate, requireTenantAccess, (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const item = { id: nextId('services'), businessId: req.user!.businessId!, ...parsed.data, active: true };
    db.services.push(item);
    res.status(201).json({ ok: true, data: item });
  });
}