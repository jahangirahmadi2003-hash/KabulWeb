-- کابل‌وب — بخش ۱ امنیت RLS
-- در SQL Editor سوپابیس اجرا کنید (همراه part2)

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

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL UNIQUE,
  role text NOT NULL DEFAULT 'admin',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_roles_select_own" ON public.admin_roles;
CREATE POLICY "admin_roles_select_own"
  ON public.admin_roles FOR SELECT
  TO authenticated
  USING (public.is_kabulweb_admin());

INSERT INTO public.admin_roles (email, role)
VALUES
  ('hafizullahahmadi715@gmail.com', 'admin'),
  ('jahangirahmadi2003@gmail.com', 'admin')
ON CONFLICT (email) DO NOTHING;

ALTER TABLE IF EXISTS public.ad_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_approved_ad_requests" ON public.ad_requests;
CREATE POLICY "public_read_approved_ad_requests"
  ON public.ad_requests FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "public_insert_pending_ad_requests" ON public.ad_requests;
CREATE POLICY "public_insert_pending_ad_requests"
  ON public.ad_requests FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');
DROP POLICY IF EXISTS "admin_update_ad_requests" ON public.ad_requests;
CREATE POLICY "admin_update_ad_requests"
  ON public.ad_requests FOR UPDATE TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_delete_ad_requests" ON public.ad_requests;
CREATE POLICY "admin_delete_ad_requests"
  ON public.ad_requests FOR DELETE TO authenticated
  USING (public.is_kabulweb_admin());

ALTER TABLE IF EXISTS public.job_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_approved_job_posts" ON public.job_posts;
CREATE POLICY "public_read_approved_job_posts"
  ON public.job_posts FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "public_insert_pending_job_posts" ON public.job_posts;
CREATE POLICY "public_insert_pending_job_posts"
  ON public.job_posts FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');
DROP POLICY IF EXISTS "admin_update_job_posts" ON public.job_posts;
CREATE POLICY "admin_update_job_posts"
  ON public.job_posts FOR UPDATE TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_delete_job_posts" ON public.job_posts;
CREATE POLICY "admin_delete_job_posts"
  ON public.job_posts FOR DELETE TO authenticated
  USING (public.is_kabulweb_admin());

ALTER TABLE IF EXISTS public.listings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_approved_listings" ON public.listings;
CREATE POLICY "public_read_approved_listings"
  ON public.listings FOR SELECT TO anon, authenticated
  USING (status = 'approved' OR public.is_kabulweb_admin());
DROP POLICY IF EXISTS "public_insert_pending_listings" ON public.listings;
CREATE POLICY "public_insert_pending_listings"
  ON public.listings FOR INSERT TO anon, authenticated
  WITH CHECK (status = 'pending');
DROP POLICY IF EXISTS "admin_update_listings" ON public.listings;
CREATE POLICY "admin_update_listings"
  ON public.listings FOR UPDATE TO authenticated
  USING (public.is_kabulweb_admin()) WITH CHECK (public.is_kabulweb_admin());
DROP POLICY IF EXISTS "admin_delete_listings" ON public.listings;
CREATE POLICY "admin_delete_listings"
  ON public.listings FOR DELETE TO authenticated
  USING (public.is_kabulweb_admin());
