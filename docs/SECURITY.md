# وضعیت امنیت کابل‌وب

## بررسی چرخه فعلی (2026-11-12)

### نقاط قوت تأیید‌شده
- فقط کلید publishable در کلاینت (`js/supabase.js`)
- اجبار `status='pending'` در همه insertهای فرم ثبت آگهی
- `escapeHtml` و بررسی URL ایمن (`isSafeHttpUrl`) در رندر کارت‌ها
- CSP در `index.html`، `account.html` و `admin.html`
- Honeypot در فرم ثبت آگهی + cooldown کلاینتی 60 ثانیه
- پنل مدیریت با allowlist ایمیل + چک RPC `is_kabulweb_admin`
- سایت زنده و داده‌های approved نمایش داده می‌شوند (مشاهده در https://jahangirahmadi2003-hash.github.io/KabulWeb/)

### اقدامات فوری مالک (بدون این امنیت کامل نیست)
1. اجرای کامل `docs/security_rls.sql` در Supabase SQL Editor (اگر هنوز انجام نشده — حتی اگر select approved کار می‌کند)
2. تأیید وجود دو حساب مدیر در Auth
3. تست کاربر عادی نتواند داده pending را ببیند یا ویرایش کند
4. بررسی منظم لاگ‌های Supabase Auth و Database

### پیشنهاد برای چرخه بعدی
- ایجاد جدول `security_events` برای ثبت رویدادهای مشکوک (اسپام باید توسط مالک اجرا شود)
- Rate limiting سمت سرور (از طریق Supabase Edge Functions یا سیاست‌های پلتفرم)
- بهبود مانیتورینگ (الرت ایمیل یا webhook برای رویدادهای مشکوک)

### محدودیت‌ها
- سایت استاتیک GitHub Pages → مانیتورینگ خودکار ۲۴/۷ و دفاع DDoS پیشرفته بدون ابزار اضافی ممکن نیست (فقط امکانات میزبان و Supabase)
- Rate limiting سمت سرور وجود ندارد (فقط سمت کلاینت + سیاست‌های Supabase)
- هیچ سیستم ثبت گزارش امنیتی خودکار فعال و متصل نیست

**هیچ‌وقت ادعا نمی‌کنیم سایت را ۲۴ ساعته محافظت می‌کنیم مگر سیستم مانیتورینگ واقعی فعال و متصل باشد.**

BUILD • CONNECT • GROW
