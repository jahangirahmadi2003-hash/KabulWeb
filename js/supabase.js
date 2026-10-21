/**
 * کابل‌وب — اتصال رسمی Supabase
 * فقط کلید publishable (عمومی) — هرگز service_role را اینجا قرار ندهید
 */
import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://netspaxkjtoumfoobgnu.supabase.co";
export const SUPABASE_PUBLISHABLE_KEY =
  "sb_publishable_qGQHIeuxoYN01V10g5n7nw_R0rQpUTE";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/** فقط رکوردهای تأییدشده — برای نمایش عمومی */
export async function fetchApproved(table, columns = "*", limit = 50) {
  const { data, error } = await supabase
    .from(table)
    .select(columns)
    .eq("status", "approved")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("KabulWeb fetch error [" + table + "]:", error);
    return { data: [], error };
  }
  return { data: data || [], error: null };
}

/**
 * ثبت درخواست تبلیغ / کانال در ad_requests
 * status همیشه pending — حتی اگر کلاینت مقدار دیگری بفرستد
 */
export async function submitAdRequest(payload) {
  const row = {
    name: String(payload.name || payload.title || "").slice(0, 200),
    contact: String(payload.contact || "").slice(0, 100),
    platform: String(payload.platform || payload.type || "سایر").slice(0, 80),
    link: payload.link || null,
    description: String(payload.description || "").slice(0, 2000),
    package: payload.package || "free",
    status: "pending",
  };

  const { data, error } = await supabase
    .from("ad_requests")
    .insert([row])
    .select()
    .single();

  return { data, error };
}

/**
 * ثبت آگهی شغلی در job_posts با status=pending
 * فیلدها مطابق ساختار استفاده‌شده در پنل مدیریت
 */
export async function submitJobPost(payload) {
  const row = {
    title: String(payload.title || "").slice(0, 120),
    company: String(payload.company || "").slice(0, 120) || null,
    location: String(payload.location || "").slice(0, 80) || null,
    type: String(payload.type || payload.job_type || "").slice(0, 40) || null,
    salary: payload.salary != null ? String(payload.salary).slice(0, 80) : null,
    deadline: payload.deadline || null,
    description: String(payload.description || "").slice(0, 2000),
    contact: String(payload.contact || "").slice(0, 100),
    status: "pending",
  };

  const { data, error } = await supabase
    .from("job_posts")
    .insert([row])
    .select()
    .single();

  return { data, error };
}

/**
 * ثبت محصول/خدمت در listings با status=pending
 */
export async function submitListing(payload) {
  const listingType =
    payload.listing_type === "service" || payload.type === "service"
      ? "service"
      : "product";

  const row = {
    title: String(payload.title || "").slice(0, 120),
    category: String(payload.category || "سایر").slice(0, 60),
    description: String(payload.description || "").slice(0, 2000),
    price: payload.price != null && payload.price !== "" ? payload.price : null,
    currency: payload.currency ? String(payload.currency).slice(0, 20) : null,
    seller_name: String(payload.seller_name || "").slice(0, 100) || null,
    contact: String(payload.contact || "").slice(0, 100),
    image_url: payload.image_url || null,
    listing_type: listingType,
    status: "pending",
  };

  const { data, error } = await supabase
    .from("listings")
    .insert([row])
    .select()
    .single();

  return { data, error };
}

/**
 * مسیریابی ثبت بر اساس نوع فرم
 * job → job_posts | product/service → listings | channel/other → ad_requests
 */
export async function submitByType(type, fields) {
  const t = (type || "").toLowerCase();

  if (t === "job") {
    return submitJobPost({
      title: fields.title,
      company: fields.company,
      location: fields.location,
      type: fields.jobType || fields.type,
      salary: fields.salary,
      deadline: fields.deadline,
      description: fields.description,
      contact: fields.contact,
    });
  }

  if (t === "product" || t === "service") {
    return submitListing({
      title: fields.title,
      category: fields.category,
      description: fields.description,
      price: fields.price,
      currency: fields.currency,
      seller_name: fields.seller_name,
      contact: fields.contact,
      image_url: fields.image_url || fields.link || null,
      listing_type: t === "service" ? "service" : "product",
      type: t,
    });
  }

  const platformMap = {
    channel: "کانال واتساپ / تلگرام",
    other: "سایر",
  };

  return submitAdRequest({
    name: fields.title,
    contact: fields.contact,
    platform: fields.platform || platformMap[t] || t || "سایر",
    link: fields.link || null,
    description: fields.description,
    package: fields.package || "free",
  });
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data?.session || null, error };
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUp(email, password, fullName) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName || "" } },
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

export async function resetPassword(email) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      window.location.origin +
      window.location.pathname.replace(/[^/]*$/, "account.html"),
  });
}
