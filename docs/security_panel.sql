-- کابل‌وب — جداول پنل امنیت (idempotent)
-- اجرا: Supabase → SQL Editor
-- هیچ دادهٔ کاربری حذف نمی‌شود.

CREATE TABLE IF NOT EXISTS public.security_blocked_ips (
  ip text PRIMARY KEY,
  reason text,
  source text DEFAULT 'manual',
  until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip text NOT NULL,
  event_type text NOT NULL,
  path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_blocked_ips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_all_blocked_ips" ON public.security_blocked_ips;
CREATE POLICY "admin_all_blocked_ips" ON public.security_blocked_ips
  FOR ALL TO authenticated
  USING (public.is_kabulweb_admin())
  WITH CHECK (public.is_kabulweb_admin());

DROP POLICY IF EXISTS "admin_all_security_events" ON public.security_events;
CREATE POLICY "admin_all_security_events" ON public.security_events
  FOR ALL TO authenticated
  USING (public.is_kabulweb_admin())
  WITH CHECK (public.is_kabulweb_admin());

CREATE INDEX IF NOT EXISTS idx_security_events_created ON public.security_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_security_events_ip ON public.security_events (ip);

SELECT 'KabulWeb security_panel SQL applied.' AS result;
