document.addEventListener("DOMContentLoaded", () => {
  // 0. Preloader
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        preloader.classList.add("hidden");
        setTimeout(() => {
          preloader.style.display = "none";
        }, 600);
      }, 1500);
    });
  }

  // 1. Custom Cursor
  const cursor = document.getElementById("customCursor");
  if (cursor) {
    if (window.matchMedia("(pointer: fine)").matches) {
      document.addEventListener("mousemove", (e) => {
        cursor.style.left = e.clientX + "px";
        cursor.style.top = e.clientY + "px";
      });

      const interactiveElements = document.querySelectorAll(
        "a, button, .project-card, .value-card",
      );
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () =>
          cursor.classList.add("hovering"),
        );
        el.addEventListener("mouseleave", () =>
          cursor.classList.remove("hovering"),
        );
      });
    } else {
      cursor.style.display = "none";
    }
  }

  // 5. Theme Switcher
  const toggleButton = document.getElementById("themeToggle");
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem("theme");
  const systemPrefersDark = window.matchMedia(
    "(prefers-color-scheme: dark)",
  ).matches;

  if (savedTheme === "dark" || (!savedTheme && systemPrefersDark)) {
    htmlElement.setAttribute("data-theme", "dark");
  } else {
    htmlElement.setAttribute("data-theme", "light");
  }

  if (toggleButton) {
    toggleButton.addEventListener("click", () => {
      const currentTheme = htmlElement.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      htmlElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
    });
  }

  // 6. Scroll Animation Observer
  const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const shouldReset = entry.target.classList.contains("animation-reset");
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      } else if (shouldReset) {
        entry.target.classList.remove("is-visible");
      }
    });
  }, observerOptions);

  // Assuming you have elements to observe
  document.querySelectorAll(".slide-in-right, .fade-in").forEach((el) => {
    observer.observe(el);
  });
});

// ==========================================
// MODAL & TEAM DATA (Global Scope)
// ==========================================

// Icon Dictionary for Social Links
const socialIcons = {
  github: {
    name: "GitHub",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653 1.064 2.874.939 3.176.771.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  },
  githubalt: {
    name: "GitHub Alt",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653 1.064 2.874.939 3.176.771.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>`,
  },
  twitter: {
    name: "Twitter",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-.424.727-.666 1.561-.666 2.477 0 1.61.82 3.027 2.053 3.642-.764-.024-1.482-.234-2.11-.583v.061c0 2.257 1.605 4.14 3.737 4.568-.39.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.303 3.2 4.33 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.092 7.14 2.092 8.57 0 13.255-7.098 13.255-13.254 0-.202-.005-.403-.014-.602.91-.658 1.7-1.475 2.323-2.41z"/></svg>`,
  },
  instagram: {
    name: "Instagram",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28 .073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>`,
  },
  youtube: {
    name: "YouTube",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>`,
  },
  discord: {
    name: "Discord",
    svg: `<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.069.069 0 0 0-.032.027C.533 9.048-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.862-1.297 1.197-1.99a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.125-.094.25-.192.37-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.37.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.054-3.03.08.08 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.946-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.419-2.157 2.419z"/></svg>`,
  },
  reddit: {
    name: "Reddit",
    svg: `<svg width="20" height="20" viewBox="0 0 512 512" fill="currentColor"><path d="M0 256C0 114.6 114.6 0 256 0S512 114.6 512 256 397.4 512 256 512L37.1 512c-13.7 0-20.5-16.5-10.9-26.2L75 437C28.7 390.7 0 326.7 0 256zM349.6 153.6c23.6 0 42.7-19.1 42.7-42.7s-19.1-42.7-42.7-42.7c-20.6 0-37.8 14.6-41.8 34-34.5 3.7-61.4 33-61.4 68.4l0 .2c-37.5 1.6-71.8 12.3-99 29.1-10.1-7.8-22.8-12.5-36.5-12.5-33 0-59.8 26.8-59.8 59.8 0 24 14.1 44.6 34.4 54.1 2 69.4 77.6 125.2 170.6 125.2s168.7-55.9 170.6-125.3c20.2-9.6 34.1-30.2 34.1-54 0-33-26.8-59.8-59.8-59.8-13.7 0-26.3 4.6-36.4 12.4-27.4-17-62.1-27.7-100-29.1l0-.2c0-25.4 18.9-46.5 43.4-49.9 4.4 18.8 21.3 32.8 41.5 32.8l.1 .2zM177.1 246.9c16.7 0 29.5 17.6 28.5 39.3s-13.5 29.6-30.3 29.6-31.4-8.8-30.4-30.5 15.4-38.3 32.1-38.3l.1-.1zm190.1 38.3c1 21.7-13.7 30.5-30.4 30.5s-29.3-7.9-30.3-29.6 11.8-39.3 28.5-39.3 31.2 16.6 32.1 38.3l.1 .1zm-48.1 56.7c-10.3 24.6-34.6 41.9-63 41.9s-52.7-17.3-63-41.9c-1.2-2.9 .8-6.2 3.9-6.5 18.4-1.9 38.3-2.9 59.1-2.9s40.7 1 59.1 2.9c3.1 .3 5.1 3.6 3.9 6.5z"/></svg>`,
  },
};

