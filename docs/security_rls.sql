-- کابل‌وب — امنیت کامل RLS و نقش مدیر
-- اجرا: Supabase → SQL Editor → Run
-- هیچ داده‌ای حذف نمی‌شود.

CREATE OR REPLACE FUNCTION public.is_kabulweb_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT COALESCE(
    lower((auth.jwt() ->> 'email')) IN (
      'hafizullahahmadi715@gmail.com',
      'jahangirahmadi2003@gmail.com'
    ), false);
$$;

REVOKE ALL ON FUNCTION public.is_kabulweb_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_kabulweb_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_kabulweb_admin() TO anon;

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_roles_select_own" ON public.admin_roles;
CREATE POLICY "admin_roles_select_own" ON public.admin_roles FOR SELECT TO authenticated
  USING (public.is_kabulweb_admin());
INSERT INTO public.admin_roles (email, role) VALUES
  ('hafizullahahmadi715@gmail.com', 'admin'),
  ('jahangirahmadi2003@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

ALTER TABLE IF EXISTS public.ad_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_approved_ad_requests" ON public.ad_requests;
CREATE POLICY "public_read_approved_ad_requests" ON public.ad_requests FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "public_insert_pending_ad_requests" ON public.ad_requests;
CREATE POLICY "public_insert_pending_ad_requests" ON public.ad_requests FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');
DROP POLICY IF EXISTS "admin_update_ad_requests" ON public.ad_requests;
CREATE POLICY "admin_update_ad_requests" ON public.ad_requests FOR UPDATE TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_delete_ad_requests" ON public.ad_requests;
CREATE POLICY "admin_delete_ad_requests" ON public.ad_requests FOR DELETE TO authenticated
  USING (public.is_kabulweb_admin());

ALTER TABLE IF EXISTS public.job_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_approved_job_posts" ON public.job_posts;
CREATE POLICY "public_read_approved_job_posts" ON public.job_posts FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "public_insert_pending_job_posts" ON public.job_posts;
CREATE POLICY "public_insert_pending_job_posts" ON public.job_posts FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');
DROP POLICY IF EXISTS "admin_update_job_posts" ON public.job_posts;
CREATE POLICY "admin_update_job_posts" ON public.job_posts FOR UPDATE TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_delete_job_posts" ON public.job_posts;
CREATE POLICY "admin_delete_job_posts" ON public.job_posts FOR DELETE TO authenticated
  USING (public.is_kabulweb_admin());

ALTER TABLE IF EXISTS public.listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_approved_listings" ON public.listings;
CREATE POLICY "public_read_approved_listings" ON public.listings FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "public_insert_pending_listings" ON public.listings;
CREATE POLICY "public_insert_pending_listings" ON public.listings FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');
DROP POLICY IF EXISTS "admin_update_listings" ON public.listings;
CREATE POLICY "admin_update_listings" ON public.listings FOR UPDATE TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_delete_listings" ON public.listings;
CREATE POLICY "admin_delete_listings" ON public.listings FOR DELETE TO authenticated
  USING (public.is_kabulweb_admin());

ALTER TABLE IF EXISTS public.customer_orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_all_customer_orders" ON public.customer_orders;
CREATE POLICY "admin_all_customer_orders" ON public.customer_orders FOR ALL TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
DROP POLICY IF EXISTS "public_insert_customer_orders" ON public.customer_orders;
CREATE POLICY "public_insert_customer_orders" ON public.customer_orders FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.news_articles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, summary text, body text, source_name text, source_url text,
  category text DEFAULT 'عمومی', status text NOT NULL DEFAULT 'pending',
  published_at timestamptz, expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.education_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, organization text, location text, level text, language text,
  deadline date, description text, link text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.banner_ads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL, image_url text, target_url text, placement text DEFAULT 'home',
  starts_at timestamptz, ends_at timestamptz,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.publish_destinations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, platform text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  content_types text[] NOT NULL DEFAULT '{}',
  config jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS public.publish_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_type text NOT NULL, content_id uuid NOT NULL,
  destination_id uuid REFERENCES public.publish_destinations(id),
  status text NOT NULL, message text,
  published_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publish_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publish_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_approved_news" ON public.news_articles;
CREATE POLICY "public_read_approved_news" ON public.news_articles FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_write_news" ON public.news_articles;
CREATE POLICY "admin_write_news" ON public.news_articles FOR ALL TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());

DROP POLICY IF EXISTS "public_read_approved_education" ON public.education_opportunities;
CREATE POLICY "public_read_approved_education" ON public.education_opportunities FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_write_education" ON public.education_opportunities;
CREATE POLICY "admin_write_education" ON public.education_opportunities FOR ALL TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());

DROP POLICY IF EXISTS "public_read_approved_banners" ON public.banner_ads;
CREATE POLICY "public_read_approved_banners" ON public.banner_ads FOR SELECT TO anon, authenticated
  USING ((status = 'approved' AND (starts_at IS NULL OR starts_at <= now()) AND (ends_at IS NULL OR ends_at >= now())) OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_write_banners" ON public.banner_ads;
CREATE POLICY "admin_write_banners" ON public.banner_ads FOR ALL TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());

DROP POLICY IF EXISTS "admin_only_publish_dest" ON public.publish_destinations;
CREATE POLICY "admin_only_publish_dest" ON public.publish_destinations FOR ALL TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_only_publish_log" ON public.publish_log;
CREATE POLICY "admin_only_publish_log" ON public.publish_log FOR ALL TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
