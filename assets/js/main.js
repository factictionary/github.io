// Factictionary - Interactive JavaScript
// Modern Minimalism Premium interactions

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== NAVIGATION =====
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('mobile-open');
        });
    }
    
    // ===== SMOOTH SCROLLING =====
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // ===== CATEGORY FILTERING =====
    
    // Article and tool category filtering
    const filterTabs = document.querySelectorAll('.filter-tab');
    const filterItems = document.querySelectorAll('.filter-item');
    
    if (filterTabs.length > 0 && filterItems.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                
                // Update active tab
                filterTabs.forEach(t => t.classList.remove('active'));
                this.classList.add('active');
                
                // Filter items
                filterItems.forEach(item => {
                    if (category === 'all' || item.classList.contains(category)) {
                        item.style.display = 'block';
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.opacity = '1';
                        }, 100);
                    } else {
                        item.style.opacity = '0';
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 250);
                    }
                });
            });
        });
    }
    
    // ===== ARTICLE SEARCH =====
    
    const searchInput = document.querySelector('#article-search');
    const articleCards = document.querySelectorAll('.article-card');
    
    if (searchInput && articleCards.length > 0) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            articleCards.forEach(card => {
                const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const excerpt = card.querySelector('.card-excerpt')?.textContent.toLowerCase() || '';
                const category = card.getAttribute('data-category')?.toLowerCase() || '';
                
                const matches = title.includes(searchTerm) || 
                              excerpt.includes(searchTerm) || 
                              category.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    card.style.display = 'block';
                    card.style.opacity = '1';
                } else {
                    card.style.opacity = '0';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 250);
                }
            });
        });
    }
    
    // ===== TABLE OF CONTENTS =====
    
    const tocToggle = document.querySelector('.toc-toggle');
    const tableOfContents = document.querySelector('.table-of-contents');
    
    if (tocToggle && tableOfContents) {
        tocToggle.addEventListener('click', function() {
            tableOfContents.classList.toggle('expanded');
            this.setAttribute('aria-expanded', 
                tableOfContents.classList.contains('expanded')
            );
        });
    }
    
    // ===== SCROLL ANIMATIONS =====
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.card, .hero, .section').forEach(el => {
        observer.observe(el);
    });
    
    // ===== NEWSLETTER SIGNUP =====
    
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Basic email validation
            if (validateEmail(email)) {
                // Simulate subscription (replace with actual API call)
                showNotification('Thank you for subscribing!', 'success');
                this.reset();
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });
    });
    
    // ===== CONTACT FORM =====
    
    const contactForm = document.querySelector('#contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Basic validation
            if (validateContactForm(data)) {
                // Simulate form submission (replace with actual API call)
                showNotification('Message sent successfully!', 'success');
                this.reset();
            } else {
                showNotification('Please fill in all required fields correctly.', 'error');
            }
        });
    }
    
    // ===== LOAD MORE FUNCTIONALITY =====
    
    const loadMoreBtn = document.querySelector('#load-more');
    const hiddenItems = document.querySelectorAll('.hidden-item');
    
    if (loadMoreBtn && hiddenItems.length > 0) {
        let visibleCount = 6; // Initial visible items
        
        loadMoreBtn.addEventListener('click', function() {
            const itemsToShow = Array.from(hiddenItems).slice(0, 6);
            
            itemsToShow.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.remove('hidden-item');
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 100);
                }, index * 100);
            });
            
            visibleCount += 6;
            
            // Hide load more button if all items are shown
            if (visibleCount >= hiddenItems.length + 6) {
                this.style.display = 'none';
            }
        });
    }
    
    // ===== UTILITY FUNCTIONS =====
    
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    function validateContactForm(data) {
        const required = ['name', 'email', 'message'];
        return required.every(field => {
            const value = data[field]?.trim();
            return value && (field !== 'email' || validateEmail(value));
        });
    }
    
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Add styles
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '16px 24px',
            borderRadius: '12px',
            color: 'white',
            fontSize: '14px',
            fontWeight: '500',
            zIndex: '10000',
            transform: 'translateX(100%)',
            transition: 'all 300ms ease-out',
            backgroundColor: type === 'success' ? '#10B981' : 
                           type === 'error' ? '#EF4444' : '#0066FF'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    // ===== TOOL SEARCH FUNCTIONALITY =====
    
    const toolSearch = document.querySelector('#tool-search');
    const toolCards = document.querySelectorAll('.tool-card');
    
    if (toolSearch && toolCards.length > 0) {
        toolSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            toolCards.forEach(card => {
                const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
                const description = card.querySelector('.card-excerpt')?.textContent.toLowerCase() || '';
                
                const matches = title.includes(searchTerm) || description.includes(searchTerm);
                
                if (matches || searchTerm === '') {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    // Keyboard navigation for interactive elements
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape' && navLinks?.classList.contains('mobile-open')) {
            navLinks.classList.remove('mobile-open');
        }
    });
    
    // Focus management for modals and dropdowns
    function trapFocus(element) {
        const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstFocusable = focusableElements[0];
        const lastFocusable = focusableElements[focusableElements.length - 1];
        
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstFocusable) {
                        lastFocusable.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastFocusable) {
                        firstFocusable.focus();
                        e.preventDefault();
                    }
                }
            }
        });
    }
    
    // ===== PERFORMANCE OPTIMIZATION =====
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // ===== THEME TOGGLE (Optional) =====
    
    const themeToggle = document.querySelector('#theme-toggle');
    
    if (themeToggle) {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        }
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        });
    }
    
    console.log('Factictionary initialized successfully');
});

// ===== SERVICE WORKER REGISTRATION =====

if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}

// ===== ERROR HANDLING =====

window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
});

// ===== PERFORMANCE MONITORING =====

if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver(function(list) {
        for (const entry of list.getEntries()) {
            if (entry.entryType === 'largest-contentful-paint') {
                console.log('LCP:', entry.startTime);
            }
        }
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
}
