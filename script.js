document.addEventListener('DOMContentLoaded', () => {
    const toggleButton = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const icon = toggleButton ? toggleButton.querySelector('i') : null;

    // Safety check: If the button isn't found, stop here to avoid errors
    if (!toggleButton) {
        console.error("Theme toggle button not found. Check your HTML ID.");
        return;
    }

    // 1. Check for saved user preference on load
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        htmlElement.setAttribute('data-theme', currentTheme);
        updateIcon(currentTheme);
    }

    // 2. Listen for clicks
    toggleButton.addEventListener('click', () => {
        const currentSetting = htmlElement.getAttribute('data-theme');
        const newTheme = currentSetting === 'dark' ? 'light' : 'dark';
        
        // Apply the new theme
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update the icon
        updateIcon(newTheme);
    });

    // Helper function to swap icons
    function updateIcon(theme) {
        if (!icon) return; // If icon is missing, skip
        if (theme === 'dark') {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }
});
const fullText = "Hello, I'm Tuan Pham.";
const name = "Tuan Pham";
const speed = 70;

let i = 0;
const target = document.getElementById("typed-text");

function typeWriter() {
  if (i < fullText.length) {
    target.textContent += fullText.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  } else {
    // Once typing is complete, recolor the name
    target.innerHTML = fullText.replace(
      name,
      `<span class="highlight">${name}</span>`
    );
  }
}

window.addEventListener("load", typeWriter);
(() => {
    const fill = document.querySelector(".scrollbar-fill");
  const ticks = document.querySelectorAll(".scrollbar-tick");
  const sections = [...document.querySelectorAll("section[id]")];

  function updateProgress() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

    if (fill) fill.style.height = `${pct}%`;
  }

  function updateActiveTick() {
    const scrollY = window.scrollY;
    let currentId = sections[0]?.id || "";

    for (const s of sections) {
      const top = s.offsetTop - 140;
      if (scrollY >= top) currentId = s.id;
    }

    ticks.forEach(t => {
      t.classList.toggle("active", t.dataset.section === currentId);
    });
  }

  function onScroll() {
    updateProgress();
    updateActiveTick();
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
(() => {
  const bar = document.getElementById("scroll-progress");
  if (!bar) return;

  function update() {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    bar.style.width = `${pct}%`;
  }

  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
  update();
})();
(() => {
  const sections = document.querySelectorAll("section[id]");
  const links = document.querySelectorAll(".toc a");
  const indicator = document.querySelector(".toc-indicator");

  if (!indicator || !links.length || !sections.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const activeLink = document.querySelector(
          `.toc a[data-section="${entry.target.id}"]`
        );

        if (!activeLink) return;

        links.forEach(link =>
          link.classList.toggle("active", link === activeLink)
        );

        const offset =
          activeLink.offsetTop +
          activeLink.offsetHeight / 2 -
          indicator.offsetHeight / 2;

        indicator.style.transform = `translateY(${offset}px)`;
      });
    },
    {
      rootMargin: "-35% 0px -35% 0px",
      threshold: 0.1
    }
  );

  sections.forEach(section => observer.observe(section));
})();
document.addEventListener("DOMContentLoaded", () => {
  const floating = document.getElementById("floating-profile");
  const hero = document.getElementById("home");

  if (!floating || !hero) return;

  const toggleFloating = () => {
    const heroBottom = hero.getBoundingClientRect().bottom;
    // Show once the hero is scrolled past (tune the 80 if you want earlier/later)
    if (heroBottom < 80) floating.classList.add("show");
    else floating.classList.remove("show");
  };

  toggleFloating();
  window.addEventListener("scroll", toggleFloating, { passive: true });
  window.addEventListener("resize", toggleFloating);
});
