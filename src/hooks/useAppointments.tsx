import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Appointment, BookingData } from '@/types/barbershop';
import { useAuth } from './useAuth';

export function useAppointments() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['appointments', user?.id],
    queryFn: async (): Promise<Appointment[]> => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          service:services(*),
          barber:barbers(*)
        `)
        .eq('user_id', user.id)
        .order('appointment_date', { ascending: false });
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!user,
  });
}

export function useUnavailableSlots(date: string | null, barberId: string | null) {
  return useQuery({
    queryKey: ['unavailable-slots', date, barberId],
    queryFn: async (): Promise<string[]> => {
      if (!date) return [];
      
      let query = supabase
        .from('appointments')
        .select('appointment_time')
        .eq('appointment_date', date)
        .in('status', ['pendente', 'confirmado']);
      
      if (barberId) {
        query = query.eq('barber_id', barberId);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data?.map(a => a.appointment_time) || [];
    },
    enabled: !!date,
  });
}

export function useCreateAppointment() {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (booking: BookingData) => {
      if (!user || !booking.service || !booking.barber || !booking.date || !booking.time) {
        throw new Error('Dados incompletos para agendamento');
      }

      const appointmentDate = booking.date.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('appointments')
        .insert({
          user_id: user.id,
          service_id: booking.service.id,
          barber_id: booking.barber.id,
          appointment_date: appointmentDate,
          appointment_time: booking.time,
          client_name: booking.clientName.trim(),
          client_phone: booking.clientPhone.trim() || null,
          notes: booking.notes.trim() || null,
          status: 'confirmado',
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      queryClient.invalidateQueries({ queryKey: ['unavailable-slots'] });
    },
  });
}
