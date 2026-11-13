-- کابل‌وب — جدول ثبت رویدادهای امنیتی (پیشنهادی)
-- اجرا در Supabase SQL Editor (اختیاری و منجر به هیچ حذف داده نمی‌شود)
-- فقط مدیر می‌تواند بخواند؛ درج از سمت کلاینت (انون) اجازه دارد برای ثبت رویداد مشکوک

CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  details text,
  user_agent text,
  ip_hint text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "admin_read_security_events" ON public.security_events;
CREATE POLICY "admin_read_security_events" ON public.security_events
  FOR SELECT TO authenticated
  USING (public.is_kabulweb_admin());

DROP POLICY IF EXISTS "anon_insert_security_events" ON public.security_events;
CREATE POLICY "anon_insert_security_events" ON public.security_events
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- محدودیت ساده: فقط فیلدهای مجاز
-- در کلاینت فقط event_type و details کوتاه ارسال می‌شود
