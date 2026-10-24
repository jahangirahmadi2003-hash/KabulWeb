-- =============================================================================
-- کابل‌وب — بنرها: ستون‌های تکمیلی + RLS (idempotent)
-- اجرا در: Supabase → SQL Editor
-- هیچ داده‌ای حذف نمی‌شود.
--
-- Storage bucket باید از Dashboard ساخته شود (API service_role لازم است):
--   نام: kabulweb-banners
--   Public: بله (فقط خواندن عمومی فایل‌های تبلیغاتی)
--   Allowed MIME: image/jpeg, image/png, image/webp
--   Max size: 5MB
-- =============================================================================

CREATE OR REPLACE FUNCTION public.is_kabulweb_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    lower((auth.jwt() ->> 'email')) IN (
      'hafizullahahmadi715@gmail.com',
      'jahangirahmadi2003@gmail.com'
    ),
    false
  );
$$;

REVOKE ALL ON FUNCTION public.is_kabulweb_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_kabulweb_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_kabulweb_admin() TO anon;

CREATE TABLE IF NOT EXISTS public.banner_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text,
  target_url text,
  placement text NOT NULL DEFAULT 'home',
  starts_at timestamptz,
  ends_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'banner_ads' AND column_name = 'updated_at'
  ) THEN
    ALTER TABLE public.banner_ads ADD COLUMN updated_at timestamptz NOT NULL DEFAULT now();
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'banner_ads' AND column_name = 'storage_path'
  ) THEN
    ALTER TABLE public.banner_ads ADD COLUMN storage_path text;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'banner_ads' AND column_name = 'created_by'
  ) THEN
    ALTER TABLE public.banner_ads ADD COLUMN created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL;
  END IF;
END $$;

ALTER TABLE public.banner_ads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_banners" ON public.banner_ads;
CREATE POLICY "public_read_approved_banners" ON public.banner_ads
  FOR SELECT TO anon, authenticated
  USING (
    public.is_kabulweb_admin()
    OR (
      status = 'approved'
      AND (starts_at IS NULL OR starts_at <= now())
      AND (ends_at IS NULL OR ends_at >= now())
    )
  );

DROP POLICY IF EXISTS "admin_write_banners" ON public.banner_ads;
CREATE POLICY "admin_write_banners" ON public.banner_ads
  FOR ALL TO authenticated
  USING (public.is_kabulweb_admin())
  WITH CHECK (public.is_kabulweb_admin());

CREATE INDEX IF NOT EXISTS idx_banner_ads_status_placement
  ON public.banner_ads (status, placement);

CREATE INDEX IF NOT EXISTS idx_banner_ads_dates
  ON public.banner_ads (starts_at, ends_at);

SELECT 'KabulWeb banner_storage_migration applied (table/RLS). Create Storage bucket kabulweb-banners in Dashboard.' AS result;
