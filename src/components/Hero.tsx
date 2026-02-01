import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onOpenBooking: () => void;
}

export function Hero({ onOpenBooking }: HeroProps) {
  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-background/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
      </div>

      <div className="container mx-auto px-6 relative z-10 pt-24 md:pt-20">
        <div className="max-w-3xl animate-fade-in-up text-center md:text-left">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass-panel mb-6 border border-primary/30">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-medium text-primary uppercase tracking-wider">
              Agendamento 100% online
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl md:text-8xl font-bold text-foreground leading-[1.1] md:leading-[0.9] mb-6 md:mb-8 tracking-tight">
            Domine <br />
            <span className="text-gradient-gold">Seu Estilo.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-muted-foreground text-base md:text-xl mb-8 md:mb-10 leading-relaxed max-w-lg font-light mx-auto md:mx-0">
            Agende pelo site em segundos. Pagamento <strong className="text-foreground">apenas no local</strong>. 
            WhatsApp somente para dúvidas ou cancelamentos.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-12">
            <Button 
              onClick={onOpenBooking}
              size="lg"
              className="btn-glow gradient-gold text-primary-foreground font-bold py-6 px-8 rounded-xl shadow-lg shadow-primary/40 group"
            >
              Agendar Agora 
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="glass-panel hover:bg-white/5 text-foreground border-border font-bold py-6 px-8 rounded-xl"
            >
              Conhecer Serviços
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border max-w-lg mx-auto md:mx-0">
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-foreground">+5 Anos</p>
              <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-bold">De História</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-foreground">12k+</p>
              <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-bold">Cortes Feitos</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-2xl font-bold text-foreground">4.9/5</p>
              <p className="text-[0.6rem] text-muted-foreground uppercase tracking-widest font-bold">Avaliação</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
