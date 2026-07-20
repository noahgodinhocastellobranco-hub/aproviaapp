
-- 1) verification_codes: remove UPDATE for authenticated (backend uses service_role)
DROP POLICY IF EXISTS "Users can update own verification codes" ON public.verification_codes;
DROP POLICY IF EXISTS "Users update own verification codes" ON public.verification_codes;
DROP POLICY IF EXISTS "Update own verification codes" ON public.verification_codes;
REVOKE UPDATE ON public.verification_codes FROM authenticated, anon;

-- 2) vendas: remove from realtime publication
DO $$ BEGIN
  ALTER PUBLICATION supabase_realtime DROP TABLE public.vendas;
EXCEPTION WHEN undefined_object THEN NULL; WHEN others THEN NULL; END $$;

-- 3) Harden SECURITY DEFINER functions: only allow self-referencing calls
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (_user_id = auth.uid() OR auth.role() = 'service_role')
  )
$$;

CREATE OR REPLACE FUNCTION public.increment_user_activity(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF p_user_id IS DISTINCT FROM auth.uid() AND auth.role() <> 'service_role' THEN
    RAISE EXCEPTION 'not authorized';
  END IF;
  INSERT INTO public.user_activity (user_id, date, actions_count)
  VALUES (p_user_id, CURRENT_DATE, 1)
  ON CONFLICT (user_id, date)
  DO UPDATE SET actions_count = user_activity.actions_count + 1;
END;
$$;

-- 4) Storage avatars: remove broad SELECT policy so bucket cannot be listed.
-- Public URLs still work for direct file access (public bucket).
DROP POLICY IF EXISTS "Avatars public read" ON storage.objects;
