/*
  script.js — behaviour shared by every page.
  Each feature only runs when its element exists on the current page.

  1. Theme (light/dark, remembered)
  2. Footer year
  3. Mobile menu
  4. Navbar shadow on scroll
  5. Skill bars
  6. Fade-in on scroll
  7. Back-to-top button
  8. Contact form submission
*/

// ============================================================
// 1) THEME — the choice is saved in localStorage and applied
//    before first paint by the inline script in each page's <head>.
// ============================================================
const t = (text) => (window.I18N ? window.I18N.t(text) : text);

const root = document.documentElement;
const themeToggle = document.getElementById("themeToggle");
const themeIcon = themeToggle ? themeToggle.querySelector(".theme-icon") : null;

const applyTheme = (theme, persist) => {
  const dark = theme === "dark";
  root.setAttribute("data-theme", dark ? "dark" : "light");

  if (persist) {
    try {
      localStorage.setItem("theme", dark ? "dark" : "light");
    } catch (error) {
      /* storage can be blocked; the theme still applies for this visit */
    }
  }

  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.setAttribute("content", dark ? "#17120e" : "#f7f1e6"));

  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute(
      "aria-label",
      t(dark ? "Switch to light theme" : "Switch to dark theme")
    );
  }
  if (themeIcon) themeIcon.textContent = dark ? "\u2600" : "\u263E";
};

if (themeToggle) {
  applyTheme(root.getAttribute("data-theme"), false);

  themeToggle.addEventListener("click", () => {
    applyTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark", true);
  });

  document.addEventListener("langchange", () => {
    applyTheme(root.getAttribute("data-theme"), false);
  });
}

// ============================================================
// 2) FOOTER YEAR
// ============================================================
const year = document.getElementById("year");
if (year) {
  year.textContent = new Date().getFullYear();
}

// ============================================================
// 3) MOBILE MENU
// ============================================================
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

