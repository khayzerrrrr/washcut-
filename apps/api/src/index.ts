import express from 'express';
import { registerAuthRoutes } from './auth/routes.js';
import { registerTenantRoutes } from './modules/tenants/routes.js';
import { registerServiceRoutes } from './modules/services/routes.js';
import { registerCustomerRoutes } from './modules/customers/routes.js';
import { registerBookingRoutes } from './modules/bookings/routes.js';
import { registerCheckoutRoutes } from './modules/checkout/routes.js';
import { registerStaffRoutes } from './modules/staff/routes.js';
import { registerQueueRoutes } from './modules/queue/routes.js';
import { registerInventoryRoutes } from './modules/inventory/routes.js';
import { registerMembershipRoutes } from './modules/membership/routes.js';
import { registerBranchRoutes } from './modules/branches/routes.js';
import { registerReportsRoutes } from './modules/reports/routes.js';
import { registerOperationsRoutes } from './modules/operations/routes.js';
import { initStore, persistDb } from './db.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  initStore();

  app.use((req, res, next) => {
    res.on('finish', () => {
      if (req.method !== 'GET' && req.method !== 'HEAD' && res.statusCode < 500) persistDb();
    });
    next();
  });

  app.get('/health', (_req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
  });

  registerAuthRoutes(app);
  registerTenantRoutes(app);
  registerServiceRoutes(app);
  registerCustomerRoutes(app);
  registerBookingRoutes(app);
  registerCheckoutRoutes(app);
  registerStaffRoutes(app);
  registerQueueRoutes(app);
  registerInventoryRoutes(app);
  registerMembershipRoutes(app);
  registerBranchRoutes(app);
  registerReportsRoutes(app);
  registerOperationsRoutes(app);

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 4000);
  createApp().listen(port, () => {
    console.log(`API ready on http://localhost:${port}`);
  });
}