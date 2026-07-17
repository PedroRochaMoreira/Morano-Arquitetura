// ==========================================================
// PORTFOLIO - dados dos projetos
// Para adicionar um projeto novo, so copiar um objeto abaixo,
// trocar os textos e apontar "images" pras fotos em /assets
// ==========================================================
const projects = [
  {
    id: "leparc",
    title: "Le Parc Luziânia",
    category: "Residencial",
    description: "Ambiente social integrado com materiais nobres, luz indireta e composição acolhedora.",
    tall: false,
    images: ["assets/leparc.jpeg", "assets/leparc2.jpeg"]
  },
  {
    id: "AlphaVille",
    title: "AlphaVille Brasília",
    category: "Residencial",
    description: "Volumes amplos, iluminação cênica e paisagismo integrado ao desenho da fachada.",
    tall: true,
    images: ["assets/alphaville2.jpeg", "assets/alphaville.jpeg"]
  },
  {
    id: "TerraPark",
    title: "Terra Park Luziânia",
    category: "Residencial",
    description: "Fachada horizontal, varanda protegida e composição de pedra, vidro e madeira.",
    tall: false,
    images: ["assets/terrapark.jpeg", "assets/terrapark2.jpeg"]
  }
];

const projectGrid = document.querySelector("[data-project-grid]");

function renderProjects() {
  projectGrid.innerHTML = "";

  projects.forEach((project, index) => {
    const card = document.createElement("article");
    card.className = `project-card reveal${project.tall ? " tall" : ""}${index > 0 ? ` reveal-delay-${Math.min(index, 4)}` : ""}`;

    const extraThumbs = project.images.slice(1);
    const thumbsHtml = extraThumbs
      .map(
        (img, i) => `
          <button type="button" data-thumb-index="${i + 1}">
            <img src="${img}" alt="Outra imagem do ${project.title}" loading="lazy" />
          </button>`
      )
      .join("");

    card.innerHTML = `
      <img src="${project.images[0]}" alt="${project.title} - ${project.description}" />
      <div class="project-info">
        <span>${project.category}</span>
        <h3>${project.title}</h3>
        <p>${project.description}</p>
        ${extraThumbs.length ? `<div class="project-thumbs" aria-label="Outras imagens do ${project.title}">${thumbsHtml}</div>` : ""}
      </div>
    `;

    card.addEventListener("click", (event) => {
      const thumbButton = event.target.closest("[data-thumb-index]");
      const startIndex = thumbButton ? Number(thumbButton.dataset.thumbIndex) : 0;
      openLightbox(project, startIndex);
    });

    projectGrid.appendChild(card);
  });
}

renderProjects();

// ==========================================================
// LIGHTBOX
// ==========================================================
let lightboxProject = null;
let lightboxIndex = 0;
let lightboxScrollY = 0;

const lightboxOverlay = document.querySelector("[data-lightbox-overlay]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxCategory = document.querySelector("[data-lightbox-category]");
const lightboxCounter = document.querySelector("[data-lightbox-counter]");
const lightboxThumbStrip = document.querySelector("[data-lightbox-thumb-strip]");

function openLightbox(project, startIndex = 0) {
  lightboxProject = project;
  lightboxIndex = startIndex;
  renderLightbox();

  lightboxScrollY = window.scrollY;
  document.body.style.position = "fixed";
  document.body.style.top = `-${lightboxScrollY}px`;
  document.body.style.width = "100%";

  lightboxOverlay.classList.add("active");
}

function closeLightbox() {
  lightboxOverlay.classList.remove("active");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, lightboxScrollY);
  lightboxProject = null;
}

function lightboxNext() {
  if (!lightboxProject) return;
  lightboxIndex = (lightboxIndex + 1) % lightboxProject.images.length;
  renderLightbox();
}

function lightboxPrev() {
  if (!lightboxProject) return;
  lightboxIndex = (lightboxIndex - 1 + lightboxProject.images.length) % lightboxProject.images.length;
  renderLightbox();
}

function setLightboxIndex(i) {
  lightboxIndex = i;
  renderLightbox();
}

