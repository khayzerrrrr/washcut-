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

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  durationMin: z.number().int().positive().optional(),
  active: z.boolean().optional(),
});

export function registerServiceRoutes(router: Router) {
  router.get('/api/businesses/:businessId/services', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    res.json({ ok: true, data: scoped(db.services, tenantId).filter((s) => !s.deletedAt) });
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

  router.patch('/api/businesses/:businessId/services/:serviceId', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    if (Object.keys(parsed.data).length === 0) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'Minimal satu field harus diisi' } });
    }
    const service = db.services.find((s) => s.id === req.params.serviceId && s.businessId === tenantId);
    if (!service || service.deletedAt) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Layanan tidak ada di tenant ini' } });
    }
    Object.assign(service, parsed.data);
    res.json({ ok: true, data: service });
  });

  router.delete('/api/businesses/:businessId/services/:serviceId', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const service = db.services.find((s) => s.id === req.params.serviceId && s.businessId === tenantId);
    if (!service || service.deletedAt) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Layanan tidak ada di tenant ini' } });
    }
    service.deletedAt = new Date().toISOString();
    res.json({ ok: true, data: service });
  });
}