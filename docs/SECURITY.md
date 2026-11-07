# وضعیت امنیت کابل‌وب

## بررسی اولیه (چرخه فعلی)

### نقاط قوت
- فقط کلید publishable در کلاینت
- اجبار status=pending در insertها
- escapeHtml و بررسی URL ایمن
- چک ادمین با ایمیل + RPC is_kabulweb_admin
- SQL RLS آماده در docs/security_rls.sql

### اقدامات فوری مالک (بدون این امنیت کامل نیست)
1. اجرای کامل docs/security_rls.sql در Supabase SQL Editor
2. تأیید وجود دو حساب مدیر در Auth
3. تست کاربر عادی نتواند داده approved بخواند یا ویرایش کند

### محدودیت‌ها
- سایت استاتیک GitHub Pages → مانیتورینگ خودکار ۲۴/۷ و دفاع DDoS پیشرفته ممکن نیست
- Rate limiting سمت سرور وجود ندارد (فقط امکان افزودن سمت کلاینت)

### اقدامات این چرخه
- افزودن Content-Security-Policy meta به صفحات اصلی
- افزودن cooldown ساده برای فرم ثبت آگهی (localStorage)

**هیچ‌وقت ادعا نمی‌کنیم سایت را ۲۴ ساعته محافظت می‌کنیم مگر سیستم مانیتورینگ واقعی فعال باشد.**

BUILD • CONNECT • GROW
