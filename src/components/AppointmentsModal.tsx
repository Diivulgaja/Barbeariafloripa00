import { X, Calendar, Plus, MessageCircle, Clock, Scissors, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppointments } from '@/hooks/useAppointments';
import { useAuth } from '@/hooks/useAuth';
import { BUSINESS_CONFIG } from '@/types/barbershop';
import { formatDate } from '@/lib/timeUtils';

interface AppointmentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewBooking: () => void;
}

export function AppointmentsModal({ isOpen, onClose, onNewBooking }: AppointmentsModalProps) {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments();

  if (!isOpen || !user) return null;

  const whatsappLink = `https://wa.me/${BUSINESS_CONFIG.whatsapp}`;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado': return 'text-green-500 bg-green-500/10';
      case 'pendente': return 'text-yellow-500 bg-yellow-500/10';
      case 'concluido': return 'text-blue-500 bg-blue-500/10';
      case 'cancelado': return 'text-red-500 bg-red-500/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const formatAppointmentDate = (dateStr: string) => {
    const date = new Date(dateStr + 'T00:00:00');
    return formatDate(date);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />

      <div className="glass-panel w-full max-w-2xl rounded-2xl shadow-2xl relative z-10 flex flex-col max-h-[80vh] overflow-hidden animate-scale-up border border-border bg-card">
        {/* Header */}
        <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="text-primary w-5 h-5" /> Meus Agendamentos
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Actions Bar */}
        <div className="p-4 border-b border-border bg-secondary/20">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
              Cancelar: somente via WhatsApp.
            </p>
            <Button onClick={onNewBooking} className="gradient-gold text-primary-foreground font-bold">
              <Plus className="w-4 h-4 mr-2" /> Novo Agendamento
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex justify-center p-10">
              <div className="loader" />
            </div>
          ) : appointments && appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map(appointment => (
                <div key={appointment.id} className="glass-card p-5 rounded-xl">
                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <div className="flex-1">
                      {/* Service */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-primary">
                          <Scissors className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">
                            {appointment.service?.name || 'Serviço'}
                          </h4>
                          <p className="text-xs text-primary font-bold">
                            R$ {appointment.service?.price || '0'}
                          </p>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{formatAppointmentDate(appointment.appointment_date)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.appointment_time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground col-span-2">
                          <User className="w-4 h-4" />
                          <span>{appointment.barber?.name || 'Profissional'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Actions */}
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>

                      {(appointment.status === 'confirmado' || appointment.status === 'pendente') && (
                        <a
                          href={`${whatsappLink}?text=${encodeURIComponent(
                            `Olá! Gostaria de cancelar/reagendar meu horário de ${appointment.service?.name} no dia ${formatAppointmentDate(appointment.appointment_date)} às ${appointment.appointment_time}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          <MessageCircle className="w-3 h-3" />
                          Cancelar/Reagendar
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <h4 className="text-lg font-bold text-foreground mb-2">Nenhum agendamento</h4>
              <p className="text-muted-foreground text-sm mb-6">
                Você ainda não tem agendamentos.
              </p>
              <Button onClick={onNewBooking} className="gradient-gold text-primary-foreground">
                Fazer primeiro agendamento
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
