import { Router } from 'express';
import { z } from 'zod';
import type { Member, MembershipPlanName } from '@washcut/shared';
import { db, nextId, scoped } from '../../db.js';
import { authenticate, requireRole, requireTenantAccess } from '../../auth/middleware.js';

const planCreateSchema = z.object({
  name: z.enum(['Basic', 'Premium', 'VIP'] as const satisfies readonly MembershipPlanName[]),
  price: z.number().nonnegative(),
  pointsPerSpend: z.number().int().nonnegative(),
  benefits: z.array(z.string()).default([]),
});

const memberCreateSchema = z.object({
  name: z.string().min(1),
  phone: z.string().optional(),
  plan: z.string().min(1),
});

export function registerMembershipRoutes(router: Router) {
  router.get('/api/businesses/:businessId/membership-plans', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    res.json({ ok: true, data: scoped(db.membershipPlans, tenantId) });
  });

  router.post('/api/businesses/:businessId/membership-plans', authenticate, requireTenantAccess, requireRole('owner', 'admin'), (req, res) => {
    const parsed = planCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const plan = { id: nextId('membershipPlans'), businessId: req.user!.businessId!, ...parsed.data };
    db.membershipPlans.push(plan);
    res.status(201).json({ ok: true, data: plan });
  });

  router.get('/api/businesses/:businessId/members', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    res.json({ ok: true, data: scoped(db.members, tenantId) });
  });

  router.post('/api/businesses/:businessId/members', authenticate, requireTenantAccess, requireRole('owner', 'admin'), (req, res) => {
    const parsed = memberCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const tenantId = req.user!.businessId!;
    const plan = db.membershipPlans.find((p) => p.name === parsed.data.plan && p.businessId === tenantId);
    if (!plan) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Paket membership tidak ada di tenant ini' } });
    }
    const now = new Date();
    const member: Member = {
      id: nextId('members'),
      businessId: tenantId,
      name: parsed.data.name,
      ...(parsed.data.phone ? { phone: parsed.data.phone } : {}),
      plan: plan.name,
      status: 'active',
      validUntil: new Date(now.getTime() + 30 * 86400000).toISOString().slice(0, 10),
      points: 0,
      spent: 0,
      joinedAt: now.toISOString().slice(0, 10),
    };
    db.members.push(member);
    res.status(201).json({ ok: true, data: member });
  });
}
