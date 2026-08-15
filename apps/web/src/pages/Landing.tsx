import { Navbar } from '../components/landing/Navbar';
import { Hero } from '../components/landing/Hero';
import { Problem } from '../components/landing/Problem';
import { Solution } from '../components/landing/Solution';
import { ProductOverview } from '../components/landing/ProductOverview';
import { BarbershopManagement, CarwashManagement } from '../components/landing/Management';
import { CustomerProfile } from '../components/landing/CustomerProfile';
import { Booking } from '../components/landing/Booking';
import { Queue } from '../components/landing/Queue';
import { Staff } from '../components/landing/Staff';
import { PosPayment } from '../components/landing/PosPayment';
import { Inventory } from '../components/landing/Inventory';
import { Analytics } from '../components/landing/Analytics';
import { Branches } from '../components/landing/Branches';
import { Mobile } from '../components/landing/Mobile';
import { Automation } from '../components/landing/Automation';
import { Retention } from '../components/landing/Retention';
import { Security } from '../components/landing/Security';
import { Pricing } from '../components/landing/Pricing';
import { Faq } from '../components/landing/Faq';
import { FinalCta } from '../components/landing/FinalCta';
import { Footer } from '../components/landing/Footer';
import { CtaBand } from '../components/landing/CtaBand';

export function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <ProductOverview />
        <div className="bg-ink-50">
          <div className="mx-auto max-w-6xl px-6 pb-4">
            <CtaBand
              title="Lihat modul yang relevan untuk bisnis Anda."
              sub="Pilih vertikal dan WASHCUT menyesuaikan diri."
            />
          </div>
        </div>
        <BarbershopManagement />
        <CarwashManagement />
        <CustomerProfile />
        <Booking />
        <Queue />
        <Staff />
        <PosPayment />
        <Inventory />
        <Analytics />
        <Branches />
        <Mobile />
        <Automation />
        <Retention />
        <Security />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
