import { Router } from 'express';
import { z } from 'zod';
import type { Branch } from '@washcut/shared';
import { db, nextId, scoped } from '../../db.js';
import { authenticate, requireRole, requireTenantAccess } from '../../auth/middleware.js';

const createBranchSchema = z.object({
  name: z.string().min(2),
  city: z.string().min(2),
  staff: z.number().min(0).optional(),
  customers: z.number().min(0).optional(),
  appointments: z.number().min(0).optional(),
  revenue: z.number().min(0).optional(),
  performance: z.number().min(0).max(100).optional(),
});

export function registerBranchRoutes(router: Router) {
  router.get('/api/businesses/:businessId/branches', authenticate, requireTenantAccess, (req, res) => {
    res.json({ ok: true, data: scoped(db.branches, req.user!.businessId!) });
  });

  router.post('/api/businesses/:businessId/branches', authenticate, requireTenantAccess, requireRole('owner', 'admin'), (req, res) => {
    const parsed = createBranchSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const { name, city, staff = 0, customers = 0, appointments = 0, revenue = 0, performance = 0 } = parsed.data;
    const branch: Branch = {
      id: nextId('branches'),
      businessId: req.user!.businessId!,
      name,
      city,
      staff,
      customers,
      appointments,
      revenue,
      performance,
    };
    db.branches.push(branch);
    res.status(201).json({ ok: true, data: branch });
  });
}
