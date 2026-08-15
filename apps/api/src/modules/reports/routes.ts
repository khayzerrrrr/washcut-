import { Router } from 'express';
import type { ReportPeriod, ReportSummary } from '@washcut/shared';
import { db } from '../../db.js';
import { authenticate, requireTenantAccess } from '../../auth/middleware.js';

const periods: ReportPeriod[] = ['today', '7d', '30d'];

export function registerReportsRoutes(router: Router) {
  router.get('/api/businesses/:businessId/reports', authenticate, requireTenantAccess, (req, res) => {
    const businessId = req.user!.businessId!;
    const biz = db.businesses.find((b) => b.id === businessId);
    if (!biz) return res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Tenant tidak ditemukan' } });

    const raw = req.query.period as string;
    const period: ReportPeriod = periods.includes(raw as ReportPeriod) ? (raw as ReportPeriod) : '7d';
    const days = period === 'today' ? 1 : period === '7d' ? 7 : 30;
    const end = Date.now();
    const start = end - (days - 1) * 86400000;

    const completed = db.bookings.filter((b) => {
      if (b.businessId !== businessId || b.status !== 'completed') return false;
      const t = new Date(b.startsAt).getTime();
      return t >= start && t <= end;
    });

    const revenue = completed.reduce((s, b) => s + b.amount, 0);
    const transactions = completed.length;
    const customers = new Set(completed.map((b) => b.customerId)).size;
    const avgTransaction = transactions ? Math.round(revenue / transactions) : 0;
    const commission = biz.commissionEnabled ? Math.round((revenue * (biz.commissionRate ?? 0)) / 100) : 0;
    const profit = revenue - commission;

    const dayMap = new Map<string, number>();
    const serviceMap = new Map<string, { name: string; count: number; revenue: number }>();
    const staffMap = new Map<string, { name: string; revenue: number; servicesCompleted: number }>();
    for (const b of completed) {
      const day = b.startsAt.slice(0, 10);
      dayMap.set(day, (dayMap.get(day) ?? 0) + b.amount);

      const s = serviceMap.get(b.serviceName) ?? { name: b.serviceName, count: 0, revenue: 0 };
      s.count += 1;
      s.revenue += b.amount;
      serviceMap.set(b.serviceName, s);

      if (b.staffName) {
        const st = staffMap.get(b.staffName) ?? { name: b.staffName, revenue: 0, servicesCompleted: 0 };
        st.revenue += b.amount;
        st.servicesCompleted += 1;
        staffMap.set(b.staffName, st);
      }
    }

    const report: ReportSummary = {
      revenue,
      transactions,
      customers,
      avgTransaction,
      commission,
      profit,
      revenueByDay: [...dayMap.entries()]
        .map(([day, value]) => ({ day, revenue: value }))
        .sort((a, b) => a.day.localeCompare(b.day)),
      topServices: [...serviceMap.values()].sort((a, b) => b.revenue - a.revenue).slice(0, 5),
      staffPerformance: [...staffMap.values()].sort((a, b) => b.revenue - a.revenue),
    };
    res.json({ ok: true, data: report });
  });
}
