import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Service } from '@/types/barbershop';

export function useServices() {
  return useQuery({
    queryKey: ['services'],
    queryFn: async (): Promise<Service[]> => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('is_active', true)
        .order('is_popular', { ascending: false })
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
  });
}
