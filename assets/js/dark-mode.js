/**
 * Easy Coding - Dark Mode Toggle
 * Provides dark mode functionality for the educational coding website
 */

// Execute immediately to avoid flickering on page load
(function() {
    // Apply stored theme immediately before DOM content loaded
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const checkbox = document.getElementById('checkbox');
    const themeLabel = document.querySelector('.theme-label');
    
    // Apply theme on load
    applyTheme();

    // Add event listener if elements exist
    if (checkbox && themeLabel) {
        checkbox.addEventListener('change', function() {
            toggleTheme();
        });
    }

    /**
     * Apply the current theme from localStorage or system preference
     */
    function applyTheme() {
        const currentTheme = localStorage.getItem('theme');
        
        if (currentTheme) {
            // Apply stored theme
            document.body.classList.toggle('dark-mode', currentTheme === 'dark');
            
            // Update checkbox if it exists
            if (checkbox) {
                checkbox.checked = currentTheme === 'dark';
            }
            
            // Update label if it exists
            if (themeLabel) {
                themeLabel.textContent = currentTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
            }
        } else {
            // Check for system preference if no stored theme
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.body.classList.add('dark-mode');
                
                if (checkbox) {
                    checkbox.checked = true;
                }
                
                if (themeLabel) {
                    themeLabel.textContent = 'Light Mode';
                }
                
                localStorage.setItem('theme', 'dark');
            }
        }
    }

    /**
     * Toggle between light and dark theme
     */
    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        
        const isDark = document.body.classList.contains('dark-mode');
        const theme = isDark ? 'dark' : 'light';
        
        localStorage.setItem('theme', theme);
        
        if (themeLabel) {
            themeLabel.textContent = isDark ? 'Light Mode' : 'Dark Mode';
        }
    }
});
