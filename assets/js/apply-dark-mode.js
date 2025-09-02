/**
 * Easy Coding - Apply Dark Mode
 * Minimal script to apply dark mode immediately before page renders
 * This prevents flickering when dark mode is enabled
 */

// Apply dark mode immediately if saved in localStorage
(function() {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        
        // This will be applied as soon as the body is parsed
        document.addEventListener('DOMContentLoaded', function() {
            document.body.classList.add('dark-mode');
        });
    }
})();
