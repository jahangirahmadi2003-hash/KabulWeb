# وضعیت نهایی کابل‌وب (کد مخزن) — چرخه 2026-11-12

## کد آماده‌شده در GitHub

- `index.html` — بدون لینک عمومی به پنل مدیریت + CSP + honeypot
- `admin.html` — ورود مدیر + لیست/تأیید آگهی‌ها + محدودیت دو ایمیل + RPC
- `account.html` — ثبت‌نام، ورود، خروج، بازیابی رمز، حفظ نشست + CSP
- `js/supabase.js` — فقط کلید publishable + توابع ایمن insert/select
- `script.js` — بارگذاری داده + فرم با honeypot و cooldown
- `docs/security_rls.sql` — **باید در Supabase اجرا شود** (اگر هنوز نشده)
- سایت زنده: https://jahangirahmadi2003-hash.github.io/KabulWeb/ (داده‌های کاریابی، آموزش و اخبار نمایش داده می‌شوند)

## تنها کار باقی‌ماندهٔ مالک (بدون این تکمیل واقعی نیست)

1. باز کردن Supabase → SQL Editor → اجرای کامل `docs/security_rls.sql`
2. اطمینان از وجود دو حساب:
   - hafizullahahmadi715@gmail.com
   - jahangirahmadi2003@gmail.com
3. تست ورود به `admin.html` با هر دو ایمیل
4. تست رد شدن یک کاربر عادی از پنل
5. برای انتشار تلگرام: Secrets + Edge Function (طبق auto_publish.md)

## آنچه عمداً فعال نشده

انتشار خودکار به تلگرام/واتساپ — بدون توکن و Function سمت سرور فعال اعلام نمی‌شود.

سایت در حال حاضر پایدار و قابل استفاده است. چرخه بعدی بر ای بهبودهای امنیتی و محتوایی برنامه‌ریزی خواهد شد.
