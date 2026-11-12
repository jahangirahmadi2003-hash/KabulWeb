# وضعیت امنیت کابل‌وب

## چرخه بررسی (2026-11-12)

### نقاط قوت فعلی
- فقط کلید publishable در کلاینت (`js/supabase.js`)
- اجبار `status="pending"` در تمام insertهای عمومی
- `escapeHtml` + `isSafeHttpUrl` برای جلوگیری XSS
- چک ادمین: allowlist ایمیل + RPC `is_kabulweb_admin`
- CSP روی صفحات اصلی، حساب و مدیریت
- Honeypot در فرم ثبت آگهی + cooldown کلاینت (60ث)
- SQL RLS کامل آماده در `docs/security_rls.sql`

### اقدامات فوری مالک (بدون این امنیت کامل نیست)
1. **اجرای کامل `docs/security_rls.sql` در Supabase SQL Editor** (اگر هنوز انجام نشده)
2. تأیید وجود دو حساب مدیر در Auth
3. تست: کاربر عادی نتواند داده `approved` بخواند یا ویرایش کند
4. بررسی منظم لاگ‌های Supabase Auth و Database
5. (پیشنهادی) اجرای `docs/security_events.sql` برای ثبت رویدادهای مشکوک

### محدودیت‌ها (واقعی)
- سایت استاتیک GitHub Pages → مانیتورینگ خودکار ۲۴/۷ و دفاع DDoS پیشرفته ممکن نیست (فقط امکانات GitHub + Supabase)
- Rate limiting سمت سرور نداریم (فقط کلاینت + سیاست‌های Supabase)
- هیچ سیستم هشدار امنیتی خودکار فعال نیست

### اقدامات این چرخه
- بررسی کامل کد `script.js`، `admin.html`، `js/supabase.js` و `public-extra.js`
- تأیید پیاده‌سازی honeypot و CSP
- افزودن پیشنهاد جدول `security_events` در `docs/security_events.sql`
- به‌روزرسانی مستند امنیتی

**هیچ‌وقت ادعا نمی‌کنیم سایت را به‌صورت ۲۴ ساعته محافظت می‌کنیم مگر سیستم مانیتورینگ واقعی فعال و متصل باشد.**

BUILD • CONNECT • GROW
