-- Tabela para registrar vendas recebidas via webhook da Cakto
CREATE TABLE public.vendas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  evento TEXT,
  status TEXT,
  nome_cliente TEXT,
  email_cliente TEXT,
  valor NUMERIC,
  moeda TEXT DEFAULT 'BRL',
  produto TEXT,
  transacao_id TEXT,
  payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- RLS: apenas usuários autenticados (admins) podem ver as vendas
ALTER TABLE public.vendas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view vendas"
ON public.vendas FOR SELECT
USING (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can insert vendas"
ON public.vendas FOR INSERT
WITH CHECK (true);
