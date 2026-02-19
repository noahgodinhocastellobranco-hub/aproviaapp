-- Adiciona campo is_premium na tabela profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_premium boolean NOT NULL DEFAULT false;

-- Habilita realtime para vendas
ALTER PUBLICATION supabase_realtime ADD TABLE public.vendas;
