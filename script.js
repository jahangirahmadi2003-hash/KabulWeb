"use strict";

document.addEventListener("DOMContentLoaded", function () {
// نمایش پیام خوش‌آمدگویی در کنسول
console.log("به وب‌سایت کابل‌وب خوش آمدید!");

// نمایش سال جاری در پاورقی، در صورت وجود عنصر مربوطه
const footer = document.querySelector("footer");

if (footer) {
const year = new Date().getFullYear();
const copyright = footer.querySelector("p");

if (copyright) {
  copyright.textContent =
    "© " + year + " کابل‌وب | تمامی حقوق محفوظ است.";
}

}

// حرکت نرم به بخش‌های داخلی صفحه
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
link.addEventListener("click", function (event) {
const targetId = this.getAttribute("href");

  if (!targetId || targetId === "#") {
    return;
  }

  const target = document.querySelector(targetId);

  if (target) {
    event.preventDefault();
    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
});

});
});