if (menuToggle && navLinks) {
  const setMenu = (open) => {
    navLinks.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", t(open ? "Close menu" : "Open menu"));
  };

  document.addEventListener("langchange", () => {
    menuToggle.setAttribute(
      "aria-label",
      t(navLinks.classList.contains("open") ? "Close menu" : "Open menu")
    );
  });

  menuToggle.addEventListener("click", () => {
    setMenu(!navLinks.classList.contains("open"));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  // Tapping anywhere outside the open panel closes it
  document.addEventListener("click", (event) => {
    if (!navLinks.classList.contains("open")) return;
    const inside = navLinks.contains(event.target) || menuToggle.contains(event.target);
    if (!inside) setMenu(false);
  });

  // Leaving mobile layout should not leave a stray open panel behind
  window.addEventListener("resize", () => {
    if (window.innerWidth > 680) setMenu(false);
  });
}

// ============================================================
// 4) NAVBAR — subtle shadow once the page is scrolled
// ============================================================
const navbar = document.querySelector(".navbar");
if (navbar) {
  const syncNav = () => navbar.classList.toggle("scrolled", window.scrollY > 8);
  syncNav();
  window.addEventListener("scroll", syncNav, { passive: true });
}

// ============================================================
// 5) SKILL BARS — fill when scrolled into view
// ============================================================
const skillFills = document.querySelectorAll(".skill-fill");

if (skillFills.length > 0) {
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.dataset.level + "%";
        skillObserver.unobserve(fill);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach((fill) => skillObserver.observe(fill));
}

// ============================================================
// 5b) SKILLS PAGE — three cards first, the rest behind a button
// ============================================================
const skillsMore = document.getElementById("skillsMore");
const skillsGrid = document.getElementById("skillsGrid");

if (skillsMore && skillsGrid) {
  const hiddenCards = skillsGrid.querySelectorAll(".skill-card.is-hidden");

  skillsMore.addEventListener("click", () => {
    hiddenCards.forEach((card) => card.classList.remove("is-hidden"));
    skillsMore.hidden = true;
  });
}

// ============================================================
// 6) SCROLL REVEAL — staggered fade-up for groups of elements
//
//    Every [data-fade] is a group. Its children become reveal items,
//    and a single wrapper (like .about-story or .card-body) has its
//    own children revealed instead so paragraphs stagger too.
//    Only opacity and transform animate, so nothing reflows.
// ============================================================
const fadeGroups = document.querySelectorAll("[data-fade]");

if (fadeGroups.length > 0) {
  const revealItems = [];

  fadeGroups.forEach((group) => {
    let items = Array.from(group.children);

    // One wrapper holding several blocks: stagger its children.
    if (items.length === 1 && items[0].children.length > 1) {
      items = Array.from(items[0].children);
    }

    items.forEach((item, index) => {
      if (item.classList.contains("reveal-item")) return;
      item.classList.add("reveal-item");
      // Cap the stagger so long lists never feel slow.
      item.style.setProperty("--reveal-delay", Math.min(index, 6) * 70 + "ms");
      revealItems.push(item);
    });
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reduceMotion.matches) {
    revealItems.forEach((el) => el.classList.add("is-revealed"));
  } else {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

    revealItems.forEach((el) => revealObserver.observe(el));
  }
}

// ============================================================
// 7) BACK-TO-TOP BUTTON
// ============================================================
const backToTop = document.getElementById("backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    backToTop.classList.toggle("show", window.scrollY > 320);
  }, { passive: true });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// ============================================================
// 8) CONTACT FORM
//
//    Submissions are delivered by Web3Forms, a form service for
//    static sites — no backend needed.
//
//    SETUP (one minute):
//    1. Open https://web3forms.com and create a free access key
//       for witnessamson047@gmail.com — the key arrives by email.
//    2. Paste that key into FORM_CONFIG.accessKey below.
//    3. On the Web3Forms dashboard, add your site domain under
//       Allowed Domains.
//
//    Until a key is added, the form falls back to opening an
//    email draft so visitors are never left without a way to write.
// ============================================================
const FORM_CONFIG = {
  endpoint: "https://api.web3forms.com/submit",
  accessKey: "4d5f6724-3c1e-401d-9bca-efb1a7cc5cff", // <-- paste your Web3Forms access key here
  subject: "New message from your portfolio",
  fallbackEmail: "witnessamson047@gmail.com"
};

const contactForm = document.getElementById("contactForm");

if (contactForm) {
  const nameInput    = document.getElementById("cfName");
  const emailInput   = document.getElementById("cfEmail");
  const messageInput = document.getElementById("cfMessage");
  const errorMsg     = document.getElementById("cfError");
  const statusMsg    = document.getElementById("cfStatus");
  const submitBtn    = contactForm.querySelector('button[type="submit"]');
  const honeypot     = contactForm.querySelector('[name="botcheck"]');

  const setError = (input, bad) => {
    input.classList.toggle("is-error", bad);
    input.setAttribute("aria-invalid", String(bad));
  };

  const showStatus = (text, kind) => {
    statusMsg.textContent = text;
    statusMsg.classList.remove("ok", "error");
    statusMsg.classList.add("visible", kind);
  };

  const openMailDraft = (name, email, message) => {
    const subject = encodeURIComponent("Portfolio message from " + name);
    const body = encodeURIComponent(
      "Name: " + name + "\n" +
      "Reply to: " + email + "\n\n" +
      message
    );
    const link = document.createElement("a");
    link.href =
      "mailto:" + FORM_CONFIG.fallbackEmail +
      "?subject=" + subject +
      "&body=" + body;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const labelHTML = submitBtn ? submitBtn.innerHTML : "";

    const name    = nameInput.value.trim();
    const email   = emailInput.value.trim();
    const message = messageInput.value.trim();

    const nameBad    = name.length < 2;
    const emailBad   = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const messageBad = message.length < 10;

    setError(nameInput, nameBad);
    setError(emailInput, emailBad);
    setError(messageInput, messageBad);

    if (nameBad || emailBad || messageBad) {
      errorMsg.textContent =
        (nameBad ? t("Please enter your name. ") : "") +
        (emailBad ? t("Please enter a valid email (like name@example.com). ") : "") +
        (messageBad ? t("Your message needs at least 10 characters.") : "");
      errorMsg.classList.add("visible");
      statusMsg.classList.remove("visible", "ok", "error");
      return;
    }

    errorMsg.classList.remove("visible");

    // No key yet: keep the site usable with an email draft
    if (!FORM_CONFIG.accessKey) {
      showStatus(
        t(
          "The form service is not connected yet, so your email app is opening instead. " +
            "Send the message from there. It reaches the same inbox."
        ),
        "error"
      );
      openMailDraft(name, email, message);
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = t("Sending\u2026");
    }
    showStatus(t("Sending your message\u2026"), "ok");
    statusMsg.classList.remove("ok");

    try {
      const response = await fetch(FORM_CONFIG.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({
          access_key: FORM_CONFIG.accessKey,
          subject: FORM_CONFIG.subject,
          from_name: "Portfolio contact form",
          botcheck: honeypot && honeypot.checked ? "on" : "",
          name: name,
          email: email,
          message: message
        })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success !== false) {
        showStatus(
          t("Message sent. Thank you! I'll reply to {email} soon.").replace("{email}", email),
          "ok"
        );
        contactForm.reset();
      } else {
        showStatus(
          data.message ||
            t("Sorry, the message could not be sent. Please try again or email me directly."),
          "error"
        );
      }
    } catch (error) {
      showStatus(
        t(
          "No connection to the form service. Please check your internet and try again, or email me directly."
        ),
        "error"
      );
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = labelHTML;
      }
    }
  });

  [nameInput, emailInput, messageInput].forEach((input) => {
    input.addEventListener("input", () => setError(input, false));
  });
}
