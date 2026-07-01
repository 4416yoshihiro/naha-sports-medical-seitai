const body = document.body;
const header = document.querySelector("[data-header]");
const opening = document.querySelector("[data-opening]");
const drawer = document.querySelector("[data-drawer]");
const openButton = document.querySelector("[data-menu-open]");
const closeButton = document.querySelector("[data-menu-close]");
const sliders = [...document.querySelectorAll("[data-slider]")];
const animatedItems = [...document.querySelectorAll("[data-animate]")];

const seenOpening = sessionStorage.getItem("nagi-opening-seen") === "true";

function hideOpening(delay = 500) {
  setTimeout(() => {
    opening?.classList.add("is-hidden");
    body.classList.remove("is-locked");
    sessionStorage.setItem("nagi-opening-seen", "true");
  }, delay);
}

function playOpening() {
  if (!opening) return;

  if (seenOpening) {
    opening.classList.add("is-hidden");
    return;
  }

  body.classList.add("is-locked");
  opening.classList.add("is-playing");
  hideOpening(3000);
}

function startHeroSliders() {
  sliders.forEach((slider, sliderIndex) => {
    const images = [...slider.querySelectorAll("img")];
    let activeIndex = 0;

    setTimeout(() => {
      slider.classList.add("is-ready");
    }, 150 + sliderIndex * 220);

    if (images.length < 2) return;

    setInterval(() => {
      images[activeIndex].classList.remove("is-active");
      activeIndex = (activeIndex + 1) % images.length;
      images[activeIndex].classList.add("is-active");
    }, 5600 + sliderIndex * 600);
  });
}

function setupScrollAnimations() {
  if (!("IntersectionObserver" in window)) {
    animatedItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add("is-visible"), index * 70);
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0, rootMargin: "-10px 0px" }
  );

  animatedItems.forEach((item) => observer.observe(item));
}

function setupHeaderState() {
  const update = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 80);
  };
  update();
  window.addEventListener("scroll", update, { passive: true });
}

function openDrawer() {
  drawer?.classList.add("is-open");
  body.classList.add("is-locked");
  openButton?.setAttribute("aria-expanded", "true");
}

function closeDrawer() {
  drawer?.classList.remove("is-open");
  body.classList.remove("is-locked");
  openButton?.setAttribute("aria-expanded", "false");
}

function setupDrawer() {
  openButton?.addEventListener("click", openDrawer);
  closeButton?.addEventListener("click", closeDrawer);
  drawer?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

playOpening();
startHeroSliders();
setupScrollAnimations();
setupHeaderState();
setupDrawer();
