/**
 * کابل‌وب — اسکریپت نهایی
 * صفحه آغازین فقط یک‌بار (localStorage)
 * فرم‌ها آماده اتصال به Supabase
 */
(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    initSplash();
    initMenu();
    initSmoothScroll();
    initAdForm();
    initTypeButtons();
  });

  /* ---------- صفحه آغازین ---------- */
  function initSplash() {
    var splash = document.getElementById("splash");
    var skipBtn = document.getElementById("skipSplash");
    if (!splash) return;

    var KEY = "kabulweb_intro_seen_v1";
    var seen = false;

    try {
      seen = localStorage.getItem(KEY) === "1";
    } catch (e) {
      /* localStorage در دسترس نیست */
    }

    function hide() {
      splash.classList.add("hide");
      document.body.classList.remove("intro-active");
      try {
        localStorage.setItem(KEY, "1");
      } catch (e) {}
      setTimeout(function () {
        if (splash.parentNode) splash.parentNode.removeChild(splash);
      }, 600);
    }

    if (seen) {
      hide();
      return;
    }

    var timer = setTimeout(hide, 5200);

    if (skipBtn) {
      skipBtn.addEventListener("click", function () {
        clearTimeout(timer);
        hide();
      });
    }

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" || e.key === "Enter") {
        clearTimeout(timer);
        hide();
      }
    });
  }

  /* ---------- منوی موبایل ---------- */
  function initMenu() {
    var btn = document.getElementById("menuBtn");
    var nav = document.getElementById("nav");
    if (!btn || !nav) return;

    btn.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      btn.setAttribute("aria-label", open ? "بستن منو" : "باز کردن منو");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- اسکرول نرم ---------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener("click", function (e) {
        var id = this.getAttribute("href");
        if (!id || id === "#") return;
        var target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - 75;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ---------- پیش‌انتخاب نوع تبلیغ ---------- */
  function initTypeButtons() {
    document.querySelectorAll("[data-type]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var type = this.getAttribute("data-type");
        var select = document.getElementById("adType");
        if (select && type) {
          select.value = type;
        }
      });
    });
  }

  /* ---------- فرم ثبت تبلیغات ---------- */
  function initAdForm() {
    var form = document.getElementById("adForm");
    if (!form) return;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var type = document.getElementById("adType").value;
      var title = document.getElementById("adTitle").value.trim();
      var desc = document.getElementById("adDesc").value.trim();
      var link = document.getElementById("adLink").value.trim();
      var contact = document.getElementById("adContact").value.trim();
      var msg = document.getElementById("adMessage");
      var submitBtn = document.getElementById("adSubmit");

      if (!type || !title || !desc || !contact) {
        showFormMessage(msg, "لطفاً تمام فیلدهای ضروری (*) را پر کنید.", "error");
        showToast("فیلدهای ضروری را کامل کنید.", "error");
        return;
      }

      if (link) {
        try {
          var url = new URL(link);
          if (url.protocol !== "http:" && url.protocol !== "https:") {
            throw new Error("invalid");
          }
        } catch (err) {
          showFormMessage(msg, "لینک واردشده معتبر نیست. از http یا https استفاده کنید.", "error");
          return;
        }
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "در حال ارسال...";

      /*
       * نقطه اتصال به Supabase:
       * پس از ساخت پروژه و جدول ad_requests، کد زیر را فعال کنید:
       *
       * const { data, error } = await supabase
       *   .from('ad_requests')
       *   .insert([{ type, title, description: desc, link, contact, status: 'pending' }]);
       *
       * if (error) { ... } else { ... }
       */

      setTimeout(function () {
        showFormMessage(
          msg,
          "درخواست شما ثبت شد و در وضعیت «در انتظار بررسی» قرار گرفت.",
          "success"
        );
        showToast("درخواست با موفقیت ارسال شد.");
        form.reset();
        submitBtn.disabled = false;
        submitBtn.textContent = "ارسال درخواست";
      }, 600);
    });
  }

  /* ---------- پیام فرم و Toast ---------- */
  function showFormMessage(el, text, type) {
    if (!el) return;
    el.hidden = false;
    el.className = "form-message " + type;
    el.textContent = text;
  }

  function showToast(text, type) {
    type = type || "success";
    var el = document.getElementById("toast");
    if (!el) return;
    el.textContent = text;
    el.className = "toast " + type;
    el.hidden = false;
    setTimeout(function () {
      el.hidden = true;
    }, 3500);
  }
})();
