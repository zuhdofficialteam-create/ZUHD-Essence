"use strict";

// --------------------------------------------------------------
// DATA (categories and books)
// --------------------------------------------------------------
const CATEGORIES = {
  religious: {
    label: "Religious Books",
    sub: "Spirituality & Self-Purification",
    icon: "📖",
    books: [
      { title: "الداء والدواء", url: "https://noor-book.com/lar3zs", icon: "🌿" },
      { title: "إغاثة اللهفان من مصايد الشيطان", url: "https://noor-book.com/o0vigp", icon: "🛡️" },
      { title: "مدارج السالكين", url: "https://noor-book.com/o0vigp", icon: "🌙" },
      { title: "صيد الخاطر", url: "https://noor-book.com/vq6lay", icon: "✍️" },
      { title: "مختصر منهاج القاصدين", url: "https://noor-book.com/wdb1pf", icon: "📜" }
    ]
  },
  western: {
    label: "Self Development",
    sub: "Psychology, Habits & Mind",
    icon: "📘",
    books: [
      { title: "Atomic Habits", url: "https://a.co/d/06fPSGzi", icon: "⚛️", ltr: true },
      { title: "The Power of Habit", url: "https://a.co/d/0b4B5Wg2", icon: "🔁", ltr: true },
      { title: "Dopamine Nation", url: "https://a.co/d/0053raqw", icon: "🧠", ltr: true },
      { title: "The Molecule of More", url: "https://a.co/d/029TAVjd", icon: "🔬", ltr: true }
    ]
  }
};

// Ensure assets config exists
window.ZUHD_ASSETS = window.ZUHD_ASSETS || { bookCovers: {} };

// --------------------------------------------------------------
// DOM elements (with safe checks)
// --------------------------------------------------------------
const viewHome = document.getElementById("view-home");
const viewBooks = document.getElementById("view-books");
const booksGrid = document.getElementById("books-grid");
const booksTitleEl = document.getElementById("books-section-title");
const booksSubEl = document.getElementById("books-section-sub");
const booksIconEl = document.getElementById("books-section-icon");
const backBtn = document.getElementById("back-btn");
const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobile-menu");
const navbar = document.getElementById("navbar");
const footerYear = document.getElementById("footer-year");

let currentView = "home";

function formatNumber(n) {
  return n.toString();
}

// --------------------------------------------------------------
// Custom Logo Handler (safe)
// --------------------------------------------------------------
function initCustomLogo() {
  const logoUrl = window.ZUHD_ASSETS?.logoUrl;
  if (logoUrl) {
    // Navbar logo
    const defaultNavSvg = document.getElementById('default-logo-svg');
    const customNavImg = document.getElementById('custom-nav-logo');
    if (defaultNavSvg && customNavImg) {
      defaultNavSvg.style.display = 'none';
      customNavImg.src = logoUrl;
      customNavImg.alt = window.ZUHD_ASSETS.logoAlt || 'ZUHD Logo';
      customNavImg.style.display = 'block';
    }
    // Footer logo
    const defaultFooterSvg = document.getElementById('footer-default-logo');
    const customFooterImg = document.getElementById('custom-footer-logo');
    if (defaultFooterSvg && customFooterImg) {
      defaultFooterSvg.style.display = 'none';
      customFooterImg.src = logoUrl;
      customFooterImg.alt = window.ZUHD_ASSETS.logoAlt || 'ZUHD Logo';
      customFooterImg.style.display = 'block';
    }
  }
}

// --------------------------------------------------------------
// Populate books view
// --------------------------------------------------------------
function populateBooks(categoryKey) {
  const data = CATEGORIES[categoryKey];
  if (!data) return;
  if (booksIconEl) booksIconEl.textContent = data.icon;
  if (booksTitleEl) booksTitleEl.textContent = data.label;
  if (booksSubEl) booksSubEl.textContent = data.sub;
  if (!booksGrid) return;

  booksGrid.innerHTML = data.books
    .map((book, idx) => {
      const coverUrl = window.ZUHD_ASSETS.bookCovers[book.title];
      const coverHtml = coverUrl
        ? `<img src="${coverUrl}" alt="Cover of ${book.title}" loading="lazy">`
        : book.icon;

      return `
        <a class="book-card" href="${book.url}" target="_blank" rel="noopener noreferrer" role="listitem" aria-label="Open book: ${book.title}" style="animation-delay: ${idx * 0.07}s">
          <div class="book-glow" aria-hidden="true"></div>
          <div class="book-cover" aria-hidden="true">${coverHtml}</div>
          <div class="book-number" aria-hidden="true">${formatNumber(idx + 1).padStart(2, '0')}</div>
          <div class="book-title${book.ltr ? " ltr" : ""}">${book.title}</div>
          <div class="visit-btn" aria-hidden="true">
            <span>Read / Visit</span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
          </div>
        </a>
      `;
    })
    .join("");

  const cards = booksGrid.querySelectorAll(".book-card");
  cards.forEach((card, i) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    setTimeout(() => {
      card.style.transition = "opacity 0.35s ease, transform 0.35s ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 80 + i * 65);
  });
}

// --------------------------------------------------------------
// Switch between views
// --------------------------------------------------------------
function showView(view) {
  const from = currentView === "home" ? viewHome : viewBooks;
  if (from) from.classList.remove("active");
  currentView = view;

  if (view === "home") {
    if (viewBooks && viewHome) {
      setTimeout(() => {
        viewBooks.style.display = "none";
        viewHome.style.display = "block";
        requestAnimationFrame(() => viewHome.classList.add("active"));
      }, 120);
    }
  } else {
    populateBooks(view);
    if (viewHome && viewBooks) {
      setTimeout(() => {
        viewHome.style.display = "none";
        viewBooks.style.display = "block";
        requestAnimationFrame(() => viewBooks.classList.add("active"));
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 120);
    }
  }

  closeMobileMenu();
  document.querySelectorAll(".nav-link").forEach(link => link.classList.remove("active"));
  const activeNav = document.querySelector(`.nav-link[data-view="${view}"]`);
  if (activeNav) activeNav.classList.add("active");
}

// --------------------------------------------------------------
// Mobile menu
// --------------------------------------------------------------
function closeMobileMenu() {
  if (mobileMenu && hamburger) {
    mobileMenu.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    mobileMenu.setAttribute("aria-hidden", "true");
  }
}

if (hamburger) {
  hamburger.addEventListener("click", () => {
    const isOpen = mobileMenu.classList.toggle("open");
    hamburger.classList.toggle("open", isOpen);
    hamburger.setAttribute("aria-expanded", isOpen);
    mobileMenu.setAttribute("aria-hidden", !isOpen);
  });
}

// --------------------------------------------------------------
// Event listeners (safe)
// --------------------------------------------------------------
document.querySelectorAll(".cat-card").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.cat));
});

