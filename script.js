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
const text = "Hello, I'm Tuan Pham.";
const speed = 70; // ms per character

let i = 0;
const target = document.getElementById("typed-text");

function typeWriter() {
  if (i < text.length) {
    target.textContent += text.charAt(i);
    i++;
    setTimeout(typeWriter, speed);
  }
}

window.addEventListener("load", typeWriter);
