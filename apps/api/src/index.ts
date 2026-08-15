import express from 'express';
import { registerAuthRoutes } from './auth/routes.js';
import { registerTenantRoutes } from './modules/tenants/routes.js';
import { registerServiceRoutes } from './modules/services/routes.js';
import { registerCustomerRoutes } from './modules/customers/routes.js';
import { registerBookingRoutes } from './modules/bookings/routes.js';
import { registerCheckoutRoutes } from './modules/checkout/routes.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
  });

  registerAuthRoutes(app);
  registerTenantRoutes(app);
  registerServiceRoutes(app);
  registerCustomerRoutes(app);
  registerBookingRoutes(app);
  registerCheckoutRoutes(app);

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 4000);
  createApp().listen(port, () => {
    console.log(`API ready on http://localhost:${port}`);
  });
}