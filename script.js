/* ==========================================================
   Attaullah Hameed — Portfolio Script (Vanilla JS)
   ========================================================== */

(() => {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Mobile Nav Toggle ---------- */
  const navToggle = $("#nav-toggle");
  const navMenu = $("#nav-menu");

  navToggle.addEventListener("click", () => {
    navMenu.classList.toggle("is-open");
    navToggle.classList.toggle("is-open");
  });

  // Close mobile menu when any link is clicked
  $$(".nav__link").forEach(link => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("is-open");
      navToggle.classList.remove("is-open");
    });
  });

  /* ---------- Header shadow on scroll ---------- */
  const header = $("#header");
  const onScrollHeader = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();

  /* ---------- Active Nav Link on Scroll ---------- */
  const sections = $$("section[id]");
  const navLinks = $$(".nav__link");

  const setActiveLink = () => {
    const scrollPos = window.scrollY + 100;
    let current = sections[0]?.id || "home";
    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) current = sec.id;
    });
    navLinks.forEach(l => {
      l.classList.toggle("active", l.getAttribute("href") === `#${current}`);
    });
  };
  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* ---------- Reveal on Scroll (IntersectionObserver) ---------- */
  const reveals = $$(".reveal");
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");

        // Animate skill bars inside this revealed element
        $$(".skill__fill", entry.target).forEach(bar => {
          const val = bar.getAttribute("data-fill");
          requestAnimationFrame(() => { bar.style.width = `${val}%`; });
        });

        // If the revealed element IS a skill bar fill (when wrapped in .reveal)
        if (entry.target.classList.contains("skill")) {
          const fill = $(".skill__fill", entry.target);
          if (fill) fill.style.width = `${fill.getAttribute("data-fill")}%`;
        }

        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach(el => io.observe(el));

  /* ---------- Testimonials Slider ---------- */
  const track = $("#slider-track");
  const slides = $$(".slide", track);
  const dotsWrap = $("#dots");
  const prevBtn = $("#prev");
  const nextBtn = $("#next");
  let current = 0;
  let autoTimer;

  // Build dots
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.setAttribute("aria-label", `Go to slide ${i + 1}`);
    b.addEventListener("click", () => goTo(i, true));
    dotsWrap.appendChild(b);
  });
  const dots = $$("button", dotsWrap);

  function goTo(i, user = false) {
    current = (i + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, idx) => d.classList.toggle("active", idx === current));
    if (user) restartAuto();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }

  prevBtn.addEventListener("click", () => { prev(); restartAuto(); });
  nextBtn.addEventListener("click", () => { next(); restartAuto(); });

  function startAuto() { autoTimer = setInterval(next, 5500); }
  function restartAuto() { clearInterval(autoTimer); startAuto(); }
  goTo(0);
  startAuto();

  /* ---------- Contact Form Validation ---------- */
  const form = $("#contact-form");
  const success = $("#form-success");

  const setError = (name, msg) => {
    const field = form.querySelector(`[name="${name}"]`).closest(".field");
    const err = form.querySelector(`[data-error="${name}"]`);
    field.classList.toggle("invalid", !!msg);
    err.textContent = msg || "";
  };

  const validators = {
    name: v => v.trim().length >= 2 ? "" : "Please enter your name (2+ characters).",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Please enter a valid email.",
    subject: v => v.trim().length >= 3 ? "" : "Subject is too short.",
    message: v => v.trim().length >= 10 ? "" : "Message should be at least 10 characters.",
  };

  // Live validation
  Object.keys(validators).forEach(name => {
    const input = form.querySelector(`[name="${name}"]`);
    input.addEventListener("blur", () => setError(name, validators[name](input.value)));
    input.addEventListener("input", () => {
      if (input.closest(".field").classList.contains("invalid")) {
        setError(name, validators[name](input.value));
      }
    });
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let ok = true;
    Object.keys(validators).forEach(name => {
      const input = form.querySelector(`[name="${name}"]`);
      const msg = validators[name](input.value);
      setError(name, msg);
      if (msg) ok = false;
    });
    if (!ok) return;

    // Simulate submit
    success.classList.add("show");
    form.reset();
    setTimeout(() => success.classList.remove("show"), 4500);
  });

  /* ---------- Back to Top ---------- */
  const backTop = $("#back-top");
  window.addEventListener("scroll", () => {
    backTop.classList.toggle("show", window.scrollY > 500);
  }, { passive: true });
  backTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- Footer year ---------- */
  $("#year").textContent = new Date().getFullYear();
})();
