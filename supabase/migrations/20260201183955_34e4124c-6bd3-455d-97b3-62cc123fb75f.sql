-- Criar enum para status de agendamento
CREATE TYPE public.appointment_status AS ENUM ('pendente', 'confirmado', 'concluido', 'cancelado');

-- Tabela de perfis de usuário
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de barbeiros
CREATE TABLE public.barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'Barbeiro',
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de serviços
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 30,
  category TEXT NOT NULL DEFAULT 'corte',
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tabela de agendamentos
CREATE TABLE public.appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id),
  barber_id UUID NOT NULL REFERENCES public.barbers(id),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  status appointment_status NOT NULL DEFAULT 'confirmado',
  client_name TEXT NOT NULL,
  client_phone TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Habilitar RLS em todas as tabelas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para profiles
CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Políticas RLS para barbers (público pode ver)
CREATE POLICY "Qualquer pessoa pode ver barbeiros ativos"
  ON public.barbers FOR SELECT
  USING (is_active = true);

-- Políticas RLS para services (público pode ver)
CREATE POLICY "Qualquer pessoa pode ver serviços ativos"
  ON public.services FOR SELECT
  USING (is_active = true);

-- Políticas RLS para appointments
CREATE POLICY "Usuários podem ver seus próprios agendamentos"
  ON public.appointments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem criar seus próprios agendamentos"
  ON public.appointments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios agendamentos"
  ON public.appointments FOR UPDATE
  USING (auth.uid() = user_id);

-- Trigger para criar perfil automaticamente ao cadastrar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON public.appointments
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Inserir dados iniciais de barbeiros
INSERT INTO public.barbers (name, role, image_url) VALUES
  ('Ricardo Silva', 'Master Barber', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&h=500&fit=crop'),
  ('André Costa', 'Fade Expert', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=500&fit=crop');

-- Inserir dados iniciais de serviços
INSERT INTO public.services (name, description, price, duration_min, category, is_popular) VALUES
  ('Corte Navalhado', 'Corte tradicional com acabamento na navalha para um visual impecável.', 45, 30, 'corte', true),
  ('Barba Completa', 'Aparar, desenhar e toalha quente para barba perfeita.', 35, 25, 'barba', false),
  ('Corte + Barba', 'Combo clássico: corte moderno + barba desenhada.', 70, 50, 'combo', true),
  ('Degradê (Fade)', 'Degradê moderno com precisão milimétrica.', 55, 40, 'corte', true),
  ('Sobrancelha', 'Design e limpeza de sobrancelhas masculinas.', 20, 15, 'adicional', false),
  ('Hidratação Capilar', 'Tratamento profundo para cabelos ressecados.', 40, 30, 'tratamento', false);