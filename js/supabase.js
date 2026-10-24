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
 * اگر کاربر وارد شده باشد user_id ست می‌شود
 */
export async function submitAdRequest(payload) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const uid = session?.user?.id || null;

  const row = {
    name: String(payload.name || payload.title || "").slice(0, 200),
    contact: String(payload.contact || "").slice(0, 100),
    platform: String(payload.platform || payload.type || "سایر").slice(0, 80),
    link: payload.link || null,
    description: String(payload.description || "").slice(0, 2000),
    package: payload.package || "free",
    status: "pending",
    user_id: uid,
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
 */
export async function submitJobPost(payload) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const uid = session?.user?.id || null;

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
    user_id: uid,
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
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const uid = session?.user?.id || null;

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
    user_id: uid,
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
  const base =
    window.location.origin +
    window.location.pathname.replace(/[^/]*$/, "");
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: base + "account.html",
  });
}

/** آگهی‌های متعلق به کاربر جاری از سه جدول */
export async function getMyAds() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return { data: [], error: { message: "not authenticated" } };

  const uid = session.user.id;
  const results = [];

  const [ads, jobs, listings] = await Promise.all([
    supabase
      .from("ad_requests")
      .select("id,name,contact,platform,link,description,status,rejection_reason,created_at,user_id")
      .eq("user_id", uid)
      .order("created_at", { ascending: false }),
    supabase
      .from("job_posts")
      .select(
        "id,title,company,location,type,salary,deadline,description,contact,status,rejection_reason,created_at,user_id"
      )
      .eq("user_id", uid)
      .order("created_at", { ascending: false }),
    supabase
      .from("listings")
      .select(
        "id,title,category,description,price,currency,seller_name,contact,image_url,listing_type,status,rejection_reason,created_at,user_id"
      )
      .eq("user_id", uid)
      .order("created_at", { ascending: false }),
  ]);

  if (ads.error) console.error("my ad_requests:", ads.error);
  if (jobs.error) console.error("my job_posts:", jobs.error);
  if (listings.error) console.error("my listings:", listings.error);

  (ads.data || []).forEach((r) =>
    results.push({ ...r, _kind: "ad", _label: r.name || "آگهی" })
  );
  (jobs.data || []).forEach((r) =>
    results.push({ ...r, _kind: "job", _label: r.title || "شغل" })
  );
  (listings.data || []).forEach((r) =>
    results.push({ ...r, _kind: "listing", _label: r.title || "محصول" })
  );

  results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  return { data: results, error: null };
}

/** ایجاد تیکت پشتیبانی */
export async function createSupportTicket({ subject, category, body }) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return { data: null, error: { message: "not authenticated" } };

  const user = session.user;
  const email = (user.email || "").toLowerCase();

  const { data: ticket, error: tErr } = await supabase
    .from("support_tickets")
    .insert([
      {
        user_id: user.id,
        user_email: email,
        subject: String(subject || "").slice(0, 200),
        category: String(category || "عمومی").slice(0, 60),
        status: "open",
        priority: "normal",
      },
    ])
    .select()
    .single();

  if (tErr) return { data: null, error: tErr };

  if (body && String(body).trim()) {
    const { error: mErr } = await supabase.from("support_messages").insert([
      {
        ticket_id: ticket.id,
        sender_type: "user",
        sender_id: user.id,
        sender_email: email,
        body: String(body).slice(0, 4000),
      },
    ]);
    if (mErr) {
      console.error("first message error:", mErr);
    }
  }

  return { data: ticket, error: null };
}

/** تیکت‌های کاربر جاری */
export async function getMyTickets() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return { data: [], error: { message: "not authenticated" } };

  const { data, error } = await supabase
    .from("support_tickets")
    .select("id,subject,category,status,priority,created_at,updated_at,closed_at")
    .eq("user_id", session.user.id)
    .order("updated_at", { ascending: false });

  return { data: data || [], error };
}

/** پیام‌های یک تیکت */
export async function getTicketMessages(ticketId) {
  const { data, error } = await supabase
    .from("support_messages")
    .select("id,ticket_id,sender_type,sender_email,body,created_at")
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true });

  return { data: data || [], error };
}

/** پاسخ کاربر به تیکت */
export async function replyToTicket(ticketId, body) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session?.user) return { data: null, error: { message: "not authenticated" } };

  const { data, error } = await supabase
    .from("support_messages")
    .insert([
      {
        ticket_id: ticketId,
        sender_type: "user",
        sender_id: session.user.id,
        sender_email: (session.user.email || "").toLowerCase(),
        body: String(body || "").slice(0, 4000),
      },
    ])
    .select()
    .single();

  if (!error) {
    await supabase
      .from("support_tickets")
      .update({ status: "open", updated_at: new Date().toISOString() })
      .eq("id", ticketId)
      .eq("user_id", session.user.id);
  }

  return { data, error };
}

/** بستن تیکت توسط کاربر */
export async function closeMyTicket(ticketId) {
  const { data, error } = await supabase.rpc("user_close_ticket", {
    p_ticket_id: ticketId,
  });
  return { data, error };
}

/** لیست تیکت‌ها برای مدیر */
export async function adminGetTickets(statusFilter) {
  let q = supabase
    .from("support_tickets")
    .select("id,user_id,user_email,subject,category,status,priority,created_at,updated_at,closed_at")
    .order("updated_at", { ascending: false })
    .limit(200);

  if (statusFilter && statusFilter !== "all") {
    q = q.eq("status", statusFilter);
  }

  const { data, error } = await q;
  return { data: data || [], error };
}

/** پاسخ مدیر (RPC امن) */
export async function adminReplyTicket(ticketId, body, newStatus) {
  const { data, error } = await supabase.rpc("admin_reply_ticket", {
    p_ticket_id: ticketId,
    p_body: body,
    p_new_status: newStatus || "answered",
  });
  return { data, error };
}

/** بررسی مدیر بودن از طریق RPC */
export async function checkIsAdmin() {
  const { data, error } = await supabase.rpc("is_kabulweb_admin");
  return { isAdmin: data === true, error };
}
