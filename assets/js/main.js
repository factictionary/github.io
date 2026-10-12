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

    function upgradeShareButtonsOnPage() {
        document.querySelectorAll('button[onclick*="openShareModal"], a[onclick*="openShareModal"]').forEach(btn => {
            if (btn.innerHTML.includes('🔗')) {
                btn.innerHTML = btn.innerHTML.replace(/🔗/g, '<span class="material-symbols-outlined" style="font-size:16px; vertical-align:middle;">share</span>');
                btn.style.display = 'inline-flex';
                btn.style.alignItems = 'center';
                btn.style.gap = '6px';
            }
        });
    }

    function initToolsNavigationHub() {
        // Automatically inject Google Material Symbols font stylesheet if not present
        if (!document.querySelector('link[href*="Material+Symbols"]') && !document.querySelector('link[href*="Material+Icons"]')) {
            const fontLink = document.createElement('link');
            fontLink.rel = 'stylesheet';
            fontLink.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0';
            document.head.appendChild(fontLink);
        }

        // Automatically attach share buttons with deep links to all tool cards
        initToolCardShareButtons();
        upgradeShareButtonsOnPage();

        // Automatically inject Coffee Pill into site navbar on all pages
        const navLinksUl = document.querySelector('.navbar .nav-links');
        if (navLinksUl && !navLinksUl.querySelector('.coffee-nav-pill')) {
            const coffeeLi = document.createElement('li');
            coffeeLi.innerHTML = `<a href="javascript:void(0)" onclick="openDonationModal()" class="coffee-nav-pill"><span class="material-symbols-outlined" style="font-size:16px; vertical-align:middle;">local_cafe</span> Buy Me a Coffee</a>`;
            navLinksUl.appendChild(coffeeLi);
        }

        const currentPath = window.location.pathname.split('/').pop() || '';

        // Inject Floating Navigation Dock Bar on ALL pages
        if (!document.querySelector('.tools-dock-bar')) {
            const dockBar = document.createElement('div');
            dockBar.className = 'tools-dock-bar';
            dockBar.innerHTML = `
                <button class="tools-dock-btn" onclick="openToolsDrawer()">
                    <span class="material-symbols-outlined" style="font-size:18px;">handyman</span>
                    <span>Tools Hub</span>
                    <span class="tools-dock-kbd">Ctrl+K</span>
                </button>
                <button class="share-dock-btn" onclick="openShareModal()" title="Share Web Page">
                    <span class="material-symbols-outlined">share</span>
                </button>
                <button class="share-dock-btn" onclick="openDonationModal()" title="Buy Me a Coffee / Support Us" style="background:#FFF8E7; color:#B4712B; border-color:#FFE0B2;">
                    <span class="material-symbols-outlined">local_cafe</span>
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
                            <span class="tools-search-icon"><span class="material-symbols-outlined" style="font-size:18px;">search</span></span>
                            <input type="text" id="tools-search-input" class="tools-search-input" placeholder="Search 75+ tools by name, keyword, or category..." autocomplete="off">
                        </div>
                        <button class="tools-drawer-close" onclick="closeToolsDrawer()">&times;</button>
                    </div>
                    <div class="tools-drawer-body" id="tools-drawer-body">
                        ${categoriesHtml}
                    </div>
                    <div class="tools-drawer-footer">
                        <span><span class="material-symbols-outlined" style="font-size:15px; vertical-align:middle; color:#0066FF;">lightbulb</span> Tip: Press <kbd style="background:#E2E8F0; padding:2px 6px; border-radius:4px;">Ctrl + K</kbd> anywhere on any tool page</span>
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

        // Helper: Open share modal specifically for a tool card with direct deep link
        window.openShareModalForTool = function(toolData) {
            const title = (toolData.title || 'Factictionary Tool').replace(/\s*\|\s*Factictionary/gi, '').replace(/\s*-\s*Factictionary/gi, '').trim();
            const excerpt = toolData.excerpt || 'Discover free, browser-based privacy utilities on Factictionary.';
            const icon = toolData.icon || '🛠️';

            let deepUrl = toolData.url || window.location.href;
            if (deepUrl.startsWith('/')) {
                deepUrl = window.location.origin + deepUrl;
            } else if (!deepUrl.startsWith('http')) {
                deepUrl = window.location.origin + '/tools/' + deepUrl;
            }

            let tag = 'WebTools';
            const lowerUrl = deepUrl.toLowerCase();
            if (lowerUrl.includes('kdp')) tag = 'KDP';
            else if (lowerUrl.includes('pdf')) tag = 'PDFTools';
            else if (lowerUrl.includes('image')) tag = 'ImageTools';
            else if (lowerUrl.includes('video')) tag = 'VideoTools';
            else if (lowerUrl.includes('audio')) tag = 'AudioTools';
            else if (lowerUrl.includes('text') || lowerUrl.includes('word') || lowerUrl.includes('markdown')) tag = 'TextTools';

            const postText = `${icon} ${title}\n─────────────────────────\n${excerpt}\n\n🔗 Direct Link:\n${deepUrl}\n\n🏷️ #${tag} #Factictionary #FreeTools #PrivacyFirst`;

            const modal = document.getElementById('share-tool-modal');
            if (modal) {
                const textarea = document.getElementById('share-post-textarea');
                if (textarea) textarea.value = postText;

                const input = document.getElementById('share-link-input');
                if (input) input.value = deepUrl;

                window.updateShareLinks(postText, deepUrl);
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        };

        // Helper: Generate pre-formatted social post write-up with embedded link
        window.generateSharePostText = function() {
            const rawTitle = document.title || 'Factictionary';
            const cleanTitle = rawTitle.replace(/\s*\|\s*Factictionary/gi, '').replace(/\s*-\s*Factictionary/gi, '').trim();
            
            let desc = '';
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc && metaDesc.content) {
                desc = metaDesc.content.trim();
            } else {
                const lead = document.querySelector('.lead-text, .hero-subtitle, p');
                if (lead && lead.textContent) {
                    desc = lead.textContent.trim();
                }
            }
            if (desc.length > 180) {
                desc = desc.substring(0, 177) + '...';
            }
            if (!desc) {
                desc = 'Discover free, privacy-first web utilities and insightful guides on Factictionary.';
            }

            const currentUrl = window.location.href;
            const lowerUrl = currentUrl.toLowerCase();

            let categoryEmoji = '✨';
            if (lowerUrl.includes('pdf')) categoryEmoji = '📄';
            else if (lowerUrl.includes('image') || lowerUrl.includes('hdr') || lowerUrl.includes('svg')) categoryEmoji = '🖼️';
            else if (lowerUrl.includes('video')) categoryEmoji = '🎥';
            else if (lowerUrl.includes('audio')) categoryEmoji = '🎵';
            else if (lowerUrl.includes('kdp')) categoryEmoji = '📘';
            else if (lowerUrl.includes('text') || lowerUrl.includes('word') || lowerUrl.includes('markdown')) categoryEmoji = '📝';
            else if (lowerUrl.includes('blog') || lowerUrl.includes('article')) categoryEmoji = '📰';
            else if (lowerUrl.includes('game')) categoryEmoji = '🎮';

            return `${categoryEmoji} ${cleanTitle}\n─────────────────────────\n${desc}\n\n🔗 Direct Link:\n${currentUrl}\n\n🏷️ #Factictionary #FreeTools #PrivacyFirst`;
        };

        window.updateShareLinks = function(postText, targetUrl) {
            const deepUrl = targetUrl || window.location.href;
            const pageUrl = encodeURIComponent(deepUrl);
            const encodedText = encodeURIComponent(postText || window.generateSharePostText());
            const pageTitle = encodeURIComponent(document.title);

            const grid = document.getElementById('social-share-grid');
            if (grid) {
                grid.innerHTML = `
                    <a href="https://twitter.com/intent/tweet?text=${encodedText}" target="_blank" rel="noopener" class="social-share-btn twitter">
                        <svg class="social-icon-svg" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        <span>𝕏 / Twitter</span>
                    </a>
                    <a href="https://api.whatsapp.com/send?text=${encodedText}" target="_blank" rel="noopener" class="social-share-btn whatsapp">
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
                    <a href="https://t.me/share/url?url=${pageUrl}&text=${encodedText}" target="_blank" rel="noopener" class="social-share-btn telegram">
                        <svg class="social-icon-svg" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.324-.437.892-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.141.119.098.152.228.166.331.016.114.022.253.003.393z"/></svg>
                        <span>Telegram</span>
                    </a>
                `;
            }
        };

        // Auto-enhance tool cards with direct share buttons
        function initToolCardShareButtons() {
            document.querySelectorAll('.tool-card').forEach(card => {
                if (card.querySelector('.btn-tool-share')) return;

                const link = card.querySelector('a.btn-tool-card, a[href]');
                if (!link) return;

                const title = card.querySelector('.card-title')?.textContent.trim() || 'Tool';
                const excerpt = card.querySelector('.card-excerpt')?.textContent.trim() || '';
                
                // Find icon span or emoji in card
                const firstChild = card.firstElementChild;
                let icon = '🛠️';
                if (firstChild) {
                    const iconSpan = firstChild.querySelector('span[style*="font-size"]');
                    if (iconSpan) icon = iconSpan.textContent.trim();
                }
                const url = link.getAttribute('href');

                // Ensure actions container
                let actionsContainer = card.querySelector('.tool-card-actions');
                if (!actionsContainer) {
                    actionsContainer = document.createElement('div');
                    actionsContainer.className = 'tool-card-actions';
                    link.parentNode.insertBefore(actionsContainer, link);
                    actionsContainer.appendChild(link);
                }

                const shareBtn = document.createElement('button');
                shareBtn.type = 'button';
                shareBtn.className = 'btn-tool-share';
                shareBtn.innerHTML = '<span class="material-symbols-outlined" style="font-size:18px;">share</span>';
                shareBtn.title = `Share glimpse & deep link for ${title}`;
                shareBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    window.openShareModalForTool({ title, excerpt, url, icon });
                });

                actionsContainer.appendChild(shareBtn);
            });
        }

        // Inject Social Share Modal Dialog
        if (!document.querySelector('#share-tool-modal')) {
            const shareModal = document.createElement('div');
            shareModal.id = 'share-tool-modal';
            shareModal.className = 'tools-drawer-backdrop';
            
            const initialPostText = window.generateSharePostText();

            shareModal.innerHTML = `
                <div class="share-modal-dialog" onclick="event.stopPropagation()">
                    <button class="tools-drawer-close" onclick="closeShareModal()" style="position:absolute; top:20px; right:20px;">&times;</button>
                    <h3 style="font-size:1.3rem; font-weight:700; color:#0F172A; margin-bottom:4px; display:flex; align-items:center; gap:8px;"><span class="material-symbols-outlined" style="color:#0066FF; font-size:26px;">share</span> Share Page &amp; Pre-formatted Post</h3>
                    <p style="font-size:13.5px; color:#64748B; margin-bottom:16px;">Copy a ready-to-post write-up with embedded link or download a visual image card.</p>
                    
                    <div class="share-post-card">
                        <div class="share-post-header">
                            <span class="share-post-title" style="display:flex; align-items:center; gap:6px;"><span class="material-symbols-outlined" style="font-size:18px; color:#0066FF;">post_add</span> Pre-formatted Social Post Write-Up</span>
                            <button onclick="refreshSharePostText()" style="background:none; border:none; color:#0066FF; font-size:12px; font-weight:600; cursor:pointer; display:inline-flex; align-items:center; gap:4px;" title="Reset write-up"><span class="material-symbols-outlined" style="font-size:14px;">refresh</span> Reset</button>
                        </div>
                        <textarea id="share-post-textarea" class="share-post-textarea" rows="4">${initialPostText}</textarea>
                        <div class="share-post-actions">
                            <button class="share-post-copy-btn" onclick="copyPostText(this)">
                                <span class="material-symbols-outlined" style="font-size:18px;">content_copy</span> Copy Post &amp; Embedded Link
                            </button>
                        </div>
                    </div>

                    <div class="social-share-grid" id="social-share-grid">
                        <!-- Populated by updateShareLinks -->
                    </div>

                    <label style="font-size:12.5px; font-weight:600; color:#334155; display:flex; align-items:center; gap:6px;"><span class="material-symbols-outlined" style="font-size:16px;">link</span> Direct Web Page Link:</label>
                    <div class="share-copy-box">
                        <input type="text" readonly class="share-copy-input" id="share-link-input" value="${window.location.href}">
                        <button class="btn btn-primary" onclick="copyPageLink(this)" style="font-size:13px; padding:8px 16px; display:inline-flex; align-items:center; gap:6px;"><span class="material-symbols-outlined" style="font-size:16px;">content_copy</span> Copy Link</button>
                    </div>

                    <div class="share-screenshot-card">
                        <h4 style="font-size:14px; font-weight:700; color:#0F172A; margin-bottom:4px; display:flex; align-items:center; justify-content:center; gap:6px;"><span class="material-symbols-outlined" style="font-size:18px; color:#0066FF;">photo_camera</span> Share as Visual Image Card</h4>
                        <p style="font-size:12px; color:#64748B; margin-bottom:10px;">Generate a branded preview image card of this tool page for social posts.</p>
                        <button class="btn btn-secondary" onclick="generatePageScreenshot()" style="font-size:13px; border-radius:20px; width:100%; display:inline-flex; align-items:center; justify-content:center; gap:6px;">
                            <span class="material-symbols-outlined" style="font-size:16px; color:#0066FF;">auto_awesome</span> Generate &amp; Download Image Card
                        </button>
                        <div class="screenshot-preview-holder" id="screenshot-holder"></div>
                    </div>
                </div>
            `;

            shareModal.addEventListener('click', closeShareModal);
            document.body.appendChild(shareModal);

            const postTextarea = shareModal.querySelector('#share-post-textarea');
            if (postTextarea) {
                postTextarea.addEventListener('input', function() {
                    window.updateShareLinks(this.value);
                });
            }

            window.updateShareLinks(initialPostText);
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

    window.refreshSharePostText = function() {
        const textarea = document.getElementById('share-post-textarea');
        if (textarea) {
            const freshText = window.generateSharePostText();
            textarea.value = freshText;
            window.updateShareLinks(freshText);
        }
    };

    window.copyPostText = function(btnElement) {
        const textarea = document.getElementById('share-post-textarea');
        if (textarea) {
            const textToCopy = textarea.value;
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const origText = btnElement.textContent;
                    btnElement.textContent = 'Copied Post! ✓';
                    btnElement.style.background = '#10B981';
                    setTimeout(() => {
                        btnElement.textContent = origText;
                        btnElement.style.background = '';
                    }, 2000);
                });
            } else {
                textarea.select();
                document.execCommand('copy');
                const origText = btnElement.textContent;
                btnElement.textContent = 'Copied Post! ✓';
                setTimeout(() => { btnElement.textContent = origText; }, 2000);
            }
        }
    };

    window.openShareModal = function() {
        const modal = document.getElementById('share-tool-modal');
        if (modal) {
            const postText = window.generateSharePostText();
            const textarea = document.getElementById('share-post-textarea');
            if (textarea) {
                textarea.value = postText;
            }
            const input = document.getElementById('share-link-input');
            if (input) {
                input.value = window.location.href;
            }
            window.updateShareLinks(postText);
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




// ===== START DUAL NATIVE APP SHELL =====
(function() {
    const NATIVE_APP_SUITES = [
        {
            id: 'readers',
            label: '📚 Readers',
            title: 'eBook, Office & Archive Readers',
            color: '#0284C7',
            bg: '#E0F2FE',
            tools: [
                { icon: '📖', short: 'EPUB Reader', name: 'EPUB eBook Reader & TTS', url: '/tools/epub_reader.html' },
                { icon: '📝', short: 'Word DOCX', name: 'DOCX Word Viewer & HTML', url: '/tools/docx_viewer.html' },
                { icon: '📊', short: 'Excel & CSV', name: 'Excel (.XLSX) & CSV Viewer', url: '/tools/excel_csv_viewer.html' },
                { icon: '🦸', short: 'CBZ Comics', name: 'CBZ Comic & ZIP Reader', url: '/tools/cbz_comic_reader.html' }
            ]
        },
        {
            id: 'pdf',
            label: '📄 PDF Suite',
            title: 'Private PDF Suite',
            color: '#E11D48',
            bg: '#FFE4E6',
            tools: [
                { icon: '📄', short: 'Merge PDF', name: 'PDF Merger & Combiner', url: '/tools/pdf_merger.html' },
                { icon: '📉', short: 'Compress PDF', name: 'PDF Compressor', url: '/tools/pdf_compressor.html' },
                { icon: '🔍', short: 'PDF OCR', name: 'Scanned PDF OCR Extractor', url: '/tools/pdf_ocr.html' },
                { icon: '✂️', short: 'Split PDF', name: 'PDF Splitter & Extractor', url: '/tools/pdf_splitter.html' },
                { icon: '🖼️', short: 'PDF to Image', name: 'PDF to Image (PNG/JPG)', url: '/tools/pdf_to_image.html' },
                { icon: '🔒', short: 'Lock PDF', name: 'PDF Password Protect', url: '/tools/pdf_password.html' },
                { icon: '🔄', short: 'Rotate PDF', name: 'PDF Page Rotator', url: '/tools/pdf_rotator.html' },
                { icon: '🏷️', short: 'Watermark', name: 'PDF Watermark Stamp', url: '/tools/pdf_watermark.html' },
                { icon: '📋', short: 'PDF Metadata', name: 'PDF Metadata Editor', url: '/tools/pdf_metadata.html' },
                { icon: '🔖', short: 'Bookmarks', name: 'PDF Bookmark Manager', url: '/tools/pdf_bookmark.html' },
                { icon: '📊', short: 'PDF Analyzer', name: 'PDF Structure Analyzer', url: '/tools/pdf_analyzer.html' }
            ]
        },
        {
            id: 'video',
            label: '🎬 Video',
            title: 'Video & Creator Studio',
            color: '#9333EA',
            bg: '#F3E8FF',
            tools: [
                { icon: '🎙️', short: 'Teleprompter', name: 'Studio Teleprompter & WPM', url: '/tools/online_teleprompter.html' },
                { icon: '📹', short: 'Screen Rec', name: 'Screen & Webcam Recorder', url: '/tools/screen_recorder.html' },
                { icon: '📉', short: 'Video Compress', name: 'Video Compressor', url: '/tools/video_compressor.html' },
                { icon: '✂️', short: 'Trim Video', name: 'Video Trimmer & Cutter', url: '/tools/video_trimmer.html' },
                { icon: '🎞️', short: 'Video to GIF', name: 'Video to GIF Maker', url: '/tools/video_to_gif.html' },
                { icon: '🔄', short: 'Convert Video', name: 'Video Format Converter', url: '/tools/video_converter.html' },
                { icon: '🔊', short: 'Extract MP3', name: 'Video Audio Extractor', url: '/tools/video_audio_extractor.html' },
                { icon: '📐', short: 'Resize 9:16', name: 'Video Resizer (Reels)', url: '/tools/video_resizer.html' },
                { icon: '🎞️', short: 'Merge Video', name: 'Video Joiner & Merger', url: '/tools/video_merger.html' },
                { icon: '⏩', short: 'Video Speed', name: 'Video Speed & Slow-Mo', url: '/tools/video_speed.html' },
                { icon: '💬', short: 'Subtitles', name: 'Video Subtitle SRT Tool', url: '/tools/video_subtitle.html' },
                { icon: '🔁', short: 'Loop Video', name: 'Video Loop Creator', url: '/tools/video_looper.html' },
                { icon: '🖼️', short: 'Thumbnails', name: 'Video Thumbnail Grabber', url: '/tools/video_preview.html' },
                { icon: '🎞️', short: 'Extract Frames', name: 'Video Frame Extractor', url: '/tools/frame_extractor.html' },
                { icon: '✨', short: 'Enhance Video', name: 'Video Quality Enhancer', url: '/tools/video_enhancer.html' },
                { icon: '🏷️', short: 'Watermark', name: 'Video Watermark Tool', url: '/tools/video_watermark.html' },
                { icon: '🔄', short: 'Rotate Video', name: 'Video Rotator & Flip', url: '/tools/video_rotation.html' },
                { icon: '🎨', short: 'Video Filters', name: 'Video Filter Studio', url: '/tools/video_filter.html' }
            ]
        },
        {
            id: 'image',
            label: '🖼️ Image',
            title: 'Image & Vector Studio',
            color: '#059669',
            bg: '#D1FAE5',
            tools: [
                { icon: '🖼️', short: 'Remove BG', name: 'AI Background Remover', url: '/tools/image_background_remover.html' },
                { icon: '⚡', short: 'Compress Img', name: 'Image Compressor & WebP', url: '/tools/image_compressor.html' },
                { icon: '🎨', short: 'QR Generator', name: 'Custom QR Code Studio', url: '/tools/qr_generator.html' },
                { icon: '🎨', short: 'SVG to PNG', name: 'SVG to PNG/WebP Converter', url: '/tools/svg_converter.html' },
                { icon: '📐', short: 'Resize Image', name: 'Image Resizer & Scale', url: '/tools/image_resizer.html' },
                { icon: '🔄', short: 'Convert Img', name: 'Image Format Converter', url: '/tools/image_converter.html' },
                { icon: '📄', short: 'Image to PDF', name: 'Multi-Image to PDF', url: '/tools/image_to_pdf.html' },
                { icon: '✂️', short: 'Crop Image', name: 'Image Aspect Cropper', url: '/tools/image_cropper.html' },
                { icon: '✨', short: 'Enhance Photo', name: 'Image Enhancer & Sharpener', url: '/tools/image_enhancer.html' },
                { icon: '🌅', short: 'HDR Effect', name: 'HDR Photo Effect', url: '/tools/image_hdr.html' },
                { icon: '🧩', short: 'Photo Collage', name: 'Image Combiner & Stitcher', url: '/tools/image_stitcher.html' },
                { icon: '🎨', short: 'Color Space', name: 'CMYK / RGB / HEX Converter', url: '/tools/image_color_converter.html' },
                { icon: '🎨', short: 'Photo Filters', name: 'Image Filter Studio', url: '/tools/image_filters.html' },
                { icon: '🏷️', short: 'Watermark', name: 'Image Watermark Tool', url: '/tools/image_watermark.html' }
            ]
        },
        {
            id: 'audio',
            label: '🎵 Audio',
            title: 'Audio & Voice Studio',
            color: '#D97706',
            bg: '#FEF3C7',
            tools: [
                { icon: '🗣️', short: 'Text to Speech', name: 'Text-to-Speech Reader', url: '/tools/text_to_speech.html' },
                { icon: '🎛️', short: 'Audio Mixer', name: 'Multi-Track Audio Mixer', url: '/tools/audio_mixer.html' },
                { icon: '✂️', short: 'Trim Audio', name: 'Audio Trimmer & Ringtone', url: '/tools/audio_trimmer.html' },
                { icon: '🎶', short: 'Audio Editor', name: 'Audio Waveform Editor', url: '/tools/audio_editor.html' },
                { icon: '🎵', short: 'Convert Audio', name: 'MP3 / WAV Converter', url: '/tools/audio_converter.html' },
                { icon: '🎚️', short: 'Equalizer FX', name: '10-Band EQ & Audio FX', url: '/tools/audio_effects.html' },
                { icon: '🔊', short: 'Normalize', name: 'Audio Volume Normalizer', url: '/tools/audio_normalizer.html' },
                { icon: '⚡', short: 'Speed & Pitch', name: 'Audio Speed & Pitch', url: '/tools/audio_speed_changer.html' },
                { icon: '📊', short: 'Spectrum FFT', name: 'Audio Spectrum Analyzer', url: '/tools/audio_analyzer.html' }
            ]
        },
        {
            id: 'kdp',
            label: '📐 KDP & Biz',
            title: 'KDP, Business & Android Dev',
            color: '#2563EB',
            bg: '#DBEAFE',
            tools: [
                { icon: '🧾', short: 'Fee Receipt', name: 'Tuition Fee Receipt (WhatsApp)', url: '/tools/tuition_fee_receipt_generator.html' },
                { icon: '🛠️', short: '12T/14D Track', name: 'Google Play 12T/14D Tracker', url: '/tools/play_store_tester_tracker.html' },
                { icon: '📄', short: 'ATS Resume', name: 'ATS Resume & CV Matcher', url: '/tools/ats_resume_matcher.html' },
                { icon: '🧾', short: 'Invoice Maker', name: 'Instant Invoice & Receipt Pro', url: '/tools/invoice_generator.html' },
                { icon: '📐', short: 'KDP Cover PDF', name: 'KDP Cover & Spine Generator', url: '/tools/kdp_cover_generator.html' },
                { icon: '💰', short: 'KDP Royalty', name: 'KDP Royalty Calculator', url: '/tools/kdp_royalty_calculator.html' },
                { icon: '📏', short: 'KDP Spine', name: 'KDP Spine Width Calculator', url: '/tools/kdp_spine_calculator.html' },
                { icon: '🔍', short: 'KDP Keywords', name: 'KDP 7-Backend Keywords', url: '/tools/kdp_keyword_generator.html' },
                { icon: '📦', short: 'Batch Files', name: 'Batch File Processor', url: '/tools/batch_processor.html' },
                { icon: '🛒', short: 'Product Copy', name: 'E-Commerce Copy Generator', url: '/tools/auto-product-generator.html' },
                { icon: '📦', short: 'Product Card', name: 'Product Description Maker', url: '/tools/product-generator.html' }
            ]
        },
        {
            id: 'games',
            label: '🎮 Games & Dev',
            title: 'Brain Games & Dev Text Tools',
            color: '#7C3AED',
            bg: '#EDE9FE',
            tools: [
                { icon: '🎲', short: 'Tambola 1-90', name: 'Tambola Caller & Tickets', url: '/tools/tambola_caller.html' },
                { icon: '🧩', short: 'Sudoku 9×9', name: '9×9 Sudoku & Instant Solver', url: '/tools/sudoku_water_sort.html' },
                { icon: '💻', short: 'JSON Format', name: 'JSON Formatter & Validator', url: '/tools/json_formatter.html' },
                { icon: '📝', short: 'Markdown', name: 'Markdown Live Studio', url: '/tools/markdown_editor.html' },
                { icon: '🔤', short: 'Wordle Game', name: 'Wordle & Vocab Challenge', url: '/tools/word_games.html' },
                { icon: '🎮', short: 'Memory Game', name: 'Memory Matrix Game', url: '/tools/memory_games.html' },
                { icon: '🧩', short: 'Brain Riddles', name: 'Brain Teasers & Riddles', url: '/tools/brain_teasers.html' },
                { icon: '🔄', short: 'Text Diff', name: 'Side-by-Side Text Diff', url: '/tools/text_diff.html' },
                { icon: '🔒', short: 'Base64', name: 'Base64 Encoder / Decoder', url: '/tools/base64_encoder.html' },
                { icon: '🔗', short: 'URL Encode', name: 'URL Encoder / Decoder', url: '/tools/url_encoder.html' },
                { icon: '🔑', short: 'SHA256 Hash', name: 'Hash Generator (SHA256/MD5)', url: '/tools/hash_generator.html' },
                { icon: '📊', short: 'Word Count', name: 'Word & Character Counter', url: '/tools/word_counter.html' },
                { icon: '🔤', short: 'Case Convert', name: 'Text Case Converter', url: '/tools/case_converter.html' },
                { icon: '🧹', short: 'Clean Spaces', name: 'Space & Line Cleaner', url: '/tools/remove_spaces.html' },
                { icon: '🧠', short: 'Text Analyze', name: 'Text & Sentiment Analyzer', url: '/tools/text_analyzer.html' },
                { icon: '📝', short: 'Format Text', name: 'Text Cleaner & Formatter', url: '/tools/text_formatter.html' },
                { icon: '🔄', short: 'Reverse Text', name: 'Text Flipper & Reverser', url: '/tools/reverse_text.html' },
                { icon: '📜', short: 'Lorem Ipsum', name: 'Lorem Ipsum Generator', url: '/tools/lorem_ipsum.html' }
            ]
        }
    ];

    function isStandalonePWA() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.matchMedia('(display-mode: window-controls-overlay)').matches ||
               window.matchMedia('(display-mode: tabbed)').matches ||
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://') ||
               new URLSearchParams(window.location.search).get('app') === '1';
    }

    // Native In-App Quick Search Bottom Sheet (works on every page even without style.css modal classes)
    window.openNativeSearchSheet = function() {
        // If on launcher page and quick filter is visible, focus it directly
        const inlineInput = document.getElementById('f-mobile-quick-filter');
        if (inlineInput && inlineInput.offsetParent !== null) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            inlineInput.focus();
            return;
        }
        let sheet = document.getElementById('f-native-search-sheet');
        if (!sheet) {
            sheet = document.createElement('div');
            sheet.id = 'f-native-search-sheet';
            sheet.style.cssText = 'position:fixed;inset:0;background:rgba(15,23,42,0.72);z-index:10005;display:flex;flex-direction:column;justify-content:flex-end;font-family:Inter,-apple-system,sans-serif;';
            const allTiles = NATIVE_APP_SUITES.map(s =>
                s.tools.map(t => `
                    <a href="${t.url}" class="f-sheet-tool-item" data-q="${(t.name + ' ' + t.short + ' ' + s.title).toLowerCase()}" style="display:flex;align-items:center;gap:10px;padding:10px 12px;border-radius:12px;background:#F8FAFC;border:1px solid #E2E8F0;text-decoration:none;color:#0F172A;">
                        <span style="width:36px;height:36px;border-radius:10px;background:${s.bg};color:${s.color};display:flex;align-items:center;justify-content:center;font-size:1.2rem;flex-shrink:0;">${t.icon}</span>
                        <div style="min-width:0;flex:1;">
                            <div style="font-size:0.84rem;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.name}</div>
                            <div style="font-size:0.7rem;color:#64748B;font-weight:600;">${s.title}</div>
                        </div>
                        <span style="color:#94A3B8;font-size:0.9rem;">→</span>
                    </a>
                `).join('')
            ).join('');

            sheet.innerHTML = `
                <div style="background:#FFFFFF;border-radius:22px 22px 0 0;max-height:86vh;display:flex;flex-direction:column;padding:16px;box-shadow:0 -10px 30px rgba(0,0,0,0.3);" onclick="event.stopPropagation()">
                    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">
                        <span style="font-size:0.95rem;font-weight:900;color:#0F172A;">🔍 Search All 85+ Free Tools</span>
                        <button type="button" onclick="document.getElementById('f-native-search-sheet').style.display='none'" style="background:#F1F5F9;border:none;width:32px;height:32px;border-radius:50%;font-size:1.1rem;font-weight:800;cursor:pointer;color:#334155;">&times;</button>
                    </div>
                    <input type="search" id="f-sheet-search-input" placeholder="Type tool name (e.g. epub, word, merge pdf, receipt, tambola)..." style="width:100%;padding:11px 14px;border-radius:12px;border:2px solid #3B82F6;font-size:0.9rem;font-weight:600;outline:none;margin-bottom:12px;">
                    <div id="f-sheet-results" style="overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:8px;padding-bottom:20px;">
                        ${allTiles}
                    </div>
                </div>
            `;
            sheet.addEventListener('click', function() { sheet.style.display = 'none'; });
            document.body.appendChild(sheet);

            const sInput = sheet.querySelector('#f-sheet-search-input');
            sInput.addEventListener('input', function() {
                const q = this.value.trim().toLowerCase();
                sheet.querySelectorAll('.f-sheet-tool-item').forEach(el => {
                    el.style.display = (!q || el.getAttribute('data-q').includes(q)) ? 'flex' : 'none';
                });
            });
        }
        sheet.style.display = 'flex';
        setTimeout(() => {
            const inp = document.getElementById('f-sheet-search-input');
            if (inp) inp.focus();
        }, 60);
    };

    function initDualNativeAppShell() {
        if (new URLSearchParams(window.location.search).get('embed') === '1') return;

        const path = window.location.pathname;
        const isToolDetail = path.includes('/tools/') && !path.endsWith('/tools/') && !path.endsWith('/tools/index.html') && !path.includes('/categories/');
        const isToolsHub = path.endsWith('/tools/') || path.endsWith('/tools/index.html');
        const isHome = (path === '/' || (path.endsWith('/index.html') && !isToolsHub));
        const isPwaSource = new URLSearchParams(window.location.search).get('source') === 'pwa';
        const isMobile = window.innerWidth <= 820;

        const savedPref = localStorage.getItem('factictionary_native_ui');
        let appModeActive = false;
        if (isStandalonePWA() || isPwaSource) {
            appModeActive = savedPref !== 'web';
        } else if (isMobile && (isToolDetail || isToolsHub || isHome)) {
            appModeActive = savedPref !== 'web';
        } else {
            appModeActive = savedPref === 'app';
        }

        injectAppShellStyles();
        injectDesktopModeToggleInNavbar(appModeActive);

        if (appModeActive) {
            enableNativeAppMode(isMobile, isToolDetail, isToolsHub, isHome);
        }
    }

    function injectAppShellStyles() {
        if (document.getElementById('factictionary-native-shell-css')) return;
        const style = document.createElement('style');
        style.id = 'factictionary-native-shell-css';
        style.textContent = `
            /* ===== SHARED NATIVE APP MODE RESET ===== */
            body.f-native-app {
                background: #F1F5F9 !important;
                overscroll-behavior-y: none;
            }
            /* Hide bulky web sections in Native App Mode (keeps DOM intact for SEO) */
            body.f-native-app > nav.navbar,
            body.f-native-app > .mobile-menu,
            body.f-native-app > .mobile-menu-backdrop,
            body.f-native-app .tool-header,
            body.f-native-app .privacy-shield-bar,
            body.f-native-app .tool-documentation,
            body.f-native-app .seo-guide-block,
            body.f-native-app article.seo-content,
            body.f-native-app #factictionary-embed-widget,
            body.f-native-app .donation-banner-card,
            body.f-native-app .stats-grid,
            body.f-native-app section.section-lg,
            body.f-native-app .tool-sidebar,
            body.f-native-app .info-grid,
            body.f-native-app footer,
            body.f-native-app footer.footer,
            body.f-native-app .tools-dock-bar {
                display: none !important;
            }
            body.f-native-app.f-show-guide .tool-documentation,
            body.f-native-app.f-show-guide .seo-guide-block,
            body.f-native-app.f-show-guide article.seo-content {
                display: block !important;
                margin: 12px auto !important;
                padding: 16px !important;
                font-size: 0.88rem !important;
            }

            /* ===== COMPACT NATIVE DONATION / UPI SUPPORT STRIP ===== */
            #f-native-support-strip {
                max-width: 980px;
                margin: 10px auto 14px;
                background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%);
                border: 1px solid #334155;
                border-radius: 14px;
                padding: 9px 12px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 8px;
                flex-wrap: wrap;
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
                font-family: 'Inter', -apple-system, sans-serif;
            }
            .f-sup-btn {
                padding: 6px 11px;
                border-radius: 20px;
                font-size: 0.74rem;
                font-weight: 800;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                white-space: nowrap;
            }

            /* ===== MOBILE NATIVE APP MODE (<= 820px) ===== */
            @media (max-width: 820px) {
                body.f-native-app {
                    padding-top: 54px !important;
                    padding-bottom: 68px !important;
                }
                body.f-native-app.f-tool-detail main > .text-center > h1,
                body.f-native-app.f-tool-detail main > .text-center > .lead-text,
                body.f-native-app.f-tool-detail main > div[style*="text-align: center"] > span,
                body.f-native-app.f-tool-detail main > div[style*="text-align: center"] > h1,
                body.f-native-app.f-tool-detail main > div[style*="text-align: center"] > p {
                    display: none !important;
                }
                body.f-native-app.f-tool-detail main.container,
                body.f-native-app.f-tool-detail .tool-workspace,
                body.f-native-app.f-tool-detail .tool-layout {
                    padding: 8px 10px !important;
                    margin: 0 auto !important;
                    max-width: 100% !important;
                    display: block !important;
                }
                body.f-native-app.f-tool-detail .tool-main,
                body.f-native-app.f-tool-detail .pdf-tool-card {
                    padding: 14px !important;
                    border-radius: 16px !important;
                    box-shadow: 0 2px 10px rgba(15,23,42,0.06) !important;
                    margin-bottom: 10px !important;
                }
                body.f-native-app.f-tool-detail .drop-zone,
                body.f-native-app.f-tool-detail .upload-area,
                body.f-native-app.f-tool-detail .file-upload-area,
                body.f-native-app.f-tool-detail .reader-dropzone,
                body.f-native-app.f-tool-detail #dropZone {
                    padding: 16px 12px !important;
                    min-height: auto !important;
                    margin-bottom: 12px !important;
                    border-radius: 14px !important;
                }
                body.f-native-app.f-tool-detail .drop-zone div[style*="font-size"],
                body.f-native-app.f-tool-detail .upload-icon {
                    font-size: 2rem !important;
                    margin-bottom: 4px !important;
                }
                body.f-native-app.f-tool-detail .drop-zone h3,
                body.f-native-app.f-tool-detail .reader-dropzone h2 {
                    font-size: 1rem !important;
                    margin-bottom: 4px !important;
                }
                body.f-native-app.f-tool-detail .drop-zone p,
                body.f-native-app.f-tool-detail .reader-dropzone p {
                    font-size: 0.78rem !important;
                    margin-bottom: 8px !important;
                }
                body.f-native-app.f-tools-hub main > .text-center,
                body.f-native-app.f-tools-hub #ecosystem-infographic-map,
                body.f-native-app.f-tools-hub #tools-catalog-grid,
                body.f-native-app.f-home-hub main > *:not(#f-mobile-app-launcher):not(#f-native-support-strip),
                body.f-native-app.f-home-hub > section,
                body.f-native-app.f-home-hub > .hero {
                    display: none !important;
                }
            }

            /* ===== DESKTOP STUDIO APP MODE (> 820px) ===== */
            @media (min-width: 821px) {
                body.f-native-app {
                    padding-left: 256px !important;
                    padding-top: 52px !important;
                }
                body.f-native-app.f-tool-detail main > .text-center > h1,
                body.f-native-app.f-tool-detail main > .text-center > .lead-text,
                body.f-native-app.f-tool-detail main > div[style*="text-align: center"] > span,
                body.f-native-app.f-tool-detail main > div[style*="text-align: center"] > h1,
                body.f-native-app.f-tool-detail main > div[style*="text-align: center"] > p {
                    display: none !important;
                }
                body.f-native-app main.container,
                body.f-native-app .tool-workspace {
                    padding-top: 18px !important;
                    padding-bottom: 32px !important;
                    max-width: 1180px !important;
                }
                body.f-native-app .tool-layout {
                    grid-template-columns: 1fr !important;
                }
            }

            /* ===== NATIVE TOP BAR ===== */
            #f-native-topbar {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                height: 52px;
                background: #0F172A;
                color: #FFFFFF;
                display: none;
                align-items: center;
                justify-content: space-between;
                padding: 0 10px;
                z-index: 9998;
                border-bottom: 1px solid #1E293B;
                box-shadow: 0 2px 12px rgba(0,0,0,0.22);
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }
            @media (min-width: 821px) {
                body.f-native-app #f-native-topbar {
                    left: 256px;
                }
            }
            body.f-native-app #f-native-topbar {
                display: flex;
            }
            .f-top-btn {
                background: #1E293B;
                color: #F8FAFC;
                border: 1px solid #334155;
                border-radius: 10px;
                padding: 6px 9px;
                font-size: 0.75rem;
                font-weight: 700;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                text-decoration: none;
                white-space: nowrap;
            }

            /* ===== MOBILE BOTTOM TAB BAR ===== */
            #f-mobile-bottomnav {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                height: 62px;
                padding-bottom: env(safe-area-inset-bottom, 0px);
                background: #0F172A;
                border-top: 1px solid #1E293B;
                display: none;
                grid-template-columns: repeat(5, 1fr);
                z-index: 9998;
                box-shadow: 0 -4px 16px rgba(0,0,0,0.25);
                font-family: 'Inter', -apple-system, sans-serif;
            }
            @media (max-width: 820px) {
                body.f-native-app #f-mobile-bottomnav {
                    display: grid;
                }
            }
            .f-bnav-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 2px;
                color: #94A3B8;
                text-decoration: none;
                font-size: 0.67rem;
                font-weight: 700;
                background: none;
                border: none;
                cursor: pointer;
                padding: 4px 2px;
            }
            .f-bnav-item.active {
                color: #38BDF8;
            }
            .f-bnav-icon {
                font-size: 1.18rem;
                line-height: 1.1;
            }

            /* ===== MOBILE SUPER-APP LAUNCHER GRID ===== */
            #f-mobile-app-launcher {
                display: none;
                padding: 6px 4px 12px;
                font-family: 'Inter', -apple-system, sans-serif;
            }
            @media (max-width: 820px) {
                body.f-native-app.f-tools-hub #f-mobile-app-launcher,
                body.f-native-app.f-home-hub #f-mobile-app-launcher {
                    display: block;
                }
            }
            .f-app-cat-pills {
                display: flex;
                gap: 6px;
                overflow-x: auto;
                padding: 4px 2px 10px;
                scrollbar-width: none;
            }
            .f-app-cat-pills::-webkit-scrollbar { display: none; }
            .f-app-cat-pill {
                background: #FFFFFF;
                color: #334155;
                border: 1px solid #CBD5E1;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 0.76rem;
                font-weight: 800;
                white-space: nowrap;
                cursor: pointer;
            }
            .f-app-cat-pill.active {
                background: #0F172A;
                color: #FFFFFF;
                border-color: #0F172A;
            }
            .f-suite-box {
                background: #FFFFFF;
                border: 1px solid #E2E8F0;
                border-radius: 16px;
                padding: 12px 10px;
                margin-bottom: 12px;
                box-shadow: 0 2px 6px rgba(15,23,42,0.04);
            }
            .f-suite-hdr {
                display: flex;
                align-items: center;
                justify-content: space-between;
                margin-bottom: 10px;
                padding: 0 4px;
            }
            .f-suite-title {
                font-size: 0.82rem;
                font-weight: 900;
                color: #0F172A;
                text-transform: uppercase;
                letter-spacing: 0.3px;
            }
            .f-icon-grid {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 8px 6px;
            }
            .f-app-tile {
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                text-decoration: none;
                color: #1E293B;
                padding: 6px 2px;
                border-radius: 12px;
                transition: transform 0.12s ease, background 0.12s ease;
            }
            .f-app-tile:active {
                transform: scale(0.94);
                background: #F1F5F9;
            }
            .f-app-squircle {
                width: 46px;
                height: 46px;
                border-radius: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.4rem;
                margin-bottom: 5px;
                box-shadow: 0 2px 6px rgba(0,0,0,0.06);
                border: 1px solid rgba(0,0,0,0.05);
            }
            .f-app-label {
                font-size: 0.69rem;
                font-weight: 700;
                line-height: 1.15;
                max-width: 72px;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
            }

            
/* ===== MOBILE RESULT ROW & DOWNLOAD BUTTON OVERFLOW FIX ===== */
@media (max-width: 820px) {
    .tool-workspace, .tool-output, .file-list, .result-list, #resultList, #fileList, .compression-results {
        max-width: 100% !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
    }
    .tool-output {
        padding: 14px !important;
    }
    .result-item, .file-item, .metadata-item, .frame-info {
        display: flex !important;
        flex-wrap: wrap !important;
        align-items: center !important;
        justify-content: space-between !important;
        gap: 8px !important;
        max-width: 100% !important;
        box-sizing: border-box !important;
    }
    .result-item > div, .file-item > div, .file-name, .result-item strong {
        min-width: 0 !important;
        max-width: 100% !important;
        overflow-wrap: anywhere !important;
        word-break: break-word !important;
        flex: 1 1 180px !important;
    }
    .result-item button, .result-item a.btn, .result-item .btn {
        width: 100% !important;
        margin-top: 4px !important;
        padding: 10px 14px !important;
        font-size: 0.85rem !important;
        font-weight: 700 !important;
        border-radius: 8px !important;
        text-align: center !important;
        justify-content: center !important;
        box-sizing: border-box !important;
    }
    .tool-actions, .action-buttons, .output-actions, .input-actions {
        display: flex !important;
        flex-wrap: wrap !important;
        gap: 8px !important;
        width: 100% !important;
        box-sizing: border-box !important;
    }
    .tool-actions .btn-tool, .tool-actions button, .tool-actions a.btn {
        flex: 1 1 calc(50% - 8px) !important;
        min-width: 120px !important;
        max-width: 100% !important;
        padding: 10px 12px !important;
        font-size: 0.88rem !important;
        box-sizing: border-box !important;
        text-align: center !important;
        justify-content: center !important;
    }
}

            /* ===== DESKTOP STUDIO SIDEBAR ===== */
            #f-desktop-sidebar {
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                width: 256px;
                background: #0F172A;
                color: #F8FAFC;
                border-right: 1px solid #1E293B;
                display: none;
                flex-direction: column;
                z-index: 9999;
                font-family: 'Inter', -apple-system, sans-serif;
            }
            @media (min-width: 821px) {
                body.f-native-app #f-desktop-sidebar {
                    display: flex;
                }
            }
            .f-side-list {
                flex: 1;
                overflow-y: auto;
                padding: 8px 10px 20px;
            }
            .f-side-cat {
                font-size: 0.68rem;
                font-weight: 900;
                color: #64748B;
                text-transform: uppercase;
                letter-spacing: 0.6px;
                margin: 12px 6px 6px;
            }
            .f-side-link {
                display: flex;
                align-items: center;
                gap: 9px;
                padding: 7px 10px;
                border-radius: 9px;
                color: #CBD5E1;
                text-decoration: none;
                font-size: 0.8rem;
                font-weight: 600;
                margin-bottom: 2px;
                transition: background 0.12s;
            }
            .f-side-link:hover {
                background: #1E293B;
                color: #FFFFFF;
            }
            .f-side-link.active {
                background: #2563EB;
                color: #FFFFFF;
                font-weight: 800;
            }
        `;
        document.head.appendChild(style);
    }

    function injectDesktopModeToggleInNavbar(appModeActive) {
        const navContainer = document.querySelector('.navbar .nav-container');
        if (!navContainer || document.getElementById('f-nav-appmode-btn')) return;

        const btn = document.createElement('button');
        btn.id = 'f-nav-appmode-btn';
        btn.type = 'button';
        btn.style.cssText = 'background:linear-gradient(135deg,#0F172A,#1E3A8A);color:#FFFFFF;border:1px solid #3B82F6;padding:6px 13px;border-radius:20px;font-size:0.78rem;font-weight:800;cursor:pointer;display:inline-flex;align-items:center;gap:6px;margin-left:10px;box-shadow:0 2px 8px rgba(0,102,255,0.2);';
        btn.innerHTML = '<span>📱🖥️</span><span>Switch to App UI</span>';
        btn.onclick = function() {
            localStorage.setItem('factictionary_native_ui', 'app');
            window.location.reload();
        };
        navContainer.appendChild(btn);
    }

    function enableNativeAppMode(isMobile, isToolDetail, isToolsHub, isHome) {
        document.body.classList.add('f-native-app');
        if (isToolDetail) document.body.classList.add('f-tool-detail');
        if (isToolsHub) document.body.classList.add('f-tools-hub');
        if (isHome) document.body.classList.add('f-home-hub');

        let rawTitle = '';
        const h1 = document.querySelector('main h1, .tool-title');
        if (h1 && isToolDetail) rawTitle = h1.textContent.trim();
        else rawTitle = 'Factictionary — 85+ Tools';

        // 1. Top Native App Bar (includes compact ☕ Support pill + 🔍 Search Sheet)
        const topbar = document.createElement('header');
        topbar.id = 'f-native-topbar';
        topbar.innerHTML = `
            <div style="display:flex;align-items:center;gap:8px;min-width:0;flex:1;">
                ${isToolDetail
                    ? '<a href="/tools/?app=1" class="f-top-btn" title="Back to App Home" style="padding:5px 9px;">← All</a>'
                    : '<a href="/tools/?app=1" style="display:inline-flex;align-items:center;gap:6px;text-decoration:none;color:white;"><img src="/assets/images/logo-header.png" alt="" style="width:26px;height:26px;border-radius:7px;"></a>'
                }
                <div style="font-size:0.88rem;font-weight:800;color:#FFFFFF;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
                    ${rawTitle}
                </div>
            </div>
            <div style="display:flex;align-items:center;gap:5px;flex-shrink:0;">
                <a href="https://razorpay.me/@factictionary5740" target="_blank" rel="noopener" class="f-top-btn" style="background:#FEF3C7;color:#92400E;border-color:#F59E0B;" title="Support via UPI / GPay / Coffee">☕ Tip</a>
                ${isToolDetail ? '<button type="button" class="f-top-btn" onclick="document.body.classList.toggle(\'f-show-guide\')">📖 Guide</button>' : ''}
                <button type="button" class="f-top-btn" onclick="openNativeSearchSheet()" title="Search 85+ Tools">🔍</button>
                <button type="button" class="f-top-btn" id="f-exit-appmode" title="Switch to Web View" style="background:#1E3A8A;border-color:#3B82F6;">🌐 Web</button>
            </div>
        `;
        document.body.appendChild(topbar);

        document.getElementById('f-exit-appmode').addEventListener('click', function() {
            localStorage.setItem('factictionary_native_ui', 'web');
            document.body.classList.remove('f-native-app', 'f-tool-detail', 'f-tools-hub', 'f-home-hub', 'f-show-guide');
            topbar.remove();
            ['f-mobile-bottomnav', 'f-desktop-sidebar', 'f-mobile-app-launcher', 'f-native-support-strip'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.remove();
            });
        });

        // 2. Mobile Super-App Icon Launcher on /tools/ and /
        const mainEl = document.querySelector('main') || document.body;
        if ((isToolsHub || isHome) && mainEl) {
            const launcher = document.createElement('div');
            launcher.id = 'f-mobile-app-launcher';

            const pillsHtml = '<button class="f-app-cat-pill active" data-suite="all">⚡ All (85+)</button>' +
                NATIVE_APP_SUITES.map(s => `<button class="f-app-cat-pill" data-suite="${s.id}">${s.label}</button>`).join('');

            const suitesHtml = NATIVE_APP_SUITES.map(s => {
                const tiles = s.tools.map(t => `
                    <a href="${t.url}" class="f-app-tile" data-tool-name="${(t.name + ' ' + t.short).toLowerCase()}">
                        <div class="f-app-squircle" style="background:${s.bg};color:${s.color};">${t.icon}</div>
                        <span class="f-app-label">${t.short}</span>
                    </a>
                `).join('');
                return `
                    <div class="f-suite-box" data-suite-box="${s.id}">
                        <div class="f-suite-hdr">
                            <span class="f-suite-title" style="color:${s.color};">${s.title}</span>
                            <span style="font-size:0.68rem;font-weight:800;color:#64748B;">${s.tools.length} apps</span>
                        </div>
                        <div class="f-icon-grid">${tiles}</div>
                    </div>
                `;
            }).join('');

            launcher.innerHTML = `
                <div style="margin-bottom:8px;">
                    <input type="search" id="f-mobile-quick-filter" placeholder="🔍 Search 85+ tools (e.g. epub, pdf, trim, receipt)..." style="width:100%;padding:10px 14px;border-radius:14px;border:1.5px solid #CBD5E1;background:#FFFFFF;font-size:0.85rem;font-weight:600;outline:none;">
                </div>
                <div class="f-app-cat-pills" id="f-mobile-suite-pills">${pillsHtml}</div>
                <div id="f-mobile-suites-container">${suitesHtml}</div>
            `;
            mainEl.insertBefore(launcher, mainEl.firstChild);

            launcher.querySelectorAll('.f-app-cat-pill').forEach(btn => {
                btn.addEventListener('click', function() {
                    launcher.querySelectorAll('.f-app-cat-pill').forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const suiteId = this.getAttribute('data-suite');
                    launcher.querySelectorAll('.f-suite-box').forEach(box => {
                        box.style.display = (suiteId === 'all' || box.getAttribute('data-suite-box') === suiteId) ? 'block' : 'none';
                    });
                });
            });

            const initialSuite = new URLSearchParams(window.location.search).get('suite');
            if (initialSuite) {
                const targetBtn = launcher.querySelector('.f-app-cat-pill[data-suite="' + initialSuite + '"]');
                if (targetBtn) targetBtn.click();
            }

            const qInput = launcher.querySelector('#f-mobile-quick-filter');
            if (qInput) {
                qInput.addEventListener('input', function() {
                    const q = this.value.trim().toLowerCase();
                    launcher.querySelectorAll('.f-suite-box').forEach(box => {
                        let visibleCount = 0;
                        box.querySelectorAll('.f-app-tile').forEach(tile => {
                            const match = !q || tile.getAttribute('data-tool-name').includes(q);
                            tile.style.display = match ? 'flex' : 'none';
                            if (match) visibleCount++;
                        });
                        box.style.display = visibleCount > 0 ? 'block' : 'none';
                    });
                });
            }
        }

        // 3. Compact Native Support / UPI & PayPal Strip (Replaces giant 300px web banner with a sleek 1-line native card!)
        if (mainEl && !document.getElementById('f-native-support-strip')) {
            const supStrip = document.createElement('div');
            supStrip.id = 'f-native-support-strip';
            supStrip.innerHTML = `
                <div style="display:flex;align-items:center;gap:8px;min-width:0;">
                    <span style="font-size:1.15rem;">☕</span>
                    <div style="line-height:1.25;">
                        <div style="font-size:0.78rem;font-weight:800;color:#FFFFFF;">100% Free, Private &amp; Ad-Free</div>
                        <div style="font-size:0.68rem;color:#94A3B8;">Support Factictionary with a small coffee!</div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    <a href="https://razorpay.me/@factictionary5740" target="_blank" rel="noopener" class="f-sup-btn" style="background:#F59E0B;color:#0F172A;">⚡ UPI / GPay</a>
                    <a href="https://paypal.me/mgarg1102" target="_blank" rel="noopener" class="f-sup-btn" style="background:#2563EB;color:#FFFFFF;">💳 PayPal</a>
                </div>
            `;
            mainEl.appendChild(supStrip);
        }

        // 4. Mobile Native Bottom Navigation Bar (All 5 tabs stay inside the Native App UI!)
        const curSuite = new URLSearchParams(window.location.search).get('suite') || '';
        const bnav = document.createElement('nav');
        bnav.id = 'f-mobile-bottomnav';
        bnav.innerHTML = `
            <a href="/tools/?app=1" class="f-bnav-item ${(isToolsHub && !curSuite) ? 'active' : ''}" data-suite-nav="all">
                <span class="f-bnav-icon">⚡</span>
                <span>All 85+</span>
            </a>
            <a href="/tools/?app=1&suite=readers" class="f-bnav-item ${curSuite === 'readers' || window.location.pathname.includes('epub') || window.location.pathname.includes('docx') || window.location.pathname.includes('excel') ? 'active' : ''}" data-suite-nav="readers">
                <span class="f-bnav-icon">📚</span>
                <span>Readers</span>
            </a>
            <a href="/tools/?app=1&suite=pdf" class="f-bnav-item ${curSuite === 'pdf' || window.location.pathname.includes('pdf_') ? 'active' : ''}" data-suite-nav="pdf">
                <span class="f-bnav-icon">📄</span>
                <span>PDF Suite</span>
            </a>
            <a href="/tools/?app=1&suite=video" class="f-bnav-item ${curSuite === 'video' || window.location.pathname.includes('video_') || window.location.pathname.includes('teleprompter') ? 'active' : ''}" data-suite-nav="video">
                <span class="f-bnav-icon">🎬</span>
                <span>Media</span>
            </a>
            <button type="button" class="f-bnav-item" onclick="openNativeSearchSheet()">
                <span class="f-bnav-icon">🔍</span>
                <span>Search</span>
            </button>
        `;
        document.body.appendChild(bnav);

        // If already on the launcher page, make bottom nav tabs switch suites immediately without page reload!
        if (isToolsHub || isHome) {
            bnav.querySelectorAll('a[data-suite-nav]').forEach(a => {
                a.addEventListener('click', function(e) {
                    const targetSuite = this.getAttribute('data-suite-nav');
                    const pillBtn = document.querySelector('.f-app-cat-pill[data-suite="' + targetSuite + '"]');
                    if (pillBtn) {
                        e.preventDefault();
                        pillBtn.click();
                        bnav.querySelectorAll('.f-bnav-item').forEach(x => x.classList.remove('active'));
                        this.classList.add('active');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                });
            });
        }

        // 5. Desktop Studio Left Sidebar (> 820px)
        const sidebar = document.createElement('aside');
        sidebar.id = 'f-desktop-sidebar';
        const curUrl = window.location.pathname;
        const sideGroupsHtml = NATIVE_APP_SUITES.map(s => {
            const links = s.tools.map(t => `
                <a href="${t.url}" class="f-side-link ${curUrl === t.url ? 'active' : ''}" data-side-name="${(t.name + ' ' + t.short).toLowerCase()}">
                    <span>${t.icon}</span>
                    <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${t.name}</span>
                </a>
            `).join('');
            return `
                <div class="f-side-group">
                    <div class="f-side-cat">${s.title}</div>
                    ${links}
                </div>
            `;
        }).join('');

        sidebar.innerHTML = `
            <div style="padding:12px 14px;border-bottom:1px solid #1E293B;display:flex;align-items:center;justify-content:space-between;">
                <a href="/tools/?app=1" style="display:flex;align-items:center;gap:9px;text-decoration:none;color:white;font-weight:900;font-size:0.95rem;">
                    <img src="/assets/images/logo-header.png" alt="" style="width:28px;height:28px;border-radius:7px;">
                    <span>Factictionary Studio</span>
                </a>
                <span style="background:#1E3A8A;color:#93C5FD;font-size:0.65rem;font-weight:800;padding:2px 7px;border-radius:8px;">85+</span>
            </div>
            <div style="padding:10px 12px 4px;">
                <input type="search" id="f-desktop-side-filter" placeholder="🔍 Filter 85+ tools..." style="width:100%;padding:7px 10px;border-radius:8px;border:1px solid #334155;background:#1E293B;color:#F8FAFC;font-size:0.78rem;outline:none;">
            </div>
            <div class="f-side-list" id="f-desktop-side-list">
                <a href="/tools/?app=1" class="f-side-link ${isToolsHub ? 'active' : ''}" style="margin-bottom:6px;border:1px solid #334155;">
                    <span>☁️</span><span>All 85+ Tools &amp; Word Cloud</span>
                </a>
                ${sideGroupsHtml}
            </div>
        `;
        document.body.appendChild(sidebar);

        const sideFilter = sidebar.querySelector('#f-desktop-side-filter');
        if (sideFilter) {
            sideFilter.addEventListener('input', function() {
                const q = this.value.trim().toLowerCase();
                sidebar.querySelectorAll('.f-side-group').forEach(grp => {
                    let count = 0;
                    grp.querySelectorAll('.f-side-link').forEach(lnk => {
                        const match = !q || lnk.getAttribute('data-side-name').includes(q);
                        lnk.style.display = match ? 'flex' : 'none';
                        if (match) count++;
                    });
                    grp.style.display = count > 0 ? 'block' : 'none';
                });
            });
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDualNativeAppShell);
    } else {
        initDualNativeAppShell();
    }
})();
// ===== END DUAL NATIVE APP SHELL =====
