# بازیابی فوری کابل‌وب

## مشکل
یک commit اشتباهی `index.html` و `admin.html` را خالی کرد.

## رفع
1. `index.html` در commit بعدی بازگردانی شد (بدون لینک مدیریت در فوتر).
2. اگر `admin.html` هنوز خالی است:
```bash
git checkout 29ecaee245cfd54864fa0aa2fcb8d21d7e7b7ee9 -- admin.html
git add admin.html && git commit -m "restore admin.html" && git push
```
3. فایل `docs/security_rls.sql` را در Supabase SQL Editor اجرا کنید.
4. دو ایمیل مدیر باید در Auth وجود داشته باشند.

## امنیت
- لینک پنل مدیریت از منوی عمومی و فوتر حذف شده است.
- مسیر `admin.html` هنوز قابل حدس است؛ امنیت واقعی با `is_kabulweb_admin` و RLS است.
