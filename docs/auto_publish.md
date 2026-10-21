# انتشار خودکار کابل‌وب — راهنمای امن

## اصل امنیتی
توکن ربات تلگرام، کلید API و هر اعتبارنامهٔ دیگر **هرگز** نباید در:
- فایل‌های HTML/JS عمومی
- مخزن GitHub
- متغیرهای قابل مشاهده در مرورگر

قرار بگیرند. فقط در **Supabase Edge Function Secrets** یا محیط سرور امن.

## پیش‌نیازها (مالک پروژه باید انجام دهد)
1. ساخت ربات تلگرام از @BotFather و دریافت توکن
2. افزودن ربات به کانال `@kabulwebs` به‌عنوان ادمین
3. در Supabase → Project Settings → Edge Functions → Secrets:
   - `TELEGRAM_BOT_TOKEN` = توکن ربات
   - `TELEGRAM_CHANNEL_ID` = @kabulwebs یا شناسه عددی کانال
4. اجرای `docs/security_rls.sql` برای جداول `publish_destinations` و `publish_log`
5. استقرار Edge Function (نمونه زیر) و اتصال به Cron یا فراخوانی دستی از پنل

## نمونهٔ Edge Function (Deno) — هنوز مستقر نشده
```ts
// supabase/functions/auto-publish/index.ts
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")! // فقط سمت سرور
  );

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("Unauthorized", { status: 401 });

  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const channel = Deno.env.get("TELEGRAM_CHANNEL_ID");
  if (!token || !channel) {
    return new Response(JSON.stringify({ error: "secrets missing" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  // خواندن محتوای approved که هنوز در publish_log نیست
  // ارسال به Telegram Bot API
  // ثبت نتیجه در publish_log

  return new Response(JSON.stringify({ ok: true, note: "stub — deploy after secrets" }), {
    headers: { "Content-Type": "application/json" },
  });
});
```

## وضعیت فعلی در مخزن
- UI پنل مدیریت بخش «انتشار خودکار» را نشان می‌دهد اما **غیرفعال** است.
- هیچ توکنی در کد نیست.
- تا زمان تنظیم Secrets و استقرار Function، انتشار خودکار را فعال‌شده اعلام نکنید.

## واتساپ
API رسمی کانال/گروه واتساپ برای انتشار عمومی محدود است. در صورت نیاز به WhatsApp Business Cloud API، همان الگو (Secrets + Edge Function) اعمال شود.
