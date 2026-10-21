# کابل‌وب (KabulWeb)

بازار دیجیتال افغانستان و جهان  
کاریابی · محصولات و خدمات · معرفی کانال‌های واتساپ و تلگرام

**بنیانگذار:** Jahangir Ahmadi

---

## وضعیت فعلی

| قابلیت | وضعیت |
|--------|--------|
| صفحه اصلی + اسپلش بسم‌الله | آماده |
| کاریابی / بازار / کانال‌ها از دیتابیس | آماده (فقط approved) |
| ثبت آگهی (pending) | آماده |
| حساب کاربری (ثبت‌نام/ورود/خروج/بازیابی) | آماده |
| حفظ نشست پس از تازه‌سازی | آماده |
| پنل مدیریت (مسیر جدا، نه در منوی عمومی) | آماده در کد |
| محدودیت دو ایمیل مدیر + RPC | کد آماده؛ **SQL باید اجرا شود** |
| RLS امن | فایل `docs/security_rls.sql` — **باید در Supabase اجرا شود** |
| انتشار خودکار تلگرام | **غیرفعال** تا Secrets + Edge Function |

## اقدام فوری مالک

1. [Supabase SQL Editor](https://supabase.com/dashboard) → اجرای کامل فایل:
   `docs/security_rls.sql`
2. دو حساب مدیر در Auth:
   - `hafizullahahmadi715@gmail.com`
   - `jahangirahmadi2003@gmail.com`
3. تست: ورود به `admin.html` با هر دو ایمیل
4. تست: کاربر عادی نباید به داشبورد مدیر برسد

## ساختار

```
index.html      صفحه اصلی (بدون لینک مدیریت در فوتر)
admin.html      پنل مدیریت مخفی از منوی عمومی
account.html    حساب کاربری
script.js       بارگذاری داده + فرم آگهی
js/supabase.js  فقط کلید publishable
docs/           SQL امنیت و راهنمای انتشار
```

## نصب GitHub Pages

Settings → Pages → Deploy from branch `main`  
آدرس: `https://USERNAME.github.io/KabulWeb`

## امنیت

- کلید `service_role` هرگز در فرانت یا GitHub نیست
- تغییر status به approved فقط برای مدیر (پس از RLS)
- پنل مدیریت در منوی عمومی نیست؛ امنیت واقعی با RPC + RLS است

---

کابل‌وب — BUILD • CONNECT • GROW
