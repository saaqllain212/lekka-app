/* =================================
   LEKKA - Main JavaScript
   ================================= */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all modules
    initNavbar();
    initMobileMenu();
    initSmoothScroll();
    initScrollReveal();
    initParallax();
    initCounterAnimation();
});

/* =================================
   Navbar Scroll Effect
   ================================= */

function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    const scrollThreshold = 50;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Add/remove scrolled class
        if (currentScroll > scrollThreshold) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }

        lastScroll = currentScroll;
    }, { passive: true });
}

/* =================================
   Mobile Menu Toggle
   ================================= */

function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-menu__link, .mobile-menu__cta');
    const body = document.body;

    if (!hamburger || !mobileMenu) return;

    // Toggle menu
    hamburger.addEventListener('click', () => {
        const isActive = hamburger.classList.contains('active');
        
        hamburger.classList.toggle('active');
        mobileMenu.classList.toggle('active');
        body.classList.toggle('menu-open');
        
        // Update ARIA
        hamburger.setAttribute('aria-expanded', !isActive);
    });

    // Close menu when clicking a link
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            mobileMenu.classList.remove('active');
            body.classList.remove('menu-open');
            hamburger.setAttribute('aria-expanded', 'false');
        }
    });
}

/* =================================
   Smooth Scroll for Anchor Links
   ================================= */

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Skip if it's just "#"
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = targetPosition - headerHeight - 20;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* =================================
   Scroll Reveal Animation
   ================================= */

function initScrollReveal() {
    // Elements to reveal on scroll
    const revealElements = document.querySelectorAll(
        '.section-header, .feature-card, .problem__card, .step, .use-case, .trust__content, .cta__content'
    );

    // Add scroll-reveal class to elements
    revealElements.forEach(el => {
        el.classList.add('scroll-reveal');
    });

    // Create Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // If it's a stagger parent, reveal children
                if (entry.target.classList.contains('stagger-children')) {
                    entry.target.classList.add('revealed');
                }
                
                // Unobserve after revealing (one-time animation)
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all elements
    revealElements.forEach(el => {
        observer.observe(el);
    });

    // Also observe stagger containers
    const staggerContainers = document.querySelectorAll('.features__grid, .problem__cards, .use-cases__grid');
    staggerContainers.forEach(container => {
        container.classList.add('stagger-children');
        observer.observe(container);
    });
}

/* =================================
   Parallax Effect (Subtle)
   ================================= */

function initParallax() {
    const parallaxElements = document.querySelectorAll('.hero__gradient, .phone-mockup__glow');
    
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Skip parallax for users who prefer reduced motion
    }

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                
                parallaxElements.forEach(el => {
                    const speed = 0.3;
                    const yPos = -(scrolled * speed);
                    el.style.transform = `translateY(${yPos}px)`;
                });
                
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

/* =================================
   Counter Animation (Stats)
   ================================= */

function initCounterAnimation() {
    const counters = document.querySelectorAll('.cta__stat-number');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const targetText = counter.textContent;
                
                // Parse the target value (handle ₹, +, etc.)
                const prefix = targetText.match(/^[₹+]*/)?.[0] || '';
                const suffix = targetText.match(/[+LK]*$/)?.[0] || '';
                const targetValue = parseInt(targetText.replace(/[^0-9]/g, ''));
                
                if (isNaN(targetValue)) {
                    observer.unobserve(counter);
                    return;
                }

                animateCounter(counter, targetValue, prefix, suffix);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        observer.observe(counter);
    });
}

function animateCounter(element, target, prefix, suffix) {
    const duration = 2000; // 2 seconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    const easeOutQuad = t => t * (2 - t);
    
    let frame = 0;
    
    const counter = setInterval(() => {
        frame++;
        const progress = easeOutQuad(frame / totalFrames);
        const currentValue = Math.round(target * progress);
        
        element.textContent = prefix + currentValue + suffix;
        
        if (frame === totalFrames) {
            clearInterval(counter);
            element.textContent = prefix + target + suffix;
        }
    }, frameDuration);
}

/* =================================
   Utility: Debounce
   ================================= */

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/* =================================
   Utility: Throttle
   ================================= */

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/* =================================
   Easter Egg: Konami Code
   ================================= */

(function() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                // Easter egg activated!
                document.body.style.animation = 'rainbow 2s linear';
                setTimeout(() => {
                    document.body.style.animation = '';
                }, 2000);
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
})();

/* =================================
   Console Easter Egg
   ================================= */

console.log(`
%c LEKKA %c Don't be Shy. Just Lekka it. 💸
`, 
'background: #CCFF00; color: #0a0a0a; font-size: 24px; font-weight: bold; padding: 10px 20px;',
'background: #0a0a0a; color: #CCFF00; font-size: 14px; padding: 10px 20px;'
);

console.log('%c Built with 💚 in India ', 'color: #00FF88; font-size: 12px;');