// Team Member Data
const teamMembers = {
  oliver: {
    name: "Oliver Lebaigue",
    role: "Founder / Developer",
    image: "https://github.com/oliver-lebaigue-2-bright-bench.png",
    bio: "The original creator and founder of Luminus Labs. Systems programmer and designer building honest tools at the intersection of code and craft. Oliver is passionate about systems programming, operating systems, and creating software with deep technical foundations.",
    socials: [
      { platform: "github", url: "https://github.com/oliver-lebaigue-bright-bench" },
      { platform: "githubalt", url: "https://github.com/oliver-lebaigue-2-bright-bench" },
      { platform: "discord", url: "https://discord.com/users/1383944551277924443", username: "oliverlebaigue" },
    ],
  },
  cubezockii: {
    name: "Cubezockii",
    role: "Developer",
    image: "https://github.com/cubezockii.png",
    bio: "Creative developer focused on bringing innovative ideas to life through code. With expertise in web development, UI/UX design, and system integration, Cubezockii transforms complex ideas into user-friendly applications.",
    socials: [
      { platform: "github", url: "https://github.com/cubezockii" },
      { platform: "twitter", url: "https://twitter.com/cubezockii" },
      { platform: "instagram", url: "https://instagram.com/cubezockii" },
      { platform: "reddit", url: "https://reddit.com/u/CubeZockii/" },
      { platform: "discord", url: "https://discord.com/users/804361392344793119", username: "cubezockii" },
    ],
  },
  aleks: {
    name: "Aleks-Levet",
    role: "Tester / Editor / Marketing",
    image: "https://github.com/aleks-levet.png",
    bio: "Testing and giving constructive feedback, also helps promote and do videos. Aleks brings a critical eye to product quality and user experience, ensuring that every release meets the highest standards.",
    socials: [
      { platform: "github", url: "https://github.com/aleks-levet" },
      { platform: "reddit", url: "https://reddit.com/u/alekslevet" },
      { platform: "youtube", url: "https://www.youtube.com/@alekslevet" },
      { platform: "discord", url: "https://discord.com/users/1086040015093649499", username: "alekslevet" },
    ],
  },
  gethin: {
    name: "Gethin Hughes",
    role: "Tester / Marketing",
    image: "https://github.com/gething-hughes-pet-paths.png",
    bio: "Tester making sure that shipped software is perfect and safe to use. Gethin has a keen eye for detail and a passion for quality assurance, ensuring that every application meets rigorous standards.",
    socials: [
      { platform: "github", url: "https://github.com/gething-hughes-pet-paths" },
      { platform: "discord", url: "https://discord.com/users/1448015401014394962", username: "gethin01085" },
    ],
  },
  startrail: {
    name: "Startrail",
    role: "Graphic Design / Web Testing",
    image: "https://github.com/hydrogen10234u4.png",
    bio: "Graphic designer and web-only tester bringing visual design and quality assurance to the team. Startrail combines artistic vision with technical precision to create visually stunning and functional interfaces.",
    socials: [
      { platform: "github", url: "https://github.com/hydrogen10234u4" },
    ],
  },
};

// Modal Interaction Logic
const modal = document.getElementById("teamModal");

