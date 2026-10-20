/**
 * کابل‌وب — اتصال رسمی Supabase (نسخه ۲)
 * کلید publishable از admin.html موجود در مخزن
 * هرگز service_role را اینجا قرار ندهید
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

/** فقط رکوردهای تأییدشده */
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

/** ثبت درخواست تبلیغ — وضعیت فقط pending */
export async function submitAdRequest(payload) {
  const row = {
    name: payload.name || payload.title || "",
    contact: payload.contact || "",
    platform: payload.platform || payload.type || "سایر",
    link: payload.link || null,
    description: payload.description || "",
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
    redirectTo: window.location.origin + window.location.pathname.replace(/[^/]*$/, "account.html"),
  });
}
