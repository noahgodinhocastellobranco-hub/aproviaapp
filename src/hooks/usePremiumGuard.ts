import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * Redirects unauthenticated users to /auth and non-premium users to /precos.
 * Returns `ready` = true only when the user is authenticated AND premium.
 */
export function usePremiumGuard() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        navigate("/auth");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", session.user.id)
        .single();

      if (!profile?.is_premium) {
        navigate("/precos");
        return;
      }

      setReady(true);
    });
  }, [navigate]);

  return { ready };
}
