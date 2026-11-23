/* XipSoft — arayüz etkileşimleri */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Yıl */
  var yearEl = document.getElementById("yil");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Sabit header durumu */
  var header = document.getElementById("site-header");
  var onScroll = function () {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Mobil menü */
  var toggle = document.querySelector(".nav-toggle");
  var navLinks = document.getElementById("nav-links");

  var setMenu = function (open) {
    if (!header || !toggle) return;
    header.classList.toggle("is-menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  };

  if (toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!header.classList.contains("is-menu-open"));
    });
  }

  if (navLinks) {
    navLinks.addEventListener("click", function (event) {
      if (event.target.closest("a")) setMenu(false);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", function (event) {
    if (!header || !header.classList.contains("is-menu-open")) return;
    if (!header.contains(event.target)) setMenu(false);
  });

  /* Görünürken açılan bölümler */
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduceMotion) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Sayaçlar */
  var counters = document.querySelectorAll("[data-count]");
  var runCounter = function (el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;
    if (reduceMotion) { el.textContent = target; return; }

    var duration = 1300;
    var start = performance.now();

    var tick = function (now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if ("IntersectionObserver" in window) {
    var counterObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            runCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  /* Aktif menü bağlantısı */
  var sections = document.querySelectorAll("main section[id]");
  var menuLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if ("IntersectionObserver" in window && sections.length) {
    var sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          menuLinks.forEach(function (link) {
            link.classList.toggle(
              "is-active",
              link.getAttribute("href") === "#" + entry.target.id
            );
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach(function (section) { sectionObserver.observe(section); });
  }

  /* Form */
  var form = document.getElementById("teklif-form");
  if (!form) return;

  var statusEl = form.querySelector(".form-status");
  var submitBtn = form.querySelector('button[type="submit"]');
  var labelEl = submitBtn ? submitBtn.querySelector(".btn-label") : null;
  var originalLabel = labelEl ? labelEl.textContent : "";

  var setStatus = function (type, html) {
    if (!statusEl) return;
    statusEl.className = "form-status is-" + type;
    statusEl.innerHTML = html;
  };

  var clearStatus = function () {
    if (!statusEl) return;
    statusEl.className = "form-status";
    statusEl.textContent = "";
  };

  form.addEventListener("input", function () {
    if (statusEl && statusEl.classList.contains("is-error")) clearStatus();
  });

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearStatus();

    if (!form.checkValidity()) {
      form.reportValidity();
      setStatus("error", "Lütfen zorunlu alanları eksiksiz doldurun.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      if (labelEl) labelEl.textContent = "Gönderiliyor…";
    }

    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        }).catch(function () {
          return { ok: false, data: null };
        });
      })
      .then(function (result) {
        if (result.ok && result.data && result.data.ok) {
          form.reset();
          setStatus("success", result.data.message || "Mesajınız alındı. En kısa sürede dönüş yapacağız.");
        } else {
          var msg = (result.data && result.data.message) || "Form şu anda gönderilemiyor.";
          setStatus(
            "error",
            msg + ' Dilerseniz <a href="https://t.me/xiplarex" target="_blank" rel="noopener">Telegram</a> üzerinden doğrudan yazabilirsiniz.'
          );
        }
      })
      .catch(function () {
        setStatus(
          "error",
          'Form sunucusuna ulaşılamadı. Ayarlar tamamlanana kadar <a href="https://t.me/xiplarex" target="_blank" rel="noopener">Telegram: @xiplarex</a> adresinden yazabilirsiniz.'
        );
      })
      .finally(function () {
        if (submitBtn) {
          submitBtn.disabled = false;
          if (labelEl) labelEl.textContent = originalLabel;
        }
      });
  });
})();
