import { useState, useEffect } from 'react';
import { X, Scissors, User, Calendar, Store, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServices } from '@/hooks/useServices';
import { useBarbers } from '@/hooks/useBarbers';
import { useUnavailableSlots, useCreateAppointment } from '@/hooks/useAppointments';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Service, Barber, BookingData } from '@/types/barbershop';
import { buildTimeSlots, getLocalDateString, formatDate } from '@/lib/timeUtils';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNeedAuth: () => void;
  initialService?: Service | null;
}

export function BookingModal({ isOpen, onClose, onNeedAuth, initialService }: BookingModalProps) {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    service: null,
    barber: null,
    date: null,
    time: null,
    clientName: '',
    clientPhone: '',
    notes: '',
  });

  const { user, profile } = useAuth();
  const { data: services } = useServices();
  const { data: barbers } = useBarbers();
  const { toast } = useToast();
  const createAppointment = useCreateAppointment();

  const dateString = bookingData.date ? getLocalDateString(bookingData.date) : null;
  const { data: unavailableSlots = [] } = useUnavailableSlots(
    dateString,
    bookingData.barber?.id || null
  );

  // Set initial service if provided
  useEffect(() => {
    if (initialService && isOpen) {
      setBookingData(prev => ({ ...prev, service: initialService }));
      if (user) setStep(2);
    }
  }, [initialService, isOpen, user]);

  // Pre-fill user data
  useEffect(() => {
    if (user && isOpen) {
      const savedName = localStorage.getItem('client_name') || profile?.full_name || '';
      const savedPhone = localStorage.getItem('client_phone') || profile?.phone || '';
      setBookingData(prev => ({
        ...prev,
        clientName: savedName,
        clientPhone: savedPhone,
      }));
    }
  }, [user, profile, isOpen]);

  // Check auth on open
  useEffect(() => {
    if (isOpen && !user) {
      onNeedAuth();
      return;
    }
  }, [isOpen, user, onNeedAuth]);

  // Reset on close
  const handleClose = () => {
    setStep(1);
    setBookingData({
      service: null,
      barber: null,
      date: null,
      time: null,
      clientName: '',
      clientPhone: '',
      notes: '',
    });
    onClose();
  };

  const selectService = (service: Service) => {
    setBookingData(prev => ({ ...prev, service, time: null }));
    setStep(2);
  };

  const selectBarber = (barber: Barber) => {
    setBookingData(prev => ({ ...prev, barber, time: null }));
    setStep(3);
  };

  const selectDate = (date: Date) => {
    setBookingData(prev => ({ ...prev, date, time: null }));
  };

  const selectTime = (time: string) => {
    if (unavailableSlots.includes(time)) {
      toast({ variant: 'destructive', title: 'Horário indisponível' });
      return;
    }
    setBookingData(prev => ({ ...prev, time }));
    setStep(4);
  };

  const handleConfirm = async () => {
    if (!bookingData.clientName.trim()) {
      toast({ variant: 'destructive', title: 'Informe seu nome' });
      return;
    }

    // Save to localStorage for future
    localStorage.setItem('client_name', bookingData.clientName.trim());
    if (bookingData.clientPhone) {
      localStorage.setItem('client_phone', bookingData.clientPhone.trim());
    }

    try {
      await createAppointment.mutateAsync(bookingData);
      toast({ title: 'Agendamento confirmado!' });
      setStep(5);
    } catch (error) {
      toast({ 
        variant: 'destructive', 
        title: 'Erro ao agendar',
        description: 'Tente novamente.',
      });
    }
  };

  const prevStep = () => setStep(Math.max(1, step - 1));

  if (!isOpen || !user) return null;

  const timeSlots = bookingData.date && bookingData.service
    ? buildTimeSlots(bookingData.date, bookingData.service.duration_min, unavailableSlots)
    : [];

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={handleClose} />

      <div className="glass-panel w-full max-w-4xl rounded-2xl shadow-2xl relative z-10 flex flex-col md:flex-row max-h-[90vh] overflow-hidden animate-scale-up border border-border bg-card">
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-border flex justify-between items-center bg-secondary/30">
            <div>
              <h3 className="text-xl font-bold text-foreground">Novo Agendamento</h3>
              <p className="text-xs text-muted-foreground mt-1">
                {step === 1 && 'Escolha o serviço'}
                {step === 2 && 'Selecione o profissional'}
                {step === 3 && 'Escolha data e horário'}
                {step === 4 && 'Confirme seus dados'}
                {step === 5 && 'Confirmado!'}
              </p>
            </div>
            <button onClick={handleClose} className="p-2 hover:bg-white/10 rounded-full text-muted-foreground hover:text-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-border bg-secondary/20">
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="flex items-center">
                  <div className={`step-dot ${step >= i ? 'active' : ''} ${step > i ? 'completed' : ''}`}>
                    {step > i ? <Check className="w-3 h-3" /> : i}
                  </div>
                  {i < 4 && <div className={`step-line ${step > i ? 'completed' : ''}`} />}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="animate-fade-in-up pb-20 md:pb-0">
              {/* Step 1: Services */}
              {step === 1 && (
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-4">Escolha o Serviço</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {services?.map(s => (
                      <div
                        key={s.id}
                        onClick={() => selectService(s)}
                        className={`glass-card p-4 rounded-xl border border-border cursor-pointer flex justify-between items-center ${
                          bookingData.service?.id === s.id ? 'selected' : ''
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center text-primary">
                            <Scissors className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{s.name}</h4>
                            <p className="text-muted-foreground text-xs">{s.duration_min} min</p>
                          </div>
                        </div>
                        <span className="text-xl font-bold text-foreground">R$ {s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Barbers */}
              {step === 2 && (
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-4">Profissional</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {barbers?.map(b => (
                      <div
                        key={b.id}
                        onClick={() => selectBarber(b)}
                        className={`glass-card p-4 rounded-xl border border-border cursor-pointer flex items-center gap-4 ${
                          bookingData.barber?.id === b.id ? 'selected' : ''
                        }`}
                      >
                        <div className="w-14 h-14 rounded-full bg-secondary overflow-hidden border-2 border-border">
                          {b.image_url ? (
                            <img src={b.image_url} alt={b.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <User className="w-6 h-6 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{b.name}</h4>
                          <p className="text-xs text-primary font-bold uppercase">{b.role}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 3: Date & Time */}
              {step === 3 && (
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-4">Data e Hora</h4>
                  
                  <Input
                    type="date"
                    value={dateString || ''}
                    onChange={(e) => {
                      const [y, m, d] = e.target.value.split('-').map(Number);
                      selectDate(new Date(y, m - 1, d));
                    }}
                    min={getLocalDateString(new Date())}
                    className="w-full glass-input rounded-xl p-4 mb-6"
                  />

                  {bookingData.date && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {formatDate(bookingData.date)}
                      </p>
                      
                      {timeSlots.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                          {timeSlots.map(slot => (
                            <button
                              key={slot.time}
                              onClick={() => slot.status === 'available' && selectTime(slot.time)}
                              disabled={slot.status !== 'available'}
                              className={`slot-btn ${bookingData.time === slot.time ? 'selected' : ''}`}
                            >
                              {slot.status !== 'available' ? (
                                <span className="line-through opacity-50">{slot.time}</span>
                              ) : (
                                slot.time
                              )}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-10 text-muted-foreground border border-border rounded-xl">
                          <p className="font-bold text-primary mb-2">Sem horários disponíveis</p>
                          <p className="text-xs">Estamos fechados neste dia ou os horários já passaram.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Confirmation */}
              {step === 4 && (
                <div>
                  <h4 className="text-2xl font-bold text-foreground mb-4">Confirmação</h4>
                  <div className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground">Nome</label>
                      <Input
                        value={bookingData.clientName}
                        onChange={(e) => setBookingData(prev => ({ ...prev, clientName: e.target.value }))}
                        className="glass-input rounded-xl py-3 px-4"
                        placeholder="Seu nome"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-muted-foreground">WhatsApp (opcional)</label>
                      <Input
                        value={bookingData.clientPhone}
                        onChange={(e) => setBookingData(prev => ({ ...prev, clientPhone: e.target.value }))}
                        className="glass-input rounded-xl py-3 px-4"
                        placeholder="(00) 00000-0000"
                      />
                    </div>
                    <div className="bg-secondary/50 p-4 rounded-xl border border-border">
                      <Store className="text-primary inline mr-2 w-4 h-4" />
                      Pagamento no local
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Success */}
              {step === 5 && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 mx-auto">
                    <Check className="w-10 h-10 text-green-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground">Confirmado!</h3>
                  <p className="text-muted-foreground mt-2 mb-8">
                    Seu horário foi reservado com sucesso.
                  </p>
                  <Button onClick={handleClose} className="gradient-gold text-primary-foreground">
                    Fechar
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions (Mobile) */}
          {step < 5 && (
            <div className="md:hidden p-4 border-t border-border bg-secondary/50 flex justify-between items-center">
              <div>
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="font-bold text-foreground text-lg">
                  {bookingData.service ? `R$ ${bookingData.service.price}` : 'R$ 0'}
                </p>
              </div>
              <div className="flex gap-2">
                {step > 1 && (
                  <Button variant="outline" onClick={prevStep} size="sm">
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                {step === 4 && (
                  <Button 
                    onClick={handleConfirm} 
                    disabled={createAppointment.isPending}
                    className="gradient-gold text-primary-foreground"
                  >
                    {createAppointment.isPending ? <span className="loader" /> : 'Confirmar'}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Summary (Desktop) */}
        <div className="hidden md:flex w-80 border-l border-border flex-col bg-secondary/30">
          <div className="p-6 border-b border-border">
            <h4 className="font-bold text-foreground mb-1">Resumo</h4>
            <p className="text-xs text-muted-foreground">Detalhes do seu agendamento</p>
          </div>

          <div className="flex-1 p-6 space-y-6">
            <SummaryItem
              icon={Scissors}
              label="Serviço"
              value={bookingData.service?.name || 'Nenhum selecionado'}
              subvalue={bookingData.service ? `R$ ${bookingData.service.price}` : undefined}
              highlight
            />
            <SummaryItem
              icon={User}
              label="Profissional"
              value={bookingData.barber?.name || '--'}
            />
            <SummaryItem
              icon={Calendar}
              label="Data e Hora"
              value={bookingData.date && bookingData.time 
                ? `${formatDate(bookingData.date)} às ${bookingData.time}`
                : '--'
              }
            />
            <SummaryItem
              icon={Store}
              label="Pagamento"
              value="No Local"
            />

            <div className="bg-white/5 border border-border rounded-xl p-4 text-xs text-muted-foreground">
              WhatsApp é apenas para <strong>dúvidas/cancelamentos</strong>.
            </div>
          </div>

          <div className="p-6 border-t border-border">
            <div className="flex justify-between items-end mb-4">
              <span className="text-muted-foreground text-sm">Total</span>
              <span className="text-2xl font-bold text-foreground">
                {bookingData.service ? `R$ ${bookingData.service.price}` : 'R$ 0'}
              </span>
            </div>
            
            {step > 1 && step < 5 && (
              <Button variant="outline" onClick={prevStep} className="w-full mb-2">
                <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
              </Button>
            )}
            
            {step === 4 && (
              <Button 
                onClick={handleConfirm}
                disabled={createAppointment.isPending}
                className="w-full gradient-gold text-primary-foreground"
              >
                {createAppointment.isPending ? <span className="loader" /> : 'Confirmar Agendamento'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

interface SummaryItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  subvalue?: string;
  highlight?: boolean;
}

function SummaryItem({ icon: Icon, label, value, subvalue, highlight }: SummaryItemProps) {
  return (
    <div className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center shrink-0 border border-border">
        <Icon className={`w-4 h-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
      </div>
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className={`text-sm font-medium leading-tight ${highlight ? 'text-foreground font-bold' : 'text-muted-foreground'}`}>
          {value}
        </p>
        {subvalue && <p className="text-xs text-primary font-medium mt-1">{subvalue}</p>}
      </div>
    </div>
  );
}
