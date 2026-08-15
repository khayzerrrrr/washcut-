import { createHmac } from 'node:crypto';
import type { Role, StaffPosition } from '@washcut/shared';

export interface TokenPayload {
  sub: string;
  role: Role;
  businessId?: string;
  name: string;
  email: string;
  position?: StaffPosition;
  iat: number;
  exp: number;
}

const b64url = (input: string) => Buffer.from(input).toString('base64url');
const b64urlJson = (obj: unknown) => b64url(JSON.stringify(obj));

export function signToken(payload: Omit<TokenPayload, 'iat' | 'exp'>, secret: string, ttlSeconds = 7200): string {
  const now = Math.floor(Date.now() / 1000);
  const header = b64urlJson({ alg: 'HS256', typ: 'JWT' });
  const body = b64urlJson({ ...payload, iat: now, exp: now + ttlSeconds });
  const sig = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${sig}`;
}

export function verifyToken(token: string, secret: string): TokenPayload | null {
  const [h, b, s] = token.split('.');
  if (!h || !b || !s) return null;
  const expected = createHmac('sha256', secret).update(`${h}.${b}`).digest('base64url');
  if (expected !== s) return null;
  try {
    const payload = JSON.parse(Buffer.from(b, 'base64url').toString('utf8')) as TokenPayload;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}