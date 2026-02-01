import { Users, Scissors } from 'lucide-react';
import { useBarbers } from '@/hooks/useBarbers';

interface TeamSectionProps {
  onOpenBooking: () => void;
}

export function TeamSection({ onOpenBooking }: TeamSectionProps) {
  const { data: barbers, isLoading } = useBarbers();

  return (
    <section id="team" className="py-16 md:py-24 bg-zinc-925">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-xs font-bold uppercase tracking-[0.3em]">Especialistas</span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4">
            Mestres da <span className="text-primary">Navalha</span>
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton h-96 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {barbers?.map(barber => (
              <div key={barber.id} className="glass-card rounded-2xl overflow-hidden group">
                <div className="relative overflow-hidden aspect-square">
                  {barber.image_url ? (
                    <img 
                      src={barber.image_url} 
                      alt={barber.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-secondary flex items-center justify-center">
                      <Scissors className="w-16 h-16 text-primary/30" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-6 left-6">
                    <h3 className="text-xl font-bold text-foreground">{barber.name}</h3>
                    <p className="text-primary text-xs font-bold uppercase tracking-widest mt-1">{barber.role}</p>
                  </div>
                </div>
                <div className="p-6 border-t border-border">
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Profissional especializado no padrão Ricardo Barbershop.
                  </p>
                </div>
              </div>
            ))}

            {/* Call to Action Card */}
            <div className="glass-card rounded-2xl border-dashed border-2 border-border flex flex-col items-center justify-center p-10 text-center">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-primary mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-foreground">Equipe Completa</h3>
              <p className="text-muted-foreground text-xs mt-2">
                Profissionais treinados no padrão de qualidade Ricardo.
              </p>
              <button 
                onClick={onOpenBooking}
                className="mt-6 text-primary font-bold uppercase text-[10px] tracking-widest hover:underline"
              >
                Ver disponibilidade
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
