-- کابل‌وب — پیشنهاد جدول ثبت رویدادهای امنیتی
-- اجرا: Supabase → SQL Editor → Run (پس از security_rls.sql)
-- هیچ داده‌ای حذف نمی‌شود.

CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,          -- مثال: 'honeypot_triggered', 'rate_limit', 'failed_login', 'suspicious_insert'
  severity text NOT NULL DEFAULT 'info', -- info | warning | critical
  details jsonb DEFAULT '{}',
  user_id uuid,
  ip_hash text,                      -- هش آیپی (نه خود آیپی خام) برای حفظ حریم خصوصی
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_security_events" ON public.security_events;
CREATE POLICY "admin_read_security_events" ON public.security_events
  FOR SELECT TO authenticated
  USING (public.is_kabulweb_admin());

DROP POLICY IF EXISTS "system_insert_security_events" ON public.security_events;
CREATE POLICY "system_insert_security_events" ON public.security_events
  FOR INSERT TO authenticated, anon
  WITH CHECK (true);  -- فقط برای ثبت از کلاینت یا Edge Function (با محدودیت)

-- پیشنهاد: برای هشدار می‌توانید یک Database Webhook یا Edge Function برای severity='critical' تعریف کنید.
-- از دسترسی عمومی به این جدول جلوگیری شده است.
