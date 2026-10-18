// ===== KabulWeb - صفحه‌ی آغازین سینمایی =====
(function () {
  "use strict";

  const stage          = document.getElementById("introStage");
  const bismillahLayer = document.getElementById("bismillahLayer");
  const enterWrap      = document.getElementById("enterWrap");
  const enterBtn       = document.getElementById("enterBtn");

  // زمان‌بندی (میلی‌ثانیه)
  const TIMING = {
    showBismillah: 200,    // شروع نوشتار بسم الله
    tear: 4200,            // شروع پاره‌شدن ورق
    showEnter: 6000,       // نمایش دکمه ورود
  };

  // ۱) نمایش بسم الله
  setTimeout(() => {
    bismillahLayer.classList.remove("hide");
  }, TIMING.showBismillah);

  // ۲) پاره‌شدن ورق از وسط
  setTimeout(() => {
    // محو کردن بسم الله تا محتوای پشت ورق دیده شود
    bismillahLayer.classList.add("hide");
    stage.classList.add("tear");
  }, TIMING.tear);

  // ۳) نمایش دکمه ورود
  setTimeout(() => {
    enterWrap.classList.add("show");
  }, TIMING.showEnter);

  // ۴) دکمه ورود → رفتن به صفحه‌ی اصلی
  enterBtn.addEventListener("click", () => {
    // با fade-out ملایم به index.html می‌رویم
    document.body.style.transition = "opacity .6s ease";
    document.body.style.opacity = "0";
    setTimeout(() => {
      window.location.href = "index.html";
    }, 600);
  });

  // ۵) کلید Space یا Enter هم کار کند (دسترسی‌پذیری)
  document.addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && enterWrap.classList.contains("show")) {
      enterBtn.click();
    }
  });
})();
