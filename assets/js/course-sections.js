// Course Sections JavaScript
// This script handles loading and displaying course sections dynamically

// Store the current active section
let currentSection = null;

// Initialize sections map to cache loaded content
const sectionsCache = new Map();

// Main function to load and display a section
async function loadSection(sectionPath, pushHistory = true) {
    try {
        // Show loading indicator
        const mainContent = document.querySelector('.tutorial-content');
        if (!mainContent) return;
        
        // Remember which section was clicked for highlighting in sidebar
        const sectionLinks = document.querySelectorAll('.sidebar a');
        sectionLinks.forEach(link => {
            if (link.getAttribute('data-section') === sectionPath) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // If we've already loaded this section, use the cached content
        if (sectionsCache.has(sectionPath)) {
            mainContent.innerHTML = sectionsCache.get(sectionPath);
            currentSection = sectionPath;
            
            // Update browser history if needed
            if (pushHistory) {
                const stateObj = { section: sectionPath };
                window.history.pushState(stateObj, '', `?section=${sectionPath}`);
            }
            
            // Scroll to top
            window.scrollTo(0, 0);
            return;
        }

        // Show loading state
        mainContent.innerHTML = '<div class="loading-section"><i class="fas fa-spinner fa-spin"></i> Loading content...</div>';
        
        // Fetch the section content
        const response = await fetch(sectionPath);
        
        if (!response.ok) {
            throw new Error(`Failed to load section: ${response.status}`);
        }
        
        const html = await response.text();
        
        // Extract only the content part from the loaded HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const sectionContent = doc.querySelector('.tutorial-content');
        
        if (sectionContent) {
            // Update the main content with the loaded section
            const contentHtml = sectionContent.innerHTML;
            mainContent.innerHTML = contentHtml;
            
            // Cache the section content
            sectionsCache.set(sectionPath, contentHtml);
            
            // Update the current section
            currentSection = sectionPath;
            
            // Update browser history if needed
            if (pushHistory) {
                const stateObj = { section: sectionPath };
                window.history.pushState(stateObj, '', `?section=${sectionPath}`);
            }
            
            // Initialize any code examples or interactive elements if needed
            initializeInteractiveElements();
            
            // Scroll to top
            window.scrollTo(0, 0);
        } else {
            throw new Error('Could not find tutorial content in the loaded section');
        }
    } catch (error) {
        console.error('Error loading section:', error);
        const mainContent = document.querySelector('.tutorial-content');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="error-message">
                    <h2><i class="fas fa-exclamation-triangle"></i> Error Loading Content</h2>
                    <p>Sorry, we couldn't load the requested content. Please try again later.</p>
                    <button onclick="loadSection('${currentSection || ''}')" class="btn-primary">Try Again</button>
                </div>
            `;
        }
    }
}

// Initialize any interactive elements in the loaded content
function initializeInteractiveElements() {
    // This function can be expanded to handle any JavaScript functionality
    // that needs to be initialized after loading new content
    
    // For example, handling code examples, copy buttons, etc.
    const codeBlocks = document.querySelectorAll('.example-code');
    codeBlocks.forEach(block => {
        // Initialize syntax highlighting or other features for code blocks
    });
    
    // Handle "Try it yourself" buttons if needed
    const tryButtons = document.querySelectorAll('.try-it-yourself a');
    // Add event handlers if needed
}

// Handle browser back/forward navigation
window.addEventListener('popstate', (event) => {
    if (event.state && event.state.section) {
        loadSection(event.state.section, false);
    } else {
        // Load default section if no state is available
        const defaultSection = document.querySelector('.sidebar a.default-section');
        if (defaultSection) {
            loadSection(defaultSection.getAttribute('data-section'), false);
        }
    }
});

// Check for section parameter in URL when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Convert sidebar links to use section loading
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    sidebarLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.includes('://')) {
            // Store the original href as a data attribute
            link.setAttribute('data-section', href);
            
            // Prevent default navigation and use our custom loader
            link.addEventListener('click', (e) => {
                e.preventDefault();
                loadSection(href);
            });
        }
    });
    
    // Check if URL has a section parameter
    const urlParams = new URLSearchParams(window.location.search);
    const sectionParam = urlParams.get('section');
    
    if (sectionParam) {
        // Load the requested section
        loadSection(sectionParam, false);
    } else {
        // Set the current page content as the default section
        const currentPageContent = document.querySelector('.tutorial-content').innerHTML;
        sectionsCache.set(window.location.pathname, currentPageContent);
        currentSection = window.location.pathname;
        
        // Mark the current page link as active if it exists
        const currentPageLink = document.querySelector(`.sidebar a[href="${window.location.pathname}"]`);
        if (currentPageLink) {
            currentPageLink.classList.add('active');
        }
    }
});
