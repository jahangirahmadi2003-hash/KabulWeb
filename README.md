# کابل‌وب (KabulWeb)

بازار دیجیتال افغانستان و جهان — کاریابی، محصولات و خدمات، معرفی کانال‌های واتساپ و تلگرام.

**شعار:** BUILD • CONNECT • GROW  
**بنیانگذار:** Jahangir Ahmadi

---

## امکانات واقعاً پیاده‌سازی‌شده در کد

| قابلیت | وضعیت در مخزن |
|--------|----------------|
| صفحه اصلی RTL و واکنش‌گرا | فعال |
| اسپلش «بسم‌الله» (یک‌بار با localStorage) | فعال |
| کاریابی با جستجو و فیلتر شهر | فعال (فقط approved از Supabase) |
| بازار محصولات/خدمات | فعال (فقط approved) |
| کانال‌های واتساپ/تلگرام | فعال |
| فرم ثبت آگهی → pending | فعال |
| حساب کاربری (ثبت‌نام/ورود/خروج/بازیابی) | فعال |
| حفظ نشست پس از تازه‌سازی | فعال |
| پنل مدیریت مسیر جدا | فعال در کد؛ نه در منوی عمومی |
| محدودیت دو ایمیل مدیر + RPC | کد آماده |
| RLS / is_kabulweb_admin | SQL آماده — **اجرا در Supabase لازم** |
| انتشار خودکار تلگرام | **غیرفعال** (نیاز به Secrets) |

---

## ساختار فایل‌ها

جزئیات: [docs/PROJECT_STRUCTURE.md](docs/PROJECT_STRUCTURE.md)

---

## اتصال Supabase

1. فقط کلید publishable در `js/supabase.js`
2. اجرای `docs/security_rls.sql` در SQL Editor
3. دو حساب مدیر در Auth با ایمیل‌های مجاز

---

## GitHub Pages

Settings → Pages → branch `main`  
https://jahangirahmadi2003-hash.github.io/KabulWeb/  
راهنما: [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)

---

## امنیت

- `service_role` در مخزن نیست
- مخفی بودن admin کافی نیست؛ RPC + RLS الزامی است
- مدیران مجاز: `hafizullahahmadi715@gmail.com` و `jahangirahmadi2003@gmail.com`

کابل‌وب — بازار افغانستان و جهان