function renderLightbox() {
  if (!lightboxProject) return;

  lightboxImage.src = lightboxProject.images[lightboxIndex];
  lightboxImage.alt = lightboxProject.title;
  lightboxTitle.textContent = lightboxProject.title;
  lightboxCategory.textContent = lightboxProject.category;
  lightboxCounter.textContent = `${lightboxIndex + 1} / ${lightboxProject.images.length}`;

  lightboxThumbStrip.innerHTML = "";
  if (lightboxProject.images.length > 1) {
    lightboxProject.images.forEach((img, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = i === lightboxIndex ? "active" : "";
      btn.innerHTML = `<img src="${img}" alt="" loading="lazy" />`;
      btn.addEventListener("click", () => setLightboxIndex(i));
      lightboxThumbStrip.appendChild(btn);
    });
  }
}

document.querySelector("[data-lightbox-close]").addEventListener("click", closeLightbox);
document.querySelector("[data-lightbox-next]").addEventListener("click", lightboxNext);
document.querySelector("[data-lightbox-prev]").addEventListener("click", lightboxPrev);

lightboxOverlay.addEventListener("click", (event) => {
  if (event.target === lightboxOverlay) closeLightbox();
});

document.addEventListener("keydown", (event) => {
  if (!lightboxProject) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") lightboxNext();
  if (event.key === "ArrowLeft") lightboxPrev();
});

// ==========================================================

const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const parallaxItems = document.querySelectorAll("[data-parallax-speed]");
const countItems = document.querySelectorAll("[data-count]");
const form = document.querySelector(".contact-form");
const formNote = document.querySelector("[data-form-note]");
const cursorLight = document.querySelector(".cursor-light");
const images = document.querySelectorAll("img");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function markMissingImage(image) {
  const holder = image.closest(".brand") || image.parentElement;
  holder?.classList.add("image-fallback");
}

images.forEach((image) => {
  image.addEventListener("error", () => markMissingImage(image), { once: true });

  if (image.complete && image.naturalWidth === 0) {
    markMissingImage(image);
  }
});

function setHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 18);
}

let scrollPosition = 0;

function lockScroll() {
  scrollPosition = window.scrollY;
  document.body.classList.add("nav-open");
  document.body.style.position = "fixed";
  document.body.style.top = `-${scrollPosition}px`;
  document.body.style.width = "100%";
}

function unlockScroll() {
  document.body.classList.remove("nav-open");
  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.width = "";
  window.scrollTo(0, scrollPosition);
}

function closeNav() {
  header.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  unlockScroll();
}

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("menu-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
  if (isOpen) {
    lockScroll();
  } else {
    unlockScroll();
  }
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeNav();
  }
});

window.addEventListener("scroll", setHeaderState, { passive: true });
setHeaderState();

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item) => revealObserver.observe(item));

const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        countObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.7 }
);

countItems.forEach((item) => countObserver.observe(item));

function animateCount(element) {
  const target = Number(element.dataset.count);
  const suffix = element.dataset.suffix || "";
  const duration = 1100;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function updateParallax() {
  const viewportHeight = window.innerHeight;

  parallaxItems.forEach((item) => {
    const speed = Number(item.dataset.parallaxSpeed) || 0.12;
    const rect = item.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > viewportHeight) {
      return;
    }

    const offset = (viewportHeight / 2 - (rect.top + rect.height / 2)) * speed;
    item.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
}

if (!prefersReducedMotion) {
  let ticking = false;

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateParallax();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateParallax);
  updateParallax();

  window.addEventListener(
    "pointermove",
    (event) => {
      cursorLight.style.opacity = "1";
      cursorLight.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate3d(-50%, -50%, 0)`;
    },
    { passive: true }
  );
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("nome") || "Obrigado";

  fetch("https://formspree.io/f/meewyrro", {
    method: "POST",
    body: formData,
    headers: { Accept: "application/json" }
  })
    .then((response) => {
      if (response.ok) {
        formNote.textContent = `${name}, sua mensagem foi enviada com sucesso! Entraremos em contato em breve.`;
        form.reset();
      } else {
        formNote.textContent = "Ops! Algo deu errado ao enviar. Tente novamente.";
      }
    })
    .catch(() => {
      formNote.textContent = "Erro de conexão. Verifique sua internet e tente de novo.";
    });
});