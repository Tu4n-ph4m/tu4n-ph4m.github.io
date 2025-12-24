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
  const fill = document.getElementById("scrollbar-fill");
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
/* =====================================
   Minimal Research-Grade Scrollbar
   ===================================== */

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(148, 163, 184, 0.35) transparent;
}

/* WebKit (Chrome, Safari, Edge) */
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

*::-webkit-scrollbar-track {
  background: transparent;
}

*::-webkit-scrollbar-thumb {
  background-color: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
  transition: background-color 0.2s ease;
}

*::-webkit-scrollbar-thumb:hover {
  background-color: rgba(148, 163, 184, 0.6);
}
#scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 2px;
  width: 0%;
  background: linear-gradient(
    to right,
    rgba(148, 163, 184, 0.4),
    var(--accent)
  );
  z-index: 1000;
  pointer-events: none;
}
