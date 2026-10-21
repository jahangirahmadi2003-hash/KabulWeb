# ساختار واقعی مخزن KabulWeb

## درخت

```
KabulWeb/
├── index.html              # صفحه اصلی + اسپلش بسم‌الله
├── account.html            # ثبت‌نام / ورود / خروج / بازیابی
├── admin.html              # پنل مدیریت (noindex)
├── about.html, privacy.html, terms.html, logo.html
├── style.css, script.js
├── intro.css, intro.js     # مقدمه سینمایی (در index فعلی لینک نشده)
├── js/supabase.js
├── file_0000….png          # لوگوی PNG
├── assets/images/README.md
├── docs/
│   ├── security_rls.sql
│   ├── PROJECT_STRUCTURE.md
│   ├── DEPLOYMENT.md
│   ├── auto_publish.md
│   └── STATUS.md
├── .gitignore
└── README.md
```

## مسئولیت فایل‌ها

| فایل | نقش |
|------|-----|
| index.html | ساختار صفحه اصلی |
| style.css | ظاهر، RTL، واکنش‌گرا، اسپلش |
| script.js | اسپلش، منو، بارگذاری داده، فرم آگهی |
| js/supabase.js | کلید publishable + Auth و insert/select |
| account.html | UI حساب |
| admin.html | UI مدیر + RPC + allowlist |
| docs/security_rls.sql | RLS — اجرا توسط مالک |

## عمداً انجام‌نشده

شکستن اجباری script.js/style.css به چند فایل بدون تست کامل انجام نشد تا رفتار فعلی نشکند.

## فایل‌های کم‌استفاده

- intro.css / intro.js — نسخه سینمایی جدا
- logo.html — پیش‌نمایش لوگوی SVG
- docs/security_rls_part1.sql, RECOVERY.md — کمکی/تاریخی
