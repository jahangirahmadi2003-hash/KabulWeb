# وضعیت امنیت کابل‌وب

## بررسی اولیه (چرخه فعلی)

### نقاط قوت
- فقط کلید publishable در کلاینت
- اجبار status=pending در insertها
- escapeHtml و بررسی URL ایمن
- چک ادمین با ایمیل + RPC is_kabulweb_admin
- SQL RLS آماده در docs/security_rls.sql
- Content-Security-Policy روی صفحه اصلی و صفحات حساب/مدیریت
- cooldown ساده سمت کلاینت برای فرم ثبت آگهی (60 ثانیه)

### اقدامات فوری مالک (بدون این امنیت کامل نیست)
1. اجرای کامل docs/security_rls.sql در Supabase SQL Editor (اگر هنوز انجام نشده)
2. تأیید وجود دو حساب مدیر در Auth
3. تست کاربر عادی نتواند داده approved بخواند یا ویرایش کند
4. بررسی منظم لاگ‌های Supabase برای فعالیت‌های مشکوک

### محدودیت‌ها
- سایت استاتیک GitHub Pages → مانیتورینگ خودکار ۲۴/۷ و دفاع DDoS پیشرفته ممکن نیست (فقط امکانات میزبان و Supabase)
- Rate limiting سمت سرور وجود ندارد (فقط سمت کلاینت + سیاست‌های Supabase)
- هیچ سیستم ثبت گزارش امنیتی خودکار فعال نیست

### اقدامات این چرخه (۲۰۲۶-۱۱)
- بررسی کامل کد مخزن (supabase.js, script.js, admin.html, account.html, RLS SQL)
- تأیید وجود escapeHtml، isSafeHttpUrl، CSP و اجبار pending
- سایت زنده است: https://jahangirahmadi2003-hash.github.io/KabulWeb/
- هیچ تغییر مخرب بدون تست منتشر نشد
- دسترسی مستقیم به main نیست؛ تغییرات از طریق PR انجام می‌شود

**هیچ‌وقت ادعا نمی‌کنیم سایت را ۲۴ ساعته محافظت می‌کنیم مگر سیستم مانیتورینگ واقعی فعال و متصل باشد.**

## پیشنهادات چرخه بعدی
1. اعمال سیاست‌های Supabase Auth Rate Limit و Captcha اگر فعال نشده.
2. اضافه کردن honeypot ساده به فرم ثبت آگهی.
3. بررسی منظم لاگ‌های Supabase (Auth و Database).
4. آماده‌سازی Edge Function برای محدودیت نرخ سمت سرور در صورت نیاز.

BUILD • CONNECT • GROW
