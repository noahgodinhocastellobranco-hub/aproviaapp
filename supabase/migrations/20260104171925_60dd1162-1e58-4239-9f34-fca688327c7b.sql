-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nome)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data ->> 'nome');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Results table for ENEM exams
CREATE TABLE public.resultados_provas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  area TEXT NOT NULL,
  nota DECIMAL(5,2) NOT NULL,
  acertos INTEGER NOT NULL,
  total_questoes INTEGER NOT NULL,
  tempo_gasto INTEGER, -- em segundos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.resultados_provas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own results" ON public.resultados_provas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own results" ON public.resultados_provas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Results table for redações
CREATE TABLE public.resultados_redacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  tema TEXT NOT NULL,
  nota_total DECIMAL(5,2) NOT NULL,
  competencia_1 DECIMAL(3,0),
  competencia_2 DECIMAL(3,0),
  competencia_3 DECIMAL(3,0),
  competencia_4 DECIMAL(3,0),
  competencia_5 DECIMAL(3,0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.resultados_redacoes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own redacoes" ON public.resultados_redacoes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own redacoes" ON public.resultados_redacoes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Study time tracking
CREATE TABLE public.tempo_estudo (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  materia TEXT NOT NULL,
  minutos INTEGER NOT NULL,
  data DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.tempo_estudo ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own study time" ON public.tempo_estudo
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own study time" ON public.tempo_estudo
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Index for performance
CREATE INDEX idx_resultados_provas_user_date ON public.resultados_provas(user_id, created_at);
CREATE INDEX idx_resultados_redacoes_user_date ON public.resultados_redacoes(user_id, created_at);
CREATE INDEX idx_tempo_estudo_user_date ON public.tempo_estudo(user_id, data);