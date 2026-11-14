# وضعیت امنیت کابل‌وب

## بررسی چرخه 2026-11-14

### وضعیت فعلی
- سایت لایو و قابل دسترس در GitHub Pages
- کد کلاینت: escapeHtml، بررسی URL ایمن، honeypot، cooldown 60ثانیه فعال
- کلید publishable فقط در کلاینت
- SQL RLS آماده در docs/security_rls.sql — **هنوز اجرا در Supabase تأیید نشده**

### اقدامات فوری مالک (بدون دسترسی من به Supabase قابل انجام نیست)
1. اجرای کامل docs/security_rls.sql در Supabase SQL Editor
2. تأیید وجود دو حساب مدیر
3. تست RLS: کاربر عادی نتواند pending یا داده‌های غیرمجاز را ببیند
4. ایجاد جدول security_events (پیشنهاد زیر) و فعال‌سازی لاگینگ رویدادهای مشکوک

### پیشنهاد جدول security_events (برای اجرا توسط مالک)
```sql
CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  details jsonb,
  ip text,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admin_read_security_events" ON public.security_events
  FOR SELECT TO authenticated USING (public.is_kabulweb_admin());
CREATE POLICY "public_insert_security_events" ON public.security_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
```

### محدودیت‌ها
- سایت استاتیک → مانیتورینگ و دفاع DDoS پیشرفته ممکن نیست (فقط GitHub Pages + Supabase)
- هیچ سیستم هشدار خودکار ۲۴/۷ فعال نیست

**هیچ‌وقت ادعا نمی‌کنیم سایت را ۲۴ ساعته محافظت می‌کنیم مگر سیستم مانیتورینگ واقعی فعال و متصل باشد.**

BUILD • CONNECT • GROW
