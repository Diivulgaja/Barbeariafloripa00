import { MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/types/barbershop';

export function WhatsAppFloat() {
  const whatsappLink = `https://wa.me/${BUSINESS_CONFIG.whatsapp}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-full glass-panel border border-border hover:border-primary/60 shadow-2xl text-foreground transition-all hover:-translate-y-1"
      aria-label="WhatsApp - Dúvidas ou Cancelar"
    >
      <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse-gold" />
      <div className="text-left leading-tight">
        <p className="text-xs text-muted-foreground">Dúvidas / Cancelar</p>
        <p className="text-sm font-bold">WhatsApp suporte</p>
      </div>
    </a>
  );
}
