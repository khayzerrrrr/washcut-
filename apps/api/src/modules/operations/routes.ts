import { Router } from 'express';
import { z } from 'zod';
import { db, nextId, scoped } from '../../db.js';
import { authenticate, requireRole, requireTenantAccess } from '../../auth/middleware.js';

const createExpenseSchema = z.object({
  description: z.string().min(1),
  amount: z.number().positive(),
  category: z.string().optional(),
});

const markNotificationSchema = z.object({
  read: z.boolean(),
});

export function registerOperationsRoutes(router: Router) {
  router.get('/api/businesses/:businessId/expenses', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const list = scoped(db.expenses, tenantId).sort((a, b) => b.date.localeCompare(a.date));
    res.json({ ok: true, data: list });
  });

  router.post('/api/businesses/:businessId/expenses', authenticate, requireTenantAccess, requireRole('owner', 'admin'), (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = createExpenseSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const now = new Date();
    const expense = {
      id: nextId('expenses'),
      businessId: tenantId,
      ...parsed.data,
      date: now.toISOString().slice(0, 10),
      createdAt: now.toISOString(),
    };
    db.expenses.push(expense);
    res.status(201).json({ ok: true, data: expense });
  });

  router.get('/api/businesses/:businessId/notifications', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const list = scoped(db.notifications, tenantId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ ok: true, data: list });
  });

  router.patch('/api/businesses/:businessId/notifications/:notificationId', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = markNotificationSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const notif = db.notifications.find((n) => n.id === req.params.notificationId && n.businessId === tenantId);
    if (!notif) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Notifikasi tidak ditemukan' } });
    notif.read = parsed.data.read;
    res.json({ ok: true, data: notif });
  });

  router.get('/api/businesses/:businessId/activity-logs', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const list = scoped(db.activityLogs, tenantId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    res.json({ ok: true, data: list });
  });
}
