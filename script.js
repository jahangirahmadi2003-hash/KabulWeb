/**
 * کابل‌وب — اسکریپت صفحه اصلی
 * بارگذاری واقعی از Supabase + صفحه آغازین + UI + فیلتر جستجو
 */
import {
  fetchApproved,
  submitAdRequest,
  getSession,
} from "./js/supabase.js";

let jobsCache = [];
let listingsCache = [];

document.addEventListener("DOMContentLoaded", () => {
  initSplash();
  initMenu();
  initSmoothScroll();
  initTypeButtons();
  initAdForm();
  initSearchFilters();
  loadPublicData();
  updateAuthLink();
});

function initSplash() {
  const splash = document.getElementById("splash");
  const skipBtn = document.getElementById("skipSplash");
  if (!splash) return;
  const KEY = "kabulweb_intro_seen_v1";
  let seen = false;
  try {
    seen = localStorage.getItem(KEY) === "1";
  } catch (_) {}
  function hide() {
    splash.classList.add("hide");
    document.body.classList.remove("intro-active");
    try {
      localStorage.setItem(KEY, "1");
    } catch (_) {}
    setTimeout(() => {
      if (splash.parentNode) splash.remove();
    }, 600);
  }
  if (seen) {
    hide();
    return;
  }
  const timer = setTimeout(hide, 5200);
  if (skipBtn)
    skipBtn.addEventListener("click", () => {
      clearTimeout(timer);
      hide();
    });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" || e.key === "Enter") {
      clearTimeout(timer);
      hide();
    }
  });
}

function initMenu() {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  nav.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      nav.classList.remove("open");
      btn.setAttribute("aria-expanded", "false");
    })
  );
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 75;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

function initTypeButtons() {
  document.querySelectorAll("[data-type]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-type");
      const select = document.getElementById("adType");
      if (select && type) select.value = type;
    });
  });
}

function initSearchFilters() {
  const jobSearch = document.getElementById("jobSearch");
  const jobCity = document.getElementById("jobCity");
  const productSearch = document.getElementById("productSearch");
  const productCat = document.getElementById("productCat");

  if (jobSearch) jobSearch.addEventListener("input", renderJobsFiltered);
  if (jobCity) jobCity.addEventListener("change", renderJobsFiltered);
  if (productSearch) productSearch.addEventListener("input", renderListingsFiltered);
  if (productCat) productCat.addEventListener("change", renderListingsFiltered);
}

async function loadPublicData() {
  await Promise.all([loadJobs(), loadListings(), loadChannels()]);
}

