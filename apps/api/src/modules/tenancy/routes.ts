import { Router } from 'express';
import { z } from 'zod';
import { Business, BusinessType } from '@washcut/shared';

const businesses: Business[] = [];
let nextId = 1;

const createSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['barbershop', 'car_wash'] as const satisfies readonly BusinessType[]),
  slug: z.string().min(1),
  ownerId: z.string().min(1),
});

export function registerTenancyRoutes(router: Router) {
  router.get('/api/businesses', (_req, res) => {
    res.json({ ok: true, data: businesses });
  });

  router.get('/api/businesses/:id', (req, res) => {
    const b = businesses.find((x) => x.id === req.params.id);
    if (!b) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Business tidak ditemukan' } });
    res.json({ ok: true, data: b });
  });

  router.post('/api/businesses', (req, res) => {
    const parsed = createSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const now = new Date().toISOString();
    const business: Business = { id: String(nextId++), ...parsed.data, status: 'trial', createdAt: now, updatedAt: now };
    businesses.push(business);
    res.status(201).json({ ok: true, data: business });
  });
}