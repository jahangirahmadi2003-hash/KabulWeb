/**
 * کابل‌وب — بارگذاری آموزش، اخبار و بنرها
 */
import { fetchApproved } from "./supabase.js";

/** لینک رسمی چینل واتساپ وظیفه گروپ */
const WAZEEFA_WHATSAPP_CHANNEL =
  "https://whatsapp.com/channel/0029VbDYDtu4tRro2xn2PF07";

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}
function isSafeHttpUrl(value) {
  if (!value || typeof value !== "string") return false;
  try {
    const u = new URL(value.trim());
    return u.protocol === "http:" || u.protocol === "https:";
  } catch (_) {
    return false;
  }
}
function isWhatsAppUrl(value) {
  if (!value || typeof value !== "string") return false;
  const l = value.toLowerCase();
  return (
    l.includes("whatsapp.com") ||
    l.includes("wa.me/") ||
    l.includes("chat.whatsapp")
  );
}
/** تبدیل URLهای امن داخل متن به لینک قابل کلیک */
function linkifyText(text) {
  if (text == null || text === "") return "";
  const escaped = escapeHtml(String(text));
  const urlRe =
    /(https?:\/\/[^\s<>"']+)|((?:www\.)?[a-zA-Z0-9][-a-zA-Z0-9]*\.(?:com|org|net|af|io|co|me|info|edu|gov)(?:\/[^\s<>"']*)?)/gi;
  return escaped.replace(urlRe, (match, withProto, bare) => {
    const raw = withProto || bare;
    if (!raw) return match;
    let href = raw;
    if (!/^https?:\/\//i.test(href)) href = "https://" + href;
    if (!isSafeHttpUrl(href)) return match;
    return (
      '<a class="desc-link" href="' +
      escapeHtml(href) +
      '" target="_blank" rel="noopener noreferrer">' +
      match +
      "</a>"
    );
  });
}
function extractFirstSafeUrl(text) {
  if (!text) return null;
  const re = /https?:\/\/[^\s<>"']+/gi;
  let m;
  while ((m = re.exec(String(text))) !== null) {
    if (isSafeHttpUrl(m[0]) && !isWhatsAppUrl(m[0])) return m[0].trim();
  }
  return null;
}
function extractWhatsAppUrl(text) {
  if (!text) return null;
  const re = /https?:\/\/[^\s<>"']+/gi;
  let m;
  while ((m = re.exec(String(text))) !== null) {
    if (isSafeHttpUrl(m[0]) && isWhatsAppUrl(m[0])) return m[0].trim();
  }
  return null;
}
function emptyState(container, message) {
  container.innerHTML =
    '<div class="empty-state"><p>' + escapeHtml(message) + "</p></div>";
}

async function loadEducation() {
  const box = document.getElementById("educationList");
  if (!box) return;
  box.innerHTML =
    '<p class="muted" style="grid-column:1/-1">در حال بارگذاری فرصت‌های آموزشی…</p>';
  try {
    const { data, error } = await fetchApproved(
      "education_opportunities",
      "id,title,organization,location,level,description,link,status,created_at"
    );
    if (error) {
      emptyState(box, "بخش آموزش پس از اجرای جداول دیتابیس فعال می‌شود.");
      return;
    }
    if (!data.length) {
      emptyState(box, "هنوز فرصت آموزشی تأییدشده‌ای ثبت نشده است.");
      return;
    }
    box.innerHTML = "";
    data.forEach((item) => {
      const art = document.createElement("article");
      art.className = "card";

      const descHtml = item.description
        ? '<p class="desc">' + linkifyText(item.description) + "</p>"
        : "";

      const buttons = [];

      // لینک رسمی ثبت‌نام (فیلد link یا اولین URL غیر واتساپ در توضیح)
      let registerUrl =
        item.link && isSafeHttpUrl(item.link) && !isWhatsAppUrl(item.link)
          ? item.link.trim()
          : null;
      if (!registerUrl) registerUrl = extractFirstSafeUrl(item.description);

      if (registerUrl) {
        buttons.push(
          '<a class="btn btn-sm btn-outline" href="' +
            escapeHtml(registerUrl) +
            '" target="_blank" rel="noopener noreferrer">ثبت‌نام / جزئیات</a>'
        );
      }

      // لینک چینل واتساپ (از link یا توضیح)
      let waUrl =
        item.link && isSafeHttpUrl(item.link) && isWhatsAppUrl(item.link)
          ? item.link.trim()
          : null;
      if (!waUrl) waUrl = extractWhatsAppUrl(item.description);

      // برای UNHCR یا اگر لینک واتساپ نبود ولی سازمان مرتبط است
      const orgTitle = [item.organization, item.title]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      if (
        !waUrl &&
        (orgTitle.includes("unhcr") ||
          orgTitle.includes("یو ان") ||
          orgTitle.includes("مهاجر"))
      ) {
        // اگر لینک واتساپ در دیتابیس نبود، دکمه رسمی وظیفه گروپ را نشان نده مگر لینک در توضیح باشد
      }

      if (waUrl) {
        buttons.push(
          '<a class="btn btn-sm btn-outline" href="' +
            escapeHtml(waUrl) +
            '" target="_blank" rel="noopener noreferrer">ورود به چینل واتساپ</a>'
        );
      }

      // اگر هیچ دکمه‌ای نبود و link عمومی داشت
      if (!buttons.length && item.link && isSafeHttpUrl(item.link)) {
        buttons.push(
          '<a class="btn btn-sm btn-outline" href="' +
            escapeHtml(item.link.trim()) +
            '" target="_blank" rel="noopener noreferrer">جزئیات</a>'
        );
      }

      art.innerHTML =
        "<h3>" +
        escapeHtml(item.title) +
        "</h3>" +
        '<p class="meta">' +
        escapeHtml(
          [item.organization, item.location, item.level].filter(Boolean).join(" · ")
        ) +
        "</p>" +
        descHtml +
        (buttons.length
          ? '<div class="card-actions">' + buttons.join("") + "</div>"
          : "");
      box.appendChild(art);
    });
  } catch (e) {
    emptyState(box, "خطا در بارگذاری آموزش.");
  }
}

async function loadNews() {
  const box = document.getElementById("newsList");
  if (!box) return;
  box.innerHTML =
    '<p class="muted" style="grid-column:1/-1">در حال بارگذاری اخبار…</p>';
  try {
    const { data, error } = await fetchApproved(
      "news_articles",
      "id,title,summary,source_name,source_url,category,status,created_at"
    );
    if (error) {
      emptyState(box, "بخش اخبار پس از اجرای جداول دیتابیس فعال می‌شود.");
      return;
    }
    if (!data.length) {
      emptyState(box, "هنوز خبر تأییدشده‌ای منتشر نشده است.");
      return;
    }
    box.innerHTML = "";
    data.forEach((item) => {
      const art = document.createElement("article");
      art.className = "card";
      const src =
        item.source_url && isSafeHttpUrl(item.source_url)
          ? item.source_url.trim()
          : null;
      art.innerHTML =
        "<h3>" +
        escapeHtml(item.title) +
        "</h3>" +
        '<p class="meta">' +
        escapeHtml([item.category, item.source_name].filter(Boolean).join(" · ")) +
        "</p>" +
        (item.summary
          ? '<p class="desc">' + linkifyText(item.summary) + "</p>"
          : "") +
        (src
          ? '<a class="btn btn-sm btn-outline" href="' +
            escapeHtml(src) +
            '" target="_blank" rel="noopener noreferrer">منبع</a>'
          : "");
      box.appendChild(art);
    });
  } catch (e) {
    emptyState(box, "خطا در بارگذاری اخبار.");
  }
}

async function loadBanners() {
  try {
    const { data, error } = await fetchApproved(
      "banner_ads",
      "id,title,image_url,target_url,placement,starts_at,ends_at,status"
    );
    if (error || !data) return;
    const now = Date.now();
    const byPlacement = {};
    data.forEach((b) => {
      if (!b.image_url) return;
      if (b.starts_at && new Date(b.starts_at).getTime() > now) return;
      if (b.ends_at && new Date(b.ends_at).getTime() < now) return;
      const pl = b.placement || "home";
      if (!byPlacement[pl]) byPlacement[pl] = [];
      byPlacement[pl].push(b);
    });
    document.querySelectorAll(".banner-slot").forEach((slot) => {
      const place = slot.getAttribute("data-placement") || "home";
      const list = byPlacement[place] || [];
      if (!list.length) {
        slot.innerHTML = "";
        return;
      }
      const b = list[0];
      const title = escapeHtml(b.title || "تبلیغ");
      const img = escapeHtml(b.image_url);
      if (b.target_url && isSafeHttpUrl(b.target_url)) {
        slot.innerHTML =
          '<a class="site-banner" href="' +
          escapeHtml(b.target_url.trim()) +
          '" target="_blank" rel="noopener noreferrer" title="' +
          title +
          '"><img src="' +
          img +
          '" alt="' +
          title +
          '" loading="lazy" onerror="this.closest(\'.site-banner\').style.display=\'none\'"></a>';
      } else {
        slot.innerHTML =
          '<div class="site-banner"><img src="' +
          img +
          '" alt="' +
          title +
          '" loading="lazy" onerror="this.closest(\'.site-banner\').style.display=\'none\'"></div>';
      }
    });
  } catch (e) {
    console.error("banner load failed", e);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadEducation();
  loadBanners();
  loadNews();
});
