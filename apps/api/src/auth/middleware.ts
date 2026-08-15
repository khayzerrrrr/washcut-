import type { NextFunction, Request, Response } from 'express';
import type { Role } from '@washcut/shared';
import { verifyToken, type TokenPayload } from './token.js';

declare module 'express-serve-static-core' {
  interface Request {
    user?: TokenPayload;
  }
}

const getSecret = () => process.env.JWT_SECRET || 'dev-secret-change-me';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
  }
  const user = verifyToken(auth.slice(7), getSecret());
  if (!user) {
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token' } });
  }
  req.user = user;
  next();
}

export function requireSuperAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'super_admin') {
    return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Super admin only' } });
  }
  next();
}

/** Pastikan role user ada di daftar yang diizinkan, selain itu 403. */
export function requireRole(...roles: Role[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'Tidak memiliki izin' } });
    }
    next();
  };
}

/**
 * Isolasi tenant: data hanya boleh diakses oleh anggota tenant tsb.
 * businessId diambil dari TOKEN (bukan dari URL). URL yang tidak cocok → 403.
 */
export function requireTenantAccess(req: Request, res: Response, next: NextFunction) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ ok: false, error: { code: 'UNAUTHORIZED', message: 'Missing token' } });
  }
  const paramId = req.params.businessId;
  if (user.role === 'super_admin') {
    req.user = { ...user, businessId: paramId };
    return next();
  }
  if (!user.businessId || user.businessId !== paramId) {
    return res.status(403).json({ ok: false, error: { code: 'FORBIDDEN', message: 'No access to this tenant' } });
  }
  next();
}