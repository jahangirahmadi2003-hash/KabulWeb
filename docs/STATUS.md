# وضعیت کابل‌وب — گزارش واقعی (۲۱ اکتبر ۲۰۲۶)

## فوری: بازگردانی admin.html

فایل `admin.html` روی `main` خالی است (commit اشتباه). بازگردانی با یک دستور:

```bash
git clone https://github.com/jahangirahmadi2003-hash/KabulWeb.git
cd KabulWeb
git checkout 29ecaee245cfd54864fa0aa2fcb8d21d7e7b7ee9 -- admin.html
```

سپس این تغییر را در `admin.html` اعمال کنید (امنیت مضاعف سمت کلاینت):

در تابع `verifyAdmin` قبل از RPC، ایمیل را چک کنید:
- فقط `hafizullahahmadi715@gmail.com`
- فقط `jahangirahmadi2003@gmail.com`

```js
const ALLOWED_ADMIN_EMAILS = [
  "hafizullahahmadi715@gmail.com",
  "jahangirahmadi2003@gmail.com",
];
// بعد از getUser:
if (!ALLOWED_ADMIN_EMAILS.includes((user.email||"").toLowerCase().trim())) return false;
```

## انجام‌شده در مخزن

| مورد | وضعیت |
|------|--------|
| `index.html` | بازگردانی شد؛ لینک مدیریت از فوتر حذف شد |
| `docs/auto_publish.md` | راهنمای امن انتشار خودکار |
| `docs/RECOVERY.md` | دستور بازیابی |
| `docs/STATUS.md` | این فایل |
| `admin.html` | **خالی — باید دستی بازگردانی شود** |
| `docs/security_rls.sql` | آماده؛ باید در Supabase اجرا شود |

## کار اجباری مالک در Supabase

1. SQL Editor → اجرای کامل `docs/security_rls.sql` (پس از اضافه شدن به مخزن یا کپی از این گزارش)
2. ساخت تابع `is_kabulweb_admin` با دو ایمیل مجاز
3. فعال‌سازی RLS روی جداول
4. تأیید وجود دو حساب مدیر در Authentication

## ثبت‌نام و ورود

کد فعلی (`account.html` + `js/supabase.js`) از قبل:
- ثبت‌نام / ورود / خروج / بازیابی رمز با Supabase Auth
- `persistSession: true` و `autoRefreshToken: true` (نشست بعد از تازه‌سازی حفظ می‌شود)
- کلید publishable فقط در فرانت؛ service_role در کد نیست

## انتشار خودکار

**فعال نیست.** تا زمان تنظیم `TELEGRAM_BOT_TOKEN` در Edge Function Secrets و استقرار Function، ادعا نکنید که کار می‌کند. جزئیات در `docs/auto_publish.md`.

## آزمایش‌هایی که بدون دسترسی مالک ممکن نیست

- ورود واقعی با دو ایمیل مدیر
- رد کاربر غیرمدیر
- اجرای RLS
- انتشار تلگرام

این‌ها را پس از بازگردانی admin و اجرای SQL تست کنید.
