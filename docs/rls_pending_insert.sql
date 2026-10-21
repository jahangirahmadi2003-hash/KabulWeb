-- کابل‌وب — سیاست‌های پیشنهادی RLS برای ثبت عمومی با وضعیت pending
-- وضعیت: هنوز اجرا نشده — مالک پروژه باید در SQL Editor سوپابیس بررسی و اجرا کند.
-- هدف: اجازه INSERT عمومی فقط وقتی status = 'pending'
--      جلوگیری از ثبت status=approved توسط کاربر عادی
--      خواندن عمومی فقط approved
-- هیچ جدولی حذف نمی‌شود؛ RLS غیرفعال نمی‌شود.

-- ========== ad_requests ==========
-- SELECT عمومی فقط approved (اگر سیاست قبلی ندارید)
-- DROP POLICY IF EXISTS "public_read_approved_ad_requests" ON public.ad_requests;
-- CREATE POLICY "public_read_approved_ad_requests"
--   ON public.ad_requests FOR SELECT
--   TO anon, authenticated
--   USING (status = 'approved');

-- INSERT عمومی فقط pending
-- DROP POLICY IF EXISTS "public_insert_pending_ad_requests" ON public.ad_requests;
CREATE POLICY "public_insert_pending_ad_requests"
  ON public.ad_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- ========== job_posts ==========
-- DROP POLICY IF EXISTS "public_read_approved_job_posts" ON public.job_posts;
-- CREATE POLICY "public_read_approved_job_posts"
--   ON public.job_posts FOR SELECT
--   TO anon, authenticated
--   USING (status = 'approved');

-- DROP POLICY IF EXISTS "public_insert_pending_job_posts" ON public.job_posts;
CREATE POLICY "public_insert_pending_job_posts"
  ON public.job_posts FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- ========== listings ==========
-- DROP POLICY IF EXISTS "public_read_approved_listings" ON public.listings;
-- CREATE POLICY "public_read_approved_listings"
--   ON public.listings FOR SELECT
--   TO anon, authenticated
--   USING (status = 'approved');

-- DROP POLICY IF EXISTS "public_insert_pending_listings" ON public.listings;
CREATE POLICY "public_insert_pending_listings"
  ON public.listings FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'pending');

-- نکته: به‌روزرسانی status به approved فقط باید برای نقش مدیر
-- (از طریق is_kabulweb_admin یا جدول admins) مجاز باشد.
-- اگر سیاست UPDATE عمومی دارید، آن را محدود کنید.

-- نمونه (در صورت نیاز — قبل از اجرا با سیاست‌های موجود تطبیق دهید):
-- CREATE POLICY "admin_update_status"
--   ON public.job_posts FOR UPDATE
--   TO authenticated
--   USING (public.is_kabulweb_admin())
--   WITH CHECK (public.is_kabulweb_admin());
