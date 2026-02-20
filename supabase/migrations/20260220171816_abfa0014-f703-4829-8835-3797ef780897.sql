
-- Tabela de notificações/avisos globais enviados pelo admin
CREATE TABLE public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT NOT NULL DEFAULT 'info', -- info | warning | success
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by TEXT
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Todos usuários autenticados podem ler notificações ativas
CREATE POLICY "Usuários autenticados podem ver notificações"
ON public.admin_notifications
FOR SELECT
TO authenticated
USING (ativo = true);

-- Apenas admins podem criar/atualizar/deletar notificações
CREATE POLICY "Admins podem inserir notificações"
ON public.admin_notifications
FOR INSERT
TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem atualizar notificações"
ON public.admin_notifications
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins podem deletar notificações"
ON public.admin_notifications
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'));

-- Adicionar coluna deleted_at em profiles para "soft delete"
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Admins podem ver TODOS os profiles (necessário para painel admin)
CREATE POLICY "Admins podem ver todos os profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  auth.uid() = id OR has_role(auth.uid(), 'admin')
);

-- Admins podem atualizar qualquer profile
CREATE POLICY "Admins podem atualizar qualquer profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (
  auth.uid() = id OR has_role(auth.uid(), 'admin')
);
