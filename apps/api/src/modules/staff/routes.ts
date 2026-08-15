import { Router } from 'express';
import { z } from 'zod';
import type { StaffPosition } from '@washcut/shared';
import { db, nextId } from '../../db.js';
import { authenticate, requireRole, requireTenantAccess } from '../../auth/middleware.js';
import { hashPassword } from '../../auth/password.js';

const createUserSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'staff']),
  position: z.enum(['capster', 'washer'] as const satisfies readonly StaffPosition[]).optional(),
});

/** Cari tenant dari businessId token (isolasi sudah dijamin requireTenantAccess). */
const tenant = (businessId: string) => db.businesses.find((b) => b.id === businessId);

export function registerStaffRoutes(router: Router) {
  router.get('/api/businesses/:businessId/users', authenticate, requireTenantAccess, requireRole('owner', 'admin'), (req, res) => {
    const users = db.users
      .filter((u) => u.businessId === req.user!.businessId && (u.role === 'owner' || u.role === 'admin' || u.role === 'staff'))
      .map(({ passwordHash: _p, salt: _s, ...user }) => user);
    res.json({ ok: true, data: users });
  });

  router.post('/api/businesses/:businessId/users', authenticate, requireTenantAccess, requireRole('owner', 'admin'), (req, res) => {
    const parsed = createUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const { role, position, ...rest } = parsed.data;
    if (role === 'staff' && !position) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'position wajib diisi untuk role staff' } });
    }
    const biz = tenant(req.user!.businessId!);
    if (!biz) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Tenant tidak ditemukan' } });
    if (position) {
      const expected: StaffPosition = biz.type === 'barbershop' ? 'capster' : 'washer';
      if (position !== expected) {
        return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: `Posisi tidak cocok dengan jenis bisnis (harus ${expected})` } });
      }
    }
    if (db.users.some((u) => u.email === rest.email)) {
      return res.status(409).json({ ok: false, error: { code: 'DUPLICATE_EMAIL', message: 'Email sudah dipakai' } });
    }
    const { passwordHash, salt } = hashPassword(rest.password);
    const user = {
      id: nextId('users'),
      role,
      name: rest.name,
      email: rest.email,
      businessId: req.user!.businessId,
      ...(position ? { position } : {}),
      passwordHash,
      salt,
    };
    db.users.push(user);
    const { passwordHash: _p, salt: _s, ...safe } = user;
    res.status(201).json({ ok: true, data: safe });
  });

  router.get('/api/businesses/:businessId/commission', authenticate, requireTenantAccess, requireRole('owner', 'admin'), (req, res) => {
    const biz = tenant(req.user!.businessId!);
    if (!biz) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Tenant tidak ditemukan' } });
    res.json({ ok: true, data: { enabled: biz.commissionEnabled ?? false, rate: biz.commissionRate ?? 0 } });
  });

  router.patch('/api/businesses/:businessId/commission', authenticate, requireTenantAccess, requireRole('owner'), (req, res) => {
    const biz = tenant(req.user!.businessId!);
    if (!biz) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Tenant tidak ditemukan' } });
    const parsed = z.object({ enabled: z.boolean(), rate: z.number().min(0).max(100).optional() }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    biz.commissionEnabled = parsed.data.enabled;
    if (parsed.data.rate !== undefined) biz.commissionRate = parsed.data.rate;
    biz.updatedAt = new Date().toISOString();
    res.json({ ok: true, data: { enabled: biz.commissionEnabled, rate: biz.commissionRate } });
  });
}
