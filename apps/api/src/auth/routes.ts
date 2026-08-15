import { Router } from 'express';
import { z } from 'zod';
import { db } from '../db.js';
import { signToken } from './token.js';
import { authenticate } from './middleware.js';

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export function registerAuthRoutes(router: Router) {
  router.post('/api/auth/login', (req, res) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'Email atau password salah' } });
    }
    const { email } = parsed.data;
    const user = db.users.find((u) => u.email === email);
    if (!user) {
      return res.status(401).json({ ok: false, error: { code: 'INVALID_CREDENTIALS', message: 'Email atau password salah' } });
    }
    const token = signToken(
      { sub: user.id, role: user.role, businessId: user.businessId, name: user.name, email: user.email },
      process.env.JWT_SECRET || 'dev-secret-change-me',
    );
    res.json({ ok: true, data: { accessToken: token, user: { id: user.id, role: user.role, name: user.name, email: user.email, businessId: user.businessId } } });
  });

  router.get('/api/auth/me', authenticate, (req, res) => {
    res.json({ ok: true, data: req.user });
  });
}