function openModal(memberId) {
  const member = teamMembers[memberId];
  if (!member) return;

  // Set modal text and images
  document.getElementById("modalImage").src = member.image;
  document.getElementById("modalName").textContent = member.name;
  document.getElementById("modalRole").textContent = member.role;
  document.getElementById("modalBio").textContent = member.bio;

  // Dynamically generate social links
  const modalSocials = document.getElementById("modalSocials");
  modalSocials.innerHTML = ""; // Clear out previous data

  if (member.socials) {
    member.socials.forEach((social) => {
      const platformData = socialIcons[social.platform.toLowerCase()];
      if (platformData) {
        const anchor = document.createElement("a");
        anchor.className = "social-link";

        // Special handling for Discord platform
        if (social.platform.toLowerCase() === "discord") {
          // Case 1: Discord has both URL and username
          if (social.url && social.username) {
            anchor.href = social.url;
            anchor.target = "_blank";
            anchor.setAttribute("data-discord-username", social.username);

            // Add hover behavior to show username tooltip
            anchor.addEventListener("mouseenter", () => {
              const tooltip = document.createElement("div");
              tooltip.className = "discord-tooltip";
              tooltip.textContent = social.username;
              anchor.appendChild(tooltip);

              tooltip.style.position = "absolute";
              tooltip.style.bottom = "100%";
              tooltip.style.left = "50%";
              tooltip.style.transform = "translateX(-50%)";
              tooltip.style.background = "var(--card-bg)";
              tooltip.style.color = "var(--text-main)";
              tooltip.style.padding = "4px 8px";
              tooltip.style.borderRadius = "4px";
              tooltip.style.border = "1px solid var(--border-color)";
              tooltip.style.fontSize = "0.85rem";
              tooltip.style.zIndex = "10001";
              tooltip.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            });

            anchor.addEventListener("mouseleave", () => {
              const existingTooltip = anchor.querySelector(".discord-tooltip");
              if (existingTooltip) {
                existingTooltip.remove();
              }
            });
          }
          // Case 2: Discord has only username (no URL)
          else if (social.username) {
            anchor.setAttribute("data-discord-username", social.username);
            anchor.style.cursor = "pointer";

            // For desktop: show username on hover
            anchor.addEventListener("mouseenter", () => {
              // Show username as tooltip
              const tooltip = document.createElement("div");
              tooltip.className = "discord-tooltip";
              tooltip.textContent = social.username;
              anchor.appendChild(tooltip);

              // Position tooltip above the icon
              tooltip.style.position = "absolute";
              tooltip.style.bottom = "100%";
              tooltip.style.left = "50%";
              tooltip.style.transform = "translateX(-50%)";
              tooltip.style.background = "var(--card-bg)";
              tooltip.style.color = "var(--text-main)";
              tooltip.style.padding = "4px 8px";
              tooltip.style.borderRadius = "4px";
              tooltip.style.border = "1px solid var(--border-color)";
              tooltip.style.fontSize = "0.85rem";
              tooltip.style.zIndex = "10001";
              tooltip.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            });

            // Remove tooltip on mouse leave
            anchor.addEventListener("mouseleave", () => {
              const existingTooltip = anchor.querySelector(".discord-tooltip");
              if (existingTooltip) {
                existingTooltip.remove();
              }
            });

            // Add click event for touch devices
            anchor.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();

              // Check if there's already a visible username
              const existingDisplay = document.createElement("div");
              existingDisplay.className = "discord-username-display";
              existingDisplay.textContent = social.username;
              existingDisplay.style.position = "absolute";
              existingDisplay.style.top = "-30px";
              existingDisplay.style.left = "0";
              existingDisplay.style.right = "0";
              existingDisplay.style.background = "var(--card-bg)";
              existingDisplay.style.color = "var(--text-main)";
              existingDisplay.style.padding = "6px 12px";
              existingDisplay.style.borderRadius = "4px";
              existingDisplay.style.border = "1px solid var(--accent)";
              existingDisplay.style.textAlign = "center";
              existingDisplay.style.zIndex = "10001";
              existingDisplay.style.transition = "opacity 0.3s ease";

              const existing =
                anchor.querySelector(".discord-username-display") ||
                document.querySelector(".discord-username-display");
              if (existing) {
                existing.remove();
                if (existing !== existingDisplay) {
                  const oldAnchor = existing.closest(".social-link");
                  if (oldAnchor) {
                    oldAnchor.style.background = "";
                  }
                }
              }

              anchor.appendChild(existingDisplay);
              anchor.style.background = "var(--accent-soft)";

              // Remove after a few seconds
              setTimeout(() => {
                existingDisplay.remove();
                anchor.style.background = "";
              }, 2000);
            });
          }
          // Case 3: Discord has only URL (no username) - treat as regular link
          else if (social.url) {
            anchor.href = social.url;
            anchor.target = "_blank";
          }
        }
        // Regular non-Discord social links
        else if (social.url) {
          anchor.href = social.url;
          anchor.target = "_blank";
        }

        anchor.innerHTML = `
          ${platformData.svg}
          ${platformData.name}
        `;
        anchor.style.position = "relative";
        modalSocials.appendChild(anchor);
      }
    });
  }

  // Show Modal
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
  }
}

function closeModal() {
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = ""; // Re-enable scrolling
  }
}

// Close modal when clicking outside of it
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });
}

// Attach click events to all team member cards
const teamCards = document.querySelectorAll(".team-member");

teamCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    // Prevent the modal from opening if the user clicks the direct GitHub link
    if (e.target.closest("a")) return;

    const memberId = card.getAttribute("data-member");
    if (memberId) {
      openModal(memberId);
    }
  });
});

// 2. Particle Background
const canvas = document.getElementById("particlesCanvas");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }

    draw() {
      ctx.fillStyle = `rgba(217, 48, 37, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 50; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p1, i) => {
      particles.slice(i + 1).forEach((p2) => {
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = `rgba(217, 48, 37, ${0.1 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }
      });
    });
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// 4. Set Dynamic Year
const yearSpan = document.getElementById("year");
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

// 6. Scroll Animation Observer
const observerOptions = { root: null, rootMargin: "0px", threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const shouldReset = entry.target.classList.contains("animation-reset");
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    } else if (shouldReset) {
      entry.target.classList.remove("is-visible");
    }
  });
}, observerOptions);

document
  .querySelectorAll(
    ".fade-in-section, .slide-in-left, .slide-in-right, .scale-in",
  )
  .forEach((el) => {
    observer.observe(el);
  });