function escapeHtml(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

function emptyState(container, message, actionHref, actionLabel) {
  container.innerHTML =
    '<div class="empty-state"><p>' +
    escapeHtml(message) +
    "</p>" +
    (actionHref
      ? '<a class="btn btn-sm btn-primary" href="' +
        escapeHtml(actionHref) +
        '">' +
        escapeHtml(actionLabel) +
        "</a>"
      : "") +
    "</div>";
}

function renderJobCard(job) {
  const art = document.createElement("article");
  art.className = "card";
  art.innerHTML =
    "<h3>" +
    escapeHtml(job.title) +
    "</h3>" +
    '<p class="meta">' +
    escapeHtml([job.company, job.location, job.type].filter(Boolean).join(" · ")) +
    "</p>" +
    (job.description
      ? '<p class="desc">' +
        escapeHtml(job.description.slice(0, 160)) +
        (job.description.length > 160 ? "…" : "") +
        "</p>"
      : "") +
    '<div class="card-foot"><span class="price">' +
    escapeHtml(job.salary || "قابل مذاکره") +
    "</span>" +
    (job.contact
      ? '<a class="btn btn-sm btn-outline" href="tel:' +
        escapeHtml(String(job.contact).replace(/\s/g, "")) +
        '">تماس</a>'
      : "") +
    "</div>";
  return art;
}

function renderJobsFiltered() {
  const box = document.getElementById("jobsList");
  if (!box) return;
  const q = (document.getElementById("jobSearch")?.value || "").trim().toLowerCase();
  const city = (document.getElementById("jobCity")?.value || "").trim();

  let list = jobsCache;
  if (q) {
    list = list.filter((j) => {
      const hay = [j.title, j.company, j.location, j.type, j.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (city) {
    list = list.filter((j) => (j.location || "").includes(city));
  }

  if (!jobsCache.length) {
    emptyState(box, "هنوز فرصت کاری تأییدشده‌ای ثبت نشده است.", "#ads", "ثبت وظیفه جدید");
    return;
  }
  if (!list.length) {
    emptyState(box, "نتیجه‌ای با این فیلتر یافت نشد.", "#ads", "ثبت وظیفه جدید");
    return;
  }
  box.innerHTML = "";
  list.forEach((job) => box.appendChild(renderJobCard(job)));
}

async function loadJobs() {
  const box = document.getElementById("jobsList");
  if (!box) return;
  box.innerHTML =
    '<p class="muted" style="grid-column:1/-1">در حال بارگذاری فرصت‌های کاری…</p>';
  const { data, error } = await fetchApproved(
    "job_posts",
    "id,title,company,location,type,salary,deadline,description,contact,status,created_at"
  );
  if (error) {
    emptyState(
      box,
      "خطا در دریافت فرصت‌های کاری. اتصال را بررسی کنید.",
      "#ads",
      "ثبت وظیفه"
    );
    return;
  }
  jobsCache = data || [];
  renderJobsFiltered();
}

function renderListingCard(item) {
  const art = document.createElement("article");
  art.className = "card product";
  const price =
    item.price != null
      ? escapeHtml(String(item.price)) +
        (item.currency ? " " + escapeHtml(item.currency) : "")
      : "قابل مذاکره";
  art.innerHTML =
    (item.image_url
      ? '<img class="thumb-img" src="' +
        escapeHtml(item.image_url) +
        '" alt="" loading="lazy" onerror="this.style.display=\'none\'">'
      : '<div class="thumb" aria-hidden="true">📦</div>') +
    "<h3>" +
    escapeHtml(item.title) +
    "</h3>" +
    '<p class="meta">' +
    escapeHtml(
      [item.seller_name, item.category, item.listing_type].filter(Boolean).join(" · ")
    ) +
    "</p>" +
    '<p class="price">' +
    price +
    "</p>" +
    (item.contact
      ? '<a class="btn btn-sm btn-primary" href="https://wa.me/' +
        escapeHtml(String(item.contact).replace(/[^\d+]/g, "")) +
        '" target="_blank" rel="noopener">تماس با فروشنده</a>'
      : "");
  return art;
}

function renderListingsFiltered() {
  const box = document.getElementById("listingsList");
  if (!box) return;
  const q = (document.getElementById("productSearch")?.value || "")
    .trim()
    .toLowerCase();
  const cat = (document.getElementById("productCat")?.value || "").trim();

  let list = listingsCache;
  if (q) {
    list = list.filter((item) => {
      const hay = [item.title, item.seller_name, item.category, item.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }
  if (cat) {
    list = list.filter((item) => (item.category || "").includes(cat));
  }

  if (!listingsCache.length) {
    emptyState(
      box,
      "هنوز محصول یا خدمت تأییدشده‌ای وجود ندارد.",
      "#ads",
      "ثبت محصول یا خدمت"
    );
    return;
  }
  if (!list.length) {
    emptyState(box, "نتیجه‌ای با این فیلتر یافت نشد.", "#ads", "ثبت محصول یا خدمت");
    return;
  }
  box.innerHTML = "";
  list.forEach((item) => box.appendChild(renderListingCard(item)));
}

async function loadListings() {
  const box = document.getElementById("listingsList");
  if (!box) return;
  box.innerHTML =
    '<p class="muted" style="grid-column:1/-1">در حال بارگذاری محصولات…</p>';
  const { data, error } = await fetchApproved(
    "listings",
    "id,title,category,description,price,currency,seller_name,contact,image_url,listing_type,status,created_at"
  );
  if (error) {
    emptyState(box, "خطا در دریافت محصولات و خدمات.", "#ads", "ثبت محصول");
    return;
  }
  listingsCache = data || [];
  renderListingsFiltered();
}

async function loadChannels() {
  const box = document.getElementById("channelsList");
  if (!box) return;
  const { data, error } = await fetchApproved(
    "ad_requests",
    "id,name,platform,link,description,status,created_at"
  );
  if (error || !data) return;
  const channels = data.filter((r) => {
    const p = (r.platform || "").toLowerCase();
    return (
      p.includes("واتساپ") ||
      p.includes("تلگرام") ||
      p.includes("whatsapp") ||
      p.includes("telegram") ||
      p.includes("کانال")
    );
  });
  channels.slice(0, 12).forEach((ch) => {
    const art = document.createElement("article");
    art.className = "card channel";
    const link = ch.link && /^https?:\/\//i.test(ch.link) ? ch.link : "#";
    art.innerHTML =
      '<div class="channel-icon" aria-hidden="true">📢</div>' +
      "<h3>" +
      escapeHtml(ch.name || "کانال") +
      "</h3>" +
      '<p class="desc">' +
      escapeHtml((ch.description || "").slice(0, 100)) +
      "</p>" +
      '<span class="tag">' +
      escapeHtml(ch.platform || "کانال") +
      "</span>" +
      (link !== "#"
        ? '<a href="' +
          escapeHtml(link) +
          '" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-outline">ورود به کانال</a>'
        : "");
    box.appendChild(art);
  });
}

function initAdForm() {
  const form = document.getElementById("adForm");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const type = document.getElementById("adType").value;
    const title = document.getElementById("adTitle").value.trim();
    const desc = document.getElementById("adDesc").value.trim();
    const link = document.getElementById("adLink").value.trim();
    const contact = document.getElementById("adContact").value.trim();
    const msg = document.getElementById("adMessage");
    const submitBtn = document.getElementById("adSubmit");
    if (!type || !title || !desc || !contact) {
      showFormMessage(msg, "لطفاً تمام فیلدهای ضروری (*) را پر کنید.", "error");
      return;
    }
    if (link) {
      try {
        const u = new URL(link);
        if (u.protocol !== "http:" && u.protocol !== "https:") throw new Error();
      } catch (_) {
        showFormMessage(msg, "لینک باید با http یا https شروع شود.", "error");
        return;
      }
    }
    const platformMap = {
      job: "کاریابی",
      product: "فروشگاه آنلاین",
      service: "سایر",
      channel: "کانال واتساپ",
      other: "سایر",
    };
    submitBtn.disabled = true;
    submitBtn.textContent = "در حال ارسال…";
    const { data, error } = await submitAdRequest({
      name: title,
      contact,
      platform: platformMap[type] || type,
      link: link || null,
      description: desc,
      package: "free",
    });
    if (error) {
      console.error("Ad insert error:", error);
      let text = "ثبت درخواست ناموفق بود. ";
      if (
        error.code === "42501" ||
        (error.message || "").includes("row-level security")
      ) {
        text +=
          "سیاست امنیتی پایگاه داده اجازه ثبت عمومی را نمی‌دهد. مدیر باید سیاست INSERT برای وضعیت pending را در Supabase فعال کند.";
      } else {
        text += error.message || "خطای ناشناخته.";
      }
      showFormMessage(msg, text, "error");
      showToast("ثبت ناموفق بود.", "error");
    } else {
      showFormMessage(
        msg,
        "درخواست شما ثبت شد و در وضعیت «در انتظار بررسی» است." +
          (data?.id ? " شناسه: " + data.id : ""),
        "success"
      );
      showToast("درخواست با موفقیت ارسال شد.");
      form.reset();
    }
    submitBtn.disabled = false;
    submitBtn.textContent = "ارسال درخواست";
  });
}

async function updateAuthLink() {
  const { session } = await getSession();
  if (session?.user) {
    document.querySelectorAll(".nav-account").forEach((el) => {
      el.textContent = "حساب من";
    });
  }
}

function showFormMessage(el, text, type) {
  if (!el) return;
  el.hidden = false;
  el.className = "form-message " + type;
  el.textContent = text;
}

function showToast(text, type) {
  type = type || "success";
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = text;
  el.className = "toast " + type;
  el.hidden = false;
  setTimeout(() => {
    el.hidden = true;
  }, 4000);
}
