import { Router } from 'express';
import { z } from 'zod';
import { db, nextId, scoped } from '../../db.js';
import { authenticate, requireTenantAccess } from '../../auth/middleware.js';

const createProductSchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1).optional(),
  price: z.number().nonnegative(),
});

const updateProductSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.string().min(1).optional(),
  price: z.number().nonnegative().optional(),
  active: z.boolean().optional(),
});

const createInventorySchema = z.object({
  name: z.string().min(1),
  category: z.string().min(1).optional(),
  stock: z.number().int().nonnegative(),
  buyPrice: z.number().nonnegative(),
  sellPrice: z.number().nonnegative(),
  supplier: z.string().min(1).optional(),
  threshold: z.number().int().nonnegative().optional(),
});

const adjustStockSchema = z.object({
  type: z.enum(['in', 'out']),
  qty: z.number().int().positive(),
  note: z.string().optional(),
});

const today = () => new Date().toISOString().slice(0, 10);

export function registerInventoryRoutes(router: Router) {
  router.get('/api/businesses/:businessId/products', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    res.json({ ok: true, data: scoped(db.products, tenantId).filter((p) => p.active && !p.deletedAt) });
  });

  router.post('/api/businesses/:businessId/products', authenticate, requireTenantAccess, (req, res) => {
    const parsed = createProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const item = { id: nextId('products'), businessId: req.user!.businessId!, ...parsed.data, active: true };
    db.products.push(item);
    res.status(201).json({ ok: true, data: item });
  });

  router.patch('/api/businesses/:businessId/products/:productId', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = updateProductSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    if (Object.keys(parsed.data).length === 0) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: 'Minimal satu field harus diisi' } });
    }
    const product = db.products.find((p) => p.id === req.params.productId && p.businessId === tenantId);
    if (!product || product.deletedAt) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Produk tidak ada di tenant ini' } });
    }
    Object.assign(product, parsed.data);
    res.json({ ok: true, data: product });
  });

  router.delete('/api/businesses/:businessId/products/:productId', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const product = db.products.find((p) => p.id === req.params.productId && p.businessId === tenantId);
    if (!product || product.deletedAt) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Produk tidak ada di tenant ini' } });
    }
    product.deletedAt = new Date().toISOString();
    res.json({ ok: true, data: product });
  });

  router.get('/api/businesses/:businessId/inventory', authenticate, requireTenantAccess, (req, res) => {
    res.json({ ok: true, data: scoped(db.inventory, req.user!.businessId!) });
  });

  router.post('/api/businesses/:businessId/inventory', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = createInventorySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const item = {
      id: nextId('inventory'),
      businessId: tenantId,
      ...parsed.data,
      threshold: parsed.data.threshold ?? 0,
    };
    db.inventory.push(item);
    if (item.stock > 0) {
      db.inventoryMovements.push({
        id: nextId('inventoryMovements'),
        businessId: tenantId,
        productId: item.id,
        productName: item.name,
        type: 'in',
        qty: item.stock,
        date: today(),
        note: 'Stok awal',
      });
    }
    res.status(201).json({ ok: true, data: item });
  });

  router.patch('/api/businesses/:businessId/inventory/:itemId/stock', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = adjustStockSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const item = db.inventory.find((i) => i.id === req.params.itemId && i.businessId === tenantId);
    if (!item) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Item inventori tidak ada di tenant ini' } });
    }
    const { type, qty, note } = parsed.data;
    if (type === 'out' && qty > item.stock) {
      return res.status(400).json({ ok: false, error: { code: 'INSUFFICIENT_STOCK', message: 'Stok tidak mencukupi' } });
    }
    item.stock = type === 'in' ? item.stock + qty : item.stock - qty;
    db.inventoryMovements.push({
      id: nextId('inventoryMovements'),
      businessId: tenantId,
      productId: item.id,
      productName: item.name,
      type,
      qty,
      date: today(),
      note,
    });
    res.json({ ok: true, data: item });
  });

  router.get('/api/businesses/:businessId/inventory-movements', authenticate, requireTenantAccess, (req, res) => {
    const rows = scoped(db.inventoryMovements, req.user!.businessId!);
    rows.sort((a, b) => b.date.localeCompare(a.date));
    res.json({ ok: true, data: rows });
  });
}
