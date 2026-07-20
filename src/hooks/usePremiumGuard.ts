import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function usePremiumGuard() {
  const navigate = useNavigate();
  const [checkingPremium, setCheckingPremium] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error("Entre na sua conta para acessar essa ferramenta.");
        navigate("/auth", { replace: true });
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium,email_verified")
        .eq("id", user.id)
        .maybeSingle();

      if (!profile?.email_verified) {
        toast.error("Verifique seu email com o código para continuar.");
        navigate("/auth", { replace: true, state: { email: user.email, requireOtp: true } });
        return;
      }

      if (!profile?.is_premium) {
        toast.error("Essa área é exclusiva para assinantes PRO.");
        navigate("/precos", { replace: true });
        return;
      }

      if (mounted) setCheckingPremium(false);
    };

    checkAccess();

    return () => {
      mounted = false;
    };
  }, [navigate]);

  return { checkingPremium };
}