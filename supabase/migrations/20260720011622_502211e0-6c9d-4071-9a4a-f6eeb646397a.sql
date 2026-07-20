ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Storage policies for avatars bucket (public read, user-owned writes)
DO $$ BEGIN
  CREATE POLICY "Avatars public read" ON storage.objects FOR SELECT USING (bucket_id = 'avatars');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users upload own avatar" ON storage.objects FOR INSERT TO authenticated
    WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users update own avatar" ON storage.objects FOR UPDATE TO authenticated
    USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users delete own avatar" ON storage.objects FOR DELETE TO authenticated
    USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = auth.uid()::text);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;