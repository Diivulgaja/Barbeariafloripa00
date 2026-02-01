import { useState } from 'react';
import { Search, ArrowRight, Scissors } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServices } from '@/hooks/useServices';
import { Service } from '@/types/barbershop';

interface ServicesSectionProps {
  onSelectService: (service: Service) => void;
}

export function ServicesSection({ onSelectService }: ServicesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: services, isLoading } = useServices();

  const filteredServices = services?.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <section id="services" className="py-16 md:py-28 relative">
      {/* Decorative glow */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="container mx-auto px-6 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-10 md:mb-14 gap-6">
          <div>
            <h3 className="text-primary font-bold uppercase tracking-widest text-xs mb-3">Nossa Expertise</h3>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">Menu de Serviços</h2>
          </div>

          <div className="w-full md:w-auto flex flex-col md:items-end gap-3">
            <p className="text-muted-foreground max-w-sm text-sm md:text-base">
              Técnicas clássicas com tendências modernas.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar serviço..."
                  className="glass-input rounded-full py-2.5 pl-10 pr-4 text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton h-64 rounded-2xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map(service => (
              <ServiceCard 
                key={service.id} 
                service={service} 
                onSelect={() => onSelectService(service)}
              />
            ))}
          </div>
        )}

        {filteredServices.length === 0 && !isLoading && (
          <div className="text-center py-12 text-muted-foreground">
            Nenhum serviço encontrado.
          </div>
        )}
      </div>
    </section>
  );
}

interface ServiceCardProps {
  service: Service;
  onSelect: () => void;
}

function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <div className="glass-card p-8 rounded-2xl group cursor-default relative overflow-hidden">
      {service.is_popular && (
        <span className="badge-popular">Popular</span>
      )}
      
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-white/5 rounded-xl text-primary border border-border">
          <Scissors className="w-5 h-5" />
        </div>
        <span className="text-xl font-bold text-foreground bg-secondary/80 px-4 py-1 rounded-full border border-border">
          R$ {service.price}
        </span>
      </div>

      <h3 className="text-xl font-bold text-foreground mb-2">{service.name}</h3>
      <p className="text-muted-foreground mb-2 text-sm min-h-[40px]">
        {service.description}
      </p>
      <p className="text-xs text-primary/70 mb-6">{service.duration_min} min</p>

      <button 
        onClick={onSelect}
        className="text-primary text-sm font-bold flex items-center gap-2 hover:gap-3 transition-all"
      >
        Reservar <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
