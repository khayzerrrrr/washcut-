import { randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';

const KEY_LEN = 64;

export function hashPassword(plain: string): { passwordHash: string; salt: string } {
  const salt = randomBytes(16).toString('hex');
  const passwordHash = scryptSync(plain, salt, KEY_LEN).toString('hex');
  return { passwordHash, salt };
}

export function verifyPassword(plain: string, hash: string, salt: string): boolean {
  const derived = scryptSync(plain, salt, KEY_LEN);
  const expected = Buffer.from(hash, 'hex');
  return derived.length === expected.length && timingSafeEqual(derived, expected);
}
