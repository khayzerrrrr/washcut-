import { Router } from 'express';
import { z } from 'zod';
import { ServiceItem } from '@washcut/shared';

const services: ServiceItem[] = [];
let nextId = 1;

const createSchema = z.object({
  businessId: z.string().min(1),
  name: z.string().min(1),
  price: z.number().nonnegative(),
  durationMin: z.number().int().positive(),
});

export function registerServiceRoutes(router: Router) {
  router.get('/api/businesses/:businessId/services', (req, res) => {
    const list = services.filter((s) => s.businessId === req.params.businessId);
    res.json({ ok: true, data: list });
  });

  router.post('/api/businesses/:businessId/services', (req, res) => {
    const parsed = createSchema.safeParse({ ...req.body, businessId: req.params.businessId });
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const item: ServiceItem = { id: String(nextId++), ...parsed.data, active: true };
    services.push(item);
    res.status(201).json({ ok: true, data: item });
  });
}