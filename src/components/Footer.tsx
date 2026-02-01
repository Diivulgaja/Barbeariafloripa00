import { MapPin, Phone, Clock, MessageCircle, Instagram, Facebook, Lock } from 'lucide-react';
import { BUSINESS_CONFIG } from '@/types/barbershop';

export function Footer() {
  const whatsappLink = `https://wa.me/${BUSINESS_CONFIG.whatsapp}`;

  return (
    <section id="contact" className="py-20 relative bg-background border-t border-border">
      <div className="container mx-auto px-6">
        {/* Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary uppercase tracking-widest mb-2 font-display">
            Visite o Nosso Salão
          </h2>
          <div className="w-2 h-2 bg-primary rotate-45 mx-auto mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <div className="w-full h-[500px] rounded-xl overflow-hidden border border-border shadow-2xl relative group">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3536.637373406206!2d-48.58682292359783!3d-27.57375622325357!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9527387343053805%3A0xc3f83732e783a62!2sR.%20Irm%C3%A3%20Bonavita%2C%20123%20-%20Capoeiras%2C%20Florian%C3%B3polis%20-%20SC%2C%2088070-630!5e0!3m2!1spt-BR!2sbr!4v1707248382745!5m2!1spt-BR!2sbr"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="group-hover:filter-none transition-all duration-500"
            />
            <div className="absolute inset-0 border-4 border-primary/10 pointer-events-none rounded-xl" />
          </div>

          {/* Info */}
          <div className="space-y-10">
            <div className="space-y-8">
              {/* Address */}
              <InfoItem
                icon={MapPin}
                title="Endereço"
                content={
                  <>
                    {BUSINESS_CONFIG.address}<br />
                    {BUSINESS_CONFIG.city}<br />
                    CEP: 88070-630
                  </>
                }
              />

              {/* Phone */}
              <InfoItem
                icon={Phone}
                title="Telefone"
                content={
                  <>
                    (48) 9668-9199<br />
                    (48) 3222-0000
                  </>
                }
              />

              {/* Hours */}
              <InfoItem
                icon={Clock}
                title="Horário de Funcionamento"
                content={
                  <div className="space-y-2">
                    <div className="flex justify-between w-64 border-b border-border pb-1">
                      <span>Segunda a Sexta:</span>
                      <span className="text-foreground font-medium">09:00 - 20:00</span>
                    </div>
                    <div className="flex justify-between w-64 border-b border-border pb-1">
                      <span>Sábado:</span>
                      <span className="text-foreground font-medium">09:00 - 18:00</span>
                    </div>
                    <div className="flex justify-between w-64">
                      <span>Domingo:</span>
                      <span className="text-primary font-bold">Fechado</span>
                    </div>
                  </div>
                }
              />
            </div>

            {/* WhatsApp Box */}
            <div className="border border-border bg-secondary/30 rounded-xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-500">
                <MessageCircle className="w-24 h-24 text-foreground" />
              </div>
              <div className="relative z-10">
                <h4 className="text-foreground font-bold uppercase tracking-wider text-sm mb-2">
                  Dúvidas ou Cancelamentos
                </h4>
                <p className="text-muted-foreground text-xs mb-6 max-w-xs">
                  WhatsApp apenas para dúvidas ou cancelamentos. Agendamentos são feitos pelo site!
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-lg text-center transition-all shadow-lg shadow-green-900/20 transform hover:-translate-y-1"
                >
                  <div className="flex items-center justify-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Chamar no WhatsApp
                  </div>
                </a>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a
                href={`https://instagram.com/${BUSINESS_CONFIG.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 bg-secondary hover:bg-primary border border-border hover:border-primary rounded-lg flex items-center justify-center text-muted-foreground hover:text-primary-foreground transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-12 h-12 bg-secondary hover:bg-blue-600 border border-border hover:border-blue-500 rounded-lg flex items-center justify-center text-muted-foreground hover:text-white transition-all duration-300"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-border mt-20 pt-8 flex flex-col md:flex-row justify-between items-center text-muted-foreground text-xs gap-4">
          <p>&copy; 2026 {BUSINESS_CONFIG.name}. Todos os direitos reservados.</p>
          <div className="flex items-center gap-2 text-muted-foreground/60">
            <Lock className="w-3 h-3" />
            <span>Site 100% seguro</span>
          </div>
        </div>
      </div>
    </section>
  );
}

interface InfoItemProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  content: React.ReactNode;
}

function InfoItem({ icon: Icon, title, content }: InfoItemProps) {
  return (
    <div className="flex gap-6">
      <div className="w-12 h-12 rounded-lg border border-primary/30 flex items-center justify-center text-primary shrink-0 bg-primary/5">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h4 className="text-foreground font-bold uppercase tracking-wider text-sm mb-2">{title}</h4>
        <div className="text-muted-foreground text-sm leading-relaxed">{content}</div>
      </div>
    </div>
  );
}
