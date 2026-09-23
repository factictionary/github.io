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
    
    // ===== DONATION MODAL & PAYMENT HELPERS =====
    window.openDonationModal = function() {
        let modal = document.querySelector('#donation-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'donation-modal';
            modal.className = 'tools-drawer-backdrop';
            modal.innerHTML = `
                <div class="share-modal-dialog" onclick="event.stopPropagation()">
                    <button class="tools-drawer-close" onclick="closeDonationModal()" style="position:absolute; top:20px; right:20px;">&times;</button>
                    <div style="text-align:center; margin-bottom:16px;">
                        <span style="font-size:2.2rem;">☕</span>
                        <h3 style="font-size:1.4rem; font-weight:700; color:#0F172A; margin-top:4px;">Buy Us a Coffee</h3>
                        <p style="font-size:13.5px; color:#64748B; max-width:420px; margin:0 auto; line-height:1.4;">
                            Factictionary web utilities are 100% free &amp; privacy-first. Small voluntary contributions help support development and server costs!
                        </p>
                    </div>

                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:20px;">
                        <a href="https://razorpay.me/@factictionary5740" target="_blank" rel="noopener" class="btn-donate-razorpay" style="justify-content:center; padding:12px 20px; font-size:14px;">
                            ⚡ Pay via UPI / GPay / PhonePe / Cards (Razorpay)
                        </a>
                        <a href="https://paypal.me/mgarg1102" target="_blank" rel="noopener" class="btn-donate-paypal" style="justify-content:center; padding:12px 20px; font-size:14px;">
                            💳 Support via PayPal
                        </a>
                    </div>

                    <div style="border-top:1px solid #E2E8F0; padding-top:16px;">
                        <label style="font-weight:600; font-size:12.5px; color:#334155;">Razorpay UPI Payment Link:</label>
                        <div class="share-copy-box" style="margin-bottom:12px;">
                            <input type="text" readonly class="share-copy-input" value="https://razorpay.me/@factictionary5740">
                            <button onclick="copyCryptoAddress(this, 'https://razorpay.me/@factictionary5740')" class="btn btn-secondary" style="font-size:12px; padding:6px 12px;">Copy</button>
                        </div>

                        <label style="font-weight:600; font-size:12.5px; color:#334155;">PayPal Me Link:</label>
                        <div class="share-copy-box">
                            <input type="text" readonly class="share-copy-input" value="https://paypal.me/mgarg1102">
                            <button onclick="copyCryptoAddress(this, 'https://paypal.me/mgarg1102')" class="btn btn-secondary" style="font-size:12px; padding:6px 12px;">Copy</button>
                        </div>
                    </div>
                </div>
            `;
            modal.addEventListener('click', closeDonationModal);
            document.body.appendChild(modal);
        }
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeDonationModal = function() {
        const modal = document.querySelector('#donation-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.copyCryptoAddress = function(btnElement, addressText) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(addressText).then(() => {
                const origText = btnElement.textContent;
                btnElement.textContent = 'Copied! ✓';
                btnElement.style.background = '#10B981';
                setTimeout(() => {
                    btnElement.textContent = origText;
                    btnElement.style.background = '';
                }, 2000);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = addressText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            btnElement.textContent = 'Copied! ✓';
            setTimeout(() => { btnElement.textContent = 'Copy'; }, 2000);
        }
    };

    // Close modal on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', function(e) {
            if (e.target === this) {
                window.closeDonationModal();
            }
        });
    });

    // ===== HERO LIVE SEARCH DROPDOWN =====
    const heroSearchInput = document.querySelector('#hero-live-search');
    const heroSearchDropdown = document.querySelector('#hero-search-dropdown');

    if (heroSearchInput && heroSearchDropdown) {
        heroSearchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            if (!query) {
                heroSearchDropdown.classList.remove('active');
                return;
            }

            const items = heroSearchDropdown.querySelectorAll('.search-result-item');
            let matchCount = 0;
            items.forEach(item => {
                const title = item.getAttribute('data-title')?.toLowerCase() || item.textContent.toLowerCase();
                const keywords = item.getAttribute('data-keywords')?.toLowerCase() || '';
                if (title.includes(query) || keywords.includes(query)) {
                    item.style.display = 'flex';
                    matchCount++;
                } else {
                    item.style.display = 'none';
                }
            });

            if (matchCount > 0) {
                heroSearchDropdown.classList.add('active');
            } else {
                heroSearchDropdown.classList.remove('active');
            }
        });

        // Hide dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!heroSearchInput.contains(e.target) && !heroSearchDropdown.contains(e.target)) {
                heroSearchDropdown.classList.remove('active');
            }
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

