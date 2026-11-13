# وضعیت نهایی کابل‌وب (کد مخزن) — چرخه 2026-11-13

## کد آماده‌شده در GitHub

- `index.html` — CSP + honeypot + بدون لینک عمومی به پنل مدیریت
- `admin.html` — ورود مدیر + محدودیت دو ایمیل
- `account.html` — ثبت‌نام/ورود/خروج/بازیابی + حفظ نشست
- `js/supabase.js` — فقط کلید publishable + اجبار pending
- `script.js` — honeypot + cooldown + escapeHtml + فیلتر
- `docs/security_rls.sql` — **باید در Supabase اجرا شود**
- بخش‌های آموزش و اخبار در `js/public-extra.js` (منوط به اجرای جداول)

## تنها کار باقی‌ماندهٔ مالک (بدون این تکمیل واقعی نیست)

1. Supabase → SQL Editor → اجرای کامل `docs/security_rls.sql`
2. اطمینان از وجود دو حساب مدیر
3. تست ورود به `admin.html` و رد شدن کاربر عادی
4. (اختیاری) ایجاد جدول `security_events` برای ثبت رویدادهای مشکوک
5. برای انتشار تلگرام: Secrets + Edge Function (طبق `docs/auto_publish.md`)

## چه چیزی عمداً فعال نشده

- انتشار خودکار تلگرام/واتساپ — بدون توکن و Function سمت سرور فعال اعلام نمی‌شود.
- مانیتورینگ ۲۴/۷ و دفاع پیشرفته DDoS — ممکن نیست روی سایت استاتیک.

برنچ جدید: `security/cycle-2026-11-13-status-hardening`

BUILD • CONNECT • GROW
