import { Router } from 'express';
import { z } from 'zod';
import { db, nextId, scoped } from '../../db.js';
import { authenticate, requireTenantAccess } from '../../auth/middleware.js';

const createCustomerSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6).optional(),
  email: z.string().email().optional(),
  notes: z.string().optional(),
});

const createVehicleSchema = z.object({
  customerId: z.string().min(1),
  plateNumber: z.string().min(2),
  brand: z.string().optional(),
  model: z.string().optional(),
  vehicleClass: z.string().optional(),
  color: z.string().optional(),
});

export function registerCustomerRoutes(router: Router) {
  router.get('/api/businesses/:businessId/customers', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    res.json({ ok: true, data: scoped(db.customers, tenantId) });
  });

  router.post('/api/businesses/:businessId/customers', authenticate, requireTenantAccess, (req, res) => {
    const parsed = createCustomerSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const customer = { id: nextId('customers'), businessId: req.user!.businessId!, ...parsed.data, createdAt: new Date().toISOString() };
    db.customers.push(customer);
    res.status(201).json({ ok: true, data: customer });
  });

  // Kendaraan hanya untuk tenant car_wash
  router.get('/api/businesses/:businessId/vehicles', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const business = db.businesses.find((b) => b.id === tenantId);
    if (!business || business.type !== 'car_wash') {
      return res.status(400).json({ ok: false, error: { code: 'WRONG_BUSINESS_TYPE', message: 'Endpoint ini khusus car wash' } });
    }
    res.json({ ok: true, data: scoped(db.vehicles, tenantId) });
  });

  router.post('/api/businesses/:businessId/vehicles', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const business = db.businesses.find((b) => b.id === tenantId);
    if (!business || business.type !== 'car_wash') {
      return res.status(400).json({ ok: false, error: { code: 'WRONG_BUSINESS_TYPE', message: 'Endpoint ini khusus car wash' } });
    }
    const parsed = createVehicleSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const customer = db.customers.find((c) => c.id === parsed.data.customerId && c.businessId === tenantId);
    if (!customer) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Pelanggan tidak ada di tenant ini' } });
    }
    if (db.vehicles.some((v) => v.businessId === tenantId && v.plateNumber === parsed.data.plateNumber)) {
      return res.status(409).json({ ok: false, error: { code: 'DUPLICATE_PLATE', message: 'Plat nomor sudah terdaftar' } });
    }
    const vehicle = { id: nextId('vehicles'), businessId: tenantId, ...parsed.data };
    db.vehicles.push(vehicle);
    res.status(201).json({ ok: true, data: vehicle });
  });
}