// ===== UNIVERSAL TOOLS NAVIGATION DOCK & SOCIAL SHARE SYSTEM =====
(function() {
    "use strict";

    const TOOL_CATEGORIES = [
        {
            title: "📘 KDP Self-Publishing Suite",
            count: 4,
            tools: [
                { name: "KDP Cover & Spine Generator", file: "kdp_cover_generator.html", icon: "📘" },
                { name: "KDP Royalty & Printing Calculator", file: "kdp_royalty_calculator.html", icon: "💰" },
                { name: "KDP Spine Width Calculator", file: "kdp_spine_calculator.html", icon: "📏" },
                { name: "KDP 7-Backend Keywords & Formatter", file: "kdp_keyword_generator.html", icon: "🔍" }
            ]
        },
        {
            title: "📄 PDF Utilities",
            count: 12,
            tools: [
                { name: "PDF Merger", file: "pdf_merger.html", icon: "📄" },
                { name: "PDF Splitter", file: "pdf_splitter.html", icon: "✂️" },
                { name: "PDF Compressor", file: "pdf_compressor.html", icon: "🗜️" },
                { name: "PDF OCR Text Extractor", file: "pdf_ocr.html", icon: "🔍" },
                { name: "PDF Metadata Editor", file: "pdf_metadata.html", icon: "🏷️" },
                { name: "PDF Watermark Tool", file: "pdf_watermark.html", icon: "💧" },
                { name: "PDF Page Rotator", file: "pdf_rotator.html", icon: "🔄" },
                { name: "PDF Password & Encrypt", file: "pdf_password.html", icon: "🔒" },
                { name: "PDF Structure Analyzer", file: "pdf_analyzer.html", icon: "📊" },
                { name: "PDF Bookmark Manager", file: "pdf_bookmark.html", icon: "🔖" },
                { name: "PDF to Image Converter", file: "pdf_to_image.html", icon: "🖼️" },
                { name: "Image to PDF Converter", file: "image_to_pdf.html", icon: "📑" }
            ]
        },
        {
            title: "🖼️ Image Tools",
            count: 13,
            tools: [
                { name: "Background Remover", file: "image_background_remover.html", icon: "✂️" },
                { name: "Image Compressor", file: "image_compressor.html", icon: "🗜️" },
                { name: "Image Resizer", file: "image_resizer.html", icon: "📐" },
                { name: "Image Format Converter", file: "image_converter.html", icon: "🔄" },
                { name: "Image Cropper", file: "image_cropper.html", icon: "✂️" },
                { name: "Image Enhancer", file: "image_enhancer.html", icon: "✨" },
                { name: "HDR Image Effect", file: "image_hdr.html", icon: "🎨" },
                { name: "Image Stitcher", file: "image_stitcher.html", icon: "🧩" },
                { name: "Image Photo Filters", file: "image_filters.html", icon: "🎭" },
                { name: "Image Watermark", file: "image_watermark.html", icon: "💧" },
                { name: "Color Palette Converter", file: "image_color_converter.html", icon: "🎨" },
                { name: "Video Frame Extractor", file: "frame_extractor.html", icon: "🎞️" },
                { name: "SVG Converter", file: "svg_converter.html", icon: "✏️" }
            ]
        },
        {
            title: "🎥 Video Utilities",
            count: 15,
            tools: [
                { name: "Video Compressor", file: "video_compressor.html", icon: "🗜️" },
                { name: "Video Trimmer", file: "video_trimmer.html", icon: "✂️" },
                { name: "Video Format Converter", file: "video_converter.html", icon: "🔄" },
                { name: "Video Quality Enhancer", file: "video_enhancer.html", icon: "✨" },
                { name: "Subtitle Generator & Editor", file: "video_subtitle.html", icon: "💬" },
                { name: "Video to GIF Converter", file: "video_to_gif.html", icon: "🎞️" },
                { name: "Audio Extractor from Video", file: "video_audio_extractor.html", icon: "🎵" },
                { name: "Video Speed Changer", file: "video_speed.html", icon: "⚡" },
                { name: "Video Rotator", file: "video_rotation.html", icon: "🔄" },
                { name: "Video Watermark", file: "video_watermark.html", icon: "💧" },
                { name: "Video Looper", file: "video_looper.html", icon: "🔁" },
                { name: "Video Joiner & Merger", file: "video_merger.html", icon: "🧩" },
                { name: "Video Filters", file: "video_filter.html", icon: "🎭" },
                { name: "Video Thumbnail Generator", file: "video_preview.html", icon: "🖼️" },
                { name: "Video Aspect Ratio Resizer", file: "video_resizer.html", icon: "📐" }
            ]
        },
        {
            title: "🎵 Audio Utilities",
            count: 8,
            tools: [
                { name: "Audio Waveform Editor", file: "audio_editor.html", icon: "🎵" },
                { name: "Multi-track Audio Mixer", file: "audio_mixer.html", icon: "🎛️" },
                { name: "Audio Reverb & EQ Effects", file: "audio_effects.html", icon: "🎚️" },
                { name: "Volume Normalizer", file: "audio_normalizer.html", icon: "🔊" },
                { name: "Audio Trimmer", file: "audio_trimmer.html", icon: "✂️" },
                { name: "Tempo & Pitch Changer", file: "audio_speed_changer.html", icon: "⚡" },
                { name: "Audio Format Converter", file: "audio_converter.html", icon: "🔄" },
                { name: "Audio Spectrum Analyzer", file: "audio_analyzer.html", icon: "📊" }
            ]
        },
        {
            title: "📝 Text & Code Utilities",
            count: 14,
            tools: [
                { name: "Markdown Live Editor", file: "markdown_editor.html", icon: "📝" },
                { name: "Text Case Converter", file: "case_converter.html", icon: "🔤" },
                { name: "Word & Character Counter", file: "word_counter.html", icon: "🔢" },
                { name: "Text Diff Comparison", file: "text_diff.html", icon: "⚖️" },
                { name: "Text Readability Analyzer", file: "text_analyzer.html", icon: "📊" },
                { name: "Code & Text Beautifier", file: "text_formatter.html", icon: "🧹" },
                { name: "Text to Speech Voice", file: "text_to_speech.html", icon: "🗣️" },
                { name: "JSON Formatter & Validator", file: "json_formatter.html", icon: "{}" },
                { name: "Base64 Encoder / Decoder", file: "base64_encoder.html", icon: "🔐" },
                { name: "SHA & MD5 Hash Generator", file: "hash_generator.html", icon: "🔑" },
                { name: "URL Encoder / Decoder", file: "url_encoder.html", icon: "🔗" },
                { name: "Space & Line Remover", file: "remove_spaces.html", icon: "🧹" },
                { name: "Reverse Text Generator", file: "reverse_text.html", icon: "🔄" },
                { name: "Lorem Ipsum Generator", file: "lorem_ipsum.html", icon: "📜" }
            ]
        },
        {
            title: "💼 Productivity & Business",
            count: 7,
            tools: [
                { name: "ATS Resume Keyword Matcher", file: "ats_resume_matcher.html", icon: "📄" },
                { name: "Auto Product Page Generator", file: "auto-product-generator.html", icon: "📦" },
                { name: "HTML Product Formatter", file: "product-generator.html", icon: "🛍️" },
                { name: "PDF Invoice Generator", file: "invoice_generator.html", icon: "🧾" },
                { name: "Batch File Processing", file: "batch_processor.html", icon: "⚡" },
                { name: "Browser Screen Recorder", file: "screen_recorder.html", icon: "📹" },
                { name: "QR Code Generator", file: "qr_generator.html", icon: "📱" }
            ]
        },
        {
            title: "🎮 Browser & Brain Games",
            count: 3,
            tools: [
                { name: "Vocabulary & Word Games", file: "word_games.html", icon: "🔤" },
                { name: "Memory Training Games", file: "memory_games.html", icon: "🧠" },
                { name: "Logic & Brain Teasers", file: "brain_teasers.html", icon: "💡" }
            ]
        }
    ];

    function initToolsNavigationHub() {
        // Automatically inject Coffee Pill into site navbar on all pages
        const navLinksUl = document.querySelector('.navbar .nav-links');
        if (navLinksUl && !navLinksUl.querySelector('.coffee-nav-pill')) {
            const coffeeLi = document.createElement('li');
            coffeeLi.innerHTML = `<a href="javascript:void(0)" onclick="openDonationModal()" class="coffee-nav-pill">☕ Buy Me a Coffee</a>`;
            navLinksUl.appendChild(coffeeLi);
        }

        const currentPath = window.location.pathname.split('/').pop() || '';

        // Inject Floating Navigation Dock Bar on ALL pages
        if (!document.querySelector('.tools-dock-bar')) {
            const dockBar = document.createElement('div');
            dockBar.className = 'tools-dock-bar';
            dockBar.innerHTML = `
                <button class="tools-dock-btn" onclick="openToolsDrawer()">
                    <span>🧰 Tools Hub</span>
                    <span class="tools-dock-kbd">Ctrl+K</span>
                </button>
                <button class="share-dock-btn" onclick="openShareModal()" title="Share Web Page">
                    🔗
                </button>
                <button class="share-dock-btn" onclick="openDonationModal()" title="Buy Me a Coffee / Support Us" style="background:#FFF8E7; color:#B4712B; border-color:#FFE0B2;">
                    ☕
                </button>
            `;
            document.body.appendChild(dockBar);
        }

        // Inject Tools Navigation Drawer Backdrop & Modal
        if (!document.querySelector('#tools-nav-drawer')) {
            const backdrop = document.createElement('div');
            backdrop.id = 'tools-nav-drawer';
            backdrop.className = 'tools-drawer-backdrop';
            
            let categoriesHtml = '';
            TOOL_CATEGORIES.forEach(cat => {
                let toolsGridHtml = '';
                cat.tools.forEach(tool => {
                    const isActive = currentPath === tool.file;
                    toolsGridHtml += `
                        <a href="/tools/${tool.file}" class="tool-nav-item ${isActive ? 'current-active' : ''}">
                            <span class="tool-nav-icon">${tool.icon}</span>
                            <span>${tool.name}</span>
                        </a>
                    `;
                });

                categoriesHtml += `
                    <div class="category-group" data-title="${cat.title.toLowerCase()}">
                        <div class="category-title-bar">
                            <div class="category-title">${cat.title}</div>
                            <span class="category-count">${cat.tools.length} Tools</span>
                        </div>
                        <div class="tools-category-grid">
                            ${toolsGridHtml}
                        </div>
                    </div>
                `;
            });

            backdrop.innerHTML = `
                <div class="tools-drawer-modal" onclick="event.stopPropagation()">
                    <div class="tools-drawer-header">
                        <div class="tools-search-box">
                            <span class="tools-search-icon">🔍</span>
                            <input type="text" id="tools-search-input" class="tools-search-input" placeholder="Search 75+ tools by name, keyword, or category..." autocomplete="off">
                        </div>
                        <button class="tools-drawer-close" onclick="closeToolsDrawer()">&times;</button>
                    </div>
                    <div class="tools-drawer-body" id="tools-drawer-body">
                        ${categoriesHtml}
                    </div>
                    <div class="tools-drawer-footer">
                        <span>💡 Tip: Press <kbd style="background:#E2E8F0; padding:2px 6px; border-radius:4px;">Ctrl + K</kbd> anywhere on any tool page</span>
                        <span>Factictionary Open Utilities</span>
                    </div>
                </div>
            `;

            backdrop.addEventListener('click', closeToolsDrawer);
            document.body.appendChild(backdrop);

            // Live Search Filter Inside Drawer
            const searchInput = backdrop.querySelector('#tools-search-input');
            searchInput.addEventListener('input', function() {
                const query = this.value.toLowerCase().trim();
                const groups = backdrop.querySelectorAll('.category-group');
                groups.forEach(group => {
                    const items = group.querySelectorAll('.tool-nav-item');
                    let groupMatches = 0;
                    items.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        if (!query || text.includes(query)) {
                            item.style.display = 'flex';
                            groupMatches++;
                        } else {
                            item.style.display = 'none';
                        }
                    });

                    if (groupMatches > 0) {
                        group.style.display = 'block';
                    } else {
                        group.style.display = 'none';
                    }
                });
            });
        }

        // Inject Social Share Modal Dialog
        if (!document.querySelector('#share-tool-modal')) {
            const shareModal = document.createElement('div');
            shareModal.id = 'share-tool-modal';
            shareModal.className = 'tools-drawer-backdrop';
            
            const pageUrl = encodeURIComponent(window.location.href);
            const pageTitle = encodeURIComponent(document.title);

            shareModal.innerHTML = `
                <div class="share-modal-dialog" onclick="event.stopPropagation()">
                    <button class="tools-drawer-close" onclick="closeShareModal()" style="position:absolute; top:20px; right:20px;">&times;</button>
                    <h3 style="font-size:1.3rem; font-weight:700; color:#0F172A; margin-bottom:6px;">🔗 Share This Web Page</h3>
                    <p style="font-size:13.5px; color:#64748B;">Share this privacy tool directly to social media or download a visual summary screenshot!</p>
                    
                    <div class="social-share-grid">
                        <a href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" target="_blank" rel="noopener" class="social-share-btn twitter">
                            <svg class="social-icon-svg" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            <span>𝕏 / Twitter</span>
                        </a>
                        <a href="https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}" target="_blank" rel="noopener" class="social-share-btn whatsapp">
                            <svg class="social-icon-svg" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z"/></svg>
                            <span>WhatsApp</span>
                        </a>
                        <a href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" rel="noopener" class="social-share-btn facebook">
                            <svg class="social-icon-svg" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                            <span>Facebook</span>
                        </a>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}" target="_blank" rel="noopener" class="social-share-btn linkedin">
                            <svg class="social-icon-svg" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                            <span>LinkedIn</span>
                        </a>
                        <a href="https://www.reddit.com/submit?url=${pageUrl}&title=${pageTitle}" target="_blank" rel="noopener" class="social-share-btn reddit">
                            <svg class="social-icon-svg" viewBox="0 0 24 24"><path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701z"/></svg>
                            <span>Reddit</span>
                        </a>
                        <a href="https://t.me/share/url?url=${pageUrl}&text=${pageTitle}" target="_blank" rel="noopener" class="social-share-btn telegram">
                            <svg class="social-icon-svg" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.114.022.253.003.393z"/></svg>
                            <span>Telegram</span>
                        </a>
                    </div>

                    <label style="font-size:12.5px; font-weight:600; color:#334155;">Direct Web Page Link:</label>
                    <div class="share-copy-box">
                        <input type="text" readonly class="share-copy-input" id="share-link-input" value="${window.location.href}">
                        <button class="btn btn-primary" onclick="copyPageLink(this)" style="font-size:13px; padding:8px 16px;">📋 Copy Link</button>
                    </div>

                    <div class="share-screenshot-card">
                        <h4 style="font-size:14px; font-weight:700; color:#0F172A; margin-bottom:4px;">📸 Share as Visual Image Card</h4>
                        <p style="font-size:12px; color:#64748B; margin-bottom:10px;">Generate a branded preview image card of this tool page for social posts.</p>
                        <button class="btn btn-secondary" onclick="generatePageScreenshot()" style="font-size:13px; border-radius:20px; width:100%;">
                            ✨ Generate &amp; Download Image Card
                        </button>
                        <div class="screenshot-preview-holder" id="screenshot-holder"></div>
                    </div>
                </div>
            `;

            shareModal.addEventListener('click', closeShareModal);
            document.body.appendChild(shareModal);
        }

        // Global Keydown Handler (Ctrl + K)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                toggleToolsDrawer();
            }
            if (e.key === 'Escape') {
                closeToolsDrawer();
                closeShareModal();
            }
        });
    }

    window.openToolsDrawer = function() {
        const drawer = document.getElementById('tools-nav-drawer');
        if (drawer) {
            drawer.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                const input = drawer.querySelector('#tools-search-input');
                if (input) input.focus();
            }, 100);
        }
    };

    window.closeToolsDrawer = function() {
        const drawer = document.getElementById('tools-nav-drawer');
        if (drawer) {
            drawer.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.toggleToolsDrawer = function() {
        const drawer = document.getElementById('tools-nav-drawer');
        if (drawer && drawer.classList.contains('active')) {
            closeToolsDrawer();
        } else {
            openToolsDrawer();
        }
    };

    window.openShareModal = function() {
        const modal = document.getElementById('share-tool-modal');
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    };

    window.closeShareModal = function() {
        const modal = document.getElementById('share-tool-modal');
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    window.copyPageLink = function(btnElement) {
        const input = document.getElementById('share-link-input');
        if (input) {
            navigator.clipboard.writeText(input.value).then(() => {
                const origText = btnElement.textContent;
                btnElement.textContent = 'Copied! ✓';
                btnElement.style.background = '#10B981';
                setTimeout(() => {
                    btnElement.textContent = origText;
                    btnElement.style.background = '';
                }, 2000);
            });
        }
    };

    window.openDonationModal = function() {
        let modal = document.getElementById('donation-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'donation-modal';
            modal.className = 'modal-backdrop';
            document.body.appendChild(modal);
        }
        modal.innerHTML = `
            <div class="modal-content" onclick="event.stopPropagation()">
                <button onclick="closeDonationModal()" class="modal-close-btn" aria-label="Close modal">&times;</button>
                <h3 style="font-size: 1.4rem; font-weight: 700; margin-bottom: 6px; color: #0F172A;">☕ Support Factictionary Tools</h3>
                <p style="color: #64748B; font-size: 0.92rem; margin-bottom: 20px;">Factictionary is 100% free and hosted on GitHub Pages with zero corporate funding. Small voluntary contributions keep our privacy-first tools free for everyone!</p>
                
                <div style="margin-bottom: 16px;">
                    <label style="font-weight: 700; font-size: 0.85rem; color: #1E293B; display: block; margin-bottom: 6px;">⚡ Pay via UPI / GPay / PhonePe / Paytm / Cards (Razorpay):</label>
                    <div style="display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 10px 14px; border-radius: 8px; flex-wrap: wrap; gap: 8px;">
                        <span style="font-family: monospace; font-size: 0.88rem; font-weight: 600; color: #0066FF; word-break: break-all;">https://razorpay.me/@factictionary5740</span>
                        <div style="display: flex; gap: 8px;">
                            <a href="https://razorpay.me/@factictionary5740" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 6px 14px; font-size: 12.5px; border-radius: 6px; text-decoration: none;">Open Link</a>
                            <button onclick="copyCryptoAddress(this, 'https://razorpay.me/@factictionary5740')" class="btn" style="padding: 6px 14px; font-size: 12.5px; background: #0F172A; color: white; border: none; border-radius: 6px; cursor: pointer;">Copy</button>
                        </div>
                    </div>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="font-weight: 700; font-size: 0.85rem; color: #1E293B; display: block; margin-bottom: 6px;">💳 Support via PayPal:</label>
                    <div style="display: flex; align-items: center; justify-content: space-between; background: #F8FAFC; border: 1px solid #CBD5E1; padding: 10px 14px; border-radius: 8px; flex-wrap: wrap; gap: 8px;">
                        <span style="font-family: monospace; font-size: 0.88rem; font-weight: 600; color: #0066FF; word-break: break-all;">https://paypal.me/mgarg1102</span>
                        <div style="display: flex; gap: 8px;">
                            <a href="https://paypal.me/mgarg1102" target="_blank" rel="noopener" class="btn btn-primary" style="padding: 6px 14px; font-size: 12.5px; border-radius: 6px; text-decoration: none;">Open Link</a>
                            <button onclick="copyCryptoAddress(this, 'https://paypal.me/mgarg1102')" class="btn" style="padding: 6px 14px; font-size: 12.5px; background: #0F172A; color: white; border: none; border-radius: 6px; cursor: pointer;">Copy</button>
                        </div>
                    </div>
                </div>

                <div style="text-align: center; border-top: 1px solid var(--color-neutral-200); padding-top: 16px;">
                    <button onclick="closeDonationModal()" class="btn btn-secondary" style="border-radius: 20px; font-weight: 700; padding: 8px 24px;">Close Window</button>
                </div>
            </div>
        `;
        modal.addEventListener('click', closeDonationModal);
        modal.classList.add('active');
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    };

    window.closeDonationModal = function() {
        const modal = document.getElementById('donation-modal');
        if (modal) {
            modal.classList.remove('active');
            modal.style.display = 'none';
            document.body.style.overflow = '';
        }
    };

    window.copyCryptoAddress = function(btnElement, text) {
        navigator.clipboard.writeText(text).then(() => {
            const origText = btnElement.textContent;
            btnElement.textContent = 'Copied! ✓';
            btnElement.style.background = '#10B981';
            setTimeout(() => {
                btnElement.textContent = origText;
                btnElement.style.background = '';
            }, 2000);
        });
    };

    function loadHtml2Canvas() {
        return new Promise((resolve, reject) => {
            if (window.html2canvas) return resolve(window.html2canvas);
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
            script.onload = () => resolve(window.html2canvas);
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    window.generatePageScreenshot = async function() {
        const holder = document.getElementById('screenshot-holder');
        if (!holder) return;

        holder.style.display = 'block';
        holder.innerHTML = '<div style="padding:16px; font-size:13px; color:#0066FF; font-weight:600;">📷 Capturing full scrollable page screenshot… Please wait a moment...</div>';

        try {
            const html2canvas = await loadHtml2Canvas();

            // Hide overlay dialogs temporarily for full page render
            const dock = document.querySelector('.tools-dock-bar');
            const shareModal = document.getElementById('share-tool-modal');
            const navDrawer = document.getElementById('tools-nav-drawer');
            
            if (dock) dock.style.display = 'none';
            if (shareModal) shareModal.style.display = 'none';
            if (navDrawer) navDrawer.style.display = 'none';

            // Scroll to top to capture full document from origin
            const origScrollX = window.scrollX;
            const origScrollY = window.scrollY;
            window.scrollTo(0, 0);

            const fullCanvas = await html2canvas(document.body, {
                scale: 1.5,
                useCORS: true,
                allowTaint: true,
                scrollX: 0,
                scrollY: 0,
                windowWidth: document.documentElement.scrollWidth,
                windowHeight: document.documentElement.scrollHeight
            });

            // Restore scroll position and UI elements
            window.scrollTo(origScrollX, origScrollY);
            if (dock) dock.style.display = '';
            if (shareModal) shareModal.style.display = '';
            if (navDrawer) navDrawer.style.display = '';

            const imgUrl = fullCanvas.toDataURL('image/png');
            holder.innerHTML = `
                <div style="margin-top:10px; font-size:12px; font-weight:600; color:#10B981;">✅ Full Page Screenshot Captured (${fullCanvas.width} × ${fullCanvas.height}px)!</div>
                <img src="${imgUrl}" alt="Full Page Screenshot" style="max-height: 380px; border-radius: 8px; margin: 10px 0; border: 1px solid #CBD5E1; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                <a href="${imgUrl}" download="factictionary-full-page-screenshot.png" class="btn btn-primary" style="margin-top:8px; width:100%; border-radius:8px; font-size:13px;">
                    📥 Download Full Page Screenshot (.PNG)
                </a>
            `;
        } catch (err) {
            console.error(err);
            holder.innerHTML = '<div style="padding:12px; font-size:12px; color:#EF4444;">❌ Screenshot capture error. Please try again.</div>';
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initToolsNavigationHub);
    } else {
        initToolsNavigationHub();
    }
})();
