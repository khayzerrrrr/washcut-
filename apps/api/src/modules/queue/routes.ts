import { Router } from 'express';
import { z } from 'zod';
import type { QueueStatus } from '@washcut/shared';
import { db, scoped } from '../../db.js';
import { authenticate, requireTenantAccess } from '../../auth/middleware.js';

const queueStatusEnum = z.enum(['waiting', 'in-service', 'completed', 'cancelled']);

const updateQueueStatusSchema = z.object({
  status: queueStatusEnum,
});

export function registerQueueRoutes(router: Router) {
  router.get('/api/businesses/:businessId/queue', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const list = scoped(db.queue, tenantId).sort((a, b) => a.queueNo - b.queueNo);
    res.json({ ok: true, data: list });
  });

  router.patch('/api/businesses/:businessId/queue/:queueId', authenticate, requireTenantAccess, (req, res) => {
    const tenantId = req.user!.businessId!;
    const parsed = updateQueueStatusSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ ok: false, error: { code: 'VALIDATION', message: parsed.error.message } });
    }
    const item = db.queue.find((q) => q.id === req.params.queueId && q.businessId === tenantId);
    if (!item) {
      return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Antrian tidak ditemukan' } });
    }
    item.status = parsed.data.status as QueueStatus;
    res.json({ ok: true, data: item });
  });
}
