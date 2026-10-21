# وضعیت نهایی کابل‌وب (کد مخزن)

## کد آماده‌شده در GitHub

- `index.html` — بدون لینک عمومی به پنل مدیریت
- `admin.html` — ورود مدیر + لیست/تأیید آگهی‌ها + محدودیت دو ایمیل
- `account.html` — ثبت‌نام، ورود، خروج، بازیابی رمز، حفظ نشست
- `js/supabase.js` — فقط کلید publishable
- `docs/security_rls.sql` — **باید در Supabase اجرا شود**
- `docs/auto_publish.md` — راهنمای انتشار خودکار (هنوز غیرفعال)

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
