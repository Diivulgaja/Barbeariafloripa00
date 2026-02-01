import { Shield, Scissors, Heart, Star } from 'lucide-react';

export function AboutSection() {
  return (
    <section id="about" className="py-20 relative bg-background overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Text */}
          <div>
            <span className="text-primary font-bold tracking-widest text-xs uppercase mb-2 block">
              Nossa História
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6 font-display leading-tight">
              FORJADOS NA <br />
              <span className="text-primary">TRADIÇÃO & ESTILO</span>
            </h2>

            {/* Golden Divider */}
            <div className="flex items-center gap-2 mb-8">
              <div className="w-2 h-2 bg-primary rotate-45" />
              <div className="h-px w-24 bg-gradient-to-r from-primary to-transparent" />
            </div>

            <div className="space-y-6 text-muted-foreground leading-relaxed text-sm md:text-base">
              <p>
                A <strong className="text-foreground">Ricardo Barbershop</strong> nasceu da paixão por unir 
                a tradição da barbearia clássica com a força e determinação do homem moderno. 
                Desde o início, temos sido o destino de quem valoriza não apenas um corte de cabelo, 
                mas uma experiência completa.
              </p>
              <p>
                Nosso espaço foi projetado para transportá-lo a uma atmosfera única. Aqui, você não é 
                apenas um cliente — é um parceiro que merece o melhor atendimento de Florianópolis.
              </p>
              <p>
                Com uma equipe de barbeiros altamente qualificados, garantimos que cada visita seja 
                uma jornada de transformação e bem-estar.
              </p>
            </div>

            {/* Quote */}
            <div className="mt-10 p-6 border-l-4 border-primary bg-secondary/30 rounded-r-xl relative">
              <p className="text-foreground italic font-medium text-lg font-display">
                "Mais que uma barbearia, um Lifestyle. Domine seu estilo com quem entende do assunto."
              </p>
              <p className="text-primary text-xs font-bold mt-3 uppercase tracking-wider">
                — Equipe Ricardo
              </p>
            </div>
          </div>

          {/* Right Column: Values Cards */}
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <ValueCard 
                icon={Shield}
                title="Tradição"
                description="Honramos as técnicas clássicas da barbearia com um toque moderno."
              />
              <ValueCard 
                icon={Scissors}
                title="Precisão"
                description="Cada corte é executado com a precisão de um verdadeiro artesão."
              />
              <ValueCard 
                icon={Heart}
                title="Paixão"
                description="Amamos o que fazemos e isso se reflete em cada detalhe."
              />
              <ValueCard 
                icon={Star}
                title="Excelência"
                description="Buscamos a perfeição em cada serviço que oferecemos."
              />
            </div>

            {/* Stats Bar */}
            <div className="glass-panel p-8 rounded-xl border border-border flex justify-around items-center text-center relative overflow-hidden">
              <div className="absolute inset-0 gradient-gold-subtle" />
              <div className="relative z-10">
                <span className="block text-4xl font-bold text-foreground font-display mb-1">+5</span>
                <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Anos de História</span>
              </div>
              <div className="w-px h-12 bg-border relative z-10" />
              <div className="relative z-10">
                <span className="block text-4xl font-bold text-foreground font-display mb-1">12k+</span>
                <span className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold">Cortes Feitos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface ValueCardProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

function ValueCard({ icon: Icon, title, description }: ValueCardProps) {
  return (
    <div className="glass-panel p-6 rounded-xl border border-border hover:border-primary/30 transition-all duration-300 group hover:-translate-y-1">
      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="w-5 h-5" />
      </div>
      <h4 className="text-foreground font-bold mb-2 uppercase text-sm tracking-wider">{title}</h4>
      <p className="text-muted-foreground text-xs leading-relaxed">{description}</p>
    </div>
  );
}