if (backBtn) backBtn.addEventListener("click", () => showView("home"));

document.querySelectorAll(".nav-link, .mobile-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const view = link.dataset.view;
    if (view === "home") showView("home");
    else showView(view);
  });
});

document.querySelectorAll(".footer-nav-btn").forEach(btn => {
  btn.addEventListener("click", () => showView(btn.dataset.view));
});

if (navbar) {
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 20);
  });
}

if (footerYear) footerYear.textContent = new Date().getFullYear();

// --------------------------------------------------------------
// Particles (unchanged)
// --------------------------------------------------------------
(function initParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    canvas.style.display = "none";
    return;
  }

  const ctx = canvas.getContext("2d");
  let width, height, particles;
  const PARTICLE_COUNT = window.innerWidth < 600 ? 38 : 72;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor(initialY = null) { this.reset(initialY); }
    reset(initialY = null) {
      this.x = Math.random() * width;
      this.y = initialY !== null ? initialY : height + Math.random() * 20;
      this.size = Math.random() * 1.8 + 0.4;
      this.speedY = Math.random() * 0.4 + 0.12;
      this.speedX = (Math.random() - 0.5) * 0.2;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.twinkleSpeed = Math.random() * 0.012 + 0.004;
      this.twinkleDir = Math.random() > 0.5 ? 1 : -1;
      this.baseAlpha = this.alpha;
    }
    update() {
      this.y -= this.speedY;
      this.x += this.speedX;
      this.alpha += this.twinkleSpeed * this.twinkleDir;
      if (this.alpha >= this.baseAlpha + 0.2 || this.alpha <= 0.03) this.twinkleDir *= -1;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = Math.min(1, Math.max(0, this.alpha));
      ctx.fillStyle = "#D4AF37";
      ctx.shadowColor = "#D4AF37";
      ctx.shadowBlur = this.size * 2.5;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function initParticles() {
    resizeCanvas();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  let animationId;
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => { p.update(); p.draw(); });
    animationId = requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    particles.forEach(p => p.reset());
  });

  initParticles();
  animate();

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) cancelAnimationFrame(animationId);
    else animate();
  });
})();

// Ripple effect
document.addEventListener("click", e => {
  const card = e.target.closest(".cat-card");
  if (!card) return;
  const rect = card.getBoundingClientRect();
  const ripple = document.createElement("span");
  const size = Math.max(rect.width, rect.height) * 1.6;
  const x = e.clientX - rect.left - size / 2;
  const y = e.clientY - rect.top - size / 2;
  Object.assign(ripple.style, {
    position: "absolute",
    width: `${size}px`,
    height: `${size}px`,
    left: `${x}px`,
    top: `${y}px`,
    borderRadius: "50%",
    background: "rgba(201, 168, 76, 0.15)",
    transform: "scale(0)",
    animation: "rippleAnim 0.55s ease-out forwards",
    pointerEvents: "none",
    zIndex: "2"
  });
  card.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove());
});

if (!document.querySelector("#ripple-keyframes")) {
  const style = document.createElement("style");
  style.id = "ripple-keyframes";
  style.textContent = `@keyframes rippleAnim { to { transform: scale(1); opacity: 0; } }`;
  document.head.appendChild(style);
}

// Initial state
if (viewHome && viewBooks) {
  viewHome.style.display = "block";
  viewBooks.style.display = "none";
  requestAnimationFrame(() => viewHome.classList.add("active"));
}

// Initialize custom logo after DOM is fully loaded
document.addEventListener('DOMContentLoaded', initCustomLogo);