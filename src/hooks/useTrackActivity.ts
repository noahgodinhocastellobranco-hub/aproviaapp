import { supabase } from "@/integrations/supabase/client";

/**
 * Chama a função do banco para incrementar +1 na atividade do usuário hoje.
 * Chame isso em qualquer ação relevante no app (envio de redação, chat, simulado, etc.)
 */
export async function trackActivity() {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) return;
  await supabase.rpc("increment_user_activity", { p_user_id: session.user.id });
}
