import { Icon } from '../ui/Icon';
import { WHATSAPP_URL } from './shared';

export function FloatingWhatsApp() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat WhatsApp admin WashCut"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-full bg-[#25D366] px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/25 transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
    >
      <Icon name="whatsapp" size={22} filled />
      <span className="hidden sm:inline">Tanya Admin</span>
    </a>
  );
}
