# استقرار کابل‌وب

## GitHub Pages

1. Settings → Pages → Source: Deploy from branch `main` / root
2. آدرس: `https://jahangirahmadi2003-hash.github.io/KabulWeb/`
3. پس از هر push به `main` چند دقیقه برای به‌روزرسانی صبر کنید

## Supabase

1. پروژه با URL و کلید publishable مطابق `js/supabase.js`
2. Auth با ایمیل فعال باشد
3. اجرای یک‌باره: `docs/security_rls.sql` در SQL Editor
4. دو کاربر مدیر در Authentication:
   - hafizullahahmadi715@gmail.com
   - jahangirahmadi2003@gmail.com

## بررسی سلامت پس از استقرار

- [ ] صفحه اصلی بدون 404 لوگو
- [ ] اسکرول موبایل
- [ ] ثبت آگهی → status pending
- [ ] لیست فقط approved
- [ ] account: ورود و حفظ نشست
- [ ] admin: فقط دو ایمیل مدیر
