# وضعیت امنیت کابل‌وب

## بررسی اولیه (چرخه فعلی)

### نقاط قوت
- فقط کلید publishable در کلاینت
- اجبار status=pending در insertها
- escapeHtml و بررسی URL ایمن
- چک ادمین با ایمیل + RPC is_kabulweb_admin
- SQL RLS آماده در docs/security_rls.sql
- Content-Security-Policy meta در صفحه اصلی
- Cooldown ۶۰ ثانیه‌ای برای فرم ثبت آگهی (localStorage)
- Honeypot field برای محافظت در برابر ربات‌ها در فرم ثبت آگهی

### اقدامات فوری مالک (بدون این امنیت کامل نیست)
1. اجرای کامل docs/security_rls.sql در Supabase SQL Editor
2. تأیید وجود دو حساب مدیر در Auth
3. تست کاربر عادی نتواند داده approved بخواند یا ویرایش کند

### محدودیت‌ها
- سایت استاتیک GitHub Pages → مانیتورینگ خودکار ۲۴/۷ و دفاع DDoS پیشرفته ممکن نیست
- Rate limiting سمت سرور وجود ندارد (فقط امکان افزودن سمت کلاینت)
- GitHub Pages اجازه تنظیم headerهای پاسخ سفارشی (مانند X-Frame-Options جداگانه) را نمی‌دهد؛ از meta CSP استفاده می‌شود

### اقدامات این چرخه
- افزودن فیلد honeypot به فرم ثبت آگهی برای کاهش ثبت‌های رباتی
- بررسی و تأیید CSP موجود در index.html

**هیچ‌وقت ادعا نمی‌کنیم سایت را ۲۴ ساعته محافظت می‌کنیم مگر سیستم مانیتورینگ واقعی فعال باشد.**

BUILD • CONNECT • GROW
