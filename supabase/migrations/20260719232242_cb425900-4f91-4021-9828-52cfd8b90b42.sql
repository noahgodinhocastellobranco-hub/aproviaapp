
-- 1. Fix vendas INSERT: restrict to service_role only (webhook uses service key)
DROP POLICY IF EXISTS "Service role can insert vendas" ON public.vendas;
CREATE POLICY "Service role can insert vendas"
  ON public.vendas
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Ensure regular roles cannot insert
REVOKE INSERT ON public.vendas FROM anon, authenticated;

-- 2. Storage: tighten avatars bucket listing (public URLs still work via CDN)
DROP POLICY IF EXISTS "Avatars are publicly viewable" ON storage.objects;
CREATE POLICY "Users can view own avatar folder"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'avatars'
    AND (auth.uid())::text = (storage.foldername(name))[1]
  );

-- 3. SECURITY DEFINER functions: revoke broad EXECUTE, grant narrowly
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
-- handle_new_user runs from a trigger under table owner; no direct callers needed

REVOKE ALL ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.increment_user_activity(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.increment_user_activity(uuid) TO authenticated, service_role;
