const roles = [
  "Full-stack Developer",
  "Mobile App Developer",
  "AI Technology Enthusiast",
  "Secure API Builder",
  "Real-time Systems Developer"
];

const roleText = document.querySelector("#roleText");
const drawerToggle = document.querySelector(".drawer-toggle");
const drawerCloseTargets = document.querySelectorAll("[data-close-drawer]");
const navLinks = document.querySelectorAll(".nav-link, .drawer-link");
const sections = document.querySelectorAll("main section[id]");
const revealItems = document.querySelectorAll("[data-reveal]");
const parallaxTarget = document.querySelector("[data-parallax]");
const contactForm = document.querySelector("#contactForm");

let roleIndex = 0;
let charIndex = roles[0].length;
let deleting = true;

const currentPage = document.body.dataset.page;

if (currentPage) {
  document.querySelectorAll("[data-page-link]").forEach((link) => {
    link.classList.toggle("active", link.dataset.pageLink === currentPage);
  });
}

function animateRole() {
  const current = roles[roleIndex];
  roleText.textContent = current.slice(0, charIndex);

  if (deleting) {
    charIndex -= 1;
    if (charIndex === 0) {
      deleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
    }
  } else {
    charIndex += 1;
    if (charIndex === roles[roleIndex].length) {
      deleting = true;
      setTimeout(animateRole, 1400);
      return;
    }
  }

  setTimeout(animateRole, deleting ? 38 : 58);
}

function setDrawer(open) {
  document.body.classList.toggle("drawer-open", open);
  drawerToggle?.setAttribute("aria-expanded", String(open));
}

drawerToggle?.addEventListener("click", () => setDrawer(!document.body.classList.contains("drawer-open")));
drawerCloseTargets.forEach((target) => target.addEventListener("click", () => setDrawer(false)));

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (link.classList.contains("drawer-link")) {
      setDrawer(false);
    }
  });
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.16 });

revealItems.forEach((item) => revealObserver.observe(item));

if (!currentPage && sections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const id = entry.target.getAttribute("id");
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    });
  }, { rootMargin: "-42% 0px -48% 0px", threshold: 0.01 });

  sections.forEach((section) => sectionObserver.observe(section));
}

window.addEventListener("pointermove", (event) => {
  if (!parallaxTarget || window.matchMedia("(max-width: 980px)").matches) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 18;
  const y = (event.clientY / window.innerHeight - 0.5) * 18;
  parallaxTarget.style.transform = `translate3d(${x}px, ${y}px, 0)`;
});

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(contactForm);
  const name = formData.get("name");
  const email = formData.get("email");
  const message = formData.get("message");
  const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

  window.location.href = `mailto:gauravdahal321@gmail.com?subject=${subject}&body=${body}`;
  contactForm.reset();
});

if (roleText) {
  animateRole();
}
