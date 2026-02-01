export interface Service {
  id: string;
  name: string;
  description: string | null;
  price: number;
  duration_min: number;
  category: string;
  is_popular: boolean;
  is_active: boolean;
  created_at: string;
}

export interface Barber {
  id: string;
  name: string;
  role: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Appointment {
  id: string;
  user_id: string;
  service_id: string;
  barber_id: string;
  appointment_date: string;
  appointment_time: string;
  status: 'pendente' | 'confirmado' | 'concluido' | 'cancelado';
  client_name: string;
  client_phone: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined data
  service?: Service;
  barber?: Barber;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingData {
  service: Service | null;
  barber: Barber | null;
  date: Date | null;
  time: string | null;
  clientName: string;
  clientPhone: string;
  notes: string;
}

export interface BusinessConfig {
  name: string;
  city: string;
  address: string;
  whatsapp: string;
  instagram: string;
  openingHours: Record<number, { start: string; end: string } | null>;
  breaks: Record<number, { start: string; end: string }[]>;
  slotMinutes: number;
}

export const BUSINESS_CONFIG: BusinessConfig = {
  name: "Ricardo Barbershop",
  city: "Florianópolis - SC",
  address: "Rua Irmã Bonavita, 123",
  whatsapp: "554896689199",
  instagram: "diivulgaja",
  openingHours: {
    0: null, // Domingo fechado
    1: { start: "09:00", end: "20:00" },
    2: { start: "09:00", end: "20:00" },
    3: { start: "09:00", end: "20:00" },
    4: { start: "09:00", end: "20:00" },
    5: { start: "09:00", end: "20:00" },
    6: { start: "09:00", end: "18:00" },
  },
  breaks: {
    0: [],
    1: [{ start: "12:00", end: "13:00" }],
    2: [{ start: "12:00", end: "13:00" }],
    3: [{ start: "12:00", end: "13:00" }],
    4: [{ start: "12:00", end: "13:00" }],
    5: [{ start: "12:00", end: "13:00" }],
    6: [{ start: "12:00", end: "13:00" }],
  },
  slotMinutes: 30,
};
