document.addEventListener('DOMContentLoaded', () => {
    
    // 0. Preloader
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            // Minimum display time of 1.5 seconds for better UX
            setTimeout(() => {
                preloader.classList.add('hidden');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 1500);
        });
    }
    
    // 1. Set Dynamic Year in Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 2. Theme Switcher Logic
    const toggleButton = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved user preference, if any, on load
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        htmlElement.setAttribute('data-theme', 'light');
    }

    // Toggle Event Listener
    if (toggleButton) {
        toggleButton.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }

    // 3. Scroll Animation Observer (With Replay Logic)
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% of element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Check if the element has the reset class
            const shouldReset = entry.target.classList.contains('animation-reset');

            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
            } else {
                // If it's out of view and marked for reset, remove the class to replay later
                if (shouldReset) {
                    entry.target.classList.remove('is-visible');
                }
            }
        });
    }, observerOptions);

    // Select all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-section, .slide-in-left, .slide-in-right, .scale-in');
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
});