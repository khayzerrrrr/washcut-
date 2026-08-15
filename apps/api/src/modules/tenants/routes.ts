import { Router } from 'express';
import { z } from 'zod';
import type { BusinessType } from '@washcut/shared';
import { db, nextId } from '../../db.js';
import { authenticate, requireSuperAdmin, requireTenantAccess } from '../../auth/middleware.js';
import { hashPassword } from '../../auth/password.js';

const createTenantSchema = z.object({
  name: z.string().min(2),
  type: z.enum(['barbershop', 'car_wash'] as const satisfies readonly BusinessType[]),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, 'slug hanya huruf kecil, angka, dan dash'),
  ownerEmail: z.string().email().optional(),
  ownerPassword: z.string().min(6).optional(),
});

/**
 * Manajemen tenant — HANYA super_admin (pemilik platform).
 * Pemilik platform yang menentukan jenis bisnis (car wash / barbershop).
 */
export function registerTenantRoutes(router: Router) {
  router.get('/api/tenants', authenticate, requireSuperAdmin, (_req, res) => {
    res.json({ ok: true, data: db.businesses });
  });

  router.post('/api/tenants', authenticate, requireSuperAdmin, (req, res) => {
    const parsed = createTenantSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    if (db.businesses.some((b) => b.slug === parsed.data.slug)) {
      return res.status(409).json({ ok: false, error: { code: 'DUPLICATE_SLUG', message: 'Slug sudah dipakai' } });
    }
    const now = new Date().toISOString();
    const { ownerEmail, ownerPassword, ...rest } = parsed.data;
    let ownerId = req.user!.sub;
    if (ownerEmail) {
      if (!ownerPassword) {
        return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'ownerPassword wajib diisi bersama ownerEmail' } });
      }
      if (db.users.some((u) => u.email === ownerEmail)) {
        return res.status(409).json({ ok: false, error: { code: 'DUPLICATE_EMAIL', message: 'Email owner sudah dipakai' } });
      }
      const { passwordHash, salt } = hashPassword(ownerPassword);
      const owner = {
        id: nextId('users'),
        role: 'owner' as const,
        name: ownerEmail.split('@')[0],
        email: ownerEmail,
        passwordHash,
        salt,
      };
      db.users.push(owner);
      ownerId = owner.id;
    }
    const business = {
      id: nextId('businesses'),
      ...rest,
      status: 'trial' as const,
      ownerId,
      createdAt: now,
      updatedAt: now,
    };
    db.businesses.push(business);
    res.status(201).json({ ok: true, data: business });
  });

  router.patch('/api/tenants/:id', authenticate, requireSuperAdmin, (req, res) => {
    const b = db.businesses.find((x) => x.id === req.params.id);
    if (!b) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Tenant tidak ditemukan' } });
    const status = req.body.status;
    if (!['active', 'suspended', 'trial'].includes(status)) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'status tidak valid' } });
    }
    b.status = status;
    b.updatedAt = new Date().toISOString();
    res.json({ ok: true, data: b });
  });

  router.patch('/api/tenants/:id/logo', authenticate, requireSuperAdmin, (req, res) => {
    const b = db.businesses.find((x) => x.id === req.params.id);
    if (!b) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Tenant tidak ditemukan' } });
    const logo = req.body.logo;
    if (typeof logo !== 'string' || logo.length > 500_000) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'logo tidak valid (string, maks 500KB)' } });
    }
    b.logo = logo;
    b.updatedAt = new Date().toISOString();
    res.json({ ok: true, data: b });
  });

  /**
   * Update logo oleh anggota tenant itu sendiri (owner/staff).
   * Isolasi: businessId dari token harus cocok dengan URL (requireTenantAccess).
   */
  router.patch('/api/businesses/:businessId/logo', authenticate, requireTenantAccess, (req, res) => {
    const b = db.businesses.find((x) => x.id === req.user!.businessId);
    if (!b) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Tenant tidak ditemukan' } });
    const logo = req.body.logo;
    if (typeof logo !== 'string' || logo.length > 500_000) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'logo tidak valid (string, maks 500KB)' } });
    }
    b.logo = logo;
    b.updatedAt = new Date().toISOString();
    res.json({ ok: true, data: b });
  });
}