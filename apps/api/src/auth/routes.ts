import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { signToken } from './token.js';
import { authenticate } from './middleware.js';
import { verifyPassword } from './password.js';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export function registerAuthRoutes(router: Router) {
  router.post('/api/auth/login', (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'Email atau password salah' } });
    }
    const { email, password } = parsed.data;
    const user = db.users.find((u) => u.email === email);
    if (!user || !verifyPassword(password, user.passwordHash, user.salt)) {
      return res.status(401).json({ ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email atau password salah' } });
    }
    const token = signToken(
      { sub: user.id, role: user.role, businessId: user.businessId, name: user.name, email: user.email, ...(user.position ? { position: user.position } : {}) },
      process.env.JWT_SECRET || 'dev-secret-change-me',
    );
    res.json({ ok: true, data: { accessToken: token, user: { id: user.id, role: user.role, name: user.name, email: user.email, businessId: user.businessId, ...(user.position ? { position: user.position } : {}) } } });
  });

  router.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ ok: true, data: req.user });
  });

  // Daftar bisnis milik user (scoped, isolasi): owner/staff hanya miliknya sendiri.
  router.get('/api/me/businesses', authenticate, (req, res) => {
    const businesses =
      req.user!.role === 'super_admin'
        ? db.businesses
        : db.businesses.filter((b) => b.id === req.user!.businessId);
    res.json({ ok: true, data: businesses });
  });
}