import express from 'express';
import { registerServiceRoutes } from './modules/services/routes.js';
import { registerBookingRoutes } from './modules/bookings/routes.js';
import { registerTenancyRoutes } from './modules/tenancy/routes.js';

export function createApp() {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ ok: true, uptime: process.uptime() });
  });

  registerTenancyRoutes(app);
  registerServiceRoutes(app);
  registerBookingRoutes(app);

  return app;
}

if (process.env.NODE_ENV !== 'test') {
  const port = Number(process.env.PORT || 4000);
  createApp().listen(port, () => {
    console.log(`API ready on http://localhost:${port}`);
  });
}