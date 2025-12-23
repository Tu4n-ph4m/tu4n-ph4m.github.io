const toggleButton = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;
const icon = toggleButton.querySelector('i');

// Check for saved user preference, if any, on load of the website
const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

if (currentTheme) {
    htmlElement.setAttribute('data-theme', currentTheme);
    if (currentTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

toggleButton.addEventListener('click', () => {
    // Get the current theme
    let theme = htmlElement.getAttribute('data-theme');
    
    if (theme === 'dark') {
        // Switch to light
        htmlElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        // Switch to dark
        htmlElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
});
