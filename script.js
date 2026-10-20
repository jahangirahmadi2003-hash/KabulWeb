/* کابل‌وب — اسکریپت اصلی */
document.addEventListener("DOMContentLoaded", () => {
  initSplash();
  initMenu();
  initForms();
  initSmoothScroll();
});

/* صفحه آغازین — فقط یک‌بار با localStorage */
function initSplash() {
  const splash = document.getElementById("splash");
  const skipBtn = document.getElementById("skipSplash");
  if (!splash) return;

  const KEY = "kabulweb_intro_seen";
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
    setTimeout(() => splash.remove(), 600);
  }

  if (seen) {
    hide();
    return;
  }

  // نمایش حدود ۵ ثانیه
  const timer = setTimeout(hide, 5200);
  skipBtn.addEventListener("click", () => {
    clearTimeout(timer);
    hide();
  });
}

/* منوی موبایل */
function initMenu() {
  const btn = document.getElementById("menuBtn");
  const nav = document.getElementById("nav");
  if (!btn || !nav) return;

  btn.addEventListener("click", () => {
    nav.classList.toggle("open");
  });

  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => nav.classList.remove("open"));
  });
}

/* اسکرول نرم */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const id = this.getAttribute("href");
      if (!id || id === "#") return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.pageYOffset - 75;
        window.scrollTo({ top, behavior: "smooth" });
      }
    });
  });
}

/* فرم‌ها و Toast */
function showToast(msg, type = "success") {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.className = "toast " + type;
  el.classList.remove("hidden");
  setTimeout(() => el.classList.add("hidden"), 3500);
}

function initForms() {
  const form = document.getElementById("adForm");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const type = document.getElementById("adType").value;
    const title = document.getElementById("adTitle").value.trim();
    const desc = document.getElementById("adDesc").value.trim();
    const contact = document.getElementById("adContact").value.trim();

    if (!type || !title || !desc || !contact) {
      showToast("لطفاً فیلدهای ضروری را پر کنید.", "error");
      return;
    }

    // آماده برای اتصال Supabase (جدول ad_requests)
    console.log("Ad request:", { type, title, desc, contact });
    showToast("درخواست شما ثبت شد و در انتظار بررسی است.");
    form.reset();
  });
}
