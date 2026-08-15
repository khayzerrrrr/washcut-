import { createApp } from '../index.js';

const PORT = 4123;
const base = `http://localhost:${PORT}`;

let passed = 0;
let failed = 0;

function check(name: string, cond: boolean) {
  if (cond) {
    passed++;
    console.log(`  PASS  ${name}`);
  } else {
    failed++;
    console.log(`  FAIL  ${name}`);
  }
}

async function login(email: string) {
  const r = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'demo1234' }),
  });
  const j = (await r.json()) as { ok: boolean; data?: { accessToken: string } };
  if (!j.ok || !j.data) throw new Error(`login gagal untuk ${email}`);
  return j.data.accessToken;
}

async function main() {
  const server = createApp().listen(PORT);

  const admin = await login('admin@washcut.id');
  const ownerB1 = await login('owner@kings.id');
  const ownerB2 = await login('owner@aquashine.id');
  const staffB1 = await login('staff@kings.id');

  // 1. Super admin bisa lihat daftar tenant
  const tenants = await fetch(`${base}/api/tenants`, { headers: { Authorization: `Bearer ${admin}` } });
  const tenantsJson = (await tenants.json()) as { ok: boolean; data: unknown[] };
  check('super admin melihat semua tenant', tenants.status === 200 && tenantsJson.ok && tenantsJson.data.length >= 2);

  // 2. Owner bukan super admin TIDAK bisa akses manajemen tenant
  const denied = await fetch(`${base}/api/tenants`, { headers: { Authorization: `Bearer ${ownerB1}` } });
  check('owner TIDAK bisa manajemen tenant (403)', denied.status === 403);

  // 3. Isolasi: owner b1 tidak boleh membaca layanan tenant b2
  const leakRead = await fetch(`${base}/api/businesses/b2/services`, { headers: { Authorization: `Bearer ${ownerB1}` } });
  check('owner b1 membaca data b2 ditolak (403)', leakRead.status === 403);

  // 4. Owner b1 boleh membaca layanan tenant b1
  const own = await fetch(`${base}/api/businesses/b1/services`, { headers: { Authorization: `Bearer ${ownerB1}` } });
  const ownJson = (await own.json()) as { ok: boolean; data: { businessId: string }[] };
  check('owner b1 membaca data b1 diizinkan', own.status === 200 && ownJson.ok && ownJson.data.every((s) => s.businessId === 'b1'));

  // 5. Isolasi: owner b1 tidak boleh membuat layanan di tenant b2
  const leakWrite = await fetch(`${base}/api/businesses/b2/services`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerB1}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Hack', price: 1, durationMin: 1 }),
  });
  check('owner b1 menulis ke b2 ditolak (403)', leakWrite.status === 403);

  // 6. Booking silang: owner b1 tidak boleh checkout booking milik b2
  const leakCheckout = await fetch(`${base}/api/businesses/b1/checkout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${ownerB1}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ bookingId: 'bk3', method: 'cash', amount: 50000 }), // bk3 milik b2
  });
  check('checkout booking b2 lewat token b1 ditolak (404)', leakCheckout.status === 404);

  // 7. Tanpa token → 401
  const noAuth = await fetch(`${base}/api/businesses/b1/services`);
  check('tanpa token ditolak (401)', noAuth.status === 401);

  // 8. Staff tenant b1 tidak bisa akses tenant b2
  const staffLeak = await fetch(`${base}/api/businesses/b2/bookings`, { headers: { Authorization: `Bearer ${staffB1}` } });
  check('staff b1 membaca booking b2 ditolak (403)', staffLeak.status === 403);

  // 9. Super admin (dengan businessId param) bisa membaca tenant tertentu
  const adminRead = await fetch(`${base}/api/businesses/b2/services`, { headers: { Authorization: `Bearer ${admin}` } });
  check('super admin dapat mengakses tenant apa pun', adminRead.status === 200);

  server.close();

  console.log(`\nHasil: ${passed} lulus, ${failed} gagal`);
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});