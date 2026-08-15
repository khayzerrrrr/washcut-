import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useParams } from 'react-router-dom';
import type { Business } from '@washcut/shared';
import { api } from './lib/api';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { BusinessSelect } from './pages/BusinessSelect';
import { Dashboard } from './pages/Dashboard';
import { Services } from './pages/Services';
import { Customers } from './pages/Customers';
import { Bookings } from './pages/Bookings';
import { Checkout } from './pages/Checkout';
import { AppLayout } from './components/layout/AppLayout';

function BusinessGate() {
  const { businessId } = useParams();
  const [business, setBusiness] = useState<Business | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    api.getBusiness(businessId!).then((r) => (r.ok ? setBusiness(r.data) : setMissing(true)));
  }, [businessId]);

  if (missing) return <div className="p-10 text-center text-ink-500">Bisnis tidak ditemukan.</div>;
  if (!business) return <div className="p-10 text-center text-ink-400">Memuat...</div>;
  return <AppLayout business={business} />;
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/business" element={<BusinessSelect />} />
        <Route path="/app/:businessId" element={<BusinessGate />}>
          <Route index element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="customers" element={<Customers />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}